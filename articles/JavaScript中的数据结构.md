# JavaScript 中的数据结构

## 介绍

随着业务逻辑越来越多的从后端转向前端,专业的前端工程知识变的更加关键。作为前端的工程师，我们依赖像 React 这样的库来开发 view 层,同时又依赖 Redux 这样的库来管理数据状态，两者组合起来作为响应式编程，当数据动态变化时，UI 层可以实时的更新。渐渐地，后端可以专注于 api 的开发，仅仅提供数据的检索和更新。这样实际上，后端只是将数据库转发到前端，前端工程师处理所有的逻辑，微服务和 graphql 的日益增长证明了这个趋势。

如今，前端工程师不仅要精通 html 和 css，也要精通 JavaScript。随着客户端的数据存储成为服务器端数据库的“副本”，熟悉惯用数据结构就变得至关重要。事实上，工程师的经验水平可以从他/她区分何时以及为什么使用特定数据结构的能力中推断出来。

```
Bad programmers worry about the code. Good programmers worry about data structures and their relationships.

— Linus Torvalds, Creator of Linux and Git
```

在高等级上，有 3 中类型的数据结构, 栈和队列是类数组的结构，它们只是在插入和删除数据上有所不同。链表、树和图是拥有节点的结构，并且节点有对其他节点的指针。哈希表依赖哈希函数保存和定位数据。

就复杂性而言，队列和栈是最简单的,可以由链表构造，树和图是最复杂的，因为它们在链表的结构上进行了扩展。哈希表需要利用这些数据结构来可靠地执行。就效率而言，链表最适合记录和存储数据，哈希表最适合检索数据。

下文将解释并说明应该在何时使用这些数据结构。

## Stack

可以说 JavaScript 中最重要的堆栈是调用堆栈，每当函数执行时，会把函数的作用域推入栈中。在编程方式上而言，栈只是一个包含 pop 和 push 操作的数组结构,Push 增加元素到数组的顶端,Pop 移除数组元素在相同的位置,换句话说，栈结构遵循“后进先出”的原则(LIFO)。

```javascript
class Stack {
  constructor() {
    this.list = [];
  }

  push(...item) {
    this.list.push(...item);
  }

  pop() {
    this.list.pop();
  }
}
```

## Queue

JavaScript 是一种事件驱动的编程语言，它支持非阻塞操作。在浏览器内部，只有一个线程来运行所有的 JavaScript 代码,使用事件循环来注册事件,为了支持单线程环境中的异步性(为了节省 CPU 资源和增强 web 体验)，回调函数只有在调用堆栈为空时才会退出队列并执行。Promise 依赖于这个事件驱动的体系结构，允许异步代码的“同步风格”执行，而不会阻塞其他操作。

在编程方式上而言，队列是只包含一个 unshift 和 pop 操作的数组结构,Unshift 将数据项加入队列的末尾，Pop 从数组的顶部将元素出列,换句话说，队列遵循“先进先出”的原则（FIFO）。

```javascript
class Queue {
  constructor() {
    this.list = [];
  }

  enqueue(...item) {
    this.list.unshift(...item);
  }

  dequeue() {
    this.list.pop();
  }
}
```

## Linked List

与数组相似，链表按顺序存储数据元素。链表不保存索引，而是保存指向其他数据项的指针。第一个节点成为头节点，最后一个节点成为尾节点。在单链表中，每个节点只有指向下一个节点的指针，头部是每次检索开始的地方，在双链表中，每个节点还有指向前一个节点的指针,因此双链表可以从尾部开始向前检索。

链表在插入和删除元素时有固定的时间，因为可以改变指针。但是在数组中执行相同的操作需要线性时间，因为后续需要移位。此外，只要有空间，链表就可以增长。然而，即使是自动调整大小的“动态”数组也可能变得异常昂贵。但是要查找或编辑链表中的元素，我们可能需要遍历整个长度，这等于线性时间。然而，对于数组索引来说，这样的操作是微不足道的。

与数组一样，单链表也可以作为堆栈来操作,只要让头部成为唯一可以插入和移除元素的地方。双链表可以作为队列来操作，只要在尾部插入元素，在头部移除元素。对于大量的数据来说，这种实现队列的方法比数组性能更好，因为数组的 shift 和 unshift 操作需要线性的时间在后续重新索引每个元素。

链表结构在客户端和服务端都是常用的。在客户端，像 Rudex 这样的状态管理库以链表的方式构建其中间件逻辑。当 action 被 dispatch 后，它们从一个中间件到另外一个中间件直到到达 ruducer。在服务端，像 Express 这样的 web 框架也以类似的方式构造它的中间件逻辑,当一个 request 到达时，它会按顺序从一个中间件到另一个中间件，直到发出响应。

**单链表的简单实现**

