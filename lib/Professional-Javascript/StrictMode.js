/******** 《JavaScript 高级程序设计》 ********/
/******** 附录 B：严格模式 ********/

export default class StrictMode {
  constructor() {
    // B.1 选择使用
    // 'use strict';

    // 在函数中打开严格模式
    function doSomething() {
      'use strict';
    }
    doSomething();

    // B.2 变量
    (function () {
      'use strict';
      // 下面的代码在严格模式下会报错，在非严格模式下则会创建一个全局变量
      // message = 'Hello';
    })()

    ;(function () {
      'use strict';
      // eslint-disable-next-line
      var color = 'red';
      // 严格模式下删除变量会报错，非严格模式下是静默失败，但不会报错
      // delete color
    })()

    // 严格模式下不得使用以下关键字作为变量名
    // implements/interface/let/package/private/protected/public/static/yield

    // B.3 对象
    ;(function () {
      'use strict';
      // 严格模式下，直接报错，非严格模式下，重名属性以后面的为准
      // eslint-disable-next-line
      var person = {
        name: 'Nico',
        // eslint-disable-next-line
        name: 'Greg'
      };
    })()

    // B.4 函数
    ;(function () {
      'use strict';
      // 有两个重名参数时，严格模式下，直接报错，非严格模式下，以第二个为主
      // function sum(num, num) {}
    })()

    ;(function () {
      'use strict';
      // 非严格模式下，arguments 对象和参数一一对象，修改其中之一会同步另一方
      // 严格模式下，两者是独立的
      function showValue(value) {
        value = 'Foo';
        console.info(value); // 'Foo'
        console.info(arguments[0]); // 非严格模式 'Foo' 严格模式：'Hi'
      }
      showValue('Hi');
    })()

    // 严格模式下，淘汰了 arguments.caller 和 arguments.callee
    // 非严格模式下，前者引用调用函数，后者引用函数本身
    ;(function name() {
      'use strict';
      // 非严格模式下，没有问题
      // 严格模式下，抛出 TypeError
      function factorial(num) {
        if (num <= 1) {
          return 1;
        } else {
          return num * arguments.callee(num - 1);
        }
      }
      let result = factorial(5);
      console.info(result);
    })()

    ;(function () {
      'use strict';
      // 非严格模式下，if 语句里的函数声明会提升到 if 语句外部
      // 严格模式下，直接抛出语法错误
      // eslint-disable-next-line
      if (true) {
        // eslint-disable-next-line
        function doSomething() {}
      }
    })()

    // 严格模式下对函数名的限制和变量的限制相同

    // B.5 eval()
    // 使用 eval 创建变量
    // 严格模式里它在包含上下文中不再创建变量或函数
    // 非严格模式下，它是可以创建变量的
    ;(function () {
      'use strict';
      // eslint-disable-next-line
      function doSomething() {
        eval('var x = 10');
        // 这里在严格模式下，就会报错
        // eslint-disable-next-line
        console.info(x);
      }
    })()

    // 严格模式下的特殊作用域
    ;(function () {
      'use strict';
      // eslint-disable-next-line
      function doSomething() {
        const result = eval('var x = 10, y = 11; x + y');
        // 这里在严格模式下，result 有值，但是 x，y 就不复存在了
        console.info(result);
      }
    })();

    // B.6 eval 与 arguments
    // 严格模式下，不准使用这两个关键字作为变量名或标识符也不能赋值

    // B.7 抑制 this
    // 不受约束的 this 会在值为 null 或者 undefined 时自动转为全局对象 window
    // eslint-disable-next-line
    var color = 'red'; // 注意这里是 var 而不是 const，var 是全局的

    function displayColor() {
      console.info(this.color);
    }

    // 严格模式下，抛出错误
    // 非严格模式下，返回 color 的值
    displayColor.call(null);

    // B.8 其他变化
    // 严格模式下不允许再使用 with
    // 严格模式下不支持八进制字面量
    // 下面这句语句在严格模式下就会报错
    // var value = 010

    // parseInt 在严格模式下的表现也不相同
    var valued = parseInt('010');
    // 严格模式下，值为 10
    // 非严格模式下，值为 8
    console.info(valued);
  }
}
