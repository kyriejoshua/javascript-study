/******** 《JavaScript 高级程序设计》(第4版) ********/
/******** 4、变量、作用域和内存问题 ********/
/******** 此章节电子版和书籍略有出入  ********/

export default class Part4Variable {
  constructor(){
    // 4.1 基本类型和引用类型的值
    // JavaScript 不允许直接访问内存中的位置， 也就是说不能直接操作对象的内存空间。
    // 在操作对象时，实际上是在操作对象的引用而不是实际的对象。 为此，引用类型的值是按引用访问的。

    // 4.1.1 动态的属性
    let obj1 = new Object();
    obj1.name = 'Nico';
    console.info(obj1);

    // 4.1.2 复制变量的值
    // 在从一个变量向另一个变量复制基本类型值和引用类型值时，也存在不同

    // 4.1.3 传递参数
    // ECMAScript 中所有函数的参数都是按值传递的
    let person1 = new Object();
    this.setName(person1);
    console.info(person1); // Nico
    // 这里在 setName 内部新建的对象是局部变量，和外部传入的参数指向不同的引用对象

    // 4.1.4 检测类型
    // 检测基本的数据类型时，可以使用 typeof
    // 检测实例，则可以使用 instanceof

    // 4.2 执行环境和作用域
    // 两个案例
    this.changeColor();
    this.changeAnotherColor();

    // 4.2.1 延长作用域链
    // 使用 with

    // 4.2.2 变量声明
    // 1. 使用 var 的函数作用域声明
    this.getColor();

    // 2. 使用 let 的块级作用域声明
    this.getLetColor();

    // 3. 使用 const 的块级作用域声明

    // 4. 查询标识符

    // 4.3 垃圾收集
    // 4.3.1 标记清理
    // 4.3.2 引用计数
    // 4.3.3 性能问题
    // 4.3.4 管理内存
    this.clearGarbageManually();

  }

  /**
   * 最终输出的 obj 和参数不是同一个引用对象
   * @param {object} obj
   */
  setName(obj) {
    obj.name = 'Nico';
    obj = new Object();
    obj.name = 'ccc';
  }


  /**
   * 沿着作用域链向上查找
   * @returns
   */
  changeColor() {
    var color = 'blue';
    function changeGlobalColor () {
      color = color === 'blue' ? 'red' : 'blue';
      return color;
    }
    return changeGlobalColor();
  }

  /**
   * 作用域链的展示
   * @returns
   */
  changeAnotherColor() {
    var color = 'blue';
    function changeGlobalColor() {
      var anotherColor = 'red';
      function swapColor() {
        var tempColor = anotherColor;
        anotherColor = color;
        color = tempColor;
        console.info(tempColor, anotherColor, color);
      }
      return swapColor();
    }
    return changeGlobalColor;
  }

  /**
   * 可以获取到函数外部的
   * @returns
   */
  getColor() {
    var color = 'blue';
    function getVarColor() {
      return color;
    }
    return getVarColor();
  }

  /**
   * 块级作用域的影响
   * @returns
   */
  getLetColor() {
    let color = 'blue';
    function getLetColor() {
      let color = 'red';
      {
        let color = 'green';
        return color;
      }
    }
    return getLetColor();
  }

  /**
   * 手动解除引用的示例
   */
  clearGarbageManually() {
    function createPerson() {
      let person = new Object();
      person.name = 'Nico';
      return person;
    }
    let aPerson = createPerson();
    // 手动解除引用
    aPerson = null;
  }
}
