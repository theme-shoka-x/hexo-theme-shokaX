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
  const { initPlayer } = await import('nyx-player')
  initPlayer("#player","#showBtn", urls, "#playBtn", "html[data-theme=&quot;dark&quot;]", "shokax")
}