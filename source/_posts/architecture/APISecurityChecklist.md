---
title: API Security Checklist
date: 2020-02-05 10:09:01
category: 架构设计
tags:
  - Checklist
  - API Security
---

## 身份认证

- 不要使用Basic Auth，使用标准的认证协议（如JWT，OAuth）。
- 不要再造Authentication，token generating，password storing这些轮子，使用标准的。
- 在登录中使用Max Retry和自动封禁功能。
- 加密所有的敏感数据。

## JWT（JSON Web Token）

- 使用随机复杂的密钥（JWT Secret）以增加暴力破解的难度。
- 不要在请求体中直接提取数据，要对数据进行加密（HS256或RS256）。
- 使token的过期时间尽量的短（TTL，RTTL）。
- 不要在JWT的请求体中存放敏感数据，它是可破解的。

## OAuth 授权或认证协议

- 始终在后台验证redirect_uri，只允许白名单的URL。
- 每次交换令牌的时候不要加token（不允许response_type=token）。
- 使用state参数并填充随机的哈希数来防止跨站请求伪造（CSRF）。
- 对不同的应用分别定义默认的作用域和各自有效的作用域参数。

## 访问

- 限制流量来防止DDos攻击和暴力攻击。
- 在服务端使用HTTPS协议来防止MITM攻击。
- 使用HSTS协议防止SSLStrip攻击。

## 输入

- 使用与操作相符的HTTP操作函数，GET（读取），POST（创建），PUT（替换/更新）以及DELETE（删除记录），如果请求的方法不适用与请求的资源则返回405 Method Not Allowed。
- 在请求头中的content-type字段使用内容验证来只允许支持的格式（如application/xml，application/json等等）并在不满足条件的时候返回406 Not Acceptable。
- 验证用户输入来避免一些普通的易受攻击缺陷（如XSS，SQL注入，远程代码执行等等）。
- 不要再URL中使用任何敏感的数据（credentials，Passwords，security tokens，or API keys），而是使用标准的认证请求头。
- 使用一个API Gateway服务来启用缓存、访问速率限制（如Quota，Spike Arrest，Concurrent Rate Limit）以及动态地部署APIs resources。

## 处理

- 检查是否所有的终端都在身份认证之后，以避免破环了认证体系。
- 避免使用特有的资源id。使用/me/orders替代/user/654321/orders。
- 使用UUID代替自增长的id。
- 如果需要解析XML文件，确保实体解析（entity parsing）使关闭的以避免XXE攻击。
- 如果需要解析XML文件，确保实体拓展（entity expansion）使关闭的以避免通过指数实体扩展攻击实现的Billion Laughs/XML Bomb。
在文件上传中使用CDN。
- 如果需要处理大量的数据，使用Workers和Queues来快速响应，从而避免HTTP阻塞。
- 不要忘了把DEBUG模式关掉。

## 输出

- 发送X-Content-Type-Options: nosniff头。
- 发送X-Frame-Options: deny头。
- 发送Content-Security-Policy: default-src 'none'头。
- 删除指纹头X-Powered-By，Server，X-AspNet-Version等等。
- 在响应中强制使用content-type，如果你的类型是application/json，那么你的content-type就是application/json。
- 不要返回敏感的数据，如credentials，Passwords，security tokens。
- 在操作结束时返回恰当的状态码。（如200 OK，400 Bad Request，401 Unauthorized，405 Method Not Allowed等等）

## 持续集成和持续部署

- 使用单元测试和集成测试来审计你的设计和实现。
- 引入代码审查流程，不要自行批准更改。
- 在推送到生产环境之前确保服务的所有组件都用杀毒软件静态地扫描过，包括第三方库和其他依赖。
- 为部署设计一个回滚方案。