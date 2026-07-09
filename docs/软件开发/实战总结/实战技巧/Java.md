1. `RandomUtils.nextInt()`生成随机整数，`RandomStringUtils`生成随机字符串。

2. 实现随机抽取集合里面的部分元素`Collections.shuffle(list)`将 list 元素循序打乱`list.subList(0, loreResource.getQuesNum()); // subList(fromIndex, toIndex)的实际范围是[fromIndex, toIndex)`获取指定数量的元素。

3. `ListUtils.select()`方法，类似于 JQuery 数组的 filter 方法。

4. `System.out.println(Arrays.toString(someList.toArray()));`方法可以方便地打印List内容。

5. `Arrays.asList(T... a)`无法将基本类型转换为 List，原因是`asList()`方法接收的是泛型的可变长参数，而基本类型（如int，char等）是无法泛型化的。使用`asList()`对基本数据类型进行操作时需要使用基本数据类型的包装类。`asList()`返回的 ArrayList 类型是`Arrays`的一个内部类，没有实现`add()`、`remove()`等用于操作 ArrayList 的方法，当我们需要对`asList()`返回的列表进行常用操作时需要对其进行转换，`List list = new ArrayList(Arrays.asList(testArray));`。

6. Java类启动顺序，`static`静态代码先于构造方法。

7. ThreadLocal变量一般使用`static`修饰。使用时，为了避免内存泄漏，在当前线程执行完之后需要调用`ThreadLocal.remove()`方法清除线程关联对象。

8. 在Java程序中可以通过添加关闭钩子，实现在程序退出时关闭资源、平滑退出的功能。使用`Runtime.addShutdownHoot(Thread hook)`方法，可以注册一个JVM关闭的钩子，这个钩子可以在以下几种场景被调用：
    1. 程序正常退出
    2. 使用`System.exit()`
    3. 终端使用Ctrl+C触发的中断
    4. 系统关闭
    5. 使用`kill pid`命令干掉进程

9. 多个字段同时存在升序、降序排序的实现：
    ```java
    list.stream().sorted(Comparator.comparing(Example::getField1)
        .thenComparing(Example::getField2)
        .thenComparing(Example::getField3, Comparator.reverseOrder())
        .thenComparing(Example::getField4))
        .collect(Collectors.toList());
    ```
    上述代码实现了一个元素类型为Example的列表按“Field1升序、Field2升序、Field3降序、Field4升序”进行排序。

10. Java泛型命名规范：
    - `T`：`Type`（Java类）通用泛型类型，通常作为第一个泛型类型
    - `S`：通用泛型类型，如果需要使用多个泛型类型，可以将S作为第二个泛型类型
    - `U`：通用泛型类型，如果需要使用多个泛型类型，可以将U作为第三个泛型类型
    - `V`：通用泛型类型，如果需要使用多个泛型类型，可以将V作为第四个泛型类型
    - `E`：集合元素泛型类型，主要用于定义集合泛型类型
    - `K`：映射-键泛型类型，主要用于定义映射泛型类型
    - `V`：映射-值泛型类型，主要用于定义映射泛型类型
    - `N`：`Number`数值泛型类型，主要用于定义数值类型的泛型类型
    - `?`：表示不确定的`Java`类型
