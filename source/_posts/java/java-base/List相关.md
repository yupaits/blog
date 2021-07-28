---
title: List相关
date: 2020-02-04 09:41:37
category: Java基础
tags: 
  - Java
  - 集合
---

# List相关

## 类图

![List类图](/images/List相关/List类图.png)

List接口继承Collection接口，List集合代表一个元素有序、可重复的集合，集合中每个元素都有其对应的顺序索引。List集合允许加入重复元素，因为它可以通过索引来访问指定位置的集合元素。List集合默认按元素的添加顺序设置元素的索引。

## List实现类

### ArrayList

ArrayList时基于数组实现的List类，它封装了一个可以动态扩容的数组。详情见[ArrayList源码分析](../sourcecode/README.md)。

### LinkedList

LinkedList实现了List和Deque接口，具备列表和双端队列的一些特性。详情见[LinkedList源码分析](../sourcecode/LinkedList.md)。

### Vector

Vector和ArrayList在用法上几乎完全相同，并且Vector时线程安全的。Stack是Vector的一个子类，实现了"栈"这种数据接口，栈的特性是LIFO后进先出。