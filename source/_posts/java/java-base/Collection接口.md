---
title: Collection接口
date: 2020-02-04 09:41:37
category: Java基础
tags: 
  - Java
  - 集合
---

# Collection接口

## 类图

![Collection类图](/images/Collection接口/Collection类图.png)

> 引用自[Java集合类: Set、List、Map、Queue使用场景梳理](http://www.cnblogs.com/LittleHann/p/3690187.html)

Collection类的父接口Iterable是迭代器接口。实现了Iterable接口的对象允许使用foreach进行遍历，所以，所有Collection集合对象都具有"foreach可遍历性"。

Collection代表一组Object的集合，这些Object被称作Collection的元素。Collection是一个接口，用以提供规范定义，不能被实例化使用。

## Collection和Map的区别

Collection和Map的区别在于容器中每个位置保存的元素类别。

Collection每个位置只能保存一个元素（对象）；Map保存的是"键值对"，类似于一个小型数据库，可以通过"键"找到对应的"值"。