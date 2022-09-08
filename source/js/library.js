/**
 *
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

$dom.all = (selector, element) => {
  element = element || document
  return element.querySelectorAll(selector)
}

$dom.each = (selector, callback, element) => {
  return $dom.all(selector, element).forEach(callback)
}

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
