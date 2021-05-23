/******** 《JavaScript 高级程序设计》(第4版) ********/
/******** 5、 基本引用类型 103-136 ********/

export default class Part5BasicReferenceType {
  constructor(){
    // 5.1 Date
    // 获取当前时间
    let now = new Date();

    // 内部其实调用了方法来格式化
    Date.parse();
    // 上述方法如果传入不满足的参数，则会返回 NaN

    // 这个方法接收更多入参来设置日期
    Date.UTC();

    // 获取当前时间戳 常用在代码分析中
    Date.now();

    // 比如这样
    const cb = () => {};
    this.getTiming(cb);

    // 5.1.1 继承的方法
    // 和很多类型一样，Date也重写了 toLocaleString toString valueOf 等方法
    // 返回和浏览器本地环境一致的日期和时间 会包括上午下午，但不包括时区
    now.toLocaleString(); // "2021/5/11 下午10:19:56"

    // toString 返回的结果会包括时区 时间也是 24 小时制的
    now.toString(); // "Tue May 11 2021 22:19:56 GMT+0800 (中国标准时间)"

    // valueOf 返回的是时间戳，因此是可以比较的
    const now1 = new Date();
    now1 > now; // true

    // 5.1.2 日期格式化方法
    // 专门用于格式化的方法，都返回字符串
    // 显示日期中的时分秒和时区
    now.toTimeString(); // "22:23:48 GMT+0800 (中国标准时间)"
    // 显示完整的日期
    now.toDateString(); // "Tue May 11 2021"
    // 显示日期中的时分秒 关联本地地区
    now.toLocaleTimeString(); // "下午10:23:48"
    // 显示完整的日期 关联本地地区
    now.toLocaleDateString(); // "2021/5/11"
    // 显示完整的 UTC 时间 较为常用
    now.toUTCString(); // "Tue, 11 May 2021 14:23:48 GMT"
    // 显示完整的 ISO 日期格式
    now.toISOString(); // "2021-05-11T14:23:48.466Z"

    // 5.1.3 日期/时间组件方法
    // for in 可以遍历出原型链上的属性，不包括方法
    // Object.keys 遍历当前对象的可枚举属性

    this.consoleDateFunc();

    // 5.2 RegExp
    // 正则表达式使用类似 Perl 的简洁语法来创建
    const expression = /pattern/flags;
    // 下面是匹配模式的标记
    // g/i/m/y/u/s

    const pattern1 = /at/g;
    const pattern2 = /[bc]at/i;
    const pattern3 = /.at/gi;

    const pattern21 = /\[bc\]at/i;
    const pattern31 = /\.at/gi;

    // 上面是字面量的方式创建
    // 也可以使用构造函数的方式创建，接收两个参数，第一个参数是字符串或者正则，而第二个参数必须是字符串
    const pattern0 = new RegExp('at', 'g');

    // 下面这两个是等价的，但是因为正则本质上也是对象，所以指向不同引用，这样比较起来就是不相等的
    pattern0 === pattern1; // false

    const pattern01 = new RegExp(pattern1);
    // 其实这两者也是等价的
    pattern1 === pattern01; // false

    // 基于一个正则来构建另一个正则
    const pattern30 = new RegExp(pattern3, 'g');

    // 5.2.1 RexExp 实例属性
    // 和上述匹配模式的标记一一对应
    // global
    // ignoreCase
    // unicode
    // sticky
    // lastIndex
    // multiline
    // dotAll

    // source 正则表达式的字面量字符串，没有前后斜杠
    // flags 标记字符串，对应构造函数的第二个参数

    // 这些属性实际中用的不多，因为模式声明中已经包含了这些信息

    // 5.2.3 RegExp 实例方法
    // exec 方法在一个指定字符串中执行一个搜索匹配。返回一个结果数组或 null。
    const str = 'mom and dad and baby';
    const strReg = /dad/;
    strReg.exec(str);
    // 没有查询结果的话，返回 null
    // 如果有查询结果的话
    // 返回一个数组,包含第一个找到的匹配项，其他元素是与表达式中的捕获组匹配的字符串
    // 而且额外有几个属性，index 表示索引， input 表示查找的正则字面量字符串
    // ["dad", index: 8, input: "mom and dad and baby", groups: undefined];

    const patternExec = /mom( and dad( and baby)?)?/gi;
    patternExec.exec(str);
    // 返回以下结果 其中正则模式包含了两个模式组
    // (3) ["mom and dad and baby", " and dad and baby", " and baby", index: 0, input: "mom and dad and baby", groups: undefined]

    // 全局模式会记住每一次查找并一直往后推, 非全局模式则不会
    // 每一次查找的记录会记在正则的 lastIndex 属性中
    // lastIndex: 下一次匹配开始的位置
    const text = 'bat, cat, sat, fat';
    const patternAtWithG = /.at/g;
    let matchesWithG = patternAtWithG.exec(text);
    console.info(matchesWithG.index, patternAtWithG.lastIndex, matchesWithG[0]); // 0, 3, bat

    matchesWithG = patternAtWithG.exec(text);
    console.info(matchesWithG.index, patternAtWithG.lastIndex, matchesWithG[0]); // 5, 8, cat

    matchesWithG = patternAtWithG.exec(text);
    console.info(matchesWithG.index, patternAtWithG.lastIndex, matchesWithG[0]); // 10, 13, sat

    // 非全局模式
    const patternAt = /.at/;
    let matches = patternAt.exec(text);
    console.info(matches.index, patternAt.lastIndex, matches[0]); // 0, 0, bat

    matches = patternAt.exec(text);
    console.info(matches.index, patternAt.lastIndex, matches[0]); // 0, 0, bat

    matches = patternAt.exec(text);
    console.info(matches.index, patternAt.lastIndex, matches[0]); // 0, 0, bat

    // 粘附标记会覆盖全局标记，它让 exec 只会在 lastIndex 上寻找匹配项
    const patternAtWithY = /.at/y;
    let matchesWithY = patternAtWithY.exec(text); // 有结果
    console.info(matchesWithY.index, matchesWithY[0], patternAtWithY.lastIndex); // 0 bat 3
    // 再次调用返回的是 null 因为在 3 开始的位置，没有匹配项
    patternAtWithY.exec(text); // null
    patternAtWithY.lastIndex = 5;
    let matchesWithY2 = patternAtWithY.exec(text);
    console.info(matchesWithY.index, matchesWithY[0], patternAtWithY.lastIndex); // 5 cat 8

    // test() 方法执行一个检索，用来查看正则表达式与指定的字符串是否匹配。返回 true 或 false。
    // 直接复用上面的变量
    console.info(patternAt.test(text), patternAt.test('asdfg')); // true false
    console.info(patternAtWithG.test(text), patternAtWithG.test('asdfg')); // true false

    const patternAtWithG2 = /.at/g;
    // 像上面一样，如果设置了全局模式，则它会继续查找
    // 每一次查找，如果有结果则会修改正则表达式的 lastIndex 属性， 它的值是符合条件的末尾
    // 后续的执行会从 lastIndex 处继续查找
    console.info(patternAtWithG2.test(text), patternAtWithG2.lastIndex); // true 3
    console.info(patternAtWithG2.test(text), patternAtWithG2.lastIndex); // true 5
    console.info(patternAtWithG2.test(text), patternAtWithG2.lastIndex); // true 13
    console.info(patternAtWithG2.test(text), patternAtWithG2.lastIndex); // true 18
    // 执行到第五次时，返回 false，因为查完了,没有第五个符合条件的内容
    console.info(patternAtWithG2.test(text), patternAtWithG2.lastIndex); // false 0

    // 以下两个方法都返回字符串字面量
    console.info(patternAtWithY.toString(), pattern0.toLocaleString());
    // /.at/y /.at/g

    // 5.2.3 RegExp 构造函数属性
    // 可以直接使用构造函数的属性
    const shortText = 'this has been a short summer';
    const patternRegexp = /(.)hort/g;

    // 下面两种写法都可以获取属性
    if (patternRegexp.test(shortText)) {
      console.info(RegExp.input); // this has been a short summer
      console.info(RegExp.lastMatch); // short
      console.info(RegExp.lastParen); // s
      console.info(RegExp.leftContext); // "this has been a "
      console.info(RegExp.rightContext); // " summer"
      // 简写
      console.info(RegExp.$_); // this has been a short summer
      console.info(RegExp['$&']); // short
      console.info(RegExp['$+']); // s
      console.info(RegExp['$`']); // "this has been a "
      console.info(RegExp["$'"]); // " summer"
    }

    const patternRegexp$ = /(..)or(.)/g;
    // 可以取得第 1-9 个捕获组的匹配项目
    if (patternRegexp$.test(shortText)) {
      console.info(RegExp.$1); // sh
      console.info(RegExp.$2); // t
    }

    // 5.2.4 模式局限
    // Perl 语言的一些高级特性暂时欠缺
    // 条件式匹配，正则表达式注释

    // 5.3 原始值包装类型
    // 为了方便操作原始值， ECMAScript 提供了 3 种特殊的引用类型
    let s1 = 'some text';
    let s2 = s1.substring(2);

    // 实际上是这样
    let s1 = 'some text';
    let s1s = new String(s1); // 创建一个字符串实例
    let s2 = s1s.substring(2); // 调用实例的方法
    s1s = null; // 销毁实例
    // 这些都会在后台发生

    // 引用类型和原始值包装类型的区别在于生命周期
    // 原始值包装类型只存在于运行时，运行之后就自然销毁

    // Object 可以用来创建相应的原始值包装类型实例， 它的类型是对象， 但是是相应包装类型的实例
    const str1 = new Object('str');
    typeof str1 === 'object'; // true
    str1 instanceof String; // true

    // 5.3.1 Boolean
    // 布尔值的引用类型
    const falseObject = new Boolean(false);
    const falseValue = false;

    // 要注意上述两者的区别
    console.info(falseObject instanceof Boolean); // true
    console.info(falseValue instanceof Boolean); // false
    console.info(typeof falseObject); // object
    console.info(typeof falseValue); // boolean

    const arrBool = [,, 123, '', 'xiaoming'];
    const arrBoolFiltered = arrBool.filter((a) => !!a);
    // 实际上可以简写成下面
    const arrBoolFiltered2 = arrBool.filter(Boolean);
    // 它等效于
    const arrBoolFiltered3 = arrBool.filter((a) => Boolean(a));

    // 5.3.2 Number
    // 注意这两者的区别 使用 new 与否完全是两种结果
    const numObject = new Number(1);
    const numValue = Number('1');

    // 这里也类似，会得到上面的相似结果
    console.info(numObject instanceof Number); // true
    console.info(numValue instanceof Number); // false
    console.info(typeof numValue); // number
    console.info(typeof numObject); // object

    // Number 提供的格式化为字符串的方法
    // 保留几位小数
    numObject.toFixed(2); // 1.00
    numValue.toFixed(2); // 1.00

    // 科学计数法来表示
    (10).toExponential(2); // 1.00e+1

    // 有更合适的方式，自动会选择上述两个方式其一来展示
    const normalNumber = 99;
    normalNumber.toPrecision(1); // "1e+2"
    normalNumber.toPrecision(2); // 99
    normalNumber.toPrecision(3); // "99.0"

    // 为了以正确位数展示数值，上述这三个方法都会向上或者向下舍入
    // 可以使用 isInteger 来判断是否是整数
    console.info(Number.isInteger(1)); // true
    console.info(Number.isInteger(1.00)); // true
    console.info(Number.isInteger(1.01)); // false

    // 使用 isSafeInteger 来判断是否是安全整数
    // 也就是介于 Number.MIN_SAFE_INTEGER 和 Number.MAX_VALUE 之间的整数
    console.info(Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1)); // false
    console.info(Number.isSafeInteger(Number.MIN_SAFE_INTEGER + 1)); // true

