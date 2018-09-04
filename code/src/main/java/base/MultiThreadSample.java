package base;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

/**
 * @author yupaits
 * @date 2018/7/3
 */
public class MultiThreadSample {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        long startTime = System.currentTimeMillis();
        int taskSize = 5;
        // 创建一个线程池
        ExecutorService pool = Executors.newFixedThreadPool(taskSize);
        // 创建多个有返回值的任务
        List<Future> list = new ArrayList<>();
        for (int i = 0; i < taskSize; i++) {
            Callable<Object> callable = new MyCallable(i);
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
