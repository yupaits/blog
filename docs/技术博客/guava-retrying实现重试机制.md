# guava-retrying实现重试机制

> 引用自[技术 | 使用 guava-retrying 实现灵活的重试机制](https://cloud.tencent.com/developer/article/1752086)

我们的后端业务系统可能会出现接口调用失败、网络拥塞超时、任务执行失败、系统错误等异常情况，需要进行重试操作。但某些场景下我们对重试有特殊要求，比如延迟重试、降频重试等，此时自己编写重试代码会很繁琐，在 Java 中，可以使用 guava-retrying 帮我们实现灵活的重试机制。
## guava-retrying 简介
guava-retrying 是一个线程安全的 Java 重试类库，提供了一种通用方法去处理任意需要重试的代码，可以方便灵活地控制重试次数、重试时机、重试频率、停止时机等，并具有异常处理功能。<br />GitHub地址：https://github.com/rholder/guava-retrying 
> 有意思的是，这个项目最初源于 Jean-Baptiste Nizet 在 guava 仓库下的评论。

## guava-retrying 入门
下面通过一个场景帮助大家快速入门 guava-retrying，再具体讲解其更多用法。<br />作者在 GitHub 提供了入门代码，先通过 maven 或 gradle 引入：<br />maven引入代码: 
```xml
<dependency>
  <groupId>com.github.rholder</groupId>
  <artifactId>guava-retrying</artifactId>
  <version>2.0.0</version>
</dependency>
```
gradle引入代码: 
```groovy
compile "com.github.rholder:guava-retrying:2.0.0"
```
假定我们需要调用一个qps限制很低的第三方接口，如果调用失败，需要依次在失败后的第10s、30s、60s进行降频重试。<br />如果不使用框架，实现逻辑大致如下： 
```java
// 调用接口
boolean result;
AtomicInteger atomicInteger = new AtomicInteger(0);
int sleepNum = 10000;
 
while(!result && atomicInteger.get() < 4) {
    atomicInteger.incrementAndGet();
    result = thirdApi.invoke();
    Thread.sleep(sleepNum);
    sleepNum += sleepNum * atomicInteger.get();
}
```
虽然看起来代码行数并不多，只需要自己定义计数器、计算休眠时间等，但是再考虑到异常处理、异步等情况，重试逻辑的代码占整体代码的比重太大了（真正的业务逻辑只有 thirdApi.invoke 对么？）。如果业务中多处需要重试，还要反复编写类似的代码，而这不应该是开发者关心的。 <br />guava-retrying 为我们封装了一套很好的通用重试方法，来试下用它实现上述逻辑： 
```java
Callable<Boolean> callable = () -> {
    return thirdApi.invoke(); // 业务逻辑
};
 
// 定义重试器
Retryer<Boolean> retryer = RetryerBuilder.<Boolean>newBuilder()
    .retryIfResult(Predicates.<Boolean>isNull()) // 如果结果为空则重试
    .retryIfExceptionOfType(IOException.class) // 发生IO异常则重试
    .retryIfRuntimeException() // 发生运行时异常则重试
    .withWaitStrategy(WaitStrategies.incrementingWait(10, TimeUnit.SECONDS, 10, TimeUnit.SECONDS)) // 等待
    .withStopStrategy(StopStrategies.stopAfterAttempt(4)) // 允许执行4次（首次执行 + 最多重试3次）
    .build();
 
try {
    retryer.call(callable); // 执行
} catch (RetryException | ExecutionException e) { // 重试次数超过阈值或被强制中断
    e.printStackTrace();
}
```
分析上述代码：

1. 首先定义了一个 Callable 任务，其中执行我们需要重试的业务逻辑。
2. 通过 RetryerBuilder 构造重试器，构造包含如下部分：
- 重试条件 retryIfResult、retryIfExceptionOfType、retryIfRuntimeException
- 重试等待策略（延迟）withWaitStrategy
- 重试停止策略 withStopStrategy
- 阻塞策略、超时限制、注册重试监听器（上述代码未使用）
3. 通过 retryer.call 执行任务
4. 当重试次数超过设定值或者被强制中断时，会抛出异常，需要捕获处理

通过上述代码我们定义了一个重试器来实现降频重试机制。显然这种方式相较自己实现重试来说具有如下优点：

1. 对代码的侵入性更小
2. 更直观，改动方便
3. 可复用重试器至多个任务（代码段）
### RetryerBuilder 方法介绍
RetryerBuilder 用于构造重试器，是整个 guava-retrying 库的核心，决定了重试的行为，下面详细介绍 RetryerBuilder 的方法。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/763022/1669083898826-f172cdde-aadc-49a2-a637-31159a743400.png#averageHue=%23484d52&clientId=ue9ce49c6-1acb-4&from=paste&id=ue9a25ac2&originHeight=618&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&size=330935&status=done&style=none&taskId=uf4e6a500-9932-43cc-8a12-b14b7d4d29b&title=)<br />通过 newBuilder 方法获取 RetryerBuilder 实例，通过 build 方法构造 Retryer：
```java
RetryerBuilder<V> newBuilder();
Retryer<V> build();
```
可以通过下面的方法改变重试器的行为。 
### 重试条件

1. 根据执行结果判断是否重试 retryIfResult
```java
RetryerBuilder<V> retryIfResult(@Nonnull Predicate<V> resultPredicate);
```

2. 发生异常时重试 
```java
// 发生任何异常都重试
RetryerBuilder<V> retryIfException();
// 发生 Runtime 异常都重试
RetryerBuilder<V> retryIfRuntimeException();
// 发生指定 type 异常时重试
RetryerBuilder<V> retryIfExceptionOfType(@Nonnull Class<? extends Throwable> exceptionClass);
// 匹配到指定类型异常时重试
RetryerBuilder<V> retryIfException(@Nonnull Predicate<Throwable> exceptionPredicate);
```
### 等待策略
等待策略可以控制重试的时间间隔，通过 withWaitStrategy 方法注册等待策略：
```java
RetryerBuilder<V> withWaitStrategy(@Nonnull WaitStrategy waitStrategy) throws IllegalStateException;
```
WaitStrategy 是等待策略接口，可通过 WaitStrategies 的方法生成该接口的策略实现类，共有7种策略： 

1. FixedWaitStrategy：固定等待时长策略，比如每次重试等待5s
```java
// 参数：等待时间，时间单位
WaitStrategy fixedWait(long sleepTime, @Nonnull TimeUnit timeUnit) throws IllegalStateException;
```

2. RandomWaitStrategy：随机等待时长策略，每次重试等待指定区间的随机时长 
```java
// 参数：随机上限，时间单位
WaitStrategy randomWait(long maximumTime, @Nonnull TimeUnit timeUnit);
// 参数：随机下限，下限时间单位，随机上限，上限时间单位
WaitStrategy randomWait(long minimumTime,
                        @Nonnull TimeUnit minimumTimeUnit,
                        long maximumTime,
                        @Nonnull TimeUnit maximumTimeUnit);
```

3. IncrementingWaitStrategy：递增等待时长策略，指定初始等待值，然后重试间隔随次数等差递增，比如依次等待10s、30s、60s（递增值为10） 
```java
// 参数：初始等待时长，初始值时间单位，递增值，递增值时间单位
WaitStrategy incrementingWait(long initialSleepTime,
                              @Nonnull TimeUnit initialSleepTimeUnit,
                              long increment,
                              @Nonnull TimeUnit incrementTimeUnit);
```

4. ExponentialWaitStrategy：指数等待时长策略，指定初始值，然后每次重试间隔乘2（即间隔为2的幂次方），如依次等待 2s、6s、14s。可以设置最大等待时长，达到最大值后每次重试将等待最大时长。 
```java
// 无参数（默认初始值为1）
WaitStrategy exponentialWait();
// 参数：最大等待时长，最大等待时间单位（默认初始值为1）
WaitStrategy exponentialWait(long maximumTime, @Nonnull TimeUnit maximumTimeUnit);
// 参数：初始值，最大等待时长，最大等待时间单位
WaitStrategy exponentialWait(long multiplier, long maximumTime, @Nonnull TimeUnit maximumTimeUnit);
```

5. FibonacciWaitStrategy ：斐波那契等待时长策略，类似指数等待时长策略，间隔时长为斐波那契数列。 
```java
// 无参数（默认初始值为1）
WaitStrategy fibonacciWait()
// 参数：最大等待时长，最大等待时间单位（默认初始值为1）
WaitStrategy fibonacciWait(long maximumTime, @Nonnull TimeUnit maximumTimeUnit)
// 参数：最大等待时长，最大等待时间单位（默认初始值为1）
WaitStrategy fibonacciWait(long multiplier, long maximumTime, @Nonnull TimeUnit maximumTimeUnit)
```

6. ExceptionWaitStrategy：异常时长等待策略，根据出现的异常类型决定等待的时长 
```java
// 参数：异常类型，计算等待时长的函数
<T extends Throwable> WaitStrategy exceptionWait(@Nonnull Class<T> exceptionClass,
                                                 @Nonnull Function<T, Long> function)
```

7. CompositeWaitStrategy ：复合时长等待策略，可以组合多个等待策略，基本可以满足所有等待时长的需求 
```java
// 参数：等待策略数组
WaitStrategy join(WaitStrategy... waitStrategies)
```
### 阻塞策略
阻塞策略控制当前重试结束至下次重试开始前的行为，通过 withBlockStrategy 方法注册阻塞策略：
```java
RetryerBuilder<V> withBlockStrategy(@Nonnull BlockStrategy blockStrategy) throws IllegalStateException
```
BlockStrategy 是等待策略接口，可通过 BlockStrategies 的方法生成实现类，默认只提供一种策略 ThreadSleepStrategy： 
```java
@Immutable
private static class ThreadSleepStrategy implements BlockStrategy {
 
      @Override
      public void block(long sleepTime) throws InterruptedException {
            Thread.sleep(sleepTime);
      }
}
```
很好理解，除了睡眠，阻塞着啥也不干。 
### 停止策略
停止策略决定了何时停止重试，比如限制次数、时间等，通过 withStopStrategy 方法注册等待策略：
```java
RetryerBuilder<V> withStopStrategy(@Nonnull StopStrategy stopStrategy) throws IllegalStateException
```
可通过 StopStrategies 的方法生成 StopStrategy 接口的策略实现类，共有3种策略： 

1. NeverStopStrategy：永不停止，直到重试成功
2. StopAfterAttemptStrategy：指定最多重试次数，超过次数抛出 RetryException 异常
3. StopAfterDelayStrategy：指定最长重试时间，超时则中断当前任务执行且不再重试，并抛出 RetryException 异常
### 超时限制
通过 withAttemptTimeLimiter 方法为任务添加单次执行时间限制，超时则中断执行，继续重试。
```java
RetryerBuilder<V> withAttemptTimeLimiter(@Nonnull AttemptTimeLimiter<V> attemptTimeLimiter)
```
默认提供了两种 AttemptTimeLimiter：

- NoAttemptTimeLimit：不限制执行时间
- FixedAttemptTimeLimit：限制执行时间为固定值
### 监听器
可以通过 withRetryListener 方法为重试器注册监听器，每次重试结束后，会按注册顺序依次回调 Listener 的 onRetry 方法，可在其中获取到当前执行的信息，比如重试次数等。<br />示例代码如下：
```java
import com.github.rholder.retry.Attempt;
import com.github.rholder.retry.RetryListener;
 
public class MyRetryListener<T> implements RetryListener {
 
    @Override
    public <T> void onRetry(Attempt<T> attempt) {
        // 第几次重试,(注意:第一次重试其实是第一次调用)
        System.out.print("[retry]time=" + attempt.getAttemptNumber());
 
        // 距离第一次重试的延迟
        System.out.print(",delay=" + attempt.getDelaySinceFirstAttempt());
 
        // 重试结果: 是异常终止, 还是正常返回
        System.out.print(",hasException=" + attempt.hasException());
        System.out.print(",hasResult=" + attempt.hasResult());
 
        // 是什么原因导致异常
        if (attempt.hasException()) {
            System.out.print(",causeBy=" + attempt.getExceptionCause().toString());
        } else {
            // 正常返回时的结果
            System.out.print(",result=" + attempt.getResult());
        }
    }
}
```
### 看下原理
顾名思义，guava-retrying 依赖 guava 库，如作者所说，源码中大量依赖 guava 的 Predicates（断言）来判断是否继续重试。<br />通过方法、对象名也可以看出，该库主要使用了**策略模式、构造器模式和观察者模式**（Listener），对调用方非常友好。<br />从哪儿开始执行任务就从哪儿开始看，直接打开 Retryer 类的 call 方法：
```java
public V call(Callable<V> callable) throws ExecutionException, RetryException {
    long startTime = System.nanoTime(); // 1. 记录开始时间，用于后续的时间计算
    for (int attemptNumber = 1; ; attemptNumber++) {
        Attempt<V> attempt;
        try {
            V result = attemptTimeLimiter.call(callable); // 2. 执行callable任务，得到attempt
            attempt = new ResultAttempt<V>(result, attemptNumber, TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTime));
        } catch (Throwable t) {
            attempt = new ExceptionAttempt<V>(t, attemptNumber, TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTime));
        }
 
        for (RetryListener listener : listeners) { // 3. 如果有***，通知
            listener.onRetry(attempt);
        }
 
        if (!rejectionPredicate.apply(attempt)) { // 4. 如果执行callable出现异常，则返回异常的attempt
            return attempt.get();
        }
        if (stopStrategy.shouldStop(attempt)) { // 5. 根据停止策略判断是否停止重试
            throw new RetryException(attemptNumber, attempt); // 若停止，抛出异常
        } else {
            long sleepTime = waitStrategy.computeSleepTime(attempt); // 6. 根据等待策略计算休眠时间
            try {
                blockStrategy.block(sleepTime); // 7. 根据阻塞策略决定休眠行为，默认为sleep
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RetryException(attemptNumber, attempt);
            }
        }
    }
}
```
这个方法逻辑很清晰，可以结合作者的注释阅读，主要流程如下： 

1. 记录开始时间，便于后续判断是否超过限制时间
2.  通过 attemptTimeLimiter 执行 callable 任务，得到 attempt。attempt 代表着每次执行，记录了如执行结果、执行次数、距离第一次执行的延迟时间、异常原因等信息。
- 如果 attemptTimeLimiter 是 NoAttemptTimeLimit，则直接调用 callable.call 执行。
- 如果 attemptTimeLimiter 是 FixedAttemptTimeLimit，则调用 timeLimiter.callWithTimeout 限制执行时间。
3. 通知监听器，进行一些回调操作
4. rejectionPredicate 默认为 alwaysFalse，如果执行 callable 出现异常，则 rejectionPredicate 会返回异常的 attempt
```java
rejectionPredicate = Predicates.or(rejectionPredicate, new ExceptionClassPredicate<V>(RuntimeException.class));
```

5. 根据停止策略判断是否停止重试，若停止，抛出 RetryException 异常表示最终重试失败
6. 根据等待策略计算休眠时间
7. 根据阻塞策略决定休眠行为，默认为 Thread.sleep（躺着啥也不干）
