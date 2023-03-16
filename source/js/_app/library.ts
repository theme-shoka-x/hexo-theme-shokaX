/* global CONFIG */

/*
对注释的说明: 部分注释为openai-chatgpt生成的注释,可能存在描述或语义的问题
 */

declare interface EventTarget {
// 设置或获取元素属性值
  attr(type: string, value?: any): any

// 移除元素的指定class
  removeClass(className: string): any

// 添加元素的指定class
  addClass(className: string): any

// 创建并插入一个新元素
  createChild(tag: string, obj: Object, positon?: string | null): HTMLElement

// 获取元素的子元素
  child(selector: string): HTMLElement

// 检查元素是否有指定class
  hasClass(className: string): boolean

// 设置或获取元素高度
  changeOrGetHeight(h?: number | string): number

// 添加或移除元素指定class
  toggleClass(className: string, display?: boolean): any

// 设置或获取元素宽度
  changeOrGetWidth(w?: number | string): number

// 在指定元素后面插入当前元素
  insertAfter(element: HTMLElement): void

// 将对象包装到元素中
  wrapObject(obj: Object)

// 查找元素的子元素
  find(selector: string): NodeListOf<HTMLElement>

// 设置或获取元素display属性
  display(d?: null | string): string | any
}

declare const LOCAL: {
  path: string;
  ignores: any;
  audio: any;
  search: any;
  quiz: any;
  nocopy: boolean;
  copyright: string;
  outime: any
  template: string
  favicon: {
    hide: string
    show: string
  }
}
declare const CONFIG: {
  hostname: string;
  fireworks: any;
  audio: any;
  version: number
  root: string
  statics: string
  outime: {
    enable: boolean
    days: number
  }
  favicon: {
    normal: string,
    hidden: string
  }
  darkmode: boolean
  auto_dark: {
    enable: boolean
    start: number
    end: number
  }
  auto_scroll: boolean
  loader: {
    start: boolean
    switch: boolean
  }
  js: {
    chart: string
    copy_tex: string
    fancybox: string
    echarts: string
  }
  css: {
    valine: string
    katex: string
    mermaid: string
    fancybox: string
  }
  search: any,
  valine: string
  quicklink: {
    ignores: any
    timeout: number
    priority: string
  }
  playerAPI: string
  disableVL: boolean
}

const getDocHeight = () => $dom('main > .inner').offsetHeight
/**
 * 获取一个dom选择器对应的元素
 */
const $dom = (selector: string, element: Document = document): HTMLElement => {
  // 在测试环境中这能优化0.01-0.02ms左右
  if (selector[0] === '#') {
    return <HTMLElement> element.getElementById(selector.substring(1))
  }
  return <HTMLElement> element.querySelector(selector)
}

/**
 * 获取具有此选择器的所有dom节点
 */
$dom.all = (selector: string, element: Document = document): NodeListOf<HTMLElement> => {
  return element.querySelectorAll(selector)
}
/**
 * 获取具有此选择器的所有dom节点,并依次执行callback函数
 */
$dom.each = (selector: string, callback: (value: HTMLElement, key: number, parent: NodeListOf<Element>) => void, element?: Document): void => {
  return $dom.all(selector, element).forEach(callback)
}

/* shokaX异步化计划 */
$dom.asyncify = async (selector: string, element: Document = document): Promise<HTMLElement | null> => {
  if (selector.indexOf('#') === 0) {
    return element.getElementById(selector.replace('#', ''))
  }

  return element.querySelector(selector) as HTMLElement
}

$dom.asyncifyAll = async (selector: string, element: Document = document): Promise<NodeListOf<HTMLElement>> => {
  return element.querySelectorAll(selector)
}

$dom.asyncifyEach = (selector: string, callback?: (value: HTMLElement, key: number, parent: NodeListOf<Element>) => void, element?: Document): void => {
  $dom.asyncifyAll(selector, element).then((tmp) => {
    tmp.forEach(callback)
  })
}

