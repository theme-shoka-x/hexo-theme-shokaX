import injects from './lib/injects'
import https from 'node:https'
import { version } from '../../package.json'
import fs from 'node:fs'

hexo.on('generateBefore', () => {
  // 加载`theme_injects`过滤器
  injects(hexo)
  if (fs.existsSync('request.lock')) {
    fs.unlinkSync('request.lock')
  }
  if (fs.existsSync('requested.lock')) {
    fs.unlinkSync('requested.lock')
  }
})

hexo.on('generateAfter', () => {
  // 检查版本更新
  https.get('https://api.github.com/repos/theme-shoka-x/hexo-theme-shokaX/releases/latest', {
    headers: {
      'User-Agent': 'Theme ShokaX Client'
    }
  }, (res) => {
    let result = ''
    res.on('data', (data) => {
      result += data
    })
    res.on('end', () => {
      try {
        const latest = JSON.parse(result).tag_name.replace('v', '').split('.')
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
      } catch (err) {
        hexo.log.error('Failed to detect version info. Error message:')
        hexo.log.error(err)
      }
    })
  }).on('error', err => {
    hexo.log.error('Failed to detect version info. Error message:')
    hexo.log.error(err)
  })
})
