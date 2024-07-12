import { sideBarToggleHandle } from '../components/sidebar'
import {
  backToTop,
  diffY,
  headerHight,
  headerHightInner,
  oWinWidth,
  originTitle,
  scrollAction,
  sideBar,
  siteBrand,
  siteHeader,
  siteNav,
  statics,
  titleTime,
  toolBtn,
  setSiteNavHeight,
  setHeaderHightInner,
  setHeaderHight,
  setOWinHeight, setOWinWidth, setDiffY, setTitleTime, CONFIG
} from './globalVars'
import { changeMetaTheme } from './themeColor'
import { Loader } from './thirdparty'
import { getHeight, setWidth } from '../library/proto'

const wavesEle = document.getElementById('waves')

export const resizeHandle = () => {
  // 获取 siteNav 的高度
  setSiteNavHeight(getHeight(siteNav))
  // 获取 siteHeader 的高度
  setHeaderHightInner(getHeight(siteHeader))
  // 获取 #waves 的高度
  setHeaderHight(headerHightInner + getHeight(wavesEle))

  // 判断窗口宽度是否改变
  if (oWinWidth !== window.innerWidth) {
    sideBarToggleHandle(null, 1)
  }

  // 记录窗口高度和宽度
  setOWinHeight(window.innerHeight)
  setOWinWidth(window.innerWidth)
}

export const scrollHandle = () => {
  // 获取窗口高度
  const winHeight = window.innerHeight
  // 获取文档高度
  const docHeight = (document.querySelector('main > .inner') as HTMLElement).offsetHeight
  // 计算可见内容高度
  const contentVisibilityHeight = docHeight > winHeight ? docHeight - winHeight : document.body.scrollHeight - winHeight
  // 判断页面是否滚动超过 headerHightInner
  const SHOW = window.scrollY > headerHightInner
  // 判断页面是否开始滚动
  const startScroll = window.scrollY > 0

  // 根据条件修改 meta theme
  if (SHOW) {
    changeMetaTheme('#FFF')
  } else {
    changeMetaTheme('#222')
  }

  // 控制导航栏的显示隐藏
  siteNav.toggleClass('show', SHOW)
  // 控制网站 logo 的显示隐藏
  toolBtn.toggleClass('affix', startScroll)
  // 控制侧边栏的显示隐藏，当滚动高度大于 headerHight 且窗口宽度大于 991px 时显示
  siteBrand.toggleClass('affix', startScroll)
  sideBar.toggleClass('affix', window.scrollY > headerHight && document.body.offsetWidth >= 991)
  // 初始化滚动时导航栏的显示方向
  if (typeof scrollAction.y === 'undefined') {
    scrollAction.y = window.scrollY
  }
  setDiffY(scrollAction.y - window.scrollY)

  // 控制滑动时导航栏显示
  if (diffY < 0) {
    siteNav.removeClass('up')
    siteNav.toggleClass('down', SHOW)
  } else if (diffY > 0) {
    siteNav.removeClass('down')
    siteNav.toggleClass('up', SHOW)
  } else { /* empty */ }
  scrollAction.y = window.scrollY
  // 计算滚动百分比
  const scrollPercent = Math.round(Math.min(100 * window.scrollY / contentVisibilityHeight, 100)) + '%'
  // 更新回到顶部按钮的文字
  if (backToTop.querySelector('span').innerText !== scrollPercent) {
    backToTop.querySelector('span').innerText = scrollPercent
  }
  // 更新百分比进度条的宽度
  if (document.getElementById('sidebar').hasClass('affix') || document.getElementById('sidebar').hasClass('on')) {
    setWidth(document.querySelector('.percent'), scrollPercent)
  }
}

// 可见度监听(离开页面和返回时更改document的title)
export const visibilityListener = () => {
  const iconNode = document.querySelector('[rel="icon"]')
  document.addEventListener('visibilitychange', () => {
    switch (document.visibilityState) {
      case 'hidden':
        iconNode.setAttribute('href', statics + CONFIG.favicon.hidden)
        document.title = LOCAL.favicon.hide
        if (CONFIG.loader.switch) {
          Loader.show()
        }
        clearTimeout(titleTime)
        break
      case 'visible':
        iconNode.setAttribute('href', statics + CONFIG.favicon.normal)
        document.title = LOCAL.favicon.show
        if (CONFIG.loader.switch) {
          Loader.hide(1000)
        }
        setTitleTime(setTimeout(() => {
          document.title = originTitle
        }, 2000))
        break
    }
  }, { passive: true })
}
