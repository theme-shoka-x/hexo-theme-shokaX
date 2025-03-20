/* global hexo */
import env from '../../package.json'
import fs from 'node:fs/promises'
import { build } from 'esbuild'
import { getVendorLink } from '../utils'

hexo.extend.generator.register('script', async function (locals) {
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
    css: {
      katex: getVendorLink(hexo, theme.vendors.css.katex),
      mermaid: {
        url: theme.css + '/mermaid.css',
        local: true,
        sri: ''
      },
      fancybox: getVendorLink(hexo, theme.vendors.css.fancybox),
      justifiedGallery: getVendorLink(hexo, theme.vendors.css.justifiedGallery)
    },
    loader: theme.loader,
    search: null,
    outime: {
      enable: theme.outime.enable,
      days: theme.outime.days
    },
    playerAPI: theme.playerAPI,
    experiments: {
      copyrightLength: theme.experiments.copyrightLength,
    },
    audio: undefined,
    fireworks: (theme.fireworks && theme.fireworks.enable && theme.fireworks.options)
      ? theme.fireworks.options
      : undefined,
    waline: {
      serverURL: theme.waline.serverURL,
      lang: theme.waline.lang,
      locale: theme.waline.locale,
      emoji: theme.waline.emoji,
      meta: theme.waline.meta,
      requiredMeta: theme.waline.requiredMeta,
      wordLimit: theme.waline.wordLimit,
      pageSize: theme.waline.pageSize,
      pageview: theme.waline.pageview
    },
    twikoo: {
      envId: theme.twikoo.envId,
      region: theme.twikoo.region
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

  let enterPoint: string, patchDir: string
  try {
    await fs.readFile('themes/shokaX/source/js/_app/pjax/siteInit.ts', 'utf-8')
    enterPoint = 'themes/shokaX/source/js/_app/pjax/siteInit.ts'
    patchDir = 'themes/shokaX/source/js/_app/components/cloudflare.ts'
  } catch (e) {
    enterPoint = 'node_modules/hexo-theme-shokax/source/js/_app/pjax/siteInit.ts'
    patchDir = 'node_modules/hexo-theme-shokax/source/js/_app/components/cloudflare.ts'
  }
  await build({
    entryPoints: [enterPoint],
    bundle: true,
    outdir: 'shokaxTemp',
    tsconfigRaw: {
      compilerOptions: {
        target: 'ES2022',
        esModuleInterop: true,
        module: 'ESNext',
        moduleResolution: 'Node',
        skipLibCheck: true
      }
    },
    platform: 'browser',
    format: 'esm',
    target: ['es2022'],
    minify: true,
    legalComments: 'linked',
    mainFields: ['module', 'browser', 'main'],
    splitting: true,
    define: {
      __UNLAZY_LOGGING__: 'false',
      __UNLAZY_HASH_DECODING__: theme.modules.unlazyHash ? 'true' : 'false',
      __shokax_player__: theme.modules.player ? 'true' : 'false',
      __shokax_VL__: theme.modules.visibilityListener ? 'true' : 'false',
      __shokax_fireworks__: (theme.fireworks && theme.fireworks.enable && theme.fireworks.options && theme.modules.fireworks) ? 'true' : 'false',
      __shokax_search__: config?.algolia ? 'true' : 'false',
      __shokax_outime__: theme.outime.enable ? 'true' : 'false',
      __shokax_tabs__: theme.modules.tabs ? 'true' : 'false',
      __shokax_quiz__: theme.modules.quiz ? 'true' : 'false',
      __shokax_fancybox__: theme.modules.fancybox ? 'true' : 'false',
      __shokax_waline__: theme.waline.enable ? 'true' : 'false',
      __shokax_twikoo__: theme.twikoo.enable ? 'true' : 'false',
      __shokax_antiFakeWebsite__: theme.experiments.antiFakeWebsite ? 'true' : 'false',
      shokax_CONFIG: JSON.stringify(siteConfig),
      shokax_siteURL: "'" + config.url + "'"
    }
  })
  const res = [];

  (await fs.readdir('shokaxTemp')).forEach(async (file) => {
    const fileContent = await fs.readFile('shokaxTemp/' + file)
    if (file.endsWith('.js')) {
      res.push({
        path: theme.js + '/' + file,
        data: fileContent
      })
    } else if (file.endsWith('.css')) {
      res.push({
        path: theme.css + '/' + file,
        data: fileContent
      })
    } else {
      res.push({
        path:  theme.statics + '/' + file,
        data: fileContent
      })
    }
  })

  if (theme.experiments.cloudflarePatch) {
    await build({
      entryPoints: [patchDir],
      bundle: true,
      platform: "browser",
      format: "iife",
      tsconfigRaw: {
        compilerOptions: {
          target: 'ES2022',
          esModuleInterop: true,
          module: 'ESNext',
          moduleResolution: 'Node',
          skipLibCheck: true
        }
      },
      target: ['es2022'],
      minify: true,
      outfile: 'cf-patch.js'
    })
    res.push({
      path: theme.js + '/cf-patch.js',
      data: await fs.readFile('cf-patch.js')
    })
  }
  return res
})
