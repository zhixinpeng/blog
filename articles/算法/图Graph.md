## 什么是图

和树比起来，图是一种更加复杂的非线性表结构。

树中的元素我们称之为节点，图中的元素我们叫做**顶点（vertext）**。其中一个顶点可以与任意其他顶点建立连接关系，这种关系叫做**边（edge）**。

![img](https://static001.geekbang.org/resource/image/df/af/df85dc345a9726cab0338e68982fd1af.jpg)

生活中有很多符合图这种结构的例子。比如社交网络，就是一个非常典型的图结构。

在微信中，每个用户看做一个顶点。如果两个用户之间互相加好友，那就在两者之间建立一条边。用户有多少好友，对应到图中，叫做顶点的**度（degree）**，就是跟顶点相连接的边的条数。

在微博中，用户允许单向关注，就会产生方向的概念。如果 A 关注了 B，就在图中画一条从 A 到 B 的带箭头的边，用来表示边的方向。这种有方向的图叫做**有向图**。上面那种没有方向的图叫做**无向图**。

![img](https://static001.geekbang.org/resource/image/c3/96/c31759a37d8a8719841f347bd479b796.jpg)

无向图中有度的概念，对应在有向图中，度就分为**入度（in-degree）**和**出度（out-degree）**。

顶点的入度表示有多少边指向这个顶点；顶点的出度表示有多少条边是以这个顶点为起点指向其他顶点。

在 QQ 中的社交关系要复杂一些，用户之间还有亲密度来记录两个用户之间的好友关系。这时候就要用到**带权图（weighted graph）**。

![img](https://static001.geekbang.org/resource/image/55/e8/55d7e4806dc47950ae098d959b03ace8.jpg)

## 存储方法一：邻接矩阵

图最直观的一种存储方法就是：**邻接矩阵（Adjacency Matrix）**。

对于无向图：如果顶点 i 与顶点 j 之间有边，就将 `A[i][j]` 和 `A[j][i]` 标记为 1

对于有向图：如果顶点 i 与顶点 j 之间，有一条箭头从 i 指向 j，则将 `A[i][j]` 标记为 1

对于带权图：数组中存储相应的权重

![img](https://static001.geekbang.org/resource/image/62/d2/625e7493b5470e774b5aa91fb4fdb9d2.jpg)

用邻接矩阵来表示一个图，虽然简单、直观，但是比较浪费存储空间。

如果我们存储的是**稀疏图（Sparse Matrix）**，也就是说，顶点很多，但是每个顶点的边不多，那用邻接矩阵的存储方法就更加浪费空间了。

也不是说邻接矩阵就没有优点了。首先，邻接矩阵的存储方式简单、直接，因为基于数组，所以在获取两个顶点的关系时，非常高效。其次，方便计算，因为用邻接矩阵的方式存储图，可以将很多图的运算转换为矩阵之间的运算。

## 存储方法二：邻接表

邻接表有点像散列表，每个顶点对应一条链表，链表中存储的是与这个顶点相连接的其他顶点。

有向图每个顶点对应的链表中，存储的是指向的顶点。对于无向图，也是类似的，不过每个顶点链表中存储的是跟这个顶点有边相连的顶点。

![img](https://static001.geekbang.org/resource/image/03/94/039bc254b97bd11670cdc4bf2a8e1394.jpg)

邻接矩阵存储比较浪费空间，但使用起来比较节省时间。相反，邻接表存储起来比较节省时间，但使用起来就比较耗时间。

## 深度与广度优先搜索

深度优先搜索算法和广度优先搜索算法都是基于图这种数据结构的。这是因为，图这种数据结构的表达能力很强，大部分涉及搜索的场景都可以抽象成图。

这里针对无向图，用邻接表来存储图，来进行讲解。

```java
// 无向图
public class Graph {
  // 顶点的个数
  private int v;
  // 邻接表
  private LinkedList<Integer> adj[];
  
  public Graph(int v){
    this.v = v;
    adj = new LinkedList[v];
    for(int i = 0; i < v; ++i){
      adj[i] = new LinkedList<>();
    }
  }
  
  // 无向图一条边存两次
  public void addEdge(int s, int t){
    adj[s].add(t);
    adj[t].add(s);
  }
}
```

### 广度优先搜索（BFS）

广度优先搜索（Breadth-First-Search），简称 BFS。直观的说，它其实是一种地毯式层层推进的搜索策略，即先查找离起点顶点近的，依次往外搜索。

![img](https://static001.geekbang.org/resource/image/00/ea/002e9e54fb0d4dbf5462226d946fa1ea.jpg)

以下代码基于以上关于图的定义代码基础上实现

```java
// s 表示起始顶点，t 表示终止顶点，搜索一条 s 到 t 的路径。实际上这路径就是从 s 到 t 的最短路径
public void bfs(int s, int t){
  if(s == t) return;
  boolean[] visited = new boolean[v];
  visited[s] = true;
  Queue<Integer> queue = new LinkedList<>();
  queue.add(s);
  int[] prev = new int[v];
  for(int i = 0; i < v; i++){
    prev[i] = -1;
  }
  
  while(queue.size() != 0){
    int w = queue.poll();
    for(int i = 0; i < adj[w].size(); ++i){
      int q = adj[w].get(i);
      if(!visited[q]){
        prev[q] = w;
        if(q == t){
          print(prev, s, t);
          return;
        }
        visited[q] = true;
        queue.add(q);
      }
    }
  }
}

// 递归打印 s -> t 的路径
private void print(int[] prev, int s, int t){
  if(prev[t] != -1 && t != s){
    print(prev, s, prev[t]);
  }
  System.out.print(t + ' ');
}
```

**visited** 用来记录已经被访问的顶点，用来避免顶点被重复访问。

**queue** 是一个队列，用来存储已经被访问、但相连的顶点还没有被访问的顶点。

**prev** 用来记录搜索路径。

![img](https://static001.geekbang.org/resource/image/4f/3a/4fea8c4505b342cfaf8cb0a93a65503a.jpg)

![img](https://static001.geekbang.org/resource/image/ea/23/ea00f376d445225a304de4531dd82723.jpg)

![img](https://static001.geekbang.org/resource/image/4c/39/4cd192d4c220cc9ac8049fd3547dba39.jpg)

### 深度优先搜索（DFS）

深度优先搜索（Depth-First-Search），简称 DFS。最直观的例子就是走迷宫。

假设你站在迷宫的某个岔路口想找到出口。选择一个岔路口走，走到走不通的时候，回退到上一个岔路口，重新选择一条路继续走，直到找到出口。

![img](https://static001.geekbang.org/resource/image/87/85/8778201ce6ff7037c0b3f26b83efba85.jpg)

图中实线表示遍历，虚线表示回退。从图中可以看出，深度优先搜索找出来的路径，并不是顶点 s 到顶点 t 的最短路径。

实际上，深度优先搜索用的是一种比较著名的算法思想：回溯思想。

```java
// 全局变量或者类成员变量，用于表示找到终点顶点 t 之后，不再递归查找
boolean found = false;

public void dfs(int s, int t){
  found = false;
  boolean[] visited = new boolean[v];
  int[] prev = new int[v];
  for(int i = 0; i < v; ++i){
    prev[i] = -1;
  }
  recurDfs(s, t, visited, prev);
  print(prev, s, t);
}

private void recurDfs(int w, int t, boolean[] visited, int[] prev){
  if(found == true) return;
  visited[w] = true;
  if(w == t){
    found = true;
    return;
  }
  for(int i = 0; i < adj[w].size(), ++i){
    int q = adj[w].get(i);
    if(!visited[q]){
      prev[q] = w;
      recurDfs(q, t, visited, prev);
    }
  }
}
```

