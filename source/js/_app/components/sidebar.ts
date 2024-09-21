/* 边栏分区 */

import { CONFIG, Container, diffY, menuToggle, showContents, sideBar } from '../globals/globalVars'
import { clipBoard } from '../globals/tools'
import { pageScroll, transition } from '../library/anime'
import { $dom } from '../library/dom'
import initProto, { getHeight, setDisplay } from '../library/proto'

initProto()
export const sideBarToggleHandle = (event:Event, force?:number) => {
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
      transition(sideBar, 'slideRightIn', () => {
        sideBar.addClass('on')
        menuToggle.addClass('close')
      })
    }
  }
}

export const sideBarTab = () => {
  const sideBarInner = sideBar.querySelector('.inner')

  if (sideBar.querySelector('.tab')) {
    sideBarInner.removeChild(sideBar.querySelector('.tab'))
  }

  const list = document.createElement('ul'); let active = 'active'
  list.className = 'tab';

  ['contents', 'related', 'overview'].forEach((item) => {
    const element = sideBar.querySelector('.panel.' + item)

    if (element.innerHTML.trim().length < 1) {
      if (item === 'contents') {
        setDisplay(showContents, 'none')
      }
      return
    }

    if (item === 'contents') {
      setDisplay(showContents, '')
    }

    const tab = document.createElement('li')
    const span = document.createElement('span')
    const text = document.createTextNode(element.getAttribute('data-title'))
    span.appendChild(text)
    tab.appendChild(span)
    tab.addClass(item + ' item')

    if (active) {
      element.addClass(active)
      tab.addClass(active)
    } else {
      element.removeClass('active')
    }
    tab.addEventListener('click', (event) => {
      const target = event.currentTarget as HTMLElement
      if (target.hasClass('active')) return

      sideBar.find('.tab .item').forEach((element) => {
        element.removeClass('active')
      })

      sideBar.find('.panel').forEach((element) => {
        element.removeClass('active')
      })

      sideBar.querySelector('.panel.' + target.className.replace(' item', '')).addClass('active')

      target.addClass('active')
    })

    list.appendChild(tab)
    active = ''
  })

  if (list.childNodes.length > 1) {
    sideBarInner.insertBefore(list, sideBarInner.childNodes[0]);
    (sideBar.querySelector('.panels') as HTMLElement).style.paddingTop = ''
  } else {
    (sideBar.querySelector('.panels') as HTMLElement).style.paddingTop = '.625rem'
  }
}

export const sidebarTOC = () => {
  const activateNavByIndex = (index:number): void => {
    const target = navItems[index]

    if (!target) return

    if (target.hasClass('current')) {
      return
    }

    $dom.each('.toc .active', (element) => {
      element && element.removeClass('active current')
    })

    sections.forEach((element) => {
      element && element.removeClass('active')
    })

    target.addClass('active current')
    sections[index] && sections[index].addClass('active')

    let parent = <Element> target.parentNode

    while (!parent.matches('.contents')) {
      if (parent.matches('li')) {
        parent.addClass('active')
        const t = document.getElementById(decodeURIComponent(parent.querySelector('a.toc-link').getAttribute('href').replace('#', '')))
        if (t) {
          t.addClass('active')
        }
      }
      parent = <Element> parent.parentNode
    }
    // Scrolling to center active TOC element if TOC content is taller than viewport.
    if (getComputedStyle(sideBar).display !== 'none' && tocElement.hasClass('active')) {
      pageScroll((tocElement as HTMLElement), target.offsetTop - ((tocElement as HTMLElement).offsetHeight / 4))
    }
  }
  const navItems = $dom.all('.contents li')

  if (navItems.length < 1) {
    return
  }

  let sections = [...navItems] as HTMLElement[]
  let activeLock = null

  sections = sections.map((element, index) => {
    const link = element.querySelector('a.toc-link')
    const anchor = document.getElementById(decodeURI(link.getAttribute('href').replace('#', '')))
    if (!anchor) return null
    const alink = anchor.querySelector('a.anchor')

    const anchorScroll = (event:MouseEvent) => {
      event.preventDefault()
      const target = document.getElementById(decodeURI((event.currentTarget as HTMLElement).getAttribute('href').replace('#', '')))

      activeLock = index
      pageScroll((target as HTMLElement), null, () => {
        activateNavByIndex(index)
        activeLock = null
      })
    }

    // TOC item animation navigate.
    link.addEventListener('click', anchorScroll)
    alink && alink.addEventListener('click', (event) => {
      anchorScroll(<MouseEvent>event)
      clipBoard(CONFIG.hostname + '/' + LOCAL.path + (event.currentTarget as HTMLElement).getAttribute('href'))
    })
    return (anchor as HTMLElement)
  })

  const tocElement = sideBar.querySelector('.contents.panel')

  const findIndex = (entries: IntersectionObserverEntry[]) => {
    let index = 0
    let entry = entries[index]

    if (entry.boundingClientRect.top > 0) {
      index = sections.indexOf(entry.target as HTMLElement)
      return index === 0 ? 0 : index - 1
    }
    for (; index < entries.length; index++) {
      if (entries[index].boundingClientRect.top <= 0) {
        entry = entries[index]
      } else {
        return sections.indexOf(entry.target as HTMLElement)
      }
    }
    return sections.indexOf(entry.target as HTMLElement)
  }

  const createIntersectionObserver = () => {
    const observer = new IntersectionObserver((entries) => {
      const index = findIndex(entries) + (diffY < 0 ? 1 : 0)
      if (activeLock === null) {
        activateNavByIndex(index)
      }
    }, {
      rootMargin: '0px 0px -100% 0px', threshold: 0
    })

    sections.forEach((element) => {
      element && observer.observe(element)
    })
  }

  createIntersectionObserver()
}

export const backToTopHandle = () => {
  pageScroll(0)
}

export const goToBottomHandle = () => {
  pageScroll(parseInt(String(getHeight(Container))))
}

export const goToCommentHandle = () => {
  pageScroll(document.getElementById('comments'))
}

export const menuActive = () => {
  $dom.each('.menu .item:not(.title)', (element) => {
    const target = <HTMLAnchorElement> element.querySelector('a[href]')
    const parentItem = element.parentNode.parentNode
    if (!target) return
    const isSamePath = target.pathname === location.pathname || target.pathname === location.pathname.replace('index.html', '')
    const isSubPath = !CONFIG.root.startsWith(target.pathname) && location.pathname.startsWith(target.pathname)
    const active = !target.onclick && target.hostname === location.hostname && (isSamePath || isSubPath)
    element.toggleClass('active', active)
    if (element.parentNode.querySelector('.active') && parentItem.hasClass('dropdown')) {
      parentItem.removeClass('active').addClass('expand')
    } else {
      parentItem.removeClass('expand')
    }
  })
}
