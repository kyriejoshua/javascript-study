/******** 《JavaScript 高级程序设计》 ********/
/******** 20、JSON ********/

export default class Part20JSON {
  constructor() {

    // 20.1 语法
    // 简单值 js 的基本类型但不包括 undefined
    // 对象
    // 数组
    // JavaScript 的子集

    // 20.1.1 简单值
    // 必须使用双引号

    // 20.1.2 对象
    // 属性名必须加双引号
    // 没有声明变量，无需声明变量

    // 20.1.3 数组

    // 20.2 解析与序列化
    // 20.2.1 JSON 对象
    const book = {
      title: 'Professional javascript',
      authors: ['Nico'],
      edition: 3,
      year: 2011
    };
    const jsonText = JSON.stringify(book);
    const bookCopy = JSON.parse(jsonText);
    console.info(book, 'book');
    console.info(jsonText, 'jsonText');
    console.info(bookCopy, 'bookCopy');

    // 20.2.2 序列化选项
    // JSON.stringify 方法的后两个参数
    // 过滤参数 - 数组
    this.filterJSONByArray(book, ['authors', 'edition']);
    // output "{"authors":["Nico"],"edition":3}"

    // 过滤参数 - 函数
    /**
     * 改变属性值，数组序列化成字符串，删除属性，其余不变
     * @param {String} key
     * @param {*} value
     */
    let replacer = function (key, value) {
      if (key === 'year') {
        return 5000;
      }
      if (key === 'author') {
        return value.join(',');
      }
      if (key === 'edition') {
        return undefined;
      }
      return value;
    };

    this.filterJSONByFunction(book, replacer);

    // 后两个参数的第二个参数是控制字符串缩进
    JSON.stringify(book, null, 2); // 缩进为 2
    // 最大只能为 10，超过 10 自动转为 10
    JSON.stringify(book, null, 20); // 缩进为 10

    // 也可以传入字符串，用来代替空格，字符串的长度对应空格的长度（缩进）
    JSON.stringify(book, null, '--'); // 缩进为 2
    JSON.stringify(book, null, '%%%%'); // 缩进为 4
    JSON.stringify(book, null, '@@'); // 缩进为 2

    // toJSON
    // 自定义序列化的返回值，更加自定义，优先级高于 JSON.stringify 的第二个参数
    const bookToJSON = {
      title: 'Professional javascript',
      authors: ['Nico'],
      edition: 3,
      year: 2011,
      toJSON: function () {
        return this.title;
      }
    };
    JSON.stringify(bookToJSON);
    // output "Professional javascript"

    // 20.2.3 解析选项
    const newBook = {
      title: 'Professional javascript',
      authors: ['Nico'],
      edition: 3,
      year: 2011,
      releaseDate: new Date(2019, 11, 24)
    };
    const newJsonText = JSON.stringify(newBook);
    console.info(newJsonText);
    // 日期序列化了

    /**
     * 将 JSON 序列化后的日期格式还原
     * @param {String} key
     * @param {*} value
     */
    const reviver = function (key, value) {
      if (key === 'releaseDate') {
        return new Date(value);
      } else {
        return value;
      }
    };
    const newBookCopy = JSON.parse(newJsonText, reviver);
    console.info(newBookCopy);
    // 日期格式的数据还原了
  }
  /**
   * 第二个参数可以是数组也可以是函数，这里使用数组
   * @param {Object|Array} json
   * @param {Array|Function} filter
   */
  filterJSONByArray(json, filter = []) {
    return JSON.stringify(json, filter);
  }

  /**
   * 第二个参数可以是数组也可以是函数，这里使用函数
   * @param {Object|Array} json
   * @param {Array|Function} filter
   */
  filterJSONByFunction(json, func) {
    return JSON.stringify(json, func);
  }
}
