# yutool-push-core

推送组件核心类库，制定了5种类型消息（移动APP通知、Web网页消息、sms短信、Email电子邮件、IM消息）的数据结构，并针对各种消息实现了基础的发送接收功能。

由于移动APP通知、sms短信、IM消息在市场上有大量供应商提供服务，需要对这些第三方服务进行标准化，因此定义了供应商接入的标准接口方便扩展。

## 消息推送器

```java
public interface MsgSender {

    /**
     * 推送消息
     * @param payload 消息体
     */
    void pushMsg(MsgPayload payload);
}
```

消息推送器接口的简单实现：

```java
public class SimpleMsgSender implements MsgSender {
    private final MultiValueMap<PushType, MsgReceiver> receivers = new LinkedMultiValueMap<>();
    private ExecutorService pool;

    public void addReceiver(PushType pushType, MsgReceiver receiver) {
        Assert.notNull(receiver, "Receiver cannot be null!");
        this.receivers.add(pushType, receiver);
    }

    public void removeReceiver(PushType pushType) {
        this.receivers.remove(pushType);
    }

    private ExecutorService buildPool() {
        return new ThreadPoolExecutor(5, 200, 0L, TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<>(1024),
                new ThreadFactoryBuilder().setNameFormat("msg-sender-%d").build(),
                new ThreadPoolExecutor.AbortPolicy());
    }

    @PreDestroy
    public void release() {
        Optional.ofNullable(this.pool).ifPresent(ExecutorService::shutdown);
    }

    @Override
    public void pushMsg(MsgPayload msgPayload) {
        this.pool = buildPool();
        try {
            if (msgPayload.isDelayed() && msgPayload.getDelayMillis() > 0) {
                TimeUnit.MILLISECONDS.sleep(msgPayload.getDelayMillis());
            }
            for (Map.Entry<PushType, Pair<IMsg, List<String>>> entry : msgPayload.getPayload().entrySet()) {
                receivers.getOrDefault(entry.getKey(), Lists.newArrayList())
                        .forEach(receiver -> this.pool.execute(() -> receiver.handle(msgPayload)));
            }
        } catch (InterruptedException e) {
            throw BizException.of("Delay push msg error", e);
        } finally {
            this.pool.shutdown();
        }
    }
}
```

## 消息接收器

```java
public interface MsgReceiver {

    /**
     * 获取消息类型
     * @return 消息类型
     */
    PushType pushType();

    /**
     * 接收并处理消息
     * @param msgPayload 消息载体
     */
    void handle(MsgPayload msgPayload);
}
```

### 移动APP通知

APP通知消息监听器：
```java
@Slf4j
@RequiredArgsConstructor
public class NotificationReceiver implements MsgReceiver {
    private final NotificationProvider notificationProvider;

    @Override
    public PushType pushType() {
        return PushType.NOTIFICATION;
    }

    @Override
    public void handle(MsgPayload msgPayload) {
        msgPayload.checkValid();
        if (!msgPayload.getPayload().containsKey(pushType())) {
            log.warn("No {} msg for {}", pushType(), this.getClass().getSimpleName());
            return;
        }
        Pair<IMsg, List<String>> msgPair = msgPayload.getPayload().get(pushType());
        Notification notification;
        if (msgPair.getKey() instanceof Notification) {
            notification = (Notification) msgPair.getKey();
        } else {
            log.warn("NotificationReceiver cannot handle [{}]", msgPair.getKey().getClass().getSimpleName());
            return;
        }
        notification.checkValid();
        notificationProvider.pushNotification(notification, msgPair.getValue());
    }
}
```

### Web网页消息

