/******** 《JavaScript 高级程序设计》 ********/
/******** 23、离线应用与客户端存储 ********/
import { EventUtil } from './part13';
import { inheritPrototype } from './part6';

export default class Part23Storage {
  constructor() {

    // 23.1 离线检测
    const currentStatus = this.getNavigatorStatus();
    console.info(`navigator is ${currentStatus}`);

    // HTML 5 支持的事件 在线和离线状态切换时会触发
    EventUtil.addHandle(window, 'online', (e) => {
      window.alert('Online');
      console.info(e); // { ..., type: 'online ' }
    });
    EventUtil.addHandle(window, 'offline', (e) => {
      window.alert('Offline');
      console.info(e); // { ..., type: 'offline ' }
    });

    // 23.2 应用缓存
    // applicationCache 对象

    // 23.3 数据存储
    // 23.3.1 Cookie
    // * cookie 在不同浏览器端有着不同的个数的限制，30，50 或者像 chrome/safari 一样不限
    // * 大小在 4kb 以下
    // * cookie 不区分大小写
    // 设置值
    CookieUtil.set('name', 'sella');
    CookieUtil.set('book', 'Javascript');
    // 读取值
    console.info(CookieUtil.get('book'));
    console.info(CookieUtil.get('name'));
    // 删除值
    CookieUtil.unset('name');
    CookieUtil.unset('book');

    // 设置带参数的 cookie，失效日期，域名，路径
    CookieUtil.set('name', 'sella', new Date('January 1, 2021'), '/static-base/', 'seller.hipac.cn');
    // 删除刚刚的设置
    CookieUtil.unset('name', '/static-base/', 'seller.hipac.cn');
    // 设置安全的 cookie
    CookieUtil.set('name', 'beta', null, null, null, true);

    // 应用 subCookie
    document.cookie = 'data=name=sella&book=Javascript';

    // 可以获取值再获取属性
    const data = SubCookieUtil.getAll('data');
    console.info(data.name); // sella
    console.info(data.book); // Javascript

    // 也可以直接获取
    SubCookieUtil.get('data', 'name'); // sella

    // 设置单个 cookie
    SubCookieUtil.set('data', 'name', 'kyle');
    // 设置多个 cookie
    SubCookieUtil.setAll('data', { book : 'Professional', age: 10 }, new Date('January 1, 2021'));
    // 修改名字的值并修改失效日期
    SubCookieUtil.set('data', 'name', 'sella', new Date('January 1, 2022'));

    // 删除某一项
    SubCookieUtil.unset('data', 'name');
    // 删除所有
    SubCookieUtil.unsetAll('data');

    // 23.3.2 IE 用户数据
    // 23.3.3 Web 存储机制
    // sessionStorage
    // 使用方法存储数据
    sessionStorage.setItem('name', 'nico');
    // 使用属性存储数据
    sessionStorage.book = 'Javascript';

    // 遍历获取
    this.getKeysByItera();

    // 遍历属性获取值
    this.getPropsByItera();

    // globalStorage 这个现代不怎么使用了
    // localStorage
    // 和 sessionStorage 的打开方式一样
    // 使用方法存储数据
    localStorage.setItem('name', 'nico');
    // 使用属性存储数据
    localStorage.book = 'Javascript';

    // 兼容 globalStorage 的写法
    const localStorage = this.getLocalStorge();

    // 以下代码未通过测试，不确定是为何
    EventUtil.addHandle(document, 'storage', function (event) {
      console.info('Storage changed for', + event.domain);
    });

    // 23.3.4 IndexedDB 还未执行过代码验证
    // https://www.ruanyifeng.com/blog/2018/07/indexeddb.html
    // https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB
    // https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API
    const indexedDB = this.getIndexedDB();
    let request, database;

    // 初始化数据库
    ({ request, database } = this.initDatabase(request, indexedDB, database));

    // 设置版本
    request = this.setDatabaseVersion(database, request);

    let store = database.createObjectStore('users', { keyPath: 'username' });
    store = this.addDBUsers(store);

    // 事务
    // 通过事务来读取和修改数据
    let transaction = database.transaction();
    transaction = database.transaction('users');

    // 批量读取，采用数组作为入参的方式
    transactions = database.transaction(['users', 'anotherStore']);

    const IDBTransaction = this.getIDBTransaction();

    // 指定第二个参数，来标识是只读还是读写
    let writableTransaction = database.transaction('users', IDBTransaction.READ_WRITE);

    // 取得事务的索引之后，使用方法并传入存储空间名称，就可以访问特定的存储空间
    let requestUsers = this.getStore('users').get('008');
    requestUsers.onerror = function (event) {
      console.error('Did not get the object', event);
    };
    requestUsers.onsuccess = function (event) {
      let result = event.target.result;
      console.info(result.firstName);
    };

    // 事务本身的事件处理程序
    transaction.onerror = function (event) {
      // 事务取消了
    };

    transaction.oncomplete = function (event) {
      // 事务成功完成了
    };

    // 使用游标查询
    let usersStore = this.getStore('users'),
      userRequest = usersStore.openCursor();

    /**
     * 使用游标的回调
     * @param {*} event
     */
    const onsuccess = (event) => {
      const cursor = event.target.result;
      // 必须要检查是否存在
      if (cursor) {
        // cursor.value 是一个对象 所以这里需要转成字符串
        console.info('Key:' + cursor.key+ ', Value: ' + JSON.stringify(cursor.value));
      }
    };

    // 使用游标查询的应用
    this.handleRequest(userRequest, onsuccess);

    /**
     * 使用游标更新的回调
     * @param {*} event
     */
    const onUpdateSuccess = function (event) {
      let cursor = event.target.value,
        value,
        updateRequest;
      if (cursor) {
        if (cursor.key === 'foo') {
          value = cursor.value; // 取得当前的值
          value.password = 'magic'; // 更新密码

          updateRequest = cursor.update(value); // 请求保存更新
          this.handleRequest(updateRequest); // 处理成功和失败的情况
        }
      }
    };

    // 使用游标更新记录的应用
    this.handleRequest(userRequest, onUpdateSuccess);

    /**
     * 使用游标删除的回调
     * @param {*} event
     */
    const onDeleteSuccess = function (event) {
      let cursor = event.target.value,
        value,
        deleteRequest;

      if (cursor) {
        if (cursor.key === 'foo') {
          deleteRequest = cursor.delete(); // 请求删除当前项目
          this.handleRequest(deleteRequest);
        }
      }
    };

    // 使用游标删除记录的应用
    this.handleRequest(userRequest, onDeleteSuccess);

    // 如果当前事务没有修改对象存储空间的权限，那么以上两个方法就会抛出错误

    /**
     * 使用游标移动到下一项的回调
     * @param {*} event
     */
    const onContinueSuccess = (event) => {
      const cursor = event.target.result;
      // 必须要检查是否存在
      if (cursor) {
        // cursor.value 是一个对象 所以这里需要转成字符串
        console.info('Key:' + cursor.key+ ', Value: ' + JSON.stringify(cursor.value));
        cursor.continue(); // 移动到下一项
      } else {
        console.info('done');
      }
    };

    this.handleRequest(userRequest, onContinueSuccess);

    // 键范围
    // 四种定义键范围的方式
    const IDBKeyRange = this.getIDBKeyRange();

    // 直接获得对应键位 相当于 get 用法
    const onlyRange = IDBKeyRange.only('007');

    // 从键为 007 的对象开始，然后可以移动到最后
    const lowerRange = IDBKeyRange.lowerBound('007');

    // 从键为 007 的下一个对象开始，不含找到的第一个，然后可以移动到最后
    const lowerRangeWithoutCurrent = IDBKeyRange.lowerBound('007', true);

    // 从头开始，找到键为 ace 的对象为止
    const upperRange = IDBKeyRange.upperRange('ace');

    // 从头开始，找到键为 ace 的上一个对象为止
    const upperRangeWithoutCurrent = IDBKeyRange.upperBound('ace', true);

    // 从 007 到 ace
    const boundRange = IDBKeyRange.bound('007', 'ace');

    // 从 007 的下一个到 ace
    const boundRangeWithoutCurrent = IDBKeyRange.bound('007', 'ace', true);

    // 从 007 的下一个到 ace 的上一个对象
    const boundRangeWithoutCurrentWithoutLast = IDBKeyRange.bound('007', 'ace', true, true);

    const boundStore = this.getStore('users'),
      range = IDBKeyRange.bound('007', 'ace'),
      boundRequest = boundStore.openCursor(range);

    // 输出的对象的键从 007 到 ace，比上面的输出稍微少一些，这里复用了成功的回调方法 onContinueSuccess
    this.handleRequest(boundRequest, onContinueSuccess);

    // 设定游标方向
    const IDBCursor = this.getIDBCursor();
    // 这里定义了游标的方向是朝前的，此时是从后往前寻找
    const cursorStore = this.getStore('users'),
      cursorRequest = usersStore.openCursor(null, IDBCursor.PREV);

    this.handleRequest(cursorRequest, onContinueSuccess);

    // 索引
    const indexStore = this.getStore('users'),
      index = indexStore.index('username'),
      indexRequest = index.openCursor();

    this.handleRequest(indexRequest);

    const indexRequest1 = index.openKeyCursor();
    const onIndexSuccess = function (event) {
      // 处理成功
      // event.target.key 保存索引键 而 event.result.value 中保存主键
    };

    this.handleRequest(indexRequest1, onIndexSuccess);

    const indexRequest2 = index.get('007');
    this.handleRequest(indexRequest2, onIndexSuccess);

    // 以下方法可以查询到存储的对象建立了多少索引
    // 并在控制台里打印出来
    const queryStore = this.getStore(),
      indexNames = queryStore.indexNames,
      len = indexNames.length;
    let i = 0,
      currentIndex;

    while (i < len) {
      currentIndex = store.index(indexNames[i++]);
      console.info('Index name: ' + index.name + ',KeyPath: ' + index.keyPath + ', Unique: ' + index.unique);
    }

    // 删除索引并不会影响对象存储中的数据，也没有回调函数
    store.deleteIndex('username');

    // 并发问题
    // 以下两个关键方法就是指明了该如何去处理并发 onversionichange 和 onblocked
    let adminRequest = indexedDB.open('admin'),
      databaseV2;

    /**
     * 浏览器里，两个标签页打开同一个网页时，有一个标签页试图改变版本，就会执行这个回调函数
     * @param {*} event
     */
    const onAdminSuccess = function (event) {
      databaseV2 = event.target.result;

      // 在每次成功打开数据库的时候，就要指定这个处理程序
      databaseV2.onversionchange = function () {
        databaseV2.close();
      };
    };

    this.handleRequest(adminRequest, onAdminSuccess);

    // 在你想要更新数据库版本，但另一个标签页已经打开数据库的情况下，就会触发这个事件处理程序，此时，最好先通知用户关闭其他标签页面
    let setVersionRequest = databaseV2.setVersion('2.0');
    setVersionRequest.onblocked = function () {
      window.alert('Please close all other tabs and try again');
    };

    // 成功的话，默认继续操作
    this.handleRequest(setVersionRequest);
  }

