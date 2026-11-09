import {execFileSync} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {createContentLoader} from 'vitepress'

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = path.resolve(srcDir, '..')
const imageRegex = /!\[.*?\]\((.*?)(?:\s+"[^"]*")?\)/

// 一次性读取 git 历史，得到每篇文章的最后提交时间；无 git 环境时回退到文件修改时间
const readGitDates = () => {
    const dates = new Map()
    try {
        const log = execFileSync('git', ['log', '--pretty=format:%ct', '--name-only', '--', 'docs'], {
            cwd: repoRoot,
            encoding: 'utf8',
            maxBuffer: 32 * 1024 * 1024
        })
        let timestamp = 0
        for (const line of log.split('\n')) {
            const value = line.trim()
            if (!value) continue
            if (/^\d+$/.test(value)) {
                timestamp = Number(value) * 1000
            } else if (!dates.has(value)) {
                dates.set(value, timestamp)
            }
        }
    } catch {
        // 浅克隆或非 git 环境下由 getDate 回退
    }
    return dates
}

const gitDates = readGitDates()

const toRelativePath = (url) => {
    const clean = decodeURIComponent(url).replace(/^\//, '')
    return clean.endsWith('/') ? `${clean}index.md` : `${clean}.md`
}

const getTitle = (page) => {
    if (page.frontmatter.title) return page.frontmatter.title
    return decodeURIComponent(page.url).split('/').filter(Boolean).pop() ?? '未命名'
}

const getCategory = (url) => decodeURIComponent(url).split('/').filter(Boolean)[0] ?? ''

const getDate = (page, relativePath) => {
    if (page.frontmatter.date) return new Date(page.frontmatter.date).getTime()
    const gitDate = gitDates.get(`docs/${relativePath}`)
    if (gitDate) return gitDate
    try {
        return fs.statSync(path.resolve(srcDir, relativePath)).mtimeMs
    } catch {
        return Date.now()
    }
}

export default createContentLoader('**/*.md', {
    includeSrc: true,
    transform(pages) {
        return pages
            .filter(page => page.url !== '/' && !page.url.endsWith('/') && page.frontmatter.draft !== true)
            .map(page => ({
                text: getTitle(page),
                category: getCategory(page.url),
                link: page.url,
                date: getDate(page, toRelativePath(page.url)),
                icon: page.src?.match(imageRegex)?.[1] ?? '/home/post.png'
            }))
            .sort((a, b) => b.date - a.date)
    }
})
