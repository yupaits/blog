---
title: Set相关
date: 2020-02-04 09:41:37
category: Java基础
tags: 
  - Java
  - 集合
---

# Set相关

## 类图

Set接口继承Collection接口

![Set类图](/images/Set相关/Set类图.png)

Set集合里的多个对象之间没有明显的顺序。Set继承自Collection接口，不能包含有重复元素（这是整个Set相关类的共有属性）。

Set判断两个对象相同使用的是equals方法。也就是说，当Set中加入一个新元素时，如果这个新元素对象和Set中已有对象进行equals比较都返回false，则Set就会接收这个新元素对象加入，否则拒绝。

因为Set的这个制约，在使用Set集合的时候，需要为Set集合里的元素的实现类实现一个有效的equals(Object)方法。

## Set实现类

### HashSet

|集合关注点|结论|
|---|---|
|HashSet是否允许空|允许|
|HashSet是否允许重复数据|不允许|
|HashSet是否有序|无序|
|HashSet是否线程安全|非线程安全|

HashSet时Set接口的典型实现，HashSet使用HASH算法来存储集合中的元素，因此具有良好的存取和查找性能。HashSet的底层实现其实是一个HashMap，该HashMap存储的键是元素对象，值则是HashSet中定义的PRESENT变量（Object对象）。使用add(E)方法向HashSet中添加重复的元素时，会返回false。contains方法用于判断HashSet中是否存在某个元素，实际上是使用元素对象的equals方法进行判断。HashSet的源码如下：

```Java
private transient HashMap<E,Object> map;

// Dummy value to associate with an Object in the backing Map
private static final Object PRESENT = new Object();

public boolean add(E e) {
    return map.put(e, PRESENT)==null;
}

public boolean contains(Object o) {
    return map.containsKey(o);
}
```

### LinkedHashSet

|集合关注点|结论|
|---|---|
|LinkedHashSet是否允许空|允许|
|LinkedHashSet是否允许重复数据|不允许|
|LinkedHashSet是否有序|有序|
|LinkedHashSet是否线程安全|非线程安全|

LinkedHashSet集合也是根据元素的hashCode值来决定元素的存储位置，但和HashSet不同的是，它同时使用链表维护元素的次序，这样使的元素看起来是以插入的顺序保存的。

当遍历LinkdedHashSet集合里的元素时，LinkedHashSet将会按元素的添加顺序来访问集合里的元素。

LinkedHashSet需要维护元素的插入顺序，因此性能略低于HashSet的性能，但在迭代访问Set里的全部元素时（遍历）将有很好的性能（链表很适合进行遍历）。

LinkedHashSet底层实现是一个LinkedHashMap，通过LinkedHashMap，LinkedHashSet实现了元素的有序。

```Java
public LinkedHashSet(int initialCapacity, float loadFactor) {
    super(initialCapacity, loadFactor, true);
}

HashSet(int initialCapacity, float loadFactor, boolean dummy) {
    map = new LinkedHashMap<>(initialCapacity, loadFactor);
}
```

### TreeSet

TreeSet是SortedSet接口的实现类，TreeSet可以确保集合元素处于排序状态。

SortedSet接口主要用于排序操作。

### EnumSet

EnumSet是一个专门为枚举类设计的集合类，EnumSet中所有元素都必须是指定枚举类型的枚举值，该枚举类型在创建EnumSet时显式或隐式地指定。EnumSet地集合元素也是有序的，它们以枚举值在Enum类中的定义顺序来决定集合元素的顺序。