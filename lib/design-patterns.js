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

/**
 * [renderMap 优化后的实现]
 * @param  {Object} map [description]
 */
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
// quote: *"能熟练运用这两个方法，是我们真正成为一名 javascript 程序员的重要一步"*

// 作为对象的方法调用
var obj = {
  name: 'kyrie',
  getName: function() {
    return this.name;
  }
}

var name = 'joshua';

// 作为普通函数调用
var getName = obj.getName;
obj.getName(); // 'kyrie'
getName(); // 'joshua' window.getName() window 对象调用

// 构造器调用
// 沿用上节的例子
function Person() {
  this.name = 'kyrie';
}

var person = new Person();
console.log(person.name); // name: 'kyrie'

function Person2() {
  this.name = 'kyrie';
  return {
    name: 'joshua'
  }
}

var person2 = new Person2();
console.log(person2.name); // 显式返回**对象**时，返回结果就是 return 的对象, 'joshua'

function Person3() {
  this.name = 'kyrie';
  return 'joshua';
}

var person3 = new Person3();
console.log(person3.name); // 返回的不是对象时，返回结果并不会改变，依然是 'kyrie'

// Function.prototype.call Function.prototype.apply 即是动态改变调用对象 this
function Person() {
  this.name = 'kyrie';
  this.getName = function() {
    return this.name;
  }
}

var person = new Person();
person.getName(); // 'kyrie'
person.getName.call({name: 'joshua'}); // call 改变当前调用的对象，输出 'joshua'
person.getName.apply({name: 'still joshua'}); // apply 同理，输出 'still joshua'

// 使用 call 来修正 this 的指向
document.getElementById = (function(fun) {
  return function() {
    // console.info('document', document)
    // console.info('arguments', arguments)
    // 以下写法是错误的
    // document.getElementById.apply(document, arguments);
    // 而且一定要 return, 否则会造成内存溢出,浏览器可能会奔溃
    return fun.apply(document, arguments);
  }
})(document.getElementById);
var getId = document.getElementById;
getId('div');

function fun() {
  console.log(this);
}

fun.apply(null, [1]); // 在浏览器中，此时 this 指向 window

// PS: 当在 node 环境中调用 fun 时，得到的是 node 的全局对象, 包含系统相关的大部分信息

function fun2() {
  'use strict';
  console.log(this);
}

fun2.apply(null, [1]); // 严格模式下，在浏览器中，此时输出 null

//
/**
 * [bind 模拟实现原生的 bind 方法，简版，用以改变调用的对象]
 * @param  {Object} context [传入的对象]
 * @return {Function}         [description]
 */
Function.prototype.bind = Function.bind(context) || function(context) {
  var that = this; // 保存原有方法
  return function() {
    return that.apply(context, arguments);
  }
}

var bindObj = {
  name: 'joshua'
}

var bind2 = function(age) {

  // this.name = 'kyrie'; 假如这里赋值的话，会覆盖 this.name 的值
  console.info(this.name);
  console.info(age);
}.bind(bindObj);

bind2(20); // 输出 joshua, 20

/**
 * [bind 模拟实现原生的 bind 方法，复杂版]
 * @return {Function} [description]
 */
Function.prototype.bind = function() {
  var that = this, // 保存原始函数
      context = [].shift.call(arguments), // 需要绑定的 this 上下文，实际上相当于 arguments[0]
      args = [].slice.call(arguments); // 剩余的参数从类数组转成数组

  return function() {

    // 把之前传入的 context 对象当做新函数内的 this
    // 将两个参数组合，作为新函数的参数 相当于 args.concat([].slice.call(arguments))
    return that.apply(context, [].concat.call(args, [].slice.call(arguments)));
  }
}

var bindObj2 = {
  name: 'kyrie'
}

var bind3 = function(a, b, c, d) {
  console.warn(this.name);
  console.warn([a, b, c, d]);
}.bind(bindObj2, 1, 2);

bind3(3, 4); // 输出 kyrie, [1, 2, 3, 4], 第二个 slice 的作用就是整合参数

// 借用其他对象的方法
var A = function(name) {
  this.name = name;
}

// 在 B 中借用 A 的方法
var B = function() {
  A.apply(this, arguments);
}

B.prototype.getName = function() {
  return this.name;
}

var b = new B('kyrie');
console.log(b.getName());

// 这是一个类数组对象使用数组方法的例子，类数组对象本身不能调用数组方法
(function() {
  Array.prototype.push.call(arguments, 3);
  console.log(arguments);
})(1, 2); // 输出 [1, 2, 3]， 但仍然是一个类数组对象？

// more: V8 引擎地址 (https://github.com/v8/v8/blob/3a1ab8c626dfee28a5cafb6632b28e284c4cffb3/src/array.js)
/**
 * [ArrayPush V8 引擎实现 Array.prototype.push]
 * @param  {Object}  [这里其实不区分是否是数组，只要下标属性可访问即可]
 * @return {Number} [这里可以解释为什么调用 push 方法，会修改原数组，并且返回数组的长度]
 */
function ArrayPush() {
  var n = TO_UNIT32(this.length); // 被 push 的对象的 length
  var m = %_ArgumentsLength(); // push 的参数个数
  for (var i = 0; i < m; i++) {
    this[i+n] = %_Arguments(i); // 复制元素
  }
  this.length = n + m;
  return this.length; // 返回数组的长度！
}

// 由不区分数组，所以对象也可以调用
var obj = {};
Array.prototype.push.call(obj, 'first');
obj[0]; // 'first'
obj.length; // '1'

// 除了 IE，IE 下需要显式设置 length
var obj = {
  length: 0
}
Array.prototype.push.call(obj, 'first');
obj[0]; // 'first'
obj.length; // '1'

/**
 * 所以只要满足以下两个条件的对象即可使用 push 方法
 * 对象本身可以存取属性
 * 对象的 length 属性可读写
 */
