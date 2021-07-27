---
title: 装饰模式
date: 2020-02-04 19:21:28
category: 设计模式
tags:
  - 设计模式
  - Design Pattern
---

装饰者模式，在保持原有功能不变的情况下将一个类重新装饰，使其具有更强大的功能，用一句成语形容“锦上添花”。

**类结构：**

![decorator](/images/装饰模式/decorator.png)

Component：抽象组件，定义了一组抽象的接口，制定了被修饰的组件都有哪些功能。

ComponentImpl：抽象组件实现类，完成了基本的功能实现。

Decorator：装饰器角色，持有Component的实例引用，有点递归的感觉。

```Java
Component c = new ComponentImpl();
Decorator d1 = new Decorator();
d1.setComponent(c);
Decorator d2 = new Decorator();
d2.setComponent(d1);
Decorator d3 = new Decorator();
d3.setComponent(d2);
Decorator d4 = new Decorator();
d4.setComponent(d3);
d4.methodA();
```

装饰模式和适配器模式有点类似，都是包装（wrapper）了一个类，但目的却不相同。适配器模式是将一个接口转换成另一个接口，从而达成匹配。而装饰模式并没有改变原来的接口，而是改变原有对象的处理方法，借助递归提升性能。