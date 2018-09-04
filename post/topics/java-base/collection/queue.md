# Queue相关

## 类图

![Queue类图](/images/Queue相关/Queue类图.png)

Queue用于模拟"队列"这种数据结构，其特性为FIFO先进先出。队列的头部保存着队列中存放时间最长的元素，队列的尾部保存着队列中存放时间最短的元素。新元素插入（offer）到队列的尾部，访问元素（poll）操作会返回队列头部的元素，队列不允许随机访问元素。

## Queue实现类

### PriorityQueue

PriorityQueue优先级队列，它并不是一个比较标准的队列实现，PriorityQueue保存元素的顺序并不是按照加入队列的顺序，而是按照队列元素的大小进行排序的。

### Deque

Deque双端队列接口，双端队列可以同时从两端来添加、删除元素，因此Deque的实现类既可以当成队列使用、也可以当成栈使用。

### ArrayDeque

ArrayDeque是一个基于数组的双端队列，和ArrayList类似，它们的底层都采用一个可动态扩容的Object[]数组来存储集合元素。
