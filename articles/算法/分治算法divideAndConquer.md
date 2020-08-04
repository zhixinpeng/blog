**创新并非离我们很远，创新的源泉来自对事物本质的认识。无数优秀架构设计的思想来源都是基础的数据结构和算法，这本身就是算法的一个魅力所在。**



什么是分治算法，将原问题划分为n个规模较小，并且结构和原问题相似的子问题，递归的解决这些小问题，然后再合并结果，得到原问题的解。

分治算法是一种思想，递归是一种编程技巧。实际上，分治算法一般都比较适合用递归来实现。

分治算法能解决的问题，一般需要满足下面这几个条件：

- 原问题与分解成的小问题具有相同的模式
- 原问题分解成的子问题可以独立求解，子问题之间没有相关性，这一点是分支算法跟动态规划的明显区别
- 具有分解终止条件，也就是说，当问题足够小时，可以直接求解
- 可以将子问题合并成原问题，而这个合并操作的复杂度不能太高

## 示例

如果编程求出一组数据的有序对个数或者逆序度个数？

![img](https://static001.geekbang.org/resource/image/e8/32/e835cab502bec3ebebab92381c667532.jpg)

使用归并排序，将两个有序的小数组，合并成一个有序数组。在合并过程中，每次合并操作都可以计算逆序度个数，再把计算出来的逆序度个数求和，就是这个数组的逆序对个数。

```java
private int num = 0;

public int count(int[] a, int n){
  num = 0;
  // a 代表原数组，n 代表数组长度
  mergeSortCounting(a, 0, n-1);
  return num
}

private void mergeSortCounting(int[] a, int left, int right){
  if(left >= right) return;
  int center = (left + right) / 2;
  mergeSortCounting(a, left, center);
  mergeSortCounting(a, center+1, right);
  merge(a, left, center, right);
}

private void merge(int[] a, int left, int center, int right){
  int leftIndex = left, rightIndex = center + 1, start = 0;
  int[] temp = new int[right - left + 1];
  while(leftIndex <= center && rightIndex <= right){
    if(a[leftIndex] <= a[rightIndex]){
      temp[start++] = a[leftIndex++];
    } else {
      // 统计 left 和 right 之间，比 a[rightIndex] 大的元素个数
      num += center - leftIndex + 1;
      temp[start++] = a[rightIndex++];
    }
  }
  // 处理左边剩余元素
  while(leftIndex <= center){
    temp[start++] = a[leftIndex++]
  }
  // 处理右边剩余元素
  while(rightIndex <= right){
    temp[start++] = a[rightIndex++]
  }
  // 从 temp 将元素拷贝回 a
  for(int i = 0; i <= right - left; ++i){
    a[left + i] = temp[i]
  }
}
```

