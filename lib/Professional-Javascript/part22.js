/******** 《JavaScript 高级程序设计》 ********/
/******** 22、高级技巧 ********/
import { EventUtil } from "./part13"

export default class Part22Senior {
  constructor() {

    // 22.1 高级函数

    // 22.1.1 安全的类型检测
    this.isArray()
    this.isFunction()
    this.isObject()
    this.isJSON()

    // 22.1.2 作用域安全的构造函数
    function Person(name, age, job) {
      this.name = name
      this.age = age
      this.job = job
    }
    let personA = new Person('bob', 29, 'doctor')
    // 这样的调用会导致属性挂在 window 上
    let personB = Person("bob", 29, "doctor")

    function Person2(name, age, job) {
      if (this instanceof Person2) {
        this.name = name
        this.age = age
        this.job = job
      } else {
        return new Person2(name, age, job)
      }
    }

    let personC = new Person2("bob", 29, "doctor")
    // 这时可以不用 new 操作符调用了
    let personD = Person2("bob", 29, "doctor")

    function Polygon(sides) {
      if (this instanceof Polygon) {
        this.sides = sides
        this.getArea = function () {
          return 0
        }
      } else {
        return new Polygon(sides)
      }
    }

    function Rectangle(width, height) {
      Polygon.call(this, 2)
      this.height = height
      this.width = width
      this.getArea = function () {
        return width * height
      }
    }

    let rect = new Rectangle(5, 10)
    console.info(rect) // output undefined
    // 因为 Rectangle 并不继承自 Polygon
    // 修改原型的方式来继承
    // 又称之为寄生组合
    Rectangle.prototype = new Polygon()
    let rectB = new Rectangle(5, 10)
    console.info(rect) // output 2

    // 22.1.3 惰性载入函数
    function createXHR() {
      if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest()
      } else if (typeof ActiveXObject !== 'undefined') {
        return new ActiveXObject()
      } else {
        throw new Error('No xhr object available')
      }
    }

    // 惰性载入函数 会覆盖原有函数，并且再次调用时不会重新进入 if 判断逻辑
    function createBetterXHR() {
      console.info('better creating XHR')
      if (typeof XMLHttpRequest !== 'undefined') {
        createBetterXHR = function () {
          return new XMLHttpRequest()
        }
      } else if (typeof ActiveXObject !== 'undefined') {
        createBetterXHR = function () {
          return new ActiveXObject()
        }
      } else {
        createBetterXHR = function () {
          throw new Error("No xhr object available")
        }
      }
      return createBetterXHR()
    }
    createBetterXHR() // output 'better creating XHR'
    // 第二次调用就直接返回了
    createBetterXHR() // output ''

    // 匿名、自执行函数的实现
    // 在初次执行时会牺牲些性能，但保证了后续的函数可以执行
    let createBetterXHR = (function () {
      console.info("creating second XHR")
      if (typeof XMLHttpRequest !== "undefined") {
        return function() {
          return new XMLHttpRequest()
        }
      } else if (typeof ActiveXObject !== "undefined") {
        return function() {
          return new ActiveXObject()
        }
      } else {
        return function() {
          throw new Error("No xhr object available")
        }
      }
    })()
    // output creating second XHR
    // 再次调用会直接返回 XHR 对象
    createBetterXHR2()

    // 22.1.4 函数绑定
    let handler = {
      message: 'hander',
      handleClick: function () {
        console.info(this.message)
      }
    }
    let btn = document.body.querySelector('.my-btn')
    EventUtil.addHandle(btn, 'click', handler.handleClick)
    // 点击后输出的 message 是 undefined
    // 因为此时 this 指向了 dom
    // 创建了一个闭包来保证 this 指向正确，这里调用方仍然是 handler
    EventUtil.addHandle(btn, 'click', function(event) {
      handler.handleClick(event)
    })

    // 使用自己实现的 bind 指定 this 的指向
    EventUtil.addHandle(btn, 'click', this.bind(handler.handleClick, handler))
    // 使用ES5 bind 指定 this 的指向
    EventUtil.addHandle(btn, 'click', bind(handler.handleClick, handler))

    // 22.1.5 函数柯里化
    // 演示如下
    this.add(1, 2) // output 3
    this.curriedAdd(3) // output 6

    this.newCurriedAdd = this.curry(add, 3)
    this.newCurriedAdd(4) // output 7

    // 或者这样使用
    this.newCurriedAdd2 = this.curry(add, 3, 4)
    this.newCurriedAdd2() // output 7

