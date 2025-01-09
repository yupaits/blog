# yutool-casdoor 对接Casdoor

Casdoor是一个单点登录平台，不同的系统可通过Casdoor打通用户认证体系，还可以使用Casdoor内置的OAuth提供商绑定GitHub、Google等主流平台的账号，使登录方式更加灵活。

同时Casdoor还具备完整的角色、权限管理功能，内置的存储提供商功能可以方便地整合各种文件存储方案。

`yutool-casdoor`中使用Spring Security OAuth2结合Casdoor实现了OAuth2登录功能，替换了之前的`yutool-auth`认证模块。`yutool-casdoor`还整合Casdoor中的MinIO提供商实现了文件服务，替换了`yutool-file-server`文件服务模块。通过整合`yutool-menu`和Casdoor的用户角色管理，可以实现系统菜单的动态授权。

## 使用方式

### 1. Maven依赖

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
        <artifactId>yutool-casdoor</artifactId>
    </dependency>
</dependencies>
```

### 2. 配置文件

`yutool-casdoor`相关的配置项：

```yaml
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
            token-uri: https://<Casdoor Hostname>/login/oauth/access_token
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

# MinIO存储服务配置
minio:
  endpoint: http://<MinIO endpoint>
  accessKey: <AccessKey>
  secretKey: <SecretKey>

# 登录页配置
login-page:
  # favicon图片链接
  favicon-url: <favicon url>
  # 应用Logo图片链接
  logo-url: <logo url>
  # 应用Slogan
  slogan: <Application Slogan>

```

**注意：** 带`<>`的配置值需要替换为实际内容。配置了Casdoor应用信息（`casdoor`下的配置）和MinIO存储服务配置（`minio`下的配置）在不启用OAuth2登录（`spring.security.oauth2.client.enabled=false`）的情况下，可以正常使用文件服务。

`yutool-casdoor`使用Casdoor中用户的角色信息，通过匹配`yutool-menu`中菜单项的授权角色信息实现了动态授予用户菜单权限。