/******** 《JavaScript 高级程序设计》 ********/
/******** 7、函数表达式 ********/

export default class Part7 {
  constructor() {

    // 有权访问私有变量的共有方法叫特权方法

    // 匿名函数的创建，调用，和销毁
    // 创建函数
    let compareNames = this.createComparisonFunction('name')
    // 调用函数
    let result = compareNames({ name: 'kk' }, { name: 'allen' })
    console.info('compareName', result) // compareName 1
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

    /**
     * 7.4 私有变量
     * 重点在于，函数中的函数处于外部函数的作用域链，因此有权访问函数内的变量，并可以任意修改
     * @param {*} name
     */
    function Person(name) {

      this.setName = function(value) {
        name = value
      }
      this.getName = function() {
        return name
      }
    }

    let personA = new Person('Nick')
    personA.getName() // Nick
    personA.setName('Greg')
    personA.getName() // Greg

    /**
     * 7.4.2 模块模式
     * 单例模式：只有一个实例的对象
     * 通常用对象字面量的方式来创建单例对象
     * 模块模式通过为单例添加私有变量和特权方法能够使其得到增强
     */
    let singleton = (function () {
      // 私有变量和私有函数
      var privateVariable = 10

      function privateFunction(params) {
        return false
      }

      // 特权/公有方法和属性
      return {
        publicProperty: true,

        publicMethod: function () {
          privateVariable++
          return privateFunction()
        }
      }
    })()

    // 一个比较常见的应用是，对某些单例进行初始化，同时单例里又有私有变量需要维护时的情况
    let appliction = (function() {

      // 私有变量和函数
      var components = []

      // 初始化
      component.push(new BaseComponent())

      // 公共
      return {
        getComponentCount: function() {
          return components.length
        },
        registerComponent: function(component) {
          if (typeof component === 'object') {
            components.push(component)
          }
        }
      }
    })()

    /**
     * 7.4.3 增强的模块模式
     * 适合某个单例必须是某种类型的实例的场景
     * 这里是 customType
     */
    let betterSingleton = (function () {

      // 私有变量和私有函数
      var privateVariable = 10

      function privateFunction() {
        return false
      }

      // 创建对象
      var object = new CustomType()

      // 添加特权/公有属性和方法
      object.publicProperty = true

      object.publicMethod = function () {
        privateVariable++
        return privateFunction()
      }

      return object
    })()

    /**
     * 增强的模块模式
     */
    let betterComponents = (function () {
      // 私有变量和函数
      var components = []

      // 初始化
      components.push(new BaseComponent())

      // 创建 application 的一个局部副本
      var app = new BaseComponent()

      // 公共接口
      app.getComponentCount = function () {
        return components.length
      }

      app.registerComponent = function(component) {
        if (typeof component === "object") {
          components.push(component);
        }
      }

      // 返回这个副本
      return app
    })()

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
   * 7.2.1 闭包和变量
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
   * 因为 let 有自己的作用域在（个人理解）
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
