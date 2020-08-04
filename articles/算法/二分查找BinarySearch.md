二分查找（Binary Search）算法，也叫折半查找算法，是一种针对有序数据集合的查找算法。

# 无处不在的二分思想

二分查找是一种非常简单易懂的快速查找算法。比如，做一个猜字游戏。随机写一个 0 到 99 之间的数字，猜写的是什么。猜的过程中，每猜一次，告诉你是大了还是小了，直到猜中为止。

![img](https://static001.geekbang.org/resource/image/9d/9b/9dadf04cdfa7b3724e0df91da7cacd9b.jpg)

**二分查找针对的是一个有序的数据集合，查找思想有点类似分治思想。每次都通过跟区间的中间元素对比，将待查找的区间缩小为之前的一半，直到找到要查找的元素，或者区间被缩小为 0**。

# O(logn) 惊人的查找速度

二分查找是一种非常高效的查找算法，时间复杂度是 O(logn)。

![img](https://static001.geekbang.org/resource/image/d1/94/d1e4fa1542e187184c87c545c2fe4794.jpg)

O(logn) 这种**对数时间复杂度**，是一种极其高效的时间复杂度，有时候比 O(1) 的算法还要高效。

这是因为 logn 是一个非常恐怖的数量级，即使 n 非常大，对应的 logn 也很小。比如 2 的 32 次方，大概是 42 亿，其 logn 为 32。也就是说，如果我们在 42 亿个数据中用二分查找查找一个数据，最多需要 32 次。

而 O(1) 这种时间复杂度，会忽略掉常数、系数和低阶。对于常量级时间复杂度算法来说，O(1) 可能表示一个很大的值。所以常量级时间复杂度算法有时候可能还没有 O(logn) 的算法执行效率高。

# 二分查找的递归与非递归实现

**最简单的情况**就是**有序数组中不存在重复元素**

```java
// 二分查找的循环实现
public int binarySearch(int[] a, int n, int value){
  int low = 0;
  int high = n - 1;
  
  while(low <= high){
    int mid = (low + high) / 2;
    if(a[mid] == value){
      return mid;
    }else if(a[mid] < value){
      low = mid + 1;
    }else {
      high = mid - 1;
    }
  }
  
  return -1;
}
```

这里有**3个容易出错的地方**

- 循环退出条件

  是 low <= high 而不是 low < high

- mid 的取值

  实际上，mid = (low + high) / 2 这种写法是有问题的。因为当 low 和 high 比较大的话，两者之和很有可能溢出。改进的方法是写成 mid = low + (high - low) / 2。更进一步的话，使用位运算 mid = low + ((high - low) >> 1)。

- low 和 high 的更新

  low = mid + 1 和 hight = mid - 1

```java
// 二分查找的递归实现
public int binarySearch(int[] a, int n, int value){
  return binarySearchInternally(a, 0, n - 1, value);
}

private int binarySearchInternally(int[] a, int low, int high, int value){
  if(low > high) return -1;
  
  int mid = low + ((high - low) >> 1);
  if(a[mid] == value){
    return mid;
  }else if(a[mid] < value){
    return binarySearchInternally(a, mid + 1, high, value);
  }else{
    return binarySearchInternally(a, low, mid - 1, value);
  }
}
```

# 二分查找的局限性

- 二分查找依赖的是顺序表结构，简单点说就是数组

  二分查找算法需要按照下标随机访问元素，如果使用链表的数据结构，访问元素的时间复杂度会很高。

- 二分查找针对的是有序数据

  如果数据是无序的，需要先排序。排序的时间复杂度最近是 O(nlogn)，如果我们针对的是一组静态数据，没有频繁的插入删除，则依次排序可进行多次二分查找，排序成本将被分摊。但是，如果数据有频繁的插入和删除操作，要么在每次二分查找前进行排序，要么保证每次插入删除操作之后都保证数据有序。这时候就不适合二分查找。

- 数据量太小不适合二分查找

  小数据量二分查找和顺序查找都差不多。

- 数据量太大也不适合二分查找

  二分查找依赖于数组这种数据结构，而数组为了支持随机访问的特性，要求内存空间连续，对内存空间比较严格。所以大数据占用大量内存需要申请大量的连续内存空间就比较吃力了。

# 四种常见的二分查找变形问题

## 查找第一个值等于给定值的元素

```java
pubic int binarySearch(int[] a, int n, int value){
  int low = 0;
  int high = n - 1;
  
  while(low <= high){
    int mid = low + ((high - low) >> 1);
    if(a[mid] > value){
      high = mid - 1;
    }else if(a[mid] < value){
      low = mid + 1;
    }else {
      if((mid == 0) || (a[mid - 1] != value)) return mid;
      else high = mid - 1;
    }
  }
  
  return -1;
}
```



## 查找最后一个值等于给定值的元素

```java
public int binarySearch(int[] a, int n, int value){
  int low = 0;
  int high = n - 1;
  
  while(low <= high){
    int mid = low + ((high - low) >> 1);
    if(a[mid] > value){
      high = mid - 1;
    }else if(a[mid] < value){
      low = mid + 1;
    }else{
      if((mid == n - 1) || (a[mid + 1] != value)) return mid;
      else low = mid + 1;
    }
  }
  
  return -1;
}
```

## 查找第一个大于等于给定值的元素

```java
public int binarySearch(int[] a, int n, int value){
  int low = 0;
  int high = n - 1;
  
  while(low <= high){
    int mid = low + ((high - low) >> 1);
    if(a[mid] >= value){
      if((mid == 0) || (a[mid - 1] < value)) return mid;
      else high = mid - 1;
    }else{
      low = mid + 1;
    }
  }
  
  return -1;
}
```

## 查找最后一个小于等于给定值的元素

```java
public int binarySearch(int[] a, int n, int value){
  int low = 0;
  int high = n - 1;
  
  while(low <= high){
    int mid = low + ((high - low) >> 1);
    if(a[mid] <= value){
      if((mid == n - 1) || (a[mid + 1] > value)) return mid;
      else low = mid + 1;
    }else{
      high = mid - 1;
    }
  }
  
  return -1;
}
```

# 总结

凡是能用二分查找解决的，绝大部分都我们都更倾向于用散列表或者二叉查找树。即使是二分查找在内存使用上更节省。但是毕竟内存如此紧缺的情况并不多。

二分查找更适合用在”近似“查找问题上，在这类问题上，二分查找的优势更加明显。比如以上四种变体问题，用散列表和二叉树实现就比较麻烦了。

写二分查找的变体算法需要注意以下细节：**终止条件**、**区间上下界更新方法**、**返回值选择**。