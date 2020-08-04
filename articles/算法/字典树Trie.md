Trie 树，也叫字典树。顾名思义，它是一个树形结构，它是一种专门处理字符串匹配的数据结构，用来解决在一组字符串集合中快速查找某个字符串的问题。

**Trie 树的本质，就是利用字符串之间的公共前缀，将重复的前缀合并在一起**

![img](https://static001.geekbang.org/resource/image/28/32/280fbc0bfdef8380fcb632af39e84b32.jpg)

其中，根节点不包含任何信息。每个节点表示一个字符串中的字符，从根节点到红色节点的一条路径表示一个字符串（红色节点并不都是叶子节点）。

![img](https://static001.geekbang.org/resource/image/f8/6c/f848a7d8bda3d4f8bb4a7cbfaabab66c.jpg)

![img](https://static001.geekbang.org/resource/image/06/b6/06b45fde2ca8077465e0c557bc749ab6.jpg)

当我们在 Trie 树中查找一个字符串的时候，比如查找字符串 “her”，那我们将要查找的字符串分割成单个的字符 h, e, r，然后从 Trie 树的根节点开始匹配。

![img](https://static001.geekbang.org/resource/image/6d/b9/6dbed0579a60c6d170bd8fde5990bfb9.jpg)

如果查找的是字符串 “he” 呢？由于匹配的路径的最后一个节点 e 并不是红色的。也就是说，”he” 是某个字符串的前缀子串，但并不能完全匹配任何字符串。

![img](https://static001.geekbang.org/resource/image/05/f9/05c3c5d534921f00a9ae33e7e65b1bf9.jpg)

## 如何实现一颗 Trie 树

Trie 树主要有两个操作，**一个是将字符串集合构造成 Trie 树，另一个是在 Trie 树中查询一个字符串**。

如何存储一个 Trie 树呢？从图中可以看出，Trie 树是一个多叉树。

假设我们的字符串中只有从 a 到 z 这 26 个小写字母，我们在数组中下标为 0 的位置，存储指向子节点 a 的指针，下标为 1 的位置存储指向子节点 b 的指针，以此类推，下标为 25 的位置，存储的是指向子节点 z 的指针。如果某个字符的子节点不存在，我们就在对应的下标位置存储 null。

![img](https://static001.geekbang.org/resource/image/f5/35/f5a4a9cb7f0fe9dcfbf29eb1e5da6d35.jpg)

当我们在 Trie 树中查找字符串的时候，就可以通过字符的 ASCII 码减去 a 的 ASCII 码，迅速周到匹配的子节点的指针。

```java
public class TrieNode {
  public char data;
  public TrieNode[] children = new TrieNode[26];
  public boolean isEndingChar = false;
  public TrieNode(char data){
    this.data = data;
  }
}

public class Trie {
  private TrieNode root = new TrieNode('/');
  
  public void insert(char[] text){
    TrieNode p = root;
    for(int i = 0; i < text.length; ++i){
      int index = text[i] - 'a';
      if(p.children[index] == null){
        TrieNode newNode = new TrieNode(text[i]);
        p.children[index] = newNode;
      }
      p = p.children[index];
    }
    p.isEndingChar = true;
  }
  
  public boolean find(char[] pattern){
    TrieNode p = root;
    for(int i = 0; i < pattern.length; ++i){
      int index = pattern[i] - 'a';
      if(p.children[index] == null){
        return false;
      }
      p = p.children[index];
    }
    if(p.isEndingChar == false) return false;
    else return true;
  }
}
```

构建 Trie 树的过程时间复杂度是 O(n)，查询长度为 k 的字符串时间复杂度为 O(k)。