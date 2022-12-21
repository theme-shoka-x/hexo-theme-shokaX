const canvasEl = document.createElement('canvas');
canvasEl.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999999';
document.body.appendChild(canvasEl);
const ctx = canvasEl.getContext('2d');
const numberOfParticules = 30;
let pointerX = 0;
let pointerY = 0;
const tap = 'click';
const colors = CONFIG.fireworks;
function setCanvasSize() {
    canvasEl.width = window.innerWidth * 2;
    canvasEl.height = window.innerHeight * 2;
    canvasEl.style.width = window.innerWidth + 'px';
    canvasEl.style.height = window.innerHeight + 'px';
    canvasEl.getContext('2d').scale(2, 2);
}
function updateCoords(e) {
    pointerX = e.clientX || (e.touches && e.touches[0].clientX);
    pointerY = e.clientY || (e.touches && e.touches[0].clientY);
}
function setParticuleDirection(p) {
    const angle = anime.random(0, 360) * Math.PI / 180;
    const value = anime.random(50, 180);
    const radius = [-1, 1][anime.random(0, 1)] * value;
    return {
        x: p.x + radius * Math.cos(angle),
        y: p.y + radius * Math.sin(angle)
    };
}
function createParticule(x, y) {
    const p = {
        x: undefined,
        y: undefined,
        color: undefined,
        radius: undefined,
        endPos: undefined,
        draw: undefined
    };
    p.x = x;
    p.y = y;
    p.color = colors[anime.random(0, colors.length - 1)];
    p.radius = anime.random(16, 32);
    p.endPos = setParticuleDirection(p);
    p.draw = function () {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = p.color;
        ctx.fill();
    };
    return p;
}
function createCircle(x, y) {
    const p = {
        x: undefined,
        y: undefined,
        color: undefined,
        radius: undefined,
        endPos: undefined,
        alpha: undefined,
        lineWidth: undefined,
        draw: undefined
    };
    p.x = x;
    p.y = y;
    p.color = '#FFF';
    p.radius = 0.1;
    p.alpha = 0.5;
    p.lineWidth = 6;
    p.draw = function () {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
        ctx.lineWidth = p.lineWidth;
        ctx.strokeStyle = p.color;
        ctx.stroke();
        ctx.globalAlpha = 1;
    };
    return p;
}
function renderParticule(anim) {
    for (let i = 0; i < anim.animatables.length; i++) {
        anim.animatables[i].target.draw();
    }
}
function animateParticules(x, y) {
    const circle = createCircle(x, y);
    const particules = [];
    for (let i = 0; i < numberOfParticules; i++) {
        particules.push(createParticule(x, y));
    }
    anime.timeline().add({
        targets: particules,
        x: function (p) {
            return p.endPos.x;
        },
        y: function (p) {
            return p.endPos.y;
        },
        radius: 0.1,
        duration: anime.random(1200, 1800),
        easing: 'easeOutExpo',
        update: renderParticule
    }).add({
        targets: circle,
        radius: anime.random(80, 160),
        lineWidth: 0,
        alpha: {
            value: 0,
            easing: 'linear',
            duration: anime.random(600, 800)
        },
        duration: anime.random(1200, 1800),
        easing: 'easeOutExpo',
        update: renderParticule
    }, 0);
}
const render = anime({
    duration: Infinity,
    update: function () {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }
});
document.addEventListener(tap, function (e) {
    render.play();
    updateCoords(e);
    animateParticules(pointerX, pointerY);
}, false);
setCanvasSize();
window.addEventListener('resize', setCanvasSize, false);
const sideBarToggleHandle = function (event, force) {
    if (sideBar.hasClass('on')) {
        sideBar.removeClass('on');
        menuToggle.removeClass('close');
        if (force) {
            sideBar.style = '';
        }
        else {
            transition(sideBar, 'slideRightOut');
        }
    }
    else {
        if (force) {
            sideBar.style = '';
        }
        else {
            transition(sideBar, 'slideRightIn', function () {
                sideBar.addClass('on');
                menuToggle.addClass('close');
            });
        }
    }
};
const sideBarTab = function () {
    const sideBarInner = sideBar.child('.inner');
    const panels = sideBar.find('.panel');
    if (sideBar.child('.tab')) {
        sideBarInner.removeChild(sideBar.child('.tab'));
    }
    const list = document.createElement('ul');
    let active = 'active';
    list.className = 'tab';
    ['contents', 'related', 'overview'].forEach(function (item) {
        const element = sideBar.child('.panel.' + item);
        if (element.innerHTML.replace(/(^\s*)|(\s*$)/g, '').length < 1) {
            if (item === 'contents') {
                showContents.display('none');
            }
            return;
        }
        if (item === 'contents') {
            showContents.display('');
        }
        const tab = document.createElement('li');
        const span = document.createElement('span');
        const text = document.createTextNode(element.attr('data-title'));
        span.appendChild(text);
        tab.appendChild(span);
        tab.addClass(item + ' item');
        if (active) {
            element.addClass(active);
            tab.addClass(active);
        }
        else {
            element.removeClass('active');
        }
        tab.addEventListener('click', function (event) {
            const target = event.currentTarget;
            if (target.hasClass('active'))
                return;
            sideBar.find('.tab .item').forEach(function (element) {
                element.removeClass('active');
            });
            sideBar.find('.panel').forEach(function (element) {
                element.removeClass('active');
            });
            sideBar.child('.panel.' + target.className.replace(' item', '')).addClass('active');
            target.addClass('active');
        });
        list.appendChild(tab);
        active = '';
    });
    if (list.childNodes.length > 1) {
        sideBarInner.insertBefore(list, sideBarInner.childNodes[0]);
        sideBar.child('.panels').style.paddingTop = '';
    }
    else {
        sideBar.child('.panels').style.paddingTop = '.625rem';
    }
};
const sidebarTOC = function () {
    const activateNavByIndex = function (index, lock) {
        const target = navItems[index];
        if (!target)
            return;
        if (target.hasClass('current')) {
            return;
        }
        $dom.each('.toc .active', function (element) {
            element && element.removeClass('active current');
        });
        sections.forEach(function (element) {
            element && element.removeClass('active');
        });
        target.addClass('active current');
        sections[index] && sections[index].addClass('active');
        let parent = target.parentNode;
        while (!parent.matches('.contents')) {
            if (parent.matches('li')) {
                parent.addClass('active');
                const t = $dom(parent.child('a.toc-link').attr('href'));
                if (t) {
                    t.addClass('active');
                }
            }
            parent = parent.parentNode;
        }
        if (getComputedStyle(sideBar).display !== 'none' && tocElement.hasClass('active')) {
            pageScroll(tocElement, target.offsetTop - (tocElement.offsetHeight / 4));
        }
    };
    const navItems = $dom.all('.contents li');
    if (navItems.length < 1) {
        return;
    }
    let sections = Array.prototype.slice.call(navItems) || [];
    let activeLock = null;
    sections = sections.map(function (element, index) {
        const link = element.child('a.toc-link');
        const anchor = $dom(decodeURI(link.attr('href')));
        if (!anchor)
            return;
        const alink = anchor.child('a.anchor');
        const anchorScroll = function (event) {
            event.preventDefault();
            const target = $dom(decodeURI(event.currentTarget.attr('href')));
            activeLock = index;
            pageScroll(target, null, function () {
                activateNavByIndex(index);
                activeLock = null;
            });
        };
        link.addEventListener('click', anchorScroll);
        alink && alink.addEventListener('click', function (event) {
            anchorScroll(event);
            clipBoard(CONFIG.hostname + '/' + LOCAL.path + event.currentTarget.attr('href'));
        });
        return anchor;
    });
    const tocElement = sideBar.child('.contents.panel');
    const findIndex = function (entries) {
        let index = 0;
        let entry = entries[index];
        if (entry.boundingClientRect.top > 0) {
            index = sections.indexOf(entry.target);
            return index === 0 ? 0 : index - 1;
        }
        for (; index < entries.length; index++) {
            if (entries[index].boundingClientRect.top <= 0) {
                entry = entries[index];
            }
            else {
                return sections.indexOf(entry.target);
            }
        }
        return sections.indexOf(entry.target);
    };
    const createIntersectionObserver = function () {
        if (!window.IntersectionObserver)
            return;
        const observer = new IntersectionObserver(function (entries, observe) {
            const index = findIndex(entries) + (diffY < 0 ? 1 : 0);
            if (activeLock === null) {
                activateNavByIndex(index);
            }
        }, {
            rootMargin: '0px 0px -100% 0px', threshold: 0
        });
        sections.forEach(function (element) {
            element && observer.observe(element);
        });
    };
    createIntersectionObserver();
};
const backToTopHandle = function () {
    pageScroll(0);
};
const goToBottomHandle = function () {
    pageScroll(parseInt(String(Container.changeOrGetHeight())));
};
const goToCommentHandle = function () {
    pageScroll($dom('#comments'));
};
const menuActive = function () {
    $dom.each('.menu .item:not(.title)', function (element) {
        const target = element.child('a[href]');
        const parentItem = element.parentNode.parentNode;
        if (!target)
            return;
        const isSamePath = target.pathname === location.pathname || target.pathname === location.pathname.replace('index.html', '');
        const isSubPath = !CONFIG.root.startsWith(target.pathname) && location.pathname.startsWith(target.pathname);
        const active = target.hostname === location.hostname && (isSamePath || isSubPath);
        element.toggleClass('active', active);
        if (element.parentNode.child('.active') && parentItem.hasClass('dropdown')) {
            parentItem.removeClass('active').addClass('expand');
        }
        else {
            parentItem.removeClass('expand');
        }
    });
};
