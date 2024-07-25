function startmenu() {
    el.sm = tk.c('div', document.body, 'tbmenu');
    const btm = el.taskbar.getBoundingClientRect();
    el.sm.style.bottom = btm.height + btm.x + 4 + "px";
    for (var key in app) {
        if (app.hasOwnProperty(key)) {
            if (app[key].runs) {
                console.log('<i> This app can run normally!</i>');
            } else {
                console.log('<i> fuck off</i>');
            }
        }
    }
}

var app = {
    settings: {
        runs: true,
        name: 'Settings',
        init: async function () {
            const main = tk.mbw('Settings', '300px', 'auto', true, undefined, undefined);
            const generalPane = tk.c('div', main.main, 'hide');
            const appearPane = tk.c('div', main.main, 'hide');
            const mainPane = tk.c('div', main.main);
            // Main pane
            tk.p('Settings', undefined, mainPane);
            tk.cb('b1 b2', 'General', () => ui.sw2(mainPane, generalPane), mainPane);
            tk.cb('b1 b2', 'Appearance', () => ui.sw2(mainPane, appearPane), mainPane);
            // General pane
            tk.p('General', undefined, generalPane);
            tk.cb('b1 b2 red', 'Erase This WebDesk', () => wm.wal(`<p>Warning: Erasing this WebDesk will destroy all data stored on it, and you'll need to do setup again.</p>`, () => fs.erase('reboot'), 'Erase'), generalPane);
            tk.cb('b1', 'Back', () => ui.sw2(generalPane, mainPane), generalPane);
            // Appearance pane
            tk.p('Appearance', undefined, appearPane);
            const bg1 = tk.c('input', appearPane, 'i1');
            bg1.setAttribute("data-jscolor", "{}");
            bg1.addEventListener('input', function () {
                ui.crtheme(event.target.value);
            });
            new JSColor(bg1, undefined);
            tk.p('UI Theme', undefined, appearPane);
            tk.cb('b1 b2', 'Dark mode', function () {
                fs.del('/user/info/lightdarkpref');
                wd.dark();
            }, appearPane);
            tk.cb('b1 b2', 'Auto (based off color picker)', async function () {
                fs.write('/user/info/lightdarkpref', 'auto');
                const killyourselfapplesheep = await fs.read('/user/info/color');
                ui.crtheme(killyourselfapplesheep);
                sys.autodarkacc = true;
            }, appearPane);
            tk.cb('b1 b2', 'Light mode', function () {
                fs.del('/user/info/lightdarkpref');
                wd.light();
            }, appearPane);
            tk.p('Other', undefined, appearPane);
            tk.cb('b1', 'Reset Colors', function () {
                fs.del('/user/info/color');
                wm.wal('Reboot to finish resetting colors.', () => wd.reboot(), 'Reboot');
            }, appearPane); tk.cb('b1', 'Back', () => ui.sw2(appearPane, mainPane), appearPane);
        }
    },
    setup: {
        runs: false,
        init: function () {
            const main = tk.c('div', document.getElementById('setuparea'), 'setupbox');
            // create setup menubar
            const bar = tk.c('div', main, 'setupbar');
            const tnav = tk.c('div', bar, 'tnav');
            const title = tk.c('div', bar, 'title');
            tk.cb('b4', 'Start Over', () => console.log(`<!> oops cant do that rn`), tnav);
            tk.cb('b4 time', 'what', undefined, title);
            // first menu
            const first = tk.c('div', main, 'setb');
            tk.img('./assets/img/setup/first.svg', 'setupi', first);
            tk.p('Welcome to WebDesk!', 'h2', first);
            tk.cb('b1', `Guest`, () => wd.desktop('Guest', gen(8)), first);
            tk.cb('b1', `Let's go`, () => ui.sw2(first, transfer), first);
            // migrate menu
            const transfer = tk.c('div', main, 'setb hide');
            tk.img('./assets/img/setup/quick.png', 'setupi', transfer);
            tk.p('Quick Start', 'h2', transfer);
            tk.p('To copy your data, open Backup -> Migrate on the other WebDesk, and enter the code below. If you have the old beta, then click "Copy from old WebDesk". Encryption is no longer available.', undefined, transfer);
            tk.p('Quick Start', 'h2 deskid', transfer);
            tk.cb('b1', 'No thanks', () => ui.sw2(transfer, warn), transfer);
            tk.cb('b1', 'Copy from old WebDesk', () => window.open(`http://localhost:330?mignew=${deskid}`, '_blank'), transfer);
            // copying menu
            const copy = tk.c('div', main, 'setb hide');
            tk.img('./assets/img/setup/restore.svg', 'setupi', copy);
            tk.p('Copying', 'h2', copy);
            tk.p('This might take a while depending on settings and file size.', undefined, copy);
            tk.cb('b1', 'Cancel', function () { fs.erase(); ui.sw2(copy, main) }, copy);
            // warn menu
            const warn = tk.c('div', main, 'setb hide');
            tk.img('./assets/img/noround.png', 'setupi', warn);
            tk.p(`WebDesk Online services`, 'h2', warn);
            tk.p('WebDesk makes an ID called a DeskID for you. Others can use this ID to send you files or call you.', undefined, warn);
            tk.p('To recieve calls and files from others, WebDesk needs to be open. When not in use, WebDesk uses less resources', undefined, warn);
            tk.cb('b1', `What's my DeskID?`, function () {
                const box = wm.cm();
                tk.p(`Your DeskID is <span class="deskid med">unknown</span>. You'll need to finish setup to use this ID.`, undefined, box);
                tk.cb('b1 rb', 'Got it', undefined, box);
            }, warn); tk.cb('b1', 'Got it', function () { ui.sw2(warn, user) }, warn);
            // user menu
            const user = tk.c('div', main, 'setb hide');
            tk.img('./assets/img/setup/user.svg', 'setupi', user);
            tk.p('User & Permissions', 'h2', user);
            tk.p(`Set up a user for WebDesk to store all your things in, and also set up WebDesk's permissions. Data is stored on your device only.`, undefined, user);
            const input = tk.c('input', user, 'i1');
            input.placeholder = "Enter a name to use with WebDesk/it's services";
            const notif = tk.c('div', user);
            tk.p('Allow WebDesk to notify you when someone calls or sends you a file? You can change this later in Settings.', undefined, notif);
            tk.cb('b1 rb', 'Deny', function () { wd.finishsetup(input.value, user, sum); }, notif); tk.cb('b1', 'Allow', function () {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        ui.masschange('notifperms', 'can');
                        wd.finishsetup(input.value, user, sum);
                    } else {
                        const box = wm.cm();
                        tk.p(`WebDesk wasn't granted notifications.`, undefined, box);
                        tk.cb('b1 rb', 'Got it', () => wd.finishsetup(input.value, user, sum), box);
                    }
                });
            }, notif);
            // summary
            const sum = tk.c('div', main, 'setb hide');
            tk.img('./assets/img/setup/check.svg', 'setupi', sum);
            tk.p('Summary', 'h2', sum);
            tk.p('WebDesk <span class="med notifperms">cannot</span> send notifications', undefined, sum);
            tk.p(`WebDesk's current user is <span class="med name">undefined</span>`, undefined, sum);
            tk.cb('b1 rb', 'Erase & restart', function () { fs.erase('reboot'); }, sum); tk.cb('b1', 'Finish setup', function () { wd.reboot(); }, sum);
        }
    },
    files: {
        runs: true,
        name: 'Files',
        init: async function () {
            const win = tk.mbw(`Files`, '340px', 'auto', true, undefined, undefined);
            const breadcrumbs = tk.c('div', win.main);
            const items = tk.c('div', win.main);
            async function navto(path) {
                items.innerHTML = "";
                breadcrumbs.innerHTML = "";
                let crumbs = path.split('/').filter(Boolean);
                let currentp = '/';
                tk.cb('flist', 'Root', () => navto('/'), breadcrumbs);
                crumbs.forEach((crumb, index) => {
                    currentp += crumb + '/';
                    tk.cb('flists', '/', undefined, breadcrumbs);
                    tk.cb('flist', crumb, () => {
                        let newPath = crumbs.slice(0, index + 1).join('/');
                        navto('/' + newPath + "/");
                    }, breadcrumbs);
                });

                const thing = await fs.ls(path);
                thing.items.forEach(function (thing) {
                    if (thing.type === "folder") {
                        tk.cb('flist width', "Folder: " + thing.name, () => navto(thing.path + "/"), items);
                    } else {
                        tk.cb('flist width', "File: " + thing.name, async function () { const yeah = await fs.read(thing.path); wm.wal(yeah); }, items);
                    }
                });
            }

            navto('/');
        }
    },
    about: {
        runs: true,
        name: 'About',
        init: async function () {
            const win = tk.mbw('About', '300px', 'auto', true, undefined, undefined);
            const p1 = tk.c('p', win.main);
            p1.innerHTML = `Version: ${abt.ver}`;
            const p2 = tk.c('p', win.main);
            p2.innerHTML = `Latest update: ${abt.lastmod}`;
        }
    }
};