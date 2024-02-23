# yutool-search搜索引擎组件

## 快速上手
### 1. Maven依赖
在项目的 pom.xml 中添加以下依赖：
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
        <artifactId>yutool-search</artifactId>
    </dependency>
</dependencies>
```

### 2. 配置文件

因为yutool-search是基于redisearch实现的，因此需要在配置文件`application.yml`中添加redis相关配置：

```yaml
spring:
  redis:
    host: 
    port: 
    timeout: 
    password: 
```

### 3. 注入SearchTemplate实例实现搜索功能

示例如下：

```Java
public class BlogSearcherTests {
    private final SearchTemplate searchTemplate;

    public void testCreateIndex() {
        searchTemplate.createIndex('blog', new Schema().addTextField('content', 1.0), Client.IndexOptions.defaultOptions());
    }

    public void testSearch() {
        searchTemplate.search('blog', '震惊', SearchProps.defaultProps());
    }
}
```

## 其他说明

因为yutool-search是基于redisearch实现的，因此需要先安装RediSearch。有以下两种方式安装RediSearch：

1. 安装Redis 4.0+，再安装RedisMod中的RediSearch模块
2. 安装Redis Stack，Redis Stack中自带了RediSearch模块