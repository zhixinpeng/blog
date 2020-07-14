let a = 666
console.log("shared-worker")
onconnect = function (e) {
  var port = e.ports[0]
  port.onmessage = function () {
    port.postMessage(a++)
  }
}