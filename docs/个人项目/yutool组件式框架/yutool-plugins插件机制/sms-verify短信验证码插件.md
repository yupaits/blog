# sms-verify短信验证码插件

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
        <artifactId>sms-verify</artifactId>
    </dependency>
</dependencies>
```

### 2. 配置文件

在项目的配置文件 `application.yml` 中添加以下配置：

```yaml
sms:
  code:
    # 验证码位数，默认6位数字
    digits: 6
    # 验证码有效时间，单位：分钟，默认10分钟
    timeout: 10
```

### 3. 编写短信验证码场景枚举

编写实现 `ISmsScene` 的短信验证码场景枚举类，示例如下：

```java
@Getter
public enum CodeSmsScene implements ISmsScene {
    /**
     * 测试
     */
    TEST(1, "测试短信验证码", MsgTemplate.CODE_SMS_TEMPLATE);

    private int sceneCode;
    private String sceneDesc;
    private IMsgTemplate smsTemplate;

    CodeSmsScene(int sceneCode, String sceneDesc, IMsgTemplate smsTemplate) {
        this.sceneCode = sceneCode;
        this.sceneDesc = sceneDesc;
        this.smsTemplate = smsTemplate;
    }

    @Override
    public String getScene() {
        return this.name();
    }
}
```

### 4、编写验证码短信接口 

```java
@RestController
@RequestMapping("/code-sms")
@Api(tags = "验证码短信测试接口")
public class CodeSmsController {
    private static final String MOBILE = "13866668888";

    private final VerifyTemplate verifyTemplate;

    @Autowired
    public CodeSmsController(VerifyTemplate verifyTemplate) {
        this.verifyTemplate = verifyTemplate;
    }

    @ApiOperation("发送验证码短信")
    @GetMapping("/send")
    public Result sendCodeSms() throws CacheException, PushException {
        verifyTemplate.sendCodeSms(CodeSmsScene.TEST, MOBILE, null);
        return ResultWrapper.success();
    }

    @ApiOperation("验证短信验证码")
    @GetMapping("/verify")
    public Result verifyCode(@ApiParam("验证码") @RequestParam String code) throws CacheException {
        if (verifyTemplate.verifySmsCode(CodeSmsScene.TEST, MOBILE, code)) {
            return ResultWrapper.success();
        }
        return ResultWrapper.fail(ResultCode.PARAMS_ERROR);
    }
}
```
