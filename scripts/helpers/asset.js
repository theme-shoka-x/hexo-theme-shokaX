/* global hexo */

'use strict'
const { htmlTag, url_for } = require('hexo-util')
const theme_env = require('../../package.json')

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
  const fontHost = '//fonts.geekzu.org'

  // Get a font list from config
  let fontFamilies = ['global', 'logo', 'title', 'headings', 'posts', 'codes'].map(item => {
    if (config[item] && config[item].family && config[item].external) {
      return config[item].family + fontStyles
    }
    return ''
  })

  fontFamilies = fontFamilies.filter(item => item !== '')
  fontFamilies = [...new Set(fontFamilies)]
  fontFamilies = fontFamilies.join('|')

  // Merge extra parameters to the final processed font string
  return fontFamilies
    ? htmlTag('link', {
      rel: 'stylesheet',
      href: `${fontHost}/css?family=${fontFamilies.concat(fontDisplay, fontSubset)}`
    })
    : ''
})

hexo.extend.helper.register('_vendor_js', () => {
  const config = hexo.theme.config.vendors.js

  if (!config) return ''

  // Get a font list from config
  let vendorJs = ['pace', 'pjax', 'fetch', 'anime', 'algolia', 'instantsearch', 'lazyload', 'quicklink'].map(item => {
    if (config[item]) {
      return config[item]
    }
    return ''
  })

  vendorJs = vendorJs.filter(item => item !== '')
  vendorJs = [...new Set(vendorJs)]
  vendorJs = vendorJs.join(',')
  return vendorJs ? htmlTag('script', { src: `https://cdn.jsdelivr.net/combine/${vendorJs}` }, '') : ''
})

hexo.extend.helper.register('_css', function (...urls) {
  const { statics, css } = hexo.theme.config

  return urls.map(url => htmlTag('link', {
    rel: 'stylesheet',
    href: url_for.call(this, `${statics}${css}/${url}?v=${theme_env.version}`)
  })).join('')
})

hexo.extend.helper.register('_js', function (...urls) {
  const { statics, js } = hexo.theme.config

  return urls.map(url => htmlTag('script', { src: url_for.call(this, `${statics}${js}/${url}?v=${theme_env.version}`) }, '')).join('')
})
hexo.extend.helper.register('_list_vendor_js', () => {
  return hexo.theme.config.vendorsList.js
})

hexo.extend.helper.register('_adv_vendor_js', function (js_name) {
  const config = hexo.theme.config.advVendors.js[js_name]
  const src = config.src
  let result
  if (src.indexOf('http') !== -1) {
    result = src
  } else if (src.indexOf('combine') !== -1) {
    console.log('The combine feature is not recommended!')
    result = hexo.theme.config.advVendors.combine + src
  } else if (src.indexOf('npm') !== -1) {
    result = hexo.theme.config.advVendors.npm + src.slice(4)
  } else if (src.indexOf('gh') !== -1) {
    result = hexo.theme.config.advVendors.github + src.slice(3)
  } else {
    result = '/' + src
  }
  let attr = { src: result }
  if (config.async) attr.async = 'async'
  if (config['data-pjax']) attr['data-pjax'] = 'data-pjax'
  if (config['hash-value']) attr.integrity = config['hash-value']
  if (config.deferLoad) {
    return htmlTag('script', { 'data-pjax': true }, `
        const script=document.createElement("script");script.src="${result}",script.async=true,document.body.appendChild(script)
        `)
  }
  return htmlTag('script', attr, '')
})
