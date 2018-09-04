# ArrayList

> 引用自[图解集合 1 ：ArrayList](https://mp.weixin.qq.com/s/g1E3GQU1JJzpAxV4zwRKgg)

## 包含元素

ArrayList包含的元素：

|元素|作用|
|---|---|
|transient Object[] elementData;|ArrayList是基于数组的一个实现，elementData就是底层的数组|
|private int size;|ArrayList里面元素的个数，这里要注意一下，size是按照调用add、remove方法的次数进行自增或者自减的，所以add一个null进入ArrayList，size也会加1|

## 关注点

|集合关注点|结论|
|---|---|
|ArrayList是否允许空|允许|
|ArrayList是否允许重复数据|允许|
|ArrayList是否有序|有序|
|ArrayList是否线程安全|非线程安全|

## 关键方法

### 添加元素

```Java
public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    elementData[size++] = e;
    return true;
}
```

将元素添加到elementData中，并将size加1，ensureCapacityInternal方法是用来扩容的。

### 扩容

构造ArrayList时，如果没有指定容量参数capacity，默认的element数组的大小是10。

当底层数组的大小不够时，ArrayList会进行动态扩容。

```Java
private void ensureCapacityInternal(int minCapacity) {
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity);
    }

    ensureExplicitCapacity(minCapacity);
}

private void ensureExplicitCapacity(int minCapacity) {
    modCount++;

    // overflow-conscious code
    if (minCapacity - elementData.length > 0)
        grow(minCapacity);
}

private void grow(int minCapacity) {
    // overflow-conscious code
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + (oldCapacity >> 1); // oldCapacity >> 1相当于oldCapacity / 2，即扩容至原容量的1.5倍
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    // minCapacity is usually close to size, so this is a win:
    elementData = Arrays.copyOf(elementData, newCapacity);
}

private static int hugeCapacity(int minCapacity) {
    if (minCapacity < 0) // overflow
        throw new OutOfMemoryError();
    return (minCapacity > MAX_ARRAY_SIZE) ?
        Integer.MAX_VALUE :
        MAX_ARRAY_SIZE;
}
```

Arrays.copyOf最终调用下面的copyOf方法将数组里的元素复制到新的数组里面去。

```Java
public static <T,U> T[] copyOf(U[] original, int newLength, Class<? extends T[]> newType) {
    @SuppressWarnings("unchecked")
    T[] copy = ((Object)newType == (Object)Object[].class)
        ? (T[]) new Object[newLength]
        : (T[]) Array.newInstance(newType.getComponentType(), newLength);
    System.arraycopy(original, 0, copy, 0,
                        Math.min(original.length, newLength));
    return copy;
}
```
### 删除元素

按下标删除和按元素删除的核心代码如下，根据下标将指定元素后面位置的所有元素，利用System.arraycopy方法整体向前移动一个位置，最后一个位置的元素指定为null，这样让gc可以去回收它。

```Java
int numMoved = size - index - 1;
if (numMoved > 0)
    System.arraycopy(elementData, index+1, elementData, index,
                        numMoved);
elementData[--size] = null; // clear to let GC do its work
```

### 插入元素

```Java
public void add(int index, E element) {
    rangeCheckForAdd(index);

    ensureCapacityInternal(size + 1);  // Increments modCount!!
    System.arraycopy(elementData, index, elementData, index + 1,
                        size - index);
    elementData[index] = element;
    size++;
}
```

插入的时候，按照指定位置，把从指定位置开始的所有元素利用System,arraycopy方法做一个整体的复制，向后移动一个位置（当然先要用ensureCapacityInternal方法进行判断，加了一个元素之后数组会不会不够大），然后指定位置的元素设置为需要插入的元素，完成了一次插入的操作。

## ArrayList的优缺点

- 优点

    1. ArrayList底层以数组实现，是一种随机访问模式，再加上它实现了RandomAccess接口，因此查找也就是get的时候非常快

    1. ArrayList在顺序添加一个元素的时候非常方便，只是往数组里面添加了一个元素而已

- 缺点

    1. 删除元素的时候，涉及到一次元素复制，如果要复制的元素很多，那么就会比较耗费性能

    2. 插入元素的时候，涉及到一次元素复制，如果要复制的元素很多，那么就会比较耗费性能

因此，ArrayList比较适合顺序添加、随机访问的场景。

## ArrayList和Vector的区别

ArrayList是线程非安全的，这很明显，因为ArrayList中所有的方法都不是同步的，在并发下一定会出现线程安全问题。那么我们想要使用ArrayList并且让它线程安全怎么办？一个方法是用Collections.synchronizedList方法把你的ArrayList变成一个线程安全的List，比如：

```Java
List<String> synchronizedList = Collections.synchronizedList(list);
synchronizedList.add("aaa");
synchronizedList.add("bbb");
for (int i = 0; i < synchronizedList.size(); i++){
    System.out.println(synchronizedList.get(i));
}
```

另一个方法就是Vector，它是ArrayList的线程安全版本，其实现90%和ArrayList都完全一样，区别在于：

1. Vector是线程安全的，ArrayList是线程非安全的

1. Vector可以指定增长因子，如果该增长因子指定了，那么扩容的时候会每次新的数组大小会在原数组的大小基础上加上增长因子；如果不指定增长因子，那么就给原数组大小*2，源代码是这样的：

```Java
private void grow(int minCapacity) {
    // overflow-conscious code
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + ((capacityIncrement > 0) ?
                                        capacityIncrement : oldCapacity);
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

## 为什么ArrayList的elementData是用transient修饰的？

看到ArrayList实现了Serializable接口，这意味着ArrayList是可以被序列化的，用transient修饰elementData意味着我不希望elementData数组被序列化。这是为什么？因为序列化ArrayList的时候，ArrayList里面的elementData未必是满的，比方说elementData有10的大小，但是我只用了其中的3个，那么是否有必要序列化整个elementData呢？显然没有这个必要，因此ArrayList中重写了writeObject方法：

```Java
private void writeObject(java.io.ObjectOutputStream s)
    throws java.io.IOException{
    // Write out element count, and any hidden stuff
    int expectedModCount = modCount;
    s.defaultWriteObject();

    // Write out size as capacity for behavioural compatibility with clone()
    s.writeInt(size);

    // Write out all elements in the proper order.
    for (int i=0; i<size; i++) {
        s.writeObject(elementData[i]);
    }

    if (modCount != expectedModCount) {
        throw new ConcurrentModificationException();
    }
}
```

每次序列化的时候调用这个方法，先调用defaultWriteObject()方法序列化ArrayList中的非transient元素，elementData不去序列化它，然后遍历elementData，只序列化那些有的元素，这样：

1. 加快了序列化的速度

1. 减小了序列化之后的文件大小