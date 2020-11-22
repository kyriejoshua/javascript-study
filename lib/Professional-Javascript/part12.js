/******** 《JavaScript 高级程序设计》 ********/
/******** 12、DOM2 和 DOM3 ********/

export default class Part12DOM2 {
  constructor() {
    // 12.1 DOM 变化
    // 一些不常用、可能过时的 API

    // 12.2 样式

    // 12.2.3 元素大小
    // 偏移量
    let div = document.body.querySelector('myDiv');
    this.getElementOffset(div, 'offsetLeft');

    // 客户区大小
    // 不包含边框的内容大小
    console.info(div.clientWidth, div.clientHeight);

    // 滚动大小
    console.info(div.scrollWidth, div.scrollHeight);
    // 操作位置
    div.scrollLeft = '20px';
    div.scrollTop = '120px';
    this.scrollToTop(div);

    // 确定元素大小及位置
    div.getBoundingClientRect();

    // 12.3 遍历
    // 12.3.1 NodeIterator 实例
    this.mapNodeIterator(div);

    // 12.3.2 TreeWalker
    // 支持在 DOM 结构上的各个方向上的移动
    this.mapTreeWalker(div, 'SHOW_ELEMENT');

    // 12.4 范围
    // 对 DOM 节点的更复杂的操作
  }

  /**
   * 向上循环获取偏移量，对于使用表格和内嵌框架布局的页面可能不太准确
   * @param {DOM} element
   * @param {String} type
   */
  getElementOffset(element, type) {
    let actualOffset = element[type];
    let currentElement = element.offsetParent;

    while (currentElement !== null) {
      actualOffset += currentElement[type];
      currentElement = currentElement.offsetParent;
    }

    return actualOffset;
  }

  /**
   * 回到顶部
   * @param {DOM} element
   */
  scrollToTop(element) {
    return element.scrollTop = +!element.scrollTop || 0;
  }

  /**
   * 深度优先的遍历当前元素的子节点元素名
   * @param {DOM} element
   * @param {STRING} type 默认是 SHOW_ALL 所有
   * @param {Function|Object} filter 过滤器，提取例如某个标签的内容，默认是 null，不进行过滤
   */
  mapNodeIterator(element, type = 'SHOW_ALL', filter = null) {
    const nodeIterator = document.createNodeIterator(element, NodeFilter[type], filter, false);
    let node = nodeIterator.nextNode();
    let nodeCount = 0;

    while (node) {
      console.info(node.tagName);
      nodeCount++;
      node = nodeIterator.nextNode();
    }
  }

  /**
   * 深度优先的遍历当前元素的子节点元素名，比 NodeIterator 更加强大, 支持 node 相关的 firstChild/nextSibling/previousSibling/parentNode 等方法
   * @param {DOM} element
   * @param {STRING} type 默认是 SHOW_ALL 所有
   * @param {Function|Object} filter 过滤器，提取例如某个标签的内容，默认是 null，不进行过滤
   */
  mapTreeWalker(element, type = 'SHOW_ALL', filter = null) {
    const treeWalker = document.createTreeWalker(element, NodeFilter[type], filter, false);
    let node = treeWalker.nextNode();
    let nodeCount = 0;

    while (node) {
      console.info(node.tagName);
      nodeCount++;
      node = treeWalker.nextNode();
    }
  }
}
