let NOWPLAYING = null;
const isMobile = /mobile/i.test(window.navigator.userAgent);
const mediaPlayer = function (t, config) {
    const buttons = {
        el: {},
        create: function () {
            if (!t.player.options.btns) {
                return;
            }
            t.player.options.btns.forEach(function (item) {
                if (buttons.el[item]) {
                    return;
                }
                buttons.el[item] = t.createChild('div', {
                    className: item + ' btn',
                    onclick: function (event) {
                        t.player.fetch().then(function () {
                            t.player.options.events[item](event);
                        });
                    }
                });
            });
        }
    };
    const controller = {
        el: null,
        btns: {
            mode: undefined,
            volume: undefined
        },
        step: 'next',
        create: () => {
            if (!t.player.options.controls) {
                return;
            }
            const that = controller;
            t.player.options.controls.forEach(function (item) {
                if (that.btns[item]) {
                    return;
                }
                const opt = {
                    onclick: function (event) {
                        that.events[item] ? that.events[item](event) : t.player.options.events[item](event);
                    }
                };
                switch (item) {
                    case 'volume':
                        opt.className = ' ' + (source.muted ? 'off' : 'on');
                        opt.innerHTML = '<div class="bar"></div>';
                        opt['on' + utils.nameMap.dragStart] = that.events.volume;
                        opt.onclick = null;
                        break;
                    case 'mode':
                        opt.className = ' ' + t.player.options.mode;
                        break;
                    default:
                        opt.className = '';
                        break;
                }
                opt.className = item + opt.className + ' btn';
                that.btns[item] = that.el.createChild('div', opt);
            });
            that.btns.volume.bar = that.btns.volume.child('.bar');
        },
        events: {
            mode: function (e) {
                switch (t.player.options.mode) {
                    case 'loop':
                        t.player.options.mode = 'random';
                        break;
                    case 'random':
                        t.player.options.mode = 'order';
                        break;
                    default:
                        t.player.options.mode = 'loop';
                }
                controller.btns.mode.className = 'mode ' + t.player.options.mode + ' btn';
                $storage.set('_PlayerMode', t.player.options.mode);
            },
            volume: function (e) {
                e.preventDefault();
                const current = e.currentTarget;
                let drag = false;
                const thumbMove = function (e) {
                    e.preventDefault();
                    t.player.volume(controller.percent(e, current));
                    drag = true;
                };
                const thumbUp = function (e) {
                    e.preventDefault();
                    current.removeEventListener(utils.nameMap.dragEnd, thumbUp);
                    current.removeEventListener(utils.nameMap.dragMove, thumbMove);
                    if (drag) {
                        t.player.muted();
                        t.player.volume(controller.percent(e, current));
                    }
                    else {
                        if (source.muted) {
                            t.player.muted();
                            t.player.volume(source.volume);
                        }
                        else {
                            t.player.muted('muted');
                            controller.update(0);
                        }
                    }
                };
                current.addEventListener(utils.nameMap.dragMove, thumbMove);
                current.addEventListener(utils.nameMap.dragEnd, thumbUp);
            },
            backward: function (e) {
                controller.step = 'prev';
                t.player.mode();
            },
            forward: function (e) {
                controller.step = 'next';
                t.player.mode();
            }
        },
        update: function (percent) {
            controller.btns.volume.className = 'volume ' + (!source.muted && percent > 0 ? 'on' : 'off') + ' btn';
            controller.btns.volume.bar.changeOrGetWidth(Math.floor(percent * 100) + '%');
        },
        percent: function (e, el) {
            let percentage = ((e.clientX || e.changedTouches[0].clientX) - el.left()) / el.changeOrGetWidth();
            percentage = Math.max(percentage, 0);
            return Math.min(percentage, 1);
        }
    };
    const progress = {
        el: null,
        bar: null,
        create: function () {
            const current = playlist.current().el;
            if (current) {
                if (progress.el) {
                    progress.el.parentNode.removeClass('current')
                        .removeEventListener(utils.nameMap.dragStart, progress.drag);
                    progress.el.remove();
                }
                progress.el = current.createChild('div', {
                    className: 'progress'
                });
                progress.el.attr('data-dtime', utils.secondToTime(0));
                progress.bar = progress.el.createChild('div', {
                    className: 'bar'
                });
                current.addClass('current');
                current.addEventListener(utils.nameMap.dragStart, progress.drag);
                playlist.scroll();
            }
        },
        update: function (percent) {
            progress.bar.changeOrGetWidth(Math.floor(percent * 100) + '%');
            progress.el.attr('data-ptime', utils.secondToTime(percent * source.duration));
        },
        seeking: function (type) {
            if (type) {
                progress.el.addClass('seeking');
            }
            else {
                progress.el.removeClass('seeking');
            }
        },
        percent: function (e, el) {
            let percentage = ((e.clientX || e.changedTouches[0].clientX) - el.left()) / el.changeOrGetWidth();
            percentage = Math.max(percentage, 0);
            return Math.min(percentage, 1);
        },
        drag: function (e) {
            e.preventDefault();
            const current = playlist.current().el;
            const thumbMove = function (e) {
                e.preventDefault();
                const percentage = progress.percent(e, current);
                progress.update(percentage);
                lyrics.update(percentage * source.duration);
            };
            const thumbUp = function (e) {
                e.preventDefault();
                current.removeEventListener(utils.nameMap.dragEnd, thumbUp);
                current.removeEventListener(utils.nameMap.dragMove, thumbMove);
                const percentage = progress.percent(e, current);
                progress.update(percentage);
                t.player.seek(percentage * source.duration);
                source.disableTimeupdate = false;
                progress.seeking(false);
            };
            source.disableTimeupdate = true;
            progress.seeking(true);
            current.addEventListener(utils.nameMap.dragMove, thumbMove);
            current.addEventListener(utils.nameMap.dragEnd, thumbUp);
        }
    };
    const preview = {
        el: null,
        create: function () {
            const current = playlist.current();
            preview.el.innerHTML = '<div class="cover"><div class="disc"><img src="' + (current.cover) + '" class="blur"  alt="music cover"/></div></div>' +
                '<div class="info"><h4 class="title">' + current.name + '</h4><span>' + current.artist + '</span>' +
                '<div class="lrc"></div></div>';
            preview.el.child('.cover').addEventListener('click', t.player.options.events['play-pause']);
            lyrics.create(preview.el.child('.lrc'));
        }
    };
    let source;
    const playlist = {
        el: null,
        data: [],
        index: -1,
        errnum: 0,
        add: (group, list) => {
            list.forEach(function (item, i) {
                item.group = group;
                item.name = item.name || item.title || 'Meida name';
                item.artist = item.artist || item.author || 'Anonymous';
                item.cover = item.cover || item.pic;
                item.type = item.type || 'normal';
                playlist.data.push(item);
            });
        },
        clear: function () {
            playlist.data = [];
            playlist.el.innerHTML = '';
            if (playlist.index !== -1) {
                playlist.index = -1;
                t.player.fetch();
            }
        },
        create: function () {
            const el = playlist.el;
            playlist.data.map(function (item, index) {
                if (item.el) {
                    return null;
                }
                const id = 'list-' + t.player._id + '-' + item.group;
                let tab = $dom('#' + id);
                if (!tab) {
                    tab = el.createChild('div', {
                        id,
                        className: t.player.group ? 'tab' : '',
                        innerHTML: '<ol></ol>'
                    });
                    if (t.player.group) {
                        tab.attr('data-title', t.player.options.rawList[item.group].title)
                            .attr('data-id', t.player._id);
                    }
                }
                item.el = tab.child('ol').createChild('li', {
                    title: item.name + ' - ' + item.artist,
                    innerHTML: '<span class="info"><span>' + item.name + '</span><span>' + item.artist + '</span></span>',
                    onclick: function (event) {
                        const current = event.currentTarget;
                        if (playlist.index === index && progress.el) {
                            if (source.paused) {
                                t.player.play();
                            }
                            else {
                                t.player.seek(source.duration * progress.percent(event, current));
                            }
                            return;
                        }
                        t.player.switch(index);
                        t.player.play();
                    }
                });
                return item;
            });
            tabFormat();
        },
        current: function () {
            return this.data[this.index];
        },
        scroll: function () {
            const item = this.current();
            let li = this.el.child('li.active');
            li && li.removeClass('active');
            let tab = this.el.child('.tab.active');
            tab && tab.removeClass('active');
            li = this.el.find('.nav li')[item.group];
            li && li.addClass('active');
            tab = this.el.find('.tab')[item.group];
            tab && tab.addClass('active');
            pageScroll(item.el, item.el.offsetTop);
            return this;
        },
        title: function () {
            if (source.paused) {
                return;
            }
            const current = this.current();
            document.title = 'Now Playing...' + current.name + ' - ' + current.artist + ' | ' + originTitle;
        },
        error: function () {
            const current = this.current();
            current.el.removeClass('current').addClass('error');
            current.error = true;
            this.errnum++;
        }
    };
    const info = {
        el: null,
        create: function () {
            if (this.el) {
                return;
            }
            this.el = t.createChild('div', {
                className: 'player-info',
                innerHTML: (t.player.options.type === 'audio' ? '<div class="preview"></div>' : '') + '<div class="controller"></div><div class="playlist"></div>'
            }, 'after');
            preview.el = this.el.child('.preview');
            playlist.el = this.el.child('.playlist');
            controller.el = this.el.child('.controller');
        },
        hide: function () {
            const el = this.el;
            el.addClass('hide');
            window.setTimeout(function () {
                el.removeClass('show hide');
            }, 300);
        }
    };
    const option = {
        type: 'audio',
        mode: 'random',
        btns: ['play-pause', 'music'],
        controls: ['mode', 'backward', 'play-pause', 'forward', 'volume'],
        events: {
            'play-pause': function (event) {
                if (source.paused) {
                    t.player.play();
                }
                else {
                    t.player.pause();
                }
            },
            music: function (event) {
                if (info.el.hasClass('show')) {
                    info.hide();
                }
                else {
                    info.el.addClass('show');
                    playlist.scroll().title();
                }
            }
        }
    };
    const utils = {
        random: function (len) {
            return Math.floor((Math.random() * len));
        },
        parse: function (link) {
            let result = [];
            [
                ['music.163.com.*song.*id=(\\d+)', 'netease', 'song'],
                ['music.163.com.*album.*id=(\\d+)', 'netease', 'album'],
                ['music.163.com.*artist.*id=(\\d+)', 'netease', 'artist'],
                ['music.163.com.*playlist.*id=(\\d+)', 'netease', 'playlist'],
                ['music.163.com.*discover/toplist.*id=(\\d+)', 'netease', 'playlist'],
                ['y.qq.com.*song/(\\w+).html', 'tencent', 'song'],
                ['y.qq.com.*album/(\\w+).html', 'tencent', 'album'],
                ['y.qq.com.*singer/(\\w+).html', 'tencent', 'artist'],
                ['y.qq.com.*playsquare/(\\w+).html', 'tencent', 'playlist'],
                ['y.qq.com.*playlist/(\\w+).html', 'tencent', 'playlist'],
                ['xiami.com.*song/(\\w+)', 'xiami', 'song'],
                ['xiami.com.*album/(\\w+)', 'xiami', 'album'],
                ['xiami.com.*artist/(\\w+)', 'xiami', 'artist'],
                ['xiami.com.*collect/(\\w+)', 'xiami', 'playlist']
            ].forEach(function (rule) {
                const patt = new RegExp(rule[0]);
                const res = patt.exec(link);
                if (res !== null) {
                    result = [rule[1], rule[2], res[1]];
                }
            });
            return result;
        },
        fetch: function (source) {
            const list = [];
            return new Promise(function (resolve, reject) {
                source.forEach(function (raw) {
                    const meta = utils.parse(raw);
                    if (meta[0]) {
                        const skey = JSON.stringify(meta);
                        const playlist = $storage.get(skey);
                        if (playlist) {
                            list.push(...JSON.parse(playlist));
                            resolve(list);
                        }
                        else {
                            fetch(`${CONFIG.playerAPI}/meting/?server=` + meta[0] + '&type=' + meta[1] + '&id=' + meta[2] + '&r=' + Math.random())
                                .then(function (response) {
                                return response.json();
                            }).then(function (json) {
                                $storage.set(skey, JSON.stringify(json));
                                list.push(...json);
                                resolve(list);
                            }).catch((ex) => {
                            });
                        }
                    }
                    else {
                        list.push(raw);
                        resolve(list);
                    }
                });
            });
        },
        secondToTime: function (second) {
            const add0 = function (num) {
                return isNaN(num) ? '00' : (num < 10 ? '0' + num : '' + num);
            };
            const hour = Math.floor(second / 3600);
            const min = Math.floor((second - hour * 3600) / 60);
            const sec = Math.floor(second - hour * 3600 - min * 60);
            return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':');
        },
        nameMap: {
            dragStart: isMobile ? 'touchstart' : 'mousedown',
            dragMove: isMobile ? 'touchmove' : 'mousemove',
            dragEnd: isMobile ? 'touchend' : 'mouseup'
        }
    };
    source = null;
    t.player = {
        _id: utils.random(999999),
        group: true,
        load: function (newList) {
            let d = '';
            if (newList && newList.length > 0) {
                if (this.options.rawList !== newList) {
                    this.options.rawList = newList;
                    playlist.clear();
                    this.fetch();
                }
            }
            else {
                d = 'none';
                this.pause();
            }
            for (const el in buttons.el) {
                buttons.el[el].display(d);
            }
            return this;
        },
        fetch: function () {
            return new Promise((resolve, reject) => {
                if (playlist.data.length > 0) {
                    resolve(true);
                }
                else {
                    if (this.options.rawList) {
                        const promises = [];
                        this.options.rawList.forEach(function (raw, index) {
                            promises.push(new Promise(function (resolve, reject) {
                                let group = index;
                                let source;
                                if (!raw.list) {
                                    group = 0;
                                    this.group = false;
                                    source = [raw];
                                }
                                else {
                                    this.group = true;
                                    source = raw.list;
                                }
                                utils.fetch(source).then(function (list) {
                                    playlist.add(group, list);
                                    resolve(0);
                                });
                            }));
                        });
                        Promise.all(promises).then(function () {
                            resolve(true);
                        });
                    }
                }
            }).then((c) => {
                if (c) {
                    playlist.create();
                    controller.create();
                    this.mode();
                }
            });
        },
        mode: function () {
            const total = playlist.data.length;
            if (!total || playlist.errnum === total) {
                return;
            }
            const step = controller.step === 'next' ? 1 : -1;
            const next = function () {
                let index = playlist.index + step;
                if (index > total || index < 0) {
                    index = controller.step === 'next' ? 0 : total - 1;
                }
                playlist.index = index;
            };
            const random = function () {
                const p = utils.random(total);
                if (playlist.index !== p) {
                    playlist.index = p;
                }
                else {
                    next();
                }
            };
            switch (this.options.mode) {
                case 'random':
                    random();
                    break;
                case 'order':
                    next();
                    break;
                case 'loop':
                    if (controller.step) {
                        next();
                    }
                    if (playlist.index === -1) {
                        random();
                    }
                    break;
            }
            this.init();
        },
        switch: function (index) {
            if (typeof index === 'number' &&
                index !== playlist.index &&
                playlist.current() &&
                !playlist.current().error) {
                playlist.index = index;
                this.init();
            }
        },
        init: () => {
            const item = playlist.current();
            if (!item || item.error) {
                this.mode();
                return;
            }
            let playing = false;
            if (!source.paused) {
                playing = true;
                this.stop();
            }
            source.attr('src', item.url);
            source.attr('title', item.name + ' - ' + item.artist);
            this.volume($storage.get('_PlayerVolume') || '0.7');
            this.muted($storage.get('_PlayerMuted'));
            progress.create();
            if (this.options.type === 'audio') {
                preview.create();
            }
            if (playing === true) {
                this.play();
            }
        },
        play: function () {
            NOWPLAYING && NOWPLAYING.player.pause();
            if (playlist.current().error) {
                this.mode();
                return;
            }
            source.play().then(function () {
                playlist.scroll();
            }).catch(function (e) {
            });
        },
        pause: function () {
            source.pause();
            document.title = originTitle;
        },
        stop: function () {
            source.pause();
            source.currentTime = 0;
            document.title = originTitle;
        },
        seek: function (time) {
            time = Math.max(time, 0);
            time = Math.min(time, source.duration);
            source.currentTime = time;
            progress.update(time / source.duration);
        },
        muted: function (status) {
            if (status === 'muted') {
                source.muted = status;
                $storage.set('_PlayerMuted', status);
                controller.update(0);
            }
            else {
                $storage.del('_PlayerMuted');
                source.muted = false;
                controller.update(source.volume);
            }
        },
        volume: function (percentage) {
            if (!isNaN(percentage)) {
                controller.update(percentage);
                $storage.set('_PlayerVolume', percentage);
                source.volume = percentage;
            }
        },
        mini: function () {
            info.hide();
        }
    };
    const lyrics = {
        el: null,
        data: null,
        index: 0,
        create: (box) => {
            const current = playlist.index;
            const raw = playlist.current().lrc;
            const callback = function (body) {
                if (current !== playlist.index) {
                    return;
                }
                this.data = this.parse(body);
                let lrc = '';
                this.data.forEach(function (line, index) {
                    lrc += '<p' + (index === 0 ? ' class="current"' : '') + '>' + line[1] + '</p>';
                });
                this.el = box.createChild('div', {
                    className: 'inner',
                    innerHTML: lrc
                }, 'replace');
                this.index = 0;
            };
            if (raw.startsWith('http')) {
                this.fetch(raw, callback);
            }
            else {
                callback(raw);
            }
        },
        update: function (currentTime) {
            if (!this.data) {
                return;
            }
            if (this.index > this.data.length - 1 || currentTime < this.data[this.index][0] || (!this.data[this.index + 1] || currentTime >= this.data[this.index + 1][0])) {
                for (let i = 0; i < this.data.length; i++) {
                    if (currentTime >= this.data[i][0] && (!this.data[i + 1] || currentTime < this.data[i + 1][0])) {
                        this.index = i;
                        const y = -(this.index - 1);
                        this.el.style.transform = 'translateY(' + y + 'rem)';
                        this.el.getElementsByClassName('current')[0].removeClass('current');
                        this.el.getElementsByTagName('p')[i].addClass('current');
                    }
                }
            }
        },
        parse: function (lrc_s) {
            if (lrc_s) {
                lrc_s = lrc_s.replace(/([^\]^\n])\[/g, function (match, p1) {
                    return p1 + '\n[';
                });
                const lyric = lrc_s.split('\n');
                let lrc = [];
                const lyricLen = lyric.length;
                for (let i = 0; i < lyricLen; i++) {
                    const lrcTimes = lyric[i].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g);
                    const lrcText = lyric[i]
                        .replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g, '')
                        .replace(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g, '')
                        .replace(/^\s+|\s+$/g, '');
                    if (lrcTimes) {
                        const timeLen = lrcTimes.length;
                        for (let j = 0; j < timeLen; j++) {
                            const oneTime = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/.exec(lrcTimes[j]);
                            const min2sec = oneTime[1] * 60;
                            const sec2sec = parseInt(oneTime[2]);
                            const msec2sec = oneTime[4] ? parseInt(oneTime[4]) / ((oneTime[4] + '').length === 2 ? 100 : 1000) : 0;
                            const lrcTime = min2sec + sec2sec + msec2sec;
                            lrc.push([lrcTime, lrcText]);
                        }
                    }
                }
                lrc = lrc.filter(function (item) {
                    return item[1];
                });
                lrc.sort(function (a, b) {
                    return a[0] - b[0];
                });
                return lrc;
            }
            else {
                return [];
            }
        },
        fetch: function (url, callback) {
            fetch(url)
                .then(function (response) {
                return response.text();
            }).then(function (body) {
                callback(body);
            }).catch(function (ex) {
            });
        }
    };
    const events = {
        onerror: function () {
            playlist.error();
            t.player.mode();
        },
        ondurationchange: function () {
            if (source.duration !== 1) {
                progress.el.attr('data-dtime', utils.secondToTime(source.duration));
            }
        },
        onloadedmetadata: function () {
            t.player.seek(0);
            progress.el.attr('data-dtime', utils.secondToTime(source.duration));
        },
        onplay: function () {
            t.parentNode.addClass('playing');
            showtip(this.attr('title'));
            NOWPLAYING = t;
        },
        onpause: function () {
            t.parentNode.removeClass('playing');
            NOWPLAYING = null;
        },
        ontimeupdate: function () {
            if (!this.disableTimeupdate) {
                progress.update(this.currentTime / this.duration);
                lyrics.update(this.currentTime);
            }
        },
        onended: function (argument) {
            t.player.mode();
            t.player.play();
        }
    };
    const init = function (config) {
        if (t.player.created) {
            return;
        }
        t.player.options = Object.assign(option, config);
        t.player.options.mode = $storage.get('_PlayerMode') || t.player.options.mode;
        buttons.create();
        source = t.createChild(t.player.options.type, events);
        info.create();
        t.parentNode.addClass(t.player.options.type);
        t.player.created = true;
    };
    init(config);
    return t;
};
