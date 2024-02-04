import { CONFIG } from '../globals/globalVars'
import { init, pageviewCount, RecentComments } from '@waline/client'

import { createApp } from 'vue'

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
  const root = shokax_siteURL.replace(/^(https?:\/\/)?[^/]*/, '')
  let items = []
  const { comments } = await RecentComments({
    serverURL: CONFIG.waline.serverURL.replace(/\/+$/, ''),
    count: 10
  })
  comments.forEach(function (item) {
    let cText = (item.orig.length > 50) ? item.orig.substring(0, 50) + '...' : item.orig
    item.url = item.url.startsWith('/') ? item.url : '/' + item.url
    const siteLink = item.url + '#' + item.objectId
    items.push({
      href: siteLink,
      nick: item.nick,
      // @ts-ignore
      time: item.insertedAt.split('T').shift(),
      text: cText
    })
  })
  createApp({
    data () {
      return {
        coms: items,
        root
      }
    }
  }).mount('#new-comment')
}
