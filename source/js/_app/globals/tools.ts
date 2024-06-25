import { pageScroll } from '../library/anime'
import { $dom } from '../library/dom'
import { $storage } from '../library/storage'
import { BODY, CONFIG, LOCAL_HASH, LOCAL_URL, scrollAction, setLocalHash } from './globalVars'
import { createChild } from '../library/proto'

// 显示提示(现阶段用于版权及复制结果提示)
export const showtip = (msg: string): void | never => {
  if (!msg) {
    return
  }

  const tipbox = createChild(BODY, 'div', {
    innerHTML: msg,
    className: 'tip'
  })

  setTimeout(() => {
    tipbox.addClass('hide')
    setTimeout(() => {
      BODY.removeChild(tipbox)
    }, 300)
  }, 3000)
}

export const pagePosition = () => {
  // 判断配置项是否开启了自动记录滚动位置
  if (CONFIG.auto_scroll) {
    // 将当前页面的滚动位置存入本地缓存
    $storage.set(LOCAL_URL, String(scrollAction.y))
  }
}

export const positionInit = (comment?: boolean) => {
  // 获取页面锚点
  const anchor = window.location.hash

  let target = null
  if (LOCAL_HASH) {
    $storage.del(LOCAL_URL)
    return
  }

  if (anchor) {
    target = document.querySelector(decodeURI(anchor))
  } else {
    target = CONFIG.auto_scroll ? parseInt($storage.get(LOCAL_URL)) : 0
  }

  if (target) {
    pageScroll(target)
    setLocalHash(1)
  }

  if (comment && anchor && !LOCAL_HASH) {
    pageScroll(target)
    setLocalHash(1)
  }
}

/*
基于clipboard API的复制功能，仅在https环境下有效
*/
export const clipBoard = (str: string, callback?: (result:boolean) => void) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(str).then(() => {
      callback && callback(true)
    }, () => {
      callback && callback(false)
    })
  } else {
    console.error('Too old browser, clipborad API not supported.')
    callback && callback(false)
  }
}
