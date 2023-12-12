import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "yupaits notes",
  description: "yupaits notes",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: 'Examples', link: '/examples/markdown-examples' },
      { text: '技术博客', link: '/技术博客/' },
      { text: '文章收录', link: '/文章收录' },
      { text: '软件开发', link: '/软件开发/实战总结/常见异常解决方案' },
      { text: '个人项目', link: '/个人项目' },
      { text: '项目文档', link: '/项目文档' },
      { text: '生活记录', link: '/生活记录' },
    ],

    sidebar: {
      '/examples': [
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/examples/markdown-examples' },
            { text: 'Runtime API Examples', link: '/examples/api-examples' }
          ]
        }
      ],
      '/技术博客': [],
      '/文章收录': [],
      '/软件开发': [

        {
          text: '编程基础',
          collapsed: false,
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
                    { text: 'XMl与JSON', link: '/软件开发/编程基础/开发语言/Java教程/XMl与JSON' },
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
          collapsed: false,
          items: [
            { text: '架构五要素', link: '/软件开发/架构设计/架构五要素' },
          ]
        },
        {
          text: '软件架构',
          collapsed: false,
          items: [
            { text: '基础组件设计核心思路', link: '/软件开发/软件架构/基础组件设计核心思路' },
            { text: '通用可编排状态机引擎设计', link: '/软件开发/软件架构/通用可编排状态机引擎设计' },
            { text: '支付系统', link: '/软件开发/软件架构/支付系统' },
          ]
        },
        {
          text: '中间件',
          collapsed: false,
          items: [
            { text: '消息队列', link: '/软件开发/中间件/消息队列' },
            { text: '缓存', link: '/软件开发/中间件/缓存' },
            { text: '数据同步', link: '/软件开发/中间件/数据同步' },
            { text: '集群技术', link: '/软件开发/中间件/集群技术' },
            { text: '高可用', link: '/软件开发/中间件/高可用' },
            { text: '负载均衡', link: '/软件开发/中间件/负载均衡' },
          ]
        },
        {
          text: '微服务',
          collapsed: true,
          items: []
        },
        {
          text: '实战总结',
          collapsed: false,
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
      '/个人项目': [],
      '/项目文档': [],
      '/生活记录': [],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yupaits' }
    ],

    outline: {
      level: [2, 3],
      label: '大纲'
    },

    footer: {
      message: '转载文章请注明来源，违者必究！',
      copyright: 'Copyright © 2016-present yupaits'
    }
  }
})
