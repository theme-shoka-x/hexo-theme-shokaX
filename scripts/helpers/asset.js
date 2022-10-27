/* global hexo */

'use strict'
const { __ } = require('hexo-i18n')
const { htmlTag, url_for } = require('hexo-util')
const theme_env = require('../../package.json')
hexo.extend.helper.register('_init_comments', (mode) => {
  if (mode === 'twikoo') {
    const options = {
      envId: theme.twikoo.envId,
      el: '#tcomments'
    }
    if (theme.twikoo.mode === 'tencent') {
      options.region = theme.twikoo.region
    }
    return `
        <script data-pjax>
        setTimeout(function () {
        twikoo.init(${options})
        }, 1000)
        </script>`
  }
})

hexo.extend.helper.register('_new_comments', (mode) => {
  if (mode === 'twikoo') {
    return `<script data-pjax>
           twikoo.getRecentComments({
           envId: ${hexo.theme.config.twikoo.envId},
           pageSize: 10
           }).then(function (res) {
                res.forEach(function (item) {
                    let siteLink = item.url + "#" + item.id
                    let commentList = document.getElementById("twikoo_comment")
                    let commentElement = document.createElement("li");
                    commentElement.className = "item"
                    let commentLink = document.createElement("a")
                    commentLink.setAttribute("href", siteLink)
                    commentLink.setAttribute("data-pjax-state", "data-pjax-state")
                    let commenterAndTime = document.createElement("span")
                    commenterAndTime.innerText = item.nick + "@" + item.relativeTime
                    commenterAndTime.className = "breadcrumb"
                    let commentTextNode = document.createElement("span")
                    commentTextNode.innerText = item.commentText
                    commentLink.appendChild(commenterAndTime)
                    commentLink.appendChild(commentTextNode)
                    commentElement.appendChild(commentLink)
                    commentList.appendChild(commentElement)
                });
            }).catch(function (err) {
                console.log(err)
            })
        </script>`
  } else {
    // TODO waline
  }
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
    hexo.log.info('The combine feature is not recommended!')
    result = hexo.theme.config.advVendors.combine + src
  } else if (src.indexOf('npm') !== -1) {
    result = hexo.theme.config.advVendors.npm + src.slice(4)
  } else if (src.indexOf('gh') !== -1) {
    result = hexo.theme.config.advVendors.github + src.slice(3)
  } else {
    result = '/' + src
  }
  const attr = { src: result }
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

hexo.extend.helper.register('_local_script', (page) => {
  const theme = hexo.theme
  const LOCAL = {
    path: this._permapath(page.path),
    favicon: {
      show: __('favicon.show'),
      hide: __('favicon.hide')
    },
    search: {
      placeholder: __('search.placeholder'),
      empty: __('search.empty'),
      stats: __('search.stats')
    }
  }
  if (theme.widgets.recent_comments || page.comment !== false) {
    LOCAL.valine = page.valine ? JSON.stringify(page.valine) : 'true'
  }
  if (page.chart) LOCAL.chart = true
  if (page.math) {
    LOCAL.copy_tex = true; LOCAL.katex = true
  }
  return htmlTag('script', { 'data-config': true, type: 'text/javascript' }, JSON.stringify(LOCAL))
})
