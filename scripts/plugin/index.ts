import { version } from '../../package.json'
import { rm, unlink } from 'node:fs/promises'

hexo.on('generateBefore', async () => {
  await rm('./shokaxTemp', { force: true, recursive: true })
  try {
    await unlink('cf-patch.js')
  } catch (e) {
    // ignore error
  }
})

hexo.on('generateAfter',async () => {
  try {
    const res = await fetch('https://registry.npmmirror.com/hexo-theme-shokax/latest', {
      headers: {
        'User-Agent': 'ShokaX Client (hexo-theme-shokax)'
      }
    })
    const resp = await res.json()
    const latest = resp.version
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
  }
  catch (e) {
    hexo.log.warn('Failed to detect version info. Error message:')
    hexo.log.warn(e)
  }
})
