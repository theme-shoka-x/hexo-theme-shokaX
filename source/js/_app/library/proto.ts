Object.assign(HTMLElement.prototype, {
  /**
   * 创建一个子节点并放置
   */
  createChild (tag: string, obj: Object, positon?: string): HTMLElement {
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
  wrapObject (obj: Object) {
    const box = document.createElement('div')
    Object.assign(box, obj)
    this.parentNode.insertBefore(box, this)
    this.parentNode.removeChild(this)
    box.appendChild(this)
  },
  changeOrGetHeight (h?: number | string): number {
    if (h) {
      // TODO 0rem是期望的值吗?
      this.style.height = typeof h === 'number' ? h + 'rem' : h
    }
    return this.getBoundingClientRect().height
  },
  /**
   此函数将元素的宽度设置为指定值,如果未提供值,则返回元素的宽度.<br />
   宽度可以作为数字提供(假定它以`rem`为单位).作为字符串提供则直接设置为元素宽度
   */
  changeOrGetWidth (w?: number | string): number {
    if (w) {
      // TODO 0rem是期望的值吗?
      this.style.width = typeof w === 'number' ? w + 'rem' : w
    }
    return this.getBoundingClientRect().width
  },
  getTop (): number {
    return this.getBoundingClientRect().top
  },
  left (): number {
    return this.getBoundingClientRect().left
  },
  /**
   * 该函数接受两个参数：`type`字符串和 `value`字符串的可选参数。该函数具有基于参数值的三个主要逻辑分支。 <br />
   * 1. `value`如果是`null`，则该函数从当前上下文中删除具有`type`函数名称的属性。 <br />
   * 2. `value`如果为真，则该函数将使用`type`参数指定的名称将属性设置为当前上下文中`value`参数的值。然后，该函数返回当前上下文。 <br />
   * 3. `value`如果不是真，则该函数返回属性的值，该值具有当前上下文中的参数指定的名称。
   */
  attr (type: string, value?: string): void | EventTarget | string {
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
  insertAfter (element: HTMLElement): void {
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
  display (d?: string): string | EventTarget {
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
  child (selector: string): HTMLElement {
    return $dom(selector, this)
  },
  /**
   * 找到此节点所有符合selector选择器的子节点
   */
  find (selector: string): NodeListOf<HTMLElement> {
    return $dom.all(selector, this)
  },
  /**
   * 当输入type为toggle时,对每个className执行toggle操作 <br />
   * 反之,对每个className执行type操作
   */
  _class (type: string, className: string, display?: boolean): void {
    const classNames = className.indexOf(' ') ? className.split(' ') : [className]
    classNames.forEach((name) => {
      if (type === 'toggle') {
        this.classList.toggle(name, display)
      } else {
        this.classList[type](name)
      }
    })
  },
  addClass (className: string): EventTarget {
    this._class('add', className)
    return this
  },
  removeClass (className: string): EventTarget {
    this._class('remove', className)
    return this
  },
  toggleClass (className: string, display?: boolean): EventTarget {
    this._class('toggle', className, display)
    return this
  },
  hasClass (className: string): boolean {
    return this.classList.contains(className)
  }
})
