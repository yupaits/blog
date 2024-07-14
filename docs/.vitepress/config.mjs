import { defineConfig } from 'vitepress'
import MarkdownItTaskLists from 'markdown-it-task-lists'

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
    // Google Fonts
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
  ],
  cleanUrls: true,
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.ico',
    nav: [
      { text: '技术博客', link: '/技术博客/', activeMatch: '/技术博客/' },
      { text: '文章收录', link: '/文章收录/', activeMatch: '/文章收录/' },
      { text: '软件开发', link: '/软件开发/', activeMatch: '/软件开发/' },
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
              { text: 'yupaits的博客（旧版）', link: 'https://blog.yupaits.com/' },
            ]
          }
        ]
      },
    ],

    sidebar: {
      '/技术博客/': {
        base: '/技术博客/',
        items: [
          { text: 'VSCode搭建SpringBoot项目开发运行环境', link: 'VSCode搭建SpringBoot项目开发运行环境' },
          { text: 'SpringBoot版本2.7-3.2升级记录', link: 'SpringBoot版本2.7-3.2升级记录' },
          { text: '益智游戏开发-推箱子', link: '益智游戏开发-推箱子' },
          { text: '益智游戏开发-扫雷', link: '益智游戏开发-扫雷' },
          { text: '益智游戏开发-数独', link: '益智游戏开发-数独' },
          { text: 'CompletableFuture的用法', link: 'CompletableFuture的用法' },
          { text: 'Java流式API', link: 'Java流式API' },
          { text: 'guava-retrying实现重试机制', link: 'guava-retrying实现重试机制' },
          { text: 'Java线程池实现原理及其业务实践', link: 'Java线程池实现原理及其业务实践' },
          { text: 'WSL2使用指南', link: 'WSL2使用指南' },
          { text: 'weixin-java-tools微信JavaSDK开发工具包', link: 'weixin-java-tools微信JavaSDK开发工具包' },
          { text: 'Todo-Tomato技术解读', link: 'Todo-Tomato技术解读' },
          { text: 'String.format的用法', link: 'String.format的用法' },
          { text: 'SpringBoot和Vue单页面前后端分离项目的整合与构建', link: 'SpringBoot和Vue单页面前后端分离项目的整合与构建' },
          { text: 'Linux下安装Confluence', link: 'Linux下安装Confluence' },
          { text: 'Linux系统设置静态IP', link: 'Linux系统设置静态IP' },
          { text: 'Linux常用指令', link: 'Linux常用指令' },
          { text: 'Jira基本概念', link: 'Jira基本概念' },
          { text: 'Java运算符instanceof的用法', link: 'Java运算符instanceof的用法' },
          { text: 'Java枚举类实例', link: 'Java枚举类实例' },
          { text: 'Java递归的实践', link: 'Java递归的实践' },
          { text: 'Java的Lambda表达式与函数式接口', link: 'Java的Lambda表达式与函数式接口' },
          { text: 'Java集合杂谈', link: 'Java集合杂谈' },
          { text: 'GitLab使用手册', link: 'GitLab使用手册' },
          { text: 'GitLab-CI环境搭建与SpringBoot项目CI配置总结', link: 'GitLab-CI环境搭建与SpringBoot项目CI配置总结' },
          { text: 'GitHub编程语言色彩一览', link: 'GitHub编程语言色彩一览' },
          { text: 'Git分支管理', link: 'Git分支管理' },
          { text: 'Full GC排查流程', link: 'Full GC排查流程' },
          { text: 'flatten-maven-plugin插件配置说明', link: 'flatten-maven-plugin插件配置说明' },
          { text: 'cron语法简单总结', link: 'cron语法简单总结' },
          { text: '最佳日志实践', link: '最佳日志实践' },
          { text: '需求分析', link: '需求分析' },
          { text: '项目决策', link: '项目决策' },
          { text: '通过开启swap分区解决小内存阿里云服务器的运行瓶颈', link: '通过开启swap分区解决小内存阿里云服务器的运行瓶颈' },
          { text: '微信公众号管理平台的实现', link: '微信公众号管理平台的实现' },
          { text: '使用GitHub和Jenkins自动构建并部署静态页面', link: '使用GitHub和Jenkins自动构建并部署静态页面' },
          { text: '使用Gitee+Jenkins+Docker完成前后端分离项目的CI_CD', link: '使用Gitee+Jenkins+Docker完成前后端分离项目的CI_CD' },
          { text: '开发环境搭建', link: '开发环境搭建' },
          { text: '发布jar包到Maven中央仓库', link: '发布jar包到Maven中央仓库' },
          { text: '搭建OpenLDAP服务', link: '搭建OpenLDAP服务' },
          { text: '搭建GitLab私有代码托管', link: '搭建GitLab私有代码托管' },
          { text: '从Ultimate-Spider全方位解析数据采集系统的基本知识', link: '从Ultimate-Spider全方位解析数据采集系统的基本知识' },
          { text: '阿里云Linux服务器格式化和挂载数据盘', link: '阿里云Linux服务器格式化和挂载数据盘' },
          { text: '阿里云服务器环境搭建', link: '阿里云服务器环境搭建' },
          { text: '使用hexo快速搭建个人博客', link: '使用hexo快速搭建个人博客' },
        ]
      },
      '/文章收录/': {
        base: '/文章收录/',
        items: [
          { text: '谈谈我工作中的23个设计模式', link: '谈谈我工作中的23个设计模式' },
          { text: '我的京东管理生涯随想', link: '我的京东管理生涯随想' },
          { text: '优秀工程师必备的一项技能，你解锁了吗？', link: '优秀工程师必备的一项技能，你解锁了吗？' },
          { text: '一套摆脱疲劳的自救指南', link: '一套摆脱疲劳的自救指南' },
          { text: '那些程序员小白还没掌握的30件事', link: '那些程序员小白还没掌握的30件事' },
          { text: '谈谈“五级工程师和职业发展”的思考', link: '谈谈“五级工程师和职业发展”的思考' },
          { text: '编程一生《三言》', link: '编程一生《三言》' },
          { text: '电子邮件，应该是这样写滴（n个好习惯让我们避免互相伤害）', link: '电子邮件，应该是这样写滴（n个好习惯让我们避免互相伤害）' },
          { text: '无我编程的10条诫律', link: '无我编程的10条诫律' },
          { text: '如何判断自己有没有管理的潜力？', link: '如何判断自己有没有管理的潜力？' },
          { text: '华为发布面向2025十大趋势', link: '华为发布面向2025十大趋势' },
          { text: '从这四点出发，不做 “ 空心 ” 程序员', link: '从这四点出发，不做 “ 空心 ” 程序员' },
          { text: '从 0 到 200 人团队，我的成长经历分享', link: '从 0 到 200 人团队，我的成长经历分享' },
          { text: '“跟进”的正确方式', link: '“跟进”的正确方式' },
          { text: 'Tech与Team — Leader 的自我修养', link: 'Tech与Team — Leader 的自我修养' },
          { text: '资深技术Leader曹乐：如何成为技术大牛', link: '资深技术Leader曹乐：如何成为技术大牛' },
          { text: '悟空转世，黑客之王', link: '悟空转世，黑客之王' },
          { text: '30个CEO，烧了42亿，告诉我这9个真相', link: '30个CEO，烧了42亿，告诉我这9个真相' },
          { text: '漫谈哲学与编程', link: '漫谈哲学与编程' },
          { text: '核心员工要离职，怎么办？', link: '核心员工要离职，怎么办？' },
          { text: '建一个5G基站，到底要花多少钱？', link: '建一个5G基站，到底要花多少钱？' },
          { text: '什么是新零售', link: '什么是新零售' },
          { text: '90后走入焦虑时代：没房没车没京户，还要梦想着财务自由', link: '90后走入焦虑时代：没房没车没京户，还要梦想着财务自由' },
          { text: '2019年“互联网女皇”报告重磅出炉：你想要的干货全在这里！', link: '2019年“互联网女皇”报告重磅出炉：你想要的干货全在这里！' },
          { text: '不好意思，你的辛劳并不等于酬劳', link: '不好意思，你的辛劳并不等于酬劳' },
          { text: '如何自学一个领域？这里有一份全指南', link: '如何自学一个领域？这里有一份全指南' },
          { text: '卓越的人和普通的人到底区别在哪？你根本想不到是它', link: '卓越的人和普通的人到底区别在哪？你根本想不到是它' },
          { text: '做支付需要了解哪些行业知识', link: '做支付需要了解哪些行业知识' },
          { text: '三大报表：财务界的通用语言', link: '三大报表：财务界的通用语言' },
          { text: '智能写作v2.0', link: '智能写作v2.0' },
          { text: '研发Leader成长手册', link: '研发Leader成长手册' },
          { text: '技术团队管理', link: '技术团队管理' },
          { text: '降低软件复杂性的一般原则和方法', link: '降低软件复杂性的一般原则和方法' },
          { text: '阿里高级技术专家方法论：如何写复杂业务代码？', link: '阿里高级技术专家方法论：如何写复杂业务代码？' },
          { text: '大家在寻找的高级程序员到底是什么样子的？', link: '大家在寻找的高级程序员到底是什么样子的？' },
          { text: '30张图看懂《SCRUM捷径》', link: '30张图看懂《SCRUM捷径》' },
          { text: '高级人才的价值在于管理复杂性的能力', link: '高级人才的价值在于管理复杂性的能力' },
          { text: '阿里一年，聊聊我成长了什么', link: '阿里一年，聊聊我成长了什么' },
          { text: '遇到问题后的本能反应，会决定职场发展的高度？', link: '遇到问题后的本能反应，会决定职场发展的高度？' },
          { text: '技术人具备“结构化思维”意味着什么？', link: '技术人具备“结构化思维”意味着什么？' },
          { text: '如何避免「三分钟热度」，找到人生的「热爱」', link: '如何避免「三分钟热度」，找到人生的「热爱」' },
          { text: '中通安全合规之人员安全实践', link: '中通安全合规之人员安全实践' },
          { text: '互联网黑产：那些职业羊毛党到底如何月赚几十万？', link: '互联网黑产：那些职业羊毛党到底如何月赚几十万？' },
        ]
      },
      '/软件开发/': {
        items: [
          {
            text: '编程基础',
            base: '/软件开发/编程基础/',
            items: [
              {
                text: '开发语言',
                base: '/软件开发/编程基础/开发语言/',
                collapsed: true,
                items: [
                  {
                    text: 'Java教程',
                    base: '/软件开发/编程基础/开发语言/Java教程/',
                    collapsed: true,
                    items: [
                      {
                        text: 'Java快速入门',
                        base: '/软件开发/编程基础/开发语言/Java教程/Java快速入门/',
                        collapsed: true,
                        items: [
                          { text: 'Java简介', link: 'Java简介' },
                          { text: 'Java程序基础', link: 'Java程序基础' },
                          { text: '流程控制', link: '流程控制' },
                          { text: '数组操作', link: '数组操作' },
                        ]
                      },
                      {
                        text: '面向对象编程',
                        base: '/软件开发/编程基础/开发语言/Java教程/面向对象编程/',
                        collapsed: true,
                        items: [
                          { text: '面向对象基础', link: '面向对象基础' },
                          { text: 'Java核心类', link: 'Java核心类' },
                        ]
                      },
                      { text: '异常处理', link: '异常处理' },
                      { text: '反射', link: '反射' },
                      { text: '注解', link: '注解' },
                      { text: '泛型', link: '泛型' },
                      { text: '集合', link: '集合' },
                      { text: 'IO', link: 'IO' },
                      { text: '日期与时间', link: '日期与时间' },
                      { text: '单元测试', link: '单元测试' },
                      { text: '正则表达式', link: '正则表达式' },
                      { text: '加密与安全', link: '加密与安全' },
                      { text: '多线程', link: '多线程' },
                      { text: 'Maven基础', link: 'Maven基础' },
                      { text: 'XML与JSON', link: 'XML与JSON' },
                      { text: 'JDBC编程', link: 'JDBC编程' },
                      { text: '函数式编程', link: '函数式编程' },
                      {
                        text: 'Web开发',
                        base: '/软件开发/编程基础/开发语言/Java教程/Web开发/',
                        collapsed: true,
                        items: [
                          { text: 'Web基础', link: 'Web基础' },
                          { text: 'Servlet开发', link: 'Servlet开发' },
                          { text: 'JSP开发', link: 'JSP开发' },
                          { text: 'MVC开发', link: 'MVC开发' },
                          { text: '使用Filter', link: '使用Filter' },
                          { text: '使用Listener', link: '使用Listener' },
                          { text: '部署', link: '部署' },
                        ]
                      },
                      {
                        text: 'Spring开发',
                        base: '/软件开发/编程基础/开发语言/Java教程/Spring开发/',
                        collapsed: true,
                        items: [
                          { text: 'IoC容器', link: 'IoC容器' },
                          { text: '使用AOP', link: '使用AOP' },
                          { text: '访问数据库', link: '访问数据库' },
                          { text: '开发Web应用', link: '开发Web应用' },
                          { text: '集成第三方组件', link: '集成第三方组件' },
                        ]
                      },
                      {
                        text: 'Spring Boot开发',
                        base: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/',
                        collapsed: true,
                        items: [
                          { text: '第一个Spring Boot应用', link: '第一个Spring Boot应用' },
                          { text: '使用开发者工具', link: '使用开发者工具' },
                          { text: '打包Spring Boot应用', link: '打包Spring Boot应用' },
                          { text: '瘦身Spring Boot应用', link: '瘦身Spring Boot应用' },
                          { text: '使用Actuator', link: '使用Actuator' },
                          { text: '使用Profiles', link: '使用Profiles' },
                          { text: '使用Conditional', link: '使用Conditional' },
                          { text: '加载配置文件', link: '加载配置文件' },
                          { text: '禁用自动配置', link: '禁用自动配置' },
                          { text: '添加Filter', link: '添加Filter' },
                          {
                            text: '集成第三方组件',
                            base: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/集成第三方组件/',
                            collapsed: true,
                            items: [
                              { text: '集成Open API', link: '集成Open API' },
                              { text: '访问Redis', link: '访问Redis' },
                              { text: '集成Artemis', link: '集成Artemis' },
                              { text: '集成RabbitMQ', link: '集成RabbitMQ' },
                              { text: '集成Kafka', link: '集成Kafka' },
                            ]
                          },
                        ]
                      },
                      {
                        text: 'Spring Cloud开发',
                        base: '/软件开发/编程基础/开发语言/Java教程/Spring Cloud开发/',
                        collapsed: true,
                        items: [
                          { text: '项目架构设计', link: '项目架构设计' },
                          { text: '搭建项目框架', link: '搭建项目框架' },
                          {
                            text: '设计交易引擎',
                            base: '/软件开发/编程基础/开发语言/Java教程/Spring Cloud开发/设计交易引擎/',
                            collapsed: true,
                            items: [
                              { text: '设计资产系统', link: '设计资产系统' },
                              { text: '设计订单系统', link: '设计订单系统' },
                              { text: '设计撮合系统', link: '设计撮合系统' },
                              { text: '设计清算系统', link: '设计清算系统' },
                              { text: '完成交易引擎', link: '完成交易引擎' },
                            ]
                          },
                          { text: '设计定序系统', link: '设计定序系统' },
                          { text: '设计API系统', link: '设计API系统' },
                          { text: '设计行情系统', link: '设计行情系统' },
                          { text: '设计推送系统', link: '设计推送系统' },
                          { text: '编写UI', link: '编写UI' },
                          { text: '项目总结', link: '项目总结' },
                        ]
                      },
                    ]
                  }
                ]
              },
              {
                text: '数据结构',
                base: '/软件开发/编程基础/数据结构/',
                collapsed: true,
                items: [
                  { text: '线性数据结构', link: '线性数据结构' },
                  { text: '图', link: '图' },
                  { text: '堆', link: '堆' },
                  { text: '树', link: '树' },
                  { text: '红黑树', link: '红黑树' },
                ]
              },
              {
                text: '常用算法',
                base: '/软件开发/编程基础/常用算法/',
                collapsed: true,
                items: [
                  { text: 'NIO模型', link: 'NIO模型' },
                  { text: '一致性哈希算法', link: '一致性哈希算法' },
                ]
              },
              {
                text: '设计模式',
                base: '/软件开发/编程基础/设计模式/',
                collapsed: true,
                items: [
                  { text: '设计模式简介', link: '设计模式简介' },
                  { text: '创建型模式', link: '创建型模式' },
                  { text: '结构型模式', link: '结构型模式' },
                  { text: '行为型模式', link: '行为型模式' },
                ]
              },
              {
                text: '网络编程',
                base: '/软件开发/编程基础/网络编程/',
                collapsed: true,
                items: [
                  { text: '网络编程基础', link: '网络编程基础' },
                  { text: 'TCP编程', link: 'TCP编程' },
                  { text: 'UDP编程', link: 'UDP编程' },
                  { text: '发送Email', link: '发送Email' },
                  { text: '接收Email', link: '接收Email' },
                  { text: 'HTTP编程', link: 'HTTP编程' },
                  { text: 'RMI远程调用', link: 'RMI远程调用' },
                ]
              },
              {
                text: 'SQL教程',
                base: '/软件开发/编程基础/SQL教程/',
                collapsed: true,
                items: [
                  { text: '关系数据库概述', link: '关系数据库概述' },
                  { text: '安装MySQL', link: '安装MySQL' },
                  { text: '关系模型', link: '关系模型' },
                  { text: '查询数据', link: '查询数据' },
                  { text: '修改数据', link: '修改数据' },
                  { text: 'MySQL', link: 'MySQL' },
                  { text: '事务', link: '事务' },
                ]
              },
            ]
          },
          {
            text: '架构设计',
            base: '/软件开发/架构设计/',
            items: [
              { text: '架构五要素', link: '架构五要素' },
              {
                text: '分布式',
                base: '/软件开发/架构设计/分布式/',
                collapsed: true,
                items: [
                  { text: '理论&算法&协议', link: '理论&算法&协议' },
                  { text: 'RPC', link: 'RPC' },
                  { text: 'ZooKeeper', link: 'ZooKeeper' },
                  { text: 'API网关', link: 'API网关' },
                  { text: '分布式ID', link: '分布式ID' },
                  { text: '分布式锁', link: '分布式锁' },
                ]
              },
              {
                text: '高可用',
                base: '/软件开发/架构设计/高可用/',
                collapsed: true,
                items: [
                  { text: '冗余设计', link: '冗余设计' },
                  { text: '服务限流', link: '服务限流' },
                  { text: '超时&重试', link: '超时&重试' },
                  { text: '性能测试入门', link: '性能测试入门' },
                ]
              }
            ]
          },
          {
            text: '软件架构',
            base: '/软件开发/软件架构/',
            items: [
              { text: '基础组件设计核心思路', link: '基础组件设计核心思路' },
              { text: '通用可编排状态机引擎设计', link: '通用可编排状态机引擎设计' },
              { text: '支付系统', link: '支付系统' },
            ]
          },
          {
            text: '中间件',
            base: '/软件开发/中间件/',
            items: [
              { text: '消息队列', link: '消息队列' },
              { text: '缓存', link: '缓存' },
              { text: '数据库读写分离&分库分表', link: '数据库读写分离&分库分表' },
              { text: '数据同步', link: '数据同步' },
              { text: '分布式任务调度', link: '分布式任务调度' },
            ]
          },
          {
            text: '实战总结',
            base: '/软件开发/实战总结/',
            items: [
              { text: '常见异常解决方案', link: '常见异常解决方案' },
              { text: 'Java', link: 'Java' },
              { text: 'Spring & Spring Boot', link: 'Spring & Spring Boot' },
              { text: 'MySQL', link: 'MySQL' },
              { text: 'Vue.js', link: 'Vue.js' },
              { text: '其他', link: '其他' },
            ]
          },
        ]
      },
      '/个人项目/': {
        items: [
          {
            text: 'yutool组件式框架',
            base: '/个人项目/yutool组件式框架/',
            items: [
              { text: 'yutool模块划分', link: 'yutool模块划分' },
              {
                text: 'yutool-orm ORM组件',
                base: '/个人项目/yutool组件式框架/yutool-orm ORM组件/',
                collapsed: true,
                items: [
                  { text: 'yutool-orm-core', link: 'yutool-orm-core' },
                  { text: 'yutool-orm-mybatis', link: 'yutool-orm-mybatis' },
                  { text: 'yutool-orm-jpa', link: 'yutool-orm-jpa' },
                ]
              },
              {
                text: 'yutool-mq消息组件',
                base: '/个人项目/yutool组件式框架/yutool-mq消息组件/',
                collapsed: true,
                items: [
                  { text: 'yutool-mq-core', link: 'yutool-mq-core' },
                  { text: 'yutool-mq-kafka', link: 'yutool-mq-kafka' },
                  { text: 'yutool-mq-rabbitmq', link: 'yutool-mq-rabbitmq' },
                  { text: 'yutool-mq-rocketmq', link: 'yutool-mq-rocketmq' },
                ]
              },
              {
                text: 'yutool-push推送组件',
                base: '/个人项目/yutool组件式框架/yutool-push推送组件/',
                collapsed: true,
                items: [
                  { text: 'yutool-push-core', link: 'yutool-push-core' },
                  { text: 'yutool-push-provider', link: 'yutool-push-provider' },
                ]
              },
              { text: 'yutool-file-server文件服务', link: 'yutool-file-server文件服务' },
              { text: 'yutool-social第三方登录组件', link: 'yutool-social第三方登录组件' },
              { text: 'yutool-state状态机组件', link: 'yutool-state状态机组件' },
              { text: 'yutool-search搜索引擎组件', link: 'yutool-search搜索引擎组件' },
              {
                text: 'yutool-plugins插件机制',
                base: '/个人项目/yutool组件式框架/yutool-plugins插件机制/',
                collapsed: true,
                items: [
                  { text: 'api-idempotent接口幂等插件', link: 'api-idempotent接口幂等插件' },
                  { text: 'api-logger接口访问日志插件', link: 'api-logger接口访问日志插件' },
                  { text: 'audit-logger审计日志插件', link: 'audit-logger审计日志插件' },
                  { text: 'auth-filter权限过滤插件', link: 'auth-filter权限过滤插件' },
                  { text: 'distributed-lock分布式锁插件', link: 'distributed-lock分布式锁插件' },
                  { text: 'history-data历史数据处理插件', link: 'history-data历史数据处理插件' },
                  { text: 'import-export数据导入导出插件', link: 'import-export数据导入导出插件' },
                  { text: 'native-mobile本地手机号登录插件', link: 'native-mobile本地手机号登录插件' },
                  { text: 'sms-reply-storage短信回复内容存储插件', link: 'sms-reply-storage短信回复内容存储插件' },
                  { text: 'sms-verify短信验证码插件', link: 'sms-verify短信验证码插件' },
                  { text: 'trace-analysis链路追踪插件', link: 'trace-analysis链路追踪插件' },
                  { text: 'cache-adapter缓存适配插件', link: 'cache-adapter缓存适配插件' },
                  { text: '[归档] dynamic-thread-pool动态线程池管理插件', link: '[归档] dynamic-thread-pool动态线程池管理插件' },
                  { text: '[归档] multi-ds-tx多数据源事务插件', link: '[归档] multi-ds-tx多数据源事务插件' },
                  { text: '[归档] swagger-support Swagger接口文档插件', link: '[归档] swagger-support Swagger接口文档插件' },
                  { text: '[归档] jwt-helper JWT工具插件', link: '[归档] jwt-helper JWT工具插件' },
                ]
              },
              { text: '[归档] yutool-cache缓存组件', link: '[归档] yutool-cache缓存组件' },
              { text: '[归档] yutool-mq消息组件', link: '[归档] yutool-mq消息组件' },
              { text: '[归档] yutool-push推送组件', link: '[归档] yutool-push推送组件' },
              { text: '[归档] yutool-ldap LDAP组件', link: '[归档] yutool-ldap LDAP组件' },
            ]
          },
          {
            text: 'yutool-cli高效工作套件',
            base: '/个人项目/yutool-cli高效工作套件/',
            items: [
              { text: 'yutool-cli功能清单', link: 'yutool-cli功能清单' },
              { text: 'yutool-cli运营模式', link: 'yutool-cli运营模式' },
            ]
          },
          {
            text: 'yutool-metadata元数据',
            base: '/个人项目/yutool-metadata元数据/',
            items: [
              { text: '元数据自定义对象管理设计', link: '元数据自定义对象管理设计' },
              { text: '自定义对象核心功能设计及实现', link: '自定义对象核心功能设计及实现' },
            ]
          },
          {
            text: 'yutool-biz业务组件',
            base: '/个人项目/yutool-biz业务组件/',
            items: [
              { text: 'yutool-biz 整体设计', link: 'yutool-biz 整体设计' },
              { text: 'yutool-api API接口', link: 'yutool-api API接口' },
              { text: 'yutool-auth 认证授权', link: 'yutool-auth 认证授权' },
              { text: 'yutool-user 用户', link: 'yutool-user 用户' },
              { text: 'yutool-org 组织架构', link: 'yutool-org 组织架构' },
              { text: 'yutool-address 地址', link: 'yutool-address 地址' },
              { text: 'yutool-dict 数据字典', link: 'yutool-dict 数据字典' },
              { text: 'yutool-notify 通知消息', link: 'yutool-notify 通知消息' },
              { text: 'yutool-exchange 数据中转', link: 'yutool-exchange 数据中转' },
              { text: 'admin-ui 管理界面', link: 'admin-ui 管理界面' },
            ]
          },
          {
            text: 'yupan网盘',
            base: '/个人项目/yupan网盘/',
            items: [
              { text: 'yupan架构', link: 'yupan架构' },
              { text: 'yupan-crawler数据收集', link: 'yupan-crawler数据收集' },
            ]
          },
        ]
      },
      '/生活记录/': {
        items: [
          {
            text: '山水游记',
            base: '/生活记录/山水游记/',
            items: [
              {
                text: '中国 China',
                base: '/生活记录/山水游记/中国/',
                collapsed: true,
                items: [
                  { text: '深圳十峰', link: '深圳十峰' },
                ]
              },
              {
                text: '泰国 Thailand',
                base: '/生活记录/山水游记/泰国/',
                collapsed: true,
                items: [
                  { text: '普吉岛', link: '普吉岛' },
                ]
              },
            ]
          },
          {
            text: '酷玩数码',
            base: '/生活记录/酷玩数码/',
            items: [
              {
                text: '极空间',
                base: '/生活记录/酷玩数码/极空间/',
                collapsed: true,
                items: [
                  { text: '极空间Docker使用攻略', link: '极空间Docker使用攻略' },
                  { text: '多个路由器组网实践', link: '多个路由器组网实践' },
                  { text: '安装Jellyfin实现IPTV播放及自建家庭影视系统', link: '安装Jellyfin实现IPTV播放及自建家庭影视系统' },
                ]
              },
              {
                text: '树莓派',
                base: '/生活记录/酷玩数码/树莓派/',
                collapsed: true,
                items: [
                  { text: '树莓派系统安装及配置', link: '树莓派系统安装及配置' },
                  { text: '运行情况监控', link: '运行情况监控' },
                  { text: '基于Aria2的下载机', link: '基于Aria2的下载机' },
                  { text: '搭建v2rayA', link: '搭建v2rayA' },
                  { text: 'web控制台cockpit', link: 'web控制台cockpit' },
                  { text: '使用rclone同步onedrive', link: '使用rclone同步onedrive' },
                  { text: 'yutool-cli高效工作套件', link: 'yutool-cli高效工作套件' },
                  { text: 'OpenWrt系统安装及配置', link: 'OpenWrt系统安装及配置' },
                ]
              },
            ]
          },
          {
            text: '阅读书单',
            base: '/生活记录/阅读书单/',
            items: [
              { text: '阅读计划', link: '阅读计划' },
            ]
          }
        ]
      },
      '/站点收录/': {
        items: [
          {
            text: '站点收录',
            base: '/站点收录/',
            items: [
              { text: '技术博客', link: '技术博客' },
              { text: '在线工具', link: '在线工具' },
              { text: '免费素材', link: '免费素材' },
              { text: 'AI生产力', link: 'AI生产力' },
            ]
          }
        ]
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yupaits' }
    ],

    outline: {
      level: [2, 4],
      label: '页面导航',
    },

    footer: {
      message: '本博客所有文章除特别声明外，均采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> 许可协议。转载请注明原始来源信息为 <a href="/">yupaits notes</a>',
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
    }
  }
})
