import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2017 - 2021 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { logger } from "../../logger.js";
import { MigrationState, SESSION_BATCH_SIZE, ACCOUNT_OBJECT_KEY_MIGRATION_STATE } from "./base.js";
import { IndexedDBCryptoStore } from "./indexeddb-crypto-store.js";
var PROFILE_TRANSACTIONS = false;

/**
 * Implementation of a CryptoStore which is backed by an existing
 * IndexedDB connection. Generally you want IndexedDBCryptoStore
 * which connects to the database and defers to one of these.
 *
 * @internal
 */
export class Backend {
  /**
   */
  constructor(db) {
    this.db = db;
    _defineProperty(this, "nextTxnId", 0);
    // make sure we close the db on `onversionchange` - otherwise
    // attempts to delete the database will block (and subsequent
    // attempts to re-create it will also block).
    db.onversionchange = () => {
      logger.log("versionchange for indexeddb ".concat(this.db.name, ": closing"));
      db.close();
    };
  }
  containsData() {
    return _asyncToGenerator(function* () {
      throw Error("Not implemented for Backend");
    })();
  }
  startup() {
    var _this = this;
    return _asyncToGenerator(function* () {
      // No work to do, as the startup is done by the caller (e.g IndexedDBCryptoStore)
      // by passing us a ready IDBDatabase instance
      return _this;
    })();
  }
  deleteAllData() {
    return _asyncToGenerator(function* () {
      throw Error("This is not implemented, call IDBFactory::deleteDatabase(dbName) instead.");
    })();
  }

