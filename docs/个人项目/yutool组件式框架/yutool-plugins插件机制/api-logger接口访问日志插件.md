# api-logger接口访问日志插件

## 快速上手
### 1. Maven依赖
在项目的 `pom.xml `中添加以下依赖：
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
        <artifactId>api-logger</artifactId>
    </dependency>
</dependencies>
```
### 2. 配置文件
在项目的配置文件 application.yml 中添加以下配置：
```yaml
api:
  log:
  	# 是否启用接口访问日志插件
    enabled: true
    # 是否打印日志
    printable: true
    # 是否持久化
    save-to-db: true
    # 是否包含RequestId
    request-id-enabled: true
    # 操作人ID脱敏显示
    opt-mask: true
    # 是否启用参数加密
    encrypt-args: true
    # 是否打印返回结果
    log-result: true
    # 是否启用结果加密
    encrypt-result: true
    # RSA加密公钥
    public-key: 
```
### 3. 接口访问日志信息
接口访问日志包括以下字段：

- RequestId
- 操作人
- 请求方法
- 请求路径
- 访问IP
- 调用方法
- 请求参数
- 返回结果
- 请求耗时
### 4. 加密信息（请求参数、返回结果）
如果请求参数或者返回结果启用了RSA公钥加密，则需要使用相应的RSA私钥进行解密才能查看原始信息。
