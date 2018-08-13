# Java集合杂谈

Java 中的集合类在开发过程中经常被使用，本文介绍了集合相关的一些知识。

<!--more-->

#### ArrayList 的 remove 方法
我们首先从一个常见的面试题切入，代码如下：

代码1
```Java
List<String> a = new ArrayList<>(100);
a.add("1");
a.add("2");
for (String temp : a) {
    if ("1".equals(temp)) {
        a.remove(temp);
        System.out.println("1---");
    } else {
        System.out.println("2---");
    }
}
```

【注】这里的 foreach 循环实际上等价于：
```Java
Iterator<String> iterator = a.iterator();
while (iterator.hasNext()) {
    String temp = iterator.next();
    if ("1".equals(temp)) {
        a.remove(temp);
        System.out.println("1---");
    } else {
        System.out.println("2---");
    }
}
```

《Java核心技术》中有写道：
> "for each" 循环可以与任何实现了 Iterable 接口的对象一起工作，这个接口只包含一个方法：
    ```Java
    public interface Iterable<E> {
        Iterator<E> iterator();
    }
    ```

> Collection 接口扩展了 Iterable 接口。因此，对于标准类库中的任何集合都可以使用 "for each" 循环。

那么这段代码的运行结果是什么呢？结果是：
```
1---
```

以下是该题的另外两段代码：

代码2
```Java
List<String> a = new ArrayList<>(100);
a.add("1");
a.add("2");
a.add("1");
for (String temp : a) {
    if ("1".equals(temp)) {
        a.remove(temp);
        System.out.println("1---");
    } else {
        System.out.println("2---");
    }
}
```

代码3
```Java
List<String> a = new ArrayList<>(100);
a.add("1");
a.add("2");
a.add("1");
for (String temp : a) {
    if ("1".equals(temp)) {
        System.out.println("1---");
    } else {
        a.remove(temp);
        System.out.println("2---");
    }
}
```

运行结果分别是：

代码2运行结果
```
1---
Exception in thread "main" java.util.ConcurrentModificationException
	at java.util.ArrayList$Itr.checkForComodification(ArrayList.java:901)
	at java.util.ArrayList$Itr.next(ArrayList.java:851)
```

代码3运行结果
```
1---
2---
```

首先看 ArrayList.remove() 的实现：
```Java
public boolean remove(Object o) {
    if (o == null) {
        for (int index = 0; index < size; index++)
            if (elementData[index] == null) {
                fastRemove(index);
                return true;
            }
    } else {
        for (int index = 0; index < size; index++)
            if (o.equals(elementData[index])) {
                fastRemove(index);
                return true;
            }
    }
    return false;
}

private void fastRemove(int index) {
    modCount++;
    int numMoved = size - index - 1;
    if (numMoved > 0)
        System.arraycopy(elementData, index+1, elementData, index,
                            numMoved);
    elementData[--size] = null; 
}
```

【注】System.arraycopy() 方法可以实现数组之间的复制。依次接收四个参数 Object src（源数组）, int srcPos（源数组要复制的起始位置）, Object dest（目的数组）, int destPos（目的数组放置的起始位置）, int length（复制的长度）。该方法可以实现自己到自己复制，其实现过程为：先生成一个长度为 length 的临时数组，将源数组中 srcPos 到 srcPos + length - 1 之间的数组拷贝到临时数组中，再执行 System.arraycopy(临时数组,srcPos,数组,destPos,length)。需要注意的是源数组和目的数组必须是同类型或是可以进行类型转换的数组。

然后是 ArrayList 中 iterator() 方法的实现：
```Java
private class Itr implements Iterator<E> {
    int cursor;       // index of next element to return
    int lastRet = -1; // index of last element returned; -1 if no such
    int expectedModCount = modCount;

    public boolean hasNext() {
        return cursor != size;
    }

    @SuppressWarnings("unchecked")
    public E next() {
        checkForComodification();
        int i = cursor;
        if (i >= size)
            throw new NoSuchElementException();
        Object[] elementData = ArrayList.this.elementData;
        if (i >= elementData.length)
            throw new ConcurrentModificationException();
        cursor = i + 1;
        return (E) elementData[lastRet = i];
    }

    public void remove() {
        if (lastRet < 0)
            throw new IllegalStateException();
        checkForComodification();

        try {
            ArrayList.this.remove(lastRet);
            cursor = lastRet;
            lastRet = -1;
            expectedModCount = modCount;
        } catch (IndexOutOfBoundsException ex) {
            throw new ConcurrentModificationException();
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public void forEachRemaining(Consumer<? super E> consumer) {
        Objects.requireNonNull(consumer);
        final int size = ArrayList.this.size;
        int i = cursor;
        if (i >= size) {
            return;
        }
        final Object[] elementData = ArrayList.this.elementData;
        if (i >= elementData.length) {
            throw new ConcurrentModificationException();
        }
        while (i != size && modCount == expectedModCount) {
            consumer.accept((E) elementData[i++]);
        }
        // update once at end of iteration to reduce heap write traffic
        cursor = i;
        lastRet = i - 1;
        checkForComodification();
    }

    final void checkForComodification() {
        if (modCount != expectedModCount)
            throw new ConcurrentModificationException();
    }
}
```

查看源码之后可以发现 代码1 和 代码3 的运行逻辑：
`a.remove()` -> `fastremove()` 会使得 a 的 size 减 1，而此时的 cursor 已经等于 size - 1 了，继续循环调用 iterator.hasNext() 方法会返回 false 导致循环结束。

代码2 的运行逻辑：
`modCount` 用于记录 iterator 的操作次数，成功调用 iterator 的 remove 方法会将 expectedModCount 与 modCount 进行同步。`a.remove()` 调用的并不是 iterator 的 remove() 方法，而是 ArrayList 的 remove() 方法，remove 之后并没有将 expectedModCount 进行更新，此时继续调用 iterator.next() 会触发 checkForComodification() 检查从而抛出 ConcurrentModificationException异常。 