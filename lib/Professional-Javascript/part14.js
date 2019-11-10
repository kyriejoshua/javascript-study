/******** 《JavaScript 高级程序设计》 ********/
/******** 14、表单脚本 ********/
import { EventUtil } from "./part13"

export default class Part14Form {
  constructor() {
    // 14.1 表单的基础知识
    // HTMLFormElement extends HTMLElement
    // 继承了 HTMLElement, 但也有自己的属性和方法
    // docuemnt.forms 可以取得表单
    this.getForms()

    // 14.1.1 提交表单
    // 三种按钮提交表单
    this.renderFormSubmit()
    // js 提交表单
    this.getFormSubmit()

    // 14.1.1 重置表单
    this.renderFormReset()
    this.getFormReset()

    // 14.1.3 表单字段
    this.getFormField("myForm", "name")
    this.handleField()

    // 14.2 文本框脚本
    // 14.2.1 选择文本
    this.handleInputSelect()

    // 选择部分文本
    this.handleInputSelectPart()

    // 14.2.2 过滤输入
    // 屏蔽字符
    this.filterNumberInput()
    // 操作剪贴板
    // 见末尾的 EventUtil 扩展

    // 14.2.3 自动切换焦点
    this.renderAutoFocus()
    this.autoTabFocus()

    // 14.2.4 HTML5 约束验证 API
    // require
    // pattern
    // checkValidity()

    // 14.3 选择框脚本
    this.renderSelect()
    this.getSelect()

    // 14.3.1 选择选项
    this.getSelectedOption()
    this.getOptionSelected()
    // 多选
    this.getSelectedOptions()

    // 14.3.2 添加选项
    this.addOptionWithObject()
    this.addOptionOriginal()

    // 14.3.3 移除选项
    this.removeOptionWithDom()
    this.removeOptionOriginal()
    this.clearSelectOptions()
    // 设置为 null 也可以直接移除

    // 14.3.4 移动和重排选项
    // 移动效果
    this.moveOption()
    // 插入效果
    this.insertOption(2)

    // 14.4 表单序列化

    // 14.5 富文本编辑
    this.handleIframeDesignMode()

  }

  /**
   *
   */
  getForms() {
    return document.forms()
  }

  /**
   * 以下三种方式回车都可以提交表单
   * 但 event.preventDefault() 可以阻止该动作
   */
  renderFormSubmit() {
    return (
      <form>
        {/* 通用提交按钮 */}
        <input type="submit" value="submit form" />
        {/* 自定义提交按钮 */}
        <button type="submit">submit form</button>
        {/* 图像按钮 */}
        <input type="image" src="submit.gif" />
      </form>
    )
  }

  /**
   * 该方式不会触发校验
   */
  getFormSubmit() {
    let form = document.forms[0]
    form.submit()
  }

  /**
   * 重置表单，防止重复提交等
   */
  renderFormReset() {
    return (
      <form>
        {/* 通用重置按钮 */}
        <input type="reset" value="reset form" />
        {/* 自定义重置按钮 */}
        <button type="reset">reset form</button>
      </form>
    )
  }

  /**
   * 调用该方法和点击重置按钮的效果完全一样
   */
  getFormReset() {
    let form = document.forms[0]
    form.reset()
  }

  getFormField(formId = "", fieldsetName = "") {
    let form = document.body.querySelector(formId)
    return fieldsetName ? form.elements[fieldsetName] : form.elements
  }

  /**
   * 避免多次提交表单
   * @param {*} form
   */
  handleButton(form) {
    EventUtil.addHandle(form, "submit", function(event) {
      event = EventUtil.getEvent(event)
      let target = EventUtil.getTarget(event)
      let btn = form.elements["submit-btn"]
      btn.disable = true
    })
  }

  /**
   * 用于演示表单内容失去焦点和聚焦等变化的 dom
   */
  renderFormEvent() {
    return (
      <form>
        <input />
      </form>
    )
  }

  getDefaultInput() {
    return document.forms[0].elements[0]
  }

