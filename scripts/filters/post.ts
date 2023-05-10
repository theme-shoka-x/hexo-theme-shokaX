/* global hexo */

hexo.extend.filter.register('after_post_render', (data) => {
  const { config } = hexo

  // 使用正则表达式将<img>标签的src属性替换为data-src属性
  data.content = data.content.replace(/(<img[^>]*) src=/img, '$1 data-src=')

  // 从config对象中获取站点URL的主机名
  const siteHost:string = new URL(config.url).hostname || config.url
  // 使用正则表达式将<a>标签转换为<span>标签，并添加自定义属性以记录链接URL
  data.content = data.content.replace(/<a[^>]* href="([^"]+)"[^>]*>([^<]*)<\/a>/img, (match:string, href:string, html:string) => {
    if (!href) return match // 如果href不存在，则返回原始的<a>标签

    // 创建一个新的URL对象来检查链接URL的主机名是否与站点URL相同
    const link = new URL(href, config.url)
    if (!link.protocol || link.hostname === siteHost) return match

    // 将链接URL转换为Base64编码的字符串，并将其添加到新的<span>标签中作为自定义属性
    return `<span class="exturl" data-url="${Buffer.from(href).toString('base64')}">${html}</span>`
  })
}, 0)
