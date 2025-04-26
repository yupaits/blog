# yutool-orm-jpa

## 1、基类
### BaseJpaEntity

- 抽象类
- 继承 Serializable 实现序列化
- 类注解
   - `@EntityListeners(AuditingEntityListener.class)` 增加审计监听器
   - `@MappedSuperclass` 标记为实体类基类
- 字段注解
   - `@Id` 标记主键字段
   - `@CreatedDate` 记录创建时间字段
   - `@CreatedBy` 记录创建人字段
   - `@LastModifiedDate` 记录最后修改时间字段
   - `@LastModifiedBy` 记录最后修改人字段
   - `@Version` 版本号，乐观锁字段
   - `@Column` 字段对应数据表列配置
   - `@GeneratedValue` 指定主键字段值自动生成
### BaseJpaRepository

- 接口类
- 继承 JpaRepository 和 JpaSpecificationExecutor 类实现基本的CRUD功能
- 使用 `@NoRepositoryBean` 注解表明Repository基类不要创建Bean对象
### BaseJpaService

- 接口类
- 继承 BaseService 接口
- 接口方法

```java
E getOne(Specification<E> spec); //根据Specification条件获取单个实体对象
<Q extends BaseQuery<E>> E getOne(Q query); //根据Query条件获取单个实体对象
List<E> list(Specification<E> spec); //根据Specification条件获取实体列表
<Q extends BaseQuery<E>> List<E> list(Q query); //根据Query条件获取实体列表
E list<E> listSorted(Specification<E> spec, Sort sort); //根据Specification条件获取实体排序列表
<Q extends BaseQuery<E>> List<E> listSorted(Q query, Sort sort); //根据Query条件获取实体排序列表
Page<E> page(Pageable pageable); //获取实体分页数据
Page<E> page(Specification<E> spec, Pageable pageable); //根据Specification条件获取实体分页数据
<Q extends BaseQuery<E>> Page<E> page(Q query, Pageable pageable); //根据Query条件获取实体分页数据
long count(Specification<E> spec); //根据Specification条件进行计数
<Q extends BaseQuery<E>> long count(Q query); //根据Query条件进行计数
<Vo extends BaseVo> Vo getVo(Specification<E> spec); //根据Specification条件获取单个VO对象
<Vo extends BaseVo> Vo getVo(Specification<E> spec, VoProps voProps); //根据Specification条件和VoProps获取单个VO对象
<Vo extends BaseVo, Q extends BaseQuery<E>> Vo getVo(Q query); //根据Query条件获取单个VO对象
<Vo extends BaseVo, Q extends BaseQuery<E>> Vo getVo(Q query, VoProps voProps); //根据Query条件和VoProps获取单个VO对象
<Vo extends BaseVo> List<Vo> listVo(Specification<E> spec); //根据Specification条件获取VO列表
<Vo extends BaseVo> List<Vo> listVo(Specification<E> spec, VoProps voProps); //根据Specification条件和VoProps获取VO列表
<Vo extends BaseVo, Q extends BaseQuery> List<Vo> listVo(Q query); //根据Query条件获取VO列表
<Vo extends BaseVo, Q extends BaseQuery> List<Vo> listVo(Q query, VoProps voProps); //根据Query条件和VoProps获取VO列表
<Vo extends BaseVo> IAggregatePage<Vo> pageAggregate(Page<Vo> page, Specification spec, Aggregates aggregates); //根据分页查询结果和Specification条件获取携带聚合数据的分页信息
<Vo extends BaseVo> IAggregatePage<Vo> pageAggregate(Page<Vo> page, Specification spec, Aggregates aggregates, VoProps voProps); //根据分页查询结果和Specification条件获取携带聚合数据的指定VoProps配置分页信息
<Vo extends BaseVo, Q extends BaseQuery<E>> IAggregatePage<Vo> pageAggregates(Page<Vo> page, Q query, Aggregates aggregates); //根据分页查询结果和Query条件获取携带聚合数据的分页信息
<Vo extends BaseVo, Q extends BaseQuery<E>> IAggregatePage<Vo> pageAggregates(Page<Vo> page, Q query, Aggregates aggregates, VoProps voProps); //根据分页查询结果和Query条件获取携带聚合数据的指定VoProps配置分页信息
```

## 2、审计
实现 AuditAware 接口的 `getCurrentAuditor()` 方法获取操作人信息
## 3、yutool-orm改造
### 模块拆分

- yutool-orm进一步拆分成以下模块：
   - yutool-orm-commons
      - IBaseService接口
      - BaseService接口
   - yutool-orm-mybatis
      - MybatisServiceImpl实现BaseService接口
   - yutool-orm-jpa
      - JpaServiceImpl实现BaseService接口
### 公共类抽取
#### BaseEntity

- 接口类
- jpa及mybatis实体类的统一接口
#### BaseDto

