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
