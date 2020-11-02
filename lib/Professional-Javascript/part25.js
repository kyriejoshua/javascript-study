/******** 《JavaScript 高级程序设计》 ********/
/******** 25、新兴的 API ********/
import { EventUtil } from "./part13"

/**
 * 错误码枚举
 */
export const FILE_READER_ERROR_CODE = {
  /**
   * 未找到文件
   */
  "NOT_FOUND": 1,
  /**
   * 安全性错误
   */
  "SECURITY_ERROR": 2,
  /**
   * 读取中断
   */
  "ABORT": 3,
  /**
   * 文件不可读
   */
  "READ_ERROR": 4,
  /**
   * 编码错误
   */
  "CODEING_ERROR": 5
}

/**
 * 表示刚刚发生的导航类型
 */
export const PERFORMANCE_NAVIGATION_TYPES = {
  /**
   * 页面首次加载
   */
  TYPE_NAVIGATE: 0,
  /**
   * 页面重载过
   */
  TYPE_RELOAD: 1,
  /**
   * 页面是通过后退或者前进按钮打开的
   */
  TYPE_BACK_FORWARD: 2
}

export default class Part25NewAPIS {
  constructor() {
    // 25.1 requestAnimationFrame
    // 25.1.1 早期动画循环
    // 使用定时器的方式实现
    this.makeAnimationInOldTimes()
    // 间隔时间设置短了，动画会不流畅，但是设置多了，会耗费浏览器性能
    // 浏览器有重绘限制
    // setInterval 第二个参数只能当作参考，是添加到浏览器进程中的时间，不是实际的执行时间

    // 25.1.2 循环间隔的问题
    // 各个浏览器的计时器精度不一致

    // 25.1.3 mozRequestAnimationFrame
    this.updateProgressUsingMoz()

    // TODO 了解这一块的原理
    this.getDrawTime()

    // 25.1.4 webkitRequestAnimationFrame 与 msRequestAnimationFrame
    this.getDrawTimeBetter()

    // 25.2 Page Visibility API
    console.info(document.hidden)
    console.info(document.visibilityState)
    console.info(document.visibilityChange)

    // 当前浏览器是否支持该属性
    this.isHiddenSupported()

    // 页面是否被隐藏
    this.isPageHidden()

    // 25.3 Geolocation API
    const options = {
      enableHighAccuracy: true, // 布尔值，表示必须尽可能使用最准确的位置信息，默认 false，否则会有比较多的性能消耗
      timeout: 500, // 以毫秒数表示的等待位置信息的最长时间
      maximumAge: 25000 // 表示上一次取得的坐标信息的有效时间
    }
    // 获取位置方法支持成功的回调函数，失败的回调函数，以及可选的参数对象
    navigator.geolocation.getCurrentPosition(this.getCurrentPosition, this.getCurrentPositionFailedCallback, options)

    // 监听位置变化方法的参数与上一个完全一样，但它返回一个 id，类似 setTimeout 可以用来取消监听
    const watchId = navigator.geolocation.watchPosition(this.getCurrentPosition, this.getCurrentPositionFailedCallback, options)

    // 这个方法用来取消
    navigator.geolocation.clearWatch(watchId)

    // 简化的写法
    const id = this.watchPosition()
    this.clearWatch(id)

    // 25.4 File API
    const fileList = document.getElementById('file-list')

    // 通过监听 change 事件就可以读取 files 集合然后获取每个选择的文件信息
    EventUtil.addHandle(fileList, 'change', this.handleFileList)

    // 25.4.1 FileReader 类型
    // 下面是读取表单中选择的文件并显示在页面上
    EventUtil.addHandle(fileList, 'change', this.handleFileListUsingFileReader)

    // 25.4.2 读取部分内容
    // 取出部分数据的方法
    this.blobSlice()

    // 读取部分内容的调用, 适合只关注文件头部或某个特定部分的情况
    EventUtil.addHandle(fileList, 'change', this.handleFileListUsingFileReaderPart)

    // 25.4.3 对象 URL
    // this.createObjectURL(blob)
    EventUtil.addHandle(fileList, 'change', this.handleFileListUsingObjectURL)

    // 用完之后需要释放内存
    // this.revokeObjectURL(url)

    // 25.4.4 读取拖放的文件
    const dropTarget = document.getElementById('droptarget')
    // 需要取消默认行为 下面可以读取文件信息
    EventUtil.addHandle(dropTarget, 'dragenter', this.handleDropEvent)
    EventUtil.addHandle(dropTarget, 'dragover', this.handleDropEvent)
    EventUtil.addHandle(dropTarget, 'drop', this.handleDropEvent)

    // 25.4.5 使用 XHR 上传文件
    EventUtil.addHandle(dropTarget, 'dragenter', this.uploadFileUsingXHR)
    EventUtil.addHandle(dropTarget, 'dragover', this.uploadFileUsingXHR)
    EventUtil.addHandle(dropTarget, 'drop', this.uploadFileUsingXHR)

    // 25.5 Web 计时
    // 核心是 window.performance 对象
    // 有两个主要属性 navigation 和 timing, 但是注意，在当前，2020，这两个属性已经不推荐使用了
    // 第一个是 navigation，有多个属性 redirectCount 和 type
    // 下面是 type 属性的枚举, 表示刚刚发生的导航类型
    console.info(window.performance.navigation.type)
    console.info(PERFORMANCE_NAVIGATION_TYPES)
    // redirectCount 页面加载前的重定向次数

    // 25.6 Web Workers
    // 25.6.1 使用 Worker
    const newWorker = this.initWorker()

    newWorker.runWorker()

    const onmessage = (event) => {
      let data = event.data
      console.info(data)
      // 对数据进行处理
    }

    this.bindMessageEvent(newWorker, onmessage)

    const onerror = (event) => {
      console.error(`Error: ${event.fileName}(${event.lineno}): ${event.message}`)
    }

    this.bindErrorEvent(newWorker, onerror)

    // 25.6.2 Worker 全局作用域
    // 自己独立的一个全局作用域，和窗口的 window 互不影响

    // 25.6.3 包含其他脚本
    // 独立作用域里执行的脚本，会按加载顺序执行
    // importScripts 是自带方法
    importScripts('file1.js', 'file2.js')

    // 25.6.4 Web Workers 的未来
    // 目前还没有一个明确的未来
  }

