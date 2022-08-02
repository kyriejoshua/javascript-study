/******** 《JavaScript 高级程序设计》(第4版) ********/
/******** 9、 代理和反射 266-286 重点 ********/

export default class Part9ProxyAndReflect {
  constructor() {
    // 9.1 代理基础
    // 个人理解其实代理是一种劫持
    // 9.1.1 空代理
    // 最简单的代理是空代理
    const emptyProxy = new Proxy({}, {})
    console.log(emptyProxy) // {}
    // 创建代理的时候两个参数缺一不可，都会报错
    // const errorProxy1 = new Proxy({}); // TypeError: Cannot create proxy with a non-object as target or handler

    const target1 = {
      id: "target",
    }
    const handler1 = {}
    const proxy1 = new Proxy(target1, handler1)
    console.log(proxy1.id) // target
    // 修改代理对象的属性会同时修改代理对象和目标对象的属性
    proxy1.id = "foo"
    console.log(target1.id) // foo
    console.log(proxy1.id) // foo
    // 修改目标对象的属性会同时修改代理对象和目标对象的属性
    target1.id = "bar"
    console.log(target1.id) // bar
    console.log(proxy1.id) // bar

    // 而且这个属性都可以使用 hasOwnProperty 判断
    console.log(target1.hasOwnProperty("id")) // true
    console.log(proxy1.hasOwnProperty("id")) // true

    // 代理构造函数是没有原型对象的
    console.log(Proxy.prototype) // undefined
    // 也不能使用实例来判断，会直接抛出错误
    // console.log(proxy1 instanceof Proxy); // TypeError: Function has non-object prototype 'undefined' in instanceof check

    // 可以使用严格相等来判断区分目标对象和代理对象
    console.log(proxy1 === target1) // false

    // 9.1.2 定义捕获器
    const target2 = {
      foo: "bar",
    }
    const proxy2 = new Proxy(target2, {
      // 捕获器在处理程序对象中以方法名为键
      get() {
        return "handler override"
      },
    })

    console.log(target2.foo) // bar
    console.log(proxy2.foo) // handler override

    // 可以有多种方式触发捕获器
    console.log(target2["foo"]) // bar
    console.log(proxy2["foo"]) // handler override
    // 也可以通过创建属性的方式
    console.log(Object.create(target2)["foo"]) // bar
    console.log(Object.create(proxy2)["foo"]) // handler override

    // 9.1.3 捕获器参数和反射 API
    // get 方法会收到三个参数，详见函数注释
    const target3 = {
      foo: "bar",
    }
    const proxy3 = new Proxy(target3, {
      /**
       * @description: 捕获器参数
       * @param {Record<string, any>} trapTarget
       * @param {string} property
       * @param {Record<string, any>} receiver
       * @return {any}
       */
      get(trapTarget, property, receiver) {
        console.log(trapTarget === target3)
        console.log(property)
        console.log(receiver === proxy3)
        return trapTarget[property]
      },
    })
    // console.log(target3.foo);
    console.log(proxy3.foo)
    // 依次返回
    // true
    // foo
    // true
    // bar

    // 使用反射器定义空代理对象
    const target4 = {
      foo: "bar",
    }
    const emptyProxybyReflect = new Proxy(target4, {
      get() {
        return Reflect.get(...arguments)
      },
    })
    console.log(emptyProxybyReflect) // { foo: 'bar' }
    console.log(emptyProxybyReflect.foo) // bar

    // 更加简化的写法
    const target5 = {
      foo: "bar",
    }
    const emptyProxybyReflectBetter = new Proxy(target5, {
      get: Reflect.get,
    })
    console.log(emptyProxybyReflectBetter) // { foo: 'bar' }
    console.log(emptyProxybyReflectBetter.foo) // bar

    // 而如果期望创建一个空代理对象并且所有方法都转发给反射 API
    // 可以像先面这样创建
    const target6 = {
      foo: "bar",
    }
    const emptyProxyAllbyReflect = new Proxy(target6, Reflect)
    console.log(emptyProxyAllbyReflect) // { foo: 'bar' }
    console.log(emptyProxyAllbyReflect.foo) // bar

    // 反射器 API 的一个作用就是提供样板代码，让开发者以最少得代码修改捕获的方法
    const target7 = {
      foo: "bar",
      id: "key",
    }
    const proxybyReflect = new Proxy(target7, {
      get(trapTarget, property, receiver) {
        let decoration = ""
        if (property === "foo") {
          decoration = "!!!"
        }
        return Reflect.get(...arguments) + decoration
      },
    })

    // 修饰后的效果
    console.log(proxybyReflect.foo) // bar!!!
    // 目标对象不变
    console.log(target7.foo) // bar
    // 其他属性不变
    console.log(target7.id) // key

    // 9.1.4 捕获器不变式
    // 为了不让捕获器异常使用或有反常的行为，规定捕获处理程序的行为必须遵循捕获器不变式
    // 比如，如果代理对象尝试修改目标对象的数据属性，就会抛出错误
    const target8 = {}
    // 在目标对象上定义一个不可配置和不可写的数据属性
    Object.defineProperty(target8, "foo", {
      writable: false,
      configurable: false,
      value: "bar",
    })
    const errorProxy2 = new Proxy(target8, {
      get() {
        return "baz"
      },
    })
    console.log(errorProxy2.foo) // TypeError: 'get' on proxy: property 'foo' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected 'bar' but got 'baz')

    // 9.1.5 可撤销代理
    // 某些场景下需要撤销代理对象和目标对象的联系，对于使用构造函数创建的普通代理来说是无法撤销的
    // 通过 Proxy 的静态方法 revocable 可以撤销代理对象和目标对象的关联
    // 但是撤销代理的操作是不可逆的，而且撤销函数 revoke 是幂等的，多次调用的结果都一样
    const target9 = {
      foo: "bar",
    }

    const { proxy: proxyByRevoke, revoke } = Proxy.revocable(target9, {
      get() {
        return "baz"
      },
    })
    console.log(proxyByRevoke.foo) // baz
    console.log(target9.foo) // bar
    revoke()
    // console.log(proxyByRevoke.foo) // TypeError: Cannot perform 'get' on a proxy that has been revoked
    revoke()
    console.log(target9.foo) // bar

    // 9.1.6 实用反射 API
    // 1. 反射 API 与对象 API
    // 反射 API 并不限于捕获处理程序
    // 大多数反射 API 方法在 Object 类型上有对应的方法
    // 反射方法适用于细粒度的对象控制和操作

    // 2. 状态标记
    // 比起直接抛出异常的普通对象方法，反射的状态标记更有用
    // 下面的方法可以通过反射来重构
    this.hasProperty("foo", "bar")

    // 重构之后
    this.hasPropertyBetter("foo", "bar")
    // 这些方法都会提供状态标记
    Reflect.defineProperty
    Reflect.preventExtensions
    Reflect.setPrototypeOf
    Reflect.set
    Reflect.deleteProperty

    // 3. 使用一等函数来替代操作符
    Reflect.get
    Reflect.set // 替代赋值操作
    Reflect.has // 替代 in 操作
    Reflect.deleteProperty // 替代 delete 操作
    Reflect.construct // 替代 new 操作符

    // 4. 安全应用函数
    // 通过 apply 方法调用函数时，被调用的函数有可能也定义了自己的 apply 属性（虽然可能性非常小）
    // 为了绕过这个问题，通常我们会这样做
    // Function.prototype.apply.call(myFunc, thisVal, arguments)
    // 更好的方式是使用反射 API
    // Reflect.apply(myFunc, thisVal, arguments)

    // 9.1.7 代理另一个代理
    // 代理其实是可以套娃的
    const targetTarget = {
      foo: "bar",
    }
    // 创建第一个代理
    const firstProxy = new Proxy(targetTarget, {
      get() {
        console.log("first proxy")
        return Reflect.get(...arguments)
      },
    })
    // 使用代理去代理代理
    const secondProxy = new Proxy(firstProxy, {
      get() {
        console.log("second proxy")
        return Reflect.get(...arguments)
      },
    })

    console.log(secondProxy.foo) // second proxy -> first proxy -> bar

    // 9.1.8 代理的问题与不足
    // 1. 代理中的 this
    const targetThis = {
      thisValEuqalsProxy() {
        return this === proxyThis
      },
    }

    const proxyThis = new Proxy(targetThis, {})
    console.log(targetThis.thisValEuqalsProxy()) // false
    console.log(proxyThis.thisValEuqalsProxy()) // true

    // 更具体的例子
    const wm = new WeakMap()
    class User {
      constructor(userId) {
        wm.set(this, userId)
      }

      set id(userId) {
        wm.set(this, userId)
      }

      get id() {
        return wm.get(this)
      }
    }
    const user = new User(123)
    console.log(user.id) // 123

    const userInstanceProxy = new Proxy(user, {}) // 123
    console.log(userInstanceProxy.id) // undefined
    // 这不是我们预期的行为
    // 如果期望行为保持一致
    // 把代理的实例对象改为代理 User 类本身，之后再创建实例就会以代理实例作为 WeakMap 的键了
    const UserClassProxy = new Proxy(User, {})
    const proxyUser = new UserClassProxy(312)
    console.log(proxyUser.id) // 312 现在行为一致

    // 2. 代理与内部槽位
    // 代理和内置的引用类型一般是可以正常工作，除了 Date 这种特殊的对象
    const targetDate = new Date()
    const proxyDate = new Proxy(targetDate, {})

    // Date 对象类型有着自己的数据属性 [[NumberDate]]，而代理对象不存在这个内部槽位
    // 也就是具体的数据属性 [[NumberDate]]，而且也不能通过 get 方法访问到，所以会报错
    console.log(proxyDate instanceof Date) // true
    proxyDate.getDate() // TypeError: this is not a Date object.

    // 9.2 代理捕获器和反射方法
    // 9.2.1 get()
    // get 捕获器会在获取属性值的操作中被调用，对应的反射 API 方法为 Reflect.get
    const myProxyGet = this.createProxyByGet()
    myProxyGet.foo // get()

    // 1. 返回值是任意的，没有限制

    // 2. 拦截的操作
    // proxy.property
    // proxy[property]
    // Object.create(proxy)[property]
    // Reflect.get(proxy, property, receiver)

    // 3. 捕获器处理程序参数
    /**
     * @param {T extends Object} target 目标对象
     * @param {string|Symbol} property 引用的目标对象上的字符串键属性或 Symbol 键
     * @param {T extends Object} receiver 代理对象或继承代理对象的对象
     */

    // 4. 捕获器不变式
    // * 如果 target.property 不可写且不可配置，则处理程序返回的值必须和 target[property] 匹配，否则会抛错
    // * 如果 target.property 不可配置且 [[Get]] 特性是 undefined，则目标属性值的返回也必须是 undefined

    // 9.2.2 set()
    // set 捕获器会在设置属性值的操作中被调用，对应的反射 API 方法为 Reflect.set
    const myProxySet = this.createProxyBySet()
    myProxySet.foo = "bar" // set()

    // 1. 返回值是布尔值，但不是必须的
    // 返回 true 表示赋值成功
    // 返回 false 表示赋值失败，严格模式下会抛出 TypeError

    // 2. 拦截的操作
    // proxy.property = value
    // proxy[property] = value
    // Object.create(proxy)[property] = value
    // Reflect.set(proxy, property, receiver)

    // 3. 捕获器处理程序参数
    /**
     * @param {T extends Object} target 目标对象
     * @param {string|Symbol} property 引用的目标对象上的字符串键属性或 Symbol 键
     * @param {any} value 赋给属性的值
     * @param {T extends Object} receiver 接收最初赋值的对象
     */

    // 4. 捕获器不变式
    // * 如果 target.property 不可写且不可配置，则不能修改目标属性值，否则会抛错
    // * 如果 target.property 不可配置且 [[Set]] 特性是 undefined，则不能修改目标属性值

    // 9.2.3 has()
    // has 捕获器会在 in 操作符中被调用，对应的反射 API 方法为 Reflect.has
    const myProxyByHas = this.createProxyByHas()
    console.log("id" in myProxyByHas) // has false

    // 1. 返回值是布尔值，是必须的
    // 返回值表示属性是否存在，返回非布尔值会隐式转换成布尔值

    // 2. 拦截的操作
    // property in proxy.property
    // property in Object.create(proxy)
    // with (proxy) { (property) }
    // Reflect.has(proxy, property)

    // 3. 捕获器处理程序参数
    /**
     * @param {T extends Object} target 目标对象
     * @param {string|Symbol} property 引用的目标对象上的字符串键属性或 Symbol 键
     */

    // 4. 捕获器不变式
    // * 如果 target.property 存在且不可配置，则该方法必须返回 true
    // * 如果 target.property 存在且目标对象不可扩展，则该方法必须返回 true

    // 9.2.4 defineProperty()
    // defineProperty 捕获器会在 Object.defineProperty() 中被调用，对应的反射 API 方法为 Reflect.defineProperty()
    const myProxyByDefineProperty = this.createProxyByDefineProperty()
    Object.defineProperty(myProxyByDefineProperty, "foo", { value: "bar" }) // defineProperty()
    console.log(myProxyByDefineProperty.foo) // bar

    // 1. 返回值是布尔值，是必须的
    // 返回值表示属性是否成功定义，返回非布尔值会隐式转换成布尔值

    // 2. 拦截的操作
    // Object.defineProperty(proxy, property, descriptor)
    // Reflect.defineProperty(proxy, property, descriptor)

    // 3. 捕获器处理程序参数
    /**
     * @param {T extends Object} target 目标对象
     * @param {string|Symbol} property 引用的目标对象上的字符串键属性或 Symbol 键
     * @param {PropertyDescriptor} descriptor 见 ts 定义
     */
    // interface PropertyDescriptor {
    //   configurable?: boolean;
    //   enumerable?: boolean;
    //   value?: any;
    //   writable?: boolean;
    //   get?(): any;
    //   set?(v: any): void;
    // }

    // 4. 捕获器不变式
    // * 如果目标对象不可扩展，则无法定义属性  target.property 存在且不可配置，则该方法必须返回 true
    // * 如果目标对象有一个可配置的属性，则不能添加同名的不可配置属性
    // * 如果目标对象有一个不可配置的属性，则不能添加同名的可配置属性

    // 9.2.5 getOwnPropertyDescriptor()
    // TODO

    // 9.2.6 deleteProperty()
    // deleteProperty 捕获器会在 Object.deleteProperty() 中被调用，对应的反射 API 方法为 Reflect.deleteProperty()
    const myProxyByDeleteProperty = this.createProxyByDeleteProperty()
    console.log(delete myProxyByDeleteProperty.name) // deleteProperty() true
    myProxyByDeleteProperty.name = "Curry"
    console.log(delete myProxyByDeleteProperty.name) // deleteProperty() true
    console.log(myProxyByDeleteProperty.name) // undefined

    // 1. 返回值是布尔值，是必须的
    // 返回值表示属性是否删除成功，返回非布尔值会隐式转换成布尔值

    // 2. 拦截的操作
    // delete proxy.property
    // delete proxy[property]
    // Reflect.deleteProperty(proxy, property)

    // 3. 捕获器处理程序参数
    /**
     * @param {T extends Object} target 目标对象
     * @param {string|Symbol} property 引用的目标对象上的字符串键属性或 Symbol 键
     */

    // 4. 捕获器不变式
    // * 如果目标对象有一个存在不可配置的属性，则该属性不能被处理程序删除

    // 9.2.7 ownKeys()
    // ownKeys 捕获器会在 Object.keys() 中被调用，对应的反射 API 方法为 Reflect.ownKeys()
    const myProxyByOwnKeys = this.createProxyByOwnKeys()
    Object.keys(myProxyByOwnKeys) // ownKeys()

    // 1. 返回值是包含字符串或者 Symbol 的可枚举对象

    // 2. 拦截的操作
    // Object.getOwnPropertyNames(proxy)
    // Object.getOwnPropertySymbols(proxy)
    // Object.keys(proxy)
    // Reflect.ownKeys(proxy)

    // 3. 捕获器处理程序参数
    /**
     * @param {T extends Object} target 目标对象
     */

    // 4. 捕获器不变式
    // * 返回的可枚举对象必须包含 target 的所有不可配置的自有属性
    // * 如果 target 不可扩展，则返回可枚举对象必须准确包含自有属性键

    // TODO 9.2.8 getPrototypeOf()
    // TODO 9.2.9 setPrototypeOf()
    // TODO 9.2.10 isExtensible()
    // TODO 9.2.11 preventExtensions()
    // TODO 9.2.12 apply()
    // TODO 9.2.13 constructor()

    // TODO 9.3 代理模式
    // 9.3.1 跟踪属性访问
    const userByTracking = {
      name: "Jake",
    }
    const proxyByTracking = new Proxy(userByTracking, {
      set(target, property, value, receiver) {
        console.log(`Setting ${property}=${value}`)

        return Reflect.set(...arguments)
      },
      get(target, property, receiver) {
        console.log(`Getting ${property}`)

        return Reflect.get(...arguments)
      },
    })

    proxyByTracking.name // Getting name
    proxyByTracking.age = 31 // Setting age=31

    // 9.3.2 隐藏属性

    // 9.3.3 属性验证
    // 因为所有赋值操作都会触发 set 捕获器， 所以可以根据值的类型来决定是否可以正常赋值
    // 下面是限制值类型为数字的示例
    const onlyNumberTarget = {
      onlyNumberGoHere: 0,
    }
    const onlyNumberProxy = new Proxy(onlyNumberTarget, {
      set(target, property, value, receiver) {
        if (typeof value !== "number") {
          return false
        }
        return Reflect.set(...arguments)
      },
    })
    onlyNumberProxy.onlyNumberGoHere = 2
    console.log(onlyNumberProxy) // { onlyNumberGoHere: 2 }
    onlyNumberProxy.onlyNumberGoHere = "hello"
    console.log(onlyNumberProxy) // { onlyNumberGoHere: 2 }

    // 9.3.4 构造函数与函数参数验证
    // 和保护以及验证对象属性类似，可以对函数和构造函数参数进行审查，让函数只接收某种类型的值

    // 9.3.5 数据绑定与可观察对象
    // 数据绑定
    const userList = []

    class User {
      constructor(name) {
        this._name = name
      }
    }

    const ProxyUser = new Proxy(User, {
      construct() {
        const newUser = Reflect.construct(...arguments)
        userList.push(newUser)
        return newUser
      },
    })

    new ProxyUser("Bob")
    new ProxyUser("Billy")
    new ProxyUser("John")
    console.log(userList)
    // [
    //   User { _name: 'Bob' },
    //   User { _name: 'Billy' },
    //   User { _name: 'John' }
    // ]

    // 也可以把集合绑定到事件分派程序，每次插入新的实例都会发送消息
    const otherUserList = []

    function emit(newValue) {
      console.log("newValue", newValue)
    }

    const proxyUserList = new Proxy(otherUserList, {
      set(target, property, value, receiver) {
        const result = Reflect.set(...arguments)
        if (result) {
          emit(Reflect.get(target, property, receiver))
        }
        return result
      },
    })
    proxyUserList.push("Smith") // Smith
    proxyUserList.push("John") // John
    console.log(otherUserList)
    // [ 'Smith', 'John' ]

    // 9.4 小结
    // 代理的应用场景是不可限量的，开发者可以用它创建各种编码模式，包括但远不限于跟踪属性访问、隐藏属性、阻止修改或删除属性、函数参数验证、构造函数参数验证、数据绑定，以及可观察对象

    // TODO DELETE

    // 8.1.5 对象标识及相等判定
    // Object.is 用于解决 js 中一些不太符合预期的判断场景
    // 这些判断在*某些 JS 引擎*里会表现不同，但实际应当是相等的
    console.info(isNaN === isNaN) // true
    console.info(+0 === -0) // true
    console.info(0 === -0) // true

    // 使用 is 方法来正确判断
    Object.is(isNaN, isNaN) // true
    Object.is(0, -0) // false
    Object.is(+0, -0) // false
    Object.is(+0, 0) // true

    // 使用递归的方式来判断多个参数
    this.recursivelyCheckEqual(0, +0, -0)
    // 直接在原型上增强
    Object.prototype.multiIs = this.recursivelyCheckEqual

    // 8.1.6 增强的对象语法
    // 1. 简写属性名
    // 很常见的用法了
    const name = "A"
    const personA = {
      name,
    }

    // 2. 可计算属性
    // 从前定义动态变量的方式
    let personB = {}
    const nameKey = "name"
    const ageKey = "age"
    const jobKey = "job"
    personB[nameKey] = "Matt"
    personB[ageKey] = 32
    personB[jobKey] = "engineer"

    // 现在可以直接使用对象字面量的方式，但是前提是一定要先定义好变量名
    const personC = {
      [nameKey]: "Matt",
      [ageKey]: 33,
      [jobKey]: "engineer",
    }
    // 与上面是等价的

    // 3. 简写方法名
    const personD = {
      [nameKey]: "Mike",
      [ageKey]: 33,
      [jobKey]: "engineer",
      sayName() {
        return this[nameKey]
      },
    }
    console.info(personD.sayName()) // Mike

    // 简写方法名和可计算属性可以一起用
    const methodKey = "sayName"
    const personE = {
      [nameKey]: "Jordan",
      [ageKey]: 33,
      [jobKey]: "engineer",
      [methodKey]() {
        return this[nameKey]
      },
    }
    console.info(personE.sayName()) // Jordan

    // 8.1.8 对象解构
    // 在对象解构的上下文中，原始值会被当成对象（也就是隐式包装了一层）
    // 但 null 和 undefined 无法包装，也就无法解构
    // 本质上执行的是注释的内容
    let { length, constructor } = "job" // new String('job')
    let { constructor: c } = 6 // new Number(6)
    console.info(length, constructor === String, "job") // 3 true
    console.info(c === Number, 6) // true

    // 如果事先已经声明了，那么必须把解构放在括号中
    let name = "bob"
    let age = 13
    ;({ name, age } = personE) // Jordan, 33

    // 1. 嵌套解构
    const personF = {
      name: "Bob",
      age: 34,
      job: {
        title: "software",
      },
    }
    let personCopy = {}
    ;({
      name: personCopy.name,
      age: personCopy.age,
      job: personCopy.job,
    } = personF)
    console.info(personCopy)
    // 得到一模一样的结果
    // {
    //   "name": "Bob",
    //   "age": 34,
    //   "job": {
    //       "title": "software"
    //   }
    // }

    // 2. 部分解构
    // 执行过程中，如果遇到异常，则中断执行，在这之前执行的仍然有效
    let personG = {
      name: "Cuke",
      age: 44,
    }
    let personName, personBar, personAge
    try {
      ;({
        name: personName,
        foo: { bar: personBar },
        age: personAge,
      } = personG)
    } catch (error) {}
    console.info(personName, personBar, personAge) // Cuke undefined undefined

    // 3. 参数上下文匹配
    // 在函数入参中也可以进行解构
    this.printPerson("1st", personG) // 1st cuke 44
    this.printPerson1("2nd", personG) // 2nd cuke 44

    // 8.2 创建对象
    // 8.2.1 概述
    // 8.2.2 工厂模式
    const person1ByFactory = this.createPerson("Jordan", 49)
    const person2ByFactory = this.createPerson("Curry", 33)
    console.info(person1ByFactory.sayName()) // Jordan
    console.info(person2ByFactory.sayName()) // Curry
    // 但工厂模式无法判断实例

    // 8.2.3 构造函数模式
    function Person(name, age) {
      this.name = name
      this.age = age
      this.sayName = function () {
        return this.name
      }
    }
    const person1ByConstructor = new Person("Iverson", 46)
    const person2ByConstructor = new Person("Kobe", 42)
    console.info(person1ByConstructor.sayName()) // Iverson
    console.info(person2ByConstructor.sayName()) // Kobe
    // 在使用 new 实例化的过程中，分别做了以下事情
    // 1. 在内存中创建了一个对象
    // 2. 将新对象的[[prototype]](也就是__proto__属性)，指向当前构造函数的 proptype 原型
    // 3. 构造函数内部的 this 指向新对象
    // 4. 执行构造函数内的代码（将属性赋值到对象上）
    // 5. 如果构造函数返回非空对象，则返回对象，否则返回这个新创建的对象

    // 自己模拟 new 的方式
    /**
     * 这个方法能模拟 new 的效果，但不包括原型链的内容
     * 参考自： https://developer.mozilla.org/zh-CN/docs/orphaned/Web/JavaScript/A_re-introduction_to_JavaScript
     * @param {*} constructor
     * @param  {...any} args
     * @returns
     */
    function trivialNew(constructor, ...args) {
      let o = {}
      constructor.apply(o, args)
      return o
    }
    const person1ByNew = trivialNew(Person, "William", 28)
    console.info(person1ByNew)

    // 下面这里是返回一个自定义对象的方式
    function PersonB(name, age) {
      this.name = name
      this.age = age
      this.sayName = function () {
        return this.name
      }
      return {
        name,
      }
    }
    const personBByConstructor = new PersonB("小明", 22)
    console.info(personBByConstructor) // { name: '小明' }

    // 上面的两个例子，第一个(Person)是可以判断出实例的
    console.info(person1ByConstructor.constructor === Person) // true
    console.info(person1ByConstructor instanceof Person) // true
    console.info(person1ByConstructor instanceof Object) // true
    // 第二个(PersonB)则不行，不过因为继承的关系，它仍然是 Object 的实例
    console.info(personBByConstructor.constructor === PersonB) // false
    console.info(personBByConstructor instanceof PersonB) // false
    console.info(personBByConstructor instanceof Object) // true

    // * 在实例化时，如果没有参数，后面的括号可以不写，是没有影响的
    // 不过个人觉得还是统一一下
    // 这里用函数表达式的方式来创建构造函数
    const PersonC = function () {
      this.name = "Jake"
      this.sayName = function () {
        return this.name
      }
    }
    const personCByConstructor = new PersonC()
    console.info(personCByConstructor.sayName()) // Jake

    // 1. 构造函数也是函数
    // 完全可以把构造函数作为普通函数来调用
    // * 任何函数用 new 操作符来调用就是构造函数，不使用则是普通函数
    const personByFn = Person("小刚", 43)
    // 作为普通函数调用，则没有返回值
    console.info(personByFn) // undeifned
    // 这里的 this 默认指向 window,因此属性和方法都加在了 window 之上
    console.info(window.sayName()) // 小刚

    // 如果我们指定了对象，也是可以的
    const normalObj = new Object()
    const personByFn2 = Person.call(normalObj, "小红", 92)
    console.info(personByFn2) // undefined
    console.info(normalObj) // { name: '小红', age: 92 }

    // 2. 构造函数的问题
    // * 每个通过构造函数创建的实例，尽管有着相同的方法名和执行内容，但是却不是相等的
    console.info(person1ByConstructor.sayName === person2ByConstructor.sayName) // false
    // 翻译一下，其实构造函数内部执行的是这样的
    const PersonParsed = function (name, age) {
      this.name = name
      this.age = age
      this.sayName = new Function("return this.name")
    }
    // 相当于每一次都会重新定义一次函数
    // 有解决办法，就是通过外部定义好函数的方式
    const sayName = function () {
      return this.name
    }
    const BetterPerson = function (name, age) {
      this.name = name
      this.age = age
      this.sayName = sayName
    }
    const betterPerson1 = new BetterPerson("bike", "32")
    const betterPerson2 = new BetterPerson("miller", "32")
    console.info(betterPerson1.sayName === betterPerson2.sayName) // true
    console.info(betterPerson1.sayName()) // bike
    console.info(betterPerson2.sayName()) // miller

    // 这个解决方法虽然可以解决，但是也会污染全局作用域
    // 多次使用再多次定义，最终会使得全局里的变量难以维护

    // 这个问题可以通过原型模式来解决
    // 8.2.4 原型模式
    function PersonByPrototype() {}
    PersonByPrototype.prototype.name = "Nico"
    PersonByPrototype.prototype.age = 32
    PersonByPrototype.prototype.sayName = function () {
      return this.name
    }

    const personByPrototype1 = new PersonByPrototype()
    personByPrototype1.sayName() // Nico

    // 1. 理解原型
    // * 实例与构造函数的原型有直接的联系，但实例与构造函数本身没有联系
    console.info(typeof PersonByPrototype.prototype) // object
    console.info(PersonByPrototype.prototype) // { constructor: PersonByPrototype, name: 'Nico', age: 32 }
    // 构造函数原型上的 constructor 指向它本身
    console.info(PersonByPrototype.prototype.constructor === PersonByPrototype) // true
    // 实例的 __proto__ 属性指向构造函数的原型对象
    console.info(personByPrototype1.__proto__ === PersonByPrototype.prototype) // true
    // 构造函数的 __proto__ 属性指向对象的原型对象
    console.info(PersonByPrototype.prototype.__proto__ === Object.prototype) // true
    console.info(PersonByPrototype.prototype.__proto__.constructor === Object) // true
    console.info(PersonByPrototype.__proto__.__proto__.constructor === Object) // true 这里恰巧也是
    // 在原型链的顶端，是 null
    console.info(PersonByPrototype.prototype.__proto__.__proto__ === null) // true

    const personByPrototype2 = new PersonByPrototype()
    // 它们指向同一个原型对象，所以这里是相等的
    console.info(personByPrototype1.__proto__ === personByPrototype2.__proto__) // true
    console.info(
      personByPrototype1.__proto__.constructor ===
        personByPrototype2.__proto__.constructor
    ) // true

    // 可以用特定的方法来判断是否是实例的原型 isPrototypeOf
    console.info(PersonByPrototype.prototype.isPrototypeOf(personByPrototype2)) // true
    console.info(PersonByPrototype.isPrototypeOf(personByPrototype2)) // false
    // 特定的方法来获取原型 getPrototypeOf
    console.info(
      Object.getPrototypeOf(personByPrototype2) === PersonByPrototype.prototype
    ) // true

    // 使用这个方法可以重写实例的 __proto__ setPrototypeOf
    const biped = {
      numLegs: 2,
    }
    const personX = {
      name: "Matt",
    }
    // 把 biped 设为 personX 的原型对象
    Object.setPrototypeOf(personX, biped)
    console.info(personX.__proto__ === biped) // true
    console.info(personX.__proto__.constructor) // Object 构造函数
    // 可通过给原型对象添加属性的方式，来给所有实例添加属性
    biped.age = 32
    console.info(personX.age) //32

    // 但使用 Object.setPrototypeOf 修改原型对象，可能会有性能损耗的代价
    // 可以使用 Object.create 来替代
    let biped2 = {
      numLegs: 4,
    }
    let personX2 = Object.create(biped2)
    console.info(personX2.__proto__ === biped2) // true
    console.info(personX2.numLegs) // 4

    // 2. 原型层级
    // 通过对象访问属性时，会从实例对象上开始查找，再往上查找到原型对象
    // 再继续查找到更上层的原型对象，直至找到或者遍历所有的原型对象

    // 但是不可以通过实例对象来修改原型对象上的属性值
    function PersonH() {}
    PersonH.prototype.name = "Mike"
    PersonH.prototype.age = "87"
    PersonH.prototype.sayName = function () {
      return this.name
    }

    let personH1 = new PersonH()
    let personH2 = new PersonH()

    personH1.name = "Loti"

    console.info(personH1.sayName()) // Loti 优先返回实例上的属性
    console.info(personH2.sayName()) // Mike

    // 只要在实例上添加过一次同名属性，这个属性就被遮蔽了，再也不能访问到原型对象上的属性，即使手动设置 null 也不行
    personH1.name = null
    console.info(personH1.sayName()) // null

    // 只能通过删除实例属性的方式来恢复对原型对象属性的访问
    delete personH1.name // 删除实例属性
    delete personH2.name // 删除了个寂寞，并没有把原型对象上的实例删除
    console.info(personH1.sayName()) // Mike
    console.info(personH2.sayName()) // Mike

    // hasOwnProperty 可以判断是该属性是在原型对象上还是在实例对象上
    personH1.hasOwnProperty("name") // false
    personH1.name = "Bob"
    personH1.hasOwnProperty("name") // true

    // 3. 原型和 in 操作符
    // * in 可以判断出属性是否存在于当前实例对象或者实例的原型对象上
    console.info("name" in personH1) // true 实例上的检测到了
    console.info("name" in personH2) // true 原型上的检测到了

    // 可以用这个方式来确认属性是否在原型而不是在实例上
    // 这里的输出符合预期
    this.hasPrototypeProperty(personH1, "name") // false
    this.hasPrototypeProperty(personH2, "name") // true

    // 通过 for in 循环，可以获取到实例对象的属性，还会获取到原型对象上的可枚举属性
    // 遮蔽原型中不可枚举属性的实例属性也会在循环中返回
    // 而 Object.keys 则以数组形式返回当前实例的所有属性
    function PersonI() {}
    PersonI.prototype.name = "Bob"
    PersonI.prototype.age = 19
    PersonI.prototype.job = "student"
    PersonI.prototype.sayName = function () {}

    let personI1 = new PersonI()
    personI1.name = "Celina"
    Object.keys(PersonI.prototype) // [name, age, job, sayName]
    Object.keys(personI1) // [name]

    // 可以通过 Object.getOwnPropertyNames 获取所有的实例属性，包括不可枚举的
    Object.getOwnPropertyNames(PersonI.prototype) // [ "constructor", "name", "age", "job", "sayName"]
    Object.getOwnPropertyNames(personH1) // [name]

    // 如果把 Symbol 作为属性键，则需要特定的方法来获取 getOwnPropertySymbols
    // 返回由 Symbol 组成的数组
    let k1 = Symbol("1")
    let k2 = Symbol("2")
    let o = {
      [k1]: "1",
      [k2]: "2",
    }
    Object.getOwnPropertySymbols(o)

    // 4. 属性枚举顺序
    // for in 循环 和 Object.keys 的枚举顺序是不确定的 可能因浏览器而异
    // 在 Object.getOwnPropertyNames 和 Object.getOwnPropertySymbols 和 Object.assign 的遍历中，
    // 是升序枚举数值键，然后以插入顺序枚举字符串和符号键
    // 在对象字面量中定义的键以它们逗号分隔的顺序插入

    // 8.2.5 对象迭代
    // Object.values 和 Object.entries
    const o1 = {
      foo: "bar",
      baz: 1,
      qux: {},
    }
    for (const iterator of Object.values(o1)) {
      console.info(iterator)
    }
    for (const [k, v] of Object.entries(o1)) {
      console.info(k, v)
    }
    console.info(Object.values(o1)) // ["bar", 1, {}]
    console.info(Object.entries(o1)) // 二维数组
    // 同时这里返回的数组的内容，是浅复制，有着实际的引用的
    Object.values(o1)[0] === o1.foo // true
    Object.values(o1)[2] === o1.qux // true

    // * 符号作为属性 会被这两个方法忽略
    const sym = Symbol()
    const o2 = {
      [sym]: "symbol",
    }
    Object.value(o2) // []

    // 1. 其他原型语法
    // 可以使用字面量的方式来一次性设置好原型属性
    function PersonNew() {}
    PersonNew.prototype = {
      name: "Alia",
      age: 23,
      sayName: function () {
        return this.name
      },
    }
    // 但是这里会覆盖 constructor
    const personNew = new PersonNew()
    console.info(personNew instanceof PersonNew) // true
    console.info(personNew instanceof Object) // true

    // 默认会指向 Object
    console.info(personNew.constructor === PersonNew) // false
    console.info(personNew.constructor === Object) // true
    console.info(PersonNew.prototype.constructor === PersonNew) // false

    // 需要显式的设置
    function PersonNew1(params) {}
    // 这样就可以了
    PersonNew1.prototype = {
      // 此时显式创建的属性 constructor 默认是可枚举的
      constructor: PersonNew1,
      name: "Alia",
      age: 23,
      sayName: function () {
        return this.name
      },
    }

    // 如果要完全复制原有的思路
    // 还是需要使用专门的方法来定义
    Object.defineProperty(PersonNew1.prototype, "constructor", {
      value: PersonNew1,
      enumerable: false,
    })

    // 2. 原型的动态性
    // 原型的动态性体现在，修改原型对象的属性，会在所有实例上体现出来，也就是会影响所有的实例
    function PersonDynamic() {}
    PersonDynamic.prototype.name = "Jordan"
    PersonDynamic.prototype.age = 31
    PersonDynamic.prototype.sayName = function () {
      return this.name
    }

    const personDynamic = new PersonDynamic()
    console.info(personDynamic.sayName()) // Jordan

    // 此时我们修改原型对象上的属性
    PersonDynamic.prototype.name = "Paul"
    // 实例上调用方法可以发现也是修改了的
    console.info(personDynamic.sayName()) // Paul

    // 但是如果我们重写整个原型对象，则不会影响到实例
    // 实例仍然指向原来的原型对象引用
    PersonDynamic.prototype = {
      constructor: PersonDynamic,
      name: "Bob",
      age: 14,
      sayName() {
        return this.name
      },
    }
    // 这时的实例是不受影响的
    console.info(personDynamic.sayName()) // Paul

    // 换言之，如果先创建实例，再修改原型对象，则实例也不会获取到修改原型对象后的属性和方法
    function PersonDynamic2() {}
    const personDynamic2 = new PersonDynamic2()
    PersonDynamic2.prototype = {
      constructor: PersonDynamic2,
      name: "Cook",
      sayName: function () {
        return this.name
      },
    }
    personDynamic2.sayName() // 抛出异常 Uncaught TypeError: personDynamic2.sayName is not a function

    // 3. 原生对象模型
    // 通过原生对象的原型可以取得所有默认方法的引用 也可以给原生类型的实例定义新的方法
    // 实例的方法其实都是在原型上定义的
    console.info(typeof Array.prototype.sort) // function
    console.info(typeof Array.prototype.every) // function

    // 直接修改原型属性，可以给所有实例添加新的方法
    String.prototype.startsWith = function (text) {
      return this.indexOf(text) === 0
    }
    const msg = "hello, world"
    msg.startsWith("hello") // true

    // 但是通常不推荐在生产环境中修改原生对象的原型
    // 这样做可能会导致意想不到的后果，不同浏览器实现不一样
    // 也可能会引发命名冲突，或者意外覆盖了原生方法

    // 4. 原型的问题
    // 原型的属性是在所有实例间共享的
    // 原型的动态性会导致某个实例如果修改了原型对象的属性，则会影响到所有的实例
    // 例如包含引用值的属性 这里下面主要是指 friends 属性
    function PersonWithFriends() {}
    PersonWithFriends.prototype = {
      constructor: PersonWithFriends,
      name: "小刚 ",
      age: "12",
      friends: ["小明", "小红"],
    }

    const personWithFriends1 = new PersonWithFriends()
    const personWithFriends2 = new PersonWithFriends()
    // 如果某个实例修改了属性
    personWithFriends1.friends.push("小七")
    // 会间接影响到其他实例
    console.info(personWithFriends2.friends) // ["小明", "小红", "小七"]
    console.info(personWithFriends2.friends === personWithFriends1.friends) // true

    // 8.3 继承
    // 8.3.1 原型链
    function SuperType() {
      this.property = true
    }
    SuperType.prototype.getSuperProperty = function () {
      return this.property
    }

    function SubType() {
      this.subValue = false
    }
    // 重点是这里重写了原型，将其设置为 SuperType 的实例
    SubType.prototype = new SuperType()
    SubType.prototype.getSubValue = function () {
      return this.subValue
    }

    const instance = new SubType()
    instance.getSuperProperty() // true
    instance.getSubValue() // false

    // 1. 默认原型
    // 实际上，上述案例有原型链的顶端，那就是 Object
    // 下面返回的都是 true
    console.info(instance instanceof Object)
    console.info(SuperType instanceof Object)
    console.info(SubType instanceof Object)

    // 2. 原型与继承关系
    // instanceOf 是一个确认原型与实例的关系的方式
    // 还有一个方式是使用 isPrototypeOf
    console.info(Object.prototype.isPrototypeOf(instance)) // true
    console.info(SubType.prototype.isPrototypeOf(instance)) // true
    console.info(SuperType.prototype.isPrototypeOf(instance)) // true
    // 注意，上述的调用方都是原型对象

    // 3. 关于方法
    // 子类上需要覆盖父类的方法的话，需要在子类的原型赋值之后再添加到子类的原型上
    function SuperType2() {
      this.property = true
    }
    SuperType2.prototype.getSuperProperty = function () {
      return this.property
    }

    function SubType2() {
      this.subProperty = false
    }
    SubType2.prototype = new SuperType2()
    // 子类的原型上新增方法
    SubType2.prototype.getSubProperty = function () {
      return this.subProperty
    }
    // 子类的原型上覆盖方法
    SubType2.prototype.getSuperProperty = function () {
      return false
    }
    // 创建子类的实例
    const instance2 = new SubType2()
    // 创建父类的实例
    const instanceBySuperType = new SuperType2()
    console.info(instance2.getSuperProperty()) // false
    // 即使修改了，但是其实不影响父类的方法，也就不会影响父类的其他实例
    console.info(instanceBySuperType.getSuperProperty()) // true

    // 注意不可用对象字面量的方式重写原型对象，因为那相当于是重写了整个原型
    function SuperType3() {
      this.property = false
    }
    SuperType3.prototype.getSuperProperty = function () {
      return this.property
    }
    function SubType3() {
      this.subProperty = false
    }
    SubType3.prototype = new SuperType3()
    // 对象字面量的方式定义原型，实际相当于是重写了一遍
    // 这里的原型实际上是 Object 的实例
    SubType3.prototype = {
      getSubProperty: function () {
        return this.subProperty
      },
      someOtherMethod() {},
    }
    const instanceError = new SubType3()
    // 子类上重新定义后的方法是有的
    console.info(instanceError.getSubProperty()) // false
    // 但是父类的原型对象上的方法就没有了
    console.info(instanceError.getSuperProperty()) // 抛出异常

    // 4. 原型链的问题
    // 类似于上述原型的问题一样，原型链也着污染的问题
    // 如果修改了原型上的引用属性，那么所有的实例都会随之受影响
    function SuperColor() {
      this.colors = ["red", "black"]
    }
    function SubColor() {}
    SubColor.prototype = new SuperColor()

    const instanceColor1 = new SubColor()
    // 这里我们操作的是 instanceColor1 的属性
    instanceColor1.colors.push("yellow")
    const instanceColor2 = new SubColor()
    // 但是后续创建的 instanceColor2 也被影响和污染了
    console.info(instanceColor2.colors) // ['red', 'black', 'yellow']

    // 因为这个问题，原型链很少会单独使用
    // 第二个问题是，子类型在实例化时不能给父类型的构造函数传参

    // 8.3.2 盗用构造函数
    // 也称之为对象伪装或经典继承
    function SuperTypeHacked() {
      this.colors = ["red", "black"]
    }
    // 核心在于在子类的构造函数内执行父类的构造函数内容，使用 call 或 apply 来以新创建的对象作为上下文来执行
    // 这样保证了每次创建的对象都是不同的
    function SubTypeHacked() {
      SuperTypeHacked.call(this)
    }
    const instanceByHacked = new SubTypeHacked()
    instanceByHacked.colors.push("yellow")
    console.info(instanceByHacked.colors) // ['red', 'black', 'yellow']
    // 再创建一个实例
    const instanceByHacked2 = new SubTypeHacked()
    // 这个实例就不受影响了
    console.info(instanceByHacked2.colors) // ['red', 'black']

    // 1. 传递参数
    // 这个方式还可以在创建实例的时候传递参数
    function PersonHacked(name) {
      this.name = name
    }
    function SubPersonHacked(params) {
      // 继承并传入参数
      PersonHacked.call(this, params)
      this.age = 29
    }
    const personHackedA = new SubPersonHacked("nameA")
    const personHackedB = new SubPersonHacked("nameB")
    console.info(personHackedA.name, personHackedA.age) // nameA 29
    console.info(personHackedB.name, personHackedB.age) // nameB 29

    // 2. 盗用构造函数的问题
    // 必须在构造函数中定义方法，因此函数不能复用

    // 8.3.3 组合继承
    // 结合了原型链和盗用构造函数的方式
    function SuperTypeCombinated(name) {
      this.name = name
      this.colors = ["red", "black"]
    }
    SuperTypeCombinated.prototype.sayName = function () {
      return this.name
    }
    function SubTypeCombinated(name, age) {
      SuperTypeCombinated.call(this, name)
      this.age = age
    }
    SubTypeCombinated.prototype = new SuperTypeCombinated()

    // 使用这样的方式使得两者是独立的
    const instanceByCombinated = new SubTypeCombinated("Clack", 230)
    const instanceByCombinated2 = new SubTypeCombinated("Robin", 29)
    // 可以修改各自的属性互不影响
    instanceByCombinated.sayName() // Clack
    instanceByCombinated2.sayName() // Robin
    // 也可以直接修改引用值
    instanceByCombinated.colors.push("yellow")
    console.info(instanceByCombinated2.colors) // ['red', 'black']
    console.info(instanceByCombinated2.age) // 29

    // 组合继承弥补了原型链和盗用构造函数各自的不足，是使用最多的继承模式

    // 8.3.4 原型式继承
    function object(o) {
      function F() {}
      F.prototype = o
      return new F()
    }

    // * ES5 里的 Object.create 和这个方法基本是一样的
    // 但它还支持第二个参数作为额外的属性
    // 第二个参数和 Object.defineProperties 的第二个参数是一样的
    let personPrototype = {
      name: "Nico",
      friends: ["Mike"],
    }
    const anotherPersonPrototype = Object.create(personPrototype, {
      name: {
        value: "Cook",
      },
    })
    console.info(personPrototype.name) // Nico
    console.info(anotherPersonPrototype.name) // Cook
    console.info(
      personPrototype.__proto__.isPrototypeOf(anotherPersonPrototype)
    ) // true 其实指向的是对象
    console.info(personPrototype.isPrototypeOf(anotherPersonPrototype)) // true

    // 但是这种方式和原型链的方式有着同样的问题 引用属性是浅复制的 会随之一起修改
    personPrototype.friends.push("Gergo")
    console.info(anotherPersonPrototype.friends) // ['Mike', 'Gergo']

    // 8.3.5 寄生式继承
    function createAnother(original) {
      // 通过调用函数创建一个新对象
      let clone = Object.create(original)
      // 以某种方式增强这个对象
      clone.sayHi = function () {
        console.info("sayHi")
      }
      // 返回这个对象
      return clone
    }

    const anotherPersonPrototype2 = createAnother(personPrototype)
    anotherPersonPrototype2.sayHi() // sayHi

    // 通过寄生式继承给对象添加函数会导致函数难以重用，与构造函数模式类似
    // 适合主要关注对象，而不在乎类型和构造函数的场景

    // 8.3.5 寄生式组合继承
    // 前面提到的组合继承，有一个问题比较明显，就是 父类 SuperType 始终会调用两次，有些冗余
    // 下面是寄生式组合继承的方式
    function inheritProtoType(subType, superType) {
      // 根据父类创建一个原型对象的副本
      let prototype = Object.create(superType.prototype)
      // 将原型上的构造函数指向子类
      prototype.constructor = subType
      // 重写子类的构造函数
      subType.prototype = prototype
    }

    function SuperTypeInherited(name) {
      this.name = name
      this.colors = ["red", "black"]
    }

    function SubTypeInherited(name, age) {
      SuperTypeInherited.call(this, name)
      this.age = age
    }

    inheritProtoType(SubTypeInherited, SuperTypeInherited)

    SubTypeInherited.prototype.sayHi = function () {
      console.info("hi")
    }

    const personInherited = new SubTypeInherited("Harden", 31)
    console.info(personInherited.name) // harden
    console.info(personInherited.sayHi()) // hi
    personInherited.colors.push("pink")

    const personInherited2 = new SubTypeInherited("Ivring", 29)
    console.info(personInherited2.name) // Ivring
    // 这里的引用值不受影响
    console.info(personInherited2.colors) // ['red', 'black']
    console.info(personInherited2.sayHi()) // hi

    // 而原型链也得以保存下来
    console.info(SubTypeInherited.prototype.isPrototypeOf(personInherited)) // true
    console.info(SubTypeInherited.prototype.isPrototypeOf(personInherited2)) // true
    console.info(SuperTypeInherited.prototype.isPrototypeOf(personInherited)) // true

    // 这里只调用了一次构造函数，同时避免了 SubType.prototype 上不必要的属性
    // 这个方式可以说是引用类型继承的最佳模式

    // 8.4 类
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes
    // ES6 的基于既有原型机制的语法糖
    // 8.4.1 类定义
    // 有声明式定义和表达式定义
    // 类表达式
    const Animal = class {}

    // 类声明则更简洁，但是没有声明提前
    class Animals {}

    // 类定义并没有声明提前，而函数是有的
    console.info(FunctionB) // FunctionB() {}
    function FunctionB() {}
    console.info(ClassB) // 抛出异常
    class ClassB {}

    // 类可以包含构造函数，实例方法，静态函数，获取函数，设置函数，这些都是可选的
    /**
     * 有构造函数的
     */
    class Bar {
      constructor() {}
    }

    /**
     * 带获取函数的
     */
    class Baz {
      get myBaz() {}
    }

    /**
     * 带静态方法的
     */
    class Qux {
      static myQux() {}
    }

    // 类表达式的名称是可选的，但是赋值给变量之后，只能通过 name 属性来取得类表达式的名称字符串
    // 而不能在类表达式作用域外部访问这个标识符
    const PersonClass = class PersonName {}
    console.info(PersonClass.name) // PersonName
    console.info(PersonName) // 抛出异常

    // 8.4.2 类构造函数
    // 1. 实例化(和构造函数是一样的)
    // 使用 new 操作符实例化类的操作等同于使用 new 调用其构造函数
    // 使用 new 操作符调用类的构造函数
    // 首先，在内存中创建一个对象
    // 将这个新对象内部的 __proto__ 指向构造函数的 prototype 属性
    // 构造函数内的 this 指向这个新对象
    // 执行构造函数内的代码
    // 如果构造函数返回非空对象，则返回非空对象，否则返回刚创建的新对象
    // 下面是例子
    class Vegetable {
      constructor(name) {
        this.name = name
        console.info("new")
      }
    }
    // 类实例化时传入的参数就是构造函数的参数
    const vegetable = new Vegetable("banana") // new
    console.info(vegetable.name) // banana

    // 类似于构造函数
    // 如果不需要参数，则构造函数后的括号是可以省略的
    class VegetableWithoutParams {
      constructor() {
        this.color = "green"
      }
    }
    const vegetableWithoutParams = new VegetableWithoutParams()
    console.info(vegetableWithoutParams.color) // green

    // 默认情况下，类构造函数会执行之后返回 this 对象，构造函数返回的对象会被用作实例化的对象
    // 如果 constructor 里返回的别的对象，那么就不会通过 instanceOf 检测
    // 这点也是类似于函数里的构造函数的
    class PersonWithObj {
      constructor(override) {
        this.name = "p"
        if (override) {
          return {
            name: "new P",
          }
        }
      }
    }

    const personWithObj1 = new PersonWithObj()
    const personWithObj2 = new PersonWithObj(true)
    console.info(personWithObj1.name) // p
    console.info(personWithObj2.name) // new P
    console.info(personWithObj1 instanceof PersonWithObj) // true
    console.info(personWithObj2 instanceof PersonWithObj) // false

    // 类构造函数与构造函数主要区别是，调用类构造函数必须使用 new  操作符
    // 而普通构造函数如果不使用 new 调用，会使用全局的 this（一般是 window) 来作为内部对象
    // 调用类如果忘记使用 new, 则会抛出错误
    const personWithObjError = PersonWithObj() // Uncaught TypeError: Class constructor PersonWithObj cannot be invoked without 'new'

    // 类构造函数实例化之后会变成普通的实例方法，但作为类的构造函数，还是需要使用 new 操作符来调用
    class VegetableConstructor {
      constructor(name) {
        this.name = name
      }
    }
    const vegetableConstructor = new VegetableConstructor("apple")
    // 实例化实例的构造函数，其实也就是 VegetableConstructor （注意这里是小写的）
    const subVegetableConstructor = new vegetableConstructor.constructor(
      "orange"
    )
    // 实例化类的构造函数，实例关系就会不一样
    const subVegetableConstructor2 = new VegetableConstructor.constructor(
      "orange"
    )
    console.info(vegetableConstructor.name) // apple
    console.info(subVegetableConstructor.name) // orange
    // 检查是否是实例
    console.info(vegetableConstructor instanceof VegetableConstructor) // true
    console.info(
      vegetableConstructor instanceof VegetableConstructor.constructor
    ) // false
    // 因为原型链的关系，所以下列也是检测成功的
    console.info(subVegetableConstructor instanceof VegetableConstructor) // true
    console.info(
      subVegetableConstructor instanceof vegetableConstructor.constructor
    ) // true
    // 实例化类的构造函数，结果就会不一样
    console.info(subVegetableConstructor2 instanceof VegetableConstructor) // false
    console.info(
      subVegetableConstructor2 instanceof VegetableConstructor.constructor
    ) // true

    // 2. 把类当做特殊的构造函数
    // 类其实就是特殊函数
    console.info(typeof VegetableConstructor) // function

    // 它同样有原型等属性
    console.info(
      vegetableConstructor.__proto__.constructor === VegetableConstructor
    ) // true
    console.info(
      subVegetableConstructor.__proto__.constructor ===
        vegetableConstructor.constructor
    ) // true
    console.info(subVegetableConstructor instanceof VegetableConstructor) // true

    // JS 中，类也是一等公民，可以把他作为参数传递，也可以作为值使用
    // 更详细的例子
    let classList = [
      class {
        constructor(id) {
          this.id = id
          console.info(`instance with ${id}`)
        }
      },
    ]

    function createInstance(classDefinition, id) {
      return new classDefinition(id)
    }

    const fooByClass = createInstance(classList[0], 9527) // instance with 9527
    console.info(fooByClass.id) // 9527

    // 类也可以立即实例化 就像自执行函数一样
    let pByClassImm = new (class Fooo {
      constructor(name) {
        this.name = name
      }
    })("bar")
    console.info(pByClassImm.name) // bar
    console.info(pByClassImm) // Fooo { name: 'bar' }

    // 8.4.3 实例、原型和类成员
    // 1. 实例成员
    class PersonSelf {
      constructor() {
        this.name = new String("Jack")
        this.sayName = () => console.info(this.name)
        this.nickNames = ["Jake", "J-Dog"]
      }
    }
    // 每个实例都对应一个唯一的成员对象，这意味着所有成员都不会在原型上共享
    let personSelf1 = new PersonSelf()
    let personSelf2 = new PersonSelf()
    console.info(personSelf1.name === personSelf2.name) // false
    console.info(personSelf1.sayName === personSelf2.sayName) // false

    personSelf1.name = personSelf1.nickNames[0]
    personSelf2.name = personSelf1.nickNames[1]

    console.info(personSelf1.sayName()) // Jack
    console.info(personSelf1.sayName()) // J-Dog

    // 2. 原型方法与访问器
    class PersonFoo {
      constructor() {
        // 添加到 this 上的方法会存在于不同实例上
        this.locate = () => console.info("instance")
      }
      // 在类块中定义的所有内容都会定义在类的原型上
      // 这里的案例不能用箭头函数，否则指向会错误
      locate() {
        console.info("prototype")
      }
    }
    const personFoo = new PersonFoo()
    console.info(personFoo.locate()) // instance
    console.info(PersonFoo.prototype.locate()) // prototype

    // 类方法等同于对象属性(可计算属性)
    const symbolKey = Symbol("symbolKey")
    class PersonFooKey {
      [symbolKey]() {
        console.info("symbol")
      }
      stringKey() {
        console.info("stringKey")
      }
      ["computed" + "Key"]() {
        console.info("key")
      }
    }
    const personFooKey = new PersonFooKey()
    console.info(personFooKey.stringKey()) // stringKey
    console.info(personFooKey.computedKey()) // key
    console.info(personFooKey[symbolKey]()) // symbol

    // 类定义也支持获取和设置访问器
    class PersonSet {
      // 注意这里属性不能重名
      set name(name) {
        this._name = name
      }
      get name() {
        return this._name
      }
    }
    const personSet = new PersonSet()
    personSet.name = "Jake"
    console.info(personSet.name) // Jake

    // 3. 静态类方法 static
    // 静态类成员在类定义中使用 static 作为关键字前缀
    class PersonStatic {
      constructor() {
        this.locate = () => console.info("instance")
      }
      locate() {
        console.info("prototype")
      }

      static firstLocate() {
        console.info("first")
      }

      // 静态类成员定义在类本身上
      static locate() {
        // 打印出的 this 是当前的类
        console.info("static", this)
        // 在静态方法内部也可以通过 this 直接调用类的静态方法
        this.firstLocate()
      }
    }

    // 这里可以直接调用静态类方法
    PersonStatic.locate() // static PersonStatic...

    // * 有面试题提到静态类方法是否可以访问 this, 个人理解是可以的 this 指向构造类而不是实例，但仍可以访问

    // 调用静态类方法和普通类方法不一样，这里与上面是不一样的
    new PersonStatic().locate() // instance
    // 在构造函数内 重写了 locate 方法

    // 静态类方法比较适合作为实例工厂
    class PersonByBigFactory {
      constructor(age) {
        this._age = age
      }

      sayAge() {
        console.info(this._age)
      }

      // 随机生成有年龄的人
      static create() {
        return new PersonByBigFactory(Math.floor(Math.random() * 100))
      }
    }

    console.info(PersonByBigFactory.create()) // { _age: 28 }

    // Promise.all Promise.race 等方法，都是静态类方法（个人理解）

    // 4. 非函数原型和类成员
    // 类定义不显式支持在原型或雷伤添加成员数据，但是可以在类外部手动添加
    class PersonFine {
      sayName() {
        console.info(`${PersonFine.greet} ${this.name}`)
      }
    }
    const personFine = new PersonFine()
    PersonFine.greet = "My name is"
    PersonFine.prototype.name = "JJ"
    console.info(personFine.sayName()) // My name is JJ

    // 5. 迭代器与生成器方法
    // 生成器函数可以作为类的原型方法或者类方法
    class G {
      // 在原型上定义生成器方法
      *createNicknameIterator() {
        yield "Bob"
        yield "Jordan"
        yield "Curry"
      }

      // 在类上定义生成器方法
      static *createJobIterator() {
        yield "Butcher"
        yield "Baker"
        yield "Candlestick maker"
      }
    }

    const g1 = new G()
    const nickeNameIterator = g1.createNicknameIterator()
    const jobIterator = G.createJobIterator()

    nickeNameIterator.next() // {value: 'Bob', done: false}
    jobIterator.next() // {value: 'Butcher', done: false}

    // 可以给类添加迭代器属性来实现可迭代
    class GeneratorIterator {
      constructor() {
        this.colors = ["black", "red", "yellow"]
      }
      *[Symbol.iterator]() {
        yield* this.colors
        // yield* this.colors.entries(); // 这个写法也可以
      }
    }

    for (const x of new GeneratorIterator()) {
      console.info(x)
    }
    // 依次输出 black red yellow

    /**
     * 也可以直接返回迭代器实例
     */
    class Generator {
      constructor() {
        this.colors = ["black", "red", "yellow"]
      }
      [Symbol.iterator]() {
        return this.colors.entries()
      }
    }

    for (const [idx, color] of new Generator()) {
      console.info(idx, color)
    }
    //  0 black
    //  1 red
    //  2 yellow

    // 8.4.4 继承
    // 1. 继承基础 extends
    // 类是可以直接继承函数的
    function PersonEng() {}
    class Engineer extends PersonEng {}

    let personE1 = new Engineer()
    console.info(personE1 instanceof Engineer) // true
    console.info(personE1 instanceof PersonEng) // true

    // 派生类会通过原型链访问类和原型上定义的方法
    // this 的值会反映调用相应方法的实例或者类
    class Vehicle {
      identifyPrototype(id) {
        console.info(id, this)
      }
      static identifyPrototype(id) {
        console.info(id, this)
      }
    }
    class Bus extends Vehicle {}

    const bus = new Bus()
    const veh = new Vehicle()
    console.info(bus.identifyPrototype("闪电")) // 闪电 Bus
    console.info(veh.identifyPrototype("闪电")) // 闪电 Vehicle

    // 虽然静态类方法是定义在 Vehicle 上， 但这里调用类方法，返回的是 Bus， 这里体现出了继承
    console.info(Bus.identifyPrototype("123")) // 123 Bus extends Vehicle
    console.info(Vehicle.identifyPrototype("veh")) // veh Vehicle

    // 2. 构造函数、HomeObject 和 super()
    // * 派生类的方法可以通过 super 关键词引用他们的原型
    // * 而且这个 super 关键字只能在派生类中使用
    // * 且仅限于静态方法，实例方法和类构造函数内部
    // * 在类构造函数中使用 super 可以调用父类构造函数

    class VehicleSuper {
      constructor() {
        this.hasEngine = true
      }
    }

    class BusSuper extends VehicleSuper {
      constructor() {
        super() // 相当于 super.constructor()
        console.info(this instanceof VehicleSuper) // true
        console.info(this) // { hasEngine: true }
      }
    }
    new BusSuper() // BusSuper { hasEngine: true }

    // 在静态方法中可以通过 super 调用继承的类上定义的静态方法
    class VehicleSuperFn {
      static idenity() {
        console.info("VehicleSuperFn")
      }
    }

    class BusVehicleSuperFn extends VehicleSuperFn {
      static idenity() {
        super.idenity()
      }
    }

    BusVehicleSuperFn.idenity() // VehicleSuperFn

    // * super 只能在派生类上使用
    class Veh {
      constructor() {
        super() // 抛出异常 Uncaught SyntaxError: 'super' keyword unexpected here
      }
    }

    // * 不能单独引用 super 关键字，必须要调用它
    class Veh1 {}
    class Veh2 extends Veh1 {
      constructor() {
        // "super" 的后面必须是参数列表或成员访问。 这里编辑器就会报错了
        // console.info(super); // Uncaught SyntaxError: 'super' keyword unexpected here
      }
    }

    // * 调用 super() 会调用父类构造函数，并将返回的实例赋值给 this
    class Veh3 {}
    class Veh4 extends Veh3 {
      constructor() {
        super()
        console.info(this instanceof Veh3)
      }
    }
    new Veh4() // true

    // * super() 的行为如同调用构造函数，如果需要给构造函数传参，则需要手动传入
    class Veh5 {
      constructor(license) {
        this.license = license
      }
    }

    class Veh6 extends Veh5 {
      constructor(license) {
        super(license)
      }
    }
    console.info(new Veh6("349gf")) // { "license": "349gf" }

    // * 如果没有定义类构造函数，则实例化派生类时会调用 super()， 而且会传入所有传给派生类的参数
    class Veh7 {
      constructor(license) {
        this.license = license
        console.info(arguments)
      }
    }

    class Veh8 extends Veh7 {}
    console.info(new Veh8("gh1297", 321)) // gh1297 321
    // Veh8 { license: 'gh1297' }

    // * 在类构造函数中，不能在调用 super 前使用 this
    class Veh9 extends Veh8 {
      constructor() {
        console.info(this) // 抛出异常
      }
    }

    new Veh9() // Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor

    // * 如果在派生类中显示定义了构造函数，要么必须调用 super(), 要么必须在其中返回一个对象
    // React 的组件并不会这样，猜测是内部进行了处理
    // TODO 研究 React 源码的时候可以一看
    // 下面是案例

    class Veh10 {}
    class Veh11 extends Veh10 {}
    /**
     * 这个类实例化的时候会报错
     */
    class Veh12 extends Veh10 {
      constructor() {}
    }

    class Veh13 extends Veh10 {
      constructor() {
        super()
      }
    }

    class Veh14 extends Veh10 {
      constructor() {
        return {}
      }
    }
    new Veh11() // Veh11 {}
    new Veh13() // Veh13 {}
    new Veh14() // {}
    // 和 super 前使用 this 是同样的报错
    new Veh12() // Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor

    // 3. 抽象基类
    // 场景： 定义一个类可以供其他类继承，但它本身不会被实例化
    // 目前没有专门支持这种类的语法，但是在构造函数中使用 new.target 可以检测来模拟实现
    /**
     * 定义一个基类
     */
    class VehicleBasic {
      constructor() {
        console.info(new.target)
        if (new.target === VehicleBasic) {
          throw new Error("Vehicle cannot be directly instantiated")
        }
      }
    }

    /**
     * 定义一个派生类
     */
    class BusBasic extends VehicleBasic {}
    new BusBasic() // 正常执行
    new VehicleBasic() // 抛出异常

    // 而且可以在抽象基类的构造函数中进行检查，要求派生类里必须定义某个方法
    // 例如这里必须定义 foo
    class VehicleBasicFoo {
      constructor() {
        if (new.target === VehicleBasic) {
          throw new Error("Vehicle cannot be directly instantiated")
        }
        if (!this.foo) {
          throw new Error("Inheriting class must define foo()")
        }
        console.info("success")
      }
    }

    class BusBasicFoo extends VehicleBasicFoo {
      foo() {
        console.info("foo")
      }
    }

    class Van extends VehicleBasicFoo {}

    const busBasicFoo = new BusBasicFoo() // success
    console.info(busBasicFoo.foo()) // foo
    console.info(new Van()) // 抛出异常

    // 上述的案例在实际中，可以类比到 React 原生组件中，必须传入 componentDidMount 等生命周期函数

    // 4. 继承内置类型
    // 类似于在原型上新增属性，但不像原型一样会动态影响所有实例
    // 下面是实现一个增强型的数组，提供了洗牌算法
    /**
     * 支持洗牌的数组
     */
    class SuperArray extends Array {
      /**
       * 洗牌算法
       * @returns
       */
      shuffle() {
        console.info("print original array", this)
        for (let index = 0; index < this.length; index++) {
          const i = Math.floor(Math.random() * (index + 1))
          const temp = this[i]
          this[i] = this[index]
          this[index] = temp
        }
        console.info("print shuffled array", this)
        return this
      }

      /**
       * 利用数组解构来实现更直观的换序
       * @returns
       */
      betterShuffle() {
        for (let i = 0; i < this.length; i++) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[this[j], this[i]] = [this[i], this[j]]
        }
      }
    }
    // 快速创建数组
    const tobeShuffedArray = Array.from({ length: 10 }, (_, i) => i + 1)
    const superArray1 = new SuperArray(...tobeShuffedArray)
    const superArray2 = new SuperArray(...tobeShuffedArray)
    console.info(superArray1 instanceof SuperArray) // true
    console.info(superArray1 instanceof Array) // true
    console.info(superArray1.shuffle())
    superArray2.betterShuffle()
    console.info(superArray2)

