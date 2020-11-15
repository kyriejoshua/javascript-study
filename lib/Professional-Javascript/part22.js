/******** 《JavaScript 高级程序设计》 ********/
/******** 22、高级技巧 ********/
import { EventUtil } from './part13';
import { inheritPrototype } from './part6';

export default class Part22Senior {
  constructor() {

    // 22.1 高级函数

    // 22.1.1 安全的类型检测
    this.isArray();
    this.isFunction();
    this.isObject();
    this.isJSON();

    // 22.1.2 作用域安全的构造函数
    function Person(name, age, job) {
      this.name = name;
      this.age = age;
      this.job = job;
    }
    let personA = new Person('bob', 29, 'doctor');
    // 这样的调用会导致属性挂在 window 上
    let personB = Person('bob', 29, 'doctor');

    function Person2(name, age, job) {
      if (this instanceof Person2) {
        this.name = name;
        this.age = age;
        this.job = job;
      } else {
        return new Person2(name, age, job);
      }
    }

    let personC = new Person2('bob', 29, 'doctor');
    // 这时可以不用 new 操作符调用了
    let personD = Person2('bob', 29, 'doctor');

    function Polygon(sides) {
      if (this instanceof Polygon) {
        this.sides = sides;
        this.getArea = function () {
          return 0;
        };
      } else {
        return new Polygon(sides);
      }
    }

    function Rectangle(width, height) {
      Polygon.call(this, 2);
      this.height = height;
      this.width = width;
      this.getArea = function () {
        return width * height;
      };
    }

    let rect = new Rectangle(5, 10);
    console.info(rect); // output undefined
    // 因为 Rectangle 并不继承自 Polygon
    // 修改原型的方式来继承
    // 又称之为寄生组合
    Rectangle.prototype = new Polygon();
    let rectB = new Rectangle(5, 10);
    console.info(rect); // output 2

    // 22.1.3 惰性载入函数
    function createXHR() {
      if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
      } else if (typeof ActiveXObject !== 'undefined') {
        return new ActiveXObject();
      } else {
        throw new Error('No xhr object available');
      }
    }

    // 惰性载入函数 会覆盖原有函数，并且再次调用时不会重新进入 if 判断逻辑
    function createBetterXHR() {
      console.info('better creating XHR');
      if (typeof XMLHttpRequest !== 'undefined') {
        createBetterXHR = function () {
          return new XMLHttpRequest();
        };
      } else if (typeof ActiveXObject !== 'undefined') {
        createBetterXHR = function () {
          return new ActiveXObject();
        };
      } else {
        createBetterXHR = function () {
          throw new Error('No xhr object available');
        };
      }
      return createBetterXHR();
    }
    createBetterXHR(); // output 'better creating XHR'
    // 第二次调用就直接返回了
    createBetterXHR(); // output ''

    // 匿名、自执行函数的实现
    // 在初次执行时会牺牲些性能，但保证了后续的函数可以执行
    const createBetterXHR2 = (function () {
      console.info('creating second XHR');
      if (typeof XMLHttpRequest !== 'undefined') {
        return function() {
          return new XMLHttpRequest();
        };
      } else if (typeof ActiveXObject !== 'undefined') {
        return function() {
          return new ActiveXObject();
        };
      } else {
        return function() {
          throw new Error('No xhr object available');
        };
      }
    })();
    // output creating second XHR
    // 再次调用会直接返回 XHR 对象
    createBetterXHR2();

    // 22.1.4 函数绑定
    let handler = {
      message: 'hander',
      handleClick: function () {
        console.info(this.message);
      }
    };
    let btn = document.body.querySelector('.my-btn');
    EventUtil.addHandle(btn, 'click', handler.handleClick);
    // 点击后输出的 message 是 undefined
    // 因为此时 this 指向了 dom
    // 创建了一个闭包来保证 this 指向正确，这里调用方仍然是 handler
    EventUtil.addHandle(btn, 'click', function(event) {
      handler.handleClick(event);
    });

