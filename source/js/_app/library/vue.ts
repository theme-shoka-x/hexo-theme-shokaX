import { transition } from './anime'
import { BODY } from '../globals/globalVars'
import { changeTheme } from '../globals/themeColor'
import { createChild, setDisplay } from './proto'

export function initVue () {
  function changeThemeByBtn () {
    let c: { (): void; (): void; (): void }
    const btn = document.querySelector('.theme').querySelector('.ic')

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

    if (btn.classList.contains('i-sun')) {
      c = () => {
        neko.classList.add('dark')
        changeTheme('dark')
        localStorage.setItem('theme', 'dark')
        hideNeko()
      }
    } else {
      neko.classList.add('dark')
      c = () => {
        neko.classList.remove('dark')
        changeTheme()
        localStorage.setItem('theme', 'light')
        hideNeko()
      }
    }
    transition(neko, 1, () => {
      setTimeout(c, 210)
    }, () => {
      setDisplay(neko, 'block')
    })
  }
  document.getElementById('rightNav').querySelector('.theme .ic').addEventListener('click', changeThemeByBtn)
}