  /**
   * Get data on how much of the libolm to Rust Crypto migration has been done.
   *
   * Implementation of {@link CryptoStore.getMigrationState}.
   */
  getMigrationState() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      var migrationState = MigrationState.NOT_STARTED;
      yield _this2.doTxn("readonly", [IndexedDBCryptoStore.STORE_ACCOUNT], txn => {
        var objectStore = txn.objectStore(IndexedDBCryptoStore.STORE_ACCOUNT);
        var getReq = objectStore.get(ACCOUNT_OBJECT_KEY_MIGRATION_STATE);
        getReq.onsuccess = () => {
          var _getReq$result;
          migrationState = (_getReq$result = getReq.result) !== null && _getReq$result !== void 0 ? _getReq$result : MigrationState.NOT_STARTED;
        };
      });
      return migrationState;
    })();
  }

  /**
   * Set data on how much of the libolm to Rust Crypto migration has been done.
   *
   * Implementation of {@link CryptoStore.setMigrationState}.
   */
  setMigrationState(migrationState) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      yield _this3.doTxn("readwrite", [IndexedDBCryptoStore.STORE_ACCOUNT], txn => {
        var objectStore = txn.objectStore(IndexedDBCryptoStore.STORE_ACCOUNT);
        objectStore.put(migrationState, ACCOUNT_OBJECT_KEY_MIGRATION_STATE);
      });
    })();
  }

  // Olm Account

  getAccount(txn, func) {
    var objectStore = txn.objectStore("account");
    var getReq = objectStore.get("-");
    getReq.onsuccess = function () {
      try {
        func(getReq.result || null);
      } catch (e) {
        abortWithException(txn, e);
      }
    };
  }
  storeAccount(txn, accountPickle) {
    var objectStore = txn.objectStore("account");
    objectStore.put(accountPickle, "-");
  }
  getCrossSigningKeys(txn, func) {
    var objectStore = txn.objectStore("account");
    var getReq = objectStore.get("crossSigningKeys");
    getReq.onsuccess = function () {
      try {
        func(getReq.result || null);
      } catch (e) {
        abortWithException(txn, e);
      }
    };
  }
  getSecretStorePrivateKey(txn, func, type) {
    var objectStore = txn.objectStore("account");
    var getReq = objectStore.get("ssss_cache:".concat(type));
    getReq.onsuccess = function () {
      try {
        func(getReq.result || null);
      } catch (e) {
        abortWithException(txn, e);
      }
    };
  }
  storeSecretStorePrivateKey(txn, type, key) {
    var objectStore = txn.objectStore("account");
    objectStore.put(key, "ssss_cache:".concat(type));
  }

  // Olm Sessions

  countEndToEndSessions(txn, func) {
    var objectStore = txn.objectStore("sessions");
    var countReq = objectStore.count();
    countReq.onsuccess = function () {
      try {
        func(countReq.result);
      } catch (e) {
        abortWithException(txn, e);
      }
    };
  }
  getEndToEndSessions(deviceKey, txn, func) {
    var objectStore = txn.objectStore("sessions");
    var idx = objectStore.index("deviceKey");
    var getReq = idx.openCursor(deviceKey);
    var results = {};
    getReq.onsuccess = function () {
      var cursor = getReq.result;
      if (cursor) {
        results[cursor.value.sessionId] = {
          session: cursor.value.session,
          lastReceivedMessageTs: cursor.value.lastReceivedMessageTs
        };
        cursor.continue();
      } else {
        try {
          func(results);
        } catch (e) {
          abortWithException(txn, e);
        }
      }
    };
  }
  getEndToEndSession(deviceKey, sessionId, txn, func) {
    var objectStore = txn.objectStore("sessions");
    var getReq = objectStore.get([deviceKey, sessionId]);
    getReq.onsuccess = function () {
      try {
        if (getReq.result) {
          func({
            session: getReq.result.session,
            lastReceivedMessageTs: getReq.result.lastReceivedMessageTs
          });
        } else {
          func(null);
        }
      } catch (e) {
        abortWithException(txn, e);
      }
    };
  }
  storeEndToEndSession(deviceKey, sessionId, sessionInfo, txn) {
    var objectStore = txn.objectStore("sessions");
    objectStore.put({
      deviceKey,
      sessionId,
      session: sessionInfo.session,
      lastReceivedMessageTs: sessionInfo.lastReceivedMessageTs
    });
  }

  /**
   * Fetch a batch of Olm sessions from the database.
   *
   * Implementation of {@link CryptoStore.getEndToEndSessionsBatch}.
   */
  getEndToEndSessionsBatch() {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      var result = [];
      yield _this4.doTxn("readonly", [IndexedDBCryptoStore.STORE_SESSIONS], txn => {
        var objectStore = txn.objectStore(IndexedDBCryptoStore.STORE_SESSIONS);
        var getReq = objectStore.openCursor();
        getReq.onsuccess = function () {
          try {
            var cursor = getReq.result;
            if (cursor) {
              result.push(cursor.value);
              if (result.length < SESSION_BATCH_SIZE) {
                cursor.continue();
              }
            }
          } catch (e) {
            abortWithException(txn, e);
          }
        };
      });
      if (result.length === 0) {
        // No sessions left.
        return null;
      }
      return result;
    })();
  }

  /**
   * Delete a batch of Olm sessions from the database.
   *
   * Implementation of {@link CryptoStore.deleteEndToEndSessionsBatch}.
   *
   * @internal
   */
  deleteEndToEndSessionsBatch(sessions) {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      yield _this5.doTxn("readwrite", [IndexedDBCryptoStore.STORE_SESSIONS], /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(function* (txn) {
          try {
            var objectStore = txn.objectStore(IndexedDBCryptoStore.STORE_SESSIONS);
            var _loop = function* _loop() {
              var req = objectStore.delete([deviceKey, sessionId]);
              yield new Promise(resolve => {
                req.onsuccess = resolve;
              });
            };
            for (var {
              deviceKey,
              sessionId
            } of sessions) {
              yield* _loop();
            }
          } catch (e) {
            abortWithException(txn, e);
          }
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    })();
  }

  // Inbound group sessions

  getEndToEndInboundGroupSession(senderCurve25519Key, sessionId, txn, func) {
    var session = false;
    var withheld = false;
    var objectStore = txn.objectStore("inbound_group_sessions");
    var getReq = objectStore.get([senderCurve25519Key, sessionId]);
    getReq.onsuccess = function () {
      try {
        if (getReq.result) {
          session = getReq.result.session;
        } else {
          session = null;
        }
        if (withheld !== false) {
          func(session, withheld);
        }
      } catch (e) {
        abortWithException(txn, e);
      }
    };
    var withheldObjectStore = txn.objectStore("inbound_group_sessions_withheld");
    var withheldGetReq = withheldObjectStore.get([senderCurve25519Key, sessionId]);
    withheldGetReq.onsuccess = function () {
      try {
        if (withheldGetReq.result) {
          withheld = withheldGetReq.result.session;
        } else {
          withheld = null;
        }
        if (session !== false) {
          func(session, withheld);
        }
      } catch (e) {
        abortWithException(txn, e);
      }
    };
  }
  storeEndToEndInboundGroupSession(senderCurve25519Key, sessionId, sessionData, txn) {
    var objectStore = txn.objectStore("inbound_group_sessions");
    objectStore.put({
      senderCurve25519Key,
      sessionId,
      session: sessionData
    });
  }

  /**
   * Count the number of Megolm sessions in the database.
   *
   * Implementation of {@link CryptoStore.countEndToEndInboundGroupSessions}.
   *
   * @internal
   */
  countEndToEndInboundGroupSessions() {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      var result = 0;
      yield _this6.doTxn("readonly", [IndexedDBCryptoStore.STORE_INBOUND_GROUP_SESSIONS], txn => {
        var sessionStore = txn.objectStore(IndexedDBCryptoStore.STORE_INBOUND_GROUP_SESSIONS);
        var countReq = sessionStore.count();
        countReq.onsuccess = () => {
          result = countReq.result;
        };
      });
      return result;
    })();
  }

  /**
   * Fetch a batch of Megolm sessions from the database.
   *
   * Implementation of {@link CryptoStore.getEndToEndInboundGroupSessionsBatch}.
   */
  getEndToEndInboundGroupSessionsBatch() {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      var result = [];
      yield _this7.doTxn("readonly", [IndexedDBCryptoStore.STORE_INBOUND_GROUP_SESSIONS, IndexedDBCryptoStore.STORE_BACKUP], txn => {
        var sessionStore = txn.objectStore(IndexedDBCryptoStore.STORE_INBOUND_GROUP_SESSIONS);
        var backupStore = txn.objectStore(IndexedDBCryptoStore.STORE_BACKUP);
        var getReq = sessionStore.openCursor();
        getReq.onsuccess = function () {
          try {
            var cursor = getReq.result;
            if (cursor) {
              var backupGetReq = backupStore.get(cursor.key);
              backupGetReq.onsuccess = () => {
                result.push({
                  senderKey: cursor.value.senderCurve25519Key,
                  sessionId: cursor.value.sessionId,
                  sessionData: cursor.value.session,
                  needsBackup: backupGetReq.result !== undefined
                });
                if (result.length < SESSION_BATCH_SIZE) {
                  cursor.continue();
                }
              };
            }
          } catch (e) {
            abortWithException(txn, e);
          }
        };
      });
      if (result.length === 0) {
        // No sessions left.
        return null;
      }
      return result;
    })();
  }

  /**
   * Delete a batch of Megolm sessions from the database.
   *
   * Implementation of {@link CryptoStore.deleteEndToEndInboundGroupSessionsBatch}.
   *
   * @internal
   */
  deleteEndToEndInboundGroupSessionsBatch(sessions) {
    var _this8 = this;
    return _asyncToGenerator(function* () {
      yield _this8.doTxn("readwrite", [IndexedDBCryptoStore.STORE_INBOUND_GROUP_SESSIONS], /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(function* (txn) {
          try {
            var objectStore = txn.objectStore(IndexedDBCryptoStore.STORE_INBOUND_GROUP_SESSIONS);
            var _loop2 = function* _loop2() {
              var req = objectStore.delete([senderKey, sessionId]);
              yield new Promise(resolve => {
                req.onsuccess = resolve;
              });
            };
            for (var {
              senderKey,
              sessionId
            } of sessions) {
              yield* _loop2();
            }
          } catch (e) {
            abortWithException(txn, e);
          }
        });
        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      }());
    })();
  }
  getEndToEndDeviceData(txn, func) {
    var objectStore = txn.objectStore("device_data");
    var getReq = objectStore.get("-");
    getReq.onsuccess = function () {
      try {
        func(getReq.result || null);
      } catch (e) {
        abortWithException(txn, e);
      }
    };
  }
  getEndToEndRooms(txn, func) {
    var rooms = {};
    var objectStore = txn.objectStore("rooms");
    var getReq = objectStore.openCursor();
    getReq.onsuccess = function () {
      var cursor = getReq.result;
      if (cursor) {
        rooms[cursor.key] = cursor.value;
        cursor.continue();
      } else {
        try {
          func(rooms);
        } catch (e) {
          abortWithException(txn, e);
        }
      }
    };
  }
  markSessionsNeedingBackup(sessions, txn) {
    var _this9 = this;
    return _asyncToGenerator(function* () {
      if (!txn) {
        txn = _this9.db.transaction("sessions_needing_backup", "readwrite");
      }
      var objectStore = txn.objectStore("sessions_needing_backup");
      yield Promise.all(sessions.map(session => {
        return new Promise((resolve, reject) => {
          var req = objectStore.put({
            senderCurve25519Key: session.senderKey,
            sessionId: session.sessionId
          });
          req.onsuccess = resolve;
          req.onerror = reject;
        });
      }));
    })();
  }
  doTxn(mode, stores, func) {
    var log = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : logger;
    var startTime;
    var description;
    if (PROFILE_TRANSACTIONS) {
      var txnId = this.nextTxnId++;
      startTime = Date.now();
      description = "".concat(mode, " crypto store transaction ").concat(txnId, " in ").concat(stores);
      log.debug("Starting ".concat(description));
    }
    var txn = this.db.transaction(stores, mode);
    var promise = promiseifyTxn(txn);
    var result = func(txn);
    if (PROFILE_TRANSACTIONS) {
      promise.then(() => {
        var elapsedTime = Date.now() - startTime;
        log.debug("Finished ".concat(description, ", took ").concat(elapsedTime, " ms"));
      }, () => {
        var elapsedTime = Date.now() - startTime;
        log.error("Failed ".concat(description, ", took ").concat(elapsedTime, " ms"));
      });
    }
    return promise.then(() => {
      return result;
    });
  }
}
var DB_MIGRATIONS = [db => {
  createDatabase(db);
}, db => {
  db.createObjectStore("account");
}, db => {
  var sessionsStore = db.createObjectStore("sessions", {
    keyPath: ["deviceKey", "sessionId"]
  });
  sessionsStore.createIndex("deviceKey", "deviceKey");
}, db => {
  db.createObjectStore("inbound_group_sessions", {
    keyPath: ["senderCurve25519Key", "sessionId"]
  });
}, db => {
  db.createObjectStore("device_data");
}, db => {
  db.createObjectStore("rooms");
}, db => {
  db.createObjectStore("sessions_needing_backup", {
    keyPath: ["senderCurve25519Key", "sessionId"]
  });
}, db => {
  db.createObjectStore("inbound_group_sessions_withheld", {
    keyPath: ["senderCurve25519Key", "sessionId"]
  });
}, db => {
  var problemsStore = db.createObjectStore("session_problems", {
    keyPath: ["deviceKey", "time"]
  });
  problemsStore.createIndex("deviceKey", "deviceKey");
  db.createObjectStore("notified_error_devices", {
    keyPath: ["userId", "deviceId"]
  });
}, db => {
  db.createObjectStore("shared_history_inbound_group_sessions", {
    keyPath: ["roomId"]
  });
}, db => {
  db.createObjectStore("parked_shared_history", {
    keyPath: ["roomId"]
  });
}
// Expand as needed.
];
export var VERSION = DB_MIGRATIONS.length;
export function upgradeDatabase(db, oldVersion) {
  logger.log("Upgrading IndexedDBCryptoStore from version ".concat(oldVersion) + " to ".concat(VERSION));
  DB_MIGRATIONS.forEach((migration, index) => {
    if (oldVersion <= index) migration(db);
  });
}
function createDatabase(db) {
  var outgoingRoomKeyRequestsStore = db.createObjectStore("outgoingRoomKeyRequests", {
    keyPath: "requestId"
  });

  // we assume that the RoomKeyRequestBody will have room_id and session_id
  // properties, to make the index efficient.
  outgoingRoomKeyRequestsStore.createIndex("session", ["requestBody.room_id", "requestBody.session_id"]);
  outgoingRoomKeyRequestsStore.createIndex("state", "state");
}
/*
 * Aborts a transaction with a given exception
 * The transaction promise will be rejected with this exception.
 */
function abortWithException(txn, e) {
  // We cheekily stick our exception onto the transaction object here
  // We could alternatively make the thing we pass back to the app
  // an object containing the transaction and exception.
  txn._mx_abortexception = e;
  try {
    txn.abort();
  } catch (_unused) {
    // sometimes we won't be able to abort the transaction
    // (ie. if it's aborted or completed)
  }
}
function promiseifyTxn(txn) {
  return new Promise((resolve, reject) => {
    txn.oncomplete = () => {
      if (txn._mx_abortexception !== undefined) {
        reject(txn._mx_abortexception);
      }
      resolve(null);
    };
    txn.onerror = event => {
      if (txn._mx_abortexception !== undefined) {
        reject(txn._mx_abortexception);
      } else {
        logger.log("Error performing indexeddb txn", event);
        reject(txn.error);
      }
    };
    txn.onabort = event => {
      if (txn._mx_abortexception !== undefined) {
        reject(txn._mx_abortexception);
      } else {
        logger.log("Error performing indexeddb txn", event);
        reject(txn.error);
      }
    };
  });
}
//# sourceMappingURL=indexeddb-crypto-store-backend.js.map