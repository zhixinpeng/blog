// 对象的继承方式
function Animal(name) {
  // 属性
  this.name = name || 'Animal'
  // 方法
  this.sleep = function () {
    console.log(this.name + '正在睡觉')
  }
}

// 原型方法
Animal.prototype.eat = function (food) {
  console.log(this.name + '正在吃：' + food)
}

// 1.原型链继承
function Cat() {}
Cat.prototype = new Animal()
Cat.prototype.name = 'cat'

// 2.构造继承
function Cat(name) {
  Animal.call(this)
  this.name = name || 'Tom'
}

// 3.实例继承
function Cat(name) {
  var instance = new Animal()
  instance.name = name || 'Tom'
  return instance
}

// 4.拷贝继承
function Cat(name) {
  var animal = new Animal()
  for (var p in animal) {
    Cat.prototype[p] = animal[p]
  }
  Cat.prototype.name = name || 'Tom'
}

// 5.组合继承
function Cat(name) {
  Animal.call(this)
  this.name = name || 'Tom'
}
Cat.prototype = new Animal()
Cat.prototype.constructor = Cat

// 6.寄生组合继承
function Cat(name) {
  Animal.call(this)
  this.name = name || 'Tom'
}
(function () {
  var Super = function () {}
  Super.prototype = Animal.prototype
  Cat.prototype = new Super()
})()
Cat.prototype.constructor = Cat


// TEST CODE
var cat = new Cat()
console.log(cat.name)
cat.eat('fish')
cat.sleep()
console.log(cat instanceof Animal)
console.log(cat instanceof Cat)