  /**
   * 返回当前是否处于在线状态
   */
  getNavigatorStatus = () => {
    return navigator.onLine ? 'online' : 'offline';
  }

  /**
   * 兼容方式获得 indexedDB
   */
  getIndexedDB() {
    return window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexDB;
  }

  /**
   * 初始化数据库
   * @param {*} request
   * @param {*} indexedDB
   * @param {*} database
   */
  initDatabase(request, indexedDB, database) {
    request = indexedDB.open('admin');
    request.onerror = function (event) {
      console.info('Something bad happened while trying to open: ' + event.target.errorCode);
    };
    request.onsuccess = function (event) {
      database = event.target.result;
    };
    return { request, database };
  }

  /**
   * 设置数据库初始版本
   * @param {*} database
   * @param {*} request
   */
  setDatabaseVersion(database, request) {
    if (database.version !== '1.0') {
      request = database.setVersion('1.0');
      request.onerror = function (event) {
        console.warn('Something bad happened while trying to set version: ' + event.target.errorCode);
      };
      request.onsuccess = function (event) {
        console.info('Database initialization complete. Database name: ' + database.name + ', Version: ' + database.version);
      };
    }
    else {
      console.warn('Database already initialized. Database name: ' + database.name + ', Version: ' + database.version);
    }
    return request;
  }

