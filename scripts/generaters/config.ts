'use strict'
/* global hexo */

import { deepMerge } from 'hexo-util'
import fs from 'node:fs'
import path from 'path'
import yaml from 'js-yaml'

hexo.extend.filter.register('before_generate', () => {
  if (hexo.config.theme_config) {
    // @ts-ignore
    hexo.theme.config = deepMerge(hexo.theme.config, hexo.config.theme_config)
  }

  const data = hexo.locals.get('data')

  if (data.languages) {
    // @ts-ignore
    const { i18n } = hexo.theme

    const mergeLang = lang => {
      if (data.languages[lang]) { // @ts-ignore
        i18n.set(lang, deepMerge(i18n.get([lang]), data.languages[lang]))
      }
    }

    for (const lang of ['en', 'ja', 'zh-CN', 'zh-HK', 'zh-TW']) {
      mergeLang(lang)
    }
  }

  hexo.theme.config.style = {}

  for (const style of ['iconfont', 'colors', 'custom']) {
    const custom_file = 'source/_data/' + style + '.styl'
    if (fs.existsSync(custom_file)) {
      hexo.theme.config.style[style] = path.resolve(hexo.base_dir, custom_file)
    }
  }

  if (data.images && data.images.length >= 6) {
    hexo.theme.config.image_list = data.images
  } else {
    // @ts-ignore
    hexo.theme.config.image_list = yaml.load(fs.readFileSync(path.join(__dirname, '../../_images.yml')) as string)
  }
})
