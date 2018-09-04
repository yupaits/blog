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
            text: '系列专题',
            items: [
                { text: 'Java基础知识', link: '/topics/java-base/base-syntax/' },
                { text: 'Java进阶知识', link: '/topics/java-advanced/' },
                { text: 'JVM虚拟机', link: '/topics/java-jvm/' },
                { text: '基于Spring Cloud快速搭建微服务', link: '/topics/spring-cloud/' },
                { text: 'Docker入门攻略', link: '/topics/docker/' },
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
        sidebar: {
            '/topics/spring-cloud/': [
                getSidebarConfig('基于Spring Cloud快速搭建微服务', '', [
                    '', '1', '2', '3', '4', '5', '6', '7', '8', '9'
                ])
            ],
            '/topics/docker/': [
                getSidebarConfig('Docker入门攻略', '', [
                    '', '1', '2', '3', '4', '5'
                ])
            ],
            '/topics/java-base/': [
                getSidebarConfig('基本语法', 'base-syntax/', [
                    '', 'operator', 'choose-loop', 'class-object', 'extend-implements', 'exception', 'package-jar', 
                    'serialize-deserialize', 'regex', 'overload-override'
                ]),
                getSidebarConfig('集合', 'collection/', [
                    '', 'set', 'list', 'queue', 'map'
                ]),
                getSidebarConfig('线程', 'thread/', [
                    '', 'runnable', 'callable', 'thread-state', 'thread-priority'
                ]),
                getSidebarConfig('IO', 'io/', [
                    '', 'byte-stream', 'stream', 'convert-stream', 'compress-stream'
                ]),
                getSidebarConfig('网络', 'net/', ['', 'udp']),
                getSidebarConfig('泛型', 'generic/', ['']),
                getSidebarConfig('反射', 'reflection/', ['', 'invoke', 'dynamic-proxy']),
                getSidebarConfig('源码分析', 'sourcecode/', [
                    '', 'LinkedList', 'CopyOnWriteArrayList', 'HashMap', 'LinkedHashMap', 'ConcurrentHashMap'
                ]),
            ],
            '/topics/java-advanced/': [
                getSidebarConfig('Java进阶', '', [
                    '', 'regex', 'lock', 'common-libs', 'system-property', 'lambda', 'java-thread', 'threadlocal',
                    'hashmap-expansion', 'exception', 'problems'
                ]),
                getSidebarConfig('NIO', 'nio/', ['', 'tomcat-nio-model', 'epoll-selector', 'linux-io']),
                getSidebarConfig('Java多线程', 'thread/', ['', '1', '2']),
                getSidebarConfig('Java并发包', 'concurrent/', [
                    '', 'concurrent-collection', 'cyclic-barrier', 'countdown-latch', 'semaphore'
                ]),
                getSidebarConfig('Netty', 'netty/', [''])
            ],
            '/topics/java-jvm/': [
                getSidebarConfig('JVM虚拟机', '', ['', 'class-loader', 'gc']),
                getSidebarConfig('JVM调优', 'tuning/', [
                    '', 'console', 'gc', 'online-shop', 'knowledge-collection', 'concurrent-params'
                ]),
                getSidebarConfig('JVM调优工具', 'tuning-tools/', ['']),
            ]
        }
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
