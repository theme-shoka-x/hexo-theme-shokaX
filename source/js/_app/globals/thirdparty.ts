// 与第三方js的交互或第三方嵌入js

import { CONFIG, loadCat } from './globalVars'
import { transition } from '../library/anime'

// 加载动画
export const Loader = {
  timer: undefined,
  lock: false,
  show () {
    clearTimeout(this.timer)
    document.body.removeClass('loaded')
    loadCat.setAttribute('style', 'display:block')
    Loader.lock = false
  },
  hide (sec?: number) {
    if (!CONFIG.loader.start) {
      sec = -1
    }
    this.timer = setTimeout(this.vanish, sec || 3000)
  },
  vanish (): void {
    if (Loader.lock) {
      return
    }
    if (CONFIG.loader.start) {
      transition(loadCat, 0)
    }
    document.body.addClass('loaded')
    Loader.lock = true
  }
}

export const isOutime = (): void => {
  let updateTime: Date
  const times = document.getElementsByTagName('time')
  if (times.length === 0) {
    return
  }
  const posts = document.getElementsByClassName('body md')
  if (posts.length === 0) {
    return
  }

  const now = Date.now() // 当前时间戳
  const pubTime = new Date(times[0].dateTime) // 文章发布时间戳
  if (times.length === 1) {
    updateTime = pubTime // 文章发布时间亦是最后更新时间
  } else {
    updateTime = new Date(times[1].dateTime) // 文章最后更新时间戳
  }
  // @ts-ignore
  const interval = parseInt(String(now - updateTime)) // 时间差
  const days = parseInt(String(CONFIG.outime.days)) || 30 // 设置时效，默认硬编码 30 天
  // 最后一次更新时间超过 days 天（毫秒）
  if (interval > (days * 86400000)) {
    // @ts-ignore
    const publish = parseInt(String((now - pubTime) / 86400000))
    const updated = parseInt(String(interval / 86400000))
    const template = LOCAL.template.replace('{{publish}}', String(publish)).replace('{{updated}}', String(updated))
    posts[0].insertAdjacentHTML('afterbegin', template)
  }
}
