回溯算法除了指导像**深度优先搜索**这种经典的算法之外，还可以用在很多实际的开发场景中，比如正则表达式匹配、编译原理中的语法分析等。

回溯的处理思想，有点类似枚举搜索。我们枚举所有的解，找到满足期望的解。为了有规律的枚举所有可能的解，避免遗漏和重复，我们把问题的求解过程分成多个阶段。每个阶段我们都会面对一个岔路口，先随意选择一条，当这条路走不通的时候，再回退到上一个岔路，另选一种走法继续走。

## 示例

1. 八皇后问题

   有一个 8x8 的棋盘，希望往里放 8 个棋子（皇后），每个棋子所在的行、列、对角线都不能有另一个棋子。

   ![img](https://static001.geekbang.org/resource/image/a0/f5/a0e3994319732ca77c81e0f92cc77ff5.jpg)

   ```java
   // 全局或成员变量，下标表示行，值表示列
   int[] result = new int[8];
   // 通过 calc8queens(0) 调用
   public void calc8queens(int row){
     if(row == 8){
    		// 8 个棋子都放置好了，打印结果   
       printQueens(result);
       // 8 行棋子都放置好了，不用继续递归了
       return;
     }
     // 每一行都有 8 种放置方法
     for(int column = 0; column < 8; ++column){
       if(isOk(row, column)){
         // 第 row 行的棋子放到了 column 列
         result[row] = column;
         // 考察下一行
         calc8queesn(row + 1);
       }
     }
   }
   
   // 判断 row 行 column 列放置是否合适
   private boolean isOk(int row, int column){
     int leftup = column - 1, rightup = column + 1;
     // 逐行往上考察每一行
     for(int i = row - 1; i >= 0; --i){
       // 第 i 行的 column 列有棋子吗
       if(result[i] == column) return false;
       // 考察左上对角线：第 i 行 leftup 列有棋子吗
       if(leftup >=0){
         if(result[i] == leftup) return false;
       }
       // 考察右上对角线：第 i 行 rightup 列有棋子吗
       if(rightup < 8){
         if(result[i] == rightup) return false;
       }
       --leftup;
       ++rightup;
     }
     return true;
   }
   
   // 打印出一个二维矩阵
   private void printQueens(int[] result){
     for(int row = 0; row < 8; ++row){
       for(int column = 0; column < 8; ++column){
         if(result[row] == column) System.out.print('Q ');
         else System.out.print('* ');
       }
       System.out.println();
     }
     System.out.println();
   }
   ```

2. 01背包问题

   有一个背包，总承重是W，现在有n个物品，每个物品重量不等，并且不可分割。现在期望选择几件物品，装载到背包中。在不超过背包所能装载重量的前提下，如何让背包中物品的总重量最大？

   ```java
   // 可以存储在背包中的物品总重量最大值
   public int maxWeight = Integer.MIN_VALUE;
   // i 表示当前考察到第几个物品了
   // currentWeight 表示当前已经装进去的物品的重量和
   // items 表示每个物品的重量数组
   // n 表示总物品数量
   // weight 表示背包可以承受的最大重量
   // 假设背包可承受最大重量为100，物品个数10，各物品重量存储数组 a 中，则调用以下函数
   // find(0, 0, a, 10, 100)
   public void find(int i, int currentWeight, int[] items, int n, int weight){
     // currentWeight == weight 表示重量装满了，i == n 表示已经考察完所有的物品
     if(currentWeight == weight || i == n){
       if(currentWeight > maxWeight) maxWeight = currentWeight;
       return;
     }
     // 直接考察下一个物品，当前物品不放入背包
     find(i + 1, currentWeight, items, n, weight);
     // 将当前物品的重量尝试放入背包，如果总重量没有超过，则可以放入背包
     // 反之，则不放入背包
     if(currentWeight + items[i] <= weight){
       find(i + 1, currentWeight + items[i], n, weight)
     }
   }
   ```

   这个问题的关键在于：每个物品都可以选择放入或不放入背包，对每个物品都进行这样的考察，把能得到的最大重量赋值给 `maxWeight` 

3. 正则表达式

   假设正则表达式中只有 `*` 和 `?` 两种通配符，其中，`*` 匹配任意多个（大于等于 0 个）任意字符，`?` 匹配零个或者一个任意字符。基于以上背景假设，利用回溯算法，判断一个给定的文本，能够跟给定的正则表达式匹配？

   ```java
   public class Pattern {
     private boolean matched = false;
     // 正则表达式
     private char[] pattern;
     // 正则表达式长度
     private int plen;
     
     public Pattern(char[] pattern, int plen){
       this.pattern = pattern;
       this.plen = plen;
     }
     
     // 传入字符串和长度来匹配正则
     public boolean match(char[] text, int tlen){
       matched = false;
       rmatch(0, 0, text, tlen);
       return matched;
     }
     
     private void rmatch(int ti, int pj, char[] text, int tlen){
       // 如果已经匹配了，就不要继续递归了
       if(matched) return;
       // 正则表达式读到结尾了
       if(pj == plen){
         // 字符串也读到结尾了
         if(ti == tlen) matched = true;
         return;
       }
       // * 匹配任意字符
       if(pattern[pj] == '*'){
         for(int k = 0; k < tlen - ti; ++k){
           rmatch(ti + k, pj + 1, text, tlen);
         }
       }else if(pattern[pj] == '?'){
         // ? 匹配 0 个或者 1 个字符
         rmatch(ti, pj + 1, text, tlen);
         rmatch(ti + 1, pj + 1, text, tlen);
       }else if(ti < tlen && pattern[pj] == text[ti]){
         // 纯字符匹配
         rmatch(ti + 1, pj + 1, text, tlen);
       }
     }
   }
   ```

   重点在于岔路的选择，`*` 可以匹配 `tlen - ti` 条路，去匹配其中任意个字符，`?` 有两条岔路，匹配 0 个或者 1个，纯字符匹配就只有一条路。

