import twikoo from 'twikoo'
import { CONFIG } from '../globals/globalVars'
import { $dom } from '../library/dom'

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
  const newComments = new DocumentFragment()
  comments.forEach(function (item) {
    const commentEl = document.createElement('li')
    const commentLink = document.createElement('a')
    const commentTime = document.createElement('span')
    const commentText = document.createElement('span')

    commentText.innerText = item.text
    commentTime.className = 'breadcrumb'
    commentTime.innerText = `${item.nick} @ ${item.time}`
    commentLink.href = root + item.href
    commentLink['data-pjax-state'] = 'data-pjax-state'
    commentEl.className = 'item'

    commentText.appendChild(document.createElement('br'))
    commentLink.appendChild(commentTime)
    commentLink.appendChild(commentText)
    commentEl.appendChild(commentLink)
    newComments.appendChild(commentEl)
  })

  $dom('#new-comment').appendChild(newComments)
}
