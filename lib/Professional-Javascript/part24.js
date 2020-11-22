/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/******** 《JavaScript 高级程序设计》 ********/
/******** 24、最佳实践 ********/
import { EventUtil } from './part13';
import { CookieUtil } from './part23';

export default class Part24BestPractice {
  constructor() {
    // 24.1 可维护性
    // 24.1.1 什么是可维护的代码
    // 24.1.2 代码约定

    // 变量类型透明
    // 初始化指定变量类型
    let found = false; // 布尔型
    let count = -1; // 数字

    // 匈牙利标记法 但可读性不好
    let bFound;
    let iCount;
    let sName // 字符串

    // 指定类型的类型注释 太麻烦了
    ;(function () {
      let found /* Boolean */ = false;
      let count /* Number */ = 11;
      let person /* Object */ = null;
    })();

    // 24.1.3 松散耦合
    // 解耦 HTML和/JavaScript
    // 在 HTML 中尽量避免书写 Javascript ，在 Javascript 中尽量避免变更 HTML
    // 不解耦的一个坏处是，排查问题变得麻烦，你不知道问题是出在 HTML 还是出在 JS 上面

    // 解耦 CSS/JavaScript
    // 避免像这样地操作 CSS
    // Element.style.color = 'red'
    // 下面这样的操作会好得多
    // Element.className = 'edit'

    // 解耦应用逻辑/事件处理程序
    this.handleKeyPress();

    // 以下是解耦过后的代码
    this.handleKeyPressEvent();

    // 24.1.4 编程实践
    // 尊重对象所有权
    // 不要为实例或原型添加属性
    // 不要为实例或原型添加方法
    // 不要重定义已存在的方法

    // 避免全局变量
    let name = 'Nicholas';
    function sayName() {
      alert(name);
    }

    // 以上是两个全局变量，以下是一个全局变量，推荐以下
    let MyApplication = {
      name: 'Nicholas',
      sayName: function () {
        alert(this.name);
      }
    };
    // 这个做法有助于消除功能作用域之间的混淆
    // 创建命名空间的例子
    let Wrox = {};
    Wrox.ProJS = {};
    // 将书中的好用的对象放上去
    Wrox.ProJS.EventUtil = EventUtil;
    Wrox.ProJS.CookieUtil = CookieUtil;

    // 避免与 null 进行比较
    this.sortArrayErr();

    // 这样写更加推荐
    this.sortArray();

    // 使用常量
    // 本质上还是类似解耦的思想
    // 将数据和逻辑进行分离
    // 重复的值就应该抽取为常量
    // 任何字符串都应该抽出来，方便国际化
    // 推荐在一个地方存储所有的 url
    this.validate();

    // 使用常量的处理
    this.validateUsingConstants();

    // 24.2 性能
    // 24.2.1 注意作用域
    // 避免全局查找
    // 因为会涉及作用域链上的查找
    // 不推荐
    this.updateUI();

    // 推荐
    this.updateUIupdated();

    // 避免 with 语句

    // 24.2.2 选择正确的方法
    // 1. 避免不必要的属性查找
    // 对象上的任何属性查找都会比变量或者数组更耗费性能
    // 因为对象属性会涉及查找整个原型链的
    // 这是一个 O(n) 操作
    // 而数组的查找是 O(1) 操作
    // 不良示范
    this.getQueryString();

    // 更好的处理方式
    this.betterGetQueryString();

    // 2. 优化循环
    // 普通循环
    // 算法复杂度 O(n)
    this.normalLoop();

    // 使用减值迭代的循环 减少了复杂度
    // 算法复杂度 O(1)
    this.betterLoop();

    // 3. 展开循环
    // 4. 避免双重解释
    // 避免使用 eval 函数

    // 5. 性能的其他注意事项
    // 原生方法较快，是使用 C/C++ 之类的编译型语言写出来的
    // Switch 语句较快，比 if else 要快
    // 位运算符较快

    // 24.2.3 最小化语句数
    // 1. 多个变量声明
    // 多个操作的单个语句，要比完成单个操作的多个语句要快。
    this.multiDeclare();

    // 这种方式是更快的
    this.singleDeclare()

    // 2. 插入迭代值，尽可能的合并语句
    ;(function () {
      let i;
      const name = values[i];
      i++;
    })()
    // 可以简化成
    ;(function () {
      let i;
      const name = values[i++];
    })();

    // 使用数组和对象字面量
    // 不推荐的做法
    this.dontCreateArrayInThisWay();
    this.dontCreateObjectInThisWay();

    // 建议的做法
    // 使用数组和对象字面量
    this.pleaseCreateArrayInThisWay();
    this.pleaseCreateObjectInThisWay();

    // 24.2.4 优化 DOM 交互
    // 1. 最小化现场更新
    // 需要更新已显示的页面里的 DOM 的时候，就是现场更新
    // 需要立即对页面对用户的显示进行更新，所以叫现场更新
    // 多次现场更新
    this.createDomList();

    // 更好的方式，只有一次现场更新
    this.createDomListInBetterWay();

    // 2. 使用 innerHTML
    // innerHTML 的执行效率会比 appendChild 快，因为它走的是 HTML 解析器而不是基于 JS 的调用
    this.createDomListInInnerHTMLWay();

    // 3. 使用事件代理
    // 事件冒泡

    // 4. 注意 HTMLCollection
    // 存在 HTMLCollection 的时候最好只调用一次
    this.iteratorHTMLCollection();

    // 24.3 部署
    // 24.3.1 构建过程
    // 知识产权问题，文件大小，代码组织
    // HTTP 请求是 Web 中主要的性能瓶颈之一

    // 24.3.2 验证
    // 文中列举了 jslint 作为例子，但在 2020 来看已经变得有点过时

    // 24.3.3 压缩
    // 1. 文件压缩
    // 删除额外的空白，包括换行
    // 删除所有注释
    // 缩短变量名
    // 文中的例子是 yui 工具，这在 2020 也变得有些过时了
    // 2. HTTP 压缩
    // gzip 压缩

    // 24.4 小结
    // 针对 C 语言的很多优化也适用于 Javascript
  }

