# Java流式API

Java8中新增了Stream接口定义了支持顺序和并行操作元素序列操作的一系列标准方法。

为了执行计算，流操作被组合成一个流管道。 流管道由源（可能是数组、集合、生成器函数、I/O 通道等）、零个或多个中间操作（将流转换为另一个流，例如`filter(Predicate) `) 和终端操作（产生结果或副作用，例如`count()`或`forEach(Consumer)` ）。 流是懒惰的； 对源数据的计算仅在终端操作启动时进行，源元素仅在需要时消费。

集合和流虽然有一些表面上的相似之处，但有不同的目标。 集合主要涉及对其元素的有效管理和访问。 相比之下，流不提供直接访问或操作其元素的方法，而是关注声明性地描述它们的源以及将在该源上聚合执行的计算操作。 但是，如果提供的流操作没有提供所需的功能，则可以使用`iterator()`和`spliterator()`操作来执行受控遍历。

流管道，可以看作是对流源的查询。 除非源明确设计用于并发修改（例如`ConcurrentHashMap` ），否则在查询流源时修改流源可能会导致不可预测或错误的行为。

大多数流操作都接受描述用户指定行为的参数，例如上面示例中传递给mapToInt的 lambda 表达式`w -> w.getWeight() `。 为了保持正确的行为，这些行为参数：
- 必须是无干扰的（它们不修改流源）；
- 在大多数情况下必须是无状态的（它们的结果不应依赖于在流管道执行期间可能发生变化的任何状态）。
- 此类参数始终是函数式接口（例如`Function`实例），并且通常是 lambda 表达式或方法引用。 除非另有说明，否则这些参数必须为非 null 。

一个流应该只被操作一次（调用一个中间或终端流操作）。 例如，这排除了“分叉”流，其中相同的源提供两个或多个管道，或者同一流的多次遍历。 如果流实现检测到流正在被重用，它可能会抛出`IllegalStateException` 。 但是，由于某些流操作可能会返回其接收器而不是新的流对象，因此可能无法在所有情况下检测到重用。

流具有`close()`方法并实现`AutoCloseable` ，但几乎所有流实例实际上都不需要在使用后关闭。 通常，只有源是 IO 通道的流（例如`Files.lines(Path, Charset)`返回的`Files.lines(Path, Charset)` ）才需要关闭。 大多数流由集合、数组或生成函数支持，不需要特殊的资源管理。 （如果流确实需要关闭，则可以在try -with-resources 语句中将其声明为资源。）

流管道可以顺序或并行执行。 这种执行模式是流的一个属性。 流是通过初始选择顺序或并行执行来创建的。 （例如， `Collection.stream()`创建一个顺序流， `Collection.parallelStream()`创建一个并行流。）这种执行模式的选择可以通过`sequential()`或`parallel()`方法修改，并且可以用`isParallel()`方法。

# Stream 接口
Stream接口中的方法按操作类型可分为两种：中间操作、终端操作。同时包含了创建Stream的一些静态方法。

## 中间操作
### filter

| filter | `Stream<T> filter(Predicate<? super T> predicate);`                        |
|--------|----------------------------------------------------------------------------|
| 说明   | 返回由与给定谓词匹配的此流的元素组成的流。                                  |
| 参数   | • `predicate` 一个无干扰的、无状态的谓词，应用于每个元素以确定是否应该包括它 |

### map

| map      | `<R> Stream<R> map(Function<? super T, ? extends R> mapper);` |
|----------|---------------------------------------------------------------|
| 说明     | 返回一个流，该流由将给定函数应用于此流的元素的结果组成。        |
| 参数     | • `mapper` 一个无干扰的、无状态的函数，适用于每个元素           |
| 类型参数 | • `R` 新流的元素类型                                          |

### mapToInt

| mapToInt | `IntStream mapToInt(ToIntFunction<? super T> mapper);`   |
|----------|----------------------------------------------------------|
| 说明     | 返回一个IntStream它包含将给定函数应用于此流的元素的结果。 |
| 参数     | • `mapper` 一个无干扰的、无状态的函数，适用于每个元素      |

