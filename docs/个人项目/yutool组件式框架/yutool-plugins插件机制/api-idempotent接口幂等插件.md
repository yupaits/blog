# api-idempotent接口幂等插件

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
        <artifactId>api-idempotent</artifactId>
    </dependency>
</dependencies>
```
### 2. RequestId获取接口
```java
/**
 * 默认的RequestId生成器
 * @author yupaits
 * @date 2020/4/26
 */
public class DefaultRequestIdGenerator implements RequestIdGenerator {

    @Value("${id.generator.workerId:0}")
    private long workerId;
    @Value("${id.generator.datacenterId:0}")
    private long datacenterId;

    @Override
    public String genRequestId() {
        return new Snowflake(workerId, datacenterId, true).nextIdStr();
    }
}
```
### 3. 在需要幂等校验的接口类或方法上使用@Idempotent注解
```java
@RestController
@RequestMapping("/Animal")
@Api(tags = "动物接口")
public class AnimalController {
	private final AnimalService animalService;

	@Autowired
	public AnimalController(AnimalService animalService) {
		this.animalService = animalService;
	}

    @Idempotent
	@ApiOperation("保存动物")
	@PostMapping("")
	public Result save(@RequestBody DtoWrapper<AnimalDto> dto) throws BusinessException {
		return animalService.save(dto);
	}
}
```