    // 或者使用现代版的
    this.modernCurriedAdd = this.modernCurry(add, 3, 4)
    this.modernCurriedAdd() // output 7

    // 22.2 防篡改对象
    // 22.2.1 不可扩展对象
    let personA = {
      name: 'bob'
    }
    // 默认可扩展
    personA.age = 24

    let personB = {
      name: 'kyrie'
    }
    // 设置为不可扩展
    Object.preventExtensions(personB)
    personB.age = 24
    console.info(personB.age) // output undefined
    // 但原有的属性可修改可删除
    personB.name = 'allen'
    console.info(personB.name) // output allen
    delete personB.name
    console.info(personB.name) // output undefined
    // 删除后不可再改变
    personB.name = 'allen'
    // 检查是否可扩展
    Object.isExtensible(personA) // false
    Object.isExtensible(personB) // false

    Object.isExtensible({}) // true

    // 22.2.2 密封的对象
    let anotherPersonA = {
      name: 'joel'
    }
    Object.seal(anotherPersonA)

    // 被密封后，属性的修改新增都是不生效的，在严格模式下甚至会报错
    anotherPersonA.age = 27
    console.info(anotherPersonA.age) // undefined

    delete anotherPersonA.name
    console.info(anotherPersonA.name) // joel 不可删除
    anotherPersonA.name = 'jojo'
    console.info(anotherPersonA.name) // jojo 但是是可修改的

    Object.isSealed(anotherPersonA) // true
    Object.isExtensible(anotherPersonA) // false 也是不可扩展的了

    // 22.2.3 冻结的对象
    // 最严格的防篡改级别
    let anotherPersonB = {
      name: 'ella'
    }
    Object.freeze(anotherPersonB)

    // 以下操作均是无效的
    anotherPersonB.age = 20
    delete anotherPersonB.name
    anotherPersonB.name = 'emily'

    Object.isFrozen(anotherPersonB) // true
    Object.isSealed(anotherPersonB) // true
    Object.isExtensible(anotherPersonB) // false

    // 级别排序，从严格到宽松
    // 冻结 > 密封 > 不可扩展

    // 22.3 高级定时器
    // 一个对定时器的重要理解是，定义了定时器之后，并不是在规定的时间后立即执行，
    // 而是在规定的时间后，将事件加入执行队列，具体要等待进程空闲后，才可以执行
    btn.onclick = function (event) {
      window.setTimeout(function (event) {
        btn.innerText = 'Hello'
      }, 2000)
    }
    // 例如以上这个例子，是在 onclick 事件加入队列后，在该事件执行后，再将定时器加入执行队列，
    // 再在定时时间后，将事件加入队列中等待执行

    // 22.3.1 重复的定时器
    // 为了避免定时器在空闲时执行，和后一次的间隔太短而错过时间差重复执行。
    // 定时器是在队列完全空闲后，而且没有定时器实例diamante执行时，才加入并开始执行
    // 为了避免 setInterval 执行过长可能会导致其中的某个实例跳过的情况，下面是解决方案
    // 还没有实践过
    window.setTimeout(() => {
      // do sth
      window.setTimeout(arguments.callee, timeout);
    }, timeout)

    // 以上的应用，移动 div ，直到符合条件
    window.setTimeout(() => {
      let div = document.querySelector('#myDiv')
      let left = window.parseInt(div.style.left) + 5

      div.style.left = left + 'px'

      if (left < 200) {
        window.setTimeout(arguments.callee, 50)
      }
    }, 50)

    // 22.3.2 Yielding processes
    // 最终目的是防止浏览器执行某个脚本时间过长而导致崩溃
    const longArr = [12, 345, 78, 123, 798, 23, 1, 9, 56]
    const printValue = (item) => {
      let myDiv = document.querySelector('#myDiv')
      myDiv.innerHTML += item + '<br/>'
    }
    this.chunk(longArr, printValue)
    // 防止原数组影响的写法
    this.chunk(longArr.concat(), printValue)

    // 22.3.3 函数节流
    const processor = {
      timeoutId: null,
      performProcessing: function (params) {
        // 实际执行的代码
      },
      // 初次执行的代码
      process: function () {
        window.clearTimeout(this.timeoutId)

        let that = this
        window.setTimeout(function () {
          that.performProcessing()
        })
      }
    }
    processor.process() // 执行
    // 简化后的代码
    // this.throttle()

    // 实现随着浏览器拖动，高度始终等于宽度
    window.onresize = function () {
      let myDiv = document.querySelector('#myDiv')
      myDiv.stye.height = myDiv.offsetWidth + 'px'
    }

