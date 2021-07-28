---
title: Map相关
date: 2020-02-04 09:41:37
category: Java基础
tags: 
  - Java
  - 集合
---

# Map相关

## 类图

![Map类图](/images/Map相关/Map类图.png)

![Map的Entry类图](/images/Map相关/Map的Entry类图.png)

Map用于保存具有"映射关系"的数据，因此Map集合里保存着两组值，一组值用于保存Map里的key，另外一组值用于保存Map里的value。key和value都可以是任何引用类型的数据。Map的key不允许重复，即同一个Map对象的任何两个key通过equals方法比较结果总是返回false。

Map的实现类和子接口中key集的存储形式和Set集合相同（即key不能重复）；Map的实现类和子接口中value集的存储形式和List非常类似（即value可以重复、根据索引进行查找）。

## Map实现类

### HashMap

HashMap保存的key-value对是无序的，判断HashMap中的两个key是否相等的标准是：两个key通过equals()方法比较返回true、同时两个key的hashCode值也必需相等。

### LinkedHashMap

LinkedHashMap使用双向链表来维护key-value对的次序，该链表负责维护Map的迭代顺序，与key-value对的插入顺序一致。

### HashTable

线程安全的Map实现类。

### Properties

Properties对象在处理属性文件时特别方便，Properties类可以把Map对象和属性文件关联起来，从而可以把Map对象中的key-value对写入到属性文件中，也可以把属性文件中的"属性名-属性值"加载到Map对象中。

### TreeMap

TreeMap时一个红黑树数据结构，每个key-value对作为红黑树的一个节点。TreeMap存储key-value对时，需要根据key对节点进行排序。TreeMap可以保证所有的key-value对处于有序状态。

### WeakHashMap

WeakHashMap与HashMap的用法基本相似。区别在于，HashMap的key保留了对实际对象的"强引用"，这意味着只要该HashMap对象不被销毁，该HashMap所引用的对象就不会被GC。而WeakHash的key只保留了对实际对象的弱引用，这意味着如果被引用的实际对象没有被其他强引用变量所引用，则这些key所引用的对象可能被GC，当引用的对象被GC之后，WeakHashMap也可能自动删除这些key所对应的key-value对。

### IdentityHashMap

IdentityHashMap的实现机制与HashMap基本相似，区别在于，在IdentityHashMap中，当且仅当两个key严格相等（key1 == key2）时，IdentityHashMap才认为两个key相等。

### EnumMap

EnumMap时一个与枚举类一起使用的Map实现，EnumMap中的所有key都必需是单个枚举类的枚举值。创建EnumMap时必须显式或隐式指定它对应的枚举类。EnumMap根据key的自然顺序（即枚举值在枚举类中的定义顺序）进行排序。