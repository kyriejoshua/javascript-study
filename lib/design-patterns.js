/******** 《JavaScript 设计模式与开发实践》 ********/
/******** 1、设计模式(编程泛型)：原型模式(Prototype Pattern) ********/
export function PrototypePattern() {

  // 多态性
  // 普通实现
  const Amap = {
    show: function() {
      console.info('谷歌地图开始渲染');
    }
  };

  const Bmap = {
    show: function() {
      console.info('百度地图开始渲染');
    }
  };

  const renderMapBasic = function(type) {
    if (type === 'amap') {
      Amap.show();
    } else if (type === 'bmap') {
      Bmap.show();
    }
  };

  renderMapBasic('amap');
  renderMapBasic('bmap');

  /**
   * [renderMap 优化后的实现]
   * @param  {Object} map [description]
   */
  const renderMap = function(map) {
    if (map.show instanceof Function) {
      map.show();
    }
  };

  renderMap(Amap);
  renderMap(Bmap);

  /**
   * [objectFactory 原型继承]
   * @return {[type]} [description]
   */
  function objectFactory() {
    var obj = new Object(), // 克隆一个空对象
      Constructor = [].shift.call(arguments); // 获取第一个参数，写法略装逼，不知有何用？
    obj.__proto__ = Constructor.prototype; // 显式设置原型对象
    var ret = Constructor.apply(obj, arguments); // 使用外部构造器给 obj 设置属性

    return typeof ret === 'object' ? ret : obj; // 确保构造器总是会返回一个**对象**，重点是返回的是对象
  }

  /**
   * [objectCreate Object.create 的基础实现]
   * @param  {Object} obj [description]
   * @return {[type]}     [description]
   */
  Object.prototype.create = Object.create || function objectCreate(obj) {
    // 一些校验
    if (typeof obj !== 'object' && typeof obj !== 'function') {
      throw new TypeError('Object prototype may only be an Object: ' + obj);
    } else if (obj === null) {
      throw new Error(`This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.`);
    }
    var f = function() {}; // 函数，自带构造函数, 对象的话不能通过 new 关键字来新建
    f.prototype = obj;
    return new f();
  };

  function Person(name) {
    this.name = name;
  }

  var a = objectFactory(Person, 'seven');
  console.info(a);

  // --------
  // 一类动物
  var animal = {
    eat: 'food'
  };

  function Duck() {
  }

  // 显式设置原型**对象**
  Duck.prototype = animal;

  var duck = new Duck();
  console.info(duck.eat);
  // 这里查找 eat 属性值的时候经历了如下过程: duck.eat => duck.__proto__ => Duck.prototype，即委托机制

  // --------
  function Chicken() {
  }

  Chicken.prototype = {
    eat: 'insect'
  };

  function Dog() {
  }

  Dog.prototype = new Chicken(); // 等同于? Dog.prototype = Object.create(Chicken.prototype)

  var d = new Dog();
  console.log(d);
  console.info(duck.eat);

  // d.name => d.__proto__ => Dog.prototype => Chicken.prototype
}