### mapToLong

| mapToLong | `LongStream mapToLong(ToLongFunction<? super T> mapper);`   |
|-----------|-------------------------------------------------------------|
| 说明      | 返回一个LongStream其中包含将给定函数应用于此流的元素的结果。 |
| 参数      | • `mapper` 一个无干扰的、无状态的函数，适用于每个元素         |

### mapToDouble

| mapToDouble | `DoubleStream mapToDouble(ToDoubleFunction<? super T> mapper);` |
|-------------|-----------------------------------------------------------------|
| 说明        | 返回一个DoubleStream其中包含将给定函数应用于此流的元素的结果。   |
| 参数        | • `mapper` 一个无干扰的、无状态的函数，适用于每个元素             |

### flatMap

| flatMap  | `<R> Stream<R> flatMap(Function<? super T, ? extends Stream<? extends R>> mapper);`                                                                                       |
|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 说明     | 返回一个流，该流由通过将提供的映射函数应用于每个元素而生成的映射流的内容替换此流的每个元素的结果组成。每个映射流在其内容放入此流后closed。（如果映射流为null，则使用空流代替。） |
| 参数     | • `mapper` 一个无干扰的、无状态的函数，应用于产生新值流的每个元素                                                                                                           |
| 类型参数 | • `R` 新流的元素类型                                                                                                                                                      |

- 注意事项：flatMap操作的作用是对流的元素应用一对多转换，然后将结果元素展平为新的流。 示例： 如果orders是一个采购订单流，并且每个采购订单都包含一个行项目的集合，那么以下生成一个包含所有订单中所有行项目的流：

    ```java
    orders.flatMap(order -> order.getLineItems().stream())...
    ```

    如果path是文件的路径，则以下内容会生成该文件中包含的words流：

    ```java
    Stream lines = Files.lines(path, StandardCharsets.UTF_8);
    Stream words = lines.flatMap(line -> Stream.of(line.split(" +")));
    ```

    传递给flatMap的mapper函数使用简单的正则表达式将一行拆分为一个单词数组，然后从该数组创建一个单词流。

### flatMapToInt

| flatMapToInt | `IntStream flatMapToInt(Function<? super T, ? extends IntStream> mapper);`                                                                                                      |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 说明         | 返回一个IntStream其中包含用通过将提供的映射函数应用于每个元素而生成的映射流的内容替换此流的每个元素的结果。每个映射流在其内容放入此流后closed。（如果映射流为null，则使用空流代替。） |
| 参数         | • `mapper` 一个无干扰的、无状态的函数，应用于产生新值流的每个元素                                                                                                                 |

### flatMapToLong

| flatMapToLong | `LongStream flatMapToLong(Function<? super T, ? extends LongStream> mapper);`                                                                                                    |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 说明          | 返回一个LongStream其中包含用通过将提供的映射函数应用于每个元素而生成的映射流的内容替换此流的每个元素的结果。每个映射流在其内容放入此流后closed。（如果映射流为null，则使用空流代替。） |
| 参数          | • `mapper` 一个无干扰的、无状态的函数，应用于产生新值流的每个元素                                                                                                                  |

### flatMapToDouble

| flatMapToDouble | `DoubleStream flatMapToDouble(Function<? super T, ? extends DoubleStream> mapper);`                                                                                                |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 说明            | 返回一个DoubleStream其中包含用通过将提供的映射函数应用于每个元素而生成的映射流的内容替换此流的每个元素的结果。每个映射流在其内容放入此流后closed。（如果映射流为null，则使用空流代替。） |
| 参数            | • `mapper` 一个无干扰的、无状态的函数，应用于产生新值流的每个元素                                                                                                                    |

### distinct

