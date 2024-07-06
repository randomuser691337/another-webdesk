var app = {
    settings: function () {
        const main = tk.mbw('Title Test', '300px', 'auto', true, undefined, undefined);
        const mainPane = tk.c('div', main.main);
        const generalPane = tk.c('div', main.main, 'hide');
        tk.p('Settings', undefined, mainPane);
        tk.p('General', undefined, generalPane);
        tk.cb('b1', 'General', () => ui.sw2(mainPane, generalPane), mainPane);
        tk.cb('b1', 'Back', () => ui.sw2(generalPane, mainPane), generalPane);
        tk.a(main.main, mainPane);
        tk.a(main.main, generalPane);
    },
    setup: function () {
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
        tk.p('Open Backup -> Migrate on the other WebDesk, and enter the code below to copy your data. If you have the old beta, then click "Copy from old WebDesk".', undefined, transfer);
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
        tk.p(`Set up a user for WebDesk to store all your things in, and also set up WebDesk's permissions.`, undefined, user);
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
        tk.cb('b1 rb', 'Erase & restart', function () { fs.erase('reboot'); }, sum); tk.cb('b1', 'Finish setup', function () { ui.sw2(warn, user) }, sum);
    }
}