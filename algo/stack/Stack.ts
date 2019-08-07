/**
 * 基于单向链表实现栈结构
 */
class Stack<T>{
  private node: LinkedNode<T> | null = null
  size: number = 0

  public push(value: T) {
    if (!value) return
    const newNode = new LinkedNode(value)
    if (!this.node) {
      this.node = newNode
    } else {
      newNode.next = this.node
      this.node = newNode
    }
    this.size++
  }

  public pop(): T | null {
    if (!this.node) {
      return null
    }
    const value = this.node.value
    this.node = this.node.next
    this.size--
    return value
  }
}

/**
 * 单向链表
 */
class LinkedNode<T>{
  value: T
  next: LinkedNode<T> | null

  constructor(value: T, next: LinkedNode<T> | null = null) {
    this.value = value
    this.next = next
  }
}

export default Stack