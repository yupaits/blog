### 使用`st_distance_sphere`函数获取指定地点周边一定范围内的所有地点
例如：district表中保存了各个城市（city_code）的经纬度信息（longitude、latitude），使用以下sql查询上海市（121.797447, 31.166809）周边300公里内的城市
```sql
select distinct city_code, st_distance_sphere(Point(longitude, latitude), Point(121.797447, 31.166809)) as distance
    from district
    where st_distance_sphere(Point(longitude, latitude), Point(121.797447, 31.166809)) < 300000;
```
### SQL join语法速记

- `A inner join B on ...`取A和B的交集
- `A left join B on ...`取A全部，B没有的对应的字段值为null
- `A right join B on ...`取B全部，A没有的对应的字段值为null
- `A full outer join B on ...`取并集，彼此没有的对应的字段值为null
### SQL的where语句中，使用`=`（或`!=`）去匹配给定的字段值时，匹配的结果中不包含表中该字段为null的数据
例如：当tt_data表中存在一条数据的字段data_type为null时，使用以下sql都无法查询到该条数据：
```sql
select * from tt_data where data_type = 'A';
select * from tt_data where data_type != 'A';
```
### 多线程分页同步数据的优化方式
使用多线程分页同步数据时，会使用到常用的分页查询sql: `select * from table order by id asc limit n, m`。在数据量较大时，该sql在执行到最后几页的时候耗时会明显增加，原因是`limit`语句会从表的第1行扫描到第n行，n越大，扫描的时间越长。下面是针对这种场景的一种优化方式：

- 假设主键ID是自增的，查出待同步数据的最小主键ID（minId）和最大主键ID（maxId）
- 通过sql: `select * from table where id >= startId and id < endId order by id asc`查询得到每页需要同步的数据。其中startId目标数据页的起始行ID，endId为目标数据页的结束行ID，并且`endId = startId + m`。特殊的，第一页的startId=minId，最后一页的endId=maxId。
### 在执行数据清理任务是，如果MySQL单表需要清除的数据超过全表数据的50%时，可采用以下方案

- 创建临时表，表结构与原表结构相同
- 拷贝需要保留的数据到临时表
- 重命名临时表为原表名
- 删除原表

具体sql为：
```sql
-- 创建临时表
CREATE TABLE `temp_table` LIKE `ori_table`;
-- 拷贝原表数据到临时表
INSERT INTO `temp_table` SELECT * FROM `ori_table` WHERE ...;
-- 重命名表
RENAME TABLE `ori_table` TO `ori_table_bak`, `temp_table` TO `ori_table`;
-- 移除原表
DROP TABLE `ori_table_bak`;
```
### 配置MySQL连接参数`rewriteBatchedStatements=true`可启用批量插入优化
该参数可将多条数据插入语句批量提交只执行一次，可在一定程度上优化写入性能降低TPS。
### MySQL随机数sql
```sql
-- 获取500~1500之间的随机数
select round(rand() * 1000 + 500);
```
### 在查询sql中使用`force index(idx)`强制此次查询使用指定索引
```sql
select * from tt_data force index(idx) where ...; 
```
### 删除数据优化
MySQL执行sql报错：`You can't specify target table 'tt_data' for update in FROM clause`，改写sql之后解决。但是改写在后的sql中，`delete from tt_data where id in (ids)`语句并没有并没有走主键索引进行查找删除，换成join临时表的方式使`id in (ids)`正常走主键索引查询删除，效率提升明显。具体语句如下：
```sql
-- 原sql，会报错
delete from tt_data where id in (select id from tt_data where ...);
-- 改写后的sql
delete from tt_data where id in (select id from (select id from tt_data where ...));
-- 优化后的sql
delete a from tt_data a inner join (select id from tt_data where ...) b on a.id = b.id;
```
### 清理重复数据
当我们需要对单表中，在业务逻辑上定义为重复的数据进行清理时，可使用如下sql：
```sql
-- tt.data表的字段a、b组合为业务唯一键，按字段a、b进行分组后仅保留字段c = max(c)的数据
delete t1 from tt_data t1 inner join (
  select s1.id from tt_data s1 right join (
    select a, b, max(c) as max_c from tt_data group by a, b having count(*) > 1
  ) s2 on s1.a = s2.a and s1.b = s2.b and s1.c != s2.max_c
) t2 on t1.id = t2.id;
```
