/**
 * [random 随机学到的]
 * @return {[type]} [description]
 */
const random = () => {

  let obj = {
    name: 'heh',
    age: 29,
    fn: function() {
      console.log(this.age);
    }
  }
  console.warn(obj);
  var b = JSON.stringify(obj);

  console.log(b);

  var c = JSON.parse(b);
  console.info(c);

  function type(obj) {
    var toString = Object.prototype.toString;
    var map = {
        '[object Boolean]'  : 'boolean',
        '[object Number]'   : 'number',
        '[object String]'   : 'string',
        '[object Function]' : 'function',
        '[object Array]'    : 'array',
        '[object Date]'     : 'date',
        '[object RegExp]'   : 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]'     : 'null',
        '[object Object]'   : 'object'
    };
    return map[toString.call(obj)];
  }

  // cloud.config(($provide) {
  //   $provide.provider('greeting', () => {
  //     this.$get = () => {
  //       return (name) => {
  //         console.log(`hey${name}`);
  //       }
  //     }
  //   }
  // });

  function compose(f, g) {
    return function() {
      console.log(this);
      return f.call(this, g.apply(this, arguments));
    };
  }

  const square = (x) => {return x*x;}
  const sum = (x,y) => {return x+y;}
  const squareofsum = compose(square, sum)
  squareofsum(4, 6)

  function array(a, n) {
    return Array.prototype.slice.call(a, n || 0);
  }

  function partialLeft(f /*, ...*/) {
    let args = arguments;
    console.log(args)
    return function() {
      let a = array(args, 1);
      a = a.concat((array(arguments)));
      console.info(arguments)
      console.info(this)
      console.info(a)
      return f.apply(this, a);
    };
  }

  function partialRight(f /*, ...*/) {
    let args = arguments;
    return function() {
      let a = array(arguments);
      a = a.concat((array(args, 1)));
      return f.apply(this, a);
    };
  }

  const f = function(x, y, z) {
    console.log(arguments);
    return x * (y - z);
  }

  partialLeft(f, 2)(3, 4);
  partialRight(f, 2)(3, 4);

  /**
   * [pushConcat 使用数组原生的push方法来合并数组]
   * @param  {[type]} arrFrom   [准备用来合并数组]
   * @param  {[type]} arrTo [准备接受其他数组的数组]
   * @return {[type]}         [返回的新数组]
   */
  function pushConcat(arrFrom, arrTo) {
    Array.prototype.push.apply(arrTo, arrFrom);
    return arrTo;
  }


  /*******数组去重*******/
  /**
   * [unique 数组去重]
   * @param  {[type]} arr [需要去重的数组]
   * @return {[type]}     [description]
   */
  Array.prototype.unique = (arr) => {
    let res = [];
    for (let i = 0; i < arr.length; i++) {
      for (var j = 0, jLen = res.length; j < jLen; j++) {
        if (arr[i] === res[j]) {
          break;
        }
      }
      if (j === jLen) {
        res.push(arr[i]);
      }
    }
    return res;
  }

  /**
   * [unique 数组去重, ES5的indexOf方法]
   * @param  {[type]} arr [description]
   * @return {[type]}     [description]
   */
  function unique(arr){
    let res = [];
    for (let i = 0; i < arr.length; i++) {
      (res.indexOf(arr[i]) === i) && res.push(arr[i]); // 当前元素未找到，则传入
    }
    return res;
  }

  /**
   * [unique 数组去重，使用ES5的filter方法]
   * @param  {[type]} arr [description]
   * @return {[type]}     [description]
   */
  function unique(arr) {
    var res = arr.filter((item, index, array) => {
      // 定义一个筛选条件,查找元素的位置和元素位置相同时, 如果遇到重复的元素则会返回false
      return array.indexOf(item) === index;
    });
    return res;
  }

  /**
   * [unique 数组去重]
   * @param  {[type]} arr [description]
   * @return {[type]}     [description]
   */
  function unique(arr) {
    let res = [];
    for (let i = 0; i < arr.lenth; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] === arr[j]) {
          // 如果发现前者和后者相同，则i自增进入下一个外层循环
          // 这步很重要，它改变的是外层for循环
          j = ++i;
        }
      }
      res.push(arr[j]);
    }
    return res;
  }

  /**
   * [unique 数组去重，利用对象是否拥有属性来判断，只适用于值为number类型时]
   * @param  {[type]} arr [description]
   * @return {[type]}     [description]
   */
  function unique(arr) {
    var obj = {};
    return arr.filter((item) => {
      return obj.hasOwnProperty(item) ? false : (obj[item] = true);
    });
  }

  /**
   * [unique 前一个函数的扩展，加上了类型，可以区分'1'和1]
   * @param  {[type]} arr [description]
   * @return {[type]}     [description]
   */
  function unique(arr) {
    var obj = {};
    return arr.filter((item) => {
      return obj.hasOwnProperty(typeof(item) + item) ? false : (obj[typeof(item) + item] = true);
    });
  }

  /**
   * [unique 采用ES6的新的数据结构Set,使用new来生成一个Set数据结构]
   * [采用ES6的数组from方法，将一个类数组对象转化为数组]
   * @param  {[type]} arr [description]
   * @return {[type]}     [description]
   */
  function unique(arr) {
    // return Array.prototype.slice.call(new Set(arr));
    // new Set()生成的对象实际上是一个可遍历的对象，但不是类数组对象，所以即使加上length属性，也无法等同于以上
    // 但实际上以下实现的逻辑相当于以上
    return Array.from(new Set(arr)); // 例如 document.querySelectorAll('div');
  }
}

