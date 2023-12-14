# yutool-orm-mybatis

## 1. 基类
- BaseMybaitQuery
```java
useLambda() 是否使用LambdaQueryWrapper
buildNewQuery() 创建新的QueryWrapper并构建查询条件
buildNewLambdaQuery() 创建新的LambdaQueryWrapper并构建查询条件
buildQuery(QueryWrapper<E>) 构建QueryWrapper的查询条件
buildLambdaQuery(LambdaQueryWrapper<E>) 构建LambdaQueryWrapper的查询条件
```
## 2. 全局配置

- 分页查询参数
   - @PageQueryDefault 注解
   - PageQuery 分页查询参数
   - AggregatePage 携带聚合信息的分页数据对象
   - 分页参数处理器
- 排序参数
   - @SortDefault 注解
   - Sorts 排序参数
   - 排序参数处理器
- MetaObjectOptService接口
   - getOperatorId() 获取操作人接口
