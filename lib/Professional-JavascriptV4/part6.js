/******** 《JavaScript 高级程序设计》(第4版) ********/
/******** 6、 集合引用类型 136-182 ********/
// 对应第六章内容

export default class Part6SetReferenceType {
  constructor(){
    // 6.1 Object 类型
    // 把对象字面量作为参数,来应对有多个可选参数的情况
    this.displayInfo({
      name: 'nico',
      age: 29
    });

    // 6.2 Array 类型
    // 6.2.1 创建数组
    // 不同类型的数值作为参数传给构造函数，会得到不同的结果
    const arr1 = new Array(1); // [,] // length 1
    const arr2 = new Array('Greg'); // ['greg']

    // from 和 of
    // from 把类数组结构转为数组结构
    // of 把参数转为数组实例

    // 可以这么玩
    const strArr = Array.from('Matt'); // [M, a, t, t]
    // 对上面的数组进行浅复制
    const arr2copy = Array.from(arr2);

    this.getArgsArray();

    // 看起来没什么用的 of
    const arr3 = Array.of(1, 2, 3, 4);

    // 用 of 达到和上面类似的效果
    this.getArguments();
    // 错误示范
    this.getArgumentsByOfError();
    // 正确示范
    this.getArgumentsByOf();

    // 6.2.2 数组空位
    const emptyArr = [,,,];
    const emptyArr1 = Array.from(emptyArr);
    const emptyArr2 = Array.of(...emptyArr);
    // 以上都是数组空位 会变成 undefined
    // es6 的迭代方法和以前的方法略有不同，在遍历的时候体现出差异，行为不一致
    // 早期的方法可能会忽略这些 undefined 所以不推荐这样写

    // 6.2.3 数组索引
    // 可以通过修过数组的索引来修改数组本身
    let indexArr = [1, 2, 3, 4];
    // 末尾新增
    indexArr[4] = 5; // [1, 2, 3, 4, 5]
    // 截取部分
    indexArr.length = 3; // [1, 2, 3]

    // 无限添加末尾的元素 直到满足相应条件
    const arr100 = this.addArrByLength();

    // 6.2.4 检测数组
    // 如果只有一个上下文环境，可以使用 instanceOf
    // 更加普适的方法
    Array.isArray(arr100);

    // 6.2.5 迭代器方法
    // keys entries values
    const a = ['foo', 'bar', 'qux', 'baz'];
    const aKeys = Array.from(a.keys()); // [0, 1, 2, 3]
    const aValues = Array.from(a.values()); // ['foo', 'bar', 'qux', 'baz']
    const aEntries = Array.from(a.entries()); // 键值对的形式 [[0, 'foo'], [1, 'bar']] 这样
    // 以上方法即使在现代浏览器中也会有少部分兼容问题
    // 遍历拿到数组的键值对
    this.iterateArrByEntries(arr100);

    // 6.2.6 复制和填充方法
    // copyWithin fill
    let zeros = [0, 0, 0, 0, 0];
    zeros.fill(5); // [5,5,5,5,5]

    // 重置
    zeros.fill(0);
    zeros.fill('go'); // ['go', 'go', 'go', 'go', 'go']

    // 设定索引开始位置,不设定索引结束位置
    zeros.fill(4, 3); // [0,0,0,4,4]
    zeros.fill(0);

    // 设定索引开始位置和结束位置，结束位置的索引是不包含的
    zeros.fill(2, 1, 3); // [0,2,2,0,0]
    zeros.fill(0);

    // 设定负的索引开始和结束位置
    zeros.fill(3, -4, -1); // [0,3,3,3,0]

    // copyWithin 从第一个参数开始复制当前数组，返回新数组，会改变当前数组
    // 这里等于没操作，复制本身到第一个位置，等于没复制
    zeros.copyWithin();
    // 从第五个位置开始浅拷贝，超出当前数组的长度，等于没有复制
    zeros.copyWithin(5);
    // 从第2个位置开始浅拷贝
    zeros.copyWithin(2);

    let ints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    // 从第五个位置开始插入数组起始的内容
    ints.copyWithin(5); // [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
    // 从第五个位置开始插入，插入的内容是第2-3个位置，不包括结尾索引
    ints.copyWithin(5, 2, 3); // [0, 1, 2, 3, 4, 2, 6, 7, 8, 9]
    // 从第五个位置开始插入，插入的内容是第2-8个位置，不包括结尾索引
    ints.copyWithin(5, 2, 8); // [0, 1, 2, 3, 4, 2, 3, 4, 5, 6]

    // 6.2.7 转换方法
    let colors = ['red', 'green', 'yellow'];
    colors.toString(); // "red,green,yellow"
    colors.valueOf(); // ['red', 'green', 'yellow']
    // toLocaleString 会调用数组中每一个元素的 toLocaleString 方法

    const person1 = {
      toString() {
        return 'Kiko'
      },
      toLocaleString() {
        return 'Nico'
      },
    }

    const person2 = {
      toString() {
        return 'Kikok'
      },
      toLocaleString() {
        return 'Nicon'
      },
    }

    const persons = [person1, person2];
    persons.toString(); // Kiko, Kikok
    persons.toLocaleString(); // Nico, Nicon

    // 如果数组中某一项是 null 或者 undefined，那么调用 join， toLocaleString，toString 和 valueOf 的时候都会表示成字符串

    // 6.2.8 栈方法
    // LILO 后进先出
    // pop push

    // 6.2.9 队列方法
    // FIFO 先进先出
    // shift push

    // 6.2.10 排序方法
    // reverse sort
    // reverse 是直接反序
    // sort 默认给元素调用 String 方法转成字符串，然后比较字符串大小
    const arrSort = [1, 2, 3, 4, 5,];
    arrSort.sort(this.compare)
    arrSort.reverse().sort(this.compare);
    // 这两个函数返回的都是当前数组的引用，意味这直接修改返回值，可能会修改到原数组
    // 简化的写法
    arrSort.sort(this.miniCompare);

    // 如果数组的元素都是数值，则可以用更简化的写法
    arrSort.sort(this.miniCompare2);

    // 6.2.11 操作方法
    // concat 会将一层数组内容打平
    const colors1 = ['red'];
    const colors2 = ['yellow', 'grey'];
    const colors3 = ['green'];
    colors1.concat('black', colors2, [colors3]); // ["red","black","yellow","grey",["green"]]

    let newColors = ['brown', 'black'];
    let moreNewColors = {
      [Symbol.isConcatSpreadable]: true,
      length: 2,
      0: 'pink',
      1: 'blue'
    };
    newColors[Symbol.isConcatSpreadable] = false;
    // 强制不打平数组
    colors1.concat(newColors, 'lightgreen');
    // 强制打平类数组对象
    colors1.concat(moreNewColors);
    // 如果把类数组对象的属性设置为 true， 那么组合进数组的会是原来的对象
    // concat 返回浅拷贝的新数组，不影响原数组

    // slice,
    // slice 返回也是浅拷贝的新数组，不影响原数组
    (function (colors = ['red', 'green', 'blue', 'yellow', 'purple']) {
      // 从第一个开始截取数组
      let colors1 = colors.slice(1); // ['green', 'blue', 'yellow', 'purple'];
      // 从第一个开始截取数组到第四个位置结束，不包括第四个
      let colors2 = colors.slice(1, 4); // ['green', 'blue', 'yellow', ];
    })();

    // splice 主要是为了在数组中间插入元素，不过也可以实现删除元素
    // 也可以替换元素，它会返回被替换的元素或者被删除的元素
    (function (colors = ['red', 'green', 'blue', 'yellow', 'purple']) {
      // 删除前两个元素， 不传入第三个之后的参数即可 它会以数组形式返回已删除的内容
      let removedColors = colors.splice(0, 2); // ['red', 'green',]
      console.info(removedColors, colors);  // ['blue', 'yellow', 'purple'];
      // 把刚才删掉的在第 1 个位置接进去
      let colors2 = colors.splice(1, 0, ...removedColors); // ['blue', 'red', 'green', 'yellow', 'purple'];
      console.info(colors, colors2);
      // 替换最后一个位置的元素
      let replacedColors = colors.splice(4, 1, 'pink');
      console.info(colors, replacedColors); // ['blue', 'red', 'green', 'yellow', 'pink']; ['purple']
    })();

    // 6.2.12 搜索和位置方法
    // 1. 严格相等
    // indexOf lastIndexOf
    // includes 是 ES 7 的
    const numbers = [1, 2, 3, 4, 5, 6, 7];
    numbers.indexOf(4); // 3
    numbers.lastIndexOf(4); // 4
    numbers.includes(4); // true

    const normalPerson = { name: 'nico' };
    const people = [normalPerson];
    const anotherPerson = [{ name: 'nico' }];
    const morePeople = [people];
    people.indexOf(person); // 0
    anotherPerson.indexOf(person); // -1
    morePeople.includes(person); // false
    morePeople.includes(people); // true

    // 2. 断言函数
    // find findIndex 使用了断言函数
    // 从最小索引开始，返回第一个匹配元素或它的索引
    // 他们的第二个参数不常用，但可以用来替代断言函数里 callback 的 this
    this.useFindWithSecondArgument(numbers, person);


    // 6.2.13 迭代方法
    // 五个迭代方法 这些方法都不改变调用它们的数组
    // some/every/forEach/map/filter
    // every 就像是 或与非中的 与
    // some 就像是或与非中的 或，也可以称之为逻辑短路
    // filter 返回过滤后的数组

    // 6.2.14 归并方法
    // reduce reduceRight
    // 可以用于累加器
    numbers.reduce((prev, cur) => prev + cur); // 28
    // 这种场景下没有什么区别
    numbers.reduceRight((prev, cur) => prev + cur); // 28
    // 传入一个初始值的场景
    numbers.reduce((prev, cur) => prev + cur, 2); // 30

    // 6.3 定型数组 (这里仅作了解，多用于 webgl)
    // 6.3.1 历史
    // 6.3.2 ArrayBuffer
    // 6.3.3 DataView
    // 6.3.4 定型数组

    // 6.4 Map
    // 新的集合类型,实现了真正的键值对存储机制

    // 6.4.1 基本 API
    // 以下列举了几种初始化的方式

    // 创建一个空映射
    const m = new Map();
    console.info(m);

    // 传入可迭代对象用来初始化
    const m1 = new Map([
      ['key1', 'val1'],
      ['key2', 'val2'],
      ['key3', 'val3'],
    ]);
    console.info(m1.size);

    // 使用自定义迭代器来初始化
    const m2 = new Map({
      [Symbol.iterator]: function* (){
        yield ['key1', 'val1'];
        yield ['key2', 'val2'];
        yield ['key3', 'val3'];
      }
    });
    // 得到和上述类似的值
    console.info(m2, m2.size);

    // 这样也行 只是映射的值是空的
    const m3 = new Map([
      []
    ]);
    m3.has(undefined); // true
    m3.get(undefined); // undefined
    m3.size; // 1, 注意这里不是 0 哦

    // 接下来是对初始化之后的变量进行操作
    m3.set('key1', 'value1');
    m3.get('key1'); // value1
    m3.delete('key1'); // true 返回布尔值

    m2.clear(); // 清空所有属性
    console.info(m2.size);

    // 可以用 has 方法判断是否包含这个键
    m2.has('key1'); // false 因为被清除，所以没有了
    m1.has('key1'); // true 还在

    // Object 只能用数值，字符串或者符号作为键
    // Map 可以使用任意数据类型作为键
    const booleanKey = false;
    const functionKey = function () {}
    const objectKey = new Object();
    const symbolKey = Symbol();

    m3.set(false, 123); // 正常
    m3.set(booleanKey, false);
    m3.set(objectKey, { obj: true });
    m3.set(symbolKey, Symbol());
    m3.set(functionKey, function() {});

    // 这些都可以获取到
    m3.get(booleanKey);
    m3.get(objectKey);
    m3.get(symbolKey);
    m3.get(functionKey);

    // 改变键的属性，不影响键的取值
    objectKey.key = 'key';
    m3.get(objectKey); // { obj: true }

    // 下面是更详细的案例
    const m4 = new Map();
    const objKey = {};
    const objVal = {};
    const arrKey = [];
    const arrVal = [];

    m4.set(objKey, objVal);
    m4.set(arrKey, arrVal);
    objKey.foo = 'foo';
    objVal.bar = 'bar';
    arrKey.push('foo');
    arrVal.push('bar');

    m4.get(objKey); // {bar: "bar"}
    m4.get(arrKey); // ["bar"]

    // 但也有一些意外情况
    const m5 = new Map();
    const nan1 = 0 / "";
    const nan2 = 0 / "";
    const pz = +0;
    const nz = -0;
    console.info(nan1 === nan2); // false
    console.info(pz === nz); // true

    // 下面是具体的怪异的表现
    m5.set(nan1, 'NaN');
    m5.get(nan2); // NaN
    m5.set(pz, 'bar');
    m5.get(nz); // bar

    // 这两者都能取到值

    // 6.4.2 顺序与迭代
    // 与 Object 不同， Map 会记住插入键值对的顺序
    // 可以获取迭代器
    console.info(m3.entries() === m3[Symbol.iterator]);
    for (let pair of m3.entries()) {
      console.info(pair); // key value 的形式返回
    }
    // 和上面是一样的效果
    for (const pair of m3[Symbol.iterator]) {
      console.info(pair); // key value 的形式返回
    }
    // 可以直接转成数组
    const a3 = [...m3];
    // a3 是二维数组

    // 也可以遍历，但是注意这里的参数是 value 在前
    m1.forEach((value, key) => {
      console.info(`${key} => ${value}`)
    });

    // 遍历所有键
    for (const keys of m3.keys()) {
      console.info(keys);
    }

    // 遍历所有值
    for (const value of m3.values()) {
      console.info(value);
    }

    // 键和值在迭代器遍历时是可以修改的
    // 作为键的字符串原始值是不能修改的
    const m6 = new Map([[
      'key1', 'val1'
    ]]);
    for (let key of m6.keys()) {
      key = 'key2';
      console.info(key, m6.get('key1'));
    }
    // 作为键的对象修改了属性不影响取值
    const m7 = new Map([[
      {id: 1}, 'val1'
    ]]);
    for (let key of m7.keys()) {
      key.id = 'key1';
      console.info(key, m7.get(key));
    }
    // 下面是修改值的案例-值为对象
    const m8 = new Map([[
       'key1', {id: 1},
    ]]);
    for (let val of m8.values()) {
      val.id = 'val';
      console.info(val, m8.get('key1'));
    }
    m8.get('key1');

    // 下面是修改值的案例-值为字符串
    // 字符串无法修改，这里尽管修改了，也没有改变原始值
    const m9 = new Map([[
       'key1', 'val1',
    ]]);
    for (let val of m9.values()) {
      val = 'val2';
      console.info(val, m9.get('key1'));
    }
    m9.get('key1');

    // 6.4.3 选择 Map 还是 Object
    // 大多数时候，这只是个人偏好的问题
    // 但在关注性能和内存的时候，对象和映射就会有显著的区别
    // 1.内存占用
    // 不同浏览器表现不同，但给定固定大小的内存，Map 可以比 Object 存储多 50% 的键值对
    // 2.插入性能
    // Map 稍好一些
    // 3.查找速度
    // 涉及到大量属性查找时， Object 会较好一些
    // 4.删除性能
    // Map 的删除更好， Object 的 delete 饱受诟病

    // 6.5 WeakMap 弱映射
    // 6.5.1 基本 API
    const wm = new WeakMap();
    // 弱映射的键只能是 object

    const wmKey1 = { key1: 'key1' };
    const wm1 = new WeakMap([[
      wmKey1, 'val1'
    ]]);
    console.info(wm1, wm1.get(wmKey1));

    // 如果传入了无效键就会报错 ?
    // 在 chrome 下不会报错，只是不生效
    const wm2 = new WeakMap([[
      wmKey1, 'val1',
      'key2', 'val2'
    ]]);
    console.info(wm1, wm1.get(wmKey1));

    // 字符串可以通过包装之后来作为键
    const stringKey = new String('key2');
    const wm3 = new WeakMap([
      [wmKey1, 'val1'],
      [stringKey, 'val2']
    ]);
    console.info(stringKey, wm3);

    // 弱映射同样可以使用 get set delete 方法
    // set 方法返回当前的实例
    const wm4 = new WeakMap().set({ key1:'key1' }, 'val1').set({ key2: 'key2' }, 'val2');
    console.info(wm4);
    infoWm4 = [
      {
          "key": {
              "key2": "key2"
          },
          "value": "val2"
      },
      {
          "key": {
              "key1": "key1"
          },
          "value": "val1"
      }
    ];

    // 6.5.2 弱键
    const wm5 = new WeakMap();
    wm5.set({}, 'weak');
    // 实际上取不到这个值了
    wm5.get({}); // undefined

    const wm6 = new WeakMap();
    const container = { key: {} };
    wm6.set(container.key, 'weak');
    wm6.get(container.key); // weak
    function removeMapReference () {
      container.key = null;
    }
    removeMapReference();
    wm6.get(container.key); // undefined

    // 6.5.3 不可迭代键
    // 弱映射不可以迭代 也没有 clear 方法
    // 限制了对象作为键，是为了保证只有通过键对象的引用才能取得值

    // 6.5.4 使用弱映射
    // 1.私有变量
    // 见下面的 class
    const user = this.createPrivateVariableByWeakMap(123);
    user.getId(); // 123
    user.setId('sdkjhf');
    user.getId(); // 'sdkjhf'

    // 使用闭包的方更加安全，保证了私有性
    // 不过上面的方式也可，没有暴露在全局，而是在方法内
    const User = (() => {
      const wm = new WeakMap();
      class User {
        constructor(id) {
          this.idProperty = Symbol('id');
          this.setId(id);
        }
        setPrivate(property, value) {
          const privateMembers = wm.get(this) || {};
          privateMembers[property] = value;
          wm.set(this, privateMembers)
        }

        getPrivate(property) {
          return wm.get(this)[property];
        }

        setId(id) {
          this.setPrivate(this.idProperty, id);
        }

        getId() {
          return this.getPrivate(this.idProperty);
        }
      }

      return User;
    })();
    const anotherUser = new User(123);
    anotherUser.getId(); // 123
    anotherUser.setId('sdkjhf');
    anotherUser.getId(); // 'sdkjhf'

    // 2.DOM节点元数据
    const domM = new Map();
    const domWm = new WeakMap();
    const loginBtn = document.body.querySelector('#loginBtn');
    // 如果该按钮从页面上删除了，这里仍然会保留引用，从而占用内存，因此更好的方式是采用弱映射
    domM.set(loginBtn, { disabled: true });
    // 弱映射的方式，节点删除后，就可以释放内存
    domWm.set(loginBtn, { disabled: true });

    // 6.6 Set
    // 集合类型
    // 6.6.1 基本 API
    // 使用数组初始化集合
    const s1 = new Set(['val1', 'val2', 'val3']);
    s1.size; // 3

    const s2 = new Set({
      [Symbol.iterator]: function* () {
        yield "val1";
        yield "val2";
        yield "val3";
      }
    });
    s2.size; // 3
    // 使用 add 新增，使用 has 查询，还有 delete 和 clear 方法
    const s = new Set();
    s.has('Matt'); // false
    s.size; // 0
    s.add('Matt').add('age');
    s.size; // 2
    s.delete('Matt');
    s.size; // 1
    s.has('Matt'); // false
    s.has('age'); // true
    s.clear();
    s.size; // 0

    // add 方法返回当前的实例，所以可以链式调用

    // Set 可以使用任意数据类型
    const s3 = new Set();
    const functionVal = function() {};
    const symbolVal = Symbol();
    const objectVal = new Object();

    s3.add(functionVal).add(symbolVal).add(objectVal);
    s3.has(functionVal); // true
    s3.has(symbolVal); // true
    s3.has(objectVal); // true

    objectVal.key = 'key';
    // 修改属性而不修改引用，仍然是不会改变的
    s3.has(objectVal); // true
    const arrVal = [];
    s3.add(arrVal);
    arrVal.push('val');
    s3.has(arrVal);

    // delete 和 add 是幂等的，也返回一个布尔值说明是否存在要删除的值
    s3.delete(1); // false
    s3.delete(arrVal); // true

    // 6.6.2 顺序与迭代
    // Set 会维护值插入时的顺序，支持按顺序迭代
    // values 和 keys 是一个方法，keys 相当于别名
    s1.values === s1[Symbol.iterator];
    s1.keys === s1[Symbol.iterator];
    s1.keys === s1.values;

    // 下面两者打印出的是一样的结果
    for (const iterator of s3.values()) {
      console.info(iterator);
    }

    for (const iterator of s3[Symbol.iterator]()) {
      console.info(iterator);
    }
    // 也可以使用 entries， 不过得到的结果是两个重复的值组成的数组
    for (const iterator of s3.entries()) {
      console.info(iterator);
    }

    // 可以直接转为数组
    console.info([...s1]);
    // 得到和 entries 类似的结果
    s1.forEach((value, value2) => {
      console.info(value, value2);
    });

    // 遍历时改变的值，不影响原有值
    for (let val of s3.values()) {
      val = 'newVal';
      console.info(val, s3);
    }

    // 修改对象的属性而不改变引用，则仍然存在
    const s4 = new Set([{ id: 123 }]);
    for (let val of s4.values()) {
      val.id = 456;
      console.info(val,  s4.has(val)); // true;
    }

    // 6.6.3 定义正式集合操作
    // TODO 有点超纲 暂不理解
    this.createXSet();

    // 6.7 WeakSet 弱集合
    // 6.7.1 基本 API
    const ws = new WeakSet();

    // 弱集合中的值只能是 object 类型或继承自 object 类型的值
    const objWs = { id: 1 };
    const ws1 = new WeakSet([objWs]);
    ws1.has(objWs); // true

    // WeakSet 同样可以使用 add, delete has 等方法
    // 6.7.2 弱值
    const ws2 = new WeakSet();
    const containerSet = {
      val: {}
    };
    ws2.add(containerSet.val);

    /**
     * 解除引用
     */
    function removeSetReference() {
      containerSet.val = null;
    }

    ws2.has(containerSet.val); // true
    removeSetReference();
    ws2.has(containerSet.val); // false

    // 6.7.3 不可迭代值
    // 弱集合不可迭代，同样也没有 clear 方法

    // 6.7.4 使用弱集合
    const disabledElements = new Set();
    const loginBtn2 = document.querySelector('#loginBtn2');

    // 引用仍然保留
    disabledElements.add(loginBtn2);

    const weakDisabledElements = new WeakSet();
    const loginBtn3 = document.querySelector('#loginBtn3');

    // 引用在 dom 节点不存在时不会保留
    weakDisabledElements.add(loginBtn3);

    // 6.8 迭代与扩展操作
    // 以下四种原生集合类型定义了默认迭代器
    // Array 定型数组 Map Set
    // 意味着这几种类型都支持顺序迭代，都可以传入 for of 循环
    const iterableThings = [
      Array.of(1, 2),
      typedArr = Int16Array.of(3, 4),
      new Map([[5, 6], [7, 8]]),
      new Set([9, 10])
    ];
    for (const iteratorThing of iterableThings) {
      for (const x of iteratorThing) {
          console.info(x)
      }
    }
    // 1, 2, 3, 4, [5, 6], [7, 8], 9, 10

    // 所有这些类型也都兼容扩展操作符
    const arrCopy1 = [1, 2, 3];
    const arrCopy2 = [...arrCopy1];
    // 内容一样，但是不相等
    arrCopy1 === arrCopy2; // false

    const mapCopy1 = new Map([[1, 2], [3, 4]]);
    const mapCopy2 = new Map(mapCopy1);
    // 内容一样，但是不相等
    mapCopy1 === mapCopy2; // false

    // 把数组复制到定型数组
    const typedArrFromArr1 = Int16Array.of(...arrCopy1);
    const typedArrFromArr2 = Int16Array.from(arrCopy1);

    // 把数组复制到映射
    const mapCopyFromArr = new Map(arrCopy1.map((x) => [x, 'val ' + x]));

    // 把数组复制到集合
    const setCopyFromArr = new Set(typedArrFromArr1);

    // 把集合复制回数组
    const arrCopyFromSet = [...setCopyFromArr];
    console.info(typedArrFromArr1, typedArrFromArr2, mapCopyFromArr, setCopyFromArr, arrCopyFromSet);
  }

