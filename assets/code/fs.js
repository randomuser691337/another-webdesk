var wfs = new Worker('./assets/code/wfs.js');

wfs.onmessage = function (event) {
    const { type, data, requestId } = event.data;
    if (pendingRequests[requestId]) {
        if (type === 'result') {
            pendingRequests[requestId].resolve(data);
        } else if (type === 'error') {
            pendingRequests[requestId].reject(data);
        }
        delete pendingRequests[requestId];
    } else if (type === 'db_ready') {
        boot();
    } else if (type === "reboot") {
        window.location.reload();
    } else {
        console.warn('Unknown message type or requestId from wfs:', type);
    }
};

const pendingRequests = {};
let requestIdCounter = 0;

var fs = {
    send: function (message, transferList) {
        wfs.postMessage(message, transferList);
    },
    askwfs: function (operation, params, opt) {
        const requestId = requestIdCounter++;
        return new Promise((resolve, reject) => {
            pendingRequests[requestId] = { resolve, reject };
            if (operation === 'write' && opt instanceof ArrayBuffer) {
                fs.send({ type: 'fs', operation, params, opt, requestId }, [p2]);
            } else {
                fs.send({ type: 'fs', operation, params, opt, requestId });
            }
        });
    },
    read: function (path) {
        return this.askwfs('read', path);
    },
    write: function (path, data) {
        return this.askwfs('write', path, data);
    },
    del: function (path) {
        return this.askwfs('delete', path);
    },
    erase: function (path) {
        return this.askwfs('erase', path);
    },
    ls: function (path) {
        return this.askwfs('ls', path);
    },
    getall: function () {
        return this.askwfs('all');
    },
};