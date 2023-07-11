/* global hexo */

let findProblem = false

hexo.on('generateBefore', function () {
  if (hexo.config.highlight.enable || hexo.config.prismjs.enable) {
    findProblem = true
    hexo.log.error('[SXEC 101] Highlight.js or Prismjs enabled. The code block will render incomplete')
  }
  if (!hexo.config.autoprefixer || !hexo.config.markdown) {
    findProblem = true
    hexo.log.error(`[SXEC 102] Critical rendering plugins are missing or incorrectly configured. 
Some features will be disabled or render incorrectly`)
  }
  if (parseInt(process.version.match(/\d{2,3}/)[0]) < 18) {
    findProblem = true
    hexo.log.error('[SXEC 103] Too old Node.js version, install the latest LTS version')
  }
  if (!hexo.config.title || !hexo.config.description || !hexo.config.language || !hexo.config.timezone || !hexo.config.url) {
    findProblem = true
    hexo.log.warn('[SXEC 201] Essential information(title, desc, lang, etc) config incorrectly, Page will render incorrectly')
  }
  if (hexo.theme.config.gitalk.clientID || hexo.theme.config.giscus.repo) {
    hexo.log.info('You are using an untested feature and there may be undiscovered issues')
  }
})

hexo.on('generateAfter', function () {
  if (findProblem) {
    hexo.log.warn(`The environment check found some problems that can lead to rendering errors, effect errors, 
performance degradation, not working correctly, etc`)
    hexo.log.warn('ShokaX has output them into console, read them to get more information. You can search error code in docs(For example, SXEC 101)')
  }
})
