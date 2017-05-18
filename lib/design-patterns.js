/******** 《JavaScript 设计模式与开发实践》 ********/
/******** 1、设计模式(编程泛型)：原型模式(Prototype Pattern) ********/

// 多态性
// 普通实现
const Amap = {
  show: function() {
    console.info('谷歌地图开始渲染')
  }
}

const Bmap = {
  show: function() {
    console.info('百度地图开始渲染')
  }
}

renderMapBasic = function(type) {
  if (type === 'amap') {
    Amap.show()
  } else if (type === 'bmap') {
    Bmap.show()
  }
}

renderMapBasic('amap')
renderMapBasic('bmap')

// 优化后的实现
renderMap = function(map) {
  if (map.show instanceof Function) {
    map.show()
  }
}

renderMap(Amap)
renderMap(Bmap)

// 原型继承
function objectFactory() {
  var obj = new Object(), // 克隆一个空对象
      Constructor = [].shift.call(arguments); // 获取第一个参数，写法略装逼，不知有何用？
  obj.__proto__ = Constructor.prototype; // 显示设置原型对象
  var ret = Constructor.apply(obj, arguments); // 使用外部构造器给 obj 设置属性

  return typeof ret === 'object' ? ret : obj; // 确保构造器总是会返回一个**对象**，重点是返回的是对象
}

// Object.create 的基础实现
Object.prototype.create = Object.create(obj) || function objectCreate(obj) {
  var f = function() {}; // 函数，自带构造函数, 对象的话不能通过 new 关键字来新建
  f.prototype = obj;
  return new f();
}

function Person(name) {
  this.name = name;
}

var a = objectFactory(Person, 'seven');
console.info(a);

// --------
// 一类动物
var animal = {
  eat: 'food'
}

function Duck() {
}

// 显式设置原型**对象**
Duck.prototype = animal;

duck = new Duck();
console.info(duck.eat);
// 这里查找 eat 属性值的时候经历了如下过程: duck.eat => duck.__proto__ => Duck.prototype，即委托机制

// --------
function Chicken() {
}

Chicken.prototype = {
  eat: 'insect'
}

function Dog() {
}

Dog.prototype = new Chicken(); // 等同于? Dog.prototype = Object.create(Chicken.prototype)

var d = new Dog();
console.info(duck.eat);

// d.name => d.__proto__ => Dog.prototype => Chicken.prototype

/******** 2、this 和 call 和 apply ********/
