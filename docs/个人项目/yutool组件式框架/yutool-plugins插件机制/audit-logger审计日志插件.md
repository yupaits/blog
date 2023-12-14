# audit-logger审计日志插件

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
        <artifactId>audit-logger</artifactId>
    </dependency>
</dependencies>
```

### 2. 执行建表SQL

执行 [audit-logger建表SQL](https://github.com/yupaits/yutool/blob/master/yutool-plugins/audit-logger/src/main/resources/sql/audit_record.sql) 创建数据表。

### 3. 审计字段使用 `@AuditLog` 注解

使用 `@AuditLog` 注解修饰实体类的字段之后，更新该字段时会自动进行审计记录，示例如下：

```java
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("person")
public class Person extends BaseModel<Long, Person> {
    private static final long serialVersionUID = 1L;

    /**
     * 姓名
     */
    @AuditLog(description = "姓名")
    private String name;

    /**
     * 年龄
     */
    private Integer age;

    /**
     * 性别
     */
    private Byte gender;
}
```

## 设计思路
通过@AuditLog标记需要进行审计的字段，在保存实体对象的时候获取审计字段并根据该字段配置的默认审核策略（是否自动审核通过）进行审计记录的保存及处理。
