---
title: LinkedList
date: 2020-02-04 09:41:37
category: Java基础
tags: 
  - Java
  - LinkedList
---

# LinkedList

> 引用自[图解集合 2 ：LinkedList](https://mp.weixin.qq.com/s/oA0D1BjzBi7z0Xuvt4O-PQ)

## 定义

LinkedList是基于链表实现的，所以先讲解一下什么是链表。链表原先是C/C++的概念，是一种线性的存储结构，意思是将要存储的数据存在一个存储单元里面，这个存储单元里面除了存放有待存储的数据以外，还存储有其下一个存储单元的地址（下一个存储单元的地址是必要的，有些存储结构还存放有其前一个存储单元的地址），每次查找数据的时候，通过某个存储单元中的下一个存储单元的地址寻找其后面的那个存储单元。

这么讲可能有点抽象，先提一句，LinkedList是一种双向链表，双向链表我认为有两点含义：

1. 链表中任意一个存储单元都可以通过向前或者向后寻址的方式获取到其前一个存储单元和其后一个存储单元

1. 链表的尾节点的后一个节点是链表的头结点，链表的头结点的前一个节点是链表的尾节点

## 包含元素

LinkedList既然是一种双向链表，必然有一个存储单元，看一下LinkedList的基本存储单元，它是LinkedList中的一个内部类：

```Java
private static class Node‹E› {
    E item;
    Node‹E› next;
    Node‹E› prev;

    Node(Node‹E› prev, E element, Node‹E› next) {
        this.item = element;
        this.next = next;
        this.prev = prev;
    }
}
```

看到LinkedList的Node中的"E element"，就是它真正存储的数据。"Node‹E› next"和"Node‹E› prev"表示的就是这个存储单元的前一个存储单元的引用地址和后一个存储单元的引用地址。

除了存储单元外，LinkedList还定义了size、first头节点、last尾节点三个属性。

```Java
transient int size = 0;

/**
 * Pointer to first node.
 * Invariant: (first == null && last == null) ||
 *            (first.prev == null && first.item != null)
 */
transient Node‹E› first;

/**
 * Pointer to last node.
 * Invariant: (first == null && last == null) ||
 *            (last.next == null && last.item != null)
 */
transient Node‹E› last;
```

## 关注点

|集合关注点|结论|
|---|---|
|LinkedList是否允许空|允许|
|LinkedList是否允许重复数据|允许|
|LinkedList是否有序|有序|
|LinkedList是否线程安全|非线程安全|

## 关键方法

### 添加元素

```Java
public boolean add(E e) {
    linkLast(e);
    return true;
}

void linkLast(E e) {
    final Node‹E› l = last;
    final Node‹E› newNode = new Node<>(l, e, null);
    last = newNode;
    if (l == null)
        first = newNode;
    else
        l.next = newNode;
    size++;
    modCount++;
}
```

添加元素的过程为：获取列表原来的尾节点，并新建一个节点，该节点的前置节点为原来的尾节点，后置节点为null。将列表的尾节点更新为新建的节点。原列表没有元素时，将列表的头节点设置为新建节点，反之更新原尾节点的后置节点为新建的节点。列表的size加1。

### 查看元素

```Java
public E get(int index) {
    checkElementIndex(index);
    return node(index).item;
}

Node‹E› node(int index) {
    // assert isElementIndex(index);

    if (index < (size >> 1)) {
        Node‹E› x = first;
        for (int i = 0; i < index; i++)
            x = x.next;
        return x;
    } else {
        Node‹E› x = last;
        for (int i = size - 1; i > index; i--)
            x = x.prev;
        return x;
    }
}
```

由于LinkedList是双向链表，所以LinkedList既可以向前查找，也可以向后查找。当index小于数组大小的一半的时候（size >> 1表示size / 2，使用移位运算提升代码运行效率），向后查找；否则，向前查找。

这样，在我的数据结构里面有10000个元素，刚巧查找的又是第10000个元素的时候，就不需要从头遍历10000次了，向后遍历即可，一次就能找到我要的元素。

### 删除元素

```Java
public E remove(int index) {
    checkElementIndex(index);
    return unlink(node(index));
}

E unlink(Node‹E› x) {
    // assert x != null;
    final E element = x.item;
    final Node‹E› next = x.next;
    final Node‹E› prev = x.prev;

    if (prev == null) {
        first = next;
    } else {
        prev.next = next;
        x.prev = null;
    }

    if (next == null) {
        last = prev;
    } else {
        next.prev = prev;
        x.next = null;
    }

    x.item = null;
    size--;
    modCount++;
    return element;
}
```

将删除元素前置节点的后置指向删除元素的后置节点，将删除元素后置节点的前置指向删除元素的前置节点，并将元素内容设为null。

待删除节点的prev、item、next设为null是为了让虚拟机可以回收这个Node。

按照Java虚拟机HotSpot采用的垃圾回收检测算法—-根节点搜索算法来说，即使prev、item、next不设置为null也是可以回收这个Node的，因为此时这个Node已经没有任何地方会指向它了，所以这块Node会被当做"垃圾"对待。之所以还要将prev、item、next设置为null，我认为可能是为了兼容另外一种垃圾回收检测算法—-引用计数法，这种垃圾回收检测算法，只要对象之间存在相互引用，那么这块内存就不会被当作"垃圾"对待。

### 插入元素

```Java
public void add(int index, E element) {
    checkPositionIndex(index);

    if (index == size)
        linkLast(element);
    else
        linkBefore(element, node(index));
}

void linkLast(E e) {
    final Node‹E› l = last;
    final Node‹E› newNode = new Node<>(l, e, null);
    last = newNode;
    if (l == null)
        first = newNode;
    else
        l.next = newNode;
    size++;
    modCount++;
}

void linkBefore(E e, Node‹E› succ) {
    // assert succ != null;
    final Node‹E› pred = succ.prev;
    final Node‹E› newNode = new Node<>(pred, e, succ);
    succ.prev = newNode;
    if (pred == null)
        first = newNode;
    else
        pred.next = newNode;
    size++;
    modCount++;
}
```

如果插入元素的位置在列表尾，直接在尾部添加元素；插入的位置不在列表尾则在该位置原来的元素前插入新的元素。

## LinkedList和ArrayList的对比

1. 顺序插入速度ArrayList会比较快，因为ArrayList是基于数组实现的，数组是事先new好的，只要往指定位置塞一个数据就好了；LinkedList则不同，每次顺序插入的时候LinkedList将new一个对象出来，如果对象比较大，那么new的时间势必会长一点，再加上一些引用赋值的操作，所以顺序插入LinkedList必然慢于ArrayList

1. 基于上一点，因为LinkedList里面不仅维护了待插入的元素，还维护了Entry的前置Entry和后继Entry，如果一个LinkedList中的Entry非常多，那么LinkedList将比ArrayList更耗费一些内存

1. 数据遍历的速度，看最后一部分，这里就不细讲了，结论是：使用各自遍历效率最高的方式，ArrayList的遍历效率会比LinkedList的遍历效率高一些

1. 有些说法认为LinkedList做插入和删除更快，这种说法其实是不准确的：

    - LinkedList做插入、删除的时候，慢在寻址，快在只需要改变前后Entry的引用地址

    - ArrayList做插入、删除的时候，慢在数组元素的批量copy，快在寻址

所以，如果待插入、删除的元素是在数据结构的前半段尤其是非常靠前的位置的时候，LinkedList的效率将大大快过ArrayList，因为ArrayList将批量copy大量的元素；越往后，对于LinkedList来说，因为它是双向链表，所以在第2个元素后面插入一个数据和在倒数第2个元素后面插入一个元素在效率上基本没有差别，但是ArrayList由于要批量copy的元素越来越少，操作速度必然追上乃至超过LinkedList。

从这个分析看出，如果你十分确定你插入、删除的元素是在前半段，那么就使用LinkedList；如果你十分确定你删除、删除的元素在比较靠后的位置，那么可以考虑使用ArrayList。如果你不能确定你要做的插入、删除是在哪儿呢？那还是建议你使用LinkedList吧，因为一来LinkedList整体插入、删除的执行效率比较稳定，没有ArrayList这种越往后越快的情况；二来插入元素的时候，弄得不好ArrayList就要进行一次扩容，记住，ArrayList底层数组扩容是一个既消耗时间又消耗空间的操作，在我的文章Java代码优化中，第9点有详细的解读。

## LinkedList以及ArrayList的迭代

ArrayList使用最普通的for循环遍历，LinkedList使用forEach循环比较快，看一下两个List的定义：


```Java
public class ArrayList‹E› extends AbstractList‹E›
        implements List‹E›, RandomAccess, Cloneable, java.io.Serializable
```

```Java
public class LinkedList‹E›
    extends AbstractSequentialList‹E›
    implements List‹E›, Deque‹E›, Cloneable, java.io.Serializable
```

注意到ArrayList是实现了RandomAccess接口而LinkedList则没有实现这个接口，关于RandomAccess这个接口的作用，看一下JDK API上的说法：

```Java
/**
 * Marker interface used by <tt>List</tt> implementations to indicate that
 * they support fast (generally constant time) random access.  The primary
 * purpose of this interface is to allow generic algorithms to alter their
 * behavior to provide good performance when applied to either random or
 * sequential access lists.
 *
 * <p>The best algorithms for manipulating random access lists (such as
 * <tt>ArrayList</tt>) can produce quadratic behavior when applied to
 * sequential access lists (such as <tt>LinkedList</tt>).  Generic list
 * algorithms are encouraged to check whether the given list is an
 * <tt>instanceof</tt> this interface before applying an algorithm that would
 * provide poor performance if it were applied to a sequential access list,
 * and to alter their behavior if necessary to guarantee acceptable
 * performance.
 *
 * <p>It is recognized that the distinction between random and sequential
 * access is often fuzzy.  For example, some <tt>List</tt> implementations
 * provide asymptotically linear access times if they get huge, but constant
 * access times in practice.  Such a <tt>List</tt> implementation
 * should generally implement this interface.  As a rule of thumb, a
 * <tt>List</tt> implementation should implement this interface if,
 * for typical instances of the class, this loop:
 * <pre>
 *     for (int i=0, n=list.size(); i &lt; n; i++)
 *         list.get(i);
 * </pre>
 * runs faster than this loop:
 * <pre>
 *     for (Iterator i=list.iterator(); i.hasNext(); )
 *         i.next();
 * </pre>
 *
 * <p>This interface is a member of the
 * <a href="{@docRoot}/../technotes/guides/collections/index.html">
 * Java Collections Framework</a>.
 *
 * @since 1.4
 */
public interface RandomAccess {
}
```

测试代码：

```Java
public class ListTest {
    private static final int SIZE = 500000;

    private static void linkedListTimeTest(List<Integer> list) {
        System.out.println("LinkedList测试：");
        listLoop(list);
    }

    private static void arrayListTimeTest(List<Integer> list) {
        System.out.println("ArrayList测试：");
        listLoop(list);
    }

    private static void listLoop(List<Integer> list) {
        long startTime = System.currentTimeMillis();
        for (int i = 0; i < list.size(); i++) {
            list.get(i);
        }
        System.out.println("普通for循环耗时：" + (System.currentTimeMillis() - startTime) + "ms");
        startTime = System.currentTimeMillis();
        for (Integer i : list) {
        }
        System.out.println("forEach循环耗时：" + (System.currentTimeMillis() - startTime) + "ms");
        startTime = System.currentTimeMillis();
        list.forEach(integer -> {});
        System.out.println("lambda表达式forEach循环耗时：" + (System.currentTimeMillis() - startTime) + "ms");
    }

    public static void main(String[] args) {
        List<Integer> arrayList = new ArrayList<>(SIZE);
        List<Integer> linkedList = new LinkedList<>();
        for (int i = 0; i < SIZE; i++) {
            arrayList.add(i);
            linkedList.add(i);
        }
        arrayListTimeTest(arrayList);
        linkedListTimeTest(linkedList);
    }
}
```

测试结果：

```
ArrayList测试：
普通for循环耗时：0ms
forEach循环耗时：15ms
lambda表达式forEach循环耗时：90ms
LinkedList测试：
普通for循环耗时：265710ms
forEach循环耗时：16ms
lambda表达式forEach循环耗时：0ms
```