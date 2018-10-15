module.exports = {
    base: "/",
    head: [
        ['link', { rel: 'icon', href: '/logo.jpg' }] //设置favicon
    ],
    dest: "dist",
    locales: {
        "/": {
            lang: "zh-CN",
            title: "YupaiTS的博客",
            description: "俯仰一生，最惧无为。",
        }
    },
    themeConfig: {
        displayAllHeaders: false, //显示所有页面的标题链接，默认只展开显示当前页面的标题链接
        activeHeaderLinks: true, //活动的标题链接，可随鼠标上下滑动自动激活标题侧边栏标题高亮，需要markdown.anchor.permalink: true
        repo: "https://github.com/YupaiTS",
        docsRepo: "https://github.com/YupaiTS/blog",
        docsDir: 'post',
        docsBranch: 'master',
        editLinks: true,
        locales: {
            "/": {
                label: '简体中文',
                selectText: '选择语言',
                editLinkText: '在 GitHub 上编辑此页',
                lastUpdated: '上次更新',
                nav: [{
                        text: 'Java',
                        items: [
                            { text: 'String.format的用法', link: '/java/format-usage' },
                            { text: 'Java集合杂谈', link: '/java/collection-example' },
                            { text: 'Java运算符instanceof的用法', link: '/java/instanceof' },
                            { text: 'Java枚举类实例', link: '/java/enum-sample' },
                            { text: 'Java递归的实践', link: '/java/recursion' },
                        ]
                    },
                    {
                        text: 'Golang',
                        items: [
                            { text: 'web框架Gin使用手册', link: '/golang/gin-doc' },
                            { text: 'ORM框架gorm使用手册', link: '/golang/gorm' },
                            { text: '爬虫框架go_spider', link: '/golang/go-spider' },
                        ]
                    },
                    {
                        text: '系列专题',
                        items: [
                            { text: 'Java基础知识', link: '/topics/java-base/base-syntax/' },
                            { text: 'Java进阶知识', link: '/topics/java-advanced/' },
                            { text: 'JVM虚拟机', link: '/topics/java-jvm/' },
                            { text: 'Spring/Spring Boot讲解', link: '/topics/spring-springboot-knowledge/' },
                            { text: 'Spring Boot示例', link: '/topics/springboot-samples' },
                            { text: '基于Spring Cloud快速搭建微服务', link: '/topics/spring-cloud/' },
                            { text: 'Docker入门攻略', link: '/topics/docker/' },
                            { text: '设计模式', link: '/topics/design-pattern/' },
                        ]
                    },
                    {
                        text: '运维部署',
                        items: [
                            { text: 'Full GC排查流程', link: '/ops-deploy/full-gc-troubleshoot.md' },
                            { text: '最佳日志实践', link: '/ops-deploy/best-log-practice.md' },
                            { text: 'GitLab-CI环境搭建与SpringBoot项目CI配置总结', link: '/ops-deploy/gitlab-ci-springboot' },
                            { text: '使用Gitee+Jenkins+Docker完成前后端分离项目的CI/CD', link: '/ops-deploy/gitee-jenkins-docker-ci-cd' },
                            { text: '使用GitHub和Jenkins自动构建并部署静态页面', link: '/ops-deploy/github-jenkins-ci-cd' },
                            { text: '通过开启swap分区解决小内存阿里云服务器的运行瓶颈', link: '/ops-deploy/enable-swap' },
                            { text: 'Linux常用指令', link: '/ops-deploy/linux-command' },
                            { text: 'RabbitMQ安装部署及常见问题', link: '/ops-deploy/rabbitmq-deploy' },
                            { text: '阿里云服务器环境搭建', link: '/ops-deploy/aliyun-server-environment' },
                            { text: '阿里云Linux服务器格式化和挂载数据盘', link: '/ops-deploy/aliyun-linux-disk-mount' },
                        ]
                    },
                    {
                        text: '实用工具',
                        items: [
                            { text: 'Linux下安装Confluence', link: '/tools/linux-confluence' },
                            { text: 'Markdown语法', link: '/tools/markdown-syntax' },
                            { text: 'cron语法简单总结', link: '/tools/cron-syntax' },
                            { text: '使用hexo快速搭建个人博客', link: '/tools/hexo-blog' },
                            { text: '搭建 GitLab 私有代码托管', link: '/tools/deploy-gitlab' },
                        ]
                    },
                    {
                        text: '实战总结',
                        items: [
                            { text: '常见异常解决方案总结', link: '/in-action/exception-solution' },
                            { text: '开发实战总结', link: '/in-action/in-action-summary' },
                            { text: 'GitLab使用手册', link: '/in-action/gitlab-manual' },
                            { text: 'SpringBoot和Vue单页面前后端分离项目的整合与构建', link: '/in-action/springboot-vue-build' },
                            { text: 'Git分支管理', link: '/in-action/git-branch-manage' },
                            { text: '从Ultimate-Spider全方位解析数据采集系统的基本知识', link: '/in-action/ultimate-spider-knowledge' },
                            { text: '开源项目License的介绍', link: '/in-action/open-source-license' },
                            { text: 'Todo-Tomato技术解读', link: '/in-action/todo-tomato-knowledge' },
                            { text: '微信公众号管理平台的实现', link: '/in-action/wechat-admin' },
                            { text: 'weixin-java-tools微信JavaSDK开发工具包', link: '/in-action/weixin-java-tools' },
                        ]
                    },
                    { text: '阅读书单', link: '/books' },
                    { text: '关于我', link: '/about' },
                ],
                sidebar: {
                    '/topics/design-pattern/': [
                        getSidebarConfig('设计模式', '', [
                            '', 'factory', 'decorator', 'adapter', 'observer', 'chain-of-responsibility', 'strategy', 'composite', 'template-method', 'proxy'
                        ])
                    ],
                    '/topics/spring-springboot-knowledge/': [
                        getSidebarConfig('Spring/Spring Boot讲解', '', [
                            '', 'spring-knowledge-points',
                        ])
                    ],
                    '/topics/spring-cloud/': [
                        getSidebarConfig('基于Spring Cloud快速搭建微服务', '', [
                            '', 'undertow', 'ribbon', 'config-server', 'bus-amqp', 'hystrix', 'admin-dashboard', 'sleuth', 'security', 'api-gateway'
                        ])
                    ],
                    '/topics/docker/': [
                        getSidebarConfig('Docker入门攻略', '', [
                            '', 'Dockerfile', 'docker-image', 'docker-container', 'docker-compose-yml', 'docker-compose'
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
                            '', 'byte-stream', 'stream', 'convert-stream', 'zip-stream'
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
                        getSidebarConfig('Java并发包', 'concurrent/', ['', 'concurrent-collection']),
                        getSidebarConfig('Netty', 'netty/', [''])
                    ],
                    '/topics/java-jvm/': [
                        getSidebarConfig('JVM虚拟机', '', ['', 'class-loader', 'gc']),
                        getSidebarConfig('JVM调优', 'tuning/', [
                            '', 'console', 'tuning-collection'
                        ])
                    ]
                }
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