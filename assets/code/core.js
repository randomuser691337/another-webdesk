// WebDesk 0.0.9
// Rebuild 7 (wtf)

function gen(length) {
    if (length <= 0) {
        console.error('Length should be greater than 0');
        return null;
    }

    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function gens(length) {
    if (length <= 0) {
        console.error('Length should be greater than 0');
        return null;
    }

    const array = new Uint32Array(Math.ceil(length / 4));
    window.crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < array.length; i++) {
        result += array[i].toString(16).padStart(8, '0');
    }

    return result.slice(0, length);
}

var wd = {
    win: function () {
        $('.d').not('.dragged').on('mousedown touchstart', function (event) {
            var $window = $(this).closest('.window');
            if (!$window.hasClass('max')) {
                var offsetX, offsetY;
                var windows = $('.window');
                highestZIndex = Math.max.apply(null, windows.map(function () {
                    var zIndex = parseInt($(this).css('z-index')) || 0;
                    return zIndex;
                }).get());
                $window.css('z-index', highestZIndex + 1);
                $('.window').removeClass('winf');
                $window.addClass('winf');

                if (event.type === 'mousedown') {
                    offsetX = event.clientX - $window.offset().left;
                    offsetY = event.clientY - $window.offset().top;
                } else if (event.type === 'touchstart') {
                    var touch = event.originalEvent.touches[0];
                    offsetX = touch.clientX - $window.offset().left;
                    offsetY = touch.clientY - $window.offset().top;
                }

                $(document).on('mousemove touchmove', function (event) {
                    var newX, newY;
                    if (event.type === 'mousemove') {
                        newX = event.clientX - offsetX;
                        newY = event.clientY - offsetY;
                        $window.addClass('dragging');
                    } else if (event.type === 'touchmove') {
                        var touch = event.originalEvent.touches[0];
                        newX = touch.clientX - offsetX;
                        newY = touch.clientY - offsetY;
                        $window.addClass('dragging');
                    }

                    $window.offset({ top: newY, left: newX });
                });

                $(document).on('mouseup touchend', function () {
                    $(document).off('mousemove touchmove');
                    $window.removeClass('dragging');
                });

                document.body.addEventListener('touchmove', function (event) {
                    event.preventDefault();
                }, { passive: false });

            }
        });
    },
    desktop: function (name, deskid, waitopt) {
        ui.dest(tk.g('setuparea'));
        function startmenu() {
            if (el.sm == undefined) {
                el.sm = tk.c('div', document.body, 'tbmenu');
                const btm = el.taskbar.getBoundingClientRect();
                el.sm.style.bottom = btm.height + btm.x + 4 + "px";
                tk.p(`Hello, ${name}!`, 'h2', el.sm);
                for (var key in app) {
                    if (app.hasOwnProperty(key)) {
                        if (app[key].hasOwnProperty("runs") && app[key].runs === true) {
                            console.log('<i> This app can run normally!');
                            const btn = tk.cb('b1', app[key].name, app[key].init.bind(app[key]), el.sm);
                            btn.addEventListener('click', function () {
                                ui.dest(el.sm, 150);
                                el.sm = undefined;
                            });
                        }
                    }
                }
            } else {
                ui.dest(el.sm, 150);
                el.sm = undefined;
            }
        }
        function desktopgo() {
            el.taskbar = tk.c('div', document.body, 'taskbar');
            const lefttb = tk.c('div', el.taskbar, 'tnav');
            const titletb = tk.c('div', el.taskbar, 'title');
            const start = tk.cb('b1', 'Apps', () => startmenu(), lefttb);
            el.tr = tk.c('div', lefttb);
            tk.cb('b1 time', '--:--', () => wm.notif(`In progress`, `Control Center`), titletb);
        }
        if (waitopt === "wait") {
            setTimeout(function () { desktopgo(); }, 400);
        } else {
            desktopgo();
        }
    },
    clock: function () {
        const currentTime = new Date();
        let hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        const elements = document.getElementsByClassName("time");
        for (let i = 0; i < elements.length; i++) {
            elements[i].innerText = formattedTime;
        }
    },
    finishsetup: function (name, div1, div2) {
        ui.sw2(div1, div2); ui.masschange('name', name); fs.write('/user/info/name', name);
    },
    reboot: function () {
        window.location.reload();
    },
    dark: function () {
        ui.cv('ui1', 'rgb(40, 40, 40, 0.6)');
        ui.cv('ui2', '#1b1b1b');
        ui.cv('ui3', '#2b2b2b');
        ui.cv('font', '#fff');
        fs.write('/user/info/lightdark', 'dark');
    },
    light: function () {
        ui.cv('ui1', 'rgb(255, 255, 255, 0.6)');
        ui.cv('ui2', '#ffffff');
        ui.cv('ui3', '#dddddd');
        ui.cv('font', '#000');
        fs.del('/user/info/lightdark');
    },
    clearm: function () {
        ui.cv('ui1', 'rgb(255, 255, 255, 0)');
        ui.cv('ui2', 'rgba(var(--accent), 0.1)');
        ui.cv('ui3', 'rgba(var(--accent) 0.2)');
        ui.cv('font', '#000');
        fs.write('/user/info/lightdark', 'clear');
    },
    clearm2: function () {
        ui.cv('ui1', 'rgb(255, 255, 255, 0)');
        ui.cv('ui2', 'rgba(var(--accent), 0.1)');
        ui.cv('ui3', 'rgba(var(--accent) 0.2)');
        ui.cv('font', '#fff');
        fs.write('/user/info/lightdark', 'clear2');
    }
}

setInterval(wd.clock, 1000);