# 优先级

在操作系统中，线程可以划分优先级，优先级较高的线程得到的CPU资源较多，也就是CPU优先执行优先级较高的线程对象中的任务。

设置线程优先级有助于帮"线程规划器"确定下一次选择哪一个线程来优先执行。

设置线程的优先级使用setPriority()方法，此方法在JDK的源码如下：

```Java
public final void setPriority(int newPriority) {
    ThreadGroup g;
    checkAccess();
    if (newPriority > MAX_PRIORITY || newPriority < MIN_PRIORITY) {
        throw new IllegalArgumentException();
    }
    if((g = getThreadGroup()) != null) {
        if (newPriority > g.getMaxPriority()) {
            newPriority = g.getMaxPriority();
        }
        setPriority0(priority = newPriority);
    }
}
```

在Java中，线程的优先级分为1~10这10个等级，如果小于1或者大于10，则抛出IllegalArgumentException异常。

Thread类中有三个常量预置定义优先级的值：

```Java
public final static int MIN_PRIORITY = 1;

public final static int NORM_PRIORITY = 5;

public final static int MAX_PRIORITY = 10;
```

线程优先级特性：

- 继承性：比如A线程启动B线程，则B线程的优先级与A是一样的。

- 规则性：高优先级的线程总是大部分先执行完，但不代表高优先级线程全部先执行完。

- 随机性：优先级较高的线程不一定每一次都先执行完。