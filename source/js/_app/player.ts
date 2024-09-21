import { CONFIG, originTitle } from './globals/globalVars'
import { showtip } from './globals/tools'
import { pageScroll } from './library/anime'
import { $storage } from './library/storage'
import { tabFormat } from './page/tab'
import { createChild, getLeft, getWidth, setDisplay, setWidth } from './library/proto'

let NOWPLAYING = null

const isMobile = /mobile/i.test(window.navigator.userAgent)
export const mediaPlayer = (t, config?) => {
  const buttons = {
    el: {},
    create () {
      if (!t.player.options.btns) { return }
      t.player.options.btns.forEach((item) => {
        if (buttons.el[item]) { return }

        buttons.el[item] = createChild(t, 'div', {
          className: item + ' btn',
          onclick (event) {
            t.player.fetch().then(() => {
              t.player.options.events[item](event)
            })
          }
        })
      })
    }
  }
  const controller = {
    el: null,
    btns: {
      mode: undefined,
      volume: undefined
    },
    step: 'next',
    create: () => {
      if (!t.player.options.controls) { return }

      const that = controller
      t.player.options.controls.forEach((item) => {
        if (that.btns[item]) { return }

        const opt = <HTMLElement> {
          onclick (event) {
            that.events[item] ? that.events[item](event) : t.player.options.events[item](event)
          }
        }

        switch (item) {
          case 'volume':
            opt.className = ' ' + (source.muted ? 'off' : 'on')
            opt.innerHTML = '<div class="bar"></div>'
            opt['on' + utils.nameMap.dragStart] = that.events.volume
            opt.onclick = null
            break
          case 'mode':
            opt.className = ' ' + t.player.options.mode
            break
          default:
            opt.className = ''
            break
        }

        opt.className = item + opt.className + ' btn'

        that.btns[item] = createChild(that.el, 'div', opt)
      })

      that.btns.volume.bar = that.btns.volume.querySelector('.bar')
    },
    events: {
      mode (e) {
        switch (t.player.options.mode) {
          case 'loop':
            t.player.options.mode = 'random'
            break
          case 'random':
            t.player.options.mode = 'order'
            break
          default:
            t.player.options.mode = 'loop'
        }

        controller.btns.mode.className = 'mode ' + t.player.options.mode + ' btn'
        $storage.set('_PlayerMode', t.player.options.mode)
      },
      volume (e) {
        e.preventDefault()

        const current = e.currentTarget

        let drag = false

        const thumbMove = (e) => {
          e.preventDefault()
          t.player.volume(controller.percent(e, current))
          drag = true
        }

        const thumbUp = (e) => {
          e.preventDefault()
          current.removeEventListener(utils.nameMap.dragEnd, thumbUp)
          current.removeEventListener(utils.nameMap.dragMove, thumbMove)
          if (drag) {
            t.player.muted()
            t.player.volume(controller.percent(e, current))
          } else {
            if (source.muted) {
              t.player.muted()
              t.player.volume(source.volume)
            } else {
              t.player.muted('muted')
              controller.update(0)
            }
          }
        }

        current.addEventListener(utils.nameMap.dragMove, thumbMove)
        current.addEventListener(utils.nameMap.dragEnd, thumbUp)
      },
      backward (e) {
        controller.step = 'prev'
        t.player.mode()
      },
      forward (e) {
        controller.step = 'next'
        t.player.mode()
      }
    },
    update (percent) {
      controller.btns.volume.className = 'volume ' + (!source.muted && percent > 0 ? 'on' : 'off') + ' btn'
      setWidth(controller.btns.volume.bar, Math.floor(percent * 100) + '%')
    },
    percent (e, el) {
      let percentage = ((e.clientX || e.changedTouches[0].clientX) - getLeft(el)) / getWidth(el)
      percentage = Math.max(percentage, 0)
      return Math.min(percentage, 1)
    }
  }
  const progress = {
    el: null,
    bar: null,
    create () {
      const current = playlist.current().el

      if (current) {
        if (progress.el) {
          progress.el.parentNode.removeClass('current')
            .removeEventListener(utils.nameMap.dragStart, progress.drag)
          progress.el.remove()
        }

        progress.el = createChild(current, 'div', {
          className: 'progress'
        });

        (progress.el as HTMLElement).setAttribute('data-dtime', utils.secondToTime(0))

        progress.bar = createChild(progress.el, 'div', {
          className: 'bar'
        })

        current.addClass('current')

        current.addEventListener(utils.nameMap.dragStart, progress.drag)

        playlist.scroll()
      }
    },
    update (percent) {
      setWidth(progress.bar, Math.floor(percent * 100) + '%');
      (progress.el as HTMLElement).setAttribute('data-ptime', utils.secondToTime(percent * source.duration))
    },
    seeking (type) {
      if (type) { progress.el.addClass('seeking') } else { progress.el.removeClass('seeking') }
    },
    percent (e, el) {
      let percentage = ((e.clientX || e.changedTouches[0].clientX) - getLeft(el)) / getWidth(el)
      percentage = Math.max(percentage, 0)
      return Math.min(percentage, 1)
    },
    drag (e) {
      e.preventDefault()

      const current = playlist.current().el

      const thumbMove = (e) => {
        e.preventDefault()
        const percentage = progress.percent(e, current)
        progress.update(percentage)
        lyrics.update(percentage * source.duration)
      }

      const thumbUp = (e) => {
        e.preventDefault()
        current.removeEventListener(utils.nameMap.dragEnd, thumbUp)
        current.removeEventListener(utils.nameMap.dragMove, thumbMove)
        const percentage = progress.percent(e, current)
        progress.update(percentage)
        t.player.seek(percentage * source.duration)
        source.disableTimeupdate = false
        progress.seeking(false)
      }

      source.disableTimeupdate = true
      progress.seeking(true)
      current.addEventListener(utils.nameMap.dragMove, thumbMove)
      current.addEventListener(utils.nameMap.dragEnd, thumbUp)
    }
  }
  const preview = {
    el: null,
    create () {
      const current = playlist.current()

      preview.el.innerHTML = '<div class="cover"><div class="disc"><img src="' + (current.cover) + '" class="blur"  alt="music cover"/></div></div>' +
                '<div class="info"><h4 class="title">' + current.name + '</h4><span>' + current.artist + '</span>' +
                '<div class="lrc"></div></div>';

      (preview.el as HTMLElement).querySelector('.cover').addEventListener('click', t.player.options.events['play-pause'])

      lyrics.create((preview.el as HTMLElement).querySelector('.lrc'))
    }
  }
  let source
  const playlist = {
    el: null,
    data: [],
    index: -1,
    errnum: 0,
    add: (group, list) => {
      list.forEach((item) => {
        item.group = group
        item.name = item.name || item.title || 'Meida name'
        item.artist = item.artist || item.author || 'Anonymous'
        item.cover = item.cover || item.pic
        item.type = item.type || 'normal'

        playlist.data.push(item)
      })
    },
    clear () {
      playlist.data = []
      playlist.el.innerHTML = ''

      if (playlist.index !== -1) {
        playlist.index = -1
        t.player.fetch()
      }
    },
    create () {
      const el = playlist.el

      playlist.data.map((item, index) => {
        if (item.el) { return null }

        const id = 'list-' + t.player._id + '-' + item.group
        let tab = document.getElementById(id)
        if (!tab) {
          tab = createChild(el, 'div', {
            id,
            className: t.player.group ? 'tab' : '',
            innerHTML: '<ol></ol>'
          })
          if (t.player.group) {
            tab.setAttribute('data-title', t.player.options.rawList[item.group].title)
            tab.setAttribute('data-id', t.player._id)
          }
        }

        item.el = createChild(tab.querySelector('ol'), 'li', {
          title: item.name + ' - ' + item.artist,
          innerHTML: '<span class="info"><span>' + item.name + '</span><span>' + item.artist + '</span></span>',
          onclick (event) {
            const current = event.currentTarget
            if (playlist.index === index && progress.el) {
              if (source.paused) {
                t.player.play()
              } else {
                t.player.seek(source.duration * progress.percent(event, current))
              }
              return
            }
            t.player.switch(index)
            t.player.play()
          }
        })

        return item
      })
      if (__shokax_tabs__) {
        tabFormat()
      }
    },
    current () {
      return this.data[this.index]
    },
    scroll () {
      const item = this.current()
      let li = this.el.querySelector('li.active')
      li && li.removeClass('active')
      let tab = this.el.querySelector('.tab.active')
      tab && tab.removeClass('active')
      li = this.el.querySelectorAll('.nav li')[item.group]
      li && li.addClass('active')
      tab = this.el.querySelectorAll('.tab')[item.group]
      tab && tab.addClass('active')

      pageScroll(item.el, item.el.offsetTop)

      return this
    },
    title () {
      if (source.paused) { return }

      const current = this.current()
      document.title = 'Now Playing...' + current.name + ' - ' + current.artist + ' | ' + originTitle
    },
    error () {
      const current = this.current()
      current.el.removeClass('current').addClass('error')
      current.error = true
      this.errnum++
    }
  }
  const info = {
    el: null,
    create () {
      if (this.el) { return }

      this.el = createChild(t, 'div', {
        className: 'player-info',
        innerHTML: (t.player.options.type === 'audio' ? '<div class="preview"></div>' : '') + '<div class="controller"></div><div class="playlist"></div>'
      }, 'after')

      preview.el = this.el.querySelector('.preview')
      playlist.el = this.el.querySelector('.playlist')
      controller.el = this.el.querySelector('.controller')
    },
    hide () {
      const el = this.el
      el.addClass('hide')
      window.setTimeout(() => {
        el.removeClass('show hide')
      }, 300)
    }
  }
  const option = {
    type: 'audio',
    mode: 'random',
    btns: ['play-pause', 'music'],
    controls: ['mode', 'backward', 'play-pause', 'forward', 'volume'],
    events: {
      'play-pause' (event) {
        if (source.paused) {
          t.player.play()
        } else {
          t.player.pause()
        }
      },
      music (event) {
        if (info.el.hasClass('show')) {
          info.hide()
        } else {
          info.el.addClass('show')
          playlist.scroll().title()
        }
      }
    }
  }
  const utils = {
    random (len) {
      return Math.floor((Math.random() * len))
    },
    parse (link) {
      let result = [];
      [
        ['music.163.com.*song.*id=(\\d+)', 'netease', 'song'],
        ['music.163.com.*album.*id=(\\d+)', 'netease', 'album'],
        ['music.163.com.*artist.*id=(\\d+)', 'netease', 'artist'],
        ['music.163.com.*playlist.*id=(\\d+)', 'netease', 'playlist'],
        ['music.163.com.*discover/toplist.*id=(\\d+)', 'netease', 'playlist'],
        ['y.qq.com.*song/(\\w+)(.html)?', 'tencent', 'song'],
        ['y.qq.com.*album/(\\w+)(.html)?', 'tencent', 'album'],
        ['y.qq.com.*singer/(\\w+)(.html)?', 'tencent', 'artist'],
        ['y.qq.com.*playsquare/(\\w+)(.html)?', 'tencent', 'playlist'],
        ['y.qq.com.*playlist/(\\w+)(.html)?', 'tencent', 'playlist'],
        ['xiami.com.*song/(\\w+)', 'xiami', 'song'],
        ['xiami.com.*album/(\\w+)', 'xiami', 'album'],
        ['xiami.com.*artist/(\\w+)', 'xiami', 'artist'],
        ['xiami.com.*collect/(\\w+)', 'xiami', 'playlist']
      ].forEach((rule) => {
        const patt = new RegExp(rule[0])
        const res = patt.exec(link)
        if (res !== null) {
          result = [rule[1], rule[2], res[1]]
        }
      })
      return result
    },
    fetch (source) {
      const list = []

      return new Promise((resolve, reject) => {
        source.forEach((raw) => {
          const meta = utils.parse(raw)
          if (meta[0]) {
            const skey = JSON.stringify(meta)
            const playlist = $storage.get(skey)
            if (playlist) {
              // list.push.apply(list, JSON.parse(playlist))
              list.push(...JSON.parse(playlist))
              resolve(list)
            } else {
              fetch(`${CONFIG.playerAPI}/meting/?server=` + meta[0] + '&type=' + meta[1] + '&id=' + meta[2] + '&r=' + Math.random())
                .then((response) => {
                  return response.json()
                }).then((json) => {
                  $storage.set(skey, JSON.stringify(json))
                  // list.push.apply(list, json)
                  list.push(...json)
                  resolve(list)
                }).catch((ex) => {
                  // (不)处理catch的异常
                })
            }
          } else {
            list.push(raw)
            resolve(list)
          }
        })
      })
    },
    secondToTime (second) {
      const add0 = (num) => {
        return isNaN(num) ? '00' : (num < 10 ? '0' + num : '' + num)
      }
      const hour = Math.floor(second / 3600)
      const min = Math.floor((second - hour * 3600) / 60)
      const sec = Math.floor(second - hour * 3600 - min * 60)
      return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':')
    },
    nameMap: {
      dragStart: isMobile ? 'touchstart' : 'mousedown',
      dragMove: isMobile ? 'touchmove' : 'mousemove',
      dragEnd: isMobile ? 'touchend' : 'mouseup'
    }
  }
  source = null

  t.player = {
    _id: utils.random(999999),
    group: true,
    // 加载播放列表
    load (newList) {
      let d = ''

      if (newList && newList.length > 0) {
        if (this.options.rawList !== newList) {
          this.options.rawList = newList
          playlist.clear()
          // 获取新列表
          this.fetch()
        }
      } else {
        // 没有列表时，隐藏按钮
        d = 'none'
        this.pause()
      }
      for (const el in buttons.el) {
        setDisplay(buttons.el[el], d)
      }
      return this
    },
    fetch () {
      return new Promise<boolean>((resolve, reject) => {
        if (playlist.data.length > 0) {
          resolve(false)
        } else {
          if (this.options.rawList) {
            const promises = []

            this.options.rawList.forEach((raw, index) => {
              promises.push(new Promise((resolve, reject) => {
                let group = index
                let source
                if (!raw.list) {
                  group = 0
                  this.group = false
                  source = [raw]
                } else {
                  this.group = true
                  source = raw.list
                }
                utils.fetch(source).then((list) => {
                  playlist.add(group, list)
                  resolve(0)
                })
              }))
            })

            Promise.all(promises).then(() => {
              resolve(true)
            })
          }
        }
      }).then((c) => {
        if (c) {
          playlist.create()
          controller.create()
          this.mode()
        }
      })
    },
    // 根据模式切换当前曲目index
    mode () {
      const total = playlist.data.length

      if (!total || playlist.errnum === total) { return }

      const step = controller.step === 'next' ? 1 : -1

      const next = () => {
        let index = playlist.index + step
        if (index > total || index < 0) {
          index = controller.step === 'next' ? 0 : total - 1
        }
        playlist.index = index
      }

      const random = () => {
        const p = utils.random(total)
        if (playlist.index !== p) {
          playlist.index = p
        } else {
          next()
        }
      }

      switch (this.options.mode) {
        case 'random':
          random()
          break
        case 'order':
          next()
          break
        case 'loop':
          if (controller.step) { next() }

          if (playlist.index === -1) { random() }
          break
      }

      this.init()
    },
    // 直接设置当前曲目index
    switch (index) {
      if (typeof index === 'number' &&
                index !== playlist.index &&
                playlist.current() &&
                !playlist.current().error) {
        playlist.index = index
        this.init()
      }
    },
    // 更新source为当前曲目index
    init () {
      const item = playlist.current()

      if (!item || item.error) {
        this.mode()
        return
      }

      let playing = false
      if (!source.paused) {
        playing = true
        this.stop()
      }

      source.setAttribute('src', item.url)
      source.setAttribute('title', item.name + ' - ' + item.artist)
      this.volume($storage.get('_PlayerVolume') || '0.7')
      this.muted($storage.get('_PlayerMuted'))

      progress.create()

      if (this.options.type === 'audio') { preview.create() }

      if (playing === true) {
        this.play()
      }
    },
    play () {
      NOWPLAYING && NOWPLAYING.player.pause()

      if (playlist.current().error) {
        this.mode()
        return
      }
      source.play().then(() => {
        playlist.scroll()
      }).catch((e) => {
        // 不处理错误
      })
    },
    pause () {
      source.pause()
      document.title = originTitle
    },
    stop () {
      source.pause()
      source.currentTime = 0
      document.title = originTitle
    },
    seek (time) {
      time = Math.max(time, 0)
      time = Math.min(time, source.duration)
      source.currentTime = time
      progress.update(time / source.duration)
    },
    muted (status?) {
      if (status === 'muted') {
        source.muted = status
        $storage.set('_PlayerMuted', status)
        controller.update(0)
      } else {
        $storage.del('_PlayerMuted')
        source.muted = false
        controller.update(source.volume)
      }
    },
    volume (percentage) {
      if (!isNaN(percentage)) {
        controller.update(percentage)
        $storage.set('_PlayerVolume', percentage)
        source.volume = percentage
      }
    },
    mini () {
      info.hide()
    }
  }

  const lyrics = {
    el: null,
    data: null,
    index: 0,
    create (box) {
      const current = playlist.index
      // const that = this
      const raw = playlist.current().lrc

      const callback = (body) => {
        if (current !== playlist.index) { return }

        this.data = this.parse(body)

        let lrc = ''
        this.data.forEach((line, index) => {
          lrc += '<p' + (index === 0 ? ' class="current"' : '') + '>' + line[1] + '</p>'
        })

        this.el = createChild(box, 'div', {
          className: 'inner',
          innerHTML: lrc
        }, 'replace')

        this.index = 0
      }

      if (raw.startsWith('http')) { this.fetch(raw, callback) } else { callback(raw) }
    },
    update (currentTime) {
      if (!this.data) { return }

      if (this.index > this.data.length - 1 || currentTime < this.data[this.index][0] || (!this.data[this.index + 1] || currentTime >= this.data[this.index + 1][0])) {
        for (let i = 0; i < this.data.length; i++) {
          if (currentTime >= this.data[i][0] && (!this.data[i + 1] || currentTime < this.data[i + 1][0])) {
            this.index = i
            const y = -(this.index - 1)
            this.el.style.transform = 'translateY(' + y + 'rem)'
            // this.el.style.webkitTransform = 'translateY(' + y + 'rem)';
            this.el.getElementsByClassName('current')[0].removeClass('current')
            this.el.getElementsByTagName('p')[i].addClass('current')
          }
        }
      }
    },
    parse (lrc_s) {
      if (lrc_s) {
        lrc_s = lrc_s.replace(/([^\]^\n])\[/g, (match, p1) => {
          return p1 + '\n['
        })
        const lyric = lrc_s.split('\n')
        let lrc = []
        const lyricLen = lyric.length
        for (let i = 0; i < lyricLen; i++) {
          // match lrc time
          const lrcTimes = lyric[i].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g)
          // match lrc text
          const lrcText = lyric[i]
            .replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g, '')
            .replace(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g, '')
            .trim()

          if (lrcTimes) {
            // handle multiple time tag
            const timeLen = lrcTimes.length
            for (let j = 0; j < timeLen; j++) {
              const oneTime = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/.exec(lrcTimes[j])
              const min2sec = <number><unknown> oneTime[1] * 60
              const sec2sec = parseInt(oneTime[2])
              const msec2sec = oneTime[4] ? parseInt(oneTime[4]) / ((oneTime[4] + '').length === 2 ? 100 : 1000) : 0
              const lrcTime = min2sec + sec2sec + msec2sec
              lrc.push([lrcTime, lrcText])
            }
          }
        }
        // sort by time
        lrc = lrc.filter((item) => item[1])
        lrc.sort((a, b) => a[0] - b[0])
        return lrc
      } else {
        return []
      }
    },
    fetch (url, callback) {
      fetch(url)
        .then((response) => {
          return response.text()
        }).then((body) => {
          callback(body)
        }).catch((ex) => {
          // 不处理错误
        })
    }
  }

  const events = {
    onerror () {
      playlist.error()
      t.player.mode()
    },
    ondurationchange () {
      if (source.duration !== 1) {
        progress.el.setAttribute('data-dtime', utils.secondToTime(source.duration))
      }
    },
    onloadedmetadata () {
      t.player.seek(0)
      progress.el.setAttribute('data-dtime', utils.secondToTime(source.duration))
    },
    onplay () {
      t.parentNode.addClass('playing')
      showtip(this.getAttribute('title'))
      NOWPLAYING = t
    },
    onpause () {
      t.parentNode.removeClass('playing')
      NOWPLAYING = null
    },
    ontimeupdate () {
      if (!this.disableTimeupdate) {
        progress.update(this.currentTime / this.duration)
        lyrics.update(this.currentTime)
      }
    },
    onended (argument) {
      t.player.mode()
      t.player.play()
    }
  }

  const init = (config) => {
    if (t.player.created) { return }

    t.player.options = Object.assign(option, config)
    t.player.options.mode = $storage.get('_PlayerMode') || t.player.options.mode

    // 初始化button、controls以及click事件
    buttons.create()

    // 初始化audio or video
    source = createChild(t, t.player.options.type, events)
    // 初始化播放列表、预览、控件按钮等
    info.create()

    t.parentNode.addClass(t.player.options.type)

    t.player.created = true
  }

  init(config)

  return t
}
