const statics = CONFIG.statics.indexOf('//') > 0 ? CONFIG.statics : CONFIG.root;
const scrollAction = { x: 0, y: 0 };
let diffY = 0;
let originTitle, titleTime;
const BODY = document.getElementsByTagName('body')[0];
const HTML = document.documentElement;
const Container = $dom('#container');
const loadCat = $dom('#loading');
const siteNav = $dom('#nav');
const siteHeader = $dom('#header');
const menuToggle = siteNav.child('.toggle');
const quickBtn = $dom('#quick');
const sideBar = $dom('#sidebar');
const siteBrand = $dom('#brand');
let toolBtn = $dom('#tool');
let toolPlayer;
let backToTop;
let goToComment;
let showContents;
let siteSearch = $dom('#search');
let siteNavHeight, headerHightInner, headerHight;
let oWinHeight = window.innerHeight;
let oWinWidth = window.innerWidth;
let LOCAL_HASH = 0;
let LOCAL_URL = window.location.href;
let pjax;
const changeTheme = function (type) {
    const btn = $dom('.theme .ic');
    if (type === 'dark') {
        HTML.attr('data-theme', type);
        btn.removeClass('i-sun');
        btn.addClass('i-moon');
    }
    else {
        HTML.attr('data-theme', null);
        btn.removeClass('i-moon');
        btn.addClass('i-sun');
    }
};
const autoDarkmode = function () {
    if (CONFIG.auto_dark.enable) {
        if (new Date().getHours() >= CONFIG.auto_dark.start || new Date().getHours() <= CONFIG.auto_dark.end) {
            changeTheme('dark');
        }
        else {
            changeTheme();
        }
    }
};
const lazyload = lozad('img, [data-background-image]', {
    loaded: function (el) {
        el.addClass('lozaded');
    }
});
const Loader = {
    timer: undefined,
    lock: false,
    show: function () {
        clearTimeout(this.timer);
        document.body.removeClass('loaded');
        loadCat.attr('style', 'display:block');
        Loader.lock = false;
    },
    hide: function (sec) {
        if (!CONFIG.loader.start) {
            sec = -1;
        }
        this.timer = setTimeout(this.vanish, sec || 3000);
    },
    vanish: function () {
        if (Loader.lock) {
            return;
        }
        if (CONFIG.loader.start) {
            transition(loadCat, 0);
        }
        document.body.addClass('loaded');
        Loader.lock = true;
    }
};
const changeMetaTheme = function (color) {
    if (HTML.attr('data-theme') === 'dark') {
        color = '#222';
    }
    $dom('meta[name="theme-color"]').attr('content', color);
};
const themeColorListener = function () {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (mediaQueryList) {
        if (mediaQueryList.matches) {
            changeTheme('dark');
        }
        else {
            changeTheme();
        }
    });
    const t = $storage.get('theme');
    if (t) {
        changeTheme(t);
    }
    else {
        if (CONFIG.darkmode) {
            changeTheme('dark');
        }
    }
};
const visibilityListener = function () {
    const iconNode = $dom('[rel="icon"]');
    document.addEventListener('visibilitychange', function () {
        switch (document.visibilityState) {
            case 'hidden':
                iconNode.attr('href', statics + CONFIG.favicon.hidden);
                document.title = LOCAL.favicon.hide;
                if (CONFIG.loader.switch) {
                    Loader.show();
                }
                clearTimeout(titleTime);
                break;
            case 'visible':
                iconNode.attr('href', statics + CONFIG.favicon.normal);
                document.title = LOCAL.favicon.show;
                if (CONFIG.loader.switch) {
                    Loader.hide(1000);
                }
                titleTime = setTimeout(function () {
                    document.title = originTitle;
                }, 2000);
                break;
        }
    });
};
const showtip = function (msg) {
    if (!msg) {
        return;
    }
    const tipbox = BODY.createChild('div', {
        innerHTML: msg,
        className: 'tip'
    });
    setTimeout(function () {
        tipbox.addClass('hide');
        setTimeout(function () {
            BODY.removeChild(tipbox);
        }, 300);
    }, 3000);
};
const resizeHandle = function (event) {
    siteNavHeight = siteNav.changeOrGetHeight();
    headerHightInner = siteHeader.changeOrGetHeight();
    headerHight = headerHightInner + $dom('#waves').changeOrGetHeight();
    if (oWinWidth !== window.innerWidth) {
        sideBarToggleHandle(null, 1);
    }
    oWinHeight = window.innerHeight;
    oWinWidth = window.innerWidth;
    // sideBar.child('.panels').changeOrGetHeight(oWinHeight + 'px');
};
const scrollHandle = function (event) {
    const winHeight = window.innerHeight;
    const docHeight = getDocHeight();
    const contentVisibilityHeight = docHeight > winHeight ? docHeight - winHeight : document.body.scrollHeight - winHeight;
    const SHOW = window.scrollY > headerHightInner;
    const startScroll = window.scrollY > 0;
    if (SHOW) {
        changeMetaTheme('#FFF');
    }
    else {
        changeMetaTheme('#222');
    }
    siteNav.toggleClass('show', SHOW);
    toolBtn.toggleClass('affix', startScroll);
    siteBrand.toggleClass('affix', startScroll);
    sideBar.toggleClass('affix', window.scrollY > headerHight && document.body.offsetWidth > 991);
    if (typeof scrollAction.y === 'undefined') {
        scrollAction.y = window.scrollY;
    }
    diffY = scrollAction.y - window.scrollY;
    if (diffY < 0) {
        siteNav.removeClass('up');
        siteNav.toggleClass('down', SHOW);
    }
    else if (diffY > 0) {
        siteNav.removeClass('down');
        siteNav.toggleClass('up', SHOW);
    }
    else { }
    scrollAction.y = window.scrollY;
    const scrollPercent = Math.round(Math.min(100 * window.scrollY / contentVisibilityHeight, 100)) + '%';
    backToTop.child('span').innerText = scrollPercent;
    $dom('.percent').changeOrGetWidth(scrollPercent);
};
const pagePosition = function () {
    if (CONFIG.auto_scroll) {
        $storage.set(LOCAL_URL, String(scrollAction.y));
    }
};
const positionInit = function (comment) {
    const anchor = window.location.hash;
    let target = null;
    if (LOCAL_HASH) {
        $storage.del(LOCAL_URL);
        return;
    }
    if (anchor) {
        target = $dom(decodeURI(anchor));
    }
    else {
        target = CONFIG.auto_scroll ? parseInt($storage.get(LOCAL_URL)) : 0;
    }
    if (target) {
        pageScroll(target);
        LOCAL_HASH = 1;
    }
    if (comment && anchor && !LOCAL_HASH) {
        pageScroll(target);
        LOCAL_HASH = 1;
    }
};
const clipBoard = function (str, callback) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(str).then(() => {
            callback && callback(true);
        }, () => {
            callback && callback(false);
        });
    }
    else {
        const ta = BODY.createChild('textarea', {
            style: {
                top: window.scrollY + 'px',
                position: 'absolute',
                opacity: '0'
            },
            readOnly: true,
            value: str
        });
        const selection = document.getSelection();
        const selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false;
        ta.select();
        ta.setSelectionRange(0, str.length);
        ta.readOnly = false;
        const result = document.execCommand('copy');
        callback && callback(result);
        ta.blur();
        if (selected) {
            selection.removeAllRanges();
            selection.addRange(selected);
        }
        BODY.removeChild(ta);
    }
};
const isOutime = function () {
    let updateTime;
    if (CONFIG.outime.enable && LOCAL.outime) {
        const times = document.getElementsByTagName('time');
        if (times.length === 0) {
            return;
        }
        const posts = document.getElementsByClassName('body md');
        if (posts.length === 0) {
            return;
        }
        const now = Date.now();
        const pubTime = new Date(times[0].dateTime);
        if (times.length === 1) {
            updateTime = pubTime;
        }
        else {
            updateTime = new Date(times[1].dateTime);
        }
        const interval = parseInt(String(now - updateTime));
        const days = parseInt(String(CONFIG.outime.days)) || 30;
        if (interval > (days * 86400000)) {
            const publish = parseInt(String((now - pubTime) / 86400000));
            const updated = parseInt(String(interval / 86400000));
            const template = LOCAL.template.replace('{{publish}}', String(publish)).replace('{{updated}}', String(updated));
            posts[0].insertAdjacentHTML('afterbegin', template);
        }
    }
};
const clickMenu = function () {
    const menuElement = $dom('#clickMenu');
    window.oncontextmenu = function (event) {
        if (event.ctrlKey) {
            return;
        }
        event.preventDefault();
        let x = event.offsetX;
        let y = event.offsetY;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        const menuWidth = menuElement.offsetWidth;
        const menuHeight = menuElement.offsetHeight;
        x = winWidth - menuWidth >= x ? x : winWidth - menuWidth;
        y = winHeight - menuHeight >= y ? y : winHeight - menuHeight;
        menuElement.style.top = y + 'px';
        menuElement.style.left = x + 'px';
        menuElement.classList.add('active');
        $dom.each('.clickSubmenu', (submenu) => {
            if (x > (winWidth - menuWidth - submenu.offsetWidth)) {
                submenu.style.left = '-200px';
            }
            else {
                submenu.style.left = '';
                submenu.style.right = '-200px';
            }
        });
    };
    window.addEventListener('click', function () {
        menuElement.classList.remove('active');
    });
};
