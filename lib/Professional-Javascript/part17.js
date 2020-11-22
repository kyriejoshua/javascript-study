/******** 《JavaScript 高级程序设计》 ********/
/******** 17、错误处理与调试 ********/
import { EventUtil } from './part13';

export default class Part17Catch {
  constructor() {

    // 17.1 浏览器报告的错误
    // 17.1.1 IE
    // 17.1.2 Firefox
    // 17.1.3 Safari
    // 17.1.4 Opera
    // 17.1.5 Chrome
    // 这里罗列的调试，举例的版本都有些老了，略过

    // 17.2 错误处理
    // 17.2.1 try-catch
    // 与 java 中的语法完全相同
    try {
      window.someNonexistentFunction();
    } catch (error) {
      console.info(error.message);
    }

    this.testFinally();

    // 17.2.2 抛出错误
    this.CustomError.prototype = new Error();
    // throw new this.CustomError('just a message');

    this.process();
    this.processEnhance();

    // 17.2.3 错误 (error) 事件
    this.registerErrorEvent();
    this.preventErrorEvent();

    this.handleImageError();

    // 17.2.4 处理错误的策略
    // 耐心解决问题，搞清楚什么时候，会出什么错误

    // 17.2.5 常见的错误类型
    // 类型转换错误
    this.concatString();
    this.concatStringEnhance();
    this.getQueryString('http://mdn.com?search=input');

    let url = 'http://somedomain.com';
    let name = 'search';
    let value = 'html5';
    this.addQueryStringArg(url, name, value);

    // 17.2.6 区分致命错误和非致命错误

    // 17.2.7 把错误记录到服务器
    try {
      throw new Error('just a Error');
    } catch (error) {
      this.logError('nonfatal', error.message);
    }

    // 17.3 调试技术

    // 17.3.1 将消息记录到控制台

    // 17.3.2 将消息记录到当前页面
    this.log('error message');
    // 在浏览器上查看效果

    // 17.3.3 抛出错误
    this.divide(1, null);

    // 17.4 常见的 IE 错误
    // 17.4.1 操作终止 (IE 8 之前)
    // 17.4.2 无效字符
    // 17.4.3 未找到成员

    // 17.4.4 未知运行时错误
    // 块级元素插入到行内元素时，在 IE 下会报错，在其他浏览器里，浏览器会尝试纠正并隐藏错误（怎么个纠正法这里没说）
    // span.innerHTML = '<div>hi</div>';

    // 17.4.5 语法错误
    // 17.4.6 系统无法找到指定资源
    // IE 对 URL 有最长 2083 个字符的限制
    let longUrl = this.createLongUrl('http://bing.com');
    console.info(longUrl.length); // 2099

    // 因为上述原因，IE 中发送会报错
    this.sendXML();
  }

  /**
   * 返回值是 1 ，而不是 2，有了 finally 的存在，前一句会被忽略
   */
  testFinally() {
    try {
      return 2;
    // eslint-disable-next-line
    } catch (error) {
      return 0;
    } finally {
      return 1;
    }
  }

  /**
   * 创建自定义错误类型
   * @param {String} message
   */
  CustomError(message = '') {
    this.name = 'customError';
    this.message = message;
  }

  /**
   * 普通函数，未作校验，可能会报错
   * @param {Array} arr
   */
  process(arr) {
    arr.sort();

    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (element > 100) {
        return element;
      }
    }

    return -1;
  }

  /**
   * 上一个方法的增强版，会优先判断参数，如果不对直接抛出异常，提示错误信息
   * @param {Array} arr
   */
  processEnhance(arr) {
    if (!(arr instanceof Array)) {
      throw new Error('process(): argument must be array');
    }

    arr.sort();

    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (element > 100) {
        return element;
      }
    }

    return -1;
  }

  /**
   * 浏览器的错误事件，抛出任何异常都会进入到该事件中
   */
  registerErrorEvent() {
    window.onerror = function(message, url, line) {
      console.info(message, url, line);
    };
  }

  /**
   * 阻止浏览器报告错误的默认行为
   */
  preventErrorEvent() {
    window.onerror = function (message, url, line) {
      console.info(message, url, line);
      return false;
    };
  }

  /**
   * 图像也有错误事件，可以用指向一个不存在的路径来触发该事件
   */
  handleImageError() {
    let image = new Image();
    EventUtil.addHandle(image, 'load', function (event) {
      console.info('Image is loaded', event);
    });
    EventUtil.addHandle(image, 'error', function (event) {
      console.info('Image is not loaded', event);
    });

    image.src = '404notfound.jpg';
  }

  /**
   * 错误示范, str3 未必一定是字符串，虽然我们希望是
   * @param {String} str1
   * @param {String} str2
   * @param {String} str3
   */
  concatString(str1, str2, str3) {
    let res = str1 + str2;
    if (str3) {
      res += str3;
    }
    return res;
  }

  /**
   * 正确示范
   * @param {String} str1
   * @param {String} str2
   * @param {String} str3
   */
  concatStringEnhance(str1 = '', str2 = '', str3 = '') {
    let res = str1 + str2;
    if (typeof str3 === 'string') {
      res += str3;
    }
    return res;
  }

  /**
   * 类型检查注意安全
   * @param {String} url
   */
  getQueryString(url = '') {
    if (typeof url === 'string') {
      let pos = url.indexOf('?');
      if (pos > -1) {
        return url.substring(pos + 1);
      }
    }
    return '';
  }

  /**
   * 给 url 添加转义后的参数
   * @param {String} url
   * @param {String} name
   * @param {String} value
   */
  addQueryStringArg(url = '', name = '', value = '') {
    if (url.indexOf('?') === -1) {
      url += '?';
    } else {
      url += '&';
    }

    url += encodeURIComponent(name) + '=' + encodeURIComponent(value);
    return url;
  }

  /**
   * 使用 image 对象来发送请求，非常灵活
   * 所有浏览器都支持，没有兼容性问题
   * 不像 xhr 对象，有跨域限制
   * ajax 一般是由封装的库调用，有依赖，万一依赖的库出问题就凉凉
   * @param {String} sev
   * @param {String} msg
   */
  logError(sev, msg) {
    let image = new Image();
    image.src = `log.php?sev=${encodeURIComponent(sev)}&msg=${encodeURIComponent(msg)}`;
  }

  /**
   * 在浏览器上创建一个调试区域
   * @param {String} message
   */
  log(message) {
    let console = document.querySelector('#debuginfo');
    if (console === null) {
      console = document.createElement('div');
      console.id = 'debuginfo';
      console.style.background = '#dedede';
      console.style.border = '1px solid silver';
      console.style.padding = '5px';
      console.style.width = '400px';
      console.style.position = 'absolute';
      console.style.right = '0px';
      console.style.top = '0px';
      document.appendChild(console);
    }
    console.innerHTML = `<p>${message}</p>`;
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  /**
   * 如果入参不都是数字，就直接抛出异常
   * @param {Number} num1
   * @param {Number} num2
   */
  divide(num1, num2 = 1) {
    this.assert(typeof num1 === 'number' && typeof num2 === 'number',
      'divide(): Both arguments must be numbers.' );
    return num1 / num2;
  }

  /**
   * 创建一个超长 url
   */
  createLongUrl = (url = '') => {
    let str = '';
    for (let i = 0; i < 2084; i++) {
      str += 'a';
    }
    return url + str;
  }

  /**
   * 在 IE 中发送会报错
   */
  sendXML() {
    let xhr = new XMLHttpRequest();
    xhr.open('get', this.createLongUrl('http://bing.com'), true);
    xhr.srnc(null);
  }
}
