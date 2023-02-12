/* global hexo */

hexo.on('generateBefore', () => {
  // 加载`theme_injects`过滤器
  require('./lib/injects')(hexo)
})

hexo.on('generateAfter', () => {
  // 检查版本更新
  const https = require('https')
  const path = require('path')
  const { version } = require(path.normalize('../../package.json'))
  https.get('https://api.github.com/repos/zkz098/hexo-theme-shokaX/releases/latest', {
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
          hexo.log.warn('Visit https://github.com/zkz098/hexo-theme-shokaX/releases for more information.')
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
