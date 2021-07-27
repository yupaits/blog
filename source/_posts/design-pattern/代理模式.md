---
title: 代理模式
date: 2020-02-04 19:21:28
category: 设计模式
tags:
  - 设计模式
  - Design Pattern
---

为其它对象提供一种代理以控制对这个对象的访问。

**类结构图**

![proxy](/images/代理模式/proxy.png)

Subject：接口类，定义了一些需要代理的接口方法。

RealSubject：具体的实现类。

ProxySubject：代理类，保存一个Subject引用，可以注入一个具体的子类比如RealSubject。

代理模式其实就是在操作对象时引用一定程度的间接性。这种间接性，可以增加很多附加操作。比如权限控制，参数校验等等。

```Java
public class ProxyPersonManager implements PersonManager {
    // 接口引用
    PersonManager realPersonManager = new RealPersonManager();
    @Override
    public double getSalary(String name, String operateName) {
        // 1. 增加一些的权限判断。比如操作人是否有查询某人工资的权限
        // 2. 具体类的调用
        return realPersonManager.getSalary(name, operateName);
    }
}
```