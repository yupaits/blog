---
title: Java运算符instanceof的用法
date: 2020-02-04 19:21:28
category: Java
tags:
  - Java
---

Java 中的 instanceof 运算符用来在运行时指出对象是否是特定类的一个实例。本文简要介绍下 instanceof 运算符的用法和注意事项。

<!--more-->

## 基本用法

```java
result = object instanceof class
```

参数：

result - boolean 类型

object - 必选项，任意对象实例

class - 任意已定义的对象类

说明：

如果 object 是 class 的一个实例，则 instanceof 运算符返回 true，反之若 object 不是指定 class 的一个实例或 object 为 null，则返回 false。

例子：

以下示例展示了实现、继承关系的类实例使用 instanceof 运算符的结果。

```java
interface A {
    
}

class B implements A {
    
}

class C extends B {
    
}
```

```java
A a = null;
B b = null;
System.out.println("null instanceof A:" + (a instanceof A));
System.out.println("null instanceof B:" + (b instanceof A));

a = new B();
b = new B();
System.out.println("a instanceof A:" + (a instanceof A));
System.out.println("a instanceof B:" + (a instanceof B));
System.out.println("b instanceof A:" + (b instanceof A));
System.out.println("b instanceof B:" + (b instanceof B));

B b2 = (C) new C();
System.out.println("b2 instantceof A:" + (b2 instanceof A));
System.out.println("b2 instantceof B:" + (b2 instanceof B));
System.out.println("b2 instantceof C:" + (b2 instanceof C));
```
结果：

```
null instanceof A:false
null instanceof B:false
a instanceof A:true
a instanceof B:true
b instanceof A:true
b instanceof B:true
b2 instantceof A:true
b2 instantceof B:true
b2 instantceof C:true
```

## 特别说明

1. null instanceof 任何类结果均为 false
1. 对象类不包含 int、double 等基本类型
1. 大多数情况下 instanceof 并不是推荐的做法，更推荐利用多态及方法重载