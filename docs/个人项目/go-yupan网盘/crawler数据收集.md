# crawler数据收集

crawler数据采集以任务的方式执行，可以在数据采集管理页面对采集任务进行维护。采集任务可以与任务调度框架进行整合，实现定时采集。

crawler使用`colly`和`rod`框架进行html数据采集，使用go原生`net/http`实现文件下载功能（可绕过网站cors限制）。

以下是对crawler的主要特点和特色功能进行说明。

### 采集任务可配置化

采集任务`CrawlerJob`的配置信息有以下内容：

| 名称         | 说明                     |
|------------|------------------------|
| `jobName`  | 任务名称，采集任务的唯一标识         |
| `jobDesc`  | 任务说明，采集任务的介绍和说明信息      |
| `resCate`  | 资源类别，包括：图片、小说、电影等      |
| `siteUrl`  | 资源站点地址                 |
| `timeout`  | 页面加载超时时长               |
| `jobProps` | 任务定制化配置信息，针对具体任务的个性化配置 |

系统默认使用数据库存储配置信息，可以在采集任务的管理页面上对以上信息进行维护。

### 任务执行与任务调度解耦

将数据采集过程模板化，设计为`crawler.Executor`采集任务执行器：

```go
// Handler 采集任务处理
type Handler func(*Context) error

// Callback 采集任务回调
type Callback func(*Context)

// Executor 采集任务执行器
type Executor struct {
	Name       string   // 采集任务名称
	PreHandle  Handler  // 爬取前的预处理
	Handle     Handler  // 爬取过程
	PostHandle Handler  // 爬取后的处理
	OnSuccess  Callback // 爬取成功回调
	OnFailure  Callback // 爬取失败回调
	context    context.Context
}
```

`crawler.Context`采集任务上下文对象包含以下信息：

```go
// Context 采集任务上下文
type Context struct {
	Name          string                // 采集任务名称
	CrawlerJob    *entity.CrawlerJob    // 采集任务配置
	CrawlerJobLog *entity.CrawlerJobLog // 采集日志
	Payload       any                   // 爬取内容载体
	Error         error                 // 错误
	SaveLog       bool                  // 是否存储日志
	Ctx           context.Context       // 内置上下文对象
}
```

调用`registerExecutor(name string, executor *crawler.Executor)`方法注册采集任务执行器，`name`参数传入任务名称即可关联采集任务。

### 任务执行方式灵活

与任务调度框架整合之后，可以实现定时采集。在采集任务管理页面通过接口调用的方式也能触发任务的执行。
