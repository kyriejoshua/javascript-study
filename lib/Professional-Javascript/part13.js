/******** 《JavaScript 高级程序设计》 ********/
/******** 13、事件 ********/

export default class Part13EVENT {
  constructor() {
    // 13.1 事件流
    // 13.1.1 事件冒泡
    // IE 提出
    // 13.1.2 事件捕获

    // 13.1.3 DOM 事件流
    // 三个阶段：事件捕获阶段、处于目标阶段和事件冒泡阶段

    // 13.2 事件处理程序
    // 13.2.1 HTML 事件处理程序
    // 注意这里以 on 开头的方法都是小写的，并不是驼峰
    let div = document.createElement('div')
    div.innerHTML = `<input type="button" value="click me" onclick="console.info(event, event.type)" />`
    document.body.appendChild(div)

    // 13.2.2 DOM0级事件处理程序
    let myBtn = document.querySelector('#myBtn')
    myBtn.onclick = function(event) {
      console.info(event, 'clicked')
      console.info(this, this.id) // 注意不要使用箭头函数，保证 this 指向元素本身
    }

    // 删除事件
    myBtn.onclick = null

    // 13.2.3 DOM2级事件处理程序
    // addEventListener 和 removeEventListener 两个方法
    // 最后一个参数 false 表示冒泡处理事件，true 表示捕获阶段处理事件
    myBtn.addEventListener('click', function() {
      console.info(event, 'clicked')
    }, false)
    // addEventListener 可以重复添加事件
    myBtn.addEventListener('click', function() {
      console.info(this, this.id)
    }, false)

    // removeEventListener 无法删除由 addEventListener 添加的匿名函数，例如上文的两个函数
    let handler = function () {
      console.info('i am clicked')
    }
    myBtn.addEventListener('click', handler, false)
    // 这时是可以移除的 命名函数有所指向
    myBtn.removeEventListener('click', handler, false)

    // 13.3 事件对象
    // 13.1.1 DOM 中的事件对象
    let myBtn = document.querySelector('#myBtn')
    myBtn.onclick = function(event) {
      console.info(event, event.type) // click
      console.info(event.target === this)
      console.info(event.currentTarget === this)
    }

    myBtn.addEventListener('click', function (event) {
      console.info(event, event.type) // click
    })

    // 注意事件绑定的对象和当前调用对象的区别
    document.body.onclick = function(event) {
      console.info(event.currentTarget === this) // true
      console.info(event.currentTarget === document.body) // true
      console.info(this === document.body) // true
      console.info(event.target === myBtn) // true 当前调用对象
    }

    // 阻止特定事件的默认行为 需要先设置 cancelable 为 true
    // 例如阻止 a 标签的自动跳转
    let link = document.querySelector('#myLink')
    link.onclick = function (event) {
      event.preventDefault()
    }

    // eventPhase 属性用来确认事件位于事件流的哪个阶段
    // 捕获阶段是 1
    // 冒泡阶段是 3
    // 当前目标是 2
    myBtn.onclick = function(event) {
      console.info(event.eventPhase) // 1 目标对象上
    }
    document.body.addEventListener('click', function(event) {
      console.info(event.eventPhase) // 1 捕获阶段
    }, true)

    document.body.onclick = function(event) {
      console.info(event.eventPhase) // 3 冒泡阶段
    }

    // event 对象仅在事件处理程序执行中存在，执行完毕就会被销毁

    // 13.2.5 跨浏览器的事件处理程序 参见 EventUtil 方法
    // 保证事件处理代码在大多数浏览器中可以运行

    // 13.3.1 DOM 中的事件对象
    // 13.3.2 IE 中的事件对象
    // 13.3.3 跨浏览器的事件对象 对 EventUtil 方法增强

    // 13.4 事件类型
    // 13.4.1 UI 事件
    this.load()
    this.unload()
    // 13.4.7 HTML5 事件
    this.beforeunload()
    this.domContentLoaded()
    // 13.4.9 触摸与手势事件
    // 用于 ios 设备
    // touchstart 当手指触摸屏幕时触发，即使已经有一个手指放在了屏幕上也会触发
    // touchmove 当手指在屏幕上滑动时连续触发
    // touchend 手指移开
    // touchcancel 不明 没有明确标准
    // 这几个事件都可以冒泡

    // 13.5 内存与性能
    // 13.5.1 事件委托
    this.handleEvent()
    // 13.5.2 移除事件处理程序
    // 移除 dom 时需要也移除事件，否则内存仍然是占用的

    // 13.6 模拟事件
    // 13.6.1 DOM 中的事件模拟
    // 模拟鼠标事件
    // 模拟键盘事件
    // 这几个方法创建 event
    // 但初始化的入参太多了，不一一列举
  }

  /**
   * 当页面完全加载后，包括所有外部资源
   */
  load() {
    window.addEventListener('load', function (event) {
      console.info('loaded')
    })
  }

  /**
   * 即将离开页面时，通常用来清除内存，清除引用等等，避免内存泄漏
   */
  unload() {
    window.addEventListener('unload', function (event) {
      console.info('unloaded')
    })
  }

  /**
   * 用户离开此网站之前，必须设置 returnValue 这个值
   */
  beforeunload() {
    window.addEventListener('beforeunload', function (event) {
      event.returnValue = '真的要这样吗'
    })
  }

  /**
   * 页面 dom 渲染完毕 始终会在 load 事件前触发
   */
  domContentLoaded() {
    window.addEventListener('DOMContentLoaded', function (event) {

    })
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
   * 事件委托的实现，如下优势
   * 借助挂载的 dom 通常更快可以访问，例如 document
   * 只添加一个事件处理程序所需的时间更少，DOM 引用更少
   * 整个页面的内存占用也更少，提升整体性能
   */
  handleEvent() {
    let myList = document.querySelector('#myList')
    EventUtil.addHandle(myList, 'click', function (event) {
      event = EventUtil.getEvent(event)
      const target = EventUtil.getTarget(event)
      if (target.id === 'first') {
        console.info('点击到了第一个')
      }
      if (target.id === 'last') {
        console.info('点击到了最后一个')
      }
    })
  }

  /**
   * 事件委托的 DOM
   * 这里仅作示例，没有引入 react 所以并没有真实 render
   */
  render() {
    return <ul id="myList">
      <li id="first">事件委托第一列</li>
      <li id="last">第二列</li>
    </ul>
  }

}

/**
 * addHandle, removeHandle 事件处理，
 * getEvent, getTarget 事件对象
 */
export const EventUtil = {
  addHandle(element, type, handle) { // 这里就省略对 IE 的兼容了
    if (element.addEventListener) {
      return element.addEventListener(type, handler, false)
    }
    element['on' + type] = handle
  },
  removeHandle(element, type, handle) {
    if (element.removeEventListener) {
      return element.removeEventListener(type, handler, false)
    }
    element['on' + type] = null
  },
  getEvent(event) {
    return event ? event : window.event // 兼容 IE
  },
  getTarget(event) {
    return event.target || event.srcElement // 兼容 IE
  },
  preventDefault(event) {
    if (event.preventDefault) {
      event.preventDefault()
    } else {
      event.returnValue = false
    }
  },
  stopPropagation(event) {
    if (event.stopPropagation) {
      event.stopPropagation()
    } else {
      event.cancelBubble = true
    }
  },
}