    // 有些内置类型的方法会返回新实例，默认情况下，返回实例的类型和原始实例是一致的
    // 其实这里就是数组的链式调用
    class SuperArrayNew extends Array {}
    let superArrayNew1 = new SuperArrayNew(1, 2, 3, 4, 5)
    let superArrayNew2 = superArrayNew1.filter((x) => !!(x % 2))
    console.info(superArrayNew2 instanceof SuperArrayNew) // true

    // 可以通过覆盖 Symbol.species 访问器来覆盖这个默认行为
    class SuperArrayWithoutArray extends Array {
      static get [Symbol.species]() {
        return Array
      }
    }
    let superArrayWithoutArray1 = new SuperArrayWithoutArray(1, 2, 3, 4, 5)
    let superArrayWithoutArray2 = superArrayWithoutArray1.filter(
      (x) => !!(x % 2)
    )
    console.info(superArrayWithoutArray1 instanceof SuperArrayWithoutArray) // true
    console.info(superArrayWithoutArray2 instanceof SuperArrayWithoutArray) // false

    // 5. 类混入
    // 对象有专门的方法来混入 —— Object.assign, 而类目前则没有
    class Vehicles {}
    const FooMixin = (superClass) =>
      class extends superClass {
        foo() {
          console.info("foo")
        }
      }
    const BarMixin = (superClass) =>
      class extends superClass {
        bar() {
          console.info("bar")
        }
      }
    const BazMixin = (superClass) =>
      class extends superClass {
        baz() {
          console.info("baz")
        }
      }

