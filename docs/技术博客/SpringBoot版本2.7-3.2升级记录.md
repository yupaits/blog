# SpringBoot版本2.7-3.2升级记录

## Spring Boot 3.2依赖

- 系统需求
  - Java 17 ~ Java 22
  - Maven 3.6.3 or later
  - Gradle 7.x(7.5 or later) and 8.x

- Servlet容器 (Servlet 6.0)
  - Tomcat 10.1
  - Jetty 12.0
  - Undertow 2.3

- GraalVM原生镜像 (可选)
  - GraalVM Community 22.3
  - Native Build Tools 0.9.28

## 配置调整

`application.properties`/`application.yml`配置文件中，部分配置项需要更改配置名或者移除，Spring Boot提供了`spring-boot-properties-migrator`工具用于在应用启动时输出配置分析报告，方便快速定位及修改。修改完成之后记得移除该工具。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-properties-migrator</artifactId>
    <scope>runtime</scope>
</dependency>
```

自动装配的配置类原来的SPI配置文件扫描路径为`resources/META-INF/spring.factories`，现在的路径为`resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`。内容调整为配置类的完整路径，如果有多个自动装配配置类，每行配置一个配置类即可。例如：

- 原配置（spring.factories）

```Java
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.yupaits.yutool.push.core.config.PushAutoConfigure,\
com.yupaits.yutool.push.core.config.PushAutoConfigure.NotificationAutoConfigure,\
com.yupaits.yutool.push.core.config.PushAutoConfigure.WebMsgAutoConfigure,\
com.yupaits.yutool.push.core.config.PushAutoConfigure.SmsAutoConfigure,\
com.yupaits.yutool.push.core.config.PushAutoConfigure.EmailAutoConfigure,\
com.yupaits.yutool.push.core.config.PushAutoConfigure.ImAutoConfigure,\
com.yupaits.yutool.push.core.config.WebSocketConfig
```

- 新配置（org.springframework.boot.autoconfigure.AutoConfiguration.imports）

```Java
com.yupaits.yutool.push.core.config.PushAutoConfigure
com.yupaits.yutool.push.core.config.PushAutoConfigure.NotificationAutoConfigure
com.yupaits.yutool.push.core.config.PushAutoConfigure.WebMsgAutoConfigure
com.yupaits.yutool.push.core.config.PushAutoConfigure.SmsAutoConfigure
com.yupaits.yutool.push.core.config.PushAutoConfigure.EmailAutoConfigure
com.yupaits.yutool.push.core.config.PushAutoConfigure.ImAutoConfigure
com.yupaits.yutool.push.core.config.WebSocketConfig
```

## 代码调整

- `pom.xml`文件中的依赖项：
  - `javax.servlet:jakarta.servlet-api`修改为`jakarta.servlet:jakarta.servlet-api`
  - 使用了`javax.annotation.*`注解的模块需要引用`jakarta.annotation:jakarta.annotation-api`，其他javax相关的引用也是类似方式处理
  - 未通过`spring-boot-stater`管理指定Hibernate的模块，需要单独指定`hibernate-core`版本（当前最新为`6.4.8.Final`）
  - `com.alibaba.cloud:spring-cloud-alibaba-dependencies`需更新到`2023.x`版本，对应的`nacos-server`也最好更新至v2.3.2版本

- import包路径调整
  - `javax.persistence.*`修改为`jakarta.persistence.*`
  - `javax.validation.*`修改为`jakarta.validation.*`
  - `javax.servlet.*`修改为`jakarta.servlet.*`
  - `javax.annotation.*`修改为`jakarta.annotation.*`
  - `javax.transaction.*`修改为`jakarta.transaction.*`

- 类变更
  - `org.springframework.data.jpa.repository.support.JpaMetamodelEntityInformation`构造方法新增`PersistenceUnitUtil`形参
  - `org.springframework.amqp.rabbit.connection.CorrelationData`获取`ReturnedMessage`方法改为`getReturned()`
  - `org.springframework.kafka.core.KafkaTemplate#send`方法返回的是`CompletableFuture`类型对象，移除了`addCallback`添加回调方法，使用`CompletableFuture`自身的异步处理方法代替回调
  - `cn.hutool.extra.servlet.ServletUtil`改为`cn.hutool.extra.servlet.JakartaServletUtil`
  - `Class.newInstance()`方法（Java 9弃用）替换为`Class.getDeclaredConstructor().newInstance()`
  - `org.springframework.http.HttpMethod`由`enum`类改为`final class`，`HttpMethod#resolve`改为`HttpMethod#valueOf`
  - 使用`RestClient`替换`RestTemplate`作为默认的Http客户端