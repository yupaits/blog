import { defineConfig } from 'vitepress'
import MarkdownItTaskLists from 'markdown-it-task-lists'

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
      { text: '技术博客', link: '/技术博客/' },
      { text: '文章收录', link: '/文章收录' },
      { text: '软件开发', link: '/软件开发/实战总结/常见异常解决方案' },
      { text: '个人项目', link: '/个人项目/yutool组件式框架/yutool模块划分' },
      { text: '项目文档', link: '/项目文档' },
      { text: '生活记录', link: '/生活记录' },
    ],

    sidebar: {
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
      '/个人项目': [
        {
          text: 'yutool组件式框架',
          collapsed: false,
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
            { text: 'yutool-state状态机引擎', link: '/个人项目/yutool组件式框架/yutool-state状态机引擎' },
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
          collapsed: false,
          items: [
            { text: 'yutool-cli功能清单', link: '/个人项目/yutool-cli高效工作套件/yutool-cli功能清单' },
            { text: 'yutool-cli运营模式', link: '/个人项目/yutool-cli高效工作套件/yutool-cli运营模式' },

          ]
        },
        {
          text: 'yutool-metadata元数据',
          collapsed: false,
          items: [
            { text: '元数据自定义对象管理设计', link: '/个人项目/yutool-metadata元数据/元数据自定义对象管理设计' },
          ]
        },
        {
          text: 'yutool-biz业务组件',
          collapsed: false,
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
          collapsed: false,
          items: [
            { text: 'yupan架构', link: '/个人项目/yupan网盘/yupan架构' },
            { text: '商城页面', link: '/个人项目/yupan网盘/商城页面' },
            { text: 'shop商城', link: '/个人项目/yupan网盘/shop商城' },
            { text: 'vip会员', link: '/个人项目/yupan网盘/vip会员' },

          ]
        },
      ],
      '/项目文档': [],
      '/生活记录': [],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yupaits' }
    ],

    outline: {
      level: [2, 4],
      label: '大纲'
    },

    footer: {
      message: '转载文章请注明来源，违者必究！',
      copyright: 'Copyright © 2016-present yupaits'
    }
  },
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    lineNumbers: true,
    config: (md) => {
      md.use(MarkdownItTaskLists)
    }
  }
})