  /**
   * TODO 需要消化一下该方法
   * @returns
   */
  createXSet = () => {
    class XSet extends Set {
      isSuperXSet(set) {
        return XSet.isSuperXSet(this, set);
      }

      union(...sets) {
        return XSet.union(this, ...sets);
      }

      intersection(...sets) {
        return XSet.intersection(this, ...sets);
      }

      difference(set) {
        return XSet.difference(this, set);
      }

      symmetricDifference(set) {
        return XSet.symmetricDifference(this, set);
      }

      cartesianProduct(set) {
        return XSet.cartesianProduct(this, set);
      }

      powerSet() {
        return XSet.powerSet(this);
      }

      /**
       * 是否是另一个的子集
       * @param setA
       * @param setB
       * @returns
       */
      static isSuperXSet(setA, setB) {
        for (const val of setA) {
          if (!setB.has(val)) {
            return false;
          }
        }
        return true;
      }

      /**
       * 返回两个或更多集合的并集
       * @param {*} a
       * @param  {...any} bSets
       */
      static union(a, ...bSets) {
        const unionSet = new XSet(a);
        for (const b of bSets) {
          for (const bValue of b) {
            unionSet.add(bValue);
          }
        }
        return unionSet;
      }

      /**
       * 返回两个或更多集合的交集
       * @param {*} a
       * @param  {...any} bSets
       */
      static intersection(a, ...bSets) {
        const intersectionSet = new XSet(a);
        for (const aValue of intersectionSet) {
          for (const b of bSets) {
            if (!b.has(aValue)) {
              intersectionSet.delete(aValue);
            }
          }
        }
        return intersectionSet;
      }

      /**
       * 返回两个集合的差集
       * @param {*} a
       * @param {*} b
       * @returns
       */
      static difference(a, b) {
        const differenceSet = new XSet(a);
        for (const bValue of b) {
          if (differenceSet.has(bValue)) {
            differenceSet.delete(bValue);
          }
        }
        return differenceSet;
      }

      /**
       * 返回两个结合的对称差集
       * @param {*} a
       * @param {*} b
       * @returns
       */
      static symmetricDifference(a, b) {
        return a.union(b).difference(a.intersection(b));
      }

      /**
       * 返回两个集合（数组对形式）的笛卡尔积
       * 必须返回数组集合，因为笛卡尔积可能包含相同值的对
       * @param {*} a
       * @param {*} b
       * @returns
       */
      static cartesianProduct(a, b) {
        const cartesianProductSet = new XSet();
        for (const aValue of a) {
          for (const bValue of b) {
            cartesianProductSet.add([aValue, bValue]);
          }
        }
        return cartesianProductSet;
      }

      /**
       * 返回一个集合的幂集
       * TODO 执行结果有问题，会报错
       * @param {*} a
       * @returns
       */
      static powerSet(a) {
        const powerSet = new XSet().add(new XSet());
        for (const aValue of a) {
          for (const set of new Set(powerSet)) {
            powerSet.add(new XSet(set)).add(aValue);
          }
        }
        return powerSet;
      }
    }
    return new XSet();
  }

