# Callable

在Java中，使用ExecutorService、Callable、Future可以实现有返回结果的多线程。

ExecutorService、Callable、Future都是属于Executor框架中的功能类。详细了解Executor框架可以参考[java并发编程-Executor框架](http://www.iteye.com/topic/366591)。返回结果的线程是在JDK1.5中引入的新特征。

可返回值的任务必须实现Callable接口，类似的，无返回值的任务必须实现Runnable接口。执行Callable任务后，可以获取一个Future对象，在该对象上调用get方法就可以获取到Callable任务返回的Object了，再结合线程池接口ExecutorService就可以实现有返回结果的多线程了。

```Java
public class MultiThreadSample {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        long startTime = System.currentTimeMillis();
        int taskSize = 5;
        // 创建一个线程池
        ExecutorService pool = Executors.newFixedThreadPool(taskSize);
        // 创建多个有返回值的任务
        List<Future> list = new ArrayList<>();
        for (int i = 0; i < taskSize; i++) {
            Callable callable = new MyCallable(i);
            // 执行任务并获取Future对象
            Future future = pool.submit(callable);
            list.add(future);
        }
        // 关闭线程池
        pool.shutdown();
        for (Future future : list) {
            // 从Future对象获取任务的返回值
            System.out.println(future.get().toString());
        }
        System.out.println("程序总的运行时间：" + (System.currentTimeMillis() - startTime) + "ms");
    }

    static class MyCallable implements Callable<Object> {
        private int taskNum;

        public MyCallable(int taskNum) {
            this.taskNum = taskNum;
        }

        @Override
        public Object call() throws Exception {
            long startTime = System.currentTimeMillis();
            Thread.sleep(1000);
            return "任务[" + taskNum + "]耗时：" + (System.currentTimeMillis() - startTime) + "ms";
        }
    }
}
```

代码说明：

Executors类提供了一系列工厂方法用于创建线程池，返回的线程池都实现了ExecutorService接口。

- `public static ExecutorService newFixedThreadPool(int nThreads);`：创建固定数目线程的线程池。

- `public static ExecutorService newCachedThreadPool();`：创建一个可缓存的线程池，调用execute将重用以前构造的线程（如果线程可用）。如果现有线程没有可用的，则创建一个新线程并添加到线程池中。终止并从缓存中移除那些已经超过60秒钟未被使用的线程。

- `public static ExecutorService newSingleThreadExecutor();`：创建一个单线程化的Executor。

- `public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize);`：创建一个支持定时及周期性的任务执行的线程池，多数情况下可用来替代Timer类。

ExecutorService提供了submit()方法，传递一个Callable或Runnable，返回Future。如果Executor后台线程池还没有完成Callable的计算，则调用返回Future对象的get()方法，会阻塞直到计算完成。