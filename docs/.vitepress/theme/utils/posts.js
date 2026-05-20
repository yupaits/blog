import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import fs from 'fs'
import path from 'path'

dayjs.extend(relativeTime).extend(utc).extend(timezone).locale('zh-cn')

const tz = 'Asia/Shanghai'
const dateFormat = "YYYY-MM-DD HH:mm"
const imageRegex = /!\[.*?\]\((.*?)(?:\s+"[^"]*")?\)/

export const addPost = (pageData, siteConfig) => {
  //草稿状态的文章不记录
  if (pageData.frontmatter.draft === true) {
    return
  }
  const relativePath = pageData.relativePath
  //网站首页不记录
  if (relativePath === 'index.md') {
    return
  }
  const date = pageData.lastUpdated
  const content = fs.readFileSync(path.resolve(siteConfig.root, pageData.relativePath), 'utf-8')
  siteConfig.site.themeConfig.posts.push({
    text: getPostTitle(pageData.title, relativePath),
    description: getPostDescription(date),
    link: `/${relativePath.replace(/\.md$/, '').replace(/\\/g, '/')}`,
    date: date,
    icon: getPostImage(content, relativePath)
  })
}

const getPostTitle = (title, relativePath) => {
  const basename = path.basename(relativePath, '.md')
  if (basename === 'index') {
    return path.dirname(relativePath)
  }
  if (title && title !== '') {
    return title
  }
  return basename
}

const getPostDescription = (date) => {
  return `<span title="${dayjs(date).tz(tz).format(dateFormat)}">${dayjs(date).fromNow()}</span>`
}

const getPostImage = (content, relativePath) => {
  const match = content.match(imageRegex)
  return match ? match[1] : '/home/post.png'
}