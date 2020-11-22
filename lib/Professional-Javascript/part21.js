/******** 《JavaScript 高级程序设计》 ********/
/******** 21、Ajax 与 Comet ********/

export default class Part21Ajax {
  constructor() {

    // 21.1 XMLHttpRequest 对象
    let xhr = new XMLHttpRequest();

    // 21.1.1 XHR 的用法
    // 参数一：发送方式
    // 参数二：url 地址
    // 参数三：是否异步
    xhr.open('get', 'data.php', false);
    // open 方法不会真的发送请求，而是启动一个请求准备发送
    xhr.send(null); // 参数为数据，没有则最好设置成 null, 以适应浏览器的兼容性

    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
      console.info(xhr.responseText);
    } else {
      console.error('xhr was not successful');
    }

    // 发送异步请求
    this.handleXHR();

    // 取消请求
    xhr.abort();

    // 21.1.2 HTTP 头部信息
    // xhr.setRequestHeader 方法用来自定义请求头
    this.handleXHRwithHeader();

    // 获取某个自定义的相应头
    xhr.getResponseHeader('myHeader');
    // 获取所有的相应头，默认会返回多行文本
    xhr.getAllResponseHeaders();

    // 21.1.3 GET 请求
    // 注意转义编码
    let url = 'example.php';
    url = this.addURLParam(url, 'name', 'Nico');
    url = this.addURLParam(url, 'book', 'Professional');
    xhr.open('get', url, false);

    // 21.1.4 POST 请求
    // 发送数据前要先序列化

    // 21.2 XMLHttpRequest 2级
    // 21.2.1 FormData
    const formData = new FormData(document.forms[0]);
    // 这个数据是可以直接用以请求发送的，但不是所有浏览器都支持
    this.sendXHR('post', formData);

    // 21.2.2 超时设定
    // 设置请求超时时间，超过则取消发送
    this.sendXHRwithTimeout('get', {}, 3000);
    // 事件不一定支持，但设置超时在现代浏览器里是支持的

    // 21.2.3 overrideMimeType() 方法
    // 用于重写 MIME 类型

    // 21.3 进度事件
    // loadstart
    // progress
    // error
    // abort
    // load
    // loadend
    // 六个事件针对 XHR 对象操作，不过后来也被很多 API 借鉴
    this.addXHRListeners();

    // 21.3.1 load 事件
    // onload 事件其实就可以用来替代 onreadystatechange
    this.sendXHRWithLoadEvent();

    // 21.3.2 progress 事件
    // 在请求过程中持续回调的事件
    this.sendXHRWithProgress();

    // 21.4 跨源资源共享
    // Access-Control-Allow-Origin

    // 21.4.1 IE 对 CORS 的实现

    // 21.4.2 其他浏览器对 CORS 的实现
    // 其他浏览器中的对象是直接支持的
    // 跨域的话，传入绝对 url
    this.absoluteUrl = 'http://www.somewhere-else.com/pages/';
    this.sendXHRwithCORS('get', this.absoluteUrl);
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
    this.sendXHRwithCORSEnhanced();

    // 21.5 其他跨域技术

    // 21.5.1 图像 Ping
    this.pingImg();
    // 其实可以用来处理页面埋点等需求，但现在很少这样做了

    // 21.5.2 JSONP
    this.handleJSONP();

    // 21.5.3 Comet
    // 现在几乎没有听说过了

    // 21.5.4 服务器发送事件
    // 同上

    // 21.5.5 Web Sockets
    let socket = new WebSocket('ws://www.example.com');
    socket.close();
    // 发送文本
    this.sendTextBySocket('hello');
    // 发送复杂对象需要先序列化
    this.sendDataBySocket({ name: 'bob' });

    // 接收到消息时处理的事件
    socket.onmessage = function (event) {
      console.info(event.data);
    };
    // 这个函数和下面的一个没有 event 对象的额外属性
    socket.onopen = function () {
      console.info('connection');
    };
    socket.onerror = function () {
      console.info('closing');
    };
    socket.onclose = function (event) {
      console.error('connect is error', event);
    };

    // 21.5.6 SSE 与 Web Sockets
    // JSON.stringify(bookToJSON); // 不记得这里写了个什么

