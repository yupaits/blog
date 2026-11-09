import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

// 扫描全站外链，生成静态图标映射。默认不联网；加 --fetch 时尝试把 favicon 缓存到本地。
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = path.join(root, 'docs')
const sitesDir = path.join(docsDir, 'public', 'icon', 'sites')
const output = path.join(docsDir, '.vitepress', 'theme', 'utils', 'siteIcons.mjs')
const useFetch = process.argv.includes('--fetch')

const collect = (dir, matcher, out = []) => {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) collect(full, matcher, out)
        else if (matcher(entry.name)) out.push(full)
    }
    return out
}

const hosts = new Set()
// 仅采集卡片数据里的外链，避免把正文里的引用链接也当成待缓存站点
for (const file of collect(docsDir, name => /\.(md|js|mjs)$/.test(name))) {
    const text = fs.readFileSync(file, 'utf-8')
    for (const match of text.matchAll(/\blink:\s*['"]https?:\/\/([^\s"'<>/)]+)/g)) {
        const host = match[1].split(':')[0]
        if (host.includes('.') && !/^(localhost|127\.0\.0\.1)/.test(host)) hosts.add(host)
    }
}

const cached = {}
fs.mkdirSync(sitesDir, {recursive: true})
for (const host of hosts) {
    for (const ext of ['ico', 'png', 'svg']) {
        if (fs.existsSync(path.join(sitesDir, `${host}.${ext}`))) {
            cached[host] = `/icon/sites/${host}.${ext}`
            break
        }
    }
}

if (useFetch) {
    for (const host of hosts) {
        if (cached[host]) continue
        try {
            const response = await fetch(`https://${host}/favicon.ico`, {
                signal: AbortSignal.timeout(3000)
            })
            if (!response.ok) continue
            const buffer = Buffer.from(await response.arrayBuffer())
            if (buffer.length < 100 || buffer.length > 200 * 1024) continue
            fs.writeFileSync(path.join(sitesDir, `${host}.ico`), buffer)
            cached[host] = `/icon/sites/${host}.ico`
        } catch {
            // 无法访问的站点保留默认占位图
        }
    }
}

const body = `// 由 scripts/gen-site-icons.mjs 生成，请勿手工编辑\n` +
    `const localIcons = ${JSON.stringify(cached, null, 4)}\n\n` +
    `export const getSiteIcon = (link) => {\n` +
    `    try {\n` +
    `        const host = new URL(link, 'https://yupaits.top').hostname\n` +
    `        return localIcons[host] || '/icon/url.png'\n` +
    `    } catch {\n` +
    `        return '/icon/url.png'\n` +
    `    }\n` +
    `}\n`
fs.mkdirSync(path.dirname(output), {recursive: true})
fs.writeFileSync(output, body)
console.log(`外链域名 ${hosts.size} 个，已缓存本地图标 ${Object.keys(cached).length} 个 -> ${path.relative(root, output)}`)
