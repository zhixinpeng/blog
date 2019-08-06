/**
 * 基于Map和双向链表实现的LRU算法
 * 使用泛型可以存储多种类型的数据
 */

//  链表节点类
class LinkedListNode<K, V>{
  key: K
  value: V
  next: LinkedListNode<K, V> | null
  prev: LinkedListNode<K, V> | null

  constructor(key: K, value: V, next: LinkedListNode<K, V> | null = null, prev: LinkedListNode<K, V> | null = null) {
    this.key = key
    this.value = value
    this.next = next
    this.prev = prev
  }
}

// LRU缓存淘汰类
class LRUCache<K, V>{
  private cacheMap: Map<K, LinkedListNode<K, V>>
  private readonly limit: number
  private head: LinkedListNode<K, V> | null
  private tail: LinkedListNode<K, V> | null

  constructor(limit: number, head: LinkedListNode<K, V> | null = null, tail: LinkedListNode<K, V> | null = null) {
    if (limit < 0) throw new Error("limit of cache must > 0")
    this.cacheMap = new Map()
    this.limit = limit
    this.head = head
    this.tail = tail
  }

  public get(key: K): V | null {
    const node = this.cacheMap.get(key)
    if (!node) return null
    return node.value
  }

  public put(key: K, value: V) {
    const node = this.cacheMap.get(key)
    // 原缓存不存在则加入到队尾
    if (!node) {
      // 大于规定的size则删除最不常用的
      if (this.cacheMap.size >= this.limit) {
        const oldKey = this.removeNode(node!)
        this.cacheMap.delete(oldKey)
      }
      // 在队尾添加
      const newNode = new LinkedListNode(key, value)
      this.addNode(newNode)
      this.cacheMap.set(key, newNode)
    } else {
      node.value = value
      this.refreshNode(node)
    }
  }

  private refreshNode(node: LinkedListNode<K, V>) {
    if (node === this.tail) return
    this.removeNode(node)
    this.addNode(node)
  }

  private removeNode(node: LinkedListNode<K, V>): K {
    if (node === this.head) {
      this.head = this.head.next
    } else if (node === this.tail) {
      this.tail = this.tail.prev
    } else {
      node.prev!.next = node.next
      node.next!.prev = node.prev
    }
    return node.key
  }

  private addNode(node: LinkedListNode<K, V>) {
    if (this.tail) {
      this.tail.next = node
      node.prev = this.tail
    }
    this.tail = node
    if (this.head === null) {
      this.head = node
    }
    // 消除之前节点的下一个引用对象，防止无限循环
    node.next = null
  }
}

const cache = new LRUCache<string, string>(3)
cache.put('lv', 'xzw')
cache.put('lv2', 'xzw2')
cache.put('lv3', 'xzw3')
cache.put('lv4', 'xzw4')
cache.put('lv5', 'xzw5')

console.log(cache)