/******** 2、this 和 call 和 apply ********/
// quote: *"能熟练运用这两个方法，是我们真正成为一名 javascript 程序员的重要一步"*
export function CallandApply() {

  // 作为对象的方法调用
  var obj = {
    name: 'kyrie',
    getName: function() {
      return this.name;
    }
  };

  var name = 'joshua'; // eslint-disable-line

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
    };
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
  /* eslint-disable */
  function Person() {
    this.name = 'kyrie';
    this.getName = function() {
      return this.name;
    }
  };
  /* eslint-enable */

  var person = new Person(); // eslint-disable-line
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
    };
  })(document.getElementById);
  var getId = document.getElementById;
  getId('div');

  function fun() {
    console.log(this);
  }

  fun.apply(null, [1]); // 在浏览器中，此时 this 指向 window

  // PS: 当在 node 环境中调用 fun 时，得到的是 node 的全局对象 global, 包含系统相关的大部分信息

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
  Function.prototype.bind = Function.bind || function(context) {
    var that = this; // 保存原有方法
    return function() {
      return that.apply(context, arguments);
    };
  };

  var bindObj = {
    name: 'joshua'
  };

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
    };
  };

  var bindObj2 = {
    name: 'kyrie'
  };

  var bind3 = function(a, b, c, d) {
    console.warn(this.name);
    console.warn([a, b, c, d]);
  }.bind(bindObj2, 1, 2);

  bind3(3, 4); // 输出 kyrie, [1, 2, 3, 4], 第二个 slice 的作用就是整合参数

  // 借用其他对象的方法
  var A = function(name) {
    this.name = name;
  };

  // 在 B 中借用 A 的方法
  var B = function() {
    A.apply(this, arguments);
  };

  B.prototype.getName = function() {
    return this.name;
  };

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
  // function ArrayPush() {
  //   var n = TO_UNIT32(this.length); // 被 push 的对象的 length
  //   var m = %_ArgumentsLength(); // push 的参数个数
  //   for (var i = 0; i < m; i++) {
  //     this[i+n] = %_Arguments(i); // 复制元素
  //   }
  //   this.length = n + m;
  //   return this.length; // 返回数组的长度！
  // }

  // 由不区分数组，所以对象也可以调用
  var obj = {}; // eslint-disable-line
  Array.prototype.push.call(obj, 'first');
  obj[0]; // 'first'
  obj.length; // '1'

  // 除了 IE，IE 下需要显式设置 length
  /* eslint-disable */
  var obj = {
    length: 0
  };
  /* eslint-enable */
  Array.prototype.push.call(obj, 'first');
  obj[0]; // 'first'
  obj.length; // '1'

  /**
   * 所以只要满足以下两个条件的对象即可使用 push 方法
   * 对象本身可以存取属性
   * 对象的 length 属性可读写
   */
}

