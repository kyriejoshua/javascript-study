/******** 《JavaScript 高级程序设计》 ********/
/******** 7、函数表达式 ********/

export default class Part7 {
  constructor() {
    // 创建函数
    let compareNames = this.createComparisonFunction('name')
    // 调用函数
    let result = compareNames({ name: 'kk' }, { name: 'allen' })
    console.info(result)
    // 清除该函数的引用，以便释放内存 这样局部变量才会被销毁
    compareNames = null

    // 对应下文该方法定义时的说明
    let arrayFunctions = this.createFunctions();
    arrayFunctions.forEach(element => {
      console.info(element, element()) // 5 5 5 5 5
    });

    let arrayFunctions2 = this.createFunctionsWithLet();
    arrayFunctions2.forEach(element => {
      console.info(element, element()) // 0 1 2 3 4
    });

    let arrayFunctions3 = this.createFunctionsWithClosure();
    arrayFunctions3.forEach(element => {
      console.info(element, element()) // 5 5 5 5 5
    });
  }

  /**
   * 7.1 递归
   * 这里主要的问题是函数命名问题，如果赋值给别的变量，内部的函数就无效了
   * @param {Number} n
   */
  factorial(n = 1) {
    return n === 1 ? n : n * this.factorial(n - 1)
  }

  /**
   * 7.2 闭包
   * 有权访问另一个函数作用域中的变量的函数
   * @param {String} propertyName
   */
  createComparisonFunction(propertyName) {
    return function (object1, object2) {
      let value1 = object1[propertyName]
      let value2 = object2[propertyName]

      return value1 < value2 ? -1 : value1 > value2 ? 1 : 0
    }
  }

  /**
   * 闭包只能获得包含函数中任何变量的最后一个值
   * 这里特意用 var 声明，可以显示出上句话的效果，如果改成了 let, 就不是了
   */
  createFunctions() {
    let result = []

    for (var i = 0; i < 5; i++) {
      result[i] = function() {
        return i
      }
    }

    return result
  }

  /**
   * 避免上一个函数出现的状况
   */
  createFunctionsWithLet() {
    let result = []

    for (let i = 0; i < 5; i++) {
      result[i] = function() {
        return i
      }
    }

    return result
  }

  /**
   * 使用闭包保存局部变量
   * 相当于再次创建了一个闭包，同时将 i 作为 num 参数传进去
   * 效果同上
   */
  createFunctionsWithClosure() {
    let result = []

    for (var i = 0; i < 5; i++) {
      result[i] = (function(num) {
        return function() {
          return num;
        };
      })(i);
    }

    return result
  }

  /**
   * 7.2.3 内存泄漏
   * 在 IE 9 以下，垃圾回收机制略有不同
   * 在匿名函数中引用了 element, 这里的 DOM 对象引用就会存在着，无法回收，引起内存泄漏
   */
  assignHandle() {
    let element = document.querySelector('#element')

    element.onclick = function () {
      return element.id
    }
  }

  /**
   * 创建一个副本保存后，再清空引用，此时内存便可以回收
   */
  assignHandleBetter() {
    let element = document.querySelector('#element')
    let id = element.id;

    element.onclick = function () {
      return id
    }

    element = null
  }
}
