const statics = CONFIG.statics.indexOf('//') > 0 ? CONFIG.statics : CONFIG.root
const scrollAction: { x: number, y: number } = { x: 0, y: 0 }
let diffY = 0
let originTitle: string, titleTime: NodeJS.Timeout
const BODY = document.getElementsByTagName('body')[0]
const HTML = document.documentElement
const Container = $dom('#container')
const loadCat = $dom('#loading')
const siteNav = $dom('#nav')
const siteHeader = $dom('#header')
const menuToggle = siteNav.child('.toggle')
const quickBtn = $dom('#quick')
const sideBar = $dom('#sidebar')
const siteBrand = $dom('#brand')
let toolBtn = $dom('#tool')
let toolPlayer
let backToTop: HTMLElement
let goToComment
let showContents
let siteSearch = $dom('#search')
let siteNavHeight: number, headerHightInner: number, headerHight: number
let oWinHeight = window.innerHeight
let oWinWidth = window.innerWidth
let LOCAL_HASH = 0
let LOCAL_URL = window.location.href
let pjax

/**
 * 更改日夜模式
 */
const changeTheme = function (type?: string) {
  const btn = <HTMLElement>$dom('.theme .ic')
  if (type === 'dark') {
    HTML.attr('data-theme', type)
    btn.removeClass('i-sun')
    btn.addClass('i-moon')
  } else {
    HTML.attr('data-theme', null)
    btn.removeClass('i-moon')
    btn.addClass('i-sun')
  }
}

/**
 * 自动调整黑夜白天
 * 优先级: 手动选择>时间>跟随系统
 */
const autoDarkmode = function () {
  if (CONFIG.auto_dark.enable) {
    if (new Date().getHours() >= CONFIG.auto_dark.start || new Date().getHours() <= CONFIG.auto_dark.end) {
      changeTheme('dark')
    } else {
      changeTheme()
    }
  }
}

/**
 * 懒加载图片
 */
const lazyload = lozad('img, [data-background-image]', {
  loaded: function (el: HTMLElement) {
    el.addClass('lozaded')
  }
})

// 加载动画
const Loader = {
  timer: undefined,
  lock: false,
  show: function () {
    clearTimeout(this.timer)
    document.body.removeClass('loaded')
    loadCat.attr('style', 'display:block')
    Loader.lock = false
  },
  hide: function (sec?: number) {
    if (!CONFIG.loader.start) {
      sec = -1
    }
    this.timer = setTimeout(this.vanish, sec || 3000)
  },
  vanish: function (): void {
    if (Loader.lock) {
      return
    }
    if (CONFIG.loader.start) {
      transition(loadCat, 0)
    }
    document.body.addClass('loaded')
    Loader.lock = true
  }
}

/**
 * 更改主题的meta
 */
const changeMetaTheme = function (color: string): void {
  if (HTML.attr('data-theme') === 'dark') {
    color = '#222'
  }

  $dom('meta[name="theme-color"]').attr('content', color)
}

