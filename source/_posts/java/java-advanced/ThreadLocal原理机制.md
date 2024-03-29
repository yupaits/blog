---
title: ThreadLocal原理机制
date: 2020-02-04 09:41:37
category: Java进阶
tags: 
  - Java
  - ThreadLocal
---

# ThreadLocal原理机制

> 参考[Java多线程之隔离技术ThreadLocal源码详解](https://mp.weixin.qq.com/s/mo3-y-45_ao54b5T7ez7iA)

## 简介

ThreadLocal存取的数据，总是与当前线程相关，也就是说，JVM为每个运行的线程绑定了私有的本地实例存取空间，从而为多线程环境常出现的并发访问问题提供了一种隔离机制。

ThreadLocal是如何做到为每一个线程维护变量的副本的呢？实现的思路很简单，在ThreadLocal类中有一个Map，用于存储每一个线程的变量的副本。

## 常用方法

- `T get()`

返回此线程局部变量的当前线程副本中的值，如果这是线程第一次调用该方法，则创建并初始化此副本。

源码：

```Java
public T get() {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            @SuppressWarnings("unchecked")
            T result = (T)e.value;
            return result;
        }
    }
    return setInitialValue();
}
```

- `void set(T value)`

将此线程的局部变量的当前线程副本中的值设置为指定值。

源码：

```Java
public void set(T value) {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null)
        map.set(this, value);
    else
        createMap(t, value);
}
```

- `void remove()`

有助于减少线程局部变量的存储需求。