  /**
   * 以前实现动画的方式是使用定时器
   */
  makeAnimationInOldTimes = () => {
    (function() {
      function updateAnimations() {
        // doAnimation1()
        // doAnimation2()
        // 其他动画
      }
      setInterval(updateAnimations, 100)
    })()
  }

  /**
   * 使用 moz 的方式实现进度条
   */
  updateProgressUsingMoz = () => {
    function updateProgress() {
      let div = document.getElementById('status')
      div.style.width  = (parseInt(div.style.width, 10) + 5) + '%'

      if (div.style.left !== '100%') {
        mozRequestAnimationFrame(this.updateProgressUsingMoz)
      }
    }
    mozRequestAnimationFrame(updateProgress)
  }

  /**
   * 拿到上一次重绘的时间码，用当前时间去减去，得到差值，最终计算出每次执行的间隔时间
   */
  getDrawTime = () => {
    function draw(timestamp) {
      // 计算两次重绘的时间间隔
      let diff = timestamp - startTime

      // 使用 diff 确定下一步的绘制时间

      // 把 startTime 重写为这一次的绘制时间
      startTime = timestamp

      // 重绘 UI
      mozRequestAnimationFrame(draw)
    }

    // 官方已经定义好的变量
    let startTime = mozAnimationStartTime
    mozRequestAnimationFrame(draw)
  }

