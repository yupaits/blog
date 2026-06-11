# go-yutool介绍

近期在做yutool相关项目的技术升级工作，直接升级到Java25版本，也用上了带`GraalVM`的`LibericaNIK-25-OpenJDK-25`。Spring Boot版本一步到位升级到4.0+版本，**虚拟线程**在升级3.5.x版本时也是早早就用上了。为了适配Spring Boot 4.0.x版本，光迁移到`Jackson3`就花了不少时间，也尝鲜了使用`GraalVM`构建的`native-image`等。

这些新技术确实将Java项目的工程化和性能都提升到了新的高度，但却也成为了让我下定决心使用Golang生态重构yutool等项目的导火索。原因主要有以下几点：
1. Java项目现在确实更轻更快更成熟了，但对比Rust/Golang等**依然很重**。简单对比一组数据：
    - Golang版本yupan应用：Docker镜像只有`60MB`，运行内存在`20MB`以内
    - Java版本yupan应用：在我个人能力范围内，勉强能将Docker镜像体积控制在`390MB`左右，运行内存在`500MB~600MB`之间
2. Golang经过这么多年的发展，生态也是相当成熟。主流框架经过长时间的迭代和维护，已经稳如老狗。
3. Golang项目的编译速度很快，本地调试快捷方便。`GOPRIVATE`让git代码仓库直接化身二方库，代码库的`commit hash`就是版本号，天才的设计。`go mod`彻底解决项目依赖管理的痛点，更有`go mod vendor`能一键打包所有依赖的类库源码到本地项目中，直接锁定依赖的代码源码，而不是版本号，并且在CI/CD构建过程中无需再次下载。

记得上一次使用Golang还是在上一次（7年前），那个时候主要是为了学习Go语言以及开发一些小工具，生态也没有那么成熟，现如今使用Golang进行web项目开发已成主流。

此次使用Golang重构yutool项目时，还是选择以下主流框架：
- [Gin](https://gin-gonic.com/zh-cn/) 最快的 Go 语言全功能 Web 框架。简洁明了。
- [Gorm](https://gorm.io/zh_CN/docs/index.html) 一个致力于对开发者友好的优秀 Golang ORM 库。
- [Viper](https://github.com/spf13/viper) Go 应用的完整配置解决方案。

go-yutool的模块说明：

| <nobr>模块</nobr> | 简介                                            | <nobr>验收</nobr> | <nobr>版本变更</nobr> |
|:---------------:|-----------------------------------------------|:---------------:|-------------------|
|     commons     | 公共模块，包括常量、接口返回码、业务异常定义、参数检查、JSON序列化/反序列化扩展、工具类等 |        ✔        |                   |
|     config      | 配置管理，基于viper，支持从nacos加载应用配置                   |        ✔        |                   |
|       orm       | orm组件，基于gorm，支持分页查询(聚合查询)、数据审计、逻辑删除、乐观锁、雪花ID  |        ✔        |                   |
|     router      | web路由，基于gin，支持常用参数绑定、全局error处理                |        ✔        |                   |
|      oauth      | OAuth认证，支持接入Logto认证服务                         |        ✔        |                   |
|       oss       | 对象存储，文件服务，使用minio-sdk支持接入S3存储服务               |        ✔        |                   |
|      cache      | 缓存，基于fido                                     |        ✔        |                   |
|      cron       | 定时任务调度，基于robfig/cron                          |        ✔        |                   |
|      menu       | 系统菜单管理                                        |        ✔        |                   |