/******** 《JavaScript 高级程序设计》 ********/
/******** 8、BOM ********/

// 8.1 window 对象
// window 既是全局对象，又是 ECMAScript 规定的 Global 对象
export default class Part8Window {
  constructor() {

    // 8.2.2 位置操作
    // location.assign(url)
    // window.location = url
    // window.location.href = url
    // 这三行代码等效

    window.location.reload() // 重新加载，可能会有缓存
    window.location.reload(true) // 重新加载，从服务器重新加载
  }

  /**
   * 8.1.6 间歇调用和超时调用
   * 间歇调用
   */
  intervalFunction() {
    var num = 0;
    var max =  10;
    var intervalId = null;

    function incrementNumber() {
      num++

      // 直到满足条件，然后取消执行
      if (num === max) {
        clearInterval(intervalId)
        console.info('Done')
      }
    }

    intervalId = setInterval(incrementNumber, 500);
  }

  /**
   * 超时调用
   * 实现和上个方法一样的效果
   * 通常超时调用优于间歇调用，因为他少了一部取消的操作
   * 而且间歇调用可能会出现后一次间歇调用可能会在前一个间歇调用结束之前执行
   */
  setTimeoutFunction() {
    var num = 0
    var max = 10

    function incrementNumber() {
      num++

      // 未满足情况时接着调用
      if (num < max) {
        window.setTimeout(incrementNumber, 500);
      } else {
        console.info('Done')
      }
    }

    window.setTimeout(incrementNumber, 500)
  }

  confirmFunction() {
    if (window.confirm('Are you ok?')) {
      console.info('ok')
    } else {
      console.info('not ok')
    }
  }

  /**
   * 8.2 location
   * 8.2.1 查询字符串参数
   * 获取 Url querystring
   */
  getQueryStringParams() {
    const search = window.location.search
    const searchString = search.split('?')[1]

    if (!searchString) { return {} }
    const searchArray = searchString.split('&')

    let queryParams = {}
    searchArray.forEach((param) => {
      const arr = param.split('=')
      const [key, value] = arr
      queryParams[key] = value
    })

    return queryParams
  }
  getQueryStringParams()

}
