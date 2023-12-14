# [归档] yutool-mq消息组件

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
        <artifactId>yutool-mq</artifactId>
    </dependency>
</dependencies>
```

### 2. 队列初始化

编写消息队列枚举 `SampleQueue`：

```java
@Getter
public enum SampleQueue implements IQueueEnum {
    /**
     * 普通队列
     */
    SAMPLE_QUEUE("sample.exchange", "sample", "sample"),
    /**
     * 延迟队列
     */
    SAMPLE_TTL_QUEUE("sample.exchange.ttl", "sample.ttl", "sample.ttl");

    private String exchange;
    private String name;
    private String routeKey;

    SampleQueue(String exchange, String name, String routeKey) {
        this.exchange = exchange;
        this.name = name;
        this.routeKey = routeKey;
    }
}
```

在项目中编写 `MqConfig` 配置类用于注册队列相关 Bean：

```java
@Configuration
public class MqConfig {

    @Bean
    public DirectExchange sampleExchange() {
        return MqUtils.direct(SampleQueue.SAMPLE_QUEUE);
    }

    @Bean
    public DirectExchange sampleTtlExchange() {
        return MqUtils.direct(SampleQueue.SAMPLE_TTL_QUEUE);
    }

    @Bean
    public Queue sampleQueue() {
        return MqUtils.queue(SampleQueue.SAMPLE_QUEUE);
    }

    @Bean
    public Queue sampleTtlQueue() {
        return MqUtils.ttlQueue(SampleQueue.SAMPLE_TTL_QUEUE, SampleQueue.SAMPLE_QUEUE);
    }

    @Bean
    public Binding sampleBinding() {
        return MqUtils.binding(sampleExchange(), sampleQueue(), SampleQueue.SAMPLE_QUEUE);
    }

    @Bean
    public Binding sampleTtlBinding() {
        return MqUtils.binding(sampleTtlExchange(), sampleTtlQueue(), SampleQueue.SAMPLE_TTL_QUEUE);
    }
}
```

### 3. 消息发送

```java
@Slf4j
public class MqTest1 {

    @Autowired
    private Sender sender;

    public void testSendMessage() {
        sender.sendMessage("Hello, MQ!", SampleQueue.SAMPLE_QUEUE);
    }

    public void testSendDelayMessage() {
        sender.sendDelayMessage("Hello, Delayed MQ!", SampleQueue.SAMPLE_TTL_QUEUE, 5000L);
    }
}
```


```java
@Slf4j
public class MqTest2 {

    //开启缓存服务时，可以注入RetryableSender
    @Autowired
    private RetryableSender sender;

    public void testSendMessage() {
        sender.sendMessage("Hello, MQ!", SampleQueue.SAMPLE_QUEUE);
    }

    public void testSendDelayMessage() {
        sender.sendDelayMessage("Hello, Delayed MQ!", SampleQueue.SAMPLE_TTL_QUEUE, 5000L);
    }

    public void testSendRetryableMessage() throws MqRetryException {
        sender.sendRetryableMessage("Hello, Retryable MQ!", SampleQueue.SAMPLE_QUEUE, RetryProps.builder()
                .retryable(true)
                .times(3)
                .strategy(RetryStrategy.PERIODIC)
                .firstDelayMillis(3000)
                .intervalMillis(1000)
                .build());
    }

    public void testSendDelayRetryableMessage() throws MqRetryException {
        sender.sendDelayRetryableMessage("Hello, Delay retryable MQ!", SampleQueue.SAMPLE_TTL_QUEUE, 5000L, RetryProps.builder()
                .retryable(true)
                .times(3)
                .strategy(RetryStrategy.PROGRESSIVE)
                .delays(Lists.newArrayList(3000L, 10000L, 20000L))
                .build());
        log.info("发送延迟重试消息");
    }
}
```

### 4. 消息接收

```java
@Slf4j
@Component
@RabbitListener(queues = "sample")
public class SampleMessageReceiver implements Receiver<String> {

    @RabbitHandler
    @Override
    public void handle(String message) {
        log.info("接收消息：{}", message);
    }
}
```
