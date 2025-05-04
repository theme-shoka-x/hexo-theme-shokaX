import type Hexo from 'hexo'

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

type vendorSource = {
  source: string
  url: string
  sri?: string
}

type vendorUrl = {
  url: string
  local: boolean
  sri?: string
}

export function getVendorLink (hexo: Hexo, source:vendorSource):vendorUrl {
  const vendorsCfg = (hexo.theme.config as any).vendors as VendorsConfig
  if (source.source === "local") {
    return {
      url: source.url,
      local: true,
      sri: ''
    }
  } else {
    return {
        url: vendorsCfg.cdns[source.source] + '/' + source.url,
        local: false,
        sri: source.sri
    }
  }
}
