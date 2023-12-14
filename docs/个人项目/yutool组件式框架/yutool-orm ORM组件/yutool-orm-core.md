# yutool-orm-core

## 1. 公共基类

- BaseEntity 实体对象接口
   - id 主键
   - createdTime 创建时间
   - createdBy 创建人
   - lastModifiedTime 更新时间
   - lastModifiedBy 更新人
- BaseDto DTO抽象类
   - checkValid() 参数校验抽象方法
   - uniqueFields() 逻辑唯一字段
   - unionKeyFields() 组合唯一索引
   - comparator() 默认的Dto排序比较器，用于解决批量更新并发场景的死锁问题
   - fetchId() 获取ID
   - putId() 设置ID
   - checkValid(Collection<Dto\>) Dto集合校验方法
- BaseVo VO抽象类
   - id 主键
   - createdTime 创建时间
   - createdBy 创建人
   - createdByName 创建人用户名
   - lastModifiedTime 更新时间
   - lastModifiedBy 更新人
   - lastModifiedByName 更新人用户名
- BaseQuery 查询对象接口
- IBaseService接口
```java
setDefaultVoConfig() 设置默认的Vo类型Class和VoBuilder
setDefaultEntityBuilder() 设置默认的EntityBuilder
setVoClass(Class<Vo>) 设置VoClass，用于动态替换默认的VoClass类型
setEntityBuilder(EntityBuilder) 设置EntityBuilder，用于动态替换默认的EntityBuilder
setVoBuilder(VoBuilder) 设置VoBuilder，用于动态替换默认的VoBuilder
```
- BaseService接口（继承 IBaseService 接口）
- BaseServiceImpl抽象类（实现BaseService接口）

## 2. 全局配置

- 全局异常处理
   - GlobalExceptionHandler
- 聚合查询参数自动转换
   - @AggregateDefault 注解
   - Aggregates 聚合参数
   - AggregateField 聚合字段
   - AggregateResult 聚合结果
   - 聚合参数处理器
- 审计日志
   - AuditLogger接口