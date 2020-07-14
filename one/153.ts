function multiRequest(urls: string[], max: number) {
  const urlLength: number = urls.length;
  const requestQueue: any[] = [];
  const results: any[] = [];

  let i: number = 0;

  // 模拟接口请求函数并获得请求结果
  const request = (url: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(url);
      }, 1000);
    })
  }

  // 批量接口请求处理
  const handleRequest = (url: string) => {
    const req = request(url).then(res => {
      results.push(res);
    }).catch(error => {
      results.push(error);
    }).finally(() => {
      // 请求完成就出队，维护requestQueue队列
      requestQueue.shift();
      // 维护请求队列的长度不能大于最大并发长度 max，开始请求下一个接口
      if (requestQueue.length <= max) {
        handleRequest(urls[++i]);
      }
      // 当结果长度等于接口长度时，表示全部都请求完成了
      if (results.length === urlLength) {
        results.forEach(result => {
          console.log(result)
        })
      }
    })

    // 每次请求都插入请求队列
    requestQueue.push(req);
    // 维护请求队列的长度不能大于最大并发长度 max，开始请求下一个接口
    if (requestQueue.length <= max) {
      handleRequest(urls[++i]);
    }
  }

  // 开始请求第一个接口
  handleRequest(urls[i]);
}