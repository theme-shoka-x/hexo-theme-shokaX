
/* 边栏分区 */

const sideBarToggleHandle = function (event:Event, force?:number) {
  if (sideBar.hasClass('on')) {
    sideBar.removeClass('on')
    menuToggle.removeClass('close')
    if (force) {
      // @ts-ignore
      // noinspection JSConstantReassignment
      sideBar.style = ''
    } else {
      transition(sideBar, 'slideRightOut')
    }
  } else {
    if (force) {
      // @ts-ignore
      // noinspection JSConstantReassignment
      sideBar.style = ''
    } else {
      transition(sideBar, 'slideRightIn', function () {
        sideBar.addClass('on')
        menuToggle.addClass('close')
      })
    }
  }
}

const sideBarTab = function () {
  const sideBarInner = sideBar.child('.inner')
  const panels = sideBar.find('.panel')

  if (sideBar.child('.tab')) {
    sideBarInner.removeChild(sideBar.child('.tab'))
  }

  const list = document.createElement('ul'); let active = 'active'
  list.className = 'tab';

  ['contents', 'related', 'overview'].forEach(function (item) {
    const element = sideBar.child('.panel.' + item)

    if (element.innerHTML.replace(/(^\s*)|(\s*$)/g, '').length < 1) {
      if (item === 'contents') {
        showContents.display('none')
      }
      return
    }

    if (item === 'contents') {
      showContents.display('')
    }

    const tab = document.createElement('li')
    const span = document.createElement('span')
    const text = document.createTextNode(element.attr('data-title'))
    span.appendChild(text)
    tab.appendChild(span)
    tab.addClass(item + ' item')

    if (active) {
      element.addClass(active)
      tab.addClass(active)
    } else {
      element.removeClass('active')
    }
    // TODO 出现BUG把event去掉
    tab.addEventListener('click', function (event) {
      const target = event.currentTarget as HTMLElement
      if (target.hasClass('active')) return

      sideBar.find('.tab .item').forEach(function (element) {
        element.removeClass('active')
      })

      sideBar.find('.panel').forEach(function (element) {
        element.removeClass('active')
      })

      sideBar.child('.panel.' + target.className.replace(' item', '')).addClass('active')

      target.addClass('active')
    })

    list.appendChild(tab)
    active = ''
  })

  if (list.childNodes.length > 1) {
    sideBarInner.insertBefore(list, sideBarInner.childNodes[0])
    sideBar.child('.panels').style.paddingTop = ''
  } else {
    sideBar.child('.panels').style.paddingTop = '.625rem'
  }
}

const sidebarTOC = function () {
  const activateNavByIndex = function (index, lock?) {
    const target = navItems[index]

    if (!target) return

    if (target.hasClass('current')) {
      return
    }

    $dom.each('.toc .active', function (element) {
      element && element.removeClass('active current')
    })

    sections.forEach(function (element) {
      element && element.removeClass('active')
    })

    target.addClass('active current')
    sections[index] && sections[index].addClass('active')

    let parent = <Element> target.parentNode

    while (!parent.matches('.contents')) {
      if (parent.matches('li')) {
        parent.addClass('active')
        const t = $dom(parent.child('a.toc-link').attr('href'))
        if (t) {
          t.addClass('active')
        }
      }
      parent = <Element> parent.parentNode
    }
    // Scrolling to center active TOC element if TOC content is taller than viewport.
    if (getComputedStyle(sideBar).display !== 'none' && tocElement.hasClass('active')) {
      pageScroll(tocElement, target.offsetTop - (tocElement.offsetHeight / 4))
    }
  }
  const navItems = $dom.all('.contents li')

  if (navItems.length < 1) {
    return
  }

  let sections = Array.prototype.slice.call(navItems) || []
  let activeLock = null

  sections = sections.map(function (element, index) {
    const link = element.child('a.toc-link')
    const anchor = $dom(decodeURI(link.attr('href')))
    if (!anchor) return null
    const alink = anchor.child('a.anchor')

    const anchorScroll = function (event) {
      event.preventDefault()
      const target = $dom(decodeURI(event.currentTarget.attr('href')))

      activeLock = index
      pageScroll(target, null, function () {
        activateNavByIndex(index)
        activeLock = null
      })
    }

    // TOC item animation navigate.
    link.addEventListener('click', anchorScroll)
    alink && alink.addEventListener('click', function (event) {
      anchorScroll(event)
      clipBoard(CONFIG.hostname + '/' + LOCAL.path + event.currentTarget.attr('href'))
    })
    return anchor
  })

  const tocElement = sideBar.child('.contents.panel')

  const findIndex = function (entries) {
    let index = 0
    let entry = entries[index]

    if (entry.boundingClientRect.top > 0) {
      index = sections.indexOf(entry.target)
      return index === 0 ? 0 : index - 1
    }
    for (; index < entries.length; index++) {
      if (entries[index].boundingClientRect.top <= 0) {
        entry = entries[index]
      } else {
        return sections.indexOf(entry.target)
      }
    }
    return sections.indexOf(entry.target)
  }

  const createIntersectionObserver = function () {
    if (!window.IntersectionObserver) return

    const observer = new IntersectionObserver(function (entries, observe) {
      const index = findIndex(entries) + (diffY < 0 ? 1 : 0)
      if (activeLock === null) {
        activateNavByIndex(index)
      }
    }, {
      rootMargin: '0px 0px -100% 0px', threshold: 0
    })

    sections.forEach(function (element) {
      element && observer.observe(element)
    })
  }

  createIntersectionObserver()
}

const backToTopHandle = function () {
  pageScroll(0)
}

const goToBottomHandle = function () {
  pageScroll(parseInt(String(Container.changeOrGetHeight())))
}

const goToCommentHandle = function () {
  pageScroll($dom('#comments'))
}

const menuActive = function () {
  $dom.each('.menu .item:not(.title)', function (element) {
    const target = <HTMLAnchorElement> element.child('a[href]')
    const parentItem = element.parentNode.parentNode
    if (!target) return
    const isSamePath = target.pathname === location.pathname || target.pathname === location.pathname.replace('index.html', '')
    const isSubPath = !CONFIG.root.startsWith(target.pathname) && location.pathname.startsWith(target.pathname)
    const active = target.hostname === location.hostname && (isSamePath || isSubPath)
    element.toggleClass('active', active)
    if (element.parentNode.child('.active') && parentItem.hasClass('dropdown')) {
      parentItem.removeClass('active').addClass('expand')
    } else {
      parentItem.removeClass('expand')
    }
  })
}
