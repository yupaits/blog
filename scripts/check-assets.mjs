import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'docs', 'public')
const docsDir = path.join(root, 'docs')
const extensions = new Set(['.png', '.webp', '.jpg', '.jpeg', '.gif', '.svg', '.avif'])
const totalBudgetMB = Number(process.env.ASSET_BUDGET_MB || 90)
const singleWarnKB = Number(process.env.ASSET_SINGLE_KB || 512)
const asJson = process.argv.includes('--json')

const collect = (dir, matcher, out = []) => {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) collect(full, matcher, out)
        else if (matcher(entry.name)) out.push(full)
    }
    return out
}

const images = collect(publicDir, name => extensions.has(path.extname(name).toLowerCase()))
    .map(file => ({file: path.relative(root, file).replace(/\\/g, '/'), size: fs.statSync(file).size}))
const byExt = {}
for (const image of images) {
    const ext = path.extname(image.file).toLowerCase()
    const stat = byExt[ext] ||= {count: 0, bytes: 0}
    stat.count += 1
    stat.bytes += image.size
}
const totalMB = images.reduce((sum, image) => sum + image.size, 0) / 1048576
const large = images.filter(image => image.size > singleWarnKB * 1024)
    .sort((a, b) => b.size - a.size)
const convertible = images.filter(image => /\.png$/i.test(image.file) && image.size > 200 * 1024)

// 统一编码规范：统计 %20 与字面空格两种写法的引用数量
const markdown = collect(docsDir, name => name.endsWith('.md'))
const encoded = {percent20: 0, literalSpace: 0}
for (const file of markdown) {
    const text = fs.readFileSync(file, 'utf-8')
    for (const match of text.matchAll(/!\[[^\]]*\]\(([^)\n]+)\)/g)) {
        const ref = match[1].trim()
        if (ref.includes('%20')) encoded.percent20 += 1
        if (/^[^<\s]*\s+[^>]*$/.test(ref) && !ref.startsWith('<')) encoded.literalSpace += 1
    }
}

const report = {
    totalMB: Number(totalMB.toFixed(1)),
    budgetMB: totalBudgetMB,
    count: images.length,
    byExt: Object.fromEntries(Object.entries(byExt).map(([ext, stat]) => [ext, {
        count: stat.count, mb: Number((stat.bytes / 1048576).toFixed(1))
    }])),
    largeCount: large.length,
    largeTop: large.slice(0, 10).map(image => ({file: image.file, kb: Math.round(image.size / 1024)})),
    webpCandidates: convertible.length,
    encoded
}

if (asJson) {
    console.log(JSON.stringify(report, null, 2))
} else {
    console.log(`图片资产：${report.count} 个，共 ${report.totalMB} MB（预算 ${totalBudgetMB} MB）`)
    for (const [ext, stat] of Object.entries(report.byExt)) {
        console.log(`  ${ext.padEnd(6)} ${String(stat.count).padStart(4)} 个  ${stat.mb} MB`)
    }
    console.log(`超过 ${singleWarnKB}KB 的图片 ${large.length} 个；建议转 WebP/AVIF 的 PNG ${convertible.length} 个`)
    large.slice(0, 5).forEach(image => console.log(`  大图 ${Math.round(image.size / 1024)} KB  ${image.file}`))
    console.log(`路径编码：%20 写法 ${encoded.percent20} 处，字面空格写法 ${encoded.literalSpace} 处（以 %20 为统一规范）`)
}
if (totalMB > totalBudgetMB) {
    console.error(`资产总体积超出预算 ${totalBudgetMB} MB`)
    process.exit(1)
}
