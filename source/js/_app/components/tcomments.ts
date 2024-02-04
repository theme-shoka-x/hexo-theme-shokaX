import twikoo from 'twikoo'
import { CONFIG } from '../globals/globalVars'
import { createApp } from 'vue'

export const twikooComment = function () {
  twikoo.init({
    envId: CONFIG.twikoo.envId,
    el: '#comments',
    region: CONFIG.twikoo.region
  })
}

export const twikooRecentComments = async function () {
  let comments = []
  const root = shokax_siteURL.replace(/^(https?:\/\/)?[^/]*/, '')
  const res = await twikoo.getRecentComments({
    envId: CONFIG.twikoo.envId,
    pageSize: 10
  })
  res.forEach(function (item) {
    let cText = item.commentText
    if (item.commentText.length > 50) {
      cText = item.commentText.substring(0, 50) + '...'
    }
    const siteLink = item.url + '#' + item.id
    comments.push({
      href: siteLink,
      nick: item.nick,
      time: item.relativeTime,
      text: cText
    })
  })
  createApp({
    data () {
      return {
        coms: comments,
        root
      }
    }
  }).mount('#new-comment')
}