  createPrivateVariableByWeakMap = (user) => {
    const wm = new WeakMap();
    class User {
      constructor(id) {
        this.idProperty = Symbol('id');
        this.setId(id);
      }
      setPrivate(property, value) {
        const privateMembers = wm.get(this) || {};
        privateMembers[property] = value;
        wm.set(this, privateMembers)
      }

      getPrivate(property) {
        return wm.get(this)[property];
      }

      setId(id) {
        this.setPrivate(this.idProperty, id);
      }

      getId() {
        return this.getPrivate(this.idProperty);
      }
    }

    const user = new User(user);
    wm.get(user)[user.idProperty]; // 不过这里不完全私有，仍然可以访问
    return user;
  }

  /**
   * 调用 find 函数时使用第二个参数
   * @param {*} arr
   * @param {*} that
   * @returns
   */
  useFindWithSecondArgument(arr, that) {
    // 注意这里不使用箭头函数，否则重定义 this 是无效的
    const findCallback = function(item) {
      console.info(this, 'the second argument');
      return item > 6;
    }
    return arr.find(findCallback, that);
  }

  /**
   * 从小到大排列 升序
   * @param {*} num1
   * @param {*} num2
   * @returns
   */
  compare(num1, num2) {
    if (num1 > num2) {
      return 1;
    }
    if (num1 < num2) {
      return -1;
    }
    return 0;
  }

