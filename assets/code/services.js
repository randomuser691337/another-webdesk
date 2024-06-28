var ptp = {
    go: async function (id) {
        let retryc = 0;
    
        async function attemptConnection() {
            peer = new Peer(id);
    
            peer.on('open', (peerId) => {
                ui.masschange('deskid', peerId);
                deskid = peerId;
                console.log('<i> DeskID is online. ID: ' + deskid);
            });
    
            peer.on('error', async (err) => {
                console.log(`<!> whoops: ${err}`);
                if (!deskid && retryc < 5) {
                    console.log('<!> DeskID failed to register, trying again...');
                    retryc++;
                    setTimeout(attemptConnection, 10000);
                } else if (retryc >= 5) {
                    console.log('<!> Maximum retry attempts reached. DeskID registration failed.');
                    wal(`<p class="h3">WebDesk to WebDesk services are disabled</p><p>Your DeskID didn't register for some reason, therefore you can't use WebDrop, WebCall or Migration Assistant.</p><p>If you'd like, you can reboot to try again. Check your Internet too.</p>`, 'reboot()', 'Reboot');
                } else {
                    snack('Failed to connect.');
                }
            });
    
            peer.on('connection', (conn) => {
                conn.on('data', (data) => {
                    handleData(conn, data);
                });
            });
    
            peer.on('call', (call) => {
                globcall = call;
                wd.opapp('calleri');
                ui.play('./assets/other/webdrop.ogg');
            });
        }
    
        attemptConnection();
    }
}

function handleData(conn, data) {
    if (webdrop === true) {
        if (data.name === "MigrationPackDeskFuckOld") {
            if (setupd === false) {
                fesw('setupqs', 'setuprs'); restorefs(data.file);
            } else {
                cm(`<p>A migration was attempted. Erase this WebDesk to migrate here.</p><p>If this wasn't you, you should <a onclick="idch();">change your ID.</a></p><button class="b1 b2">Close</button>`, '270px');
            }
        } else if (data.name === "YesImAlive-WebKey") {
            wm.notif(`${data.uname} accepted your WebDrop.`, 'WebDesk Services');
        } else if (data.name === "DesktoDeskMsg-WebKey") {
            wm.notif(data.file, 'WebDesk Services');
        } else if (data.name === "DeclineCall-WebKey") {
            fesw('caller3', 'caller1');
            snack('Your call was declined.');
        } else if (data.name === "WebCallName-WebKey") {
            masschange('callname', data.file);
            callid = data.id;
            addcall(data.file, callid);
            console.log('<i> bounced names');
            setInterval(function () { masschange('callname', data.file); }, 300);
        } else {
            recb = data.file;
            recn = data.name;
            play('./assets/other/webdrop.ogg');
            wal(`<p class="h3">WebDrop</p><p><span class="med dropn">what</span> would like to share <span class="med dropf">what</span></p>`, `acceptdrop();custf('${data.id}', 'YesImAlive-WebKey');`, 'Accept', './assets/img/apps/webdrop.svg');
            masschange('dropn', data.uname);
            masschange('dropf', data.name);
        }
    } else {
        custf(data.id, 'DesktoDeskMsg-WebKey', `${deskid} isn't accepting WebDrops right now.`);
    }
}

async function restorefs(zipBlob) {
    console.log('<i> Restore Stage 1: Prepare zip');
    try {
        fesw('setupqs', 'setuprs');
        const zip = await JSZip.loadAsync(zipBlob);
        const fileCount = Object.keys(zip.files).length;
        let filesDone = 0;
        console.log(`<i> Restore Stage 2: Open zip and extract ${fileCount} files to FS`);
        await Promise.all(Object.keys(zip.files).map(async filename => {
            console.log(`<i> Restoring file: ${filename}`);
            if (filename === "/system/enckey") {
                console.log(`<i> Skipped a file: ${filename}`);
                masschange('restpg', `Restoring ${filesDone}/${fileCount}: Skipped file: WebDesk specific`);
            } else {
                const file = zip.files[filename];
                const value = await file.async("string");
                fs.write(filename, value);
                filesDone++;
                masschange('restpg', `Restoring ${filesDone}/${fileCount}: ${filename}`);
            }
        }));
    } catch (error) {
        console.error('Error during restoration:', error);
    }
}
