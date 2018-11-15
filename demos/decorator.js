// 装饰者模式
Function.prototype.before = function (beforefn) {
  // 保存原函数引用
  var self = this;
  // 返回包含了原函数和新函数的'代理函数'
  return function () {
    // 执行新函数，修正this
    beforefn.apply(this, arguments);
    // 执行新函数
    return self.apply(this, arguments);
  };
};

Function.prototype.after = function (afterfn) {
  var self = this;
  return function () {
    afterfn.apply(this, arguments);
    return self.apply(this, arguments);
  };
};

var func = function () {
  console.log('2');
};

var func1 = function () {
  console.log('1');
};

var func2 = function () {
  console.log('3');
};

func = func.before(func1).after(func2);

func();
