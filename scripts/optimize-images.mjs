import fs from 'node:fs/promises'
import path from 'node:path'
import {createHash} from 'node:crypto'
import sharp from 'sharp'

// 构建期图片优化：原图保持不动，按需生成压缩版到 public/images-opt，
// 并输出清单供 markdown 渲染时替换 src 与补 width/height（修 CLS）
const ROOT = path.resolve('docs')
const SRC_DIR = path.join(ROOT, 'public', 'images')
const OUT_DIR = path.join(ROOT, 'public', 'images-opt')
const MANIFEST = path.join(ROOT, 'public', 'images-opt', 'image-manifest.json')
const MAX_WIDTH = 1400        // 超过该宽度等比缩小，兼顾正文最大显示宽度与高分屏
const MIN_BYTES = 200 * 1024  // 小于该体积且不超宽的原图直接复用，避免无意义转码
const QUALITY = 78
const EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'])
// 只对静态位图做转码；GIF/AVIF 仅记录宽高，避免破坏动图或引入二次编码
const OPTIMIZABLE = new Set(['.png', '.jpg', '.jpeg', '.webp'])

const walk = async (dir, base = '') => {
    const entries = await fs.readdir(dir, {withFileTypes: true})
    const files = []
    for (const entry of entries) {
        const rel = path.join(base, entry.name)
        if (entry.isDirectory()) {
            files.push(...await walk(path.join(dir, entry.name), rel))
        } else if (EXTS.has(path.extname(entry.name).toLowerCase())) {
            files.push(rel)
        }
    }
    return files
}

const statFile = async (file) => {
    try {
        return await fs.stat(file)
    } catch {
        return null
    }
}

const key = (rel) => '/images/' + rel.split(path.sep).join('/')

// 内容指纹：git clone 会把所有文件 mtime 重置为检出时间，
// 用 mtime 判新鲜度在 CI 上永远不命中，因此改用「体积 + 内容哈希」
const hashFile = async (file) => createHash('sha1').update(await fs.readFile(file)).digest('hex')

const readManifest = async (file) => {
    try {
        return JSON.parse(await fs.readFile(file, 'utf8'))
    } catch {
        return {}
    }
}

// 回退原图时的清单条目；noGain 表示已判定压缩无收益，下次直接跳过重转
const originalEntry = (url, width, height, srcStat, fingerprint, noGain = false) => {
    const entry = {src: url, width, height, bytes: srcStat.size, ...fingerprint}
    if (noGain) entry.noGain = true
    return entry
}