  /**
   * 兼容方案的动画处理
   */
  getDrawTimeBetter = () => {
    (function (params) {
      function draw(timestamp) {
        // 计算两次重绘的时间间隔
        let drawStart = (timestamp || Date.now()),
          diff = drawStart - timestamp

        // 使用 diff 确定下一步的绘制时间

        // 把 startTime 重写为这一次的绘制时间
        startTime = drawStart

        // 重绘 UI
        requestAnimationFrame(draw)
      }

      const requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame,
        startTime = window.mozAnimationStartTime || Date.now();

      requestAnimationFrame(draw)
    })()
  }

  /**
   * 在本书推出的时候，只有 chrome 和 ie 实现了该属性，但实际上现在主流浏览器应该都支持了
   */
  isHiddenSupported = () => {
    return typeof (document.hidden || document.msHidden || document.webkitHidden) !== 'undefined'
  }

  /**
   * 兼容写法
   */
  isPageHidden = () => {
    return document.hidden || document.msHidden || document.webkitHidden
  }

  /**
   * 浏览器获取当前位置函数的回调函数
   * @param {*} position
   */
  getCurrentPosition = (position) => {
    console.info(position)
  }

  /**
   * 获取浏览器位置参数失败的回调函数
   * @param {*} error
   */
  getCurrentPositionFailedCallback = (error) => {
    const { message, code } = error

    console.info('error message', message)
    console.info('error code', code)
  }

  /**
   * 解构之后的写法
   * @param  {...any} params
   */
  watchPosition = (...params) => {
    const { geolocation: { watchPosition } } = navigator

    return watchPosition(...params)
  }

  /**
   * 取消监听
   * @param {*} watchId
   */
  clearWatch = (watchId) => {
    const { geolocation: { clearWatch } } = navigator

    return clearWatch(watchId)
  }

  /**
   * 监听文件 change 事件的回调，获取每个文件的信息
   * @param {*} event
   */
  handleFileList(event) {
    const files = EventUtil.getTarget(event).files,
      i = 0,
      len = files.length

    while (i < len) {
      const currentFile = files[i]
      console.info(`${currentFile.name} (${currentFile.tyle}, ${currentFile.size} bytes)`)
      i++
    }
  }

  /**
   * 读取表单中选择的文件并显示在页面上
   * @param {*} event
   */
  handleFileListUsingFileReader = (event) => {
    let info = '',
      output = document.getElementById('output'),
      progress = document.getElementById('progress'),
      files = EventUtil.getTarget(event).files,
      type = 'default',
      reader = new FileReader()
    const [firstFile] = file

    if (/images/.test(firstFile.type)) {
      reader.readAsDataURL(firstFile)
      type = 'image'
    } else {
      reader.readAsText(firstFile)
      type = 'text'
    }

    reader.onerror = function () {
      output.innerHTML = 'Could not read file, error code is ' + reader.error.code
    }

    reader.onprogress = function (event) {
      if (event.lengthComputable) {
        progress.innerHTML = event.loaded + '/' + event.total
      }
    }

    reader.onload = function () {
      let html = ''
      switch (type) {
        case "image":
          html = "<img src=\"" + reader.result + "\">"
          break;
        case "text":
          html = reader.result
          break;
      }
      output.innerHTML = html
    }
  }

  /**
   * 读取文件的一部分内容，兼容的写法
   * @param {*} blob
   * @param {*} startByte 起始字节
   * @param {*} length 要读取的字节数
   * return Blob 是 File 类型的父类型
   */
  blobSlice = (blob, startByte, length) => {
    if (blob.slice) {
      return blob.slice(startByte, length)
    } else if (blob.webkitSlice) {
      return blob.webkitSlice(startByte, length)
    } else if (blob.mozSlice) {
      return blob.mozSlice(startByte, length)
    } else {
      return null
    }
  }

  /**
   * 上面这个函数的简化写法，哪种更好呢
   * @param {*} blob
   * @param {*} startByte
   * @param {*} length
   */
  blobSliceMinified = (blob, startByte, length) => {
    const slice = blob.slice ? blob.slice : blob.webkitSlice ? blob.webkitSlice : blob.mozSlice ? blob.mozSlice : null

    return slice ? slice(startByte, length) : null
  }

