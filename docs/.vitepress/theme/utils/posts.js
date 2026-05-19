import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import fs from 'fs'
import path from 'path'

dayjs.extend(relativeTime).locale('zh-cn')

const dateFormat = "YYYY-MM-DD HH:mm"
const imageRegex = /!\[.*?\]\((.*?)(?:\s+"[^"]*")?\)/

export const addPost = (pageData, siteConfig) => {
  const relativePath = pageData.relativePath
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
  return `<span title="${dayjs(date).format(dateFormat)}">${dayjs(date).fromNow()}</span>`
}

const getPostImage = (content, relativePath) => {
  const match = content.match(imageRegex)
  return match ? match[1] : '/home/post.png'
}