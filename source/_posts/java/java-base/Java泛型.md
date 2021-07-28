---
title: Java泛型
date: 2020-02-04 09:41:37
category: Java基础
tags: 
  - Java
  - 泛型
---

# Java泛型

> 引用自[java 泛型详解-绝对是对泛型方法讲解最详细的，没有之一](https://blog.csdn.net/s10461/article/details/53941091)

## 概述

**泛型，即"参数化类型"。一提到参数，最熟悉的就是定义方法时有形参，然后调用此方法时传递实参。那么参数化类型怎么理解呢？顾名思义，就是将类型由原来的具体的类型参数化，类似于方法中的变量参数，此时类型也定义成参数形式（可以称之为类型形参），然后在使用/调用时传入具体的类型（类型实参）。**

**泛型的本质是为了参数化类型（在不创建新的类型的情况下，通过泛型指定的不同类型来控制形参具体限制的类型）。** 也就是说在泛型使用过程中，操作的数据类型被指定为一个参数，这种参数类型可以用在类、接口和方法种，分别被称为泛型类、泛型接口、泛型方法。

## 示例

```Java
List list = new ArrayList();
list.add("aaa");
list.add(100);
for (int i = 0; i < list.size(); i++) {
    String item = (String) list.get(i);
    System.out.println(item);
}
```

运行结果：

```
aaa
Exception in thread "main" java.lang.ClassCastException: java.lang.Integer cannot be cast to java.lang.String
```

ArrayList可以存放任意类型，例子中添加了一个String类型，添加了一个Integer类型，在使用时都以String的方式使用，因此程序崩溃了。为了解决类似这样的额问题（在编译阶段就可以解决），泛型应运而生。

## 特性

**泛型只在编译阶段有效。**

```Java
List<String> stringList = new ArrayList<>();
stringList.add("aaa");
stringList.add("bbb");
List<Integer> integerList = new ArrayList<>();
integerList.add(111);
integerList.add(222);
Class stringClass = stringList.getClass();
Class integerClass = integerList.getClass();
if (stringClass.equals(integerClass)) {
    System.out.println("类型相同，类型为：" + stringClass.getName());
}
```

运行结果：

```
类型相同，类型为：java.util.ArrayList
```

通过上面的例子可以证明，在编译之后程序会采取去泛型化的措施。也就是说Java种的泛型只在编译阶段有效。在编译过程中，正确检验泛型结果后，会将泛型的相关信息擦除，并且在对象进入和离开方法的边界处添加类型检查和类型转换的方法。也就是说，泛型信息不会进入到运行时阶段。

总结：**泛型类型在逻辑上可以看成是多个不同的类型，实际上都是相同的基本类型**。

## 泛型的使用

泛型有三种使用方式：泛型类、泛型接口、泛型方法。

### 泛型类

泛型类型用于类的定义中，被称为泛型类。通过泛型可以完成对一组类的操作对外开放相同的接口。最典型的就是各种容器类，如：List、Set、Map。

泛型类的最基本写法：

```Java
public class Generic<T> {
    private T key;

    public Generic(T key) {
        this.key = key;
    }

    public T getKey() {
        return key;
    }
}
```

泛型的类型参数只能是引用类型，不能是基本数据类型。

### 泛型接口

泛型接口与泛型类的定义及使用基本相同。

```Java
// 定义一个泛型接口
public interface Generator<T> {
    public T next();
}
```

当实现泛型接口的类未传入泛型实参时：

```Java
/**
 * 未传入泛型实参时，与泛型类的定义相同，在声明类的时候，需将泛型的声明也一起加到类中
 * 即：class FruitGenerator<T> implements Generator<T>{
 * 如果不声明泛型，如：class FruitGenerator implements Generator<T>，编译器会报错："Unknown class"
 */
public class FruitGenerator<T> implements Generator<T> {
    @Override
    public T next() {
        return null;
    }
}
```

当实现泛型接口的类传入泛型实参时：

```Java
/**
 * 传入泛型实参时：
 * 定义一个生产器实现这个接口,虽然我们只创建了一个泛型接口Generator<T>
 * 但是我们可以为T传入无数个实参，形成无数种类型的Generator接口。
 * 在实现类实现泛型接口时，如已将泛型类型传入实参类型，则所有使用泛型的地方都要替换成传入的实参类型
 * 即：Generator<T>，public T next();中的的T都要替换成传入的String类型。
 */
public class FruitGenerator implements Generator<String> {
    private String[] fruits = {"Apple", "Banana", "Pear"};

    @Override
    public String next() {
        Random rand = new Random();
        return fruits[rand.nextInt(3)];
    }
}
```

### 泛型通配符

类型通配符一般是使用 `?` 代替具体的类型实参，注意 **此处的 `?` 是类型实参，而不是类型形参**。再直白点的意思就是，此处的 `?` 和Number、String、Integer一样都是一种实际的类型，可以把 `?` 看成所有类型的父类。

当具体类型不确定的时候，可以使用类型通配符 `?`；当操作类型时，不需要使用类型的具体方法，只使用Object类中的方法，那么可以使用 `?` 通配符来表示未知类型。

#### 泛型方法

**泛型类，是在实例化类的时候指明泛型的具体类型；泛型方法，是在调用方法的时候指明泛型的具体类型。**

```Java
/**
 * 泛型方法的基本介绍
 * @param tClass 传入的泛型实参
 * @return T 返回值为T类型
 * 说明：
 *     1）public 与 返回值中间<T>非常重要，可以理解为声明此方法为泛型方法。
 *     2）只有声明了<T>的方法才是泛型方法，泛型类中的使用了泛型的成员方法并不是泛型方法。
 *     3）<T>表明该方法将使用泛型类型T，此时才可以在方法中使用泛型类型T。
 *     4）与泛型类的定义一样，此处T可以随便写为任意标识，常见的如T、E、K、V等形式的参数常用于表示泛型。
 */
public <T> T genericMethod(Class<T> tClass)throws InstantiationException ,
  IllegalAccessException{
        T instance = tClass.newInstance();
        return instance;
}
```

在类中的静态方法使用泛型时，静态方法无法访问类上定义的泛型；如果静态方法操作的引用数据类型不确定的时候，必须要将泛型定义在方法上。

简单的说：**如果静态方法要使用泛型的话，必须将静态方法也定义成泛型方法**。

```Java
public class StaticGenerator<T> {
    ....
    ....
    /**
     * 如果在类中定义使用泛型的静态方法，需要添加额外的泛型声明（将这个方法定义成泛型方法）
     * 即使静态方法要使用泛型类中已经声明过的泛型也不可以。
     * 如：public static void show(T t){..},此时编译器会提示错误信息：
          "StaticGenerator cannot be refrenced from static context"
     */
    public static <T> void show(T t){

    }
}
```

### 泛型上下边界

在使用泛型的时候，我们还可以为传入的泛型类型实参进行上下边界的限制，如：类型实参只准传入某种类型的父类或者某种类型的子类。

- 为泛型添加上边界，即传入的类型实参必须是指定类型的子类型。

```Java
public void showKeyValue1(Generic<? extends Number> obj){
    Log.d("泛型测试","key value is " + obj.getKey());
}
```

```Java
public class Generic<T extends Number>{
    private T key;

    public Generic(T key) {
        this.key = key;
    }

    public T getKey(){
        return key;
    }
}
```

```Java
public <T extends Number> T showKeyName(Generic<T> container){
    System.out.println("container key :" + container.getKey());
    T test = container.getKey();
    return test;
}
```

- 为泛型添加下边界，即传入的类型实参必须是指定类型的父类型。

```Java
public void showKeyValue1(Generic<Number extends ?> obj){
    Log.d("泛型测试","key value is " + obj.getKey());
}
```

### 泛型数组

在Java中是 **不能创建一个确切的泛型类型的数组**。

也就是说下面的这个例子是不可以的：

```Java
List<String>[] list = new ArrayList<String>[10];
```

而使用通配符创建泛型数组是可以的，如下面的例子：

```Java
List<?>[] list = new ArrayList<?>[10];
```

这样也是可以的：

```Java
List<String>[] list = new ArrayList[10];
```