/******** 3、闭包和高阶函数 ********/
export function Closure() {

  /**
   * [bbox 一个显而易见的闭包案例]
   * @return {Function} [返回一个匿名函数，且保留对局部变量 a 的引用]
   */
  function bbox() {
    var a = 1;
    return function() {
      a++; // 返回改变前的值，且改变自身
      console.log('I am a a: ' + a);
    };
  }

  var b = bbox();
  b(); // 2
  b(); // 3
  b(); // 4

  (function(len){
    for (var i = 0; i <= len; i++) {
      console.log('This is ' + i);
    }
  })(4);

  // 一个真实的使用场景
  // 给页面上的 div 绑定事件，假设页面上有五个 div
  var divs = document.getElementsByTagName('div'); // HTML 动态集合
  for (var i = 0; i < divs.length; i++) {
    divs[i].onclick = function() {
      console.log(i); // 无论点击哪个 div 都是输出 5, 因为 onclick 的绑定事件是异步的
    };
  }

  // 可以理解为里面的函数保存了对每个 i 的引用，这样就会输出各自对应的数字
  for (var i = 0; i < divs.length; i++) { // eslint-disable-line
    (function(i) {
      divs[i].onclick = function() {
        console.log(i);
      };
    })(i);
  }

  // 应用同样原理的函数
  /* eslint-disable */
  var Type = {};
  for (var i = 0, type; type = ['Number', 'String', 'Array'][i++];) { // 后者这个写法是 for 循环的变种？
    (function(type) {
      Type['is' + type] = function(obj) {
        return Object.prototype.toString.call(obj) === '[object ' + type + ']';
      };
    })(type);
  }
  /* eslint-enable */

  Type.isArray([]); // true
  Type.isNumber(1); // true
  Type.isString('str'); // true

  // 闭包的作用：封装变量
  /**
   * [mult 一个平淡无奇的乘积函数]
   * @return {Number} []
   */
  var mult = function() {
    var a = 1;
    for (var i = 0, l = arguments.length; i < l; i++) {
      a = a * arguments[i];
    }
    return a;
  };

  mult(1, 2, 3); //  6
  mult(1, 2, 6); // 12

  /**
   * [mult 一个有缓存的乘积函数]
   * @return {Number} []
   */
  var cache = {};
  var mult = function() { // eslint-disable-line
    var args  = Array.prototype.join.call(arguments, ',');
    if (cache[args]) {
      return cache[args];
    }
    var a = 1;
    for (var i = 0, l = arguments.length; i < l; i++) {
      a = a * arguments[i];
    }
    return cache[args] = a;
  };

  mult(1, 2, 3); //  6
  mult(1, 2, 6); // 12

  /**
   * [mult 一个有闭包的乘积函数]
   * @param  {Object}   [description]
   * @return {Function}   [description]
   */
  var mult = (function() { // eslint-disable-line
    var cache = {};
    return function() {
      var args  = Array.prototype.join.call(arguments, ',');
      if (cache[args]) {
        return cache[args];
      }
      var a = 1;
      for (var i = 0, l = arguments.length; i < l; i++) {
        a = a * arguments[i];
      }
      return cache[args] = a;
    };
  })();

  mult(2, 3); //  6
  mult(1, 2, 6); // 12

  /**
   * [mult 一个有闭包又有封装的乘积函数]
   * @param  {Object}   [description]
   * @return {Function}   [description]
   */
  var mult = (function() { // eslint-disable-line
    var cache = {};
    var calculate = function() {
      var a = 1;
      for (var i = 0, l = arguments.length; i < l; i++) {
        a = a * arguments[i];
      }
      return a;
    };

    return function() {
      var args  = Array.prototype.join.call(arguments, ',');
      if (args in cache) {
        return cache[args];
      }
      return cache[args] = calculate.apply(null, arguments); // 想想和直接使用 calculate() 的区别
    };
  });

  mult(2, 4); //  8
  mult(3, 6); // 18

  // 延续变量的寿命
  /**
   * [report 检查是否可访问]
   * @param  {String} url [description]
   * @return {[type]}     [description]
   */
  var report = function(url) {
    var img = new Image(); // Image 竟然也是个构造函数
    img.src = url;
  };

  report('http://123.com');
  // 可能会存在 http 请求未发送变量便被销毁的情况，会丢失数据，所以需要优化

  /**
   * [report 检查是否可访问优化]
   * @param  {String}   [description]
   * @return {Function}   [description]
   */
  var report = (function() { // eslint-disable-line
    var imgs = [];
    return function(url) {
      var img = new Image();
      imgs.push(img);
      img.src = url;
    };
  })();

  report('http://123.com');

  // 闭包和面向对象
  // 使用面向对象思想写成的代码，都可以用闭包来实现，反之亦然
  /**
   * [extent 闭包实现]
   * @return {Object} [description]
   */
  var extent = function() {
    var value = 0;
    return {
      call: function() {
        value++;
        console.log(value);
      }
    };
  };

  var subExtent = extent();
  subExtent.call(); // 1
  subExtent.call(); // 2
  subExtent.call(); // 3

  /**
   * [extent 面向对象思想实现]
   * @type {Object}
   */
  var extent = { // eslint-disable-line
    value: 0,
    call: function() {
      this.value++;
      console.log(this.value);
    }
  };

  extent.call(); // 1
  extent.call(); // 2
  extent.call(); // 3

  /**
   * [Extent 更原始的实现]
   */
  var Extent = function() {
    this.value = 0;
  };

  Extent.prototype.call = function() {
    this.value++;
    console.log(this.value);
  };

  var extent = new Extent(); // eslint-disable-line
  extent.call(); // 1
  extent.call(); // 2
  extent.call(); // 3

  // 闭包和命令模式
  // 假设页面上有两个按钮，点击则各自打印相应的值
  // 使用面向对象的方法实现
  var Girl = {
    date: function() {
      console.log('Lets have a date');
    },
    breakUp: function() {
      console.log('Lets break up');
    }
  };

  var Command = function(receiver) {
    this.receiver = receiver;
  };

  Command.prototype.start = function() {
    this.receiver.date();
  };

  Command.prototype.end = function() {
    this.receiver.breakUp();
  };

  var setCommand = function(command) {
    document.querySelector('#date').onclick = function() {
      command.start();
    };
    document.querySelector('#break').onclick = function() {
      command.end();
    };
  };

  setCommand(new Command(Girl));

  // 使用闭包实现
  var command = function(receiver) {
    var start = function() {
      receiver.date(); // 思考这里 return 和不 return 的区别
    };
    var end = function() {
      receiver.breakUp();
    };
    return {
      start : start,
      end : end
    };
  };

  var setCommand = function(command) { // eslint-disable-line
    document.querySelector('#date').onclick = function() {
      command.start();
    };
    document.querySelector('#break').onclick = function() {
      command.end();
    };
  };

  setCommand(command(Girl));
}

