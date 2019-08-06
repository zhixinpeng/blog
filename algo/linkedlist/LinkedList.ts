/**
 * 双向链表，更加常用设计也更加复杂一些
 * 需要更多的存储空间和操作复杂度
 */
import List from "./List"

// 声明双向链表节点类
class LinkedListNode<T> {
  item: T
  prev: LinkedListNode<T> | null
  next: LinkedListNode<T> | null

  constructor(item: T, prev: LinkedListNode<T> | null = null, next: LinkedListNode<T> | null = null) {
    this.item = item
    this.prev = prev
    this.next = next
  }
}

// 声明双向链表类
class LinkedList<T> implements List<T>{
  size: number
  private head: LinkedListNode<T> | null
  private tail: LinkedListNode<T> | null

  constructor() {
    this.size = 0
    this.head = new LinkedListNode<any>(null)
    this.tail = new LinkedListNode<any>(null)
  }

  public insertToHead(value: T): void {
    let p = this.head
    const newNode = new LinkedListNode<any>(value)
    // 没有元素的时候要初始化头尾节点
    if (!p) {
      this.head = this.tail = newNode
    } else {
      p.prev = newNode
      newNode.next = p
      this.head = newNode
    }
    this.size++
  }

  public insertToTail(value: T): void {
    let p = this.tail
    const newNode = new LinkedListNode<any>(value)
    if (!p) {
      this.head = this.tail = newNode
    } else {
      p.next = newNode
      newNode.prev = p
      this.tail = newNode
    }
    this.size++
  }

  public findByValue(value: T): LinkedListNode<T> | null {
    let p = this.head
    while (p && p.item !== value) {
      p = p.next
    }
    return p
  }

  public findByIndex(index: number): LinkedListNode<T> | null {
    let p = this.head
    let pos = 0
    while (p && pos !== index) {
      p = p.next
      pos++
    }
    return p
  }

  public insertToIndex(value: T, index: number): void {
    let p = this.head
    let pos = 0
    const newNode = new LinkedListNode<any>(value)
    while (p && pos !== index) {
      p = p.next
      pos++
    }
    if (p === null) return
    newNode.next = p.next
    p.next = newNode
    newNode.prev = p
    this.size++
  }

  public remove(value: T): boolean {
    let p = this.head
    while (p && p.item !== value) {
      p = p.next
    }
    if (!p) return false
    if (p.prev) {
      p.prev.next = p.next
    } else {
      this.head = p.next
    }
    if (p.next) {
      p.next.prev = p.prev
    } else {
      this.tail = p.prev
    }
    this.size--
    return true
  }

  public toString(): string {
    let p = this.head
    let res: string = ""
    while (p) {
      res = `${res} ${p.item}`
      p = p.next
    }
    return res
  }
}

// 示例
const linkedList = new LinkedList()
linkedList.insertToHead('12')
linkedList.insertToHead('haha')
linkedList.insertToHead('www')
linkedList.insertToTail('zxc')
linkedList.insertToIndex('12ooo', 0)
linkedList.remove('12oooo')
console.log(linkedList.toString())