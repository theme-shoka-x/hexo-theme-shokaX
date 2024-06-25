import { $dom } from '../library/dom'

export const cardActive = () => {
  if (!document.querySelector('.index.wrap')) { return }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((article) => {
      if (article.target.hasClass('show')) {
        io.unobserve(article.target)
      } else {
        if (article.isIntersecting || article.intersectionRatio > 0) {
          article.target.addClass('show')
          io.unobserve(article.target)
        }
      }
    })
  }, {
    root: null,
    threshold: [0.3]
  })

  $dom.each('.index.wrap article.item, .index.wrap section.item', (article) => {
    io.observe(article)
  })

  document.querySelector('.index.wrap .item:first-child').addClass('show')

  $dom.each('.cards .item', (element) => {
    ['mouseenter', 'touchstart'].forEach((item) => {
      element.addEventListener(item, () => {
        const cardEle = document.querySelector('.cards .item.active')
        if (cardEle) {
          cardEle.removeClass('active')
        }
        element.addClass('active')
      }, { passive: true })
    });
    ['mouseleave'].forEach((item) => {
      element.addEventListener(item, () => {
        element.removeClass('active')
      }, { passive: true })
    })
  })
}