  /**
   * 获取不同浏览器里，已经定义好的兼容的接口
   * 内含已经定义好的枚举
   */
  getIDBTransaction = () => window.IDBTransaction || window.webkitIDBTransaction

  /**
   * 获取对象存储空间
   * @param {*} name
   */
  getStore(name = 'users') {
    return database.transaction(name).objectStore(name);
  }

  /**
   * 获取本地存储
   */
  getLocalStorge() {
    if (typeof localStorage === 'object') {
      return localStorage;
    }
    if (typeof globalStorage === 'object') {
      return globalStorage[window.location.host];
    }
    throw new Error('Local Storage not available');
  }

  /**
   * 添加新值
   * @param {*} store
   * @param {*} users
   */
  addDBUsers(store, users = []) {
    let i = 0,
      len = users.length;

    while (i < len) {
      store.add(users[i++]);
    }

    return users;
  }

  /**
   * 含错误处理的添加新值方法
   * @param {*} store
   * @param {*} users
   */
  batchAddDBUsers(store, users = []) {
    let i = 0,
      len = users.length,
      request,
      requests = [];

    while (i < len) {
      request = users.put(users[i++]);
      request.onerror = function () {
        // 处理失败
      };

      request.onsuccess = function () {
        // 处理成功
      };
      requests.push(request);
    }

    return store;
  }

  /**
   * indexDB 的成功或失败的处理
   * @param {*} request
   * @param {*} onsuccess
   * @param {*} onerror
   */
  handleRequest(request, onsuccess, onerror) {
    request.onsuccess = onsuccess || function () {
      // 处理成功
    };
    request.onerror = onerror || function () {
      // 处理失败
    };
  }

  /**
   * 获取键范围的实例
   */
  getIDBKeyRange = () => {
    return window.IDBKeyRange || window.webkitIDBKeyRange;
  }

