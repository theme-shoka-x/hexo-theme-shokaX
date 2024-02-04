import { CONFIG } from '../globals/globalVars'
import { init, pageviewCount } from '@waline/client'

// await import('@waline/client/style')
// fixme 处理样式引入问题

export const walineComment = function () {
  init({
    el: '#comments',
    serverURL: CONFIG.waline.serverURL,
    lang: CONFIG.waline.lang,
    locale: CONFIG.waline.locale,
    emoji: CONFIG.waline.emoji,
    meta: CONFIG.waline.meta,
    requiredMeta: CONFIG.waline.requiredMeta,
    wordLimit: CONFIG.waline.wordLimit,
    pageSize: CONFIG.waline.pageSize,
    pageview: CONFIG.waline.pageview,
    path: window.location.pathname,
    dark: 'html[data-theme="dark"]'
  })
}

export const walinePageview = function () {
  pageviewCount({
    serverURL: CONFIG.waline.serverURL,
    path: window.location.pathname
  })
}

export const walineRecentComments = async function () {

}