  /**
   * 上面方法的简化版
   * 注意是降序
   * @param {*} a
   * @param {*} b
   * @returns
   */
  miniCompare(a, b) {
    return a < b ? 1 : a > b ? -1 : 0;
  }

  /**
   * 最简版 升序
   * @returns
   */
  miniCompare2 = (a, b) => a - b;

  /**
   * 对象字面量在参数上的使用
   * @param {*} args
   * @returns
   */
  displayInfo(args) {
    let output = '';
    if (typeof args.name === 'string') {
      output += 'name ' + args.name + '\n';
    }

    if (typeof args.age === 'number') {
      output += 'age ' + args.age + '\n';
    }

    return output;
  }

  /**
   * 以数组形式返回参数
   * @returns
   */
  getArgsArray() {
    return Array.from(arguments);
  }

  getArguments() {
    return Array.prototype.slice.call(arguments);
  }

  /**
   * 这个方法是错误的
   * @returns
   */
  getArgumentsByOfError() {
    return Array.of(arguments);
  }

  /**
   * 展开即可
   * @returns
   */
  getArgumentsByOf() {
    return Array.of(...arguments);
  }


  /**
   * 给数组一直加元素直到长度是 100
   * @returns
   */
   addArrByLength(arr = []) {
    while (arr.length < 100) {
      arr[arr.length] = arr.length;
    }
    return arr;
  }

