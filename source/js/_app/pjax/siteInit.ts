import domInit from './domInit'
import { pjaxReload, siteRefresh } from './refresh'
import { cloudflareInit } from '../library/scriptPjax'
import { algoliaSearch } from '../page/search'
import { pjax, setPjax } from '../globals/globalVars'
import { autoDarkmode, themeColorListener } from '../globals/themeColor'
import { resizeHandle, scrollHandle, visibilityListener } from '../globals/handles'
import { pagePosition } from '../globals/tools'
import { initFireworks } from '../fireworks'
import Pjax from 'theme-shokax-pjax'
import { initVue } from '../library/vue'

const siteInit = () => {
  domInit()
  initVue()

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
  quicklink.listen(CONFIG.quicklink)
  autoDarkmode()

  if (!CONFIG.disableVL) {
    visibilityListener()
  }
  themeColorListener()

  algoliaSearch(pjax)

  initFireworks()

  window.addEventListener('scroll', scrollHandle)

  window.addEventListener('resize', resizeHandle)

  window.addEventListener('pjax:send', pjaxReload)

  window.addEventListener('pjax:success', siteRefresh) // 默认会传入一个event参数

  window.addEventListener('beforeunload', () => {
    pagePosition()
  })
  // clickMenu() TODO 暂时禁用
  siteRefresh(1)
}

cloudflareInit()

window.addEventListener('DOMContentLoaded', siteInit, {
  passive: true
})

console.log('%c Theme.ShokaX v' + CONFIG.version + ' %c https://github.com/theme-shoka-x/hexo-theme-shokaX ', 'color: white; background: #e9546b; padding:5px 0;', 'padding:4px;border:1px solid #e9546b;')
