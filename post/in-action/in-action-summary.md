---
sidebar: auto
---
# 开发实战总结

总结了一些实际开发过程中需要注意的一些细节。（持续更新...）

<!--more-->

## Java

1. `RandomUtils.nextInt()` 生成随机整数，`RandomStringUtils` 生成随机字符串。
1. 实现随机抽取集合里面的部分元素 `Collections.shuffle(list)` 将 list 元素循序打乱 `list.subList(0, loreResource.getQuesNum()); // subList(fromIndex, toIndex)的实际范围是[fromIndex, toIndex)` 获取指定数量的元素。
1. `ListUtils.select()` 方法，类似于 JQuery 数组的 filter 方法。
1. `System.out.println(Arrays.toString(someList.toArray()));` 方法可以方便地打印List内容。
1. `Arrays.asList(T... a)` 无法将基本类型转换为 List，原因是 `asList()` 方法接收的是泛型的可变长参数，而基本类型（如int，char等）是无法泛型化的。使用 `asList()` 对基本数据类型进行操作时需要使用基本数据类型的包装类。`asList()` 返回的 ArrayList 类型是 `Arrays` 的一个内部类，没有实现 `add()` 、 `remove()` 等用于操作 ArrayList 的方法，当我们需要对 `asList()` 返回的列表进行常用操作时需要对其进行转换，`List list = new ArrayList(Arrays.asList(testArray));`

1. Java类启动顺序，`static` 静态代码先于构造方法。 

## SpringBoot

1. 如果项目启用了事务管理，Service 的实现类在增删改数据时需要加上 `@Transactional` 注解标明该类或方法加入了事务管理。
1. 使用 shiro 权限框架时，需要检查需要权限控制的 Controller 类或方法是否加上了 `@RequiresRoles` 或 `@RequiresPermissions` 注解。
1. Controller 的方法传入 `@RequestBody` 参数时，method 只能是 POST 或 PUT。
1. Controller 通过 Model 对象实例通过 setAttribute 方法传值到前端 jsp 页面或是其他模板页面时，如果是在 js 里获取的话需要通过 var param = '${param}' 方式获取，用''引起来可以避免当 ${param} 为空时 js 代码报错的问题，但同时也将参数类型强制转换为 string 类型了；当参数类型是 List 集合时，需要使用 eval('${param}') 方法。
1. 后台在增删改数据时，记得更新和该数据相关的缓存；特别是在更改记录时要更新更改之前和之后会包含该记录的缓存。
1. 跨域访问时，可以在全局 Interceptor 中使用 `httpServletResponse.setHeader("Access-Control-Allow-Origin", ACCESS_CONTROL_ALLOW_ORIGIN)` 限制可跨域访问的域名，类似的，使用 `httpServletResponse.setHeader("Access-Control-Allow-Methods", ACCESS_CONTROL_ALLOW_METHODS)` 限制请求方法，`httpServletResponse.setHeader("Access-Control-Max-Age", ACCESS_CONTROL_MAX_AGE)` 设置可跨域访问的时限， `httpServletResponse.setHeader("Access-Control-Allow-Headers", ACCESS_CONTROL_ALLOW_HEADERS)` 限制请求头参数。 
1. SpringBoot 中可以使用 `@EnableScheduling` 注解启用定时任务功能，在方法上使用 `@Scheduled` 注解设置任务启动的时间。
1. 访问日志功能的实现：定义一个 LogInterceptor ，使用 `logger.info()` 等方法记录下 httpServletRequest 中相关属性。
1. shiro 的 reaml 中保存的 Principal 为 User 对象时，页面上想要获取 User 对象的 username 属性可以使用 `<shiro:principal property="username"/>` 标签，注意这里的 property 即是对应的属性名。
1. Spring 框架自带的 `BeanUtils.copyProperties(Object source, Object target, String... ignoreProperties)` 方法可以方便的做类属性的拷贝。
1. SpringBoot security 在使用 `.antMatchers("/management/**").hasAnyRole("SuperAdmin", "admin")` 要注意数据库里保存的角色名称必须要以 `'ROLE_'` 开头，这里的角色在数据库的名称应为 `"ROLE_SuperAdmin"` 和 `"ROLE_admin"`。

