// 单例模式实现localStorage
function Storage() {}

Storage.getInstance = (function () {
  var instance = null;
  return function () {
    if (!instance) {
      instance = new Storage();
    }
    return instance;
  }
})();

Storage.prototype.setItem = function (key, value) {
  return localStorage.setItem(key, value);
}

Storage.prototype.getItem = function (key, value) {
  return localStorage.getItem(key, value);
}

// 测试代码
let a = Storage.getInstance();
let b = Storage.getInstance();
console.log(a === b);

a.setItem('key', 1);
console.log(b.getItem('key'));