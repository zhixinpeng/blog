// 模拟 Array.prototype.splice 方法
interface Array<T> {
  _splice<T>(start: number, deleteCount?: number, ...args: T[]): T[]
}

Array.prototype._splice = function <T>(start: number, deleteCount: number, ...args: T[]): T[] {
  if (start < 0) {
    if (Math.abs(start) > this.length) {
      start = 0
    } else {
      start += this.length
    }
  }

  if (typeof deleteCount === 'undefined') {
    deleteCount = this.length - start
  }

  const removeList = this.slice(start, start + deleteCount)

  const right = this.slice(start + deleteCount)

  let addIndex = start
  args.concat(right).forEach(item => {
    this[addIndex] = item
    addIndex++
  })
  this.length = addIndex

  return removeList
}