    // 5.3.3 String
    const strObject = new String('cool');
    const strValue = String('cool');

    // 就不展开了， 和上面一样的结果
    typeof strObject; // object
    typeof strValue; // string

    // 1. JavaScript 字符
    let message = 'abcde';
    message.charAt(2); // 'c'
    // 查看码元值
    message.charCodeAt(2); // 99

    // 用于转换码元到字符串
    console.info(String.fromCharCode(99)); // c

    let message2 = 'ab😁de';
    message2.charAt(2); // "\ud83d"

    // 2. normalize() 方法
    // 用于编码方式

    // 3. 字符串操作方法
    // 可以用 concat 来拼接字符串
    const a = 'hello ';
    const b = 'world';
    const c = '!';
    // 它接收任意个参数，最终拼接在一起
    const hello = a.concat(b, c);
    // 但是一般用  + 更方便

    // 截取相关的方法
    // slice, substr, substring 都接收一到两个参数
    // 第一个参数都是起始索引，第二个参数有所不同
    console.info(hello.slice(2, 5)); // llo
    console.info(hello.substr(2, 5)); // 'llo w'
    console.info(hello.substring(2, 5)); // llo

    // 对负值参数的处理也不尽相同
    // 第二个打印的内容相当于是实际执行内容
    console.info(hello.slice(2, -5), hello.slice(2, 7)); // 'llo w'
    console.info(hello.substr(2, -5), hello.substr(2, 0)); // ''
    console.info(hello.substring(2, -5), hello.substring(2, 0)); // 'he'

