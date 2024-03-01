# [归档] yutool-cache缓存组件

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
        <artifactId>yutool-cache</artifactId>
    </dependency>
</dependencies>
```

### 2. 配置文件

在项目的配置文件 `application.yml` 中添加以下配置：

```yaml
spring:
  redis:
    cluster:
      # redis cluster节点列表
      nodes:
        - 192.168.1.236:6379
        - 192.168.1.236:6380
        - 192.168.1.236:6381
        - 192.168.1.236:6382
        - 192.168.1.236:6383
        - 192.168.1.236:6384
    # 指定redis集群database
    database: 0
    # 推荐不开启lettuce连接池，详见 https://juejin.im/post/5b9b09d96fb9a05d212e8511
    # lettuce连接池配置
#    lettuce:
#      pool:
#        max-active: 8
#        max-idle: 8
#        max-wait: -1ms
#        min-idle: 0
#      shutdown-timeout: 100ms
    # redis密码
    password:

cache:
  # 是否开启缓存功能
  enabled: true
  # 本地缓存最大数量（默认1000）
  local-max-size: 1000
  # 缓存切面key前缀
  key-prefix: sample
  # 是否启用缓存Key布隆过滤器
  bloom-filter-enabled: false
```

### 3. 使用CacheTemplate操作缓存

示例如下：

```java
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class CacheTest {
    private static final String CACHE_PREFIX = "test";
    private static final String CACHE_KEY = "hello";
    private static final String CACHE_VALUE = "world";

    @Autowired
    private CacheTemplate cacheTemplate;

    @Test
    public void test1SetCache() throws CacheException {
        cacheTemplate.setCache(CACHE_KEY, CACHE_VALUE);
    }

    @Test
    public void test2GetCache() throws CacheException {
        CacheProps cacheProps = CacheProps.defaultCacheProps();
        String localCacheValue = cacheTemplate.getCache(CACHE_KEY, cacheProps);
        System.out.println(localCacheValue);
        cacheProps.setCacheLocal(false);
        String distributeCacheValue = cacheTemplate.getCache(CACHE_KEY, cacheProps);
        System.out.println(distributeCacheValue);
        Assert.assertEquals(CACHE_VALUE, localCacheValue);
        Assert.assertEquals(CACHE_VALUE, distributeCacheValue);
    }

    @Test
    public void test3RemoveCache() throws CacheException {
        cacheTemplate.removeCache(CACHE_KEY);
    }

    @Test
    public void test4RemoveCacheByPrefix() throws CacheException {
        CacheProps cacheProps = CacheProps.defaultCacheProps();
        cacheProps.setCacheLocal(false);
        cacheTemplate.setCache(CACHE_PREFIX + CACHE_KEY, CACHE_VALUE, cacheProps);
        System.out.println((String) cacheTemplate.getCache(CACHE_PREFIX + CACHE_KEY, cacheProps));
        cacheTemplate.removeCacheByPrefix(CACHE_PREFIX, cacheProps);
        System.out.println((String) cacheTemplate.getCache(CACHE_PREFIX + CACHE_KEY, cacheProps));
    }
}
```

## 缓存注解

### 注解说明

- EnableCache：开启缓存，可设置缓存相关参数，方法上的注解优先级高于类上的注解
- DisableCache：禁用缓存
- EvictCache：清除缓存

### 代码示例

在 `Controller` 中使用缓存注解示例：

```java
@EnableCache
@RestController
@RequestMapping("/person")
public class PersonController {
    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @EnableCache(cacheDistribute = false)
    @PostMapping("/page")
    public Result<IPage<PersonVo>> getPersonPage(@RequestParam(required = false, defaultValue = "1") int page,
                                                 @RequestParam(required = false, defaultValue = "10") int size,
                                                 @RequestBody(required = false) PageQuery pageQuery) {
        Page<Person> pager = new Page<>(page, size);
        if (CollectionUtils.isNotEmpty(pageQuery.getOrders())) {
            pager.setOrders(pageQuery.getOrderItems());
        }
        QueryWrapper<Person> wrapper = new QueryWrapper<>();
        if (MapUtils.isNotEmpty(pageQuery.getQuery())) {
            pageQuery.getQuery().forEach((key, value) -> {
                //TODO 设置查询条件
            });
        }
        return personService.resultPage(pager, wrapper);
    }

    @DisableCache
    @PostMapping("/list")
    public Result<List<PersonVo>> getPersonList(@RequestBody(required = false) Map<String, Object> query) {
        QueryWrapper<Person> wrapper = new QueryWrapper<>();
        if (MapUtils.isNotEmpty(query)) {
            query.forEach((key, value) -> {
                //TODO 设置查询条件
            });
        }
        return personService.resultList(wrapper);
    }

    @EvictCache
    @PostMapping("")
    public Result addPerson(@RequestBody PersonCreate personCreate) throws BusinessException {
        return personService.resultSaveDto(personCreate);
    }

    @EvictCache
    @PutMapping("/{personId}")
    public Result updatePerson(@RequestBody PersonUpdate personUpdate) throws BusinessException {
        return personService.resultSaveDto(personUpdate);
    }

    @EvictCache
    @DeleteMapping("/{personId}")
    public Result deletePerson(@PathVariable Long personId) {
        return personService.resultDeleteById(personId);
    }

    @EvictCache
    @PutMapping("/batch-delete")
    public Result batchDeletePerson(@RequestBody List<Long> personIds) {
        return personService.resultDeleteBatchByIds(personIds);
    }
}
```
## 分布式缓存和本地缓存如何保证一致性
### 缓存读取
![](./[归档]%20yutool-cache缓存组件/1655004125887-85e5f1b0-69f9-42a7-af24-5e4365db7f54.jpeg)
### 缓存更新/失效

![](./[归档]%20yutool-cache缓存组件/1655004785402-856305e8-acf2-4187-ab97-34fca8de931d.jpeg)
