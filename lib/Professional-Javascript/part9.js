/******** 《JavaScript 高级程序设计》 ********/
/******** 9、客户端检测 ********/

export default class Part9Client {
  constructor() {

    // 9.2 怪癖检测
    // 实际上是检测浏览器的 Bug

    /**
     * 9.3 用户代理检测
     * 检测用户代理字符串，因为极其不规则，特殊设置较多，不推荐
     * 最不推荐，客户端检测的最后的选择方式 能力检测/怪癖检测 > 用户代理检测
     * 模块增强模式实现
     */
    let client = (function (params) {
      let engine = {
        ie,
        opera: 0,
        webkit: 0,
        ver: null,
      }

      let browser = {
        safari: 0,
        ie: 0,
        opera: 0,
        chrome: 0,

        ver: null
      }

      let system = {
        win: false,
        mac: false,
        x11: false,

        // 移动设备
        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false,

        // 游戏系统
        wii: false,
        ps: false
      }

      const ua = navigator.userAgent
      const p = navigator.platform

      if (window.opera) {
        engine.ver = browser.ver = window.opera.version()
        engine.opera = browser.opera = parseFloat(engine.var)
      } else if (/AppleWebkit\/(\S+)/.test(ua)) {
        engine.ver = RegExp["$1"]
        engine.webkit = parseFloat(engine.var)

        if (/Chrome\/(\S+)/.test(ua)) {
          browser.ver = RegExp["$1"]
          browser.chrome = parseFloat(browser.var)
        } else if (/Version\/(\S+)/.test(ua)) {
          browser.ver = RegExp["$1"]
          browser.safari = parseFloat(browser.var)
        }

      } else if (/MSIE([^;]+)/.test(ua)) {
        engine.ver = browser.ver = RegExp["$1"]
        engine.ie = browser.ie = parseFloat(engine.var);
      }

      system.win = p.includes('Win')
      system.mac = p.includes('Mac')
      system.x11 = p.includes("X11") || p.includes("Linux")

      system.iphone = ua.includes('iPhone')
      system.ipod = ua.includes('iPod')
      system.ipad = ua.includes('iPad')

      if (/Android(\d+\.\d+)/.test(ua)) {
        system.android = RegExp.$1
      }

      system.wii = ua.includes('wii')
      system.ps = /playstation/i.test(ua)

      return {
        browser,
        engine,
        system
      }
    })()
  }

  /**
   * 9.1 能力检测
   * 检测特定浏览器的能力
   * 常见于各种兼容的情况里
   * IE 5 以下没有这个方法
   * @param {*} id
   */
  getElementById(id) {
    if (document.getElementById) {
      return document.getElementById(id)
    } else if (document.all) {
      return document.all(id)
    } else {
      throw new Error('No way to retrieve element!')
    }
  }

  /**
   * 9.1.1 更可靠的能力检测
   * 检测对象是否可以使用排序方法
   * 该方法不正确，因为会误判存在着 sort 属性而不是 sort 方法的情况
   * 例如 isSortableError({ sort: true })
   * @param {*} object
   */
  isSortableError(object) {
    return !!object.sort
  }

  /**
   * 上一个方法的正确打开方式
   * @param {*} object
   */
  isSortable(object) {
    return typeof object.sort === 'function'
  }
}
