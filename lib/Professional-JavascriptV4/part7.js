/******** 《JavaScript 高级程序设计》(第4版) ********/
/******** 7、 迭代器与生成器 183-204 TODO 考虑先过一遍 ********/

export default class Part7IteratorAndYield {
  constructor(){
    // 7.1 理解迭代
    // 在 JS 中，计数循环就是一种最简单的迭代
    // ES5 中数组添加了 forEach 方法专门用来迭代

    // 7.2 迭代器模式
    // 实现了正式的 Iterator 接口，而且可以通过迭代器 Iterator 消费，就会把这些结构成为可迭代对象

    // 7.2.1 可迭代协议
    // 实现 Iterator 接口（可迭代协议）要求具备两种能力，支持迭代的自我识别能力和创建实例 Iterator 接口的能力
    // 字符串,数组，类数组对象（arguments NodeList 对象），映射，集合这些内置了可迭代协议
    const num = 1;
    const bol = false;
    const obj = {};
    const arr = [];
    const map = new Map();
    const str = 'a new string';
    // 可以使用特有的工厂函数来判断是否具备 Iterator 接口
    console.info(num[Symbol.iterator]); // undefined
    console.info(bol[Symbol.iterator]); // undefined
    console.info(obj[Symbol.iterator]); // undefined
    console.info(arr[Symbol.iterator]); // 对应函数
    console.info(map[Symbol.iterator]); // 对应函数
    console.info(str[Symbol.iterator]); // 对应函数

    // 调用这些工厂函数会生成一个迭代器
    console.info(map[Symbol.iterator]()); // MapIterator {}
    console.info(str[Symbol.iterator]()); // StringIterator {}
    console.info(arr[Symbol.iterator]()); // ArrayIterator {}

    // 通常情况下，不需要显式调用这个工厂函数来生成迭代器
    // 实现可迭代协议的所有类型都会自动兼容接收可迭代对象的任何语言特性
    // 例如
    // for of 循环
    // 数组解构
    // 扩展运算符
    // Array.from()
    // 创建集合
    // 创建映射
    // Promise.all() 接收由期约组成的可迭代对象
    // Promise.race() 接收由期约组成的可迭代对象
    // yield * 操作符，在生成器中使用

    // 上述这些支持意味着，其实可以对字符串做上面的任意操作
    console.info(Array.from(str)); // ["a"," ","n","e","w"," ","s","t","r","i","n","g"]
    console.info(...str); // a   n e w   s t r i n g
    // 甚至还可以使用 for of 循环，这里就不展示了

    // 如果对象原型链上的父类实现了 Iterator 接口，那么这个对象也就实现这个接口
    class NewArray extends Array {};
    const newArray = new NewArray(1, 2, 3);
    console.info(...newArray); // 1, 2, 3

    // 7.2.2 迭代器协议
    // 迭代器是一种一次性使用的对象，用于迭代与其关联的可迭代对象
    // 迭代器 API 使用 next() 方法来遍历数据
    // 使用上面的可迭代对象 newArray
    const iter = newArray[Symbol.iterator]();
    console.info(iter); // ArrayIterator {}
    console.info(iter.next()); // { done: false, value: 1 }
    console.info(iter.next()); // { done: false, value: 2 }
    console.info(iter.next()); // { done: false, value: 3 }
    // 注意是遍历完之后，done 属性会变成 true,再往后就是一样的值了
    console.info(iter.next()); // { done: true, value: undefined }

    // 每个迭代器是相互独立的，各自执行时互不影响
    const arrNames = ['foo', 'bar'];
    const iter1 = arrNames[Symbol.iterator]();
    const iter2 = arrNames[Symbol.iterator]();
    console.info(iter1.next()); // { done: false, value: 'foo' }
    console.info(iter2.next()); // { done: false, value: 'foo' }
    console.info(iter2.next()); // { done: false, value: 'bar' }
    console.info(iter1.next()); // { done: false, value: 'bar' }

    // 迭代器并不与可迭代对象的某个快照绑定，而是使用游标来记录遍历可迭代对象的历程
    // 如果可迭代对象在迭代器件被修改了，那么迭代器也能反映出相应的变化
    // 这里我们修改上面的数组，再继续执行上述的迭代器
    arrNames.push('baz');
    console.info(iter1.next()); // { done: false, value: 'baz' }
    // 其实迭代器维护着一个指向可迭代对象的引用，因此迭代器会阻止垃圾回收程序回收可迭代对象

    // 下面比较了显式的迭代器实现和原生的迭代器实现
    // 下面这个类实现了可迭代接口（显式的迭代器）
    // 调用默认的迭代器工程函数会返回一个实现迭代器接口(Iterator)的迭代器对象
    class Foo {
      [Symbol.iterator]() {
        return {
          next() {
            return { value: 'foo', done: false};
          }
        };
      }
    }
    const f = new Foo();
    console.info(f[Symbol.iterator]()); // { next: function() {} }

    // 而可迭代对象返回一个 Iterator 实例
    console.info(arrNames[Symbol.iterator]()); // ArrayIterator {}

    // 7.2.3 自定义迭代器
    class Counter {
      constructor(limit) {
        this.count = 1;
        this.limit = limit;
      }

      next() {
        if (this.count <= this.limit) {
          return { done: false, value: this.count++ };
        } else {
          return { done: true, value: undefined };
        }
      }

      [Symbol.iterator]() {
        return this;
      }
    }

    const counter = new Counter(3);
    const counterIter = counter[Symbol.iterator]();
    console.info(counterIter.next()); // { done: false, value: 1 }
    console.info(counterIter.next()); // { done: false, value: 2 }
    console.info(counterIter.next()); // { done: false, value: 3 }
    console.info(counterIter.next()); // { done: true, value: undefined }

    // 这个类实现了迭代器，但是每个实例只能迭代一次；
    const anotherCounterIter = counter[Symbol.iterator]();
    // 得到的结果是接着上一次的
    console.info(anotherCounterIter.next()); // { done: true, value: undefined }

    // 所以更好的实现是下面这样，把变量存在闭包里
    // 错误示范(自己写错的)
    class BadCounter {
      constructor(limit) {
        this.limit = limit;
      }

      next() {
        let count = 1;
        return (function() {
          if (count <= this.limit) {
            return { done: false, value: count++ };
          } else {
            return { done: true, value: undefined };
          }
        })();
      }

      [Symbol.iterator]() {
        return this;
      }
    }

    // 正确示范
    class BetterCounter {
      constructor(limit) {
        this.limit = limit;
      }
      [Symbol.iterator]() {
        let count = 1;
        let limit = this.limit;
        return {
          next() {
            if (count <= limit) {
              return { done: false, value: count++ };
            } else {
              return { done: true, value: undefined };
            }
          }
        };
      }
    }

    const betterCounter = new BetterCounter(3);
    // 下面这两个的迭代器是毫无关联的
    const betterCounterIter = betterCounter[Symbol.iterator]();
    const betterCounterIter2 = betterCounter[Symbol.iterator]();
    console.info(betterCounterIter.next()); // { done: false, value: 1 }
    console.info(betterCounterIter2.next()); // { done: false, value: 1 }
    console.info(betterCounterIter.next()); // { done: false, value: 2 }
    console.info(betterCounterIter2.next()); // { done: false, value: 2 }

    // 7.2.4 提前终止迭代器
    class AnotherBetterCounter {
      constructor(limit) {
        this.limit = limit;
      }

      [Symbol.iterator] () {
        let count = 1;
        let limit = this.limit;
        return {
          next() {
            if (count <= limit) {
              return { done: false, value: count++ };
            } else {
              return { done: true, value: undefined };
            }
          },
          /**
           * 这个方法用于提前终止迭代
           * [return description]
           * @return {[type]} [description]
           */
          return () {
            console.info('提前结束了');
            return { done: true };
          }
        };
      }
    }

    const aCounter = new AnotherBetterCounter(5);
    // 遍历的时候提前终止
    for (let i of aCounter) {
      if (i > 2) {
        break; // 提前终止
      }
      console.info(i);
    }
    // 打印出来的是
    // 1
    // 2
    // 提前结束了

    // 遍历的时候抛出异常终止
    const aCounter2 = new AnotherBetterCounter(5);
    try {
      for (let i of aCounter2) {
        if (i > 2) {
          throw 'Err';
        }
        console.info(i, 'i');
      }
    } catch (e) {
      console.info(e, 'e');
    }
    // 打印出来的是
    // 1
    // 2
    // 提前结束了
    // Err

    // 而数组的迭代器无法终止，如果提前终止，后续再迭代也会继续执行
    const arr1 = [1, 2, 3, 4, 5];
    const arrIter = arr1[Symbol.iterator]();
    for (let i of arrIter) {
      if (i > 2) {
        break;
      }
      console.info(i);
    }
    // 1
    // 2
    for (let i of arrIter) {
      console.info(i);
    }
    // 4
    // 5

    // return 方法是可选的，因此有些迭代器并没有实现它，例如数组
    // 可以给它手动添加一个 return 方法，它会执行，但不会真的提前终止
    const arrIter1 = arr1[Symbol.iterator]();
    arrIter1.return = () => {
      console.info('提前终止了哦');
      return { done: true };
    };
    for (let i of arrIter) {
      if (i > 2) {
        break;
      }
      console.info(i);
    }
    // 下面虽然执行了 return 方法，打印出了相应内容，但是后续的迭代器仍会继续执行
    // 1
    // 2
    // 提前结束了
    for (let i of arrIter) {
      console.info(i);
    }
    // 其实还是会继续执行
    // 4
    // 5

    // 7.3 生成器 TODO 时间紧张原因，后续再回来学习
  }

