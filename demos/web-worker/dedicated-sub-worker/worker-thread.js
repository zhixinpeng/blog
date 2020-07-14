onmessage = (e) => {
  console.log(`Worker: Received message - ${e.data}`)
  setTimeout(() => {
    let worker = new Worker('worker-sub-thread.js')
    worker.onmessage = (e) => {
      console.log(`Worker: Received from sub worker - ${e.data}`)
    }
    worker.postMessage('PING')
  }, 1000)
  postMessage('PONG')
}
