# swagger-support Swagger接口文档插件

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
        <artifactId>swagger-support</artifactId>
    </dependency>
</dependencies>
```

### 2. 配置文件

在项目的配置文件 `application.yml` 中添加以下配置：

```yaml
api:
  # 版本号
  version: v1.0.0
  # 联系人
  contactName: yupaits
  # 联系人首页
  contactUrl: https://github.com/yupaits
  # 联系人邮箱
  contactEmail: ts495606653@hotmail.com
  # 服务条款网址
  termsOfServiceUrl: 
  # License
  license: MIT License
  # License网址
  licenseUrl: https://github.com/yupaits/yutool/blob/master/LICENSE
  # 标题（接口分组为空时生效）
  title: yutool示例
  # 描述（接口分组为空时生效）
  description: yutool示例应用
  # 扫描接口包路径（接口分组为空时生效）
  basePackage: com.yupaits.sample.yutool
  # 接口分组
  groups:
      # 分组名
    - name: test
      # 分组标题
      title: 测试分组
      # 分组描述
      description: 仅供测试
      # 分组扫描接口包路径
      basePackage: com.yupaits.sample.yutool.controller
      # 联系人（为空时会读取全局联系人）
      contactName: yupaits
      # 联系人首页（为空时会读取全局联系人首页）
      contactUrl: https://github.com/yupaits
      # 联系人邮箱（为空时会读取全局联系人邮箱）
      contactEmail: ts495606653@hotmail.com
```

### 3. 配置类

在项目中添加 `SwaggerConfig` 接口文档配置类：

```java
/**
 * Swagger接口文档配置
 * @author yupaits
 * @date 2019/8/1
 */
@Configuration
public class SwaggerConfig {

    @Bean
    @ConfigurationProperties(prefix = "api")
    public ApiProps apiProps() {
        return new ApiProps();
    }

    /**
     * 全局接口Docket（配置了分组接口时一般不要配置全局接口）
     */
    @Bean
    public Docket api() {
        return SwaggerUtils.docket(apiProps());
    }

    /**
     * 分组接口Docket
     */
    @Bean
    public Docket testApi() {
        // test 对应配置文件中的分组名，大小写敏感
        return SwaggerUtils.docket(apiProps(), "test");
    }
}
```
#### 更新说明
v1.2.4版本无需编写SwaggerConfig配置类，开箱即用，自动创建并注入Docket Bean。
## 设计思路
通过SwaggerUtils工具类结合ApiProps的信息，按照指定的分组策略生成分组接口的ApiInfo对象。