/**
 * [类和模块]
 * @return {[type]} [description]
 */
const classModule = () => {

  /**
   * [Range 一个构造函数，用以初始化新创建的“范围对象”，
   * 这里没有创建并返回对象，只是初始化; 只有通过new调用以后，才会返回新对象]
   * @param {[type]} from [这两个对象是无法继承的]
   * @param {[type]} to   [存储对象的起始位置和结束位置]
   */
  function Range(from, to) {
    this.from = from;
    this.to = to;
  }

  // 该方式会覆盖原有的，不推荐
  // 所有的返回对象都继承自这个对象
  // 注意：属性名必须是 prototype
  Range.prototype = {

    /**
     * [include 判断传入的参数是否在范围内的函数，除了数字以外，也可以比较字符串和日期范围]
     * @param  {[type]} x [description]
     * @return {[type]}   [description]
     */
    include: function(x) {
      return this.from <= x && x <= this.to;
    },
    /**
     * [foreach 对范围的所有证书都调用f，只适用于数字]
     * @param  {[type]} f [description]
     * @return {[type]}   [description]
     */
    forEach: function(f) {
      for (let x = Math.ceil(this.from); x <= this.to; x++) {
        f(x);
      }
    },
    toString: function() {
      return `(${this.from} ... ${this.to})`;
    }
  }

  // 调用构造函数生成一个实例
  const range = new Range(23, 167);
  range.include(57); // true
  range.forEach(console.warn); // 输出23一直到567
  console.info(range.toString()); // (23 ... 567)

  /** 更常用的方式 */

  // 先定义一个构造函数
  function RangeNative(from, to) {
    this.from = from;
    this.to = to;
  }

  /**
   * [扩展原有的prototype对象,而不是重写]
   * [这样就会自动创建prototype.constructor属性]
   * @param  {[type]} x [description]
   * @return {[type]}   [description]
   */
  RangeNative.prototype.include = function(x) {
    return this.from <= x && x <= this.to;
  }
  RangeNative.prototype.forEach = function(f) {
    for (let x = Math.ceil(this.from); x <= this.to; x++) {
      f(x);
    }
  }
  RangeNative.prototype.toString = function() {
    return `(${this.from} ... ${this.to})`
  }

  const rangeNative = new RangeNative(43, 154);
  rangeNative.include(123);
  rangeNative.forEach(console.info);
  console.log(rangeNative.toString());

  /** 尝试用ES6写 */
  // 基本等同于上面的写法
  class RangeNativeInES6 {
    constructor(from, to) {
      this.from = from;
      this.to = to;
    }

    include(x) {
      return this.from <= x && x <= this.to;
    }

    forEach(f) {
      for (let x = Math.ceil(this.from); x <= this.to; x++) {
        f(x);
      }
    }

    toString() {
      return `(${this.from} ... ${this.to})`;
    }
  }

  const rangeNativeInES6 = new RangeNativeInES6(12, 43);
  console.log(rangeNativeInES6.include(1));
  rangeNativeInES6.include(21);
  rangeNativeInES6.forEach(console.warn);
  console.log(rangeNativeInES6.toString());

  // 仍然可以使用关键字extends来继承上面这个类
  /**
   * 这个类是拥有RangNativeInES6的所有方法的
   */
  class RangeNativeInES6Child extends from RangeNativeInES6 {

  }

  /**
   * [defineClass 简单定义类的函数]
   * @param  {[type]} constructor [用以设置实例的属性的函数]
   * @param  {[type]} methods     [实例的方法，复制至原型中]
   * @param  {[type]} statics     [类属性，复制到构造函数中]
   * @return {[type]}             [description]
   */
  function defineClass(constructor, methods, statics) {
    if (methods) { // methods && extend(constructor.prototype, methods);
      extend(constructor.prototype, methods);
    }
    if (statics) { // statics && extend(constructor, statics);
      extend(constructor, statics);
    }
    return constructor;
  }

  // 调用上面这个函数
  let SimpleRange = defineClass(function(f, t) {
    this.f = f;
    this.t = t;
  }, {
    include: function(x) {
      return this.f < x && x < this.t;
    },
    forEach: function(f) {
      for (let i = Math.ceil(this.f); i < this.t; i++) {
        f(i);
      }
    }
  }, {
    // 这函数未知 ？
    upto: function(t) {
      return new SimpleRange(0, t);
    }
  });

  /**
   * [Complex description]
   * @param {[type]} real      [description]
   * @param {[type]} imaginary [description]
   */
  function Complex(real, imaginary) {
    if (isNaN(real) || isNaN(imaginary)) { // 保证传入的都是数字
      throw new TypeError('请输入数字');    // 抛出异常
    }
    this.r = real;                       // 复数的实部
    this.i = imaginary;                 // 复数的虚部
  }

  /**
   * [add 当前复数对象加上另外一个复数，并返回一个新的计算和值后的复数对象]
   * @param {[type]} that [description]
   */
  Complex.prototype.add = function(that) {
    return new Complex(this.r + that.r, this.i + that.i);
  }

  /**
   * [mul 当前复数乘以另外一个复数，并返回一个新的计算乘积之后的复数对象]
   * @param  {[type]} that [description]
   * @return {[type]}      [description]
   */
  Complex.prototype.mul = function(that) {
    return new Complex(this.r * that.r - this.i * that.r, this.r * that.r + this.i * that.i);
  }

  /**
   * [mag 计算两个复数的模，即为原点(0, 0)到复平面（什么意思？）的距离]
   * @param  {[type]} that [description]
   * @return {[type]}      [description]
   */
  Complex.prototype.mag = function() {
    return new Complex(this.r * this.r + this.i * this.i);
  }

  /**
   * [neg 复数的求负运算]
   * @return {[type]} [description]
   */
  Complex.prototype.neg = function() {
    return new Complex(-this.r, -this.i);
  }

  /**
   * [toString 将复数对象转化为一个字符串]
   * @return {[type]} [description]
   */
  Complex.prototype.toString = function() {
    return `{${this.r}, ${this.i}}`;
  }

  /**
   * [equals 检查当前复数对象是否和另外一个复数对象相等]
   * @param  {[type]} that [description]
   * @return {[type]}      [description]
   */
  Complex.prototype.equals = function(that) {
    return that != null &&                  // 必须有定义且不为空
    that.constructor === Complex &&         // 构造函数也是Complex
    this.r === that.r && this.i === that.i; // 必须包含相同的值
  }

  /**
   * 类字段和类方法直接定义为构造函数的属性
   * 类的方法通常不使用关键字this
   * 它们只对参数进行操作
   */

  // 这里预定义了一些对复数运算有帮助的类的字段
  // 用大写命名表明这些都是常量
  Complex.ZERO = new Complex(0, 0);
  Complex.ONE = new Complex(1, 0);
  Complex.I = new Complex(0, 1);

  // 以下类方法将由实例对象的toString方法返回的字符串格式解析为一个Complex对象
  // 或者抛出一个类型异常
  Complex.parse = function(str) {
    try {
      let m = Complex._format.exec(str);  // 正则表达式匹配？？？
      return new Complex(parseFloat(m[1]), parseFloat(m[2]))
    } catch(x) {
      throw new TypeError(`Cant parse ${str} as a complex number`);
    }
  }

  /**
   * [_format 定义类的私有字段，通常以下划线'_'作为起始]
   * @type {RegExp}
   */
  Complex._format = /^\{([^,]+), ([^}]+)\}$/;

  // new 一个实例对象
  let complex = new Complex(4, 8);
  // 使用了complex的实例属性
  let complex2 = new Complex(complex.r, complex.i);
  // 实例方法
  complex.add(complex2).toString(); // "{8, 16}"
  // 类方法和类字段
  // 将complex2转化为字符串，再加上它的复数，始终等于0
  Complex.parse(complex2.toString()).add(complex2.neg()).equals(Complex.ZERO); // true

  /**
   * javascript的动态继承机制
   * [conj 返回当前复数的共轭复数,改变原型会影响到所有实例]
   * @return {[type]} [description]
   */
  Complex.prototype.conj = function() {
    return new Complex(this.r, -this.i);
  }

  /*******另一些动态继承机制的例子*******/
  // let n = 3;
  Number.prototype.times = function(f, context) {
    console.log(this); // Number
    let n = Number(this);
    for (let i = 0; i < n; i++) {
      console.log(context); // 这里的context 似乎只是undefined
      f.call(context, i)
    }
  }
  n.times((n) => { console.info(`${n} hello`)} );

  /**
   * [trim 如果不支持ES5的 String.trim()方法，则自己定义一个，
   * 用以去除开头和结尾的空格]
   * @return {[type]} [description]
   */
  String.prototype.trim = String.prototype.trim || function() {
    if (!this) return this;                 // 空字符串不作处理
    return this.replace(/^\s+|\s+$/g/, ''); // 使用正则表达式进行空格替换
  }

  /**
   * [getName 定义一个获取函数名字的方法，
   * 如果它有(非标准的)name属性，则直接使用，
   * 否则，将函数转化为字符串然后用正则匹配获取名字，
   * 如果没有名字，就返回空字符串]
   * @return {[type]} [description]
   */
  Function.prototype.getName = function() {
    return this.name || this.toString().match(/function\s*([^(]*)\(/)[1];
  }

  /*************类和类型***********/
  function typeAndValue(x) {
    if (x == null) return ''; // null 和 undefined 没有构造函数!
    switch(x.constructor) {
      case Number: return `Number ${x}`;
      case String: return `String ${x}`;
      case RegExp: return `RegExp ${x}`;
      case Function: return `Function ${x}`;
      case Object: return `Object ${x}`;
      case Boolean: return `Boolean ${x}`;
      case Date: return `Date ${x}`;
      case Complex: return `Complex ${x}`; // 上文中我们定义过的
    }
  }

  /**
   * [type 可以判断值的类型的type()函数]
   * [以字符串形式返回o的类型]
   * [如果typeof所返回的值不是'object',则返回这个值]
   * [NOTE:有一些javascript的实现将正则表达式识别为函数]
   * [如果o的类不是Object，则返回这个值]
   * [如果o包含构造函数并且这个构造函数具有名称，则返回这个名称]
   * [否则一律返回'Object']
   * @param  {[type]} o [description]
   * @return {[type]}   [description]
   */
  function type(o) {
    let t, c, n; // type. class, name

    // 处理Null值的特殊情形
    if (o === null) return 'null';

    // 另外种情况 NaN和自身不相等
    if (o !== o) return 'nan';

    // 如果typeof的值不是'object',则使用这个值
    // 这可以识别出原始值的类型和函数
    if ((t = typeof o) !== 'object') return t;

    // 返回对象的类型，除非值为Object
    if ((t = classof(o)) !== 'Object') return c;

    // 如果构造函数的名字的存在的话，则返回它
    if (o.constructor && typeof o.constructor === 'function' && (n = o.constructor.getName())) return n;

    // 其他类型都无法判别，则返回'Object'
    return 'Object';
  }

  /**
   * [classof 返回对象的类]
   * @param  {[type]} o [description]
   * @return {[type]}   [description]
   */
  function classof(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
  }

  /**
   * [getName 获取函数名字，可能是空字符串，不是函数的话返回null]
   * @return {[array]}  [match方法的匹配结果返回一个数组arr]
   * [不足之处是无法匹配表达式定义的函数的名，例如：var a = function (){ return 1}]
   * [如果是有返回内容，例如 function abc() { return 1; }
   * 则应当是这样的结果:
   * arr = ['function abc(', 'abc'];
   * arr= [
   *   0: 'function abc(' // 匹配的部分
   *   1: 'abc' // 完全匹配的结果
   *   index: 0 // 数组属性：索引值
   *   input: function abc() { return 1; } //数组属性：原始字符串
   * ]]
   * @return {[type]} [description]
   */
  Function.prototype.getName = function() {
    if ('name' in this) {
      return this.name;
    }
    // 匹配function; \s*匹配多个空格; ([^(]*)，匹配多个除了'('以外的字符,即是函数名; 再以'('结尾。完美
    return this.name = this.toString().match(/function\s*([^(])*)\(/)[1];
  }

  /**
   * 以上方法使用构造函数名字来识别对象的类的做法和使用constructor属性一样有一个问题————
   * 并不是所有的对象都具有constructor属性。此外，并不是所有函数都有名字。
   */

  /**鸭式辩型**/
  // 利用鸭式辩型实现的额函数
  // 如果o实现了除第一个参数之外的参数所表示的方法，则返回true
  function quacks(o, /*, ...*/) {
    for (let i = 1; i < arguments.length; i++) { //遍历o之后的所有参数
      let arg = arguments[i];
      switch (typeof arg) { // 如果参数是
        case 'string':      // string: 直接用名字做检查
        // 如果是字符串的话则直接检查是否存在以它命名的方法
          if (typeof o[arg] !== 'function') return false;
          continue;
        case 'function': // 检查函数的原型对象上的方法
          // 如果实参是函数，则使用它的原型
          arg = arg.prototype; // 保存后进行下一个case
        case 'object':
          for (let m in arg) { // 遍历对象的每一个属性
            if (typeof arg[m] !== 'function') continue; // 跳过不是方法的属性
            if (typeof o[m] !== 'function') return false;
          }
      }
    }
    // 如果走到了这一步，证明前面的所有方法是存在的
    return true;
  }

  /** quacks() 函数不能用于检查内置类 */
  /** 比如不能以quacks(o, Array)方法来检测o是否实现了Array中所有同名的方法，原因是内置类的方法都是不可枚举的 */

  /***javascript中的面向对象技术****/
  /**集合类**/
  // 值的任意集合
  function Set() { // 一个构造函数
    this.values = {}; // 集合数据保存在对象的属性里
    this.n = 0; // 集合中值的个数
    this.add.apply(this, arguments); // 把所有参数都加进这个集合
  }
  /**
   * [add 将每个参数添加至集合中]
   * @return {[type]} [description]
   */
  Set.prototype.add = function() {
    for (let i = 0; i < arguments.length; i++) {
      let val = arguments[i]; // 待添加进集合中的值
      let str = Set._v2s(val); // 把它转化为字符串
      if (!this.values.hasOwnProperty(str)) { // 如果不在集合中
        this.values[str] = val; // 将字符串和值对应起来
        this.n++; // 值的个数加一
      }
    }
    return this; // 支持链式方法调用
  }

  /**
   * [remove 从集合中删除元素，这些元素由参数指定]
   * @return {[type]} [description]
   */
  Set.prototype.remove = function() {
    for (let i = 0; i < arguments.length; i++) {
      let str = Set._v2s(arguments[i]); // 将字符串和值对应起来
      if (this.values.hasOwnProperty(str)) {
        delete this.values[str]; // 如果在集合中则删除
        this.n--;
      }
    }
    return this;
  }

  /**
   * [contains 如果集合包含这个值，则返回true]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  Set.prototype.contains = function(value) {
    return this.values.hasOwnProperty(Set._v2s(value));
  };

  /**
   * [size 返回集合的大小]
   * @return {[type]} [description]
   */
  Set.prototype.size = function() {
    return this.n;
  }

  /**
   * [foreach 遍历集合中的所有元素，在指定的上下文中调用f]
   * @param  {[function]} f       [方法]
   * @param  {[type]} context [上下文，允许不传]
   * @return {[type]}         [description]
   */
  Set.prototype.foreach = function(f, context) {
    for (let s in this.values) {  // 遍历集合中的所有字符串
      if (this.values.hasOwnProperty(s)) { // 忽略继承的属性
        f.call(context, this.values[s]);   // 调用f，传入value
      }
    }
  }

  /**
   * [_v2s 这个内部函数，用以将任意javascript值和唯一的字符串对应起来]
   * @param  {[type]} val [description]
   * @return {[type]}     [description]
   */
  Set._v2s = function(val) {
    switch (val) {
      case undefined: return 'u'; // 特殊的原始值
      case null: return 'n';      // 值只有一个字母
      case true: return 't';      // 代码
      case false: return 'f';
      default: switch (typeof val) {
        case 'number': return `# ${val}`; // 数字都带有#前缀
        case 'string': return `" ${val}`; // 字符串都有引号"前缀
          default: return `@ ${objectId(val)}`; // 对象和方法都有 @前缀
      }
    }

    // 对任意对象来说，都会返回一个字符串
    // 针对不同对象，这个函数会返回不同的字符串
    // 对于同一个对象的多次调用，总是返回相同的字符串
    // 为了做到这点，它给o创建了一个属性，在ES5中，这个属性是不可枚举而且是只读的
    function objectId(o) {
      let prop = "[**objectId**]";   // 私有属性，用以存放id
      if (!o.hasOwnProperty(prop)) { // 如果对象没有该id
        o[prop] = Set._v2s.next++;   // 将下一个值赋值给它
      }
      return o[prop];                // 返回这个id
    }
  }

  Set._v2s.next = 100; // 设置初始id的值

  // 用ES6改写,使用class语法糖来实现
  class Set {
    constructor() {
      this.values = {};
      this.counts = 0;
      this.add.apply(this, arguments);
    }

    /**
     * [add 新增内容]
     */
    add() {
      for (let i = 0; i < arguments.length; i++) {
        let str = Set._v2s(arguments[i]);
        if (!this.values.hasOwnProperty(str)) {
          this.values[str] = arguments[i];
          this.n++;
        }
      }
      return this;
    }

    /**
     * [remove 移除]
     * @return {[type]} [description]
     */
    remove() {
      for (let i = 0; i < arguments.length; i++) {
        let str = Set._v2s(arguments[i]);
        if (this.values.hasOwnProperty(str)) {
          delete this.values[str];
          this.n--;
        }
      }
      return this;
    }

    /**
     * [contains description]
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    contains(val) {
      return this.values.hasOwnProperty(Set._v2s(val));
    }

    /**
     * [foreach 遍历，调用方法]
     * @param  {[type]} f       [description]
     * @param  {[type]} context [description]
     * @return {[type]}         [description]
     */
    foreach(f, context) {
      for (let s in this.values) {
        if (this.values.hasOwnProperty(s)) {
          f.call(context, this.values(s));
        }
      }
    }

    /**
     * [_v2s 该方法其实也是属于prototype中的, 所以无法直接使用，参见以下]
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    _v2s(val) {
      switch (val) {
        case 'undefined': return 'u';
        case 'null': return 'n';
        case 'true': return 't';
        case 'false': return 'f';
        default: switch (typeof val) {
          case 'number': return `#${val}`;
          case 'string': return `"${val}`;
          default: return `@${objectId(val)}`;
        }
      }

      function objectId(o) {
        let prop = '[**objectId**]';
        if (!o.hasOwnProperty(prop)) {
          o[prop] = Set._v2s.next++;
        }
        return o[prop];
      }
    }
  }

  // 这里使用直接定义属性的方式
  /**
   * [_v2s description]
   * @return {[type]} [description]
   */
  Set._v2s = function() {
    switch (val) {
      case 'undefined': return 'u';
      case 'null': return 'n';
      case 'true': return 't';
      case 'false': return 'f';
      default: switch (typeof val) {
        case 'number': return `#${val}`;
        case 'string': return `"${val}`;
        default: return `@${objectId(val)}`;
      }
    }

    function objectId(o) {
      let prop = '[**objectId**]';
      if (!o.hasOwnProperty(prop)) {
        o[prop] = Set._v2s.next++;
      }
      return o[prop];
    }
  }

  // 初始值
  Set._v2s.next = 100;

  /**
   * [extend 将p中的可枚举属性复制到o中，并返回o]
   * @param  {[type]} o [原始对象]
   * @param  {[type]} p [被复制的对象，提供可枚举属性]
   * @return {[type]}   [description]
   */
  function extend (o, p) {
    for (prop in p) {
      o[prop] = p[prop];
    }
    return o;
  }

  extend(Set.prototype, {
    /**
     * [toString 将集合转换为字符串]
     * @return {[type]} [description]
     */
    toString: function() {
      let s = "{",
          i = 0;
      this.foreach((v) => {
        s += ((i++>0) ? ", " :  "") + v;
      });
      return s + "}";
    },

    /**
     * [toLocaleString 类似toString, 但是对于所有的值都将调用toLocalString]
     * @return {[type]} [description]
     */
    toLocaleString: function() {
      let s = "{",
          i = 0;
      this.foreach((v) => {
        if (i++>0) {
          s += ", ";
        }
        if (v == null) {
          s += v; // null, undefined 也加？ 这里存疑
        } else {
          s += v.toLocaleString(); // 其他情况
        }
      });
      return s + "}";
    },
    toArray: function() {
      let a = [];
      this.foreach((v) => {
        a.push(v);
      });
      return a;
    }
  });

  // 对于要从JSON转换为字符串的集合都被当做数组来对待
  Set.prototype.toJSON = Set.prototype.toArray;

  // 随便插入的
  /*邮箱的正则*/
  const MAIL = /^([\w]+)@([\w]+)(.com)$/;
  const Mail = /^.+@.+$/; // 更标准的答案

  /****枚举类型****/
  /**
   * [inherit 返回一个继承自原型对象p的属性的新对象]
   * @param  {[type]} p [description]
   * @return {[type]}   [description]
   */
  function inherit(p) {
    if (p == null) throw TypeError(); // p应当为对象
    if (Object.create) {              // 如果ES5中的Object.create()存在
      return Object.create(p);        // 直接使用
    }
    let t = typeof p;                 // 否则进行进一步检测
    if (t !== 'object' && t !== 'function') throw TypeError();
    function f() {};                  // 定义一个空构造函数
    f.prototype = p;                  // 将其原型属性设置为p
    return new f();                   // 返回使用f()创建p的继承对象
  }

  // 使用四个值创建新的Coin类， Coin.Penny, Coin.Nickel等
  let Coin = enumeration({Penny: 1, Nickel: 5, Dime: 10, Quarter: 25});
  let c = Coin.Dime; // 新类的实例
  c instanceof Coin; // true
  c.constructor == Coin; // true
  Coin.Quarter + 3 * Coin.Nickel; // 40 将值转化为数字
  Coin.Dime > Coin.Nickel; // true: 关系运算符正常工作
  `${String(Coin.Dime)} : ${Coin.Dime}`; // "Dime: 10" :强制转换为字符串

  function enumeration(namesToValues) {
    let enumeration = function() { throw "Can't Instantiate Enumeration"; };

    // 枚举值继承自这个对象
    let proto = enumeration.prototype = {
      constructor: enumeration,
      toString: function() { return this.name },
      valueOf: function() { return this.value },
      toJSON: function() { return this.name }
    }

    enumeration.values = []; // 用以存放枚举对象的数组

    for (name in namesToValues) {
      let e = inherit(proto); // 创建一个代表它的对象
      e.name = name;
      e.value = namesToValues[name];
      enumeration[name] = e;
      enumeration.values.push(e);
    }

    // 一个类方法，用来对类的实例进行迭代
    enumeration.foreach = function(f, c) {
      for (let i = 0; i < this.values.length; i++) {
        f.call(c, this.values[i]);
      }
    }

    return enumeration;
  }

  /**使用枚举类型来表示一副扑克牌, 这个可以细细把玩**/

  // 定义一个表示“玩牌”的类
  function Card(suit, rank) {
    this.suit = suit; // 每张牌都有花色
    this.rank = rank; // 以及点数
  }

  // 使用枚举类型定义花色和点数
  Card.Suit = enumeration({Clubs: 1, Diamonds: 2, Hearts: 3, Spades: 4});
  Card.Rank = enumeration({Two: 2,  Three: 3, Four: 4, Five: 5, Six: 6, Seven: 7, Eight: 8, Nine: 9, Ten: 10,
    Jack: 11, Queen: 12, King: 13, Ace: 14});

  //
  /**
   * [toString 定义用以描述牌面的文本]
   * @return {[type]} [description]
   */
  Card.prototype.toString = function() {
    return `${this.rank.toString()} of ${this.suit.toString()}`;
  }

  /**
   * [compareTo 比较扑克牌中两张牌的大小]
   * @param  {[type]} that [description]
   * @return {[type]}      [description]
   */
  Card.prototype.compareTo = function(that) {
    if (this.rank < that.rank) return -1;
    if (this.rank > that.rank) return 1;
    return 0;
  }

  /**
   * [orderByRank 以扑克牌的玩法规则对牌进行排序的函数]
   * @param  {[type]} a [description]
   * @param  {[type]} b [description]
   * @return {[type]}   [description]
   */
  Card.orderByRank = function(a, b) {
    return a.compareTo(b);
  }

  /**
   * [orderBySuit 以桥牌的玩法规则对牌进行排序和函数]
   * @param  {[type]} a [description]
   * @param  {[type]} b [description]
   * @return {[type]}   [description]
   */
  Card.orderBySuit = function(a, b) {
    if (a.suit < b.suit) return -1;
    if (a.suit > b.suit) return 1;
    if (a.rank < b.rank) return -1;
    if (a.rank > b.rank) return 1;
    return 0;
  }

  /**
   * [Deck 定义用以表示一副标准扑克牌的类]
   */
  function Deck() {
    let cards = this.cards = [];
    Card.Suit.foreach(function (s) {
      Card.Rank.foreach(function(r) {
        cards.push(new Card(s, r));
      })
    })
  }

  /**
   * [shuffle 洗牌的方法: 重新洗牌并返回洗好的牌]
   * @return {[type]} [description]
   */
  Deck.prototype.shuffle = function() {
    let deck = this.cards, len = deck.length;
    for (let i = len - 1; i > 0; i--) {
      let r = Math.floor(Math.random() * (i + 1)),
      temp;               // 随机数
      temp = deck[i],
      deck[i] = deck[r],  // 交换
      deck[r] = temp;
    }
    return this;
  }

  /**
   * [deal 发牌的方法：返回牌的数组]
   * @param  {[type]} n [description]
   * @return {[type]}   [description]
   */
  Deck.prototype.deal = function(n) {
    if (this.cards.length < n) {
      throw  "Out of Cards";
    }
    return this.cards.splice(this.cards.length - n, n);
  }

  // 创建一副新扑克牌，洗牌并发牌
  let deck = (new Deck()).shuffle();
  let hand = deck.deal(13).sort(Card.orderBySuit);

  // ES6的Class重写一个玩牌的类
  class Card2 {
    constructor(suit, rank) {
      this.suit = suit; // 花色
      this.rank = rank; // 点数
    }

    toString() {
      return `${this.rank.toString()} of ${this.suit.toString()}`;
    }

    compareTo(that) {
      if (this.rank < that.rank) return -1;
      if (this.rank > that.rank) return 1;
      return 0;
    }
  }

  Card2.Suit = enumeration({Clubs: 1, Diamonds: 2, Hearts: 3, Spades: 4});
  Card2.Rank = enumeration({
    Two: 2,
    Three: 3,
    Four: 4,
    Five: 5,
    Six: 6,
    Seven: 7,
    Eight: 8,
    Nine: 9,
    Ten: 10,
    Jack: 11,
    Queen: 12,
    King: 13,
    Ace: 14
  });

  Card2.orderByRank = function(a, b) {
    return a.compareTo(b); // compareTo 中的 this 指代a
  }

  Card2.orderBySuit = function(a, b) {
    // 先比较花色
    if (a.suit < b.suit) return -1;
    if (a.suit > b.suit) return 1;
    // 再比较点数
    if (a.rank < b.rank) return -1;
    if (a.rank > b.rank) return 1;
    return 0;
  }

  class Deck2 {
    constructor() {
      this.cards = [];
      Card2.Suit.foreach((s) => {
        Card2.Rank.foreach((r) => {
          this.cards.push(new Card2(s, r));
        })
      });
    }

    shuffle() {
      let deck = this.cards,
          len = deck.length;
      for (let i = 0; i < len; i++) {
        let r = Math.floor(Math.random() * (i + 1)),
            temp;
        temp = deck[i];
        deck[i] = deck[r];
        deck[r] = temp;
      }
      return this;
    }

    deal(n) {
      if (this.cards.length < n) throw "Out of cards";
      return this.cards.splice(this.cards.length - n, n)
    }
  }

  let deck2 = (new Deck2()).shuffle();
  let hand2= deck2.deal(13).sort(Card2.orderBySuit); // 13张
  hand2.join('\n').toString(); // 查看这副牌

  /***比较方法***/
  // Range类重写它的constructor属性
  Range.prototype.constructor = Range;

  /**
   * [equals 一个Range对象和其他不适Range的对象均不相等，当且仅当两个端点相等，才返回true]
   * @param  {[type]} that [description]
   * @return {[type]}      [description]
   */
  Range.prototype.equals = function(that) {
    if (that == null) return false;   // 处理null和undefined
    if (!that.constructor === Range) return false; // 处理非Range对象
    return that.from === this.from && that.to === this.to;
  }

  // 处理Set类的比较方法,除了比较属性以外，还要进行其他比较
  Set.prototype.equals = function(that) {
    // 一些次要情况的快捷处理  ？？？ 如果这里就能判断了 那为什么还需要接下来的步骤
    if (this === that) return true;

    // 如果that对象不是一个集合，它和this不相等
    // 我们用到了instanceof, 使得这个方法可以用于Set的任何子类
    // 如果希望采用鸭式辩型的方法，可以降低检查的严格程度
    // 或者可以通过 this.constructor == that.constructor 来加强检查的严格程度
    // 注意，null 和 undefined 两个值是无法用于 instanceof 运算的
    if (!(that instanceof Set)) return false;

    // 如果两个集合的大小不一样
    if (this.size() !== that.size()) return false;

    // 现在检查两个集合中的元素是否完全一样
    // 如果两个集合不相等，则通过抛出异常来终止 foreach 循环
    try {
      this.foreach((v) => {
        if (!that.contains('v')) throw false;
      });
      return true;                   // 所有的元素都匹配：两个集合相等
    } catch (x) {
      if (x === false) return false; // 如果集合中有元素在另一个集合中不存在
      throw x;                       // 重新抛出异常
    }
  }

  /**
   * [compareTo 定义一个函数比较下边界，但缺少类型检查和上边界比较]
   * @param  {[type]} that [description]
   * @return {[type]}      [description]
   */
  // Range.prototype.compareTo = function(that) {
  //   return this.from - that.from;
  // }

  // 根据下边界来对Rang对象排序，如果下边界相等则比较上边界
  // 如果传入非Range值，则抛出异常
  // 上下边界都相等时，决定值相等
  Range.prototype.compareTo = function(that) {
    if (!(that instanceof Range)) {
      throw new Error(`Cant compare a Range with ${that}`);
    }
    var diff = this.from - that.from; // 比较下边界
    if (diff === 0) {
      diff = this.to - that.to; // 如果相等，比较上边界
    }
    return diff;
  }

  // 可以使用以上方法进行排序
  ranges.sort(function(a, b) {
    return a.compareTo(b);
  });

  // 更方便直观的写法
  Range.byLowerBound = function(a, b) {
    return a.compareTo(b);
  }

  range.sort(Range.byLowerBound);

  /**********私有状态***********/
  function RangePrivate(from, to) {
    // 不要将端点保存为对象的属性，相反
    // 定义存取器函数来返回端点的值
    // 保存在闭包中
    this.from = function() { return from };
    this.to = function() { return to };
  }

  RangePrivate.prototype = {
    constructor: RangePrivate,
    includes: function(x) {
      return this.from() <= x && x <= this.to();
    },
    foreach: function(f) {
      for (var x = Math.ceil(this.from()), max = this.to(); x <= max; x++) {
        f(x);
      }
    },
    toString: function() {
      return `(${this.from()} ... ${this.to()})`;
    }
  }

  var r = new RangePrivate(1, 5); // 一个不可修改的范围
  r.from = function() {
    return 0;     // 通过方法替换来修改它
  }

  /******子类*******/
  // 创建子类的关键
  B.prototype = inherit(A.prototype);     // 子类派生自父类
  B.prototype.constructor = B;  // 重载继承来的constructor属性

  /**
   * [defineSubclass 一个函数来创建简单的子类]
   * @param  {[type]} superClass  [父类的构造函数]
   * @param  {[type]} constructor [新的子类的构造函数]
   * @param  {[type]} methods     [实例方法：复制至原型中]
   * @param  {[type]} statics     [类属性: 复制至构造函数中]
   * @return {[type]}             [返回这个类]
   */
  function defineSubclass(superClass, constructor, methods, statics) {

    // 建立子类的原型对象
    constructor.prototype = inherit(superClass.prototype);
    constructor.prototype.constructor = constructor;

    // 像对常规类一样复制方法和类属性
    if (methods) {
      extend(constructor.prototype, methods);
    }
    if (statics) {
      extend(constructor, statics);
    }
    return constructor;
  }

  // 或者可以通过父类构造函数的方法来做到这一点
  Function.prototype.extend = function(constructor, methods, statics) {
    return defineSubclass(this, constructor, methods, statics);
  }

  // 这个例子是手动实现的
  function SingletonSet(member) {
    this.member = member;
  }
  // 创建一个原型对象，这个原型对象继承自Set的原型
  SingletonSet.prototype = inherit(Set.prototype);

  // 给原型添加属性
  // 如果有同名的属性就覆盖Set.prototype中的同名属性
  extend(SingletonSet.prototype, {
    // 设置合适的constructor
    constructor: SingletonSet,
    // 这个集合是只读的，不可调用add()和remove(),会报错
    add: function() {
      throw 'read-only set';
    },
    remove: function() {
      throw 'read-only set';
    },
    // SingletonSet实例中永远只有一个元素
    size: function() {
      return 1;
    },
    // 只打印这个集合的唯一成员
    foreach: function(f, context) {
      f.call(context, this.member);
    },
    // 检查传入的值是否匹配这个集合唯一的成员即可
    contains: function(x) {
      return x === this.member;
    }
  })

  // 可以重新定义equals方法，更简洁高效
  SingletonSet.prototype.equals = function(that) {
    return that instanceof Set && that.size() === 1 ** that.contains(this.member);
  }
}

// 永乐票务抢李志票用
var seconds = 0;
var count = 3;
var kk = setInterval(() => {
  // if (seconds === 60000) { window.clearInverval(kk)} // 仅为测试用
  count = count === 3 ? 4 : 3;
  let sec = new Date().getSeconds();
  let min = new Date().getMinutes();
  let ck = $('.price-ck li')[count];
  console.info(min)
  if (ck.className === 'over') {
    if (seconds % 1000 === 0) {
      console.warn(`这次${ck.title}缺票!`);
    }
  } else {
    console.info(`这次${ck.title}有票！`);
    ck.click();
    window.clearInverval(kk);
  }
  seconds += 10; // 测试用
}, 10)

/**
 * [bisection 二分法求根]
 * @param  {Number} num   [需要求根的数]
 * @param  {Number} len   [保留小数位数, 默认为10位]
 * @param  {Number} left  [最小值]
 * @param  {Number} right [最大值]
 * @return {Number}       [result]
 */
Number.prototype.bisection = function(num, len=10, left=0, right) {
  let origin = Number(this);
  num = num || origin;
  right = right || origin;
  let m = num / 2;
  if (num.toString().split('.').length > 1) {
    let length = num.toString().split('.')[1].length;
    if (length === len) {
      console.info('result', m);
      return m;
    }
  }
  if ((m * m) > origin) {
    let n = m + left;
    this.bisection(n, len, left, m);
  } else {
    let n = m + right;
    this.bisection(n, len, m, right);
  }
}

// for example
let tempNum = 8;
tempNum.bisection(8);
