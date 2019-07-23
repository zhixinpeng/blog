// 模拟实现一个new
function _new(fn, ...args) {
  // 创建一个空对象，空对象的__proto__属性指向构造函数的原型对象
  var obj = Object.create(fn.prototype);
  // 空对象赋值给构造函数内部的this，用构造函数内部的方法来修改空对象
  const result = fn.apply(obj, ...args);
  // 如果构造函数返回一个非基本类型的值，则返回这个值，否则返回上面创建的对象
  return Object.prototype.toString.call(result) === "[object Object]"
    ? result
    : obj;
}

