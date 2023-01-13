/* global hexo */

hexo.on('generateBefore', () => {
  // 加载`theme_injects`过滤器
  require('./lib/injects')(hexo)
})
