/* global CONFIG */
/*
对注释的说明: 部分注释为openai-chatgpt生成的注释,可能存在描述或语义的问题
 */
declare interface EventTarget {
  attr(type:string, value?:any):any
  removeClass(className:string):any
  addClass(className:string):any
  createChild(tag:string, obj:Object, positon?: string | null):HTMLElement
  child(selector:string):HTMLElement
  hasClass(className:string):boolean
  changeOrGetHeight(h?:number|string):number
  toggleClass(className:string, display?:boolean):any
  changeOrGetWidth(w?:number|string):number
  insertAfter(element:HTMLElement):void
  wrapObject(obj:Object)
  find(selector:string):NodeListOf<HTMLElement>
  display(d?:null|string):string|any
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
    hide:string
    show:string
  }
}
declare const CONFIG: {
  hostname: string;
  fireworks: any;
  audio: any;
  version:number
  root:string
  statics:string
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
    start:boolean
    switch:boolean
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
    ignores: any;
    timeout: number
    priority: string
  }
}

const getDocHeight = () => $dom('main > .inner').offsetHeight
/**
 * 获取一个dom选择器对应的元素
 */
const $dom = (selector:string, element:Document=document):HTMLElement|null => {
  if (selector.indexOf('#') === 0) {
    return element.getElementById(selector.replace('#', ''))
  }
  return element.querySelector(selector)
}
/**
 * 获取具有此选择器的所有dom节点
 */
$dom.all = (selector:string, element:Document=document):NodeListOf<HTMLElement> => {
  return element.querySelectorAll(selector)
}
/**
 * 获取具有此选择器的所有dom节点,并依次执行callback函数
 */
$dom.each = (selector:string, callback?:(value: HTMLElement, key: number, parent: NodeListOf<Element>) => void, element?:Document):void => {
  return $dom.all(selector, element).forEach(callback)
}

/* shokaX异步化计划 */
$dom.asyncify = async (selector:string, element:Document=document):Promise<HTMLElement | null> => {
  if (selector.indexOf('#') === 0) {
    return element.getElementById(selector.replace('#', ''))
  }

  return element.querySelector(selector) as HTMLElement
}

$dom.asyncifyAll = async (selector:string, element:Document=document):Promise<NodeListOf<HTMLElement>> => {
  return element.querySelectorAll(selector)
}

$dom.asyncifyEach = (selector:string, callback?:(value: HTMLElement, key: number, parent: NodeListOf<Element>) => void, element?:Document):void => {
  $dom.asyncifyAll(selector, element).then((tmp)=>{
    tmp.forEach(callback)
  })
}