// 记忆日夜模式切换和系统亮暗模式监听
const themeColorListener = function () {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (mediaQueryList) {
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

// 可见度监听(离开页面和返回时更改document的title)
const visibilityListener = function () {
  const iconNode = $dom('[rel="icon"]')
  document.addEventListener('visibilitychange', function () {
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
        titleTime = setTimeout(function () {
          document.title = originTitle
        }, 2000)
        break
    }
  })
}

// 显示提示(现阶段用于版权及复制结果提示)
const showtip = function (msg: string): void | never {
  if (!msg) {
    return
  }

  const tipbox = BODY.createChild('div', {
    innerHTML: msg,
    className: 'tip'
  })

  setTimeout(function () {
    tipbox.addClass('hide')
    setTimeout(function () {
      BODY.removeChild(tipbox)
    }, 300)
  }, 3000)
}

const resizeHandle = function (event?) {
// 获取 siteNav 的高度
  siteNavHeight = siteNav.changeOrGetHeight()
  // 获取 siteHeader 的高度
  headerHightInner = siteHeader.changeOrGetHeight()
  // 获取 #waves 的高度
  headerHight = headerHightInner + $dom('#waves').changeOrGetHeight()

  // 判断窗口宽度是否改变
  if (oWinWidth !== window.innerWidth) {
    sideBarToggleHandle(null, 1)
  }

  // 记录窗口高度和宽度
  oWinHeight = window.innerHeight
  oWinWidth = window.innerWidth
  // 设置 sidebar .panels 元素的高度
//   sideBar.child('.panels').changeOrGetHeight(oWinHeight + 'px')
}

const scrollHandle = function (event) {
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
  diffY = scrollAction.y - window.scrollY

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
  backToTop.child('span').innerText = scrollPercent
  // 更新百分比进度条的宽度
  $dom('.percent').changeOrGetWidth(scrollPercent)
}

const pagePosition = function () {
  // 判断配置项是否开启了自动记录滚动位置
  if (CONFIG.auto_scroll) {
    // 将当前页面的滚动位置存入本地缓存
    $storage.set(LOCAL_URL, String(scrollAction.y))
  }
}

const positionInit = function (comment?: boolean) {
  // 获取页面锚点
  const anchor = window.location.hash

  let target = null
  if (LOCAL_HASH) {
    $storage.del(LOCAL_URL)
    return
  }

  if (anchor) {
    target = $dom(decodeURI(anchor))
  } else {
    target = CONFIG.auto_scroll ? parseInt($storage.get(LOCAL_URL)) : 0
  }

  if (target) {
    pageScroll(target)
    LOCAL_HASH = 1
  }

  if (comment && anchor && !LOCAL_HASH) {
    pageScroll(target)
    LOCAL_HASH = 1
  }
}

/*
这段代码是用来复制文本的。它使用了浏览器的 Clipboard API，如果浏览器支持该 API 并且当前页面是安全协议 (https)，
它将使用 Clipboard API 将文本复制到剪贴板。如果不支持，它会创建一个隐藏的文本区域并使用 document.execCommand('copy') 将文本复制到剪贴板。最后，它会回调传入的函数并传入一个布尔值表示是否成功复制。
*/
const clipBoard = function (str: string, callback?: (result) => void) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(str).then(() => {
      callback && callback(true)
    }, () => {
      callback && callback(false)
    })
  } else {
    const ta = <HTMLTextAreaElement><unknown>BODY.createChild('textarea', {
      style: {
        top: window.scrollY + 'px',
        position: 'absolute',
        opacity: '0'
      },
      readOnly: true,
      value: str
    })

    const selection = document.getSelection()
    const selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false
    ta.select()
    ta.setSelectionRange(0, str.length)
    ta.readOnly = false
    const result = document.execCommand('copy')
    callback && callback(result)
    ta.blur() // For iOS
    if (selected) {
      selection.removeAllRanges()
      selection.addRange(selected)
    }
    BODY.removeChild(ta)
  }
}

const isOutime = function (): void {
  let updateTime: Date
  if (CONFIG.outime.enable && LOCAL.outime) {
    const times = document.getElementsByTagName('time')
    if (times.length === 0) {
      return
    }
    const posts = document.getElementsByClassName('body md')
    if (posts.length === 0) {
      return
    }

    const now = Date.now() // 当前时间戳
    const pubTime = new Date(times[0].dateTime) // 文章发布时间戳
    if (times.length === 1) {
      updateTime = pubTime // 文章发布时间亦是最后更新时间
    } else {
      updateTime = new Date(times[1].dateTime) // 文章最后更新时间戳
    }
    // @ts-ignore
    const interval = parseInt(String(now - updateTime)) // 时间差
    const days = parseInt(String(CONFIG.outime.days)) || 30 // 设置时效，默认硬编码 30 天
    // 最后一次更新时间超过 days 天（毫秒）
    if (interval > (days * 86400000)) {
      // @ts-ignore
      const publish = parseInt(String((now - pubTime) / 86400000))
      const updated = parseInt(String(interval / 86400000))
      const template = LOCAL.template.replace('{{publish}}', String(publish)).replace('{{updated}}', String(updated))
      posts[0].insertAdjacentHTML('afterbegin', template)
    }
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
const clickMenu = function (): void {
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
  window.addEventListener('click', function () {
    menuElement.classList.remove('active')
  })
}