- 抽象类
- 继承 Serializable 实现序列化
- 抽象方法
```java
public abstract void checkValid(); //DTO对象校验
```
- 基类方法
```java
public String[] uniqueFields(); //指定逻辑唯一字段，用于更新数据时进行校验
public String[] unionKeyFields(); //指定逻辑联合索引，用于更新数据时进行校验
public <D extends BaseDto> Comparator<D> comparator(); //默认的DTO排序实现
public ID fetchId(); //获取ID
public void putId(); //设置ID
public static <D extends BaseDto> void checkValid(Collection<D> collection); //DTO集合校验，默认不允许集合为空
public static <D extends BaseDto> void checkValid(Collection<D> collection, boolean allowEmpty); //DTO集合校验
```

#### BaseVo

- 抽象类
- 继承 Serializable 实现序列化
- 使用 `@JsonInclude` 注解标记字段 json 序列化策略
- 使用 `@ApiModel` 和 `@ApiModelProperty` 注解备注类和字段的含义
#### BaseQuery

- 接口类
- 继承Serializable实现序列化
- 接口方法
```java
<E extends BaseEntity> Specification<E> toSpecification(); //Query对象转成Specification对象
```

#### IBaseService

- 接口类
- 接口方法
```java
void setDefaultVoConfig(); //设置默认的Vo类型Class和VoBuilder
void setDefaultEntityBuilder(); //设置默认的EntityBuilder
<Vo extends BaseVo> void setVoCalss(Class<Vo> voClass); //设置VoClass，用于动态替换默认的VoClass类型
void setEntityBuilder(EntityBuilder entityBuilder); //设置EntityBuilder，用于动态替换默认的EntityBuilder
void setVoBuilder(VoBuilder voBuilder); //设置VoBuilder，用于动态替换默认的VoBuilder
```

#### BaseService

- 接口类
- 继承IBaseService接口
- 接口方法
```java
E getById(ID id); //根据ID获取实体对象
List<E> listByIds(Collection<ID> ids); //根据ID集合获取实体列表
List<E> listAll(); //获取所有实体列表
void save(E entity); //保存实体
E saveAndFlush(E entity); //保存实体并返回
void batchSave(Collection<E> entities); //批量保存实体集合
void deleteById(ID id); //根据ID删除记录
void logicDeleteById(ID id); //根据ID逻辑删除记录
void batchDeleteByIds(Collection<ID> ids); //根据ID集合批量删除记录
void batchLogicDeleteByIds(Collection<ID> ids); //根据ID集合批量逻辑删除记录
long countByIds(Collection<ID> ids); //根据ID集合计数
long countAll(); //统计所有记录数
<Vo extends BaseVo> Vo getVoById(ID id); //根据ID获取VO对象
<Vo extends BaseVo> Vo getVoById(ID id, VoProps voProps); //根据ID和VoProps获取VO对象
<Vo extends BaseVo> List<Vo> listVoByIds(Collection<ID> ids); //根据ID集合获取VO列表
<Vo extends BseeVo> list<Vo> listVoByIds(Collection<ID> ids, VoProps voProps); //根据ID集合和VoProps获取VO列表
<Vo extends BaseVo> list<Vo> listAllVo(); //获取所有VO列表
<Vo extends BaseVo> List<Vo> listAllVo(VoProps voProps); //根据VoProps获取VO列表
<Dto extends BaseDto> boolean saveDto(Dto dto); //保存DTO
<Dto extends BaseDto> E saveAndFlushDto(Dto dto); //保存DTO并返回实体对象
<Dto extends BaseDto> boolean saveBatchDto(Collection<Dto> dtos); //批量保存DTO集合
<Dto extends BaseDto, Vo extends BaseVo> List<Vo> saveBatchDtoAndReturn(Collection<Dto> dtos); //批量保存DTO集合并返回相应的VO列表
<Dto extends BaseDto, Vo extends BaseVo> List<Vo> saveBatchDtoAndReturn(Collection<Dto> dtos, VoProps voProps); //批量保存DTO集合并根据VoProps返回相应的VO列表
```

#### BaseServiceImpl

- 抽象类
- 实现BaseService接口
- 增加无AuditLogger（审计日志对象）参数的构造方法
- 增加无OptService（获取造作人服务对象）参数的构造方法
- 以下方法变更为抽象方法，JpaServiceImpl和MybatisServiceImpl提供各自的实现：
```java
checkUnique(Dto dto)
modelFromDto(Dto dto) //JPA和Mybaits的乐观锁实现不一样，需要区分开来
```

- 移除 `pageAggregate(IPage<Vo> page, Aggregates aggregates)` 方法，JpaServiceImpl和MybatisServiceImpl提供各自的实现
### 移除

- BaseResultService
- BaseResultServiceImpl