export function HigherOrderFun() {

  // 函数作为参数传递
  // ajax 的回调
  // 或者如下方法:
  /**
   * [appendDiv 隐藏一百个 div, 效率不高]
   * @return {[type]} [description]
   */
  var appendDiv = function() {
    for (var i = 0; i < 100; i++) {
      var div = document.createElement('div');
      div.innerHTML = 'div' + i;
      document.body.appendChild(div);
      div.style.display = 'none';
    }
  };

  appendDiv();

  /**
   * [appendDiv 将隐藏的部分独立出来]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  var appendDiv = function(callback) { // eslint-disable-line
    for (var i = 0; i < 100; i++) {
      var div = document.createElement('div');
      div.innerHTML = 'div' + i;
      document.body.appendChild(div);
      if (typeof callback === 'function') {
        callback(div);
      }
    }
  };

  // 传入回调函数操作 dom
  appendDiv(function(node) {
    node.style.display = 'none';
  });

  // 函数作为返回值输出
  // 这是一个单例模式的例子
  /**
   * [getSingle 函数既作为参数传入，又作为返回值输出]
   * @param  {Function} fn [description]
   * @return {Function}      [description]
   */
  var getSingle = function(fn) {
    var ret;
    return function() {
      return ret || (ret = fn.apply(this, arguments));
    };
  };

  var getScript = getSingle(function() {
    return document.createElement('script');
  });

  var script1 = getScript();
  var scirpt2 = getScript();
  console.log(script1 === scirpt2); // true

  // 高阶函数实现 AOP(面向切面编程)
  /**
   * [before 在函数调用前使用]
   * @param  {Function} beforefn [description]
   * @return {Function}          [description]
   */
  Function.prototype.before = function(beforefn) {
    var that = this;
    return function() {
      beforefn.apply(this, arguments);
      return that.apply(this, arguments);
    };
  };

  /**
   * [after 在函数调用后使用]
   * @param  {Function} afterfn [description]
   * @return {Function}         [description]
   */
  Function.prototype.after = function(afterfn) {
    var that = this;
    return function() {
      that.apply(this, arguments);
      return afterfn.apply(this, arguments);
    };
  };

  var fun = function() {
    console.log(2);
  };

  var fn = fun.before(function() {
    console.log(1);
  }).after(function() {
    console.log(3);
  });

  fn(); // 输出 1，2，3
  // 这个例子也被称为装饰者模式

  // 函数柯里化
  // 一个显而易见的不完美的例子
  var monthCost = 0; // eslint-disable-line

  var cost = function(money) {
    monthCost += money;
  };

  cost(100); // 100
  cost(200); // 300
  cost(300); // 600

  /**
   * [cost 闭包保存局部变量，输入参数时累计，未输入参数时自动输出结果]
   * @param  {Number|null} [description]
   * @return {Function}   [description]
   */
  var cost = (function() { // eslint-disable-line
    var args = [];
    var money = 0;

    return function() {
      if (arguments.length === 0) {
        for (var i = 0; i < args.length; i++) {
          money += args[i];
        }
        return money;
      } else {
        [].push.apply(args, arguments);
      }
    };
  })();

  cost(100); // 未输出
  cost(200); // 未输出
  cost(300); // 未输出
  cost(); // 600

  /**
   * [currying 柯里化函数编写, 保存历史金额]
   * @param  {Function} fn [description]
   * @return {Function}    [description]
   */
  var currying = function(fn) {
    var args = [];

    return function() {
      if (arguments.length === 0) {
        return fn.apply(this, args); // 注意这里和以下的不同，最后一次计算时需要输入以往的值而不是传入的参数
        // return fn.apply(this, arguments);
      } else {
        [].push.apply(args, arguments);
        return fn; // 效果等同于以下
        // return arguments.callee; // 该项在 ES5 的严格模式下被废除
      }
    };
  };

  /**
   * [cost 保存当前金额]
   * @param  {} [description]
   * @return {Function}   [description]
   */
  var cost = (function() { // eslint-disable-line
    var money = 0;

    return function() {
      for (var i = 0, l = arguments.length; i < l; i++) {
        money += arguments[i];
      }
      return money;
    };
  })();

  var realCost = currying(cost);

  realCost(100); // 未输出
  realCost(200); // 未输出
  realCost(); // 300

  // uncurrying 去柯里化
  // 使对象也可以使用数组的方法
  (function() {
    Array.prototype.push.call(arguments, 4);
    console.log(arguments); // 类数组对象 [object Arguments] {0: 1, 1: 2, 2: 3, 3: 4} 或者 [1, 2, 3, 4]
  })(1, 2, 3);

  /**
   * [uncurrying description]
   * @return {Function} [description]
   */
  Function.prototype.uncurrying = function() {
    var that = this;

    return function() {
      var obj = Array.prototype.shift.call(arguments);
      return that.apply(obj, arguments);
    };
  };

  /**
   * [push 对任意对象都适用的 push 方法: 通过 uncurrying 将上面的 Array.prototype.push.call 简化为 push]
   * @param  {Object}   [可为任意对象，而不仅仅是数组]
   * @return {Number}   [对象的 length 属性值]
   */
  var push = Array.prototype.push.uncurrying();
  (function() {
    push(arguments, 4);
    console.log(arguments); // 输出结果同上
  })(1, 2, 3);

  // 批量重定义数组方法
  /* eslint-disable */
  for (var i = 0, fn; fn = ['push', 'shift', 'forEach'][i++];) { // 注意这里的分号必不可少
    Array[fn] = Array.prototype[fn].uncurrying();
  }
  /* eslint-enable */

  var obj = {
    length: 3,
    0: 1,
    1: 2,
    2: 3
  };

  // 值得注意的是这里都需要传入原数组
  Array.push(obj, 4);
  console.log(obj, obj.length); // {0: 1, 1: 2, 2: 3, 3: 4, length: 4}, 4
  var first = Array.shift(obj); // 这里再次改变了数组
  console.log(obj); // {0: 2, 1: 3, 2: 4, length: 4}
  console.log(first); // 1

  // 以键值对的形式遍历
  Array.forEach(obj, function(i, n) {
    console.log('This is ' + i); // key 0, 1, 2
    console.log('This is ' + n); // value 2, 3, 4
  });

  // 分析调用 uncurrying 的过程
  var obj = { // eslint-disable-line
    length: 1,
    0: 1
  };

  var push = Array.prototype.push.uncurrying(); // eslint-disable-line
  push(obj, 2);
  console.log(obj); // {length: 2, 0: 1, 1: 2}

  /**
   * [uncurrying 分析该函数]
   * @return {Function} [description]
   */
  Function.prototype.uncurrying = function() {
    var that = this; // 当参数为 push 时，这里的 that 是 Array.prototype.push

    return function() {

      // 传入两个参数，第一个是对象，第二个作为 push 的参数
      // 第一个参数，传入对象 obj, {length: 1, 0: 1}
      var obj = Array.prototype.shift.call(arguments);
      // 此时的 arguments 在 shift 方法调用后只留下了第二个参数 2

      // 对第一个参数 obj 对象调用 push 方法，并传入第二个参数
      return that.apply(obj, arguments);
    };
  };

  /**
   * [uncurrying 更简化版的实现]
   * @return {Function} [description]
   */
  Function.prototype.uncurrying = function() {
    var that = this;

    return function() {
      return Function.prototype.call.apply(that, arguments);
    };
  };

  // call 和 apply 本身也可以被 uncurrying, 但并没有实用价值
  /**
   * [call description]
   * @param  {Function} [description]
   * @param  {Object} [当前调用的对象]
   * @param  {Any} [参数]
   * @type {[type]}
   */
  var call = Function.prototype.call.uncurrying();
  var fn = function(name) { // eslint-disable-line
    console.log(name);
  };
  call(fn, window, 'kyrie'); // 'kyrie'

  /**
   * [apply description]
   * @param  {Function} [description]
   * @param  {Object} [当前调用的对象]
   * @param  {Array} [参数]
   */
  var apply = Function.prototype.apply.uncurrying();
  var fn = function() { // eslint-disable-line
    console.log(this.name);
    console.log(arguments);
  };
  apply(fn, {name: 'joshua'}, [1, 2, 3]); // 输出 'joshua', [1, 2, 3]

  // 函数节流
  // 函数被频繁调用的场景
  // window.onresize
  // mousemove
  // upload
  // 通常通过 setTimeout 来实现
  /**
   * [throttle description]
   * @param  {Function} fn       [description]
   * @param  {Number}   interval [延迟时间]
   * @return {Function}            [description]
   */
  var throttle = function(fn, interval) {
    var timer = null,
      first = true,
      _self = fn; // 如果不保存会怎样,似乎没有影响

    return function() {
      var that = this,
        args = arguments;

      // 首次进入时立即执行
      if (first) {
        _self.apply(that, args);
        return first = false;
      }

      // 假如上次执行未结束
      if (timer) {
        return false;
      }

      // 执行当前逻辑
      timer = setTimeout(function() {
        clearTimeout(timer);
        timer = null;
        _self.apply(that, args);
      }, interval || 500);
    };
  };

  window.onresize = throttle(function() {
    console.info(window.scrollX);
  }, 1000);

  // 分时函数
  // 糟糕的实现，直接添加
  var ary = [];

  for (var i = 0; i < 1000; i++) { // eslint-disable-line
    ary.push(i);
  }

  var renderFriendList = function(data) {
    for (var i = 0; i < data.length; i++) {
      var div = document.createElement('div');
      div.innerHTML = i;
      document.body.appendChild(div);
    }
  };

  renderFriendList(ary);

  /**
   * [timeChunk 分时函数]
   * @param  {Array}   ary   [description]
   * @param  {Function} fn    [description]
   * @param  {Number}   count [分批次的数量]
   * @return {[type]}         [description]
   */
  var timeChunk = function(ary, fn, count) {
    var obj, timer;

    /**
     * [start 每批次调用的函数]
     */
    var start = function() {
      for (var i = 0; i < Math.min(count || 1, ary.length); i++) {

        // 对每批次进行调用
        obj = ary.shift();
        fn(obj);
      }
    };

    return function() {
      timer = setInterval(function() {

        // 批量结束后清空定时器
        if (ary.length === 0) {
          clearInterval(timer);
        }
        start();
      }, 200);
    };
  };

  var renderFriendListFast = timeChunk(ary, function(i) {
    var div = document.createElement('div');
    div.innerHTML = i;
    document.body.appendChild(div);
  }, 500);

  renderFriendListFast(ary);

  // 惰性加载函数
  /**
   * [addEvent 调用时才进行判断]
   * @param {Object} ele    [description]
   * @param {String} type   [description]
   * @param {Function} handle [description]
   */
  var addEvent = function(ele, type, handle) {
    if (window.addEventListener) {
      return ele.addEventListener(type, handle, false);
    } else if (window.attachEvent) {
      return ele.addEventListener('on' + type, handle);
    }
  };

  /**
   * [addEvent 页面初始化时调用，重新定义该函数]
   * @param  {[type]}     [description]
   * @return {[type]}     [description]
   */
  var addEvent = (function(){ // eslint-disable-line
    if (window.addEventListener) {
      return function(ele, type, handle) {
        ele.addEventListener(type, handle, false);
      };
    }
    if (window.attachEvent) {
      return function(ele, type, handle) {
        ele.attachEvent('on' + type, handle);
      };
    }
  })();

  /**
   * [addEvent 惰性加载的实现，在首次进入时判断，判断后重新定义方法，然后新定义的方法里不再进行判断]
   * @param {Object} ele    [description]
   * @param {String} type   [description]
   * @param {Function} handle [description]
   */
  var addEvent = function(ele, type, handle) { // eslint-disable-line

    // 根据条件重新定义
    if (window.addEventListener) {
      addEvent = function(ele, type, handle) {
        ele.addEventListener(type, handle, false);
      };
    }
    if (window.attachEvent) {
      addEvent = function(ele, type, handle) {
        ele.attachEvent('on' + type, handle);
      };
    }

    // 调用
    addEvent(ele, type, handle);
  };
}

