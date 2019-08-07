/**
 * 使用双栈结构实现浏览器的前进后退
 */
import Stack from "./Stack"

class Browser<T> {
  private backStack: Stack<T>
  private forwardStack: Stack<T>
  private current: T

  constructor(current: T) {
    this.backStack = new Stack<T>()
    this.forwardStack = new Stack<T>()
    this.current = current
  }

  public back(): T | null {
    if (this.backStack.size > 0) {
      this.forwardStack.push(this.current)
      this.current = this.backStack.pop()!
      return this.getCurrentPage()
    }
    return null
  }

  public forward(): T | null {
    if (this.forwardStack.size > 0) {
      this.backStack.push(this.current)
      this.current = this.forwardStack.pop()!
      return this.getCurrentPage()
    }
    return null
  }

  /**
   * 在网页上点击一个链接
   * @param value
   */
  public linkUrl(value: T) {
    this.current && this.backStack.push(this.current)
    this.current = value
  }

  public getCurrentPage(): T {
    return this.current
  }
}

// 示例
const browser = new Browser('www.baidu.com')
browser.linkUrl('www.yuanzhoucehui.com')
browser.linkUrl('www.github.com/jsrdxzw')
// browser.back()
// www.github.com/jsrdxzw
console.log(browser.getCurrentPage())
browser.back()
// www.yuanzhucehui.com
console.log(browser.getCurrentPage())
browser.back()
// www.baidu.com
console.log(browser.getCurrentPage())
browser.back()
// www.baidu.com
console.log(browser.getCurrentPage())
browser.forward()
// www.yuanzhucehui.com
console.log(browser.getCurrentPage())
browser.forward()
// www.github.com/jsrdxzw
console.log(browser.getCurrentPage())