1. SpringBoot security 的注解 `@PreAuthorize` 可以用在类或方法上来进行权限控制，其中 `hasRole()` 和 `hasAuthority()` 的区别在于前者可以忽略角色信息的前缀（默认是 "ROLE_"），而后者则必须要包含前缀。例如当保存的角色信息为"ROLE_admin"时， `hasRole('admin')` 和 `hasAuthority('ROLE_admin')` 是等效的。
1. SpringBoot 在整合 shiro 时无法在使用 rememberMeCookie 实现"记住我"（即 rememberMe）功能的同时实现使用 sessionIdCookie 单独管理用户 session 信息。而使用 sessionIdCookie 可以解决出现404之后刷新页面直接跳转到登录页面的问题（问题详情：<http://jinnianshilongnian.iteye.com/blog/1999182>）。
1. SpringBoot JPA 可以很简单的集成分页和排序功能，支持的 request 参数如下：
    ```
    page，第几页，从 0 开始，默认为第 0 页；  
    size，每一页的数量，默认为 10；  
    sort，排序相关的信息，以 `property,direction(,ASC|DESC)` 的方式组织，例如 `sort=firstname&sort=lastname,desc` 表示在按 firstname 增序排列的基础上按 lastname 的降序排列。  
    ```
        
    例如请求链接为：
    `http://host:port/blogs?page=0&size=3&sort=category,asc&sort=description,desc`
        
    ```Java
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

1. 使用 jackson 将实体对象转成 JSON ，在属性上加上 @JsonInclude(JsonInclude.Include.NON_NULL) 注解，当该属性NULL或者为空时将不参加序列化。JsonInclude 可选项有：
    ```
    JsonInclude.Include.ALWAYS      //默认总是参加序列化
    JsonInclude.Include.NON_DEFAULT //属性为默认值不序列化
    JsonInclude.Include.NON_EMPTY   //属性为空或NULL都不序列化
    JsonInclude.Include.NON_NULL    //属性为NULL不序列化
    ```
1. 实体类里的**Enum**类型的属性映射数据库字段的时候可以使用 `@Convert(converter = Status.class, attributeName = "status")` 注解；jackson 在序列化**Enum**类型的时候可以在**Enum**类对应的**getter**方法使用 `@JsonValue` 注解来定义向前端输出的内容，而前端传过来的值同样可以通过 `@JsonCreator` 注解反序列化得到对应的**Enum**类型对象。

1. _1.5.6.RELEASE_ 版本的**SpringBoot**在使用 `ElasticsearchRespository` 类时会产生以下异常：
    ```
    Failed to write HTTP message: org.springframework.http.converter.HttpMessageNotWritableException:                 Could not write JSON document: (was java.lang.NullPointerException) (through reference chain: org.springframework.data.elasticsearch.core.aggregation.impl.AggregatedPageImpl["facets"]); nested exception is com.fasterxml.jackson.databind.JsonMappingException: (was java.lang.NullPointerException) (through reference chain:     org.springframework.data.elasticsearch.core.aggregation.impl.AggregatedPageImpl["facets"])
    ```
    推荐使用 _1.4.7.RELEASE_ 版本。

1. Json 序列化的时候会将 Long 等类型强转成类似于 Javascript 中的 number 类型（内部实现**可能**是转成 Double 类型），这样会导致大数值丢失精度的问题。jackson 可以使用 `@JsonSerialize(using = ToStringSerializer.class)` 注解将 Long 类型转成String 再进行序列化，但这样会导致前端接收到的数据类型变成了 String 而不是 number。

1. 在进行批量更新操作时，需要将待更新的数据进行排序之后再进行批量操作，这样可以避免并发场景下的死锁问题。
1. @RequestBody注解的实体对象如果需要将前端传过来的 array 转成实体中相应的 String 类型的属性时，可以在该属性的 setter 方法进行转换操作。
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
    相应的，如果需要将数据库中存储的 String 转成 List 传回前端或者应用于后台逻辑，可以在字段对应属性的 getter 方法进行转换。
    这里使用的是 fastjson 的 JSON 类。
1. 过长的 Long 类型主键转 Json 传回前端会使用js处理会丢失精度，可以在实体的 @Id 上配置转成 Json 的序列化及反序列化处理类，在将 id 传回前端或者接收 前端传过来的 id 时使用 String 类型来进行转换保证精度，代码如下：
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
1. SpringAop的Order顺序遵循先进后出的原则。如Aop1（order=1），Aop2（order=2），则切面的执行顺序为`Aop1.doAround.beforeProceed` ->  `Aop1.doBefore` -> `Aop2.doAround.beforeProcced` -> `Aop2.doBefore` -> `Aop2.doAround.afterProcced` -> `Aop2.doAfter` -> `Aop2.doAfterReturning` -> `Aop1.doAround.afterProcced` -> `Aop1.doAfter` -> `Aop1.doAfterReturning`。

1. Spring Boot启动时指定环境。

    - IDEA中进入 `Run/Debug Configurations` 设置 `Environment->VM options` 为 `-Dspring.profiles.active=test`，或者在 `Environment variables` 中添加参数 `spring.profiles.active` 并指定参数的值为 `test`。
    - 命令行使用 `java -jar *.jar` 启动时，在命令的后面增加 `--spring.profiles.active=test`。
    - 在 `application.yml` 中配置 `spring.profiles.active` 的值为 `test`。

1. 通过zuul上传包含中文名的文件时，需要在上传文件url的path加上 `/zuul` 前缀即可。

    例如：当上传url为 `http://localhost:10060/upload/image`，上传名为 `头像.jpg` 的文件，会出现报错 `java.io.FileNotFoundException: E:\upload\image\2018-5\??.jpg (文件名、目录名或卷标语法不正确。)`。如果将url直接改为`http://localhost:10060/zuul/upload/image` 则可以上传成功。

