---
title: Docker镜像命令
date: 2020-02-04 09:41:37
category: Docker
tags:
  - Docker
  - 镜像
---

# Docker镜像命令

> 引用自[《Docker系列教程04-Docker镜像常用命令》- 周立](http://www.itmuch.com/docker/04-docker-command-images/)

## 搜索镜像

可使用 `docker search` 命令搜索存放在Docker Hub中的镜像。

命令格式：

```bash
docker search [OPTIONS] TERM
```

参数：

|名称，缩写|默认值|描述|
|---|---|---|
|--automated|	false	|只列出自动构建的镜像|
|--filter, -f|		|根据指定条件过滤结果|
|--limit|	25	|搜索结果的最大条数|
|--no-trunc|	false	|不截断输出，显示完整的输出|
|--stars, -s|	0	|只展示Star不低于该数值的结果|

示例1：

```bash
docker search java
```

执行该命令后，Docker就会在Docker Hub中搜索含有“java”这个关键词的镜像仓库。执行该命令后，可看到类似于如下的表格：

```
NAME                    DESCRIPTION                STARS     OFFICIAL   AUTOMATED
java                    Java is a concurrent, ...   1281      [OK]       
anapsix/alpine-java     Oracle Java 8 (and 7) ...   190                  [OK]
isuper/java-oracle      This repository conta ...   48                   [OK]
lwieske/java-8          Oracle Java 8 Contain ...   32                   [OK]
nimmis/java-centos      This is docker images ...   23                   [OK]
...
```

该表格包含五列，含义如下：

① NAME：镜像仓库名称。

② DESCRIPTION：镜像仓库描述。

③ STARS：镜像仓库收藏数，表示该镜像仓库的受欢迎程度，类似于GitHub的Stars。

④ OFFICAL：表示是否为官方仓库，该列标记为[OK]的镜像均由各软件的官方项目组创建和维护。由结果可知，java这个镜像仓库是官方仓库，而其他的仓库都不是镜像仓库。

⑤ AUTOMATED：表示是否是自动构建的镜像仓库。

示例2：

```bash
docker search -s 10 java
```

## 下载镜像 *

使用命令 `docker pull` 命令即可从Docker Registry上下载镜像。

命令格式：

```bash
docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```

参数：

|名称，缩写|默认值|描述|
|---|---|---|
|--all-tags, -a|	false	|下载所有标签的镜像|
|--disable-content-trust|	true	|忽略镜像的校验|

示例1：

```bash
docker pull java
```

执行该命令后，Docker会从Docker Hub中的java仓库下载最新版本的Java镜像。

示例2：

该命令还可指定想要下载的镜像标签以及Docker Registry地址，例如：

```bash
docker pull reg.itmuch.com/java:7
```

这样就可以从指定的Docker Registry中下载标签为7的Java镜像。

## 列出镜像 *

使用 `docker images` 命令即可列出已下载的镜像。

执行该命令后，将会看到类似于如下的表格：

```
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
java                latest              861e95c114d6        4 weeks ago         643.1 MB
hello-world         latest              c54a2cc56cbb        5 months ago        1.848 kB
```

该表格包含了5列，含义如下：

① REPOSITORY：镜像所属仓库名称。

② TAG：镜像标签。默认是latest，表示最新。

③ IMAGE ID：镜像ID，表示镜像唯一标识。

④ CREATED：镜像创建时间。

⑤ SIZE：镜像大小。

命令格式：

```bash
docker images [OPTIONS] [REPOSITORY[:TAG]]
```

参数：

|名称，缩写|默认值|描述|
|---|---|---|
|--all, -a|	false	|列出本地所有的镜像（含中间映像层，默认情况下，过滤掉中间映像层）|
|--digests|	false	|显示摘要信息|
|--filter, -f|		|显示满足条件的镜像|
|--format|		|通过Go语言模板文件展示镜像|
|--no-trunc|	false	|不截断输出，显示完整的镜像信息|
|--quiet, -q|	false	|只显示镜像ID|

示例：

```bash
docker images
docker images java
docker images java:8
docker images --digests
docker images --filter "dangling=true"   # 展示虚悬镜像
```

## 删除本地镜像 *

使用 `docker rmi` 命令即可删除指定镜像。

命令格式：

```bash
docker rmi [OPTIONS] IMAGE [IMAGE...]
```

参数：

|名称，缩写|默认值|描述|
|---|---|---|
|--force, -f|	false	|强制删除|
|--no-prune|	false	|不移除该镜像的过程镜像，默认移除|

例1：删除指定名称的镜像。

```bash
docker rmi hello-world
```

表示删除hello-world这个镜像。

例2：删除所有镜像。

```bash
docker rmi -f $(docker images)
```

-f参数表示强制删除。

## 保存镜像

使用 `docker save` 即可保存镜像。

命令格式：

```bash
docker save [OPTIONS] IMAGE [IMAGE...]
```

参数：

|名称，缩写|默认值|描述|
|---|---|---|
|--output, -o|		|Write to a file, instead of STDOUT|

例1：

```bash
docker save busybox > busybox.tar
docker save --output busybox.tar busybox
```

## 加载镜像

使用 `docer load` 命令即可加载镜像。

命令格式：

```bash
docker load [OPTIONS]
```

参数：

|名称，缩写|默认值|描述|
|---|---|---|
|--input, -i|		|从文件加载而非STDIN|
|--quiet, -q|	false	|静默加载|

例1：

```bash
docker load < busybox.tar.gz
docker load --input fedora.tar
```

## 构建镜像 *

通过Dockerfile构建镜像。

命令格式：

```bash
docker build [OPTIONS] PATH | URL | -
```

参数：

|名称，缩写|默认值|描述|
|---|---|---|
|--add-host|		|添加自定义从host到IP的映射，格式为（host:ip）|
|--build-arg|		|设置构建时的变量|
|--cache-from|		|作为缓存源的镜像|
|--cgroup-parent|		|容器可选的父cgroup|
|--compress|	false	|使用gzip压缩构建上下文|
|--cpu-period|	0	|限制CPU CFS (Completely Fair Scheduler) 周期|
|--cpu-quota|	0	|限制CPU CFS (Completely Fair Scheduler) 配额|
|--cpu-shares, -c|	0	|CPU使用权重（相对权重）|
|--cpuset-cpus|		|指定允许执行的CPU|
|--cpuset-mems|		|指定允许执行的内存|
|--disable-content-trust|	true	|忽略校验|
|--file, -f|		|指定Dockerfile的名称，默认是‘PATH/Dockerfile’|
|--force-rm|	false	|删除中间容器|
|--iidfile|		|将镜像ID写到文件中|
|--isolation|		|容器隔离技术|
|--label|		|设置镜像使用的元数据|
|--memory, -m|	0	|设置内存限制|
|--memory-swap|	0	|设置Swap的最大值为内存+swap，如果设置为-1表示不限swap|
|--network|	default	|在构建期间设置RUN指令的网络模式|
|--no-cache|	false	|构建镜像过程中不使用缓存|
|--pull|	false	|总是尝试去更新镜像的新版本|
|--quiet, -q|	false	|静默模式，构建成功后只输出镜像ID|
|--rm|	true	|构建成功后立即删除中间容器|
|--security-opt|		|安全选项|
|--shm-size|	0	|指定/dev/shm 目录的大小|
|--squash|	false	|将构建的层压缩成一个新的层|
|--tag, -t|		|设置标签，格式：name:tag，tag可选|
|--target|		|设置构建时的目标构建阶段|
|--ulimit|		|Ulimit 选项|