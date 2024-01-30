/* global hexo */
import env from '../../package.json'
import * as fs from 'hexo-fs'
import { buildSync } from 'esbuild'
import { getVendorLink } from '../utils'

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
      copy_tex: getVendorLink(hexo, theme.vendors.async_js.copy_tex),
      fancybox: getVendorLink(hexo, theme.vendors.async_js.fancybox)
    },
    css: {
      katex: getVendorLink(hexo, theme.vendors.css.katex),
      mermaid: theme.css + '/mermaid.css',
      fancybox: getVendorLink(hexo, theme.vendors.css.fancybox),
      justifiedGallery: getVendorLink(hexo, theme.vendors.css.justifiedGallery)
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
    fireworks: (theme.fireworks && theme.fireworks.enable && theme.fireworks.options)
      ? theme.fireworks.options
      : undefined
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
  buildSync({
    entryPoints: [enterPoint],
    bundle: true,
    outfile: 'shokax_temp.js',
    platform: 'browser',
    format: 'iife',
    target: ['es2022'],
    minify: true,
    define: {
      __UNLAZY_LOGGING__: 'false',
      __shokax_player__: theme.experiments.noPlayer ? 'false' : 'true'
    }
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