Web网页消息监听器：
```java
@Slf4j
@RequiredArgsConstructor
public class WebMsgReceiver implements MsgReceiver {
    private final WebMsgHandler webMsgHandler;
    private ExecutorService pool;

    private ExecutorService buildPool() {
        return new ThreadPoolExecutor(5, 200, 0L, TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<>(1024),
                new ThreadFactoryBuilder().setNameFormat("sms-worker-%d").build(),
                new ThreadPoolExecutor.AbortPolicy());
    }

    @PreDestroy
    public void release() {
        Optional.ofNullable(this.pool).ifPresent(ExecutorService::shutdown);
    }

    @Override
    public PushType pushType() {
        return PushType.WEB_MSG;
    }

    @Override
    public void handle(MsgPayload msgPayload) {
        msgPayload.checkValid();
        if (!msgPayload.getPayload().containsKey(pushType())) {
            log.warn("No {} msg for {}", pushType(), this.getClass().getSimpleName());
            return;
        }
        Pair<IMsg, List<String>> msgPair = msgPayload.getPayload().get(pushType());
        WebMsg webMsg;
        if (msgPair.getKey() instanceof WebMsg) {
            webMsg = (WebMsg) msgPair.getKey();
        } else {
            log.warn("WebMsgReceiver cannot handle [{}]", msgPair.getKey().getClass().getSimpleName());
            return;
        }
        webMsg.checkValid();
        String content = TemplateUtils.render(webMsg.getMsgTemplate(), webMsg.getParams());
        WebMessage message = WebMessage.builder()
                .action(webMsg.getAction())
                .title(webMsg.getTitle())
                .content(content)
                .extras(webMsg.getExtras())
                .build();
        batchSendWebMsg(msgPair.getValue(), new TextMessage(JsonUtils.toJsonString(message)));
    }

    /**
     * 批量推送Web网页消息
     * @param userIds 目标用户ID集合
     * @param message 推送的消息
     */
    private void batchSendWebMsg(Collection<String> userIds, TextMessage message) {
        this.pool = buildPool();
        for (String userId : userIds) {
            this.pool.execute(() -> {
                try {
                    webMsgHandler.sendMessageToUser(userId, message);
                } catch (Exception e) {
                    log.error("Send WebMsg error!", e);
                }
            });
        }
        this.pool.shutdown();
    }
}
```

### sms短信

短信消息监听器：
```java
@Slf4j
@RequiredArgsConstructor
public class SmsReceiver implements MsgReceiver {
    private final SmsProvider smsProvider;
    private ExecutorService pool;

    private ExecutorService buildPool() {
        return new ThreadPoolExecutor(5, 200, 0L, TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<>(1024),
                new ThreadFactoryBuilder().setNameFormat("sms-worker-%d").build(),
                new ThreadPoolExecutor.AbortPolicy());
    }

    @PreDestroy
    public void release() {
        Optional.ofNullable(this.pool).ifPresent(ExecutorService::shutdown);
    }

    @Override
    public PushType pushType() {
        return PushType.SMS;
    }

    @Override
    public void handle(MsgPayload msgPayload) {
        msgPayload.checkValid();
        if (!msgPayload.getPayload().containsKey(pushType())) {
            log.warn("No {} msg for {}", pushType(), this.getClass().getSimpleName());
            return;
        }
        Pair<IMsg, List<String>> msgPair = msgPayload.getPayload().get(pushType());
        SmsMsg smsMsg;
        if (msgPair.getKey() instanceof SmsMsg) {
            smsMsg = (SmsMsg) msgPair.getKey();
        } else {
            log.warn("SmsReceiver cannot handle [{}]", msgPair.getKey().getClass().getSimpleName());
            return;
        }
        smsMsg.checkValid();
        String content = TemplateUtils.render(smsMsg.getMsgTemplate(), smsMsg.getParams());
        batchSendSms(msgPair.getValue(), content);
    }

    /**
     * 批量发送短信
     * @param phoneNumbers 短信接收号码集合
     * @param content 短信内容
     */
    private void batchSendSms(Collection<String> phoneNumbers, String content) {
        //使用线程池和多线程批量发送短信
        this.pool = buildPool();
        for (String phoneNumber : phoneNumbers) {
            this.pool.execute(() -> {
                try {
                    smsProvider.sendSms(phoneNumber, content);
                } catch (Exception e) {
                    log.error("Send SMS msg error!", e);
                }
            });
        }
        this.pool.shutdown();
    }
}
```

### Email电子邮件

