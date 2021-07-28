---
title: package与jar包
date: 2020-02-04 09:41:37
category: Java基础
tags: 
  - Java
---

# package与jar包

> 引用自[JAVA 包与包之间访问（package）](https://blog.csdn.net/wu_lai_314/article/details/8654461)

## package的用处

Java中的package用处和特点有：

- 对类文件进行分类管理。

- 给类提供多层命名空间。

- 写在程序文件的第一行。

- 类名的全称是：包名.类名

- 包也是一种封装形式。

## package之间的访问

包之间访问时，需要遵循以下规则：

- 包与包之间进行访问，被访问的包中的类以及类中的成员，需要用public修饰。

- 不同包中的子类可以直接访问父类中被protected修饰的成员。

- 包与包之间可以使用的权限只有两种，public和protected。

访问权限具体的对应关系如下表：

|访问类-被访问类的修饰符-能否访问|public|protected|default|private|
|---|:---:|:---:|:---:|:---:|
|同一类中|√|√|√|√|
|同一包中|√|√|√|×|
|子类|√|√|×|×|
|不同包类中|√|×|×|×|

## import导入package

通过import可以简化类名的书写。包名一般使用url，因为url具有唯一性，例如：`package com.qq.demo;`

导包的写法为：`import com.qq.demo.*;`，其中 `*` 是通配符，表示导入 com.qq.demo包下的所有类，开发中推荐使用导入具体类名的写法，需要哪个类就导入哪个类，可以节省内存开销，例如：`import com.qq.demo.ClassA;`

当我们在一个类中导入了两个包，并且这两个包中有相同的类ClassA存在，那么在使用ClassA类的时候必须知名使用哪个包下的ClassA类。例如：

```Java
package1.ClassA a1 = new package1.ClassA();
package2.ClassA a2 = new package2.ClassA();
```

## jar包

jar包是Java的压缩包，主要作用有：1、方便项目的携带；2、方便使用，只要在classpath中设置jar路径即可使用jar中的Java类。