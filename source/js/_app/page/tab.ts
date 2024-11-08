import { pageScroll } from '../library/anime'
import { createChild } from '../library/proto'

export const tabFormat = () => {
  // tab
  let first_tab:boolean
  document.querySelectorAll('div.tab').forEach((element) => {
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
      li.classList.add('active')
      element.classList.add('active')
    }

    li.addEventListener('click', (event) => {
      const target = event.currentTarget as HTMLElement
      box.querySelectorAll('.active').forEach((el) => {
        el.classList.remove('active')
      })
      element.classList.add('active')
      target.classList.add('active')
    })

    box.appendChild(element)
    element.setAttribute('data-ready', String(true))
  })
}
