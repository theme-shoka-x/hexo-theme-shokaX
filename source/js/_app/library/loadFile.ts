import { getScript } from './scriptPjax'
import { CONFIG } from '../globals/globalVars'
import { createChild } from './proto'

/**
 * 用途是根据不同的资源名称和类型生成相应的资源 URL。
 */
const assetUrl = (asset: string, type: string): string => {
  const str = CONFIG[asset][type].url as string
  if (str.startsWith('https')) {
    return str
  }
  if (str.startsWith('http')) {
    console.warn(`Upgrade vendor ${asset}/${type} to HTTPS, Please use HTTPS url instead of HTTP url.`)
    return str.replace('http', 'https')
  }
  return `/${str}`
}

export const vendorJs = (type: string, callback?: Function, condition?: string) => {
  if (LOCAL[type]) {
    getScript(assetUrl('js', type),CONFIG['js'][type].sri, callback || function () {
      window[type] = true
    }, condition || window[type])
  }
}

export const vendorCss = (type: string, condition?: string): void => {
  if (window['css' + type]) {
    return
  }

  if (LOCAL[type]) {
    const attr:any = {
      rel: 'stylesheet',
      href: assetUrl('css', type),
    }
    const vendor = CONFIG['css'][type] as vendorUrl
    if (!vendor.local) {
      attr.integrity = vendor.sri
      attr.crossOrigin = 'anonymous'
    }
    createChild(document.head, 'link', attr)

    window['css' + type] = true
  }
}
