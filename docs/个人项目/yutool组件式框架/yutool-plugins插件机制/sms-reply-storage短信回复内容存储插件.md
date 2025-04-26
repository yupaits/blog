# sms-reply-storage短信回复内容存储插件

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
        <artifactId>sms-reply-storage</artifactId>
    </dependency>
</dependencies>
```
### 2. 使用 PushTemplate处理短信回复
```java
@RestController
@RequestMapping("/sms/notify")
@Api(tags = "短信收发通知回调")
public class SmsNotifyController {
    private static final String SUCCESS = "SUCCESS";

    private final PushTemplate pushTemplate;

    @Autowired
    public SmsNotifyController(PushTemplate pushTemplate) {
        this.pushTemplate = pushTemplate;
    }

    @ApiOperation("短信收发通知")
    @PostMapping(value = "", consumes = MediaType.APPLICATION_XML_VALUE)
    public String smsNotify(@RequestBody String smsNotifyStr) throws HandleReplyException {
        SmsReply smsReply = SmsReply.fromXml(smsNotifyStr);
        pushTemplate.onReply(smsReply);
        return SUCCESS;
    }
}
```
### 3. 自定义短信回复业务处理逻辑
```java
/**
 * 短信回复业务处理实现
 * @author yupaits
 * @date 2019/8/10
 */
@Service
public class SmsReplyBizHandlerImpl implements SmsReplyBizHandler {

    @Override
    public void handleSmsReply(SmsReply smsReply) {
        //短信回复业务处理
    }
}
```

