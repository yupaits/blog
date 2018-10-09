# 单例模式

保证一个类仅有一个实例，并提供一个访问它的全局访问点。

## 双重锁检测

```Java
public class Singleton {
    // 单例对象
    private volatile static Singleton instance = null;

    // 私有构造方法
    private Singleton() {}
    
    public static Singleton getInstance() {
        if (install == null) {                      // 双重检测机制
            synchronized (Singleton.class) {        // 同步锁
                if (instance == null) {             // 双重检测机制
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

- 为了防止new Singleton被执行多次，因此在new操作之前加上Synchronized 同步锁，锁住整个类（注意，这里不能使用对象锁）。

- 进入Synchronized 临界区以后，还要再做一次判空。因为当两个线程同时访问的时候，线程A构建完对象，线程B也已经通过了最初的判空验证，不做第二次判空的话，线程B还是会再次构建instance对象。

- 经过volatile的修饰，当线程A执行instance = new Singleton的时候，JVM执行顺序是什么样？始终保证是下面的顺序：

    ```Java
    memory =allocate();     //1：分配对象的内存空间 
    ctorInstance(memory);   //2：初始化对象 
    instance =memory;       //3：设置instance指向刚分配的内存地址 
    ```

    如此在线程B看来，instance对象的引用要么指向null，要么指向一个初始化完毕的Instance，而不会出现某个中间态，保证了安全。

## 静态内部类

```Java
public class Singleton {
    private static class LazyHolder {
        private static final Singleton INSTANCE = new Singleton();
    }

    private Singleton() {}

    public static Singleton getInstance() {
        return LazyHolder.INSTANCE;
    }
}
```

- 从外部无法访问静态内部类LazyHolder，只有当调用Singleton.getInstance方法的时候，才能得到单例对象INSTANCE。

- INSTANCE对象初始化的时机并不是在单例类Singleton被加载的时候，而是在调用getInstance方法，使得静态内部类LazyHolder被加载的时候。因此这种实现方式是利用classloader的加载机制来实现懒加载，并保证构建单例的线程安全。

## 枚举

```Java
public enum Singleton {
    INSTANCE;
}
```

::: tip 总结
|单例模式实现|是否线程安全|是否懒加载|是否防止反射构建|
|---|---|---|---|
|双重锁检测|是|是|否|
|静态内部类|是|是|否|
|枚举|是|否|是|
:::

**参考资料：**

[漫画：什么是单例模式？（整合版）](https://mp.weixin.qq.com/s/1fQkkdtzYh_OikbYJnmZWg)