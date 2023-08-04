/* global hexo */
import env from '../../package.json'
import fs = require('hexo-fs')
import pathLib from 'node:path'
import esbuild = require('esbuild')

function findJsFile (path:string):string[] {
  let result:string[] = []
  fs.readdirSync(path).forEach((item) => {
    if (!item.endsWith('js')) {
      result = result.concat(findJsFile(pathLib.join(path, item)))
    } else {
      if (item.indexOf('player') === -1 && item.indexOf('fireworks') === -1) {
        result.push(pathLib.join(path, item))
      }
    }
  })
  return result
}
hexo.extend.generator.register('script', function (locals) {
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
    noPlayer: theme.experiments?.noPlayer,
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

  let text: string
  let enterPoint: string
  if (fs.existsSync('themes/shokaX/source/js/_app/pjax/siteInit.js')) {
    enterPoint = 'themes/shokaX/source/js/_app/pjax/siteInit.js'
  } else {
    enterPoint = 'node_modules/hexo-theme-shokax/source/js/_app/pjax/siteInit.js'
  }
  text = 'const CONFIG = ' + JSON.stringify(siteConfig) + ';'
  esbuild.buildSync({
    entryPoints: [enterPoint],
    bundle: true,
    outfile: 'shokax_temp.js',
    platform: 'browser',
    target: ['es2021'],
    minify: true
  })
  text += fs.readFileSync('shokax_temp.js')
  const result = hexo.render.renderSync({ text, engine: 'js' })
  fs.unlinkSync('shokax_temp.js')
  return {
    path: theme.js + '/app.js',
    data: function () {
      return result
    }
  }
})
