---
title: RabbitMQ安装部署及常见问题
date: 2020-02-04 19:21:28
category: 工具
tags:
  - RabbitMQ
---

引用自：[centos/rhel 6.5（更新至centos 7）下rabbitmq安装（最简单方便的方式）](http://www.cnblogs.com/zhjh256/p/5922562.html)，[rabbitMQ windows 安装 入门](http://www.cnblogs.com/junrong624/p/4121656.html)

## 安装

从[RabbitMQ官方下载页面](https://www.rabbitmq.com/download.html)下载对应版本的安装包，执行安装包的时候会提示安装 **Erlang** 并打开 Erlang 的官方下载页面，下载安装 Erlang，之后 RabbitMQ会继续安装完成。

<!--more-->

## 部署

windows系统下 RabbitMQ 会作为服务安装并设置为自启动，因此无需进行额外的设置。在开始菜单中可以找到服务的启动、停止控制。

![RabbitMQ服务启动、停止控制](http://img.blog.csdn.net/20131227171128312?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvQV9famF2YV9fX0E=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

进入 RabbitMQ 安装目录下的 sbin 文件夹，在控制台下执行下述命令启用 RabbitMQ 的web管理工具，在浏览器中访问 http://localhost:15672/ 即可进行管理，默认 **用户名 | 密码** 是 **guest | guest**。

```
rabbitmq-plugins enable rabbitmq_management
```

## 常见问题

### 启用控制台

```
[root@dev-server ~]# rabbitmq-plugins enable rabbitmq_management
The following plugins have been enabled:
  mochiweb
  webmachine
  rabbitmq_web_dispatch
  amqp_client
  rabbitmq_management_agent
  rabbitmq_management

Applying plugin configuration to rabbit@dev-server... started 6 plugins.
```

在某些情况下，可能会出现如下错误：

```
Error: The following plugins could not be found:
  rabbitmq_management
```

此时是因为rabbitmq查找插件的路径不正确所致。可按照如下方式解决：

```
mkdir /etc/rabbitmq
vi /etc/rabbitmq/rabbitmq-env.conf 
```

这个是 rabbitmq 环境变量的配置文件,这个文件的位置是确定和不能改变的，位于：**/etc/rabbitmq** 或 **$RABBITMQ_HOME/etc/rabbitmq** 目录下（视具体的安装方式而定）,具体可参考http://www.rabbitmq.com/configure.html。

增加如下配置项：
```
RABBITMQ_MNESIA_BASE=/usr/local/rabbitmq/data
RABBITMQ_LOG_BASE=/usr/local/rabbitmq/log
RABBITMQ_PLUGINS_DIR=/usr/local/rabbitmq/plugins
```
或者也可以在 **sbin/rabbitmq-env** 中增加。

重启rabbitmq，问题解决。

PS：rabbitmq 的标准配置文件是 **rabbitmq.config**,它既有默认的目录，也可以在 **rabbitmq-env.conf** 文件中配置。具体可参考http://www.rabbitmq.com/configure.html。