  /**
   * 读取文件的 32b 内容
   * @param {*} event
   */
  handleFileListUsingFileReaderPart = (event) => {
    let info = '',
      output = document.getElementById('output'),
      progress = document.getElementById('progress'),
      files = EventUtil.getTarget(event).files,
      reader = new FileReader();
    const [firstFile] = files,
      blob = this.blobSlice(firstFile, 0, 32)

    if (blob) {
      reader.readAsText(blob)

      reader.onerror = function () {
        output.innerHTML = 'Could not read file,  error code is ' + reader.error.code
      }

      reader.onload = function () {
        output.innerHTML = reader.result
      }
    } else {
      alert('Your browser doesnot support slice()')
    }
  }

  /**
   * 创建对象 url
   * @param {*} blob
   * return 返回字符串 指向一块内存的地址
   */
  createObjectURL = (blob) => {
    if (window.URL) {
      return window.URL.createObjectURL(blob)
    } else if (window.webkitURL) {
      return window.webkitURL.createObjectURL(blob)
    } else {
      return null
    }
  }

  /**
   * 对象 URL 的应用
   * @param {*} event
   */
  handleFileListUsingObjectURL = (event) => {
    let info = '',
      output = document.getElementById('output'),
      progress = document.getElementById('progress'),
      files = EventUtil.getTarget(event).files,
      reader = new FileReader(); // 此分号必须加，否则程序执行出错
    const [firstFile] = files,
      url = this.createObjectURL(firstFile)

    if (url) {
      if (/image/.test(firstFile.type)) {
        output.innerHTML = `<img src="${url}" />`
      } else {
        output.innerHTML = 'Not an image.'
      }
    } else {
      alert('Your browser doesnot support Object URLs')
    }
  }

  /**
   * 释放占用的内存
   * @param {*} url
   */
  revokeObjectURL = (url) => {
    if (window.URL) {
      window.URL.revokeObjectURL(url)
    } else if (window.webkitURL) {
      window.webkitURL.revokeObjectURL(url)
    }
  }

  /**
   * 获取拖放事件中的文件
   * @param {*} event
   */
  handleDropEvent = (event) => {
    let info = '',
      output = document.getElementById('output'),
      files, i, len

    EventUtil.preventDefault(event)

    if (event.type === 'drop') {
      files = event.dataTransfer.files
      i = 0
      len = files.length

      while (i < len) {
        const file = files[i]
        info += `${file.name} (${file.type}, ${file.size} bytes <br/>)`
        i++
      }
      output.innerHTML = info
    }
  }

  /**
   * 使用 XHR 上传文件数据
   * @param {*} event
   */
  uploadFileUsingXHR = (event) => {
    let info = '',
      output = document.getElementById('output'),
      data, xhr, files, i, len

    EventUtil.preventDefault(event)

    if (event.type === 'drop') {
      data = new FormData()
      files = event.dataTransfer.files
      i = 0,
      len = files.length

      while (i < len) {
        data.append('file' + i, files[i])
        i++
      }

      xhr = new XMLHttpRequest()
      xhr.open('post', 'FileAPIExample06Upload.php', true)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          alert(xhr.reponseText)
        }
      }
      xhr.send(data)
    }
  }

  /**
   * 根据文件名创建 实例化 Worker
   * @param {String} fileName
   */
  initWorker = (fileName) => {
    return new Worker(fileName)
  }

  /**
   * 执行文件名里的文件代码
   * @param {*} worker
   */
  runWorker = (worker) => {
    worker.postMessage('start!')
  }

  /**
   * 绑定消息事件处理程序
   * @param {*} worker
   * @param {*} onmessage
   */
  bindMessageEvent = (worker, onmessage) => {
    worker.onmessage = onmessage
  }

  /**
   * 绑定错误事件处理程序
   * @param {*} worker
   * @param {*} onerror
   */
  bindErrorEvent = (worker, onerror) => {
    worker.onerror = onerror
  }
}
