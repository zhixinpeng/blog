/**
 * 到碰撞处理的散列表
 * 实际在JavaScript中，单独实现一个散列表价值不大
 * 实际上通常使用Object、Map、Set来当散列表使用，Array就是基于散列表实现的
 */
class HashTable {
  store: any

  constructor() {
    // 创建一个没有原型链的对象
    this.store = Object.create(null)
  }

  /**
   * 散列函数
   */
  hash(string: string) {
    let len = string.length;
    let hash = len;
    for (let i = 0; i < len; i++) {
      hash = ((hash << 5) ^ (hash >> 27)) ^ string.charCodeAt(i)
    }
    return hash & 0x7FFFFFFF;
  }

  isCresh(item: any) {
    return Object.prototype.toString.call(item) === "[object Map]"
  }

  put(item: any) {
    if (typeof item.key !== "string") {
      throw "item must have  key"
    }
    let hash = this.hash(item.key)
    // 碰撞处理
    let cresh = this.store[hash]
    if (cresh) {
      if (cresh.key === item.key) {
        this.store[hash] = item
        return
      }

      if (!this.isCresh(cresh)) {
        this.store[hash] = new Map()
      }
      this.store[hash].set(item.key, item)
    } else {
      this.store[hash] = item
    }
  }

  get(key: string) {
    let hash = this.hash(key)
    let value = this.store[hash] || null
    if (this.isCresh(value)) {
      return value.get(key)
    } else {
      return value
    }
  }

  remove(key: string) {
    let hash = this.hash(key)
    let value = this.store[hash]
    if (!value) {
      return null
    }
    if (this.isCresh(value)) {
      value.delete(key)
    } else {
      delete this.store[hash]
    }
  }

  clear() {
    this.store = {}
  }
}

/**
 * 基于Map实现的散列表，性能提升三分之一
 */
class HashTableBaseMap {
  store: Map<number, any>

  constructor() {
    this.store = new Map()
  }

  hash(string: string) {
    let len = string.length;
    let hash = len;
    for (let i = 0; i < len; i++) {
      hash = ((hash << 5) ^ (hash >> 27)) ^ string.charCodeAt(i)
    }
    return hash & 0x7FFFFFFF;
  }

  isCresh(item: Object) {
    return Object.prototype.toString.call(item) === "[object Map]"
  }

  put(item: { key: string }) {
    if (typeof item.key !== "string") {
      throw "item must have key"
    }
    let hash = this.hash(item.key)
    this.store.set(hash, item)
  }

  get(key: string) {
    let hash = this.hash(key);
    let value = this.store.get(hash);
    if (this.isCresh(value)) {
      return value.get(key);
    } else {
      return value
    }
  }

  remove(key: string) {
    let hash = this.hash(key);
    let value = this.store.get(hash);
    if (!value) {
      return null;
    }
    if (this.isCresh(value)) {
      value.delete(key);
    } else {
      this.store.delete(hash)
    }
  }

  clear() {
    this.store = new Map();
  }
} 