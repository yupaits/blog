---
title: Java多线程知识汇总(1)
date: 2020-02-04 09:41:37
category: Java进阶
tags: 
  - Java
  - 多线程
---

# Java多线程知识汇总(1)

> 引用自[Java多线程知识小抄集(一)](https://blog.csdn.net/u013256816/article/details/51325246)

1. interrupted与isInterrupted的区别

    interrupted()：测试当前线程是否已经是中断状态，执行后具有状态标志清除为false的功能。 
    isInterrupted()：测试线程Thread对象是否已经是中断状态，但不清除状态标志。

    方法：

    ```Java
    public static boolean interrupted() {
        return currentThread().isInterrupted(true);
    }
    public boolean isInterrupted() {
        return isInterrupted(false);
    }
    private native boolean isInterrupted(boolean ClearInterrupted);1234567
    ```

2. 终止正在运行的线程的三种方法：

    使用退出标志，是线程正常退出，也就是当run方法完成后线程终止；
    使用stop方法强行终止线程，但是不推荐使用这个方法，因为stop和suspend及resume一样都是作废过期的方法，使用它们可能产生不可预料的结果；
    使用interrupt方法中断线程；（推荐）

3. yield方法

    yield()方法的作用是放弃当前的CPU资源，将它让给其他的任务去占用CPU执行时间。但放弃时间不确定，有可能刚刚放弃，马上又获得CPU时间片。这里需要注意的是yield()方法和sleep方法一样，线程并不会让出锁，和wait不同。

4. 线程的优先级

    Java中线程的优先级分为1-10这10个等级，如果小于1或大于10则JDK抛出IllegalArgumentException()的异常，默认优先级是5。在Java中线程的优先级具有继承性，比如A线程启动B线程，则B线程的优先级与A是一样的。注意程序正确性不能依赖线程的优先级高低，因为操作系统可以完全不理会Java线程对于优先级的决定。

5. Java中线程的状态

    New, Runnable, Blocked, Waiting, Time_waiting, Terminated.

6. 守护线程

    Java中有两种线程，一种是用户线程，另一种是守护线程。当进程中不存在非守护线程了，则守护线程自动销毁。通过setDaemon(true)设置线程为后台线程。注意thread.setDaemon(true)必须在thread.start()之前设置，否则会报IllegalThreadStateException异常；在Daemon线程中产生的新线程也是Daemon的；在使用ExecutorSerice等多线程框架时，会把守护线程转换为用户线程，并且也会把优先级设置为Thread.NORM_PRIORITY。在构建Daemon线程时，不能依靠finally块中的内容来确保执行关闭或清理资源的逻辑。更多详细内容可参考《Java守护线程概述》

7. synchronized的类锁与对象锁

    类锁：在方法上加上static synchronized的锁，或者synchronized(xxx.class)的锁。如下代码中的method1和method2： 
    对象锁：参考method4, method5,method6.


    ```Java
    public class LockStrategy
    {
        public Object object1 = new Object();

        public static synchronized void method1(){}
        public void method2(){
            synchronized(LockStrategy.class){}
        }

        public synchronized void method4(){}
        public void method5()
        {
            synchronized(this){}
        }
        public void method6()
        {
            synchronized(object1){}
        }
    }
    ```

    注意方法method4和method5中的同步块也是互斥的。 
    下面做一道习题来加深一下对对象锁和类锁的理解： 
    有一个类这样定义

    ```Java
    public class SynchronizedTest
    {
        public synchronized void method1(){}
        public synchronized void method2(){}
        public static synchronized void method3(){}
        public static synchronized void method4(){}
    }
    ```

    那么，有SynchronizedTest的两个实例a和b，对于一下的几个选项有哪些能被一个以上的线程同时访问呢？ 
    A. a.method1() vs. a.method2() 
    B. a.method1() vs. b.method1() 
    C. a.method3() vs. b.method4() 
    D. a.method3() vs. b.method3() 
    E. a.method1() vs. a.method3() 
    答案是什么呢？BE 
    有关Java中的锁的详细信息，可以参考[《Java中的锁》](http://blog.csdn.net/u013256816/article/details/51204385)

8. 同步不具备继承性

    当一个线程执行的代码出现异常时，其所持有的锁会自动释放。**同步不具有继承性**（声明为synchronized的父类方法A，在子类中重写之后并不具备synchronized的特性）。

9. wait, notify, notifyAll用法

    只能在同步方法或者同步块中使用wait()方法。在执行wait()方法后，当前线程释放锁（这点与sleep和yield方法不同）。调用了wait函数的线程会一直等待，知道有其他线程调用了同一个对象的notify或者notifyAll方法才能被唤醒，需要注意的是：被唤醒并不代表立刻获得对象的锁，要等待执行notify()方法的线程执行完，即退出synchronized代码块后，当前线程才会释放锁，而呈wait状态的线程才可以获取该对象锁。

    如果调用wait()方法时没有持有适当的锁，则抛出IllegalMonitorStateException，它是RuntimeException的一个子类，因此，不需要try-catch语句进行捕获异常。

    notify方法只会（随机）唤醒一个正在等待的线程，而notifyAll方法会唤醒所有正在等待的线程。如果一个对象之前没有调用wait方法，那么调用notify方法是没有任何影响的。 
    详细可以参考[《JAVA线程间协作：wait.notify.notifyAll》](http://blog.csdn.net/u013256816/article/details/50440123)

    带参数的wait(long timeout)或者wait(long timeout, int nanos)方法的功能是等待某一时间内是否有线程对锁进行唤醒，如果超过这个时间则自动唤醒。

10. 管道

    在Java中提供了各种各样的输入/输出流Stream，使我们能够很方便地对数据进行操作，其中管道流（pipeStream)是一种特殊的流，用于在不同线程间直接传送数据。一个线程发送数据到输出管道，另一个线程从输入管道中读数据，通过使用管道，实现不同线程间的通信，而无须借助类似临时文件之类的东西。在JDK中使用4个类来使线程间可以进行通信：PipedInputStream, PipedOutputStream, PipedReader, PipedWriter。使用代码类似inputStream.connect(outputStream)或outputStream.connect(inputStream)使两个Stream之间产生通信连接。

    ```
    几种进程间的通信方式 
    - 有名管道 (named pipe) ： 有名管道也是半双工的通信方式，但是它允许无亲缘关系进程间的通信。 
    - 信号量( semophore ) ： 信号量是一个计数器，可以用来控制多个进程对共享资源的访问。它常作为一种锁机制，防止某进程正在访问共享资源时，其他进程也访问该资源。因此，主要作为进程间以及同一进程内不同线程之间的同步手段。 
    - 消息队列( message queue ) ： 消息队列是由消息的链表，存放在内核中并由消息队列标识符标识。消息队列克服了信号传递信息少、管道只能承载无格式字节流以及缓冲区大小受限等缺点。 
    - 信号 ( sinal ) ： 信号是一种比较复杂的通信方式，用于通知接收进程某个事件已经发生。 
    - 共享内存( shared memory ) ：共享内存就是映射一段能被其他进程所访问的内存，这段共享内存由一个进程创建，但多个进程都可以访问。共享内存是最快的 IPC 方式，它是针对其他进程间通信方式运行效率低而专门设计的。它往往与其他通信机制，如信号两，配合使用，来实现进程间的同步和通信。 
    - 套接字( socket ) ： 套解口也是一种进程间通信机制，与其他通信机制不同的是，它可用于不同及其间的进程通信。
    ```

11. join方法

    如果一个线程A执行了thread.join()语句，其含义是：当前线程A等待thread线程终止之后才从thread.join()返回。join与synchronized的区别是：join在内部使用wait()方法进行等待，而synchronized关键字使用的是“对象监视器”做为同步。 
    join提供了另外两种实现方法：join(long millis)和join(long millis, int nanos)，至多等待多长时间而退出等待(释放锁)，退出等待之后还可以继续运行。内部是通过wait方法来实现的。

    可以参考一下一个例子：


    ```Java
    System.out.println("method main begin-----");
    Thread t = new Thread(new Runnable(){
        int i = 0;
        @Override
        public void run()
        {
            while(true)
            {
                System.out.println(i++);
                try
                {
                    TimeUnit.MILLISECONDS.sleep(100);
                }
                catch (InterruptedException e)
                {
                    e.printStackTrace();
                }
            }
        }
    });
    t.start();
    t.join(2000);
    System.out.println("method main end-----");
    ```

    运行结果：

    ```
    method main begin-----
    0
    1
    2
    3
    4
    5
    6
    7
    8
    9
    10
    11
    12
    13
    14
    15
    16
    17
    18
    method main end-----
    19
    20
    21
    ```

12. ThreadLocal

    ThreadLocal可以实现每个线程绑定自己的值，即每个线程有各自独立的副本而互相不受影响。一共有四个方法：get, set, remove, initialValue。可以重写initialValue()方法来为ThreadLocal赋初值。如下：

    ```Java
    private static final ThreadLocal<Long> TIME_THREADLOCAL = new ThreadLocal<Long>(){
        @Override
        protected Long initialValue()
        {
            return System.currentTimeMillis();
        }
    };
    ```

    ThreadLocal建议设置为static类型的。 
    使用类InheritableThreadLocal可以在子线程中取得父线程继承下来的值。可以采用重写childValue（Object parentValue）方法来更改继承的值。 
    查看案例：


    ```Java
    public class InheriableThreadLocal {
        public static final InheritableThreadLocal<?> itl = new InheritableThreadLocal<Object>(){
            @Override protected Object initialValue()
            {
                return new Date().getTime();
            }

            @Override protected Object childValue(Object parentValue)
            {
                return parentValue+" which plus in subThread.";
            }
        };

        public static void main(String[] args)
        {
            System.out.println("Main: get value = "+itl.get());
            Thread a = new Thread(new Runnable(){
                @Override public void run()
                {
                    System.out.println(Thread.currentThread().getName()+": get value = "+itl.get());
                }
            });
            a.start();
        }
    }
    ```

    运行结果：

    ```
    Main: get value = 1461585405704
    Thread-0: get value = 1461585405704 which plus in subThread.
    ```

    如果去掉@Override protected Object childValue(Object parentValue)方法运行结果：

    ```
    Main: get value = 1461585396073
    Thread-0: get value = 1461585396073
    ```

    **注意：在线程池的情况下，在ThreadLocal业务周期处理完成时，最好显式的调用remove()方法，清空”线程局部变量”中的值。正常情况下使用ThreadLocal不会造成内存溢出，弱引用的只是threadLocal，保存的值依然是强引用的，如果threadLocal依然被其他对象强引用，”线程局部变量”是无法回收的。**

13. ReentrantLock

    ReentrantLock提供了tryLock方法，tryLock调用的时候，如果锁被其他线程持有，那么tryLock会立即返回，返回结果为false；如果锁没有被其他线程持有，那么当前调用线程会持有锁，并且tryLock返回的结果为true。

    ```Java
    boolean tryLock()
    boolean tryLock(long timeout, TimeUnit unit)
    ```

    可以在构造ReentranLock时使用公平锁，公平锁是指多个线程在等待同一个锁时，必须按照申请锁的先后顺序来一次获得锁。synchronized中的锁时非公平的，默认情况下ReentrantLock也是非公平的，但是可以在构造函数中指定使用公平锁。

    ```Java
    ReentrantLock()
    ReentrantLock(boolean fair)
    ```

    对于ReentrantLock来说，还有一个十分实用的特性，它可以同时绑定多个Condition条件，以实现更精细化的同步控制。 
    ReentrantLock使用方式如下：

    ```Java
    Lock lock = new ReentrantLock();
    lock.lock();
    try{
    }finally{
        lock.unlock();
    }
    ```

14. ReentrantLock中的其余方法

    - int getHoldCount()：查询当前线程保持此锁定的个数，也就是调用lock()方法的次数。
    - int getQueueLength()：返回正等待获取此锁定的线程估计数。比如有5个线程，1个线程首先执行await()方法，那么在调用getQueueLength方法后返回值是4，说明有4个线程在等待lock的释放。
    - int getWaitQueueLength(Condition condition)：返回等待此锁定相关的给定条件Condition的线程估计数。比如有5个线程，每个线程都执行了同一个condition对象的await方法，则调用getWaitQueueLength(Condition condition)方法时返回的int值是5。
    - boolean hasQueuedThread(Thread thread)：查询指定线程是否正在等待获取此锁定。
    - boolean hasQueuedThreads()：查询是否有线程正在等待获取此锁定。
    - boolean hasWaiters(Condition condition)：查询是否有线程正在等待与此锁定有关的condition条件。
    - boolean isFair()：判断是不是公平锁。
    - boolean isHeldByCurrentThread()：查询当前线程是否保持此锁定。
    - boolean isLocked()：查询此锁定是否由任意线程保持。
    - void lockInterruptibly()：如果当前线程未被中断，则获取锁定，如果已经被中断则出现异常。

15. Condition

    一个Condition和一个Lock关联在一起，就想一个条件队列和一个内置锁相关联一样。要创建一个Condition，可以在相关联的Lock上调用Lock.newCondition方法。正如Lock比内置加锁提供了更为丰富的功能，Condition同样比内置条件队列提供了更丰富的功能：在每个锁上可存在多个等待、条件等待可以是可中断的或者不可中断的、基于时限的等待，以及公平的或非公平的队列操作。与内置条件队列不同的是，对于每个Lock，可以有任意数量的Condition对象。Condition对象继承了相关的Lock对象的公平性，对于公平的锁，线程会依照FIFO顺序从Condition.await中释放。

    注意：在Condition对象中，与wait,notify和notifyAll方法对于的分别是await,signal,signalAll。但是，Condition对Object进行了扩展，因而它也包含wait和notify方法。一定要确保使用的版本——await和signal.

    详细可参考[《JAVA线程间协作：Condition》](http://blog.csdn.net/u013256816/article/details/50445241)

16. 读写锁ReentrantReadWriteLock

    读写锁表示也有两个锁，一个是读操作相关的锁，也称为共享锁；另一个是写操作相关的锁，也叫排它锁。也就是多个读锁之间不互斥，读锁与写锁互斥，写锁与写锁互斥。在没有Thread进行写操作时，进行读取操作的多个Thread都可以获取读锁，而进行写入操作的Thread只有在获取写锁后才能进行写入操作。即多个Thread可以同时进行读取操作，但是同一时刻只允许一个Thread进行写入操作。(lock.readlock.lock(), lock.readlock.unlock, lock.writelock.lock, lock.writelock.unlock)

17. Timer的使用

    JDK中的Timer类主要负责计划任务的功能，也就是在指定时间开始执行某一任务。Timer类的主要作用就是设置计划任务，但封装任务的类却是TimerTask类（public abstract class TimerTask extends Object implements Runnable）。可以通过new Timer(true)设置为后台线程。

    有以下几个方法：

    - void schedule(TimerTask task, Date time)：在指定的日期执行某一次任务。如果执行任务的时间早于当前时间则立刻执行。
    - void schedule(TimerTask task, Date firstTime, long period)：在指定的日期之后，按指定的间隔周期性地无限循环地执行某一任务。如果执行任务的时间早于当前时间则立刻执行。
    - void schedule(TimerTask task, long delay)：以当前时间为参考时间，在此基础上延迟指定的毫秒数后执行一次TimerTask任务。
    - void schedule(TimerTask task, long delay, long period）：以当前时间为参考时间，在此基础上延迟指定的毫秒数，再以某一间隔无限次数地执行某一任务。
    - void scheduleAtFixedRate(TimerTask task, Date firstTime, long period)：下次执行任务时间参考上次任务的结束时间，且具有“追赶性”。

    TimerTask是以队列的方式一个一个被顺序执行的，所以执行的时间有可能和预期的时间不一致，因为前面的任务有可能消耗的时间较长，则后面的任务运行时间也会被延迟。 
    TimerTask类中的cancel方法的作用是将自身从任务队列中清除。 
    Timer类中的cancel方法的作用是将任务队列中的全部任务清空，并且进程被销毁。

    **Timer的缺陷：**Timer支持基于绝对时间而不是相对时间的调度机制，因此任务的执行对系统时钟变化很敏感，而ScheduledThreadPoolExecutor只支持相对时间的调度。Timer在执行所有定时任务时只会创建一个线程。如果某个任务的执行时间过长，那么将破坏其他TimerTask的定时精确性。Timer的另一个问题是，如果TimerTask抛出了一个未检查的异常，那么Timer将表现出糟糕的行为。Timer线程并不波或异常，因此当TimerTask抛出为检测的异常时将终止定时线程。

    JDK5或者更高的JDK中已经很少使用Timer.

18. 线程安全的单例模式

    建议不要采用DCL的写法，建议使用下面这种写法：

    ```Java
    public class LazyInitHolderSingleton {  
        private LazyInitHolderSingleton() {  
        }  

        private static class SingletonHolder {  
                private static final LazyInitHolderSingleton INSTANCE = new LazyInitHolderSingleton();  
        }  

        public static LazyInitHolderSingleton getInstance() {  
                return SingletonHolder.INSTANCE;  
        }  
    }
    ```

    或者这种：

    ```Java
    public enum SingletonClass
    {
        INSTANCE;
    }
    ```

19. 线程组ThreadGroup

    为了有效地对一些线程进行组织管理，通常的情况下事创建一个线程组，然后再将部分线程归属到该组中，这样可以对零散的线程对象进行有效的组织和规划。参考以下案例：

    ```Java
    ThreadGroup tgroup = new ThreadGroup("mavelous zzh");
    new Thread(tgroup, new Runnable() {
        @Override
        public void run() {
            System.out.println("A: Begin: "+Thread.currentThread().getName());
            while(!Thread.currentThread().isInterrupted()) {

            }
            System.out.println("A: DEAD: "+Thread.currentThread().getName());
        }
    }).start();
    new Thread(tgroup, new Runnable() {
        @Override
        public void run() {
            System.out.println("B: Begin: "+Thread.currentThread().getName());
            while(!Thread.currentThread().isInterrupted()) {

            }
            System.out.println("B: DEAD: "+Thread.currentThread().getName());
        }
    }).start();
    System.out.println(tgroup.activeCount());
    System.out.println(tgroup.getName());
    System.out.println(tgroup.getMaxPriority());
    System.out.println(tgroup.getParent());
    TimeUnit.SECONDS.sleep(5);
    tgroup.interrupt();
    ```

    输出：

    ```
    A: Begin: Thread-0
    2
    mavelous zzh
    10
    B: Begin: Thread-1
    java.lang.ThreadGroup[name=main,maxpri=10]
    B: DEAD: Thread-1
    A: DEAD: Thread-0
    ```

20. 多线程的异常捕获UncaughtExceptionHandler

    setUncaughtExceptionHandler()的作用是对指定线程对象设置默认的异常处理器。

    ```Java
    Thread thread = new Thread(new Runnable() {
        @Override
        public void run() {
            int a=1/0;
        }
    });
    thread.setUncaughtExceptionHandler(new UncaughtExceptionHandler() {
        @Override
        public void uncaughtException(Thread t, Throwable e) {
            System.out.println("线程："+t.getName()+" 出现了异常："+e.getMessage());
        }
    });
    thread.start();
    ```

    输出：

    ```
    线程：Thread-0 出现了异常：/ by zero 
    ```

    `setDefaultUncaughtExceptionHandler()`方法对所有线程对象设置异常处理器。

    ```Java
    Thread thread = new Thread(new Runnable() {
        @Override
        public void run() {
            int a=1/0;
        }
    });
    Thread.setDefaultUncaughtExceptionHandler(new UncaughtExceptionHandler() {
        @Override
        public void uncaughtException(Thread t, Throwable e) {
            System.out.println("线程："+t.getName()+" 出现了异常："+e.getMessage());
        }
    });
    thread.start();
    ```

    输出同上，注意两者之间的区别。如果既包含setUncaughtExceptionHandler又包含setDefaultUncaughtExceptionHandler那么会被setUncaughtExceptionHandler处理，setDefaultUncaughtExceptionHandler则忽略。更多详细信息参考[《JAVA多线程之UncaughtExceptionHandler——处理非正常的线程中止》](http://blog.csdn.net/u013256816/article/details/50417822)

21.ReentrantLock与synchonized区别

    - ReentrantLock可以中断地获取锁（void lockInterruptibly() throws InterruptedException）
    - ReentrantLock可以尝试非阻塞地获取锁（boolean tryLock()）
    - ReentrantLock可以超时获取锁。通过tryLock(timeout, unit)，可以尝试获得锁，并且指定等待的时间。
    - ReentrantLock可以实现公平锁。通过new ReentrantLock(true)实现。
    - ReentrantLock对象可以同时绑定多个Condition对象，而在synchronized中，锁对象的的wait(), notify(), notifyAll()方法可以实现一个隐含条件，如果要和多于一个的条件关联的对象，就不得不额外地添加一个锁，而ReentrantLock则无需这样做，只需要多次调用newCondition()方法即可。

22. 使用多线程的优势

    更多的处理器核心；更快的响应时间；更好的编程模型。

23. 构造线程

    一个新构造的线程对象是由其parent线程来进行空间分配的，而child线程继承了parent线程的：是否为Daemon、优先级、加载资源的contextClassLoader以及InheritableThreadLocal(参考第12条)，同时还会分配一个唯一的ID来标志这个child线程。

24. 使用多线程的方式

    extends Thread 或者implements Runnable

25. 读写锁

    读写锁在同一时刻可以允许多个读线程访问，但是在写线程访问时，所有的读线程和其他写线程均被阻塞。读写锁维护了一对锁，一个读锁和一个写锁，通过分离读锁和写锁，使得并发性相比一般的排它锁有了很大的提升。Java中使用ReentrantReadWriteLock实现读写锁，读写锁的一般写法如下(修改自JDK7中的示例)：

    ```Java
    class RWDictionary {
        private final Map<String, Object> m = new TreeMap<String, Object>();
        private final ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();
        private final Lock r = rwl.readLock();
        private final Lock w = rwl.writeLock();

        public Object get(String key) {
            r.lock();
            try {
                return m.get(key);
            } finally {
                r.unlock();
            }
        }

        public String[] allKeys() {
            r.lock();
            try {
                return (String[]) m.keySet().toArray();
            } finally {
                r.unlock();
            }
        }

        public Object put(String key, Object value) {
            w.lock();
            try {
                return m.put(key, value);
            } finally {
                w.unlock();
            }
        }

        public void clear() {
            w.lock();
            try {
                m.clear();
            } finally {
                w.unlock();
            }
        }
    }
    ```

26.锁降级

    锁降级是指写锁降级成读锁。如果当前线程拥有写锁，然后将其释放，最后获取读锁，这种分段完成的过程不能称之为锁降级。锁降级是指把持住（当前拥有的）写锁，再获取到读锁，最后释放（先前拥有的）写锁的过程。参考下面的示例：


    ```Java
    private final ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();
    private final Lock r = rwl.readLock();
    private final Lock w = rwl.writeLock();
    private volatile static boolean update = false;

    public void processData() {
        r.lock();
        if(!update) {
            //必须先释放读锁
            r.unlock();
            //锁降级从写锁获取到开始
            w.lock();
            try {
                if(!update) {
                    //准备数据的流程（略）
                    update = true;
                }
                r.lock();
            } finally {
                w.unlock();
            }
            //锁降级完成，写锁降级为读锁
        }

        try {
            //使用数据的流程（略）
        } finally {
            r.unlock();
        }
    }
    ```

    锁降级中的读锁是否有必要呢？答案是必要。主要是为了保证数据的可见性，如果当前线程不获取读锁而是直接释放写锁，假设此刻另一个线程（T）获取了写锁并修改了数据，那么当前线程无法感知线程T的数据更新。如果当前线程获取读锁，即遵循锁降级的步骤，则线程T将会被阻塞，直到当前线程使用数据并释放读锁之后，线程T才能获取写锁进行数据更新。