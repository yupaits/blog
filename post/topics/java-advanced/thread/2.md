# Java多线程知识汇总(3)

> 引用自[Java多线程知识小抄集(三)](https://blog.csdn.net/u013256816/article/details/51363643)

51. SimpleDateFormat非线程安全

当多个线程共享一个SimpleDateFormat实例的时候，就会出现难以预料的异常。 

主要原因是parse()方法使用calendar来生成返回的Date实例，而每次parse之前，都会把calendar里的相关属性清除掉。问题是这个calendar是个全局变量，也就是线程共享的。因此就会出现一个线程刚把calendar设置好，另一个线程就把它给清空了，这时第一个线程再parse的话就会有问题了。

解决方案:1. 每次使用时创建一个新的SimpleDateFormat实例；2. 创建一个共享的SimpleDateFormat实例变量，并对这个变量进行同步；3. 使用ThreadLocal为每个线程都创建一个独享的SimpleDateFormat实例变量。

52. CopyOnWriteArrayList

在每次修改时，都会创建并重新发布一个新的容器副本，从而实现可变现。CopyOnWriteArrayList的迭代器保留一个指向底层基础数组的引用，这个数组当前位于迭代器的起始位置，由于它不会被修改，因此在对其进行同步时只需确保数组内容的可见性。因此，多个线程可以同时对这个容器进行迭代，而不会彼此干扰或者与修改容器的线程相互干扰。“写时复制”容器返回的迭代器不会抛出ConcurrentModificationException并且返回的元素与迭代器创建时的元素完全一致，而不必考虑之后修改操作所带来的影响。显然，每当修改容器时都会复制底层数组，这需要一定的开销，特别是当容器的规模较大时，仅当迭代操作远远多于修改操作时，才应该使用“写入时赋值”容器。

53. 工作窃取算法（work-stealing）

工作窃取算法是指某个线程从其他队列里窃取任务来执行。在生产-消费者设计中，所有消费者有一个共享的工作队列，而在work-stealing设计中，每个消费者都有各自的双端队列，如果一个消费者完成了自己双端队列中的全部任务，那么它可以从其他消费者双端队列末尾秘密地获取工作。

优点：充分利用线程进行并行计算，减少了线程间的竞争。 
缺点：在某些情况下还是存在竞争，比如双端队列（Deque）里只有一个任务时。并且该算法会消耗了更多的系统资源，比如创建多个线程和多个双端队列。

54. Future & FutureTask

FutureTask表示的计算是通过Callable来实现的，相当于一种可生产结果的Runnable，并且可以处于一下3种状态：等待运行，正在运行和运行完成。运行表示计算的所有可能结束方式，包括正常结束、由于取消而结束和由于异常而结束等。当FutureTask进入完成状态后，它会永远停止在这个状态上。Future.get的行为取决于任务的状态，如果任务已经完成，那么get会立刻返回结果，否则get将阻塞知道任务进入完成状态，然后返回结果或者异常。FutureTask的使用方式如下：

```Java
public class Preloader
{
    //method1
    private final static FutureTask‹Object› future = new FutureTask‹Object›(new Callable‹Object›(){
        @Override
        public Object call() throws Exception
        {
            return "yes";
        }
    });

    //method2
    static ExecutorService executor = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
    private static final Future‹Object› futureExecutor = executor.submit(new Callable‹Object›(){
        @Override
        public Object call() throws Exception
        {
            return "no";
        }
    });        

    public static void main(String[] args) throws InterruptedException, ExecutionException
    {
        executor.shutdown();
        future.run();
        System.out.println(future.get());
        System.out.println(futureExecutor.get());
    }
}
```

运行结果：yes    no 
Callable表示的任务可以抛出受检查或未受检查的异常，并且任何代码都可能抛出一个Error.无论任务代码抛出什么异常，都会被封装到一个ExecutionException中，并在Future.get中被重新抛出。

55. Executors

newFixedThreadPool：创建一个固定长度的线程池，每当提交一个任务时就创建一个线程，直到达到线程池的最大数量，这时线程池的规模将不再变化（如果某个线程由于发生了未预期的Exception而结束，那么线程池会补充一个新的线程）。（LinkedBlockingQueue） 
newCachedThreadPool：创建一个可换成的线程池，如果线程池的当前规模超过了处理需求时，那么将回收空闲的线程，而当需求增加时，则可以添加新的线程，线程池的规模不存在任何限制。（SynchronousQueue） 
newSingleThreadExecutor：是一个单线程的Executor，它创建单个工作者线程来执行任务，如果这个线程异常结束，会创建另一个线程来替代。能确保一组任务在队列中的顺序来串行执行。（LinkedBlockingQueue） 
newScheduledThreadPool：创建了一个固定长度的线程池，而且以延迟或者定时的方式来执行任务，类似于Timer。

56. ScheduledThreadPoolExecutor替代Timer

Timer有两个缺陷，在JDK5开始就很少使用Timer了，取而代之的可以使用ScheduledThreadPoolExecutor。使用实例如下：

```Java
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

public class ScheduleThreadPoolTest
{
    private static ScheduledExecutorService exec = Executors.newScheduledThreadPool(2);

    public static void method1()
    {
        exec.schedule(new Runnable(){
            @Override
            public void run()
            {
                System.out.println("1");
            }}, 2, TimeUnit.SECONDS);
    }

    public static void method2()
    {
        ScheduledFuture<String> future = exec.schedule(new Callable<String>(){
            @Override
            public String call() throws Exception
            {
                return "Callable";
            }}, 4, TimeUnit.SECONDS);
        try
        {
            System.out.println(future.get());
        }
        catch (InterruptedException | ExecutionException e)
        {
            e.printStackTrace();
        }
    }

    public static void main(String[] args)
    {
        method1();
        method2();
    }
}
```

运行结果：1 Callable

57. Callable & Runnable

Executor框架使用Runnable作为基本的任务表示形式。Runnable是一种有很大局限的抽象，虽然run能写入到日志文件或者将结果放入某个共享的数据结构，但它不能返回一个值或抛出一个受检查的异常。

许多任务实际上都是存在延迟的计算——执行数据库查询，从网络上获取资源，或者计算某个复杂的功能。对于这些任务，Callable是一种更好的抽象：它认为主入口点（call()）将返回一个值，并可能抛出一个异常。

Runnable和Callable描述的都是抽象的计算任务。这些任务通常是有范围的，即都有一个明确的起始点，并且最终会结束。

58. CompletionService

如果想Executor提交了一组计算任务，并且希望在计算完成后获得结果，那么可以保留与每个任务关联的Future，然后反复使用get方法，同事将参数timeout指定为0，从而通过轮询来判断任务是否完成。这种方法虽然可行，但却有些繁琐。幸运的是，还有一种更好的方法：CompletionService。CompletionService将Executor和BlockingQueue的功能融合在一起。你可以将Callable任务提交给它来执行，然后使用类似于队列操作的take和poll等方法来获得已完成的结果，而这些结果会在完成时被封装为Future。ExecutorCompletionService实现了CompletionService,并将计算部分委托到一个Executor。代码示例如下：

```Java
int coreNum = Runtime.getRuntime().availableProcessors();
ExecutorService executor = Executors.newFixedThreadPool(coreNum);
CompletionService‹Object› completionService = new ExecutorCompletionService‹Object›(executor);

for(int i=0;i<coreNum;i++)
{
    completionService.submit( new Callable‹Object›(){
        @Override
        public Object call() throws Exception
        {
            return Thread.currentThread().getName();
        }});
}

for(int i=0;i<coreNum;i++)
{
    try
    {
        Future‹Object› future = completionService.take();
        System.out.println(future.get());
    }
    catch (InterruptedException | ExecutionException e)
    {
        e.printStackTrace();
    }
}
```

运行结果：

```
pool-1-thread-1
pool-1-thread-2
pool-1-thread-3
pool-1-thread-4
```

可以通过ExecutorCompletionService(Executor executor, BlockingQueue<Future‹V›> completionQueue)构造函数指定特定的BlockingQueue（如下代码剪辑），默认为LinkedBlockingQueue。

```Java
BlockingQueue<Future‹Object›> bq = new LinkedBlockingQueue<Future‹Object›>();
CompletionService‹Object› completionService = new ExecutorCompletionService‹Object›(executor,bq);12
```

ExecutorCompletionService的JDK源码只有100行左右，有兴趣的朋友可以看看。

59. 通过Future来实现取消

ExecutorService.submit将返回一个Future来描述任务。Future拥有一个cancel方法，该方法带有一个boolean类型的参数mayInterruptIfRunning，表示取消操作是否成功。如果mayInterruptIfRunning为true并且任务当前正在某个线程运行，那么这个线程能被中断。如果这个参数为false，那么意味着“若任务还没启动，就不要运行它”，这种方式应该用于那些不处理中断的任务中。当Future.get抛出InterruptedException或TimeoutException时，如果你知道不再需要结果，那么就可以调用Futuure.cancel来取消任务。

60. 处理不可中断的阻塞

对于一下几种情况，中断请求只能设置线程的中断状态，除此之外没有其他任何作用。

- Java.io包中的同步Socket I/O：虽然InputStream和OutputStream中的read和write等方法都不会响应中断，但通过关闭底层的套接字，可以使得由于执行read或write等方法而被阻塞的线程抛出一个SocketException。
- Java.io包中的同步I/O：当中断一个在InterruptibleChannel上等待的线程时会抛出ClosedByInterrptException并关闭链路。当关闭一个InterruptibleChannel时，将导致所有在链路操作上阻塞的线程都抛出AsynchronousCloseException。
- Selector的异步I/O：如果一个线程在调用Selector.select方法时阻塞了，那么调用close或wakeup方法会使线程抛出ClosedSelectorException并提前返回。
- 获得某个锁：如果一个线程由于等待某个内置锁而阻塞，那么将无法响应中断，因为线程认为它肯定会获得锁，所以将不会理会中断请求，但是在Lock类中提供了lockInterruptibly方法，该方法允许在等待一个锁的同时仍能响应中断。

61. 关闭钩子

JVM既可以正常关闭也可以强制关闭，或者说非正常关闭。关闭钩子可以在JVM关闭时执行一些特定的操作，譬如可以用于实现服务或应用程序的清理工作。关闭钩子可以在一下几种场景中应用：1. 程序正常退出（这里指一个JVM实例）；2.使用System.exit()；3.终端使用Ctrl+C触发的中断；4. 系统关闭；5. OutOfMemory宕机；6.使用Kill pid命令干掉进程（注：在使用kill -9 pid时，是不会被调用的）。使用方法（Runtime.getRuntime().addShutdownHook(Thread hook)）。更多内容可以参考[JAVA虚拟机关闭钩子(Shutdown Hook)](http://blog.csdn.net/u013256816/article/details/50394923)

62. 终结器finalize

终结器finalize：在回收器释放它们后，调用它们的finalize方法，从而保证一些持久化的资源被释放。在大多数情况下，通过使用finally代码块和显示的close方法，能够比使用终结器更好地管理资源。唯一例外情况在于：当需要管理对象，并且该对象持有的资源是通过本地方法获得的。但是基于一些原因（譬如对象复活），我们要尽量避免编写或者使用包含终结器的类。

63. 线程工厂ThreadFactory

每当线程池（ThreadPoolExecutor）需要创建一个线程时，都是通过线程功夫方法来完成的。默认的线程工厂方法将创建一个新的、非守护的线程，并且不包含特殊的配置信息。通过指定一个线程工厂方法，可以定制线程池的配置信息。在ThreadFactory中只定义了一个方法newThread，每当线程池需要创建一个新线程时都会调用这个方法。默认的线程工厂(DefaultThreadFactory 是Executors的内部类)如下：

```Java
static class DefaultThreadFactory implements ThreadFactory {
    private static final AtomicInteger poolNumber = new AtomicInteger(1);
    private final ThreadGroup group;
    private final AtomicInteger threadNumber = new AtomicInteger(1);
    private final String namePrefix;

    DefaultThreadFactory() {
        SecurityManager s = System.getSecurityManager();
        group = (s != null) ? s.getThreadGroup() :
                                Thread.currentThread().getThreadGroup();
        namePrefix = "pool-" +
                        poolNumber.getAndIncrement() +
                        "-thread-";
    }

    public Thread newThread(Runnable r) {
        Thread t = new Thread(group, r,
                                namePrefix + threadNumber.getAndIncrement(),
                                0);
        if (t.isDaemon())
            t.setDaemon(false);
        if (t.getPriority() != Thread.NORM_PRIORITY)
            t.setPriority(Thread.NORM_PRIORITY);
        return t;
    }
}
```

通过implements ThreadFactory可以定制线程工厂。譬如，你希望为线程池中的线程指定一个UncaughtExceptionHandler，或者实例化一个定制的Thread类用于执行调试信息的记录。

64. synchronized与ReentrantLock之间进行选择

由第21条可知ReentrantLock与synchronized想必提供了许多功能：定时的锁等待，可中断的锁等待、公平锁、非阻塞的获取锁等，而且从性能上来说ReentrantLock比synchronized略有胜出（JDK6起），在JDK5中是远远胜出，为嘛不放弃synchronized呢？ReentrantLock的危险性要比同步机制高，如果忘记在finnally块中调用unlock，那么虽然代码表面上能正常运行，但实际上已经埋下了一颗定时炸弹，并很可能伤及其他代码。仅当内置锁不能满足需求时，才可以考虑使用ReentrantLock.

65. Happens-Before规则

程序顺序规则：如果程序中操作A在操作B之前，那么在线程中A操作将在B操作之前。 
监视器锁规则：一个unlock操作现行发生于后面对同一个锁的lock操作。 
volatile变量规则：对一个volatile变量的写操作先行发生于后面对这个变量的读操作，这里的“后面”同样是指时间上的先后顺序。 
线程启动规则：Thread对象的start()方法先行发生于此线程的每一个动作。 
线程终止规则：线程的所有操作都先行发生于对此线程的终止检测，我们可以通过Thread.join()方法结束、Thread.isAlive()的返回值等于段检测到线程已经终止执行。 
线程中断规则：线程interrupt()方法的调用先行发生于被中断线程的代码检测到中断事件的发生。 
终结器规则：对象的构造函数必须在启动该对象的终结器之前执行完成。 
传递性：如果操作A先行发生于操作B，操作B先行发生于操作C，那就可以得出操作A先行发生于操作C的结论。


**注意：**如果两个操作之间存在happens-before关系，并不意味着java平台的具体实现必须要按照Happens-Before关系指定的顺序来执行。如果重排序之后的执行结果，与按happens-before关系来执行的结果一致，那么这种重排序并不非法。

66. as-if-serial

不管怎么重排序，程序执行结果不能被改变。

67. ABA问题

ABA问题发生在类似这样的场景：线程1转变使用CAS将变量A的值替换为C，在此时，线程2将变量的值由A替换为C，又由C替换为A，然后线程1执行CAS时发现变量的值仍为A，所以CAS成功。但实际上这时的现场已经和最初的不同了。大多数情况下ABA问题不会产生什么影响。如果有特殊情况下由于ABA问题导致，可用采用AtomicStampedReference来解决，原理：乐观锁+version。可以参考下面的案例来了解其中的不同。

```Java
public class ABAQuestion
{
    private static AtomicInteger atomicInt = new AtomicInteger(100);
    private static AtomicStampedReference‹Integer› atomicStampedRef = new AtomicStampedReference‹Integer›(100,0);

    public static void main(String[] args) throws InterruptedException
    {
        Thread thread1 = new Thread(new Runnable(){
            @Override
            public void run()
            {
                atomicInt.compareAndSet(100, 101);
                atomicInt.compareAndSet(101, 100);
            }
        });

        Thread thread2 = new Thread(new Runnable(){
            @Override
            public void run()
            {
                try
                {
                    TimeUnit.SECONDS.sleep(1);
                }
                catch (InterruptedException e)
                {
                    e.printStackTrace();
                }
                boolean c3 = atomicInt.compareAndSet(100, 101);
                System.out.println(c3);
            }
        });

        thread1.start();
        thread2.start();
        thread1.join();
        thread2.join();

        Thread thread3 = new Thread(new Runnable(){
            @Override
            public void run()
            {
                try
                {
                    TimeUnit.SECONDS.sleep(1);
                }
                catch (InterruptedException e)
                {
                    e.printStackTrace();
                }
                atomicStampedRef.compareAndSet(100, 101, atomicStampedRef.getStamp(), atomicStampedRef.getStamp()+1);
                atomicStampedRef.compareAndSet(101, 100, atomicStampedRef.getStamp(), atomicStampedRef.getStamp()+1);
            }
        });

        Thread thread4 = new Thread(new Runnable(){
            @Override
            public void run()
            {
                int stamp = atomicStampedRef.getStamp();
                try
                {
                    TimeUnit.SECONDS.sleep(2);
                }
                catch (InterruptedException e)
                {
                    e.printStackTrace();
                }
                boolean c3 = atomicStampedRef.compareAndSet(100, 101, stamp, stamp+1);
                System.out.println(c3);
            }
        });
        thread3.start();
        thread4.start();
    }
}
```

输出结果：true false