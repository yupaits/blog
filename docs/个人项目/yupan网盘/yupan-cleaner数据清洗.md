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
- `storePath`: 资源文件存储路径
- `jobProps`: 任务定制化配置信息

系统默认使用MySQL数据库存储配置信息，可以在清洗任务的管理页面上对以上信息进行维护。

可以实现`CleanerJobHolder`接口类的`CleanerJob getCleanerJob(String jobName)`方法通过任务名称获取任务配置信息，默认实现是通过查询数据库获取。

### 清洗任务过程

清洗任务主要有3个步骤：下载 -> 清洗 -> 打包。

具体过程拆解之后有以下方法：
- `List<? extends Resource> fetchResource()`: 拉取待清洗的资源
- `String getName()`: 获取清洗任务名称（唯一标识，用于关联对应的清洗任务配置信息）
- `ResCate getResCate()`: 获取资源类别
- `void updateStatus(CleanerContext cleanerContext)`: 更新资源状态
- `void preHandle(CleanerJobContext cleanerJobContext)`: 清洗前的预处理
- `boolean readyToDownload(CleanerContext cleanerContext)`: 判断资源是否准备好进行下载
- `void download(CleanerJobContext cleanerJobContext)`: 下载资源
- `boolean readyToClean(CleanerContext cleanerContext)`: 判断资源是否准备好进行清理
- `void clean(CleanerJobContext cleanerJobContext)`: 清理资源
- `boolean readyToPackage(CleanerContext cleanerContext)`: 判断资源是否准备好进行打包
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

### 特殊处理

- `File downloadFileBypassCors(String url, File destFile)`: 用于解决CORS跨域问题下载资源

### 其他

清洗任务与采集任务类似，都是与任务调度解耦，并且支持手动触发执行。同时也支持实现`TaskLogger`接口进行任务调度日志的对接。