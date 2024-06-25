import { $dom } from './dom'

export const insertAfter = function (el: Element, element: HTMLElement): void {
  const parent = el.parentNode
  if (parent.lastChild === el) {
    parent.appendChild(element)
  } else {
    parent.insertBefore(element, el.nextSibling)
  }
}

/**
 * 创建一个子节点并放置
 */
export const createChild = function (parent: Element, tag: string, obj: object, positon?: string): HTMLElement {
  const child = document.createElement(tag)
  Object.assign(child, obj)
  switch (positon) {
    case 'after':
      insertAfter(parent, child)
      break
    case 'replace':
      parent.innerHTML = ''
      parent.appendChild(child)
      break
    default:
      parent.appendChild(child)
  }
  return child
}

/**
 *  此方法使用`<div>`包装一个 DOM 元素
 * @param parent
 * @param obj 需要被包装的对象
 */
export const wrapObject = function (parent: HTMLElement, obj: any): void {
  const box = document.createElement('div')
  Object.assign(box, obj)
  parent.parentNode.insertBefore(box, parent)
  parent.parentNode.removeChild(parent)
  box.appendChild(parent)
}

export const getHeight = function (el: HTMLElement): number {
  return el.getBoundingClientRect().height
}

export const setWidth = function (el: HTMLElement, w: number|string): void {
  el.style.width = typeof w === 'number' ? w + 'rem' : w
}

export const getWidth = function (el: HTMLElement): number {
  return el.getBoundingClientRect().width
}

export const getTop = function (el: HTMLElement): number {
  return el.getBoundingClientRect().top
}

export const getLeft = function (el: HTMLElement): number {
  return el.getBoundingClientRect().left
}

export const getDisplay = function (el: HTMLElement): string {
  return el.style.display
}

export const setDisplay = function (el: HTMLElement, d: string): HTMLElement {
  el.style.display = d
  return el
}

export default function initProto () {
  Object.assign(HTMLElement.prototype, {
    /**
   * 找到此节点所有符合selector选择器的子节点
     * @deprecated Will be removed in the v0.5
   */
    find (selector: string): NodeListOf<HTMLElement> {
      return $dom.all(selector, this)
    },
    /**
     * 这个方法接受三个参数：
     * type 表示操作类型（'add'、'remove'、'toggle'），
     * className 是一个或多个要操作的类名，
     * display 是一个可选的布尔值，用于在执行切换操作时指定类名是否应显示或隐藏。
     * 该方法会根据操作类型执行相应的类名操作。
     * @deprecated Will be removed in the v0.5
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
    /**
     * 这个方法是对 _class 方法的封装，调用时会将操作类型设为 'add'，然后执行添加类名的操作。
     * 最后，它返回当前的 EventTarget，通常是 DOM 元素本身，以支持链式调用。
     * @deprecated Will be removed in the v0.5
     */
    addClass (className: string): EventTarget {
      this._class('add', className)
      return this
    },
    /**
     * 这个方法是对 _class 方法的封装，调用时会将操作类型设为 'remove'，然后执行移除类名的操作。
     * 最后，它返回当前的 EventTarget，通常是 DOM 元素本身，以支持链式调用。
     * @deprecated Will be removed in the v0.5
     */
    removeClass (className: string): EventTarget {
      this._class('remove', className)
      return this
    },
    /**
     * 这个方法是对 _class 方法的封装，调用时会将操作类型设为 'toggle'，然后执行切换类名的操作。
     * 如果提供了 display 参数，它将根据布尔值决定是否显示或隐藏类名。
     * 最后，它返回当前的 EventTarget，通常是 DOM 元素本身，以支持链式调用。
     * @deprecated Will be removed in the v0.5
     */
    toggleClass (className: string, display?: boolean): EventTarget {
      this._class('toggle', className, display)
      return this
    },
    /**
     * 这个方法返回一个布尔值，表示元素是否包含指定的类名。
     * @deprecated Will be removed in the v0.5
     */
    hasClass (className: string): boolean {
      return this.classList.contains(className)
    }
  })
}
