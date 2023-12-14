# CompletableFuture的用法

当我们异步执行一个任务时，一般使用线程池`Executor`去创建。如果不需要返回值，使用实现`Runnable`接口的任务；如果需要返回值，使用实现`Callable`接口的任务，调用`Executor`的`submit`方法，再使用`Future`获取返回值即可。如果多个线程存在依赖组合的化，则可以使用同步组件`CountDownLatch`、`CyclicBarrier`等。<br />`CompletableFuture`是jdk8的新特性，用于异步编程，`CompletableFuture`提供了一种观察者模式类似的机制，可以让任务执行完成后通知监听方任务的进度，成功或者失败。使用这种方式，主线程不会被阻塞，不需要一直等待子线程完成，从而大大提高程序的性能。<br />`CompletableFuture`实现了`CompletionStage`接口和`Future`接口。<br />`Future`表示异步计算结果。提供了检查计算是否完成、等待计算完成以及获取计算结果的方法。<br />`CompletionStage`接口定义了异步计算的某个阶段，它描述了在另一个`ComletionStage`完成时执行的操作或者是计算值。
## 使用场景
`CompletableFuture`提供了包括创建异步任务、任务异步回调、多个任务组合处理等方法，来辅助实现异步任务的处理。
### 基本用法说明
`CompletableFuture`提供的方法具有以下特征：

- 方法名不包含`Async`，则后续执行的任务或者回调方法和前一个任务在相同线程内按顺序执行
- 方法名包含`Async`，则后续执行的任务或者回调方法是异步的，具体分以下情况：
   - `Async`方法不传入Executor类型参数，则异步执行的任务或者回调方法使用的是默认内置线程池`ForkJoinPool.commonPool()`
   - `Async`方法传入自定义的Executor类型参数，则异步执行的任务或者回调方法使用的是自定义的线程池
### 创建异步任务
#### supplyAsync

- 根据`Supplier`构建有返回值的异步任务
#### runAsync

- 根据`Runnable`构建无返回值的异步任务
### 任务异步回调
#### thenRun/thenRunAsync

- 某个任务执行完成后，执行`Runnable`构建的回调方法
- 前一个任务没有参数传递给回调方法
- 回调方法没有返回值
#### thenAccept/thenAcceptAsync

- 某个任务执行完成后，执行`Consumer`构建的回调方法
- 前一个任务的返回值作为参数传递给回调方法
- 回调方法没有返回值
#### thenApply/thenApplyAsync

- 某个任务执行完成后，执行`Function`构建的回调方法
- 前一个任务的返回值作为参数传递给回调方法
- 回调方法有返回值
#### exceptionally

- 某个任务执行异常时，执行`Function`构建的回调方法
- 前一个任务抛出的异常作为参数传递给回调方法
- 回调方法有返回值
- 回调方法和前一个任务在相同线程内按顺序执行
#### whenComplete/whenCompleteAsync

- 某个任务执行异常时，执行`BiConsumer`构建的回调方法
- 前一个任务的返回值及抛出的异常（抛出异常时返回值为null）作为参数传递给回调方法
- 回调方法没有返回值
#### handle/handleAsync

- 某个任务执行异常时，执行`BiConsumer`构建的回调方法
- 前一个任务的返回值及抛出的异常（抛出异常时返回值为null）作为参数传递给回调方法
- 回调方法有返回值
### 多个任务组合处理
#### AND组合关系
##### thenCombine/thenCombineAsync

- 将两个任务组合起来，只有这两个任务都执行完成之后，才会执行`BiFunction`构建的回调方法
- 前两个任务的返回值作为参数传递给回调方法
- 回调方法有返回值
##### thenAcceptBoth/thenAcceptBothAsync

- 将两个任务组合起来，只有这两个任务都执行完成之后，才会执行`BiConsumer`构建的回调方法
- 前两个任务的返回值作为参数传递给回调方法
- 回调方法没有返回值
##### runAfterBoth/runAfterBothAsync

- 将两个任务组合起来，只有这两个任务都执行完成之后，才会执行`Runnable`构建的回调方法
- 前两个任务没有参数传递给回调方法
- 回调方法没有返回值
#### OR组合关系
##### applyToEither/applyToEitherAsync

- 将两个任务组合起来，只要其中一个执行完成了，就会执行`Function`构建的回调方法
- 已经执行完成的任务返回值作为参数传递给回调方法
- 回调方法有返回值
##### acceptEither/acceptEitherAsync

- 将两个任务组合起来，只要其中一个执行完成了，就会执行`Consumer`构建的回调方法
- 已经执行完成的任务返回值作为参数传递给回调方法
- 回调方法没有返回值
##### runAfterEither/runAfterEitherAsync

- 将两个任务组合起来，只要其中一个执行完成了，就会执行`Runnable`构建的回调方法
- 没有参数传递给回调方法
- 回调方法没有返回值
#### allOf

- 将多个任务组合起来，所有任务都执行完成后，才执行`allOf`返回的`CompletableFuture`
#### anyOf

- 将多个任务组合起来，任意一个任务执行完成后，就会执行`anyOf`返回的`CompletableFuture`
#### thenCompose/thenComposeAsync

- 某个任务执行完成后，执行`Function`构建的回调方法
- 前一个任务的返回值作为参数传递给回调方法
- 回调方法返回一个新的`CompletableFuture`
### 获取返回值
#### get()/get(long, TimeUnit)

- 等待任务执行完成后获取返回值，根据任务执行情况可能抛出`ExecutionException`、`InterruptedException`等异常
- `get()`方法是阻塞的，一般使用`get(long, TimeUnit)`设置超时时间
#### join()

- 完成后返回结果值，当任务执行出现未经检查的异常时，则默认使用`CompletionException`对异常进行包装后再抛出
## 注意事项

- `ForkJoinPool.commonPool()`线程池，处理的线程个数是CPU核数 - 1。在大量请求，并且任务的处理逻辑比较复杂耗时的话，响应会很慢，此时建议使用自定义线程池，配置合适的线程池参数。
## 对比parallelStream并行流

- `CompletableFuture`可以控制线程池的线程数量，如果执行的任务是IO密集星的，应该使用`CompletableFuture`。
- 如果执行的任务是CPU密集型的，使用比处理器更多的线程是没有意义的，此时使用起来更简单的`parallelStream`。
