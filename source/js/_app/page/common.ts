export const cardActive = () => {
  if (!document.querySelector('.index.wrap')) { return }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((article) => {
      if (article.target.classList.contains('show')) {
        io.unobserve(article.target)
      } else {
        if (article.isIntersecting || article.intersectionRatio > 0) {
          article.target.classList.add('show')
          io.unobserve(article.target)
        }
      }
    })
  }, {
    root: null,
    threshold: [0.3]
  })

  document.querySelectorAll('.index.wrap article.item, .index.wrap section.item').forEach((article) => {
    io.observe(article)
  })

  document.querySelector('.index.wrap .item:first-child').classList.add('show')

  document.querySelectorAll('.cards .item').forEach((element) => {
    ['mouseenter', 'touchstart'].forEach((item) => {
      element.addEventListener(item, () => {
        const cardEle = document.querySelector('.cards .item.active')
        if (cardEle) {
          cardEle.classList.remove('active')
        }
        element.classList.add('active')
      }, { passive: true })
    });
    ['mouseleave'].forEach((item) => {
      element.addEventListener(item, () => {
        element.classList.remove('active')
      }, { passive: true })
    })
  })
}
