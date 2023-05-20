/* global hexo */

import theme_env from '../../package.json'
// @ts-ignore
import { htmlTag, url_for, stripHTML } from 'hexo-util'

hexo.extend.helper.register('_new_comments', function (mode) {
  if (mode === 'twikoo') {
    return `<script data-pjax type="module">
            let comments = []
           twikoo.getRecentComments({
           envId: "${hexo.theme.config?.twikoo?.envId}",
           pageSize: 10
           }).then(function (res) {
                res.forEach(function (item) {
                    let cText = item.commentText
                    if (item.commentText.length > 50) {
                        cText = item.commentText.substring(0,50)+'...'
                    }
                    const siteLink = item.url + "#" + item.id
                    comments.push({
                        href: siteLink,
                        nick: item.nick,
                        time: item.relativeTime,
                        text: cText
                    })
                });
                Vue.createApp({
                  data() {
                      return {
                          coms: comments
                      }
                  }
                  }).mount('#new-comment')
            }).catch(function (err) {
                console.error(err)
            })
        </script>`
  } else if (mode === 'waline') {
    return `
    <script type="module" data-pjax>
        let items = []
        import { RecentComments } from 'https://unpkg.com/@waline/client@v2/dist/waline.mjs'
        RecentComments({
          serverURL: '${hexo.theme.config.waline.serverURL.replace(/\/+$/, '')}',
          count: 10,
        }).then(({ comments }) => {
          comments.forEach(function (item) {
              let cText = (item.orig.length > 50) ? item.orig.substring(0,50)+'...' : item.orig
              item.url = item.url !== '/' ?  '/' + item.url : item.url;
              const siteLink = item.url + "#" + item.objectId
              items.push({
                  href: siteLink,
                  nick: item.nick,
                  time: item.insertedAt.split('T').shift(),
                  text: cText
              })
          })
          Vue.createApp({
            data() {
                return {
                    coms: items
                }
            }
          }).mount('#new-comment')
        }).catch(function (err) {
          console.error(err)
        })
    </script>
    `
  } else {
    console.log(`${mode} is not supported recent comment`)
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

// TODO 废弃方法
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
  // @ts-ignore
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
  const attr = {
    src: result,
    integrity: undefined,
    async: undefined
  }
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
