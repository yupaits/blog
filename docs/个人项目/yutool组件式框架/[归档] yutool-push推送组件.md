# [归档] yutool-push推送组件

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
        <artifactId>yutool-push</artifactId>
    </dependency>
</dependencies>
```

### 2. 配置文件

在项目的配置文件 `application.yml` 中添加以下配置：

```yaml
# 邮件发送配置，具体配置信息需要查看邮件服务提供商相关文档
spring:
  mail:
    # 邮件服务Host
    host:
    # 邮件服务端口
    port:
    # 发送方用户名
    username:
    # 发送方密码
    password:
    # 是否测试连接
    test-connection: false
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enabled: true
      mail.smtp.starttls.required: true
```

**常用邮件服务商相关文档：**

- QQ邮箱：[启用SMTP](https://service.mail.qq.com/cgi-bin/help?subtype=1&&id=14&&no=1000898) [授权码](https://service.mail.qq.com/cgi-bin/help?subtype=1&&id=28&&no=1001256)
- 网易邮箱：[启用SMTP](https://help.mail.163.com/faqDetail.do?code=d7a5dc8471cd0c0e8b4b8f4f8e49998b374173cfe9171305fa1ce630d7f67ac22dc0e9af8168582a) [授权码](https://help.mail.163.com/faqDetail.do?code=d7a5dc8471cd0c0e8b4b8f4f8e49998b374173cfe9171305fa1ce630d7f67ac2cda80145a1742516)

### 3. 实现 `WebMsgUserService` 接口

想要使用Web网页消息推送功能必须要实现 `WebMsgUserService` 接口，代码示例：

```java
@Service
public class WebMsgUserServiceImpl implements WebMsgUserService {
    private final OptService optService;

    @Autowired
    public WebMsgUserServiceImpl(OptService optService) {
        this.optService = optService;
    }

    @Override
    public String getWebMsgUserName(ServerHttpRequest request) {
        return optService.getOperatorId();
    }
}
```

## 消息推送

消息推送示例：

```java
@RestController
@RequestMapping("/push")
@Api(tags = "推送测试接口")
public class PushController {

    private final PushTemplate pushTemplate;

    @Autowired
    public PushController(PushTemplate pushTemplate) {
        this.pushTemplate = pushTemplate;
    }

    @ApiOperation("邮件推送测试")
    @GetMapping("/email")
    public Result pushEmail() throws PushException {
        EmailMsg emailMsg = new EmailMsg().setMsgTemplate(MsgTemplate.EMAIL_TEMPLATE)
                .setFrom("yupaits@163.com")
                .putParam("username", "yupaits")
                .setSubject("这是一封测试邮件");
        MultiValueMap<PushType, String> receivers = new LinkedMultiValueMap<>();
        receivers.addAll(PushType.EMAIL, Lists.newArrayList("ts495606653@hotmail.com"));
        //发送邮件
        pushTemplate.push(emailMsg, PushProps.builder()
                .receivers(receivers)
                .build());
        //延迟发送邮件
        pushTemplate.push(emailMsg, PushProps.builder()
                .receivers(receivers)
                .delayed(true)
                .delayMillis(10000L)
                .build());
        return ResultWrapper.success();
    }

    @ApiOperation("Web网页消息推送测试")
    @GetMapping("/webmsg")
    public Result pushWebMsg() throws PushException {
        WebMsg webMsg = new WebMsg().setMsgTemplate(MsgTemplate.WEB_MSG_TEMPLATE)
                .setTitle("Web网页消息测试")
                .setAction(GlobalAction.NOTICE);
        MultiValueMap<PushType, String> receivers = new LinkedMultiValueMap<>();
        receivers.add(PushType.WEB_MSG, "123456");
        //推送Web网页消息
        pushTemplate.push(webMsg, PushProps.builder()
                .receivers(receivers)
                .build());
        //延迟推送Web网页消息
        webMsg.setTitle("Web网页延迟消息测试");
        pushTemplate.push(webMsg, PushProps.builder()
                .receivers(receivers)
                .delayed(true)
                .delayMillis(10000L)
                .build());
        return ResultWrapper.success();
    }
}
```

## Web网页消息客户端

示例代码如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Web网页消息测试页</title>
  <script src="https://cdn.jsdelivr.net/npm/vue"></script>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
  <script src="https://unpkg.com/dayjs"></script>
</head>
<body>
<div id="app">
  <div class="main">
    <button class="btn" @click="sendWebMsg">点击测试 {{sendResult.message}}</button>
  </div>
  <hr>
  <div class="msg-container">
    <div v-for="(message, index) in messages" :key="index">
      <p>{{index + 1}}. 【{{message.action}}】{{message.title}} <span class="time">{{dayjs(message.timeStamp).format('YYYY-MM-DD HH:mm:ss')}}</span></p>
      <p>{{message.content}}</p>
    </div>
  </div>
</div>

<style>
.main {
  display: flex;
  margin-top: 50px;
}
.btn {
  font-size: 18px;
  margin: auto;
}
.msg-container {
  margin-left: 200px;
}
.time {
  margin-left: 24px;
  font-size: 12px;
}
</style>
<script type="text/javascript">
var app = new Vue({
  el: '#app',
  data: {
    sendResult: {},
    messages: [],
  },
  methods: {
    sendWebMsg: function() {
      axios.get('/push/webmsg').then(res => {
        this.sendResult = res.data;
      });
    }
  }
});

var url = "http://localhost:2009/sockjs/webmsg";
var sock = new SockJS(url);
sock.onopen = function() {
  console.log('Socket Opened!');
};
sock.onmessage = function(e) {
  var message = JSON.parse(e.data);
  message.timeStamp = e.timeStamp;
  app.messages.push(message);
};
sock.onclose = function() {
  console.log('Socket Closed!');
};
sock.onerror = function() {
  console.error('Socket Error!');
};
</script>
</body>
</html>
```