  /**
   * 聚焦输入时背景为黄色，输入有误时背景显示红色
   */
  handleField() {
    let textbox = this.getDefaultInput()
    EventUtil.addHandle(textbox, "focus", function(event) {
      event = EventUtil.getEvent(event)
      let target = EventUtil.getTarget(event)
      if (target.style.backgroundColor !== "red") {
        target.style.backgroundColor = "yellow"
      }
    })
    EventUtil.addHandle(textbox, "blur", function(event) {
      event = EventUtil.getEvent(event)
      let target = EventUtil.getTarget(event)
      if (/[^\d]/.test(target.value)) {
        target.style.backgroundColor = "red"
      } else {
        target.style.backgroundColor = ""
      }
    })
    EventUtil.addHandle(textbox, "change", function(event) {
      event = EventUtil.getEvent(event)
      let target = EventUtil.getTarget(event)
      if (/[^\d]/.test(target.value)) {
        target.style.backgroundColor = "red"
      } else {
        target.style.backgroundColor = ""
      }
    })
  }

  /**
   * 聚焦时自动选中文本
   */
  handleInputSelect() {
    let textbox = this.getDefaultInput()

    EventUtil.addHandle(textbox, "focus", function(event) {
      event = EventUtil.getEvent(event)
      let target = EventUtil.getTarget(event)
      target.select()
    })
  }

  /**
   * 选中输入框内的部分文本，但要注意聚焦先
   * @param {Number} startIndex
   * @param {Number} endIndex
   * @param {String} direction
   */
  handleInputSelectPart(startIndex = 0, endIndex = 0, direction) {
    let textbox = this.getDefaultInput()
    endIndex = endIndex || textbox.value.length
    return textbox.setSelectionRange(startIndex, endIndex, direction)
  }

  /**
   * 禁止键盘输入，文本框变成只读
   */
  disableInput() {
    let textbox = this.getDefaultInput()
    EventUtil.addHandle(textbox, "keypress", function(event) {
      event = EventUtil.getEvent(event)
      EventUtil.preventDefault(event)
    })
  }

  /**
   * 字符编码转成字符串
   * 除去复制粘贴组合键
   * 除去上下左右等按键
   */
  filterNumberInput() {
    let textbox = this.getDefaultInput()
    EventUtil.addHandle(textbox, "keypress", function(event) {
      event = EventUtil.getEvent(event)
      let charCode = EventUtil.getCharCode(event)
      if (
        !/\d/.test(String.fromCharCode(charCode)) &&
        charCode > 9 &&
        !event.ctrlKey
      ) {
        // if (/^\d/.test(String.fromCharCode(charCode))) {
        event.preventDefault()
      }
    })
  }

  /**
   * 粘贴时过滤非文本的内容
   */
  filterNumberPaste() {
    let textbox = this.getDefaultInput()
    EventUtil.addHandle(textbox, "paste", function(event) {
      event = EventUtil.getEvent(event)
      text = EventUtil.getClipboardText(event)

      if (/^\d*$/.test(text)) {
        EventUtil.preventDefault()
      }
    })
  }

  /**
   * 用于演示切换焦点的案例
   */
  renderInputs() {
    return (
      <form>
        <input name="phone1" id="phone1" maxLength="11" />
        <input name="phone2" id="phone2" maxLength="4" />
        <input name="phone3" id="phone3" maxLength="8" />
      </form>
    )
  }

  renderAutoFocus() {
    return (
      <form>
        <input name="phone1" id="text1" maxLength="11" />
        <input name="phone2" id="text2" maxLength="4" />
        <input name="phone3" id="text3" maxLength="8" />
      </form>
    )
  }

  autoTabFocus() {
    ;(function() {
      function tabForward(event) {
        event = EventUtil.getEvent(event)
        let target = EventUtil.getTarget(event)

        if (target.value.length === target.maxLength) {
          let form = target.form
          for (let i = 0, len = form.elements.length; i < len; i++) {
            if (form.elements[i] == target) {
              // 这里是否可以用 全等？
              if (form.elements[i + 1]) {
                form.elements[i + 1].focus()
                return
              }
            }
          }
        }
        let text1 = document.querySelector("#text1")
        let text2 = document.querySelector("#text2")
        let text3 = document.querySelector("#text3")

        EventUtil.addHandle(text1, "keyup", tabForward)
        EventUtil.addHandle(text2, "keyup", tabForward)
        EventUtil.addHandle(text3, "keyup", tabForward)
      }
    })()
  }

