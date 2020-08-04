字符串匹配算法有很多，比较简单的、好理解的有 BF 算法和 RK 算法。比较难理解、但更加高效的有 BM 算法和 KMP 算法。

这些都是单模式串匹配的算法，也就是一个串跟一个串进行匹配。除此之外，还有多模式串匹配算法，也就是一个串同时匹配查找多个串，分别是 Trie 树和 AC 自动机。

## BF 算法

BF 算法中的 BF 是 Brute Force 的缩写，中文叫做暴力匹配算法，也叫朴素匹配算法。

首先，理解下**主串**和**模式串**的概念。比方说，在字符串 A 中查找字符串 B，那字符串 A 就是**主串**，字符串 B 就是**模式串**。我们把主串的长度记为 n，模式串的长度记为 m，那在主串中查找模式串，就有 n > m。

BF算法思想概况：**在主串中，检查起始位置分为是0、1、2…n-m 且长度为 m 的 n - m + 1 个子串，查找和模式串匹配的**

![img](https://static001.geekbang.org/resource/image/f3/a2/f36fed972a5bdc75331d59c36eb15aa2.jpg)

这种算法的最坏情况时间复杂度是 O(n*m)。尽管理论上，BF 算法的时间复杂度很高，但在实际开发中，却是一个比较常用的字符串匹配算法。原因如下

- 实际开发中，大部分情况下，模式串和主串的长度都不会太长。而且当匹配中途遇到不能匹配的字符时，就可以停止匹配了，不需要每次都匹配对比 m 个字符。所以实际算法执行效率要高很多
- BF 算法的思想简单，代码实现也简单。简单意味着不容易出错。

```java
public static int BF(String a, String b){
  int m = a.length();
  int n = b.length();
  int k;
  char[] a1 = a.toCharArray();
  char[] b1 = b.toCharArray();
  
  for(int i = 0; i <= m - n; i++){
    k = 0;
    for(int j = 0; j < n; j++){
      if(a1[i + j] == b1[j]){
        k++;
      }else{
        break;
      }
    }
    if(k == n) return i;
  }
  
  return -1;
}
```

## RK 算法

RK 算法的全称叫做 Rabin-Karp 算法，是由两位发明者 Rabin 和 Karp 的名字来命名的。

RK 算法思想：通过哈希算法对主串中 n - m + 1 个子串分别求哈希值，然后逐个与模式串的哈希值比较大小。如果某个子串的哈希值与模式串相等，那就说明对应的子串和模式串匹配了（暂不考虑哈希冲突问题）。因为哈希值是一个数字，数字之间比较是否相等时非常快速的，所以匹配效率就提高了。

![img](https://static001.geekbang.org/resource/image/01/ee/015c85a9c2a4adc11236f9a40c6d57ee.jpg)

不过，通过哈希算法计算子串的哈希值的时候，我们需要遍历子串中的每个字符，这样算法的整体效率并没有提高。要提高哈希算法的效率，就需要设计比较巧妙的哈希算法了。

我们假设要匹配的字符集中只包含 K 个字符，用一个 K 进制数来表示一个子串，这个 K 进制数转化成十进制数，作为子串的哈希值。

![img](https://static001.geekbang.org/resource/image/d5/04/d5c1cb11d9fc97d0b28513ba7495ab04.jpg)

这个哈希算法有一个特点，在主串上，相邻的两个子串的哈希值的计算公式有一定关系。

![img](https://static001.geekbang.org/resource/image/c4/9c/c47b092408ebfddfa96268037d53aa9c.jpg)

这样设计的哈希值可能会很大，很容易超过计算机中整型数据可以表示的范围。上面这种哈希算法是没有散列冲突的。为了让哈希值落在整型数据范围内，可以牺牲一下，允许哈希冲突，这时候该如何设计呢？

举个例子，让一个字母对应一个数字，把字符串中每个字母对应的数字相加，最后得到的和作为哈希值。

这样得到的数据范围就要小很多，但是哈希冲突的概率也挺高。可以使用每个字母从小到大对应一个素数等方式，降低哈希冲突概率。这时候如果模式串和子串的哈希值相等，还需要对比一下模式串和子串，这样可以避免哈希冲突导致的哈希值相同但不匹配的问题。

所以，如果存在大量的哈希冲突，会导致 RK 算法的时间复杂度退化，效率下降。极端情况下会退化到 O(n*m)。但一般情况下，冲突不会很多，RK 算法的效率还是比 BF 算法高。

RK 算法整体的时间复杂度为 O(n)，我们还可以一边对比哈希值一边比较，而不用提前计算再比较等方式降低比较次数与哈希算法计算次数。

```java
public static int RK(String a, String b){
  int m = a.length();
  int n = b.length();
  int s, j;
  int[] hash = new int[m - n + 1];
  int[] table = new int[26];
  char[] a1 = a.toCharArray();
  char[] b1 = b.toChartArray();
  s = 1;
  
  for(j = 0; j < 26; j++){
    table[j] = s;
    s *= 26;
  }
  
  for(int i = 0; i <= m - n; i++){
    s = 0;
    for(j = 0; j < n; j++){
      s += (a1[i + j] - 'a') * table[n - 1 - j];
    }
    hash[i] = s;
  }
  
  s = 0;
  
  for(j = 0; j < n; j++){
    s += (b1[j] - 'a') * table[n - 1 - j];
  }
  
  for(j = 0; j < m - n + 1; j++){
    if(hash[j] == s){
      return j;
    }
  }
  
  return -1;
}
```

## BM 算法

BM 算法的全称是 Boyer-Moore 算法，是一种非常高效的字符串匹配算法，它的性能实验统计是 KMP 算法的 3 到 4 倍。

### BM 算法的核心思想

我们把模式串和主串匹配的过程，看做是模式串在主串中不停的往后滑动。当遇到不匹配的字符时，BF 算法和 RK 算法的做法是，模式串往后移动一位，然后从模式串的第一个字符开始重新匹配。

![img](https://static001.geekbang.org/resource/image/43/f9/4316dd98eac500a01a0fd632bb5e77f9.jpg)

这个例子中，主串中的 c，在模式串中是不存在的，所以，模式串往后滑动的时候，只要 c 与模式串重合，肯定是无法匹配的。所以，我们可以一次性把模式串往后多滑动几位，把模式串移动到 c 的后面。

![img](https://static001.geekbang.org/resource/image/cf/15/cf362f9e59c01aaf40a34d2f10e1ef15.jpg)

当遇到不匹配的字符时，找到这个固定的规律，将模式串往后多滑动几位，就可以把匹配的效率提高。BM 算法，本质上就是在寻找这种规律。

### BM 算法原理分析

BM 算法包含两部分，分别是**坏字符规则（bad character rule）**和**好后缀规则（good suffix shift）**。

- **坏字符规则**

  在 BF 算法和 RK 算法中，匹配的过程中，我们是按模式串的下标从小到大的顺序，依次与主串中的字符进行匹配的。这种匹配顺序符合我们的思维习惯，而 BM 算法的匹配顺序比较特别，它是按照模式串下标从大到小的顺序倒着匹配的。

  ![img](https://static001.geekbang.org/resource/image/54/9e/540809418354024206d9989cb6cdd89e.jpg)

  从模式串的末尾往前倒着匹配，当我们发现某个字符没法匹配的时候。我们把这个没有匹配的字符叫做**坏字符**（主串中的字符）。

  ![img](https://static001.geekbang.org/resource/image/8f/2e/8f520fb9d9cec0f6ea641d4181eb432e.jpg)

  当发生不匹配的时候，把坏字符对应的模式串中的字符下标记做 si。如果坏字符在模式串中存在，把这个坏字符在模式串中的下标记做 xi。如果不存在，xi 记做 -1。那模式串往后移动的位数就等于 si - xi。

  利用坏字符规则，BM 算法在最好情况下的时间复杂度非常低为 O(n/m)。

- **好后缀规则**

  好后缀规则和坏字符规则的思路很类似。

  ![img](https://static001.geekbang.org/resource/image/d7/8a/d78990dbcb794d1aa2cf4a3c646ae58a.jpg)

  如果在模式串中找不到另一个等于 {u} 的子串，我们直接将模式串滑动到主串中 {u} 的后面。如果好后缀在模式串中不存在可匹配的的子串，那在一步一步往后滑动模式串的过程中，只要主串中的 {u} 与模式串有重合的时候，那肯定就无法完全匹配。但是当模式串滑动到前缀与主串中 {u} 的后缀有部分重合的时候，并且重合的部分相等的时候，就有可能存在完全匹配的情况。

  ![img](https://static001.geekbang.org/resource/image/05/23/0544d2997d8bb57c10e13ccac4015e23.jpg)

  针对这种情况，我们不仅要看好后缀在模式串中，是否有另一个匹配的子串，还要考察好后缀的后缀子串，是否跟模式串的前缀子串匹配。

### BM 算法代码实现

```java
// a,b 表示主串和模式串；n,m 表示主串和模式串的长度
public int BM(char[] a, int n, char[] b, int m){
  // 记录模式串中每个字符最后出现的位置
  int[] bc = new int[SIZE];
  // 构建坏字符哈希表
  generateBC(b, m, bc);
  int[] suffix = new int[m];
  boolean[] prefix = new boolean[m];
  generateGS(b, m, suffix, prefix);
  int i = 0;
  while(i <= n - m){
    // j 表示主串与模式串匹配的第一个字符
    int j;
    // 模式串从后往前匹配
    for(j = m - 1; j >= 0; --j){
			// 坏字符对应模式串的下标是 j
      if(a[i + j] != b[j]) break;
    }
    if(j < 0){
      // 匹配成功，返回主串与模式串第一个匹配的字符的位置
      return i;
    }
    int x = j - bc[(int)a[i + j]];
    int y = 0;
    if(j < m - 1){
      // 如果有好后缀的话
      y = moveByGS(j, m, suffix, prefix)
    }
    i = i + Math.max(x, y);
  }
  return -1;
}

// j 表示坏字符对应的模式串中的字符下标；m 表示模式串长度
private int moveByGS(int j, int m, int[] suffix, boolean[] prefix){
  // 好后缀长度
  int k = m - 1 - j;
  if(suffix[k] != -1) return j - suffix[k] + 1;
  for(int r = j + 2; r <= m - 1; ++r){
    if(prefix[m - r] == true){
      return r;
    }
  }
  return m;
}
```

## KMP 算法

KMP 算法是根据三位作者（D.E.Knuth、J.H.Morris、V.R.Pratt）的名字来命名的，算法的全称是 Knuth Morris Pratt 算法，简称 KMP 算法。

KMP 算法的核心思想与 BM 算法非常相近。在模式串和主串匹配的过程中，当遇到不可匹配的字符的时候，希望找到一些规律，可以将模式串往后多滑动几位，跳过那些肯定不回匹配的情况。

这里我们类比一下，在模式串和主串匹配的过程中，把不能匹配的那个字符仍然叫做**坏字符**，把已经匹配的那段字符串叫做**好前缀**。

![img](https://static001.geekbang.org/resource/image/17/be/17ae3d55cf140285d1f34481e173aebe.jpg)