Object.assign(HTMLElement.prototype, {
  /**
   * 创建一个子节点并放置
   */
  createChild: function (tag: string, obj: Object, positon?: string): HTMLElement {
    const child = document.createElement(tag)
    Object.assign(child, obj)
    switch (positon) {
      case 'after':
        this.insertAfter(child)
        break
      case 'replace':
        this.innerHTML = ''
        this.appendChild(child)
        break
      default:
        this.appendChild(child)
    }
    return child
  },
  wrapObject: function (obj: Object) {
    const box = document.createElement('div')
    Object.assign(box, obj)
    this.parentNode.insertBefore(box, this)
    this.parentNode.removeChild(this)
    box.appendChild(this)
  },
  changeOrGetHeight: function (h?: number | string): number {
    if (h) {
      this.style.height = typeof h === 'number' ? h + 'rem' : h
    }
    return this.getBoundingClientRect().height
  },
  /**
   此函数将元素的宽度设置为指定值,如果未提供值,则返回元素的宽度.<br />
   宽度可以作为数字提供(假定它以`rem`为单位).作为字符串提供则直接设置为元素宽度
   */
  changeOrGetWidth: function (w?: number | string): number {
    if (w) {
      this.style.width = typeof w === 'number' ? w + 'rem' : w
    }
    return this.getBoundingClientRect().width
  },
  top: function (): number {
    return this.getBoundingClientRect().top
  },
  left: function (): number {
    return this.getBoundingClientRect().left
  },
  /**
   * 该函数接受两个参数：`type`字符串和 `value`字符串的可选参数。该函数具有基于参数值的三个主要逻辑分支。 <br />
   * 1. `value`如果是`null`，则该函数从当前上下文中删除具有`type`函数名称的属性。 <br />
   * 2. `value`如果为真，则该函数将使用`type`参数指定的名称将属性设置为当前上下文中`value`参数的值。然后，该函数返回当前上下文。 <br />
   * 3. `value`如果不是真，则该函数返回属性的值，该值具有当前上下文中的参数指定的名称。
   */
  attr: function (type: string, value?: string): void | EventTarget | string {
    if (value === null) {
      return this.removeAttribute(type)
    }

    if (value) {
      this.setAttribute(type, value)
      return this
    } else {
      return this.getAttribute(type)
    }
  },
  /**
   * 将此节点插入父节点的下一个节点之前
   */
  insertAfter: function (element: HTMLElement): void {
    const parent = this.parentNode
    if (parent.lastChild === this) {
      parent.appendChild(element)
    } else {
      parent.insertBefore(element, this.nextSibling)
    }
  },
  /**
   * 当d为空时返回此节点的CSSStyle display属性 <br />
   * 反之,将d设置为此节点的CSSStyle display属性
   */
  display: function (d?: string): string | EventTarget {
    if (d == null) {
      return this.style.display
    } else {
      this.style.display = d
      return this
    }
  },
  /**
   * 找到此节点第一个符合selector选择器的子节点
   */
  child: function (selector: string): HTMLElement {
    return $dom(selector, this)
  },
  /**
   * 找到此节点所有符合selector选择器的子节点
   */
  find: function (selector: string): NodeListOf<HTMLElement> {
    return $dom.all(selector, this)
  },
  /**
   * 当输入type为toggle时,对每个className执行toggle操作 <br />
   * 反之,对每个className执行type操作
   */
  _class: function (type: string, className: string, display?: boolean): void {
    const classNames = className.indexOf(' ') ? className.split(' ') : [className]
    classNames.forEach((name) => {
      if (type === 'toggle') {
        this.classList.toggle(name, display)
      } else {
        this.classList[type](name)
      }
    })
  },
  addClass: function (className: string): any {
    this._class('add', className)
    return this
  },
  removeClass: function (className: string): any {
    this._class('remove', className)
    return this
  },
  toggleClass: function (className: string, display?: boolean): any {
    this._class('toggle', className, display)
    return this
  },
  hasClass: function (className: string): boolean {
    return this.classList.contains(className)
  }
})

// Html5LocalStorage的一个API
const $storage = {
  set: (key: string, value: string): void => {
    localStorage.setItem(key, value)
  },
  get: (key: string): string => {
    return localStorage.getItem(key)
  },
  del: (key: string): void => {
    localStorage.removeItem(key)
  }
}

const getScript = function (url: string, callback?: Function, condition?: string): void {
  // url: 脚本文件的URL地址
  // callback: 当脚本加载完成时要执行的回调函数
  // condition: 可选的条件参数，如果存在，则执行callback
  if (condition) {
    // 如果条件存在，则执行回调函数
    callback()
  } else {
    let script = document.createElement('script')

    // @ts-ignore
    script.onload = function (_, isAbort: boolean) {
      // _: 事件对象
      // isAbort: 是否中止
      // @ts-ignore
      if (isAbort || !script.readyState) {
        console.log('abort!')
        script.onload = null
        script = undefined
        if (!isAbort && callback) setTimeout(callback, 0)
      }
    }
    script.src = url
    document.head.appendChild(script)
  }
}