| distinct | `Stream<T> distinct();`                                                                                                                                           |
|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 说明     | 返回由该流的不同元素（根据`Object.equals(Object)`）组成的流。对于有序流，不同元素的选择是稳定的（对于重复元素，保留遇到顺序中最先出现的元素。）对于无序流，没有稳定性保证。 |
| 状态     | 有状态                                                                                                                                                            |

- 注意事项：在并行管道中为`distinct()`保持稳定性相对昂贵（要求操作充当完全屏障，具有大量缓冲开销），并且通常不需要稳定性。如果您的情况的语义允许，使用无序流源（例如`generate(Supplier)` ）或使用`unordered()`删除排序约束可能会显着提高并行管道中`distinct()`执行效率。 如果需要与遭遇顺序保持一致，并且您在并行管道中使用`distinct()`遇到性能或内存利用率低的问题，则切换到使用`sequential()`顺序执行可能会提高性能。

### sorted

| sorted | `Stream<T> sorted();`                                                                                                                                                            |
|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 说明   | 返回由该流的元素组成的流，按自然顺序排序。如果此流的元素不是Comparable，则在执行终端操作时可能会抛出java.lang.ClassCastException。对于有序流，排序是稳定的。对于无序流，没有稳定性保证。 |
| 状态   | 有状态                                                                                                                                                                           |

| sorted | `Stream<T> sorted(Comparator<? super T> comparator);`                                                    |
|--------|----------------------------------------------------------------------------------------------------------|
| 说明   | 返回由该流的元素组成的流，根据提供的Comparator进行排序。对于有序流，排序是稳定的。对于无序流，没有稳定性保证。 |
| 参数   | • `comparator` 一个无干扰的、无状态的Comparator，用于比较流元素                                            |
| 状态   | 有状态                                                                                                   |

### peek

| peek | `Stream<T> peek(Consumer<? super T> action);`                                                                                                                                                         |
|------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 说明 | 返回一个由该流的元素组成的流，另外在每个元素上执行提供的操作，因为元素从结果流中被消耗。对于并行流管道，可以在上游操作使元素可用的任何时间和线程中调用该操作。如果操作修改共享状态，则它负责提供所需的同步。 |
| 参数 | • `action` 在元素从流中消耗时对元素执行的非干扰操作                                                                                                                                                   |

- 注意事项：此方法的存在主要是为了支持调试，您希望在其中查看元素流经管道中的某个点时的情况：

  ```java
  Stream.of("one", "two", "three", "four")
    .filter(e -> e.length() > 3)
    .peek(e -> System.out.println("Filtered value: " + e))
    .map(String::toUpperCase)
      .peek(e -> System.out.println("Mapped value: " + e))
    .collect(Collectors.toList());
  ```

### limit

| limit | `Stream<T> limit(long maxSize);`                      |
|-------|-------------------------------------------------------|
| 说明  | 返回由该流的元素组成的流，其长度被截断为不超过maxSize。 |
| 参数  | • `maxSize` 流应该限制的元素数量                      |
| 状态  | 短路状态                                              |
| 抛出  | • `IllegalArgumentException` 如果maxSize为负          |

- 注意事项：虽然`limit()`在顺序流管道上通常是一个廉价的操作，但它在有序并行管道上可能非常昂贵，特别是对于maxSize大值，因为`limit(n)`被限制为不仅返回任何n个元素，而是第一个n遇到顺序中的元素。如果您的情况的语义允许，使用无序流源（例如`generate(Supplier)`）或使用`unordered()`删除排序约束可能会导致并行管道中的`limit()`显着加速。如果需要与遭遇顺序保持一致，并且您在并行管道中使用`limit()`遇到性能或内存利用率不佳的情况，则切换到使用`sequential()`顺序执行可能会提高性能。

### skip

| skip | `Stream<T> skip(long n);`                                                              |
|------|----------------------------------------------------------------------------------------|
| 说明 | 丢弃流的前n元素后，返回由该流的其余元素组成的流。如果此流包含少于n元素，则将返回一个空流。 |
| 参数 | • `n` 要跳过的前导元素的数量                                                           |
| 状态 | 有状态                                                                                 |