    const resizeDiv = function () {
      let myDiv = document.querySelector('#myDiv')
      myDiv.stye.height = myDiv.offsetWidth + 'px'
    }

    // 能节约非常多的性能，减少了浏览器的回流
    window.onresize = function () {
      this.throttle(resizeDiv)
    }

    // 22.4 自定义事件






    // Access-Control-Allow-Origin
    // 21.4.2 其他浏览器对 CORS 的实现
    // 其他浏览器中的对象是直接支持的
    // 跨域的话，传入绝对 url
    this.absoluteUrl = "http://www.somewhere-else.com/pages/"
    this.sendXHRwithCORS('get', this.absoluteUrl)
    // 但有以下限制
    // 不能使用 setRequestHeader 自定义头部
    // 不能发送和接收 cookie
    // 调用 getAllResponseHeaders() 方法总会返回空字符串

    // 21.4.3 Preflighted Requests
    // 理解的预检请求
    // 请求头里包括以下参数
    // origin
    // Access-Control-Request-Method
    // Access-Control-Request-Headers
    // 响应头
    // Access-Control-Allow-Origin
    // Access-Control-Allow-Methods
    // Access-Control-Allow-Headers
    // Access-Control-Max-Age

    // 21.4.4 带凭据的请求
    // 设置 withCredentials 属性为 true
    // 如果服务器接受带凭据的请求，那么响应头里会返回
    // Access-Control-Allow-Credentials: true

    // 21.4.5 跨浏览器的 CORS
    this.sendXHRwithCORSEnhanced()

    // 21.5 其他跨域技术

    // 21.5.1 图像 Ping
    this.pingImg()
    // 其实可以用来处理页面埋点等需求，但现在很少这样做了

    // 21.5.2 JSONP
    this.handleJSONP()

    // 21.5.3 Comet
    // 现在几乎没有听说过了

    // 21.5.4 服务器发送事件
    // 同上

    // 21.5.5 Web Sockets
    let socket = new WebSocket('ws://www.example.com')
    socket.close()
    // 发送文本
    this.sendTextBySocket('hello')
    // 发送复杂对象需要先序列化
    this.sendDataBySocket({ name: 'bob' })

    // 接收到消息时处理的事件
    socket.onmessage = function (event) {
      console.info(event.data)
    }
    // 这个函数和下面的一个没有 event 对象的额外属性
    socket.onopen = function () {
      console.info('connection')
    }
    socket.onerror = function () {
      console.info('closing')
    }
    socket.onclose = function (event) {
      console.error('connect is error', event)
    }

    // 21.5.6 SSE 与 Web Sockets
    JSON.stringify(bookToJSON)

