---
title: Java的Lambda表达式与函数式接口
date: 2021-12-19 20:04:31
category: Java
tags:
  - Java
  - Lambda表达式
  - 函数式编程
---

## Lambda表达式

Java8开始支持lambda表达式，其结构为：

```Java
(param1, param2, param3...) -> {
    // 执行体
}
```

lambda表达式是函数式接口的具体实现，用于创建一个匿名类对象。

- 什么是匿名类？
  
    Java中可以实现一个类包含另一个类，且不需要提供任何的类名直接实例化。匿名类主要用于创建一个对象执行特定的任务，使代码更加简洁。匿名类是不能有类名的类，不能被引用，只能在创建时用new语句来声明。其语法格式如下：

    ```Java
    class OuterClass {

        // 定义一个匿名类
        Type obj1 = new Type() {
            // 匿名类代码
        }
    }
    ```

## 函数式接口

JDK中常用的基础函数式接口类有以下这些：

|接口类|接口类说明|功能接口方法|接口方法描述|
|---|---|---|---|
|`Supplier<T>`    |代表结果的提供者。<br>没有要求每次调用时都返回一个新的或不同的结果。   |`T get();` |得到结果   |
|`Consumer<T>`    |表示接受单个输入参数且不返回结果的操作。<br>与大多数其他功能接口不同，Consumer预计通过副作用（允许显式修改数据或状态）进行操作。  |`void accept(T t);` |对给定参数执行此操作   |
|`Funtion<T, R>`  |表示接受一个参数并产生结果的函数。 |`R apply(T t);`    |将此函数应用于给定的参数   |
|`Predicate<T>`   |表示一个参数的谓词（布尔值函数）。 |`boolean test(T t);`   |在给定的参数上评估这个谓词   |
|`BiConsumer<T, U>`   |表示接受两个输入参数并且不返回结果的操作。<br>这是Consumer的二元特化。<br>与大多数其他功能接口不同，BiConsumer预计通过副作用运行。 |`void accept(T t, U u);`|对给定的参数执行此操作  |
|`BiFunction<T, U, R>`  |表示接受两个参数并产生结果的函数。<br>这是Function的二元特化。    |`R apply(T t, U u);`   |将此函数应用于给定的参数   |
|`BiPredicate<T, U>`  |表示两个参数的谓词（布尔值函数）。<br>这是Predicate的二元特化。<br>这是一个功能接口，其功能方法是test(Object, Object) 。|`boolean test(T t, U u);`   |在给定的参数上评估这个谓词 |
|`UnaryOperator<T> extends Function<T, T>`    |表示对单个操作数的操作，该操作产生与其操作数相同类型的结果。<br>这是Function适用于操作数和结果类型相同的情况。<br>这是一个功能接口，其功能方法是apply(Object) 。 |`T apply(T t);` |将此函数应用于给定的参数  |
|`BinaryOperator<T> extends BiFunction<T, T, T>`    |表示对相同类型的两个操作数的操作，产生与操作数相同类型的结果。<br>这是BiFunction适用于操作数和结果都是相同类型的情况。<br>这是一个函数式接口，其函数式方法是apply(Object, Object) 。  |`T apply(T t1, T t2);`  |将此函数应用于给定的参数    |
|`Runnable` |表示不接受参数并且不返回结果的函数。该接口旨在为希望在活动时执行代码的对象提供通用协议。   |`void run();`  |当使用实现接口Runnable的对象创建线程时，启动线程会导致在单独执行的线程中调用对象的run方法。<br>方法run的一般约定是它可以采取任何行动。 |
|`Comparator<T>`    |一个比较函数，它对某些对象集合进行总排序。<br>比较器可以传递给排序方法（例如`Collections.sort`或`Arrays.sort`）以允许精确控制排序顺序。<br>比较器还可用于控制某些数据结构的顺序（例如`sorted sets`或`sorted maps`），或为没有`natural ordering`的对象集合提供`natural ordering`。 |`int compare(T o1, T o2);`  |比较它的两个参数的顺序。 当第一个参数小于、等于或大于第二个参数时，返回一个负整数、零或正整数。    |

灵活运用函数式接口，可以使代码的更加简洁可读性更高，这一点在Stream API中的体现尤为明显。日常编码中也可以运用这些基础的函数式接口编写灵活性更高的抽象接口，使得开发效率和代码的容错性得到提升。