树是一种非线性表结构。之前的栈、队列都是线性表结构。

## 树

![img](https://static001.geekbang.org/resource/image/b7/29/b7043bf29a253bb36221eaec62b2e129.jpg)

树这种数据结构很像我们生活中的树，这里面的每个元素称之为节点；用连线来表示相邻节点的关系叫做父子关系。

![img](https://static001.geekbang.org/resource/image/22/ae/220043e683ea33b9912425ef759556ae.jpg)

A 节点是 B 节点的**父节点**，B 节点是 A 节点的**子节点**。B、C、D 这三个节点的父节点是同一个节点，它们之间互称为**兄弟节点**。没有父节点的节点叫做**根节点**。没有子节点的节点叫做**叶子节点**或者**叶节点**。

![img](https://static001.geekbang.org/resource/image/50/b4/50f89510ad1f7570791dd12f4e9adeb4.jpg)

- **高度 Height**：节点到叶子节点的最长路径（边数）
- **深度 Depth**：根节点到这个节点所经历的边个数
- **层 Level**：节点的深度 + 1

## 二叉树

二叉树，顾名思义，就是每个节点最多有两个叉，也就是两个子节点，分别是**左子节点**和**右子节点**。不过不是每个节点都有两个子节点，有的只有左子节点，有的只有右子节点。

![img](https://static001.geekbang.org/resource/image/09/2b/09c2972d56eb0cf67e727deda0e9412b.jpg)

编号 2 这种二叉树，叶子节点全在最底层，除了叶子节点之外，每个节点都有左右两个子节点，这种二叉树叫做**满二叉树**。

编号 3 这种二叉树，叶子节点都在最底下两层，最后一层的叶子节点都靠左排列，并且除了最后一层，其它层的节点个数都达到最大，这种二叉树叫做**完全二叉树**。

满二叉树好理解，完全二叉树就有点费劲了。如何完全理解完全二叉树呢？我们首先需要了解，**如何表示一个棵二叉树？**

- 基于指针或者引用的二叉链式存储法

  ![img](https://static001.geekbang.org/resource/image/12/8e/12cd11b2432ed7c4dfc9a2053cb70b8e.jpg)

  拎着根节点，就可以通过左右子节点的指针，把整棵树都串起来。这是我们比较常用的存储方式。

- 基于数组的顺序存储法

  ![img](https://static001.geekbang.org/resource/image/14/30/14eaa820cb89a17a7303e8847a412330.jpg)

  根节点存储在下标 i = 1 的位置，那左子节点存储在 2 * i = 2 的位置，右子节点存储在 2 * i + 1 = 3 的位置。以此类推。反过来，如果节点 X 存储在下标为 i 的位置，那么 2 * i 就是它的左子节点，2 * i + 1 就是它的右子节点，i / 2 就是它的父节点。

  通过这种方式，只要知道根节点存储的位置（通常是 1），就可以通过下标计算，将整棵树串起来。

  不过，如果是非完全二叉树，就会浪费很多的数组存储空间

  ![img](https://static001.geekbang.org/resource/image/08/23/08bd43991561ceeb76679fbb77071223.jpg)

  如果某二叉树是一颗完全二叉树，那么数组无疑是最节省内存的一种方式。因为数组的存储方式并不需要像链式存储法那样，要存储额外的左右子节点的指针。

## 二叉树的遍历

如何将二叉树中所有节点都遍历打印出来呢？经典的方法有三种：**前序遍历、中序遍历和后序遍历**。

- 前序遍历：对于树中任意的节点来说，先打印这个节点，再打印左子树，最后打印右子树
- 中序遍历：对于树中任意的节点来说，先打印左子树，再打印节点本身，最后打印右子树
- 后续遍历：对于树中任意的节点来说，先打印左子树，再打印右子树，最后打印节点本身

![img](https://static001.geekbang.org/resource/image/ab/16/ab103822e75b5b15c615b68560cb2416.jpg)

```java
// 前序遍历的递推公式
preOrder(r) = print r->preOrder(r->left)->preOrder(r->right);

// 中序遍历的递推公式
inOrder(r) = inOrder(r->left)->print r->inOrder(r->right);

// 后序遍历的递推公式
postOrder(r) = postOrder(r->left)->postOrder(r->right)->print r;
```

```java
void preOrder(Node* root){
  if(root == null) return;
  print root;
  preOrder(root->left);
  preOrder(root->right);
}

void inOrder(Node* root){
  if(root == null) return;
  inOrder(root->left);
  print root;
  inOrder(root->right);
}

void postOrder(Node* root){
  if(root == null) return;
  postOrder(root->left);
  postOrder(root->right);
  pint root;
}
```

## 二叉查找树（Binary Search Tree）

二叉查找树是二叉树中最常用的一种类型，也叫二叉搜索树。二叉查找树就是为了实现快速查找而生的。它不仅支持快速查找一个数据，还支持快速插入、删除数据。

**二叉查找树要求，在树中的任意一个节点，其左子树中的每个节点的值，都要小于这个节点的值，而右子树节点的值都大于这个节点的值**

![img](https://static001.geekbang.org/resource/image/f3/ae/f3bb11b6d4a18f95aa19e11f22b99bae.jpg)

### 二叉查找树的查找操作

![img](https://static001.geekbang.org/resource/image/96/2a/96b3d86ed9b7c4f399e8357ceed0db2a.jpg)

从根节点开始，如果等于要查找的数据就返回。如果要查找的数据比根节点小，那就从左子树中递归查找；如果要查找的数据比根节点大，那就从右子树中递归查找。

```java
public class BinarySearchTree {
  private Node tree;
  
  public Node find(int data){
    Node p = tree;
    while(p != null){
      if(data < p.data) p = p.left;
      else if(data > p.data ) p = p.right;
      else reunt p;
    }
    return null;
  }
  
  public static class Node(){
    private int data;
    private Node left;
    private Node right;
    
    public Node(int data){
      this.data = data;
    }
  }
}
```

### 二叉查找树的插入操作

二叉查找树的插入过程类似查找操作。新插入的数据一般都是在叶子节点上，所以依然从根节点开始，依次比较要插入的数据和节点的大小关系。

![img](https://static001.geekbang.org/resource/image/da/c5/daa9fb557726ee6183c5b80222cfc5c5.jpg)

```java
public void insert(int data){
  if(tree == null){
    tree = new Node(data);
    return;
  }
  
  Node p = tree;
  while(p != null){
    if(data > p.data){
      if(p.right == null){
        p.right = new Node(data);
        return;
      }
      p = p.right;
    }else{
      if(p.left == null){
        p.left = new Node(data);
        return;
      }
      p = p.left;
    }
  }
}
```

### 二叉查找树的删除操作

![img](https://static001.geekbang.org/resource/image/29/2c/299c615bc2e00dc32225f4d9e3490e2c.jpg)

二叉查找树的删除操作比较复杂，针对要删除的子节点个数不同，分为三种情况处理：

- 如果要删除的节点没有子节点，只需要直接将父节点中，指向要删除节点的指针置为 null。如图中节点 55
- 如果要删除的节点只有一个子节点（左子节点或者右子节点），只需要更新父节点中，指向要删除节点的指针，让它指向要删除节点的子节点。如图中节点 13
- 如果要删除的节点有两个子节点，就比较复杂了。我们需要找到这个节点的右子树中的最小节点，把它替换到要删除的节点上。然后再删除这个最小节点，因为最小节点肯定没有左子节点（如果有左子节点，那就不是最小节点了）。如图中节点 18

```java
public void delete(int data){
  // p 指向要删除的节点，初始化指向根节点
  Node p = tree;
  // pp 记录的是 p 的父节点
  Node pp = null;
  while(p != null && p.data != data){
    pp = p;
    if(data > p.data) p = p.right;
    else p = p.left;
  }
  
  // 要删除的节点有两个子节点，查找右子树中的最小节点
  if(p.left != null && p.right != null){
    Node minP = p.right;
    // minPP 表示 minP 的父节点
    Node minPP = p;
    while(minP.left != null){
      minPP = minP;
      minP = minP.left;
    }
    // 将 minP 的数据替换到 p 中
    p.data = minP.data;
    // 将要删除的节点指向 minP，后面就进行叶子节点的删除操作就好了
    p = minP;
    pp = minPP;
  }
  
  // 删除节点是叶子节点或仅有一个子节点的情况
  Node child;
  if(p.left != null) child = p.left;
  else if(p.rigth != null) child = p.right;
  else child = null;
  
  // 删除的是根节点
  if(pp == null) tree = child;
  else if(pp.left == p) pp.left = child;
  else pp.right = child;
}
```

### 二叉查找树的其他操作

二叉查找树还可以支持**快速的查找最大节点和最小节点、前驱节点和后继节点**。

还有一个重要的特性，就是**中序遍历二叉查找树，可以输出有序的数据序列，时间复杂度是 O(n)，非常高效**。因此二叉查找树也叫做二叉排序树。

## 支持重复数据的二叉查找树

实际开发中，二叉查找树中存储的，是一个包含很多字段的对象。利用对象的某个字段作为键值来构建二叉查找树，其他字段叫做卫星数据。

针对存储的两个对象键值相同，有两种解决办法

- 二叉查找树中不仅会存储一个数据，因此我们通过链表和支持动态扩容的数组等数据结构，把值相同的数据都存储在同一个节点上

- 每个节点只存储一个数据。在查找插入位置的过程中，如果遇到相同键值的节点。将这个要插入的数据放到这个节点的右子树，也就是把它当做大于这个节点的值来处理

  ![img](https://static001.geekbang.org/resource/image/3f/5f/3f59a40e3d927f567022918d89590a5f.jpg)

  当要查找数据时，遇到值相同的节点，并不停止查找，而是继续在右子树中查找，直到遇到叶子节点才停止。

  ![img](https://static001.geekbang.org/resource/image/fb/ff/fb7b320efd59a05469d6d6fcf0c98eff.jpg)

  对于删除操作，查找到每个要删除的节点，然后用上面讲述的删除操作方法，依次删除。

## 二叉查找树的时间复杂度

在最坏情况下，二叉查找树的左右子树极度不平衡，退化成链表，查找的时间复杂度退化到 O(n)。

**二叉查找树的时间复杂度其实跟树的高度成正比，也就是 O(height)**。所以我们需要构建一个能保持任意节点左右子树都比较平衡的二叉查找树，在这种情况下，二叉查找树的高度接近 logn。此时插入、删除、查找操作的时间复杂度比较稳定为 O(logn)。

