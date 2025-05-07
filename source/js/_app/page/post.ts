import { postImageViewer } from './imageviewer'
import { clipBoard, showtip } from '../globals/tools'
import { CONFIG, BODY } from '../globals/globalVars'
import { pageScroll, transition } from '../library/anime'
import { getDisplay, setDisplay, wrapObject } from '../library/proto'

export const postBeauty = () => {
  if (!document.querySelector('.md')) { return }

  postImageViewer('.post.block');

  (document.querySelector('.post.block') as HTMLTextAreaElement).oncopy = (event) => {
    showtip(LOCAL.copyright)

    if (LOCAL.nocopy) {
      event.preventDefault()
      return
    }

    const copyright = document.getElementById('copyright')
    if (window.getSelection().toString().length > CONFIG.experiments.copyrightLength && copyright) {
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
        throw new Error('Clipboard API not supported')
      }
    }
  }

  document.querySelectorAll('li ruby').forEach((element) => {
    let parent = element.parentNode as HTMLElement
    // @ts-ignore
    if (element.parentNode.tagName !== 'LI') {
      parent = element.parentNode.parentNode as HTMLElement
    }
    parent.classList.add('ruby')
  })

  document.querySelectorAll('ol[start]').forEach((element) => {
    // @ts-ignore
    element.style.counterReset = 'counter ' + parseInt(element.getAttribute('start') - 1)
  })

  document.querySelectorAll<HTMLElement>('.md table').forEach((element) => {
    wrapObject(element, {
      className: 'table-container'
    })
  })

  document.querySelectorAll('.highlight > .table-container').forEach((element) => {
    element.className = 'code-container'
  })

  document.querySelectorAll<HTMLElement>('figure.highlight').forEach((element) => {
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
        code_container.querySelectorAll('pre').forEach((line) => {
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
      if (element.classList.contains('breakline')) {
        element.classList.remove('breakline')
        target.querySelector('.ic').className = 'ic i-align-left'
      } else {
        element.classList.add('breakline')
        target.querySelector('.ic').className = 'ic i-align-justify'
      }
    })

    const fullscreenBtn = element.querySelector('.fullscreen-btn')
    const removeFullscreen = () => {
      element.classList.remove('fullscreen')
      element.scrollTop = 0
      BODY.classList.remove('fullscreen')
      fullscreenBtn.querySelector('.ic').className = 'ic i-expand'
    }
    const fullscreenHandle = () => {
      if (element.classList.contains('fullscreen')) {
        removeFullscreen()
        if (code_container && code_container.querySelectorAll('tr').length > 15) {
          const showBtn = code_container.querySelector('.show-btn')
          code_container.style.maxHeight = '300px'
          showBtn.classList.remove('open')
        }
        pageScroll(element)
      } else {
        element.classList.add('fullscreen')
        BODY.classList.add('fullscreen')
        fullscreenBtn.querySelector('.ic').className = 'ic i-compress'
        if (code_container && code_container.querySelectorAll('tr').length > 15) {
          const showBtn = code_container.querySelector('.show-btn')
          code_container.style.maxHeight = ''
          showBtn.classList.add('open')
        }
      }
    }
    fullscreenBtn.addEventListener('click', fullscreenHandle)
    caption && caption.addEventListener('click', fullscreenHandle)

    if (code_container && code_container.querySelectorAll('tr').length > 15) {
      code_container.style.maxHeight = '300px'
      code_container.insertAdjacentHTML('beforeend', '<div class="show-btn"><i class="ic i-angle-down"></i></div>')
      const showBtn = code_container.querySelector('.show-btn')

      const hideCode = () => {
        code_container.style.maxHeight = '300px'
        showBtn.classList.remove('open')
      }
      const showCode = () => {
        code_container.style.maxHeight = ''
        showBtn.classList.add('open')
      }

      showBtn.addEventListener('click', () => {
        if (showBtn.classList.contains('open')) {
          removeFullscreen()
          hideCode()
          pageScroll(code_container)
        } else {
          showCode()
        }
      })
    }
  })

  document.querySelectorAll('pre.mermaid > svg').forEach((element) => {
    const temp = <SVGAElement><unknown>element
    temp.style.maxWidth = ''
  })

  document.querySelectorAll('.reward button').forEach((element) => {
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
    document.querySelectorAll('.quiz > ul.options li').forEach((element) => {
      element.addEventListener('click', () => {
        if (element.classList.contains('correct')) {
          element.classList.toggle('right');
          (element.parentNode.parentNode as HTMLElement).classList.add('show')
        } else {
          element.classList.toggle('wrong')
        }
      })
    })

    document.querySelectorAll('.quiz > p').forEach((element) => {
      element.addEventListener('click', () => {
        (element.parentNode as HTMLElement).classList.toggle('show')
      })
    })

    document.querySelectorAll('.quiz > p:first-child').forEach((element) => {
      const quiz = element.parentNode as HTMLElement
      let type = 'choice'
      if (quiz.classList.contains('true') || quiz.classList.contains('false')) {
        type = 'true_false'
      }
      if (quiz.classList.contains('multi')) {
        type = 'multiple'
      }
      if (quiz.classList.contains('fill')) {
        type = 'gap_fill'
      }
      if (quiz.classList.contains('essay')) {
        type = 'essay'
      }
      element.setAttribute('data-type', LOCAL.quiz[type])
    })

    document.querySelectorAll('.quiz .mistake').forEach((element) => {
      element.setAttribute('data-type', LOCAL.quiz.mistake)
    })
  }

  document.querySelectorAll('div.tags a').forEach((element) => {
    element.className = ['primary', 'success', 'info', 'warning', 'danger'][Math.floor(Math.random() * 5)]
  })

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
