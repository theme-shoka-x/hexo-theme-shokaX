import { initPlayer } from 'nyx-player'
import { CONFIG } from './globals/globalVars'

export const initAudioPlayer = async function () {
  const urls = []
  CONFIG.audio.forEach((item) => {
    urls.push({
      name: item.title,
      url: item.list[0]
    })
  })
  initPlayer("#player","#showBtn", urls)
}