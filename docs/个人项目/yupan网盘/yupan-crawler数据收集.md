# yupan-crawler数据收集

yupan-crawler数据采集以任务的方式执行，可以在数据采集管理页面对采集任务进行维护。采集任务可以与任务调度平台进行整合，用来实现定时采集。

yupan-crawler采用主流`Selenium`框架进行采集，下载文件采用`hutool-http`的`HttpUtil.downloadFile`方法，后续计划接入`qBittorrent`、`aria2`等下载平台。

以下是对yupan-crawler的主要特点和特色功能进行说明。

### 采集任务可配置化

采集任务的配置信息有以下内容：

| 名称       | 说明                                        |
|------------|-------------------------------------------|
| `jobName`  | 任务名称，采集任务的唯一标识                 |
| `jobDesc`  | 任务说明，采集任务的介绍和说明信息           |
| `resCate`  | 资源类别，包括：图片、小说、电影等              |
| `siteUrl`  | 资源站点地址                                |
| `timeout`  | 页面加载超时时长                            |
| `jobProps` | 任务定制化配置信息，针对具体任务的个性化配置 |

系统默认使用MySQL数据库存储配置信息，可以在采集任务的管理页面上对以上信息进行维护。

可以实现`CrawlerJobHolder`接口类的`CrawlerJob getCrawlerJob(String jobName)`方法通过任务名称获取配置信息，默认实现是通过查询数据库获取。

### 任务执行与任务调度解耦

将数据采集过程模板化，设计为`AbstractCrawlerHandler`抽象类，任务执行过程封装成`crawl()`方法，并暴露出以下方法：

| 方法定义                                         | 说明                                                      |
|--------------------------------------------------|---------------------------------------------------------|
| `String getName()`                               | 获取采集任务名称（唯一标识，用于关联对应的采集任务配置信息） |
| `void preHandle(CrawlerContext crawlerContext)`  | 爬取前的预处理                                            |
| `void postHandle(CrawlerContext crawlerContext)` | 爬取后的处理                                              |
| `void handle(CrawlerContext crawlerContext)`     | 数据爬取过程                                              |
| `void onSuccess(CrawlerContext crawlerContext)`  | 数据爬取成功回调方法                                      |
| `void onFailure(CrawlerContext crawlerContext)`  | 数据爬取失败回调方法                                      |

`CrawlerContext`上下文对象包含以下信息：

| 名称            | 说明               |
|-----------------|------------------|
| `crawlerJob`    | 采集任务配置       |
| `crawlerJobLog` | 采集日志           |
| `success`       | 爬取是否成功       |
| `payload`       | 爬取内容载体       |
| `ex`            | 爬取失败抛出的异常 |

如果想使用默认的上下文加载`CrawlerJob`配置信息、初始化及存储`CrawlerJobLog`日志信息的方式，则只需要继承`DefaultCrawlerHandler`抽象类。

这样设计的好处在于：
1. 与任务调度平台整合时，无需从任务调度平台获取任务执行的必需信息，只需要实现相关任务调度平台的执行器（例如：xxl-job的`IJobHandler`，PowerJob的`BasicProcessor`）触发采集处理器的`AbstractCrawlerHandler.crawl()`方法执行即可。
2. 如果有切换任务调度平台的需要，只需修改少量适配代码即可完成。

### 日志处理

`TaskLogger`接口提供了用于对接任务调度平台日志的方法，需要在执行器中实现该接口。同时在采集器中打印日志时，必须使用`HandlerLogHelper`辅助类中的日志打印方法才能完成日志对接。

例如：在xxl-job的执行器中注入`TaskLogger`的Bean实现xxl-job的任务执行日志的对接，代码示例如下：

```java
@Bean
public TaskLogger taskLogger() {
    return new TaskLogger() {
        @Override
        public void log(String msg) {
            XxlJobHelper.log(msg);
        }

        @Override
        public void log(String msg, Throwable ex) {
            XxlJobHelper.log(msg);
            XxlJobHelper.log(ex);
        }
    };
}
```

### 任务执行方式灵活

在完成与任务调度平台的整合之后，可以在平台上定时、手动触发采集任务的执行。

也可以在采集任务管理页面通过接口调用的方式触发任务的执行。
