const getDocHeight = () => $dom('main > .inner').offsetHeight;
const $dom = (selector, element = document) => {
    if (selector[0] === '#') {
        return element.getElementById(selector.substring(1));
    }
    return element.querySelector(selector);
};
$dom.all = (selector, element = document) => {
    return element.querySelectorAll(selector);
};
$dom.each = (selector, callback, element) => {
    return $dom.all(selector, element).forEach(callback);
};
$dom.asyncify = async (selector, element = document) => {
    if (selector.indexOf('#') === 0) {
        return element.getElementById(selector.replace('#', ''));
    }
    return element.querySelector(selector);
};
$dom.asyncifyAll = async (selector, element = document) => {
    return element.querySelectorAll(selector);
};
$dom.asyncifyEach = (selector, callback, element) => {
    $dom.asyncifyAll(selector, element).then((tmp) => {
        tmp.forEach(callback);
    });
};
Object.assign(HTMLElement.prototype, {
    createChild: function (tag, obj, positon) {
        const child = document.createElement(tag);
        Object.assign(child, obj);
        switch (positon) {
            case 'after':
                this.insertAfter(child);
                break;
            case 'replace':
                this.innerHTML = '';
                this.appendChild(child);
                break;
            default:
                this.appendChild(child);
        }
        return child;
    },
    wrapObject: function (obj) {
        const box = document.createElement('div');
        Object.assign(box, obj);
        this.parentNode.insertBefore(box, this);
        this.parentNode.removeChild(this);
        box.appendChild(this);
    },
    changeOrGetHeight: function (h) {
        if (h) {
            this.style.height = typeof h === 'number' ? h + 'rem' : h;
        }
        return this.getBoundingClientRect().height;
    },
    changeOrGetWidth: function (w) {
        if (w) {
            this.style.width = typeof w === 'number' ? w + 'rem' : w;
        }
        return this.getBoundingClientRect().width;
    },
    top: function () {
        return this.getBoundingClientRect().top;
    },
    left: function () {
        return this.getBoundingClientRect().left;
    },
    attr: function (type, value) {
        if (value === null) {
            return this.removeAttribute(type);
        }
        if (value) {
            this.setAttribute(type, value);
            return this;
        }
        else {
            return this.getAttribute(type);
        }
    },
    insertAfter: function (element) {
        const parent = this.parentNode;
        if (parent.lastChild === this) {
            parent.appendChild(element);
        }
        else {
            parent.insertBefore(element, this.nextSibling);
        }
    },
    display: function (d) {
        if (d == null) {
            return this.style.display;
        }
        else {
            this.style.display = d;
            return this;
        }
    },
    child: function (selector) {
        return $dom(selector, this);
    },
    find: function (selector) {
        return $dom.all(selector, this);
    },
    _class: function (type, className, display) {
        const classNames = className.indexOf(' ') ? className.split(' ') : [className];
        classNames.forEach((name) => {
            if (type === 'toggle') {
                this.classList.toggle(name, display);
            }
            else {
                this.classList[type](name);
            }
        });
    },
    addClass: function (className) {
        this._class('add', className);
        return this;
    },
    removeClass: function (className) {
        this._class('remove', className);
        return this;
    },
    toggleClass: function (className, display) {
        this._class('toggle', className, display);
        return this;
    },
    hasClass: function (className) {
        return this.classList.contains(className);
    }
});
const $storage = {
    set: (key, value) => {
        localStorage.setItem(key, value);
    },
    get: (key) => {
        return localStorage.getItem(key);
    },
    del: (key) => {
        localStorage.removeItem(key);
    }
};
const getScript = function (url, callback, condition) {
    if (condition) {
        callback();
    }
    else {
        let script = document.createElement('script');
        script.onload = function (_, isAbort) {
            if (isAbort || !script.readyState) {
                console.log('abort!');
                script.onload = null;
                script = undefined;
                if (!isAbort && callback)
                    setTimeout(callback, 0);
            }
        };
        script.src = url;
        document.head.appendChild(script);
    }
};
const assetUrl = function (asset, type) {
    const str = CONFIG[asset][type];
    if (str.indexOf('gh') > -1 || str.indexOf('combine') > -1) {
        return `https://cdn.jsdelivr.net/${str}`;
    }
    if (str.indexOf('npm') > -1) {
        return `https://cdn.jsdelivr.net/${str}`;
    }
    if (str.indexOf('http') > -1) {
        return str;
    }
    return `/${str}`;
};
const vendorJs = function (type, callback, condition) {
    if (LOCAL[type]) {
        getScript(assetUrl('js', type), callback || function () {
            window[type] = true;
        }, condition || window[type]);
    }
};
const vendorCss = function (type, condition) {
    if (window['css' + type]) {
        return;
    }
    if (LOCAL[type]) {
        document.head.createChild('link', {
            rel: 'stylesheet',
            href: assetUrl('css', type)
        });
        window['css' + type] = true;
    }
};
const transition = (target, type, complete) => {
    let animation;
    let display = 'none';
    switch (type) {
        case 0:
            animation = { opacity: [1, 0] };
            break;
        case 1:
            animation = { opacity: [0, 1] };
            display = 'block';
            break;
        case 'bounceUpIn':
            animation = {
                begin: function (anim) {
                    target.display('block');
                },
                translateY: [
                    { value: -60, duration: 200 },
                    { value: 10, duration: 200 },
                    { value: -5, duration: 200 },
                    { value: 0, duration: 200 }
                ],
                opacity: [0, 1]
            };
            display = 'block';
            break;
        case 'shrinkIn':
            animation = {
                begin: function (anim) {
                    target.display('block');
                },
                scale: [
                    { value: 1.1, duration: 300 },
                    { value: 1, duration: 200 }
                ],
                opacity: 1
            };
            display = 'block';
            break;
        case 'slideRightIn':
            animation = {
                begin: function (anim) {
                    target.display('block');
                },
                translateX: [100, 0],
                opacity: [0, 1]
            };
            display = 'block';
            break;
        case 'slideRightOut':
            animation = {
                translateX: [0, 100],
                opacity: [1, 0]
            };
            break;
        default:
            animation = type;
            display = type.display;
            break;
    }
    anime(Object.assign({
        targets: target,
        duration: 200,
        easing: 'linear'
    }, animation)).finished.then(function () {
        target.display(display);
        complete && complete();
    });
};
const pjaxScript = function (element) {
    const code = element.text || element.textContent || element.innerHTML || '';
    const parent = element.parentNode;
    parent.removeChild(element);
    const script = document.createElement('script');
    if (element.id) {
        script.id = element.id;
    }
    if (element.className) {
        script.className = element.className;
    }
    if (element.type) {
        script.type = element.type;
    }
    if (element.src) {
        script.src = element.src;
        script.async = false;
    }
    if (element.dataset.pjax !== undefined) {
        script.dataset.pjax = '';
    }
    if (code !== '') {
        script.appendChild(document.createTextNode(code));
    }
    parent.appendChild(script);
};
const pageScroll = function (target, offset, complete) {
    const opt = {
        targets: typeof offset === 'number' ? target.parentNode : document.scrollingElement,
        duration: 500,
        easing: 'easeInOutQuad',
        scrollTop: offset || (typeof target === 'number' ? target : (target ? target.top() + document.documentElement.scrollTop - siteNavHeight : 0)),
        complete: function () {
            complete && complete();
        }
    };
    anime(opt);
};
