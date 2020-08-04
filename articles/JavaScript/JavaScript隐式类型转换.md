## JavaScript 隐式类型转换

对于不熟悉的人来说，JavaScript 隐式类型转换存在很多让人无法预测的地方，在开发过程中，我们经常使用 `===` 来规避类型转换带来的风险。为了更加深入了解 JavaScript，让我们一起来熟悉 JavaScript 隐式类型转换的规则。

### 数据类型转换的基本规则

我们需要先了解一下 JavaScript 数据类型之间转换的基本规则，比如数字、字符串、布尔型、数组、对象之间的相互转换。

#### ToString

> 这里所说的 `ToString` 不是对象的 `toString` 方法，而是指其他类型的值转换为字符串类型的操作

这里我们讨论 `null`、`undefined`、`Boolean`、`Number`、`Array`、`Object` 转换为 `String` 的规则。

- null: 转换为 `"null"`
- undefined: 转换为 `"undefined"`
- Boolean: `true` 和 `false` 分别被转为 `true` 和 `false`
- Number: 转换为数字的字符串形式，如 `10` 转换为 `10`
- Array: `[1,2,3]` 将会转换为 `1,2,3`，空数组 `[]` 转换为空字符串，数组中的 `null` 或 `undefined` 元素，会被当做空字符串处理
- Object: 转换为字符串相当于直接调用 `Object.prototype.toString` 方法，返回 `"[object Object]"`

```javascript
String(null); // "null"
String(undefined); // "undefined"
String(true); // "true"
String(false); // "false"
String(10); // "10"
String([1, 2, 3]); // "1,2,3"
String([null]); // ""
String([1, undefined, 3]); // "1,,3"
String({}); // "[object Object]"
```

> 注意：对象的 `toString` 方法，满足 `ToString` 操作的规则，如果修改默认的 `toString` 方法，会导致不同的结果

#### ToNumber

> `ToNumber` 指其他类型转换为数字类型的操作

- null: 转换为 `0`
- undefined: 转换为 `NaN`
- String: 如果是纯数字类型，转换为对应的数字，空字符转换为 `0`，否则一律按照转换失败处理，转换为 `NaN`
- Boolean: `true` 和 `false` 分别被转换为 `1` 和 `0`
- Array: 数组首先会被转换为原始类型，即 `ToPrimitive`，然后根据转换后的基本数据类型按照上面的规则处理
- Object: 同数组处理

```javascript
Number(null); // 0
Number(undefined); // NaN
Number("10"); // 10
Number("10a"); // NaN
Number(""); // 0
Number(true); // 1
Number(false); // 0
Number([]); // 0
Number(["1"]); // 1
Number({}); // NaN
```

#### ToBoolean

> `ToBoolean` 指其他类型转换为布尔类型的操作

JavaScript 中的假值只有 `false`、`null`、`undefined`、`空字符串`、`0` 和 `NaN`，其他值转换为布尔型都为 `true`。

```javascript
Boolean(null); // false
Boolean(undefined); // false
Boolean(""); // flase
Boolean(NaN); // flase
Boolean(0); // flase
Boolean([]); // true
Boolean({}); // true
Boolean(Infinity); // true
```

#### ToPrimitive

> `ToPrimitive`指引用数据类型转换为基本数据类型的操作

- 先查找对象的 `valueOf` 方法，如果 `valueOf` 方法返回基本数据类型的值，则 `ToPrimitive` 的结果就是这个值，具体参考 [Object.prototype.valueOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf) 及其他类型的 `valueOf` 方法返回值
- 若 `valueOf` 不存在或者 `valueOf` 方法返回返回的是不是基本数据类型的值，就会尝试调用对象的 `toString` 方法，也就是会遵循对象的 `toString` 规则，然后使用 `toString` 的返回值作为 `ToPrimitive` 的结果，具体参考[Object.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) 及其他类型的 `toString` 方法返回值

> 注意：对于不同类型的引用数据类型来说，`ToPrimitive` 的规则有所不同，比如 `Date` 会先调用 `toString`，具体参考 [ECMA 标准](https://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive)

如果 `valueOf` 与 `toString` 方法都没有返回原始类型的值，则会抛出异常。

```javascript
Number([]); // 0
Number(["10"]); //10

const obj1 = {
  valueOf() {
    return 100;
  },
  toString() {
    return 101;
  }
};
Number(obj1); // 100

const obj2 = {
  toString() {
    return 102;
  }
};
Number(obj2); // 102

const obj3 = {
  toString() {
    return {};
  }
};
Number(obj3); // TypeError
```

前面说过，对象类型在 `ToNumber` 时会先 `ToPrimitive`，在根据转换后的基础类型 `ToNumber`。

例如 `Number([])` 将会经历以下过程

- 首先调用 `valueOf` 方法，但返回的是数组本身，不是基础类型
- 继续调用 `toString` 方法，得到 `""`
- 得到基础类型，执行 `ToNumber`，转换结果为 `0`

### `==` 比较时的隐式转换规则

宽松相等 `==` 和严格相等 `===` 的区别就在于宽松相等时会在比较重进行隐式转换。

#### `Boolean` 和其他类型的相等比较

- 只要 `Boolean` 参与比较，值会首先被转换为 `Number`
- 根据 `Boolean` 的 `ToNumber` 规则，`true` 和 `false` 分别被转换为 `1` 和 `0`

```javascript
false == 0; // true
true == 1; // true
true == 2; // false
```

#### `Number` 和 `String` 的相等比较

- 当 `Number` 和 `String` 进行相等比较时， `String` 会被转换为 `Number`
- 根据字符串的 `ToNumber` 规则，如果是纯数字形式的字符串，则转换为对应的数字，空字符转换为 `0`，否则一律按转换失败处理，转换为 `NaN`

```javascript
0 == ""; // true
1 == "1"; // true
1e21 == "1e21"; // true
Infinity == "Infinity"; // true
true == "1"; // true
false == "0"; // true
false == ""; // true
```

#### 引用类型和基础类型的相等比较

- 当引用类型和基础类型做相等比较时，引用类型会依照 `ToPrimitive` 规则转换为基础类型

```javascript
"[object Object]" == {}; // true
"1,2,3" == [1, 2, 3]; // true
```

想一想下面这道面试题

```javascript
const a = {
  i: 1,
  valueOf() {
    return this.i++;
  }
};

a == 1 && a == 2 && a == 3; // true
```

在改变了对象默认的 `valueOf` 或 `toString` 方法之后，就可以改变对象转换为基本类型的过程

#### `null`、`undefined` 和其他类型的相等比较

- `null` 和 `undefined` 宽松相等的结果为 `true`
- 规范规定，`null` 和 `undefined` 之间互相宽松相等，也和自身相等，但是和其他所有类型的值比较都不宽松相等

```javascript
null == false // false
undefined == false // false
```