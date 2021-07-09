/******** 《JavaScript 高级程序设计》(第4版) ********/
/******** 15、 DOM 扩展 445-459 ********/

const Part15DOMExtends = () => {
  /**
   * 15.1 Selectors API
   */
  const _Selectors = () => {
    // 核心是 querySelector 和 querySelectorAll

    // 15.1.1 querySelector
    // 这个方法接收 CSS 选择符作为参数 返回匹配该模式的第一个后代元素 如果没有匹配则返回 null

    // 15.1.2 querySelectorAll
    // 这个方法接收 CSS 选择符作为参数 返回所有匹配的节点 也就是 NodeList 的静态实例
    // 注意这里不是实时的，是静态的快照
    // 这样的实现主要是避免了使用 NodeList 可能造成的性能问题
    // 返回的 NodeList 是可迭代对象，可以使用 forof 循环遍历
    /**
     * 遍历节点，打印节点信息
     * @param {*} selectors
     */
    function mapNodeList(selectors) {
      const elements = document.body.querySelectorAll(selectors);
      for (const element of elements) {
        console.info(element.nodeName, element.className);
        console.info(Object.keys(element));
      }
    }
    mapNodeList('div');

    // 15.1.3 matches
    // 判断当前元素的匹配器是否能被 querySelector 选择器获取，返回布尔值
    /**
     * 注意这里检测的是当前元素
     * 也就是 document.body 而不包括后代子元素
     * @param {*} selector
     * @returns
     */
    function isExisted(selector) {
      return document.body.matches(selector);
    }
    isExisted('div');
  };
  _Selectors();

  // 15.2 元素遍历
  // childElementCount
  // firstElementChild
  // lastElementChild
  // previousElementSibling
  // nextElementSibling

  // 遍历特定元素的所有子元素，使用这些 api 可以简化写法
  /**
   * 使用新的 API 来实现对某个元素的子元素的遍历
   * @param {*} processChild
   * @param {*} id
   */
  function mapElement(processChild, id = 'parent') {
    let parentElement = document.getElementById(id);
    let currentChildElement = parentElement.firstElementChild;
    while (currentChildElement) {
      processChild(currentChildElement);
      if (currentChildElement === parentElement.lastElementChild) {
        break;
      }
      currentChildElement = currentChildElement.nextElementSibling;
    }
  }

  // 遍历 React 应用根节点下的直接子节点
  mapElement(console.info, 'root');

  /**
   * 15.3 HTML5
   */
  function _HTML5() {
    // 15.3.1 CSS 类扩展
    // 1. getElementByClassName()
    // 接收类名字符串，返回实时的 NodeList
    // 注意不需要使用 css 通配符
    // 这样写是无效的
    document.body.getElementsByClassName('.ant-layout');

    // 2. classList 属性
    // 直接通过 className 属性来添加删除和替换，可以实现但不方便
    // classList 有四个操作方法来简化
    // remove 移除
    // add 添加
    // toggle 如果有则移除，如果没有则添加
    // contains 是否含有某个属性
    const section = document.body.getElementsByClassName('ant-layout');
    section.classList.remove('ant-layout');

    // 15.3.2 焦点管理
    // document.activeElement 标识当前拥有焦点的 DOM 元素
    // 页面加载完成之后，这个值默认是 document.body；加载完之前，这个值是 null

    // document.hasFocus 返回布尔值标识当前是否有焦点

    // 15.3.3 HTMLDocument 扩展
    // 1. readyState
    // loading 文档正在加载
    // complete 文档加载完成

    // 2. compatMode 属性

    // 3. head 属性
    // 新增了 document.head 来直接获取 <head>
    // 对标 document.body

    // 15.3.4 字符集属性

    // 15.3.5 自定义数据属性
    // HTML5 允许指定非标准属性 需要使用前缀 data- 来告诉浏览器
    // 定义自定义数据属性之后，可以通过元素的 dataset 属性来访问
    // 不过要注意大小写
    const ele = document.body.querySelector('div');
    // <div class="ant-card-head-title" data-my-name="a" data-myName="aa">数据列表</div>
    // 注意看这里的大小写
    console.info(ele.dataset.myName); // data-my-name a
    console.info(ele.dataset.myname); // data-myName aa

    // 单页应用程序框架使用了比较多的数据属性，届时可以分析 React

    // 15.3.6 插入标记
    // 1. innerHTML 属性
    // 用于替换所有的子节点
    // 注意设置的值会被浏览器解析

    // 2. 旧 IE 中的 innerHTML

    // 3. outerHTML
    // 返回调用它的元素及所有后代元素的 HTML 字符串
    // div.outerHTML = '<p>This is P</p>';
    // 等同于下面的效果
    function replaceCurrent(div) {
      let p = document.createElement('p');
      p.appendChild(document.createTextNode('This is P'));
      div.parentNode.replaceChild(p, div);
    }
    replaceCurrent(document.body.firstElementChild);

    // 4. insertAdjacentHTML 与 insertAdjacentText
    // 第一个参数必须是以下中的一个
    // beforebegin
    // afterbegin
    // beforeend
    // afterend
    // 第二个参数是 HTML 片段或者文本

    // 5. 内存与性能问题
    // 插入列表类的数据时，不要直接修改 DOM 元素，而是先保存再内存中，再适当插入
    function insertHtml(ele, values) {
      let itemsHtml = '';
      for (const v of values) {
        itemsHtml += `<li>${v}</li>`;
      }
      ele.innerHTML = itemsHtml;
    }
    insertHtml(document.body.lastElementChild, [1, 2, 3, 4]);

    // 6. 跨站点脚本
    // 尽量避免暴露 innerHTML 的直接设置
    // 注意转义来避免 XSS 攻击

    // 15.3.7 scrollIntoView
    // 接收 alignTop 布尔值作为参数
    // 或者接收 scrollIntoViewOption 对象作为参数
    // 不传参数等同于 alignTop 为 true
  }

  _HTML5();

  // 15.4 专有扩展
  // 到这本书编写的时间点，这些还未成为标准的扩展

  // 15.4.1 children 属性

  // 15.4.2 contains() 方法

  // 15.4.3 插入标记

  // 1. innerText
  // 没有纳入 HTML5 标准，但是大部分浏览器都实现了
  // 对应所有文本内容，不管处于子节点的哪个层级
  console.info(document.body.innerText);

  // 通过把 innerText 属性设置为 innerText 的值，可以去除所有 HTML 标签
  document.body.innerText = document.body.innerText;
  // 感觉可以拿来做攻击？或者伪造成网页样式未加载

  // 2. outerText
  // 不仅改动了所有子元素，还会修改当前元素
  // 兼容性比 innerText 差一些

  // 15.4.4 滚动
  // scrollIntoViewIfNeeded 的兼容性没有 scrollIntoView 好， scrollIntoView 是所有浏览器所支持的
  // 且不像 scrollIntoView 标准化
  // Opera， Chrome， Safari 实现了它
};

export default Part15DOMExtends;
