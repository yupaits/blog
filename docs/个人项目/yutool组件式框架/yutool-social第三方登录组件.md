# yutool-social第三方登录组件

## 快速上手
### 1. Maven依赖
在项目的 `pom.xml` 中添加以下依赖：
```xml
<parent>
    <groupId>com.yupaits</groupId>
    <artifactId>yutool-parent</artifactId>
    <version>${yutool.version}</version>
    <relativePath/>
</parent>
<dependencies>
    <dependency>
        <groupId>com.yupaits</groupId>
        <artifactId>yutool-social</artifactId>
    </dependency>
</dependencies>
```
### 2. 配置文件
由于 `yutool-social` 依赖 `sms-verify` 和 `just-auth`，因此需要在项目的配置文件 `application.yml` 中添加这两个模块需要的配置项。
### 3. 统一的第三方认证接口
## 设计思路

- 支持的登录方式
   - 手机短信验证码验证登录
   - 手机本机号码认证登录
   - 其他主流第三方登录（这里通过整合JustAuth实现，默认接入JustAuth当前支持的第三方登录平台）
      - GitHub
      - Weibo（微博）
      - Gitee（码云）
      - DingTalk（钉钉）
      - Baidu
      - CSDN
      - Coding
      - OSChina（开源中国）
      - AliPay（支付宝）
      - QQ
      - Taobao
      - Google
      - Facebook
      - DouYin（抖音）
      - Linkedin（领英）
      - Microsoft
      - Mi（小米）
      - TouTiao（今日头条）
      - Teambition
      - RenRen（人人网）
      - Pinterest
      - StackOverflow
      - HUAWEI
      - WechatOpen（微信开放平台）
      - WechatEnterprise（微信企业号）
      - WechatMp（微信公众号）
      - KuJiaLe（酷家乐）
      - GitLab
      - MeiTuan（美团）
      - Eleme（饿了么）
      - Twitter
      - Aliyun
