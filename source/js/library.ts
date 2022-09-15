/**
 * 获取一个dom选择器对应的元素
 */
const $dom = (selector:string, element:Document):HTMLElement|null => {
  element = element || document
  if (selector.indexOf('#') === 0) {
    return element.getElementById(selector.replace('#', ''))
  }
  return element.querySelector(selector)
}
/**
 * 获取具有此选择器的所有dom节点
 */
$dom.all = (selector:string, element:Document):NodeListOf<Element> => {
  element = element || document
  return element.querySelectorAll(selector)
}
/**
 * 获取具有此选择器的所有dom节点,并依次执行callback函数
 */
$dom.each = (selector:string, callback:(value: Element, key: number, parent: NodeListOf<Element>) => void, element:Document):void => {
  return $dom.all(selector, element).forEach(callback)
}

Object.assign(HTMLElement.prototype, {
  /**
     * 创建一个子节点并放置
     */
  // eslint-disable-next-line @typescript-eslint/ban-types
  createChild: function (tag:string, obj:Object, positon: string | null):HTMLElement {
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
  height: function (h:number|string):number {
    if (h) {
      this.style.height = typeof h === 'number' ? h + 'rem' : h
    }
    return this.getBoundingClientRect().height
  },
  width: function (w:number|string):number {
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
  attr: function (type:string, value:null|string):void|null|string {
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
  display: function (d:null|string):string|any {
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
  find: function (selector:string):NodeListOf<Element> {
    return $dom.all(selector, this)
  },
  _class: function (type:string, className:string, display?:boolean):void {
    const classNames = className.indexOf(' ') ? className.split(' ') : [className]
    // const that = this
    classNames.forEach(function (name) {
      if (type === 'toggle') {
        this.classList.toggle(name, display)
      } else {
        this.classList[type](name)
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