  /**
   * 打印出键值对
   * @param {*} arr
   */
  iterateArrByEntries(arr = []) {
    for (const [index, value] of arr.entries()) {
      console.info(index, value);
    }
  }
}

// 番外，使用 reduce 实现各种数组 api
/**
 * 使用 reduce 实现 map
 * @param {*} callback
 * @returns
 */
Array.prototype.reduceMap = function (callback) {
  return this.reduce(function(acc, current, index, arr) {
    const item = callback.call(this, current, index, arr);
    acc.push(item);
    // 这个写法更简化 等同于上面两行
    // acc[index] = callback.call(this, current, index, array);
    return acc;
  }, [])
}

/**
 * 使用 reduce 实现 map， 结合箭头函数
 * @param {*} callback
 * @returns
 */
Array.prototype.reduceMapArrow = function (callback) {
  return this.reduce((acc, current, index, arr) => {
    const item = callback(current, index, arr);
    acc.push(item);
    return acc;
  }, [])
}

/**
 * 模拟 foreach 相当于 map 但不返回值
 * @param {*} callback
 */
Array.prototype.reduceForEach = function (callback) {
  this.reduce((acc, current, index, arr) => {
    callback(current, index, arr);
  }, [])
}

/**
 * 使用 reduce 模拟 filter
 * @param {*} callback
 * @returns
 */
