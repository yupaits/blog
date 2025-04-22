1. 如果项目启用了事务管理，Service 的实现类在增删改数据时需要加上`@Transactional`注解标明该类或方法加入了事务管理。

2. 使用 shiro 权限框架时，需要检查需要权限控制的 Controller 类或方法是否加上了`@RequiresRoles`或`@RequiresPermissions`注解。

3. Controller 的方法传入 `@RequestBody` 参数时，method 只能是 POST 或 PUT。

4. Controller 通过 Model 对象实例通过 setAttribute 方法传值到前端 jsp 页面或是其他模板页面时，如果是在 js 里获取的话需要通过 var param = ‘${param}’ 方式获取，用’’引起来可以避免当 ${param} 为空时 js 代码报错的问题，但同时也将参数类型强制转换为 string 类型了；当参数类型是 List 集合时，需要使用 eval(‘${param}’) 方法。

5. 后台在增删改数据时，记得更新和该数据相关的缓存；特别是在更改记录时要更新更改之前和之后会包含该记录的缓存。

6. 跨域访问时，可以在全局 Interceptor 中使用 `httpServletResponse.setHeader("Access-Control-Allow-Origin", ACCESS_CONTROL_ALLOW_ORIGIN)` 限制可跨域访问的域名，类似的，使用 `httpServletResponse.setHeader("Access-Control-Allow-Methods", ACCESS_CONTROL_ALLOW_METHODS)` 限制请求方法，`httpServletResponse.setHeader("Access-Control-Max-Age", ACCESS_CONTROL_MAX_AGE)` 设置可跨域访问的时限， `httpServletResponse.setHeader("Access-Control-Allow-Headers", ACCESS_CONTROL_ALLOW_HEADERS)` 限制请求头参数。

7. SpringBoot 中可以使用 `@EnableScheduling` 注解启用定时任务功能，在方法上使用 `@Scheduled` 注解设置任务启动的时间。

8. 访问日志功能的实现：定义一个 LogInterceptor ，使用 `logger.info()` 等方法记录下 httpServletRequest 中相关属性。

9. shiro 的 reaml 中保存的 Principal 为 User 对象时，页面上想要获取 User 对象的 username 属性可以使用 `<shiro:principal property="username"/>` 标签，注意这里的 property 即是对应的属性名。

10. Spring 框架自带的 `BeanUtils.copyProperties(Object source, Object target, String... ignoreProperties)` 方法可以方便的做类属性的拷贝。

11. SpringBoot security 在使用 `.antMatchers("/management/**").hasAnyRole("SuperAdmin", "admin")` 要注意数据库里保存的角色名称必须要以`'ROLE_'`开头，这里的角色在数据库的名称应为 `"ROLE_SuperAdmin"` 和 `"ROLE_admin"`。

12. SpringBoot security 的注解 `@PreAuthorize` 可以用在类或方法上来进行权限控制，其中 `hasRole()` 和 `hasAuthority()` 的区别在于前者可以忽略角色信息的前缀（默认是 “ROLE_”），而后者则必须要包含前缀。例如当保存的角色信息为”ROLE_admin”时， `hasRole('admin')` 和 `hasAuthority('ROLE_admin')` 是等效的。

