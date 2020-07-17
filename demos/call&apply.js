// call 的模拟实现
Function.prototype.myCall = function (context) {
  context = context || window
  context.fn = this

  const args = []
  for (let i = 1; i < arguments.length; i++) {
    args.push(`arguments[${i}]`)
  }

  const result = eval(`context.fn(${args})`)
  delete context.fn
  return result
}

// apply 的模拟实现
Function.prototype.myApply = function (context, args) {
  context = context || window
  context.fn = this

  let result
  if (args.length) {
    const argus = []
    for (let i = 0; i < args.length; i++) {
      argus.push(`args[${i}]`)
    }
    result = eval(`context.fn(${argus})`)
  } else {
    result = context.fn()
  }

  delete context.fn

  return result
}