Array.prototype.reduceFilter = function (callback) {
  return this.reduce((acc, current, index, arr) => {
    const item = callback(current, index, arr);
    item && acc.push(current);
    return acc;
  }, [])
}

/**
 * 使用 reduce 模拟查找 find 方法
 * @param {*} callback
 * @returns
 */
Array.prototype.reduceFind = function (callback) {
  const findedArr = this.reduce((acc, current, index, arr) => {
    const item = callback(current, index, arr);
    item && acc.push(current);
    return acc;
  }, []);
  const [findedItem] = findedArr;
  return findedItem;
}

/**
 * 模拟 findIndex
 * @param {*} callback
 * @returns
 */
Array.prototype.reduceFindIndex = function (callback) {
  const findedIndexArr = this.reduce((acc, current, index, arr) => {
    const item = callback(current, index, arr);
    item && acc.push(index);
    return acc;
  }, []);
  const [findedItemIndex] = findedIndexArr;
  return findedItemIndex;
}

const countItemByReduce = [1, 1, 3, 4, 5];
/**
 * 计算元素出现的个数
 */
countItemByReduce.reduce((acc, current) => {
  if (currnet in acc) {
    acc[current] += 1;
  }
  if (!(current in acc)) {
    acc[current] = 1;
  }
  return acc;
}, {})

