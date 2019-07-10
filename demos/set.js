// 模拟实现Set
// Set包含属性size，方法add、delete、has、clear、forEach
// 第一版
(function(global) {
  function Set(data) {
    this._values = [];
    this.size = 0;

    data &&
      data.forEach(function(item) {
        this.add(item);
      }, this);
  }

  Set.prototype.add = function(value) {
    if (this._values.indexOf(value) === -1) {
      this._values.push(value);
      ++this.size;
    }
    return this;
  };

  Set.prototype.has = function(value) {
    return this._values.indexOf(value) !== -1;
  };

  Set.prototype.delete = function(value) {
    var index = this._values.indexOf(value);
    if (index === -1) return false;
    this._values.splice(index, 1);
    --this.size;
    return true;
  };

  Set.prototype.clear = function(value) {
    this._values = [];
    this.size = 0;
  };

  Set.prototype.forEach = function(fn, thisArg) {
    thisArg = thisArg || global;
    for (var i = 0; i < this._values.length; i++) {
      fn.call(thisArg, this._values[i], this._values[i], this);
    }
  };

  Set.length = 0;

  global.Set = Set;
})(this);

// 第二版，Set对于NaN来说会进行去重，而实际上NaN.indexOf(NaN) === -1，利用Symbol进行独一无二值处理
(function(gloabl) {
  var NaNSymbol = Symbol(NaN);

  var encodeVal = function(value) {
    return value !== value ? NaNSymbol : value;
  };

  var decodeVal = function(value) {
    return value === NaNSymbol ? NaN : value;
  };

  function Set(data) {
    this._values = [];
    this.size = 0;

    data &&
      data.forEach(function(item) {
        this.add(item);
      }, this);
  }

  Set.prototype.add = function(value) {
    value = encodeVal(value);
    if (this._values.indexOf(value) === -1) {
      this._values.push(value);
      ++this.size;
    }
    return this;
  };

  Set.prototype.has = function(value) {
    return this._values.indexOf(encodeVal(value)) !== -1;
  };

  Set.prototype.delete = function(value) {
    var index = this._values.indexOf(encodeVal(value));
    if (index === -1) return false;
    this._values.splice(index, 1);
    --this.size;
    return true;
  };

  Set.prototype.clear = function(value) {};

  Set.prototype.forEach = function(fn, thisArg) {};

  Set.length = 0;

  global.Set = Set;
})(this);

// 第三版 迭代器的实现和处理，初始化以及执行keys()、values()、entries()方法时都会返回迭代器
(function(global) {
  var NaNSymbol = Symbol(NaN);

  var encodeVal = function(value) {
    return value !== value ? NaNSymbol : value;
  };

  var decodeVal = function(value) {
    return value === NaNSymbol ? NaN : value;
  };

  var makeIterator = function(array, iterator) {
    var nextInex = 0;

    // new Set(new Set())会调用这里
    var obj = {
      next: function() {
        return nextInex < array.length
          ? { value: iterator(array[nextInex++]), done: false }
          : { value: void 0, done: true };
      }
    };

    // [...set.keys()]会调用这里
    obj[Symbol.iterator] = function() {
      return obj;
    };

    return obj;
  };

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

  function Set(data) {
    this._values = [];
    this.size = 0;

    forOf(data, item => {
      this.add(item);
    });
  }

  Set.prototype.Symbol.iterator = function() {
    return this.values();
  };

  Set.prototype.values = Set.prototype.keys = function() {
    return makeIterator(this._values, function(value) {
      return decodeVal(value);
    });
  };

  Set.prototype.entries = function() {
    return makeIterator(this._values, function(value) {
      return [decodeVal(value), decodeVal(value)];
    });
  };
})(this);
