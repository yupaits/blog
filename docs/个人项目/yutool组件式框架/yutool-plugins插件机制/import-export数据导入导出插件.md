# import-export数据导入导出插件

## 实现原理
基于easyexcel整合yutool-orm组件的基础能力，设计并开发了import-export数据导入导出插件。通过ImportTemplate和ExportTemplate模版工具类实现了一行代码实现导入导出功能。

- ImportTemplate模版方法：
```java
// 导入数据
public <ID extends Serializable, T extends BaseEntity<ID, T>, D extends BaseDto<ID>> ImportResult importData(MultipartFile file, @NonNull ImportProps<ID, T, D> importProps);

// 导入数据,失败回写校验信息
public <ID extends Serializable, T extends BaseEntity<ID, T>, D extends BaseDto<ID>> void importDataOrWriteBack(MultipartFile file, @NonNull ImportWriteBackProps<ID, T, D> importWriteBackProps, HttpServletResponse response);
```

  - `ImportProps`配置项
      - `clazz`: 导入数据类型
      - `readListener`: 读监听器
      - `dataService`: 导入数据类型对应的Service
      - `batchSize`: 单次批量导入数据条数
      - `excelType`: Excel文件类型
      - `sheetNo`: sheet序号，优先级高于sheetName
      - `sheetName`: sheet名称
      - `headRowNumber`: 指定表格头行数，默认1

  - `ImportWriteBackProps`配置项
      - `clazz`: 导入数据类型
      - `readListener`: 读监听器
      - `dataService`: 导入数据类型对应的Service
      - `batchSize`: 单次批量导入数据条数
      - `excelType`: Excel文件类型
      - `sheetNo`: sheet序号，优先级高于sheetName
      - `sheetName`: sheet名称
      - `headRowNumber`: 指定表格头行数，默认1
      - `onlyFailData`: 
          - `true`：校验成功的数据会正常保存，校验失败的数据则导出至Excel文件；
          - `false`：所有数据都校验成功会全部保存，反之只要存在校验不通过的数据则所有数据都不保存并导出至Excel文件。
- ExportTemplate模版方法：
```java
// 根据导出数据类结构导出数据
public <V extends BaseVo> void exportData(List<V> list, @NonNull ExportProps<V> exportProps, OutputStream outputStream);

// 根据Excel导出模版填充字段导出数据
public <V extends BaseVo> void fillData(List<V> list, @NonNull ExportProps<V> exportProps, OutputStream outputStream);

// Web导出数据
public <V extends BaseVo> void export(List<V> list, @NonNull ExportProps<V> exportProps, HttpServletResponse response);
```

   - `ExportProps`配置项
      - `clazz`： 导出数据类型
      - `sheetNo`： sheet序号
      - `sheetName`： sheet名称
      - `limitSize`： 限制导出条数
      - `exceedLimitThrowEx`： 超出限制条数是否抛出异常，默认抛出异常
      - `templateFile`： 导出数据Excel模版文件路径
      - `filename`： 导出文件名
## 快速上手
### 1. Maven依赖
在项目的 pom.xml 中添加以下依赖：
```xml
<parent>
    <groupId>com.yupaits</groupId>
    <artifactId>yutool-parent</artifactId>
    <version>${yutool.version}</version>
    <relativePath/>
</parent>

<dependencies>
    <dependency>
        <groupId>com.yupaits</groupId>
        <artifactId>import-export</artifactId>
    </dependency>
</dependencies>
```
### 2. 注入ImportTemplate和ExportTemplate实现数据导入导出
```java
@Service("dataService")
public class DataServiceImpl extends MybatisServiceImpl<Long, Data, DataMapper> implements DataService {
  	private final ImportTemplate importTemplate;
  	private final ExportTemplate exportTemplate;
    
    @Autowired
  	public DataServiceImpl(OptService optService, AuditLogger auditLogger, ImportTemplate importTemplate, ExportTemplate exportTemplate) {
    	super(Data.class, optService, auditLogger);
		this.importTemplate = importTemplate;
		this.exportTemplate = exportTemplate;
	}
 	
    @Override
	@Transactional(rollbackFor = {Exception.class})
	public Result<ImportResult> importData(MultipartFile file) {
		return ResultWrapper.success(importTemplate.importData(file, ImportProps.<Long, Data, DataDto>builder().clazz(DataDto.class).dataService(this).build()));
	}

	@Override
	public void exportData(HttpServletResponse response, DataQuery query) throws IOException {
		exportTemplate.export(listVo(query.buildNewLambdaQuery()), ExportProps.<DataVo>builder().clazz(DataVo.class)
				.filename(String.format("导出数据_%s.xlsx", LocalDate.now(DateTimeConstants.ZONE_ID).toString())).build(), response);
	}
}
```

