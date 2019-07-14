/******** 《JavaScript 高级程序设计》 ********/
/******** 5、引用类型 ********/

export default class Part5 {
  constructor() {
    const str = new String("string");
    const strObj = new String("string");
    typeof str; // string
    typeof strObj; // object
    const num = 123;
    const numObj = new Number("123");
    typeof num; // number
    typeof numObj; // object
    const bool = false;
    const boolObj = new Boolean(false);
    typeof bool; // boolean
    typeof boolObj; // object
  }

  match = () => {};

  search = () => {};

  split = () => {};

  random = (len = 1, min = 0) => {
    return Math.floor(Math.random() * len + min);
  };
}