/**
 * [Singleton 单例模式]
 */
export function Singleton() {

  // 单例模式最简易的实现
  var Singleton = function(name) {
    this.name = name;
    this.instance = null;
  };

  Singleton.prototype.getName = function() {
    console.info(this.name);
  };

  /**
   * [getInstance 获取 Singleton 类的唯一对象]
   * @param  {String} name [description]
   * @return {Object}      [description]
   */
  Singleton.getInstance = function(name) {
    if (!this.instance) {
      this.instance = new Singleton(name);
    }

    return this.instance;
  };

  var a = Singleton.getInstance('kyrie');
  var b = Singleton.getInstance('joshua');
  console.info(a === b);

  /**
   * [getInstance 使用闭包改写]
   * @param  {String} name [description]
   * @return {Function}   [description]
   */
  Singleton.getInstance = (function() {
    // this.instance = null; // 自己写的错误代码，闭包时这个 this 指向什么呢
    var instance = null;
    return function(name) {
      if (!instance) {
        instance = new Singleton(name);
      }
      return instance;
    };
  })();

  var a = Singleton.getInstance('kyrie'); // eslint-disable-line
  var b = Singleton.getInstance('joshua'); // eslint-disable-line
  console.info(a === b);

  // 缺点是，不知道该方法就无法调用
  // 优点是，全局都可使用
}

