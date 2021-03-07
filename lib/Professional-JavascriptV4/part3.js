/******** 《JavaScript 高级程序设计》(第4版) ********/
/******** 3、语言基础 ********/
export default class Part3LanguageBasic {
  constructor(){
    // 3.1 语法

    // 3.1.1 区分大小写

    // 3.1.2 标识符

    // 3.1.3 注释

    // 3.1.4 严格模式

    // 3.1.5 语句
    // 这里是推荐使用分号的，可以避免意外的错误

    // 3.2 关键字和保留字
    // ES6 中的关键字，以下是部分
    // break
    // do
    // new
    // super
    // void
    // this
    // throw
    // try

    // 严格模式下，还会有保留字（未来的关键字）
    // implements
    // package
    // public
    // static
    // let
    // interface
    // protected
    // private

    // 3.3 变量
    // 3.3.1 var 关键字
    // 1.var 声明的变量在函数作用域内生效
    // 2.var 声明提前
    this.varSth(); // undefined
    // 但不会报错，因为声明提前了
    // 等价于以下内容
    this.varSthEqual()

    // 3.3.2 let 声明
    // let 声明的变量在块级作用域内生效
    // 1.暂时性死区
    // 因为没有声明提前，因此提前使用变量会导致报错
    this.letSth(); // VM5337:2 Uncaught ReferenceError: Cannot access 'age' before initialization

    // 2.全局声明
    // let 在全局声明的变量不是 window 下的
    // 尽管它是全局的，但是不像 var 的表现一样，而且不能重复定义
    // 因此在全局已经声明过该变量后，需要注意不能重复定义

    // 3.条件声明
    this.renderLetWithConditions();

    // 其实 let 不能使用条件声明，因为它始终是块级作用域的
    this.renderLetWithIfConditions();

    // 4. for 循环中的 let 声明
    // 当使用原来的 var 来声明时， i 的值会透出
    this.makeAnUsualForLoop();

    // 使用 let 可以避免这个问题
    this.makeAnUsualForLoopUsingLet();

    // 经典的打印题， 因为 settimeout 的异步执行， 使用的是 var 声明的最后一个变量值， 导致输出的是 5 个 5
    // 输出 5 个 5
    this.makeAnUsualForLoopWithTimeout();

    // for 循环的每次循环都会保存 let 声明的变量值
    // timeout 引用的都是不同的变量实例
    // 输出 0，1，2，3，4
    this.makeAnUsualForLoopWithTimeoutUsingLet();

    // 3.3.3 const
    // const 的行为与 let 基本相同，唯一一个重要区别是首次声明的时候必须给变量初始化，
    // 而且不允许修改，修改时会报错
    // 不允许修改
    const hisAge = 28;
    hisAge = 27; // 报错

    // 不允许重复赋值
    const myAge = 28;
    const myAge = 27; // 报错

    // const 声明的作用域也是块
    const name = 'matt';
    if (true) {
      const name = 'Nico';
    }
    console.info(name); // matt

    // const 声明的限制是适用于它只想的变量的引用
    // 如果指向的是对象， 修改对象的属性并不违反限制

    // 使用循环的时候不能使用 const， 因为迭代变量会自增， 例如 ++i
    // 这里会报错
    this.makeAnUsualForLoopUsingConst();

    // 正确的使用， 因为不改变值， 所以不影响， 不会报错
    this.makeAnUsualForLoopUsingConstCorrectly();

    // 还可以用来获取对象的属性也就是 key 值， 在 for in 循环中
    // 输出 a, b
    this.makeAnUsualForInLoopUsingConst();

    // 还可以用来迭代数组， 在 for of 循环中
    // 输出 1， 2， 3， 4
    this.makeAnUsualForOfLoopUsingConst();

    // 3.3.4 声明风格及最佳实践
    // 1. 不使用 var
    // 2. const 优先， let 次之

    // 3.4 数据类型

    // 3.4.1 typeof 操作符
    // 可以返回以下类型
    // undefined
    // boolean
    // number
    // function
    // object
    // symbol
    // string

    // 3.4.2 undefined 类型
    // 只有一个值 undefined
    this.getASimpleExampleForUndefined();

    // 3.4.3 Null 类型
    // 只有一个值 null， 表示空对象指针， 因此 typeof null 会是 object
    let car = null;
    console.info(typeof car); // object

    console.info(undefined == null); // 表面相等

    this.getASimpleExampleForNull();

    // 3.4.4 Boolean 类型
    let found = true;
    let lost = false;

    // 注意是区分大小写的，所以 True 不是布尔值

    let message = 'hello world';
    let messageAsBoolean = Boolean(message); // 使用转型函数转换
    console.info(messageAsBoolean);

    // 3.4.5 Number 类型
    const intNum = 55; // 十进制整数

    // 八进制字面量在严格模式下是会报错的
    // 第一位必须是 0
    const octolNum1 = 070; // 八进制的 56
    // const octolNum2 = 079; // 无效的八进制值，解析为 79
    const octolNum3 = 08; // 无效的八进制值，解析为 8

    // 十六进制前两位必须是 0x
    const hexNum1 = 0x1f; // 十六进制的 31
    const hexNum2 = 0xA; // 十六进制的 10

    // 算术计算时，所有八进制和十六进制都会转换成十进制来计算

    // 1. 浮点数值
    // 浮点数值，就是该数值中必须包含一个小数点，并且小数点后面必须至少有一位数字
    const floatNum1 = 1.1;
    const floatNum2 = 0.1;
    const floatNum3 = .1; // 有效，但不推荐

    const floatNum4 = 1.; // 小数点后面没有数字——解析为 1
    const floatNum5 = 10.0; // 整数——解析为 10

    // 使用科学计数法表示
    const floatNum = 3.1415e5; // 表示 314150

    // 浮点数值的计算需要十分谨慎

    // 2. 数值范围
    // 最大的值和最小的值
    console.info(Number.MAX_VALUE, Number.MIN_VALUE);
    // 判断数值是不是有穷的
    const result = Number.MAX_VALUE + Number.MAX_VALUE;
    console.info(isFinite(result));
    // 这是 ECMAScript 所能表示的最大值和最小值

    // 3.NaN
    // NaN，即非数值(Not a Number)是一个特殊的数值，这个数值用于表示一个本来要返回数值的操作数未返回数值的情况(这样就不会抛出错误了)
    // 它不等于自身!
    console.info(NaN === NaN); // false

    // 可以通过隐式转换变成数字的就不是 NaN
    console.info(isNaN(NaN)); // true
    console.info(isNaN('10')); // false
    console.info(isNaN(10)); // false
    console.info(isNaN('blue')); // true
    console.info(isNaN(false)); // false

    // 4. 数值转换
    // 三个函数可以进行数值转换
    // Number(), parseInt(), parseFloat()
    // Number 可用于任何数据类型
    // 后两者则仅适用于把字符串转成数值
    Number(null); // 0
    Number(undefined); // NaN
    // 其余的就是以往记忆中的处理

    const num1 = Number("Hello world!"); // NaN
    const num2 = Number(""); // 0
    const num3 = Number("000011"); // 11
    const num4 = Number(true); // 1

    const numParseInt1 = parseInt("1234blue"); // 1234
    const numParseInt2 = parseInt(""); // NaN 注意这是和 Number 方法处理并不一样的地方
    const numParseInt3 = parseInt("0xA"); // 10
    const numParseInt4 = parseInt(22.5); // 22.5
    const numParseInt5 = parseInt("070"); // 70
    const numParseInt6 = parseInt("70"); // 70
    const numParseInt7 = parseInt("0xf"); // 15

    // 可以指定第二个参数来表示进制
    const numParseInt8 = parseInt('f', 16);
    const numParseInt9 = parseInt('f'); // NaN 不指定的话就会按原规则识别

    // parseFloat 只解析十进制
    const numParseFloat1 = parseFloat("1234blue"); // 1234
    const numParseFloat2 = parseFloat("0xA"); // 0
    const numParseFloat3 = parseFloat("22.5"); // 22.5
    const numParseFloat4 = parseFloat("22.34.5"); // 22.34
    const numParseFloat5 = parseFloat("0908.5"); // 908.5
    const numParseFloat6 = parseFloat("3.125e7"); // 31250000

    // 3.4.6 String 类型
    // 1. 字符字面量
    // \u 以十六进制表示的 unicode 字符

    // 2. 字符串的特点
    // 不可变，只可以重新赋值

    // 3. 转换为字符串
    // toString 方法
    let age = 11;
    age.toString(); // '11'

    // null 和 undefined 没有这个方法

    // String 方法其实就是调用 toString
    // 如果没有，就是 'null' 或者 'undefined'

    // 3.4.7 object 类型
    let o = new Object();
    let o1 = new Object; // 有效，但不推荐

    // 3.5 操作符

    // 3.5.1 一元操作符
    // 只能操作一个值的操作符，一元操作符
    // 1. 递增和递减操作符
    // 前置性递增
    let age1 = 28;
    ++age1;
    // 返回新值，同时变量改变

    // 后置型递减
    age1--;
    // 返回旧值，同时变量改变

    // 针对对象的特殊处理，会调用对象的 valueOf 方法
    let obj = {
      valueOf: function () {
        return -1;
      }
    }
    console.info(--obj); // -2

    // 2. 一元加和减操作符
    let obj1 = {
      valueOf: function () {
        return -1;
      }
    }
    obj1 = +obj1 // -1

    // 在对普通数值类型使用时，把数值变成正数
    // 可以用于基本的算术运算，也可以转换数据类型

    // 3.5.2 位运算符
    // 正数换成负数，就是把 1 和 0 互换，然后末尾加 1（包括进一位）

    // 1. 按位非
    const num11 = 25;
    const num22 = ~num11; // 26
    // 相当于是负数再减 1

    // 2. 按位与
    const num33 = 25;
    const num44 = 3;
    // 转换成 2 进制之后，只有同时满足 1 才返回 1
    const num55 = num33 & num44; // 1

    // 3. 按位或
    const num66 = num33 | num44; // 27

    // 4. 按位异或
    const num77 = num33 ^ num44; // 26
    // 01101
    // 00011
    // 01110

    // 5. 左移
    const oldValue = 2;
    const newValue = oldValue << 5; // 64

    // 6. 有符号的右移
    const oldValue2 = 64;
    const newValue2 = oldValue2 >> 5; // 2

    // 7. 无符号的右移
    const oldValue3 = 64;
    const newValue3 = oldValue3 >>> 5; // 2

    // 对负数来说就不一样了
    const oldValue4 = -64;
    const newValue4 = oldValue4 >>> 5; // 134217726
    // 无符号右移是以 0 来填充空位，而不是像有符号右移那 样以符号位的值来填充空位
    // 无符号右移操作符会把负数的二进制码当成正数的二进制码

    // 3.5.3 布尔操作符
    // 1.逻辑非
    // 2.逻辑与（短路操作符）
    // 逻辑与操作属于短路操作，即如果第一个操作数能够决定结果，那么就不会再对第二个操作数求值
    const found = true;
    const result = (found && someUndefinedVariable); // 这里会发生错误便不会再往下执行
    console.info(result);

    // 下面就不会发生错误
    const anotherFound = false;
    const result = (anotherFound && someUndefinedVariable);
    console.info(result);

    // 3.逻辑或(短路操作符)
    // 常用于设置备用值
    // const myObject = prefferedObject || backupObject;

    // 3.5.4 乘性操作符
    // 1. 乘法 *
    // 如果不是数字类型，就会先调用 Number 方法进行转换，再进行求值
    // 有一个数是 NaN， 那结果就是 NaN
    const nan1 = 78 * NaN; // NaN
    const nan2 = Infinity * 0; // NaN

    // 2. 除法 /
    // 注意以下几种情况
    const nan3 = NaN / 3; // NaN
    const nan4 = Infinity / Infinity; // NaN
    const nan5 = 0 / 0; // NaN

    // 3. 求模（余数） %
    // 注意以下几种情况
    const nan6 = Infinity % 2; // NaN
    const nan7 = 3 % 0; // NaN
    const nan8 = Infinity % Infinity; // NaN
    const nan9 = 9 % Infinity; // 9

    // 3.5.5 加性操作符
    // 1. 加法
    const sum1 = 1 + NaN; // NaN
    const sum2 = Infinity + Infinity; // Infinity
    const sum3 = Infinity + -Infinity // NaN
    const sum4 = 0 + 0; // 0
    const sum5 = 0 + -0; // 0
    const sum6 = -0 + -0; // -0

    // 如果其中含有对象，会优先调用 toString 方法
    // 加法操作符，类型转换的优先级是存在字符串的时候，会统一把另外的变量也转成字符串

    // 2. 减法
    const cut1 = 1 - NaN; // NaN
    const cut2 = Infinity - Infinity; // NaN
    const cut3 = -Infinity - -Infinity; // NaN
    const cut4 = Infinity - -Infinity; // Infinity
    const cut5 = -Infinity - Infinity; // -Infinity
    const cut6 = 0 - -0; // 0 这里存疑，实际运行结果与教材不符；这是实际运行结果
    const cut7 = -0 - 0; // -0
    const cut8 = -0 - -0; // 0

    // 如果不是数字类型，会先调用 Number 方法转成数字
    // 如果是对象类型，则会使用 valueOf 方法取得对象数值,如果没有，则会调用 toString 方法
    // 类型转换的优先级和加法是不一样的

    // 3.5.6 关系操作符
    // 字符串的比较是比较两者字符的编码
    // 如果含有对象，则先会使用 valueOf 方法取得对象数值,如果没有，则会调用 toString 方法
    // 字符串和数字的比较，会统一转成数字类型再比较
    // 如果转成数字之后变成 NaN，则无论另一边数字是什么，比较结果都返回 false
    // 任何数与 NaN 比较，都会返回 false
    const compare1 = "a" > 3; // false
    const compare2 = "a" < 3; // false

    // 3.5.7 相等操作符
    // 1. 相等和不相等
    // NaN 和任何类型的值都不相等，包括它自己
    const compareNaN = NaN == NaN; // false
    const compareNaN2 = NaN != NaN; // true

    // 如果含有对象，则先会使用 valueOf 方法取得对象数值,如果没有，则会调用 toString 方法

    // 2. 全等和不全等
    // 推荐使用

    // 3.5.8 条件操作符

    // 3.5.9 赋值操作符
    // 主要是简化操作，而不会有性能提升
    let assign = 1;
    assign += 4; // 6
    assign *= 6; // 30
    assign /= 2; // 15
    assign %= 4; // 3
    assign <<= 2; // 12
    assign >>= 3; // 1

    // 3.5.10 逗号操作符
    // 使用逗号操作符可以在一条语句内执行多个操作

    // 3.6 语句
    // 3.6.1 If 语句

    // 3.6.2 do while 语句
    // 后测试循环语句
    let iii = 0;
    do {
      iii++;
    } while (iii < 4)

    // 3.6.3 while 语句
    // 前测试循环语句
    while (iii === 4) {
      iii = 888;
    }

    // 3.6.4 for 语句
    // 前测试循环语句
    for (let iFor = 0; iFor < array.length; iFor++) {
      console.info(array[iFor]);
    }

    // 下面这个语句会造成死循环
    for (;;) {
      // do sth
    }

    // 3.6.5 for in 语句
    // 可以用来枚举对象的属性
    // 遍历的顺序是不可预测的 不同浏览器间会有差异
    this.makeAForInLoop(window);

    // 3.6.6 label 语句
    start: for (let index = 0; index < array.length; index++) {
      const element = array[index];
      console.info(element)
    }
    // start 可以后续拿来使用 被 break 或 continue 所使用

    // 3.6.7 break 和 continue 语句
    // 使用 break 会导致循环即刻停止
    this.makeAForLoopWithBreak(10, 5);
    // 使用 continue 会跳过当前的循环
    this.makeAForLoopWithContinue(10, 5)

    // 结合 label 使用
    this.makeAForLoopWithBreakAndLabel(10, 10, 5); // 55
    this.makeAForLoopWithContinueAndLabel(10, 10, 5); // 95

    // 3.6.8 with 语句
    // 不推荐使用，大量使用会导致性能问题

    // 3.6.9 switch 语句
    // switch 在比较的时候使用的是全等操作符
    // 而且不限制数据类型

    // 3.7 函数
    // 推荐做法是让函数始终拥有返回值，或者始终不返回；否则会给调试带来麻烦

    // 3.7.1 理解参数
    // 函数的参数是类数组对象，所以不限制参数个数，并且也不限制参数的数据类型
    this.howManyArgs(1, 2, 3); // 3
    this.howManyArgs(); // 0

    // 利用参数的特性，可以做到针对不同参数个数，处理的方式是不一样
    this.doAdd(1); // 11
    this.doAdd(2, 3); // 5

    // 不管第二个参数输入什么，都会变成修改的后的值
    this.doAnotherAdd(1, 2); // 11

    // 3.7.2 没有重载
    // ECMAScript 没有重载，但是可以像上面一样进行模拟
  }