- 注意事项：虽然`skip()`在顺序流管道上通常是一种廉价的操作，但它在有序并行管道上可能非常昂贵，尤其是对于n大值，因为`skip(n)`被限制为不仅跳过任何n个元素，而且跳过前n个元素遇到顺序中的元素。如果您的情况的语义允许，使用无序流源（例如`generate(Supplier) `）或使用`unordered()`删除排序约束可能会导致并行管道中的`skip()`显着加速。如果需要与遭遇顺序保持一致，并且您在并行管道中使用`skip()`遇到性能或内存利用率不佳的情况，则切换到使用`sequential()`顺序执行可能会提高性能。

## 终端操作
### forEach

| forEach | `void forEach(Consumer<? super T> action);`                                                                                                                                                                                             |
|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 说明    | 对此流的每个元素执行一个操作。此操作的行为明显是不确定的。对于并行流管道，此操作并不保证尊重流的相遇顺序，因为这样做会牺牲并行的利益。对于任何给定的元素，可以在库选择的任何时间和线程中执行该操作。如果动作访问共享状态，它负责提供所需的同步。 |
| 参数    | • `action` 对元素执行的非干扰操作                                                                                                                                                                                                       |

### forEachOrdered

| forEachOrdered | `void forEachOrdered(Consumer<? super T> action);`                                                                                                                                                                       |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 说明           | 如果流具有定义的遇到顺序，则按流的遇到顺序对此流的每个元素执行操作。此操作一次处理一个元素，如果存在，则按遇到顺序处理。对一个元素执行操作发生在对后续元素执行操作之前，但对于任何给定元素，该操作可以在库选择的任何线程中执行。 |
| 参数           | • `action` 对元素执行的非干扰操作                                                                                                                                                                                        |

### toArray

| toArray | `Object[] toArray();`       |
|---------|-----------------------------|
| 说明    | 返回一个包含此流元素的数组。 |
| 返回    | 包含此流元素的数组          |

---

| toArray  | `<A> A[] toArray(IntFunction<A[]> generator);`                                                                 |
|----------|----------------------------------------------------------------------------------------------------------------|
| 说明     | 返回一个包含此流元素的数组，使用提供的generator函数分配返回的数组，以及分区执行或调整大小可能需要的任何其他数组。 |
| 参数     | • `generator` 一个函数，它产生一个所需类型和提供的长度的新数组                                                  |
| 类型参数 | • `A` 结果数组的元素类型                                                                                       |
| 返回     | 包含此流中元素的数组                                                                                           |
| 抛出     | • `ArrayStoreException` 如果从数组生成器返回的数组的运行时类型不是此流中每个元素的运行时类型的超类型           |

- API注意事项：生成器函数接受一个整数，它是所需数组的大小，并生成一个所需大小的数组。这可以用数组构造函数引用简洁地表达：

    ```java
    Person[] men = people.stream()
        .filter(p -> p.getGender() == MALE)
        .toArray(Person[]::new);
    ```

### reduce

| reduce | `T reduce(T identity, BinaryOperator accumulator);`                                                                                                                                                                                 |
|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 说明   | 使用提供的标识值和关联累加函数对该流的元素执行归约，并返回归约后的值，但不限于顺序执行。这相当于：**reduce#1**<br>identity值必须是累加器函数的标识。这意味着对于所有t，accumulator.apply(identity, t)等于t。accumulator函数必须是关联函数。 |
| 参数   | • `identity` 累积函数的身份值 <br>• `accumulator` 一个关联的、无干扰的、无状态的函数，用于组合两个值                                                                                                                                   |
| 返回   | 减少的结果                                                                                                                                                                                                                          |

::: code-group
```java [reduce#1]
T result = identity;
for (T element : this stream)
    result = accumulator.apply(result, element);
return result;
```
:::