const assetUrl = function (asset: string, type: string): string {
  const str = CONFIG[asset][type]
  if (str.indexOf('gh') > -1 || str.indexOf('combine') > -1) {
    return `https://cdn.jsdelivr.net/${str}`
  }
  if (str.indexOf('npm') > -1) {
    return `https://cdn.jsdelivr.net/${str}`
  }
  if (str.indexOf('http') > -1) {
    return str
  }
  return `/${str}`
}

const vendorJs = function (type: string, callback?: Function, condition?: string) {
  if (LOCAL[type]) {
    getScript(assetUrl('js', type), callback || function () {
      window[type] = true
    }, condition || window[type])
  }
}

const vendorCss = function (type: string, condition?: string): void {
  if (window['css' + type]) {
    return
  }

  if (LOCAL[type]) {
    document.head.createChild('link', {
      rel: 'stylesheet',
      href: assetUrl('css', type)
    })

    window['css' + type] = true
  }
}

/**
 * 参数  动画效果
 * 0  元素逐渐消失
 * 1  元素逐渐出现
 * bounceUpIn  元素从下方弹跳出现
 * shrinkIn  元素从放大到正常大小出现
 * slideRightIn  元素从右侧滑入
 * slideRightOut  元素向右侧滑出
 * TODO 函数功能过于复杂，需要拆分
 */
const transition = (target: HTMLElement, type: number|string|Function, complete?: Function): void => {
  let animation
  let display = 'none'
  switch (type) {
    case 0:
      animation = { opacity: [1, 0] }
      break
    case 1:
      animation = { opacity: [0, 1] }
      display = 'block'
      break
    case 'bounceUpIn':
      animation = {
        begin: function (anim) {
          target.display('block')
        },
        translateY: [
          { value: -60, duration: 200 },
          { value: 10, duration: 200 },
          { value: -5, duration: 200 },
          { value: 0, duration: 200 }
        ],
        opacity: [0, 1]
      }
      display = 'block'
      break
    case 'shrinkIn':
      animation = {
        begin: function (anim) {
          target.display('block')
        },
        scale: [
          { value: 1.1, duration: 300 },
          { value: 1, duration: 200 }
        ],
        opacity: 1
      }
      display = 'block'
      break
    case 'slideRightIn':
      animation = {
        begin: function (anim) {
          target.display('block')
        },
        translateX: [100, 0],
        opacity: [0, 1]
      }
      display = 'block'
      break
    case 'slideRightOut':
      animation = {
        translateX: [0, 100],
        opacity: [1, 0]
      }
      break
    default:
      animation = type
      // @ts-ignore
      display = type.display
      break
  }
  anime(Object.assign({
    targets: target,
    duration: 200,
    easing: 'linear'
  }, animation)).finished.then(function () {
    target.display(display)
    complete && complete()
  })
}

const pjaxScript = function (element: HTMLScriptElement) {
  const { text, parentNode, id, className, type, src, dataset } = element
  const code = text || element.textContent || element.innerHTML || ''
  parentNode.removeChild(element)
  const script = document.createElement('script')
  if (id) {
    script.id = id
  }
  if (className) {
    script.className = className
  }
  if (type) {
    script.type = type
  }
  if (src) {
    // Force synchronous loading of peripheral JS.
    script.src = src
    script.async = false
  }
  if (dataset.pjax !== undefined) {
    script.dataset.pjax = ''
  }
  if (code !== '') {
    script.appendChild(document.createTextNode(code))
  }
  parentNode.appendChild(script)
}

const pageScroll = function (target: any, offset?: number, complete?: Function) {
  // target: 滚动到的目标元素或坐标(number)
  // offset: 可选的偏移量
  // complete: 可选的回调函数，在动画完成时调用
  const opt = {
    // 动画目标
    targets: typeof offset === 'number' ? target.parentNode : document.scrollingElement,
    // 动画持续时间
    duration: 500,
    // 动画缓动函数
    easing: 'easeInOutQuad',
    // 如果 offset 存在，则滚动到 offset，如果 target 是数字，则滚动到 target，如果 target 是 DOM 元素，则滚动到下述表达式
    scrollTop: offset || (typeof target === 'number' ? target : (target ? target.top() + document.documentElement.scrollTop - siteNavHeight : 0)),
    // 完成回调函数
    complete: function () {
      complete && complete()
    }
  }
  anime(opt)
  // 调用 anime.js 函数，并传入参数
}
