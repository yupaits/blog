# yutool-mq-rocketmq

基于rocketmq-spring-boot-starter组件，使用RokcetMQ消息中间件，实现消息的发送和接收。
## 消息发送
```java
public class RocketMqSender<M extends Serializable> implements Sender<M> {
    private final RocketMQTemplate rocketMQTemplate;
    private final SendCallback sendCallback;
    private final DelayLevelDecision delayLevelDecision;

    public RocketMqSender(RocketMQTemplate rocketMQTemplate, SendCallback sendCallback, DelayLevelDecision delayLevelDecision) {
        this.rocketMQTemplate = rocketMQTemplate;
        this.sendCallback = sendCallback;
        this.delayLevelDecision = delayLevelDecision;
    }

    public RocketMqSender<M> setTopic(String topic) {
        MqContext.putMqProp(RocketMqConstants.TOPIC_PROP_KEY, topic);
        return this;
    }

    public RocketMqSender<M> setTag(String tag) {
        MqContext.putMqProp(RocketMqConstants.TAG_PROP_KEY, tag);
        return this;
    }

    public RocketMqSender<M> setTimeout(long timeout) {
        MqContext.putMqProp(RocketMqConstants.TIMEOUT_PROP_KEY, timeout);
        return this;
    }

    @Override
    public void sendMessage(M message) {
        String topic = (String) MqContext.getMqProp(RocketMqConstants.TOPIC_PROP_KEY);
        String tag = (String) MqContext.getMqProp(RocketMqConstants.TAG_PROP_KEY);
        Assert.hasLength(topic, "Topic cannot be blank!");
        Assert.hasLength(tag, "Tag cannot be blank!");
        long timeout = (long) MqContext.getMqProp(RocketMqConstants.TIMEOUT_PROP_KEY, RocketMqConstants.DEFAULT_TIMEOUT_MILLIS);
        String destination = StrUtil.format("{}:{}", topic, tag);
        if (Objects.nonNull(sendCallback)) {
            rocketMQTemplate.asyncSend(destination, message, sendCallback, timeout);
            return;
        }
        rocketMQTemplate.syncSend(destination, message, timeout);
    }

    @Override
    public void sendMessage(M message, Duration delayDuration) {
        if (Objects.isNull(delayLevelDecision)) {
            ExpUtils.throwBizExp(ResultCode.UNSUPPORTED_OPERATION);
        }
        String topic = (String) MqContext.getMqProp(RocketMqConstants.TOPIC_PROP_KEY);
        String tag = (String) MqContext.getMqProp(RocketMqConstants.TAG_PROP_KEY);
        Assert.hasLength(topic, "Topic cannot be blank!");
        Assert.hasLength(tag, "Tag cannot be blank!");
        long timeout = (long) MqContext.getMqProp(RocketMqConstants.TIMEOUT_PROP_KEY, RocketMqConstants.DEFAULT_TIMEOUT_MILLIS);
        String destination = StrUtil.format("{}:{}", topic, tag);
        Message<M> msg = MessageBuilder.withPayload(message).build();
        if (Objects.nonNull(sendCallback)) {
            rocketMQTemplate.asyncSend(destination, msg, sendCallback, timeout, delayLevelDecision.decideLevel(delayDuration));
            return;
        }
        rocketMQTemplate.syncSend(destination, msg, timeout, delayLevelDecision.decideLevel(delayDuration));
    }
}
```
发送消息时可指定topic、tag，设置超时时间，以及发送回调方法。

RocketMQ支持延迟消息，默认支持18个level的延迟消息，这是通过broker端的`messageDelayLevel`配置项确定的：
```properties
messageDelayLevel=1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h
```
消息队列服务在启动时，会创建一个内部topic：`SCHEDULE_TOPIC_XXXX`，根据延迟level的个数，创建对应数量的队列，不同的延迟级别会对应不同的队列序号。生产者发送的消息会暂存在broker对应的内部topic中，再通过定时任务从内部topic中拉取数据，如果延迟时间到了，就会把消息转发到目标topic下，消费者从目标topic消费消息。

## 消息接收
```java
public interface RocketMqReceiver<M> extends RocketMQListener<M>, Receiver<M> {

    @Override
    default void onMessage(M message) {
        handle(message);
    }
}
```
