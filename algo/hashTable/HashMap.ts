/**
 * 最基本的散列表
 */
class HashMap {
  map: string[] | undefined[]

  constructor() {
    this.map = []
  }

  // 散列函数
  loseHashCode(key: string): number {
    let hash = 0;
    // 从ASCII表中查到的ASCII值加到hash中
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i)
    }
    // 为了得到比较小的值，用hash和任意值取余
    return hash % 37;
  }

  // 向散列表中添加一个新的项
  put(key: string, value: string) {
    let position = this.loseHashCode(key)
    this.map[position] = value
  }

  // 从散列表中删除一个项
  remove(key: string) {
    this.map[this.loseHashCode(key)] = undefined
  }

  // 获取项
  get(key: string): string | undefined {
    return this.map[this.loseHashCode(key)]
  }

  // 打印
  print() {
    for (let i = 0; i < this.map.length; i++) {
      if (this.map[i] !== undefined) {
        console.log(i + ":" + this.map[i])
      }
    }
  }
}

const hash = new HashMap();
hash.put("angus", "peng");
hash.put("ideal", "lin");
hash.put("jay", "chou");
hash.remove("jay");
hash.get("angus")
hash.print();