/******** 4、策略模式 ********/
const Stra = {
  configA: function () {
    return ['A']
  },
  configB: function () {
    return ['B']
  },
  configC: function () {
    return ['C']
  },
}

function getConfig(config) {
  return Stra[config]();
}
getConfig('configA');

/******** 8、发布-订阅模式 ********/
/**
 * 类的实现方式
 */
class Event {
  constructor() {
    this.listenerMap = {};
  }

  /**
   * 订阅事件
   * @param {*} type
   * @param {*} fn
   */
  on(type, fn) {
    if (typeof fn !== 'function') {
      return;
    }
    this.listenerMap[type] = this.listenerMap[type] || [];
    this.listenerMap[type].push(fn);
    return this;
  }

  /**
   * 发布事件
   * @param {*} type
   * @returns
   */
  trigger(type) {
    if (!this.listenerMap[type]) {
      return;
    }
    const args = [].slice.call(arguments, 1);
    this.listenerMap[type].forEach((fn) => {
      fn(...args);
    });
  }

  /**
   * 解绑事件
   * 同时如果解绑参数未传入事件，则整个监听类型都置空
   * @param {*} type
   * @param {*} fn
   * @returns
   */
  off(type, fn) {
    if (!this.listenerMap[type]) {
      return;
    }
    if (typeof fn !== 'function') {
      this.listenerMap[type] = [];
      return;
    }
    this.listenerMap[type] = this.listenerMap[type].filter((_fn) => _fn === fn);
    return this;
  }