const uniqueArrByReduce = [];

/**
 * 数组去重
 */
uniqueArrByReduce.reduce((acc, current) => {
  if (!acc.includes(current)) {
    acc.push(current);
  }
  return acc;
}, []);

/**
 * 输入框
 * @param {*} callback
 * @param {*} time
 * @returns
 */
function debounce(callback, time) {
  let timeId;
  return function () {
    if (timeId) {
      clearTimeout(timeId);
    }
    let context = this;
    let args = arguments;
    timeId = window.setTimeout(() => {
      callback.apply(context, args);
      // callback.call(context, ...args);
    }, time)
  }
}

function throttle(callback, time) {
  let timer;
  return function () {
    if (timer) return;
    timer = window.setTimeout(() => {
      timer = null;
      callback.call(this, ...arguments);
    }, time)
  }
}

/**
 * resize
 * @param {*} callback
 * @param {*} time
 * @returns
 */
function throttle2(callback, time) {
  let start = Date.now();
  let timer;
  return function () {
    const now = Date.now();
    const context = this;

    clearTimeout(timer);
    if (now - start > time) {
      callback.call(context, ...arguments);
      start = now;
    } else {
      timer = window.setTimeout(() => {
        callback.call(context, ...arguments);
      }, time)
    }
  }
}

class Event {
  constructor() {
    this.events = {};
  }

  on(type, fn) {
    this.events[type] = this.events[type] || [];
    if (!this.events[type].includes(fn)) {
      this.events[type].push(fn)
    }
    return this;
  }

  /**
   * 只能调用一次
   * @param {*} type
   * @param {*} data
   */
  emit(type, data) {
    let i = 0;
    while (this.events[type].length) {
      this.events[type][i](data);
      i++;
      this.events[type].shift();
    }
  }

  off(type, fn) {
    this.events[type] = this.events[type].filter((item) => {
      return item !== fn;
    })
  }
}
