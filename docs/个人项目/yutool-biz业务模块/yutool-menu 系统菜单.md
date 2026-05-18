# yutool-menu 系统菜单

管理系统菜单，支持多层级树形结构。`yutool-menu`抽取自`yutool-user`模块，并移除了`yutool-user`模块中原有的菜单授权模式。

## 实体字段

### 菜单项 MenuItem
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| parentId | 上级菜单项ID |
| menuKey | 菜单项Key（唯一标识） |
| icon | 图标 |
| label | 菜单项名称 |
| route | 跳转路由路径 |
| external | 是否外部链接 |
| sortCode | 排序码 |
| roles | 授权角色 |