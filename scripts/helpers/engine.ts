/* global hexo */

'use strict'

// @ts-ignore
import { htmlTag, url_for } from 'hexo-util'

const randomServer = parseInt(String(Math.random() * 4), 10) + 1

const randomBG = function (count = 1, image_server = null, image_list = []) {
  let i
  if (image_server) {
    if (count && count > 1) {
      const arr = new Array(count)
      for (i = 0; i < arr.length; i++) {
        arr[i] = image_server + '?' + Math.floor(Math.random() * 999999)
      }

      return arr
    }

    return image_server + '?' + Math.floor(Math.random() * 999999)
  }

  const parseImage = function (img, size) {
    if (img.startsWith('//') || img.startsWith('http')) {
      return img
    } else if (hexo.theme.config.experiments?.usingRelative) { // support relative url
      return img
    } else {
      console.warn("sinaimg blocked all request from outside website,so don't use this format")
      return `https://tva${randomServer}.sinaimg.cn/` + size + '/' + img
    }
  }

  if (count && count > 1) {
    const shuffled = image_list.slice(0)
    i = image_list.length
    const min = i - count; let temp; let index
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random())
      temp = shuffled[index]
      shuffled[index] = shuffled[i]
      shuffled[i] = temp
    }

    return shuffled.slice(min).map(function (img) {
      return parseImage(img, 'large')
    })
  }

  return parseImage(image_list[Math.floor(Math.random() * image_list.length)], 'mw690')
}

// 注册hexo主题中的URL帮助方法
hexo.extend.helper.register('_url', function (path, text, options = {}) {
  // 如果未提供URL路径，则返回
  if (!path) { return }

  // 获取hexo配置和URL路径信息
  const { config } = this
  const data = new URL(path, hexo.config.url)
  const siteHost = new URL(config.url).hostname || config.url

  // 获取主题配置
  const theme = hexo.theme.config
  let exturl = ''
  let tag = 'a'
  let attrs: { class: string; 'data-url': any; [index:string]:any } = { href: url_for.call(this, path), class: undefined, external: undefined, rel: undefined, 'data-url': undefined }

  // 如果启用了 `exturl`，则只为外部链接设置spanned链接。
  if (theme.exturl && data.protocol && data.hostname !== siteHost) {
    tag = 'span'
    exturl = 'exturl'
    // 编码URL字符串，并将其存储在数据属性中。
    const encoded = Buffer.from(path).toString('base64')

    attrs = {
      class: exturl,
      'data-url': encoded
    }
  }

  for (const key in options) {
    /**
     * 如果选项包含 `class` 属性，则将其添加到 `exturl` 类中（如果启用了 `exturl` 选项）。
     * 否则，将其添加到属性集中。
     */
    if (exturl !== '' && key === 'class') {
      attrs[key] += ' ' + options[key]
    } else {
      attrs[key] = options[key]
    }
  }

  if (attrs.class && Array.isArray(attrs.class)) {
    attrs.class = attrs.class.join(' ')
  }

  // 如果是外部链接，则重写属性
  if (data.protocol && data.hostname !== siteHost) {
    attrs.external = null

    if (!theme.exturl) {
      // 仅需要为简单链接重写/添加属性。
      attrs.rel = 'noopener'
      attrs.target = '_blank'
    } else {
      // 在主菜单中移除 `exturl` 的 rel 属性。
      attrs.rel = null
    }
  }

  // 返回HTML标记字符串
  return htmlTag(tag, attrs, decodeURI(text), false)
})

hexo.extend.helper.register('_image_url', function (img, path = '') {
  const { statics } = hexo.theme.config
  const { post_asset_folder } = hexo.config

  if (img.startsWith('//') || img.startsWith('http')) {
    return img
  } else {
    return url_for.call(this, statics + (post_asset_folder ? path : '') + img)
  }
})

hexo.extend.helper.register('_cover', function (item, num) {
  const { image_server, image_list } = hexo.theme.config

  if (item.cover) {
    return this._image_url(item.cover, item.path)
  } else if (item.photos && item.photos.length > 0) {
    return this._image_url(item.photos[0], item.path)
  } else {
    return randomBG(num || 1, image_server, image_list)
  }
})

// 注册hexo主题的永久链接帮助方法
hexo.extend.helper.register('_permapath', function (str) {
  // 获取hexo的永久链接配置
  const { permalink } = hexo.config
  // 将输入字符串中的'index.html'替换为空字符串
  let url = str.replace(/index\.html$/, '')
  // 如果永久链接不以'.html'结尾，将输入字符串中的'.html'替换为空字符串
  if (!permalink.endsWith('.html')) {
    url = url.replace(/\.html$/, '')
  }
  // 返回处理后的URL字符串
  return url
})

hexo.extend.helper.register('canonical', function () {
  return `<link rel="canonical" href="${this._permapath(this.url)}">`
})

/**
 * Get page path given a certain language tag
 */
// 注册hexo主题的国际化路径帮助方法
hexo.extend.helper.register('i18n_path', function (language) {
  // 获取当前页面的path和lang
  const { path, lang } = this.page
  // 如果path以lang开头，则截取掉lang部分，作为基础路径
  const base = path.startsWith(lang) ? path.slice(lang.length + 1) : path
  // 通过调用url_for方法，生成国际化路径
  return url_for.call(this, `${this.languages.indexOf(language) === 0 ? '' : '/' + language}/${base}`)
})

/**
 * Get the language name
 */
// 注册hexo主题的语言名称帮助方法
hexo.extend.helper.register('language_name', function (language) {
  // 从主题配置中获取指定语言的名称
  // @ts-ignore
  const name = hexo.theme.i18n.__(language)('name')
  // 如果名称为默认值'name'，则返回语言代码，否则返回语言名称
  return name === 'name' ? language : name
})

hexo.extend.helper.register('random_color', function () {
  /**
   @type {number[]}
   */
  const arr = []
  for (let i = 0; i < 3; i++) {
    arr.push(Math.floor(Math.random() * 128 + 128))
  }
  const [r, g, b] = arr
  return `#${
    r.toString(16).length > 1 ? r.toString(16) : '0' + r.toString(16)
  }${g.toString(16).length > 1 ? g.toString(16) : '0' + g.toString(16)}${
    b.toString(16).length > 1 ? b.toString(16) : '0' + b.toString(16)
  }`
})

hexo.extend.helper.register('shokax_inject', function (point) {
  return hexo.theme.config.injects[point]
    .map(item => this.partial(item.layout, item.locals, item.options))
    .join('')
})
