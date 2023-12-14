# yutool-mq-core

消息组件核心类库，制定了消息发送和接收的标准接口。
## 消息发送接口
```java
public interface Sender<M extends Serializable> {

    /**
     * 立刻发送消息
     * @param message 消息体
     */
    void sendMessage(M message);

    /**
     * 发送消息
     * @param message 消息体
     * @param sendAt 发送时间
     */
    default void sendMessage(M message, LocalDateTime sendAt) {
        sendMessage(message, ChronoUnit.MILLIS.between(LocalDateTime.now(), sendAt));
    }

    /**
     * 延迟发送消息
     * @param message 消息体
     * @param delayMillis 延迟毫秒数
     */
    default void sendMessage(M message, long delayMillis) {
        sendMessage(message, Duration.ofMillis(delayMillis));
    }

    /**
     * 延迟发送消息
     * @param message 消息体
     * @param delayDuration 延迟时长
     */
    void sendMessage(M message, Duration delayDuration);

    /**
     * 设置上下文配置
     * @param key 配置Key
     * @param value 配置Value
     */
    default void setMqProp(String key, Object value) {
        MqContext.putMqProp(key, value);
    }

    /**
     * 获取上下文配置
     * @param key 配置Key
     * @return 配置Value
     */
    default Object getMqProp(String key) {
        return MqContext.getMqProp(key);
    }
}
```
使用MqContext消息上下文对象，可在发送消息时获取上下文信息，适配不同的场景。
## 消息接收接口
```java
public interface Receiver<M> {

    /**
     * 接收并处理消息
     * @param message 消息体
     */
    default void handle(M message) {
    }
}
```
