/******** 《JavaScript 高级程序设计》(第4版) ********/
/******** 9、 代理和反射 266-286 重点 ********/

export default class Part9ProxyAndReflect {
  constructor() {
    // 9.1 代理基础
    // 个人理解其实代理是一种劫持
    // 9.1.1 空代理
    // 最简单的代理是空代理
    const emptyProxy = new Proxy({}, {});
    console.log(emptyProxy); // {}
    // 创建代理的时候两个参数缺一不可，都会报错
    // const errorProxy1 = new Proxy({}); // TypeError: Cannot create proxy with a non-object as target or handler

    const target1 = {
      id: 'target',
    };
    const handler1 = {};
    const proxy1 = new Proxy(target1, handler1);
    console.log(proxy1.id); // target
    // 修改代理对象的属性会同时修改代理对象和目标对象的属性
    proxy1.id = 'foo';
    console.log(target1.id); // foo
    console.log(proxy1.id); // foo
    // 修改目标对象的属性会同时修改代理对象和目标对象的属性
    target1.id = 'bar';
    console.log(target1.id); // bar
    console.log(proxy1.id); // bar

    // 而且这个属性都可以使用 hasOwnProperty 判断
    console.log(target1.hasOwnProperty('id')); // true
    console.log(proxy1.hasOwnProperty('id')); // true

    // 代理构造函数是没有原型对象的
    console.log(Proxy.prototype); // undefined
    // 也不能使用实例来判断，会直接抛出错误
    // console.log(proxy1 instanceof Proxy); // TypeError: Function has non-object prototype 'undefined' in instanceof check

    // 可以使用严格相等来判断区分目标对象和代理对象
    console.log(proxy1 === target1); // false

    // 9.1.2 定义捕获器
    const target2 = {
      foo: 'bar',
    };
    const proxy2 = new Proxy(target2, {
      // 捕获器在处理程序对象中以方法名为键
      get() {
        return 'handler override';
      },
    });

    console.log(target2.foo); // bar
    console.log(proxy2.foo); // handler override

    // 可以有多种方式触发捕获器
    console.log(target2['foo']); // bar
    console.log(proxy2['foo']); // handler override
    // 也可以通过创建属性的方式
    console.log(Object.create(target2)['foo']); // bar
    console.log(Object.create(proxy2)['foo']); // handler override

    // 9.1.3 捕获器参数和反射 API
    // get 方法会收到三个参数，详见函数注释
    const target3 = {
      foo: 'bar',
    };
    const proxy3 = new Proxy(target3, {
      /**
       * @description: 捕获器参数
       * @param {Record<string, any>} trapTarget
       * @param {string} property
       * @param {Record<string, any>} receiver
       * @return {any}
       */
      get(trapTarget, property, receiver) {
        console.log(trapTarget === target3);
        console.log(property);
        console.log(receiver === proxy3);
        return trapTarget[property];
      },
    });
    // console.log(target3.foo);
    console.log(proxy3.foo);
    // 依次返回
    // true
    // foo
    // true
    // bar

    // 使用反射器定义空代理对象
    const target4 = {
      foo: 'bar',
    };
    const emptyProxybyReflect = new Proxy(target4, {
      get() {
        return Reflect.get(...arguments);
      },
    });
    console.log(emptyProxybyReflect); // { foo: 'bar' }
    console.log(emptyProxybyReflect.foo); // bar

    // 更加简化的写法
    const target5 = {
      foo: 'bar',
    };
    const emptyProxybyReflectBetter = new Proxy(target5, {
      get: Reflect.get,
    });
    console.log(emptyProxybyReflectBetter); // { foo: 'bar' }
    console.log(emptyProxybyReflectBetter.foo); // bar

    // 而如果期望创建一个空代理对象并且所有方法都转发给反射 API
    // 可以像先面这样创建
    const target6 = {
      foo: 'bar',
    };
    const emptyProxyAllbyReflect = new Proxy(target6, Reflect);
    console.log(emptyProxyAllbyReflect); // { foo: 'bar' }
    console.log(emptyProxyAllbyReflect.foo); // bar

    // 反射器 API 的一个作用就是提供样板代码，让开发者以最少得代码修改捕获的方法
    const target7 = {
      foo: 'bar',
      id: 'key',
    };
    const proxybyReflect = new Proxy(target7, {
      get(trapTarget, property, receiver) {
        let decoration = '';
        if (property === 'foo') {
          decoration = '!!!';
        }
        return Reflect.get(...arguments) + decoration;
      },
    });

    // 修饰后的效果
    console.log(proxybyReflect.foo); // bar!!!
    // 目标对象不变
    console.log(target7.foo); // bar
    // 其他属性不变
    console.log(target7.id); // key

    // 9.1.4 捕获器不变式
    // 为了不让捕获器异常使用或有反常的行为，规定捕获处理程序的行为必须遵循捕获器不变式
    // 比如，如果代理对象尝试修改目标对象的数据属性，就会抛出错误
    const target8 = {};
    // 在目标对象上定义一个不可配置和不可写的数据属性
    Object.defineProperty(target8, 'foo', {
      writable: false,
      configurable: false,
      value: 'bar',
    });
    const errorProxy2 = new Proxy(target8, {
      get() {
        return 'baz';
      },
    });
    console.log(errorProxy2.foo); // TypeError: 'get' on proxy: property 'foo' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected 'bar' but got 'baz')

    // 9.1.5 可撤销代理
    // 某些场景下需要撤销代理对象和目标对象的联系，对于使用构造函数创建的普通代理来说是无法撤销的
    // 通过 Proxy 的静态方法 revocable 可以撤销代理对象和目标对象的关联
    // 但是撤销代理的操作是不可逆的，而且撤销函数 revoke 是幂等的，多次调用的结果都一样
    const target9 = {
      foo: 'bar',
    };

    const { proxy: proxyByRevoke, revoke } = Proxy.revocable(target9, {
      get() {
        return 'baz';
      },
    });
    console.log(proxyByRevoke.foo); // baz
    console.log(target9.foo); // bar
    revoke();
    // console.log(proxyByRevoke.foo) // TypeError: Cannot perform 'get' on a proxy that has been revoked
    revoke();
    console.log(target9.foo); // bar

    // 9.1.6 实用反射 API
    // 1. 反射 API 与对象 API
    // 反射 API 并不限于捕获处理程序
    // 大多数反射 API 方法在 Object 类型上有对应的方法
    // 反射方法适用于细粒度的对象控制和操作

    // 2. 状态标记
    // 比起直接抛出异常的普通对象方法，反射的状态标记更有用
    // 下面的方法可以通过反射来重构
    this.hasProperty('foo', 'bar');

    // 重构之后
    this.hasPropertyBetter('foo', 'bar');
    // 这些方法都会提供状态标记
    Reflect.defineProperty;
    Reflect.preventExtensions;
    Reflect.setPrototypeOf;
    Reflect.set;
    Reflect.deleteProperty;

    // 3. 使用一等函数来替代操作符
    Reflect.get;
    Reflect.set; // 替代赋值操作
    Reflect.has; // 替代 in 操作
    Reflect.deleteProperty; // 替代 delete 操作
    Reflect.construct; // 替代 new 操作符

    // 4. 安全应用函数
    // 通过 apply 方法调用函数时，被调用的函数有可能也定义了自己的 apply 属性（虽然可能性非常小）
    // 为了绕过这个问题，通常我们会这样做
    // Function.prototype.apply.call(myFunc, thisVal, arguments)
    // 更好的方式是使用反射 API
    // Reflect.apply(myFunc, thisVal, arguments)

    // 9.1.7 代理另一个代理
    // 代理其实是可以套娃的
    const targetTarget = {
      foo: 'bar',
    };
    // 创建第一个代理
    const firstProxy = new Proxy(targetTarget, {
      get() {
        console.log('first proxy');
        return Reflect.get(...arguments);
      },
    });
    // 使用代理去代理代理
    const secondProxy = new Proxy(firstProxy, {
      get() {
        console.log('second proxy');
        return Reflect.get(...arguments);
      },
    });

    console.log(secondProxy.foo); // second proxy -> first proxy -> bar

    // 9.1.8 代理的问题与不足
    // 1. 代理中的 this
    const targetThis = {
      thisValEuqalsProxy() {
        return this === proxyThis;
      },
    };

    const proxyThis = new Proxy(targetThis, {});
    console.log(targetThis.thisValEuqalsProxy()); // false
    console.log(proxyThis.thisValEuqalsProxy()); // true

    // 更具体的例子
    const wm = new WeakMap();
    class User {
      constructor(userId) {
        wm.set(this, userId);
      }

      set id(userId) {
        wm.set(this, userId);
      }

      get id() {
        return wm.get(this);
      }
    }
    const user = new User(123);
    console.log(user.id); // 123

    const userInstanceProxy = new Proxy(user, {}); // 123
    console.log(userInstanceProxy.id); // undefined
    // 这不是我们预期的行为
    // 如果期望行为保持一致
    // 把代理的实例对象改为代理 User 类本身，之后再创建实例就会以代理实例作为 WeakMap 的键了
    const UserClassProxy = new Proxy(User, {});
    const proxyUser = new UserClassProxy(312);
    console.log(proxyUser.id); // 312 现在行为一致

    // 2. 代理与内部槽位
    // 代理和内置的引用类型一般是可以正常工作，除了 Date 这种特殊的对象
    const targetDate = new Date();
    const proxyDate = new Proxy(targetDate, {});

    // Date 对象类型有着自己的数据属性 [[NumberDate]]，而代理对象不存在这个内部槽位
    // 也就是具体的数据属性 [[NumberDate]]，而且也不能通过 get 方法访问到，所以会报错
    console.log(proxyDate instanceof Date); // true
    proxyDate.getDate(); // TypeError: this is not a Date object.

    // 9.2 代理捕获器和反射方法
    // 9.2.1 get()
    // get 捕获器会在获取属性值的操作中被调用，对应的反射 API 方法为 Reflect.get
    const myProxyGet = this.createProxyByGet();
    myProxyGet.foo; // get()

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
    const myProxySet = this.createProxyBySet();
    myProxySet.foo = 'bar'; // set()

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
    const myProxyByHas = this.createProxyByHas();
    console.log('id' in myProxyByHas); // has false

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
    const myProxyByDefineProperty = this.createProxyByDefineProperty();
    Object.defineProperty(myProxyByDefineProperty, 'foo', { value: 'bar' }); // defineProperty()
    console.log(myProxyByDefineProperty.foo); // bar

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
    // getOwnPropertyDescriptor 捕获器会在 Object.getOwnPropertyDescriptor() 中被调用，对应的反射 API 方法为 Reflect.getOwnPropertyDescriptor()
    const myProxyByGetOwnPropertyDescriptor = this.createProxyByGetOwnPropertyDescriptor({ foo: 1 });
    Object.getOwnPropertyDescriptor(myProxyByGetOwnPropertyDescriptor, 'foo'); // getOwnPropertyDescriptor()

    // 1. 返回值是布尔值，是必须的
    // getOwnPropertyDescriptor 必须返回对象，或在属性不存在时返回 undefined
    // 返回的对象如这样的格式 { value: 1, writable: true, enumerable: true, configurable: true }

    // 2. 拦截的操作
    // Object.getOwnPropertyDescriptor(proxy, property)
    // Reflect.getOwnPropertyDescriptor(proxy, property)

    // 3. 捕获器处理程序参数
    /**
     * @param {T extends Object} target 目标对象
     * @param {string|Symbol} property 引用的目标对象上的字符串键属性或 Symbol 键
     */
    //  返回值见 ts 定义
    // interface PropertyDescriptor {
    //   configurable?: boolean;
    //   enumerable?: boolean;
    //   value?: any;
    //   writable?: boolean;
    //   get?(): any;
    //   set?(v: any): void;
    // }

    // 4. 捕获器不变式
    // * 如果自有的 target.property 存在且不可配置，则处理程序必须返回一个表示该属性存在的对象
    // * 如果自有的 target.property 存在且可配置，则处理程序必须返回一个表示该属性可配置的对象
    // * 如果 target.property 不存在且 target 不可扩展，则处理程序必须返回一个 undefined 表示该属性不存在
    // * 如果 target.property 不存在，则处理程序不能返回表示该属性可配置的对象

    // 9.2.6 deleteProperty()
    // deleteProperty 捕获器会在 Object.deleteProperty() 中被调用，对应的反射 API 方法为 Reflect.deleteProperty()
    const myProxyByDeleteProperty = this.createProxyByDeleteProperty();
    console.log(delete myProxyByDeleteProperty.name); // deleteProperty() true
    myProxyByDeleteProperty.name = 'Curry';
    console.log(delete myProxyByDeleteProperty.name); // deleteProperty() true
    console.log(myProxyByDeleteProperty.name); // undefined

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
    const myProxyByOwnKeys = this.createProxyByOwnKeys();
    Object.keys(myProxyByOwnKeys); // ownKeys()

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

    // 9.2.8 getPrototypeOf()
    // getPrototypeOf 捕获器会在 Object.getPrototypeOf() 中被调用，对应的反射 API 方法为 Reflect.getPrototypeOf()
    const myProxyByGetPrototypeof = this.createProxyByGetPrototypeOf();
    Object.getPrototypeOf(myProxyByGetPrototypeof, 'foo'); // getPrototypeOf()

    // 1. 返回值必须返回对象或 null

    // 2. 拦截的操作
    // Object.getPrototypeOf(proxy)
    // Reflect.getPrototypeOf(proxy)
    // proxy.__proto__
    // Object.prototype.isPrototypeOf(proxy)
    // proxy instanceof Object

    // 3. 捕获器处理程序参数
    /**
     * @param {T extends Object} target 目标对象
     */

    // 4. 捕获器不变式
    // * 如果 target 不可扩展，则 Object.getPrototypeOf(proxy) 唯一有效的返回值就是 Object.getPrototypeOf(target) 的返回值

    // 9.2.9 setPrototypeOf()
    // getPrototypeOf 捕获器会在 Object.getPrototypeOf() 中被调用，对应的反射 API 方法为 Reflect.getPrototypeOf()
    const myProxyBySetPrototypeof = this.createProxyBySetPrototypeOf();
    Object.setPrototypeOf(myProxyBySetPrototypeof, null); // setPrototypeOf()

    // 1. 返回值必须返回布尔值，表示原型是否赋值成功，如果返回的是非布尔值会被隐式转换成布尔值

    // 2. 拦截的操作
    // Object.setPrototypeOf(proxy)
    // Reflect.setPrototypeOf(proxy)

    // 3. 捕获器处理程序参数
    /**
     * @param {T extends Object} target 目标对象
     * @param {T extends Object} prototype target 的替代原型，如果是顶级原型就是 null
     */

    // 4. 捕获器不变式
    // * 如果 target 不可扩展，则 Object.setPrototypeOf(proxy) 唯一有效的返回值就是 Object.getPrototypeOf(target) 的返回值

    // 9.2.10 isExtensible()
    // isExtensible 捕获器会在 Object.isExtensible() 中被调用，对应的反射 API 方法为 Reflect.isExtensible()
    const myProxyByExtensible = this.createProxyByExtensible();
    Object.isExtensible(myProxyByExtensible); // isExtensible()

    // 1. 返回值必须返回布尔值，表示 target 是否可扩展，如果返回的是非布尔值会被隐式转换成布尔值

    // 2. 拦截的操作
    // Object.isExtensible(proxy)
    // Reflect.isExtensible(proxy)

    // 3. 捕获器处理程序参数
    /**
     * @param {T extends Object} target 目标对象
     */

    // 4. 捕获器不变式
    // * 如果 target 可扩展，则处理程序必须返回 true
    // * 如果 target 不可扩展，则处理程序必须返回 false

    // 9.2.11 preventExtensions()
    // preventExtensions 捕获器会在 Object.preventExtensions() 中被调用，对应的反射 API 方法为 Reflect.preventExtensions()
    const myProxyByPreventExtensions = this.createProxyByPreventExtensible();
    Object.preventExtensions(myProxyByPreventExtensions); // preventExtensions()

    // 1. 返回值必须返回布尔值，表示 target 是否已经不可扩展，如果返回的是非布尔值会被隐式转换成布尔值

    // 2. 拦截的操作
    // Object.preventExtensions(proxy)
    // Reflect.preventExtensions(proxy)

    // 3. 捕获器处理程序参数
    /**
     * @param {T extends Object} target 目标对象
     */

    // 4. 捕获器不变式
    // * 如果 Object.isExtensible(proxy)  是 false，则处理程序必须返回 true

    // 9.2.12 apply()
    // apply 捕获器会在调用函数中时被调用，对应的反射 API 方法为 Reflect.apply()
    const myProxyByApply = this.createProxyByApply();
    myProxyByApply(); // apply()

    // 1. 返回值无限制

    // 2. 拦截的操作
    // proxy(...arguments)
    // Function.prototype.apply(proxy, arguments)
    // Function.prototype.call(proxy, ...arguments)
    // Reflect.apply(target, thisArguments, arguments)

    // 3. 捕获器处理程序参数
    /**
     * @param {T extends Function} target 目标对象
     * @param {Object} thisArg 调用函数时的 this 参数
     * @param {array} argumentList 调用函数时参数列表
     */

    // 4. 捕获器不变式
    // target 必须是一个函数对象

    // 9.2.13 constructor()
    // constructor 捕获器会在 new 操作符中被调用，对应的反射 API 方法为 Reflect.constructor()
    const myProxyByConstruct = this.createProxyByConstruct();
    new myProxyByConstruct; // construct() 注意这里不需要调用方法，只需调用 new 即可触发

    // 1. 返回值必须返回一个对象

    // 2. 拦截的操作
    // new proxy(...arguments)
    // Reflect.construct(target, thisArguments, arguments)

    // 3. 捕获器处理程序参数
    /**
     * @param {T extends Object} target 目标对象
     * @param {array} argumentList 传给目标构造函数的参数列表
     * @param {Function} newTarget 最初被调用的构造函数
     */

    // 4. 捕获器不变式
    // target 必须可以用作构造函数（意味着不可以使用箭头函数）

    // 9.3 代理模式
    // 9.3.1 跟踪属性访问
    const userByTracking = {
      name: 'Jake',
    };
    const proxyByTracking = new Proxy(userByTracking, {
      set(target, property, value, receiver) {
        console.log(`Setting ${property}=${value}`);

        return Reflect.set(...arguments);
      },
      get(target, property, receiver) {
        console.log(`Getting ${property}`);

        return Reflect.get(...arguments);
      },
    });

    proxyByTracking.name; // Getting name
    proxyByTracking.age = 31; // Setting age=31

    // 9.3.2 隐藏属性
    // 代理的内部实现对外是不可见的，所以想要实现隐藏属性的效果也很容易
    const hiddenProperties = ['foo', 'bar'];
    const targetObject = {
      foo: 1,
      bar: 2,
      baz: 3,
    };
    const hiddenProxy = new Proxy(targetObject, {
      get(target, property) {
        if (hiddenProperties.includes(property)) return undefined;

        return Reflect.get(...arguments);
      },
      has(target, property) {
        if (hiddenProperties.includes(property)) return false;

        return Reflect.get(...arguments);
      },
    });
    // get
    console.log(hiddenProxy.bar); // undefined
    console.log(hiddenProxy.foo); // undefined
    console.log(hiddenProxy.baz); // 3
    // has
    console.log('bar' in hiddenProxy); // false
    console.log('foo' in hiddenProxy); // false
    console.log('baz' in hiddenProxy); // true

    // 9.3.3 属性验证
    // 因为所有赋值操作都会触发 set 捕获器， 所以可以根据值的类型来决定是否可以正常赋值
    // 下面是限制值类型为数字的示例
    const onlyNumberTarget = {
      onlyNumberGoHere: 0,
    };
    const onlyNumberProxy = new Proxy(onlyNumberTarget, {
      set(target, property, value, receiver) {
        if (typeof value !== 'number') {
          return false;
        }
        return Reflect.set(...arguments);
      },
    });
    onlyNumberProxy.onlyNumberGoHere = 2;
    console.log(onlyNumberProxy); // { onlyNumberGoHere: 2 }
    onlyNumberProxy.onlyNumberGoHere = 'hello';
    console.log(onlyNumberProxy); // { onlyNumberGoHere: 2 }

    // 9.3.4 构造函数与函数参数验证
    // 和保护以及验证对象属性类似，可以对函数和构造函数参数进行审查，让函数只接收某种类型的值
    /**
     * @description: 获取多个输入参数的中间大小的值
     * @param {array} nums
     * @return {T}
     */
    function median(...nums) {
      return nums.sort()[Math.floor(nums.length / 2)];
    }

    const medianProxy = new Proxy(median, {
      apply(target, thisArg, argumentList) {
        for (const arg of argumentList) {
          if (typeof arg !== 'number') {
            throw 'Non-number argument provided';
          }
        }
        return Reflect.apply(...arguments);
      },
    });
    console.log(medianProxy(4, 7, 1)); // 4
    console.log(medianProxy(4, '7', 1)); // 'Uncaught Non-number argument provided'

    // 也可以要求实例化的时候必须给构造函数传参
    class UserId {
      constructor(id) {
        this._id = id;
      }
    }

    const ProxyUserId = new Proxy(UserId, {
      construct(target, argumentList, newTarget) {
        if (argumentList[0] === undefined) {
          throw 'User cannot be instantiated without id';
        }
        return Reflect.construct(...arguments);
      },
    });

    console.log(new ProxyUserId(123)); // UserId { _id: 123 }
    console.log(new ProxyUserId()); // User cannot be instantiated without id

    // 9.3.5 数据绑定与可观察对象
    // 数据绑定
    const userList = [];

    class User {
      constructor(name) {
        this._name = name;
      }
    }

    const ProxyUser = new Proxy(User, {
      construct() {
        const newUser = Reflect.construct(...arguments);
        userList.push(newUser);
        return newUser;
      },
    });

    new ProxyUser('Bob');
    new ProxyUser('Billy');
    new ProxyUser('John');
    console.log(userList);
    // [
    //   User { _name: 'Bob' },
    //   User { _name: 'Billy' },
    //   User { _name: 'John' }
    // ]

    // 也可以把集合绑定到事件分派程序，每次插入新的实例都会发送消息
    const otherUserList = [];

    function emit(newValue) {
      console.log('newValue', newValue);
    }

    const proxyUserList = new Proxy(otherUserList, {
      set(target, property, value, receiver) {
        const result = Reflect.set(...arguments);
        if (result) {
          emit(Reflect.get(target, property, receiver));
        }
        return result;
      },
    });
    proxyUserList.push('Smith'); // Smith
    proxyUserList.push('John'); // John
    console.log(otherUserList);
    // [ 'Smith', 'John' ]

    // 9.4 小结
    // 代理的应用场景是不可限量的，开发者可以用它创建各种编码模式，包括但远不限于跟踪属性访问、隐藏属性、阻止修改或删除属性、函数参数验证、构造函数参数验证、数据绑定，以及可观察对象
  }

