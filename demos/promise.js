// 剖析promise内部结构，手写一个promise
// promise标准解读
// 1. 只有一个 then 方法，没有 catch, race, all等方法，甚至没有构造函数
// 2. then 方法返回一个新的 promise
// 3. 不同的Promise的实现需要可以互相调用
// 4. Promise的初始状态为 pending，它可以由此状态转换为 fulfilled/resolved 或者 rejected，一旦状态确定，则不可转换

// 构造函数
function Promise(executor) {
  var self = this;

  this.status = 'pending'; // Promise的初始状态
  this.data = undefined; // Promise的值
  this.onResolvedCallback = []; // Promise resolve时的回调函数集，因为Promise结束之前可能有多个回调添加
  this.onRejectedCallback = []; // Promise reject时的回调函数集，因为Promise结束之前可能有多个回调添加

  // 在判断状态为pending之后把状态变更为相应的值，并把对应的value/reason存储在data属性上，之后依次执行回调函数
  function resolve(value) {
    if (value instanceof Promise) {
      return value.then(resolve, reject);
    }
    setTimeout(function () {
      if (self.status === 'pending') {
        self.status = 'resolved';
        self.data = value;
        for (var i = 0; i < self.onResolvedCallback.length; i++) {
          self.onResolvedCallback[i](value);
        }
      }
    });
  }

  function reject(reason) {
    setTimeout(function () {
      if (self.status === 'pending') {
        self.status = 'rejected';
        self.data = reason;
        for (var i = 0; i < self.onRejectedCallback.length; i++) {
          self.onRejectedCallback[i](reason);
        }
      }
    });
  }

  // 考虑到executor执行过程中有可能出错，所以使用try/catch包裹，并在出错之后以catch的值reject掉这个Promise
  try {
    executor(resolve, reject); // 执行executor并传入相应的参数
  } catch (error) {
    reject(error);
  }
}

Promise.prototype.then = function (onResolved, onRejected) {
  var self = this;
  var promise;

  // 根据标准，如果 then的参数不是 function，则我们需要忽略它
  onResolved = typeof onResolved === 'function' ? onResolved : function (value) {
    return value
  };
  onRejected = typeof onRejected === 'function' ? onRejected : function (reason) {
    throw reason
  };

  if (self.status === 'resolved') {
    return promise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          var x = onResolved(self.data);
          resolvePromise(promise, x, resolve, reject);
        } catch (error) {
          // 若出错，以捕获到的错误作为promise的结果
          reject(error);
        }
      });
    })
  }

  if (self.status === 'rejected') {
    return promise = new Promise(function (resolve, reject) {
      try {
        var x = onRejected(self.data);
        resolvePromise(promise, x, resolve, reject);
      } catch (error) {
        reject(e);
      }
    })
  }

  // 如果当前Promise的状态还处于pengding状态，我们并不能确定该调用onResolve还是onRejected
  // 只能等到Promise的状态确定后，才能确定如何处理
  if (self.status === 'pending') {
    return promise = new Promise(function (resolve, reject) {
      self.onResolvedCallback.push(function (value) {
        try {
          var x = onResolved(self.data);
          resolvePromise(promise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });

      self.onRejectedCallback.push(function (reason) {
        try {
          var x = onRejected(self.data);
          resolvePromise(promise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      })
    })
  }
}

Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
}


function resolvePromise(promise, x, resolve, reject) {
  var then;
  var thenCallOrThrow = false;

  if (promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise!'));
  }

  if (x instanceof Promise) {
    if (x.status === 'pending') {
      // 若Promise的状态还未确定，那么它可能被一个thenable决定最终状态和值
      x.then(function (value) {
        resolvePromise(promise, value, resolve, reject);
      }, reject);
    } else {
      // 如果Promise的状态已经确定了，那么它肯定是一个“正常”值，而不是一个thenable，这里直接读取状态
      x.then(resolve, reject);
    }
    return;
  }

  if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
    try {
      then = x.then;
      if (typeof then === 'function') {
        then.call(x, function rs(y) {
          if (thenCallOrThrow) return;
          thenCallOrThrow = true;
          return resolvePromise(promise, y, resolve, reject);
        }, function rj(r) {
          if (thenCallOrThrow) return;
          thenCallOrThrow = true;
          return reject(r);
        });
      } else {
        resolve(x);
      }
    } catch (error) {
      if (thenCallOrThrow) return;
      thenCallOrThrow = true;
      return reject(error);
    }
  } else {
    resolve(x);
  }
}

Promise.deferred = Promise.defer = function () {
  var dfd = {};
  dfd.promise = new Promise(function (resolve, reject) {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}