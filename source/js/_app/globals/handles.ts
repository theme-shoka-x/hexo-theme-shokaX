import { sideBarToggleHandle } from '../components/sidebar'
import { $dom, getDocHeight } from '../library/dom'
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
  setOWinHeight, setOWinWidth, setDiffY, setTitleTime
} from './globalVars'
import { changeMetaTheme } from './themeColor'
import { Loader } from './thirdparty'

export const resizeHandle = () => {
  // 获取 siteNav 的高度
  setSiteNavHeight(siteNav.changeOrGetHeight())
  // 获取 siteHeader 的高度
  setHeaderHightInner(siteHeader.changeOrGetHeight())
  // 获取 #waves 的高度
  setHeaderHight(headerHightInner + $dom('#waves').changeOrGetHeight())

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
  const docHeight = getDocHeight()
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
  sideBar.toggleClass('affix', window.scrollY > headerHight && document.body.offsetWidth > 991)
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
  if (backToTop.child('span').innerText !== scrollPercent) {
    backToTop.child('span').innerText = scrollPercent
  }
  // 更新百分比进度条的宽度
  if ($dom('#sidebar').hasClass('affix') || $dom('#sidebar').hasClass('on')) {
    $dom('.percent').changeOrGetWidth(scrollPercent)
  }
}

/**
 * 此函数用于修改右键点击显示菜单 <br/>
 * 需要在document下存在如下元素:
 * - id为clickMenu的容器(右键菜单容器)
 * - class为clickSubmenu的容器(可以有0到无限个)(子菜单容器)
 * CSS应有如下class:
 * - clickMenu的active类(控制显示)
 */
export const clickMenu = (): void => {
  const menuElement = $dom('#clickMenu')
  window.oncontextmenu = function (event) {
    if (event.ctrlKey) { // 当按下ctrl键时不触发自定义菜单
      return
    }
    event.preventDefault()
    let x = event.offsetX // 触发点到页面窗口左边的距离
    let y = event.offsetY
    const winWidth = window.innerWidth // 窗口的内部宽度（包括滚动条）
    const winHeight = window.innerHeight
    const menuWidth = menuElement.offsetWidth // 菜单宽度
    const menuHeight = menuElement.offsetHeight
    x = winWidth - menuWidth >= x ? x : winWidth - menuWidth
    y = winHeight - menuHeight >= y ? y : winHeight - menuHeight
    menuElement.style.top = y + 'px'
    menuElement.style.left = x + 'px'
    menuElement.classList.add('active')
    $dom.each('.clickSubmenu', (submenu) => {
      if (x > (winWidth - menuWidth - submenu.offsetWidth)) {
        submenu.style.left = '-200px'
      } else {
        submenu.style.left = ''
        submenu.style.right = '-200px'
      }
    })
  }
  window.addEventListener('click', () => {
    menuElement.classList.remove('active')
  })
}

// 可见度监听(离开页面和返回时更改document的title)
export const visibilityListener = () => {
  const iconNode = $dom('[rel="icon"]')
  document.addEventListener('visibilitychange', () => {
    switch (document.visibilityState) {
      case 'hidden':
        iconNode.attr('href', statics + CONFIG.favicon.hidden)
        document.title = LOCAL.favicon.hide
        if (CONFIG.loader.switch) {
          Loader.show()
        }
        clearTimeout(titleTime)
        break
      case 'visible':
        iconNode.attr('href', statics + CONFIG.favicon.normal)
        document.title = LOCAL.favicon.show
        if (CONFIG.loader.switch) {
          Loader.hide(1000)
        }
        setTitleTime(setTimeout(() => {
          document.title = originTitle
        }, 2000))
        break
    }
  })
}
