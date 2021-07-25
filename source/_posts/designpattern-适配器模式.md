---
title: 适配器模式
date: 2020-02-04 19:21:28
category: 设计模式
tags:
  - 设计模式
  - Design Pattern
---

适配器模式就是一个类的接口不能被客户端接受，需要转换成另一种接口，从而使两个不匹配的接口能在一起工作。

**类结构**

![adapter](/images/适配器模式/adapter.png)

Adaptee：源接口，需要适配的接口。

Target：目标接口，暴露出去的接口。

Adapter：适配器，将源接口适配成目标接口。

举个例子：

Adaptee是内存卡，Target是电脑，而Adapter则是USB读卡器。

**适用场景**

比如查物流信息，由于物流公司的系统都是各自独立，而编程语言和交互方式上有很大差异，需要针对不同的物流公司做单独适配，同时结合不同公司的系统性能，配置不同的响应超时时间。

![adapter-logistics](/images/适配器模式/adapter-logistics.png)