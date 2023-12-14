# yutool-mq-kafka

基于spring-kafka的消息组件，使用Kafka消息中间件，实现消息的发送和接收。
## 消息发送
```java
public class KafkaSender<M extends Serializable> implements Sender<M> {
    private final KafkaTemplate<String, M> kafkaTemplate;
    private final KafkaSendCallback<String, M> kafkaSendCallback;

    public KafkaSender(KafkaTemplate<String, M> kafkaTemplate) {
        this(kafkaTemplate, null);
    }

    public KafkaSender(KafkaTemplate<String, M> kafkaTemplate, KafkaSendCallback<String, M> kafkaSendCallback) {
        this.kafkaTemplate = kafkaTemplate;
        this.kafkaSendCallback = kafkaSendCallback;
    }

    public KafkaSender<M> setTopic(String topic) {
        MqContext.putMqProp(KafkaConstants.TOPIC_PROP_KEY, topic);
        return this;
    }

    public KafkaSender<M> setKey(String key) {
        MqContext.putMqProp(KafkaConstants.MESSAGE_KEY_PROP_KEY, key);
        return this;
    }

    public KafkaSender<M> setPartition(Integer partition) {
        MqContext.putMqProp(KafkaConstants.PARTITION_PROP_KEY, partition);
        return this;
    }

    @Override
    public void sendMessage(M message) {
        String topic = (String) MqContext.getMqProp(KafkaConstants.TOPIC_PROP_KEY);
        Assert.hasLength(topic, "Topic cannot be blank!");
        String key = (String) MqContext.getMqProp(KafkaConstants.MESSAGE_KEY_PROP_KEY);
        Integer partition = (Integer) MqContext.getMqProp(KafkaConstants.PARTITION_PROP_KEY);
        if (Objects.nonNull(kafkaSendCallback)) {
            kafkaTemplate.send(topic, partition, key, message)
                    .addCallback(kafkaSendCallback);
            return;
        }
        kafkaTemplate.send(topic, partition, key, message);
    }

    /**
     *
     * @param message 消息体
     * @param delayDuration 延迟时长
     */
    @Override
    public void sendMessage(M message, Duration delayDuration) {
        ExpUtils.throwBizExp(ResultCode.UNSUPPORTED_OPERATION);
    }
}
```
发送消息时可指定topic、partition，消息key（标识），以及消息发送回调方法。

由于Kafka自身并不支持直接发送延迟消息，因此在默认的消息发送实现并不支持延迟消息。但是可以通过实现一层代理服务来达到效果，具体为：**发送端将消息发送到延迟Topic，代理服务消费延迟Topic的消息然后转存起来，代理服务通过一定的算法，计算延迟消息所附带的延迟时间是否到达，然后将延迟消息取出来并发送到实际的Topic里面，消费端从实际的Topic里面进行消费。**

## 消息接收
Kafka支持消息批量消费，这里定义了单条消息接收器和批量消息接收器接口。
```java
/**
 * 消费单条消息接收器
 */
public interface KafkaReceiver<M extends Serializable> extends Receiver<ConsumerRecord<String, M>> {
}

/**
 * 批量消息接收器
 */
public interface KafkaBatchReceiver<M extends Serializable> extends Receiver<ConsumerRecords<String, M>> {
}
```
