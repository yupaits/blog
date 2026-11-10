import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

// 构建期图片优化：原图保持不动，按需生成压缩版到 public/images-opt，
// 并输出清单供 markdown 渲染时替换 src 与补 width/height（修 CLS）
const ROOT = path.resolve('docs')
const SRC_DIR = path.join(ROOT, 'public', 'images')
const OUT_DIR = path.join(ROOT, 'public', 'images-opt')
const MANIFEST = path.join(ROOT, '.vitepress', 'cache', 'image-manifest.json')
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

const main = async () => {
    await fs.mkdir(OUT_DIR, {recursive: true})
    const files = await walk(SRC_DIR)
    const manifest = {}
    const used = new Set()
    let sourceBytes = 0
    let outputBytes = 0
    let converted = 0
    let failed = 0

    for (const rel of files) {
        const srcFile = path.join(SRC_DIR, rel)
        const srcStat = await statFile(srcFile)
        if (!srcStat) continue
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
        const url = key(rel)
        sourceBytes += srcStat.size

        if (!needResize && !needCompress) {
            manifest[url] = {src: url, width, height, bytes: srcStat.size}
            outputBytes += srcStat.size
            continue
        }

        const outRel = rel.replace(/\.(png|jpe?g|webp)$/i, '.webp')
        const outFile = path.join(OUT_DIR, outRel)
        used.add(outFile)
        const outStat = await statFile(outFile)
        let outWidth = needResize ? MAX_WIDTH : width
        // 原图较小但体积大时只重编码，不放大小图
        let outHeight = width ? Math.round(height * outWidth / width) : height

        const fresh = outStat && outStat.mtimeMs >= srcStat.mtimeMs
        if (!fresh) {
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
            } catch (e) {
                failed++
                manifest[url] = {src: url, width, height, bytes: srcStat.size}
                outputBytes += srcStat.size
                continue
            }
        } else {
            const outMeta = await sharp(outFile).metadata()
            outWidth = outMeta.width
            outHeight = outMeta.height
        }

        const finalStat = await statFile(outFile)
        if (!finalStat) {
            manifest[url] = {src: url, width, height, bytes: srcStat.size}
            outputBytes += srcStat.size
            continue
        }
        // 压缩版反而更大时保留原图（例如已高度优化的 webp）
        if (finalStat.size >= srcStat.size * 0.95) {
            await fs.unlink(outFile).catch(() => {
            })
            used.delete(outFile)
            manifest[url] = {src: url, width, height, bytes: srcStat.size}
            outputBytes += srcStat.size
            continue
        }
        manifest[url] = {
            src: '/images-opt/' + outRel.split(path.sep).join('/'),
            width: outWidth,
            height: outHeight,
            bytes: finalStat.size
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
            } else if (!used.has(file)) {
                await fs.unlink(file).catch(() => {
                })
            }
        }
    }
    await prune(OUT_DIR)

    await fs.mkdir(path.dirname(MANIFEST), {recursive: true})
    await fs.writeFile(MANIFEST, JSON.stringify(manifest))

    const mb = (n) => (n / 1024 / 1024).toFixed(1)
    console.log(`[images] ${files.length} 张，转码 ${converted} 张，失败 ${failed} 张`)
    console.log(`[images] 源图 ${mb(sourceBytes)}MB → 页面实际使用 ${mb(outputBytes)}MB`)
}

main().catch((e) => {
    console.error('[images] 优化失败，回退原图：', e)
    process.exitCode = 0
})
