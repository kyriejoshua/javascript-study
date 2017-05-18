/**
 * [cookies cookies.js]
 * @param  {Object} data [description]
 * @param  {Object} opt  [description]
 * @return {Object}      [description]
 */
// 用ES6改写cookies
// cookies 不会变化,所以用const定义
const cookies = function(data, opt) {

  /**
   * [defaults 合并对象属性函数 这里采用ES6的Object.assign替代,是否会引起错误？]
   * @param  {Object} obj  [原始对象，如果没有则默认新建一个]
   * @param  {Object} defs [用来合并的对象]
   * @return {Object}      [description]
   */
  // function defaults(obj={}, defs) {
  //   for (let key in defs) {
  //     if (obj[key] === void 0) {
  //       obj[key] = defs[key];
  //     }
  //   }
  //   return obj;
  // }

  // 初始化
  // defaults(cookies, {
  Object.assign(cookies, {
    expires: 365 * 24 * 3600, // 设置默认的过期时间，一年
    path: '/', // 路径
    secure: window.location.protocol === 'https:',

    // Advanced Options 不推荐更改的一些默认选项
    nulltoremove: true, // 设置cookie的值为null时即移除它,
    autojson: true, // encode or decode 转码成json
    autoencode: true, // 安全编译
    encode: (str) => {
      return encodeURIComponent(str);
    },
    decode: (str) => {
      return decodeURIComponent(str);
    },
    error: (error, data, opt) => {
      throw new Error(error);
    },
    fallback: false // 如果cookies失效时启用的回调
    // 更改时需要在全局环境下
    // cookies.nulltoremove = true;
    // cookies.autojson = true;
    // cookies.autoencode = true;
    // cookies.encode = (str) => {
    //   return encodeURIComponent(str);
    // };
    // cookies.decode = (str) => {
    //   return decodeURIComponent(str);
    // };
    // cookies.error = (error, data, opt) =>{
    //   throw new Error(error);
    // };
    // cookies.fallback = false;
  });

  // 将 cookies 复制到 opt 上, 用于后面的保存
  // opt = defaults(opt, cookies);
  opt = Object.assign(opt, cookies);

  /**
   * [expires 将时间格式转化为UTC格式]
   * @param  {Date || Number} time [可能是以秒为单位的时间，或是Date对象]
   * @return {Date}      [description]
   */
  function expires(time) {
    let expires = time;

    // 假如传入的时间不是Date对象
    if (!(expires instanceof Date)) {
      expires = new Date();
      expires.setTime(expires.getTime() + (time * 1000));
    }
    return expires.toUTCString();
  }

  // 查询cookie,注意这里采用了链式写法,函数式编程风格
  if (typeof data === 'string') {

    // 依据分号间隔将字符串cookie转成数组
    let value = document.cookie.split(/;\s*/)

    // 如果autoencode为true,则将数组中的每个cookie通过decode进行处理
    .map(opt.autoencode ? opt.decode : (d) => {return d})

    // 数组的map方法返回的是数组，所以可以进行链式调用
    .map((part) => {

      // 再将每个cookie 分割成 [key, value] 的结构,得到一个二维数组
      return part.split('=');
    })
    .reduce((parts, part) => {

      // 将数组中的 [[key1, value1], [key2, value2]]
      // 转化为 {key1: value1, key2: value2}的格式
      // parts[part[0]] = part[1];
      // 作者后来改为下面
      parts[part[0]] = part.splice(1).join('=');
      return parts;
    }, {})[data]; // 获取指定的cookie值，将该值赋给value

    // 是否支持转化成json的object
    if (!opt.autojson) { return value; };

    let real;

    // json格式化
    try {
      real = JSON.parse(value);
    } catch (e) {
      real = value;
    }

    // 假如当前值是undefined,切存在回调函数，则返回调用毁掉函数后的返回值
    if (((typeof real) === 'undefined') && opt.fallback) {
      real = opt.fallback(data, opt);
    }

    return real;
  }

  // 新增cookie
  for (let key in data) {
    let val = data[key];

    // expired 涉及两个判断
    // 一个data[key]的值是否为undefined
    // 第二个是 nulltoremove的值为true, 且设置的值为null
    // 当满足这二者之一的条件时，expired 的值为true
    // 这个写法简洁明了
    let expired = typeof val === 'undefined' || (opt.nulltoremove && val === null);

    let str = opt.autojson ? JSON.stringify(val) : val;

    let encoded = opt.autoencode ? opt.autoencode(str) : str;

    // TODO: 这里为什么不放在encoded判断之前
    if (expired) { encoded = ''};

    // 这段略复杂、、保存各种数据，以分号相隔
    // 如果存在则保存，不存在则以空字符串标识
    // TODO: 如果过期的话默认值为-10000？
    let res = `${opt.encode(key)}=${encoded}
      (${opt.expires} ? (;expires=${expires(expired ? (-10000) : opt.expires)}) : '')
      ;path=${opt.path}
      (${opt.domain} ? (;domain=${opt.domain}) : ''
      (${opt.secure} ? ;secure : '')`;

    // 如果opt中有测试方法
    if (opt.test) { opt.test(res); }

    // 保存cookie
    document.cookie = res;

    // TODO: 待理解。获取属性值，对其编码，并获取?
    let read = (cookies(opt.encode(key))) || '';

    // TODO: 待理解。当当前值存在，且未过期，且过期时间大于0，且 ?
    if (val && !expired && opt.expires > 0 && (JSON.stringify(read) !== JSON.stringify(val))) {

      // 查看浏览器是否开启了cookies,布尔值
      if (navigator.cookieEnabled) {

        // 如果存在回调函数
        if (opt.fallback) {
          opt.fallback(data, opt);
        } else {
          opt.error(`Cookie too large at ${val.length} characters`);
        }
      } else {
        opt.error(`Cookies not enabled`);
      }
    }
  }

  // 这个cookies
  // cookies({ token : 14})({ token: '14' })
  // const token = cookies({ token: '14' })('token') // token === '14'
  return cookies;
}

// TODO: 需更熟悉
// 如果在webpack中配置output的libraryTarget设置为umd,就会在打包时自动添加这段
// 然后就可以通过多个方式引入(AMD, commonjs, global)
// [具体配置](https://webpack.github.io/docs/configuration.html#output-librarytarget)
// 或者可以直接加载模块末尾
(webpackUniversalModuleDefinition(root) => {

  // CMD写法: common.js 的 module.exports 暴露
  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = cookies;
  } else if (typeof define === 'function' && define.amd) {

    // AMD规范的define写法
    define('cookies', [] , cookies);
  } else if (typeof exports === 'object') {

    // ES6写法 export出cookies
    exports['cookies'] = cookies;
  } else {

    // 全局配置 this['cookies'](global.cookies)
    root['cookies'] = cookies;
  }
})(this);
