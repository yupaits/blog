export default [
  { text: '技术博客', link: '/技术博客/', activeMatch: '/技术博客/' },
  { text: '软件开发', link: '/软件开发/', activeMatch: '/软件开发/' },
  { text: '文章收录', link: '/文章收录/', activeMatch: '/文章收录/' },
  {
    text: '更多',
    items: [
      {
        text: '个人中心',
        items: [
          { text: '个人项目', link: '/个人项目/', activeMatch: '/个人项目/' },
          { text: '生活记录', link: '/生活记录/', activeMatch: '/生活记录/' },
        ]
      },
      {
        text: '站点收录',
        items: [
          { text: '技术博客', link: '/站点收录/技术博客' },
          { text: '在线工具', link: '/站点收录/在线工具' },
          { text: '免费素材', link: '/站点收录/免费素材' },
          { text: 'AI生产力', link: '/站点收录/AI生产力' },
        ]
      },
      { text: 'Yupan BBS', link: 'https://bbs.yupaits.com/' },
      { text: 'yupaits的博客', link: 'https://blog.yupaits.com/' },
    ]
  },
]