邮件消息监听器：
```java
@Slf4j
@RequiredArgsConstructor
public class EmailReceiver implements MsgReceiver {
    private final JavaMailSender javaMailSender;

    @Override
    public PushType pushType() {
        return PushType.EMAIL;
    }

    @Override
    public void handle(MsgPayload msgPayload) {
        msgPayload.checkValid();
        if (!msgPayload.getPayload().containsKey(pushType())) {
            log.warn("No {} msg for {}", pushType(), this.getClass().getSimpleName());
            return;
        }
        Pair<IMsg, List<String>> msgPair = msgPayload.getPayload().get(pushType());
        EmailMsg emailMsg;
        if (msgPair.getKey() instanceof EmailMsg) {
            emailMsg = (EmailMsg) msgPair.getKey();
        } else {
            log.warn("EmailReceiver cannot handle [{}]", msgPair.getKey().getClass().getSimpleName());
            return;
        }
        emailMsg.checkValid();
        try {
            javaMailSender.send(emailMsg.toEmail(msgPair.getValue()));
            log.debug("Send Email success, From: {}, To: {}, Subject: {}",
                    emailMsg.getFrom(),
                    msgPair.getValue(),
                    emailMsg.getSubject());
        } catch (Exception e) {
            throw BizException.of("Send Email error，From：{}，To：{}，Subject：{}", e)
                    .args(emailMsg.getFrom(), msgPair.getValue(), emailMsg.getSubject());
        }
    }
}
```

### IM消息

IM消息监听器：
```java
@Slf4j
@RequiredArgsConstructor
public class ImReceiver implements MsgReceiver {
    private final ImProvider imProvider;
    private ExecutorService pool;

    @PreDestroy
    public void release() {
        Optional.ofNullable(this.pool).ifPresent(ExecutorService::shutdown);
    }

    private ExecutorService buildPool() {
        return new ThreadPoolExecutor(5, 200, 0L, TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<>(1024),
                new ThreadFactoryBuilder().setNameFormat("immsg-worker-%d").build(),
                new ThreadPoolExecutor.AbortPolicy());
    }

    @Override
    public PushType pushType() {
        return PushType.IM;
    }

    @Override
    public void handle(MsgPayload msgPayload) {
        msgPayload.checkValid();
        msgPayload.checkValid();
        if (!msgPayload.getPayload().containsKey(pushType())) {
            log.warn("No {} msg for {}", pushType(), this.getClass().getSimpleName());
            return;
        }
        Pair<IMsg, List<String>> msgPair = msgPayload.getPayload().get(pushType());
        ImMsg imMsg;
        if (msgPair.getKey() instanceof ImMsg) {
            imMsg = (ImMsg) msgPair.getKey();
        } else {
            log.warn("ImReceiver cannot handle [{}]", msgPair.getKey().getClass().getSimpleName());
            return;
        }
        imMsg.checkValid();
        String content = TemplateUtils.render(imMsg.getMsgTemplate(), imMsg.getParams());
        batchSendImMsg(imMsg, msgPair.getValue(), content);
    }

    /**
     * 批量发送IM消息
     * @param imMsg IM消息
     * @param receivers 消息接收者集合
     */
    private void batchSendImMsg(ImMsg imMsg, Collection<String> receivers, String content) {
        this.pool = buildPool();
        for (String receiver : receivers) {
            this.pool.execute(() -> {
                try {
                    imProvider.sendImMsg(imMsg, receiver, content);
                } catch (Exception e) {
                    log.error("Send IM msg error!", e);
                }
            });
        }
        this.pool.shutdown();
    }
}
```

## 供应商接口

### APP通知供应商接入接口

```java
public interface NotificationProvider {

    /**
     * 推送APP通知
     * @param notification APP通知
     * @param receivers 消息接收人
     */
    void pushNotification(Notification notification, Collection<String> receivers);
}
```

### sms短信消息供应商接入接口

```java
public interface SmsProvider {

    /**
     * 发送短信
     * @param phoneNumber 手机号码
     * @param content 短信内容
     */
    void sendSms(String phoneNumber, String content);
}
```

### IM消息供应商接入接口

```java
public interface ImProvider {

    /**
     * 发送IM消息
     * @param imMsg IM消息
     * @param to 消息接收者
     * @param content 消息文本内容
     */
    void sendImMsg(ImMsg imMsg, String to, String content);
}
```