Object.assign(HTMLElement.prototype, {
  /*
这段代码实现了在当前 DOM 元素中创建一个新的子元素的功能。传入的 tag 变量表示要创建的元素标签名，
obj 变量表示要添加到新元素上的属性，positon 变量表示新元素的插入位置。使用 Object.assign 方法将 obj 对象中的属性添加到 child 元素上，根据 positon 变量的值进行不同的操作，最后返回创建的 child 元素.
     */
  createChild: function (tag:string, obj:Object, positon?: string):HTMLElement {
    // 创建一个新的 DOM 元素，标签名为传入的 tag 变量
    const child = document.createElement(tag)
    // 使用 Object.assign 方法将 obj 对象中的属性添加到 child 元素上
    Object.assign(child, obj)
    // 根据 positon 变量的值进行不同的操作
    switch (positon) {
      // 如果 positon 为 'after'，则使用 insertAfter 方法将 child 插入到当前元素之后
      case 'after':
        this.insertAfter(child)
        break
      // 如果 positon 为 'replace'，则将当前元素的 innerHTML 设置为空字符串，并将 child 元素添加到当前元素中
      case 'replace':
        this.innerHTML = ''
        this.appendChild(child)
        break
      // 如果 positon 变量不存在或者为其它值，则默认将 child 元素添加到当前元素中
      default:
        this.appendChild(child)
    }
    return child
  },
  /*
  这段代码实现了将当前 DOM 元素包装在新的 div 元素中的功能。传入的 obj 变量表示要添加到新 div 元素上的属性，
  使用 Object.assign 方法将 obj 对象中的属性添加到 box 元素上，将 box 元素插入到当前元素的父元素中,在当前元素之前，将当前元素从父元素中删除,最后将当前元素添加到 box
   */
  wrapObject: function (obj:Object) {
    // 创建一个新的 div 元素
    const box = document.createElement('div')
    // 使用 Object.assign 方法将 obj 对象中的属性添加到 box 元素上
    Object.assign(box, obj)
    // 将 box 元素插入到当前元素的父元素中,在当前元素之前
    this.parentNode.insertBefore(box, this)
    // 将当前元素从父元素中删除
    this.parentNode.removeChild(this)
    // 将当前元素添加到 box 元素中
    box.appendChild(this)
  }
  ,
  changeOrGetHeight: function (h?:number|string):number {
    if (h) {
      this.style.height = typeof h === 'number' ? h + 'rem' : h
    }
    return this.getBoundingClientRect().height
  },
  /**
   此函数将元素的宽度设置为指定值,如果未提供值,则返回元素的宽度.<br />
   宽度可以作为数字提供(假定它以`rem`为单位).作为字符串提供则直接设置为元素宽度
   */
  changeOrGetWidth: function (w?:number|string):number {
    if (w) {
      this.style.width = typeof w === 'number' ? w + 'rem' : w
    }
    return this.getBoundingClientRect().width
  },
  top: function ():number {
    return this.getBoundingClientRect().top
  },
  left: function ():number {
    return this.getBoundingClientRect().left
  },
  /**
   * 该函数接受两个参数：`type`字符串和 `value`字符串的可选参数。该函数具有基于参数值的三个主要逻辑分支。 <br />
   * 1. `value`如果是`null`，则该函数从当前上下文中删除具有`type`函数名称的属性。 <br />
   * 2. `value`如果为真，则该函数将使用`type`参数指定的名称将属性设置为当前上下文中`value`参数的值。然后，该函数返回当前上下文。 <br />
   * 3. `value`如果不是真，则该函数返回属性的值，该值具有当前上下文中的参数指定的名称。
   */
  attr: function (type:string, value?:string):void|EventTarget|string {
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
  insertAfter: function (element:HTMLElement):void {
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
  display: function (d?:string):string|EventTarget {
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
  child: function (selector:string):HTMLElement {
    return $dom(selector, this)
  },
  /**
   * 找到此节点所有符合selector选择器的子节点
   */
  find: function (selector:string):NodeListOf<HTMLElement> {
    return $dom.all(selector, this)
  },
  /*
   * 这段代码实现了在 DOM 元素的 classList 上执行 add, remove, toggle 操作的功能。传入的 type 变量表示要执行的操作类型，
   * className 变量表示要操作的类名，当 type 为 toggle 时，display 变量可以传入一个布尔值，表示要添加还是删除类名。如果 className 中存在多个类名，则会将其分割为数组，然后使用 forEach 方法遍历数组并执行对应的操作。
   */
  _class: function (type: string, className: string, display?: boolean): void {
    // 如果 className 中存在多个类名，则将其分割为数组
    const classNames = className.indexOf(' ') ? className.split(' ') : [className]
    // 将 this 存储在变量 that 中，以便在 forEach 函数中使用
    const that = this
    // 遍历 classNames 数组
    classNames.forEach(function (name) {
      // 如果 type 等于 'toggle'，则使用 classList.toggle 方法
      if (type === 'toggle') {
        that.classList.toggle(name, display)
        // 否则使用 classList[type] 方法
      } else {
        that.classList[type](name)
      }
    })
  }
  ,
  addClass: function (className:string):any {
    this._class('add', className)
    return this
  },
  removeClass: function (className:string):any {
    this._class('remove', className)
    return this
  },
  toggleClass: function (className:string, display?:boolean):any {
    this._class('toggle', className, display)
    return this
  },
  hasClass: function (className:string):boolean {
    return this.classList.contains(className)
  }
})

// Html5LocalStorage的一个API
const $storage = {
  set: (key:string, value:string):void => {
    localStorage.setItem(key, value)
  },
  get: (key:string):string => {
    return localStorage.getItem(key)
  },
  del: (key:string):void => {
    localStorage.removeItem(key)
  }
}

/*
这段代码实现了动态加载外部 JavaScript 脚本文件的功能。如果传入了 condition 变量，则直接调用 callback 函数；如果没有传入 condition 变量，
则创建一个 script 元素，设置其 src 属性为传入的 url，并将其添加到 head 元素中，在 script 元素加载完成后，调用 callback 函数。
 */
const getScript = function (url:string, callback?:Function, condition?:string):void {
  // 如果 condition 变量存在，直接调用 callback 函数
  if (condition) {
    callback()
    // 如果 condition 变量不存在，则创建 script 元素
  } else {
    let script = document.createElement('script')
    // 当 script 元素加载完成时，调用 onload 回调函数
    // @ts-ignore
    script.onload = function (_, isAbort: boolean) {
      // 如果 script 元素加载失败（isAbort=true）或 script 元素未准备就绪，则输出 "abort!" 信息
      // @ts-ignore
      if (isAbort || !script.readyState) {
        console.log("abort!")
        // 清除 onload 事件处理程序并释放 script 元素
        script.onload = null
        script = undefined
        // 如果加载成功且存在 callback 函数，则延迟 0 毫秒后调用 callback 函数
        if (!isAbort && callback) setTimeout(callback, 0)
      }
    }
    // 设置 script 元素的 src 属性，以加载外部脚本文件
    script.src = url
    // 添加 script 元素到页面的 head 元素中
    document.head.appendChild(script)
  }
}


const assetUrl = function (asset:string, type:string):string {
  const str = CONFIG[asset][type]
  if (str.indexOf('gh') > -1 || str.indexOf('combine') > -1) { return `https://cdn.jsdelivr.net/${str}` }
  if (str.indexOf('npm') > -1) { return `https://unpkg.com/${str}` }
  if (str.indexOf('http') > -1) { return str }
  return `/${str}`
}

const vendorJs = function (type:string, callback?:Function, condition?:string) {
  if (LOCAL[type]) {
    getScript(assetUrl('js', type), callback || function () {
      window[type] = true
    }, condition || window[type])
  }
}

const vendorCss = function (type:string, condition?:string):void {
  if (window['css' + type]) { return }

  if (LOCAL[type]) {
    document.head.createChild('link', {
      rel: 'stylesheet',
      href: assetUrl('css', type)
    })

    window['css' + type] = true
  }
}

const transition = (target:HTMLElement, type:any, complete?:Function):void => {
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

/*
这段代码的作用是在 Pjax 操作中，重新加载页面中的 script 标签。它会从页面中获取到 script 元素，将其从父元素中删除，
然后创建一个新的 script 元素，将原来的 script 元素的属性和文本内容复制到新 script 元素上，最后将新 script 元素添加到父元素中。
这样做的目的是为了避免 Pjax 操作中 script 标签重复执行的问题。
 */
const pjaxScript = function (element:HTMLScriptElement) {
  // 获取 script 元素的文本内容
  const code = element.text || element.textContent || element.innerHTML || ''
  // 获取 script 元素的父元素
  const parent = element.parentNode
  // 从父元素中删除 script 元素
  parent.removeChild(element)
  // 创建一个新的 script 元素
  const script = document.createElement('script')
  // 如果 script 元素有 id 属性，则将其赋值给新 script 元素
  if (element.id) {
    script.id = element.id
  }
  // 如果 script 元素有 className 属性，则将其赋值给新 script 元素
  if (element.className) {
    script.className = element.className
  }
  // 如果 script 元素有 type 属性，则将其赋值给新 script 元素
  if (element.type) {
    script.type = element.type
  }
  // 如果 script 元素有 src 属性，则将其赋值给新 script 元素
  if (element.src) {
    script.src = element.src
    // 强制同步加载外部 JS
    script.async = false
  }
  // 如果 script 元素有 dataset.pjax 属性，则将其赋值给新 script 元素
  if (element.dataset.pjax !== undefined) {
    script.dataset.pjax = ''
  }
  // 如果 script 元素有文本内容，将其添加到新 script 元素中
  if (code !== '') {
    script.appendChild(document.createTextNode(code))
  }
  // 将新 script 元素添加到父元素中
  parent.appendChild(script)
}

// const pageScrollOld = function (target:any, offset?:number, complete?:Function) {
//   const opt = {
//     targets: typeof offset === 'number' ? target.parentNode : document.scrollingElement,
//     duration: 500,
//     easing: 'easeInOutQuad',
//     scrollTop: offset || (typeof target === 'number' ? target : (target ? target.top() + document.documentElement.scrollTop - siteNavHeight : 0)),
//     complete: function () {
//       complete && complete()
//     }
//   }
//   anime(opt)
// }

const pageScroll = (target:any, offset?:number, complete?:Function) => {
  const opt:ScrollToOptions = {
    left: 0,
    behavior: "smooth"
  }
  if (typeof target === "number") {
    opt.top = target
  } else {
    if (typeof target === 'number') {
      opt.top = offset || target
    } else {
      if (offset || target) {
        opt.top = target.top() + document.documentElement.scrollTop - siteNavHeight
      } else {
        opt.top = 0
      }
    }
  }
  scrollTo(opt)
  complete && complete()
}