    // 4. 字符串位置方法
    // indexOf, lastIndexOf
    // 可以在第二个参数上指定查询的起始位置
    let lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    let positions = [];
    let pos = lorem.indexOf('e');
    while (pos > -1) {
      positions.push(pos);
      pos = lorem.indexOf('e', pos + 1);
    }
    console.info(positions); // [3, 24, 32, 35, 51]

    let positionsLast = [];
    let posLast = lorem.lastIndexOf('e');
    while (posLast > -1) {
      positionsLast.push(posLast);
      posLast = lorem.lastIndexOf('e', posLast - 1);
    }
    // 得到反序的结果
    console.info(positionsLast); // (5) [51, 35, 32, 24, 3]

    // 5. 字符串包含方法
    // includes startsWith endsWith
    const string = 'foobarbaz';

    // 判断包含关系
    console.info(string.includes('foo')); // true
    console.info(string.startsWith('foo')); // true
    console.info(string.endsWith('foo')); // false

    console.info(string.includes('baz')); // true
    console.info(string.startsWith('baz')); // false
    console.info(string.endsWith('baz')); // true

    // 传入第二个参数，表示位置的时候
    console.info(string.includes('foo', 2)); // false
    console.info(string.startsWith('foo', 2)); // false
    // 相当于是字符串的位置，对 end 来说像是截止到某一位
    console.info(string.endsWith('foo', 2)); // false
    console.info(string.endsWith('foo', 3)); // true

