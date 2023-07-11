const siteInit = () => {
  domInit()

  pjax = new Pjax({
    selectors: [
      'head title',
      '.languages',
      '.twikoo',
      '.pjax',
      '.leancloud-recent-comment',
      'script[data-config]'
    ],
    cacheBust: false
  })

  CONFIG.quicklink.ignores = LOCAL.ignores
  quicklink.listen(CONFIG.quicklink)
  autoDarkmode()

  if (!CONFIG.disableVL) {
    visibilityListener()
  }
  themeColorListener()

  algoliaSearch(pjax)

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

window.addEventListener('DOMContentLoaded', siteInit, {
  passive: true
})

console.log('%c Theme.ShokaX v' + CONFIG.version + ' %c https://github.com/theme-shoka-x/hexo-theme-shokaX ', 'color: white; background: #e9546b; padding:5px 0;', 'padding:4px;border:1px solid #e9546b;')