  /**
   * 获取游标对象的枚举
   */
  getIDBCursor = () => window.IDBCursor || window.webkitIDBCursor
}

/**
 * 操作 cookie 的简易工具
 * 支持读取、写入和删除
 */
export const CookieUtil = {
  /**
   * 获取相应参数的值
   * @param {*} name
   */
  get: function (name) {
    const cookieName = encodeURIComponent(name) + '=';
    const cookieStart = document.cookie.indexOf(cookieName);
    let cookieValue = null;

    if (cookieStart > -1) {
      let cookieEnd = document.cookie.indexOf(';', cookieStart);
      if (cookieEnd === -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    return cookieValue;
  },

  /**
   * 设置相应参数的值
   * @param {*} name
   * @param {*} value
   * @param {*} expires
   * @param {*} path
   * @param {*} domain
   * @param {*} secure
   */
  set: function (name, value, expires, path, domain, secure) {
    let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires instanceof Date) {
      cookieText += '; expires=' + expires.toGMTString();
    }
    if (path)  {
      cookieText += '; path=' + path;
    }
    if (domain)  {
      cookieText += '; domain=' + domain;
    }
    if (secure)  {
      cookieText += '; secure';
    }
    document.cookie = cookieText;
  },

  /**
   * 重置参数
   * @param {*} name
   * @param {*} path
   * @param {*} domain
   * @param {*} secure
   */
  unset: function (name, path, domain, secure) {
    this.set(name, '', new Date(0), path, domain, secure);
  }
};

/**
 * 获取值是键值对形式的 cookie
 */
export const SubCookieUtil = {
  get: function name(name, subName) {
    const subCookies = this.getAll(name);
    return subCookies ? subCookies[subName] : null;
  },

  getAll: function (name) {
    const cookieName = encodeURIComponent(name) + '=',
      cookieStart = document.cookie.indexOf(cookieName);
    let cookieValue = null,
      cookieEnd,
      subCookies,
      index,
      result = {};

    if (cookieStart > -1) {
      cookieEnd = document.cookie.indexOf(';', cookieStart);
      if (cookieEnd === 1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }

    if (cookieValue && cookieValue.length > 0) {
      subCookies = cookieValue.split('&');

      for (index = 0; index < subCookies.length; index++) {
        const [prop, val] = subCookies[index].split('=');
        result[decodeURIComponent(prop)] = decodeURIComponent(val);
      }

      return result;
    }

    return null;
  },

  /**
   * 设置单个值
   * @param {*} name
   * @param {*} subName
   * @param {*} value
   * @param {*} expires
   * @param {*} path
   * @param {*} domain
   * @param {*} secure
   */
  set: function (name, subName, value, expires, path, domain, secure) {
    let subCookies = this.getAll(name) || {};
    subCookies[subName] = value;
    this.setAll(name, subCookies, expires, path, domain, secure);
  },
  /**
   * 以对象形式传入，保存所有键值对
   * @param {*} name
   * @param {*} subCookies
   * @param {*} expires
   * @param {*} path
   * @param {*} domain
   * @param {*} secure
   */
  setAll: function (name, subCookies, expires, path, domain, secure) {
    let cookieText = encodeURIComponent(name) + '=',
      subCookieParts = new Array(),
      subName;

    for (subName in subCookies) {
      if (subName.length && subCookies.hasOwnProperty(subName)) {
        const subValue = subCookies[subName];
        subCookieParts.push(encodeURIComponent(subName) + '=' + encodeURIComponent(subValue));
      }
    }

    if (subCookieParts.length > 0) {
      cookieText += subCookieParts.join('&');

      if (expires instanceof Date) {
        cookieText += '; expires=' + expires.toGMTString();
      }

      if (path) {
        cookieText += '; path=' + path;
      }

      if (domain) {
        cookieText += '; domain=' + domain;
      }

      if (secure) {
        cookieText += '; secure';
      }
    } else {
      cookieText += '; expires=' + (new Date(0)).toGMTString();
    }

    document.cookie = cookieText;
  },

  /**
   * 重置某一项，相当于删除再设置
   * @param {*} name
   * @param {*} subName
   * @param {*} expires
   * @param {*} path
   * @param {*} domain
   * @param {*} secure
   */
  unset: function name(name, subName, expires, path, domain, secure) {
    let subCookies = this.getAll(name);
    if (subCookies) {
      delete subCookies[subName];
      this.setAll(name, subCookies, expires, path, domain, secure);
    }
  },

  /**
   * 删除所有
   * @param {*} name
   * @param {*} path
   * @param {*} domain
   * @param {*} secure
   */
  unsetAll: function (name, path, domain, secure) {
    this.setAll(name, null, new Date(0), path, domain, secure);
  }
};
