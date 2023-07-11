const pjaxReload = () => {
  pagePosition()

  if (sideBar.hasClass('on')) {
    transition(sideBar, 0, () => {
      sideBar.removeClass('on')
      menuToggle.removeClass('close')
    }) // 'transition.slideRightOut'
  }
  const mainNode = $dom('#main')
  mainNode.innerHTML = ''
  mainNode.appendChild(loadCat.lastChild.cloneNode(true))
  pageScroll(0)
}

const siteRefresh = (reload) => {
  LOCAL_HASH = 0
  LOCAL_URL = window.location.href

  vendorCss('katex')
  vendorJs('copy_tex')
  vendorCss('mermaid')
  vendorJs('chart')

  if (reload !== 1) {
    $dom.each('script[data-pjax]', pjaxScript)
  }

  originTitle = document.title

  resizeHandle()

  menuActive()

  sideBarTab()
  sidebarTOC()

  registerExtURL()
  postBeauty()
  tabFormat()
  if (typeof mediaPlayer !== 'undefined') {
    toolPlayer.player.load(LOCAL.audio || CONFIG.audio || {})
  }
  Loader.hide()

  setTimeout(() => {
    positionInit()
  }, 500)

  cardActive()

  lazyload.observe()
  isOutime()
}
