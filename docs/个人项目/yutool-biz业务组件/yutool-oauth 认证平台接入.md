---
draft: true
draftPreview: true
---
# yutool-oauth 认证平台接入

## oauth-core 认证平台对接层

认证平台与yutool框架整合的对接层，目前提供以下功能：
- 获取当前登录用户信息
- 获取所有角色信息列表
- 登录页面品牌信息定制
- 获取当前登录用户已授权的菜单目录

## oauth-casdoor 对接Casdoor

> 基于已废弃的[《yutool-casdoor 对接Casdoor》](/个人项目/yutool-biz业务组件/yutool-oauth%20认证平台接入)进行修订。

- Maven依赖

    `pom.xml`文件中添加`yutool-casdoor`依赖：

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
            <artifactId>oauth-casdoor</artifactId>
        </dependency>
    </dependencies>
    ```
- 配置文件

    oauth-casdoor相关的配置项：

    ```yml
    spring:
      security:
        oauth2:
          client:
            # 是否启用OAuth2登录
            enabled: true
            # Casdoor应用注册信息
            registration:
              casdoor:
                client-name: Casdoor单点登录
                client-id: <ClientId>
                client-secret: <ClientSecret>
                scope: openid,email,profile
                authorization-grant-type: authorization_code
                redirect-uri: https://<Application Hostname>/login/oauth2/code/casdoor
            # Casdoor OAuth2端口
            provider:
              casdoor:
                authorization-uri: https://<Casdoor Hostname>/login/oauth/authorize
                token-uri: https://<Casdoor Hostname>/api/login/oauth/access_token
                user-info-uri: https://<Casdoor Hostname>/api/userinfo
                jwk-set-uri: https://<Casdoor Hostname>/.well-known/jwks
                user-name-attribute: name

    # 忽略认证信息的访问路径，不登录也能访问
    security:
      ignore-paths:
        - /favicon.png
        - /logo.png
        - /assets/**
        - /login

    # Casdoor应用信息
    casdoor:
      endpoint: https://<Casdoor Hostname>
      client-id: <ClientId>
      client-secret: <ClientSecret>
      certificate: <JWT Public Key>
      organization-name: <Organazition>
      application-name: <Application Name>

    # 登录页配置
    login-page:
      # favicon图片链接
      favicon-url: <favicon url>
      # 应用Logo图片链接
      logo-url: <logo url>
      # 应用Slogan
      slogan: <Application Slogan>
    ```

    **注意：** 带`<>`的配置值需要替换为实际内容。

    `spring.security.oauth2.client.provider`下的各uri地址可能会随着`casdoor`版本更新发生变化，可通过访问`https://<Casdoor Hostname>/.well-known/openid-configuration`接口进行确认。

## oauth-logto 对接Logto
