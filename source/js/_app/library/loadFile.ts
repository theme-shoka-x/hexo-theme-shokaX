import { getScript } from './scriptPjax'

/**
 * 用途是根据不同的资源名称和类型生成相应的资源 URL。
 */
const assetUrl = (asset: string, type: string): string => {
  const str = CONFIG[asset][type]
  if (str.includes('gh') || str.includes('combine')) {
    return `https://cdn.jsdelivr.net/${str}`
  }
  if (str.includes('npm')) {
    return `https://cdn.jsdelivr.net/${str}`
  }
  if (str.includes('http')) {
    return str
  }
  return `/${str}`
}

export const vendorJs = (type: string, callback?: Function, condition?: string) => {
  if (LOCAL[type]) {
    getScript(assetUrl('js', type), callback || function () {
      window[type] = true
    }, condition || window[type])
  }
}

export const vendorCss = (type: string, condition?: string): void => {
  if (window['css' + type]) {
    return
  }

  if (LOCAL[type]) {
    document.head.createChild('link', {
      rel: 'stylesheet',
      href: assetUrl('css', type)
    })

    window['css' + type] = true
  }
}
