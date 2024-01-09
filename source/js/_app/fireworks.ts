import firework from 'mouse-firework'

/*
*  烟花分区
*/
export function initFireworks () {
  if (typeof CONFIG.fireworks === 'undefined') {
    return
  }
  firework(CONFIG.fireworks)
}
