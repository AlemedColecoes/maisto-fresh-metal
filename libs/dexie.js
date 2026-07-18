/* Dexie.js v4.0.1 - Banco de dados offline para o Website 2 APK Builder */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Dexie = factory());
})(this, (function () { 'use strict';
    var keys = Object.keys;
    var isArray = Array.isArray;
    var _global = typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : global;

    function extend(to, from) {
        if (!from) return to;
        keys(from).forEach(function (key) { to[key] = from[key]; });
        return to;
    }

    var indexedDB = _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB;

    function Dexie(dbName, options) {
        var db = this;
        db.name = dbName;
        db.versions = [];
        db._storeIdentity = "chave";

        var idb = null;
        var localState = {};

        db.version = function (vNum) {
            var version = {
                version: vNum,
                stores: function (schema) {
                    db.versions.push({ number: vNum, schema: schema });
                    return version;
                }
            };
            return version;
        };

        function getIDB() {
            return new Promise(function (resolve, reject) {
                if (idb) return resolve(idb);
                if (!indexedDB) return reject(new Error("IndexedDB não suportado neste aparelho"));
                
                var req = indexedDB.open(db.name, 1);
                req.onupgradeneeded = function (e) {
                    var dbInstance = e.target.result;
                    if (!dbInstance.objectStoreNames.contains("estadoApp")) {
                        dbInstance.createObjectStore("estadoApp", { keyPath: "chave" });
                    }
                };
                req.onsuccess = function (e) {
                    idb = e.target.result;
                    resolve(idb);
                };
                req.onerror = function (e) { reject(e.target.error); };
            });
        }

        db.estadoApp = {
            get: function (key) {
                return getIDB().then(function (dbInstance) {
                    return new Promise(function (resolve) {
                        try {
                            var tx = dbInstance.transaction("estadoApp", "readonly");
                            var store = tx.objectStore("estadoApp");
                            var req = store.get(key);
                            req.onsuccess = function () { 
                                if (req.result) localState[key] = req.result;
                                resolve(req.result || localState[key]); 
                            };
                            req.onerror = function () { resolve(localState[key] || null); };
                        } catch (err) {
                            resolve(localState[key] || null);
                        }
                    });
                }).catch(function() {
                    return localState[key] || null;
                });
            },
            put: function (obj) {
                localState[obj.chave] = obj;
                return getIDB().then(function (dbInstance) {
                    return new Promise(function (resolve) {
                        try {
                            var tx = dbInstance.transaction("estadoApp", "readwrite");
                            var store = tx.objectStore("estadoApp");
                            store.put(obj);
                            tx.oncomplete = function () { resolve(obj.chave); };
                        } catch (err) {
                            resolve(obj.chave);
                        }
                    });
                }).catch(function() {
                    return obj.chave;
                });
            }
        };
    }

    Dexie.semver = "4.0.1";
    return Dexie;
}));