const main = async () => {
    await fs.mkdir(OUT_DIR, {recursive: true})
    const files = await walk(SRC_DIR)
    const prevManifest = await readManifest(MANIFEST)
    const manifest = {}
    const used = new Set()
    let sourceBytes = 0
    let outputBytes = 0
    let converted = 0
    let noGain = 0
    let reused = 0
    let failed = 0

    for (const rel of files) {
        const srcFile = path.join(SRC_DIR, rel)
        const srcStat = await statFile(srcFile)
        if (!srcStat) continue
        const url = key(rel)
        sourceBytes += srcStat.size
        const fingerprint = {srcBytes: srcStat.size, srcHash: await hashFile(srcFile)}
        const prev = prevManifest[url]

        // 源图内容未变：沿用上次判定与产物，连 sharp 元数据都不用读
        if (prev && prev.srcBytes === fingerprint.srcBytes && prev.srcHash === fingerprint.srcHash) {
            if (prev.noGain) {
                manifest[url] = prev
                outputBytes += srcStat.size
                noGain++
                continue
            }
            if (prev.src?.startsWith('/images-opt/')) {
                const prevOut = path.join(OUT_DIR, prev.src.slice('/images-opt/'.length))
                if (await statFile(prevOut)) {
                    used.add(prevOut)
                    manifest[url] = prev
                    outputBytes += prev.bytes
                    reused++
                    continue
                }
            }
        }

        let meta
        try {
            meta = await sharp(srcFile).metadata()
        } catch {
            failed++
            continue
        }
        const {width = 0, height = 0} = meta
        const ext = path.extname(rel).toLowerCase()
        const canOptimize = OPTIMIZABLE.has(ext)
        const needResize = canOptimize && width > MAX_WIDTH
        const needCompress = canOptimize && srcStat.size > MIN_BYTES

        if (!needResize && !needCompress) {
            manifest[url] = originalEntry(url, width, height, srcStat, fingerprint)
            outputBytes += srcStat.size
            continue
        }

        const outRel = rel.replace(/\.(png|jpe?g|webp)$/i, '.webp')
        const outFile = path.join(OUT_DIR, outRel)
        used.add(outFile)
        let outWidth = needResize ? MAX_WIDTH : width
        // 原图较小但体积大时只重编码，不放大小图
        let outHeight = width ? Math.round(height * outWidth / width) : height

        // 走到这里说明源图内容变了或产物缺失，必须重新转码
        try {
            const buffer = await sharp(srcFile)
                .resize({width: needResize ? MAX_WIDTH : undefined, withoutEnlargement: true})
                .webp({quality: QUALITY, effort: 4})
                .toBuffer()
            await fs.mkdir(path.dirname(outFile), {recursive: true})
            await fs.writeFile(outFile, buffer)
            const outMeta = await sharp(buffer).metadata()
            outWidth = outMeta.width
            outHeight = outMeta.height
            converted++
        } catch {
            failed++
            manifest[url] = originalEntry(url, width, height, srcStat, fingerprint)
            outputBytes += srcStat.size
            continue
        }

        const finalStat = await statFile(outFile)
        if (!finalStat) {
            manifest[url] = originalEntry(url, width, height, srcStat, fingerprint)
            outputBytes += srcStat.size
            continue
        }
        // 压缩版反而更大时保留原图（例如已高度优化的 webp），并记录判定结果避免下次重转
        if (finalStat.size >= srcStat.size * 0.95) {
            await fs.unlink(outFile).catch(() => {
            })
            used.delete(outFile)
            manifest[url] = originalEntry(url, width, height, srcStat, fingerprint, true)
            outputBytes += srcStat.size
            continue
        }
        manifest[url] = {
            src: '/images-opt/' + outRel.split(path.sep).join('/'),
            width: outWidth,
            height: outHeight,
            bytes: finalStat.size,
            ...fingerprint
        }
        outputBytes += finalStat.size
    }

    // 清理源图已删除或已判定不需要压缩的旧产物
    const prune = async (dir) => {
        const entries = await fs.readdir(dir, {withFileTypes: true}).catch(() => [])
        for (const entry of entries) {
            const file = path.join(dir, entry.name)
            if (entry.isDirectory()) {
                await prune(file)
                const left = await fs.readdir(file).catch(() => [])
                if (!left.length) await fs.rmdir(file).catch(() => {
                })
            } else if (entry.name !== 'image-manifest.json' && !used.has(file)) {
                await fs.unlink(file).catch(() => {
                })
            }
        }
    }
    await prune(OUT_DIR)

    await fs.mkdir(path.dirname(MANIFEST), {recursive: true})
    await fs.writeFile(MANIFEST, JSON.stringify(manifest))

    const mb = (n) => (n / 1024 / 1024).toFixed(1)
    console.log(`[images] ${files.length} 张，转码 ${converted} 张，跳过 ${noGain + reused} 张（无收益 ${noGain} / 复用 ${reused}），失败 ${failed} 张`)
    console.log(`[images] 源图 ${mb(sourceBytes)}MB → 页面实际使用 ${mb(outputBytes)}MB`)
}

main().catch((e) => {
    console.error('[images] 优化失败，回退原图：', e)
    process.exitCode = 0
})