13. SpringBoot 在整合 shiro 时无法在使用 rememberMeCookie 实现”记住我”（即 rememberMe）功能的同时实现使用 sessionIdCookie 单独管理用户 session 信息。而使用 sessionIdCookie 可以解决出现404之后刷新页面直接跳转到登录页面的问题（问题详情：[http://jinnianshilongnian.iteye.com/blog/1999182](http://jinnianshilongnian.iteye.com/blog/1999182)）。

14. SpringBoot JPA 可以很简单的集成分页和排序功能，支持的 request 参数如下：
    - page，第几页，从 0 开始，默认为第 0 页
    - size，每一页的数量，默认为 10
    - sort，排序相关的信息，以`property,direction(ASC|DESC)`的方式组织，例如`sort=firstname&sort=lastname,desc`表示在按`firstname`增序排列的基础上按`lastname`的降序排列

    例如请求链接为：`http://host:port/blogs?page=0&size=3&sort=category,asc&sort=description,desc`
    ```java
    @SuppressWarnings("unchecked")
    @GetMapping("")
    public Page<Blog> findAll(@PageableDefault(size = 10, page = 0, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        long startTime = System.currentTimeMillis();
        Page<Blog> blogPage = (Page<Blog>) redisTemplate.opsForValue().get(blogCachePrefix + JSON.toJSONString(pageable));
        if (blogPage == null) {
            blogPage = blogRepository.findAll(pageable);
            redisTemplate.opsForValue().set(blogCachePrefix + JSON.toJSONString(pageable), blogPage, 3, TimeUnit.MINUTES);
        }
        long endTime = System.currentTimeMillis();
        logger.info("获取分页博客博客，pageable ：{}, 耗时：{}ms", JSON.toJSONString(pageable), (endTime - startTime));
        return blogPage;
    }
    ```

15. 使用 jackson 将实体对象转成 JSON，在属性上加上`@JsonInclude(JsonInclude.Include.NON_NULL)` 注解，当该属性NULL或者为空时将不参加序列化。JsonInclude 可选项有：
    - JsonInclude.Include.ALWAYS：默认总是参加序列化
    - JsonInclude.Include.NON_DEFAULT：属性为默认值不序列化
    - JsonInclude.Include.NON_EMPTY：属性为空或NULL都不序列化
    - JsonInclude.Include.NON_NULL：属性为NULL不序列化

16. 实体类里的**Enum**类型的属性映射数据库字段的时候可以使用 `@Convert(converter = Status.class, attributeName = "status")` 注解；jackson 在序列化**Enum**类型的时候可以在**Enum**类对应的**getter**方法使用 `@JsonValue` 注解来定义向前端输出的内容，而前端传过来的值同样可以通过 `@JsonCreator` 注解反序列化得到对应的**Enum**类型对象。

17. _1.5.6.RELEASE_ 版本的**SpringBoot**在使用 `ElasticsearchRespository` 类时会产生以下异常：
    ```java
    Failed to write HTTP message: org.springframework.http.converter.HttpMessageNotWritableException:
        Could not write JSON document: (was java.lang.NullPointerException) (through reference chain: org.springframework.data.elasticsearch.core.aggregation.impl.AggregatedPageImpl["facets"]); nested exception is com.fasterxml.jackson.databind.JsonMappingException: (was java.lang.NullPointerException) (through reference chain:
        org.springframework.data.elasticsearch.core.aggregation.impl.AggregatedPageImpl["facets"])
    ```
    推荐使用 _1.4.7.RELEASE_ 版本。

18. Json 序列化的时候会将 Long 等类型强转成类似于 Javascript 中的 number 类型（内部实现**可能**是转成 Double 类型），这样会导致大数值丢失精度的问题。jackson 可以使用 `@JsonSerialize(using = ToStringSerializer.class)` 注解将 Long 类型转成String 再进行序列化，但这样会导致前端接收到的数据类型变成了 String 而不是 number。

19. 在进行批量更新操作时，需要将待更新的数据进行排序之后再进行批量操作，这样可以避免并发场景下的死锁问题。

20. @RequestBody注解的实体对象如果需要将前端传过来的 array 转成实体中相应的 String 类型的属性时，可以在该属性的 setter 方法进行转换操作。
    ```java
    @Data
    @Entity
    @Table(name = "welcome_message")
    public class WelcomeMessage implements Serializable {
        private static final long serialVersionUID = 1L;

        @Id
        private Long id;

        @Column(name = "articles")
        private String articles;

        public void setArticles(List<WxMpXmlOutNewsMessage.Item> articles) {
            this.articles = JSON.toJSONString(articles);
        }

        public List<WxMpXmlOutNewsMessage.Item> getArticles() {
            return JSON.parseArray(this.articles, WxMpXmlOutNewsMessage.Item.class);
        }
    }
    ```
    相应的，如果需要将数据库中存储的 String 转成 List 传回前端或者应用于后台逻辑，可以在字段对应属性的 getter 方法进行转换。这里使用的是 fastjson 的 JSON 类。

21. 过长的 Long 类型主键转 Json 传回前端会使用js处理会丢失精度，可以在实体的 @Id 上配置转成 Json 的序列化及反序列化处理类，在将 id 传回前端或者接收 前端传过来的 id 时使用 String 类型来进行转换保证精度，代码如下：
    ```java
    /**
    * 解决Long类型的主键转json传回前端丢失精度的问题，将Long转成String
    * @author yupaits
    * @date 2017/12/18
    */
    public class LongJsonSerializer extends JsonSerializer<Long> {
        @Override
        public void serialize(Long value, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException, JsonProcessingException {
            if (value != null) {
                jsonGenerator.writeString(String.valueOf(value));
            }
        }
    }
    ```
    ```java
    /**
    * 将前端String类型的主键转成Long类型
    * @author yupaits
    * @date 2017/12/18
    */
    public class LongJsonDeserializer extends JsonDeserializer<Long> {

        @Override
        public Long deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JsonProcessingException {
            String value = jsonParser.getText();
            try {
                return value == null ? null : Long.parseLong(value);
            } catch (NumberFormatException e) {
                return null;
            }
        }
    }
    ```
    ```java
    @Id
    @JsonSerialize(using = LongJsonSerializer.class)
    @JsonDeserialize(using = LongJsonDeserializer.class)
    private Long id;
    ```

22. SpringAop的Order顺序遵循先进后出的原则。如Aop1（order=1），Aop2（order=2），则切面的执行顺序为`Aop1.doAround.beforeProceed` -> `Aop1.doBefore` -> `Aop2.doAround.beforeProcced` -> `Aop2.doBefore` -> `Aop2.doAround.afterProcced` -> `Aop2.doAfter` -> `Aop2.doAfterReturning` -> `Aop1.doAround.afterProcced` -> `Aop1.doAfter` -> `Aop1.doAfterReturning`。

23. Spring Boot启动时指定环境。
    - IDEA中进入 `Run/Debug Configurations` 设置 `Environment->VM options` 为 `-Dspring.profiles.active=test`，或者在 `Environment variables` 中添加参数 `spring.profiles.active` 并指定参数的值为 `test`。
    - 命令行使用 `java -jar *.jar` 启动时，在命令的后面增加 `--spring.profiles.active=test`。
    - 在 `application.yml` 中配置 `spring.profiles.active` 的值为 `test`。

24. 通过zuul上传包含中文名的文件时，需要在上传文件url的path加上`/zuul`前缀即可。例如：当上传url为`http://localhost:10060/upload/image`，上传名为`头像.jpg`的文件，会出现报错`java.io.FileNotFoundException: E:\upload\image\2018-5\??.jpg (文件名、目录名或卷标语法不正确。)`。如果将url直接改为`http://localhost:10060/zuul/upload/image`则可以上传成功。

25. Spring Boot Jpa实现实体联合主键：实体类加上`@IdClass(XxxKey.class)`注解，实体类中多个联合注解的属性上都加上`@Id`注解。示例：
    ```java
    @Data
    @AllArgsConstructor
    @Entity
    @IdClass(UserRoleKey.class)
    @Table(name = "shop_user_role")
    public class UserRole implements Serializable {
        private static final long serialVersionUID = 1L;

        @Id
        @Column(nullable = false)
        private Long userId;

        @Id
        @Column(nullable = false)
        private Long roleId;
    }

    @Data
    @EqualsAndHashCode
    @NoArgsConstructor
    @AllArgsConstructor
    public class UserRoleKey implements Serializable {
        private static final long serialVersionUID = 1L;

        private Long userId;

        private Long roleId;
    }
    ```

26. 使用Spring Cloud Sleuth的日志中会包含链路追踪的信息，具体体现为:
    ```java
    2017-04-08 23:56:50.459 INFO [bootstrap,38d6049ff0686023,d1b8b0352d3f6fa9,false] 8764 — [nio-8080-exec-1] demo.JpaSingleDatasourceApplication : Step 2: Handling print
    2017-04-08 23:56:50.459 INFO [bootstrap,38d6049ff0686023,d1b8b0352d3f6fa9,false] 8764 — [nio-8080-exec-1] demo.JpaSingleDatasourceApplication : Step 1: Handling home
    ```
    比一般的日志多出了 `[bootstrap,38d6049ff0686023,d1b8b0352d3f6fa9,false]` 这些内容，对应 `[appname,traceId,spanId,exportable]`。

    - appname：服务名称
    - traceId\spanId：链路追踪的两个术语
    - exportable: 是否是发送给zipkin

27. SpringBoot中使用 `logback-spring.xml` 进行日志打印的配置。示例：
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <configuration scan="true" scanPeriod="30 seconds" debug="false">
      <property name="appName" value="app-name"/>
      <property name="logPattern" value="%d{yyyy-MM-dd HH:mm:ss.SSS} - [${appName}] - ${LOG_LEVEL_PATTERN:-%5p} ${PID:- } --- [%t] %c - %m%n"/>
      
      <appender name="amqp" class="org.springframework.amqp.rabbit.logback.AmqpAppender">
        <host>172.17.0.1</host>
        <port>5672</port>
        <username>guest</username>
        <password>guest</password>
        <applicationId>okbuy</applicationId>
        <routingKeyPattern>logstash</routingKeyPattern>
        <declareExchange>true</declareExchange>
        <exchangeType>direct</exchangeType>
        <exchangeName>okbuy.log</exchangeName>
        <generateId>true</generateId>
        <maxSenderRetries>2</maxSenderRetries>
        <charset>UTF-8</charset>
        <durable>true</durable>
        <deliveryMode>PERSISTENT</deliveryMode>
        <layout>
          <pattern>${logPattern}</pattern>
        </layout>
      </appender>
      
      <appender name="stdoutAppender" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
          <pattern>${logPattern}</pattern>
          <charset>utf8</charset>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
          <level>WARN</level>
        </filter>
      </appender>
      
      <appender name="asyncStdoutAppender" class="ch.qos.logback.classic.AsyncAppender">
        <discardingThreshold>0</discardingThreshold>
        <queueSize>1024</queueSize>
        <appender-ref ref="stdoutAppender"/>
        <includeCallerData>true</includeCallerData>
      </appender>
      
      <root>
        <level value="WARN"/>
        <appender-ref ref="amqp"/>
        <appender-ref ref="asyncStdoutAppender"/>
      </root>
    </configuration>
    ```

28. Spring的事务控制和数据库的事务控制之间的关系：
    - 数据库开启事务、提交事务、回滚事务对应jdbc的三个api，Spring事务控制的本质是通过AOP把这三个方法增强在不同的地方调用，实现Spring的事务在方法之间的传播。
    - 数据库在开启事务到提交的过程中，数据库本身有异常都会回滚。
    - 业务异常导致数据库回滚，是Spring通过调用 `jdbc rollback` 的api实现的。

29. Spring Security OAuth2 Client项目中`@EnableOAuth2Sso`注解修饰Application启动类时不起作用，需要放在`@Configuration`修饰的类上（通常是继承WebSecurityConfigurerAdapter的配置类）才能正常工作。

30. 检查幂等（是否重复请求）伪代码：
    ```sql
    CREATE TABLE `tb_unique` (
        `request_id` varchar(64) NOT NULL COMMENT 'request id',
        `gmt_create` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
        `gmt_modified` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '修改时间',
        PRIMARY KEY (`request_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='幂等表';
    ```
    ```java
    bool checkUnique(String requestId) {
        try {
            UniqueDO uniqueDO = buildUniqueDO(request);

            //reqeustId唯一索引，重复则抛异常DataIntegrityViolationException
            uniqueDao.insert(uniqueDO);

            //插入成功说明之前没有数据，返回没有被幂等
            return false;

        } catch (DataIntegrityViolationException ex) {

            //出现异常不一定时由于db里面有数据，可能是事务隔离级别导致，
            //所以要再查一次，确认数据再db里面存在
            UniqueDO uniqueDO = uniqueDao.selectByRequestId(requestId);

            if (uniqueDO == null) {
                //不存在数据则抛异常让方法重试
                throw ex;
            }

            //存在返回被幂等
            return true;
        }
    }
    ```
    requestId一般由客户端sdk生成和具体业务相关联。

31. profile为default时会读取 `application.yml` 的配置，而当profile不是default时，会读取对应的 `applicaiton-{profile}.yml` 的配置。需要注意的是，如果 `application.yml` 和 `application-{profile}.yml` 中存在相同的配置项时，`application.yml` 的优先级更高，所以一般在 `application.yml` 中设置共用的配置项。

32. 在SpringMVC中 `@RequestBody` 注解修饰的对象如果存在 `@DateTimeFormat` 注解修饰的属性，而且使用 jackson 进行反序列，那么 `@DateTimeFormat` 注解实际上是不起作用的，此时需要使用 `@JsonFormat` 注解进行代替。示例如下：
    ```java
    //@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;
    ```

33. Spring AOP 的切入点（PointCut）表达式使用规则：
    ```java
    execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?name-pattern(param-pattern) throws-pattern?)
    ```

    - `?` 的部分表示可省略
    - `*` 用来代表任意字符
    - `..` 用来表示任意个参数
    - `modifiers-pattern` 表示修饰符如 public、protected 等
    - `ret-type-pattern` 表示方法返回类型
    - `declaring-type-pattern` 表示特定的类
    - `name-pattern` 表示方法名称
    - `param-pattern` 表示参数
    - `throws-pattern` 表示抛出的异常

34. fastjson序列化之后如果出现`$ref`说明启用了“重复应用/循环引用”特性，可以通过以下两种方式处理：
    1. 通过全局或局部序列化配置`SerializerFeature.DisableCircularReferenceDetect`来展示实际内容
    2. 将存在重复引用的对象使用该对象的副本（new一个同类型对象并复制属性值）而不是原对象

35. Mybatis的if标签中判断字符串相等要使用如下格式:
    ```xml
    <if test='field == "value"'>
    </if>
    ```
	  注意外层用单引号，字符串的值使用双引号。

36. Spring/Spring Boot中可以通过可以通过如下方式控制bean的加载顺序：
    1. 通过构造方法依赖的方式，来控制有依赖关系的bean之间的初始化顺序，需要注意循环依赖的问题
    2. 使用`@DependsOn`注解来控制bean之间的实例化（调用构造方法）顺序，但是bean的初始化方法（如`@PostConstruct`注解修饰的初始化方法）调用顺序无法保证
    3. 通过`BeanPostProcessor`的方式手动控制bean的加载顺序

37. `@Order`和`@AutoConfigureOrder`的正确使用方式：
    1. `@Order`注解不能指定bean的加载顺序，它适用于AOP的优先级，以及将多个bean注入到集合时，这些bean在集合中的顺序
    2. `@AutoConfigureOrder`指定外部依赖的自动装配配置的加载顺序（即定义在/META-INF/spring.factories文件中的配置bean优先级），在当前工程中使用这个注解不会起作用
    3. 同样的，`@AutoConfigureBefore`和`@AutoConfigureAfter`注解的使用范围和`@AutoConfigureOrder`一样

38. 当使用Mybatis定义多个同名Mapper类时，在项目启用时会报注入了同名Bean的错误，可以通过在其中一个Mapper类上添加`@Repository("anotherMapperName")`注解的方式手动命名Bean来规避。

39. Spring Cloud OpenFeign使用总结：
    1. @FeignClient注解修饰的接口不支持多继承和多层继承
    2. 当多个@FeignClient注解使用了相同的name时，必须指定contextId，否则使用默认的`name+contextId`生成的FeignClient标识会重复
    3. @FeignClient的注解跟大部分注解一样，支持`${}`方式读取配置文件内容
    4. @FeignClient接口返回数据类型如果使用泛型，泛型类型要避免使用接口类型，会导致反序列化的结果为null
    5. @FeignClient接口在mybatis-plus的ServiceImpl的继承类（IService的实现类）中如果通过`@RequiredArgsConstructor`结合`private final XxxClient xxxClient;`的方式进行注入（本质上是通过构造方法注入）的话，在编译阶段会出现"java: 可能尚未初始化变量xxxClient"的报错。只能使用`@Autowired`私有属性的方式进行注入：`@Autowired private XxxClient xxxClient;`
    6. 在Feign的RequestInterceptor中不要使用RequestContextHolder获取当前的HttpServletRequest对象，会导致使用FeignClient调用其他服务接口返回404的错误
    7. 当使用Apache HttpClient作为Feign的Http请求客户端时（配置了`feign.httpclient.enabled=true`），可使用`feign.httpclient.max-connections=100`设置连接池最大连接数为100，使用`feign.httpclient.max-connections-per-route=50`设置连接池每个路径最大连接数为50
    8. 使用`feign.client.config.default.connectionTimeout`和`feign.client.config.default.connectionTimeout`设置FeignClient调用接口默认的连接超时时间和请求处理超时时间；当需要对某个FeignClient单独设置超时时间，可使用`feign.client.config.[contextId].connectionTimeout`（这里的contextId对应@FeignClient注解上的contextId）
    9. 使用@FeignClient传输文件时，需要指定请求的consumes类型为`MediaType.MULTIPART_FORM_DATA_VALUE`并在文件参数前添加`@RequestPart("file")`注解（file是参数名），示例如下：
        ```java
        @FeignClient
        @FeignClient
        public interface UploadClient {

            @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
            Result upload(@RequestPart("file") MultipartFile file);

        }
        ```
        同时需要注入`Encoder`Bean以支持`MultipartFile`使用表单数据类型传输，具体为：
        ```java
        @Configuration
        @RequiredArgsConstructor
        public class FeignConfig {
          private final ObjectFactory<HttpMessageConverters> messageConverters;
            
            @Bean
            public Encoder multipartFormEncoder() {
                return new SpringFormEncoder(new SpringEncoder(messageConverters));
            }
        }
        ```

40. 启用Java远程JVM调试，在服务端启动的时候添加启动参数：
    ```java
    -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005
    ```
    其中5005是自定义的调试端口。

41. sqlite数据库使用注意事项：
    1. 当sqlite的连接url使用`jdbc:sqlite::resource:[filepath]`时(resource模式)，使用IntelliJ IDEA等IDE启动项目，由于位于resources下的db文件会编译到target目录下，此时对db文件进行读写操作时，很大概率会出现“The database disk image is malformed”的错误提示。推荐使用项目目录外部的db文件路径作为连接url。	
    2. 使用MyBatis进行数据库操作时，Java的LocalDate、LocalDateTime类型的转换会报错，此时需要自行实现LocalDate、LocalDateTime类型的TypeHandler。
    3. 枚举类型可以使用Mybaits提供的EnumTypeHandler和EnumOrdinalTypeHandler来进行类型转换，如果项目中还使用了Mybatis Plus，还可以使用MybatisEnumTypeHandler。

42. Spring Cahce缓存注解使用时需要注意：
    - 接口方法定义为：`Result<AirportInfo> getByAirportCode(@RequestParam("airportCode") String airportCode);`，使用`@Cacheable(key = "#root.methodName + ':' + #airportCode")`注解时，会报错：Null key returned for cache operation。原因是接口方法在编译之后方法形参`airportCode`命名会被修改为`arg0`、`arg1`、`var1`这种格式，使用`#airportCode`获取不到参数值。

        解决方法：
        1. 将`#airportCode`替换为`a0`或者`p0`这种按序号取参数值的形式。
        2. 在使用`org.apache.maven.plugins:maven-compiler-plugin`插件编译项目时，添加`-parameters`参数，使得编译后的方法形参保持原来的命名，具体配置如下。

        ```xml
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>${maven-compiler-plugin.version}</version>
            <configuration>
                <source>${java.version}</source>
                <target>${java.version}</target>
                <compilerArgs>
                    <arg>-parameters</arg>
                </compilerArgs>
            </configuration>
        </plugin>
        ```
    - 缓存操作注解
      | 名称        | 说明                                                                            |
      |-------------|-------------------------------------------------------------------------------|
      | @Cacheable  | 主要针对方法配置，能够根据方法的请求参数对其结果进行缓存，查询和更新都可以使用    |
      | @CachePut   | 保证方法被调用，有希望结果被缓存，与@Cacheable区别在于每次都会调用方法，常用于更新 |
      | @CacheEvict | 清空缓存                                                                        |
      | @Caching    | 使用该注解可以同时指定多个缓存或者清除缓存的策略                                |

    - `@Cacheable`/`@CachePut`/`@CacheEvict`注解主要参数
      | 名称                          | 说明                                                                                                                                |
      |-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
      | value                         | 缓存的名称，在Spring配置文件中定义，必须指定至少一个                                                                                  |
      | key                           | 缓存的key，可以为空。如果指定要按照SpEL表达式编写；如果不指定，则默认按照方法的所有参数进行组合                                         |
      | condition                     | 缓存的条件，可以为空，使用SpEL编写，返回true或者false，只有为true才进行缓存/清除缓存                                                    |
      | unless                        | 否定缓存，当条件结果为true时，就不会缓存                                                                                              |
      | allEntries(@CacheEvict)       | 是否清空所有缓存内容，默认为false，如果指定为true，则方法调用后将立即清空所有缓存                                                      |
      | beforeInvocation(@CacheEvict) | 是否在方法执行前就清空，默认为false，如果指定为true，则在方法还没有执行的时候就清空缓存，默认情况下，如果方法执行抛出异常，就不会清空缓存 |

    - `@Cacheable`/`@CachePut`的condition和unless控制方法结果是否缓存的机制如下：
      | 条件                          | unless: true | unless: false（为空默认false） |
      |-------------------------------|--------------|----------------------------|
      | condition: true（为空默认true） | 不缓存       | 缓存                         |
      | condition: false              | 不缓存       | 不缓存                       |

    - SpEL上下文数据
      | 名称         | 位置       | 描述                                                                                            | 表达式              |
      |--------------|----------|-----------------------------------------------------------------------------------------------|---------------------|
      | methodName   | root对象   | 当前被调用的方法名                                                                              | `#root.methodName`  |
      | method       | root对象   | 当前被调用的方法                                                                                | `#root.method`      |
      | target       | root对象   | 当前被调用的目标对象实例                                                                        | `#root.target`      |
      | targetClass  | root对象   | 当前被调用的目标对象的类                                                                        | `#root.targetClass` |
      | args         | root对象   | 当前被调用的方法的参数列表                                                                      | `#root.args`        |
      | caches       | root对象   | 当前方法调用使用的缓存列表                                                                      | `#root.caches`      |
      | ArgumentName | 执行上下文 | 当前被调用的方法的参数，如上文的`#airportCode`                                                   | `#airportCode`      |
      | result       | 执行上下文 | 方法执行后的返回值（仅当方法执行后的判断有效，如 unless=false cacheEvict的beforeInvocation=false） | `#result`           |

43. SpringAOP搭配注解进行切面开发时，同一个Spring Bean内部方法互相调用时（例如：`bizService.a()`和`bizService.b()`方法都被注解修饰，`bizService.a()`方法中调用了`bizService.b()`方法），只有最外层的方法（`bizService.a()`方法）会执行切面的代码，而被嵌套调用的方法（`bizService.b()`方法）不会执行切面中的代码。
    ```java
    @Service
    public class BizService {
        @Transactional
        public void a() {
            b();
        }    
        @Transactional
        public void b() {
            ...
        }
    }
    ```

    - 原因是：Spring基于Proxy来实现AOP。 从Spring Context中获得的bean，以及通过`@Autowired`注解都是代理增强过的，所以可以织入缓存相关的逻辑，同一个类中通过this调用另一个方法，不经过代理，所以Spring的AOP切面不会生效。

    一个替代方法是，在bean中通过`@Autowired`注入它自己，然后在用注入的实例代替this来调用。

44. 使用Redis GEO数据类型存储地理位置信息，并使用GEO数据计算两地的距离以及获取指定地点范围内其他地点。
    ```java
    private static final String LOCATION_GEO_KEY = "location_geo";
    private static final String POINT1 = "point1";
    private static final String POINT2 = "point2";

    /**
    * 获取指定两个地点之间的距离
    * @param longitude1 地点1的经度
    * @param latitude1 地点1的纬度
    * @param longitude2 地点2的经度
    * @param latitude2 地点2的纬度
    * @return 两个地点的距离，默认单位：米
    */
    public double getDistance(double longitude1, double latitude1, double longitude2, double latitude2) {
        return getDistance(longitude1, latitude1, longitude2, latitude2, RedisGeoCommands.DistanceUnit.METERS);
    }

    /**
    * 获取指定两个地点之间的距离
    * @param longitude1 地点1的经度
    * @param latitude1 地点1的纬度
    * @param longitude2 地点2的经度
    * @param latitude2 地点2的纬度
    * @param metric 距离单位
    * @return 两个地点的距离
    */
    public Double getDistance(double longitude1, double latitude1, double longitude2, double latitude2, Metric metric) {
        GeoOperations<String, String> geoOps = redisTemplate.opsForGeo();
        geoOps.add(LOCATION_GEO_KEY, new RedisGeoCommands.GeoLocation<>(POINT1, new Point(longitude1, latitude1)));
        geoOps.add(LOCATION_GEO_KEY, new RedisGeoCommands.GeoLocation<>(POINT2, new Point(longitude2, latitude2)));
        Double distance = Optional.ofNullable(geoOps.distance(LOCATION_GEO_KEY, POINT1, POINT2, metric))
            .map(Distance::getValue)
            .orElse(null);
        redisTemplate.delete(LOCATION_GEO_KEY);
        return distance;
    }
    ```

    ```java
    private static final String LOCATION_GEO_KEY = "loc_geo";
    private static final String POINT1 = "p1";
    private static final String POINT2 = "p2";
    private static final String POINT3 = "p3";
    //...其它地点标识

    GeoOperations<String, String> geoOps = redisTemplate.opsForGeo();

    //添加各个地点的位置信息
    geoOps.add(LOCATION_GEO_KEY, new RedisGeoCommands.GeoLocation<>(POINT1, new Point(longitude1, latitude1)));
    geoOps.add(LOCATION_GEO_KEY, new RedisGeoCommands.GeoLocation<>(POINT2, new Point(longitude2, latitude2)));
    geoOps.add(LOCATION_GEO_KEY, new RedisGeoCommands.GeoLocation<>(POINT3, new Point(longitude3, latitude3)));
    //...添加其它地点位置信息

    //获取LOCATION_GEO_KEY数据集内，距离POINT1地点n公里以内的其他地点
    List<String> points = Optional.ofNullable(geoOps.radius(LOCATION_GEO_KEY, POINT1, new Distence(n, Metrics.KILOMETERS)))
        .map(GeoResults::getContent)
        .orElseGet(Lists::newArrayList)
        .stream()
        .filter(Objects::nonNull)
        .map(GeoResult::getContent)
        .map(RedisGeoCommands.GeoLocation::getName)
        .distinct()
        .collect(Collectors.toList());
    ```
