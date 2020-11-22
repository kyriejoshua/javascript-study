/******** 《JavaScript 高级程序设计》 ********/
/******** 11、DOM 扩展 ********/

export default class Part11DOMP {
  constructor() {
    // 11.1 选择符 API
    // 11.1.1 querySelector
    // let body = this.getBody();

    // 11.2 元素遍历
    // 不常用的 api

    // 11.3 HTML5
    // 11.3.1 与类相关的扩充
    // 搜索带 username password 两个类的的元素，不区分类名的先后顺序
    this.getElementsByClassName('username password');
    // 链式调用，搜索 myDiv 下的对应类名元素
    document.querySelector('#myDiv').getElementsByClassName('username');

    // classList 有四个方法 add contains remove toggle
    // 返回 DOMTokenList
    this.handleClassList(this.getBody(null, 'body'), 'body', 'add');
    console.info(this.getBody().classList); // ['body']

    this.handleClassList(this.getBody(null, 'body'), 'body', 'contains'); // true

    this.handleClassList(this.getBody(null, 'body'), 'body', 'remove');
    console.info(this.getBody().classList); // ['']
    // toggle 如果有，就删除，如果没有，就添加，以一代三
    this.handleClassList(this.getBody(null, 'body'), 'newBody', 'toggle');
    console.info(this.getBody().classList); // ['newBody']

    // 11.3.2 焦点管理
    // 获取聚焦的 dom, 默认是 body
    console.info(document.activeElement); // body
    // 手动操作后，聚焦的 DOM 变化
    let focusButton = document.querySelector('button');
    focusButton.focus();
    console.info(document.activeElement); // button
    console.info(document.activeElement === focusButton); // true

    // 11.3.3 HTMLDocument 的变化

    // HTML5 标准中 document.readyState 来替代 onload 方法
    this.getDocumentReady();

    // 标准新增 head 属性
    this.getHead();

    // 11.3.5 自定义数据属性
    // 只要以 data- 开头来定义属性
    this.getDataInDiv();

    // 11.3.6 插入标记
    // outerHTML 在读模式下，返回当前元素及其所有子元素内容
    // innerHTML 在读模式下，返回所有子元素内容，不包括当前元素
    // 在写模式下，innerHTML 相当于以 HTML 的方式添加子元素
    // 在写模式下，outerHTML 相当于以 HTML 的方式替换当前元素
    this.handleInnerHTML(null, '#myDiv', 'innerHTML123');
    this.handleOuterHTML(null, '#myDiv', 'outerHTML456');

    // insertAdjacentHTML
    this.handleInsertAdjacentHTML(null, 'beforebegin', '<p>beforebegin</p>');
    this.handleInsertAdjacentHTML(null, 'afterbegin', '<p>afterbegin</p>');
    this.handleInsertAdjacentHTML(null, 'beforeend', '<p>beforeend</p>');
    this.handleInsertAdjacentHTML(null, 'afterend', '<p>afterend</p>');

    // 性能问题

    // 11.3.7 scrollIntoView() 方法
    this.getElementScrollIntoView(null, true); // 元素在顶部
    this.getElementScrollIntoView(null, false); // 让元素完全展现

    // 11.4 专有扩展
    // 11.4.4 插入文本
    this.setInnerText(document.body, 'Hello World<h1>yes</h1>');
    this.getInnerText(document.body);
  }

  /**
   * querySelector 返回匹配的第一个元素或者 null
   * Document, Element, DocumentFragment 三种类型可以调用
   */
  getBody = (element = null, tagName) => {
    return (element || document).querySelector(tagName);
  };

  /**
   * @param {String} className
   */
  getElementsByClassName = (className = '') => {
    return document.getElementsByClassName(className);
  };

  /**
   *
   * @param {DOM} element
   * @param {String} className
   * @param {String} type
   */
  handleClassList(element = null, className, type) {
    return (element || document).classList[type](className);
  }

  /**
   * 页面加载完文档
   * @param {Function} fn
   */
  getDocumentReady(fn = null) {
    const STATE_COMPLETE = 'complete';
    if (document.readyState === STATE_COMPLETE) {
      fn && fn();
    }
  }

  getHead = () => {
    return document.head || document.getElementsByTagName('head')[0];
  }

  getDataInDiv = () => {
    let div = document.querySelector('#myDiv');
    div.dataset.name = 'data';
    div.dataset.appId = 'appId123';
    console.info(div.dataset.name, div.dataset.appId);
  }

  /**
   * 设置元素的内容
   * @param {DOM} element
   * @param {String} type
   * @param {String} innerHTML
   */
  handleInnerHTML(element = null, type = '', innerHTML = '') {
    return (element || document).querySelector(type).innerHTML = innerHTML;
  }

  /**
   *
   * @param {DOM} element
   * @param {String} type
   * @param {String} outerHTML
   */
  handleOuterHTML(element = null, type = '', outerHTML = '') {
    return (element || document).querySelector(type).outerHTML = outerHTML;
  }

  /**
   * 子元素处理，在不同位置插入子元素
   * @param {*} element
   * @param {*} type
   * @param {*} html
   */
  handleInsertAdjacentHTML(element = null, type = '', html = '') {
    return (element || document).insertAdjacentHTML(type, html);
  }

  /**
   * 元素的滚动功能
   * @param {DOM} element
   * @param {Boolean} isTop
   */
  getElementScrollIntoView(element, isTop = false) {
    return (element || document).scrollIntoView(isTop);
  }

  /**
   * innerText 会把所有 HTML 字符给编码
   * 新版 chrome 好像不会编码了
   * @param {*} element
   */
  getInnerText(element) {
    element = element || document.body;
    return typeof element.textContent === 'string' ? element.textContent : element.innerText;
  }

  setInnerText(element, text = '') {
    element = element || document.body;
    if (typeof element.textContent === 'string') {
      element.textContent = text;
    } else {
      element.innerText = text;
    }
  }
}
