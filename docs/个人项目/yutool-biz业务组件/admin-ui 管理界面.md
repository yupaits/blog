# admin-ui 管理界面

为了方便使用，yutool-biz还集成了一套默认的管理页面，结合yutool-api可快速实现基础业务组件的可视化管理。
## 组件式开发
基于通用的交互场景开发了相应的前端组件，大大提高了开发效率。这里对各个前端组件的配置进行详细说明。
### ManagePage 管理页面组件

![ManagePage组件示例](./admin-ui%20管理界面/ManagePage组件示例.png)

组件配置：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
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
| exportEnabled | 是否显示导出按钮 | boolean | false |
| onExport | 导出按钮点击事件回调 | () => void |  |
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
| addBtnLoading | 新增数据加载状态 | boolean |  |
| exportBtnLoading | 导出数据处理状态 | boolean |  |
| sortsBtnLoading | 排序项应用加载状态 | boolean |  |
| queryBtnLoading | 查询条件应用加载状态 | boolean |  |
| aggregatesBtnLoading | 聚合项应用加载状态 | boolean |  |

#### DataTable 页面表格
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否展示表格 | boolean | true |
| columns | 表格列配置： <br> - groupable 可用于分组 <br> - sortable 可用于排序 <br> - aggregatable 可用于聚合 <br> - optional 可选列 <br>  | array <br> `[{title: string, dataIndex: string, fixed: boolean, width: number, render: (text: any, record: RecordType, index: number, { expandIcon?: ReactNode, selection?: ReactNode, indentText?: ReactNode }) => object\|ReactNode, sortable: boolean, aggregatable: boolean, groupable: boolean, optional: boolean}]` | [] <br> 序号列可使用`@/components/page/PageTable/addition`中提供的`indexColumn` |
| rowKey | 表格行 key 的取值，可以是字符串或一个函数 | string \| (record: RecordType) => string | 'id' |
| bordered | 是否展示外边框和列边框 | boolean | false |
| expanedRowRender | 额外的展开行 | (record: object, index: number, expanded: boolean) => ReactNode |  |
| resizable | 是否开启伸缩列功能 | boolean | false |
| draggable | 是否开启行拖拽功能 | boolean | false |
| dataSource | 数据 | array | [] |
| expandAllRows | 是否展开所有行 | boolean | false |
| expandIcon | 自定义展开按钮，传 false 关闭默认的渲染 | boolean \| ReactNode <br> \| (expanded: boolean) => ReactNode |  |
| expandedRowKeys | 展开的行，传入此参数时行展开功能将受控 | (string \| number)[] |  |
| onExpand | 点击行展开图标时进行触发 | (expanded: boolean, record: RecordType, DOMEvent: MouseEvent) => void |  |
| aggregateData | 聚合查询结果 | array <br> `[{field: string, type: 'SUM'\|'COUNT'\|'MIN'\|'MAX'\|'AVERAGE', value: object}]` |  |
| paignation | 分页参数，传null时不显示分页器 | object <br> `{currentPage: number, pageSize: number}` | null |
| onPageChange | 分页事件回调 | (currentPage: number, pageSize: number) => void |  |
| onMoveRow | 开启行拖拽时，拖拽事件的回调 | (fromIndex: number, toIndex: number) => void |  |
| selectEnabled | 是否启用行选择 | boolean | false |
| selectColumnWidth | 设置行选择列宽度 | number |  |
| selectedKeys | 指定选中项的key数组 | string[] |  |
| onSelectChange | 手动点击行选择框回调 | (record: RecordType, selected: boolean, selectedRows: RecordType[], nativeEvent: MouseEvent) => void |  |

### Sorts 排序组件

![Sorts组件示例](./admin-ui%20管理界面/1682515192701-f2651952-a97e-43eb-8d31-8063cd724992.png)

### Query 筛选组件

![Query组件示例](./admin-ui%20管理界面/1682515213453-75334a8d-9775-492b-83a2-01a97be2239a.png)

### Group 分组组件

![Group组件示例](./admin-ui%20管理界面/1682515239289-40bfac5b-e566-4ec5-b065-09bc58265877.png)

### Aggregates 聚合组件

![Aggregates组件示例](./admin-ui%20管理界面/1682515959989-a8e86f3d-a108-4c15-8a79-38a4f2d8edae.png)

### OptionalColumns 表格可选列组件

![OptioanlColumns组件示例](./admin-ui%20管理界面/OptionalColumns组件示例.png)

### PageTable 数据表格组件
数据表格组件属性即ManagePage组件DataTable的相关属性。
PageTable.addition是对表格组件的扩展，有以下扩展内容：

| **扩展方法** | **功能介绍** | **参数说明** |
| --- | --- | --- |
| indexColumn(width: number) | 表格序号列组件hook方法 | width: 列宽，默认48 |

### FormFooter 表单页脚组件
表单页脚组件常用于Modal、SideSheet的页脚操作区，用于表单关闭或者表单提交操作。

![FormFooter组件示例](./admin-ui%20管理界面/1695435401827-51418b60-9297-42b1-b365-4520de5b04a9.png)

组件配置：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| onCancel | 表单取消事件回调 | () => void |  |
| onSubmit | 表单提交事件回调 | () => void |  |
| submitLoading | 提交按钮loading状态 | boolean |  |

### IconPicker 图标选择器组件

![IconPicker组件示例](./admin-ui%20管理界面/1695436083735-d3701ec5-91d6-4128-816c-11087db25f1e.png)

组件配置：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| btnSize | 选择器按钮大小，可选值：`large`、`default`、`small` | string | default |
| popPosition | 弹出方向，可选值：`top`、`topLeft`、`topRight`、`left`、`leftTop`、`leftBottom`、`right`、`rightTop`、`rightBottom`、`bottom`、`bottomLeft`、`bottomRight` | () => void |  |
| iconType | 图标类型，可选值：semi design内置图标类型 | string |  |
| onChange | 选择图标变化事件回调 | () => void |  |

### IconHolder 图标展示组件
组件配置：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 图标类型，可选值：semi design内置图标类型 | string |  |
