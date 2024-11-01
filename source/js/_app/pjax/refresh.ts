import { cardActive } from '../page/common'
import { resizeHandle } from '../globals/handles'
import {
  CONFIG,
  setLocalHash, setLocalUrl, setOriginTitle,
  toolPlayer
} from '../globals/globalVars'
import { positionInit } from '../globals/tools'
import { menuActive, sideBarTab, sidebarTOC } from '../components/sidebar'
import { Loader, isOutime } from '../globals/thirdparty'
import { tabFormat } from '../page/tab'
import { lazyLoad } from 'unlazy'

export const siteRefresh = async (reload) => {
  setLocalHash(0)
  setLocalUrl(window.location.href)

  // @ts-ignore
  // await import('katex/dist/katex.min.css')
  await import('katex/dist/contrib/copy-tex.mjs')

  // 懒加载背景图
  const lazyBg = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement
        el.style.backgroundImage = `url("${el.getAttribute('data-background-image')}")`
        el.removeAttribute('data-background-image')
        observer.unobserve(el)
      }
    })
  }, {
    root: null,
    threshold: 0.2
  })
  document.querySelectorAll('[data-background-image]').forEach(el => {
    lazyBg.observe(el)
  })

  setOriginTitle(document.title)

  resizeHandle()

  menuActive()

  sideBarTab()
  sidebarTOC()

  import('../page/post').then(({postBeauty}) => {
    postBeauty()
  })

  const cpel = document.getElementById('copyright')
  if (cpel) {
    const comment = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (__shokax_waline__) {
            import('../components/comments').then(({walinePageview, walineComment}) => {
              walinePageview()
              walineComment()
            })
          }
          if (__shokax_twikoo__) {
            import('../components/tcomments').then(({twikooComment}) => {
              twikooComment()
            })
          }
          comment.disconnect()
        }
      })
    }, {
      root: null,
      threshold: 0.2
    })

    comment.observe(cpel)
  }

  lazyLoad()

  if (__shokax_waline__) {
    import('../components/comments').then(async ({walineRecentComments}) => {
      await walineRecentComments()
    })
  }

  if (__shokax_twikoo__) {
    import('../components/tcomments').then(async ({twikooRecentComments}) => {
      await twikooRecentComments()
    })
  }

  if (__shokax_tabs__) {
    tabFormat()
  }

  if (__shokax_player__) {
    toolPlayer.player.load(LOCAL.audio || CONFIG.audio || {})
  }
  Loader.hide(100)

  setTimeout(() => {
    positionInit()
  }, 500)

  cardActive()

  if (__shokax_outime__ && LOCAL.ispost) {
    isOutime()
  }
}
