module.exports = {
  base: "/",
  head: [
    ['link', {rel: 'icon', href: '/favicon.ico'}], //设置favicon
    ['meta', {name: 'robots', content: 'all'}],
    ['meta', {name: 'author', content: 'yupaits'}],
    ['meta', {name: 'keywords', content: 'yupaits, YupaiTS, 博客'}],
    ['meta', {name: 'apple-mobile-web-app-capable', content: 'yes'}],
    ['script', {'data-ad-client': 'ca-pub-8239100633886634', async: 'async', src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'}],
    ['script', {src: 'https://hm.baidu.com/hm.js?f4c5dd32b8bff25dd776c28eb5bf436d'}]
  ],
  dest: "dist",
  locales: {
    '/': {
      lang: "zh-CN",
      title: "yupaits的博客",
      description: "俯仰一生，最惧无为。",
    },
    '/en/': {
      lang: "en-US",
      title: "yupaits's Blog",
      description: "Only support Chinese Simplified yet."
    }
  },
  themeConfig: {
    logo: '/favicon.ico',
    displayAllHeaders: false, //显示所有页面的标题链接，默认只展开显示当前页面的标题链接
    activeHeaderLinks: true, //活动的标题链接，可随鼠标上下滑动自动激活标题侧边栏标题高亮，需要markdown.anchor.permalink: true
    repo: "https://github.com/yupaits",
    docsRepo: "https://github.com/yupaits/blog",
    docsDir: 'post',
    docsBranch: 'master',
    editLinks: true,
    smoothScroll: false,
    locales: {
      '/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: [
          {text: '博客', link: '/blog/'},
          {text: '文章', link: '/posts/'},
          {text: '设计', link: '/design/'},
          {text: '开发', link: '/dev/'},
          {text: '站点', link: '/sites'},
          {text: '工具', link: '/tools'},
          {text: '项目', link: '/projects/'},
          {text: '书单', link: '/books'},
          {text: '关于我', link: '/about'},
        ],
        sidebar: {
          '/blog/': [
            getSidebarConfig('', '', ['']),
            getSidebarConfig('技术', 'tech/', [
              'springboot-vue-build',
              'format-usage',
              'collection-example',
              'instanceof',
              'enum-sample',
              'recursion',
              'todo-tomato-knowledge',
              'ultimate-spider-knowledge',
              'weixin-java-tools',
              'enable-swap',
              'aliyun-linux-disk-mount',
            ]),
            getSidebarConfig('技巧', 'skill/', [
              'linux-static-ip',
              'gitlab-ci-springboot',
              'github-jenkins-ci-cd',
              'gitee-jenkins-docker-ci-cd',
            ]),
            getSidebarConfig('记录', 'record/', [
              'wsl2-guide',
              'design-color',
              'github-language-color',
              'vscode-plugins',
              'jar-maven-central',
              'openldap',
              'deploy-gitlab',
              'linux-confluence',
              'rabbitmq-deploy',
              'wechat-admin',
              'aliyun-server-environment',
              'hexo-blog',
            ]),
            getSidebarConfig('总结', 'summary/', [
              'in-action-summary',
              'exception-solution',
              'flatten-maven-plugin',
              'gitlab-manual',
              'open-source-license',
              'full-gc-troubleshoot',
              'best-log-practice',
              'cron-syntax',
              'linux-command',
              'markdown-syntax',
            ]),
            getSidebarConfig('项目管理', 'project-manage/', [
              'project-standards',
              'demand-analysis',
              'project-decision',
              'jira-basic-concepts',
              'git-branch-manage',
              'gitflow-model',
              'tool-integration',
              'dev-env-build',
            ]),
          ],
          '/posts/': [
            getSidebarConfig('', '', ['']),
            getSidebarConfig('生产力', 'productivity/', [
              'complex-business-coding', 
              '30-pictures-scrum', 
              'how-to-write-an-email', 
              'find-the-love-of-life', 
              'structured-thinking', 
              'reducing-software-complexity', 
              'self-help-guide-to-getting-rid-fatigue', 
              'programming-10-commandments',
            ]),
            getSidebarConfig('职场', 'workplace/', [
              'develop-leader-growth-manual',
              'tech-team-manage',
              '5-levels-of-engineers-and-career-development', 
              '30-things-junior-need-to-mastered',
              'be-a-down-to-earth-programmer',
              'follow-up-in-work',
              'how-to-judge-the-potential-of-management',
              'how-to-response-after-the-problem',
              'manage-complexity-is-the-core-value',
              'tech-and-team',
              'what-a-senior-programmer-looks-like',
              'what-should-do-when-the-core-employee-leaving',
            ]),
            getSidebarConfig('行业', 'industry/', [
              'what-is-new-retailing',
              'payment-industry-knowledge',
              '3-statements-of-finance',
              'how-econnoisseur-earn-money',
              'people-safety-prictices',
            ]),
            getSidebarConfig('资讯', 'information/', [
              '2019-queen-of-the-internet-report',
              '90s-entering-the-anxiety-age',
              'how-much-to-build-5g-base-station',
              'the-king-of-hacker',
            ]),
            getSidebarConfig('思考', 'thinking/', [
              'what-is-the-difference-between-a-great-person-and-an-ordinary-person',
              'how-to-teach-yourself-in-an-area',
              'how-to-become-a-technology-bull',
              'your-hard-work-doesnot-mean-reward',
              '30-ceo-give-me-9-truth',
              'talking-about-philosophy-and-programming',
              'a-good-engineer-must-have-the-skill',
              'growth-experience-from-0-to-200-people-group',
              'growth-in-one-year-at-alibaba',
              'management-career-thinking-in-jingdong',
            ]),
            getSidebarConfig('趋势', 'trend/', [
              'intelligent-writing-2.0',
              'huawei-launches-top-10-trends-for-2025'
            ]),
            getSidebarConfig('语录', 'quotes/', ['three-quotes']),
          ],
          '/design/': [
            getSidebarConfig('', '', ['']),
            getSidebarConfig('架构设计', 'architecture/', [
              'base-component', 'system-architecture'
            ]),
            getSidebarConfig('业务场景', 'business/', [
              'payment-system'
            ]),
            getSidebarConfig('Checklist', 'checklist/', [
              'api-security-checklist', 'code-review-checklist'
            ]),
          ],
          '/dev/': [
            getSidebarConfig('', '', ['']),
            getSidebarConfig('数据结构', 'data-structure/', ['common-data-structure']),
            getSidebarConfig('算法', 'algorithm/', ['search', 'sort', 'graph', 'bit-operation']),
            getSidebarConfig('设计模式', 'design-pattern/', [
              'overview', 'gof-23-patterns', 'singleton', 'factory', 'decorator', 'adapter', 'observer', 'chain-of-responsibility', 
              'strategy', 'composite', 'template-method', 'proxy'
            ]),
            getSidebarConfig('分布式系统原理', 'distribution/', [
              'distribution-system', 'cap', 'eventually-consistent', 'idempotent', 'disaster-tolerance'
            ]),
            getSidebarConfig('大型网络应用架构', 'web-architecture/', [
              'architecture-factors', 'mq', 'cache', 'load-balance', 'cluster', 'data-sync', 'high-availability'
            ]),
            getSidebarConfig('Java基础知识', 'java/java-base/', [
              //基本语法
              'basic-datatypes', 'operator', 'choose-loop', 'class-object', 'extend-implements', 'exception', 
              'package-jar', 'serialize-deserialize', 'regex', 'overload-override',
              //集合
              'collection', 'set', 'list', 'queue', 'map',
              //线程
              'thread', 'runnable', 'callable', 'thread-state', 'thread-priority',
              //IO
              'file', 'byte-stream', 'stream', 'convert-stream', 'zip-stream',
              //网络
              'tcp', 'udp',
              //泛型
              'generic',
              //反射
              'reflection-api', 'invoke', 'dynamic-proxy',
              //源码分析
              'ArrayList', 'LinkedList', 'CopyOnWriteArrayList', 'HashMap', 'LinkedHashMap', 'ConcurrentHashMap'
            ]),
            getSidebarConfig('Java进阶知识', 'java/java-advanced/', [
              'java-keywords', 'regex', 'lock', 'common-libs', 'system-property', 'lambda', 'java-thread', 'threadlocal',
              'hashmap-expansion', 'exception', 'problems',
              //NIO
              'nio', 'tomcat-nio-model', 'epoll-selector', 'linux-io',
              //Java多线程
              'thread-1', 'thread-2', 'thread-3',
              //Java并发包
              'jdk-concurrent-class', 'concurrent-collection',
              //Netty
              'netty'
            ]),
            getSidebarConfig('JVM虚拟机', 'java/java-jvm/', [
              //JVM虚拟机
              'jvm-mem', 'class-loader', 'gc',
              //JVM调优
              'jvm-params', 'console', 'tuning-collection'
            ]),
            getSidebarConfig('Spring', 'spring/', ['spring-transactions', 'spring-knowledge-points']),
            getSidebarConfig('Spring Boot', 'spring-boot/', []),
            getSidebarConfig('Spring Cloud', 'spring-cloud/', [
              'service-discovery', 'undertow', 'ribbon', 'config-server', 'bus-amqp', 'hystrix',
              'admin-dashboard', 'sleuth', 'security', 'api-gateway'
            ]),
            getSidebarConfig('Golang', 'golang/', ['gin-doc', 'gorm', 'go-spider', 'fyne']),
            getSidebarConfig('移动开发', 'mobile/', []),
            getSidebarConfig('微信开发', 'wechat/', []),
            getSidebarConfig('Docker', 'docker/', [
              'install-docker', 'Dockerfile', 'docker-image', 'docker-container', 
              'docker-compose-yml', 'docker-compose'
            ]),
            getSidebarConfig('玩转树莓派', 'raspberry-pi/', ['go-pi-monitor', 'aria2-downloader']),
          ]
        }
      },
      '/en/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last updated at',
        nav: [],
        sidebar: {}
      }
    },
  },
  markdown: {
    lineNumbers: true,
    anchor: {
      permalink: true
    },
    toc: {
      includeLevel: [2, 3] //目录包含的标题等级，2表示h2
    },
    config: md => {
      // 使用更多的 markdown-it 插件!
    }
  },
  plugins: [
    ['@vssue/vuepress-plugin-vssue', {
      platform: 'github-v4',
      owner: 'yupaits',
      repo: 'blog',
      clientId: '5680169c83c7f32a7352',
      clientSecret: '1a71f599143d186c5e8fd00f3f96f482d8ff71ea'
    }],
    ['@vuepress/medium-zoom'],
    ['@vuepress/back-to-top'],
    ['sitemap', {
      hostname: 'https://www.yupaits.com'
    }],
    ['vuepress-plugin-code-copy', true],
    ['vuepress-plugin-baidu-autopush']
  ]
}

function getSidebarConfig(title, pathPrefix, children) {
  let transformedChildren = [];
  children.forEach(item => {
    transformedChildren.push(pathPrefix + item);
  });
  return {
    title,
    collapsable: false,
    children: transformedChildren
  }
}