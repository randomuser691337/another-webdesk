let db;
const request = indexedDB.open("WebDeskDB", 2);

request.onerror = function (event) {
    console.error('Error opening database:', event.target.error);
    self.postMessage({ type: 'error', data: event.target.error });
};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log('Database opened successfully');
    self.postMessage({ type: 'db_ready' });
};

request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains('main')) {
        const objectStore = db.createObjectStore('main', { keyPath: 'path' });
        console.log('Worker initialized DB for the first time');
    }
};

self.onmessage = function (event) {
    const { type, operation, params, opt, requestId } = event.data;
    if (type === 'fs') {
        idbop(operation, params, opt, requestId);
    }
};

function idbop(operation, params, opt, requestId) {
    switch (operation) {
        case 'read':
            fs2.read(params)
                .then(data => {
                    self.postMessage({ type: 'result', data, requestId });
                })
                .catch(error => {
                    self.postMessage({ type: 'error', data: error, requestId });
                });
            break;
        case 'write':
            fs2.write(params, opt)
                .then(() => {
                    self.postMessage({ type: 'result', data: true, requestId });
                })
                .catch(error => {
                    self.postMessage({ type: 'error', data: error, requestId });
                });
            break;
        case 'delete':
            fs2.del(params)
                .then(() => {
                    self.postMessage({ type: 'result', data: true, requestId });
                })
                .catch(error => {
                    self.postMessage({ type: 'error', data: error, requestId });
                });
            break;
        case 'erase':
            fs2.erase(params);
            break;
        case 'list':
            fs2.list(params);
            break;
        case 'all':
            fs2.all().then(files => {
                self.postMessage({ type: 'result', data: files, requestId });
            }).catch(error => {
                console.error('Error fetching files:', error);
            });
            break;
        case 'ls':
            fs2.folder(params).then(result => {
                self.postMessage({ type: 'result', data: result, requestId });
            }).catch(error => {
                self.postMessage({ type: 'error', data: error, requestId });
            });
            break;
        default:
            self.postMessage({ type: 'error', data: 'Unknown operation', requestId });
    }
}

var fs2 = {
    read: function (path) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['main'], 'readonly');
            const objectStore = transaction.objectStore('main');
            const request = objectStore.get(path);
            request.onsuccess = function (event) {
                const item = event.target.result;
                if (item && item.data) {
                    const decoded = new TextDecoder().decode(item.data);
                    resolve(decoded);
                } else {
                    resolve(null);
                }
            };
            request.onerror = function (event) {
                reject(event.target.error);
            };
        });
    },
    write: function (path, data) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['main'], 'readwrite');
            const objectStore = transaction.objectStore('main');
            const encoded = new TextEncoder().encode(data);
            const item = { path: path, data: encoded };
            const request = objectStore.put(item);
            request.onsuccess = function (event) {
                resolve();
            };
            request.onerror = function (event) {
                reject(event.target.error);
            };
        });
    },
    del: function (path) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['main'], 'readwrite');
            const objectStore = transaction.objectStore('main');
            const request = objectStore.delete(path);
            request.onsuccess = function (event) {
                resolve();
            };
            request.onerror = function (event) {
                reject(event.target.error);
            };
        });
    },
    erase: function (path) {
        if (db) { db.close(); }

        const deleteRequest = indexedDB.deleteDatabase("WebDeskDB");
        deleteRequest.onsuccess = function () {
            console.log("<!> WebDesk erased.");
            if (path === "reboot") {
                self.postMessage({ type: 'reboot' });
            }
        };

        deleteRequest.onerror = function (event) {
            console.log("<!> Error erasing: ", event.target.error);
        };
    },
    folder: function (path) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['main'], 'readonly');
            const objectStore = transaction.objectStore('main');
            const items = new Map();

            objectStore.openCursor().onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    if (cursor.key.startsWith(path)) {
                        const relativePath = cursor.key.substring(path.length);
                        const parts = relativePath.split('/');

                        if (parts.length > 1) {
                            items.set(parts[0], { path: path + parts[0], name: parts[0], type: 'folder' });
                        } else {
                            items.set(relativePath, { path: cursor.key, name: relativePath, type: 'file' });
                        }
                    }
                    cursor.continue();
                } else {
                    resolve({ items: Array.from(items.values()) });
                }
            };

            objectStore.openCursor().onerror = function (event) {
                reject(event.target.error);
            };
        });
    },
    all: function () {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['main'], 'readonly');
            const objectStore = transaction.objectStore('main');
            const fileContentsPromises = [];
    
            objectStore.openCursor().onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    const key = cursor.key;
                    const relativePath = key.split('/').pop();
    
                    if (!relativePath.includes('.png')) {
                        const request = objectStore.get(key);
                        request.onsuccess = function (event) {
                            const item = event.target.result;
                            if (item && item.data) {
                                const decoded = new TextDecoder().decode(item.data);
                                fileContentsPromises.push(relativePath + ": " + decoded);
                            } else {
                                fileContentsPromises.push(null);
                            }
                        };
                        request.onerror = function (event) {
                            reject(event.target.error);
                        };
                    }
                    cursor.continue();
                } else {
                    transaction.oncomplete = function () {
                        resolve(fileContentsPromises);
                    };
                }
            };
    
            objectStore.openCursor().onerror = function (event) {
                reject(event.target.error);
            };
        });
    }    
};
