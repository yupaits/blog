---
title: 历史数据清理
---

## 实现方式

采用任务调度中心（如：xxl-job, saturn等）+ Java定时任务的方式，清理的时候可以通过动态配置要清理的表及数据范围，以实现灵活地进行历史数据地清除或者转移。

## 历史数据清理配置参数说明

|参数|说明|默认值|备注|
|---|---|---|---|
|saveHistory|是否保存至历史表|否|设为true，会按预设的格式新建或者匹配到已存在的历史数据表，并将清理的数据转移到该历史数据表中。|
|dataSource|数据源| |指定待清理数据所在的数据源标识|
|tableName|待清理数据表名| |指定要清理那张表的数据|
|fieldName|时间索引字段名| |指定按照那个字段来按时间范围进行清理，该字段必须是DATETIME类型并且已经创建了索引|
|keepDays|保留最近几天的数据| |指定要保留几天的数据，在此之前的数据会被清理掉|
|batchSize|批量删除记录数|3000|清理的数据量大时，通过分批的方式进行删除，每批删除的数量|
|extraConditions|额外查询条件| |用于限制待清理表的数据范围|
|historyTablePrefix|历史数据表名前缀| |指定保存历史数据的表名前缀|
|historyTableDateTimePattern|历史数据表名日期时间格式|yyyyMMdd|指定保存历史数据表名中的日期时间格式|
|historyTableSuffix|历史数据表名后缀| |指定保存历史数据的表名后缀|

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
3. 当不需要保存删除的数据到历史表时，直接根据步骤2查询出来的 id 删除数据
4. 当需要保存删除的数据到历史表时，即 saveHistroy 为 true

    - 按配置获取相应的历史数据表名，示例的表名为 `th_tt_sample_20210428_bak`
    - 当上述的历史数据表不存在时，按原表 `tt_sample` 的表结构的新增该表
    - 根据步骤2中查出的 id 将数据复制到 `th_tt_sample_20210428_bak` 表中
    - 根据步骤2查询出来的 id 删除数据