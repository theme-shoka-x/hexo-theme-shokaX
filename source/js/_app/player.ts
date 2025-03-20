import { initPlayer } from 'nyx-player'
import { CONFIG } from './globals/globalVars'

const urls = []
CONFIG.audio.forEach((item) => {
  urls.push({
    name: item.title,
    url: item.list[0]
  })
})

initPlayer("#player","#showBtn", [])