    // 21.6 安全
    // CSRF 攻击 跨站点请求伪造
    // 通常的解决方案
    // * 要求每次以 SSL 连接来访问可以通过 XHR 请求的资源
    // * 要求每一次请求都要附带经过相应算法计算得到的验证码
    // 使用 POST 请求替代 GET 是无效的
    // 检查来源 URL 是无效的 —— 容易伪造
    // 基于 Cookie 信息进行验证 —— 容易伪造
  }

  createXHR() {
    return new XMLHttpRequest();
  }

  /**
   * 发送一个完整的异步请求
   */
  handleXHR() {
    let xhr = this.createXHR();
    xhr.onreadystatechange = function (xhr) {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
          console.info(xhr.responseText);
        } else {
          console.error('xhr was not successful');
        }
      }
    };
    xhr.open('get', 'getData.json', true);
    xhr.send(null);
  }

  /**
   * 发送一个完整的异步请求，并且自定义请求头内容
   */
  handleXHRwithHeader(key = 'myHeader', value = 'myValue') {
    let xhr = this.createXHR();
    xhr.onreadystatechange = function (xhr) {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
          console.info(xhr.responseText);
        } else {
          console.error('xhr was not successful');
        }
      }
    };
    xhr.open('get', 'getData.json', true);
    // 调用顺序一定在 open 之后，send 之前
    xhr.setRequestHeader(key, value);
    xhr.send(null);
  }

  /**
   * 发送一个带数据的普通请求
   * @param {String} method
   * @param {Object} data
   */
  sendXHR(method = 'get', data = {}) {
    let xhr = this.createXHR();
    xhr.onreadystatechange = function (xhr) {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
          console.info(xhr.responseText);
        } else {
          console.error('xhr was not successful');
        }
      }
    };
    xhr.open(method, 'getData.json', true);
    xhr.send(data);
  }

  /**
   * 设定可以设置超时的请求，其中超时回调时间可能在部分浏览器中不支持
   * @param {String} method
   * @param {Object} data
   * @param {Number} timeout
   * @param {Function} cb
   */
  sendXHRwithTimeout(method = 'get', data, timeout = 1000, cb) {
    let xhr = this.createXHR();
    xhr.onreadystatechange = function (xhr) {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
          console.info(xhr.responseText);
        } else {
          console.error('xhr was not successful');
        }
      }
    };
    xhr.open(method, 'getData.json', true);
    xhr.timeout = timeout;
    xhr.ontimeout = cb || function (params) {
      console.info(params);
    };
    xhr.send(data);
  }

  addXHRListeners(xhr, handleEvent) {
    xhr = xhr || this.createXHR();
    xhr.addEventListener('loadstart', handleEvent);
    xhr.addEventListener('load', handleEvent);
    xhr.addEventListener('loadend', handleEvent);
    xhr.addEventListener('progress', handleEvent);
    xhr.addEventListener('error', handleEvent);
    xhr.addEventListener('abort', handleEvent);
  }

  sendXHRWithLoadEvent(method = 'get', data) {
    let xhr = this.createXHR();
    xhr.onload = function (xhr) {
      console.info(xhr.responseText);
    };
    xhr.open(method, 'getData.json', true);
    xhr.timeout = 1000;
    xhr.send(data);
  }

  /**
   *
   * @param {String} method
   * @param {Object} data
   * @param {Function} cb
   */
  sendXHRWithProgress(method = 'get', data, cb) {
    let xhr = this.createXHR();
    xhr.onload = function (xhr) {
      console.info(xhr.responseText);
    };
    xhr.open(method, 'getData.json', true);
    // 显示已加载的和总共的信息，数字格式
    xhr.onprogress = cb || function (event) {
      console.info('currentStatus', event.type);
      console.info(event, event.loaded, event.total);
    };
    xhr.send(data);
  }

  /**
   *
   * @param {String} method
   * @param {String} url
   * @param {*} data
   */
  sendXHRwithCORS(method = 'get', url = '', data = null) {
    let xhr = this.createXHR();
    xhr.onload = function (xhr) {
      console.info(xhr.responseText);
    };
    xhr.open(method, url, true);
    xhr.send(data);
  }

  /**
   * 兼容多个浏览器的跨域请求
   * @param {*} method
   * @param {*} url
   */
  createCORSRequest(method = '', url = '') {
    let xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest !== 'undefined') {
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      xhr = null;
    }
    return xhr;
  }

  sendXHRwithCORSEnhanced() {
    let request = this.createCORSRequest('get', this.absoluteUrl);
    if (request) {
      request.onload = function () {
        console.info(request.responseText);
      };
      request.send(null);
    }
  }

  pingImg() {
    let img = new Image();
    img.onload = img.onerror = function(event) {
      console.info(event);
    };
    img.src = 'http://www.example.com';
  }

  handleJSONP() {
    function handleResponse(response) {
      console.info(response);
    }
    let script = document.createElement('script');
    script.src = 'http://example.com?callback=handleResponse';
    document.body.insertBefore(script, document.body.firstChild);
  }

  /**
   * 通过 socket 发送文本
   * @param {String} url
   * @param {String} text
   */
  sendTextBySocket(url = 'wx://www.example.com', text = '') {
    let socket = new WebSocket(url);
    socket.send(text);
  }

  /**
   * 通过 socket 发送复杂数据，注意需要先序列化
   * @param {String} url
   * @param {any} data
   */
  sendDataBySocket(url = 'wx://www.example.com', data = {}) {
    let socket = new WebSocket(url);
    socket.send(JSON.stringify(data));
  }
}