  /**
   * 这是应用逻辑和事件处理耦合的例子
   * @param {*} event
   */
  handleKeyPress(event) {
    event = EventUtil.getEvent(event);
    if (event.keyCode === 13) {
      let target = EventUtil.getTarget(event);
      let val = 5 * parseInt(target.value);
      if (val > 10) {
        document.getElementById('error-msg').style.display = 'block';
      }
    }
  }

  /**
   * 提取应用逻辑
   * @param {*} value
   */
  validateValue(value) {
    const val = 5 * parseInt(value);
    if (val > 10) {
      document.getElementById('error-msg').style.display = 'block';
    }
  }

  /**
   * 事件处理的逻辑单独维护
   * @param {*} event
   */
  handleKeyPressEvent(event) {
    event = EventUtil.getEvent(event);
    if (event.keyCode === 13) {
      let target = EventUtil.getTarget(event);
      let val = 5 * parseInt(target.value);
      this.validateValue(val);
    }
  }

  /**
   * 一个不完善的比较排序方法
   * @param {any} values
   */
  sortArrayErr(values) {
    if (values !== null) {
      // values.sort(comparator)
    }
  }

  /**
   * 推荐的判断
   * @param {any} values
   */
  sortArray(values) {
    if (values instanceof Array) {
      // values.sort(comparator)
    }
  }

  validate(value) {
    if (!value) {
      alert('invalid value');
      location.href = '/errors/invalid.php';
    }
  }

  /**
   * 带常量的写法
   * @param {*} value
   */
  validateUsingConstants(value) {
    const constants = {
      INVALID_VALUE_MSG: 'Invalid value!',
      INVALID_VALUE_URL: '/errors/invalid/php'
    };
    if (!value) {
      alert(constants.INVALID_VALUE_MSG);
      location.href = constants.INVALID_VALUE_URL;
    }
  }

