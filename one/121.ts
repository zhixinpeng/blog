function countOne(n: number) {
  var factor: number = 1
  var count: number = 0
  var next: number = Math.floor(n / factor)
  while (next !== 0) {
    var lower = n - next * factor
    var curr = next % 10
    var high = Math.floor(n / (10 * factor))

    if (curr === 0) {
      count += high * factor
    } else if (curr === 1) {
      count += high * factor + lower + 1
    } else {
      count += (high + 1) * factor
    }

    factor *= 10
    next = Math.floor(n / factor)
  }
  return count
}
console.time('count')
console.log(countOne(4000000))
console.timeEnd('count')