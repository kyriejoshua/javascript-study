/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/******** 《JavaScript 高级程序设计》 ********/
/******** 附录 A：ECMAScript Harmony ********/

/**
 * 一些很可能出现在 ES6 内的规范集合
 */
export default class Harmony {
  constructor() {
    // A.1 一般性变化
    // A.1.1 常量
    const MAX_SIZE = 25;
    const FLAG = true;

    // A.1.2 块级作用域及其他作用域
    // 比较典型的应用就是在 for 循环中，避免 i 这个变量被污染
    this.makeAForLoop([]);

    // A.2 函数
    // A.2.1 剩余参数与分布参数
    this.sum(1, 2, 3, 4, 5, 6);

    // A.2.2 默认参数值
    this.sumWithDefaultParams(3);

    // A.2.3 生成器
    // yield

    // A.3 数组及其他结构
    // A.3.1 迭代器
    // 好像没有进入最终版本的 ES6 ？
    const person = {
      name: 'Nico',
      age: 29
    };
    const iterator = new Iterator(person);
    try {
      // eslint-disable-next-line
      while (true) {
        let value = iterator.next();
        document.write(value.join(':') + '<br/>');
      }
    } catch (error) {
      // 不写代码
    }

    // A.3.2 数组领悟
    // 有点像是 coffeescript

    // A.3.3 解构赋值
    let val1 = 3;
    let val2 = 45; // 这里分号必须要加
    // 这样可以实现交换变量
    [val2, val1] = [val1, val2];

    // A.4 新对象类型
    // A.4.1 代理对象
    // handler 是事件处理程序
    // let proxy = Proxy.create(handler)
    // 创建一个以 myObject 为原型的代理对象

    // A.4.2 代理函数
    // let proxy = Proxy.createFunction(handler, function () {}, function () {})

    // A.4.3 映射与集合
    // 简单映射
    let map = new Map();
    map.set('name', 'Nico');
    map.set('book', 'Professional JavaScript');
    console.info(map.has('name')); // true
    console.info(map.get('name')); // Nico

    map.delete('name');

    // ES6 中可能会有细微变化
    let set = new Set();
    set.add('name');
    console.info(set.has('name')); // true
    set.delete('name');
    console.info(set.has('name')); // false

    // A.4.4 WeakMap
    let key = {},
      wreakMap = new WeakMap();

    wreakMap.set(key, 'hello');

    // 解除引用从而删除该值
    key = null;

    // A.4.5 StructType
    // 可能在 ts 中有部分借鉴

    // A.4.6 ArrayType
    // 可能在 ts 中有部分使用

    // A.5 类
    // 旧方式定义
    function Person(name, age) {
      this.name = name;
      this.age = age;
    }

    Person.prototype.sayName = () => {
      alert(this.name);
    };

    Person.prototype.getOlder = (years) => {
      this.age += years;
    };

    // 新的类的方式定义
    class PersonNew {
      constructor(name, age) {
        this.name = name;
        this.age = age;
        // 下面两行是本书的写法，但正式版本中似乎没有使用
        // public name = name
        // public age = age
      }

      sayName() {
        alert(this.name);
      }

      getOlder(years) {
        this.age += years;
      }
    }

    // A.5.1 私有成员
    class PersonNewPrivate {
      constructor(name, age) {
        this.name = name;
        this.age = age;
        // 这是本书的私有属性写法，但正式版本中似乎没有使用
        // private age = age
      }

      sayName() {
        alert(this.name);
      }

      getOlder(years) {
        this.age += years;
      }
    }

    // A.5.2 getter 和 setter
    // 这是本书的写法，但正式版本中似乎没有使用
    // class PersonWithSetter {
    //   constructor(name, age) {
    //     this.name = name
    //     this.age = age
    //     private innerTitle = ''

    //     get title() {
    //       return innerTitle
    //     }

    //     set title(value) {
    //       innerTitle = value
    //     }
    //   }

    //   sayName() {
    //     alert(this.name)
    //   }

    //   getOlder(years) {
    //     this.age += years
    //   }
    // }

    // A.5.3 继承
    class Employee extends Person {
      constructor(name, age) {
        super(name, age);
      }
    }

    // 等同于
    function EmployeeFn(name, age) {
      Person.call(this, name, age);
    }
    EmployeeFn.prototype = new Person();

    // 还有一种写法
    const basePerson = {
      sayName() {
        alert(this.name);
      },

      getOlder(years) {
        this.age += years;
      }
    };

    // 但这种写法似乎没有被纳入正式版本
    // class AnotherEmployee prototype basePerson {
    //   constructor(name, age) {
    //     public name = name
    //     public age = age
    //   }
    // }

    // A.6 模块
    // 模块（命名空间、包）
    // 以下示例代码似乎没有在正式 ES6 中启用，但是在 ts 中得到了支持
    // module MyModule {
    //   // 公开这些成员
    //   export let myObject = {}
    //   export function hello() {
    //     alert('hello')
    //   }
    //   // 隐藏这些成员
    //   function sayGoodbye() {
    //   }
    // }

    // 只导入 myObject
    // import myObject from MyModule
    // console.info(myObject)
    // 导入所有公开的成员
    // import * from MyModule

    // 列出要导入的成员名
    // import { myObject, hello } from MyModule
    // console.info(hello)
  }

  /**
   * 进行一个平平无奇但是有局部作用域的 for 循环
   * @param {Array} array
   */
  makeAForLoop(array = []) {
    for (let i = 0; i < array.length; i++) {
      console.info(array[i]);
    }
  }

  /**
   * 剩余参数的案例
   * @param {*} num1
   * @param {*} num2
   * @param  {...any} nums
   */
  sum(num1, num2, ...nums) {
    let res = num1 + num2;
    for (let i = 0; i < nums.length; i++) {
      res += nums[i];
    }
    return res;
  }

  /**
   * 带默认参数的函数
   * @param {*} num1
   * @param {*} num2
   */
  sumWithDefaultParams = (num1, num2 = 0) => {
    return num1 + num2;
  }
}
