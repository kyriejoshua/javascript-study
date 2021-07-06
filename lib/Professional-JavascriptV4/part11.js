/******** 《JavaScript 高级程序设计》(第4版) ********/
/******** 11、 期约与异步函数 322-360 重点 ********/

const Part11PromiseAndAsync = () => {
  // 11.1 异步编程
  // 11.1.1 同步与异步
  // 同步行为对应内存中顺序执行的处理器指令
  // 每条指令都会严格按照它们出现的顺序来执行

  // 11.1.2 以往的异步编程模式
  /**
   * 一秒后输出值的双倍
   * settimeout 的第三个参数是提供给第一个函数的参数
   * @param {*} value
   */
  function double(value) {
    setTimeout(() => {
      setTimeout(console.info, 0, value * 2);
    }, 1000);
  }
  double(3); // 6

  // 1. 异步返回值
  // 传入回调函数来处理
  /**
   * 通过传入回调函数的方式来获取值
   * @param {*} value
   * @param {*} callback
   */
  function double2(value, callback) {
    setTimeout(() => {
      callback(value * 2)
    }, 1000);
  }
  double2(3, (val) => console.info(`I was given ${val}`)); // I was given 6

  // 2. 失败处理
  // 需要同时处理成功和失败的场景
  /**
   * 分别传入成功和失败的回调
   * @param {*} value
   * @param {*} success
   * @param {*} failure
   */
  function doubleWithFailure(value, success, failure) {
    setTimeout(() => {
      try {
        if (typeof value !== "number") {
          throw new Error('value must be number');
        }
        success(value * 2);
      } catch (error) {
        failure(error);
      }
    }, 1000);
  }
  const successCallback = (x) => console.info('success: ' + x);
  const failureCallback = (e) => console.info('failure: ' + e);
  doubleWithFailure(4, successCallback, failureCallback);
  doubleWithFailure('da', successCallback, failureCallback);

  // 3. 嵌套异步回调（会导致回调地狱）
  /**
   * 分别传入成功和失败的回调
   * @param {*} value
   * @param {*} success
   * @param {*} failure
   */
  function doubleWithMore(value, success, failure) {
    setTimeout(() => {
      try {
        if (typeof value !== "number") {
          throw new Error('value must be number');
        }
        success(value * 2);
      } catch (error) {
        failure(error);
      }
    }, 1000);
  }
  // 相当于再次乘以 2
  const successCallbackMore = (x) => {
    doubleWithMore(x, (y) => console.info('success: ' + y));
  };
  const failureCallbackMore = (e) => console.info('failure: ' + e);
  // 这里有个有趣的现象要注意，这里连续的调用，但是最终会先输出后面的抛出异常的结果
  // 推断是因为前者因为进入的成功的回调，再次触发了异步回调，这个新创建的宏任务会在后续执行
  doubleWithMore(3, successCallbackMore, failureCallbackMore); // 输出 12
  doubleWithMore('da', successCallbackMore, failureCallbackMore);
  // 因为异常捕获先输出，所以先打印出错误
  // failure: Error: value must be number
  // success: 12

  // 11.2 期约
  // 11.2.1 Promise/A+规范
  // 目前主流遵循的是 Promise/A+ 规范，从 CommonJs fork 而来
  const Promises = () => {
    // 11.2.2 期约基础
    // ES6 新增的引用类型，通过 new 操作符来实例化；
    // 创建时需要传入执行器函数作为参数，这是个必传的参数
    let p = new Promise(() => {});
    setTimeout(console.info, 0, p);

    // 不传参数会报错
    new Promise(); // Uncaught TypeError: Promise resolver undefined is not a function

    // 1. 期约状态机
    // 待定 pending 初始状态
    // 兑现 fulfilled(又称为 resolved 状态)
    // 拒绝 rejected

    // 任何状态的变更都是不可逆的
    // 同时期约的状态是私有的，外部无法访问

    // 2. 解决值、拒绝理由及期约用例
    // 纯阅读

    // 3. 通过执行函数控制期约状态
    // 执行器函数的两个参数，可以用来改变期约状态
    // 通常命名为 resolve 和 reject
    let p1 = new Promise((resolve) => resolve());
    setTimeout(console.info, 0, p1); // Promise fulfilled

    let p2 = new Promise((resolve, reject) => reject());
    setTimeout(console.info, 0, p2); // Promise fulfilled

    new Promise(() => setTimeout(console.info, 0, 'executor'));
    setTimeout(console.info, 0, 'proimse initialized');
    // 打印顺序
    // executor
    // proimse initialized

    // 可以使用 settimeout 来推迟状态
    new Promise((resolve) => setTimeout(resolve, 1000));

    // * 已修改的状态无法再次修改
    // 已修改的状态再次修改会静默失败
    new Promise((resolve, reject) => {
      resolve();
      reject(); // 静默失败，没有效果
    });

    // 五秒后抛出异常，两种实现
    // 普通实现，不够完善
    let pWithFiveSecondError = (callback) => new Promise((resolve, reject) => {
      setTimeout(reject, 5000);
      callback(resolve);
    });
    pWithFiveSecondError(() => setTimeout(console.info, 7000, 123123));

    // race 实现
    /**
     * 利用 race 的特性来实现
     * @param {*} callback
     * @returns
     */
    function pWithFiveSecondErrorRace(callback) {
      return Promise.race([new Promise(callback), new Promise((resolve, reject) => setTimeout(reject, 5000))]);
    }
    pWithFiveSecondErrorRace(() => setTimeout(console.info, 7000, 123123));

    // 4. Promise.resolve()
    // 普通的 Proimse 需要执行器函数中的参数来改变状态
    // 而静态类方法则可以直接实例化落定状态
    // 它可以包装任何值

    // 下面两行实际是一样的
    new Promise((resolve, reject) => resolve());
    Promise.resolve();

    setTimeout(console.info, 0, Promise.resolve(3, 4, 5)); // 多余参数会被忽略
    // fulfilled: 3

    // 如果传入的参数本身是期约，那它的行为就类似于空包装，可以说是一个幂等方法
    let littleP = Promise.resolve(7);
    littleP === Promise.resolve(littleP); // true 是相等的

    // 这个静态方法可以包装任何值，包括错误；所以有时甚至会返回不符合预期的行为
    Promise.resolve(new Error('promise error'));
    // fulfilled: promise error

    Promise.resolve(Symbol(123));

    // 5. Promise.reject()
    // 它可以实例化一个拒绝的期约，并抛出一个异步错误
    // 下面两个本质上也是一样的
    new Promise((resolve, reject) => reject());
    Promise.reject();

    // 但如果使用它来包装期约对象，这个期约会成为它返回的拒绝期约的理由
    Promise.reject(Promise.resolve(87));

    // 6. 同步/异步执行的二元性
    try {
      throw new Error('normal error')
    } catch (error) {
      console.info(error)
    }
    // normal error

    try {
      Promise.reject(new Error('promise error'));
    } catch (error) {
      console.info(error)
    }
    // 并不会抛出常规的异常
    // 拒绝期约的消息是通过浏览器异步消息队列来处理的
    // 代码一旦以异步模式执行，则唯一与之交互的方式就是使用异步结构——也就是期约的方法

    // 11.2.3 期约的实例方法
    // 1. 实现 Thenable 接口
    // 实现这一接口的最简单的类
    class MyThenable {
      then() {

      }
    }
    // 而 Promise 类实现了 Thenable 接口

    // 2. Promise.prototype.then()
    // 该方法接收两个参数， onResolved 处理程序和 onRejected 处理程序
    // 这两者都是可选的，分别在期约进入兑现和拒绝状态时执行，而且这两者是互斥的
    function onResolved(id) {
      setTimeout(console.info, 0, id, 'resolved');
    }
    function onRejected(id) {
      setTimeout(console.info, 0, id, 'rejected');
    }
    let p1then = new Promise((resolve) => setTimeout(resolve, 1000));
    let p2then = new Promise((resolve, reject) => setTimeout(reject, 1000));

    p1then.then(() => onResolved('p1'), () => onRejected('p1'));
    p2then.then(() => onResolved('p2'), () => onRejected('p2'));
    // 按顺序输出
    // p1 resolved
    // p2 rejected

    // 传入非函数处理程序会静默失败，因此不推荐
    // 会被忽略
    p1then.then('skdfh');

    // 不传 onResolved 的规范写法
    p2then.then(null, onRejected);
    // 1s 后 rejected

    // Promise.prototype.then() 方法返回一个新的期约实例
    let newP1 = new Promise(() => {});
    let newP2 = newP1.then();
    setTimeout(console.info, 0, newP1); // Promise {<pending>}
    setTimeout(console.info, 0, newP2); // Promise {<pending>}

    // 如果后续不传值，则把值原样往后传
    let newP1resolved = Promise.resolve('foo');
    let newP2resolved = newP1resolved.then(); // Promise {<fulfilled>: 'foo'}

    // 如果有显式的返回值，则 Promise.resolve 会包装这个值
    let newP1resolvedEveryTime = Promise.resolve('foo'); // Promise {<fulfilled>: 'foo'}
    let newP2resolvedEveryTime = newP1resolvedEveryTime.then(() => 'bar'); // Promise {<fulfilled>: 'bar'}
    let newP3resolvedEveryTime = newP2resolvedEveryTime.then(() => Promise.resolve('bar')); // Promise {<fulfilled>: 'bar'}

    // 抛出异常会返回拒绝的期约
    let p10 = newP1resolved.then(() => { throw 'baz'; });
    setTimeout(console.info, 0, p10); // Promise {<rejected>: "baz"}

    // 如果返回错误值不会触发上面的拒绝行为，而会把错误对象包装在一个解决的期约中
    let p11 = newP1resolved.then(() => Error('qux'));
    setTimeout(console.info, 0, p11); // Promise {<fulfilled>: Error "qux"}

    // onRejected 的行为和 onResolved 极其相似
    // 原样向后传值 这点和 resolve 行为一致
    let newP1rejected = Promise.reject('foo');
    let newP2rejected = newP1rejected.then(); // Promise {<rejected>: "foo"}

    // 其他行为也都一致
    let newP1rejectedEveryTime = Promise.reject('fn'); // Promise {<rejected>: 'fn'}
    // 但要注意这里没有抛出异常 所以返回是 resolved
    let newP2rejectedEveryTime = newP1rejectedEveryTime.then(null, () => 'bar'); // Promise {<fulfilled>: 'bar'}
    let newP3rejectedEveryTime = newP2rejectedEveryTime.then(null, () => Promise.resolve('bar')); // Promise {<fulfilled>: 'bar'}

    // 抛出异常会返回拒绝的期约
    let p10rejected = newP1rejected.then(null, () => { throw 'baz';});
    setTimeout(console.info, 0, p10); // Promise {<rejected>: "baz"}

    // 如果返回错误值不会触发上面的拒绝行为，而会把错误对象包装在一个解决的期约中
    let p11rejected = newP1rejected.then(null, () => Error('qux'));
    setTimeout(console.info, 0, p11); // Promise {<fulfilled>: Error "qux"}

    // 3. Promise.prototype.catch()
    // 它就相当于 Promise.prototype.then(null, onRejected)
    // Promise.prototype.catch 返回一个新的期约实例，这点与 Promise.prototype.then 类似

    // 4. Promise.prototype.finally()
    // 给期约添加 onFinally 处理程序
    // 这个处理程序在期约转换为解决或拒绝状态时都会执行 但它不知道期约状态时解决还是拒绝

    // 大多数情况下它表现为只是父期约的传递
    let newP1finally = Promise.resolve('finally passed');
    let newP2finally = newP1finally.finally(); // Promise {<fulfilled>: "finally passed"}
    let newP3finally = newP1finally.finally(() => {}); // Promise {<fulfilled>: "finally passed"}
    let newP4finally = newP1finally.finally(() => undefined); // Promise {<fulfilled>: "finally passed"}
    let newP5finally = newP1finally.finally(() => 'bar'); // Promise {<fulfilled>: "finally passed"}
    let newP6finally = newP1finally.finally(() => Promise.resolve('bar')); // Promise {<fulfilled>: "finally passed"}
    let newP7finally = newP1finally.finally(() => Error('qux')); // Promise {<fulfilled>: "finally passed"}

    // 返回待定期约时，状态可能会变化是落定的或者拒绝
    // 创建一个待返回的期约
    let p9 = Promise.resolve('foo').finally(() => new Promise(() => {}));
    // 抛出异常
    let p99 = Promise.resolve('foo').finally(() => Promise.reject()); // Promise {<rejected>: undefined}
    // 要注意这里初始传入的需要时落定状态的，否则就会在浏览器运行和教材上不一致 并没有出现 rejected 状态，像下面传入的是 pending 状态，那么最后也还是 pending 状态
    // p9.finally(() => Promise.reject()); // Promise {<rejected>: undefined}
    // 状态是拒绝的
    let p999 = newP1resolved.finally(() => { throw 'abc' }); // Promise {<rejected>: "abc"}

    // 5. 非重入期约方法
    // 当期约进入落定状态时，与该状态相关的处理程序仅仅会被排期，而非立即执行
    // 创建已解决的期约
    let pReload = Promise.resolve();

    // 添加解决处理程序
    // 直觉上，这个处理程序会等期约一解决就执行
    pReload.then(() => console.info('onresolved handler'));

    // 同步输出，证明 return 已经返回
    console.info('then() returns');
    // 执行顺序会是
    // then() returns
    // onresolved handler
    // 其实涉及到事件循环中微任务，发现第二个 Promise 时，会将其加入微任务队列里，在主任务执行过后，再次执行微任务队列内的内容
    // 这里的主任务就是 console.info

    // 先添加处理程序后解决期约也是一样的，下面是案例
    let syncchronousResolve;
    let pReload2 = new Promise((resolve) => {
      syncchronousResolve = function () {
        console.info('1: invoking resolve()');
        resolve();
        console.info('2: resolve() returns');
      }
    });

    pReload2.then(() => console.info('4: then() handler executes'));

    console.info('3: syncchronouseResolve() returns');

    // 最终会按顺序输出 1 2 3 4

    // 这节所说的非重入也完全适用于 catch 和 finally
    let pReloadRejected = Promise.reject();
    pReloadRejected.catch(() => console.info('catch() rejected'));
    console.info('catch() returns');
    // catch() returns
    // catch() rejected

    let pReloadRejectedFinally = Promise.reject();
    pReloadRejectedFinally.finally(() => console.info('finally() rejected'));
    console.info('finally() returns');
    // finally() returns
    // finally() rejected

    // 6. 邻近处理程序的执行顺序
    // 如果给期约添加了多个处理程序，当期约状态变化时，相关处理程序会按照添加它们的顺序依次执行
    let pOrderResolve1 = Promise.resolve();
    let pOrderReject1 = Promise.reject();

    pOrderResolve1.then(() => setTimeout(console.info, 0, 1));
    pOrderResolve1.then(() => setTimeout(console.info, 0, 2));

    pOrderReject1.then(null, () => setTimeout(console.info, 0, 3));
    pOrderReject1.then(null, () => setTimeout(console.info, 0, 4));

    pOrderReject1.catch(() => setTimeout(console.info, 0, 5));
    pOrderReject1.catch(() => setTimeout(console.info, 0, 6));

    pOrderResolve1.finally(() => setTimeout(console.info, 0, 7));
    pOrderResolve1.finally(() => setTimeout(console.info, 0, 8));

    // 依次输出 1 2 3 4 5 6 7 8

    // 7. 传递解决值和拒绝理由
    // 接口调用常用到，第一个接口的返回作为第二个请求的参数
    let pResolveFoo = Promise.resolve('foo');
    pResolveFoo.then((val) => console.info(val)); // foo

    let pResolveBar = Promise.reject('bar');
    pResolveBar.catch((val) => console.info(val)); // bar

    // finally 不会传递到， 不论是落定还是拒绝
    // 个人理解是有错误的也有落定的，它不确定要处理哪一个；而且 finally 本质上是设计成不关心状态的
    let pResolveFoo1 = Promise.resolve('bar');
    pResolveFoo1.finally((val) => console.info(val)); // undefined

    let pResolveBar1 = Promise.reject('bar');
    pResolveBar1.finally((val) => console.info(val)); // undefined

    // 8. 拒绝期约与拒绝错误处理
    // 拒绝期约可以用任何理由，甚至是 undefined; 但是推荐统一使用**错误对象**来拒绝期约；
    // 这样在浏览器的错误堆栈信息中就可以查到相关的栈追踪信息，它们对调试起到关键的作用
    new Promise((resolve, reject) => reject(Error('foo 1')));
    new Promise(() => { throw Error('foo 2') });
    Promise.resolve().then(() => { throw Error('foo 3') });
    Promise.reject(Error('foo 4'));

    // 会按顺序输出下面的内容 3 最后输出是因为相当于放在了第二个 promise 里
    // Uncaught (in promise) Error: foo 1
    //   at <anonymous>:1:57
    //   at new Promise (<anonymous>)
    //   at <anonymous>:1:17

    // Uncaught (in promise) Error: foo 2
    //   at <anonymous>:2:47
    //   at new Promise (<anonymous>)
    //   at <anonymous>:2:21
    // Uncaught (in promise) Error: foo 4
    //   at <anonymous>:4:36

    // Uncaught (in promise) Error: foo 3
    //   at <anonymous>:3:58

    // 需要注意的是期约的错误处理不是同步的，使用 try catch 无法捕获，也不会阻塞主任务进程的运行
    // 类似上面的解释，它本质上是进入到了微任务之中，并不在主任务进程里

    // 11.2.4 期约连锁与期约合成
    // 1. 期约连锁
    // 链式调用
    // 核心是因为每个期约实例，不管是 then() 还是 catch() 还是 finally() 都会返回一个新的期约实例
    // 注意其实 finally 也会返回新的期约实例，也就是说其实在 finally() 之后还是可以调用的
    let pChain = Promise.resolve('foo');
    pChain.then(() => 'resolved').finally(() => 'finally').then((res) => console.info(res, 'then after finally'));
    // resolved then after finally
    // finally 里既不接收值，也不返回值（返回了但是没有效果） 它仍然会将 resolved 的值传递下去

    /**
     * 生成期约的工厂函数
     * @param {*} str
     * @returns
     */
    function delayedResolve(str) {
      return new Promise((resolve) => {
        console.info(str);
        setTimeout(resolve, 1000);
      })
    }

    delayedResolve('p1')
      .then(() => delayedResolve('p2'))
      .then(() => delayedResolve('p3'))
      .then(() => delayedResolve('p4'));
    // 每隔一秒依次输出 p1 p2 p3 p4

    // 2. 期约图
    // 构建有向非循环图
    //     A
    //    / \
    //   B   C
    //  / \ / \
    // D   E   F

    // TODO 遍历二叉树
    /**
     * 翻转二叉树
     * @param {*} rootNode
     * @returns
     */
    function traverse(rootNode) {
      if (Array.isArray(rootNode.left || rootNode.right)) {
        rootNode.left && traverse(rootNode.left);
        rootNode.right && traverse(rootNode.right);
        let temp = rootNode.right;
        rootNode.right = rootNode.left;
        rootNode.left = temp;
      }
      return rootNode;
    }

    // 3. Promise.all 和 Promise.race
    // * Promise.all
    // 接收**可迭代对象**作为参数
    // 如果参数不是可迭代对象，会抛出错误
    Promise.all(); // 抛出 rejected 错误 Promise {<rejected>: TypeError: undefined is not iterable

    // 如果传入的不是 Promise 实例，则会使用 Promise.resolve 来包装
    Promise.all(1, 2, 3); // Promise {<fulfilled>: Array(3)}

    // 打印出来，可以发现返回的是数组
    Promise.all(['str', { name: 'job' }]).then((res) => console.info(res));
    // [
    //   "str",
    //   {
    //     "name": "job"
    //   }
    // ]

    // Promise.all 中如有一个返回 rejected，则合成的期约状态是拒绝
    Promise.all([Promise.resolve(1), Promise.reject('rejected')]); // 此时返回的 rejected 值不再是数组
    // Promise {<rejected>: "rejected"}

    // Promise.all 中如有一个状态是待定，则合成的期约状态是待定
    Promise.all([Promise.resolve(1), new Promise(() => {})]); // 此时返回的也不再是数组
    // Promise {<pending>}

    // 如果传入参数中有两个 rejected 拒绝，则后一个拒绝会被静默忽略，会直接传递首个拒绝理由
    Promise.all([Promise.reject('first'), Promise.reject('after')]).then((res) => console.info(res));
    // Promise {<rejected>: "first"}

    // 如果两个拒绝，则后一个是否会执行？确认是会执行的,只不过不会返回到 Promise.all 的返回值里
    Promise.all([Promise.reject('first'), new Promise((resolve, reject) => {
      setTimeout(() => {
        console.info('err');
        reject('1s after err');
      }, 1000);
    })]).then((res) => console.info(res));

    // * Promise.race
    // 接收可迭代参数作为参数
    // 如果参数不是可迭代对象，则会抛出错误
    // 抛出的异常也是 promise 异常
    Promise.race(); // Promise {<rejected>: TypeError: undefined is not iterable

    // 只要有任意一个 Promise 处于落定或拒绝状态，则返回这个 Promise
    // 这是 resolve 的
    Promise.race([new Promise(() => {}), Promise.resolve('123')]); // Promise {<fulfilled>: "123"}
    // 这是 rejected 的
    Promise.race([new Promise(() => {}), Promise.reject('rejected')]); // // Promise {<rejected>: "rejected"}

    // 迭代顺序决定了落定顺序
    Promise.race([1, 2, 3, 4]); // 1

    // 同样，如果传入非 Promise 的实例，则会用 Promise.resolve 包装一层
    Promise.race(['race', 321]); // Promise {<fulfilled>: "race"}

    // 同样，如果有多个拒绝的实例，后面的拒绝会被静默忽略
    Promise.race([Promise.reject('first rejected'), Promise.reject('second rejected'), Promise.reject('last rejected')])
      .then((res) => console.info(res)); // Promise {<rejected>: "first rejected"}

    // 4. 串行期约的合成
    function addTwo(x) {
      return x + 2;
    }

    function addThree(x) {
      return x + 3;
    }

    function addFive(x) {
      return x + 5;
    }

    // 可以使用 promise 的链式调用来实现串行
    function addTen(x) {
      return Promise.resolve(x).then(addTwo).then(addThree).then(addFive);
    }
    addTen(3); // Promise {<fulfilled>: 13}

    // 还可以使用更简便的方式
    /**
     * 使用 reduce 实现 Promise 串行(自己实现)
     * 其实它并没有通过 promise
     * @param {*} x
     * @returns
     */
    function reduceAddTenBySelf(x) {
      return [addTwo, addThree, addFive].reduce((c, fn) => fn(c), x);
    }
    reduceAddTenBySelf(5); // 15 注意这里不是 promise 的值

    /**
     * 教科书版本 Promise 串行
     * 真正使用了 promise 来实现
     * @param {*} x
     * @returns
     */
    function reduceAddTen(x) {
      return [addTwo, addThree, addFive].reduce((promise, fn) => promise.then(fn), Promise.resolve(x));
    }
    reduceAddTen(5); // Promise {<fulfilled>: 15}

    /**
     * 可以直接串行执行期约
     * @param {*} initial 初始值
     * @param {*} promises
     * @returns
     */
    function reducePromises(initial, promises) {
      return promises.reduce((promise, fn) => promise.then(fn), Promise.resolve(initial));
    }
    reducePromises(1, [addTwo, addThree, addFive]); // Promise {<fulfilled>: 11}

    /**
     * 更抽象的通用函数 函数式的
     * 传入可迭代的 promises, 返回一个新函数
     * @param {*} promises 可迭代的 promise
     * @returns
     */
    function composePromise(promises) {
      return (x) => promises.reduce((promise, fn) => promise.then(fn), Promise.resolve(x));
    }
    const composeTen = composePromise([addTwo, addThree, addFive]);
    composeTen(3); // Promise {<fulfilled>: 13}

    // 11.2.5 期约扩展
    // 1. 期约取消
    /**
     * 往页面上塞入按钮，便于操作
     */
    function addNodes() {
      let startDiv = document.createElement('div');
      startDiv.id = 'start-btn';
      startDiv.innerHTML = 'START';
      let cancelDiv = document.createElement('div');
      cancelDiv.id = 'cancel-btn';
      cancelDiv.innerText = 'CANCEL';
      document.body.appendChild(startDiv);
      document.body.appendChild(cancelDiv);
    }
    addNodes();

    const startBtn = document.body.querySelector('#start-btn');
    const cancelBtn = document.body.querySelector('#cancel-btn');

    /**
     * 实现一个类，支持取消功能
     */
    class CancelToken {
      constructor(cancelFn) {
        this.promise = new Promise((resolve, reject) => {
          console.info(cancelFn, 'cancelFn')
          cancelFn(() => {
            setTimeout(console.info, 0, 'delay cancelled');
            resolve();
          })
        })
      }
    }

    /**
     * 返回一个可取消的 promise
     * @param {*} delay
     * @returns
     */
    function cancellableDelayedResolve(delay) {
      setTimeout(console.info, 0, 'set delay');

      return new Promise((resolve, reject) => {
        const id = setTimeout(() => {
          setTimeout(console.info, 0, 'delay resolved');
          resolve();
        }, delay);

        const cancelToken = new CancelToken((cancelCallback) => {
          cancelBtn.addEventListener('click', cancelCallback);
        });

        // 使用取消定时器来实现取消
        cancelToken.promise.then(() => clearTimeout(id));
      });
    }

    // 如果在点下 start 按钮的五秒钟内，点击了 cancel 按钮，则事件将会取消，否则继续执行
    // 连续点击，会注册多个事件，每次都是新的，分别对应不同的函数，导致取消时会有多个提示
    startBtn.addEventListener('click', () => cancellableDelayedResolve(5000));

    // 初始 log
    // set delay
    // 如果五秒内没有点击 cancel
    // delay resolved
    // 如果五秒内点了 cancel
    // delay cancelled

    // 本质上还是通过取消  setTimeout 的方式来取消
    /**
     * 更直观的取消，规定在多少时间内，如果没有实现就取消
     * ❌ 这个方式只能取消 settimeout 不能取消 promise
     * @param {*} promise
     * @param {*} delay
     * @returns
     */
    function cancellablePromise(promise, delay) {
      return new Promise((resolve, reject) => {
        console.info('start invoking');
        const promiseId = setTimeout(promise, 0, resolve);
        setTimeout(() => {
          console.info('promise canceled');
          clearTimeout(promiseId);
        }, delay);
      });
    }
    const promiseCancel = new Promise((resolve) => {
      setTimeout(() => {
        console.info('promise resolved');
        resolve();
      }, 10000);
    });

    // 执行一个十秒的 promise，但在五秒时将其取消（失败）
    cancellablePromise(promiseCancel, 5000);

    /**
     * 传入一个三秒就报错的 promise
     */
    const promiseRejected = new Promise((resolve, reject) => {
      setTimeout(reject, 3000, 'rejected');
    });

    // 直观的方式是这样，会先得到三秒报错的结果，但实际上也无法取消
    let promiseCatchReject = Promise.race([promiseCancel, promiseRejected]);
    console.info(promiseCatchReject); // Promise {<rejected>: "rejected"}
    // 这里的 promiseCatchReject 得到的就是报错的内容，而不是 promiseCancel 的内容

    // 2. 期约进度通知
    // 通过扩展 Promise 类的方式
    class TrackablePromise extends Promise {
      constructor(executor) {
        const notifyListeners = [];
        super((resolve, reject) => {
          return executor(resolve, reject, (status) => {
            notifyListeners.map((handler) => handler(status));
          });
        });
        this.notifyListeners = notifyListeners;
      }

      /**
       * 注册事件
       * @param {*} listener
       * @returns 返回当前对象，以支持链式调用
       */
      notify(listener) {
        this.notifyListeners.push(listener);
        return this;
      }
    }

    const trackablePromise = new TrackablePromise((resolve, reject, notify) => {
      /**
       * 实现一个计数器，每隔一秒输出进度
       * @param {*} x
       */
      function countDown(x) {
        if (x > 0) {
          notify(`${20 * x}% remaining`);
          setTimeout(() => {
            countDown(x - 1)
          }, 1000);
        } else {
          resolve();
        }
      }

      countDown(5);
    });

    // 每隔一秒就会输出进度
    trackablePromise.notify((x) => setTimeout(console.info, 0, 'progress:', x));
    // 最后输出完成
    trackablePromise.then(() => setTimeout(console.info, 0, 'completed'));
    // progress: 80% remaining
    // progress: 60% remaining
    // progress: 40% remaining
    // progress: 20% remaining
    // completed

    // 重新生成一个，避免与上一个重复
    const anotherTrackablePromise = new TrackablePromise((resolve, reject, notify) => {
      /**
       * 实现一个计数器，每隔一秒输出进度
       * @param {*} x
       */
      function countDown(x) {
        if (x > 0) {
          notify(`${20 * x}% remaining`);
          setTimeout(() => {
            countDown(x - 1)
          }, 1000);
        } else {
          resolve();
        }
      }

      countDown(5);
    });

    // 因为 return 了 this, 所以也支持链式调用
    anotherTrackablePromise.notify((x) => setTimeout(console.info, 0, 'a:', x))
      .notify((x) => setTimeout(console.info, 0, 'b:', x));
    // 这里相当于是定义了两个独立的事件，因此输出也是独立计算的
    // a: 80% remaining
    // b: 80% remaining
    // a: 60% remaining
    // b: 60% remaining
    // a: 40% remaining
    // b: 40% remaining
    // a: 20% remaining
    // b: 20% remaining

    // 打印出 resolve 的内容，这里没有，是 undefined
    anotherTrackablePromise.then((res) => console.info(res));

    // ES6 暂时不支持取消和进度通知期约，主要是因为这样会导致合成期约和期约连锁过度复杂化
    // 也就是避免 Promise.all 和 Promise.race 过度复杂化
  }

  Promises();

  // 11.3 异步函数
  // 是在 ES8 中新增的
  // 这是为了解决要使用 promise 中的值只能在回调中使用的问题

  // 可以定义函数来处理异步问题，只是这种解决方案不够彻底
  function handle(x) {
    // do sth
    console.info(x)
  }
  Promise.resolve(123).then(handle);

  // 11.3.1 异步函数
  const AsyncFn =  () => {
    // 1. async 关键字
    // 添加 async 关键字来使得函数变成异步函数
    async function asyncFn() {
      console.info('async');
    }

    // 异步函数会返回 resolve 状态的 promise
    // 如果返回值不是 promise 实例，则会使用 Promise.resolve 进行包装成 Promise 实例
    console.info(asyncFn()); // Promise {<fulfilled>: undefined}
    async function asyncNumber() {
      return 123;
    }
    console.info(asyncNumber()); // Promise {<fulfilled>: 123}
    async function asyncString() {
      return 'string';
    }
    console.info(asyncString()); // Promise {<fulfilled>: 'string'}

    async function asyncPromise() {
      return Promise.resolve('resolve');
    }
    console.info(asyncPromise()); // Promise {<fulfilled>: 'resolve'}

    // 如果在其中抛出异常，则会返回 reject 的 promise
    async function asyncThrow() {
      throw 3;
    }
    console.info(asyncThrow()); // Promise {<rejected>: 3}

    // 异步函数的返回值期待（但不强制）一个实现 thenable 接口的对象
    // 返回原始值
    async function asyncFoo() {
      return 'foo';
    }
    asyncFoo().then(console.info); // foo

    async function asyncBaz() {
      return ['baz'];
    }
    asyncBaz().then(console.info); // ['baz']

    /**
     * 返回了一个实现了 thenable 接口的非期约对象
     * @returns 可以显式的指定返回值
     */
    async function asyncBar() {
      const thenable = {
        then(callback) { callback('bar 123') }
      }
      return thenable;
    }
    asyncBar().then(console.info); // bar 123

    async function asyncCatch() {
      Promise.reject(2);
    }
    // 拒绝期约的值不会被异步函数捕获，最终会将值继续传递
    asyncCatch().catch(console.info); // 2

    // 2. await
    // await 用来暂停异步函数中代码的执行，等到 Promise resolve 之后，再继续执行
    let p = new Promise((resolve) => setTimeout(resolve, 1000, 1000));
    p.then(console.info);

    // 重写上面的 等价于上面的内容
    async function newP() {
      let p = new Promise((resolve) => setTimeout(resolve, 1000, 1000));
      console.info(await p);
    }
    newP();

    // await 关键字会暂停执行异步函数后面的代码，让出 JS 运行时的执行线程
    // 这个行为与生成器函数中的 yield 关键字是一样的
    // await 与 JS 的一元操作符一样，可以单独使用，也可以在表达式中使用
    async function foo() {
      console.info(await Promise.resolve('foo'));
    }
    foo();

    // 同样的 await 也期待实现 thenable 接口的对象，但是不强制
    // 等待一个原始值
    async function awaitNumber() {
      console.info(await 312);
    }
    awaitNumber(); // 312

    /**
     * 实现 thenable 的非期约对象
     * @param {*} params
     */
    async function awaitThen() {
      const thenableFn = {
        then(callback) { callback('then') }
      }
      console.info(await thenableFn)
    }
    awaitThen(); // then

    /**
     * 等待会抛出错误的同步操作，会返回拒绝的期约
     * @param {*} params
     */
    async function awaitThrow() {
      console.info(await (() => { throw 3 })());
    }
    awaitThrow(); // Promise {<rejected>: 3}

    // 给返回的期约添加一个拒绝处理程序
    awaitThrow().then(null, console.info); // 3

    async function awaitThrowCatch() {
      await Promise.reject(34);
      console.info(4); // 这行代码不会执行
    }
    awaitThrowCatch(); // Promise {<rejected>: 34}

    // 3.await 的限制
    // await 关键字必须在 async 异步函数内使用，不能在顶级上下文如 script 标签或模块中使用
    // 自执行函数是没问题的
    (async function () {
      return await 'callback';
    })(); // Promise {<fulfilled>: "callback"}

    // 个人理解，必须在顶层的函数作用域内，且必须是定义了 async 的当前函数
    async function fooCatch() {
      return () => {
        await 123;
      }
    }
    fooCatch(); // Uncaught SyntaxError: await is only valid in async functions and the top level bodies of modules
    // 报错信息也比较直接明了
    // 不管是同步函数或者同步函数表达式或者是同步的箭头函数都不行

    // 11.3.2 停止和恢复执行
    // 一个不太符合直觉的案例，定义三个异步函数并依次执行
    async function fooOrder() {
      console.info(await Promise.resolve('foo'));
    }
    async function barOrder() {
      console.info(await 'bar');
    }
    async function bazOrder() {
      console.info('baz');
    }
    fooOrder();
    barOrder();
    bazOrder();
    // 依次输出 这里书籍上的内容有些落后，实际是下面的结果
    // baz
    // foo
    // bar
    // 使用 Promise.resolve 封装不影响顺序输出
    // 在没有使用 await 关键字的时候，其实异步函数就是普通的函数，只是它返回了 promise
    // 从这里的 bazOrder 优先输出结果可以看出来

    // * JS运行时在碰到 await 关键字时，会记录在哪里暂停执行 等到 await 右边的值可用了，JS 会向消息队列中推送一个任务
    // * 这个任务会恢复异步函数的执行
    async function awaitSth() {
      console.info(2);
      await null;
      console.info(4);
    }
    console.info(1);
    awaitSth();
    console.info(3);
    // 依次输出 1 2 3 4
    // 个人理解， await 就相当于把当前任务转化成微任务，然后推送到了微任务队列中，等到主进程中的所有任务执行完成后，执行微任务队列里的任务

    // 如果其中涉及到 promise ，可以参照上面的案例
    async function awaitPromise() {
      console.info(2);
      console.info(await Promise.resolve(6));
      console.info(7);
    }

    async function awaitNumbers() {
      console.info(4);
      console.info(await 8);
      console.info(9);
    }

    console.info(1);
    awaitPromise();
    console.info(3);
    awaitNumbers();
    console.info(5);
    // 依次输出 1-9 书籍上的定义较落后不准确
    // 这里不论是 promise 封装或者是直接使用 await，效果是等同的
    // 个人理解，都进入了微任务队列中，等主任务执行完成后才会再次执行

    // 11.3.3 异步函数策略
    // 1. 实现 sleep
    function sleep(delay) {
      return new Promise((resolve) => setTimeout(resolve, delay));
    }
    /**
     * 睡眠一定时间
     * @param {*} delay
     */
    async function sleepSometime(delay) {
      const t0 = Date.now();
      await sleep(delay);
      console.info(`${Date.now() - t0} time`);
    }
    sleepSometime(1000); // 1003 time
    sleepSometime(5000); // 5005 time
    // 略有误差，可以理解为执行任务的时间差

    // 2. 利用平行执行
    /**
     * 随机延时
     * @param {*} id
     * @returns
     */
    function randomDelay(id) {
      const delay = Math.random() * 1000;
      return new Promise((resolve) => setTimeout(() => {
        console.info(id + ' finished');
        resolve();
      }, delay));
    }
    async function randomFoo() {
      const t0 = Date.now();
      await randomDelay('f1');
      await randomDelay('f2');
      await randomDelay('f3');
      await randomDelay('f4');
      await randomDelay('f5');
      console.info(Date.now() - t0 + 'ms');
    }
    randomFoo();
    // 依次输出
    // f1 finished
    // f2 finished
    // f3 finished
    // f4 finished
    // f5 finished
    // 1791ms

    /**
     * 可以用 for 循环重写
     */
    async function randomFooByFor() {
      const t0 = Date.now();
      for (let index = 0; index < 5; index++) {
        await randomDelay(index);
      }
      console.info(Date.now() - t0 + 'ms');
    }
    randomFooByFor();
    // 0 finished
    // 1 finished
    // 2 finished
    // 3 finished
    // 4 finished
    // 3023ms 这个时间不具有参考性，只是体现了本次随机时间的总和

    // 打乱顺序的平行执行
    // 如果没有强制要求顺序，可以先一次性初始化所有期约，然后再分别等待他们的结果
    /**
     * 与上面核心的区别是多用了一层 settimeout 包装
     * @param {*} id
     * @returns
     */
    async function randomDelayIds(id) {
      const delay = Math.random() * 1000;
      return new Promise((resolve) => setTimeout(() => {
        setTimeout(console.info, 0, id + ' finished', delay + 'ms');
        resolve();
      }, delay));
    }

    /**
     * 注意执行 await 时是将对应的 promise 推入微任务的顺序
     * 实际顺序取决于 delay 的值，因此最后得到的顺序是打乱的
     * 可以参见打印出的 delay 值
     */
    async function randomFooIds() {
      const t0 = Date.now();
      const p0 = randomDelayIds(0);
      const p1 = randomDelayIds(1);
      const p2 = randomDelayIds(2);
      const p3 = randomDelayIds(3);
      const p4 = randomDelayIds(4);

      await p0;
      await p1;
      await p2;
      await p3;
      await p4;

      // 最后这个异步操作，个人理解是为了保证打印的时间肯定比 await 内部的 setTimeout 时间更晚
      setTimeout(console.info, 0, Date.now()  - t0 + 'ms');
    }

    randomFooIds();
    // 4 finished
    // 1 finished
    // 3 finished
    // 2 finished
    // 0 finished
    // 830ms

    /**
     * 使用 for of 循环来简写
     * @param {*} params
     */
    async function randomFooIdsByForOf() {
      const t0 = Date.now();
      const promises = new Array(5).fill(null).map((_, i) => randomDelayIds(i));

      for (const p of promises) {
        await p;
      }

      setTimeout(console.info, 0, Date.now()  - t0 + 'ms');
    }
    randomFooIdsByForOf();
    // 和上述是类似的结果
    // 1 finished
    // 4 finished
    // 3 finished
    // 2 finished
    // 0 finished
    // 833ms

    // 上面的两个案例的打印结果是乱序的，但 await 的执行是顺序的，以下方法可以证明
    /**
     * 把 id resolve 以供打印
     * @param {*} id
     */
    async function randomDelayId(id) {
      const delay = Math.random() * 1000;

      return new Promise((resolve) => {
        return setTimeout(() => {
          console.info(id + ' finished', delay + 'ms');
          resolve(id);
        }, delay);
      })
    }

    /**
     * 数组方法比较简易的创建了 proimses 数组
     */
    async function randomFooIdsByForOfOrder() {
      const t0 = Date.now();
      const promises = new Array(5).fill(null).map((_, i) => randomDelayId(i));

      for (const p of promises) {
        console.info(`await ${await p}`);
      }

      setTimeout(console.info, 0, Date.now() - t0 + 'ms');
    }
    randomFooIdsByForOfOrder();
    // 执行是按顺序的 会夹在在下面的结果中间
    // await 0
    // await 1
    // await 2
    // await 3
    // await 4
    // 只是结果是随机的，这里就不罗列的，只要知道是随机即可

    // 3. 串行执行期约
    // await 实现 addTen
    function addTwo(x) {
      return x + 2;
    }

    function addThree(x) {
      return x + 3;
    }

    function addFive(x) {
      return x + 5;
    }
    /**
     * for 循环实现
     * @param {*} x
     * @returns
     */
    async function addTen(x) {
      let addsFn = [addTwo, addFive, addThree];
      for (let index = 0; index < addsFn.length; index++) {
        const fn = addsFn[index];
        x = await fn(x)
      }
      return x;
    }

    /**
     * for of 循环实现
     * @param {*} x
     * @returns
     */
    async function addTenOf(x) {
      let addsFn = [addTwo, addFive, addThree];
      for (const fn of addsFn) {
        x = await fn(x)
      }
      return x;
    }

    /**
     * 剩余参数实现
     * @param {*} x
     * @param  {...any} fns 多个函数作为参数
     * @returns
     */
    async function addTenByRest(x, ...fns) {
      for (const fn of fns) {
        x = await fn(x);
      }
      return x;

    }
    const addTenRes = addTen(3); // Promise {<fulfilled>: 13}
    const addTenResOf = addTenOf(5); // Promise {<fulfilled>: 15}
    const addTenResRest = addTenByRest(10, addTwo, addThree, addFive); // Promise {<fulfilled>: 20}
    addTenRes.then(console.info); // 13
    addTenResOf.then(console.info); // 15
    addTenResRest.then(console.info); // 20

    // 4. 栈追踪和内存管理
    function fooPromiseExecutor(resolve, reject) {
      setTimeout(reject, 1000, 'bar');
    }

    function fooByPromise() {
      new Promise(fooPromiseExecutor);
    }

    fooByPromise();
    // 调用栈顺序
    // static:1 Uncaught (in promise) bar;
    // setTimeout (async)
    // fooPromiseExecutor	@	VM466:2
    // fooByPromise	@	VM466:6
    // (anonymous)	@	VM466:9

    function fooPromiseExecutor(resolve, reject) {
      setTimeout(reject, 1000, 'bar');
    }

    async function fooByAsync() {
      await new Promise(fooPromiseExecutor);
    }
    fooByAsync();
    // static:1 Uncaught (in promise) bar;
    // fooByAsync	@	VM944:8
    // async function (async)
    // fooByAsync	@	VM944:7
    // (anonymous)	@	VM944:9
  }

  AsyncFn();
}

export default Part11PromiseAndAsync;
