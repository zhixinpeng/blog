/**
 * 实现一个符合PromiseA+规范的Promise
 * 规范地址：https://promisesaplus.com/
 */

class Promise {
  /**
   * Promise的声明
   * 使用方式：new Promise((resolve, reject) => {})
   * 传入一个参数（函数），名为excutor，传入即执行
   * excutor有两个参数，一个为resolve(成功)，一个为reject(失败)
   * resolve和reject都是可执行的函数
   */
  constructor(executor) {
    // 初始化state为等待态
    this.state = "pending";
    // 成功的值
    this.value = undefined;
    // 失败的原因
    this.reason = undefined;
    // 成功存放的数组
    this.onResolvedCallback = [];
    // 失败存放的数组
    this.onRejectedCallback = [];
    let resolve = value => {
      // state改变，resolve调用就会失败
      if (this.state === "pending") {
        // resolve调用后，state转化为成功态
        this.state = "fulfilled";
        // 储存成功的值
        this.value = value;
        // 一旦resolve执行，调用成功数组的函数
        this.onResolvedCallback.forEach(fn => fn());
      }
    };
    let reject = reason => {
      // state改变，reject调用就会失败
      if (this.state === "pending") {
        // reject调用后，state转化为失败态
        this.state = "rejected";
        // 储存失败的原因
        this.reason = reason;
        // 一旦reject执行，调用失败数组的函数
        this.onRejectedCallback.forEach(fn => fn());
      }
    };
    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // then有两个参数onFulfilled和onRejected
  then(onFulfilled, onRejected) {
    // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : value => value;
    // onRejected如果不是函数，就忽略onRejected，直接扔出错误
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : error => {
            throw error;
          };
    // 声明返回的promise2
    let promise2 = new Promise((resolve, reject) => {
      // 状态为fulfilled，执行onFulfilled，传入成功的值
      if (this.state === "fulfilled") {
        // 异步处理
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            // resolvePromise函数，处理return的promise和默认的promise2的关系
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      // 状态为rejected，执行onRejected，传入失败的原因
      if (this.state === "rejected") {
        // 异步处理
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      // 状态为pedding
      if (this.state === "pending") {
        // onFulfilled传入到成功数组
        this.onRejectedCallback.push(() => {
          // 异步处理
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        // onRejected传入到失败数组
        this.onResolvedCallback.push(() => {
          // 异步处理
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
    });
    // 返回promise，完成链式调用
    return promise2;
  }

  catch(fn) {
    return this.then(null, fn);
  }

  resolve(val) {
    return new Promise((resolve, reject) => {
      resolve(val);
    });
  }

  reject(val) {
    return new Promise((resolve, reject) => {
      reject(val);
    });
  }

  race(promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(resolve, reject);
      }
    });
  }

  all(promises) {
    let arr = [];
    let i = 0;
    return new Promise((resolve, reject) => {
      const processData = (index, data) => {
        arr[index] = data;
        i++;
        if (i === promises.length) {
          resolve(arr);
        }
      };
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(data => {
          processData(i, data);
        }, reject);
      }
    });
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用报错
  if (x === promise2) {
    // reject报错
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  // 防止多次调用
  let called;
  // x不是null，且x是对象或者函数
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      // A+规定，声明then=x的then方法
      let then = x.then;
      // 如果then是函数，就默认是promise
      if (typeof then === "function") {
        // 就让then执行，第一个参数是this，后面是成功回调和失败回调
        then.call(
          x,
          y => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            // resolve的结果依旧是promise，那就继续解析
            resolvePromise(promise2, x, resolve, reject);
          },
          error => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            // 失败了就直接失败
            reject(error);
          }
        );
      } else {
        // 直接成功即可
        resolve(x);
      }
    } catch (error) {
      // 也属于失败
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}
