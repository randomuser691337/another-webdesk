var ui = {
    cv: function (varName, varValue) {
        const root = document.documentElement;
        root.style.setProperty(`--${varName}`, `${varValue}`);
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
        var navigationButtonsDiv = document.createElement('div');
        navigationButtonsDiv.classList.add('tnav');
        var closeButton = document.createElement('div');
        closeButton.classList.add('winb');
        if (quit === undefined) {
            closeButton.classList.add('red');
            closeButton.addEventListener('mousedown', function () {
                wm.clapp(windowDiv.id); ui.dest(windowDiv.id, 100);
            });
        }

        var minimizeButton = document.createElement('div');
        minimizeButton.classList.add('winb');
        if (min === undefined) {
            minimizeButton.classList.add('yel');
            minimizeButton.addEventListener('mousedown', function () {
                mini(windowDiv.id);
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
        navigationButtonsDiv.appendChild(closeButton);
        navigationButtonsDiv.appendChild(minimizeButton);
        navigationButtonsDiv.appendChild(maximizeButton);
        titlebarDiv.appendChild(navigationButtonsDiv);
        var titleDiv = document.createElement('div');
        titleDiv.classList.add('title');
        titleDiv.innerHTML = title;
        titlebarDiv.appendChild(titleDiv);
        windowDiv.appendChild(titlebarDiv);
        var contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        windowDiv.appendChild(contentDiv);
        document.body.appendChild(windowDiv);
        wd.win(); $(windowDiv).fadeIn(130);
        return {win: windowDiv, main: contentDiv};
   }
}
