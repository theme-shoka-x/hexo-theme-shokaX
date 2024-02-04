import domInit from './domInit'
import { pjaxReload, siteRefresh } from './refresh'
import { cloudflareInit } from '../library/scriptPjax'
import { CONFIG, pjax, setPjax } from '../globals/globalVars'
import { autoDarkmode, themeColorListener } from '../globals/themeColor'
import { resizeHandle, scrollHandle, visibilityListener } from '../globals/handles'
import { pagePosition } from '../globals/tools'
import Pjax from 'theme-shokax-pjax'
import { initVue } from '../library/vue'
import { lazyLoad } from 'unlazy'

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
    import('../page/search').then(({ algoliaSearch }) => {
      algoliaSearch(pjax)
    })
  }

  if (__shokax_fireworks__) {
    import('mouse-firework').then((firework) => {
      firework.default(CONFIG.fireworks)
    })
  }
  lazyLoad()

  window.addEventListener('scroll', scrollHandle)

  window.addEventListener('resize', resizeHandle)

  window.addEventListener('pjax:send', pjaxReload)

  window.addEventListener('pjax:success', siteRefresh) // 默认会传入一个event参数

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
