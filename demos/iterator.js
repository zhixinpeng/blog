// 迭代器：具有next方法的对象，每次调用next都会返回一个结果对象，该结果对象有两个属性，value表示当前值，done表示遍历是否结束
function createIterator(items) {
  var i = 0;
  return {
    next: function() {
      var done = i >= items.length;
      var value = !done ? items[i++] : undefined;

      return {
        done: done,
        value: value
      };
    }
  };
}

// 迭代器需要用for of 来遍历，结果报错，因为我们生成的对象并不是iterable（可遍历的）
var iterator = createIterator([1, 2, 3]);

for (let value in iterator) {
  // TypeError: iterator is not iterable
  console.log(value);
}

// ES6规定：默认的iterator接口部署在数据结构的 Symbol.iterator属性上，若一个数据结构具有Symbol.iterator属性，就可以认为是iterable
// for of遍历的其实是对象的Symbol.iterator属性
// 模拟实现for of
function forOf(obj, cb) {
  let iterable, result;

  if (typeof obj[Symbol.iterator] !== "function") {
    throw new TypeError(result + " is not iterable");
  }
  if (typeof cb !== "function") {
    throw new TypeError("cb must be callable");
  }

  iterable = obj[Symbol.iterator];

  result = iterable.next();

  while (!result.done) {
    cb(result.vaule);
    result = iterable.next();
  }
}