```javascript
class LinkList {
  constructor() {
    this.head = null;
  }

  find(value) {
    let curNode = this.head;
    while (curNode.value !== value) {
      curNode = curNode.next;
    }
    return curNode;
  }

  findPrev(value) {
    let curNode = this.head;
    while (curNode.next !== null && curNode.next.value !== value) {
      curNode = curNode.next;
    }
    return curNode;
  }

  insert(newValue, value) {
    const newNode = new Node(newValue);
    const curNode = this.find(value);
    newNode.next = curNode.next;
    curNode.next = newNode;
  }

  delete(value) {
    const preNode = this.findPrev(value);
    const curNode = preNode.next;
    preNode.next = preNode.next.next;
    return curNode;
  }
}

class Node {
  constructor(value, next) {
    this.value = value;
    this.next = null;
  }
}
```

## Hash Table

哈希表类似于字典结构，由键值对组成。每个对在内存中的地址有一个哈希函数确定,该函数接受一个 key 作为参数，并返回一个检索该对的内存地址。如果两个或者多个 key 转为相同的地址，则可能会发送冲突。为了健壮性，getter 和 setter 应该预测这些事件，以确保所有数据都可以恢复，并且没有覆盖任何数据。

如果已经知道的地址是整数序列，可以简单地使用数组来存储键值对。对于更复杂的映射，我们可以使用 maps 或者 objects, 哈希表的插入和查找元素的时间平均为常数，如果 key 表示地址，就不需要散列，一个简单的对象就足够了。哈希表实现键和值之间的简单对应，键和地址之间的简单关联，但是牺牲了数据之间的关系。所以，哈希表在存储数据方面不是最优的。

如果一个应用倾向于检索而不是存储数据，那么在查找、插入和删除方面，没有其他数据结构能够与哈希表的速度相匹配。因此哈希表被广泛应用也就不足为奇了。从数据库到服务端，再到客户端，哈希表尤其是哈希函数对应用程序的性能和安全方面是至关重要的。数据库的查询速度很大程度上依赖于指向记录的索引按顺序保存。这样，二进制搜索就可以在对数时间内完成，特别是对于大的数据来说，这是一个巨大的性能优势。

在客户端和服务端,许多流行的库都用缓存来最大程度提升性能。通过在哈希表中保存输入和输出的记录,对于相同的输入，函数仅运行一次。流行的 Reselect 库使用这种缓存策略来优化启动了 Redux 应用程序的 mapStateToProps 函数。实际上，JavaScript 引擎还利用名为调用栈的哈希表存储所有我们创建的变量。这些变量可以通过调用栈上的指针被访问到。

互联网本身也依赖于哈希算法来安全运行。互联网的结构是这样的：任何计算机都可以通过互相连接的 web 设备与其他计算机通信。每当一个设备登录到互联网上，它也可以成为一个路由器，数据流可以通过它进行传输。然而这是一把双刃剑。分散式架构意味着网络中的任何设备都可以监听并篡改它帮助转发的数据包。MD5 和 SHA256 等哈希函数在防止中间人攻击方面发挥着关键作用。HTTPS 上的电子商务之所以安全，只是因为使用了这些散列函数。

受 Internet 的启发，区块链技术通过使用哈希函数对每个区块的数据创建一个不可变的“指纹”，本质上建立了一个可以在 web 上被公开的完整数据库，任何人都可以查看和贡献。从结构上看，区块链就是加密散列的二叉树单链表。哈希非常神秘，任何人都可以创建和更新一个财务交易数据库。曾经只有政府和中央银行才能做到的事情，现在任何人都可以安全地创造自己的货币!

随着越来越多的数据库走向开放，要求前端工程师可以抽象出所有底层密码的复杂性。在未来，应用程序主要的区别将是用户体验。

一个简单的不做冲突处理的哈希表

```javascript
class HashTable {
  constructor(size) {
    this.table = new Array(size);
  }
  hash(key) {
    // hash函数
    // 将字符串中的每个字符的ASCLL码值相加，再对数组的长度取余
    let total = 0;
    for (let i = 0; i < key.length; k++) {
      total += key.charCodeAt(i);
    }
    return total % this.table;
  }
  insert(key, value) {
    const hashKey = this.hash(key);
    this.table[hashKey] = value;
  }
  get(key) {
    const hashKey = this.hash(key);
    if (!this.table[hashKey]) {
      return null;
    }
    return this.table[hashKey];
  }
  getAll() {
    const table = [];
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i] != undefined) {
        table.push(this.table[i]);
      }
    }
    return table;
  }
}
```

## 总结

这些数据结构可以在任何地方被找到，从数据库到服务端再到前端，甚至 JavaScript 引擎自身。随着逻辑层越来越多的从后端移向前端，前端的数据层变得至关重要。对这一层的恰当的管理需要掌握逻辑所依赖的数据结构。没有一种数据结构适合所有情况，因为对一个属性进行优化总是会影响另外的属性。一些数据结构对于存储数据是非常高效的，然而另外的数据结构对于搜索元素来说更加高效。在一种极端情况下，链表是存储的最佳选择，可以被分成堆栈和队列(线性时间)。另一方面，没有其他结构可以匹配哈希表的搜索速度(常数时间)。树的结构性能位于两者之间(对数时间)，图表可以描述自然界最复杂的结构。
