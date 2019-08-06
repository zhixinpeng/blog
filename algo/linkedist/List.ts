// 链表接口声明
interface List<T> {
  insertToHead(value: T): void

  insertToTail(value: T): void

  findByValue(value: T): any

  findByIndex(index: number): any

  insertToIndex(value: T, index: number): void

  remove(value: T): boolean

  toString(): string
}

export default List