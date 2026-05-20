import fs from 'fs'
import path from 'path'

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
    description: { name: 'PostDate', props: { date: date } },
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

const getPostImage = (content, relativePath) => {
  const match = content.match(imageRegex)
  return match ? match[1] : '/home/post.png'
}