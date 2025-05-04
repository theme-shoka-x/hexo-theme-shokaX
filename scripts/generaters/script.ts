import env from '../../package.json'
import fs from 'node:fs/promises'
import { build } from 'esbuild'
import { getVendorLink } from '../utils'
import { htmlTag, url_for } from 'hexo-util'

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
      }
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
  const resultApp = await build({
    write: false,
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
    minify: !theme.modules.debug,
    legalComments: 'linked',
    mainFields: ['module', 'browser', 'main'],
    splitting: true,
    define: {
      __shokax_player__: theme.modules.player ? 'true' : 'false',
      __shokax_VL__: theme.modules.visibilityListener ? 'true' : 'false',
      __shokax_fireworks__: (theme.fireworks && theme.fireworks.enable && theme.fireworks.options && theme.modules.fireworks) ? 'true' : 'false',
      __shokax_search__: config?.algolia ? 'true' : 'false',
      __shokax_outime__: theme.outime.enable ? 'true' : 'false',
      __shokax_tabs__: theme.modules.tabs ? 'true' : 'false',
      __shokax_quiz__: theme.modules.quiz ? 'true' : 'false',
      __shokax_waline__: theme.waline.enable ? 'true' : 'false',
      __shokax_twikoo__: theme.twikoo.enable ? 'true' : 'false',
      __shokax_antiFakeWebsite__: theme.experiments.antiFakeWebsite ? 'true' : 'false',
      shokax_CONFIG: JSON.stringify(siteConfig),
      shokax_siteURL: "'" + config.url + "'"
    }
  })
  const res:{
    path: string
    data: Buffer | Uint8Array | string
  }[] = [];

  resultApp.outputFiles.forEach((file) => {
    let fileName = ''
    if (file.path.split("\\").length > 1) {
      fileName = file.path.split("\\").pop()
    } else {
      fileName = file.path.split("/").pop()
    }
    if (file.path.endsWith(".js")) {
      res.push({
        path: theme.js + "/" + fileName,
        data: file.text
      });
    } else if (file.path.endsWith(".css")) {
      res.push({
        path: theme.css + "/" + fileName,
        data: file.text
      });
    } else {
      res.push({
        path: theme.statics + "/" + fileName,
        data: file.text
      });
    }
  })

  hexo.extend.helper.register('preloadjs', function () {
    let resultHtml = ''
    res.forEach((file) => {
      if (file.path.endsWith('.js')) {
        resultHtml += htmlTag('link', { rel: 'modulepreload', href: url_for.call(this, file.path) }, '')
      }
    })
    return resultHtml
  })

  hexo.extend.helper.register('load_async_css', function (){
    let resultHtml = ''
    res.forEach((file) => {
      if (file.path.endsWith('.css')) {
        resultHtml += htmlTag('link', { rel: 'stylesheet', href: url_for.call(this, file.path), media: 'none', onload: "this.media='all'" }, '')
      }
    })
    return resultHtml
  })

  if (theme.modules.cloudflarePatch) {
    const resultCF = await build({
      write: false,
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
      minify: !theme.modules.debug,
      outfile: 'cf-patch.js'
    })
    res.push({
      path: theme.js + '/cf-patch.js',
      data: resultCF.outputFiles[0].text
    })
  }
  return res
})
