/* global hexo */

'use strict'
const { htmlTag, url_for, stripHTML } = require('hexo-util')
const theme_env = require('../../package.json')

hexo.extend.helper.register('_init_comments', function (mode) {
  if (mode === 'twikoo') {
    const options = {
      // eslint-disable-next-line no-useless-escape
      envId: `${hexo.theme.config?.twikoo?.envId}`,
      el: '#tcomments'
    }
    if (hexo.theme.config.twikoo.mode === 'tencent') {
      // eslint-disable-next-line no-useless-escape
      options.region = `\'${hexo.theme.config.twikoo.region}\'`
    }
    return `
        <script data-pjax>
        setTimeout(function () {
            twikoo.init(${JSON.stringify(options)})
        }, 1000)
        </script>`
  } else if (mode === 'waline') {
    const options = {
      el: '#wcomments',
      serverURL: hexo.theme.waline.serverURL
    }
    return `
    <script type="module">
        import { init } from 'https://unpkg.com/@waline/client@v2/dist/waline.mjs'
        init(${JSON.stringify(options)});
    </script>
    <script nomodule type="text/javascript">
        Waline.init(${JSON.stringify(options)});
    </script>
    `
  }
})

hexo.extend.helper.register('_new_comments', function (mode) {
  if (mode === 'twikoo') {
    return `<script data-pjax>
           twikoo.getRecentComments({
           envId: "${hexo.theme.config?.twikoo?.envId}",
           pageSize: 10
           }).then(function (res) {
                res.forEach(function (item) {
                    let siteLink = item.url + "#" + item.id
                    let commentList = document.getElementById("new-comment")
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
  } else if (mode === 'waline') {
    return `
    <script type="module">
        import { RecentComments } from 'https://unpkg.com/@waline/client@v2/dist/waline.mjs'
        RecentComments({
          el: '#new-comment',
          serverURL: 'http://waline.vercel.app',
          count: 10,
        });
    </script>
    <script nomodule type="text/javascript">
        Waline.RecentComments({
          el: '#new-comment',
          serverURL: '${hexo.theme.waline.serverURL}',
          count: 10,
        });
    </script>
    `
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
  const srcHelpers = (src) => { return src.endsWith('/') ? src : src + '/' }
  const config = hexo.theme.config.advVendors.js[js_name]
  const themeConfig = hexo.theme.config
  const src = config.src
  const publicCdns = {
    npm: srcHelpers(themeConfig.advVendors.npm),
    gh: srcHelpers(themeConfig.advVendors.github),
    combine: srcHelpers(themeConfig.advVendors.combine),
    bytedance: 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-6-M/',
    baomitu: 'https://lib.baomitu.com/'
  }
  let result
  if (src.startsWith('http')) {
    result = src
  } else if (src.startsWith('combine:')) {
    hexo.log.info('The combine feature is not recommended!')
    result = publicCdns.combine + src
  } else if (src.startsWith('npm:')) {
    result = publicCdns.npm + src.substring(4)
  } else if (src.startsWith('gh:')) {
    result = publicCdns.gh + src.substring(3)
  } else if (src.startsWith('bytedance:')) {
    result = publicCdns.bytedance + src.substring(10)
  } else if (src.startsWith('baomitu:')) {
    result = publicCdns.baomitu + src.substring(8)
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

hexo.extend.helper.register('_striptags', function (data) {
  return stripHTML(data)
})

hexo.extend.helper.register('_truncate', function (data, end) {
  return data.substring(0, end)
})
