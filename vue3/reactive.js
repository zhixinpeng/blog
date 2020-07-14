// 原始数据=>响应式数据缓存集合
const toProxy = new WeakMap()
// 响应式数据=>原始数据缓存集合
const toRaw = new WeakMap()
// 存储effect栈
const effectStack = []
// 特殊集合，存储对象的依赖关系
const targetMap = new WeakMap()

// proxy数据处理handler
const baseHandler = {
  get(target, key) {
    // 获取值时进行依赖收集
    track(target, key)
    const res = Reflect.get(target, key)
    return typeof res === 'object' ? reactive(res) : res
  },

  set(target, key, value) {
    const info = { old: Reflect.get(target, key), new: value }
    const res = Reflect.set(target, key, value)
    // 触发更新
    trigger(target, key, info)
    return res
  },
}

// 数据响应式处理
function reactive(target) {
  // 首先从两个缓存集合中获取到对应缓存数据
  let observed = toProxy.get(target)
  if (observed) {
    return observed
  }
  if (toRaw.get(target)) {
    return target
  }

  // 获取不到缓存则进行响应式处理
  observed = new Proxy(target, baseHandler)

  // 响应式处理后设置缓存，方便下次使用时可以直接从缓存中获取
  toProxy.set(target, observed)
  toRaw.set(observed, target)
  return observed
}

// 依赖收集
function track(target, key) {
  const effect = effectStack[effectStack.length - 1]
  if (effect) {
    let depMap = targetMap.get(target)
    if (depMap === undefined) {
      depMap = new Map()
      targetMap.set(target, depMap)
    }
    let dep = depMap.get(key)
    if (dep === undefined) {
      dep = new Set()
      depMap.set(key, dep)
    }
    if (!dep.has(effect)) {
      dep.add(effect)
      effect.deps.push(dep)
    }
  }
}

// 触发更新
function trigger(target, key, info) {
  const depMap = targetMap.get(target)
  if (depMap === undefined) return
  const effects = new Set()
  const computedRunners = new Set()

  if (key) {
    const deps = depMap.get(key)
    deps.forEach((effect) => {
      if (effect.computed) {
        computedRunners.add(effect)
      } else {
        effects.add(effect)
      }
    })
  }

  effects.forEach((effect) => effect())
  computedRunners.forEach((computed) => computed())
}

function computed(fn) {
  // 特殊的effect
  const runner = effect(fn, { computed: true, lazy: true })
  return {
    effect: runner,
    get value() {
      return runner()
    },
  }
}

// 更新收集
function effect(fn, options = {}) {
  const e = createReactiveEffect(fn, options)
  if (!options.lazy) {
    e()
  }
  return e
}

function createReactiveEffect(fn, options) {
  const effect = function (...args) {
    return run(effect, fn, args)
  }
  effect.deps = []
  effect.computed = options.computed
  effect.lazy = options.lazy
  return effect
}

function run(effect, fn, args) {
  if (effectStack.indexOf(effect) === -1) {
    try {
      effectStack.push(effect)
      return fn(...args)
    } finally {
      effectStack.pop()
    }
  }
}
