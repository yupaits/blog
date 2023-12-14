# jwt-helper JWT工具插件

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
        <artifactId>jwt-helper</artifactId>
    </dependency>
</dependencies>
```

### 2. 配置文件

在项目的配置文件 `application.yml` 中添加以下配置：

```yaml
jwt:
  # Token密钥
  secret: 
  # 有效期，单位秒，默认是12个小时
  expired-in: 43200
  # JWT Header名称，默认是 Authorization
  auth-header: Authorization
```

### 3. 注入JwtHelper

在需要使用 Jwt 工具的 Bean 类中注入 `JwtHelper`：

```java
@Component
public class StatelessAuthFilter extends AccessControlFilter {
    private final JwtHelper jwtHelper;

    @Autowired
    public StatelessAuthFilter(JwtHelper jwtHelper) {
        this.jwtHelper = jwtHelper;
    }
}
```
