import { $dom } from '../library/dom'
import { cardActive, registerExtURL } from '../page/common'
import { postBeauty } from '../page/post'
import { pageScroll, transition } from '../library/anime'
import { vendorCss, vendorJs } from '../library/loadFile'
import { pjaxScript } from '../library/scriptPjax'
import { resizeHandle } from '../globals/handles'
import {
  loadCat,
  menuToggle,
  setLocalHash, setLocalUrl, setOriginTitle,
  sideBar,
  toolPlayer
} from '../globals/globalVars'
import { mediaPlayer } from '../player'
import { pagePosition, positionInit } from '../globals/tools'
import { menuActive, sideBarTab, sidebarTOC } from '../components/sidebar'
import { Loader, isOutime, lazyload } from '../globals/thirdparty'
import { tabFormat } from '../page/tab'
export const pjaxReload = () => {
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

export const siteRefresh = (reload) => {
  setLocalHash(0)
  setLocalUrl(window.location.href)

  vendorCss('katex')
  vendorJs('copy_tex')
  vendorCss('mermaid')
  vendorJs('chart')

  if (reload !== 1) {
    $dom.each('script[data-pjax]', pjaxScript)
  }

  setOriginTitle(document.title)

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