- 注意事项：`sum`、`min`、`max`、`average`和`string`连接都是归约的特殊情况。对一串数字求和可以表示为：

    ```java
    Integer sum = integers.reduce(0, (a, b) -> a+b);
    ```
      或者：
    ```java
    Integer sum = integers.reduce(0, Integer::sum);
    ```

    虽然与简单地改变循环中的运行总数相比，这似乎是一种更迂回的执行聚合方式，但归约操作可以更优雅地并行化，无需额外的同步，并且大大降低了数据竞争的风险。

---

| reduce | `Optional<T> reduce(BinaryOperator<T> accumulator);`                                                                                             |
|--------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| 说明   | 使用关联累积函数对此流的元素执行缩减，并返回描述缩减值的Optional（如果有），但不限于顺序执行。这相当于：**reduce#2**<br>accumulator函数必须是关联函数。 |
| 参数   | • `accumulator` 一个关联的、无干扰的、无状态的函数，用于组合两个值                                                                                  |
| 返回   | 一个Optional描述减少的结果                                                                                                                       |
| 抛出   | • `NullPointerException` 如果归约结果为空                                                                                                        |

::: code-group
```java [reduce#2]
boolean foundAny = false;
T result = null;
for (T element : this stream) {
    if (!foundAny) {
        foundAny = true;
        result = element;
    }
    else
        result = accumulator.apply(result, element);
}
return foundAny ? Optional.of(result) : Optional.empty();
```
:::

---

| reduce   | `<U> reduce(U identity, BiFunction<U, ? super T, U> accumulator, BinaryOperator<U> combiner);`                                                                                                                                                                                                                                    |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 说明     | 使用提供的标识、累加和组合函数对该流的元素执行归约，但不限于顺序执行。这相当于：**reduce#3**<br>identity值必须是组合器功能的标识。这意味着对于所有u，combiner(identity, u)等于u。此外，combiner功能必须与accumulator功能兼容；对于所有u和t，以下必须成立：<br>`combiner.apply(u, accumulator.apply(identity, t)) == accumulator.apply(u, t)` |
| 参数     | • `identity` 组合器功能的身份值 <br>• `accumulator` 一种关联的、无干扰的、无状态的函数，用于将附加元素合并到结果中 <br>• `combiner` 一个关联的、无干扰的、无状态的函数，用于组合两个值，它必须与累加器函数兼容                                                                                                                           |
| 类型参数 | • `U` 结果的类型                                                                                                                                                                                                                                                                                                                  |
| 返回     | 减少的结果                                                                                                                                                                                                                                                                                                                        |

::: code-group
```java [reduce#3]
U result = identity;
for (T element : this stream)
    result = accumulator.apply(result, element)
        return result;
```
:::

- 注意事项：许多使用这种形式的归约可以通过map和reduce操作的显式组合更简单地表示。accumulator函数充当融合的映射器和累加器，有时比单独的映射和归约更有效，例如当知道先前减少的值可以避免某些计算时。

### collect

| collect  | `<R> R collect(Supplier supplier, BiConsumer<R, ? super T> accumulator, BiConsumer<R, R> combiner);`                                                                                                                                                                        |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 说明     | 对此流的元素执行可变的归约操作。 可变归约是其中归约值是可变结果容器（例如ArrayList ，并且通过更新结果的状态而不是替换结果来合并元素。 这产生的结果相当于：**collect#1**<br>与reduce(Object, BinaryOperator)相比，collect操作可以并行化而无需额外的同步。                           |
| 参数     | • `supplier` 个创建新结果容器的函数。对于并行执行，此函数可能会被多次调用，并且每次都必须返回一个新值。 <br>• `accumulator` 一种关联的、无干扰的、无状态的函数，用于将附加元素合并到结果中 <br>• `combiner` 一个关联的、无干扰的、无状态的函数，用于组合两个值，它必须与累加器函数兼容 |
| 类型参数 | • `R` 结果的类型                                                                                                                                                                                                                                                            |
| 返回     | 减少的结果                                                                                                                                                                                                                                                                  |

