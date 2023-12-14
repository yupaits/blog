# yutool模块划分

yutool的模块主要分为两大部分：组件和插件。部分设计思路记录在博客[《基础组件设计》](/软件开发/软件架构/基础组件设计核心思路)中。

组件：将业务系统中比较复杂的公共逻辑抽象成可扩展的公共组件，方便应用程序快速接入，约定大于配置，需要遵循组件的设计规范。
插件：轻量级，非必需，按需引入，灵活可扩展。

目前yutool整合的组件和插件有以下这些：

**注：**
- [x] 表示已经经过测试使用验证

## 组件

- ~~yutool-cache~~：缓存组件，支持二级缓存（本地缓存和分布式缓存），通过缓存注解控制缓存的刷新和过期
    - v1.2.6 组件移除，使用JetCache替换
    - v1.2.7 新增cache-adapter插件
- [x] yutool-file-server：文件服务，文件的上传下载，支持租户隔离、防盗链
- [x] yutool-ldap：LDAP组件，接入主流的LDAP服务
- [ ] yutool-mq：消息队列，支持延迟队列，支持以下消息中间件：
    - RabbitMQ
    - RocketMQ
    - Kafka
- [x] yutool-orm：ORM组件，整合了Spirng生态主流的Mybatis Plus和JPA框架，并加入了实际场景中DTO和VO对象的处理逻辑
- [ ] yutool-push：消息推送服务，支持5种消息类型的推送：
    - 移动APP通知
    - Web网页消息
    - sms短信
    - Email电子邮件
    - IM消息
    
    通过统一的消息发送入口，按需路由到指定的消息渠道进行消息推送
- [ ] yutool-social：社交账号登录（第三方登录）组件，整合各大主流社交平台第三方登录功能并统一入口 
- [ ] yutool-state：状态机引擎，抽象主要的状态机应用场景，将状态机状态迁移的整个过程的处理接口标准化
- [ ] yutool-search：搜索引擎组件，基于redisearch开发的轻量级搜索引擎组件，支持中文分词

## 插件

- [x] api-idempotent：接口幂等检查，基于MySQL数据库主键的幂等性校验
- [x] api-logger：接口请求日志，记录接口请求的各项信息
- [x] audit-logger：审计日志，字段维度的审计处理记录
- [x] auth-filter：权限过滤，用户、角色、部门多维度权限过滤，扩展的自定义权限过滤接口
- [x] distributed-lock：分布式锁（基于Redis实现）
- ~~dynamic-thread-pool~~：动态线程池管理
    - v1.2.7 插件移除，使用DynamicTp替换
- [x] history-data：历史数据清理，通过配置项实现历史数据的清除或转移
- [x] jwt-helper：JWT工具
- [ ] native-mobile：本机号码登录
- [ ] sms-reply-storage：短信回复存储，用于向用户推送服务短信之后，接收并存储用户回复的短信内容
- [ ] sms-verify：短信验证码
- [x] swagger-support：swagger接口文档支持
- [x] import-export：数据导入导出插件，基于EasyExcel实现
- ~~multi-ds-tx~~：多数据源切换和事务控制插件，抽取dynamic-datasource本地事务控制核心代码二次封装进行实现
    - v1.2.7 插件移除，使用Dynamic-Datasource 4.0.0+替换
- [ ] trace-analysis：链路追踪插件
- [x] cache-adapter：基于Redis和Caffeine适配Spring Cache实现的二级缓存
