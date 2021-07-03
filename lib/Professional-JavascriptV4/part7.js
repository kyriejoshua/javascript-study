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
    // * 必须暴露一个属性作为默认迭代器,这个属性的键就是 Symbol.iterator
    // * 字符串,数组，类数组对象（arguments NodeList 对象），映射，集合这些内置了可迭代协议(Iterable接口)
    // 注意，对象是不可迭代的
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
    console.info(arr[Symbol.iterator]); // 对应函数 ƒ values() { [native code] }
    console.info(map[Symbol.iterator]); // 对应函数 ƒ values() { [native code] }
    console.info(str[Symbol.iterator]); // 对应函数 ƒ values() { [native code] }

    // 调用这些工厂函数会生成一个迭代器
    // 不过可以观察到，每个迭代器是不一样的
    console.info(map[Symbol.iterator]()); // MapIterator {}
    console.info(str[Symbol.iterator]()); // StringIterator {}
    console.info(arr[Symbol.iterator]()); // ArrayIterator {}

    // * 通常情况下，不需要显式调用这个工厂函数来生成迭代器
    // * 实现可迭代协议的所有类型都会自动兼容接收可迭代对象的任何语言特性
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
    // 这些原生语言结构会在后台调用提供的可迭代对象的工厂函数，从而创建一个迭代器

    // 上述这些支持意味着，其实可以对字符串做上面的任意操作
    console.info(Array.from(str)); // ["a"," ","n","e","w"," ","s","t","r","i","n","g"]
    console.info(...str); // a   n e w   s t r i n g
    // 甚至还可以使用 for of 循环，这里就不展示了

    // 如果对象原型链上的父类实现了 Iterator 接口，那么这个对象也就实现这个接口
    class NewArray extends Array {};
    const newArray = new NewArray(1, 2, 3);
    console.info(...newArray); // 1, 2, 3

    // 7.2.2 迭代器协议
    // * 迭代器是一种一次性使用的对象，用于迭代与其关联的可迭代对象
    // * 迭代器 API 使用 next() 方法来遍历数据
    // 使用上面的可迭代对象 newArray 为例
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
    // * 迭代器维护着一个指向可迭代对象的引用，因此迭代器会阻止垃圾回收程序回收可迭代对象

    // 下面比较了显式的迭代器实现和原生的迭代器实现
    // 下面这个类实现了可迭代接口（显式的迭代器）
    // 调用默认的迭代器工程函数会返回一个实现迭代器接口(Iterator)的迭代器对象
    class Foo {
      [Symbol.iterator]() {
        return {
          next() {
            return { value: 'foo', done: false };
          }
        };
      }
    }
    const f = new Foo();
    console.info(f[Symbol.iterator]()); // { next: function() {} }

    // 而可迭代对象返回一个 Iterator 实例
    console.info(arrNames[Symbol.iterator]()); // ArrayIterator {}

    // 7.2.3 自定义迭代器
    // 任何实现了 Iterator 接口的对象都可以作为迭代器使用
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
    /**
     * 使用闭包的形式，使得每次生成的迭代互相独立
     */
    class GoodCounter {
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

    const goodCounter = new GoodCounter(3);
    // 下面这两个的迭代器是毫无关联的
    const goodCounterIter = goodCounter[Symbol.iterator]();
    const goodCounterIter2 = goodCounter[Symbol.iterator]();
    console.info(goodCounterIter.next()); // { done: false, value: 1 }
    console.info(goodCounterIter2.next()); // { done: false, value: 1 }
    console.info(goodCounterIter.next()); // { done: false, value: 2 }
    console.info(goodCounterIter2.next()); // { done: false, value: 2 }

    // 实现了自定义迭代器，就可以使用 for of 循环等原生语言结构
    for (const counter of goodCounter) {
      console.info(counter);
    }
    console.info(...counter); // 1 2 3
    console.info(Array.from(goodCounter)); [1, 2, 3]

    const [a1, b1, c1] = goodCounter;
    console.info(a1, b1, c1); // 1, 2, 3

    // 7.2.4 提前终止迭代器
    /**
     * 通过可选的 return 方法来实现提前终止
     */
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
    // 1 i
    // 2 i
    // 提前结束了
    // Err e

    // 因为 return 方法是可选的，所以不是所有的迭代器都拥有的，比如数组迭代器就无法停止
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

    // 7.3 生成器
    // * 生成器拥有在一个函数块内暂停和回复代码执行的能力

    // 7.3.1 生成器基础
    // * 生成器的形式是函数
    // 使用 * 关键字在函数名称前来定义生成器函数
    function *generator() {}

    // 还有其他几种形式
    // 函数表达式
    const generatorFn = function* () {}

    // 对象字面量
    const generatorObj = {
      *generator() {}
    }

    // 类实例方法
    class G {
      *generator() {

      }
    }

    // 作为类的静态方法
    class G1 {
      static *generator() {}
    }

    // * 箭头函数不能用来定义生成器函数

    // * 调用生成器函数会产生一个生成器对象
    // 生成器对象也实现了 Iterator 接口，也有 next 方法
    // value 属性是生成器函数的返回值
    function *generatorFn1() {
      return 'foo';
    }
    const generatorObject = generatorFn1(); // generatorFn1 {<suspended>}
    generatorObject.next(); // { value: 'foo', done: true }
    console.info(generatorObject); // generatorFn1 {<closed>}

    // 生成器函数会在初次调用 next 方法后开始执行，初始化的时候并不执行，参见下面
    function *generatorFn2() {
      return 'bar';
    }
    const generatorObject2 = generatorFn2(); // 此时并不执行，状态是 suspended
    console.info(generatorObject2); // generatorFn2 {<suspended>}

    // 生成器对象也实现了 Iterator 接口，也就是说是可迭代的
    // 因为没有内容，所以没有迭代输出，但是通过打印可以发现
    for (const iterObj of generatorObject2) {
      console.info(iterObj);
    }
    // 状态已经变更为 closed
    console.info(generatorObject2); // generatorFn2 {<closed>}

    // 等效于上文
    // for (const iterObj of generatorObject2[Symbol.iterator]()) {
    //   console.info(iterObj);
    // }

    // 7.3.2 通过 yield 中断执行
    // 在生成器函数中，使用 yield 来暂停函数的执行
    // * 生成器函数在遇到 yield 关键字后，执行会停止，函数作用域的状态会被保留
    // * 停止执行的生成器函数只能通过生成器对象上的 next 方法来恢复执行
    function *generator1() {
      yield 'foo';
    }

    // 生成器函数内部的执行流程会针对每个生成器对象区分作用域，他们互不干扰
    const g1 = generator1();
    const g2 = generator1();
    console.info(g1); // generator1 {<suspended>}
    console.info(g1.next()); // {value: 'foo', done: false}
    console.info(g1.next()); // {value: undefined, done: true}
    console.info(g1); // generator1 {<closed>}
    console.info(g2.next()); // {value: 'foo', done: false}

    // * yield 关键字只能在生成器函数内部使用，用在其他地方会报错，用在嵌套函数中也会报错
    // 实际在浏览器中允许不会抛出异常，但确实是无效的
    // 有些像是 async/await

    /**
     * 异常场景1： 嵌套
     */
    function *errGenerator1() {
      function inner() {
        yield 'inner';
      }
    }

    const errGeneratorObj1 = errGenerator1();
    console.info(errGeneratorObj1); // Uncaught SyntaxError: Unexpected string 这里的类型取决于前面的定义

    /**
     * 异常场景2： 箭头函数中使用
     */
    function *errGenerator2(){
      const b = () => {
        yield 12;
      }
    }
    const errGeneratorObj2 = errGenerator2();
    console.info(errGeneratorObj2); // Uncaught SyntaxError: Unexpected number

    // 如果有返回值的场景
    function *generator2() {
      yield 'foo';
      yield 'bar';
      return 'finished';
    }
    const g2 = generator2();
    console.info(g2); // generator2 {<suspended>}
    console.info(g2.next()); // {value: 'foo', done: false}
    console.info(g2.next()); // {value: 'bar', done: false}
    console.info(g2.next()); // {value: finished, done: true}
    console.info(g2); // generator2 {<closed>}

    // 1. 生成器对象作为可迭代对象
    function *generatorFn1() {
      yield 1;
      yield 2;
      yield 3;
    }

    const generatorFnObj1 = generatorFn1();
    for (const x of generatorFnObj1) {
      console.info(x);
    }
    // 1
    // 2
    // 3

    function *nTimes(n) {
      while (n--) {
        yield n;
      }
    }

    for (const _ of nTimes(3)) {
      console.info(_);
    }
    // 2
    // 1
    // 0

    // 2. 使用 yield 实现输入和输出

    /**
     * 用于输入的案例
     * @param {*} initial
     */
    function *generatorFnInput(initial) {
      console.info(initial);
      console.info(yield);
      console.info(yield);
    }

    const generatorInput = generatorFnInput('foo');
    console.info(generatorInput.next('fbo')); // foo {value: undefined, done: false}  保留了初始值
    console.info(generatorInput.next('bar')); // bar {value: undefined, done: false}
    console.info(generatorInput.next('baz')); // baz {value: undefined, done: true}
    console.info(generatorInput.next('zoo')); // 无打印 {value: undefined, done: true}

    /**
     * 同时用于输入和输出的案例
     * @returns
     */
    function *generatorFnOutput() {
      return yield 'foo';
    }
    const generatorOutput = generatorFnOutput();
    generatorOutput.next(); // {value: 'foo', done: false}
    generatorOutput.next('bar'); // {value: 'bar', done: true}

    // 下面几个案例实现的是不依赖数组而迭代相应次数并产生迭代索引
    /**
     * 常规的 for 循环实现
     * @param {*} n
     */
    function *nTimesFor(n) {
      for (let index = 0; index < n; index++) {
        yield index;
      }
    }
    for (const i of nTimesFor(5)) {
      console.info(i);
    }
    // 0
    // 1
    // 2
    // 3
    // 4

    /**
     * while 循环实现
     * @param {*} n
     */
    function *nTimesWhile(n) {
      let i = 0;
      while (n--) {
        yield i++;
      }
    }

    for (const x of nTimesWhile(5)) {
      console.info(x);
    }

    // 甚至可以使用这个特性来填充
    /**
     * 打印出其中的范围
     * @param {*} start
     * @param {*} end
     */
    function *range(start, end) {
      while (end > start) {
        yield start++;
      }
    }

    for (const x of range(4, 7)) {
      console.info(x);
    }
    // 4
    // 5
    // 6

    /**
     * 可以用来快速生成数组
     * @param {*} n
     */
    function *zeros(n) {
      while (n--) {
        yield n;
      }
    }

    console.info(Array.from(zeros(6))); // [5, 4, 3, 2, 1, 0]

    // 3. 产生可迭代对象
    // 可以使用星号增强 yield 的行为，让它能够迭代一个可迭代对象
    function *generateIterator() {
      yield* [1, 2, 3];
    }
    // 等价于
    // function *generateIterator() {
    //   for (const x of [1, 2, 3]) {
    //     yield x;
    //   }
    // }

    // yield* 实际上只是将一个可迭代对象序列化为一连串可以单出产出的值，所以其实类似于放到一个循环里


    const generateIteratorObj = generateIterator();
    for (const x of generateIteratorObj) {
      console.info(x);
    }
    // 1
    // 2
    // 3

    // yield* 的值是关联迭代器返回的 done 是 true 的 value 属性
    function *generateIteratorFn() {
      console.info('iter value: ', yield* [1, 2, 3]);
    }
    for (const x of generateIteratorFn()) {
      console.info(x);
    }
    // 1
    // 2
    // 3
    // iter value: undefined

    // 如果设置了返回值则是 value 是有值的
    function *innerGenerateFn() {
      yield* [1, 2];
      return 'foo';
    }

    function *outerGenerateFn() {
      console.info('iter value: ', yield* innerGenerateFn());
    }

    for (const x of outerGenerateFn()) {
      console.info(x);
    }
    // iter value: 'foo';

    // 4. 使用 yield* 实现递归算法
    function *nTimesYield(n) {
      if (n > 0) {
        yield* nTimesYield(n - 1);
        yield n - 1;
      }
    }

    for (const x of nTimesYield(3)) {
      console.info(x);
    }
    // 0
    // 1
    // 2

    // 下面的例子用于随机生成双向图
    class Node {
      constructor(id) {
        this.id = id;
        this.neighbors = new Set();
      }

      connect(node) {
        if (node !== this) {
          this.neighbors.add(node);
          node.neighbors.add(this);
        }
      }
    }

    class RandomGraph {
      constructor(size) {
        this.nodes = new Set();

        // 创建节点
        for (let index = 0; index < size; index++) {
          this.nodes.add(new Node(index));
        }

        // 随机连接节点
        const threshold = 1 / size;
        for (const x of this.nodes) {
          for (const y of this.nodes) {
            if (Math.random() < threshold) {
              x.connect(y);
            }
          }
        }
      }

      /**
       * 用于调试
       */
      print() {
        let str = '';
        for (const node of this.nodes) {
          const ids = [...node.neighbors].map((n) => n.id).join(',');
          const currentLog = `${node.id}: ${ids}`;
          str += `${currentLog} \n`;
          console.info(currentLog);
        }
        console.info(str);
      }
    }

    const g = new RandomGraph(5);
    g.print();
    // 0: 3
    // 1: 2,4
    // 2: 1
    // 3: 0
    // 4: 1

    // 图数据结构就比较适合递归遍历，而递归生成器又恰好合用
    /**
     * 理解下面的递归非常重要，目前不甚理解
     */
    class BetterRandomGraph extends RandomGraph {
      isConnected() {
        const visitedNodes = new Set();

        function *traverse(nodes) {
          for (const node of nodes) {
            if (!visitedNodes.has(node)) {
              yield node;
              yield* traverse(node.neighbors);
            }
          }
        }

        // 取得集合中的第一个节点
        const firstNode = this.nodes[Symbol.iterator]().next().value();

        /**
         * 使用递归生成器迭代每个节点
         */
        for (const node of traverse(firstNode)) {
          console.info(node);
          visitedNodes.add(node);
        }

        return visitedNodes.size === this.nodes.size;
      }
    }

    // 7.3.3 生成器作为默认迭代器
    // 因为生成器对象实现了 Iterable 接口，而且生成器函数和默认迭代器被调用之后都产生迭代器，所以生成器适合作为默认迭代器
    class Fooo {
      constructor() {
        this.values = [1, 2, 3];
      }

      /**
       * 注意里面的 * 不可遗漏
       */
      *[Symbol.iterator]() {
        yield* this.values;
      }
    }

    for (const x of new Fooo()) {
      console.info(x);
    }
    // 1
    // 2
    // 3

    // 7.3.4 提前终止生成器
    // 1. return()
    // return 方法会强制生成器进入关闭状态，return 的参数就是最终 value 的值
    /**
     * 用于 return 的方法案例
     */
    function *generateR() {
      yield* [1, 2, 3];
    }
    const gg = generateR();
    gg.next(); // {value: 1, done: false}
    gg.next(); // {value: 2, done: false}
    gg.return(100); // {value: 100, done: true}
    console.info(gg); // generateR {<closed>}

    // 和迭代器不同，每个生成器都有着 return 方法，且一旦调用后进入关闭状态，就无法恢复
    gg.next(); // {value: undefined, done: true}

    /**
     * 循环中终止的案例沿用上面的 generateR
     */
    const gForof = generateR();
    for (const x of gForof) {
      if (x > 1) {
        gForof.return(100)
      }
      console.info(x);
    }
    console.info(gForof); // generateR {<closed>}
    // 1
    // 2

    // 2. throw()
    // 它会在暂停的时候将一个提供的错误注入到生成器对象中，如果错误未处理，生成器就会关闭
    const gThrow = generateR();
    console.info(gThrow);

    try {
      gThrow.throw('foo');
    } catch (error) {
      console.info(error); // 'foo'
    }
    console.info(gThrow); // generateR {<closed>}

    // 假如生成器函数内部处理了这个错误，那么生成器就会跳过这个错误，继续执行(教程上解释)
    // 浏览器中实际执行结果表明， gTryCatch.throw 的返回值就是跳过的值
    /**
     * 这里用 try catch 来包裹
     */
    function *generateRWithTryCatch() {
      for (const x of [1, 2, 3]) {
        try {
          yield x;
        } catch (error) {
          console.info(error);
        }
      }
    }

    const gTryCatch = generateRWithTryCatch();
    // 首次调用
    gTryCatch.next(); // {value: 1, done: false}
    // 抛出异常
    gTryCatch.throw('foo'); // 打印出 foo 返回 {value: 2, done: false}
    // 再次调用
    gTryCatch.next(); // {value: 3, done: false}
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
