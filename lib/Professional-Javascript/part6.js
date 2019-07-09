/******** 《JavaScript 高级程序设计》 ********/
/******** 6、面向对象的程序设计 ********/

export default class Part6 {
  constructor(props) {
    super(props);

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

    // 原型模式
    function Person2() {
    }
    Person2.prototype.name = 'guy'
    Person2.prototype.sayName = function() {
      console.info(this.name)
    }

    let personB = new Person2()
    personB.name = 'green'
    for (let prop in personB) {
      console.info(prop, personB[prop]) // 只有 green
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
