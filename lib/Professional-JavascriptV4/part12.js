/******** 《JavaScript 高级程序设计》(第4版) ********/
/******** 12、 函数 361-381 history 重点 ********/

/**
 * 浏览器对象模型 Browser Object Model
 */
const Part12BOM = () => {
  // 12.1 window 对象
  // window 对象是 BOM 的核心
  // 它是浏览器窗口提供的 js 接口，同时也是实现了 js 全局对象 global 的对象

  // 12.1.1 Global 作用域
  // 12.1.2 窗口关系
  // 父级窗口 如果是 iframe 可以用来访问父级
  window.parent;
  // 浏览器最上层窗口，即本身
  window.top;
  // 浏览器本身
  window.self;

  // 12.1.3 窗口位置与像素比
  // window.moveTo
  // window.moveBy
  // 这两个方法用来移动窗口，但在部分浏览器中禁用
  // 实测 chrome 中禁用

  // 移动端所需更多 定义缩放的比例，因不同设备端分辨率不同
  // 物理像素与逻辑像素之间的缩放系数
  window.devicePixelRatio;

  // 12.1.4 窗口大小
  // innerWidth innerHeight
  // outerWidth, outerHeight

  // resizeTo resizeBy
  // 在许多浏览器中被禁用

  // 12.1.5 视口位置
  // window.scrollTo
  // window.scrollBy

  // 也可以接受一个对象 ScrollTopOptions
  window.scrollTo({
    top: 100,
    left: 200,
    behavior: 'smooth'
  });

  // 12.1.6 导航与打开新窗口

  window.open('https://www.baidu.com', 'bb');
  // 等同于
  // <a href="https://www.baidu.com" target="bb">click</a>

  // 1. 弹出窗口
  // window.open 用于打开新窗口
  // 第二个参数用于定义窗口名
  // 如果传入的第二个参数是对应的已有窗口名，则会跳转到那个窗口
  window.open('https://www.baidu.com', 'bb'); // 打开新窗口，访问百度
  // 切换回刚才运行的窗口（必须)
  window.open('https://www.baidu.com', 'bb'); // 跳转到刚才的百度窗口
  // 切换回刚才运行的窗口（必须)
  window.open('https://www.bing.com', 'bb'); // 跳转到刚才的百度窗口，并且页面跳转到必应页面

  // 如果中途切换到别的窗口运行，则不生效
  // 可以理解为新开的窗口和当前窗口建立起了联系，但和别的窗口没有关联

  // 第三个参数是特性字符串，用于定义新开窗口的特性，例如窗口大小，窗口的位置
  // 常用于小广告，系统验证等
  // 逗号分隔的字符串形式
  window.open('https://www.bing.com', 'bb', 'height=400,width=400,Menubar=yes,toolbar=yes');

  // window.open 返回新窗口的引用
  const newWindow = window.open('https://www.bing.com', 'bb', 'height=400,width=400,Menubar=yes,toolbar=yes');
  // 在支持方法的浏览器里可以操作移动
  newWindow.moveBy(100, 100);
  newWindow.scrollBy(100, 100);
  // 也可以关闭 - 感觉可以恶作剧？安全问题等
  newWindow.close();

  // opener 属性指向打开的窗口
  console.info(newWindow.opener === window); // true

  // 可以通过把  opener 设置为 null 断开和原窗口的关联
  newWindow.opener = null; // 原窗口便不能再操作 window.open 打开的新窗口了

  // 2. 安全限制
  // 如前所述，弹出窗口被滥用在了在线广告上
  // 因此部分浏览器对此做了限制

  // 3. 弹窗屏蔽程序
  // 检测 window.open 的返回值，通常是 null ，也在部分浏览器中会报错
  // 兼容的写法是使用 Trycatch
  function hasOpenerBlocked() {
    let blocked = false;
    try {
      let opener = window.open('https://www.baidu.com');
      if (opener === null) {
        blocked = true;
      }
    } catch (error) {
      blocked = true;
    }
    return blocked;
  }
  let blocked = hasOpenerBlocked();
  console.info('blocked ?: ', blocked);

  // 12.1.7 定时器
  // setTimeout
  // setInterval
  // 第二个参数都是加入到任务队列的时间，而非实际等待的时间
  // 如果任务队列里还有任务执行，则先执行队列里的任务
  /**
   * 使用 setInterval
   */
  function countByInterval() {
    let num = 0;
    let interval;

    let increateNumber = function () {
      num++;
      console.info(num);
      if (num >= 10) {
        clearInterval(interval);
        console.info('over');
      }
    };
    interval = setInterval(increateNumber, 500);
  }

  countByInterval();

  /**
   * 可以用 settimeout 来替代实现（更推荐）
   */
  function countByTimeout() {
    let num = 0, timerId;

    let increateNumber  = function () {
      num++;
      console.info(num);
      if (num >= 10) {
        // clearTimeout(timerId); 这一步可以不用，自动会停止
        console.info('over');
      } else {
        timerId = setTimeout(increateNumber, 500);
      }
    };

    timerId = setTimeout(increateNumber, 500);
  }
  countByTimeout();

  // 实际情况下更推荐使用 settimeout, 基本上 setInterval 的各种场景也可以通过 settimeout 来模拟实现

  // 12.1.8 系统对话框
  // confirm alert prompt
  /**
   * 警告对话框
   * @param {*} str
   */
  function alertSth(str) {
    alert(str);
  }

  alertSth();

  /**
   * 确认对话框
   * @param {*} str
   */
  function confirmSth(str = 'yes or no') {
    if (confirm(str)) {
      console.info('yes');
    } else{
      console.info('no');
    }
  }
  confirmSth();

  /**
   * 用户可以输入信息的对话框
   * @param {*} str
   */
  function promptSth(str = 'ok?') {
    const result = prompt('yes or no', str);
    if (result) {
      console.info(result);
    } else{
      console.info('???');
    }
  }
  promptSth();

  // window.find
  // 部分浏览器中无效,chrome 中执行有问题？

  // window.print
  // 用于打印

  // 12.2 Location 对象
  // 指向同一个引用
  console.info(document.location === window.location); // true

  // 12.2.1 查询字符串
  /**
   * 通过 search 的方式获取 url 参数
   * @returns
   */
  function getQueryString() {
    const [, queryString] = location.search.split('?') || [];
    const queryStringList = queryString.split('&');
    let queryParams = {};
    queryStringList.forEach((str) => {
      const [key, value] = str.split('=');
      decodeURIComponent(key) && (queryParams[decodeURIComponent(key)] = decodeURIComponent(value));
    });
    return queryParams;
  }
  getQueryString();

  /**
   * 教材上的写法
   * @returns
   */
  function getQs() {
    let str = location.search.length ? location.search.substring(1) : '';
    let qs = {};

    for (const [key, value] of str.split('&').map((kv) => kv.split('='))) {
      decodeURIComponent(key) && (qs[decodeURIComponent(key)] = decodeURIComponent(value));
    }

    return qs;
  }

  const qs = getQs();
  console.info(qs);

  // URLSearchParams 构造函数 提供了标准 API 方法来检查和修改查询字符串
  const searchParams = new URLSearchParams(location.search);
  // 可以通过 has 方法来判断
  searchParams.has('sceneId'); // true
  // 取值
  searchParams.get('sceneId'); // 3
  // 设置
  searchParams.set('sceneId', 5); // false
  // 删除
  searchParams.delete('sceneId'); // true
  searchParams.has('sceneId'); // false

  // 而且这个实例是可迭代的
  for (const [key, value] of searchParams) {
    console.info(key, value);
  }

  /**
   * 使用 URLSearchParams 来实现
   * @returns
   */
  function getQueryParams() {
    const searchParams = new URLSearchParams(location.search);
    let queryParams = {};
    for (const [key, value] of searchParams) {
      console.info(key, value);
      queryParams[key] = value;
    }
    return queryParams;
  }

  getQueryParams();

  // 12.2.2 操作地址
  // 通过修改 location 对象来修改地址
  const BING_URL = 'http://www.bing.com';
  location.assign(BING_URL);

  location = BING_URL;
  location.href = BING_URL;
  // 等价于 assign 的操作

  // 修改任意 location 的属性都会导致页面重新加载，除了 hash 属性

  // location 的多个属性例如 hash/href/search/port/hostname/pathname 都可以直接修改
  // 而 origin 属性是只读的

  location.reload(); // 加载页面，可能从缓存中加载
  location.reload(true); // 加载页面，强制从服务器端加载

  // 12.3 navigator 对象
  // 通常用来判断浏览器类型

  // 12.3.1 检测插件
  /**
   * 检测插件
   * @param {*} name 插件名
   * @returns
   */
  function hasPlugin(name = '') {
    name = name.toLowerCase();

    for (let i = 0; i < navigator.plugins.length; i++) {
      const plugin = navigator.plugins[i];
      console.info('plugin', plugin);
      if (plugin.name.toLowerCase().includes(name)) {
        return true;
      }
    }
    return false;
  }
  hasPlugin('Quicktime'); // false
  hasPlugin('Chrome PDF Plugin'); // true

  // 12.3.2 注册处理程序 过一遍
  // 可以用这样的方式来让网站发送邮件
  // 执行后网站会弹出窗口询问是否要发送邮件
  // 注意 %s 是必须的，从实际调用来看，必须要是同域名的
  navigator.registerProtocolHandler('mailto', 'https://www.baidu.com?cmd=%s', '邮件.app');

  // 12.4 screen 对象
  // 列举几个常用属性
  // 屏幕的宽高，注意不是窗口的宽高
  console.info(screen.width);
  console.info(screen.height);

  // 12.5 history 对象
  // 通常用来创建前进和后退按钮

  // 12.5.1 导航
  // history.go() 可用于前进后退
  history.go(1); // 前进 如果没则无反应
  history.go(-1); // 后退 如果没则无反应
  // 下面是上两者的简写，对应前进和后退按钮
  history.back();
  history.forward();

  // 也可以前进多个，如果有的话
  history.go(2);

  // 可以用 length 属性来判断当前页面是不是窗口打开的第一个页面
  if (history.length === 1) {
    console.info('This is the first page');
  }

  // 12.5.2 历史状态管理
  // history.hashchange 注意没有驼峰
  // 监听 # 值的变化

  // history.pushState
  // history.replaceState
  // 这两者接收相同的三个参数
  // 序列化对象，标题（但浏览器未实现），url（可选）
  // 序列化对象的大小有限制，通常在 500kb - 1Mb
  history.pushState(null, 'title');
  console.info(history.length); // 2
  history.pushState({ data: 3 }, 'data', '/index');
  console.info(history.length); // 3
  // 对应页面不会刷新，但是 history.length 增加，且可以使用浏览器回退按钮

  history.replaceState({ replace: true }, 'replace', '/replace');
  console.info(history.length); // 3
  // replaceState 不会新增 history.length

  // popstate 事件用来监听上述 state 变化
  window.addEventListener('popstate', function (event) {
    let state = event.state;
    if (state) { // 第一个页面加载时是 null
      console.info(state);
    }
  });

  // * react-router 核心就是使用 pushState replaceState popstate 实现的
};

export default Part12BOM;
