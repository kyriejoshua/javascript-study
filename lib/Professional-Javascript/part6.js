/******** 《JavaScript 高级程序设计》 ********/
/******** 6、面向对象的程序设计 ********/

export default class Part6 {
  constructor() {
    super();

    // 每个对象拥有一个原型对象，对象以其原型对象为模板，从原型集成方法和属性

    // get set 访问器方法简略

    let personObj = {}
    Object.defineProperty(personObj, 'name', {
      writable: false,
      value: 'kyrie'
    })

    console.info(personObj) // logs { name: 'kyrie' }
    personObj.name = 'allen'
    console.info(personObj) // logs { name: 'kyrie' }

    // 此时可以继续调用 defineProperty 方法修改属性
    // defineProperty 的 configurable, enumerable, writable 默认属性值都是 false
    // 但定义为不可配置的之后，就不可更改它的任何特性了，在严格模式下尝试修改会报错
    Object.defineProperty(personObj, 'alias', {
      configurable: false,
      value: 'kawai'
    })

    console.info(personObj) // logs { alias: 'kawai' }
    delete personObj.alias
    console.info(personObj) // logs { name: 'kawai' }

    // 同时定义多个属性
    Object.defineProperties(personObj, {
      age: {
        value: 23
      },
      male: {
        value: true
      }
    })
    console.info(personObj) // logs { age: 23, male: true }

    /**
     * 工厂模式
     * 抽象了闯进具体对象的过程
     * @param {*} name
     * @param {*} age
     * @param {*} job
     */
    function createPerson(name, age, job) {
      let o = new Object()
      o.name = name
      o.age = age
      o.job = job
      o.sayName = function() {
          return this.name
      }
      return o
    }

    let person1 = createPerson('Nich', 29, 'Doctor')
    let person2 = createPerson('Greg', 39, 'Developer')
    console.info(person1) //
    console.info(person2) // 俩不同对象

    /**
     * 构造函数
     * @param {*} name
     * @param {*} age
     */
    function Person(name, age) {
      this.name = name
      this.age = age
      this.sayName = function() {
        console.info(this.name)
      }
    }

    let personA = new Person('curry', 30)
    console.info(personA) // logs { name: 'curry', age: 23, sayName: fn }

    /**
     * 原型模式
     * 让所有实例共享它所包含的属性和方法
     */
    function Person2() {
    }
    Person2.prototype.name = 'guy'
    Person2.prototype.age = 23
    Person2.prototype.sayName = function() {
      console.info(this.name)
    }

    let personB = new Person2()
    personB.name = 'green'

    // 遍历出可枚举属性，当前实例的或者是继承自原型链上的
    for (let prop in personB) {
      console.info(prop, personB[prop]) // 只有 name green, age 23
    }

    /**
     * 寄生构造函数
     * 与工厂模式很相似
     */
    function SpectialArray() {
      let arr = new Array()
      arr.push.apply(arr, arguments)

      arr.toPipedString = function () {
        return this.join('|')
      }

      return arr
    }

    let colorArr = new SpectialArray('red', 'yellow', 'orange')
    colorArr.toPipedString()

    /**
     * 继承 通过原型链来实现
     * 原型链的构建是通过将一个类型的实例赋值给另一个构造函数的原型来实现的
     */
    function SuperType() {
      this.property = true
    }

    SuperType.prototype.getSuperProperty = function () {
      return this.property
    }

    function SubType(params) {
      this.subProperty = false
    }

    // 构建原型链的重要过程
    SubType.prototype = new SuperType()
    SubType.prototype.getSubProperty = function () {
      return this.subProperty
    }

    let instance = new SubType()
    console.info(instance.getSubProperty()) // logs false
    console.info(instance.getSuperProperty()) // logs true

    console.info(instance instanceof SubType)  // logs true
    console.info(instance instanceof SuperType) // logs true
    console.info(SubType instanceof SuperType) // logs false 是实例化后
    console.info(instance instanceof Object) // logs true

    console.info(Object.prototype.isPrototypeOf(instance)) // logs true
    console.info(SubType.prototype.isPrototypeOf(instance)) // logs true
    console.info(SuperType.prototype.isPrototypeOf(instance)) // logs true
    console.info(SuperType.prototype.isPrototypeOf(SubType)) // logs false

    /**
     * 借用构造函数
     * 在子类型构造函数的内部调用超类型构造函数
     */
    function SuperType2() {
      this.colors = ['red', 'green']
    }

    function SubType2() {
      // 动态改变上下文
      console.info(this)
      SuperType2.call(this)
    }

    SubType2.prototype = new SuperType2()
    let instance2 = new SubType2()
    instance2.colors.push('grey')
    let instance3 = new SubType2()
    console.info(instance2) // ["red", "green", "grey"]
    console.info(instance3) // ["red", "green"]

    /**
     * 原型式继承 等同于只接收了一个参数的 Object.create()
     * 借助原型可以基于已有的对象创建新对象，同时还不必自定义类型
     * @param {Object} o
     */
    function createObject(o) {
      function F() {}
      F.prototype = o
      return new F()
    }

    // Object.create 的第二个参数和 Object.defineProperties 的第二个参数格式相同
    let person = {
      name: 'nick',
      friends: ['bob', 'shelly']
    }

    let anotherPerson = createObject(person) // Object.create
    anotherPerson.name = 'Linda'
    anotherPerson.friends.push('van')

    let yetAnotherPerson = createObject(person) // Object.create
    yetAnotherPerson.name = 'Greg'
    yetAnotherPerson.friends.push('Rob')

    console.info(person.friends) // ["bob", "shelly", "van", "Rob"]

    /**
     * 寄生式继承
     * 创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真地是他做了所有工作一样返回对象
     * @param {Object} o
     */
    function createAnother(o) {
      let tempObj = createObject(o)
      tempObj.sayHi = function (params) { // 增强当前对象
        console.info('hi')
      }
      return tempObj
    }

    let anotherPerson2 = createAnother(person)
    anotherPerson2.sayHi() // hi

  }

  /**
   * 判断属性是否在原型中而不是实例上
   * @param {Object} object
   * @param {String} name
   */
  hasPrototypeProperty(object, name) {
    return (!object.hasOwnProperty(name)) && (name in object)
  }

}

/**
 * 寄生组合式继承
 * 通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。
 * @param {*} subType 子类型构造函数
 * @param {*} superType 超类型构造函数
 */
export const inheritPrototype = (subType, superType) => {
  let prototype = createObject(superType.prototype) // 创建超类型原型的副本
  prototype.constructor = subType // 增强对象，为副本添加原本失去的 constructor 属性
  subType.prototype = prototype // 副本指定给子类型的原型
}
