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

// ===== 精选推荐参数（集中在这里，方便以后调整）=====
// 站点是纯静态构建，没有真实点击/停留数据，这里的“推荐”只是基于可解释信号的排序，
// 不涉及个性化。各信号先归一化到 0~1，再按权重相加，得分高者入选。
const FEATURED_CONFIG = {
    minPerCategory: 3,      // 每个栏目至少选出 3 篇（下限，栏目不足 3 篇则全出）
    maxPerCategory: 6,      // 每个栏目最多选 6 篇，避免高产栏目占满精选区
    keepRatio: 0.72,        // 得分不低于该栏目头名 72% 的才入选，在 3~6 篇之间浮动
    minWords: 300,          // 低于该字数的文章视为过短，优先不选（栏目内候选不足时自动放宽）
    recency: {
        weight: 1,          // 新近度权重（文章越新得分越高）
        halfLifeDays: 365   // 每过一年，新近度得分减半
    },
    length: {
        weight: 0.45,       // 内容体量权重（避免选到只有标题的短文）
        targetWords: 2000   // 达到该字数即得满分，再长不额外加分
    },
    inbound: {
        weight: 0.5,        // 被站内其他文章引用次数权重
        cap: 3              // 引用 3 次及以上都按满分计
    },
    frontmatter: {
        weight: 0.8,        // frontmatter 权重/置顶字段的权重上限
        weightField: 'weight',
        pinnedFields: ['featured', 'pinned']
    },
    excerptLength: 72       // 预览摘要截断长度
}

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

// 原始内容只读一次，正文统计、摘要、内链计数共用
const rawCache = new Map()
const readRaw = (relativePath) => {
    if (!rawCache.has(relativePath)) {
        try {
            rawCache.set(relativePath, fs.readFileSync(path.resolve(srcDir, relativePath), 'utf8'))
        } catch {
            rawCache.set(relativePath, '')
        }
    }
    return rawCache.get(relativePath)
}

const stripInline = (text) => text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

