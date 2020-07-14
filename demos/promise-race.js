const _race = (p) => {
  return new Promise((resolve, reject) => {
    p.forEach((item) => {
      Promise.resolve(item).then(resolve, reject)
    })
  })
}

let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 100)
})

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('failed')
  }, 500)
})

_race([p1, p2])
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })
