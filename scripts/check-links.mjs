import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = path.join(root, 'docs')
const publicDir = path.join(docsDir, 'public')
const mdFiles = []

const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(full)
        else if (entry.name.endsWith('.md')) mdFiles.push(full)
    }
}
walk(docsDir)

const missing = []
const encoded = new Set()
let references = 0

for (const file of mdFiles) {
    const text = fs.readFileSync(file, 'utf-8')
    for (const match of text.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) {
        const raw = match[1]
        if (/^(https?:\/\/|data:)/.test(raw)) continue
        references += 1
        const ref = decodeURIComponent(raw.split('#')[0].split('?')[0])
        const target = raw.startsWith('/')
            ? path.join(publicDir, ref.replace(/^\//, ''))
            : path.resolve(path.dirname(file), ref)
        if (fs.existsSync(target)) {
            if (raw.includes('%20')) encoded.add(path.relative(root, file))
        } else {
            missing.push(`${path.relative(root, file)} -> ${raw}`)
        }
    }
}

console.log(`检查 ${mdFiles.length} 篇文档、${references} 处本地图片引用`)
console.log(`缺失 ${missing.length} 处，使用 %20 规范编码 ${encoded.size} 篇`)
missing.slice(0, 20).forEach(item => console.log(`  MISS ${item}`))
if (missing.length) process.exit(1)
