onmessage = (e) => {
  console.log(`Sub Worker: Received message - ${e.data}`)
  postMessage('PONG')
}
