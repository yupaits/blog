# yutool-user 用户

基于RBAC的设计思想，包含用户、角色、权限、用户-角色关系、角色-权限关系等实体，并扩展了菜单项、权限分组、角色-菜单项关系、用户信息、用户初始密码等业务实体。
## 实体字段
### 用户 User
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| username | 用户名 |
| password | 密码（密文） |
| needSetPasswd | 需要设置密码标识 |
| enabled | 启用标记 |
| lastSignInTime | 上次登录时间 |

### 角色 Role
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| name | 角色名称 |
| label | 角色标签 |
| description | 角色描述 |

### 权限 Permission
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| name | 权限名称 |
| label | 权限标签 |
| groupId | 所属分组ID |
| permissionType | 权限类型 |
| url | 请求URL |
| method | 请求方法 |
| description | 权限说明 |

### 用户-角色 UserRole
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| userId | 用户ID |
| roleId | 角色ID |

### 角色-权限 RolePermission
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| roleId | 角色ID |
| permissionId | 权限ID |

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

### 角色-菜单项 RoleMenu
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| roleId | 角色ID |
| menuId | 菜单项ID |

### 权限分组 PermissionGroup
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| name | 权限分组名称 |
| description | 权限分组说明 |

### 用户信息 UserInfo
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| userId | 用户ID |
| name | 姓名 |
| gender | 性别 |
| avatar | 头像 |
| birthday | 出生日期 |
| phone | 手机号 |
| email | 邮箱 |

### 用户初始密码 UserPasswd
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| userId | 用户ID |
| password | 密码 |

## 实体外键
`User.id` 1---N `UserRole.userId`

`Role.id` 1---N `UserRole.roleId`

`Role.id` 1---N `RolePermission.roleId`

`Permission.id` 1---N `RolePermission.permissionId`

`PermissionGroup.id` 1---N `Permission.groupId`

`Role.id` 1---N `RoleMenu.roleId`

`MenuItem.id` 1---N `RoleMenu.menuId`

`User.id` 1---1 `UserInfo.userId`

`User.id` 1---1 `UserPasswd.userId`


