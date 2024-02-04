import domInit from './domInit'
import { pjaxReload, siteRefresh } from './refresh'
import { cloudflareInit } from '../library/scriptPjax'
import { BODY, CONFIG, pjax, setPjax, setSiteSearch, siteSearch } from '../globals/globalVars'
import { autoDarkmode, themeColorListener } from '../globals/themeColor'
import { resizeHandle, scrollHandle, visibilityListener } from '../globals/handles'
import { pagePosition } from '../globals/tools'
import Pjax from 'theme-shokax-pjax'
import { initVue } from '../library/vue'
import { lazyLoad } from 'unlazy'
import { $dom } from '../library/dom'
import { createChild } from '../library/proto'
import { transition } from '../library/anime'

const siteInit = () => {
  initVue()
  domInit()

  setPjax(new Pjax({
    selectors: [
      'head title',
      '.languages',
      '.twikoo',
      '.pjax',
      '.leancloud-recent-comment',
      'script[data-config]'
    ],
    cacheBust: false
  }))

  CONFIG.quicklink.ignores = LOCAL.ignores
  import('quicklink').then(({ listen }) => {
    listen(CONFIG.quicklink)
  })

  autoDarkmode()

  if (__shokax_VL__) {
    visibilityListener()
  }
  themeColorListener()

  if (__shokax_search__) {
    $dom('li.item.search > i').addEventListener('click', () => {
      if (CONFIG.search === null) { return }

      if (!siteSearch) {
        setSiteSearch(createChild(BODY, 'div', {
          id: 'search',
          innerHTML: '<div class="inner"><div class="header"><span class="icon"><i class="ic i-search"></i></span><div class="search-input-container"></div><span class="close-btn"><i class="ic i-times-circle"></i></span></div><div class="results"><div class="inner"><div id="search-stats"></div><div id="search-hits"></div><div id="search-pagination"></div></div></div></div>'
        }))
      }

      import('../page/search').then(({ algoliaSearch }) => {
        algoliaSearch(pjax)
      })

      // Handle and trigger popup window
      $dom.each('.search', (element) => {
        element.addEventListener('click', () => {
          document.body.style.overflow = 'hidden'
          transition(siteSearch, 'shrinkIn', () => {
            $dom('.search-input').focus()
          }) // transition.shrinkIn
        })
      })
    }, { once: true, capture: true })
  }

  if (__shokax_fireworks__) {
    import('mouse-firework').then((firework) => {
      firework.default(CONFIG.fireworks)
    })
  }
  lazyLoad()

  window.addEventListener('scroll', scrollHandle, {
    passive: true
  })

  window.addEventListener('resize', resizeHandle, {
    passive: true
  })

  window.addEventListener('pjax:send', pjaxReload, {
    passive: true
  })

  window.addEventListener('pjax:success', siteRefresh, {
    passive: true
  }) // 默认会传入一个event参数

  window.addEventListener('beforeunload', () => {
    pagePosition()
  })
  siteRefresh(1)
}

cloudflareInit()

window.addEventListener('DOMContentLoaded', siteInit, {
  passive: true
})

console.log('%c Theme.ShokaX v' + CONFIG.version + ' %c https://github.com/theme-shoka-x/hexo-theme-shokaX ', 'color: white; background: #e9546b; padding:5px 0;', 'padding:4px;border:1px solid #e9546b;')
