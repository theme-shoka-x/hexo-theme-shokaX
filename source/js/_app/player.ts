import { CONFIG } from './globals/globalVars'
import 'nyx-player/style'

export const initAudioPlayer = async function () {
  const urls = []
  CONFIG.audio.forEach((item) => {
    urls.push({
      name: item.title,
      url: item.list[0]
    })
  })
  // Limit concurrent requests to the external meting API to avoid hitting
  // browser / server limits when many playlists are loaded at once.
  // nyx-player uses `fetch()` internally; we patch `window.fetch` for
  // requests to api.injahow.cn so that they are executed with limited
  // concurrency (serialised or small pool) to avoid Promise.all failing.
  if (typeof window !== 'undefined' && window.fetch) {
    const _origFetch = window.fetch.bind(window)
    const HOST = 'api.injahow.cn'
    const CONCURRENCY = 3
    let active = 0
    const queue: Array<any> = []
    const next = () => {
      if (active >= CONCURRENCY || queue.length === 0) return
      active++
      const item = queue.shift()
      _origFetch(item.input, item.init)
        .then(item.resolve)
        .catch(item.reject)
        .finally(() => { active--; next() })
    }
    window.fetch = (input: RequestInfo, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : (input as Request).url
      if (typeof url === 'string' && url.includes(HOST)) {
        return new Promise((resolve, reject) => {
          queue.push({ input, init, resolve, reject })
          next()
        })
      }
      return _origFetch(input, init)
    }
  }

  const { initPlayer } = await import('nyx-player')
  initPlayer("#player","#showBtn", urls, "#playBtn", "html[data-theme=&quot;dark&quot;]", "shokax")
}