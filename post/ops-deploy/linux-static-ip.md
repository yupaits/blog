---
sidebar: auto
---
# Linux系统设置静态IP

在日常工作中，常常会由于动态IP分配导致指定主机或者服务器的内网IP发生变化，造成很多不便，通过设置静态IP可以有效解决此问题。本文简单介绍如何在CentOS 7和Ubuntu 18.04系统中设置静态IP。

## CentOS 7

### 1. 通过ifconfig命令查看当前的网络设置

### 2. 修改网卡配置

找到 `/etc/sysconfig/network-scripts/` 目录下网卡xxx的配置文件并修改为如下内容：

```conf
TYPE=""
```

### 3. 重启network服务

修改配置文件之后，执行 `service network restart` 命令重启network服务。

### 4. 常见问题

## Ubuntu 18.04

未完待续...