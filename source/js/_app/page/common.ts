import { $dom } from '../library/dom'

export const cardActive = () => {
  if (!$dom('.index.wrap')) { return }
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

  $dom('.index.wrap .item:first-child').addClass('show')

  $dom.each('.cards .item', (element) => {
    ['mouseenter', 'touchstart'].forEach((item) => {
      element.addEventListener(item, () => {
        if ($dom('.cards .item.active')) {
          $dom('.cards .item.active').removeClass('active')
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

export const registerExtURL = () => {
  $dom.each('span.exturl', (element) => {
    const link = <HTMLAnchorElement>document.createElement('a')
    // https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings

    link.href = decodeURIComponent(window.atob(element.dataset.url).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    link.rel = 'noopener external nofollow noreferrer'
    link.target = '_blank'
    link.className = element.className
    link.title = element.title || element.innerText
    link.innerHTML = element.innerHTML
    if (element.dataset.backgroundImage) {
      link.dataset.backgroundImage = element.dataset.backgroundImage
    }
    element.parentNode.replaceChild(link, element)
  })
}