  /**
   * @description: 对象是否有某个属性
   * @param {string|symbol} key
   * @param {object} value
   * @return {*}
   */
  hasProperty(key, value) {
    const o = {};
    try {
      Object.defineProperty(o, key, value);
      console.log('success');
    } catch (error) {
      console.log('failure');
    }
  }

  /**
   * @description: 使用反射判断是否有某个属性
   * @param {string|symbol} key
   * @param {any} value
   * @return {*}
   */
  hasPropertyBetter(key, value) {
    const o = {};
    if (Reflect.defineProperty(o, key, { value })) {
      console.log('success');
    } else {
      console.log('failure');
    }
  }

  /**
   * @description: 创建一个 get 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyByGet() {
    const myTarget = {};
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @param {string|Symbol} property
       * @param {T extends Object} receiver
       * @return {boolean}
       */
      get(target, property, receiver) {
        console.log('get()');
        return Reflect.get(...arguments);
      },
    });
    return myProxy;
  }

  /**
   * @description: 创建一个 set 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyBySet() {
    const myTarget = {};
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @param {string|Symbol} property
       * @param {any} value
       * @param {T extends Object} receiver
       * @return {boolean}
       */
      set(target, property, value, receiver) {
        console.log('set()');
        return Reflect.set(...arguments);
      },
    });
    return myProxy;
  }

  /**
   * @description: 创建一个 has 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyByHas() {
    const myTarget = {};
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @param {string|Symbol} property
       * @return {boolean}
       */
      has(target, property) {
        console.log('has');
        return Reflect.has(...arguments);
      },
    });
    return myProxy;
  }

  /**
   * @description: 创建一个 defineProperty 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyByDefineProperty() {
    const myTarget = {};
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @param {string|Symbol} property
       * @param {PropertyDescriptor} descriptor
       * @return {boolean}
       */
      defineProperty(target, property, descriptor) {
        console.log('defineProperty()');
        return Reflect.defineProperty(...arguments);
      },
    });
    return myProxy;
  }

  /**
   * @description: 创建一个 getOwnPropertyDescriptor 的 Proxy 示例
   * @param {Object} target
   * @return {Proxy}
   */
  createProxyByGetOwnPropertyDescriptor(target) {
    const myTarget = target || {};
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @param {string|Symbol} property
       * @return {PropertyDescriptor|undefined}
       */
      getOwnPropertyDescriptor(target, property) {
        console.log('getOwnPropertyDescriptor()');
        return Reflect.getOwnPropertyDescriptor(...arguments);
      },
    });

    return myProxy;
  }

  /**
   * @description: 创建一个 ownKeys 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyByOwnKeys() {
    const myTarget = {};
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @return {string|Symbol[]}
       */
      ownKeys(target) {
        console.log('ownKeys()');
        return Reflect.ownKeys(...arguments);
      },
    });
    return myProxy;
  }

  /**
   * @description: 创建一个 deleteProperty 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyByDeleteProperty() {
    const myTarget = {};
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @param {string|Symbol} property
       * @return {boolean}
       */
      deleteProperty(target, property) {
        console.log('deleteProperty()');
        return Reflect.deleteProperty(...arguments);
      },
    });
    return myProxy;
  }

  /**
   * @description: 创建一个 getPrototypeOf 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyByGetPrototypeOf() {
    const myTarget = {};
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @return {Object|null}
       */
      getPrototypeOf(target) {
        console.log('getPrototypeOf()');
        return Reflect.getPrototypeOf(...arguments);
      },
    });
    return myProxy;
  }

  /**
   * @description: 创建一个 setPrototypeOf 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyBySetPrototypeOf() {
    const myTarget = {};
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @param {T extends Object} prototype
       * @return {boolean}
       */
      setPrototypeOf(target, prototype) {
        console.log('setPrototypeOf()');
        return Reflect.setPrototypeOf(...arguments);
      },
    });
    return myProxy;
  }

  /**
   * @description: 创建一个 isExtensible 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyByExtensible() {
    const myTarget = {};
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @return {boolean}
       */
      isExtensible(target) {
        console.log('isExtensible()');
        return Reflect.isExtensible(...arguments);
      },
    });
    return myProxy;
  }

  /**
   * @description: 创建一个 preventExtensible 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyByPreventExtensible() {
    const myTarget = {};
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Object} target
       * @return {boolean}
       */
      preventExtensible(target) {
        console.log('preventExtensible()');
        return Reflect.preventExtensible(...arguments);
      },
    });
    return myProxy;
  }

  /**
   * @description: 创建一个 apply 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyByApply() {
    const myTarget = () => {};
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Function} target
       * @param {Object} thisArg
       * @param {array} argumentList
       * @return {any}
       */
      apply(target, thisArg, ...argumentList) {
        console.log('apply()');
        return Reflect.apply(...arguments);
      },
    });
    return myProxy;
  }

  /**
   * @description: 创建一个 construct 的 Proxy 示例
   * @return {Proxy}
   */
  createProxyByConstruct() {
    const myTarget = function () {}; // 这里不能使用箭头函数，因为箭头函数没有  construct
    const myProxy = new Proxy(myTarget, {
      /**
       * @param {T extends Function} target
       * @param {array} argumentList
       * @param {Function} newTarget
       * @return {any}
       */
      construct(target, argumentList, newTarget) {
        console.log('construct()');
        return Reflect.construct(...arguments);
      },
    });

    return myProxy;
  }
}
