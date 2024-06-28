var wm = {
    wal: function (content, btn1, n, icon) {
        const windowId = gen(6);
        const windowContainer = document.createElement('div');
        windowContainer.className = 'window';
        windowContainer.id = windowId;
        windowContainer.style.display = "block";
        windowContainer.style.zIndex = 2;
        windowContainer.style.width = '300px';
        windowContainer.style.height = 'auto';
        const titleBar = document.createElement('div');
        titleBar.className = 'd';
        titleBar.style.border = "none";
        titleBar.style.borderRadius = "12px";
        titleBar.style.padding = "10px";
        if (!n) { n = "Okay" }
        titleBar.innerHTML = content + `<p style="display: flex; justify-content: space-between;"><button class="b1 wc" style="flex: 1;" onmousedown="clapp('${windowId}');dest('${windowId}');">Close</button><button class="b1 wc" style="flex: 1; ${btn1 ? '' : 'display: none;'}" onmousedown="clapp('${windowId}');dest('${windowId}');${btn1}">${n}</button></p>`;
        windowContainer.appendChild(titleBar);
        document.body.appendChild(windowContainer);
        touch();
        if (icon) {
            opapp(windowId, 'Alert', icon);
        } else {
            opapp(windowId, 'Alert');
        }
    },
    
    center: function (el) {
        const element = document.getElementById(el);
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        const leftPosition = (screenWidth - elementWidth) / 2;
        const topPosition = (screenHeight - elementHeight) / 2;
        element.style.left = `${leftPosition}px`;
        element.style.top = `${topPosition}px`;
    },
    
    open: function (id, name, img) {
        hidef('gomenu');
        const div = document.getElementById(id);
        const check = document.getElementById("btn_" + id);
        const switcher = document.getElementById('taskbara');
        if (div && !check) {
            div.style.display = "block";
            centerel(id);
            div.style.zIndex = highestZIndex + 1;
            $('.window').removeClass('winf');
            div.classList.add('winf');
            const btn = document.createElement('img');
            btn.className = "tbi";
            btn.id = "btn_" + id;
            btn.addEventListener('mouseover', function () { showf('taskapp', 0); document.getElementById('taskapp').innerHTML = name; });
            switcher.addEventListener('mouseleave', function () { hidef('taskapp', 140); });
            if (img) {
                btn.src = img;
            } else {
                btn.src = "./assets/img/apps/notfound.svg";
            }
            btn.onclick = function () {
                maxi(id);
            };
            if (switcher) {
                document.getElementById('taskbara').appendChild(btn);
            }
        } else {
            log('<!> Error making window.');
            log('   <i> Window: ' + div);
            log('   <i> Button: ' + check);
        }
    },
    
    notif: function (message, name, onclick) {
        const note = document.createElement('div');
        note.classList = "notif";
        note.innerHTML = `${name} - ${message}`;
        const id = gen(7);
        note.id = id;
        const note2 = document.createElement('div');
        note2.classList = "notif2";
        const id2 = gen(7);
        note2.id = id2;
        note2.innerText = `${name} - ${message}`;
        document.getElementById('notif').appendChild(note);
        document.getElementById('notifold').appendChild(note2);
        ui.play('./assets/other/webdrop.ogg');
        note.addEventListener('click', function () { dest(id, '100'); });
        note2.addEventListener('click', function () { dest(id2, '100'); });
        setTimeout(function () { dest(id, '100'); }, 20000);
        dest('defnotif');
    },
    cm: function () {
        const div = document.createElement('div');
        div.classList = "cm";
        document.body.appendChild(div);
        div.addEventListener('click', () => ui.dest(div));
        return div;
    },
    close: function (id) {
        const div = document.getElementById(id);
        if (div) {
            hidef(id);
            const fuck = "btn_" + id;
            if (document.getElementById(fuck)) {
                dest(fuck);
            }
        } else {
            log(`<!> Error closing window. Window: ${div} - Button: ${document.getElementById(fuck)}`);
        }
    },
    
    max: function (id) {
        const wid = document.getElementById(id);
        if (wid) {
            wid.classList.toggle('max');
            if (!wid.classList.contains('max')) {
                wid.classList.add('unmax');
                setTimeout(() => {
                    wid.classList.remove('unmax');
                }, 301);
            }
        }
    },
    
    mini: function (window) {
        hidef(window, 120);
    },
    
    mini: function (window) {
        showf(window, 0);
    },

    notif: function (name, cont, mode) {
       const div = tk.c('div', document.getElementById('notif'), 'notif');
       tk.p(name, 'smt', div);
       tk.p(cont, undefined, div);
       $(div).fadeIn(80);
       div.addEventListener('click', function () {div.remove()});
    }
}