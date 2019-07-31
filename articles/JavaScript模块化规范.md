## JavaScript模块化规范

在阅读 VUE 源码前，应该准备以下知识

- ES6
- NODE & NPM
- [ROLLUP](https://rollupjs.org/guide/zh/)
- [FLOW](https://flow.org/en/)

后续 VUE3.0 版本将会以 proxy 与 TypeScript 主要技术核心，因此后续应逐步了解

- TypeScript

TypeScript 已经成为一种趋势，无论是三大框架 Angular/react/vue，还是 node，使用 TypeScript 为主要开发语言的开源作品和项目越来越多，因此必须加强对 TypeScript 的学习和使用

### ROLLUP

ROLLUP 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码。ROLLUP 对代码模块化使用新的标准化格式，如 CommonJS 和 AMD。具体作用和使用方式见其 [中文文档](https://rollupjs.org/guide/zh/)。

这里，我们简单介绍一下 JavaScript 的模块化标准，这在我们使用 webpack 等插件处理代码时都用的到

#### CommonJS（同步加载模块）

CommonJS 通过 require 方法来同步加载所要依赖的其他模块，通过 exports 或 module.exports 来导出需要暴露的接口。

规范代表：node.js 的模块化系统

使用方式：

```javascript
// 导入
require("module");
// 导出
module.exports = fn;
exports.getUserInfo = function() {};
```

优点：

- 简单易用
- 服务器端便于复用

缺点：

- 同步加载不适合在浏览器环境中使用，同步意味着阻塞加载，浏览器资源是异步加载的
- 不能非阻塞的并行加载多个模块

为什么浏览器不能使用同步加载，服务端可以：

- 服务端模块都放在服务端，对于服务器来说模块加载是同步的
- 对于浏览器来说，模块都放在服务端，加载还取决于网络的快慢等因素，如果需要等很长时间，整个应用就会被阻塞
- 因此，浏览器的模块，不能采用同步加载（CommonJS）,只能采用异步加载（AMD）

### AMD（异步加载模块）

AMD 采用异步方式加载模块，模块的加载不影响后面语句的运行。所有依赖模块的语句，都定义在一个回调函数中，等在所有模块加载完成之后，回调函数才会执行

规范代表：require.js

使用方式：

```javascript
// 定义
define("module", ["dep1", "dep2"], function(d1, d2) {});
// 加载模块
require(["module", "../app"], function(module, app) {});
```

require.js 执行流程：

- require 函数检查依赖的模块，根据配置文件，获取 js 文件的实际路径
- 根据 js 文件实际路径，在 dom 中插入 script 节点，并绑定 onload 事件来获取该模块加载完成的通知
- 依赖 script 全部加载完成后，调用回调函数

优点：

- 适合在浏览器环境中异步加载代码
- 可以并行加载多个模块

缺点：

- 提高了开发成本，代码的阅读和书写比较困难，模块定义方式的语义不顺畅
- 不符合通用的模块化思维方式，是一种妥协的实现

### CMD（异步加载模块）

CMD 规范和 AMD 很相似，并与 CommonJS 和 Node.js 的 Modules 规范保持了很大的兼容性，在 CMD 规范中，一个模块就是一个文件。

规范代表：sea.js

使用方式：

```javascript
define(function(require, exports, module) {
  var a = require("./a");
  a.doSomething();
  // 依赖就近书写，什么时候使用就什么时候引入
  var b = require("./b");
  b.doSomething();
});
```

定义模块使用全局函数 define，其接收 factory 参数，factory 可以是一个函数，也可以是一个对象或字符串。

factory 是一个函数时，有三个参数：

- require 是一个方法，接受模块标识作为唯一参数，用来获取其他模块提供的接口：require(id)
- exports 是一个对象，用来向外提供模块接口
- module 是一个对象，上面存储了与当前模块相关联的一些属性和方法

优点：

- 依赖就近，延迟执行
- 可以很容易在 Node.js 中运行

缺点：

- 依赖 SPM 打包，模块的加载逻辑偏重
- 规范代表 Sea.js 对模块的态度是懒执行，只会在真正需要使用模块时才执行该模块

AMD 与 CMD 的区别：

- 对于依赖的模块，AMD 是提前执行，CMD 是延迟执行。CMD 推崇 as lazy as possible
- AMD 推崇依赖前置，CMD 推崇依赖就近

### UMD

UMD 是 AMD 和 CommonJS 的结合，AMD 以浏览器第一原则发展异步加载模块，CommonJS 以服务器第一原则发展，选择同步加载，模块无需包装。

UMD 会先判断是否支持 Node.js 模块（exports 是否存在），存在则使用 Node.js 模块模式；然后再判断是否支持 AMD（define 是否存在），存在则使用 AMD 方式加载模块。

### ES6 模块化

ES6 在语言标准的层面上，实现了模块功能，而且实现的相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务端通用的模块解决方案。

ES6 模块化的设计思想是：尽量的静态化，是的编译时就能确定模块的依赖关系，以及输入和输出的变量（CommonJS 和 AMD 都只能在运行时去确定这些东西）。

使用方式：

```javascript
// 导入
import "./app";
import React from "react";
// 导出
export default App;
export function verse() {}
export const now = new Date();
```

优点：

- 容易进行静态分析
- 面向未来的 EcmaScript 标准

缺点：

- 原生浏览器还没有实现该标准
- 全新的命令字，新版的 Node.js 才支持

可以看出，ES6 模块化才是最好用的模块化标准，只是环境还没有来的及准备好而已

require 和 import 的区别：

require 是 CommonJS 规范，import 是 ES6 规范，因此两者的区别实际上两种模块化规范的区别：

**CommonJS**

- 对于基本数据类型，属于复制，即会被模块缓存。同时，在另一个模块可以对该模块输出的变量重新赋值。
- 对于引用数据类型，属于浅拷贝。由于两个模块引用的对象指向同一个内存空间，因此对该模块的值进行修改会影响到另外一个模块。
- 当使用 require 命令加载某个模块时，就会运行整个模块的代码。
- 当使用 require 命令加载同一个模块时，不会再执行该代码，而是取到缓存中的值。也就是说，CommonJS 模块只会在第一次加载时运行一次，以后再加载，只会返回运行的结果，除非手动清楚系统缓存。
- 循环加载时，属于加载时执行。即在 require 的时候，模块就会执行。一旦某个模块被循环加载，只会输出以执行的部分，未执行的部分不会输出

**ES6**

- 模块中的值属于动态只读引用
- 只读指的是：不允许修改引入变量的值，不论是基本数据类型还是引用数据类型。当模块遇到 import 命令时，就会生成一个只读引用，等到脚本执行时，再根据这个只读引用，到被加载的模块中取值
- 动态指的是：原始值发生变化，引用值也会发生变化
- 循环加载时，ES6 模块是动态引用。只要两个模块之间存在引用，代码就能执行。

最后，require/exports 是必要通用且必须的，因为事实上，目前为止 import/export 最终都是编译为 require/exports 来执行的

## FLOW

VUE 采用 FLOW 来做静态类型检查系统，其作用和 TypeScript 差不多。之所以选择 Flow，主要是因为 Babel 和 ESLint 都有对应的 Flow 插件以支持语法，可以完全沿用现有的构建配置，非常小成本的改动就可以拥有静态类型检查的能力。


