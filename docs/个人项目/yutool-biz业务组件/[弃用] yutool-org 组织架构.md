# yutool-org 组织架构

组织架构几乎是所有业务系统必备的，以树形结构呈现，因此需要使用parentId用来关联上下层级。
## 实体字段
### 组织架构 Organization
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| parentId | 上级组织ID |
| name | 组织标识 |
| label | 组织标签 |
| description | 组织描述 |
| sortCode | 排序码 |

### 组织信息 OrganizationInfo
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| orgId | 组织ID |
| logo | 组织Logo |
| contactEmail | 联系人邮箱 |

### 组织-用户 OrganizationUser
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| orgId | 组织ID |
| userId | 用户ID |

### 分组 Group
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| name | 分组名称 |
| label | 分组标签 |
| logo | 分组Logo |
| description | 分组描述 |

### 分组-组织 GroupOrganization
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| groupId | 分组ID |
| orgId | 组织ID |

### 分组-用户 GroupUser
| **字段名** | **字段说明** |
| --- | --- |
| id |  |
| groupId | 分组ID |
| userId | 用户ID |

## 实体外键
`Organization.id` 1---1 `OrganizationInfo.orgId`

`Organization.id` 1---N `OrganizationUser.orgId`

`User.id` 1---N `OrganizationUser.userId`

`Group.id` 1---N `GroupOrganization.groupId`

`Organization.id` 1---N `GroupOrganization.orgId`

`Group.id` 1---N `GroupUser.groupId`

`User.id` 1---N `GroupUser.userId`