  renderSelect() {
    return (
      <form>
        <select name="location" id="selLocation">
          <option value="CA">CA location</option>
          <option value="LA">Los location</option>
          <option value="">China</option>
          <option>Australia</option>
        </select>
      </form>
    )
  }

  getSelect() {
    return document.forms[0].elements["location"]
  }

  /**
   * 获得选中项
   */
  getSelectedOption() {
    let selectbox = this.getSelect()
    selectedOption = selectbox.options[selectbox.selectedIndex]
    console.info(selectedOption, selectedOption.value)
    return selectedOption
  }

  /**
   * js 手动选择某项，默认是第二项，默认 3s 后执行
   * @param {Number} index
   */
  getOptionSelected(index = 1, timer = 3000) {
    let selectbox = this.getSelect()
    let nextOption = selectbox.options[index].selected
    window.setTimeout(() => {
      nextOption = true
    }, timer)
  }

  /**
   * 选择框是允许多选的，但 selectedIndex 只返回第一个
   */
  getSelectedOptions() {
    let selectbox = this.getSelect()
    let selectedOptions = []
    for (let index = 0, len = selectbox.options.length; index < len; index++) {
      const option = selectedbox.options[index];
      if (option.selected) {
        this.getSelectedOptions.push(option)
      }
    }
    return selectedOptions
  }

  /**
   * 构造函数的方式新建选项，添加到末尾
   */
  addOptionWithObject() {
    let selectbox = this.getSelect()
    let option = new Option('object location', 'object value')
    console.info('option obj', option)
    selectbox.appendChild(option)
  }

  /**
   * 原生支持直接新增，add 方法, 默认添加到末尾
   */
  addOptionOriginal() {
    let selectbox = this.getSelect()
    let option = new Option('original location', 'original add')
    selectbox.add(option)
  }

  /**
   * 常规移除，dom 的方式直接移除子元素
   * @param {Number} index
   */
  removeOptionWithDom(index = 0) {
    let selectbox = this.getSelect()
    selectbox.removeChild(selectbox.options[index])
  }

  /**
   * 移除对应索引的选项
   * @param {Number} index
   */
  removeOptionOriginal(index = 0) {
    let selectbox = this.getSelect()
    selectbox.remove(index)
  }

  /**
   * 清空所有选项
   */
  clearSelectOptions() {
    let selectbox = this.getSelect()
    for (let index = 0, len = selectbox.options.length; index < len; index++) {
      selectbox.remove(index)
    }
    return selectbox
  }

  /**
   * 将第一个选择的第一个选项移到第二个选择框的末尾
   * 如果传入的元素已存在，apppendChild 会自动移除原有元素
   */
  moveOption() {
    let selectbox1 = document.querySelector('#select1')
    let selectbox2 = document.querySelector('#select2')
    selectbox2.appendChild(selectedbox1.options[0])
  }

  /**
   * 指定位置选项往前移入一项
   * @param {Number} index
   */
  insertOption(index = 1) {
    let selectbox = this.getSelect()
    selectbox.insertBefore(selectbox.options[index], selectbox.options[index - 1])
  }

  renderIframe() {
    return <iframe name="richedit" style="height: 100px;width:100px;" src="blank.htm"></iframe>
  }

  /**
   * 使 iframe 可编辑, designMode 的值为 on || off, on 为可编辑
   */
  handleIframeDesignMode() {
    EventUtil.addHandle(window, 'load', function () {
      frames["richedit"].document.designMode = 'on'
    })
  }
}

EventUtil.getClipboardText = function(event) {
  let clipboardData = event.clipboardData || window.clipboardData
  return clipboardData.getData("text")
}

EventUtil.setClipboardText = function(event, value) {
  if (event.clipboardData) {
    return event.clipboardData.setData("text/plain", value)
  }
  if (window.clipboardData) {
    return window.clipboardData.setData("text", value)
  }
}
