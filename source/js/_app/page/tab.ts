import { pageScroll } from '../library/anime'
import { $dom } from '../library/dom'
import { createChild } from '../library/proto'

export const tabFormat = () => {
  // tab
  let first_tab:boolean
  $dom.each('div.tab', (element) => {
    if (element.getAttribute('data-ready')) { return }

    const id = element.getAttribute('data-id')
    const title = element.getAttribute('data-title')
    let box = document.getElementById(id)
    if (!box) {
      box = document.createElement('div')
      box.className = 'tabs'
      box.id = id
      box.innerHTML = '<div class="show-btn"></div>'

      const showBtn = box.querySelector('.show-btn')
      showBtn.addEventListener('click', () => {
        pageScroll(box)
      })

      element.parentNode.insertBefore(box, element)
      first_tab = true
    } else {
      first_tab = false
    }

    let ul = box.querySelector('.nav ul')
    if (!ul) {
      ul = createChild(box, 'div', {
        className: 'nav',
        innerHTML: '<ul></ul>'
      }).querySelector('ul')
    }

    const li = createChild(ul, 'li', {
      innerHTML: title
    })

    if (first_tab) {
      li.addClass('active')
      element.addClass('active')
    }

    li.addEventListener('click', (event) => {
      const target = event.currentTarget
      box.find('.active').forEach((el) => {
        el.removeClass('active')
      })
      element.addClass('active')
      target.addClass('active')
    })

    box.appendChild(element)
    element.setAttribute('data-ready', String(true))
  })
}
