/* global hexo */

import type { VendorsConfig } from '../utils'
import theme_env from '../../package.json'
import { htmlTag, url_for, stripHTML } from 'hexo-util'
import { getVendorLink } from '../utils'

// TODO 弃用函数
hexo.extend.helper.register('_new_comments', function (mode) {
  return ''
})

hexo.extend.helper.register('_safedump', (source) => {
  return JSON.stringify(source)
})

hexo.extend.helper.register('hexo_env', function (type) {
  return this.env[type]
})

hexo.extend.helper.register('theme_env', function (type) {
  return theme_env[type]
})

hexo.extend.helper.register('_vendor_font', () => {
  const config = hexo.theme.config.font

  if (!config || !config.enable) return ''

  const fontDisplay = '&display=swap'
  const fontSubset = '&subset=latin,latin-ext'
  const fontStyles = ':300,300italic,400,400italic,700,700italic'
  const fontHost = 'https://fonts.googleapis.com'

  // Get a font list from config
  let fontFamilies = ['global', 'logo', 'title', 'headings', 'posts', 'codes'].map(item => {
    if (config[item] && config[item].family && config[item].external) {
      return config[item].family + fontStyles
    }
    return ''
  })

  fontFamilies = fontFamilies.filter(item => item !== '')
  // @ts-ignore
  fontFamilies = [...new Set(fontFamilies)]
  // @ts-ignore
  fontFamilies = fontFamilies.join('|')

  // Merge extra parameters to the final processed font string
  return fontFamilies
    ? htmlTag('link', {
      rel: 'stylesheet',
      href: `${fontHost}/css?family=${fontFamilies.concat(fontDisplay, fontSubset)}`
    })
    : ''
})

hexo.extend.helper.register('_css', function (...urls) {
  const { statics, css } = hexo.theme.config

  return urls.map(url => htmlTag('link', {
    rel: 'stylesheet',
    href: url_for.call(this, `${statics}${css}/${url}?v=${theme_env.version}`)
  }), '').join('')
})

hexo.extend.helper.register('_js', function (...urls) {
  const { statics, js } = hexo.theme.config

  return urls.map(url => htmlTag('script', { src: url_for.call(this, `${statics}${js}/${url}?v=${theme_env.version}`), type: 'module', fetchpriority: 'high', defer: true }, '')).join('')
})

hexo.extend.helper.register('vendor_js', function () {
  const vendors = hexo.theme.config.vendors as VendorsConfig
  let res = ''
  for (const jsSync in vendors.js) {
    res += htmlTag('script', { src: getVendorLink(hexo, vendors.js[jsSync]), async: true }, '')
  }
  // for (const jsAsync in vendors.async_js) {
  //   res += htmlTag('script', { src: getVendorLink(hexo, vendors.async_js[jsAsync]), async: true }, '')
  // }
  return res
})

hexo.extend.helper.register('_striptags', function (data) {
  return stripHTML(data)
})

hexo.extend.helper.register('_truncate', function (data, end) {
  return data.substring(0, end)
})
