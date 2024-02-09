/*!
  index.js in next-theme/hexo-theme-next by next-theme
  under GNU AFFERO GENERAL PUBLIC LICENSE v3.0 OR LATER
  https://github.com/next-theme/hexo-theme-next/blob/master/LICENSE.md
 */

import injects from './lib/injects'
import { version } from '../../package.json'
import * as fs from 'node:fs'

hexo.on('generateBefore', () => {
  // 加载`theme_injects`过滤器
  injects(hexo)
  fs.rmSync('./shokaxTemp', { force: true, recursive: true })
  if (fs.existsSync('request.lock')) {
    fs.unlinkSync('request.lock')
  }
  if (fs.existsSync('requested.lock')) {
    fs.unlinkSync('requested.lock')
  }
})

hexo.on('generateAfter', () => {
  // 检查版本更新
  fetch('https://api.github.com/repos/theme-shoka-x/hexo-theme-shokaX/releases/latest').then((res) => {
    res.json().then((resp) => {
      try {
        const latest = resp.tag_name.replace('v', '').split('.')
        const current = version.split('.')
        let isOutdated = false
        for (let i = 0; i < Math.max(latest.length, current.length); i++) {
          if (!current[i] || latest[i] > current[i]) {
            isOutdated = true
            break
          }
          if (latest[i] < current[i]) {
            break
          }
        }
        if (isOutdated) {
          hexo.log.warn(`Your theme ShokaX is outdated. Current version: v${current.join('.')}, latest version: v${latest.join('.')}`)
          hexo.log.warn('Visit https://github.com/theme-shoka-x/hexo-theme-shokaX/releases for more information.')
        }
      } catch (e) {
        hexo.log.warn('Failed to detect version info. Error message:')
        hexo.log.warn(e)
      }
    }).catch((e) => {
      hexo.log.warn('Failed to detect version info. Error message:')
      hexo.log.warn(e)
    })
  })
})