  /**
   * 深度优先的遍历
   * @param {*} rootNode
   * @returns
   */
  deepFirstSearch(rootNode) {
    console.info(rootNode);
    if (rootNode && Array.isArray(rootNode.children)) {
      return rootNode.children.forEach((currentNode) => {
        console.info(currentNode);
        this.deepFirstSearch(currentNode);
      });
    }
    return rootNode;
  }

  /**
   * 深度优先遍历 DOM 节点并打印出节点和类
   * 打印结果含有缩进层级
   * @param {*} rootNode
   * @param {*} space 缩进
   * @returns
   */
  deepFirstSearchDom(rootNode, space = '') {
    console.info(`${space}${rootNode.tagName}:${Array.from(rootNode.classList).join('')}`);
    if (rootNode && rootNode.children) {
      return rootNode.children.forEach((currentNode) => {
        console.info(`${space}${rootNode.tagName}:${Array.from(rootNode.classList).join('')}`);
        this.deepFirstSearchDom(currentNode, space + '|--');
      });
    }
    return rootNode;
  }

  /**
   * 广度优先的遍历，这里入参是数组
   * @param {Array} nodeList
   * @returns
   */
  breadthFirstSearchByArray(nodeList) {
    let quenes = [...nodeList];
    while (quenes.length > 0) {
      const currentNode = quenes.shift();
      console.info(currentNode);
      quenes.childrenList.forEach(currentItem => {
        console.info(currentItem);
        quenes.push(currentItem);
      });
    }
  }

  /**
   * 广度优先遍历，入参是根节点
   * @param {*} rootNode
   * @returns
   */
  breadthFirstSearchByRoot(rootNode) {
    let quenes = [rootNode];
    while (quenes.length > 0) {
      const currentNode = quenes.shift();
      console.info(currentNode);
      quenes.childrenList.forEach(currentItem => {
        console.info(currentItem);
        quenes.push(currentItem);
      });
    }
  }
}
