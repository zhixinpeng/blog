// 函数柯里化
// 第一版
function curry(fn) {
  var args = [].slice.call(arguments, 1);
  return function() {
    var newArgs = args.concat([].slice.call(arguments));
    return fn.apply(this, newArgs);
  };
}

// 第二版
// 实际上是参数收集，当收集到原函数的参数时，执行函数，否则继续返回一个函数收集参数
function curry(fn, len = fn.length) {
  return _curry.call(this, fn, len);
}

function _curry(fn, len, ...args) {
  return function(...params) {
    let _args = [...args, ...params];
    if (_args.length >= len) {
      return fn.apply(this, _args);
    } else {
      return _curry.call(this, fn, len, ..._args);
    }
  };
}

// 第三版

/**
 * @param  fn           待柯里化的函数
 * @param  length       需要的参数个数，默认为函数的形参个数
 * @param  holder       占位符，默认当前柯里化函数
 * @return {Function}   柯里化后的函数
 */
function curry(fn, length = fn.length, holder = curry) {
  return _curry.call(this, fn, length, holder, [], []);
}
/**
 * 中转函数
 * @param fn            柯里化的原函数
 * @param length        原函数需要的参数个数
 * @param holder        接收的占位符
 * @param args          已接收的参数列表
 * @param holders       已接收的占位符位置列表
 * @return {Function}   继续柯里化的函数 或 最终结果
 */
function _curry(fn, length, holder, args, holders) {
  return function(..._args) {
    //将参数复制一份，避免多次操作同一函数导致参数混乱
    let params = args.slice();
    //将占位符位置列表复制一份，新增加的占位符增加至此
    let _holders = holders.slice();
    //循环入参，追加参数 或 替换占位符
    _args.forEach((arg, i) => {
      //真实参数 之前存在占位符 将占位符替换为真实参数
      if (arg !== holder && holders.length) {
        let index = holders.shift();
        _holders.splice(_holders.indexOf(index), 1);
        params[index] = arg;
      }
      //真实参数 之前不存在占位符 将参数追加到参数列表中
      else if (arg !== holder && !holders.length) {
        params.push(arg);
      }
      //传入的是占位符,之前不存在占位符 记录占位符的位置
      else if (arg === holder && !holders.length) {
        params.push(arg);
        _holders.push(params.length - 1);
      }
      //传入的是占位符,之前存在占位符 删除原占位符位置
      else if (arg === holder && holders.length) {
        holders.shift();
      }
    });
    // params 中前 length 条记录中不包含占位符，执行函数
    if (
      params.length >= length &&
      params.slice(0, length).every(i => i !== holder)
    ) {
      return fn.apply(this, params);
    } else {
      return _curry.call(this, fn, length, holder, params, _holders);
    }
  };
}

// 精简
var curry = fn =>
  (judge = (...args) =>
    args.length === fn.length ? fn(...args) : arg => judge(...args, arg));
