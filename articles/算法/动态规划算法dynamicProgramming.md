动态规划适合用来求解最优问题，比如最大值、最小值等。

## 初识动态规划

1. 01背包问题

   在回溯算法中，我们穷举搜索所有可能的装法，然后找出满足条件的最大值，复杂度是指数级别的。

   优化：我们把求解过程分为 n 个阶段，每个阶段会决策物品是否放入背包中。把每一层重复的状态合并，只记录不同的状态。这样可以保证每一层状态的个数都不会超过 w 个（w 表示背包的承重量）。这样成功避免了每层状态个数的指数级增加。

   用一个二维数组 `states[n][w+1]` 来记录每层可以达到的不同状态。

   第 0 个物品的重量是 2，产生两种状态 `states[0][0]` 和 `states[0][2]` 。

   第 1 个物品的重量是2，产生三种状态 `states[1][0]` 、 `states[1][2]` 和 `states[1][4]` 。

   依次类推，知道考察完所有物品之后，整个 `states` 状态数组就计算好了，在最后一层找到最接近 `w` 的值，就是背包中物品总重量的最大值。

   ![img](https://static001.geekbang.org/resource/image/aa/b5/aaf51df520ea6b8056f4e62aed81a5b5.jpg)

   ![img](https://static001.geekbang.org/resource/image/bb/7e/bbbb934247219db8299bd46dba9dd47e.jpg)

   ```java
   // weight 物品重量，n 物品个数，w 背包可承载重量
   public int knapsack(int[] weight, int n, int w){
     boolean[][] states = new boolean[n][w + 1];
     // 第一行的数据要特殊处理，可以利用哨兵优化
     states[0][0] = true;
     if(weight[0] <= w){
       states[0][weight[0]] = true;
     }
     // 动态规划状态转移
     for(int i = 1; i < n; ++i){
       // 第 i 个物品不放入背包，那继承上一个物品放入时的重量
       for(int j = 0; j <= w; ++j){
         if(states[i - 1][j] == true) states[i][j] = states[i -1][j];
       }
       // 第 i 个物品放入背包，则累加重量
       for(int j = 0; j <= w - weight[i]; ++j){
         if(states[i - 1][j] == true) states[i][j + weight[i]] = true;
       }
     }
     // 输出结果
     for(int i = w; i >= 0; --i){
       if(states[n - 1][i] == true) return i;
     }
     return 0;
   }
   ```

   上面代码使用了一个 `n * w + 1` 的二维数组，对空间消耗较多，我们也可以使用一维数组来解决这个问题。这个数组中只存储能出现的物品总重量。

   ```java
   public static int knapsack2(int[] items, int n, int w){
     boolean[] states = new boolean[w + 1];
     states[0] = true;
     if(items[0] <= w){
       states[items[0]] = true;
     }
     // 动态规划
     for(int i = 1; i < n; ++i){
       // 把第 i 个物品放入背包，从后往前遍历，这样可以读取到之前存取到的最大重量
       for(int j = w - items[i]; j >= 0; --j){
         if(states[j] == true) states[j + items[i]] = true;
       }
     }
     // 输出结果
     for(int i = w; i >= 0; --i){
       if(states[i] == true) return i;
     }
     return 0;
   }
   ```

2. 01背包问题升级版

   之前的背包问题，只涉及到背包重量和物品重量，现在再引入物品价值这一变量，要求在满足背包最大重量限制的前提下，背包中可装入物品的总价值最大是多少呢？

   首先采用回溯算法解题

   ```java
   // 结果放到 maxV 中
   private int maxV = Integer.MIN_VALUE;
   // 物品的重量
   private int[] items = {2, 2, 4, 6, 3};
   // 物品的价值
   private int[] value = {3, 4, 8, 9, 6};
   // 物品个数
   private int n = 5;
   // 背包承受的最大重量
   private int w = 9;
   // 调用 f(0, 0, 0)
   public void f(int i, int cw, int cv){
     // cw = w 表示装满了，i == n 表示物品考察完了
     if(cw == w || i == n){
       if(cv > maxV) maxV = cv;
       return;
     }
     // 选择不装第 i 个物品
     f(i + 1, cw, cv);
     // 选择装第 i 个物品
     if(cw + weight[i] <= w){
       f(i + 1, cw + weight[i], cv + value[i]);
     }
   }
   ```

   采用回溯算法在递归树中会发现有重复的 i 和 cw 节点产生不同的价值，我们应该舍弃产生价值小的节点。使用动态规划算法，用二维数组 `states[n][w + 1]` 来记录每层可以达到的不同状态。此时数组存储的值就是当前状态对应的最大总价值。

   ```java
   public static int knapsack3(int[] weight, int[] value, int n, int w){
     int[][] states = new int[n][w + 1];
     // 初始化 states
     for(int i = 0; i < n; ++i){
       for(int j = 0; j < w + 1; ++j){
         states[i][j] = -1;
       }
     }
     states[0][0] = 0;
     if(weight[0] <= w){
       states[0][weight[0]] = value[0]
     }
     // 动态规划，状态转移
     for(int i = 1; i < n; ++i){
       // 不选择第 i 个物品
       for(int j = 0; j <= w; ++j){
         // 当前节点的总价值和上一个节点的总价值一致
         if(states[i - 1][j] >= 0) states[i][j] = states[i - 1][j];
       }
       // 选择第 i 个物品
       for(int j = 0; j <= w - weight[i]; ++j){
         if(states[i - 1][j] >= 0){
           int v = states[i - 1][j] + value[i];
           // 同一重量的产生价值可能不同，舍弃价值小的
           if(v > states[i][j + weight[i]]){
             states[i][j + weight[i]] = v;
           }
         }
       }
     }
     // 找出最大值
     int maxvalue = -1;
     for(int j = 0; j <= w; ++j){
       if(states[n - 1][j] > maxvalue) maxvalue = states[n - 1][j];
     }
     return maxvalue;
   }
   ```

3. 淘宝购物问题

   购物车中有 n 个想买的商品，希望在满足 “满 200 元减 50 元” 的促销活动中，让选择出来的商品价格综合最大程度的接近满减条件。

   不但要求找到大于等于 200 元的总价格中最小的，还要找到这个最小总价格对应都要购买哪些商品。

   ```java
   // items 商品价格，n 商品总数，w 表示满减条件，比如 200
   public static void double11advance(int[] items, int n, int w){
     // 超过 3 倍就没有褥羊毛的价值了
     boolean[][] states = new boolean[n][3 * w + 1];
     // 第一行的数据要做特殊处理
     states[0][0] = true;
     if(items[0] <= 3 * w){
       states[0][items[0]] = true;
     }
     // 动态规划
     for(int i = 1; i < n; ++i){
       // 不购买第 i 个商品
       for(int j = 0; j <= 3 * w; ++j){
         if(states[i - 1][j] == true) states[i][j] = states[i - 1][j];
       }
       // 购买第 i 个商品
       for(int j = 0; j <= 3 * w - items[i]; ++j){
         if(states[i - 1][j] == true) states[i][j + items[i]] = true;
       }
     }
     
     int j;
     for(j = w; j < 3 * w + 1; ++j){
       // 输出结果大于等于 w 的最小值
       if(states[n  - 1][j] == true) break;
     }
     // 最大价格和超过了预期，没有可行解
     if(j == 3 * w + 1) return;
     for(int i = n - 1; i >= 1; --i){
       // i 表示二维数组的行，j 表示列
       if(j - items[i] >= 0 && states[i - 1][j - items[i]] == true){
         // 购买这个商品
         System.out.print(items[i] + ' ');
         j = j - items[i];
       }
       // 否则不购买这个商品，j 不变
     }
     if(j != 0) System.out.print(items[0]);
   }
   ```


## 动态规划理论

**一个模型三个特征**

模型：**多阶段决策最优解模型**

三个特征：

- **最优子结构**：问题的最优解包含子问题的最优解。对应到动态优化问题模型上，可理解为后面阶段的状态可以通过前面阶段的状态推导出来
- **无后效性**：有两层含义，一层含义是，在推导后面阶段状态的时候，只关心前面阶段的状态值，不关心怎么推导出来的；第二层含义是，某阶段状态一旦确定，不受之后阶段的决策影响
- **重复子问题**：不同的决策序列，到达某个相同的阶段时，可能产生重复的状态

## 两种动态规划解题思路总结

![img](https://static001.geekbang.org/resource/image/65/9f/652dff86c5dcc6a0e2a0de9a814b079f.jpg)

1. **状态转移表法**

   流程：**回溯算法实现 - 定义状态 - 画递归树 - 找重复子问题 - 画状态转移表 - 根据递推关系填表 - 将填表过程翻译成代码**

   一般能用动态规划解决的问题，都可以用回溯算法暴力搜索解决。我们可以先使用回溯算法定义每个节点的状态，画出递归树，找到重复子问题，分析重复子问题是如何产生的。以此来寻找规律，看是否能用动态规划来解决。

   找到重复子问题后，有两种解决思路，一种是**回溯算法加备忘录**，来避免重复子问题，第二种是**状态转移表法**。

   先画一个二维状态表，每个状态包含三个变量：行、列、数组值。从前往后，根据递推关系，分阶段填充状态表的每个状态。最后将填表的过程，翻译成代码，就是动态规划代码了。

   解题思路：

   首先写出回溯算法分析一下

   ```java
   private int minDist = Integer.MAX_VALUE;
   // 调用方式minDistBT(0,0,0,w,n)
   public void minDistBT(int i, int j, int dist, int[][] w, int n){
     if(i == n && j == n){
       if(dist < minDist) minDist = dist;
       return;
     }
     if(i < n){
       // 往下走，更新 i = i + 1, j = j
       minDistBT(i + 1, j, dist + w[i][j], w, n);
     }
     if(j < n){
       // 往右走，更新 i = i, j = j + 1
       minDistBT(i, j + 1, dist + w[i][j], w, n);
     }
   }
   ```

   画出递归树。每个节点状态表示为 `(i, j, dist)`，从图中可以看出，尽管 `(i, j, dist)` 不存在重复的，但是 `(i, j)` 重复的有很多，对于重复的节点，我们只需要选择 `dist` 更小的节点，继续递归求解，其余可以舍弃。

   ![img](https://static001.geekbang.org/resource/image/2c/e2/2c3ec820fa8f8cc7df838c0304b030e2.jpg)

   画出二维状态表。表中数值表示从起点到这个位置的最短路径

   ![img](https://static001.geekbang.org/resource/image/b3/ca/b3f0de1c81533a0d24c43426eaf09aca.jpg)

   ![img](https://static001.geekbang.org/resource/image/05/7d/05a48baf7fb4d251bf5078840079107d.jpg)

   弄懂了填表的过程，然后将上面的过程翻译成代码

   ```java
   public int minDistDP(int[][] matrix, int[]){
     int[][] states = new int[n][n];
     int sum = 0;
     // 初始化 states 的第一行数据
     for(int j = 0; j < n; ++j){
       sum += matrix[0][j];
       states[0][j] = sum;
     }
     sum = 0;
     // 初始化 states 的第一列数据
     for(int i = 0; i < n; ++i){
       sum += matrix[i][0];
       states[i][0] = sum;
     }
     for(int i = 1; i < n; ++i){
       for(int j = 1; j < n; ++j){
         states[i][j] = matrix[i][j] + Math.min(states[i - 1][j], states[i][j - 1]);
       }
     }
     return states[n - 1][n - 1];
   }
   ```

2. **状态转移方程法**

   流程：**找最优子结构 - 写状态转移方程 - 将状态转移方程翻译成代码**

   状态转移方程有点类似递归的解题思路。我们需要分析，某个问题如何通过子问题来递归求解，也就是所谓的最优子结构。根据最优子结构，写出递推公式，也就是所谓的状态转移方程。有了状态方程，我们有两种代码实现方式，一种是**递归加备忘录**，另一种是**迭代递推**。

   ```java
   min_dist[i][j] = w[i][j] + min(min_dist[i - 1][j], min_dist[i][j - 1]);
   ```

   **状态转移方程是解决动态规划的关键**

   下面使用递推加备忘录的方式实现代码

   ```java
   private int[][] matrix = {{1, 3, 5, 8}, {2, 1, 3, 4}, {5, 7, 3, 2}, {7, 8, 9, 5}};
   private int n = 4;
   // 备忘录
   private int[][] mem = new int[4][4];
   // 调用方式 minDist(n - 1, n - 1)
   public int minDist(int i, int j){
     if(i == 0 && j == 0) return matrix[0][0];
     // 备忘录存了就存备忘录取值
     if(mem[i][j] > 0) return men[i][j];
     int min_left = Interger.MIN_VALUE;
     if(j - 1 >= 0){
       min_left = minDist(i, j - 1);
     }
     int min_up = Interger.MIN_VALUE;
     if(i - 1 >= 0){
       min_up = minDist(i - 1, j);
     }
     int currentMinDist = matrix[i][j] + Math.min(min_left, min_up);
     mem[i][j] = currentMinDist;
     return currentMinDist;
   }
   ```

## 四种算法思想比较

**贪心、分治、回溯、动态规划**

贪心、回溯、动态规划可以归为一类，而分治可以单独作为一类。前三个算法解决问题的模型，都可以抽象成多阶段决策最优解模型，而分治算法的问题尽管大部分也是最优解问题，但是，大部分都不能抽象成多阶段决策模型。

回溯算法是个万金油。基本上能用动态规划、贪心解决的问题，都可以用回溯算法解决，相当于穷举搜索。但是回溯算法的时间复杂度非常高，是指数级别的，只能用来解决小规模数据的问题。

尽管动态规划算法比较高效，但也不是所有问题都可以用动态规划来解决。需要满足三个特征：最优子结构、无后效性和重复子问题。在重复子问题上，动态规划和分治算法的区别就非常明显，分治算法要求分割的子问题，不能有重复子问题，而动态规划正好相反。动态规划之所以高效就是因为回溯算法中存在大量的重复子问题。

贪心算法实际上是动态规划算法的一种特殊情况。它解决问题更加高效，代码实现也更加简洁。它可以解决的问题需要满足三个条件：最优子结构、无后效性和贪心选择性。

贪心选择性的意思是，通过局部的最优选择，能产生全局的最优选择。每个阶段，我们都选择当前看起来最优的决策，所有阶段的决策完成之后，最终由这些局部最优解解构成全局最优解。

## 动态规划实战

如何实现搜索引擎中的拼写纠错功能？

计算机只认知数字，如何量化两个字符串之间的相似程度？有一个非常著名的量化方法，那就是编辑距离（Edit Distance）。

编辑距离指的是，将一个字符串转化为另一个字符串，需要的最少编辑操作次数（增、删、改）。编辑距离越大，说明两个字符串的相似程度越小；相反，编辑距离越小，说明两个字符串的相似程度越大。

根据所含编辑操作的种类不同，编辑距离有多种不同的计算方式，比较著名的有**莱温斯坦距离（Levenshtein distance）**和**最长公共子串长度（Longest common substring length）**。其中莱温斯坦距离允许增、删、改三种编辑操作，最长公共子串值允许增、删两种编辑操作。

莱温斯坦距离的大小，表示两个字符串差异的大小；最长公共子串的大小，表示两个字符串相似程度的大小。

![img](https://static001.geekbang.org/resource/image/f0/0f/f0e72008ce8451609abed7e368ac420f.jpg)

1. **如何编程计算莱温斯坦距离**

   整个求解过程，涉及多个决策阶段，我们需要依次考察一个字符串中的每个字符，跟另一个字符串中的字符是否匹配，匹配的话如何处理，不匹配如何处理。这符合**多阶段决策最优解模型**。

   首先，用最简单的回溯算法，看看如何解决：

   回溯是一个递归处理的过程。如果 a[i] 与 b[j] 匹配，我们递归考察 a[i + 1] 和 b[j + 1]。如果 a[i] 和 b[j] 不匹配，那我们有多种处理方式可选

   - 删除 a[i]，然后递归考察 a[i + 1]  和 b[j]

   - 删除 b[j]，然后递归考察 a[i] 和 b[j + 1]
   - 在 a[i] 前面添加一个跟 b[j] 相同的字符，然后递归考察 a[i] 和 b[j + 1]
   - 在 b[j] 前面添加一个跟 a[i] 相同的字符，然后递归考察 a[i + 1] 和 b[j]
   - 将 a[i] 替换成 b[j]，或者将 b[j] 替换成 a[i]，然后递归考察 a[i + 1] 和 b[j + 1]

   ```java
   private char[] a = 'mitcmu'.toCharArray();
   private char[] b = 'mtacnu'.toCharArray();
   private int n = 6;
   private int m = 6;
   // 存储结果
   private int minDist = Integer.MAX_VALUE;
   // 调用方式 lwstBT(0, 0, 0)
   public lwstBT(int i, int j, int edist){
     if(i == n || j == m){
       if(i < n) edist += (n - i);
       if(j < m) edist += (m - j);
       if(edist < minDist) minDist = edist;
       return;
     }
     if(a[i] = b[j]){
       // 两个字符串匹配
       lwstBT(i + 1, j + 1, edist)
     }else{
       // 两个字符串不匹配
       // 删除 a[i] 或者 b[j] 前面添加一个字符
       lwstBT(i + 1, j, edist + 1);
       // 删除 b[j] 或者 a[i] 前面添加一个字符
       lwstBT(i, j + 1, edist + 1);
       // a[i] 替换为 b[j] 或者 b[j] 替换为 a[i]
       lwstBT(i + 1, j + 1, edist + 1);
     }
   }
   ```

   根据回溯算法，会出递归树，查看是否存在重复子问题

   ![img](https://static001.geekbang.org/resource/image/86/89/864f25506eb3db427377bde7bb4c9589.jpg)

   递归树中，每个节点代表一个状态，包含三个变量(i, j, edist)，其中 edist 表示处理到 a[i] 和 b[j] 时已编辑操作次数。

   状态 (i, j) 可能从 (i -1, j)，(i, j - 1)，(i - 1, j - 1) 三个状态中的任意一个转移过来。那么我们可以写出状态转移方程。

   ```java
   // 如果 a[i] != b[j]，那么
   min_edist(i, j) = min(min_edist(i - 1, j), min_edist(i, j - 1), min_edist(i - 1, j - 1)) + 1;
   
   // 如果 a[i] == b[j]，那么
   min_edist(i, j) = min(min_edist(i - 1, j) + 1, min_edist(i, j - 1) + 1, min_edist(i - 1, j - 1));
   ```

   了解了递推关系，画出二维状态表

   ![img](https://static001.geekbang.org/resource/image/ab/2d/ab44eb53fad2601c19f73604747d652d.jpg)

   有了状态转移方程，又理清了完整的填表过程，代码实现就非常简单了。

   ```java
   public int lwstDP(char[] a, int n, char[] b, int m){
     int[][] minDist = new int[n][m];
     // 初始化第 0 行
     for(int j = 0; j < m; ++j){
       if(a[0] == b[j]) minDist[0][j] = j;
       else if (j != 0) minDist[0][j] = minDist[0][j - 1] + 1;
       else minDist[0][j] = 1;
     }
     // 初始化第 0 列
     for(int i = 0; i < n; ++i){
       if(a[i] == b[0]) minDist[i][0] = i;
       else if (i != 0) minDist[i][0] = minDist[i - 1][0] + 1;
       else minDist[i][0] = 1;
     }
     // 按行填表
     for(int i = 1; i < n; ++i){
       for(int j = 1; j < m; ++j){
         if(a[i] == b[j]){
           minDist[i][j] = min(minDist[i - 1][j] + 1, minDist[i][j - 1] + 1, minDist[i -1][j - 1]);
         }else{
           minDist[i][j] = min(minDist[i - 1][j] + 1, minDist[i][j - 1] + 1, minDist[i -1][j - 1] + 1);
         }
       }
     }
     return minDist[n - 1][m - 1];
   }
   
   private int min(int x, int y, int z){
     int minv = Integer.MAX_VALUE;
     if(x < minv) minv = x;
     if(y < minv) minv = y;
     if(z < minv) minv = z;
     return minv;
   }
   ```

   

2. **如何编程计算最长公共子串长度**

   首先，回溯思路，从 a[0] 和 b[0] 开始，依次考察两个字符串中的字符是否匹配。

   如果 a[i] 和 b[j] 互相匹配，最大公共字符串长度加一，继续考察 a[i + 1] 和 b[j + 1]。

   如果 a[i] 和 b[j] 不匹配，最长公共字符串长度不变，然后产生两种决策路线：

   - 删除 a[i]，或者在 b[j] 前面加上一个字符 a[i]，然后继续考察 a[i + 1] 和 b[j]
   - 删除 b[j]，或者在 a[i] 前面加上一个字符 b[j]，然后继续考察 a[i] 和 b[j + 1]

   写出状态转移方程

   ```java
   // 如果 a[i] == b[j]，那么 max_lcs(i, j)就等于
   max(max_lcs(i - 1, j - 1) + 1, max_lcs(i - 1, j), max_lcs(i, j - 1));
   
   // 如果 a[i] != b[j]，那么 max_lcs(i, j)就等于
   max(max_lcs(i - 1, j - 1), max_lcs(i - 1, j), max_lcs(i, j - 1));
   ```

   有了状态转移方程就可以写出代码

   ```java
   public int lcs(char[] a, int n, char[] b, int m){
     int[][] maxlcs = new int[n][m];
     // 初始化第 0 行
     for(int j = 0; j < m; ++j){
       if(a[0] == b[j]) maxlcs[0][j] = 1;
       else if (j != 0) maxlcs[0][j] = maxlcs[0][j - 1];
       else maxlcs[0][j] = 0;
     }
     // 初始化第 0 列
     for(int i = 0; i < n; ++i){
       if(a[i] == b[0]) maxlcs[i][0] = 1;
       else if (i != 0) maxlcs[i][0] = maxlcs[i - 1][0];
       else maxlcs[i][0] = 0;
     }
     // 填表
     for(int i = 1; i < n; ++i){
       for(int j = 1; j < m; ++j){
         if(a[i] == b[j]){
           maxlcs[i][j] = max(maxlcs[i - 1][j - 1] + 1, maxlcs[i][j - 1], maxlcs[i - 1][j]);
         }else{
           maxlcs[i][j] = max(maxlcs[i - 1][j - 1], maxlcs[i][j - 1], maxlcs[i - 1][j]);
         }
       }
     }
     return maxlcs[n - 1][m - 1];
   }
   
   private int max(int x, int y, int z){
     int maxv = Integer.MIN_VALUE;
     if(x > maxv) maxv = x;
     if(y > maxv) maxv = y;
     if(z > maxv) maxv = z;
     return maxv;
   }
   ```

   