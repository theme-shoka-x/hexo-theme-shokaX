import { pageScroll } from '../library/anime'
import { $dom } from '../library/dom'

export const tabFormat = () => {
  // tab
  let first_tab
  $dom.each('div.tab', (element) => {
    if (element.attr('data-ready')) { return }

    const id = element.attr('data-id')
    const title = element.attr('data-title')
    let box = $dom('#' + id)
    if (!box) {
      box = document.createElement('div')
      box.className = 'tabs'
      box.id = id
      box.innerHTML = '<div class="show-btn"></div>'

      const showBtn = box.child('.show-btn')
      showBtn.addEventListener('click', () => {
        pageScroll(box)
      })

      element.parentNode.insertBefore(box, element)
      first_tab = true
    } else {
      first_tab = false
    }

    let ul = box.child('.nav ul')
    if (!ul) {
      ul = box.createChild('div', {
        className: 'nav',
        innerHTML: '<ul></ul>'
      }).child('ul')
    }

    const li = ul.createChild('li', {
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
    element.attr('data-ready', String(true))
  })
}
