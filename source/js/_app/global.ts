const statics = CONFIG.statics.indexOf('//') > 0 ? CONFIG.statics : CONFIG.root
const scrollAction: { x: number, y: number } = {x: undefined, y: undefined}
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
let toolBtn = $dom('#tool');
let toolPlayer;
let backToTop;
let goToComment;
let showContents
let siteSearch = $dom('#search')
let siteNavHeight, headerHightInner, headerHight
let oWinHeight = window.innerHeight
let oWinWidth = window.innerWidth
let LOCAL_HASH = 0;
let LOCAL_URL = window.location.href
let pjax

/**
 * 更改日夜模式
 */
const changeTheme = function (type?: string) {
  const btn = $dom('.theme .fa')
  if (type === 'dark') {
    HTML.attr('data-theme', type)
    btn.removeClass('fa-sunrise')
    btn.addClass('fa-moon-stars')
  } else {
    HTML.attr('data-theme', null)
    btn.removeClass('fa-moon-stars')
    btn.addClass('fa-sunrise')
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
  timer: null,
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

/*
这段代码的作用是监听页面的可见性变化，并根据页面可见性状态执行不同的操作。当页面隐藏时，会将页面的图标更改为隐藏状态图标，
并将页面标题更改为隐藏状态标题，如果配置了 loader 开关，还会显示 loader。当页面变为可见状态时，会将页面的图标更改为正常状态图标，并将页面标题更改为正常状态标题，如果配置了 loader 开关，
还会隐藏 loader。还会设置一个标题计时器，2秒后更改标题为原始标题。
*/
const visibilityListener = function () {
  // 获取页面中 rel="icon" 的元素
  let iconNode = $dom('[rel="icon"]')
  // 添加页面可见性改变事件监听器
  document.addEventListener('visibilitychange', function () {
    // 根据页面可见性状态执行不同操作
    switch (document.visibilityState) {
      case 'hidden':
        // 将页面图标更改为隐藏状态图标
        iconNode.attr('href', statics + CONFIG.favicon.hidden)
        // 将页面标题更改为隐藏状态标题
        document.title = LOCAL.favicon.hide
        // 如果配置了 loader 开关，则显示 loader
        if (CONFIG.loader.switch) {
          Loader.show()
        }
        // 清除标题计时器
        clearTimeout(titleTime)
        break
      case 'visible':
        // 将页面图标更改为正常状态图标
        iconNode.attr('href', statics + CONFIG.favicon.normal)
        // 将页面标题更改为正常状态标题
        document.title = LOCAL.favicon.show
        // 如果配置了 loader 开关，则隐藏 loader
        if (CONFIG.loader.switch) {
          Loader.hide(1000)
        }
        // 设置标题计时器，2秒后更改标题为原始标题
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
  siteNavHeight = siteNav.changeOrGetHeight()
  headerHightInner = siteHeader.changeOrGetHeight()
  headerHight = headerHightInner + $dom('#waves').changeOrGetHeight()

  if (oWinWidth !== window.innerWidth) {
    sideBarToggleHandle(null, 1)
  }

  oWinHeight = window.innerHeight
  oWinWidth = window.innerWidth
  sideBar.child('.panels').changeOrGetHeight(oWinHeight + 'px')
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

  // 控制滑动时导航栏显示
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
  scrollAction.y = window.scrollY

  const scrollPercent = Math.round(Math.min(100 * window.scrollY / contentVisibilityHeight, 100)) + '%'
  backToTop.child('span').innerText = scrollPercent
  $dom('.percent').changeOrGetWidth(scrollPercent)
}

const pagePosition = function () {
  if (CONFIG.auto_scroll) {
    $storage.set(LOCAL_URL, String(scrollAction.y))
  }
}

const positionInit = function (comment?: boolean) {
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

const clipBoard = function (str: string, callback?: (result) => void) {
  // 如果浏览器支持剪贴板 API 且运行在安全上下文中
  if (navigator.clipboard && window.isSecureContext) {
    // 使用剪贴板 API 将字符串写入剪贴板
    navigator.clipboard.writeText(str).then(() => {
      // 如果回调函数存在，则执行回调函数并传入 true
      callback && callback(true)
    }, () => {
      // 如果回调函数存在，则执行回调函数并传入 false
      callback && callback(false)
    })
  } else {
    // 创建一个隐藏的 textarea 元素
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
    // 获取当前选中的文本
    const selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false
    // 选中 textarea 中的文本
    ta.select()
    // 设置文本选择范围
    ta.setSelectionRange(0, str.length)
    // 设置 textarea 不可编辑
    ta.readOnly = false
    // 使用 document.execCommand 将 textarea 中的文本复制到剪贴板
    const result = document.execCommand('copy')
    // 如果回调函数存在，则执行回调函数并传入 copy 的结果
    callback && callback(result)
    // 失去焦点（针对 iOS）
    ta.blur()
    // 如果原来有选中的文本
    if (selected) {
    // 清空选中的文本
      selection.removeAllRanges()
    // 添加原来选中的文本
      selection.addRange(selected)
    }
    // 将创建的 textarea 元素从页面中删除
    BODY.removeChild(ta)
  }
}

const isOutime = function (): void {
  let updateTime: Date;
  if (CONFIG.outime.enable && LOCAL.outime) {
    const times = document.getElementsByTagName('time');
    if (times.length === 0) {
      return;
    }
    const posts = document.getElementsByClassName('body md');
    if (posts.length === 0) {
      return;
    }

    const now = Date.now(); // 当前时间戳
    const pubTime = new Date(times[0].dateTime); // 文章发布时间戳
    if (times.length === 1) {
      updateTime = pubTime; // 文章发布时间亦是最后更新时间
    } else {
      updateTime = new Date(times[1].dateTime); // 文章最后更新时间戳
    }
    // @ts-ignore
    const interval = parseInt(String(now - updateTime)); // 时间差
    const days = parseInt(String(CONFIG.outime.days)) || 30; // 设置时效，默认硬编码 30 天
    // 最后一次更新时间超过 days 天（毫秒）
    if (interval > (days * 86400000)) {
      // @ts-ignore
      const publish = parseInt(String((now - pubTime) / 86400000));
      const updated = parseInt(String(interval / 86400000));
      const template = LOCAL.template.replace('{{publish}}', String(publish)).replace('{{updated}}', String(updated));
      posts[0].insertAdjacentHTML('afterbegin', template);
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
    let x = event.offsetX; //触发点到页面窗口左边的距离
    let y = event.offsetY;
    let winWidth = window.innerWidth; //窗口的内部宽度（包括滚动条）
    let winHeight = window.innerHeight;
    let menuWidth = menuElement.offsetWidth; //菜单宽度
    let menuHeight = menuElement.offsetHeight;
    x = winWidth - menuWidth >= x ? x : winWidth - menuWidth;
    y = winHeight - menuHeight >= y ? y : winHeight - menuHeight;
    menuElement.style.top = y + 'px';
    menuElement.style.left = x + 'px';
    menuElement.classList.add('active');
    $dom.each(".clickSubmenu", (submenu) => {
      if (x > (winWidth - menuWidth - submenu.offsetWidth)) {
        submenu.style.left = '-200px';
      } else {
        submenu.style.left = '';
        submenu.style.right = '-200px';
      }
    })
  }
  window.addEventListener('click', function () {
    menuElement.classList.remove('active');
  })
}
