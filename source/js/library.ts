/* global CONFIG */
declare interface Object {
  attr(type:string, value?:any):any
  removeClass(className:string):any
  addClass(className:string):any
  createChild(tag:string, obj:Object, positon?: string | null):HTMLElement
  child(selector:string):HTMLElement
  hasClass(className:string):boolean
  height(h?:number|string):number
  toggleClass(className:string, display?:boolean):any
  width(w?:number|string):number
  insertAfter(element:HTMLElement):void
  wrap(obj:Object)
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
  'favicon': {
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

Object.assign(HTMLElement.prototype, {
  /**
     * 创建一个子节点并放置
     */
  createChild: function (tag:string, obj:Object, positon?: string):HTMLElement {
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
  wrap: function (obj:Object) {
    const box = document.createElement('div')
    Object.assign(box, obj)
    this.parentNode.insertBefore(box, this)
    this.parentNode.removeChild(this)
    box.appendChild(this)
  },
  height: function (h?:number|string):number {
    if (h) {
      this.style.height = typeof h === 'number' ? h + 'rem' : h
    }
    return this.getBoundingClientRect().height
  },
  width: function (w?:number|string):number {
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
  attr: function (type:string, value?:any):any {
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
  insertAfter: function (element:HTMLElement):void {
    const parent = this.parentNode
    if (parent.lastChild === this) {
      parent.appendChild(element)
    } else {
      parent.insertBefore(element, this.nextSibling)
    }
  },
  display: function (d?:null|string):string|any {
    if (d == null) {
      return this.style.display
    } else {
      this.style.display = d
      return this
    }
  },
  child: function (selector:string):HTMLElement {
    return $dom(selector, this)
  },
  find: function (selector:string):NodeListOf<HTMLElement> {
    return $dom.all(selector, this)
  },
  _class: function (type: string, className: string, display?: boolean): void {
    const classNames = className.indexOf(' ') ? className.split(' ') : [className]
    const that = this
    classNames.forEach(function (name) {
        if (type === 'toggle') {
          that.classList.toggle(name, display)
        } else {
          that.classList[type](name)
        }
    })
  },
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

const getScript = function (url:string, callback:Function, condition:string):void {
  if (condition) {
    callback()
  } else {
    let script = document.createElement('script')

    // @ts-ignore TODO 有效性待验证
    script.onload = function (_, isAbort: boolean) {

      // @ts-ignore TODO 此处代码在非ie下可能无效
      if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
        script.onload = null
        script = undefined
        if (!isAbort && callback) setTimeout(callback, 0)
      }
    }
    script.src = url
    document.head.appendChild(script)
  }
}

const assetUrl = function (asset:string, type:string):string {
  const str = CONFIG[asset][type]
  if (str.indexOf('npm') > -1) { return `https://unpkg.com/${str}` }
  if (str.indexOf('gh') > -1 || str.indexOf('combine') > -1) { return `https://cdn.jsdelivr.net/${str}` }
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
  let display:any = 'none'
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
  // @ts-ignore
  anime(Object.assign({
    targets: target,
    duration: 200,
    easing: 'linear'
  }, animation)).finished.then(function () {
    target.display(display)
    complete && complete()
  })
}

const pjaxScript = function (element:HTMLScriptElement) {
  const code = element.text || element.textContent || element.innerHTML || ''
  const parent = element.parentNode
  parent.removeChild(element)
  const script = document.createElement('script')
  if (element.id) {
    script.id = element.id
  }
  if (element.className) {
    script.className = element.className
  }
  if (element.type) {
    script.type = element.type
  }
  if (element.src) {
    script.src = element.src
    // Force synchronous loading of peripheral JS.
    script.async = false
  }
  if (element.dataset.pjax !== undefined) {
    script.dataset.pjax = ''
  }
  if (code !== '') {
    script.appendChild(document.createTextNode(code))
  }
  parent.appendChild(script)
}

const pageScroll = function (target:any, offset?:number, complete?:Function) {
  const opt = {
    targets: typeof offset === 'number' ? target.parentNode : document.scrollingElement,
    duration: 500,
    easing: 'easeInOutQuad',
    scrollTop: offset || (typeof target === 'number' ? target : (target ? target.top() + document.documentElement.scrollTop - siteNavHeight : 0)),
    complete: function () {
      complete && complete()
    }
  }
  anime(opt)
}
