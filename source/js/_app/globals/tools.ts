import { pageScroll } from '../library/anime'
import { $dom } from '../library/dom'
import { $storage } from '../library/storage'
import { BODY, LOCAL_HASH, LOCAL_URL, scrollAction, setLocalHash } from './globalVars'

// 显示提示(现阶段用于版权及复制结果提示)
export const showtip = (msg: string): void | never => {
  if (!msg) {
    return
  }

  const tipbox = BODY.createChild('div', {
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
    target = $dom(decodeURI(anchor))
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
这段代码是用来复制文本的。它使用了浏览器的 Clipboard API，如果浏览器支持该 API 并且当前页面是安全协议 (https)，
它将使用 Clipboard API 将文本复制到剪贴板。如果不支持，它会创建一个隐藏的文本区域并使用 document.execCommand('copy') 将文本复制到剪贴板。
最后，它会回调传入的函数并传入一个布尔值表示是否成功复制。
*/
export const clipBoard = (str: string, callback?: (result) => void) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(str).then(() => {
      // eslint-disable-next-line chai-friendly/no-unused-expressions
      callback && callback(true)
    }, () => {
      // eslint-disable-next-line chai-friendly/no-unused-expressions
      callback && callback(false)
    })
  } else {
    // TODO 根据caniuse，需要此polyfill的设备不足5%，应考虑删除
    const ta = <HTMLTextAreaElement><unknown>BODY.createChild('textarea', {
      style: {
        top: window.scrollY + 'px',
        position: 'absolute',
        opacity: '0'
      },
      readOnly: true,
      value: str
    })

    const selection = document.getSelection()
    const selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false
    ta.select()
    ta.setSelectionRange(0, str.length)
    ta.readOnly = false
    const result = document.execCommand('copy')
    // eslint-disable-next-line chai-friendly/no-unused-expressions
    callback && callback(result)
    ta.blur() // For iOS
    if (selected) {
      selection.removeAllRanges()
      selection.addRange(selected)
    }
    BODY.removeChild(ta)
  }
}
