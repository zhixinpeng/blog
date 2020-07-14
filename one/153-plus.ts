// 实现一个AJAX请求函数
const req = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    // 第三个参数为false会变为同步
    xhr.open('get', url, true)
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(url)
      } else {
        reject(url)
      }
    }
    xhr.send()
  })
}

// 实现一个批量请求控制并发数函数
const multiRequestPlus = (urls: string[], maxNum: number): Promise<any> => {
  let i: number = 0
  // 完成集合
  const ret: any[] = []
  // 执行集合
  const executing: any[] = []
  const enqueue = (): Promise<void> => {
    // 判断是否全部执行完成
    if (urls.length === i) {
      return Promise.resolve()
    }
    const p = Promise.resolve().then(() => req(urls[i++]))
    ret.push(p)
    const e = p.then(() => executing.splice(0, 1))
    executing.push(e)

    let r = Promise.resolve()
    // 判断执行长度是否超过最大并发长度，超过的话必须等其中一个结束完才能继续下面的请求
    if (executing.length >= maxNum) {
      r = Promise.race(executing)
    }
    return r.then(() => enqueue())
  }
  // 全部执行完按照顺序返回
  return enqueue().then(() => Promise.all(ret))
}

multiRequestPlus(Array.from({ length: 10 }, (u, i) => ('/api/test?' + i)), 2).then(res => {
  console.log(res)
})