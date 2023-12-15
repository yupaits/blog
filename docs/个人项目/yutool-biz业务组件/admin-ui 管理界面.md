# admin-ui 管理界面

为了方便使用，yutool-biz还集成了一套默认的管理页面，结合yutool-api可快速实现基础业务组件的可视化管理。
## 组件式开发
基于通用的交互场景开发了相应的前端组件，大大提高了开发效率。这里对各个前端组件的配置进行详细说明。
### ManagePage 管理页面组件

![ManagePage组件示例](https://cdn.nlark.com/yuque/0/2023/png/763022/1682515265709-8f172ab7-57dc-40a2-a444-cd14ceba7178.png#averageHue=%23fefefd&clientId=u7830080a-df2b-4&from=paste&height=330&id=uaed764fb&originHeight=330&originWidth=1556&originalType=binary&ratio=1&rotation=0&showTitle=true&size=38494&status=done&style=stroke&taskId=u076f4454-3337-4c16-95eb-389ae362fb1&title=ManagePage%E7%BB%84%E4%BB%B6%E7%A4%BA%E4%BE%8B&width=1556 "ManagePage组件示例")

组件配置：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| routes | 导航页面路由 | string[] \| ReactNode[] |  |
| title | 页面标题 | string |  |
| subtitle | 页面副标题 | string |  |
| optProps | 页面顶部操作区配置 | OptProps |  |
| sortProps | 排序配置 | SortProps |  |
| queryProps | 筛选配置 | QueryProps |  |
| groupProps | 分组配置 | GroupProps |  |
| aggregateProps | 聚合配置 | AggregateProps |  |
| dataTable | 数据表格配置 | DataTable |  |
| loadingProps | 加载状态属性 | LoadingProps |  |
| customContent | 自定义内容区 | ReactNode |  |

#### OptProps 页面顶部操作区配置
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否展示表头操作区 | boolean | true |
| onSearch | 查询按钮点击事件回调 | () => void |  |
| saveEnabled | 是否显示新增按钮 | boolean | true |
| onAdd | 新增按钮点击事件回调 | () => void |  |
| extOptComponent | 操作区扩展组件 | ReactNode |  |

#### SortProps 排序配置
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否展示排序 | boolean | false |
| sorts | 排序项 | array <br> `[{title: string, dataIndex: string, asc: boolean}]` |  |
| extSortColumns | 额外排序列（不包含再表格展示列dataTable.columns中的其它数据列） | array <br> `[{title: string, dataIndex: string}]` <br>  | 可使用`@/components/page/Sorts/addition`中提供的`extSortColumns` |
| onSortsChange | 排序项变更事件回调 | (sorts) => void |  |
| onSortsSubmit | 排序项应用事件回调 | () => void |  |

#### QueryProps 筛选
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否展示筛选 | boolean | false |
| query | 查询条件 | object | {} |
| queryComponent | 查询表单组件 | ReactNode |  |
| onQueryChange | 查询条件变更事件回调 | (query) => void |  |
| onQuerySubmit | 查询条件应用事件回调 | (query) => void |  |
| onQueryReset | 查询条件重置事件回调 | () => void |  |

#### GroupProps 分组
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否展示分组 | boolean | false |
| gruopKey | 分组key | string |  |
| onGroupKeyChange | 分组key变更事件回调 | (groupKey) => void |  |
| groupFormatter | 表格分页行展示内容格式化 | (groupKey, rowGroupValue) => string |  |

#### AggregateProps 聚合
| 属性 | 说明 | 类型/示例 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否展示聚合 | boolean | false |
| aggregates | 聚合项 | array <br> `[{title: string, dataIndex: string, type: 'SUM'\|'COUNT'\|'MIN'\|'MAX'\|'AVERAGE'}]` |  |
| onAggregatesChange | 聚合项变更事件回调 | (aggregates) => void |  |
| onAggregatesSubmit | 聚合项应用事件回调 | () => void |  |

#### LoadingProps 加载状态
| 属性 | 说明 | 类型/示例 | 默认值 |
| --- | --- | --- | --- |
| dataLoading | 数据加载状态 | boolean |  |
| sortsBtnLoading | 排序项应用加载状态 | boolean |  |
| queryBtnLoading | 查询条件应用加载状态 | boolean |  |
| aggregatesBtnLoading | 聚合项应用加载状态 | boolean |  |

#### DataTable 页面表格
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 表格列配置： <br> - groupable 可用于分组 <br> - sortable 可用于排序 <br> - aggregatable 可用于聚合 <br> - optional 可选列 <br>  | array <br> `[{title: string, dataIndex: string, fixed: boolean, width: number, render: (text: any, record: RecordType, index: number, { expandIcon?: ReactNode, selection?: ReactNode, indentText?: ReactNode }) => object\|ReactNode, sortable: boolean, aggregatable: boolean, groupable: boolean, optional: boolean}]` | [] <br> 序号列可使用`@/components/page/PageTable/addition`中提供的`indexColumn` |
| rowKey | 表格行 key 的取值，可以是字符串或一个函数 | string \| (record: RecordType) => string | 'id' |
| bordered | 是否展示外边框和列边框 | boolean | false |
| expanedRowRender | 额外的展开行 | (record: object, index: number, expanded: boolean) => ReactNode |  |
| resizable | 是否开启伸缩列功能 | boolean | false |
| dataSource | 数据 | array | [] |
| expandAllRows | 是否展开所有行 | boolean | false |
| expandIcon | 自定义展开按钮，传 false 关闭默认的渲染 | boolean \| ReactNode <br> \| (expanded: boolean) => ReactNode |  |
| aggregateData | 聚合查询结果 | array <br> `[{field: string, type: 'SUM'\|'COUNT'\|'MIN'\|'MAX'\|'AVERAGE', value: object}]` |  |
| paignation | 分页参数，传null时不显示分页器 | object <br> `{currentPage: number, pageSize: number}` | null |
| onPageChange | 分页事件回调 | (currentPage: number, pageSize: number) => void |  |
| selectEnabled | 是否启用行选择 | boolean | false |
| selectColumnWidth | 设置行选择列宽度 | number |  |
| selectedKeys | 指定选中项的key数组 | string[] |  |
| onSelectChange | 手动点击行选择框回调 | (record: RecordType, selected: boolean, selectedRows: RecordType[], nativeEvent: MouseEvent) => void |  |

### Sorts 排序组件

![Sorts组件示例](https://cdn.nlark.com/yuque/0/2023/png/763022/1682515192701-f2651952-a97e-43eb-8d31-8063cd724992.png#averageHue=%23fdfdfc&clientId=u7830080a-df2b-4&from=paste&height=209&id=u176c899a&originHeight=209&originWidth=459&originalType=binary&ratio=1&rotation=0&showTitle=true&size=12033&status=done&style=stroke&taskId=u282b8621-a938-4f11-9f12-ccb4d3535a6&title=Sorts%E7%BB%84%E4%BB%B6%E7%A4%BA%E4%BE%8B&width=459 "Sorts组件示例")

### Query 筛选组件

![Query组件示例](https://cdn.nlark.com/yuque/0/2023/png/763022/1682515213453-75334a8d-9775-492b-83a2-01a97be2239a.png#averageHue=%23fdfcfc&clientId=u7830080a-df2b-4&from=paste&height=379&id=u57fe0ee5&originHeight=379&originWidth=289&originalType=binary&ratio=1&rotation=0&showTitle=true&size=13744&status=done&style=stroke&taskId=u4d8b96d5-5e88-4cee-8278-28abf156473&title=Query%E7%BB%84%E4%BB%B6%E7%A4%BA%E4%BE%8B&width=289 "Query组件示例")

### Group 分组组件

![Group组件示例](https://cdn.nlark.com/yuque/0/2023/png/763022/1682515239289-40bfac5b-e566-4ec5-b065-09bc58265877.png#averageHue=%23fcfcfb&clientId=u7830080a-df2b-4&from=paste&height=301&id=u3dd0a730&originHeight=301&originWidth=887&originalType=binary&ratio=1&rotation=0&showTitle=true&size=27965&status=done&style=stroke&taskId=u6bc81925-2aa0-4044-beae-86b14de45ad&title=Group%E7%BB%84%E4%BB%B6%E7%A4%BA%E4%BE%8B&width=887 "Group组件示例")

### Aggregates 聚合组件

![Aggregates组件示例](https://cdn.nlark.com/yuque/0/2023/png/763022/1682515959989-a8e86f3d-a108-4c15-8a79-38a4f2d8edae.png#averageHue=%23e4c38b&clientId=u7830080a-df2b-4&from=paste&height=292&id=u58eec9c7&originHeight=292&originWidth=1058&originalType=binary&ratio=1&rotation=0&showTitle=true&size=28753&status=done&style=stroke&taskId=u2e84f562-7630-4cfd-9b84-195517c8b37&title=Aggregates%E7%BB%84%E4%BB%B6%E7%A4%BA%E4%BE%8B&width=1058 "Aggregates组件示例")

### OptionalColumns 表格可选列组件

![OptioanlColumns组件示例](https://cdn.nlark.com/yuque/0/2023/png/763022/1695434971941-cd20b816-2081-4ab6-9d58-1e87b11d3cc6.png#averageHue=%23fcfbfa&clientId=ued9da8d8-adaf-4&from=paste&height=459&id=uf454bd42&originHeight=459&originWidth=1020&originalType=binary&ratio=1&rotation=0&showTitle=true&size=36488&status=done&style=stroke&taskId=uc102f104-909c-4823-869f-5c6f3c05d0e&title=OptioanlColumns%E7%BB%84%E4%BB%B6%E7%A4%BA%E4%BE%8B&width=1020 "OptioanlColumns组件示例")

### PageTable 数据表格组件
数据表格组件属性即ManagePage组件DataTable的相关属性。
PageTable.addition是对表格组件的扩展，有以下扩展内容：

| **扩展方法** | **功能介绍** | **参数说明** |
| --- | --- | --- |
| indexColumn(width: number) | 表格序号列组件hook方法 | width: 列宽，默认48 |

### FormFooter 表单页脚组件
表单页脚组件常用于Modal、SideSheet的页脚操作区，用于表单关闭或者表单提交操作。

![FormFooter组件示例](https://cdn.nlark.com/yuque/0/2023/png/763022/1695435401827-51418b60-9297-42b1-b365-4520de5b04a9.png#averageHue=%23fbf8f5&clientId=ued9da8d8-adaf-4&from=paste&height=149&id=u42e57f2a&originHeight=152&originWidth=448&originalType=binary&ratio=1&rotation=0&showTitle=true&size=6422&status=done&style=stroke&taskId=uf92308a3-7c8f-45da-a5c8-8951432c8d6&title=FormFooter%E7%BB%84%E4%BB%B6%E7%A4%BA%E4%BE%8B&width=438 "FormFooter组件示例")

组件配置：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| onCancel | 表单取消事件回调 | () => void |  |
| onSubmit | 表单提交事件回调 | () => void |  |
| submitLoading | 提交按钮loading状态 | boolean |  |

### IconPicker 图标选择器组件

![IconPicker组件示例](https://cdn.nlark.com/yuque/0/2023/png/763022/1695436083735-d3701ec5-91d6-4128-816c-11087db25f1e.png#averageHue=%23fbfbfa&clientId=ued9da8d8-adaf-4&from=paste&height=467&id=ufb82e3ce&originHeight=467&originWidth=508&originalType=binary&ratio=1&rotation=0&showTitle=true&size=17287&status=done&style=stroke&taskId=ud6e27587-3321-482d-a213-b45ec109d59&title=IconPicker%E7%BB%84%E4%BB%B6%E7%A4%BA%E4%BE%8B&width=508 "IconPicker组件示例")

组件配置：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| btnSize | 选择器按钮大小，可选值：`large`、`default`、`small` | string | default |
| popPosition | 表单提交事件回调 | () => void |  |
| iconType | 图标类型，可选值：semi design内置图标类型 | string |  |
| onChange | 选择图标变化事件回调 | () => void |  |

### IconHolder 图标展示组件
组件配置：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 图标类型，可选值：semi design内置图标类型 | string |  |

### Address 地址展示组件

![Address组件示例](https://cdn.nlark.com/yuque/0/2023/png/763022/1695436570414-1831a6b3-cd8e-4c46-b9d5-96450d0b6bcb.png#averageHue=%23fbf9f8&clientId=ued9da8d8-adaf-4&from=paste&height=103&id=u1712afff&originHeight=111&originWidth=423&originalType=binary&ratio=1&rotation=0&showTitle=true&size=7472&status=done&style=stroke&taskId=ubc18e5b5-593f-42f0-ae8b-7fbb892ae5d&title=Address%E7%BB%84%E4%BB%B6%E7%A4%BA%E4%BE%8B&width=391 "Address组件示例")

组件配置：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| address | 地址对象 | Address |  |
| style | 组件样式 | object |  |
| onEdit | 编辑按钮点击事件回调 | (address) => void |  |
| onDelete | 删除按钮点击事件回调 | (addressId) => void |  |

Address地址对象：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 地址ID | number |  |
| addressType | 地址类型，可选值：`USER`、`ORGANIZATION` | string |  |
| relId | 关联ID | number |  |
| primaryAddress | 是否默认地址 | boolean |  |
| contactPerson | 联系人姓名 | string |  |
| contactPhone | 联系方式 | string |  |
| provinceCode | 省份编码 | string |  |
| cityCode | 城市编码 | string |  |
| countyCode | 区/县编码 | string |  |
| townCode | 街道/乡镇编码 | string |  |
| detailAddress | 详细地址 | string |  |

### AddressSelect 地址选择器组件

![AddressSelect组件示例](https://cdn.nlark.com/yuque/0/2023/png/763022/1695436840013-c0cc9f53-9706-405f-8751-88b56f3b2d89.png#averageHue=%23f9f8f8&clientId=ued9da8d8-adaf-4&from=paste&height=396&id=ue9920ad4&originHeight=396&originWidth=438&originalType=binary&ratio=1&rotation=0&showTitle=true&size=12336&status=done&style=stroke&taskId=uc25b0ca2-1bba-4d01-a5ea-d2e8d6781bd&title=AddressSelect%E7%BB%84%E4%BB%B6%E7%A4%BA%E4%BE%8B&width=438 "AddressSelect组件示例")

![省市区街道选择器-级联模式](https://cdn.nlark.com/yuque/0/2023/png/763022/1695436644013-1c94aa38-7232-4518-836a-e0803bf9d95d.png#averageHue=%23d4c7ba&clientId=ued9da8d8-adaf-4&from=paste&height=277&id=u65d0d0c3&originHeight=277&originWidth=798&originalType=binary&ratio=1&rotation=0&showTitle=true&size=26369&status=done&style=stroke&taskId=u9cf801cd-3245-4a3a-a9e5-4abf39e1ae8&title=%E7%9C%81%E5%B8%82%E5%8C%BA%E8%A1%97%E9%81%93%E9%80%89%E6%8B%A9%E5%99%A8-%E7%BA%A7%E8%81%94%E6%A8%A1%E5%BC%8F&width=798 "省市区街道选择器-级联模式")

![省市区街道选择器-非级联模式](https://cdn.nlark.com/yuque/0/2023/png/763022/1695436959886-9962a6cf-714b-483c-bb15-2c341dae348c.png#averageHue=%23f9f9f8&clientId=ued9da8d8-adaf-4&from=paste&height=616&id=u09f22487&originHeight=616&originWidth=435&originalType=binary&ratio=1&rotation=0&showTitle=true&size=16019&status=done&style=stroke&taskId=ubf470223-1b2c-49aa-869d-dcdfe974b19&title=%E7%9C%81%E5%B8%82%E5%8C%BA%E8%A1%97%E9%81%93%E9%80%89%E6%8B%A9%E5%99%A8-%E9%9D%9E%E7%BA%A7%E8%81%94%E6%A8%A1%E5%BC%8F&width=435 "省市区街道选择器-非级联模式")

组件配置：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| address | 地址对象 | Address |  |
| onChange | 地址变化事件回调 | (address) => void |  |
| cascade | 是否使用级联模式 | boolean |  |
| primaryHidden | 是否隐藏默认地址表单项 | boolean | false |