    // 使用自己实现的 bind 指定 this 的指向
    EventUtil.addHandle(btn, 'click', this.bind(handler.handleClick, handler));
    // 使用ES5 bind 指定 this 的指向
    EventUtil.addHandle(btn, 'click', this.bind(handler.handleClick, handler));

    // 22.1.5 函数柯里化
    // 演示如下
    this.add(1, 2); // output 3
    this.curriedAdd(3); // output 6

    this.newCurriedAdd = this.curry(this.add, 3);
    this.newCurriedAdd(4); // output 7

    // 或者这样使用
    this.newCurriedAdd2 = this.curry(this.add, 3, 4);
    this.newCurriedAdd2(); // output 7

    // 或者使用现代版的
    this.modernCurriedAdd = this.modernCurry(this.add, 3, 4);
    this.modernCurriedAdd(); // output 7

    // 22.2 防篡改对象
    // 22.2.1 不可扩展对象
    let personA1 = {
      name: 'bob'
    };
    // 默认可扩展
    personA1.age = 24;

    let personB1 = {
      name: 'kyrie'
    };
    // 设置为不可扩展
    Object.preventExtensions(personB1);
    personB1.age = 24;
    console.info(personB1.age); // output undefined
    // 但原有的属性可修改可删除
    personB1.name = 'allen';
    console.info(personB1.name); // output allen
    delete personB1.name;
    console.info(personB1.name); // output undefined
    // 删除后不可再改变
    personB1.name = 'allen';
    // 检查是否可扩展
    Object.isExtensible(personA1); // false
    Object.isExtensible(personB1); // false

    Object.isExtensible({}); // true

    // 22.2.2 密封的对象
    let anotherPersonA = {
      name: 'joel'
    };
    Object.seal(anotherPersonA);

    // 被密封后，属性的修改新增都是不生效的，在严格模式下甚至会报错
    anotherPersonA.age = 27;
    console.info(anotherPersonA.age); // undefined

    delete anotherPersonA.name;
    console.info(anotherPersonA.name); // joel 不可删除
    anotherPersonA.name = 'jojo';
    console.info(anotherPersonA.name); // jojo 但是是可修改的

    Object.isSealed(anotherPersonA); // true
    Object.isExtensible(anotherPersonA); // false 也是不可扩展的了

    // 22.2.3 冻结的对象
    // 最严格的防篡改级别
    let anotherPersonB = {
      name: 'ella'
    };
    Object.freeze(anotherPersonB);

    // 以下操作均是无效的
    anotherPersonB.age = 20;
    delete anotherPersonB.name;
    anotherPersonB.name = 'emily';

    Object.isFrozen(anotherPersonB); // true
    Object.isSealed(anotherPersonB); // true
    Object.isExtensible(anotherPersonB); // false

    // 级别排序，从严格到宽松
    // 冻结 > 密封 > 不可扩展

    // 22.3 高级定时器
    // 一个对定时器的重要理解是，定义了定时器之后，并不是在规定的时间后立即执行，
    // 而是在规定的时间后，将事件加入执行队列，具体要等待进程空闲后，才可以执行
    btn.onclick = function () {
      window.setTimeout(function () {
        btn.innerText = 'Hello';
      }, 2000);
    };
    // 例如以上这个例子，是在 onclick 事件加入队列后，在该事件执行后，再将定时器加入执行队列，
    // 再在定时时间后，将事件加入队列中等待执行

    // 22.3.1 重复的定时器
    // 为了避免定时器在空闲时执行，和后一次的间隔太短而错过时间差重复执行。
    // 定时器是在队列完全空闲后，而且没有定时器实例diamante执行时，才加入并开始执行
    // 为了避免 setInterval 执行过长可能会导致其中的某个实例跳过的情况，下面是解决方案
    // 还没有实践过
    function timeoutFn(timeout) {
      window.setTimeout(() => {
        // do sth
        window.setTimeout(arguments.callee, timeout);
      }, timeout);
    }

