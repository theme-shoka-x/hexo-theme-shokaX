/* global hexo */

hexo.extend.filter.register('after_post_render', (data) => {
  const { config } = hexo

  data.content = data.content.replace(/(<img[^>]*) src=/img, '$1 data-src=')

  const siteHost:string = new URL(config.url).hostname || config.url
  data.content = data.content.replace(/<a[^>]* href="([^"]+)"[^>]*>([^<]*)<\/a>/img, (match:string, href:string, html:string) => {
    if (!href) return match

    // Exit if the url has same host with `config.url`, which means it's an internal link.
    const link = new URL(href, config.url)
    if (!link.protocol || link.hostname === siteHost) return match

    return `<span class="exturl" data-url="${Buffer.from(href).toString('base64')}">${html}</span>`
  })
}, 0)
