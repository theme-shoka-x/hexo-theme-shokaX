import { $dom } from '../library/dom'
import { cardActive } from '../page/common'
import { pageScroll, transition } from '../library/anime'
import { vendorCss, vendorJs } from '../library/loadFile'
import { pjaxScript } from '../library/scriptPjax'
import { resizeHandle } from '../globals/handles'
import {
  CONFIG,
  loadCat,
  menuToggle, pjax,
  setLocalHash, setLocalUrl, setOriginTitle,
  sideBar,
  toolPlayer
} from '../globals/globalVars'
import { pagePosition, positionInit } from '../globals/tools'
import { menuActive, sideBarTab, sidebarTOC } from '../components/sidebar'
import { Loader, isOutime } from '../globals/thirdparty'
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

  if (reload !== 1) {
    $dom.each('script[data-pjax]', pjaxScript)
  }

  setOriginTitle(document.title)

  resizeHandle()

  menuActive()

  sideBarTab()
  sidebarTOC()

  import('../page/post').then(({ postBeauty }) => {
    postBeauty()
  })

  if (__shokax_waline__ && LOCAL.ispost) {
    import('../components/comments').then(async ({ walineComment, walinePageview, walineRecentComments }) => {
      walineComment()
      walinePageview()
      await walineRecentComments()
    })
  }

  if (__shokax_twikoo__ && LOCAL.ispost) {
    import('../components/tcomments').then(async ({ twikooComment, twikooRecentComments }) => {
      twikooComment()
      await twikooRecentComments()
    })
  }

  if (__shokax_tabs__) {
    tabFormat()
  }

  if (__shokax_player__) {
    toolPlayer.player.load(LOCAL.audio || CONFIG.audio || {})
  }
  Loader.hide()

  setTimeout(() => {
    positionInit()
  }, 500)

  cardActive()

  if (__shokax_outime__) {
    isOutime()
  }
}
