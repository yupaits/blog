# dynamic-thread-pool动态线程池管理插件

## 说明*
开源的[DynamicTp](https://dynamictp.cn/)动态线程池实现功能更强大完善，此插件停止维护。
## 实现原理
原理可参考[Java线程池实现原理及其在美团业务中的实践](https://tech.meituan.com/2020/04/02/java-pooling-pratice-in-meituan.html)。
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
        <artifactId>dynamic-thread-pool</artifactId>
    </dependency>
</dependencies>
```
### 2. 配置类

编写`AbstractDynamicThreadPoolManager`的子类并使用`@Component`注解标识为Spring Bean，并实现`getAppId()`方法，该方法用于获取当前应用的`appId`。
```java
@Component
public class DynamicThreadPoolManager extends AbstractDynamicThreadPoolManager {
    
    @Value("${spring.application.name}")
    private String appId;

    @Override
    public String getAppId() {
        return appId;
    }
}
```
实现`ExecutorConfigFetcher`接口并使用`@Component`注解标识为Spring Bean，该接口用于根据`appId`及`poolName`动态获取线程池配置。配置信息的数据源可以是数据库、配置中心等。
```java
@Component
public class DbExecutorConfigFetcher implements ExecutorConfigFetcher {
    
    @Override
    public List<ExecutorProps> fetchAllConfig(String appId) {
        // 从数据库中查询获取配置
        ...
    }
    
    @Override
    public Map<String, ExecutorProps> fetchConfigList(String appId, Collection<String> poolNames) {
        // 从数据库中查询获取配置
        ...
    }
    
    @Override
    public ExecutorProps fetchConfig(String appId, String poolName) {
        // 从数据库中查询获取配置
        ...
    }
}
```
#### 在分布式系统中使用
当我们在分布式系统中使用动态线程池时，如果同一个线程池配置被多个应用同时使用，而在其中一个应用修改线程池配置时，往往需要将配置同步更新至其他应用。插件中使用了`ExecutorPublisher`和`ExecutorConfigListener`接口抽象了同步更新至其他应用这一行为。

插件中的`CallbackApiListener`实现了`ExecutorConfigListener`接口，它是通过回调接口的方式接收通知用于更新当前应用的线程池配置，该方式适用于一个`appId`只有一个部署实例的场景。

实现`CallbackUrlFetcher`接口并使用`@Component`注解标识为Spring Bean，该接口用于根据`appId`获取目标应用的回调接口地址，当动态线程池的配置发生变更（新增、删除、修改）时，调用该回调接口通知目标应用进行相应的变更。
```java
@Component
public class DynamicThreadPoolCallbackUrlFetcher implements CallbackUrlFetcher {

    @Override
    public String fetchUrl(String appId) {
        return getAppIp(appId) + "/executor/config/callback";
    }
    
    private String getAppId(String appId) {
        // 根据appId获取ip
        String ip = ...;
        return ip;
    }
}
```

而当我们的系统更加复杂，例如同一个`appId`（服务）下部署了多个实例时，则还需要获取该`appId`下的所有实例（可以通过注册中心的相关api获取），并向所有实例发送更新通知，此时推荐使用消息中间件的`多对一消费`模式来实现。