    // 以上的应用，移动 div ，直到符合条件
    window.setTimeout(() => {
      let div = document.querySelector('#myDiv');
      let left = window.parseInt(div.style.left) + 5;

      div.style.left = left + 'px';

      if (left < 200) {
        window.setTimeout(arguments.callee, 50);
      }
    }, 50);

    // 22.3.2 Yielding processes
    // 最终目的是防止浏览器执行某个脚本时间过长而导致崩溃
    const longArr = [12, 345, 78, 123, 798, 23, 1, 9, 56];
    const printValue = (item) => {
      let myDiv = document.querySelector('#myDiv');
      myDiv.innerHTML += item + '<br/>';
    };
    this.chunk(longArr, printValue);
    // 防止原数组影响的写法
    this.chunk(longArr.concat(), printValue);

    // 22.3.3 函数节流
    const processor = {
      timeoutId: null,
      performProcessing: function () {
        // 实际执行的代码
      },
      // 初次执行的代码
      process: function () {
        window.clearTimeout(this.timeoutId);

        let that = this;
        window.setTimeout(function () {
          that.performProcessing();
        });
      }
    };
    processor.process(); // 执行
    // 简化后的代码
    // this.throttle()

    // 实现随着浏览器拖动，高度始终等于宽度
    window.onresize = function () {
      let myDiv = document.querySelector('#myDiv');
      myDiv.stye.height = myDiv.offsetWidth + 'px';
    };

    const resizeDiv = function () {
      let myDiv = document.querySelector('#myDiv');
      myDiv.stye.height = myDiv.offsetWidth + 'px';
    };

    // 能节约非常多的性能，减少了浏览器的回流
    window.onresize = function () {
      this.throttle(resizeDiv);
    };

    // 22.4 自定义事件(观察者模式)
    // 具体定义见下文，这里是调用
    let target = new EventTarget();
    // 注册事件
    target.addHandler('message', handleMessage);
    // 调用事件
    target.fire({ type: 'message', message: 'Hello World' });
    // 移除事件
    target.removeHandler('message', handleMessage);
    // 再次调用，没有事件响应
    target.fire({ type: 'message', message: 'Hello World again'});

    // 其他方法也可以继承这个方式 这里新增了一个人
    let personE = new PersonEvent('micky', 29);
    // 这里添加事件
    personE.addHandler('message', anotherHandleMessage);
    // 最终达到调用的效果
    personE.say('Hi there');
    // 这里其实是将创建人和调用方法最终解耦 使得代码更易维护

    // 22.5 拖放
    // 最简易的例子
    EventUtil.addHandle(document, 'mousemove', (event) => {
      let myDiv = document.getElementById('myDiv');
      myDiv.style.left = event.clientX + 'px';
      myDiv.style.top = event.clientY + 'px';
    });
    // 稍稍复杂的例子 需要元素的样式支持
    // <div class="draggable" style="position: absolute; width: 100px; height: 100px; background: yellow"></div>
    DragDrop.enable(); // 已验证

    // 22.5.2 修缮拖动功能
    DragDropEnhanced.enable(); // 已验证

    // 22.5.3 自定义事件
    // 将上面的观察者模式绑定下面的拖拽，结合起来实现
    // 将会打印出每次拖动时所有的运动轨迹
    // <div id="status"></div>
    DragDropEvent.addHandler('dragstart', function (event) {
      let status = document.getElementById('status');
      status.innerHTML = 'Started dragging ' + event.target.id;
    });

    DragDropEvent.addHandler('drag', function (event) {
      let status = document.getElementById('status');
      status.innerHTML += `<br/> Dragged ${event.target.id} to (${event.x}, ${event.y})`;
    });

