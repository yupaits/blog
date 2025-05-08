# history-data历史数据处理插件

## 实现方式
采用任务调度中心（如：xxl-job, saturn等）+ Java定时任务的方式，清理的时候可以通过动态配置要清理的表及数据范围，以实现灵活地进行历史数据地清除或者转移。
## 历史数据清理配置参数说明

| 参数                        | 说明                     | 默认值   | 备注                                                                           |
|-----------------------------|------------------------|----------|------------------------------------------------------------------------------|
| saveHistory                 | 是否保存至历史表         | false    | 为`true`时，清理的数据会转移到历史数据表中，历史数据表不存在时会根据原表结构新建 |
| dataSource                  | 数据源                   |          | 待清理数据所属数据源标识                                                       |
| tableName                   | 待清理数据表名           |          | 待清理数据所在表                                                               |
| fieldName                   | 时间索引字段名           |          | 根据哪个字段来进行数据清理，该字段必须是DATETIME类型并且已经创建了索引          |
| keepDays                    | 保留最近几天的数据       |          | 保留几天的数据，在此之前的数据会被清理掉                                        |
| batchSize                   | 批量删除记录数           | 3000     | 清理数据量较大时，会通过分批的方式进行，该参数用来指定每批清理的数量             |
| extraConditions             | 额外查询条件             |          | 待清理数据的补充查询条件                                                       |
| historyTablePrefix          | 历史数据表名前缀         |          | 指定保存历史数据的表名前缀                                                     |
| historyTableDateTimePattern | 历史数据表名日期时间格式 | yyyyMMdd | 指定保存历史数据表名中的日期时间格式                                           |
| historyTableSuffix          | 历史数据表名后缀         |          | 指定保存历史数据的表名后缀                                                     |


示例：
```yaml
history:
  data:
    props:
      - saveHistory: true
        dataSource: primary
        tableName: tt_sample
        fieldName: created_time
        keepDays: 15
        batchSize: 1000
        extraConditions: created_by='123456'
        historyTablePrefix: th
        historyTableDateTimePattern: yyyyMMdd
        historyTableSuffix: bak
```

对应的处理过程：

1. 切换至 `primary` 数据源
2. 将清理参数转换成查找数据 sql 如下：
    ```sql
    -- 假设执行清理的日期为 2021-04-28
    select id from tt_sample where created_time <= '2021-04-13 23:59:59.999999999' and (created_by='123456') order by id asc;
    ```
    - `saveHistory: false`：根据步骤2查询出来的 id 直接清除数据
    - `saveHistory: true`：
        - 按配置获取相应的历史数据表名，示例中的历史数据表名为 `th_tt_sample_20210428_bak`
        - 当`th_tt_sample_20210428_bak`表不存在时，根据原表 `tt_sample` 的表结构进行创建
        - 根据步骤2查出来的 id 复制数据到 `th_tt_sample_20210428_bak` 表中
        - 根据步骤2查出来的 id 清除数据
