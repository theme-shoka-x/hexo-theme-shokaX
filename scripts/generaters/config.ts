'use strict'
/* global hexo */

import { deepMerge } from 'hexo-util'
import fs from 'node:fs/promises'
import path from 'path'
import yaml from 'js-yaml'

hexo.extend.filter.register('before_generate', async () => {
  if (hexo.config.theme_config) {
    // @ts-ignore
    hexo.theme.config = deepMerge(hexo.theme.config, hexo.config.theme_config) as any
  }

  const data = hexo.locals.get('data')

  if (data.languages) {
    // @ts-ignore
    const { i18n } = hexo.theme

    const mergeLang = (lang: string) => {
      if (data.languages[lang]) { // @ts-ignore
        i18n.set(lang, deepMerge(i18n.get([lang]), data.languages[lang]))
      }
    }

    for (const lang of ['en', 'ja', 'zh-CN', 'zh-HK', 'zh-TW']) {
      mergeLang(lang)
    }
  }

  (hexo.theme.config as any).style = {}

  for (const style of ['iconfont', 'colors', 'custom']) {
    const custom_file = 'source/_data/' + style + '.styl'
    try {
      await fs.readFile(custom_file)
      hexo.theme.config.style[style] = path.resolve(hexo.base_dir, custom_file)
    } catch {
      // ignore error
    }
  }

  if (data.images && data.images.length > 0) {
    hexo.theme.config.image_list = data.images
  } else {
    hexo.theme.config.image_list = yaml.load(await fs.readFile(path.join(__dirname, '../../_images.yml'), { encoding: 'utf-8' }))
  }

  if (data.images_index && data.images_index.length > 0) {
    hexo.theme.config.index_images = data.images_index;
  } else {
    try {
      const fileContent = await fs.readFile(path.join(__dirname, '../../_images_index.yml'), 'utf-8')
      hexo.theme.config.index_images = yaml.load(fileContent)
    } catch (e) {
      hexo.theme.config.index_images = data.index_images || []
    }
  }
})
