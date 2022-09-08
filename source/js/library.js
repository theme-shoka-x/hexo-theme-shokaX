/**
 * 通过选择器获取一个dom元素
 * @param {string} selector
 * @param {*} element
 */
const $dom = (selector, element) => {
  element = element || document
  if (selector.indexOf('#') === 0) {
    return element.getElementById(selector.replace('#', ''))
  }
  return element.querySelector(selector)
}
/**
 * 获取具有此选择器的所有dom节点
 * @param {string} selector
 * @param {*} element
 * @returns {NodeListOf<*>}
 */
$dom.all = (selector, element) => {
  element = element || document
  return element.querySelectorAll(selector)
}

/**
 * 获取具有此选择器的所有dom节点,并依次执行callback函数
 * @param {string} selector
 * @param {function} callback
 * @param {*} element
 * @returns {void}
 */
$dom.each = (selector, callback, element) => {
  return $dom.all(selector, element).forEach(callback)
}

Object.assign(HTMLElement.prototype, {
  /**
   * 创建一个子节点并放置
   * @param {string} tag html标签
   * @param obj assign的source
   * @param {string} positon 放置位置
   * @returns {HTMLElement}
   */
  createChild: function (tag, obj, positon) {
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
  wrap: function (obj) {
    const box = document.createElement('div')
    Object.assign(box, obj)
    this.parentNode.insertBefore(box, this)
    this.parentNode.removeChild(this)
    box.appendChild(this)
  },
  height: function (h) {
    if (h) {
      this.style.height = typeof h === 'number' ? h + 'rem' : h
    }
    return this.getBoundingClientRect().height
  },
  width: function (w) {
    if (w) {
      this.style.width = typeof w === 'number' ? w + 'rem' : w
    }
    return this.getBoundingClientRect().width
  },
  top: function () {
    return this.getBoundingClientRect().top
  },
  left: function () {
    return this.getBoundingClientRect().left
  },
  attr: function (type, value) {
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
  insertAfter: function (element) {
    const parent = this.parentNode
    if (parent.lastChild === this) {
      parent.appendChild(element)
    } else {
      parent.insertBefore(element, this.nextSibling)
    }
  },
  display: function (d) {
    if (d == null) {
      return this.style.display
    } else {
      this.style.display = d
      return this
    }
  },
  child: function (selector) {
    return $dom(selector, this)
  },
  find: function (selector) {
    return $dom.all(selector, this)
  },
  _class: function (type, className, display) {
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
  addClass: function (className) {
    this._class('add', className)
    return this
  },
  removeClass: function (className) {
    this._class('remove', className)
    return this
  },
  toggleClass: function (className, display) {
    this._class('toggle', className, display)
    return this
  },
  hasClass: function (className) {
    return this.classList.contains(className)
  }
})

const $storage = {
  set: (key, value) => {
    localStorage.setItem(key, value)
  },
  get: (key) => {
    localStorage.getItem(key)
  },
  del: (key) => {
    localStorage.removeItem(key)
  }
}
