/******** 《JavaScript 高级程序设计》(第4版) ********/
/******** 2、HTML 中的 JavaScript ********/
export default class Part2JavaScriptInHTML {
  constructor(){
    // 完整的 js 包括 ecmaScript bom 和 dom
    // 2.1 script 元素
    // async
    // charset
    // crossorigin
    // defer
    // integrity
    // src
    // type

    // 可以网页中直接嵌入行内代码
    this.renderHTML();
    this.renderHTMLwithScript();
    // 或者外部引入
    this.renderHTMLwithOutterScript();
    // 两者皆有，但是只执行外部引入的
    this.renderHTMLwithBothScript();

    // 2.1.1 标签位置
    // 以前放在顶部 head 内，但是会阻塞页面加载
    // 后来放在 body 之后

    // 2.1.2 推迟执行脚本
    // 给 script 添加属性 defer 之后，脚本会优先下载，但会延迟执行
    // 直到浏览器解析完 HTML
    // 多个的脚本相互之间是顺序执行的
    // 理论上应当在 DOMContentLoaded 事件之前执行，但不能完全保证，后面会具体提到
    this.renderHTMLwithDeferScript();

    // 2.1.3 异步执行脚本
    // 和上个类似，但多个脚本是异步执行的，不一定按顺序，重点在于前后之间有没有依赖关系
    // 在 load 事件前执行
    // 不一定在 DOMContentLoaded 之前执行
    this.renderHTMLwithAsyncScript();

    // 2.1.4 动态加载脚本
    this.renderScriptDynamicly();
    /**
     * 以上的方式加载对于浏览器的预加载器是不可见的，这可能会影响资源的优先级
     * 要想让浏览器预加载直到动态请求文件的存在，可以在文档头部显式地声明它们
     */
    // <link rel="preload" href="example.js">

    // 2.1.5 XHTML 中的变化
    // 仅阅读

    // 2.1.6 废弃的语法
    // 仅阅读

    // 2.2 行内代码与外部文件 TODO
    // 可维护性: 统筹管理
    // 缓存
    // 适应未来

    // 2.3 文档模式
    // !doctype

    // 2.4 <noscript> 元素
    // 浏览器不支持脚本或者浏览器的脚本关闭;
    this.renderHTMLwithNoScript();
  }

  /**
   * 渲染行内脚本
   */
  renderHTML() {
    return `<script>
      function sayHi() {
        console.info('Hi');
      }
    </sript>`;
  }

  /**
   * 特殊字符需要转义字符
   */
  renderHTMLwithScript() {
    return `<script>
      function sayScript() {
        console.info('<\/script>');
      }
    </sript>`;
  }

  /**
   * 外部引入的方式
   */
  renderHTMLwithOutterScript() {
    return `<script src="example.js">
    </sript>`;
  }

  /**
   * 外部引入的方式执行顺序高于行内逻辑
   */
  renderHTMLwithBothScript() {
    return `<script src="example.js">
      function sayHi() {
        console.info('Hi');
      }
    </sript>`;
  }

  /**
   * 推迟执行
   */
  renderHTMLwithDeferScript() {
    return '<script defer src="example.js"></script>';
  }

  /**
   * 异步执行
   */
  renderHTMLwithAsyncScript() {
    return '<script async src="example.js"></script>';
  }

  /**
   * 动态向 HTML 中添加网页
   * 这里默认加载的 Script 是异步的，相当于默认添加了 async 属性
   * 但是不是所有浏览器都支持 async 这个属性的
   * 所以最好这里把它设置为 false
   */
  renderScriptDynamicly() {
    let script = document.createElement('script');
    script.src = 'example.js';
    script.async = false;
    document.head.appendChild(script);
    // document.body.appendChild(script);
  }

  renderHTMLwithNoScript() {
    return `<html>
      <head>
        <title>Example HTML Page</title>
      </head>
      <body>
        <noscript>
          The Browser doesnt support javascript or someone has disabled javascript!
        </noscript>
      </body>
    </html>`;
  }
}
