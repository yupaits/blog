# yutool-biz 整体设计

## 模块划分及依赖关系
| **模块** | **说明** | **依赖项** | **基础组件依赖** | **备注** |
| --- | --- | --- | --- | --- |
| yutool-user | 用户 |  |  |  |
| yutool-address | 地址 |  | • yutool-cache |  |
| yutool-org | 组织架构 | • yutool-user <br>• yutool-address |  |  |
| yutool-auth | 认证授权 | • yutool-user <br>• yutool-org |  | • v1.4.0移除 |
| yutool-dict | 数据字典 |  |  |  |
| yutool-notify | 通知消息 | • yutool-user <br>• yutool-org |  |  |
| yutool-exchange | 数据中转 |  |  |  |
| yutool-personal | 个性化配置 |  |  |  |
| yutool-api | API接口 | • yutool-user <br>• yutool-address <br>• yutool-org <br>• yutool-dict <br>• yutool-notify <br>• yutool-exchange <br>• yutool-personal | • yutool-metadata <br>• audit-logger |  |


