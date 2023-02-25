
Vue.createApp(
  {
    data () {
      return {

      }
    },
    methods: {
      changeThemeByBtn () {
        let c
        const btn = $dom('.theme').child('.ic')

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
      }
    }
  }
).mount('#rightNav')
