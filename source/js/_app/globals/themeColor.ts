import { $storage } from '../library/storage'
import { CONFIG, HTML } from './globalVars'

/**
 * 更改日夜模式
 */
export const changeTheme = (type?: string) => {
  const btn = document.querySelector('.theme .ic')
  if (type === 'dark') {
    HTML.setAttribute('data-theme', type)
    btn.removeClass('i-sun')
    btn.addClass('i-moon')
  } else {
    HTML.removeAttribute('data-theme')
    btn.removeClass('i-moon')
    btn.addClass('i-sun')
  }
}

/**
 * 自动调整黑夜白天
 * 优先级: 手动选择>时间>跟随系统
 */
export const autoDarkmode = () => {
  if (CONFIG.auto_dark.enable) {
    if (new Date().getHours() >= CONFIG.auto_dark.start || new Date().getHours() <= CONFIG.auto_dark.end) {
      changeTheme('dark')
    } else {
      changeTheme()
    }
  }
}

/**
 * 更改主题的meta
 */
export const changeMetaTheme = (color: string): void => {
  if (HTML.getAttribute('data-theme') === 'dark') {
    color = '#222'
  }

  document.querySelector('meta[name="theme-color"]').setAttribute('content', color)
}

// 记忆日夜模式切换和系统亮暗模式监听
export const themeColorListener = () => {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (mediaQueryList) => {
    if (mediaQueryList.matches) {
      changeTheme('dark')
    } else {
      changeTheme()
    }
  })

  const t = $storage.get('theme')
  if (t) {
    changeTheme(t)
  } else {
    if (CONFIG.darkmode) {
      changeTheme('dark')
    }
  }
}
