# cache-adapter缓存适配插件

## 快速上手
### Maven依赖
在项目的`pom.xml`文件添加以下依赖：
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
        <artifactId>cache-adapter</artifactId>
    </dependency>
</dependencies>
```
### 配置项
在`application.yml`配置文件中添加如下配置：
```yaml
spring:
	cache:
        redis:
      province:
        expiration: 2d
      city:
        expiration: 2d
      county:
        expiration: 2d
      town:
        expiration: 2d
      menu:
        expiration: 1h
    caffeine:
      menu:
        expireAfterWrite: 40m
```
完整的配置项如下：

| **配置项** | **类型** | **默认值** | **配置说明** |
| --- | --- | --- | --- |
| spring.cache.cacheNullValues | boolean | true | 是否缓存空值，默认true，防止缓存穿透 |
| spring.cache.dynamic | boolean | true | 是否动态根据cacheName创建Cache的实现，默认true |
| spring.cache.cachePrefix | String |  | 缓存key的前缀 |
| spring.cache.serverId | Object |  | 当前节点标识，当前节点发出的缓存更新通知不会被处理 |
| spring.cache.defaultCacheType | CacheType枚举，枚举项：<br>1. REDIS（Redis缓存）<br>2. CAFFEINE（Caffeine缓存）<br>3. BOTH（Redis和Caffeine组合的二级缓存） | BOTH | 设置动态创建缓存的默认类型 |
| spring.cache.defaultRedis | RedisConfigProps：<br>- expiration<br>- nullValuesExpiration<br>- topic |  | 默认Redis缓存配置 |
| spring.cache.defaultCaffeine | CaffeineConfigProps：<br>- expireAfterAccess<br>- expireAfterWrite<br>- refreshAfterWrite<br>- initialCapacity<br>- maximumSize<br>- keyStrength<br>- valueStrength |  | 默认Caffeine缓存配置 |
| spring.cache.redis.[name].expiration | Duration | Duration.ZERO | 全局过期时间，默认0不过期 |
| spring.cache.redis.[name].nullValuesExpiration | Duration | null | 缓存空值过期时间，默认和有值的过期时间一致，一般设置空值过期时间较短 |
| spring.cache.redis.[name].topic | String | cache:redis:caffeine:topic | 缓存更新时通知其他节点的topic名称 |
| spring.cache.caffeine.[name].expireAfterAccess | Duration |  | 访问后过期时间 |
| spring.cache.caffeine.[name].expireAfterWrite | Duration |  | 写入后过期时间 |
| spring.cache.caffeine.[name].refreshAfterWrite | Duration |  | 写入后刷新时间 |
| spring.cache.caffeine.[name].initialCapacity | int |  | 初始化大小，配置的值>0才会生效 | 
| spring.cache.caffeine.[name].maximumSize | long |  | 最大缓存对象个数，超过此数量时之前放入的缓存将失效，配置的值>0才会生效 |
| spring.cache.caffeine.[name].keyStrength | CaffeineStrength枚举，枚举项：<br>1. WEAK（弱引用）<br>2. SOFT（软引用） |  | key强度，暂不支持SOFT软引用 |
| spring.cache.caffeine.[name].valueStrength | CaffeineStrength枚举，对应Caffeine枚举项：<br>1. WEAK（弱引用）<br>2. SOFT（软引用） |  | value强度 |

使用说明：

- 配置文件中配置的缓存会在应用启动阶段进行初始化，如果一个缓存名对应的配置在spring.cache.redis和spring.cache.caffeine中同时存在，则该名称的缓存会初始化为caffeine-redis两级缓存，反之则对应生成caffeine本地缓存或者redis分布式缓存。
- 当spring.cache.dynamic的值为true时，支持应用运行时动态创建缓存，并根据spring.cache.defaultCacheType和spring.cache.defaultRedis、spring.cache.defaultCaffeine配置进行缓存设置。
## 设计思路
扩展spring-cache，新增`RedisCaffeineCacheManager`和`RedisCaffeineCache`用于redis-caffeine二级缓存。使用时`RedisCaffeineCacheManager`会根据实际的缓存配置路由至实际的缓存管理器，具体为：当缓存仅为Redis缓存时实际使用的是`RedisCacheManager`，当缓存仅为Caffeine缓存时实际使用的是`CaffeineCacheManager`，而缓存为二级缓存时才会使用`RedisCaffeineCacheManager`。这样设计的目的是不重复造轮子，充分利用已有的`CacheManager`实现。
### 读取缓存流程

1. 判断cacheName是否存在，如果不存在则使用默认动态创建的缓存配置创建一个新的缓存
2. 判断cacheName对应的缓存类型
3. 根据缓存类型获取具体的缓存对象Cache
4. 根据缓存key从缓存对象Cache中获取缓存value
5. 特殊的，当缓存对象Cache是二级缓存`RedisCaffeineCache`时，会先从一级缓存`CaffeineCache`中尝试读取，当从一级缓存中获取不到有效的缓存value时则会从二级缓存`InnerRedisCache`中尝试读取，从二级缓存中也获取不到缓存时则根据具体的缓存value加载逻辑获取value并加载到缓存中。

`InnerRedisCache`是在内置`RedisCache`基础上扩展了`void putAll(Map<Object, Object> map)`方法的缓存对象。
### 写入缓存流程
单级缓存的写入过程比较简单，这里主要介绍二级缓存`RedisCaffeineCache`的写入过程。

1. 将key、value键值对写入Redis缓存
2. 通过Redis的pub/sub发布订阅功能，发送包含缓存名称cacheName、节点标识和缓存失效key等信息的消息
3. 其他节点监听并接收到消息后，判断发布消息的节点与当前接收消息的节点是否一致，一致时不做处理，不一致时则将Caffeine一级缓存中缓存key对应的内容进行删除
