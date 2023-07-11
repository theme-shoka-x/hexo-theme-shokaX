/* global hexo */
import env from '../../package.json'
import fs = require('hexo-fs')
import pathLib from 'node:path'

function findJsFile (path:string):string[] {
  console.log(path)
  let result:string[] = []
  fs.readdirSync(path).forEach((item) => {
    console.log(item)
    if (!item.endsWith('js')) {
      result = result.concat(findJsFile(pathLib.join(path, item)))
    } else {
      if (item.indexOf('player') === -1 && item.indexOf('fireworks') === -1) {
        console.log('push')
        result.push(pathLib.join(path, item))
      }
    }
  })
  return result
}
hexo.extend.generator.register('script', function (locals) {
  const log = hexo.log || console.log
  const config = hexo.config
  const theme = hexo.theme.config

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
    outime: {
      enable: theme.outime.enable,
      days: theme.outime.days
    },
    quicklink: {
      timeout: theme.quicklink.timeout,
      priority: theme.quicklink.priority
    },
    playerAPI: theme.playerAPI,
    disableVL: theme.disableVL,
    audio: undefined,
    fireworks: undefined
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

  let text = ''
  let path = ''
  if (fs.existsSync('themes/shokaX/source/js/_app/library/dom.js')) {
    path = 'themes/shokaX/source/js/_app'
  } else {
    path = 'node_modules/hexo-theme-shokax/source/js/_app'
  }

  let files = findJsFile(pathLib.join(path, 'library'))
  files = files.concat(findJsFile(pathLib.join(path, 'globals')))
  files = files.concat(findJsFile(pathLib.join(path, 'page')))
  files = files.concat(findJsFile(pathLib.join(path, 'pjax')))
  files = files.concat(findJsFile(pathLib.join(path, 'components')))
  console.log(files)

  files.forEach(function (item) {
    text += fs.readFileSync(item).toString()
  })
  if (!theme.experiments?.noPlayer) {
    if (fs.existsSync('themes/shokaX/source/js/_app/player.js')) {
      text += fs.readFileSync('themes/shokaX/source/js/_app/player.js').toString()
    } else {
      text += fs.readFileSync('node_modules/hexo-theme-shokax/source/js/_app/player.js').toString()
    }
  }
  if (theme.fireworks && theme.fireworks.enable) {
    if (fs.existsSync('themes/shokaX/source/js/_app/fireworks.js')) {
      text += fs.readFileSync('themes/shokaX/source/js/_app/fireworks.js').toString()
    } else {
      text += fs.readFileSync('node_modules/hexo-theme-shokax/source/js/_app/fireworks.js').toString()
    }
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
