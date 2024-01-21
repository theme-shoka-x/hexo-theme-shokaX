import type Hexo from 'hexo'

declare const hexo:Hexo

export interface VendorsConfig {
  cdns: {
    [index:string]: string
  }
  css: {
    [index:string]: string
  }
  async_css: {
    [index:string]: string
  }
  js: {
    [index:string]: string
  }
  async_js: {
    [index:string]: string
  }
}

export function getVendorLink (hexo: Hexo, source:string) {
  const VendorsCfg = (hexo.theme.config as any).vendors as VendorsConfig
  const tagIdx = source.indexOf('|')
  if (tagIdx !== -1) {
    return `${VendorsCfg.cdns[source.substring(0, tagIdx)]}/${source.substring(tagIdx + 1)}`
  } else {
    return source
  }
}
