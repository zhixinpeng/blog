// 请求超时函数
function requestTimeout(url, timeout = 3000) {
    // promise 的状态由 pending 到 fulfilled 或者 rejected，只能进行一次改变
    return new Promise((resolve, reject) => {
        // fetch 先得到结果就先 resolve
        fetch(url)
            .then((data) => data.json())
            .then((data) => resolve(data))
        // 否则就执行 reject
        setTimeout(() => {
            reject(Error('time is out!'))
        }, timeout)
    })
}
