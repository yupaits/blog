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

> 基于已废弃的yutool-casdoor模块说明文档[《yutool-casdoor 对接Casdoor》](/个人项目/yutool-biz业务组件/yutool-casdoor%20对接Casdoor)进行修订。

- Maven依赖

    `pom.xml`文件中添加`oauth-casdoor`依赖：

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
      certificate: |
        -----BEGIN CERTIFICATE-----
        1234567890qwertyuiop...(示例内容)
        -----END CERTIFICATE-----
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

    **注意：** 带`<>`的配置值需要替换为实际内容。`casdoor.certificate`证书配置在Casdoor管理后台的 **身份认证** -> **证书** 页面可以获取，注意yml类型文件的多行字符串书写格式（使用`|`符号进行标识并换行，多行字符串内容需要缩进），用于标识证书起止的`-----BEGIN CERTIFICATE-----`和`-----END CERTIFICATE-----`不能省略。

    `spring.security.oauth2.client.provider`下的各uri地址可能会随着`casdoor`版本更新发生变化，可通过访问`https://<Casdoor Hostname>/.well-known/openid-configuration`接口进行确认。

## oauth-logto 对接Logto

- Maven依赖

    `pom.xml`文件中添加`oauth-logto`依赖：

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
            <artifactId>oauth-logto</artifactId>
        </dependency>
    </dependencies>
    ```

- 配置文件

    oauth-logto相关的配置项：

    ```yml
    spring:
      security:
        oauth2:
          client:
            # 是否启用OAuth2登录
            enabled: true
            # Logto应用注册信息
            registration:
              logto:
                client-name: Logto单点登录
                client-id: <ClientId>
                client-secret: <ClientSecret>
                scope: openid,profile,email,offline_access
                authorization-grant-type: authorization_code
                redirect-uri: https://<Application Hostname>/login/oauth2/code/logto
            # Logto OAuth2端口
            provider:
              logto:
                authorization-uri: https://<Logto Hostname>/oidc/auth
                token-uri: https://<Logto Hostname>/oidc/token
                user-info-uri: https://<Logto Hostname>/oidc/me
                jwk-set-uri: https://<Logto Hostname>/oidc/jwks

    # 忽略认证信息的访问路径，不登录也能访问
    security:
      ignore-paths:
        - /favicon.png
        - /logo.png
        - /assets/**
        - /login

    # Logto应用信息
    logto:
      app-id: <M2M AppId>
      app-secret: <M2M AppSecret>
      logto-endpoint: https://<Logto Hostname>
      token-endpoint: https://<Logto Hostname>/oidc/token
      connect-timeout: 3000
      read-timeout: 5000

    # 登录页配置
    login-page:
      # favicon图片链接
      favicon-url: <favicon url>
      # 应用Logo图片链接
      logo-url: <logo url>
      # 应用Slogan
      slogan: <Application Slogan>
    ```

    **注意：** 带`<>`的配置值需要替换为实际内容。Logto应用信息配置是用于获取Logto管理后台信息（例如用户和角色等），因此需要使用`机器对机器`类型的应用ID和Secret，具体可参考Logto相关指南。