::: code-group
```java [collect#1]
R result = supplier.get();
for (T element : this stream)
    accumulator.accept(result, element);
return result;
```
:::

- 注意事项：JDK中有许多现有类，它们的签名非常适合与方法引用一起用作`collect()`参数。例如，以下将把字符串累积到一个ArrayList：

    ```java
    List<String> asList = stringStream.collect(ArrayList::new, ArrayList::add,
                                              ArrayList::addAll);
    ```
    以下将采用字符串流并将它们连接成一个字符串：
    ```java
    String concat = stringStream.collect(StringBuilder::new, StringBuilder::append,
                                        StringBuilder::append)
        .toString();
    ```

---

| collect  | `<R, A> R collect(Collector<? super T, A, R> collector);`                                                                                                                                                                                                                                                                                                                                                                                                                          |
|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 说明     | 使用Collector对此流的元素执行可变归约操作。Collector封装了用作collect(Supplier, BiConsumer, BiConsumer)参数的函数，允许重用收集策略和组合收集操作，例如多级分组或分区。<br>如果流是并行的，并且Collector是concurrent，并且流是无序的或收集器是unordered，那么将执行并发减少（有关并发减少的详细信息，请参阅Collector 。）<br>当并行执行时，可以实例化、填充和合并多个中间结果，以保持可变数据结构的隔离。因此，即使与非线程安全的数据结构（例如ArrayList）并行执行，也不需要额外的同步来进行并行缩减。 |
| 参数     | • `collector` 描述减少的Collector                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 类型参数 | • `R` 结果的类型 <br>• `A` Collector的中间累积类型                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 返回     | 减少的结果                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

-  注意事项：以下将把字符串累积到一个ArrayList中：

    ```java
    List<String> asList = stringStream.collect(Collectors.toList());
    ```

 	  以下将按城市对Person对象进行分类：

    ```java
    Map<String, List> peopleByCity
        = personStream.collect(Collectors.groupingBy(Person::getCity));
    ```

    下面将按州和城市对Person对象进行分类，将两个Collector级联在一起：

    ```java
    Map<String, Map<String, List>> peopleByStateAndCity
        = personStream.collect(Collectors.groupingBy(Person::getState,
                                                    Collectors.groupingBy(Person::getCity)));
    ```
    
### min

| min  | `Optional<T> min(Comparator<? super T> comparator);`             |
|------|------------------------------------------------------------------|
| 说明 | 根据提供的Comparator返回此流的最小元素。这是一个reduction的特例。  |
| 参数 | • `comparator` 一个无干扰的、无状态的Comparator来比较这个流的元素 |
| 返回 | 一个Optional描述此流的最小元素，或空Optional如果流是空            |
| 抛出 | • `NullPointerException` 如果最小元素为空                        |

### max

| max  | `Optional<T> max(Comparator<? super T> comparator);`             |
|------|------------------------------------------------------------------|
| 说明 | 根据提供的Comparator返回此流的最大元素。这是一个reduction的特例。  |
| 参数 | • `comparator` 一个无干扰的、无状态的Comparator来比较这个流的元素 |
| 返回 | 一个Optional描述此流的最大元素，或空Optional如果流是空            |
| 抛出 | • `NullPointerException` 如果最大元素为空                        |

### count

| count | `long count();`                                                                        |
|-------|----------------------------------------------------------------------------------------|
| 说明  | 返回此流中元素的计数。 这是归约的一个特例，相当于：<br>`return mapToLong(e -> 1L).sum();` |
| 返回  | 此流中的元素计数                                                                       |

### anyMatch

| anyMatch | `boolean anyMatch(Predicate<? super T> predicate);`                                                                              |
|----------|----------------------------------------------------------------------------------------------------------------------------------|
| 说明     | 返回此流的任何元素是否与提供的谓词匹配。如果不是确定结果所必需的，则可以不对所有元素评估谓词。如果流为空，则返回false并且不评估谓词。 |
| 参数     | • `predicate` 一个无干扰的、无状态的谓词，适用于这个流的元素                                                                       |
| 返回     | 如果流的任何元素与提供的谓词匹配，则为true，否则为false                                                                            |
| 操作类型 | 短路操作                                                                                                                         |

