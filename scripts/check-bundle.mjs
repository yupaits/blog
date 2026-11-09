import fs from 'node:fs'
import zlib from 'node:zlib'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'docs', '.vitepress', 'dist')
if (!fs.existsSync(dist)) {
    console.error('未找到构建产物，请先执行 pnpm run docs:build')
    process.exit(1)
}
const walk = (dir, out = []) => {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(full, out)
        else out.push(full)
    }
    return out
}
const files = walk(dist)
const gzipKB = file => zlib.gzipSync(fs.readFileSync(file), {level: 9}).length / 1024
const kb = file => fs.statSync(file).size / 1024
const pick = pattern => files.find(file => pattern.test(path.basename(file)))

const css = pick(/^style\..*\.css$/)
const search = pick(/^@localSearchIndexroot\..*\.js$/)
const htmls = files.filter(file => file.endsWith('.html'))
const pageChunks = files.filter(file => file.endsWith('.js') && path.basename(file).includes('.md.'))
const totalMB = files.reduce((sum, file) => sum + fs.statSync(file).size, 0) / 1048576

const metrics = [
    {name: 'CSS gzip', value: css ? gzipKB(css) : 0, budget: Number(process.env.BUDGET_CSS_KB || 40)},
    {name: '搜索索引 gzip', value: search ? gzipKB(search) : 0, budget: Number(process.env.BUDGET_SEARCH_KB || 1200)},
    {name: '最大页面 HTML', value: htmls.length ? Math.max(...htmls.map(kb)) : 0, budget: Number(process.env.BUDGET_HTML_KB || 1100)},
    {name: '最大页面 chunk', value: pageChunks.length ? Math.max(...pageChunks.map(kb)) : 0, budget: Number(process.env.BUDGET_CHUNK_KB || 1000)},
    {name: 'dist 总体积 MB', value: totalMB, budget: Number(process.env.BUDGET_DIST_MB || 220)}
]
let failed = false
console.log(`检查 ${files.length} 个产物文件（页面 ${htmls.length} 个，页面 chunk ${pageChunks.length} 个）`)
for (const item of metrics) {
    const ok = item.value <= item.budget
    failed ||= !ok
    console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${item.name.padEnd(18)} ${item.value.toFixed(1).padStart(9)} / ${item.budget}`)
}
if (failed) process.exit(1)