  /**
   * 只执行一次的事件
   * @param {*} type
   * @param {*} fn
   */
  once(type, fn) {
    // 定义一个函数用来解绑事件，重点！
    const listener = (...args) => {
      fn(...args);
      this.off(type, listener);
    }
    this.on(type, listener);
  }
}

const eventBus = new Event();
eventBus.on('click', console.info);
eventBus.trigger('click', 'click');

/**
 * 带有命名空间的函数式实现
 */
const EventBus = (function () {
  let global = this,
    _default = 'default';

  const Event = (function () {
    let
      namespaceCache = {};
      const each = function (arr, fn) {
        let ret;
        for (let i = 0; i < arr.length; i++) {
          const that = arr[i];
          ret = fn.call(that, i, that)
        }
        return ret;
      };

      const _listen = function (key, fn, cache) {
        if (!cache[key]) {
          cache[key] = [];
        }
        cache[key].push(fn);
      };

      const _remove = function (key, cache, fn) {
        if (cache[key]) {
          if (fn) {
            for (let i = 0; i < cache[key].length; i++) {
              const _fn = cache[key][i];
              if (fn === _fn) {
                cache[key].splice(i, 1);
              }
            }
          } else {
            cache[key] = [];
          }
        }
      }

      const _trigger = function (cache, key) {
        if (!cache[key] || !cache[key].length) {
          return;
        }
        const _self = this;
        // 剔除前面的 cache 和 key 参数，获取真正的函数调用的参数
        const args = [].slice.call(arguments, 2);
        return each(cache[key], function () {
          return this.apply(_self, args);
        });
      }

      const _create = function (namespace) {
        namespace = namespace || _default;
        let cache = {},
          offlineStack = []; // 离线事件

        let ret = {
          listen: function (key, fn, last) {
            _listen(key, fn, cache);
            if (offlineStack === null) {
              return;
            }
            if (last === 'last') {
              offlineStack.length && offlineStack.pop()();
            } else {
              each(offlineStack, function () {
                this();
              })
            }
            offlineStack = null;
          },
          one: function (key, fn, last) {
            _remove(key, cache);
            this.listen(key, fn, last);
          },
          remove: function (key, fn) {
            _remove(key, cache, fn);
          },
          trigger: function () {
            let _self = this;
            [].unshift.call(arguments, cache);
            let args = arguments;
            let fn = function () {
              return _trigger.apply(_self, args)
            }
            if (offlineStack) {
              return offlineStack.push(fn);
            }
            return fn();
          }
        };
        return namespace ? (namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret) : ret;
      }

    return {
      create: _create,
      one: function (key, fn, last) {
        let event = this.create();
        event.one(key, fn, last);
      },
      remove: function (key, fn) {
        let event = this.create();
        event.remove(key, fn);
      },
      listen: function (key, fn, last) {
        let event = this.create();
        event.listen(key, fn, last)
      },
      trigger: function () {
        let event = this.create();
        debugger;
        event.trigger.apply(this, arguments);
      }
    }
  })();

  return Event;
})();