- 注意事项：此方法评估流元素上谓词的存在量化（对于某些 x P(x)）。

### allMatch

| allMatch | `boolean allMatch(Predicate<? super T> predicate);`                                                                             |
|----------|---------------------------------------------------------------------------------------------------------------------------------|
| 说明     | 返回此流的所有元素是否与提供的谓词匹配。如果不是确定结果所必需的，则可以不对所有元素评估谓词。如果流为空，则返回true并且不评估谓词。 |
| 参数     | • `predicate` 一个无干扰的、无状态的谓词，适用于这个流的元素                                                                      |
| 返回     | 如果任一该流中的所有元素匹配提供谓词或流是空的，则为true，否则false                                                               |
| 操作类型 | 短路操作                                                                                                                        |

- 注意事项：此方法评估流元素上谓词的通用量化（对于所有 x P(x)）。如果流为空，则称量化为空满足且始终为true（无论 P(x) 是多少）。

### noneMatch

| noneMatch | `boolean noneMatch(Predicate<? super T> predicate);`                                                                        |
|-----------|-----------------------------------------------------------------------------------------------------------------------------|
| 说明      | 返回此流的元素是否与提供的谓词匹配。如果不是确定结果所必需的，则可以不对所有元素评估谓词。如果流为空，则返回true并且不评估谓词。 |
| 参数      | • `predicate` 一个无干扰的、无状态的谓词，适用于这个流的元素                                                                  |
| 返回      | 如果要么没有流的元件匹配提供谓词或流是空的，则为true，否则false                                                               |
| 操作类型  | 短路操作                                                                                                                    |

- 注意事项：此方法评估对流元素（对于所有 x ~P(x)）的否定谓词的通用量化。如果流为空，则称量化为空满足且始终为true，无论 P(x) 如何。

### findFirst

| findFirst | `Optional<T> findFirst();`                                                                           |
|-----------|------------------------------------------------------------------------------------------------------|
| 说明      | 返回一个Optional描述本流的第一个元素，或空Optional如果流是空的。如果流没有遇到顺序，则可以返回任何元素。 |
| 返回      | 一个Optional描述此流的第一个元素，或空Optional如果流是空                                              |
| 操作类型  | 短路操作                                                                                             |
| 抛出      | • `NullPointerException` 如果所选元素为空                                                            |

### findAny

| findAny  | `Optional<T> findAny();`                                                                                                                                                                                                                      |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 说明     | 返回一个Optional描述流的一些元件，或一个空Optional如果流是空的。此操作的行为明显是不确定的； 可以自由选择流中的任何元素。这是为了在并行操作中实现最大性能；代价是对同一源的多次调用可能不会返回相同的结果。（如果需要稳定的结果，请改用findFirst() 。） |
| 返回     | 一个Optional描述本流的一些元件，或一个空Optional如果流是空                                                                                                                                                                                     |
| 操作类型 | 短路操作                                                                                                                                                                                                                                      |
| 抛出     | • `NullPointerException` 如果所选元素为空                                                                                                                                                                                                     |

## 创建Stream的静态方法
### builder

```java
public static Builder builder() {
    return new Streams.StreamBuilderImpl<>();
}
```

| 说明     | 返回Stream的构建器。 |
|--------|-----------------|
| 类型参数 | • `T` 元素类型      |
| 返回     | 流构建器            |

### empty

```java
public static Stream empty() {
    return StreamSupport.stream(Spliterators.emptySpliterator(), false);
}
```

| 说明     | 返回一个空的顺序Stream。 |
|--------|--------------------|
| 类型参数 | • `T` 流元素的类型      |
| 返回     | 空的顺序流              |

### of

