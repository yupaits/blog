# 常见锁

**基础概念：**

- 并发（Concurrency）：一个处理器“同时”处理多个任务

- 并行（Parallelism）：多个处理器“同时”处理多个任务

## 互斥锁（Mutex）

- 同步块 synchronized block

- 对象锁 object.lock()

- 可重入锁

可重入锁，也叫做递归锁，指的是同一线程外层方法获得锁之后，内层递归方法仍然有获取该锁的代码，但不受影响。ReentrantLock和synchronized都是可重入锁。

在lock方法内，应验证线程是否为已经获得锁的线程。当unlock()第一次调用时，实际上不应释放锁。（采用计数进行统计）

可重入锁最大的特点是避免死锁。

```Java
public class Test implements Runnable{

    public synchronized void get(){
        System.out.println(Thread.currentThread().getId());
        set();
    }

    public synchronized void set(){
        System.out.println(Thread.currentThread().getId());
    }

    @Override
    public void run() {
        get();
    }
    public static void main(String[] args) {
        Test ss=new Test();
        new Thread(ss).start();
        new Thread(ss).start();
        new Thread(ss).start();
    }
}
```

```
返回结果：

9
9
11
11
10
10
```

```Java
public class Test implements Runnable {
	ReentrantLock lock = new ReentrantLock();

	public void get() {
		lock.lock();
		System.out.println(Thread.currentThread().getId());
		set();
		lock.unlock();
	}

	public void set() {
		lock.lock();
		System.out.println(Thread.currentThread().getId());
		lock.unlock();
	}

	@Override
	public void run() {
		get();
	}

	public static void main(String[] args) {
		Test ss = new Test();
		new Thread(ss).start();
		new Thread(ss).start();
		new Thread(ss).start();
	}
}
```

## 信号量（Semaphore）

- 公平和非公平

公平信号量的效果是线程的启动顺序与调用Semaphore.acquire（）顺序有关，即先启动的线程优先得到许可。

非公平信号量的效果是与线程的启动顺序与调用Semaphore.acquire（）顺序无关，也就是说先启动的线程并不一定先获得许可。

- 实现原理

Semaphore是用来保护一个或者多个共享资源的访问，Semaphore内部维护了一个计数器，其值为可以访问的共享资源的个数。一个线程要访问共享资源，先获得信号量，如果信号量的计数器值大于1，意味着有共享资源可以访问，则使其计数器值减去1，再访问共享资源。

如果计数器值为0,线程进入休眠。当某个线程使用完共享资源后，释放信号量，并将信号量内部的计数器加1，之前进入休眠的线程将被唤醒并再次试图获得信号量。

## 乐观锁（CAS）

[深入理解乐观锁与悲观锁](http://www.hollischuang.com/archives/934)

[乐观锁的一种实现方式——CAS](http://www.hollischuang.com/archives/1537)

- ABA问题：无锁堆栈实现

[CAS 和ABA问题](https://blog.csdn.net/u012834750/article/details/69387975)