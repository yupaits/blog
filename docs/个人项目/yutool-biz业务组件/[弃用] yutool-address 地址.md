# yutool-address 地址

地址所属的主体可以是某个用户，也可以是某个组织，因此地址的类型至少有用户地址和组织地址两种。通过“地址类型+关联ID”这样的组合可以将不同类型的地址存放在一张表中。

一个用户或者组织可以有多个地址，因此还需要有一个默认地址的标识，为某些场景提供默认的地址信息。

地址信息的实体字段如下：

| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| relId | 关联ID（地址主体唯一标识） |
| addressType | 地址类型（分为用户地址、组织地址） |
| primaryAddress | 是否默认地址 |
| contactPerson | 联系人姓名 |
| contactPhone | 联系方式 |
| provinceCode | 省份编码 |
| cityCode | 城市编码 |
| countyCode | 区编码 |
| townCode | 街道编码 |
| province | 省份 |
| city | 城市 |
| county | 区/县 |
| town | 街道/乡镇 |
| detailAddress | 详细地址 |
| fullAddress | 完整地址（格式为：省份+城市+区/县+街道/乡镇+详细地址） |

省、市、区、街道，四级行政区域的数据在服务启动的时候通过读取资源文件加载到缓存中，提高使用过程的查询效率。实际实现是通过读取JSON资源文件数据，使用Redis的管道执行方式批量写入到Redis缓存中，写入性能好、效率高。使用Spring集成的`RedisTemplate.executePipelined(RedisCallback<?> action)`即可实现Redis的管道执行。
