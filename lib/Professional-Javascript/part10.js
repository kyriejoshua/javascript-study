/******** 《JavaScript 高级程序设计》 ********/
/******** 10、DOM ********/

export default class Part10DOM {
  constructor() {
    let body = this.getBody()

    let isElement = this.isElement(body)
    console.info(isElement) // true 为 1

    // 10.1.1 Node 类型
    // 元素节点，nodeName 中保存的始终是元素的标签名，nodeValue 的值始终是 null
    console.info(body.nodeName) // BODY
    console.info(body.nodeValue) // null

    let firstChild = body.childNodes[0]
    let secondChild = body.childNodes.item(1)
    let length = body.childNodes.length

    // appendChild
    let a = document.createElement('a')
    let returnNode = body.appendChild(a)
    console.info(returnNode === body.lastChild) // true
    console.info(returnNode === a) // true

    // 将第一个子元素移动到最后一个元素的位置，firstChild 仍然指向原来的元素，但 body.firstChild 不再是刚刚的元素了
    let returnFirstNode = body.appendChild(firstChild)
    console.info(firstChild === returnFirstNode) // true
    console.info(firstChild === body.lastChild) // true
    console.info(returnFirstNode === body.lastChild) // true
    console.info(returnFirstNode === body.firstChild) // false

    // insertBefore 方法，要插入的节点和作为参照的节点
    // 第二个参数为 null 时，插入的是最后一个节点
    let insertNode = document.createElement('div')
    insertNode.innerHTML = 'insertNode'
    let returnInsertNode = body.insertBefore(insertNode, null) // 最后一个节点
    console.info(insertNode === body.lastChild) // true
    console.info(insertNode === returnInsertNode) // true 同一个节点

    // 插入第一个节点
    let insertFirstNode = document.createElement('div')
    insertFirstNode.innerHTML = 'insertFirstNode'
    let returnInsertFirstNode = body.insertBefore(insertFirstNode, body.firstChild)
    console.info(insertFirstNode === body.firstChild) // true
    console.info(insertFirstNode === returnInsertFirstNode) // true 同一个节点

    // replaceChild 接受要插入的节点和要被替换的节点
    // 返回被替换的节点
    let replaceNode = document.createElement('div')
    replaceNode.innerHTML = 'replaceNode'
    let returnReplaceNode = body.replaceChild(replaceNode, body.firstChild)
    console.info(returnReplaceNode === replaceNode) // false
    console.info(returnReplaceNode === body.firstChild) // false
    console.info(replaceNode === body.firstChild) // true

    // removeChild 返回被移除的节点
    let formerLastChild = body.removeChild(body.lastChild)
    console.info(formerLastChild)

    // 上述方法只适用于有子节点的方法
    // 下面这个方法适用于任何节点
    // cloneNode 区分深拷贝和浅拷贝
    let myList = document.createElement('ul')
    let myListChild = document.createElement('li')
    myList.appendChild(myListChild)
    // 深拷贝拷贝节点及其子节点树
    let deepCopyList = myList.cloneNode(true)
    // 浅拷贝只拷贝当前节点
    let shallowCopyList = myList.cloneNode(false)
    console.info(deepCopyList, shallowCopyList)

    // 10.1.2 Document 类型
    // 取得完整的 url
    console.info(document.URL === location.href) // true
    console.info(document.referrer)
    console.info(document.domain)
    console.info(document.title)
    console.info(document.images) // 获取所有图片
    console.info(document.links) // 获取所有带 href 的 a 元素
    console.info(document.forms) // 获取所有带 href 的 a 元素
    document.write('test') //
    document.writeIn('test') // 末尾自带换行

    // 10.1.3 Element 类型
    body.setAttribute('id', 'body-id')
    let id = body.getAttribute('id')
    console.info(id) // body-id
    body.removeAttribute('id')
    console.info(body.id) // ''
    console.info(body.attributes)

    // 10.1.4 Text 类型
    // 文本节点
    let textNode = document.createTextNode('<strong>abc</strong>textNode')
    body.appendChild(textNode)

    // 10.1.5 Comment 类型
    let comment = document.createComment('A Comment');
    let commentDom = body.appendChild(comment)
    console.info(body.lastChild) // 不是最后一个

    // 10.1.8 DocumentFragment 类型
    // 文档片段
    let fragment = document.createDocumentFragment()
    let myList = document.getElementById('myList')

    for (let index = 0; index < 3; index++) {
      let li = document.createElement('li')
      li.appendChild(document.createTextNode(`li - ${index}`))
      fragment.appendChild(li)
    }

    myList.appendChild(fragment)

    // 10.1.9 Attr 类型
    let attr = document.createAttribute('align')
    attr.value = 'left'
    myList.setAttributeNode(attr)
    console.info(myList.getAttributeNode('align').value) // left
    console.info(myList.getAttribute('align')) // left

    // 10.2  DOM 操作结束
    // 10.2.1 动态脚本
    this.loadScript('client.js')

    // 10.2.2 动态样式
    this.loadStyles('style.css')

    // 10.2.3 操作表格
    this.createTable(body)

    // 10.2.4 使用 NodeList
    this.createLargeNodes(body)
  }

  getBody = () => {
    return document.body
  }

  /**
   * 判断是否是节点元素
   * Node.ELEMENT_NODE 为常量，值为 1
   */
  isElement = (ele) => {
    return ele.nodeType === Node.ELEMENT_NODE
  }

  convertToArray(arrayLike) {
    return Array.prototype.slice.call(arrayLike, 0)
  }

  getChildNodePosition(node) {
    if (node.nextSibling === null) {
      console.info(`${node.nodeName} is the last child`)
    } else if (node.previousSibling === null) {
      console.info(`${node.nodeName} is the first child`)
    } else {
      console.info(`${node.nodeName} is a normal child`)
    }
  }

  /**
   *
   * @param {String} url
   */
  loadScript(url = '') {
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    document.body.appendChild(script)
  }
  /**
   *
   * @param {String} url
   */
  loadStyles(url = '') {
    let style = document.createElement('style')
    style.type = 'text/css'
    style.rel = 'stylesheet'
    style.href = url
    let head = document.getElementsByTagName('head')[0]
    head.appendChild('style')
  }

  /**
   * 创建表格
   * @param {DOM} ele
   */
  createTable = (ele) => {
    ele = ele || document.body
    let table = document.createElement('table')
    table.border = 1
    table.width = '100%'
    let tbody = document.createElement('tbody')
    tbody.insertRow(0)
    tbody.rows[0].insertCell(0)
    tbody.rows[0].cells[0].innerHTML = 'Cell 0'
    table.appendChild(tbody)
    ele.appendChild(table)
  }

  /**
   * nodelist 是动态的，所以其实理应会导致死循环
   * @param {DOM} ele
   */
  createLargeNodes = (ele) => {
    ele = ele || document.body
    let divs = document.getElementsByTagName('div'),
      div

      for (let index = 0; index < divs.length; index++) {
        // 当前方法会出现死循环，设置上限，避免死循环
        if (index === 1000) {
          break
        }
        div = document.createElement('div')
        div.innerHTML = index
        ele.appendChild(div)
      }
  }
}
