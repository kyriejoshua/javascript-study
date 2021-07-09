/******** 《JavaScript 高级程序设计》(第4版) ********/
/******** 14、 DOM 401-444 ********/

/**
 * 可以搞插件，分析页面元素内容组成等等
 * dom 节点数量，注释内容，图片分析，链接分析
 */
const Part14DOM = () => {
  // 14.1 节点层级
  // 文档元素
  console.info(document.documentElement);

  // 14.1.1 Node 类型
  // 浏览器并不支持所有类型
  // 这里用对象属性的方式展示 node type 类型，它们定义在 Node 对象上
  const NODE_TYPS = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12,
  };
  console.info(NODE_TYPS);

  // 这个方式更加直观，打印出了更多的类型
  console.info(Object.keys(Node));

  // 1. nodeName 与 nodeValue

  // 2. 节点关系
  console.info(document.body.childNodes); // NodeList 的实例
  // 首尾子元素
  console.info(document.body.firstChild);
  console.info(document.body.lastChild);
  // 兄弟元素
  console.info(document.body.firstChild.nextSibling);
  console.info(document.body.lastChild.previousSibling);
  // 父级元素
  console.info(document.body.lastChild.parentNode);

  // 3. 操纵节点
  // appendChild 接收节点作为参数，返回新增的节点
  // 如果传入的节点是已有的节点，那么相当于调换了下位置

  // instertBefore 要插入的节点和参照节点

  // replaceChild 要插入的节点和要替换的节点
  // 这个方法会删除节点,并返回被替代的节点

  // removeChild 要删除的节点，也会随之返回

  // 4. 其他方法
  // 所有节点类型共享的方法 cloneNode
  // 接收一个布尔值作为参数，表示是否深复制（包括子节点）

  // 这个方法不会复制事件处理程序，老版本的浏览器可能会复制，这其实是 bug

  // 14.1.2 Document 类型
  const _Document = () => {
    // window 的属性
    console.info(window.document);

    // 1. 文档子节点
    // document.documentElement 指向 Html
    const html = document.documentElement;
    // 此处不等于的原因是第一个子元素是 <!DOCTYPE html>
    console.info(html === document.firstChild); // false
    console.info(html === document.childNodes[1]); // true
    console.info(html === document.firstElementChild); // true

    // 就是上面所说的 <!DOCTYPE html>
    console.info(document.doctype);

    // 2. 文档信息
    // document 是 HTMLDocument 的实例，有以下几个属性
    console.info(document.title); // 对应的修改会实时反映到页面的标题上

    // 对应 location.href 个人理解
    console.info(document.URL);

    // 这个属性在 http 头部信息里也有，只是这里也进行了暴露
    console.info(document.referrer);

    // 上面两个属性都是不可修改的，只有下面这个可以修改，可以设置为主域名
    console.info(document.domain);
    // 可以通过为 iframe 设置相同域名的方式来让他们通信

    // 3. 定位元素
    // getElementById 接收一个参数，就是 id；这个 id 是区分大小写的
    // 找到了就返回元素，找不到就返回 null
    // * 这个方法是在 document 上的，不能在其他元素上使用
    // 例如这样使用是错误的
    document.body.getElementById('div');

    // getElementsByTagName 返回 HTMLCollection 对象 而且是实时的

    // getElementByName 和上述的返回一样 是 HTMLCollection

    // 4. 特殊集合
    // document.forms 所有 form 元素
    // document.links 带 href 的 a 元素
    // document.images 所有 img 元素

    // 5. DOM 兼容性检测

    // 6. 文档写入
    // wirte
    // writeIn 除了写入之外，还会末尾追加换行符
    // 这两者都接收字符串作为参数
    function writeSth(str) {
      document.write(`<strong>${new Date().toString()} ${str}</strong>`);
    }
    writeSth('abc');

    // 注意会覆盖整个页面的内容

  };
  _Document();

  // 14.1.3 Element 类型
  function _Element() {
    // nodeName 或 tagName 属性获取元素名
    // 获取的元素名以大写展示

    // 1. HTML
    // 拥有标准属性
    const div = document.getElementById('div');
    console.info(div.id);
    console.info(div.dir); // 书写方向
    console.info(div.lang); // 语言
    console.info(div.className); // 类名

    // 2. 取得属性
    // getAttribute


    // getAttribute 可以取得自定义属性，即使不是 data- 开头的
    // 主要用来获得自定义属性，另外譬如获取事件处理程序时得到的是源代码

    // 3. 设置属性
    // setAttribute 可以用来设置自定义属性
    // 而如果在 DOM 对象上直接定义属性，并不会成为元素的属性

    // removeAttribute 整个移除属性，而非清空属性的值

    // 4. attributes 属性
    // Element 类型中专属的属性
    // 实际使用场景在迭代元素上所有属性
    /**
     * 迭代某个元素的所有属性
     * @param {*} element
     * @returns
     */
    function outputAllAttributes(element) {
      const len = element.attributes.length;
      let arr = [];

      for (let index = 0; index < len; index++) {
        const attr = element.attributes[index];
        arr.push(`${attr.nodeName}: ${attr.nodeValue}`);
      }

      return arr.join(' ');
    }
    outputAllAttributes(document.body);

    // 5. 创建元素
    // document.createElement

    // 6. 元素后代
    // 这个方法可以获取到元素的后代
    document.getElementsByTagName('div');
  }
  _Element();

  /**
   * 14.1.4 Text类型
   */
  function _Text() {
    // nodeName 的值是 #text
    // 可以通过 data 属性或 nodeValue 来获取值
    // 修改文本节点是会编码的

    // 1. 创建文本节点
    const textNode = document.createTextNode('<strong>Hello</strong> World');
    document.body.appendChild(textNode);

    // 2. 规范化文本节点
    // normalize 合并相邻节点
    const textNode2 = document.createTextNode('Hello2');
    document.body.appendChild(textNode2);
    console.info(document.body.childNodes.length); // 2
    document.body.normalize();
    console.info(document.body.childNodes.length); // 1

    // 3. 拆分文本节点
    // splitText 与前者相反
    // 接收索引位置作为参数

    // 常用于从文本节点中提取数据的 DOM 解析技术
  }
  _Text();

  /**
   * 14.1.5 Comment 类型
   * @param {*} params
   */
  function _Comment() {
    // nodeName 的值是 #comment
    // 可以通过 data 属性或 nodeValue 来获取值
    const comment = document.createComment('test');
    console.info(comment); // <!--test-->

    // 比较少通过 js 创建和访问，因为注释几乎不涉及算法逻辑
  }
  _Comment();

  // 14.1.6 CDATASection

  // 14.1.7 DocumentType
  console.info(document.doctype);

  // 14.1.8 DocumentFragment
  function _DocumentFragment() {
    // 文档片段，轻量级文档

    /**
     * 批量创建元素
     * 通过文档片段的方式来优化性能
     * @param {*} len
     */
    function createFragment(len) {
      let fragment = document.createDocumentFragment();
      for (let index = 0; index < len; index++) {
        const div = document.createElement('div');
        const text = document.createTextNode(index);
        div.appendChild(text);
        div.setAttribute('abc', index);
        fragment.appendChild(div);
      }

      document.body.appendChild(fragment);
    }
    createFragment(109);

  }
  _DocumentFragment();2;

  // 14.1.9 Attr 类型
  function _Attr() {
    // 下面是使用方式
    let attr = document.createAttribute('align');
    attr.value = 'left';
    document.body.setAttributeNode(attr);
  }
  _Attr();

  // 14.2 DOM 编程
  function _DOM() {
    // 14.2.1 动态脚本
    // 两种方式： 引入外部文件和直接插入源代码

    /**
     * 加载脚本
     * @param {*} code
     */
    function loadScript(code) {
      let script = document.createElement('script');
      script.type = 'text/javascript';
      try {
        script.appendChild(document.createTextNode(code));
      } catch (error) {
        script.text = code;
      }
      document.appendChild(script);
    }
    loadScript('console.info("Hello")');

    // 14.2.2 动态样式
    function loadStyles(url) {
      let link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = url;
      let head = document.getElementsByTagName('head')[0];
      head.appendChild(link);
    }
    loadStyles('./index.css');

    function loadStyleString(css) {
      let style = document.createElement('style');
      style.type = 'text.css';
      try {
        style.appendChild(document.createTextNode(css));
      } catch (error) {
        style.stylesheet = css;
      }
      let head = document.getElementsByTagName('head')[0];
      head.appendChild(style);
    }
    loadStyleString('body{background: black}');

    // 14.2.3 操作表格
    function createTable() {
      let table = document.createElement('table');
      table.border = 1;
      table.width = '100%';

      let tbody = document.createElement('tbody');
      table.appendChild(tbody);

      // 创建第一行
      tbody.insertRow(0);
      tbody.rows[0].insertCell(0);
      tbody.rows[0].cells[0].appendChild(document.createTextNode('Cell 1, 1'));
      tbody.rows[0].insertCell(1);
      tbody.rows[0].cells[0].appendChild(document.createTextNode('Cell 2, 1'));

      // 创建第二行
      tbody.insertRow(1);
      tbody.rows[0].insertCell(0);
      tbody.rows[0].cells[0].appendChild(document.createTextNode('Cell 1, 1'));
      tbody.rows[0].insertCell(1);
      tbody.rows[0].cells[0].appendChild(document.createTextNode('Cell 2, 1'));

      document.body.appendChild(table);
    }
    createTable();

    // 14.2.4 使用 NodeList
    function _NodeList() {
      // NodeList 是实时的
      // 遍历节点的方式 要手动保存 length
      let divs = document.getElementsByTagName('div');

      for (let index = 0, len = divs.length; index < len; index++) {
        const div = divs[index];
        console.info(div);
        document.body.appendChild(div);
      }

      // 或者使用递减的方式遍历
      // 反向迭代集合
      for (let index = divs.length - 1; index >= 0; index--) {
        const div = divs[index];
        console.info(div);
        document.body.appendChild(div);
      }
    }
    _NodeList();
  }

  _DOM();

  /**
   * MutationObserver 接口
   * 可以用来监控用户的操作变化
   */
  function _MutationObserver() {
    // 可以用来观察 DOM 的变化
    // 14.3.1 基本用法
    // 1. observe() 方法
    // MutationObserverInit 对象用于控制观察哪些方面的变化 是一个键值对对象
    function observeBody() {
      const observer = new MutationObserver(() => console.info('body changed'));
      observer.observe(document.body, { attributes: true });
    }
    observeBody();
    document.body.setAttribute('data-set', 123);

    // 2. 回调与 MutationRecord
    // 每个回调都会收到 MutationRecord 的实例数组作为第一个参数
    // 这里对应的是 record
    function observeBodyRecord() {
      const observer = new MutationObserver((records) => console.info(records));
      observer.observe(document.body, { attributes: true });
    }
    observeBodyRecord();
    // 多次操作会生成多条记录，例如这里会返回长度为 2 的数组
    document.body.setAttribute('data-set', 123);
    document.body.setAttribute('data-set', 456);
    // [MutationRecord, MutationRecord]

    // 第二个参数是观察变化的实例 MutationObserver
    function observeBodyRecords() {
      const observer = new MutationObserver((records, observe) => console.info(records, observe));
      observer.observe(document.body, { attributes: true });

      return observer;
    }
    const ob = observeBodyRecords();
    document.body.setAttribute('data-set', 123);

    // 3. disconnect() 方法
    // 用于提前终止回调
    ob.disconnect();
    // 再次修改则不会有打印日志输出
    document.body.setAttribute('data-set', 123);

    // 4. 复用 MutationObserver
    // 一个 observer 可以检测多个 DOM
    function observeElements() {
      const observer = new MutationObserver((mutationRecords) => console.info(mutationRecords.map((r) => r.target)));
      observer.observe(document.body, { attributes: true });

      const div = document.createElement('div');
      observer.observe(div, { attributes: true });

      return { div, observer };
    }

    const { div: aDiv, observer: obob } = observeElements();
    aDiv.setAttribute('class', 'ant');
    document.body.setAttribute('class', 'margin-left-16');

    // 不过使用 disconnect 断开的话是一起断开
    obob.disconnect();

    // 5. 重用 MutationObserver
    // 可以对断开连接的 MutationObserver 进行重新连接
    // 只需沿用原来的观察者即可

    // 14.3.2 MutationObserverInit 与观察范围
    // 观察者可以观察的事件包括属性变化，文本变化和子节点变化
    // 1. 观察属性
    // MutationObserver 可以观察节点属性的添加移除和修改
    // 上面的案例就是观察所有属性
    // 如果要观察某个属性,可以通过设置白名单
    /**
     * 接收一个属性列表
     * @param  {...any} attrNames
     */
    function observeAttribute(...attrNames) {
      const observer = new MutationObserver((mutationRecords) => console.info(mutationRecords));
      observer.observe(document.body, { attributeFilter: [...attrNames] });
    }
    // 观察 class 的变化
    observeAttribute(['class']);
    document.body.className = 'abc';

    // 如果想要获取旧值，则需要参数
    function observeAttributeOldValue(...attrNames) {
      const observer = new MutationObserver((mutationRecords) => console.info(mutationRecords.map((r) => r.oldValue)));
      observer.observe(document.body, { attributeFilter: [...attrNames], attributeOldValue: true });
    }
    // 观察 class 的变化
    observeAttributeOldValue(['class']);
    document.body.className = 'abc';
    document.body.className = 'ant';
    // 打印出以下的值
    // [null, 'abc']

    // 2. 观察字符数据
    // MutationObserver 可以观察文本节点(Text Comment)的添加删除和修改
    // 只需要设置一个属性 characterData
    // 当然也可以保留旧值
    /**
     * 观察文本节点的变化及打印旧值
     */
    function observeData() {
      const observer = new MutationObserver((rs) => console.info(rs.map((r) => r.oldValue)));
      observer.observe(document.body.firstChild, { characterData: true, characterDataOldValue: true });
    }
    observeData();
    document.body.firstChild.textContent = 'Hello';
    document.body.firstChild.textContent = 'World';
    // 输出 [null, 'Hello']

    // 注意，下面这个方式不是对文本节点的修改
    // document.body.appendChild(document.createTextNode('Hello'));

    // 3. 观察子节点
    // MutationObserver 可以观察子节点的添加删除和修改
    /**
     * 观察子节点的方法案例
     */
    function observeChildNodes() {
      const observer = new MutationObserver((rs) => console.info(rs.map((r) => r.target)));
      observer.observe(document.body, { childList: true });
    }
    observeChildNodes();
    document.body.appendChild(document.createTextNode('Hello'));
    document.body.removeChild(document.body.lastChild);
    // [body, body]

    // 对子节点重新排序，会报告两次变化事件，因为技术上其实是先删除后添加

    // 4. 观察子树
    // 可以通过设置 subtree 的方式来设置观察范围是所有的后代节点
    /**
     * 观察所有后代元素案例
     */
    function observeSubtree() {
      // 先清空便于演示效果
      document.body.innerHTML = '';
      const observer = new MutationObserver(console.info);
      observer.observe(document.body, { attributes: true, subtree: true });
    }
    observeSubtree();
    document.body.appendChild(document.createElement('div'));
    document.body.firstChild.className = 'display-flex';

    // 14.3.3 异步回调与记录队列
    // 1. 记录队列
    // 微任务

    // 2. takeRecords() 方法
    // 用于清空记录队列并返回所有 MutationRecord 实例
    function observeTakeRecords() {
      // 先清空便于演示效果
      document.body.innerHTML = '';
      const observer = new MutationObserver(console.info);
      observer.observe(document.body, { attributes: true, subtree: true });
      return observer;
    }
    const obTake = observeTakeRecords();
    document.body.appendChild(document.createElement('div'));
    document.body.firstChild.className = 'display-flex';
    document.body.firstChild.className = 'display-block';
    console.info(obTake.takeRecords()); // [MutationRecord, MutationRecord]
    console.info(obTake.takeRecords()); // []

    // 14.3.4 性能、内存与垃圾回收
    // 1. MutationObserver 的引用
    // MutationObserver 实例与目标节点之间的引用关系是非对称的
    // 节点被回收之后， MutationObserver 也会被回收
    // 但是 MutationObserver 回收，则不影响节点

    // 2. MutationRecord 的引用
    // 每个 MutationRecord 至少包含有对一个 DOM 节点的引用
    // 因此如果要释放内存，最好是将 MutationRecord 的有用信息保存到一个新对象中，然后抛弃 MutationRecord
  }
  _MutationObserver();
};

export default Part14DOM;
