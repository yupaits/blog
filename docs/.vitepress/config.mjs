// @ts-nocheck
import { defineConfig } from 'vitepress'
import MarkdownItTaskLists from 'markdown-it-task-lists'
import mdItCustomAttrs from 'markdown-it-custom-attrs'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import nav from './config/nav'
import sidebar from './config/sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "yupaits notes",
  description: "yupaits notes, Just do & record",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    // Google adsense
    [
      'script',
      {
        async: '',
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8239100633886634',
        crossorigin: 'anonymous'
      }
    ],
    // 百度统计
    [
      'script',
      {},
      `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?f4c5dd32b8bff25dd776c28eb5bf436d";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
      `
    ],
    // 不蒜子访问量统计
    [
      'script',
      {
        async: '',
        src: '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
      }
    ],
    // fancybox
    ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/fancyapps-ui/4.0.31/fancybox.min.css' }],
    ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/fancyapps-ui/4.0.31/fancybox.umd.js' }],
  ],
  cleanUrls: true,
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.ico',
    nav,
    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yupaits' }
    ],

    outline: {
      level: [2, 4],
      label: '页面导航',
    },

    footer: {
      message: '本博客所有文章除特别声明外，均采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> 许可协议。转载请注明原始来源信息为 <a href="/">yupaits notes</a><br><span>本站总访问量 <i id="busuanzi_value_site_pv"></i> 次</span><span style="margin-left: 2rem">访客数 <i id="busuanzi_value_site_uv"></i> 人</span>',
      copyright: `版权所有 © 2016-${new Date().getFullYear()} <a href="mailto:ts495606653@hotmail.com">yupaits</a>`
    },

    search: {
      provider: 'local',
      options: {
        detailedView: true,
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            displayDetails: '展示详情',
            resetButtonTitle: '清除查询条件',
            noResultsText: '无法找到相关结果',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            }
          }
        }
      }
    },

    lastUpdated: {
      text: '最后更新于'
    },

    editLink: {
      pattern: 'http://gitea.yupaits.com/yupaits/blog-md/src/branch/main/docs/:path',
      text: '编辑此页'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '文章列表',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    externalLinkIcon: true,

    notFound: {
      quote: '众里寻他千百度，蓦然回首，那人却在，灯火阑珊处。',
      linkText: '返回主页'
    }
  },
  markdown: {
    theme: { light: 'slack-ochin', dark: 'monokai' },
    lineNumbers: true,
    image: {
      lazyLoading: true
    },
    config: (md) => {
      md.use(MarkdownItTaskLists)
      md.use(mdItCustomAttrs, 'image', {
        'data-fancybox': 'gallery'
      })
    }
  },
  vite: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ]
  }
})
