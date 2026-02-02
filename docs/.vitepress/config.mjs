// @ts-nocheck
import { defineConfig } from 'vitepress'
import taskList from 'markdown-it-task-checkbox'
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
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    // Algolia
    ['meta', { name: 'algolia-site-verification', content: '61973CBB63FA493B' }],
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
      { icon: 'github', link: 'https://github.com/yupaits' },
      {
        icon: {
          svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM10.1484 6.44434C8.10295 6.44434 6.44434 8.10295 6.44434 10.1484V17.0615C6.44434 17.3343 6.66574 17.5557 6.93848 17.5557H14.2227C16.0632 17.5554 17.5554 16.0632 17.5557 14.2227V11.3828C17.5557 11.1101 17.3343 10.8887 17.0615 10.8887H11.3828C11.1101 10.8888 10.8889 11.1101 10.8887 11.3828V12.6172C10.8885 12.8899 11.1091 13.1112 11.3818 13.1113H14.8398C15.1122 13.1116 15.3328 13.3321 15.333 13.6045V13.8516C15.333 14.6698 14.6698 15.333 13.8516 15.333H9.16016C8.88757 15.333 8.66621 15.1124 8.66602 14.8398V10.1484C8.66595 9.33027 9.32931 8.66706 10.1475 8.66699H17.0605C17.333 8.66652 17.5542 8.44536 17.5547 8.17285V6.93848C17.5552 6.66575 17.3343 6.44451 17.0615 6.44434H10.1484Z"></path></svg>'
        },
        link: 'https://gitee.com/yupaits'
      },
      {
        icon: {
          svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.2809 2.95549C20.2499 3.1584 21.0363 5.29655 21.1199 5.5524L22.4167 5.64758C22.5466 5.64758 22.5858 5.82844 22.471 5.88421C21.148 6.60011 20.7438 8.05479 20.9814 9.00236C21.071 9.35974 21.2346 9.69179 21.3932 10.0224C21.6998 10.6637 22.0441 11.4403 22.1003 13.0033C22.2168 16.2423 19.5895 19.1778 16.3115 19.5956C17.4813 18.4088 18.1256 17.1518 18.4313 16.2207C19.0373 14.375 18.9393 12.9046 18.4857 11.781C18.0385 10.6732 17.2806 9.98965 16.7036 9.63988C15.021 8.62006 13.4846 8.54938 12.2604 8.878C12.7253 8.28379 13.1361 7.6768 13.4596 7.01357C14.0436 5.36416 13.3581 4.1657 12.7563 3.49525C12.5642 3.24941 12.695 2.83984 13.0607 2.83984C14.4703 2.83984 15.8737 2.8604 17.2809 2.95549ZM3.31872 19.1067C5.24275 16.9048 8.0315 13.7133 10.4814 10.9564C11.04 10.3277 13.2499 8.61858 16.2285 10.424C17.1068 10.9564 18.6589 12.589 17.5605 15.9349C16.7576 18.3804 13.1532 23.7301 1.80115 21.7784C1.5741 21.7394 1.29 21.4242 1.58312 21.0905C1.99794 20.6183 2.59759 19.932 3.31872 19.1067Z"></path></svg>'
        },
        link: 'https://www.yuque.com/yupaits'
      },
      {
        icon: {
          svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.223 3.08609C18.7112 3.57424 18.7112 4.3657 18.223 4.85385L17.08 5.99622L18.25 5.99662C20.3211 5.99662 22 7.67555 22 9.74662V17.2466C22 19.3177 20.3211 20.9966 18.25 20.9966H5.75C3.67893 20.9966 2 19.3177 2 17.2466V9.74662C2 7.67555 3.67893 5.99662 5.75 5.99662L6.91625 5.99622L5.77466 4.85481C5.28651 4.36665 5.28651 3.5752 5.77466 3.08704C6.26282 2.59889 7.05427 2.59889 7.54243 3.08704L10.1941 5.73869C10.2729 5.81753 10.339 5.90428 10.3924 5.99638L13.6046 5.99661C13.6581 5.90407 13.7244 5.81691 13.8036 5.73774L16.4553 3.08609C16.9434 2.59793 17.7349 2.59793 18.223 3.08609ZM18.25 8.50662H5.75C5.09102 8.50662 4.55115 9.01654 4.50343 9.66333L4.5 9.75662V17.2566C4.5 17.9156 5.00992 18.4555 5.65671 18.5032L5.75 18.5066H18.25C18.909 18.5066 19.4489 17.9967 19.4966 17.3499L19.5 17.2566V9.75662C19.5 9.06626 18.9404 8.50662 18.25 8.50662ZM8.25 11.0066C8.94036 11.0066 9.5 11.5663 9.5 12.2566V13.5066C9.5 14.197 8.94036 14.7566 8.25 14.7566C7.55964 14.7566 7 14.197 7 13.5066V12.2566C7 11.5663 7.55964 11.0066 8.25 11.0066ZM15.75 11.0066C16.4404 11.0066 17 11.5663 17 12.2566V13.5066C17 14.197 16.4404 14.7566 15.75 14.7566C15.0596 14.7566 14.5 14.197 14.5 13.5066V12.2566C14.5 11.5663 15.0596 11.0066 15.75 11.0066Z"></path></svg>'
        },
        link: 'https://space.bilibili.com/1070763991'
      }
    ],

    outline: {
      level: [2, 4],
      label: '页面导航',
    },

    footer: {
      message: '本博客所有文章除特别声明外，均采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">CC BY-NC-SA 4.0</a> 许可协议。转载请注明原始来源信息为 <a href="/" target="_blank">yupaits notes</a>',
      copyright: `版权所有 © 2016-${new Date().getFullYear()} <a href="mailto:ts495606653@hotmail.com">yupaits</a>`
    },

    search: {
      // 已接入algolia，目前本地搜索引擎结果更准确
      provider: 'local',
      options: {
        appId: 'SBFHH164J9',
        apiKey: '244a6a5082f48c51e9ac7afe0468bf02',
        indexName: 'vitepress_pages',
        detailedView: true,
        placeholder: '搜索文档',
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            searchBox: {
              resetButtonTitle: '清除查询条件',
              resetButtonAriaLabel: '清除查询条件',
              cancelButtonText: '取消',
              cancelButtonAriaLabel: '取消'
            },
            startScreen: {
              recentSearchesTitle: '搜索历史',
              noRecentSearchesText: '没有搜索历史',
              saveRecentSearchButtonTitle: '保存至搜索历史',
              removeRecentSearchButtonTitle: '从搜索历史中移除',
              favoriteSearchesTitle: '收藏',
              removeFavoriteSearchButtonTitle: '从收藏中移除'
            },
            errorScreen: {
              titleText: '无法获取结果',
              helpText: '你可能需要检查你的网络连接'
            },
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
              searchByText: '搜索提供者'
            },
            noResultsScreen: {
              noResultsText: '无法找到相关结果',
              suggestedQueryText: '你可以尝试查询',
              reportMissingResultsText: '你认为该查询应该有结果？',
              reportMissingResultsLinkText: '点击反馈'
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
      md.use(taskList)
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