    DragDropEvent.addHandler('dragend', function (event) {
      let status = document.getElementById('status');
      status.innerHTML += `<br/> Drapped ${event.target.id} at (${event.x}, ${event.y})`;
    });
    // codepen 体验链接
    // https://codepen.io/kyriejoshua/pen/dyMPoNq?editors=1111
  }

  isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]';
  }

  isJSON(value) {
    return Object.prototype.toString.call(value) === '[object JSON]';
  }

  isObject(value) {
    return Object.prototype.toString.call(value) === '[object ObjisObject]';
  }

  /**
   * 自己实现 bind 方法
   * @param {Function} fn
   * @param {Object} context
   */
  bind(fn, context) {
    return function () {
      return fn.apply(context, arguments);
    };
  }

  add(num1, num2) {
    return num1 + num2;
  }

  curriedAdd(num) {
    return this.add(num, 3);
  }

  /**
   * 柯里化函数，注意这里需要返回 return
   * @param {Function} fn
   */
  curry(fn) {
    // 注意从第二个开始截取，因为第一个是 fn
    let args = Array.prototype.slice.call(arguments, 1);
    return function() {
      let innerArgs = Array.prototype.slice.call(arguments);
      let finalArgs = args.concat(innerArgs);
      return fn.apply(null, finalArgs);
    };
  }

  /**
   * 使用 ES6 重写柯里化函数
   * @param {Function} fn
   */
  modernCurry(fn) {
    let args = Array.from(arguments).slice(1);
    return function(...innerArgs) {
      let finalArgs = [...args, ...innerArgs];
      console.info(args, innerArgs, finalArgs, fn.toString());
      return fn(...finalArgs);
    };
  }

  /**
   * 数组分块调用的实现
   * @param {Array} arr
   * @param {Function} fn
   * @param {Object} context
   */
  chunk(arr, fn, context) {
    window.setTimeout(function () {
      let item = arr.unshift();
      fn.call(context, item);

      if (arr.length) {
        window.setTimeout(arguments.callee, 10);
      }
    }, 10);
  }

  /**
   * 函数节流
   * 常用在 onresize 方法中
   * @param {Function} fn
   * @param {Object} context
   * @param {Number} timer
   */
  throttle(fn, context, timer = 100){
    window.clearTimeout(fn.timeoutId);

    fn.timeoutId = window.setTimeout(() => {
      fn.call(context);
    }, timer);
  }
}

/**
 * 自定义事件
 */
function EventTarget() {
  this.handlers = {};
}

EventTarget.prototype = {
  constructor: EventTarget,
  /**
   * 添加事件
   * @param {*} type
   * @param {*} handler
   */
  addHandler: function (type, handler) {
    if (typeof this.handlers[type] === 'undefined') {
      this.handlers[type] = [];
    }
    this.handlers[type].push(handler);
  },
  /**
   * 触发事件
   * @param {*} event
   */
  fire: function (event) {
    if (!event.target) {
      event.target = this;
    }
    if (this.handlers[event.type] instanceof Array) {
      const handlers = this.handlers[event.type];
      for (let index = 0; index < handlers.length; index++) {
        const currentHandler = handlers[index];
        currentHandler(event);
      }
    }
  },
  /**
   * 移除事件
   * @param {*} type
   * @param {*} handler
   */
  removeHandler: function (type, handler) {
    if (this.handlers[type] instanceof Array) {
      let handlers = this.handlers[type];
      for (var index = 0; index < handlers.length; index++) {
        const currentHandler = handlers[index];
        if (currentHandler === handler) {
          break;
        }
      }
      handlers.splice(index, 1);
    }
  }
};

/**
 * 一个普通的事件处理程序
 * @param {*} event
 */
function handleMessage(event) {
  window.alert('message received: ' + event.message);
}

/**
 * 其他方法可以继承以上事件
 * @param {*} name
 * @param {*} age
 */
function PersonEvent(name, age) {
  EventTarget.call(this);
  this.name = name;
  this.age = age;
}

inheritPrototype(PersonEvent, EventTarget);

PersonEvent.prototype.say = function(message) {
  this.fire({ type: 'message', message });
};

/**
 * 还是一个普通的事件处理程序
 * @param {*} event
 */
function anotherHandleMessage(event) {
  window.alert(event.target.name + 'says: ' + event.message);
}

/**
 * 一个完整且简易的拖拽事件实现
 * 一个单例
 * 按住拖动，松手放开
 */
