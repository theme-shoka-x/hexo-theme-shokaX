import { $storage } from './storage'
import { transition } from './anime'
import { $dom } from './dom'
import { BODY } from '../globals/globalVars'
import { changeTheme } from '../globals/themeColor'
import { child, createChild, setDisplay } from './proto'
export function initVue () {
  function changeThemeByBtn () {
    let c: { (): void; (): void; (): void }
    const btn = child($dom('.theme'), '.ic')

    const neko = createChild(BODY, 'div', {
      id: 'neko',
      innerHTML: '<div class="planet"><div class="sun"></div><div class="moon"></div></div><div class="body"><div class="face"><section class="eyes left"><span class="pupil"></span></section><section class="eyes right"><span class="pupil"></span></section><span class="nose"></span></div></div>'
    })

    const hideNeko = () => {
      transition(neko, {
        // @ts-ignore
        delay: 2500,
        opacity: 0
      }, () => {
        BODY.removeChild(neko)
      })
    }

    if (btn.hasClass('i-sun')) {
      c = () => {
        neko.addClass('dark')
        changeTheme('dark')
        $storage.set('theme', 'dark')
        hideNeko()
      }
    } else {
      neko.addClass('dark')
      c = () => {
        neko.removeClass('dark')
        changeTheme()
        $storage.set('theme', 'light')
        hideNeko()
      }
    }
    transition(neko, 1, () => {
      setTimeout(c, 210)
    }, () => {
      setDisplay(neko, 'block')
    })
  }
  child($dom('#rightNav'), '.theme .ic').addEventListener('click', changeThemeByBtn)
}