    // 6. trim() 方法
    const string1 = '   foobarbaz   ';
    console.info(string1.trim()); // foobarbaz
    console.info(string1.trimLeft()); // foobarbaz
    console.info(string1.trimRight()); // foobarbaz
    console.info(string1.trimStart()); // foobarbaz
    console.info(string1.trimEnd()); // foobarbaz
    // trimLeft 是 trimStart 的别名

    // 7. repeat();
    console.info(hello.repeat(3)); // hello world!hello world!hello world!

    // 8. padStart() 和 padEnd() 方法
    // 用于在字符串左侧或者末尾填充
    const stringPad = 'pad';

    // 第一个参数是字符串总长度，而不是要填充的字符串长度
    stringPad.padStart(6); // '   pad'
    stringPad.padEnd(5, 'vvvv'); // 'padvv'
    // 长度限定之后，添加的字符串超出则不算
    stringPad.padStart(6, 'ipad and'); // 'ipapad'
    // 相当于是这个
    stringPad.padStart(6, 'ipa'); // 'ipapad'

    // 如果小于原始字符串的长度，则返回原始字符串
    stringPad.padStart(1, 'ipa'); // 'pad'

    // 9. 字符串迭代与解构
    // 使用原型上的 @@iterator 方法
    const abc = 'abc';
    const abcIterator = abc[Symbol.iterator]();
    console.info(abcIterator.next()); // { value: a, done: false }
    console.info(abcIterator.next()); // { value: b, done: false }
    console.info(abcIterator.next()); // { value: c, done: false }
    console.info(abcIterator.next()); // { value: undefined, done: true }

    // 也可以使用 for of
    for (const iterator of abc) {
      console.info(iterator);
    }
    // 分别输出 a b c

    // 因为有迭代属性，所以还可以解构展开
    console.info([...abc]); // [a, b, c]

    // 10. 字符串大小写转换
    abc.toUpperCase(); // ABC
    hello.toUpperCase(); // "HELLO WORLD!"
    // toLocaleUpperCase 仅在少数地区展现不同，比如土耳其语，绝大多数的效果是一样的

    // 11. 字符串模式匹配方法
    // match matchAll search
    // 字符串方法 match 的返回和正则的方法的 exec 的返回是一样的
    const strText = text;
    const strMatch = strText.match(/.at/);
    const regExec = /.at/.exec(strText);
    console.info(strMatch, regExec); // 得到一样的结果，是等价的

    // 另一个查找模式的字符串方法是 search
    const searched = strText.search(/.at/);
    // 接收的参数与 match 一样，正则字符串或者 RegExp 对象
    console.info(searched); // 0 返回查找到的索引位置
    // 如果查找不到，则返回 -1
    const posSearched = strText.search(/at/);
    const posUnSearched = strText.search(/dat/);
    console.info(posSearched, posUnSearched); // 1 -1

