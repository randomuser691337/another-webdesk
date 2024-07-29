var ui = {
    cv: function (varName, varValue) {
        const root = document.documentElement;
        root.style.setProperty(`--${varName}`, `${varValue}`);
    },
    theme: function (background1, background2, shade1, shade2, accent) {
        ui.cv('bg1', background1); ui.cv('bg2', background2); ui.cv('sh1', shade1); ui.cv('sh2', shade2);
        ui.cv('accent', accent);
    },
    crtheme: async function (hex) {
        const a = ui.hextool(hex, 20)
        ui.theme(ui.hextool(hex, 10), a, ui.hextool(hex, 30), ui.hextool(hex, 40), ui.hextorgb(hex));
        await fs.write('/user/info/color', hex);
        if (sys.autodarkacc === true) {
            const silly = ui.hexdark(a);
            if (silly === true) {
                wd.dark();
            } else {
                wd.light();
            }
        }
    },
    sw: function (d1, d2) {
        const dr1 = document.getElementById(d1);
        const dr2 = document.getElementById(d2);
        $(dr1).fadeOut(160, function () { $(dr2).fadeIn(160); });
    },
    sw2: function (d1, d2) {
        $(d1).fadeOut(160, function () { $(d2).fadeIn(160); });
    },
    hide: function (dr1, anim) {
        if (dr1) {
            if (anim) {
                $(dr1).fadeOut(anim);
            } else {
                $(dr1).fadeOut(210);
            }
        }
    },
    play: function (filename) {
        const audio = new Audio(filename);
        audio.volume = nvol;
        audio.play();
    },
    show: function (dr1, anim) {
        if (dr1) {
            if (anim) {
                $(dr1).fadeIn(anim);
            } else {
                $(dr1).fadeIn(210);
            }
        }
    },
    showfi: function (dr1, anim) {
        if (dr1) {
            if (anim) {
                $(dr1).fadeIn(anim).css("display", "inline-block");
            } else {
                $(dr1).fadeIn(170).css("display", "inline-block");
            }
        }
    },
    dest: function (dr1, anim) {
        if (dr1) {
            if (anim) {
                $(dr1).fadeOut(anim, function () { dr1.remove(); });
            } else {
                $(dr1).fadeOut(170, function () { dr1.remove(); });
            }
        }
    },
    toggle: function (elementId, time3) {
        var element = document.getElementById(elementId);
        if (element) {
            if (element.style.display === '' || element.style.display === 'none') {
                element.style.display = 'block';
            } else {
                hidef(elementId, time3);
            }
        }
    },
    hidecls: function (className) {
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
    },
    showcls: function (className) {
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = 'inline';
        }
    },
    masschange: function (classn, val) {
        const usernameElements = document.getElementsByClassName(classn);
        for (let i = 0; i < usernameElements.length; i++) {
            usernameElements[i].textContent = val;
        }
    },
    center: function (element) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        element.style.left = `${(screenWidth - elementWidth) / 2}px`;
        element.style.top = `${(screenHeight - elementHeight) / 2}px`;
    },
    hextool: function (hex, percent) {
        if (hex.startsWith('#')) {
            hex = hex.slice(1);
        }

        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        percent = percent / 100;
        let adjustment = percent < 0.5 ? 255 * (0.5 - percent) : 255 * (percent - 0.5);

        if (percent < 0.5) {
            r = Math.min(255, r + adjustment);
            g = Math.min(255, g + adjustment);
            b = Math.min(255, b + adjustment);
        } else {
            r = Math.max(0, r - adjustment);
            g = Math.max(0, g - adjustment);
            b = Math.max(0, b - adjustment);
        }

        r = Math.round(r).toString(16).padStart(2, '0');
        g = Math.round(g).toString(16).padStart(2, '0');
        b = Math.round(b).toString(16).padStart(2, '0');

        return `#${r}${g}${b}`;
    },
    hexdark: function (hex) {
        hex = hex.replace(/^#/, '');

        let bigint = parseInt(hex, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;

        let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luminance < 128;
    },
    hextorgb: function (hex) {
        hex = hex.replace(/^#/, '');
        let bigint = parseInt(hex, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return `${r}, ${g}, ${b}`;
    }
}

var tk = {
    c: function (type, ele, classn) {
        const ok = document.createElement(type);
        if (ele) {
            ele.appendChild(ok);
        }
        if (classn) {
            ok.classList = classn;
        }
        return ok;
    },
    g: function (element) {
        return document.getElementById(element);
    },
    t: function (ele, text) {
        ele.innerHTML = text;
    },
    p: function (contents, classn, div) {
        const fuck = document.createElement('p');
        fuck.innerHTML = contents;
        if (classn) {
            fuck.classList = classn;
        }
        div.appendChild(fuck);
        return fuck;
    },
    img: function (src, classn, div) {
        const fuck = document.createElement('img');
        fuck.src = src;
        if (classn) {
            fuck.classList = classn;
        }
        div.appendChild(fuck);
        return fuck;
    },
    css: function (href) {
        const existingLink = Array.from(document.getElementsByTagName('link')).find(
            link => link.rel === 'stylesheet' && link.href === href
        );

        if (!existingLink) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            document.head.appendChild(link);
        }
    },
    cb: function (classn, name, func, ele) {
        const button = document.createElement('button');
        button.className = classn;
        button.innerText = name;
        if (func) {
            button.addEventListener('click', func);
        }
        if (ele) {
            ele.appendChild(button);
        }
        return button;
    },
    a: function (ele1, ele2) {
        ele1.appendChild(ele2);
    },
    mbw: function (title, wid, hei, full, min, quit) {
        var windowDiv = document.createElement('div');
        windowDiv.classList.add('window');
        windowDiv.style.width = wid;
        windowDiv.style.height = hei;
        var titlebarDiv = document.createElement('div');
        titlebarDiv.classList.add('d');
        titlebarDiv.classList.add('tb');
        var winbtns = document.createElement('div');
        winbtns.classList.add('tnav');
        var closeButton = document.createElement('div');
        closeButton.classList.add('winb');
        const tbn = tk.cb('b1', title, () => ui.show(windowDiv, 100), el.tr);
        if (quit === undefined) {
            closeButton.classList.add('red');
            closeButton.addEventListener('mousedown', function () {
                ui.dest(windowDiv, 100);
                ui.dest(tbn, 100);
            });
        }

        var minimizeButton = document.createElement('div');
        minimizeButton.classList.add('winb');
        if (min === undefined) {
            minimizeButton.classList.add('yel');
            minimizeButton.addEventListener('mousedown', function () {
                ui.hide(windowDiv, 100);
            });
        }
        var maximizeButton = document.createElement('div');
        maximizeButton.classList.add('winb');
        if (full === undefined) {
            maximizeButton.classList.add('gre');
            maximizeButton.addEventListener('mousedown', function () {
                max(windowDiv.id);
            });
        }

        winbtns.appendChild(closeButton);
        winbtns.appendChild(minimizeButton);
        winbtns.appendChild(maximizeButton);
        titlebarDiv.appendChild(winbtns);
        var titleDiv = document.createElement('div');
        titleDiv.classList.add('title');
        titleDiv.innerHTML = title;
        titlebarDiv.appendChild(titleDiv);
        windowDiv.appendChild(titlebarDiv);
        var contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        windowDiv.appendChild(contentDiv);
        document.body.appendChild(windowDiv);
        wd.win(); $(windowDiv).fadeIn(130); ui.center(windowDiv);
        return { win: windowDiv, main: contentDiv, tbn, title: titlebarDiv };
    }
}