    class Buses extends FooMixin(BarMixin(BazMixin(Vehicles))) {}
    const buses = new Buses()
    buses.foo() // foo
    buses.bar() // bar
    buses.baz() // baz

    /**
     * 这个方法使得只调用一次就可以实现上述的效果
     * 函数式的方式，把函数作为参数来传递并调用
     * @param {*} BaseClass
     * @param  {...any} Mixin
     * @returns
     */
    function mixClass(BaseClass, ...Mixin) {
      return Mixin.reduce(
        (accumulator, current) => current(accumulator),
        BaseClass
      )
    }

    class NewBuses extends mixClass(Vehicles, FooMixin, BarMixin, BazMixin) {}
    const newBuses = new NewBuses()
    newBuses.foo() // foo
    newBuses.bar() // bar

    // React 曾经使用 mixin 来混入组件，但后来抛弃了混入模式，转向了组合模式
  }

  hasProperty(key, value) {
    const o = {}
    try {
      Object.defineProperty(o, key, value)
      console.log("success")
    } catch (error) {
      console.log("failure")
    }
  }

  hasPropertyBetter(key, value) {
    const o = {}
    if (Reflect.defineProperty(o, key, { value })) {
      console.log("success")
    } else {
      console.log("failure")
    }
  }

  /**
   * @description: 创建一个 get 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyByGet() {
    const myTarget = {}
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @param {string|Symbol} property
       * @param {T extends Object} receiver
       * @return {boolean}
       */
      get(target, property, receiver) {
        console.log("get()")
        return Reflect.get(...arguments)
      },
    })
    return myProxy
  }

  /**
   * @description: 创建一个 set 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyBySet() {
    const myTarget = {}
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @param {string|Symbol} property
       * @param {any} value
       * @param {T extends Object} receiver
       * @return {boolean}
       */
      set(target, property, value, receiver) {
        console.log("set()")
        return Reflect.set(...arguments)
      },
    })
    return myProxy
  }

  /**
   * @description: 创建一个 has 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyByHas() {
    const myTarget = {}
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @param {string|Symbol} property
       * @return {boolean}
       */
      has(target, property) {
        console.log("has")
        return Reflect.has(...arguments)
      },
    })
    return myProxy
  }

  /**
   * @description: 创建一个 defineProperty 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyByDefineProperty() {
    const myTarget = {}
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @param {string|Symbol} property
       * @param {PropertyDescriptor} descriptor
       * @return {boolean}
       */
      defineProperty(target, property, descriptor) {
        console.log("defineProperty()")
        return Reflect.defineProperty(...arguments)
      },
    })
    return myProxy
  }

  /**
   * @description: 创建一个 ownKeys 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyByOwnKeys() {
    const myTarget = {}
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @return {string|Symbol[]}
       */
      ownKeys(target) {
        console.log("ownKeys()")
        return Reflect.ownKeys(...arguments)
      },
    })
    return myProxy
  }

  /**
   * @description: 创建一个 deleteProperty 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyByDeleteProperty() {
    const myTarget = {}
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @param {string|Symbol} property
       * @return {boolean}
       */
      deleteProperty(target, property) {
        console.log("deleteProperty()")
        return Reflect.deleteProperty(...arguments)
      },
    })
    return myProxy
  }

  /**
   * 巧妙的利用递归来判断多个参数，增强了原生方法
   * @param {*} x
   * @param  {...any} rest
   * @returns
   */
  recursivelyCheckEqual(x, ...rest) {
    return (
      Object.is(x, rest[0]) &&
      (rest.length || this.recursivelyCheckEqual(...rest))
    )
  }

  /**
   * 工厂模式创建对象
   * @param {*} name
   * @param {*} age
   */
  createPerson(name, age) {
    let o = new Object()
    o.name = name
    o.age = age
    o.sayName = function () {
      return o.name
    }
    return o
  }

  printPerson(foo, { name, age }) {
    console.info(arguments)
    console.info(foo, name, age)
  }

  /**
   * 参数解构的案例
   * @param {*} foo
   * @param {*} param1
   */
  printPerson1(foo, { name: personName, age: personAge }) {
    console.info(arguments)
    console.info(foo, personName, personAge)
  }

  /**
   * 自定义实现 instanceof
   * @param {*} instance 实例对象
   * @param {*} proto 构造函数
   * @returns
   */
  myInstanceof(instance, proto) {
    let prototype = instance.__proto__
    let isInstanceOf = false
    while (prototype) {
      console.info(prototype, "instance.__proto__")
      if (prototype === proto.prototype) {
        isInstanceOf = true
        return isInstanceOf
      }
      prototype = prototype.__proto__
    }
    return isInstanceOf
  }

  /**
   * 网上查找到的实现，和上面个人理解是一样的
   * 这两者都没有规避到包装类型的问题
   * 例如 otherInstanceOf(2, Object) 返回是 true
   * @param {*} L
   * @param {*} R
   * @returns
   */
  otherInstanceOf(L, R) {
    let O = R.prototype
    L = L.__proto__

    while (true) {
      if (L === null) {
        return false
      }
      if (L === O) {
        return true
      }
      L = L.__proto__
    }
  }

  _instanceof(instance, proto) {
    return proto.prototype.isPrototypeOf(instance)
  }

  /**
   * 判断属性是否仅存在于原型上
   * @param {*} obj
   * @param {*} key
   * @returns
   */
  hasPrototypeProperty(obj, key) {
    return !obj.hasOwnProperty(key) && key in obj
  }
}