// 标题取正文首个 h1；顺带统计正文字数、截取首段摘要，一次 IO 复用
const readMeta = (relativePath) => {
    const raw = readRaw(relativePath)
    if (!raw) return {title: '', words: 0, excerpt: ''}
    const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    const title = body.match(/^#\s+(.+)$/m)?.[1]?.trim().replace(/[*_`]/g, '') ?? ''
    const words = body
        .replace(/```[\s\S]*?```/g, '')
        .replace(/!?\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\s/g, '').length
    let excerpt = ''
    for (const line of body.split('\n')) {
        const text = line.trim()
        if (!text) continue
        // 跳过标题、代码块、引用、表格、列表、图片、HTML 等非首段内容
        if (/^(#{1,6}\s|```|>|\||<|!\[|---|[-*+]\s|\d+\.\s)/.test(text)) continue
        const plain = stripInline(text)
        if (!plain) continue
        excerpt = plain.length > FEATURED_CONFIG.excerptLength
            ? `${plain.slice(0, FEATURED_CONFIG.excerptLength)}…`
            : plain
        break
    }
    return {title, words, excerpt}
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

// 站内链接归一化：去掉锚点/查询串与扩展名，统一成和 page.url 相同的路径
const normalizeUrl = (value) => {
    let url = value.split('#')[0].split('?')[0].trim()
    if (!url) return ''
    try {
        url = decodeURIComponent(url)
    } catch {
        // 保留原样
    }
    url = url.replace(/\.(md|html)$/i, '')
    url = url.replace(/\/index$/, '/')
    if (url.length > 1 && url.endsWith('/')) url = url.slice(0, -1)
    return url.startsWith('/') ? url : `/${url}`
}

const LINK_RE = /(!?)\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g

// 统计每篇文章被站内其他文章引用的次数（支持相对路径、绝对路径与 .md 链接）
const countInboundLinks = (pages) => {
    const counts = new Map()
    for (const page of pages) {
        if (!page.url || page.url === '/') continue
        const raw = readRaw(toRelativePath(page.url))
        if (!raw) continue
        const base = `http://site.local${page.url}`
        for (const match of raw.matchAll(LINK_RE)) {
            if (match[1] === '!') continue
            const link = match[2]
            if (/^(?:[a-z]+:|#|\/\/)/i.test(link)) continue
            if (link.startsWith('/images/')) continue
            try {
                const target = normalizeUrl(new URL(link, base).pathname)
                counts.set(target, (counts.get(target) ?? 0) + 1)
            } catch {
                // 无法解析的链接直接忽略
            }
        }
    }
    return counts
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

// 单篇得分 = 新近度 + 内容体量 + 站内引用 + frontmatter 加权，均为 0~1 归一化后乘权重
const scorePost = (post, now) => {
    const ageDays = Math.max(0, (now - post.date) / 86400)
    const recency = Math.pow(0.5, ageDays / FEATURED_CONFIG.recency.halfLifeDays)
    const length = clamp(post.words / FEATURED_CONFIG.length.targetWords, 0, 1)
    const inbound = clamp(post.inbound / FEATURED_CONFIG.inbound.cap, 0, 1)
    const weightValue = Number(post.weight)
    const frontmatterBoost = Number.isFinite(weightValue)
        ? clamp(weightValue, 0, 1)
        : (post.pinned ? 1 : 0)
    return recency * FEATURED_CONFIG.recency.weight
        + length * FEATURED_CONFIG.length.weight
        + inbound * FEATURED_CONFIG.inbound.weight
        + frontmatterBoost * FEATURED_CONFIG.frontmatter.weight
}

// 按栏目分组选篇：栏目内按得分排序，先取「不低于头名 keepRatio」的候选，
// 数量夹在 minPerCategory~maxPerCategory 之间。3 篇是下限而不是固定条数。
// 栏目顺序与概览一致（总篇数降序），方便和上方栏目分布对照。
const selectFeatured = (posts) => {
    const now = Math.floor(Date.now() / 1000)
    const byCategory = new Map()
    for (const post of posts) {
        if (!byCategory.has(post.category)) byCategory.set(post.category, [])
        byCategory.get(post.category).push(post)
    }

    const featured = []
    const orderedCategories = [...byCategory.entries()].sort((a, b) => b[1].length - a[1].length)
    for (const [category, list] of orderedCategories) {
        // 先过滤过短文章；过滤后不足 3 篇则退回该栏目全量，保证“至少 3 篇”
        const eligible = list.filter(post => post.words >= FEATURED_CONFIG.minWords)
        const pool = eligible.length >= FEATURED_CONFIG.minPerCategory ? eligible : list
        const scored = pool
            .map(post => ({...post, score: scorePost(post, now)}))
            .sort((a, b) => b.score - a.score)
        const best = scored[0]?.score ?? 0
        const qualified = scored.filter(post => post.score >= best * FEATURED_CONFIG.keepRatio).length
        const count = clamp(qualified, FEATURED_CONFIG.minPerCategory, FEATURED_CONFIG.maxPerCategory)
        const top = scored.slice(0, Math.min(count, scored.length))
        for (const post of top) {
            featured.push({
                title: post.title,
                url: post.url,
                category: post.category,
                date: post.date,
                note: post.excerpt || post.category
            })
        }
    }
    return featured
}

export default createContentLoader('**/*.md', {
    transform(pages) {
        const inbound = countInboundLinks(pages)
        const posts = []
        for (const page of pages) {
            const url = page.url
            if (url === '/' || url.endsWith('/') || page.frontmatter.draft === true) continue
            const category = decodeURIComponent(url).split('/').filter(Boolean)[0] ?? ''
            if (!categoryNames.has(category)) continue
            const relativePath = toRelativePath(url)
            const meta = readMeta(relativePath)
            const lastSegment = decodeURIComponent(url).split('/').filter(Boolean).pop() ?? '未命名'
            const weightRaw = page.frontmatter[FEATURED_CONFIG.frontmatter.weightField]
            posts.push({
                title: meta.title || lastSegment,
                lastSegment,
                url,
                category,
                date: getDate(page, relativePath),
                words: meta.words,
                excerpt: meta.excerpt,
                weight: weightRaw === undefined ? NaN : Number(weightRaw),
                pinned: FEATURED_CONFIG.frontmatter.pinnedFields.some(field => page.frontmatter[field] === true),
                inbound: inbound.get(normalizeUrl(url)) ?? 0
            })
        }
        posts.sort((a, b) => b.date - a.date)

        // 栏目统计：按篇数降序，时间轴用下标引用栏目，避免每篇重复存栏目名
        const categoryCount = new Map()
        for (const post of posts) {
            categoryCount.set(post.category, (categoryCount.get(post.category) ?? 0) + 1)
        }
        const categories = [...categoryCount.entries()]
            .map(([name, count]) => ({name, count}))
            .sort((a, b) => b.count - a.count)
        const categoryIndex = new Map(categories.map((item, index) => [item.name, index]))

        const yearMap = new Map()
        for (const post of posts) {
            const year = yearOf(post.date)
            if (!yearMap.has(year)) yearMap.set(year, [])
            // 数组代替对象，且标题与路径末段相同时省略，压掉重复内容以控制内联体积
            yearMap.get(year).push([
                post.title === post.lastSegment ? '' : post.title,
                post.url,
                post.date,
                categoryIndex.get(post.category)
            ])
        }
        const years = [...yearMap.entries()]
            .sort((a, b) => b[0] - a[0])
            .map(([year, list]) => ({year, posts: list}))

        return {
            stats: {
                posts: posts.length,
                words: posts.reduce((sum, post) => sum + post.words, 0),
                years: years.length,
                updated: posts[0]?.date ?? 0
            },
            categories,
            years,
            featured: selectFeatured(posts)
        }
    }
})
