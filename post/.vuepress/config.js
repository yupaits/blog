module.exports = {
    title: "YupaiTS的博客",
    description: "个人技术博客",
    base: "/",
    head: [
        ['link', { rel: 'icon', href: '/logo.jpg' }] //设置favicon
    ],
    dest: "docs",
    themeConfig: {
        displayAllHeaders: false, //显示所有页面的标题链接，默认只展开显示当前页面的标题链接
        activeHeaderLinks: true, //活动的标题链接，可随鼠标上下滑动自动激活标题侧边栏标题高亮，需要markdown.anchor.permalink: true
        lastUpdated: '上次更新',
        docsRepo: 'https://github.com/YupaiTS/yupaits.github.io',
        docsDir: 'post',
        docsBranch: 'master',
        editLinks: true,
        editLinkText: '编辑此页',
        nav: [{
                text: 'Java',
                items: [
                    { text: 'String.format的用法', link: '/java/5' },
                    { text: 'Java集合杂谈', link: '/java/4' },
                    { text: 'Java运算符instanceof的用法', link: '/java/3' },
                    { text: 'Java枚举类实例', link: '/java/2' },
                    { text: 'Java递归的实践', link: '/java/1' },
                ]
            },
            {
                text: 'Spring Cloud',
                items: [
                    { text: '快速搭建微服务-注册中心、服务发现', link: '/spring-cloud/10' },
                    { text: '快速搭建微服务-服务容器', link: '/spring-cloud/9' },
                    { text: '快速搭建微服务-服务调用', link: '/spring-cloud/8' },
                    { text: '快速搭建微服务-配置中心', link: '/spring-cloud/7' },
                    { text: '快速搭建微服务-消息总线', link: '/spring-cloud/6' },
                    { text: '快速搭建微服务-熔断器', link: '/spring-cloud/5' },
                    { text: '快速搭建微服务-服务监控', link: '/spring-cloud/4' },
                    { text: '快速搭建微服务-服务链路追踪', link: '/spring-cloud/3' },
                    { text: '快速搭建微服务-服务安全', link: '/spring-cloud/2' },
                    { text: '快速搭建微服务-API网关', link: '/spring-cloud/1' },
                ]
            },
            {
                text: 'Docker',
                items: [
                    { text: 'Docker容器命令', link: '/docker/6' },
                    { text: '安装Docker', link: '/docker/5' },
                    { text: 'Dockerfile指令', link: '/docker/4' },
                    { text: 'Docker镜像命令', link: '/docker/3' },
                    { text: 'docker-compose.yml命令', link: '/docker/2' },
                    { text: 'docker-compose命令', link: '/docker/1' },
                ]
            },
            {
                text: '运维部署',
                items: [
                    { text: 'GitLab-CI环境搭建与SpringBoot项目CI配置总结', link: '/ops-deploy/8' },
                    { text: '使用Gitee+Jenkins+Docker完成前后端分离项目的CI/CD', link: '/ops-deploy/7' },
                    { text: '使用GitHub和Jenkins自动构建并部署静态页面', link: '/ops-deploy/6' },
                    { text: '通过开启swap分区解决小内存阿里云服务器的运行瓶颈', link: '/ops-deploy/5' },
                    { text: 'Linux常用指令', link: '/ops-deploy/4' },
                    { text: 'RabbitMQ安装部署及常见问题', link: '/ops-deploy/3' },
                    { text: '阿里云服务器环境搭建', link: '/ops-deploy/2' },
                    { text: '阿里云Linux服务器格式化和挂载数据盘', link: '/ops-deploy/1' },
                ]
            },
            {
                text: '实用工具',
                items: [
                    { text: 'Linux下安装Confluence', link: '/tools/5' },
                    { text: 'Markdown语法', link: '/tools/4' },
                    { text: 'cron语法简单总结', link: '/tools/3' },
                    { text: '使用hexo快速搭建个人博客', link: '/tools/2' },
                    { text: '搭建 GitLab 私有代码托管', link: '/tools/1' },
                ]
            },
            {
                text: '实战总结',
                items: [
                    { text: '常见异常解决方案总结', link: '/in-action/10' },
                    { text: '开发实战总结', link: '/in-action/9' },
                    { text: 'GitLab使用手册', link: '/in-action/8' },
                    { text: 'SpringBoot和Vue单页面前后端分离项目的整合与构建', link: '/in-action/7' },
                    { text: 'Git分支管理', link: '/in-action/6' },
                    { text: '从Ultimate-Spider全方位解析数据采集系统的基本知识', link: '/in-action/5' },
                    { text: '开源项目License的介绍', link: '/in-action/4' },
                    { text: 'Todo-Tomato技术解读', link: '/in-action/3' },
                    { text: '微信公众号管理平台的实现', link: '/in-action/2' },
                    { text: 'weixin-java-tools微信JavaSDK开发工具包', link: '/in-action/1' },
                ]
            },
            { text: '阅读书单', link: '/books' },
            { text: '关于我', link: '/about' },
            { text: 'GitHub', link: 'https://github.com/YupaiTS/blog' },
        ],
        sidebar: {}
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
    }
}