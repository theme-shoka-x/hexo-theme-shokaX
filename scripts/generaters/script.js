/* global hexo */
const fs = require('hexo-fs')
// const url = require('url')

hexo.extend.generator.register('script', function (locals) {
  const log = hexo.log || console.log
  const config = hexo.config
  const theme = hexo.theme.config

  const env = require('../../package.json')

  const siteConfig = {
    version: env.version,
    hostname: config.url,
    root: config.root,
    statics: theme.statics,
    favicon: {
      normal: theme.assets + '/favicon.ico',
      hidden: theme.assets + '/failure.ico'
    },
    darkmode: theme.darkmode,
    auto_dark: theme.auto_dark,
    auto_scroll: theme.auto_scroll,
    js: {
      chart: theme.vendors.js.chart,
      copy_tex: theme.vendors.js.copy_tex,
      fancybox: theme.vendors.js.fancybox
    },
    css: {
      valine: theme.css + '/comment.css',
      katex: theme.vendors.css.katex,
      mermaid: theme.css + '/mermaid.css',
      fancybox: theme.vendors.css.fancybox
    },
    loader: theme.loader,
    search: null,
    valine: theme.valine,
    outime: {
      enable: theme.outime.enable,
      days: theme.outime.days
    },
    quicklink: {
      timeout: theme.quicklink.timeout,
      priority: theme.quicklink.priority
    }
  }

  if (config?.algolia) {
    siteConfig.search = {
      appID: config.algolia.appId,
      apiKey: config.algolia.apiKey,
      indexName: config.algolia.indexName,
      hits: theme.search.hits
    }
  }

  if (theme?.audio) {
    siteConfig.audio = theme.audio
  }

  let text = '';

  ['library', 'global', 'page', 'vue', 'components'].forEach(function (item) {
    if (fs.existsSync(`themes/shokaX/source/js/_app/${item}.js`)) {
      text += fs.readFileSync(`themes/shokaX/source/js/_app/${item}.js`).toString()
    } else {
      text += fs.readFileSync(`node_modules/hexo-theme-shokax/source/js/_app/${item}.js`).toString()
    }
  })
  if (!theme.experiments?.noPlayer) {
    if (fs.existsSync('themes/shokaX/source/js/_app/player.js')) {
      text += fs.readFileSync('themes/shokaX/source/js/_app/player.js').toString()
    } else {
      text += fs.readFileSync('node_modules/hexo-theme-shokax/source/js/_app/player.js').toString()
    }
  }
  if (theme.fireworks && theme.fireworks.enable) {
    siteConfig.fireworks = theme.fireworks.color || ['rgba(255,182,185,.9)', 'rgba(250,227,217,.9)', 'rgba(187,222,214,.9)', 'rgba(138,198,209,.9)']
  }

  text = 'const CONFIG = ' + JSON.stringify(siteConfig) + ';' + text
  const result = hexo.render.renderSync({ text, engine: 'js' })
  return {
    path: theme.js + '/app.js',
    data: function () {
      return result
    }
  }
})
