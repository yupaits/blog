# auth-filter权限过滤插件

## 快速上手
### 1. Maven依赖
在项目的 `pom.xml `中添加以下依赖：
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
        <artifactId>auth-filter</artifactId>
    </dependency>
</dependencies>
```
### 2. 使用@AuthFilter注解
在要进行权限过滤的ServiceImpl类上添加@AuthFilter注解：
```java
@AuthFilter(name = "goods", operatorField = "created_by", orgField = "org_id")
public class GoodsServiceImpl implements GoodsService {
	
    @Override
    public List<User> users() {
        // Get Users...
    }
}
```
### 3. 实现AuthFilterService接口
AuthFilterService用于将@AuthFilter注解上的权限标识转换成具体的权限过滤配置信息，不同标识对应的权限过滤配置信息不一样时，推荐使用策略模式进行开发实现。
```java
@Component
public class AuthFilterServiceImpl implements AuthFilterService {
    
    @Override
    public AuthFilterProps getPropsByName(String name) {
        //推荐使用策略模式根据name获取AuthFilterProps
    }
}
```
## 设计思路
### 1. 核心功能

- 此插件不做认证授权相关的功能
- 认证通过之后根据在业务Service类的@AuthFilter注解指定的权限过滤标识取的目标领域对象/实体对象相应的权限过滤策略，这里的权限过滤策略只针对数据级别（数据库表行级别）的进行过滤
- 目前的权限过滤策略支持以下这些：
   - 部门权限过滤
      - 权限范围（设置到员工，默认是员工所属部门及下属部门）
         - 仅自己（部门权限内且创建人是自己）
         - 指定部门（按分配的部门用in过滤，不包含下级）
         - 指定部门及下属部门（按分配的部门用in过滤，包含下级部门）
         - 所有部门（可查看所有部门）
   - 特殊对象权限过滤
      - 指定对象
         - 用户（可多个）
         - 角色（可多个）
      - 权限范围（同上述的部门权限范围）
   - 业务关联对象权限过滤（通过实现自定义过滤策略接口方式）
      - 门店权限过滤
      - 仓库权限过滤
      - ……
### 2. 关键实现逻辑

1. 过滤策略的存储
   - 解决思路：数据库+缓存
   - 具体实现：对象的权限范围信息保存至数据库，不同对象按照权限范围查询出相关参数并保存到缓存，更新对象的过滤策略时自动更新相应缓存。
2. 权限过滤的具体实现 
   - 解决思路：权限过滤注解+查询方法切面
   - 具体实现：在业务ServiceImpl类上添加自定义权限过滤注解 `@AuthFilter(name = "entity")`（注解中的name参数用于将数据库中的过滤策略与实体类关联起来），在 `AuthFilterAspect` 切面的 before 增强中获取过滤策略并转成查询条件存入 ThreadLocal 变量中，查询方法执行实际的业务逻辑从 ThreadLocal 中获取查询条件转换并拼接至查询 sql 语句中，使用拼接后的 sql 进行查询。
