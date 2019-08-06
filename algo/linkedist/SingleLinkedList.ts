/**
 * 1)单链表的插入、删除、查找操作
 * 2>链表支持任意类型数据
 */
import List from "./List";

// 声明链表单节点类
class SingleNode<T> {
  public value: T
  public next: SingleNode<T> | null

  constructor(value: T, next: SingleNode<T> | null = null) {
    this.value = value
    this.next = next
  }
}

// 声明单链表类
class SingleLinkedList<T> implements List<T> {
  // 哨兵头节点
  private readonly head: SingleNode<T>

  constructor() {
    this.head = new SingleNode<any>(null)
  }

  public insertToHead(value: T): void {
    const newHead = new SingleNode(value)
    newHead.next = this.head.next
    this.head.next = newHead
  }

  public insertToTail(value: T): void {
    const newTail = new SingleNode(value)
    let p = this.head
    while (p.next !== null) {
      p = p.next
    }
    p.next = newTail
  }

  public findByValue(value: T): SingleNode<T> | null {
    let p = this.head

    while (p.next !== null) {
      if (p.next.value = value) return p.next
      p = p.next
    }

    return p.next
  }

  public findByIndex(index: number): SingleNode<T> | null {
    let p = this.head
    let pos = 0
    while (p.next !== null && pos !== index) {
      p = p.next
      pos++
    }
    return p.next
  }

  public insertToIndex(value: T, index: number): void {
    const newNode = new SingleNode(value)
    let p = this.head
    let pos = 0
    while (p.next !== null && pos !== index) {
      p = p.next
      pos++
    }
    if (p.next === null) return
    newNode.next = p.next.next
    p.next.next = newNode
  }

  public remove(value: T): boolean {
    let p = this.head
    while (p.next !== null) {
      if (p.next.value === value) break
      p = p.next
    }
    if (p.next === null) return false
    p.next = p.next.next
    return true
  }

  public toString(): string {
    let res: string = ""
    let p = this.head
    while (p.next !== null) {
      res = `${res} ${p.next.value}`
      p = p.next
    }
    return res
  }
}

// 示例
const singleLinkedList = new SingleLinkedList<string>()
singleLinkedList.insertToTail("god")
singleLinkedList.insertToTail("my")
singleLinkedList.insertToIndex("haha", 1)
console.log(singleLinkedList.toString())