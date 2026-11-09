import {execFileSync} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {createContentLoader} from 'vitepress'

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = path.resolve(srcDir, '..')

// 首页板块只覆盖这五个内容栏目，排除「站点收录」与栏目 index 页
const CATEGORY_NAMES = ['技术博客', '软件开发', '文章收录', '生活记录', '个人项目']
const categoryNames = new Set(CATEGORY_NAMES)

// 文章几乎没有 date frontmatter，工作区 mtime 又等于 clone 时间。
// 直接用「最后提交时间」会被批量导入/批量重构污染（254 篇挤在 2026），
// 因此：跳过一次改动超过 10 个 md 的批量提交，取最近一次正常提交；
// 没有正常提交的文件回退到首次写入时间，最后才是 mtime。
const BULK_COMMIT_THRESHOLD = 10

const parseLog = (text) => {
    const commits = []
    let current = null
    for (const line of text.split('\n')) {
        if (line.startsWith('@@@')) {
            current = {ts: Number(line.slice(3)), files: []}
            commits.push(current)
            continue
        }
        const value = line.trim().replace(/^"|"$/g, '')
        if (current && value.startsWith('docs/') && value.endsWith('.md')) current.files.push(value)
    }
    return commits
}

const gitLog = (...args) => execFileSync('git', ['-c', 'core.quotepath=false', 'log', ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024
})

const readGitDates = () => {
    const dates = new Map()
    try {
        const all = parseLog(gitLog('--pretty=format:@@@%ct', '--name-only', '--', 'docs'))
        const adds = parseLog(gitLog('--diff-filter=A', '--pretty=format:@@@%ct', '--name-only', '--', 'docs'))
        // 由旧到新取最早一次添加
        for (let i = adds.length - 1; i >= 0; i--) {
            for (const file of adds[i].files) if (!dates.has(file)) dates.set(file, adds[i].ts)
        }
        // 由新到旧，用最近一次小提交覆盖
        const small = new Map()
        for (const commit of all) {
            if (!commit.files.length || commit.files.length > BULK_COMMIT_THRESHOLD) continue
            for (const file of commit.files) if (!small.has(file)) small.set(file, commit.ts)
        }
        for (const [file, timestamp] of small) dates.set(file, timestamp)
    } catch {
        // 非 git / 浅克隆环境交给 getDate 回退
    }
    return dates
}
const gitDates = readGitDates()

const toRelativePath = (url) => {
    const clean = decodeURIComponent(url).replace(/^\//, '')
    return clean.endsWith('/') ? `${clean}index.md` : `${clean}.md`
}

// 标题取正文首个 h1；顺带统计正文字数，一次 IO 复用
const readMeta = (relativePath) => {
    try {
        const raw = fs.readFileSync(path.resolve(srcDir, relativePath), 'utf8')
        const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
        const title = body.match(/^#\s+(.+)$/m)?.[1]?.trim().replace(/[*_`]/g, '') ?? ''
        const words = body
            .replace(/```[\s\S]*?```/g, '')
            .replace(/!?\[[^\]]*\]\([^)]*\)/g, '')
            .replace(/<[^>]+>/g, '')
            .replace(/\s/g, '').length
        return {title, words}
    } catch {
        return {title: '', words: 0}
    }
}

const getDate = (page, relativePath) => {
    if (page.frontmatter.date) return Math.floor(new Date(page.frontmatter.date).getTime() / 1000)
    const git = gitDates.get(`docs/${relativePath}`)
    if (git) return git
    try {
        return Math.floor(fs.statSync(path.resolve(srcDir, relativePath)).mtimeMs / 1000)
    } catch {
        return Math.floor(Date.now() / 1000)
    }
}

// 统一按东八区换算，避免 CI（UTC）与本机跨年/跨天判断不一致
const yearOf = (seconds) => new Date((seconds + 8 * 3600) * 1000).getUTCFullYear()

export default createContentLoader('**/*.md', {
    transform(pages) {
        const posts = []
        for (const page of pages) {
            const url = page.url
            if (url === '/' || url.endsWith('/') || page.frontmatter.draft === true) continue
            const category = decodeURIComponent(url).split('/').filter(Boolean)[0] ?? ''
            if (!categoryNames.has(category)) continue
            const relativePath = toRelativePath(url)
            const meta = readMeta(relativePath)
            const lastSegment = decodeURIComponent(url).split('/').filter(Boolean).pop() ?? '未命名'
            posts.push({
                title: meta.title || lastSegment,
                lastSegment,
                url,
                date: getDate(page, relativePath),
                words: meta.words
            })
        }
        posts.sort((a, b) => b.date - a.date)

        const yearMap = new Map()
        for (const post of posts) {
            const year = yearOf(post.date)
            if (!yearMap.has(year)) yearMap.set(year, [])
            // 数组代替对象，且标题与路径末段相同时省略，压掉重复内容以控制内联体积
            yearMap.get(year).push([
                post.title === post.lastSegment ? '' : post.title,
                post.url,
                post.date
            ])
        }
        const years = [...yearMap.entries()]
            .sort((a, b) => b[0] - a[0])
            .map(([year, list]) => ({year, posts: list}))

        // 精选篇目由独立配置维护；配置缺失或路径失效时回退到最近更新的文章
        let config = []
        try {
            config = JSON.parse(fs.readFileSync(path.resolve(srcDir, 'data/featured.json'), 'utf8'))
        } catch {
            // 无配置文件时走兜底
        }
        const byUrl = new Map(posts.map(post => [post.url, post]))
        const categoryOf = (url) => decodeURIComponent(url).split('/').filter(Boolean)[0] ?? ''
        const picked = config
            .map(item => {
                const post = byUrl.get(item.url)
                return post ? {
                    title: post.title,
                    url: post.url,
                    category: categoryOf(post.url),
                    date: post.date,
                    note: item.note ?? ''
                } : null
            })
            .filter(Boolean)
        const featured = picked.length ? picked : posts.slice(0, 6).map(post => ({
            title: post.title,
            url: post.url,
            category: categoryOf(post.url),
            date: post.date,
            note: ''
        }))

        return {
            stats: {
                posts: posts.length,
                words: posts.reduce((sum, post) => sum + post.words, 0),
                years: years.length,
                updated: posts[0]?.date ?? 0
            },
            years,
            featured
        }
    }
})
