Vue.createApp({
    data() {
        return {};
    },
    methods: {
        changeThemeByBtn() {
            let c;
            const btn = $dom('.theme').child('.ic');
            const neko = BODY.createChild('div', {
                id: 'neko',
                innerHTML: '<div class="planet"><div class="sun"></div><div class="moon"></div></div><div class="body"><div class="face"><section class="eyes left"><span class="pupil"></span></section><section class="eyes right"><span class="pupil"></span></section><span class="nose"></span></div></div>'
            });
            const hideNeko = function () {
                transition(neko, {
                    delay: 2500,
                    opacity: 0
                }, function () {
                    BODY.removeChild(neko);
                });
            };
            if (btn.hasClass('i-sun')) {
                c = function () {
                    neko.addClass('dark');
                    changeTheme('dark');
                    $storage.set('theme', 'dark');
                    hideNeko();
                };
            }
            else {
                neko.addClass('dark');
                c = function () {
                    neko.removeClass('dark');
                    changeTheme();
                    $storage.set('theme', 'light');
                    hideNeko();
                };
            }
            transition(neko, 1, function () {
                setTimeout(c, 210);
            });
        }
    },
    mounted() {
        domInit();
        pjax = new Pjax({
            selectors: [
                'head title',
                '.languages',
                '.twikoo',
                '.pjax',
                '.leancloud-recent-comment',
                'script[data-config]'
            ],
            analytics: false,
            cacheBust: false
        });
        CONFIG.quicklink.ignores = LOCAL.ignores;
        quicklink.listen(CONFIG.quicklink);
        autoDarkmode();
        visibilityListener();
        themeColorListener();
        algoliaSearch(pjax);
        window.addEventListener('scroll', scrollHandle);
        window.addEventListener('resize', resizeHandle);
        window.addEventListener('pjax:send', pjaxReload);
        window.addEventListener('pjax:success', siteRefresh);
        window.addEventListener('beforeunload', function () {
            pagePosition();
        });
        siteRefresh(1);
    }
}).mount('#container');
