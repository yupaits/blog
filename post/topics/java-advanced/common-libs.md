# 常用Java类库

## Runtime类

- JVM虚拟机注册一个钩子，当虚拟机要关闭时，会执行预先注册的线程任务。

```Java
Runtime.getRuntime().addShutdownHook(new Thread() {
    public void run() {
        try {
            logger.info("## stop the canal client");
            clientTest.stop();
        } catch (Throwable e) {
            logger.warn("##something goes wrong when stopping canal:\n{}", ExceptionUtils.getFullStackTrace(e));
        } finally {
            logger.info("## canal client is down.");
        }
    }
});
```

[ShutdownHook - java中优雅地停止服务](https://mp.weixin.qq.com/s/z5bfW8OJOYMK-fzSzDOkdg)

- 获取JVM的内存空间信息

## 字符串拼接

- StringBuffer 线程安全

- StringBuilder 非线程安全，适用于单线程，速度快

## 日期操作

- Date

- Calendar

- DateFormat

- SimpleDateFormat

- LocalDate、LocalTime、LocalDateTime、Instant、Period、Duration（Java8的java.time包下新的日期时间操作类）

## Math类

数学操作相关，提供一系列的数学操作方法。比如：求平方根，两数的最大值，两数的最小值，四舍五入，2的3次方，绝对值，三角函数等。

## Random类

可以指定一个随机数的范围，然后产生此范围内的任意数字。

## DecimalFormat

Format的一个子类，可以根据用户自定义的格式来格式化数字

```Java
DecimalFormat df=new DecimalFormat("###,###.###");
df.format(1234232.1456);

结果
1,234,232.146
```

## BigInteger

大整数类。如果在操作时一个整型数据超过了Long类型整数的最大长度，可以使用此类。

提供了一系列方法，用于基本运算。

## BigDecimal

float和double无法做到准确的精度计数，如果需要精确的计算结果，可以使用此类。

注：通常涉及到钱的计算，比如交易订单各种折扣、优惠混合计算，最好使用此类。

## Arrays

数组元素的查找、数组内容的填充、排序等。

## Comparable接口

比较器，排序时使用。

```Java
public interface Comparable<T> {
    public int compareTo(T o);
}
```

与Arrays.sort(Object[] a)方法或者Collections.sort(List list)方法组合使用。当类没有实现Comparable接口时，可以使用Comparator接口实现该类的比较逻辑。

```Java
java.util.Collections.sort(List, Comparator<? super T>)
```