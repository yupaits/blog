# [归档] multi-ds-tx多数据源事务插件

## 说明*
Dynamic-Datasource 4.0.0+版本支持本地多数据源事务，此插件停止维护。
## 实现原理
通过多数据源切换切面在执行目标方法前，从`@DS`注解中获取数据源key，并`push`至当前线程变量维护的栈中；当目标方法进行数据库连接操作时，从栈中`peek`出并切换至目标数据源；目标方法执行完毕后，从栈中`poll`出该数据源key，使得嵌套的上层方法继续使用自身方法标记的数据源进行数据库操作。此种实现方式能支持多层嵌套方法的数据源切换。

多数据源事务控制通过`@MultiDsTx`注解进行声明，通过切面方式进行事务管理。`@MultiDsTx`注解作用的入口方法会在当前线程变量中生成一个多数据源事务唯一标识`XID`，并通过全局的`ConnectionFactory`中的线程变量维护该事务中所有的数据源的连接对象`Connection`。当同一事务下的所有方法都执行完毕并且没有抛出异常，则通过`ConnectionFactory.notify(true)`通知所有数据源连接对象`Connection`提交事务，而如果当该事务下的任一方法抛出异常，则通过`ConnectionFactory.notify(false)`通知所有数据源连接对象`Connection`回滚事务。
## 快速上手
### 1. Mavan依赖
在项目的`pom.xml`中添加以下依赖：
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
    <artifactId>multi-ds-tx</artifactId>
  </dependency>
</dependencies>
```
### 2. 配置文件
参考[Dynamic-Datasource](https://gitee.com/baomidou/dynamic-datasource-spring-boot-starter)多数据源的配置，在配置文件中添加多数据源配置。
### 3. 配置类
在数据库或者ORM相关的配置类上使用`@EnableMultiDsTx`注解启用多数据源事务管理功能：
```java
@EnableMultiDsTx
@Configuration
public class DsConfig {

    @Autowired
    private DataSource ds1;
    
    @Autowired
    private DataSource ds2;

    @Bean
    public DefaultMultiDataSource multiDataSource() {
        DefaultMultiDataSource multiDataSource = new DefaultMultiDataSource();
        multiDataSource.addDataSource("ds1", ds1);
        multiDataSource.addDataSource("ds2", ds2);
        multiDataSource.setDefaultDs("ds1");
        return multiDataSource;
    }
}
```
### 4. 使用示例
在类、方法上使用`@DS`注解可实现数据源的切换，在一条调用链上的方法使用`@MultiDsTx`注解可实现该调用链上的方法受同一个事务的控制。
```java
@Service
public class ServiceA {
    
    @Autowired
    private ServiceB serviceB;

    @DS("ds1")
    @MultiDsTx
    public void a() {
        ... // 业务逻辑1
        b();
        serviceB.a();
    }
    
    @DS("ds2")
    @MultiDsTx
    public void b() {
        ... // 业务逻辑2
    }
}

@Service
public class ServiceB {
    
    @DS("ds1")
    @MultiDsTx
    public void a() {
        ... // 业务逻辑3
    }
}
```
以上代码的执行过程为：

- 切换至数据源ds1，执行业务逻辑1
- 切换至数据源ds2，执行业务逻辑2
- 切换至数据源ds1，执行业务逻辑3

如果在执行业务逻辑1、2、3的任一环节抛出异常，则整个事务都会回滚。