    // replace 替代方法，第一个参数可以是正则也可以是字符串
    // 使用字符串的时候，只能替换一个
    const replaceResultWithString = strText.replace('at', 'ond');
    // 使用正则并加上全局标记的时候，可以替换全部
    const replaceResultWithRegexp = strText.replace(/at/g, 'ond');
    console.info(replaceResultWithString, replaceResultWithRegexp);
    // bond, cat...
    // bond, cond...

    // 也可以使用全局方式来替换，不过参数也必须加上全局标志，否则会报错
    const replaceResultWithAllError = strText.replaceAll(/at/, 'ond');
    // TypeError: replaceAll must be called with a global RegExp
    const replaceResultWithAllRegexp = strText.replaceAll(/at/g, 'ond');
    const replaceResultWithAllString = strText.replaceAll('at', 'ond');
    console.info(replaceResultWithAllRegexp, replaceResultWithAllString); // bond, cond... 两者皆是输出这个

    // replace 的第二个参数,在传入字符串时可以使用变量来替换
    const replaceWith$ = strText.replace(/(.at)/g, 'word ($1)');
    console.info(replaceWith$); // "word(bat), word(cat)..."

    // replace 的第二个参数还可以是函数
    this.htmlEscape('<div class="greeting">Hello World</div>');
    // 输出转义过后的字符串，HTML 实体内容
    // "&lt;div class=&quot;greeting&quot;&gt;Hello World&lt;/div&gt;"

    // 分割字符串为数组的方法 split
    // 第一个参数可以是正则也可以是字符串，第二个参数限制了数字的长度
    const colorText = 'red,yellow,green,blue';
    const colors1 = colorText.split(',');
    const colors2 = colorText.split(',', 2);
    const colors3 = colorText.split('');
    const colors4 = colorText.split(/[^,]+/);
    console.info(colors1, colors2, colors3, colors4);
    // ["red", " yellow", " green", " blue"]
    // 第二个是告诉函数限制个数两个
    // 第三个相当于拆解字符串 ["r", "e", "d", ",", " ", "y", "e", "l", "l", "o", "w", ",", " ", "g", "r", "e", "e", "n", ",", " ", "b", "l", "u", "e"]
    // 第四个提取出了逗号，而且分隔符出现在了字符串头尾，也就是没有匹配到的内容，就是前后两个空格 ["", ",", ",", ",", ""]

    // 12. localeCompare() 方法
    // 比较两个字符串的字母表顺序
    const stringValue  = 'yellow';
    stringValue.localeCompare('blue'); // 1
    stringValue.localeCompare('yellow'); // 0
    stringValue.localeCompare('zoo'); // -1

    // 可以更加语义化输出
    this.determineOrder('yellow', 'zoo'); // The string (ye) comes before the string (zoo)
    this.determineOrder('yellow', 'blue'); // The string (ye) comes after the string (blue)
    this.determineOrder('yellow', 'yellow'); // The string (yellow) is equal to the string (yellow)

    // 13. HTML 方法

    // 5.4 单例内置对象
    // 5.4.1 Global
    // 全局的兜底对象 任何未声明的属性和方法都在这个全局对象之下
    // 1. URL 编码方法
    const mdnUrl = 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURI#%E8%BF%94%E5%9B%9E%E5%80%BC';
    const encode = encodeURI(mdnUrl);
    const encodeComponent = encodeURIComponent(mdnUrl);
    // 编码全部 URL 和编码部分的区别
    console.info(encode);
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURI#%25E8%25BF%2594%25E5%259B%259E%25E5%2580%25BC
    console.info(encodeComponent);
    // https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FdecodeURI%23%25E8%25BF%2594%25E5%259B%259E%25E5%2580%25BC

    // 解码也是类似的 因为匹配上了 所以下面两者返回相同的结果
    console.info(decodeURI(encode));
    console.info(decodeURIComponent(encodeComponent));
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURI#%E8%BF%94%E5%9B%9E%E5%80%BC

    // 通常情况下，使用 decodeURIComponent 这种较多

    // 2. eval() 方法
    // 直接提供了一个 ECMAScript 解析器，执行传入的字符串
    eval('console.info("abcd")');

    // 可以使用外部的变量，也可以提供变量给外部使用
    const evalStr = 'eval is eval';
    eval(console.info(evalStr)); // 'eval is eval'

    // 定义变量，在外部可以调用
    eval('function sayHi() { console.info("sayHi")}');
    sayHi();
    // 只是不会有声明提前，因为变量定义是在字符串执行期间才创建的