export const DragDrop = (function () {
  let dragging = null;

  function handleEvent(event) {
    event = EventUtil.getEvent(event);
    let target = EventUtil.getTarget(event);

    switch (event.type) {
    case 'mousedown':
      if (target.className.indexOf('draggable') > -1) {
        dragging = target;
      }
      break;
    case 'mousemove':
      if (dragging !== null) {
        dragging.style.top = event.clientY + 'px';
        dragging.style.left = event.clientX + 'px';
      }
      break;
    case 'mouseup':
      dragging = null;
      break;
    }
  }

  return {
    enable: function() {
      EventUtil.addHandle(document, 'mousemove', handleEvent);
      EventUtil.addHandle(document, 'mouseup', handleEvent);
      EventUtil.addHandle(document, 'mousedown', handleEvent);
    },
    disable: function() {
      EventUtil.removeHandle(document, 'mousemove', handleEvent);
      EventUtil.removeHandle(document, 'mouseup', handleEvent);
      EventUtil.removeHandle(document, 'mousedown', handleEvent);
    }
  };
})();

/**
 * 一个完整且优化的拖拽事件实现
 * 按住拖动，松手放开
 */
export const DragDropEnhanced = (function () {
  let dragging = null;
  let diffX = 0;
  let diffY = 0;

  function handleEvent(event) {
    event = EventUtil.getEvent(event);
    let target = EventUtil.getTarget(event);

    switch (event.type) {
    case 'mousedown':
      if (target.className.indexOf('draggable') > -1) {
        dragging = target;
        diffX = event.clientX - target.offsetLeft;
        diffY = event.clientY - target.offsetTop;
      }
      break;
    case 'mousemove':
      if (dragging !== null) {
        dragging.style.top = (event.clientY - diffY) + 'px';
        dragging.style.left = (event.clientX - diffX) + 'px';
      }
      break;
    case 'mouseup':
      dragging = null;
      break;
    }
  }

  return {
    enable: function() {
      EventUtil.addHandle(document, 'mousemove', handleEvent);
      EventUtil.addHandle(document, 'mouseup', handleEvent);
      EventUtil.addHandle(document, 'mousedown', handleEvent);
    },
    disable: function() {
      EventUtil.removeHandle(document, 'mousemove', handleEvent);
      EventUtil.removeHandle(document, 'mouseup', handleEvent);
      EventUtil.removeHandle(document, 'mousedown', handleEvent);
    }
  };
})();

/**
 * 一个完整的例子
 * 结合观察者模式
 */
export const DragDropEvent = (function () {
  let dragDrop = new EventTarget();
  let dragging = null;
  let diffX = 0;
  let diffY = 0;

  function handleEvent(event) {
    event = EventUtil.getEvent(event);
    let target = EventUtil.getTarget(event);

    switch (event.type) {
    case 'mousedown':
      if (target.className.indexOf('draggable') > -1) {
        dragging = target;
        diffX = event.clientX - target.offsetLeft;
        diffY = event.clientY - target.offsetTop;
        dragDrop.fire({ type: 'dragstart', target: dragging, x: event.clientX, y: event.clientY });
      }
      break;
    case 'mousemove':
      if (dragging !== null) {
        dragging.style.top = (event.clientY - diffY) + 'px';
        dragging.style.left = (event.clientX - diffX) + 'px';
        dragDrop.fire({ type: 'drag', target: dragging, x: event.clientX, y: event.clientY });
      }
      break;
    case 'mouseup':
      dragDrop.fire({ type: 'drag', target: dragging, x: event.clientX, y: event.clientY });
      dragging = null;
      break;
    }
  }

  dragDrop.enable = function () {
    EventUtil.addHandle(document, 'mousemove', handleEvent);
    EventUtil.addHandle(document, 'mouseup', handleEvent);
    EventUtil.addHandle(document, 'mousedown', handleEvent);
  };
  dragDrop.disable = function () {
    EventUtil.removeHandle(document, 'mousemove', handleEvent);
    EventUtil.removeHandle(document, 'mouseup', handleEvent);
    EventUtil.removeHandle(document, 'mousedown', handleEvent);
  };

  return dragDrop;
})();