const baby = EventBus.create('baby');
baby.listen('click', console.info);
baby.trigger('click', console.info);

/******** 15、装饰者模式 ********/
/**
 * 在不影响原函数的情况下，新增一个提前执行的函数
 * @param {*} beforeFn
 * @returns
 */
Function.prototype.before = function (beforeFn) {
  let that = this;
  // 不使用箭头函数就需要包装一下
  return function (...args) {
    beforeFn.call(this, ...args);
    return that.call(this, ...args);
  }
}

/**
 * 新增的提前执行函数可以控制后续的函数是否可以执行
 * 可以用于表单校验的场景，传入表单校验函数
 * @param {*} beforeFn
 * @returns
 */
Function.prototype.beforeBoolean = function (beforeFn) {
  let that = this;
  return function (...args) {
    if (!beforeFn.call(this, ...args)) {
      return;
    }
    return that.call(this, ...args);
  }
}

Function.prototype.after = function (afterFn) {
  let that = this;
  return function (...args) {
    afterFn(...args);
    return that.call(this, ...args);
  }
}

// 也可以称之为 AOP 面向切面编程
// 实际应用中还可以修改参数
function getConfigs(params = {}) {
  return params;
}
getConfigs = getConfigs.before(function (params = {}) {
  params.source = 'E';
});
getConfigs({}); // { source: 'E' }
// 这种场景可以使用在统一给函数添加参数的时候，例如给 ajax 请求添加统一的配置项内容
// 这种修改也不会影响原来的函数