    // 严格模式下，则 eval 无法访问外部变量，在它里面定义的变量，外部也无法访问

    // 请小心使用，因为会有 XSS 攻击

    // 3. Global 对象属性
    // 兜底对象 涵盖各类方法和属性
    // Number, Object Date RegExp RangeError

    // 4. window 对象
    // window 本质上是 Global 对象在浏览器中的实现
    // 浏览器将 window 实现为 global 对象的代理
    var color = 'red';
    window.color === 'red'; // true

    // 可以通过这样的方式获取 global
    let global = (function() {
      return this;
    })();

    // 5.4.2 Math
    // 1. Math 对象属性
    // 主要用于保存数学汇总的一些特殊值
    // Math.PI
    // Math.E 自然对数的基数 e 的值

    // 2. min() 和 max() 方法
    // 接收多个参数，返回最大值或最小值
    const nums = [3, ,6,7,9,3,62, 26];
    // 如果有不是数字类型的，会返回 NaN
    Math.max(...nums);
    const nums1 = [3,'7','9',3,62, 26];
    // 如果可以隐式转成数字类型的，则可以正常执行
    Math.max(...nums1); // 62

    // 3. 舍入方法
    // 始终向上舍入最接近的整数
    Math.ceil(3.5); // 4
    // 向下取整
    Math.floor(3.5); // 3
    // 四舍五入
    Math.round(3.6); // 4
    // 返回数值最接近的单精度(32位)浮点值表示
    Math.fround(3.67); // 3.6700000762939453
    Math.fround(3); // 3

    // 4. random() 方法
    // 随机返回 [0, 1) 中的一个数字
    // 可以这样来实现随机取一个区间内的数字
    // [first_possible_value, total_number_of_choices)
    const randomNumber = this.generateRandom(32, 1); // 双色球的数字 不包括最大值
    // 在 1 到 32 之间选一个值
    this.selectFrom(1, 32); // 取双色球的数字 包括最大值

    // 利用上面的颜色字符串，可以随机区取颜色
    const colorsList = colors.slice(0);
    const pickedIndex = this.selectFrom(0, colorsList.length - 1);
    const pickedColor = colorsList[pickedIndex];
    console.info(pickedColor);

    // 5. 其他方法
    // Math.abs(x) 返回 x 的绝对值
    // Math.exp(x) 返回 Math.E 的 x 次幂
    // Math.log(x) 返回 x 的自然对数
    // Math.power(x, power) 返回 x 的 power 次幂

    // 5.5 小结
  }

  /**
   * 返回日期对象的原型，以供查看原型上的所有可用方法
   * @returns
   */
  consoleDateFunc(date) {
    return Object.getPrototypeOf(date);
  }

  /**
   * 获取一个非异步的函数的运行时间
   * @returns
   */
  getTiming() {
    const startTime = Date.now();

    cb && cb();

    const endTime = Date.now();

    return endTime - startTime;
  }

  /**
   * 转义 Html
   * @param {*} htmlStr
   * @returns
   */
  htmlEscape = (htmlStr) => {
    return htmlStr.replace(/[<>&"]/g, function (match, pos, originalText) {
      switch (match) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;'
        case '\"':
          return '&quot;'
        case '&':
          return '&amp;'
        default:
          return '';
      }
    })
  }

  /**
   * 比较两个字符串的字母表位置
   * @param {*} firstString
   * @param {*} secondString
   * @returns
   */
  determineOrder(firstString, secondString) {
    const result = firstString.localeCompare(secondString);
    if (result < 0) {
      return console.info(`The string (${firstString}) comes before the string (${secondString})`);
    }
    if (result > 0) {
      return console.info(`The string (${firstString}) comes after the string (${secondString})`);
    }
    return console.info(`The string (${firstString}) is equal to the string (${secondString})`);
  }

  /**
   * 生成随机数 不包括最大值
   * @param {*} total_number_of_choices 有多少个数
   * @param {*} first_possible_value 最小的数值
   * @returns
   */
  generateRandom(total_number_of_choices, first_possible_value) {
    return Math.floor(Math.random() * total_number_of_choices + first_possible_value);
  }

  /**
   * 生成随机数，包括最大值
   * @param {*} lowerValue
   * @param {*} upperValue
   * @returns
   */
  selectFrom(lowerValue, upperValue) {
    const total_number_of_choices = upperValue - lowerValue + 1;
    return Math.floor(Math.random() * total_number_of_choices + lowerValue);
  }
}
