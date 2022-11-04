/* global CONFIG  */
const statics = CONFIG.statics.indexOf('//') > 0 ? CONFIG.statics : CONFIG.root
const scrollAction:{x:number, y:number} = { x: undefined, y: undefined }
let diffY = 0
let originTitle, titleTime
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
let toolBtn = $dom('#tool'); let toolPlayer; let backToTop; let goToComment; let showContents
let siteSearch = $dom('#search')
let siteNavHeight, headerHightInner, headerHight
let oWinHeight = window.innerHeight
let oWinWidth = window.innerWidth
let LOCAL_HASH = 0; let LOCAL_URL = window.location.href
let pjax

/**
 * 更改日夜模式
 */
const changeTheme = function (type?:string) {
  const btn = $dom('.theme .ic')
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
      if (window.matchMedia('(prefers-color-scheme:dark)').matches) {
        changeTheme('dark')
      } else {
        changeTheme()
      }
    }
  }
}

/**
 * 懒加载图片
 */
const lazyload = lozad('img, [data-background-image]', {
  loaded: function (el:HTMLElement) {
    el.addClass('lozaded')
  }
})

const Loader = {
  timer: null,
  lock: false,
  show: function () {
    clearTimeout(this.timer)
    document.body.removeClass('loaded')
    loadCat.attr('style', 'display:block')
    Loader.lock = false
  },
  hide: function (sec?:number) {
    if (!CONFIG.loader.start) { sec = -1 }
    this.timer = setTimeout(this.vanish, sec || 3000)
  },
  vanish: function ():never|void {
    if (Loader.lock) { return }
    if (CONFIG.loader.start) { transition(loadCat, 0) }
    document.body.addClass('loaded')
    Loader.lock = true
  }
}

/**
 * 更改主题的meta
 */
const changeMetaTheme = function (color:string):void {
  if (HTML.attr('data-theme') === 'dark') { color = '#222' }

  $dom('meta[name="theme-color"]').attr('content', color)
}

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

  $dom('.theme').addEventListener('click', function (event) {
    let c
    const temp = <HTMLElement> event.currentTarget
    const btn = temp.child('.ic')

    const neko = BODY.createChild('div', {
      id: 'neko',
      innerHTML: '<div class="planet"><div class="sun"></div><div class="moon"></div></div><div class="body"><div class="face"><section class="eyes left"><span class="pupil"></span></section><section class="eyes right"><span class="pupil"></span></section><span class="nose"></span></div></div>'
    })

    const hideNeko = function () {
      transition(neko, {
        delay: 2500,
        opacity: 0
      }, function () {
        BODY.removeChild(neko)
      })
    }

    if (btn.hasClass('i-sun')) {
      c = function () {
        neko.addClass('dark')
        changeTheme('dark')
        $storage.set('theme', 'dark')
        hideNeko()
      }
    } else {
      neko.addClass('dark')
      c = function () {
        neko.removeClass('dark')
        changeTheme()
        $storage.set('theme', 'light')
        hideNeko()
      }
    }
    transition(neko, 1, function () {
      setTimeout(c, 210)
    })
  })
}

const visibilityListener = function () {
  let iconNode = $dom('[rel="icon"]')
  document.addEventListener('visibilitychange', function () {
    switch (document.visibilityState) {
      case 'hidden':
        iconNode.attr('href', statics + CONFIG.favicon.hidden)
        document.title = LOCAL.favicon.hide
        if (CONFIG.loader.switch) { Loader.show() }
        clearTimeout(titleTime)
        break
      case 'visible':
        iconNode.attr('href', statics + CONFIG.favicon.normal)
        document.title = LOCAL.favicon.show
        if (CONFIG.loader.switch) { Loader.hide(1000) }
        titleTime = setTimeout(function () {
          document.title = originTitle
        }, 2000)
        break
    }
  })
}

const showtip = function (msg:string):void|never {
  if (!msg) { return }

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
  siteNavHeight = siteNav.height()
  headerHightInner = siteHeader.height()
  headerHight = headerHightInner + $dom('#waves').height()

  if (oWinWidth !== window.innerWidth) { sideBarToggleHandle(null, 1) }

  oWinHeight = window.innerHeight
  oWinWidth = window.innerWidth
  sideBar.child('.panels').height(oWinHeight + 'px')
}

const scrollHandle = function (event) {
  const winHeight = window.innerHeight
  const docHeight = getDocHeight()
  const contentVisibilityHeight = docHeight > winHeight ? docHeight - winHeight : document.body.scrollHeight - winHeight
  const SHOW = window.scrollY > headerHightInner
  const startScroll = window.scrollY > 0

  if (SHOW) {
    changeMetaTheme('#FFF')
  } else {
    changeMetaTheme('#222')
  }

  siteNav.toggleClass('show', SHOW)
  toolBtn.toggleClass('affix', startScroll)
  siteBrand.toggleClass('affix', startScroll)
  sideBar.toggleClass('affix', window.scrollY > headerHight && document.body.offsetWidth > 991)

  if (typeof scrollAction.y === 'undefined') {
    scrollAction.y = window.scrollY
    // scrollAction.x = Container.scrollLeft;
    // scrollAction.y = Container.scrollTop;
  }
  // var diffX = scrollAction.x - Container.scrollLeft;

  diffY = scrollAction.y - window.scrollY

  // if (diffX < 0) {
  // Scroll right
  // } else if (diffX > 0) {
  // Scroll left
  // } else
  if (diffY < 0) {
    // Scroll down
    siteNav.removeClass('up')
    siteNav.toggleClass('down', SHOW)
  } else if (diffY > 0) {
    // Scroll up
    siteNav.removeClass('down')
    siteNav.toggleClass('up', SHOW)
  } else {
    // First scroll event
  }
  // scrollAction.x = Container.scrollLeft;
  scrollAction.y = window.scrollY

  const scrollPercent = Math.round(Math.min(100 * window.scrollY / contentVisibilityHeight, 100)) + '%'
  backToTop.child('span').innerText = scrollPercent
  $dom('.percent').width(scrollPercent)
}

const pagePosition = function () {
  if (CONFIG.auto_scroll) {
    $storage.set(LOCAL_URL, String(scrollAction.y))
  }
}

const positionInit = function (comment?:boolean) {
  const anchor = window.location.hash
  let target = null
  if (LOCAL_HASH) {
    $storage.del(LOCAL_URL)
    return
  }

  if (anchor) { target = $dom(decodeURI(anchor)) } else {
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

const clipBoard = function (str: string, callback?: (result) => void) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(str).then(() => {
      callback && callback(true)
    }, () => {
      callback && callback(false)
    })
  } else {
    const ta = <HTMLTextAreaElement> BODY.createChild('textarea', {
      style: {
        top: window.scrollY + 'px', // Prevent page scrolling
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
