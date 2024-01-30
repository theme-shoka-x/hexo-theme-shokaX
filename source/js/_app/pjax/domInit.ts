import { backToTopHandle, goToBottomHandle, goToCommentHandle, sideBarToggleHandle } from '../components/sidebar'
import {
  backToTop,
  goToComment,
  loadCat,
  menuToggle,
  quickBtn, setBackToTop, setGoToComment, setShowContents, setToolBtn,
  setToolPlayer,
  showContents,
  siteHeader,
  siteNav,
  toolBtn,
  toolPlayer
} from '../globals/globalVars'
import { Loader } from '../globals/thirdparty'
import { $dom } from '../library/dom'
import { mediaPlayer } from '../player'

export default function domInit () {
  $dom.each('.overview .menu > .item', (el) => {
    siteNav.child('.menu').appendChild(el.cloneNode(true))
  })

  loadCat.addEventListener('click', Loader.vanish)
  menuToggle.addEventListener('click', sideBarToggleHandle)
  $dom('.dimmer').addEventListener('click', sideBarToggleHandle)

  quickBtn.child('.down').addEventListener('click', goToBottomHandle)
  quickBtn.child('.up').addEventListener('click', backToTopHandle)

  if (!toolBtn) {
    setToolBtn(siteHeader.createChild('div', {
      id: 'tool',
      innerHTML: '<div class="item player"></div><div class="item contents"><i class="ic i-list-ol"></i></div><div class="item chat"><i class="ic i-comments"></i></div><div class="item back-to-top"><i class="ic i-arrow-up"></i><span>0%</span></div>'
    }))
  }

  setToolPlayer(toolBtn.child('.player'))
  setBackToTop(toolBtn.child('.back-to-top'))
  setGoToComment(toolBtn.child('.chat'))
  setShowContents(toolBtn.child('.contents'))

  backToTop.addEventListener('click', backToTopHandle)
  goToComment.addEventListener('click', goToCommentHandle)
  showContents.addEventListener('click', sideBarToggleHandle)

  if (__shokax_player__) {
    /* @__PURE__ */ mediaPlayer(toolPlayer)

    $dom('main').addEventListener('click', () => {
      toolPlayer.player.mini()
    })
  }

  const createIntersectionObserver = () => {
    // waves在视口外时停止动画
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.parallax>use').forEach(i => {
          i.classList.remove('stop-animation')
        })
        document.querySelectorAll('#imgs .item').forEach(i => {
          i.classList.remove('stop-animation')
        })
      } else {
        document.querySelectorAll('.parallax>use').forEach(i => {
          i.classList.add('stop-animation')
        })
        // waves不可见时imgs也应该不可见了
        document.querySelectorAll('#imgs .item').forEach(i => {
          i.classList.add('stop-animation')
        })
      }
    }, {
      root: null,
      threshold: 0.2
    }).observe(document.getElementById('waves'))
    // sakura在视口外时停止动画
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.with-love>i').forEach(i => {
          i.classList.remove('stop-animation')
        })
      } else {
        document.querySelectorAll('.with-love>i').forEach(i => {
          i.classList.add('stop-animation')
        })
      }
    }, {
      root: null,
      threshold: 0.2
    }).observe(document.querySelector('.with-love'))
  }
  createIntersectionObserver()
}
