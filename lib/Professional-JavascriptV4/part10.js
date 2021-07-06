/******** 《JavaScript 高级程序设计》(第4版) ********/
/******** 10、 函数 287-321 重点 ********/

const Part10Function = () => {
  // 创建函数的四种方式
  // * 函数声明
  // * 函数表达式
  // * 箭头函数
  // * 构造函数

  // 10.1 箭头函数
  // * 任何可以使用函数表达式的地方，都可以使用箭头函数
  // 只有一个参数的时候可以省略参数的小括号,其他方式的函数不可省略括号
  // 箭头函数没有 arguments 对象
  const arrowFunction = (x) =>{
    console.info(arguments);
    return x + 2;
  }
  const normalFunction = function (x) {
    console.info(arguments);
    return x + 2;
  }
  arrowFunction(); // Uncaught ReferenceError: arguments is not defined
  normalFunction(); // 打印出类数组对象

  // 箭头函数不能使用 super, new.target 也不能用作构造函数
  // 箭头函数没有 prototype 属性
  console.info(normalFunction.prototype); // { constructor: f }
  console.info(arrowFunction.prototype); // undefined

  let nf = new normalFunction();
  console.info(nf, 'nf');
  let af = new arrowFunction();
  console.info(af, 'af'); // 抛出异常
  // Uncaught TypeError: arrowFunction is not a constructor

  // 10.2 函数名
  // 函数名就是指向函数引用的指针
  // 类似对象，一个函数可以有多个名称
  // 通过定义值，可以让函数有多个名称
  function sum(sum1, sum2) {
    return sum1 + sum2;
  }
  let anotherSum = sum;
  anotherSum(10, 10); // 20

  sum = null;
  anotherSum(10, 10); // 20

  // es6 的所有函数对象会有一个只读的属性 name
  function foo() {}
  let bar = () => {};
  let baz = function () {}

  console.info(foo.name); // foo
  console.info(bar.name); // bar
  console.info(baz.name); // baz
  console.info((() => {}).name); // 空字符串
  console.info(new Function('name', 'return name').name); // anonymous

  // 如果函数是获取函数、设置函数或者 bind 函数，则函数 name 属性会有个前缀
  console.info(foo.bind(null).name); // bound foo

  let dog = {
    years: 1,
    get age() {
      return this.years;
    },
    set age(newAge) {
      this.years = newAge;
    }
  }

  let propertyDescriptor = Object.getOwnPropertyDescriptor(dog, 'age');
  console.info(propertyDescriptor.get.name); // get name
  console.info(propertyDescriptor.set.name); // set name

  // * 可以使用前面学到的 Object.getOwnPropertyNames() 方法来获取这些不可枚举的函数属性
  // 以 foo 为例，获得函数本身的属性
  Object.getOwnPropertyNames(foo); // ['length', 'name', 'arguments', 'caller', 'prototype']
  // 获取函数原型上的属性和方法
  Object.getOwnPropertyNames(foo.__proto__); // ['length', 'name', 'arguments', 'caller', 'constructor', 'apply', 'bind', 'call', 'toString']

  // 11.3 理解参数
  // es 中的函数参数其实是可以完全不写的
  /**
   * 带参数
   * @param {*} name
   * @param {*} message
   * @returns
   */
  function sayHi(name, message) {
    return console.info('Hello ' + name + ',' + message);
  }

  /**
   * 不带参数
   * @returns
   */
  function sayHiWithoutParams() {
    return console.info('Hello ' + arguments[0] + ',' + arguments[1]);
  }

  function sayHiWithoutParams2() {
    // 观察类数组对象的解构是数组形式还是对象形式的
    const [name, message] = arguments; // 可以以数组形式解构
    return console.info('Hello ' + name + ',' + message);
  }

  sayHi('Jack', 'Rose'); // Hello Jack,Rose
  sayHiWithoutParams('Jack', 'Rose');  // Hello Jack,Rose
  sayHiWithoutParams2('Jack', 'Rose'); // Hello Jack,Rose
  // 三者的输出是一样的

  /**
   * 查看函数参数的个数
   * @returns
   */
  function howManyArgs() {
    return arguments.length;
  }
  howManyArgs(1, 2); // 2
  howManyArgs(); // 0
  howManyArgs('hello'); // 1

  // 可以不定义参数，看参数的个数来决定做什么
  /**
   * 不依赖参数的累加器
   * @returns
   */
  function doAdd() {
    const args = arguments.length;
    if (args === 1) {
      return arguments[0] + 10;
    } else if (args === 2) {
      return arguments[0] + arguments[1];
    } else {
      return Array.from(arguments).reduce((acc, cur) => acc + cur, 0);
    }
  }

  console.info(doAdd(2)); // 12
  console.info(doAdd(2, 3)); // 5
  console.info(doAdd(1, 2, 3)); // 6

  /**
   * 完全忽略参数，支持任意参数
   * @returns
   */
  function betterDoAdd() {
    return Array.from(arguments).reduce((acc, cur) => acc + cur, 0);
  }

  betterDoAdd(1, 2, 3, 4); // 10

  // arguments 和命名参数是可以互相引用的
  function anotherDoAdd(num1, num2) {
    const args = arguments.length;
    if (args === 1) {
      return num1 + 10;
    } else if (args === 2) {
      return arguments[0] + num2;
    }
  }

  // 核心效果等价于 doAdd
  anotherDoAdd(2, 3); // 5
  anotherDoAdd(2); // 12

  // 普通函数中，arguments 对应的值和命名参数同步，改变其中的值会影响另一个，但是不指向同一个引用
  // 严格模式下，则不允许修改
  function printDoAdd(num1, num2) {
    num1 = 30;
    arguments[1] = 10;
    console.info(arguments[0], num2);
  }
  printDoAdd(1, 2); // 30, 10

  /**
   * 在严格模式下尝试修改参数，不会报错，但也不会生效
   * @param {*} num1
   * @param {*} num2
   */
  function printDoAddInStrict(num1, num2) {
    'use strict';
    num1 = 30;
    arguments[1] = 10;
    console.info(arguments[0], num2);
  }
  printDoAddInStrict(1, 3); // 1 3

  // * 箭头函数中的参数 没有 arguments
  // 如果想要获得 arguments 则可以在外部包装一层
  function getArgumentsByNormalFunction() {
    let bar = () => {
      console.info(arguments.length, arguments);
    }
    bar();
  }
  console.info(getArgumentsByNormalFunction(1, 2, 3));
  // es 中的所有参数都是按值传递的，不会按引用传递参数。如果把对象作为参数传递，那么传递的值就是对象的引用

  // 10.4 没有重载
  // es 中不像别的语言那样，它没有重载，后定义的同名函数会覆盖前一个
  function addSomeNumber(num) {
    return num + 100;
  }
  function addSomeNumber(num) {
    return num + 200;
  }
  addSomeNumber(100); // 300

  // 使用表达式的方式更容易理解
  let addSomeNumber1 = function (num) {
    return num + 100;
  }

  addSomeNumber1 = function (num) {
    return num + 200;
  }
  addSomeNumber1(100); // 300

  // 10.5 默认参数值
  // es6 中新增了默认参数值
  // 默认参数值不限于原始值或对象类型，也可以使用调用函数的返回值
  let romanNumberals = ['I', 'II', 'III'];
  let ordinality = 0;

  function getNumberals() {
    return romanNumberals[ordinality++]
  }

  function makeKing(name = 'Herry', numberals = getNumberals()) {
    return 'King name is ' + name + ' ' + numberals;
  }

  console.info(makeKing()); // King name is Herry I
  console.info(makeKing()); // King name is Herry II
  console.info(makeKing()); // King name is Herry III

  // * 默认参数作用域暂时性死区
  // 排在后面的参数可以引用先定义的参数
  function makeKing2(name = 'Herry', numberals = name) {
    return name + numberals;
  }
  makeKing2(); // HerryHerry
  makeKing2('Bob'); // BobBob

  /**
   * 这个函数如果不传第一个参数就会报错
   * 注意是调用时报错
   * @param {*} name
   * @param {*} numberals
   * @returns
   */
  function makeKing3(name = numberals, numberals = 'III') {
    return name + numberals;
  }
  makeKing3(); // 报错 Uncaught ReferenceError: Cannot access 'numberals' before initialization
  makeKing3('Brown'); // 正常 BrownIII

  // 参数也存在于自己的作用域中，不能使用函数体中的作用域，下面这个例子尽管在函数体内有定义变量，但参数作用域里无法获取到
  /**
   * 这个函数如果不传第二个参数就会报错
   * 注意是调用时报错
   * @param {*} name
   * @param {*} numberals
   * @returns
   */
  function makeKing4(name = numberals, numberals = defaultNumberal) {
    let defaultNumberal = 'I';
    return name + numberals;
  }
  makeKing4('Brown'); // 报错
  makeKing4('Brown', 34); // Brown34

  // 10.6 参数扩展与收集参数
  // 10.6.1 扩展参数
  const argValues = [1, 2, 3, 4,];

  /**
   * 将所有参数累加求和
   * es6 之前的做法
   * @returns
   */
  function getSum() {
    let sum = 0;
    for (let index = 0; index < arguments.length; index++) {
      const num = arguments[index];
      sum += num;
    }
    return sum;
  }
  // 在 es6 之前，这里需要用到 apply 方法
  getSum.apply(null, argValues); // 10

  // 使用扩展参数
  getSum(...argValues);

  // 在作为参数传入的时候，可以放在任意的位置
  console.info(getSum(-1, ...argValues)); // 9
  console.info(getSum(-1, ...argValues, 5)); // 14
  console.info(getSum(...argValues, 5)); // 15
  console.info(getSum(-1, ...argValues, ...[5, 6, 7])); // 27

  // 扩展参数与 arguments 并不冲突
  console.info(howManyArgs(-1, ...argValues)); // 5
  console.info(howManyArgs(-1, ...argValues, 5)); // 6
  console.info(howManyArgs(...argValues, 5)); // 5
  console.info(howManyArgs(-1, ...argValues, ...[5, 6, 7])); // 8

  // 扩展参数和命名参数也并不冲突
  function getProduct(a, b, c = 1) {
    return a * b * c;
  }

  console.info(getProduct(...argValues)); // 6
  console.info(getProduct(...[1, 2], 3)); // 6
  console.info(getProduct(...[1, 2])); // 2

  // 10.6.2 收集参数
  // 收集参数用在形参中，使用扩展操作符把不同长度的独立参数组合成一个数组
  // * 类似 arguments, 但收集参数获取到的是数组的实例
  function getSumCollect(...values) {
    return values.reduce((x, y) => x + y, 0);
  }
  getSumCollect(1, 2, 3, 4, 5); // 15

  // 收集参数如果前面还有命名参数，则只会收集其余的参数，如果没有则会得到空数组
  // 因为收集的结果有变，只能把它作为最后一个参数
  /**
   * 不能只能当做第一个参数，会报错
   * @param  {...any} values
   * @param {*} name
   */
  function getProductError(...values, name) {}
  // Uncaught SyntaxError: Rest parameter must be last formal parameter
  // * 而且需注意的是，在定义的时候就会报错，而不是运行时

  /**
   * 生效
   * @param {*} firstValue
   * @param  {...any} values
   */
  function ignoreFirst(firstValue, ...values) {
    console.info(values);
  }
  ignoreFirst(1, 2, 3, 4); // [2, 3, 4]
  ignoreFirst(1, 2); // [2]
  ignoreFirst(); // []

  /**
   * 收集参数与 arguments 也不冲突
   * @param  {...any} values
   */
  function getSumArgs(...values) {
    console.info(arguments.length);
    console.info(values);
    console.info(arguments);
  }
  getSumArgs(1, 2, 3, 4);
  // 4
  // [1, 2, 3, 4]
  // [1, 2, 3, 4]

  // 10.7 函数声明与函数表达式
  // 函数声明会有声明提前（js引擎在执行代码之前会先读取所有声明）
  // 函数表达式则不会
  // 除此之外基本没有区别

  // 可以在声明前使用
  sum2(1); // 2
  function sum2(sum1) {
    return sum1 + 1;
  }

  // 10.8 函数作为值
  /**
   * 把函数作为参数传递
   * @param {*} somefunction
   * @param {*} someArgument
   * @returns
   */
  function callSomeFunction(somefunction, someArgument) {
    return somefunction(someArgument);
  }

  function add10(num) {
    return num + 10;
  }

  let result1 = callSomeFunction(add10, 10);
  console.info(result1); // 20

  function getGreeting(name) {
    return 'hello ' + name;
  }

  let result2 = callSomeFunction(getGreeting, 'Bob');
  console.info(result2); // hello bob

  // 可以通过这样的方式来创建比较复杂的函数
  /**
   * 比较两个对象的属性来排序
   * @param {*} propertyName
   * @returns
   */
  function createComparisionFunction(propertyName) {
    return function (object1, object2) {
      let value1 = object1[propertyName];
      let value2 = object2[propertyName];
      console.info(arguments.callee.caller);

      if (value1 < value2) {
        return -1;
      } else if (value1 > value2) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  let data = [
    { name: 'Zachary', age: 28 },
    { name: 'Nico', age: 29 }
  ];

  // 按名称排序
  data.sort(createComparisionFunction('name'));
  // [
  //     {
  //       "name": "Nico",
  //       "age": 29
  //   },
  //   {
  //       "name": "Zachary",
  //       "age": 34
  //   }
  // ]

  // 按年龄排序
  data.sort(createComparisionFunction('age'));

    // 10.9 函数内部
    // 10.9.1 arguments
    /**
     * 常见的阶乘函数
     * @param {*} params
     * @returns
     */
    function factorial(num) {
      if (num <= 1) {
        return 1;
      } else {
        return num * factorial(num - 1);
      }
    }
    console.info(factorial(4)); // 24

    // * arguments 对象中有 callee 属性，指向当前这个函数的引用
    /**
     * 使用 callee 属性可以避免函数变量名变更导致的问题
     * 在递归中，使函数名与当前函数解耦
     * @param {*} params
     * @returns
     */
    function anotherFactorial(num) {
      if (num <= 1) {
        return 1;
      } else {
        return num * arguments.callee(num - 1);
      }
    }
    console.info(anotherFactorial(4)); // 24

    let trueFactorial = factorial;
    let trueFactorial1 = anotherFactorial;

    factorial = function () {
      return 0;
    }
    anotherFactorial = function () {
      return 0;
    }
    factorial(4); // 0
    trueFactorial(4); // 0
    trueFactorial(1); // 1
    trueFactorial1(4); // 24
    // 第一个值是 0 可以理解
    // trueFactorial 函数其实它的函数体本身没有变，只是函数体内的 递归函数变了，所以参数不同的时候会出现不同效果
    // 进入了不同的条件，输出不同的值
    // trueFactorial1 则是函数体内外都没有被污染，都保证了最初的原始状态，因此正确输出了

    // * 可以理解成 arguments 是和 function  关键字强关联的， 例如箭头函数没有 function 关键字来创建，就没有 arguments 对象

    // 10.9.2 this
    // * this 在**标准函数**中是指把函数当成方法调用的上下文对象（箭头函数则另说）
    window.color = 'red';
    let o = {
      color: 'blue'
    }
    function sayColor() {
      console.info(this.color);
    }
    o.sayColor = sayColor;

    // 当前调用对象是全局的 window
    sayColor(); // red
    // 当前调用对象是 o
    o.sayColor(); // blue

    // * 而箭头函数中 this 是指定义箭头函数时的上下文对象
    /**
     * 当前定义在全局对象 window 上，所以即使把它作为 o 的方法，获取到的仍然是 window 的属性 color
     */
    let sayColor2 = () => {
      console.info(this.color);
    }
    o.sayColor2 = sayColor2;

    o.sayColor2(); // red

    // 箭头函数可以保留外层函数的上下文对象
    function King() {
      this.royaltyName = 'Herry';
      setTimeout(() => {
        console.info(this.royaltyName, this.caller);
      }, 0);
    }
    King(); // Herry

    // 10.9.3 caller
    // es 5 定义，这个函数属性引用的是调用当前函数的函数
    // Function.caller 或 arguments.callee.caller
    // 在标准函数中存在，箭头函数不生效
    // 注意，这里不是闭包，只是在外层函数中调用里面的函数，而不是返回了未调用的新函数，所以不是闭包，请不要理解错
    function outer() {
      inner()
    }
    function inner() {
      console.info(inner.caller);
    }
    outer(); // 打印出 outer

    // 更为解耦的写法
    function outer2() {
      inner2()
    }
    function inner2() {
      console.info(arguments.callee.caller);
    }
    outer2(); // 打印出 outer2

    // 箭头函数中没有该属性，会直接抛出异常
    const inner3 = () => {
      console.info(inner3.caller);
    }
    function outer3() {
      inner3()
    }
    outer3();
    // Uncaught TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them

    // 10.9.4 new.target
    // es 6 新增的
    // 函数中用来判断调用函数时是否使用了 new 关键字
    // 用来区分普通函数调用还是构造函数调用
    // new.target 的值指向当前构造函数
    function CreateKing() {
      if (!new.target) {
        throw new Error('King must be instantiated using new');
      }
      console.info('King is instantiated using new');
      console.info(new.target);
    }
    let king = new CreateKing(); // King is instantiated using new
    CreateKing(); // King must be instantiated using new

    // 10.10 函数的属性和方法
    // 除了 name 属性之外，函数还有 length 属性和 prototype 属性
    // length 属性标识函数定义的命名参数的个数
    function sayName(name) {
      console.info(name);
    }
    // 不包括扩展参数
    function sayName2(name, name2, ...names) {}

    console.info(sayName.length); // 1
    console.info(sayName2.length); // 2

    // prototype 保存了引用类型所有实例方法的地方
    console.info(sayName.prototype);
    console.info(sayName.prototype.toString()); // "[object Object]"
    console.info(sayName.prototype.valueOf()); // 返回 和 sayName.prototype 一样

    // prototype 是不可枚举的，所以 for in 循环无法遍历出来

    // call 和 apply 是函数的方法，都用来更改上下文 this 对象
    // call 的第二个到后面都是函数的参数
    // apply 的第二个参数接收数组或类数组对象
    function sayNewColor() {
      return this.color;
    }
    sayNewColor.call(window); // red 上文定义的值
    sayNewColor.call({ color: 'black' }); // 'black'

    // 换句话说，它们是用来改变函数作用域的
    // 使用这样的方式，不再需要像上文一样定义成对象的方法来调用
    const o1 = {
      color: 'pink'
    };
    sayNewColor.apply(o1); // pink

    // 下面两个函数展示了它们第二个参数的区别
    function sum1(num1, num2) {
      return num1 + num2;
    }
    function callSum1() {
      return sum1.call(this, ...arguments);
    }
    function applySum1() {
      return sum1.apply(this, arguments);
    }

    callSum1(1, 2); // 3
    applySum1(1, 21); // 22

    // 文末定义了自行实现的 call 和 apply

    // 非严格模式下，这两个函数不传参数，this 指向 window，严格模式下，则 this undefined
    // * 使用 call 或 apply 的好处是可以将任意对象设置为任意函数的作用域

    // 改变 this 指向还有一个方法 bind
    const o2 = {
      color: 'green'
    };
    const sayNewColor2 = sayNewColor.bind(o2);
    sayNewColor2(); // green
    // 文末定义了自行实现的 bind

    // 10.11 函数表达式
    // * 还是前面提到的内容，函数声明有声明提升，而函数表达式没有
    // 要注意这两者的区别

    // 10.12 递归
    // * 递归函数通常的形式是在函数中通过名称调用自己
    // 这个就是递归
    trueFactorial1(4); // 24

    // 严格模式下，不能访问 arguments.callee
    function checkCallee() {
      'use strict';
      console.info(arguments);
      console.info(arguments.callee);
    }
    // 可以访问 arguments 但不能访问 callee
    checkCallee();

    // 在严格模式和非严格模式下都适用的方式
    // 使用命名函数表达式
    // 实践发现去掉外部的小括号似乎也没有影响
    const factorialCb = (function f(num) {
      if (num <= 1) {
        return num * 1;
      } else {
        return num * f(num - 1);
      }
    });

    factorialCb(3); // 6

    // 10.13 尾调用优化
    // es6 规范新增了一项内存管理优化机制
    // 让 JS 引擎在满足条件时可以重用栈帧
    // 这个优化适合尾调用，就是外部函数的返回值是一个内部函数的返回值的场景
    /**
     * 这就是应用场景
     * @returns
     */
    function outerFunction() {
      return innerFunction();
    }
    outerFunction();

    // 10.13.1 尾调用优化的条件
    // * 代码在严格模式下运行
    // * 外部函数的返回值是对尾调用函数的调用
    // * 尾调用函数返回后不需要执行额外逻辑
    // * 尾调用函数不是引用外部函数作用域中自由变量的闭包

    // 无优化的几个案例
    // 没有返回值
    function unOptimization1() {
      innerFunction();
    }

    // 返回之后还需要转成字符串
    function unOptimization2(params) {
      return innerFunction().toString();
    }

    // 没有直接返回函数的返回值
    function unOptimization3(params) {
      const res = innerFunction();
      return res;
    }

    // 闭包
    function unOptimization2() {
      let foo = 'bar';
      return function () {
        return foo;
      }
    }

    // 会优化的几个场景
    // 有些类似于平时常见的参数校验
    function optimization1(a, b) {
      if (!a || !b) {
        return '';
      }
      return innerFunction();
    }

    // 有效，两个返回的函数都在尾部
    function optimization2(condition) {
      return condition ? innerFunction1() : innerFunction2();
    }

    // 非严格模式下函数中允许使用 arguments.callee, arguments.caller
    // 两者会引用外部函数的栈帧
    // 因此，尾调用优化要求在严格模式下有效

    // 10.13.2 尾调用优化的代码
    // 实际案例
    /**
     * 斐波那契数列
     * 复杂度为  O2n
     * @param {*} n
     * @returns
     */
    function fib(n) {
      if (n < 2) {
        return n;
      }
      return fib(n - 1) + fib(n - 2);
    }

    fib(1000); // 会给浏览器造成麻烦，实践发现浏览器直接崩溃

    /**
     * 基础框架
     * @param {*} n
     * @returns
     */
    function fib2(n) {
      return fibImpl(0, 1, n);
    }

    function fibImpl(a, b, n) {
      if (n === 0) {
        return a;
      }
      return fibImpl(b, a + b, n - 1)
    }

    fib2(1000); // 优化后

    // 10.14 闭包
    // 核心是理解作用域链，函数执行上下文时产生的活动对象

    // 上文的函数就是闭包的案例
    let compareNames = createComparisionFunction('name');
    // 此时 compareNames 保留有内部变量的引用
    compareNames({name: 'A'}, { name: 'B'});
    // 为即使释放内存，我们需要手动设置为 null
    compareNames = null;

    // 10.14.1 this 对象
    // 内部函数不可能直接访问外部函数的 this 和 arguments 对象
    // 参见 objectII 的案例

    window.idfinity = 'The window';

    let objectI = {
      idfinity: 'the objectI',
      getIdfinityFunction() {
        return function () {
          console.info(this.idfinity);
        }
      }
    }
    // 因为使用了匿名函数，所以 this 指向 window
    objectI.getIdfinityFunction()(); // The window
    let getIdfinityFunction = objectI.getIdfinityFunction();
    getIdfinityFunction(); // The window

    // 可以通过手动保存变量的方式来保持 this 指向
    const objectII = {
      idfinity: 'the objectII',
      getIdfinityFunction() {
        // 核心是这句
        let that = this;
        return function () {
          console.info(that.idfinity);
        }
      }
    }
    objectII.getIdfinityFunction()(); // the objectII

    const objectIII = {
      idfinity: 'the objectIII',
      getIdfinityFunction() {
        console.info(this.idfinity);
      }
    }; // 这里分号分隔符必须加
    (objectIII.getIdfinityFunction)(); // the objectIII
    // 执行赋值操作时，会把 this 丢失
    (objectIII.getIdfinityFunction = objectIII.getIdfinityFunction)(); // the window

    // 10.14.2 内存泄漏
    // 内存管理机制之垃圾回收：
    // * 引用计数和标记清除法

    // 10.15 立即调用的函数表达式 IIFE
    // 又称之为立即调用的匿名函数

    // 使用 IIFE 可以模拟块级作用域
    (function () {
      // 块级作用域
    })();

    // 打印页面每个 div 的索引 这里需要使用自执行函数
    // 避免把 i 混淆，所以使用块级作用域来区分
    var divs = document.querySelectorAll('div');
    for (var i = 0; i < divs.length; i++) {
      var div = divs[i];
      div.addEventListener('click', (function (frozenCounter) {
        return function (params) {
          console.info(frozenCounter);
        }
      })(i));
    }

    // 使用 es6 的 let 自带块级作用域，无需再多一层处理
    for (let index = 0; index < divs.length; index++) {
      const div = divs[index];
      div.addEventListener('click', function () {
        console.info(index, div);
      })
    }

    // 10.16 私有变量
    // 没有显式的私有成员的概念，但是可以通过函数作用域来实现私有变量
    // 任何在函数或块中的变量都是私有的
    // 下面定义了私有变量，包括私有函数
    // * 可以访问私有变量和私有方法的公有方法就是特权函数
    function MyObject() {
      let privateVariable = 0;
      let privateFunction = () => {
        return false;
      }

      this.publicFunction = () => {
        privateVariable++;
        console.info(privateVariable);
        return privateFunction();
      }
    }

    const myObject = new MyObject();
    const myObject2 = new MyObject();
    console.info(myObject.publicFunction()); // false
    // 这里的特权方法是不共享的
    console.info(myObject.publicFunction === myObject2.publicFunction); // false

    // 再看另外一个例子，只能通过内部方法来访问到 name 属性
    function Person(name) {
      // this.name = name; 注意这里没有用到 this
      this.getName = () => {
        return name;
      }
      this.setName = (val) => {
        name = val;
      }
    }
    const person1 = new Person('Bob');
    console.info(person1.name); // undefined
    console.info(person1.getName()); // Bob
    console.info(person1.setName('Curry'));
    console.info(person1.getName()); // Curry

    // 10.16.1 静态私有变量
    // 特权方法也可以通过使用私有作用域定义私有变量和函数来实现
    // 定义了私有变量和私有函数，然后又定义了构造函数和公有方法
    // 核心区别是，这里的私有变量和私有函数是由实例共享的，而且特权方法也是共享的
    (function () {
      let privateVariable = 0;
      let privateFunction = () => {
        return false;
      }

      // 故意不使用关键字声明 MyObject1 让他挂载在全局对象上
      MyObject1 = function () {}
      MyObject1.prototype.publicFunction = () => {
        privateVariable++;
        console.info(privateVariable);
        return privateFunction();
      }
    })();

    const myObject1 = new MyObject1();
    const myObject11 = new MyObject1();
    console.info(myObject1.publicFunction()); // false
    // 特权方法是共享的
    console.info(myObject1.publicFunction === myObject11.publicFunction); // true

    (function () {
      let name = '';

      PersonPub = function (value) {
        name = value;
      }
      PersonPub.prototype.getName = () => {
        return name;
      }

      PersonPub.prototype.setName = (value) => {
        name = value;
      }
    })();

    // 实例间共享私有变量
    const personPub1 = new PersonPub();
    const personPub2 = new PersonPub();
    personPub1.setName('Jordan');
    console.info(personPub2.getName()); // Jordan

    // 10.16.2 模块模式
    // 单例对象就是只有一个实例的对象
    // 常见的例如 window， jquery 的 $ 对象
    // 可以通过对象字面量来创建一个最简单的单例对象
    let singleton = {
      name: 'value',
      method () {
        // 方法的代码
      }
    }

    // * 模块模式是在单例对象上的扩展，使其通过作用域链来关联私有变量和特权方法
    // 通过一个自执行函数来创建块级作用域，保存私有变量
    let singletonEnhanced = function () {
      let privateVariable = 0;
      let privateFunction = () => {
        return false;
      }
      return {
        publicProperty: true,
        publicMethod() {
          privateVariable++;
          console.info(privateVariable);
          return privateFunction();
        }
      }
    }();

    console.info(singletonEnhanced.publicMethod()); // false

    let components = function () {
      let components = [];

      // 初始化
      components.push(new BaseComponent());

      return {
        getComponentCount() {
          return components.length;
        },
        registerComponent(component) {
          if (typeof component === 'object') {
            components.push(component);
          }
        }
      }
    }();

    // 10.16.3 模块增强模式
    // 适合单例对象必须是某个特定类型的实例，但又必须给它添加额外属性或方法的场景
    function CustomType() {}
    let singletonEnhancedCustomed = function () {
      let privateVariable = 0;
      function privateFunction() {
        return false;
      }

      // 核心是下面这一段语句
      let obj = new CustomType();
      obj.publicProperty = true;

      obj.publicMethod = () => {
        privateVariable++;
        return privateFunction();
      }

      return obj;
    }();

    console.info(singletonEnhancedCustomed.publicProperty); // true
    console.info(singletonEnhancedCustomed.publicMethod()); // false

    function BaseComponent() {}

    /**
     * 增强的单例对象
     */
    let application = function () {
      let components = [];

      components.push(new BaseComponent());

      // 核心语句
      let app = new BaseComponent();

      // 注册时判断是否是实例
      app.registerComponent = (component) => {
        if (typeof component === 'object' && component instanceof BaseComponent) {
          components.push(components)
        }
      }
      app.getComponentCount = () => {
        return components.length;
      }

      return app;
    }();

    application.getComponentCount(); // 1
    // 注册一个实例
    application.registerComponent(new BaseComponent());
    application.getComponentCount(); // 2
    // 注册一个普通对象
    application.registerComponent({});
    application.getComponentCount(); // 2 并不会保存

    // 使用单例对象实现发布订阅模式
    const Single = function () {
      // 私有变量
      let handlers = {};

      // 私有方法
      const addHandler = function (type, handler) {
        handlers[type] = handlers[type] || [];
        !handlers[type].includes(handler) && handlers[type].push(handler);
      }

      // 返回公共接口，下面都是特权方法
      return {
        /**
         * 特权方法，返回注册的事件
         * @returns
         */
        getHandlers() {
          return handlers;
        },
        /**
         * 发布，调用后会清空
         * @param {*} type
         * @returns
         */
        invokeHandler(type) {
          let results;
          if (Array.isArray(handlers[type])) {
            results = handlers[type].map((handler) => handler());
            handlers[type] = [];
          }
          return results;
        },
        /**
         * 订阅，有基本校验
         * @param {*} type
         * @param {*} handler
         */
        registerHandler(type, handler) {
          if (typeof handler !== 'function') {
            handler = new Function(handler);
          }
          addHandler(type, handler);
        }
      }
    }();

    console.info(Single, '单例的发布订阅');

    Single.registerHandler('click', () => {
      console.info('click');
      return 'click';
    });
    Single.registerHandler('move', () => {
      console.info('move');
      return 'move';
    });

    console.info(Single.getHandlers(), 'handlers');

    Single.invokeHandler('click');
    Single.invokeHandler('move');
};

/**
 * 自定义绑定事件函数
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 * @param {*} obj
 * @returns
 */
export const _bind = function(obj) {
  // 获取初始参数，不包括指向的对象
  const args = Array.prototype.slice.call(arguments, 1);
  // 保留 this 指向
  const that = this;

  return function () {
    // 获取返回函数的参数
    const innerArgs = Array.from(arguments);
    return that.call(obj, ...args, ...innerArgs);
  }
}

Function.prototype._bind = _bind;

/**
 * 自定义 call 方法
 * 核心是将 this 也就是当前运行的函数保存为对象方法，执行后再删除
 * @param {*} obj 实际调用发现，call 支持任意类型的值作为第一个参数，而非传统印象里一定要是对象
 * @returns
 */
export const _call = function (obj) {
  const args = [...arguments].slice(1);
  obj = new Object(obj); // 防止 null 的情况
  obj.fn = this;
  const result = obj.fn(...args);
  delete obj.fn;

  return result;
}

Function.prototype._call = _call;

/**
 * 类数组对象的判断
 * @param {*} o
 * @returns
 */
export const isArrayLike = function(o) {
  if(o &&                                    // o不是null、undefined等
     typeof o === 'object' &&                // o是对象
     isFinite(o.length) &&                   // o.length是有限数值
     o.length >= 0 &&                        // o.length为非负值
     o.length === Math.floor(o.length) &&    // o.length是整数
     o.length < 4294967296)                  // o.length < 2^32
     return true
  else
     return false
}

/**
 * 自行实现 apply  注意要多一步类型判断
 * @param {Object} obj 实际调用发现，apply 支持任意类型的值作为第一个参数，而非传统印象里一定要是对象
 * @param {Array} arr
 * @returns
 */
export const _apply = function (obj, arr) {
  // 如果有参数则校验是否是数组实例或类数组对象，如果无参数则不必校验
  if (arr && (!(arr instanceof Array) || !isArrayLike(arr))) {
    // 如果传入的类型不对，则抛出异常，报错内容复制的 apply
    throw new Error('Uncaught TypeError: CreateListFromArrayLike called on non-object');
  }
  obj = new Object(obj); // 防止 null 的情况
  obj.fn = this;
  const result = obj.fn(...arr);
  delete obj.fn;

  return result;
}

Function.prototype._apply = _apply;

export default Part10Function;
