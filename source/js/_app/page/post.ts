import { $dom } from '../library/dom'
import { postFancybox } from './fancybox'
import { clipBoard, showtip } from '../globals/tools'
import { BODY } from '../globals/globalVars'
import { pageScroll, transition } from '../library/anime'
import { mediaPlayer } from '../player'
import { getDisplay, setDisplay, wrapObject } from '../library/proto'

export const postBeauty = () => {
  if (!document.querySelector('.md')) { return }

  if (__shokax_fancybox__) {
    postFancybox('.post.block')
  }

  (document.querySelector('.post.block') as HTMLTextAreaElement).oncopy = (event) => {
    showtip(LOCAL.copyright)

    if (LOCAL.nocopy) {
      event.preventDefault()
      return
    }

    const copyright = document.getElementById('copyright')
    if (window.getSelection().toString().length > 30 && copyright) {
      event.preventDefault()
      const author = '# ' + (copyright.querySelector('.author') as HTMLElement).innerText
      const link = '# ' + (copyright.querySelector('.link') as HTMLElement).innerText
      const license = '# ' + (copyright.querySelector('.license') as HTMLElement).innerText
      const htmlData = author + '<br>' + link + '<br>' + license + '<br><br>' + window.getSelection().toString().replace(/\r\n/g, '<br>')

      const textData = author + '\n' + link + '\n' + license + '\n\n' + window.getSelection().toString().replace(/\r\n/g, '\n')
      if (event.clipboardData) {
        event.clipboardData.setData('text/html', htmlData)
        event.clipboardData.setData('text/plain', textData)
      } else {
        // @ts-ignore
        if (window.clipboardData) {
          // @ts-ignore
          return window.clipboardData.setData('text', textData)
        }
      }
    }
  }

  $dom.each('li ruby', (element) => {
    let parent = element.parentNode
    // @ts-ignore
    if (element.parentNode.tagName !== 'LI') {
      parent = element.parentNode.parentNode
    }
    parent.addClass('ruby')
  })

  $dom.each('ol[start]', (element) => {
    // @ts-ignore
    element.style.counterReset = 'counter ' + parseInt(element.getAttribute('start') - 1)
  })

  $dom.each('.md table', (element) => {
    wrapObject(element, {
      className: 'table-container'
    })
  })

  $dom.each('.highlight > .table-container', (element) => {
    element.className = 'code-container'
  })

  $dom.each('figure.highlight', (element) => {
    const code_container = element.querySelector('.code-container') as HTMLElement
    const caption = element.querySelector('figcaption')

    element.insertAdjacentHTML('beforeend', '<div class="operation"><span class="breakline-btn"><i class="ic i-align-left"></i></span><span class="copy-btn"><i class="ic i-clipboard"></i></span><span class="fullscreen-btn"><i class="ic i-expand"></i></span></div>')

    const copyBtn = element.querySelector('.copy-btn')
    if (LOCAL.nocopy) {
      copyBtn.remove()
    } else {
      copyBtn.addEventListener('click', (event) => {
        const target = <HTMLElement>event.currentTarget
        let comma = ''; let code = ''
        code_container.find('pre').forEach((line) => {
          code += comma + line.innerText
          comma = '\n'
        })

        clipBoard(code, (result) => {
          target.querySelector('.ic').className = result ? 'ic i-check' : 'ic i-times'
          target.blur()
          showtip(LOCAL.copyright)
        })
      }, { passive: true })
      copyBtn.addEventListener('mouseleave', (event) => {
        setTimeout(() => {
          (event.target as HTMLElement).querySelector('.ic').className = 'ic i-clipboard'
        }, 1000)
      })
    }

    const breakBtn = element.querySelector('.breakline-btn')
    breakBtn.addEventListener('click', (event) => {
      const target = event.currentTarget as HTMLElement
      if (element.hasClass('breakline')) {
        element.removeClass('breakline')
        target.querySelector('.ic').className = 'ic i-align-left'
      } else {
        element.addClass('breakline')
        target.querySelector('.ic').className = 'ic i-align-justify'
      }
    })

    const fullscreenBtn = element.querySelector('.fullscreen-btn')
    const removeFullscreen = () => {
      element.removeClass('fullscreen')
      element.scrollTop = 0
      BODY.removeClass('fullscreen')
      fullscreenBtn.querySelector('.ic').className = 'ic i-expand'
    }
    const fullscreenHandle = () => {
      if (element.hasClass('fullscreen')) {
        removeFullscreen()
        if (code_container && code_container.find('tr').length > 15) {
          const showBtn = code_container.querySelector('.show-btn')
          code_container.style.maxHeight = '300px'
          showBtn.removeClass('open')
        }
        pageScroll(element)
      } else {
        element.addClass('fullscreen')
        BODY.addClass('fullscreen')
        fullscreenBtn.querySelector('.ic').className = 'ic i-compress'
        if (code_container && code_container.find('tr').length > 15) {
          const showBtn = code_container.querySelector('.show-btn')
          code_container.style.maxHeight = ''
          showBtn.addClass('open')
        }
      }
    }
    fullscreenBtn.addEventListener('click', fullscreenHandle)
    caption && caption.addEventListener('click', fullscreenHandle)

    if (code_container && code_container.find('tr').length > 15) {
      code_container.style.maxHeight = '300px'
      code_container.insertAdjacentHTML('beforeend', '<div class="show-btn"><i class="ic i-angle-down"></i></div>')
      const showBtn = code_container.querySelector('.show-btn')

      const hideCode = () => {
        code_container.style.maxHeight = '300px'
        showBtn.removeClass('open')
      }
      const showCode = () => {
        code_container.style.maxHeight = ''
        showBtn.addClass('open')
      }

      showBtn.addEventListener('click', () => {
        if (showBtn.hasClass('open')) {
          removeFullscreen()
          hideCode()
          pageScroll(code_container)
        } else {
          showCode()
        }
      })
    }
  })

  $dom.each('pre.mermaid > svg', (element) => {
    const temp = <SVGAElement><unknown>element
    temp.style.maxWidth = ''
  })

  $dom.each('.reward button', (element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault()
      const qr = document.getElementById('qr')
      if (getDisplay(qr) === 'inline-flex') {
        transition(qr, 0)
      } else {
        transition(qr, 1, () => {
          setDisplay(qr, 'inline-flex')
        }) // slideUpBigIn
      }
    })
  })

  // quiz
  if (__shokax_quiz__) {
    $dom.each('.quiz > ul.options li', (element) => {
      element.addEventListener('click', () => {
        if (element.hasClass('correct')) {
          element.toggleClass('right')
          element.parentNode.parentNode.addClass('show')
        } else {
          element.toggleClass('wrong')
        }
      })
    })

    $dom.each('.quiz > p', (element) => {
      element.addEventListener('click', () => {
        element.parentNode.toggleClass('show')
      })
    })

    $dom.each('.quiz > p:first-child', (element) => {
      const quiz = element.parentNode
      let type = 'choice'
      if (quiz.hasClass('true') || quiz.hasClass('false')) {
        type = 'true_false'
      }
      if (quiz.hasClass('multi')) {
        type = 'multiple'
      }
      if (quiz.hasClass('fill')) {
        type = 'gap_fill'
      }
      if (quiz.hasClass('essay')) {
        type = 'essay'
      }
      element.setAttribute('data-type', LOCAL.quiz[type])
    })

    $dom.each('.quiz .mistake', (element) => {
      element.setAttribute('data-type', LOCAL.quiz.mistake)
    })
  }

  $dom.each('div.tags a', (element) => {
    element.className = ['primary', 'success', 'info', 'warning', 'danger'][Math.floor(Math.random() * 5)]
  })

  if (__shokax_player__) {
    $dom.each('.md div.player', (element) => {
      mediaPlayer(element, {
        type: element.getAttribute('data-type'),
        mode: 'order',
        btns: []
      }).player.load(JSON.parse(element.getAttribute('data-src'))).fetch()
    })
  }

  const angleDown = document.querySelectorAll('.show-btn .i-angle-down')
  if (angleDown.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          angleDown.forEach(i => {
            i.classList.remove('stop-animation')
          })
        } else {
          angleDown.forEach(i => {
            i.classList.add('stop-animation')
          })
        }
      })
    }, {
      root: null,
      threshold: 0.5
    })
    angleDown.forEach(i => {
      io.observe(i)
    })
  }
}
