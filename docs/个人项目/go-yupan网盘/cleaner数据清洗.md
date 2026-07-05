# cleaner数据清洗

cleaner数据清洗以任务的方式执行，清洗任务绑定在采集任务上，可以与任务调度平台进行整合，用来实现定时清洗。

### 清洗任务可配置化

清洗任务`CleanerJob`的配置信息有以下内容：

| 名称              | 说明         |
|-----------------|------------|
| `crawlerJobId`  | 采集任务ID     |
| `jobName`       | 任务名称       |
| `jobDesc`       | 任务说明       |
| `resSizeLimit`  | 单次处理资源数量限制 |
| `enableRetry`   | 是否启用失败重试   |
| `retryMaxTimes` | 最大失败重试次数   |
| `storePath`     | 资源文件存储路径   |
| `jobProps`      | 任务定制化配置信息  |

系统默认使用数据库存储配置信息，可以在清洗任务的管理页面上对以上信息进行维护。

### 清洗任务过程

清洗任务主要有3个步骤：下载 -> 清洗 -> 打包。将数据清洗过程模板化，设计为`cleaner.Executor`清洗任务执行器：

```go
// Handler 清洗任务处理
type Handler[T model.Resource] func(*Context[T]) error

// Callback 清洗任务回调
type Callback[T model.Resource] func(*Context[T])

// Executor 清洗任务执行器
type Executor[T model.Resource] struct {
	Name           string
	ResCate        string         // 资源类型
	ResKeyFn       func(T) string // 资源Key生成
	PreHandle      Handler[T]     // 清洗前的预处理
	Download       Handler[T]     // 资源下载过程
	Clean          Handler[T]     // 资源清洗过程
	Pack           Handler[T]     // 资源打包过程
	PostHandle     Handler[T]     // 清洗后的处理
	UpdateStatusFn Callback[T]    // 资源状态更新
	OnSuccess      Callback[T]    // 处理成功回调
	OnFailure      Callback[T]    // 处理失败回调
	context        context.Context
}
```

`cleaner.Context`清洗任务上下文对象包含以下信息：

```go
// Context 清洗任务上下文
type Context[T model.Resource] struct {
	Name          string                // 清洗任务名称
	ResCate       string                // 资源类型
	CleanerJob    *entity.CleanerJob    // 清洗任务配置
	CleanerJobLog *entity.CleanerJobLog // 清洗日志
	Resource      *T                    // 待清洗的资源
	Payload       any                   // 状态流转时传递数据载体
	Status        string                // 资源状态
	Error         error                 // 错误
	SaveLog       bool                  // 是否存储日志
	Ctx           context.Context       // 内置上下文对象
}
```

调用`registerExecutor[T model.Resource](name string, executor *cleaner.Executor[T])`方法注册清洗任务执行器，`name`参数传入任务名称即可关联清洗任务。

### 特殊处理

| 方法定义                                                     | 说明               |
|----------------------------------------------------------|------------------|
| `DownloadFileBypassCors(link string, file string) error` | 用于解决CORS跨域问题下载资源 |

### 其他

清洗任务与采集任务类似，都是与任务调度解耦，并且支持手动触发执行。