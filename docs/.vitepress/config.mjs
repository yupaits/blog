import { defineConfig } from 'vitepress'
import MarkdownItTaskLists from 'markdown-it-task-lists'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "yupaits notes",
  description: "yupaits notes",
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
    // 解决图片403问题
    ['meta', { name: 'referrer', content: 'never' }],
    // Google Fonts
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap', rel: 'stylesheet' }],
  ],
  cleanUrls: true,
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '技术博客', link: '/技术博客/' },
      { text: '文章收录', link: '/文章收录/' },
      { text: '软件开发', link: '/软件开发/' },
      { text: '个人项目', link: '/个人项目/' },
      { text: '生活记录', link: '/生活记录/' },
      { text: '站点收录', link: '/站点收录/' },
      { text: '旧版博客', link: 'https://yupaits.com/' },
    ],

    sidebar: {
      '/技术博客': [
        { text: 'CompletableFuture的用法', link: '/技术博客/CompletableFuture的用法' },
        { text: 'Java流式API', link: '/技术博客/Java流式API' },
        { text: 'guava-retrying实现重试机制', link: '/技术博客/guava-retrying实现重试机制' },
        { text: 'Java线程池实现原理及其业务实践', link: '/技术博客/Java线程池实现原理及其业务实践' },
        { text: 'WSL2使用指南', link: '/技术博客/WSL2使用指南' },
        { text: 'weixin-java-tools微信JavaSDK开发工具包', link: '/技术博客/weixin-java-tools微信JavaSDK开发工具包' },
        { text: 'Todo-Tomato技术解读', link: '/技术博客/Todo-Tomato技术解读' },
        { text: 'String.format的用法', link: '/技术博客/String.format的用法' },
        { text: 'SpringBoot和Vue单页面前后端分离项目的整合与构建', link: '/技术博客/SpringBoot和Vue单页面前后端分离项目的整合与构建' },
        { text: 'Linux下安装Confluence', link: '/技术博客/Linux下安装Confluence' },
        { text: 'Linux系统设置静态IP', link: '/技术博客/Linux系统设置静态IP' },
        { text: 'Linux常用指令', link: '/技术博客/Linux常用指令' },
        { text: 'Jira基本概念', link: '/技术博客/Jira基本概念' },
        { text: 'Java运算符instanceof的用法', link: '/技术博客/Java运算符instanceof的用法' },
        { text: 'Java枚举类实例', link: '/技术博客/Java枚举类实例' },
        { text: 'Java递归的实践', link: '/技术博客/Java递归的实践' },
        { text: 'Java的Lambda表达式与函数式接口', link: '/技术博客/Java的Lambda表达式与函数式接口' },
        { text: 'Java集合杂谈', link: '/技术博客/Java集合杂谈' },
        { text: 'GitLab使用手册', link: '/技术博客/GitLab使用手册' },
        { text: 'GitLab-CI环境搭建与SpringBoot项目CI配置总结', link: '/技术博客/GitLab-CI环境搭建与SpringBoot项目CI配置总结' },
        { text: 'GitHub编程语言色彩一览', link: '/技术博客/GitHub编程语言色彩一览' },
        { text: 'Git分支管理', link: '/技术博客/Git分支管理' },
        { text: 'Full GC排查流程', link: '/技术博客/Full GC排查流程' },
        { text: 'flatten-maven-plugin插件配置说明', link: '/技术博客/flatten-maven-plugin插件配置说明' },
        { text: 'cron语法简单总结', link: '/技术博客/cron语法简单总结' },
        { text: '最佳日志实践', link: '/技术博客/最佳日志实践' },
        { text: '需求分析', link: '/技术博客/需求分析' },
        { text: '项目决策', link: '/技术博客/项目决策' },
        { text: '通过开启swap分区解决小内存阿里云服务器的运行瓶颈', link: '/技术博客/通过开启swap分区解决小内存阿里云服务器的运行瓶颈' },
        { text: '微信公众号管理平台的实现', link: '/技术博客/微信公众号管理平台的实现' },
        { text: '使用GitHub和Jenkins自动构建并部署静态页面', link: '/技术博客/使用GitHub和Jenkins自动构建并部署静态页面' },
        { text: '使用Gitee+Jenkins+Docker完成前后端分离项目的CI_CD', link: '/技术博客/使用Gitee+Jenkins+Docker完成前后端分离项目的CI_CD' },
        { text: '开发环境搭建', link: '/技术博客/开发环境搭建' },
        { text: '发布jar包到Maven中央仓库', link: '/技术博客/发布jar包到Maven中央仓库' },
        { text: '搭建OpenLDAP服务', link: '/技术博客/搭建OpenLDAP服务' },
        { text: '搭建GitLab私有代码托管', link: '/技术博客/搭建GitLab私有代码托管' },
        { text: '从Ultimate-Spider全方位解析数据采集系统的基本知识', link: '/技术博客/从Ultimate-Spider全方位解析数据采集系统的基本知识' },
        { text: '阿里云Linux服务器格式化和挂载数据盘', link: '/技术博客/阿里云Linux服务器格式化和挂载数据盘' },
        { text: '阿里云服务器环境搭建', link: '/技术博客/阿里云服务器环境搭建' },
        { text: '使用hexo快速搭建个人博客', link: '/技术博客/使用hexo快速搭建个人博客' },
      ],
      '/文章收录': [
        { text: '谈谈我工作中的23个设计模式', link: '/文章收录/谈谈我工作中的23个设计模式' },
        { text: '我的京东管理生涯随想', link: '/文章收录/我的京东管理生涯随想' },
        { text: '优秀工程师必备的一项技能，你解锁了吗？', link: '/文章收录/优秀工程师必备的一项技能，你解锁了吗？' },
        { text: '一套摆脱疲劳的自救指南', link: '/文章收录/一套摆脱疲劳的自救指南' },
        { text: '那些程序员小白还没掌握的30件事', link: '/文章收录/那些程序员小白还没掌握的30件事' },
        { text: '谈谈“五级工程师和职业发展”的思考', link: '/文章收录/谈谈“五级工程师和职业发展”的思考' },
        { text: '编程一生《三言》', link: '/文章收录/编程一生《三言》' },
        { text: '电子邮件，应该是这样写滴（n个好习惯让我们避免互相伤害）', link: '/文章收录/电子邮件，应该是这样写滴（n个好习惯让我们避免互相伤害）' },
        { text: '无我编程的10条诫律', link: '/文章收录/无我编程的10条诫律' },
        { text: '如何判断自己有没有管理的潜力？', link: '/文章收录/如何判断自己有没有管理的潜力？' },
        { text: '华为发布面向2025十大趋势', link: '/文章收录/华为发布面向2025十大趋势' },
        { text: '从这四点出发，不做 “ 空心 ” 程序员', link: '/文章收录/从这四点出发，不做 “ 空心 ” 程序员' },
        { text: '从 0 到 200 人团队，我的成长经历分享', link: '/文章收录/从 0 到 200 人团队，我的成长经历分享' },
        { text: '“跟进”的正确方式', link: '/文章收录/“跟进”的正确方式' },
        { text: 'Tech与Team — Leader 的自我修养', link: '/文章收录/Tech与Team — Leader 的自我修养' },
        { text: '资深技术Leader曹乐：如何成为技术大牛', link: '/文章收录/资深技术Leader曹乐：如何成为技术大牛' },
        { text: '悟空转世，黑客之王', link: '/文章收录/悟空转世，黑客之王' },
        { text: '30个CEO，烧了42亿，告诉我这9个真相', link: '/文章收录/30个CEO，烧了42亿，告诉我这9个真相' },
        { text: '漫谈哲学与编程', link: '/文章收录/漫谈哲学与编程' },
        { text: '核心员工要离职，怎么办？', link: '/文章收录/核心员工要离职，怎么办？' },
        { text: '建一个5G基站，到底要花多少钱？', link: '/文章收录/建一个5G基站，到底要花多少钱？' },
        { text: '什么是新零售', link: '/文章收录/什么是新零售' },
        { text: '90后走入焦虑时代：没房没车没京户，还要梦想着财务自由', link: '/文章收录/90后走入焦虑时代：没房没车没京户，还要梦想着财务自由' },
        { text: '2019年“互联网女皇”报告重磅出炉：你想要的干货全在这里！', link: '/文章收录/2019年“互联网女皇”报告重磅出炉：你想要的干货全在这里！' },
        { text: '不好意思，你的辛劳并不等于酬劳', link: '/文章收录/不好意思，你的辛劳并不等于酬劳' },
        { text: '如何自学一个领域？这里有一份全指南', link: '/文章收录/如何自学一个领域？这里有一份全指南' },
        { text: '卓越的人和普通的人到底区别在哪？你根本想不到是它', link: '/文章收录/卓越的人和普通的人到底区别在哪？你根本想不到是它' },
        { text: '做支付需要了解哪些行业知识', link: '/文章收录/做支付需要了解哪些行业知识' },
        { text: '三大报表：财务界的通用语言', link: '/文章收录/三大报表：财务界的通用语言' },
        { text: '智能写作v2.0', link: '/文章收录/智能写作v2.0' },
        { text: '研发Leader成长手册', link: '/文章收录/研发Leader成长手册' },
        { text: '技术团队管理', link: '/文章收录/技术团队管理' },
        { text: '降低软件复杂性的一般原则和方法', link: '/文章收录/降低软件复杂性的一般原则和方法' },
        { text: '阿里高级技术专家方法论：如何写复杂业务代码？', link: '/文章收录/阿里高级技术专家方法论：如何写复杂业务代码？' },
        { text: '大家在寻找的高级程序员到底是什么样子的？', link: '/文章收录/大家在寻找的高级程序员到底是什么样子的？' },
        { text: '30张图看懂《SCRUM捷径》', link: '/文章收录/30张图看懂《SCRUM捷径》' },
        { text: '高级人才的价值在于管理复杂性的能力', link: '/文章收录/高级人才的价值在于管理复杂性的能力' },
        { text: '阿里一年，聊聊我成长了什么', link: '/文章收录/阿里一年，聊聊我成长了什么' },
        { text: '遇到问题后的本能反应，会决定职场发展的高度？', link: '/文章收录/遇到问题后的本能反应，会决定职场发展的高度？' },
        { text: '技术人具备“结构化思维”意味着什么？', link: '/文章收录/技术人具备“结构化思维”意味着什么？' },
        { text: '如何避免「三分钟热度」，找到人生的「热爱」', link: '/文章收录/如何避免「三分钟热度」，找到人生的「热爱」' },
        { text: '中通安全合规之人员安全实践', link: '/文章收录/中通安全合规之人员安全实践' },
        { text: '互联网黑产：那些职业羊毛党到底如何月赚几十万？', link: '/文章收录/互联网黑产：那些职业羊毛党到底如何月赚几十万？' },
      ],
      '/软件开发': [
        {
          text: '编程基础',
          items: [
            {
              text: '开发语言',
              collapsed: true,
              items: [
                {
                  text: 'Java教程',
                  collapsed: true,
                  items: [
                    {
                      text: 'Java快速入门',
                      collapsed: true,
                      items: [
                        { text: 'Java简介', link: '/软件开发/编程基础/开发语言/Java教程/Java快速入门/Java简介' },
                        { text: 'Java程序基础', link: '/软件开发/编程基础/开发语言/Java教程/Java快速入门/Java程序基础' },
                        { text: '流程控制', link: '/软件开发/编程基础/开发语言/Java教程/Java快速入门/流程控制' },
                        { text: '数组操作', link: '/软件开发/编程基础/开发语言/Java教程/Java快速入门/数组操作' },
                      ]
                    },
                    {
                      text: '面向对象编程',
                      collapsed: true,
                      items: [
                        { text: '面向对象基础', link: '/软件开发/编程基础/开发语言/Java教程/面向对象编程/面向对象基础' },
                        { text: 'Java核心类', link: '/软件开发/编程基础/开发语言/Java教程/面向对象编程/Java核心类' },
                      ]
                    },
                    { text: '异常处理', link: '/软件开发/编程基础/开发语言/Java教程/异常处理' },
                    { text: '反射', link: '/软件开发/编程基础/开发语言/Java教程/反射' },
                    { text: '注解', link: '/软件开发/编程基础/开发语言/Java教程/注解' },
                    { text: '泛型', link: '/软件开发/编程基础/开发语言/Java教程/泛型' },
                    { text: '集合', link: '/软件开发/编程基础/开发语言/Java教程/集合' },
                    { text: 'IO', link: '/软件开发/编程基础/开发语言/Java教程/IO' },
                    { text: '日期与时间', link: '/软件开发/编程基础/开发语言/Java教程/日期与时间' },
                    { text: '单元测试', link: '/软件开发/编程基础/开发语言/Java教程/单元测试' },
                    { text: '正则表达式', link: '/软件开发/编程基础/开发语言/Java教程/正则表达式' },
                    { text: '加密与安全', link: '/软件开发/编程基础/开发语言/Java教程/加密与安全' },
                    { text: '多线程', link: '/软件开发/编程基础/开发语言/Java教程/多线程' },
                    { text: 'Maven基础', link: '/软件开发/编程基础/开发语言/Java教程/Maven基础' },
                    { text: 'XML与JSON', link: '/软件开发/编程基础/开发语言/Java教程/XML与JSON' },
                    { text: 'JDBC编程', link: '/软件开发/编程基础/开发语言/Java教程/JDBC编程' },
                    { text: '函数式编程', link: '/软件开发/编程基础/开发语言/Java教程/函数式编程' },
                    {
                      text: 'Web开发',
                      collapsed: true,
                      items: [
                        { text: 'Web基础', link: '/软件开发/编程基础/开发语言/Java教程/Web开发/Web基础' },
                        { text: 'Servlet开发', link: '/软件开发/编程基础/开发语言/Java教程/Web开发/Servlet开发' },
                        { text: 'JSP开发', link: '/软件开发/编程基础/开发语言/Java教程/Web开发/JSP开发' },
                        { text: 'MVC开发', link: '/软件开发/编程基础/开发语言/Java教程/Web开发/MVC开发' },
                        { text: '使用Filter', link: '/软件开发/编程基础/开发语言/Java教程/Web开发/使用Filter' },
                        { text: '使用Listener', link: '/软件开发/编程基础/开发语言/Java教程/Web开发/使用Listener' },
                        { text: '部署', link: '/软件开发/编程基础/开发语言/Java教程/Web开发/部署' },
                      ]
                    },
                    {
                      text: 'Spring开发',
                      collapsed: true,
                      items: [
                        { text: 'IoC容器', link: '/软件开发/编程基础/开发语言/Java教程/Spring开发/IoC容器' },
                        { text: '使用AOP', link: '/软件开发/编程基础/开发语言/Java教程/Spring开发/使用AOP' },
                        { text: '访问数据库', link: '/软件开发/编程基础/开发语言/Java教程/Spring开发/访问数据库' },
                        { text: '开发Web应用', link: '/软件开发/编程基础/开发语言/Java教程/Spring开发/开发Web应用' },
                        { text: '集成第三方组件', link: '/软件开发/编程基础/开发语言/Java教程/Spring开发/集成第三方组件' },
                      ]
                    },
                    {
                      text: 'Spring Boot开发',
                      collapsed: true,
                      items: [
                        { text: '第一个Spring Boot应用', link: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/第一个Spring Boot应用' },
                        { text: '使用开发者工具', link: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/使用开发者工具' },
                        { text: '打包Spring Boot应用', link: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/打包Spring Boot应用' },
                        { text: '瘦身Spring Boot应用', link: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/瘦身Spring Boot应用' },
                        { text: '使用Actuator', link: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/使用Actuator' },
                        { text: '使用Profiles', link: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/使用Profiles' },
                        { text: '使用Conditional', link: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/使用Conditional' },
                        { text: '加载配置文件', link: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/加载配置文件' },
                        { text: '禁用自动配置', link: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/禁用自动配置' },
                        { text: '添加Filter', link: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/添加Filter' },
                        {
                          text: '集成第三方组件',
                          collapsed: true,
                          items: [
                            { text: '集成Open API', link: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/集成第三方组件/集成Open API' },
                            { text: '访问Redis', link: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/集成第三方组件/访问Redis' },
                            { text: '集成Artemis', link: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/集成第三方组件/集成Artemis' },
                            { text: '集成RabbitMQ', link: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/集成第三方组件/集成RabbitMQ' },
                            { text: '集成Kafka', link: '/软件开发/编程基础/开发语言/Java教程/Spring Boot开发/集成第三方组件/集成Kafka' },
                          ]
                        },
                      ]
                    },
                    { text: 'Spring Cloud开发', link: '/软件开发/编程基础/开发语言/Java教程' },
                  ]
                }
              ]
            },
            {
              text: '数据结构',
              collapsed: true,
              items: []
            },
            {
              text: '常用算法',
              collapsed: true,
              items: [
                { text: 'NIO模型', link: '/软件开发/编程基础/常用算法/NIO模型' },
                { text: '一致性哈希算法', link: '/软件开发/编程基础/常用算法/一致性哈希算法' },
              ]
            },
            {
              text: '设计模式',
              collapsed: true,
              items: [
                { text: '设计模式简介', link: '/软件开发/编程基础/设计模式/设计模式简介' },
                { text: '创建型模式', link: '/软件开发/编程基础/设计模式/创建型模式' },
                { text: '结构型模式', link: '/软件开发/编程基础/设计模式/结构型模式' },
                { text: '行为型模式', link: '/软件开发/编程基础/设计模式/行为型模式' },
              ]
            },
            {
              text: '网络编程',
              collapsed: true,
              items: [
                { text: '网络编程基础', link: '/软件开发/编程基础/网络编程/网络编程基础' },
                { text: 'TCP编程', link: '/软件开发/编程基础/网络编程/TCP编程' },
                { text: 'UDP编程', link: '/软件开发/编程基础/网络编程/UDP编程' },
                { text: '发送Email', link: '/软件开发/编程基础/网络编程/发送Email' },
                { text: '接收Email', link: '/软件开发/编程基础/网络编程/接收Email' },
                { text: 'HTTP编程', link: '/软件开发/编程基础/网络编程/HTTP编程' },
                { text: 'RMI远程调用', link: '/软件开发/编程基础/网络编程/RMI远程调用' },
              ]
            },
            {
              text: 'SQL教程',
              collapsed: true,
              items: [
                { text: '关系数据库概述', link: '/软件开发/编程基础/SQL教程/关系数据库概述' },
                { text: '安装MySQL', link: '/软件开发/编程基础/SQL教程/安装MySQL' },
                { text: '关系模型', link: '/软件开发/编程基础/SQL教程/关系模型' },
                { text: '查询数据', link: '/软件开发/编程基础/SQL教程/查询数据' },
                { text: '修改数据', link: '/软件开发/编程基础/SQL教程/修改数据' },
                { text: 'MySQL', link: '/软件开发/编程基础/SQL教程/MySQL' },
                { text: '事务', link: '/软件开发/编程基础/SQL教程/事务' },
              ]
            },
          ]
        },
        {
          text: '架构设计',
          items: [
            { text: '架构五要素', link: '/软件开发/架构设计/架构五要素' },
            {
              text: '分布式',
              collapsed: true,
              items: [
                { text: '理论&算法&协议', link: '/软件开发/架构设计/分布式/理论&算法&协议' },
                { text: 'RPC', link: '/软件开发/架构设计/分布式/RPC' },
                { text: 'ZooKeeper', link: '/软件开发/架构设计/分布式/ZooKeeper' },
                { text: 'API网关', link: '/软件开发/架构设计/分布式/API网关' },
                { text: '分布式ID', link: '/软件开发/架构设计/分布式/分布式ID' },
                { text: '分布式锁', link: '/软件开发/架构设计/分布式/分布式锁' },
                { text: '分布式事务', link: '/软件开发/架构设计/分布式/分布式事务' },
                { text: '分布式配置中心', link: '/软件开发/架构设计/分布式/分布式配置中心' },
              ]
            },
            {
              text: '高可用',
              collapsed: true,
              items: [
                { text: '冗余设计', link: '/软件开发/架构设计/高可用/冗余设计' },
                { text: '负载均衡', link: '/软件开发/架构设计/高可用/负载均衡' },
                { text: '限流', link: '/软件开发/架构设计/高可用/限流' },
                { text: '降级&熔断', link: '/软件开发/架构设计/高可用/降级&熔断' },
                { text: '超时&重试', link: '/软件开发/架构设计/高可用/超时&重试' },
              ]
            }
          ]
        },
        {
          text: '软件架构',
          items: [
            { text: '基础组件设计核心思路', link: '/软件开发/软件架构/基础组件设计核心思路' },
            { text: '通用可编排状态机引擎设计', link: '/软件开发/软件架构/通用可编排状态机引擎设计' },
            { text: '支付系统', link: '/软件开发/软件架构/支付系统' },
          ]
        },
        {
          text: '中间件',
          items: [
            { text: '消息队列', link: '/软件开发/中间件/消息队列' },
            { text: '缓存', link: '/软件开发/中间件/缓存' },
            { text: '数据库读写分离&分库分表', link: '/软件开发/中间件/数据库读写分离&分库分表' },
            { text: '数据同步', link: '/软件开发/中间件/数据同步' },
            { text: '分布式任务调度', link: '/软件开发/中间件/分布式任务调度' },
          ]
        },
        {
          text: '实战总结',
          items: [
            { text: '常见异常解决方案', link: '/软件开发/实战总结/常见异常解决方案' },
            { text: 'Java', link: '/软件开发/实战总结/Java' },
            { text: 'Spring & Spring Boot', link: '/软件开发/实战总结/Spring & Spring Boot' },
            { text: 'MySQL', link: '/软件开发/实战总结/MySQL' },
            { text: 'Vue.js', link: '/软件开发/实战总结/Vue.js' },
            { text: '其他', link: '/软件开发/实战总结/其他' },
          ]
        },
      ],
      '/个人项目': [
        {
          text: 'yutool组件式框架',
          items: [
            { text: 'yutool模块划分', link: '/个人项目/yutool组件式框架/yutool模块划分' },
            {
              text: 'yutool-orm ORM组件',
              collapsed: true,
              items: [
                { text: 'yutool-orm-core', link: '/个人项目/yutool组件式框架/yutool-orm ORM组件/yutool-orm-core' },
                { text: 'yutool-orm-mybatis', link: '/个人项目/yutool组件式框架/yutool-orm ORM组件/yutool-orm-mybatis' },
                { text: 'yutool-orm-jpa', link: '/个人项目/yutool组件式框架/yutool-orm ORM组件/yutool-orm-jpa' },
              ]
            },
            { text: '[归档] yutool-cache缓存组件', link: '/个人项目/yutool组件式框架/[归档] yutool-cache缓存组件' },
            { text: '[归档] yutool-mq消息组件', link: '/个人项目/yutool组件式框架/[归档] yutool-mq消息组件' },
            {
              text: 'yutool-mq消息组件',
              collapsed: true,
              items: [
                { text: 'yutool-mq-core', link: '/个人项目/yutool组件式框架/yutool-mq消息组件/yutool-mq-core' },
                { text: 'yutool-mq-kafka', link: '/个人项目/yutool组件式框架/yutool-mq消息组件/yutool-mq-kafka' },
                { text: 'yutool-mq-rabbitmq', link: '/个人项目/yutool组件式框架/yutool-mq消息组件/yutool-mq-rabbitmq' },
                { text: 'yutool-mq-rocketmq', link: '/个人项目/yutool组件式框架/yutool-mq消息组件/yutool-mq-rocketmq' },
              ]
            },
            { text: '[归档] yutool-push推送组件', link: '/个人项目/yutool组件式框架/[归档] yutool-push推送组件' },
            {
              text: 'yutool-push推送组件',
              collapsed: true,
              items: [
                { text: 'yutool-push-core', link: '/个人项目/yutool组件式框架/yutool-push推送组件/yutool-push-core' },
                { text: 'yutool-push-provider', link: '/个人项目/yutool组件式框架/yutool-push推送组件/yutool-push-provider' },
              ]
            },
            { text: 'yutool-file-server文件服务', link: '/个人项目/yutool组件式框架/yutool-file-server文件服务' },
            { text: 'yutool-ldap LDAP组件', link: '/个人项目/yutool组件式框架/yutool-ldap LDAP组件' },
            { text: 'yutool-social第三方登录组件', link: '/个人项目/yutool组件式框架/yutool-social第三方登录组件' },
            { text: 'yutool-state状态机组件', link: '/个人项目/yutool组件式框架/yutool-state状态机组件' },
            { text: 'yutool-search搜索引擎组件', link: '/个人项目/yutool组件式框架/yutool-search搜索引擎组件' },
            {
              text: 'yutool-plugins插件机制',
              collapsed: true,
              items: [
                { text: 'api-idempotent接口幂等插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/api-idempotent接口幂等插件' },
                { text: 'api-logger接口访问日志插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/api-logger接口访问日志插件' },
                { text: 'audit-logger审计日志插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/audit-logger审计日志插件' },
                { text: 'auth-filter权限过滤插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/auth-filter权限过滤插件' },
                { text: 'distributed-lock分布式锁插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/distributed-lock分布式锁插件' },
                { text: '[归档] dynamic-thread-pool动态线程池管理插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/[归档] dynamic-thread-pool动态线程池管理插件' },
                { text: 'history-data历史数据处理插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/history-data历史数据处理插件' },
                { text: 'import-export数据导入导出插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/import-export数据导入导出插件' },
                { text: 'jwt-helper JWT工具插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/jwt-helper JWT工具插件' },
                { text: '[归档] multi-ds-tx多数据源事务插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/[归档] multi-ds-tx多数据源事务插件' },
                { text: 'native-mobile本地手机号登录插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/native-mobile本地手机号登录插件' },
                { text: 'sms-reply-storage短信回复内容存储插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/sms-reply-storage短信回复内容存储插件' },
                { text: 'sms-verify短信验证码插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/sms-verify短信验证码插件' },
                { text: 'swagger-support Swagger接口文档插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/swagger-support Swagger接口文档插件' },
                { text: 'trace-analysis链路追踪插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/trace-analysis链路追踪插件' },
                { text: 'cache-adapter缓存适配插件', link: '/个人项目/yutool组件式框架/yutool-plugins插件机制/cache-adapter缓存适配插件' },
              ]
            },
          ]
        },
        {
          text: 'yutool-cli高效工作套件',
          items: [
            { text: 'yutool-cli功能清单', link: '/个人项目/yutool-cli高效工作套件/yutool-cli功能清单' },
            { text: 'yutool-cli运营模式', link: '/个人项目/yutool-cli高效工作套件/yutool-cli运营模式' },

          ]
        },
        {
          text: 'yutool-metadata元数据',
          items: [
            { text: '元数据自定义对象管理设计', link: '/个人项目/yutool-metadata元数据/元数据自定义对象管理设计' },
          ]
        },
        {
          text: 'yutool-biz业务组件',
          items: [
            { text: 'yutool-biz 整体设计', link: '/个人项目/yutool-biz业务组件/yutool-biz 整体设计' },
            { text: 'yutool-api API接口', link: '/个人项目/yutool-biz业务组件/yutool-api API接口' },
            { text: 'yutool-auth 认证授权', link: '/个人项目/yutool-biz业务组件/yutool-auth 认证授权' },
            { text: 'yutool-user 用户', link: '/个人项目/yutool-biz业务组件/yutool-user 用户' },
            { text: 'yutool-org 组织架构', link: '/个人项目/yutool-biz业务组件/yutool-org 组织架构' },
            { text: 'yutool-address 地址', link: '/个人项目/yutool-biz业务组件/yutool-address 地址' },
            { text: 'yutool-dict 数据字典', link: '/个人项目/yutool-biz业务组件/yutool-dict 数据字典' },
            { text: 'yutool-notify 通知消息', link: '/个人项目/yutool-biz业务组件/yutool-notify 通知消息' },
            { text: 'yutool-exchange 数据中转', link: '/个人项目/yutool-biz业务组件/yutool-exchange 数据中转' },
            { text: 'admin-ui 管理界面', link: '/个人项目/yutool-biz业务组件/admin-ui 管理界面' },
          ]
        },
        {
          text: 'yupan网盘',
          items: [
            { text: 'yupan架构', link: '/个人项目/yupan网盘/yupan架构' },
            { text: '商城页面', link: '/个人项目/yupan网盘/商城页面' },
            { text: 'shop商城', link: '/个人项目/yupan网盘/shop商城' },
            { text: 'vip会员', link: '/个人项目/yupan网盘/vip会员' },
          ]
        },
      ],
      '/生活记录': [
        {
          text: '山水游记',
          items: [
            {
              text: '中国 China',
              collapsed: true,
              items: [
                {
                  text: '广东',
                  collapsed: true,
                  items: [
                    {
                      text: '深圳',
                      collapsed: true,
                      items: [
                        { text: '深圳十峰', link: '/生活记录/山水游记/中国 China/广东/深圳/深圳十峰' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              text: '泰国 Thailand',
              collapsed: true,
              items: []
            }
          ]
        },
        {
          text: '酷玩数码',
          items: [
            {
              text: '极空间',
              collapsed: true,
              items: [
                { text: '极空间Docker使用攻略', link: '/生活记录/酷玩数码/极空间/极空间Docker使用攻略' }
              ]
            },
            {
              text: '树莓派',
              collapsed: true,
              items: [
                { text: '树莓派系统安装及配置', link: '/生活记录/酷玩数码/树莓派/树莓派系统安装及配置' },
                { text: '运行情况监控', link: '/生活记录/酷玩数码/树莓派/运行情况监控' },
                { text: '基于Aria2的下载机', link: '/生活记录/酷玩数码/树莓派/基于Aria2的下载机' },
                { text: '搭建v2rayA', link: '/生活记录/酷玩数码/树莓派/搭建v2rayA' },
                { text: 'web控制台cockpit', link: '/生活记录/酷玩数码/树莓派/web控制台cockpit' },
                { text: '使用rclone同步onedrive', link: '/生活记录/酷玩数码/树莓派/使用rclone同步onedrive' },
                { text: 'yutool-cli高效工作套件', link: '/生活记录/酷玩数码/树莓派/yutool-cli高效工作套件' },
              ]
            },
          ]
        },
        {
          text: '阅读书单',
          items: [
            { text: '阅读计划', link: '/生活记录/阅读书单/阅读计划' },
            {
              text: '阅读笔记',
              collapsed: true,
              items: []
            },
          ]
        }
      ],
      '/站点收录': [
        { text: '技术博客', link: '/站点收录/技术博客' },
        { text: '在线工具', link: '/站点收录/在线工具' },
        { text: '免费素材', link: '/站点收录/免费素材' },
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yupaits' }
    ],

    outline: {
      level: [2, 4],
      label: '大纲',
    },

    footer: {
      message: '版权声明：本博客所有文章除特别声明外，均采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> 许可协议。转载请注明来自 <a href="https://blog.yupaits.com">yupaits notes</a>',
      copyright: 'Copyright © 2016-present <a href="mailto:ts495606653@hotmail.com">yupaits</a>'
    },

    search: {
      provider: 'local'
    },

    lastUpdated: true,
    lastUpdatedText: '上次编辑于',

    editLink: {
      pattern: 'http://gitea.yupaits.com/yupaits/blog-md/src/branch/main/docs/:path',
      text: '编辑此页'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    darkModeSwitchLabel: '暗黑模式',
    sidebarMenuLabel: '文章列表',
    returnToTopLabel: '回到顶部',
    externalLinkIcon: true,
  },
  markdown: {
    theme: { light: 'slack-ochin', dark: 'monokai' },
    lineNumbers: true,
    config: (md) => {
      md.use(MarkdownItTaskLists)
    }
  }
})