  /**
   * 不推荐的函数，因为至少有三个对全局对象的引用 document
   * 随着循环遍历还会有更多
   */
  updateUI() {
    let imgs = document.getElementsByTagName('img');
    for (let index = 0, len = imgs.length; index < len; index++) {
      imgs[index].title = document.title + ' image ' + index;
    }
    let msg = document.getElementById('msg');
    msg.innerHTML = 'Update Complete';
  }

  /**
   * 将全局对象保存在本地的 doc 变量中
   */
  updateUIupdated() {
    let doc = document,
      imgs = document.getElementsByTagName('img');
    for (let index = 0, len = imgs.length; index < len; index++) {
      imgs[index].title = doc.title + ' image ' + index;
    }
    let msg = doc.getElementById('msg');
    msg.innerHTML = 'Update Complete';
  }

  /**
   * 获取 url 参数，属性查找过多的示范案例
   */
  getQueryString() {
    const queryString = window.location.href.substring(window.location.href.indexOf('?'));
    return queryString;
  }

  /**
   * 获取 url 参数，属性查找减少的示范案例
   */
  betterGetQueryString() {
    const url = window.location.href,
      queryString = url.substring(url.indexOf('?'));
    return queryString;
  }

  /**
   * 一个普通的循环
   * @param {Array} array
   */
  normalLoop = (array = []) => {
    for (let index = 0; index < array.length; index++) {
      console.info(array[index]);
    }
  }

  /**
   * 使用减值迭代的循环
   * @param {Array} array
   */
  betterLoop = (array = []) => {
    for (let index = array.length - 1; index >= 0; index--) {
      console.info(array[index]);
    }
  }

  /**
   * 单个语句的多个操作
   */
  singleDeclare = () => {
    const count = 5,
      color = 'blue',
      names = ['a', 'b'],
      now = new Date();

    return { count, color, names, now };
  }

  /**
   * 单个操作的多个语句
   */
  multiDeclare = () => {
    const count = 5;
    const color = 'blue';
    const names = ['a', 'b'];
    const now = new Date();

    return { count, color, names, now };
  }

  dontCreateArrayInThisWay = () => {
    let values = new Array();
    values[0] = 123;
    values[1] = 456;
    values[2] = 789;

    return values;
  }

  /**
   * 推荐使用字面量的方式
   */
  pleaseCreateArrayInThisWay = () => {
    const values = [123, 456, 789];

    return values;
  }

  dontCreateObjectInThisWay = () => {
    let person = new Object();
    person.name = 'sella';
    person.age = 29;
    person.sayName = function() {
      alert(this.name);
    };

    return obj;
  }

  /**
   * 推荐使用字面量的方式
   */
  pleaseCreateObjectInThisWay = () => {
    const person = {
      name: 'sella',
      age: 29,
      sayName: function() {
        alert(this.name);
      }
    };

    return person;
  }

  /**
   * 添加列表内的元素
   */
  createDomList = () => {
    let list = document.getElementById('myList'),
      item;

    for (let i = 0; i < list.length; i++) {
      item = document.createElement('li');
      list.appendChild(item);
      item.appendChild(document.createTextNode('Item: ' + i));
    }
  }

  /**
   * 使用文档碎片来构建 DOM 结构，然后再添加到 List 元素中
   */
  createDomListInBetterWay = () => {
    let list = document.getElementById('myList'),
      fragement = document.createDocumentFragment(),
      item;

    for (let i = 0; i < list.length; i++) {
      item = document.createElement('li');
      fragement.appendChild(item);
      item.appendChild(document.createTextNode('Item: ' + i));
    }

    list.appendChild(fragement);
  }

  /**
   * innerHTML 插入元素的示例
   */
  createDomListInInnerHTMLWay = () => {
    let list = document.getElementById('myList'),
      html;

    for (let i = 0; i < list.length; i++) {
      html += '<li>Item: ' + i + '</li>';
    }

    list.innerHTML = html;
  }

  /**
   * 迭代集合的时候需要避免频繁调用 HTMLCollection
   */
  iteratorHTMLCollection = () => {
    let images = document.getElementsByTagName('img');
    for (let i = 0, len = images.length; i < len; i++) {
      // do sth
    }
  }
}