1. Spring Boot Jpa实现实体联合主键：实体类加上 `@IdClass(XxxKey.class)` 注解，实体类中多个联合注解的属性上都加上 `@Id` 注解。示例：
    ```Java
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

1. 使用Spring Cloud Sleuth的日志中会包含链路追踪的信息，具体体现为:
    ```
    2017-04-08 23:56:50.459 INFO [bootstrap,38d6049ff0686023,d1b8b0352d3f6fa9,false] 8764 — [nio-8080-exec-1] demo.JpaSingleDatasourceApplication : Step 2: Handling print
    2017-04-08 23:56:50.459 INFO [bootstrap,38d6049ff0686023,d1b8b0352d3f6fa9,false] 8764 — [nio-8080-exec-1] demo.JpaSingleDatasourceApplication : Step 1: Handling home
    ```

    比一般的日志多出了 `[bootstrap,38d6049ff0686023,d1b8b0352d3f6fa9,false]` 这些内容，对应 `[appname,traceId,spanId,exportable]`。
    - appname：服务名称
    - traceId\spanId：链路追踪的两个术语
    - exportable: 是否是发送给zipkin

1. SpringBoot中使用 `logback-spring.xml` 进行日志打印的配置。示例：
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

1. Spring的事务控制和数据库的事务控制之间的关系：

    - 数据库开启事务、提交事务、回滚事务对应jdbc的三个api，Spring事务控制的本质是通过AOP把这三个方法增强在不同的地方调用，实现Spring的事务在方法之间的传播。
    - 数据库在开启事务到提交的过程中，数据库本身有异常都会回滚。 
    - 业务异常导致数据库回滚，是Spring通过调用 `jdbc rollback` 的api实现的。

1. Spring Security OAuth2 Client项目中@EnableOAuth2Sso注解修饰Application启动类时不起作用，需要放在@Configuration修饰的类上（通常是继承WebSecurityConfigurerAdapter的配置类）才能正常工作。

1. 检查幂等（是否重复请求）伪代码：

    ```sql
    CREATE TABLE `tb_unique` (
        `request_id` varchar(64) NOT NULL COMMENT 'request id',
        `gmt_create` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
        `gmt_modified` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '修改时间',
        PRIMARY KEY (`request_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='幂等表';
    ```

    ```Java
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

## Bootstrap

1. 页面的modal元素记得加上 `data-backdrop='static'` 和 `data-keyboard='false'`，禁用非 modal 内点击和点击键盘 ESC 键 取消 modal。

## JQuery

1. 批量删除并返回批量删除的结果时，ajax 方法中 async 一定要配置成 false，否则页面无法正确响应批量删除的结果。

1. 使用 qrcodejs 生成二维码图片之后直接使用 `$('img').attr('src')` 返回的值是undefined，这时需要使用 `setTimeout(function(), delay_time)` 来拿到图片的 src 。

1. js数组遍历删除元素的方法：

    ```javascript
    for (let i = 0; i < arr.length; i++) {
        if (...) {
            arr.splice(i, 1);
            i--;
        }
    }
    ```

## CSS
1. 局部列表滚动查看css，height和max-height二选一。

    ```css
    .grid-list {
        height: 190px; //固定高度的列表
        max-height: 500px; //列表最大高度
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .grid-list::-webkit-scrollbar {
        display: none;
    }
    ```

## HTML
1. 使用原生HTML进行表单开发时，如果没有指定 `<button>` 的 `type` 属性，则默认 `type="submit"`，最终导致点击之后 `window.location.href` 的路径中会自动多一个 `?`，这是因为原生的表单提交是以path后拼接form的参数进行请求的，所以在进行异步请求时需要指定提交的按钮为 `<button type="button">`。

## Vue.js
1. 使用局部的 filter 代替 methods 中的方法格式化数据显示。
1. vue 在绑定 date 类型的 input 输入框时，设置默认值要用 `:value="date | toDate"`，toDate 为过滤器；当 date 的值是 timestamp 类型时，toDate 可以为以下方法：
    ```javascript
    function dateTime(date) {
        if (date) {
            date = new Date(date);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            return date.getFullYear() + '-' + 
                (month < 10 ? '0' + month : month) + '-' + 
                (day < 10 ? '0' + day : day) + ' ' + 
                (hour < 10 ? '0' + hour : hour) + ':' + 
                (minute < 10 ? '0' + minute : minute) + ':' + 
                (second < 10 ? '0' + second : second);
        }
        return date;
    }
    ```
1. vue.js 2.5.2版本在 v-for 循环中使用 v-model 绑定数组元素时会报如下错误：
    ```
    You are binding v-model directly to a v-for iteration alias. This will not be able to modify the v-for source array because writing to the alias is like modifying a function local variable. Consider using an array of objects and use v-model on an object property instead.
    ```
    从提示信息可以看出 vue 建议使用 array 的某个元素的属性值作为 v-model 绑定的主体，如果元素并不是 Object 类型而是 String 类型时，需要通过 index 来实现元素绑定。具体代码如下：
    ```html
    <div v-for="(el, index)  in array">
        <input type="text" v-model="array[index]">
    </div>
    ```
1. 将数组中位于 index1 的元素移动至 index2 的位置：
    ```javascript
    list.splice(index2, 0, list.splice(index1, 1)[0]);
    ```
    交换数组中位于 index1 和 index2 的两个元素：
    ```javascript
    list[index1] = list.splice(index2, 1, list[index1])[0];
    ```
    vue 组件中实时交换位于 index1 和 index2 的两个元素：
    ```javascript
    this.$set(list, index1, list.splice(index2, 1, list[index1])[0]);
    ```

1. Vue的 `filters` 块中的过滤器不能加载自身 `data()` 块中的变量，如果需要使用 `data()` 中的变量对数据进行转换时可以将过滤器的逻辑写在 `methods` 块中。

## 缓存
1. 使用 redis-cli 进入 redis 的命令行模式时，可以使用 `keys **` 查看所有 key 值，使用 `get [key]` 查看 key 对应的 value 值。需要注意的是，使用 `keys **` 查看到的 key 值如果使用 "" 包括，那么 `get [key]` 的 key 也需要用 "" 包括起来。

## 构建
1. 使用 **`frontend-maven-plugin`** 整合前后端项目构建时，需要注意web模块需要放在server模块之前，保证web先构建，这样才能将web构建好的文件复制到server的 `resources/public` 目录下。

    ```xml
    <modules>
        <module>xxx-web</module>
        <module>xxx-server</module>
    </modules>
    ```

    同时要注意后台不要对 `@RequestMapping("/")` 做处理，否则有可能会使得访问 `"/"` 无法显示前端构建好的index.html页面。

1. maven引用私服的jar包时，需要在 `pom.xml` 文件的 `<repositories>` 标签下中指定私服的 `<id>`、`<name>`、`<url>`。

1. gitlab-runner的 `config.toml` 在 `[runners.docker] `中配置 `extra_hosts = ["xxx.xxx.com:172.17.0.1"]`可实现runner容器的ip和host映射关系的配置。

## 部署
1. windows 下使用 Nginx 相关命令如下：
    ```
    #启动
    点击 Nginx 目录下的 nginx.exe；cmd 运行 start nginx

    #关闭
    nginx -s stop #立即停止nginx，不保存相关信息
    nginx -s quit #正常退出nginx，并保存相关信息

    #重启（重新加载配置）
    nginx -s reload
    ```
1. nginx 的配置文件 root 路径不识别 `\` 只识别 `/`。

1. Letsencrypt通配符证书的申请和在nginx配置：
    - [申请Let's Encrypt通配符HTTPS证书](https://my.oschina.net/kimver/blog/1634575)
    - [How to configure Nginx with Let’s Encrypt on Debian/Ubuntu Linux](http://www.cyberciti.biz/faq/how-to-configure-nginx-with-free-lets-encrypt-ssl-certificate-on-debian-or-ubuntu-linux/)

1. 使用 nginx 解决 CORS 问题

    使用反向代理将服务端（接口提供方）与客户端（接口调用方）部署在同一个域下。

1. 使用 nginx 解决 X-Frame-Options: deny 问题

    使用[headers-more](https://github.com/openresty/headers-more-nginx-module)插件，推荐直接下载带headers-more模块的openresty，[下载地址](https://openresty.org/en/download.html)。

    在 nginx.conf 中（一般是在server下）配置：

    ```conf
    # 删除 "X-Frame-Options" header
    more_clear_headers 'X-Frame-Options';
    # 设置 "X-Frame-Options: SAMEORIGIN" 同域可嵌入iframe
    more_set_headers 'X-Frame-Options: SAMEORIGIN';
    ```

1. 指定MySQL时区，在mysqld.conf中增加 `default-time-zone='+8:00'` 配置。

1. 在做微信公众号开发时，需要在公网上调用开发机器的接口，除了使用花生壳等软件进行内网穿透之外，如果有富余的公网服务器资源，可以使用一些简单方便的内网穿透工具，推荐 [ichWebpass](https://github.com/sosont/ichWebpass)。

1. gitlab pg数据库配置

    修改`/var/opt/gitlab/postgresql/data/pg_hba.conf`文件，增加下面的配置：

    ```
    host all all 192.168.1.10/22 trust
    ```

    上述的修改会在使用`gitlab-ctl reconfigure`命令之后失效，通过修改gitlab配置文件中pg数据库的entries可以避免这种情况。具体为：

    在gitlab.rb中增加

    ```toml
    postgresql['custom_pg_hba_entries'] = {
      APPLICATION: [{ # APPLICATION should identify what the settings are used for
        type: 'host',
        database: 'all',
        user: 'all',
        cidr: '192.168.1.0/24',
        method: 'trust',
        #option: 0
      }]
    }
    ```

    **注意：** 这里的`APPLICATION`对象是一个数组，有些gitlab版本默认不是数组，需要手动修改。

## Git

1. GitHub 现在支持创建私有代码仓库了，但使用时需要注意：将 GitHub 的 repository 从 ***public*** 切换成 ***private*** 再切回 ***public*** 之后，需要 `push` 代码到 `master` 分支才能让已经404的 `Github Pages` 页面恢复正常。


## Windows

1. 为了在windows系统上安装docker，需要将win10系统升级到专业版开启HyperV虚拟机才行。
    
    win10专业版升级密钥：DR9VN-GF3CR-RCWT2-H7TR8-82QGT

## Linux
1. Ubuntu/Debian开机启动脚本 `spider.sh` 示例：

    ```shell
    #!/bin/bash

    ### BEGIN INIT INFO
    # Provides: spider
    # Required-Start:
    # Required-Stop:
    # Default-Start: 2 3 4 5
    # Default-Stop: 0 1 6
    # Short-Description: spider
    # Description: spider service start
    ### END INIT INFO

    [shell content]
    ```

    - 开机启动：`update-rc.d spider.sh defaults`
    - 移除开机启动：`update-rc.d spider.sh remove`

1. 使用netstat查看系统网络端口情况：`netstat -tunlp`；如果发现没有 `PID` (进程号)，需要使用 `sudo netstat -tunlp`。

1. 对于新安装的官方Ubuntu-server等系统，可以通过指令 `sudo apt-get install build-essential` 安装gcc环境。

1. 取消sudo密码：`sudo visudo` 进入编辑界面；添加行 `username ALL=(ALL) NOPASSWD:ALL`，username为登录用户名，如果想作用于某个用户组则使用 `%usergroup ALL=(ALL:ALL) NOPASSWD:ALL`。

## Docker
1. 使用docker-compose的build参数构建docker镜像时，要注意指定的context目录下默认的Dockerfile文件名必须为 `Dockerfile`。如果想使用其他文件名，可以通过 `-f filename` 指定。 

1. docker环境为docker for windows，有效避免host为windows系统时 `docker run -v` 绑定的目录映射关系在系统重启之后失效的方法为：使用 `docker volume create path1` 创建volume，再使用 `-v path1:/container/path`。简单地说就是使用 “自定义数据卷” 代替 “容器自动创建的临时数据卷” 进行映射，完成docker容器的数据持久化。

1. 指定docker的dns，防止网络环境变化时导致容器网络的不稳定。
    编辑docker的`daemon.json`:
    ```json
    {
        "dns": ["114.114.114.114", "8.8.8.8"]
    }
    ```

1. 使用docker-compose来部署redash时，注意需要先创建redash数据库才能启动：

    ```bash
    sudo docker-compose run --rm server create_db
    sudo docker-compose up -d
    ```

1. 使用docker方式部署consul时，由于consul在docker虚拟网络中无法正确识别注册服务的hostname，因此需要在注册服务中配置 spring.cloud.consul.discovery.hostname=192.168.1.xxx (注册服务的局域网ip，要注意的是必须是docker宿主机所在地局域网ip，使用172.17.0.1等docker内网ip也不行)，才能确保consul正确地进行健康检查。