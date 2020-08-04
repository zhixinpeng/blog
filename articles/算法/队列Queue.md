队列与栈一样，也是一种**操作受限的线性表数据结构**。**先进先出，这就是典型的队列**，只支持两个操作：**入队 enqueue()**和**出队 dequeue()**。

## 顺序队列和链式队列

用数组实现的队列叫做**顺序队列**，用链表实现的队列叫做**链式队列**。

```java
// 基于数组实现顺序队列
public class ArrayQueue {
  // 数组 items，数组大小 n
  private String[] items;
  private int n = 0;
  // head 表示队头下标，tail 表示队尾下标
  private int head = 0;
  private int tail = 0;
  
  // 申请一个大小为 capacity 的数组
  public ArrayQueue(int capacity){
    items = new String[capacity];
    n = capacity;
  }
  
  // 入队
  public boolean enqueue(String item){
    // tail == n 表示队列末尾没有空间
    if(tail == n){
      // tail == n && head == 0，表示整个队列都占满了
      if(head == 0) return false;
      // 数据搬移
      for(int i = head; i < tail; ++i){
        items[i - head] = items[i]
      }
      // 搬移完之后重新更新 head 和 tail
      tail -= head;
      head = 0;
    }
    
    items[tail] = item;
    ++tail;
    return true;
  }
  
  // 出队
  public String dequeue(){
    // 如果 head == tail 表示队列为空
    if(head == tail) return null;
    String ret = items[head];
    ++head;
    return ret;
  }
}
```

基于链表实现链式队列。入队时，tail->next=new_node，tail=tail->next；出队时，head=head->next。

![img](https://static001.geekbang.org/resource/image/c9/93/c916fe2212f8f543ddf539296444d393.jpg)

## 循环队列

![img](https://static001.geekbang.org/resource/image/58/90/58ba37bb4102b87d66dffe7148b0f990.jpg)

通过循环队列，可以避免数据搬移操作，要写出循环队列的代码，最重要的是，**确定好队空和队满的判定条件**。

![img](https://static001.geekbang.org/resource/image/3d/ec/3d81a44f8c42b3ceee55605f9aeedcec.jpg)

总结规律可以发现，当队满时，**(tail + 1) % n = head**，队空时，**head == tail**。

```java
public class CircularQueue{
  // 数组 items，数组大小 n
  private String[] items;
  private int n = 0;
  // head 表示队头下标，tail 表示队尾下标
  private int head = 0;
  private int tail = 0;
  
  // 申请一个大小为 capacity 的数组
  public CircularQueue(int capacity){
    items = new String[capacity];
    n = capacity;
  }
  
  // 入队
  public boolean enqueue(String item){
    // 队列满了
    if((tail + 1) % n == head) return false;
    items[tail] = item;
    tail = (tail + 1) % n;
    return true;
  }
  
  // 出队
  public String dequeue(){
    // 队列空了
    if(head == tail) return null;
    String ret = items[head];
    head = (head + 1) % n;
    return ret;
  }
}
```

## 阻塞队列和并发队列

阻塞队列就是在队列的基础上增加了阻塞操作。简单来说，就是在队列为空的时候，从队头取数据会被阻塞。因此此时还没有数据可取，知道队列中有了数据才能返回；如果队列已经满了，那么插入数据的操作就会被阻塞，直到队列中有空闲位置后再插入数据，然后再返回。

在多线程情况下，会有多个线程同时操作队列，这个时候回存在线程安全的问题。

线程安全的队列叫做**并发队列**。最简单直接的方式是直接在 enqueue()、dequeue()方法上加锁。实际上，基于数组的循环队列，利用 CAS 原子操作，可以实现非常高效的并发队列。这也是循环队列比链式队列应用更加广泛的原因。

## 总结

线程池没有空闲线程时，新的任务请求线程资源时，线程池该如何处理？

我们一般有两种处理策略。第一种是非阻塞的处理方式，直接拒绝任务请求；另一种是阻塞的处理方式，将请求排队，等到有空闲线程时，再取出排队的请求进行处理。

那如何存储排队的请求呢，这时候就很适合用队列这种数据结构来存储。队列有基于数组和基于链表两种实现方式，这两种方式对于排队请求又有什么区别？

基于链表的实现方式，可以实现一个支持无限排队的无界队列（unbounded queue），但是可能会导致过多的请求排队等待，请求处理的响应时间过长。

基于数组实现的有界队列（bounded queue），队列的大小有限，所以线程池中排队的请求超过队列大小时，接下来的请求就会被拒绝。