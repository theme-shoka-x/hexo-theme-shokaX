/* global hexo */

import type { VendorsConfig } from '../utils'
import theme_env from '../../package.json'
import { htmlTag, url_for, stripHTML } from 'hexo-util'
import { getVendorLink } from '../utils'

hexo.extend.helper.register('_new_comments', function (mode) {
  const root = this.config.url.replace(/^(https?:\/\/)?[^\/]*/, '')
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
                          coms: comments,
                          root: '${root}'
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
        import { RecentComments } from 'https://npm.webcache.cn/@waline/client@v2/dist/waline.mjs'
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
                    coms: items,
                    root: '${root}'
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
  })).join('')
})

hexo.extend.helper.register('_js', function (...urls) {
  const { statics, js } = hexo.theme.config

  return urls.map(url => htmlTag('script', { src: url_for.call(this, `${statics}${js}/${url}?v=${theme_env.version}`) }, '')).join('')
})

hexo.extend.helper.register('vendor_js', function () {
  const vendors = hexo.theme.config.vendors as VendorsConfig
  let res = ''
  for (const jsSync in vendors.js) {
    res += htmlTag('script', { src: getVendorLink(hexo, vendors.js[jsSync]) }, '')
  }
  for (const jsAsync in vendors.async_js) {
    res += htmlTag('script', { src: getVendorLink(hexo, vendors.js[jsAsync]), async: true })
  }
  return res
})

hexo.extend.helper.register('_striptags', function (data) {
  return stripHTML(data)
})

hexo.extend.helper.register('_truncate', function (data, end) {
  return data.substring(0, end)
})
