# Java多线程知识汇总(2)

> 引用自[Java多线程知识小抄集(二)](https://blog.csdn.net/u013256816/article/details/51325309)

27. ConcurrentHashMap

ConcurrentHashMap是线程安全的HashMap，内部采用分段锁来实现，默认初始容量为16，装载因子为0.75f，分段16，每个段的HashEntry<K,V>[]大小为2。**键值都不能为null**。每次扩容为原来容量的2倍，ConcurrentHashMap不会对整个容器进行扩容，而只对某个segment进行扩容。在获取size操作的时候，不是直接把所有segment的count相加就可以可到整个ConcurrentHashMap大小，也不是在统计size的时候把所有的segment的put, remove, clean方法全部锁住，这种方法太低效。在累加count操作过程中，之前累加过的count发生变化的几率非常小，所有ConcurrentHashMap的做法是先尝试2（RETRIES_BEFORE_LOCK）次通过不锁住Segment的方式统计各个Segment大小，如果统计的过程中，容器的count发生了变化，再采用加锁的方式来统计所有的Segment的大小。

28. 线程安全的非阻塞队列

非阻塞队列有ConcurrentLinkedQueue, ConcurrentLinkedDeque。**元素不能为null**。以ConcurrentLinkedQueue为例，有头head和尾tail两个指针，遵循FIFO的原则进行入队和出队，方法有add(E e), peek()取出不删除, poll()取出删除, remove(Object o)，size(), contains(Object o), addAll(Collection c), isEmpty()。ConcurrentLinkedDeque是双向队列，可以在头和尾两个方向进行相应的操作。

29. 阻塞队列

阻塞队列（BlockingQueue）是一个支持两个附加操作的队列。这两个附加的操作支持阻塞的插入和移除方法。 
支持阻塞的插入方法：意思是当队列满时，队列会阻塞插入元素的线程，直到队列不满。 
支持阻塞的移除方法：意思是队列为空时，获取元素的线程会等待队列变为非空。 
**任何阻塞队列中的元素都不能为null.**

30. 阻塞队列的插入和移除操作处理方式：

|方法-处理方法|抛出异常|返回特殊值|可能阻塞等待|可设定等待时间|
|---|---|---|---|---|
|入队|add(e)|offer(e)|put(e)|offer(e,timeout,unit)|
|出队|remove()||poll()|take()||poll(timeout,unit)|
|查看|element()|peek()|无|无|

**如果是无界队列，队列不可能出现满的情况，所以使用put或offer方法永远不会被阻塞，而且使用offer方法时，该方法永远返回true.**

31. Java里的阻塞队列

- ArrayBlockingQueue:一个由数组结构组成的有界阻塞队列。 
- LinkedeBlockingQueue:一个有链表结构组成的有界阻塞队列。 
- PriorityBlockingQueue:一个支持优先级排序的无界阻塞队列 
- DelayQueue:一个使用优先级队列实现的无界阻塞队列。 
- SynchronousQueue:一个不存储元素的阻塞队列。 
- LinkedTransferQueue:一个由链表结构组成的无界阻塞队列。 
- LinkedBlockingDeque:一个由链表结构组成的双向阻塞队列。

32. ArrayBlockingQueue

此队列按照FIFO的原则对元素进行排序，可以设定为公平ArrayBlockingQueue(int capacity, boolean fair)，默认为不公平。初始化时必须设定容量大小ArrayBlockingQueue(int capactiy)。

33. LinkedBlockingQueue

与ArrayBlockingQueue一样，按照FIFO原则进行排序，与ArrayBlockingQueue不同的是内部实现是一个链表结构，且不能设置为公平的。默认和最大长度为Integer.MAX_VALUE。

34. PriorityBlockingQueue

是一个支持优先级的无界阻塞队列，默认初始容量为11，默认情况下采用自然顺序升序排列，不能保证同优先级元素的顺序。内部元素要么实现Comparable接口，要么在初始化的时候指定构造函数的Comparator来对元素进行排序，有关Comparable与Comparator的细节可以参考：[Comparable与Comparator浅析](http://blog.csdn.net/u013256816/article/details/50899416)。

35. DelayQueue

DelayQueue是一个支持延时获取元素的无界阻塞队列。内部包含一个PriorityQueue来实现，队列中的元素必须实现Delay接口，在创建元素时可以指定多久才能从队列中获取当前元素。只有在延迟期满时才能从队列中提取元素。 
DelayQueue非常有用，可以将DelayQueue运用在下面应用场景。 

- 缓存系统的设计：可以用DelayQueue保存缓存元素的有效期，使用一个线程循环查询DelayQueue,一旦能从DelayQueue中获取元素时，表示缓存有效期到了。 
- 定时任务调度：使用DelayQueue保存当天将会执行的任务和执行时间，一旦从DelayQueue中获取到任务就开始执行，比如TimerQueue就是使用DelayQueue实现的。

36. SynchronousQueue

是一个不存储元素的阻塞队列，每一个put操作必须等待一个take操作，否则不能继续添加元素，非常适合传递性场景。支持公平访问队列。默认情况下线程采用非公平策略访问队列。

37. LinkedTransferQueue

是一个由链表结构组成的无界阻塞TransferQueue队列。相对于其他阻塞队列，LinkedTransferQueue多了tryTransfer和transfer方法。 
transfer方法：如果当前有消费者正在等待接收元素（消费者使用take()或者带时间限制的poll方法时），transfer方法可以把生产者传入的元素立刻transfer给消费者，如果没有消费者在等待接收元素，transfer方法会将元素存放在队列的tail节点，并等到该元素被消费者消费了才返回。 
tryTransfer方法：用来试探生产者传入的元素是否能直接传给消费者。如果没有消费者等待接收元素，则返回false。和transfer方法的区别是tryTransfer方法无论消费者是否接收，方法立刻返回，而transfer方法是必须等到消费者消费了才返回。

38. LinkedBlockingDeque

LinkedBlockingDeque是一个由链表结构组成的双向阻塞队列。所谓双向队列是指可以从队列的两端插入和移除元素。双向队列因为多了一个操作队列的入口，在多线程同时入队时，也就减少了一半的竞争。相对其他的阻塞队列，LinkedBlockingDeque多了addFirst, addLast, offerFirst, offerLast, peekFirst, peekLast等方法。

39. Fork/Join框架

Fork/Join框架是JDK7提供的一个用于并行执行任务的框架，是一个把大任务切分为若干子任务并行的执行，最终汇总每个小任务后得到大任务结果的框架。我们再通过Fork和Join来理解下Fork/Join框架。Fork就是把一个大任务划分成为若干子任务并行的执行，Join就是合并这些子任务的执行结果，最后得到这个大任务的结果。

使用Fork/Join框架时，首先需要创建一个ForkJoin任务，它提供在任务中执行fork()和join操作的机制。通常情况下，我们不需要直接继承ForkJoinTask，只需要继承它的子类，Fork/Join框架提供了两个子类：RecursiveAction用于没有返回结果的任务；RecursiveTask用于有返回结果的任务。ForkJoinTask需要通过ForkJoinPool来执行。

任务分割出的子任务会添加到当前工作线程所维护的双端队列中，进入队列的头部。当一个工作线程的队列里暂时没有任务时，它会随机从其他工作线程的队列的尾部获取一个任务。（工作窃取算法work-stealing）

示例：计算1+2+3+…+100的结果。

```Java
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.Future;
import java.util.concurrent.RecursiveTask;

public class CountTask extends RecursiveTask‹Integer› {
    private static final int THRESHOLD = 10;
    private int start;
    private int end;

    public CountTask(int start, int end) {
        super();
        this.start = start;
        this.end = end;
    }

    @Override
    protected Integer compute() {
        int sum = 0;
        boolean canCompute = (end-start) <= THRESHOLD;
        if(canCompute) {
            for(int i=start;i<=end;i++) {
                sum += i;
            }
        } else {
            int middle = (start+end)/2;
            CountTask leftTask = new CountTask(start,middle);
            CountTask rightTask = new CountTask(middle+1,end);
            leftTask.fork();
            rightTask.fork();
            int leftResult = leftTask.join();
            int rightResult = rightTask.join();
            sum = leftResult+rightResult;
        }

        return sum;
    }

    public static void main(String[] args) {
        ForkJoinPool forkJoinPool = new ForkJoinPool();
        CountTask task = new CountTask(1,100);
        Future‹Integer› result = forkJoinPool.submit(task);
        try {
            System.out.println(result.get());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }

        if(task.isCompletedAbnormally()) {
            System.out.println(task.getException());
        }
    }
}
```

40. 原子类

Java中Atomic包里一共提供了12个类，属于4种类型的原子更新方式，分别是原子更新基本类型、原子更新数组、原子更新引用、原子更新属性（字段）。Atomic包里的类基本都是使用Unsafe实现的包装类。 

1）原子更新基本类型：AtomicBoolean，AtomicInteger, AtomicLong.  
2）原子更新数组：AtomicIntegerArray，AtomicLongArray, AtomicReferenceArray.  
3）原子更新引用类型：AtomicReference, AtomicStampedReference, AtomicMarkableReference.  
4) 原子更新字段类型：AtomicReferenceFieldUpdater, AtomicIntegerFieldUpdater, AtomicLongFieldUpdater.

41. 原子更新基本类型

AtomicBoolean，AtomicInteger, AtomicLong三个类提供的方法类似，以AtomicInteger为例：有int addAndGet(int delta), boolean compareAndSet(int expect, int update), int getAndIncrement(), void lazySet(int newValue)，int getAndSet(int newValue)。其中大多数的方法都是调用compareAndSet方法实现的，譬如getAndIncrement():


```Java
public final int getAndIncrement() {
    for (;;) {
        int current = get();
        int next = current + 1;
        if (compareAndSet(current, next))
            return current;
    }
}
public final boolean compareAndSet(int expect, int update) {
    return unsafe.compareAndSwapInt(this, valueOffset, expect, update);
}
```

sun.misc.Unsafe只提供三种CAS方法：compareAndSwapObject, compareAndSwapInt和compareAndSwapLong，再看AtomicBoolean源码，发现它是先把Boolean转换成整形，再使用compareAndSwapInt进行CAS，原子更新char,float,double变量也可以用类似的思路来实现。

42. 原子更新数组

以AtomicIntegerArray为例，此类主要提供原子的方式更新数组里的整形，常用方法如下： 
int addAndGet(int i, int delta)：以原子的方式将输入值与数组中索引i的元素相加。 
boolean compareAndSet(int i, int expect, int update)：如果当前值等于预期值，则以原子方式将数组位置i的元素设置成update值。 
AtomicIntegerArray的两个构造方法： 
AtomicIntegerArray(int length)：指定数组的大小，并初始化为0 
AtomicIntegerArray(int [] array)：对给定的数组进行拷贝。 
案例：

```Java
int value[] = new int[]{1,2,3};
AtomicIntegerArray aia = new AtomicIntegerArray(value);
System.out.println(aia.getAndSet(1, 9));
System.out.println(aia.get(1));
System.out.println(value[1]);
```
运行结果：2 9 2

43. CountDownLatch

CountDownLatch允许一个或多个线程等待其他线程完成操作。CountDownLatch的构造函数接收一个int类型的参数作为计数器，如果你想等待N个点完成，这里就传入N（CountDownLatch(int count)）。 
CountDownLatch的方法有：await(), await(long timeout, TimeUnit unit), countDown(), getCount()等。

计数器必须大于等于0，只是等于0的时候，计数器就是零，调用await方法时不会阻塞当前线程。CountDownLatch不可能重新初始化或者修改CountDownLatch对象的内部计数器的值。一个线程调用countDown方法happens-before另一个线程调用的await()方法。

44. CyclicBarrier

让一组线程达到一个屏障时被阻塞，知道最后一个线程到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续运行。CyclicBarrier默认的构造方法是CyclicBarrier(int parties)，其参数表示屏障拦截的线程数量，每个线程调用await方法告诉CyclicBarrier我已经达到了屏障，然后当前线程被阻塞。CyclicBarrier还提供了一个更高级的构造函数CyclicBarrier(int parties, Runnable barrierAction)用于在线程达到屏障时，优先执行barrierAction，方便处理更复杂的业务场景，举例如下。

```Java
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierTest
{
    static CyclicBarrier c = new CyclicBarrier(2,new A());

    public static void main(String[] args)
    {
        new Thread(new Runnable(){
            @Override
            public void run()
            {
                try
                {
                    System.out.println(1);
                    c.await();
                }
                catch (InterruptedException | BrokenBarrierException e)
                {
                    e.printStackTrace();
                }
                System.out.println(2);
            }
        }).start();

        try
        {
            System.out.println(3);
            c.await();
        }
        catch (InterruptedException | BrokenBarrierException e)
        {
            e.printStackTrace();
        }
        System.out.println(4);
    }

    static class A implements Runnable
    {
        @Override
        public void run()
        {
            System.out.println(5);
        }
    }
}
```

输出结果：3 1 5 2 4

45. CyclicBarrier和CountDownLatch的区别

CountDownLatch的计数器只能使用一次，而CyclicBarrier的计数器可以使用reset()方法重置。

46. Semaphore

Semaphore(信号量)是用来控制同事访问特定资源的线程数量，它协调各个线程，以保证合理的使用公共资源。Semaphore有两个构造函数：Semaphore(int permits)默认是非公平的，Semaphore(int permits, boolean fair)可以设置为公平的。应用案例如下：

```Java
public class SemaphoreTest {
    private static final int THREAD_COUNT=30;
    private static ExecutorService threadPool = Executors.newFixedThreadPool(30);
    private static Semaphore s = new Semaphore(10);

    public static void main(String[] args)
    {
        for(int i=0;i<THREAD_COUNT;i++)
        {
            final int a = i;
            threadPool.execute(new Runnable(){
                @Override
                public void run()
                {
                    try
                    {
                        s.acquire();
                        System.out.println("do something...."+a);
                        s.release();
                    }
                    catch (InterruptedException e)
                    {
                        e.printStackTrace();
                    }
                }
            });
        }
        threadPool.shutdown();
    }
}
```

由上例可以看出Semaphore的用法非常的简单，首先线程使用Semaphore的acquire()方法获取一个许可证，使用完之后调用release()方法归还许可证。还可以用tryAcquire()方法尝试获取许可证。Semaphore还提供了一些其他方法： int availablePermits()返回此信号量中当前可用的许可证数；int getQueueLength()返回正在等待获取许可证的线程数；boolean hasQueuedThreads()是否有线程正在等待获取许可证；void reducePermits(int reduction)减少reduction个许可证，是个protected方法；Collection‹Thread› getQueuedThreads()返回所有等待获取许可证的线程集合，也是一个protected方法。

47. 线程间交换数据的Exchanger

Exchanger是一个用于线程间协作的工具类。Exchanger用于进行线程间的数据交换。它提供一个同步点，在这个同步点，两个线程可以交换彼此的数据。这两个线程通过exchange方法交换数据，如果第一个线程先执行exchange()方法，它会一直等待第二个线程也执行exchange方法。当两个线程都到达同步点时，这两个线程就可以交换数据，将本现场生产出来的数据传递给对方。

```Java
import java.util.concurrent.Exchanger;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ExchangerTest
{
    private static final Exchanger<String> exchanger = new Exchanger<>();
    private static ExecutorService threadPool = Executors.newFixedThreadPool(2);

    public static void main(String[] args)
    {
        threadPool.execute(new Runnable(){
            @Override
            public void run()
            {
                String A = "I'm A!";
                try
                {
                    String B = exchanger.exchange(A);
                    System.out.println("In 1-"+Thread.currentThread().getName()+": "+B);
                }
                catch (InterruptedException e)
                {
                    e.printStackTrace();
                }
            }
        });

        threadPool.execute(new Runnable(){
            @Override
            public void run()
            {
                try
                {
                    String B="I'm B!";
                    String A = exchanger.exchange(B);
                    System.out.println("In 2-"+Thread.currentThread().getName()+": "+A);
                }
                catch (InterruptedException e)
                {
                    e.printStackTrace();
                }
            }
        });
        threadPool.shutdown();
    }
}
```

输出结果：

```
In 2-pool-1-thread-2: I'm A!
In 1-pool-1-thread-1: I'm B!
```

如果两个线程有一个没有执行exchange(V x)方法，则会一直等待，如果担心有特殊情况发生，避免一直等待，可以使用exchange(V x, long timeout, TimeUnit unit)设置最大等待时长。

48. Java中的线程池ThreadPoolExecutor

可以通过ThreadPoolExecutor来创建一个线程池：

```Java
ThreadPoolExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit, BlockingQueue<Runnable> workQueue, ThreadFactory threadFactory, RejectedExecutionHandler handler)
```

- corePoolSize（线程池基本大小）：当向线程池提交一个任务时，若线程池已创建的线程数小于corePoolSize，即便此时存在空闲线程，也会通过创建一个新线程来执行该任务，直到已创建的线程数大于或等于corePoolSize时，才会根据是否存在空闲线程，来决定是否需要创建新的线程。除了利用提交新任务来创建和启动线程（按需构造），也可以通过 prestartCoreThread() 或 prestartAllCoreThreads() 方法来提前启动线程池中的基本线程。
- maximumPoolSize（线程池最大大小）：线程池所允许的最大线程个数。当队列满了，且已创建的线程数小于maximumPoolSize，则线程池会创建新的线程来执行任务。另外，对于无界队列，可忽略该参数。
- keepAliveTime（线程存活保持时间）：默认情况下，当线程池的线程个数多于corePoolSize时，线程的空闲时间超过keepAliveTime则会终止。但只要keepAliveTime大于0，allowCoreThreadTimeOut(boolean) 方法也可将此超时策略应用于核心线程。另外，也可以使用setKeepAliveTime()动态地更改参数。
- unit（存活时间的单位）：时间单位，分为7类，从细到粗顺序：NANOSECONDS（纳秒），MICROSECONDS（微妙），MILLISECONDS（毫秒），SECONDS（秒），MINUTES（分），HOURS（小时），DAYS（天）；
- workQueue（任务队列）：用于传输和保存等待执行任务的阻塞队列。可以使用此队列与线程池进行交互：

    如果运行的线程数少于 corePoolSize，则 Executor 始终首选添加新的线程，而不进行排队。  
    如果运行的线程数等于或多于 corePoolSize，则 Executor 始终首选将请求加入队列，而不添加新的线程。  
    如果无法将请求加入队列，则创建新的线程，除非创建此线程超出 maximumPoolSize，在这种情况下，任务将被拒绝。  
- threadFactory（线程工厂）：用于创建新线程。由同一个threadFactory创建的线程，属于同一个ThreadGroup，创建的线程优先级都为Thread.NORM_PRIORITY，以及是非守护进程状态。threadFactory创建的线程也是采用new Thread()方式，threadFactory创建的线程名都具有统一的风格：pool-m-thread-n（m为线程池的编号，n为线程池内的线程编号）;
- handler（线程饱和策略）：当线程池和队列都满了，则表明该线程池已达饱和状态。

    ThreadPoolExecutor.AbortPolicy：处理程序遭到拒绝，则直接抛出运行时异常 RejectedExecutionException。(默认策略)  
    ThreadPoolExecutor.CallerRunsPolicy：调用者所在线程来运行该任务，此策略提供简单的反馈控制机制，能够减缓新任务的提交速度。  
    ThreadPoolExecutor.DiscardPolicy：无法执行的任务将被删除。  
    ThreadPoolExecutor.DiscardOldestPolicy：如果执行程序尚未关闭，则位于工作队列头部的任务将被删除，然后重新尝试执行任务（如果再次失败，则重复此过程）。

可以使用两个方法向线程池提交任务，分别为execute()和submit()方法。execute()方法用于提交不需要返回值的任务，所以无法判断任务是否被线程池执行成功。submit()方法用于提交需要返回值的任务，线程池会返回一个Future类型的对象，通过这个对象可以判断任务是否执行成功。如Future‹Object› future = executor.submit(task);

利用线程池提供的参数进行监控，参数如下：

- getTaskCount()：线程池需要执行的任务数量。
- getCompletedTaskCount()：线程池在运行过程中已完成的任务数量，小于或等于taskCount。
- getLargestPoolSize()：线程池曾经创建过的最大线程数量，通过这个数据可以知道线程池是否满过。如等于线程池的最大大小，则表示线程池曾经满了。
- getPoolSize()：线程池的线程数量。如果线程池不销毁的话，池里的线程不会自动销毁，所以这个大小只增不减。
- getActiveCount()：获取活动的线程数。

49. shutdown和shutdownNow

可以调用线程池的shutdown或者shutdownNow方法来关闭线程池。他们的原理是遍历线程池的工作线程，然后逐个调用线程的interrupt方法来中断线程，所以无法响应中断的任务可能永远无法停止。

区别：shutdown方法将执行平缓的关闭过程：不在接收新的任务，同时等待已提交的任务执行完成——包括哪些还未开始执行的任务。shutdownNow方法将执行粗暴的关闭过程：它将尝试取消所有运行中的任务，并且不再启动队列中尚未开始执行的任务。

只要调用了这两个关闭方法中的任意一个,isShutdown方法就会返回true，当所有的任务都已关闭后，才表示线程池关闭成功，这时调用isTerminated方法会返回true。至于应该调用哪一种方法来关闭线程池，应该由提交到线程池的任务特性决定，通常调用shutdown方法来关闭线程池，如果任务不一定要执行完，则可以调用shutdownNow方法。

50. 扩展ThreadPoolExecutor

可以通过继承线程池来自定义线程池，重写线程池的beforeExecute, afterExecute和terminated方法。在执行任务的线程中将调用beforeExecute和afterExecute等方法，在这些方法中还可以添加日志、计时、监视或者统计信息收集的功能。无论任务是从run中正常返回，还是抛出一个异常而返回，afterExecute都会被调用。如果任务在完成后带有一个Error，那么就不会调用afterExecute。如果beforeExecute抛出一个RuntimeException，那么任务将不被执行，并且afterExecute也不会被调用。在线程池完成关闭时调用terminated，也就是在所有任务都已经完成并且所有工作者线程也已经关闭后，terminated可以用来释放Executor在其生命周期里分配的各种资源，此外还可以执行发送通知、记录日志或者手机finalize统计等操作。详细可以参考[《JAVA多线程之扩展ThreadPoolExecutor》](http://blog.csdn.net/u013256816/article/details/50403962)