```java
public static Stream of(T t) {
    return StreamSupport.stream(new Streams.StreamBuilderImpl<>(t), false);
}
```

| 说明     | 返回包含单个元素的顺序Stream。 |
|--------|---------------------------|
| 参数     | • `t` 单个元素                |
| 类型参数 | • `T` 流元素的类型            |
| 返回     | 单例顺序流                    |

---

```java
@SafeVarargs  
@SuppressWarnings("varargs") // Creating a stream from an array is safe
public static Stream of(T... values) {
    return Arrays.stream(values);
}
```

| 说明     | 返回一个顺序有序的流，其元素是指定的值。 |
|--------|--------------------------------------|
| 参数     | • `values` 新流的元素                  |
| 类型参数 | • `T` 流元素的类型                     |
| 返回     | 新流                                   |

### iterate

```java
public static Stream iterate(final T seed, final UnaryOperator f) {
    Objects.requireNonNull(f);
    final Iterator iterator = new Iterator() {
        @SuppressWarnings("unchecked")
        T t = (T) Streams.NONE;
        @Override
        public boolean hasNext() {
            return true;
        }

        @Override
        public T next() {
            return t = (t == Streams.NONE) ? seed : f.apply(t);
        }
    };
    return StreamSupport.stream(Spliterators.spliteratorUnknownSize(
        iterator,
        Spliterator.ORDERED | Spliterator.IMMUTABLE), false);
}
```

| 说明     | 返回通过将函数f迭代应用到初始元素seed产生的无限顺序有序Stream，产生由seed、f(seed)、f(f(seed))等组成的Stream。<br>Stream的第一个元素（位置0 ）将是提供的seed。对于n > 0，位置n处的元素将是将函数f应用于位置n - 1处的元素的结果。 |
|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 参数     | • `seed` 初始元素 <br>• `f` 应用于前一个元素以产生新元素的函数                                                                                                                                                          |
| 类型参数 | • `T` 流元素的类型                                                                                                                                                                                                      |
| 返回     | 一个新的顺序Stream                                                                                                                                                                                                      |

### generate

```java
public static Stream generate(Supplier s) {
    Objects.requireNonNull(s);
    return StreamSupport.stream(
      new StreamSpliterators.InfiniteSupplyingSpliterator.OfRef<>(Long.MAX_VALUE, s), false);
}
```

| 说明     | 返回一个无限连续的无序流，其中每个元素都由提供的Supplier生成。这适用于生成恒定流、随机元素流等。 |
|--------|-----------------------------------------------------------------------------------------|
| 参数     | • `s` 生成元素的Supplier                                                                     |
| 类型参数 | • `T` 流元素的类型                                                                           |
| 返回     | 一个新的无限顺序无序Stream                                                                   |

### concat

```java
public static  Stream concat(Stream<? extends T> a, Stream<? extends T> b) {
    Objects.requireNonNull(a);
    Objects.requireNonNull(b);
    @SuppressWarnings("unchecked")
    Spliterator<T> split = new Streams.ConcatSpliterator.OfRef<>(
            (Spliterator<T>) a.spliterator(), (Spliterator<T>) b.spliterator());
    Stream<T> stream = StreamSupport.stream(split, a.isParallel() || b.isParallel());
    return stream.onClose(Streams.composedClose(a, b));
}
```

| 说明     | 创建一个延迟连接的流，其元素是第一个流的所有元素，后跟第二个流的所有元素。如果两个输入流都是有序的，则结果流是有序的，如果任一输入流是并行的，则结果流是并行的。当结果流关闭时，将调用两个输入流的关闭处理程序。 |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 参数     | • `a` 第一个流 <br>• `b` 第二个流                                                                                                                                                                       |
| 类型参数 | • `T` 流元素的类型                                                                                                                                                                                      |
| 返回     | 两个输入流的串联                                                                                                                                                                                        |

- 实施注意事项：从重复串联构造流时要小心。访问深度级联流的元素可能会导致深度调用链，甚至`StackOverflowException`。
