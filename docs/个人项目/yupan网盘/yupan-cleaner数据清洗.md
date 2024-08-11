# yupan-cleaner数据清洗

yupan-cleaner数据清洗以任务的方式执行，清洗任务绑定在采集任务上，可以与任务调度平台进行整合，用来实现定时清洗。

### 清洗任务可配置化

清洗任务的配置信息有以下内容：

- `crawlerJobId`: 采集任务ID
- `jobName`: 任务名称
- `jobDesc`: 任务说明
- `resSizeLimit`: 单次处理资源数量限制
- `enableRetry`: 是否启用失败重试
- `retryMaxTimes`: 最大失败重试次数
- `jobProps`: 任务定制化配置信息

系统默认使用MySQL数据库存储配置信息，可以在清洗任务的管理页面上对以上信息进行维护。

可以实现`CleanerJobHolder`接口类的`CleanerJob getCleanerJob(Long crawlerJobId);`方法通过采集任务ID获取清洗任务配置信息，默认实现是通过查询数据库获取。

### 清洗任务过程

清洗任务主要有3个步骤：下载 -> 清洗 -> 打包。

具体过程拆解之后有以下方法：
- `List<Resource> fetchResource()`: 拉取待清洗的资源
- `void preHandle(CleanerJobContext cleanerJobContext)`: 清洗前的预处理
- `void download(CleanerJobContext cleanerJobContext)`: 下载资源
- `void clean(CleanerJobContext cleanerJobContext)`: 清理资源
- `void pack(CleanerJobContext cleanerJobContext)`: 打包资源
- `void postHandle(CleanerJobContext cleanerJobContext)`: 清洗后的处理
- `void onSuccess(CleanerJobContext cleanerJobContext)`: 成功回调方法
- `void onFailure(CleanerJobContext cleanerJobContext)`: 失败回调方法

`CleanerJobContext`上下文对象包含以下信息：
- `cleanerJob`: 清洗任务配置
- `cleanerJobLog`: 清洗日志
- `resource`: 清洗资源
- `payload`: 上下文传递载体
- `status`: 资源状态
- `ex`: 清洗失败抛出的异常

清洗任务与采集任务类似，都是与任务调度解耦，并且支持手动触发执行。