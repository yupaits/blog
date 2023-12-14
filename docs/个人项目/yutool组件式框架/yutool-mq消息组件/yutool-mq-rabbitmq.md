# yutool-mq-rabbitmq

基于spring-boot-starter-amqp组件，使用RabbitMQ消息中间件 ，实现消息的发送和接收。
## 消息发送
```java
public class RabbitMqSender<M extends Serializable> implements Sender<M> {
    private final RabbitTemplate rabbitTemplate;

    private long workerId = 0L;
    private long datacenterId = 0L;

    public RabbitMqSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public RabbitMqSender(RabbitTemplate rabbitTemplate, long workerId, long datacenterId) {
        this.rabbitTemplate = rabbitTemplate;
        this.workerId = workerId;
        this.datacenterId = datacenterId;
    }

    public RabbitMqSender<M> setExchange(String exchange) {
        MqContext.putMqProp(RabbitMqConstants.EXCHANGE_PROP_KEY, exchange);
        return this;
    }

    public RabbitMqSender<M> setRouteKey(String routeKey) {
        MqContext.putMqProp(RabbitMqConstants.ROUTE_KEY_PROP_KEY, routeKey);
        return this;
    }

    @Override
    public void sendMessage(M message) {
        String exchange = (String) MqContext.getMqProp(RabbitMqConstants.EXCHANGE_PROP_KEY);
        String routeKey = (String) MqContext.getMqProp(RabbitMqConstants.ROUTE_KEY_PROP_KEY);
        Assert.hasLength(exchange, "Exchange cannot be blank!");
        Assert.hasLength(routeKey, "RoutingKey cannot be blank!");
        CorrelationData correlationData = new CorrelationData(new Snowflake(workerId, datacenterId, true).nextIdStr());
        rabbitTemplate.convertAndSend(exchange, routeKey, message, msg -> {
            msg.getMessageProperties().setDeliveryMode(MessageDeliveryMode.PERSISTENT);
            ReturnedMessage returnedMessage = new ReturnedMessage(msg, 0, ResultCode.OK.getMessage(), exchange, routeKey);
            correlationData.setReturned(returnedMessage);
            return msg;
        }, correlationData);
    }

    @Override
    public void sendMessage(M message, Duration delayDuration) {
        String exchange = (String) MqContext.getMqProp(RabbitMqConstants.EXCHANGE_PROP_KEY);
        String routeKey = (String) MqContext.getMqProp(RabbitMqConstants.ROUTE_KEY_PROP_KEY);
        Assert.hasLength(exchange, "Exchange cannot be blank!");
        Assert.hasLength(routeKey, "RoutingKey cannot be blank!");
        if (Objects.isNull(delayDuration) || delayDuration.isZero()) {
            log.warn("Duration is {}, send message directly.", delayDuration);
            sendMessage(message);
            return;
        }
        if (delayDuration.isNegative()) {
            log.warn("Duration is {}, message will not send.", delayDuration);
            return;
        }
        CorrelationData correlationData = new CorrelationData(new Snowflake(workerId, datacenterId, true).nextIdStr());
        rabbitTemplate.convertAndSend(exchange, routeKey, message, msg -> {
            //给消息设置延迟毫秒值
            msg.getMessageProperties().setExpiration(String.valueOf(delayDuration.toMillis()));
            msg.getMessageProperties().setDeliveryMode(MessageDeliveryMode.PERSISTENT);
            ReturnedMessage returnedMessage = new ReturnedMessage(msg, 0, ResultCode.OK.getMessage(), exchange, routeKey);
            correlationData.setReturned(returnedMessage);
            return msg;
        }, correlationData);
    }
}
```
发送消息时，可指定exchange和routeKey。

RabbitMQ有两种方式实现延迟消息：第一种是采用`rabbitmq-delayed-message-exchange`插件；第二种是利用DLX（Dead Letter Exchanges） + TTL（消息存活时间）来间接实现。上述代码使用的是第二种方式，大致的实现思路为：

1. 创建一个普通队列delay_queue，为此队列设置死信交换机（通过`x-dead-letter-exchange`参数）和RoutingKey（通过`x-dead-letter-routing-key`参数），生产者将向delay_queue发送延迟消息。
2. 创建步骤1中设置的死信交换机，同时创建一个目标队列target_queue，并使用步骤1中设置的RoutingKey将两者绑定起来。消费者将从target_queue里面消费延迟消息。
3. 设置消息的存活时间TTL，可以在步骤1中设置到队列级别delay_quque的消息存活时间，或者在发送消息时动态设置消息级别的存活时间。

以下是发送延迟消息的示例代码：
```java
IQueueRule delayQueueRule = QueueEnum.DELAY_QUEUE_RULE;
IQueueRule targetQueueRule = QueueEnum.TARGET_QUEUE_RULE;

DirectExchange delayExchange = MqUtils.direct(delayQueueRule);
DirectExchange targetExchange = MqUtils.direct(targetQueueRule);

Queue delayQueue = MqUtils.ttlQueue(delayQueueRule, targetQueueRule);
Queue targetQueue = MqUtils.queue(targetQueueRule);

MqUtils.binding(delayExchange, delayQueue, delayQueueRule);
MqUtils.binding(targetExchange, targetQueue, targetQueueRule);

MqContext.putMqProp(RabbitMqConstants.EXCHANGE_PROP_KEY, delayQueueRule.getExchange());
MqContext.putMqProp(RabbitMqConstants.ROUTE_KEY_PROP_KEY, delayQueueRule.getRouteKey());
rabbitMqSender.sendMessage(msg, Duration.ofMinutes(1L));
MqContext.removeMqProps();
```
## 消息接收
RabbitMQ接收消息可分别使用`@Payload`和`@Headers`注解来获取消息体和消息头。
```java
public interface RabbitMqReceiver<M extends Serializable> extends Receiver<M> {

    /**
     * 接收并处理消息
     * @param message 消息体 {@link org.springframework.messaging.handler.annotation.Payload}
     * @param headers 消息头 {@link org.springframework.messaging.handler.annotation.Headers}
     */
    default void handle(M message, Map<String, Object> headers) {
    }
}
```
