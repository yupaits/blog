---
title: 通过开启swap分区解决小内存阿里云服务器的运行瓶颈
---

> 引用自：[ECS Linux开启swap（虚拟内存）](https://blog.csdn.net/u012203437/article/details/49737365)

阿里云在2018年春节前后通过一系列的促销活动向新老顾客推广云服务器，在诱人的价格面前笔者贡献了口袋里最后的可支配人民币，但实际使用下来，发现1核2G内存的ECS服务器的性能实在有限，特别是最近在上面部署docker容器的时候明显感觉到内存吃紧。思来想去，发现可以通过开启swap分区来解决内存瓶颈。

<!-- more -->

## swap分区大小设置

阿里云的linux云服务器默认是没有启用swap分区（交换分区）的。一般情况下swapswap分区的大小可以参考以下规则进行设定：

|内存大小|swap大小|
|---|---|
|MEM_SIZE <= 4G|最小2G|
|4G < MEM_SIZE <= 16G|最小4G|
|16G < MEM_SIZE <= 64G|最小8G|
|64G < MEM_SIZE <= 256G|最小16G|

## 启用swap分区

### 创建用于交换分区的文件

```bash
dd if=/dev/zero of=/mnt/swap bs=block_size count=number_of_block
```

其中`block_size`和`number_of_block`的大小可以自定义，例如`bs=1M count=2048`代表2G大小的swap分区。

### 设置交换分区文件

```bash
mkswap /mnt/swap
```

### 立即启用交换分区文件

```bash
swapon /mnt/swap
```

### 设置开机自动启用swap分区

在`/etc/fstab`中增加swap配置行。

```
/mnt/swap   swap    swap    defaults    0   0
```

## 查看效果

设置完成之后可以通过linux的`free -m`命令查看swap分区的状态。