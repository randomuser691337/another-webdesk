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
            tk.cb('b1 b2 red', 'Preload SelfQNA content', function () { fs.write('/user/demo/steak', `A steak is a thick cut of meat generally sliced across the muscle fibers, sometimes including a bone. It is normally grilled or fried. Steak can be diced, cooked in sauce, such as in steak and kidney pie, or minced and formed into patties, such as hamburgers. Steaks are cut from animals including cattle, bison, buffalo, camel, goat, horse, kangaroo,[1][2] sheep, ostrich, pigs, turkey, and deer, as well as various types of fish, especially salmon and large fish such as swordfish, shark, and marlin. For some meats, such as pork, lamb and mutton, chevon, and veal, these cuts are often referred to as chops. Some cured meat, such as gammon, is commonly served as steak.`); wm.wal(`<p>Preloaded article on steak, ask SelfQNA "what is steak"</p>`) }, generalPane);
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
                sys.autodarkacc = false;
                wd.dark();
            }, appearPane);
            tk.cb('b1 b2', 'Auto (based off color picker)', async function () {
                fs.write('/user/info/lightdarkpref', 'auto');
                const killyourselfapplesheep = await fs.read('/user/info/color');
                ui.crtheme(killyourselfapplesheep);
                sys.autodarkacc = true;
            }, appearPane);
            tk.cb('b1 b2', 'Clear mode (Light Text)', function () {
                fs.del('/user/info/lightdarkpref');
                sys.autodarkacc = false;
                wd.clearm2();
            }, appearPane);
            tk.cb('b1 b2', 'Clear mode (Dark Text)', function () {
                fs.del('/user/info/lightdarkpref');
                sys.autodarkacc = false;
                wd.clearm();
            }, appearPane);
            tk.cb('b1 b2', 'Light mode', function () {
                fs.del('/user/info/lightdarkpref');
                sys.autodarkacc = false;
                wd.light();
            }, appearPane);
            tk.p('Other', undefined, appearPane);
            tk.cb('b1', 'Reset Colors', function () {
                fs.del('/user/info/color');
                fs.del('/user/info/lightdark');
                fs.del('/user/info/lightdarkpref');
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
            tk.cb('b4', 'Start Over', () => fs.erase('reboot'), tnav);
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
            tk.p('To copy your data, open Backup -> Migrate on the other WebDesk, and enter the code below. This works for the old beta too.', undefined, transfer);
            tk.p('--------', 'h2 deskid', transfer);
            tk.cb('b1', 'No thanks', () => ui.sw2(transfer, warn), transfer);
            transfer.id = "quickstartwdsetup";
            // copying menu
            const copy = tk.c('div', main, 'setb hide');
            tk.img('./assets/img/setup/restore.svg', 'setupi', copy);
            tk.p('Restoring from other WebDesk', 'h2', copy);
            tk.p('This might take a while depending on settings and file size.', undefined, copy);
            tk.p('Starting...', 'restpg', copy);
            tk.cb('b1', 'Cancel', function () { fs.erase('reboot'); }, copy);
            copy.id = "quickstartwdgoing";
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
            tk.cb('b1', 'Done!', function () { wd.finishsetup(input.value, user, sum) }, user);
            // summary
            const sum = tk.c('div', main, 'setb hide');
            tk.img('./assets/img/setup/check.svg', 'setupi', sum);
            tk.p('All done!', 'h2', sum);
            tk.p('Have fun! Make sure to check Settings for more options.', undefined, sum);
            tk.cb('b1 rb', 'Erase & restart', function () { fs.erase('reboot'); }, sum); tk.cb('b1', 'Finish setup', function () { wd.reboot(); }, sum);
            sum.id = "setupdone";
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
            tk.p(`WebDesk`, 'h2', win.main);
            tk.p(`Version: ${abt.ver}`, undefined, win.main);
            tk.p(`Latest update: ${abt.lastmod}`, undefined, win.main);
        }
    },
    ach: {
        runs: true,
        name: 'Achievements',
        init: async function () {
            const win = tk.mbw('Achievements', '300px', 'auto', true, undefined, undefined);
            tk.p(`WebDesk Achievements`, 'h2', win.main);
            tk.p(`Unlocked 0/0 achievements`, undefined, win.main);
        }
    },
    selfqna: {
        runs: true,
        name: 'SelfQNA',
        init: async function () {
            const win = tk.mbw('SelfQNA', '380px', 'auto', true, undefined, undefined);
            tk.p(`Searches WebDesk's filesystem for something you ask for, and might return an answer.`, undefined, win.main);
            const i = tk.c('input', win.main, 'i1');
            i.placeholder = "Ask your WebDesk a question...";
            let finish;
            const unload = tk.cb('b1', 'Unload model from RAM', async () => {
                sys.model = undefined;
                finish.innerText = "Model unloaded successfully";
                setTimeout(function () { finish.innerText = "Ask your WebDesk a question..."; }, 3000)
            }, win.main);
            const button = tk.cb('b1', 'Ask!', async () => {
                finish.innerText = "Loading files...";
                try {
                    const context = await fs.getall();
                    const answer = await ai.find(context, i.value, finish);
                    finish.innerText = answer;
                } catch (error) {
                    finish.innerText = "Error occurred: " + error.message;
                }
            }, win.main);
            finish = tk.p('Answers will appear here', undefined, win.main);
        }
    },
    browser: {
        runs: true,
        name: 'Browser',
        init: async function () {
            const win = tk.mbw('Browser', '80vw', '82vh', true, undefined, undefined);
            ui.dest(win.title, 0);
            const tabs = tk.c('div', win.main, 'tabbar d');
            let currenttab = tk.c('div', win.main, 'hide');
            let currentbtn = tk.c('div', win.main, 'hide');
            let currentname = tk.c('div', win.main, 'hide');
            win.main.classList = "browsercont";
            tk.css('./assets/lib/browse.css');
            const btnnest = tk.c('div', tabs, 'tnav');
            const okiedokie = tk.c('div', tabs, 'browsertitle')
            const searchbtns = tk.c('div', okiedokie, 'tnav');
            const addbtn = tk.cb('b4 browserbutton', '+', function () {
                const tab = tk.c('embed', win.main, 'browsertab');
                tab.src = "https://meower.xyz";
                ui.sw2(currenttab, tab);
                currenttab = tab;
                const tabbtn = tk.cb('b4 browserpad', '', function () {
                    ui.sw2(currenttab, tab);
                    currenttab = tab;
                    currentbtn = tabtitle;
                }, btnnest);
                const tabtitle = tk.c('span', tabbtn);
                tabtitle.innerText = "meower.xyz";
                currentname = tabtitle;
                currentbtn = tabtitle;
                const closetab = tk.cb('browserclosetab', 'x', function () {
                    ui.dest(tabbtn); ui.dest(currenttab);
                }, tabbtn);
            }, searchbtns);
            const close = tk.cb('b4 rb browserbutton', 'x', function () {
                ui.dest(win.win, 150);
                ui.dest(win.tbn, 150);
            }, btnnest);
            const rel = tk.cb('b4 browserbutton', '⟳', function () {
            }, searchbtns);
            const back = tk.cb('b4 browserbutton', '<', function () {
            }, searchbtns);
            const rev = tk.cb('b4 browserbutton', '>', function () {

            }, searchbtns);
            const searchnest = tk.c('div', tabs, 'title');
            const search = tk.c('input', okiedokie, 'i1 browserbutton');
            search.placeholder = "Enter URL";
            const go = tk.cb('b4 browserbutton', 'Go!', function () {
                currenttab.src = "https://" + search.value;
                currentbtn.innerText = search.value;
            }, okiedokie);
            wd.win(); addbtn.click();
        }
    }
};