    // 21.6 安全
    // CSRF 攻击 跨站点请求伪造
    // 通常的解决方案
    // * 要求每次以 SSL 连接来访问可以通过 XHR 请求的资源
    // * 要求每一次请求都要附带经过相应算法计算得到的验证码
    // 使用 POST 请求替代 GET 是无效的
    // 检查来源 URL 是无效的 —— 容易伪造
    // 基于 Cookie 信息进行验证 —— 容易伪造

  }

  isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]'
  }

  isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]'
  }

  isJSON(value) {
    return Object.prototype.toString.call(value) === '[object JSON]'
  }

  isObject(value) {
    return Object.prototype.toString.call(value) === '[object ObjisObject]'
  }

  /**
   * 自己实现 bind 方法
   * @param {Function} fn
   * @param {Object} context
   */
  bind(fn, context) {
    return function () {
      return fn.apply(context, arguments)
    }
  }

  add(num1, num2) {
    return num1 + num2
  }

  curriedAdd(num) {
    return this.add(num, 3)
  }

  /**
   * 柯里化函数，注意这里需要返回 return
   * @param {Function} fn
   */
  curry(fn) {
    // 注意从第二个开始截取，因为第一个是 fn
    let args = Array.prototype.slice.call(arguments, 1)
    return function() {
      let innerArgs = Array.prototype.slice.call(arguments)
      let finalArgs = args.concat(innerArgs)
      return fn.apply(null, finalArgs)
    }
  }

  /**
   * 使用 ES6 重写柯里化函数
   * @param {Function} fn
   */
  modernCurry(fn) {
    let args = Array.from(arguments).slice(1)
    return function(...innerArgs) {
      let finalArgs = [...args, ...innerArgs]
      console.info(args, innerArgs, finalArgs, fn.toString())
      return fn(...finalArgs)
    }
  }

  /**
   * 数组分块调用的实现
   * @param {Array} arr
   * @param {Function} fn
   * @param {Object} context
   */
  chunk(arr, fn, context) {
    window.setTimeout(function () {
      let item = arr.unshift()
      fn.call(context, item)

      if (arr.length) {
        window.setTimeout(arguments.callee, 10)
      }
    }, 10)
  }

  /**
   * 函数节流
   * 常用在 onresize 方法中
   * @param {Function} fn
   * @param {Object} context
   * @param {Number} timer
   */
  throttle(fn, context, timer = 100){
    window.clearTimeout(fn.timeoutId)

    fn.timeoutId = window.setTimeout(() => {
      fn.call(context)
    }, timer)
  }

  /**
   * 设定可以设置超时的请求，其中超时回调时间可能在部分浏览器中不支持
   * @param {String} method
   * @param {Object} data
   * @param {Number} timeout
   * @param {Function} cb
   */
  sendXHRwithTimeout(method = 'get', data, timeout = 1000, cb) {
    let xhr = this.createXHR()
    xhr.onreadystatechange = function (xhr) {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
          console.info(xhr.responseText)
        } else {
          console.error('xhr was not successful')
        }
      }
    }
    xhr.open(method, 'getData.json', true)
    xhr.timeout = timeout
    xhr.ontimeout = cb || function (params) {
      console.info(params)
    }
    xhr.send(data)
  }

  addXHRListeners(xhr, handleEvent) {
    xhr = xhr || this.createXHR()
    xhr.addEventListener('loadstart', handleEvent)
    xhr.addEventListener('load', handleEvent)
    xhr.addEventListener('loadend', handleEvent)
    xhr.addEventListener('progress', handleEvent)
    xhr.addEventListener('error', handleEvent)
    xhr.addEventListener('abort', handleEvent)
  }

  sendXHRusingLoad(method = 'get', data) {
    let xhr = this.createXHR()
    xhr.onload = function (xhr) {
        console.info(xhr.responseText)
    }
    xhr.open(method, 'getData.json', true)
    xhr.timeout = timeout
    xhr.send(data)
  }

  /**
   *
   * @param {String} method
   * @param {Object} data
   * @param {Function} cb
   */
  sendXHRusingProgress(method = 'get', data, cb) {
    let xhr = this.createXHR()
    xhr.onload = function (xhr) {
        console.info(xhr.responseText)
    }
    xhr.open(method, 'getData.json', true)
    // 显示已加载的和总共的信息，数字格式
    xhr.onprogress = cb || function (event) {
      console.info('currentStatus', event.type)
      console.info(event, event.loaded, event.total)
    }
    xhr.send(data)
  }

  /**
   *
   * @param {String} method
   * @param {String} url
   * @param {*} data
   */
  sendXHRwithCORS(method = 'get', url = '', data = null) {
    let xhr = this.createXHR()
    xhr.onload = function (xhr) {
        console.info(xhr.responseText)
    }
    xhr.open(method, url, true)
    xhr.send(data)
  }

  /**
   * 兼容多个浏览器的跨域请求
   * @param {*} method
   * @param {*} url
   */
  createCORSRequest(method = '', url = '') {
    let xhr = new XMLHttpRequest()
    if ('withCredentials' in xhr) {
      xhr.open(method, url, true)
    } else if (typeof XDomainRequest !== "undefined") {
      xhr = new XDomainRequest()
      xhr.open(method, url)
    } else {
      xhr = null
    }
    return xhr
  }

  sendXHRwithCORSEnhanced() {
    let request = this.createCORSRequest('get', this.absoluteUrl)
    if (request) {
      request.onload = function () {
        console.info(request.responseText)
      }
      request.send(null)
    }
  }

  pingImg() {
    let img = new Image()
    img.onload = img.onerror = function(event) {
      console.info(res, event)
    }
    img.src = 'http://www.example.com'
  }

  handleJSONP() {
    function handleResponse(response) {
      console.info(response)
    }
    let script = document.createElement('script')
    script.src = 'http://example.com?callback=handleResponse'
    document.body.insertBefore(script, document.body.firstChild)
  }

  /**
   * 通过 socket 发送文本
   * @param {String} url
   * @param {String} text
   */
  sendTextBySocket(url = 'wx://www.example.com', text = '') {
    let socket = new WebSocket(url)
    socket.send(text)
  }

  /**
   * 通过 socket 发送复杂数据，注意需要先序列化
   * @param {String} url
   * @param {any} data
   */
  sendDataBySocket(url = 'wx://www.example.com', data = {}) {
    let socket = new WebSocket(url)
    socket.send(JSON.stringify(data))
  }
}