  varSth() {
    console.info(age);
    var age = 28;
  }

  varSthEqual() {
    var age;
    console.info(age);
    age = 28;
  }

  letSth() {
    console.info(age);
    let age = 28;
  }

  /**
   * 遍历对象
   * @param {*} obj
   */
  makeAForInLoop(obj) {
    for (const propName in obj) {
      if (Object.hasOwnProperty.call(obj, propName)) {
        console.info(propName)
      }
    }
  }

  /**
   * 到第一个可以除尽的数就停止
   * @param {number} count
   * @param {number} num
   */
  makeAForLoopWithBreak(count = 0, num = 1) {
    for (let index = 0; index < count; index++) {
      if (index % num === 0) {
        break;
      }
    }
  }

  /**
   * 到可以除尽的数就跳过
   * @param {number} count
   * @param {number} num
   */
  makeAForLoopWithContinue(count = 0, num = 1) {
    for (let index = 0; index < count; index++) {
      if (index % num === 0) {
        continue;
      }
    }
  }

  /**
   * 运行到指定条件停止
   * @param {number} iMax
   * @param {number} jMax
   * @param {number} breakNum
   * @returns
   */
  makeAForLoopWithBreakAndLabel(iMax = 1, jMax = 1, breakNum = 1) {
    let num = 0;
    getMiddleCount:
    for (let i = 0; i < iMax; i++) {
      for (let j = 0; j < jMax; j++) {
        if (j === breakNum && i === breakNum) {
          break getMiddleCount;
        }
        num++;
      }
    }
    return num;
  }

  /**
   * 运行到指定条件就跳过
   * @param {number} iMax
   * @param {number} jMax
   * @param {number} continueNum
   * @returns
   */
  makeAForLoopWithContinueAndLabel(iMax = 1, jMax = 1, continueNum = 1) {
    let num = 0;
    getMiddleCount:
    for (let i = 0; i < iMax; i++) {
      for (let j = 0; j < jMax; j++) {
        if (j === continueNum && i === continueNum) {
          continue getMiddleCount;
        }
        num++;
      }
    }
    return num;
  }

  /**
   * 返回函数的参数个数
   * @returns
   */
  howManyArgs() {
    return arguments.length;
  }

  /**
   * 类似于重载参数
   * @returns
   */
  doAdd() {
    if (arguments.length === 1) {
      return arguments[0] + 10
    } else if (arguments.length === 2) {
      return arguments[0] + arguments[1];
    }
  }

  /**
   * 修改形参的值
   * @param {*} num1
   * @param {*} num2
   */
  doAnotherAdd(num1, num2) {
    arguments[1] = 10;
    console.info(arguments[0] + num2);
  }
}
