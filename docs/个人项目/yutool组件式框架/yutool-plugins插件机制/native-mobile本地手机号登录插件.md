# native-mobile本地手机号登录插件

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
        <artifactId>native-mobile</artifactId>
    </dependency>
</dependencies>
```
### 2. 配置文件
默认使用的是阿里云号码认证服务作为本机号码认证服务提供商，需要在项目的配置文件 `application.yml` 中添加以下配置：
```yaml
native-mobile:
	aliyun:
  	region-id:
    access-key-id:
    access-secret:
```
### 3. 自定义本机号码认证服务提供商
实现 `NativeMobileProvider` 接口并注入到 Spring 容器中即可使用自定义的本机号码认证服务提供商。
```java
@Component
public class CustomNativeMobileProvider implements NativeMobileProvider {

    @Override
    public String getMobile(String accessToken) {
        return getMobile(accessToken, null);
    }

    @Override
    public String getMobile(String accessToken, String outId) {
        // 自定义本机号码认证服务提供商获取本机号码
        return null;
    }
}
```
### 4. 获取本机号码
使用注入的 `NativeMobileTemplate` 获取本机号码。
