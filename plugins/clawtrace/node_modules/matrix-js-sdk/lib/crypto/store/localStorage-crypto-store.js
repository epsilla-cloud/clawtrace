import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
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
import { MemoryCryptoStore } from "./memory-crypto-store.js";
import { MigrationState, SESSION_BATCH_SIZE } from "./base.js";
/**
 * Internal module. Partial localStorage backed storage for e2e.
 * This is not a full crypto store, just the in-memory store with
 * some things backed by localStorage. It exists because indexedDB
 * is broken in Firefox private mode or set to, "will not remember
 * history".
 */

var E2E_PREFIX = "crypto.";
var KEY_END_TO_END_MIGRATION_STATE = E2E_PREFIX + "migration";
var KEY_END_TO_END_ACCOUNT = E2E_PREFIX + "account";
var KEY_CROSS_SIGNING_KEYS = E2E_PREFIX + "cross_signing_keys";
var KEY_INBOUND_SESSION_PREFIX = E2E_PREFIX + "inboundgroupsessions/";
var KEY_INBOUND_SESSION_WITHHELD_PREFIX = E2E_PREFIX + "inboundgroupsessions.withheld/";
var KEY_ROOMS_PREFIX = E2E_PREFIX + "rooms/";
var KEY_SESSIONS_NEEDING_BACKUP = E2E_PREFIX + "sessionsneedingbackup";
function keyEndToEndSessions(deviceKey) {
  return E2E_PREFIX + "sessions/" + deviceKey;
}
function keyEndToEndInboundGroupSession(senderKey, sessionId) {
  return KEY_INBOUND_SESSION_PREFIX + senderKey + "/" + sessionId;
}
function keyEndToEndInboundGroupSessionWithheld(senderKey, sessionId) {
  return KEY_INBOUND_SESSION_WITHHELD_PREFIX + senderKey + "/" + sessionId;
}
function keyEndToEndRoomsPrefix(roomId) {
  return KEY_ROOMS_PREFIX + roomId;
}
export class LocalStorageCryptoStore extends MemoryCryptoStore {
  static exists(store) {
    var length = store.length;
    for (var i = 0; i < length; i++) {
      var _store$key;
      if ((_store$key = store.key(i)) !== null && _store$key !== void 0 && _store$key.startsWith(E2E_PREFIX)) {
        return true;
      }
    }
    return false;
  }
  constructor(store) {
    super();
    this.store = store;
  }

  /**
   * Returns true if this CryptoStore has ever been initialised (ie, it might contain data).
   *
   * Implementation of {@link CryptoStore.containsData}.
   *
   * @internal
   */
  containsData() {
    var _this = this;
    return _asyncToGenerator(function* () {
      return LocalStorageCryptoStore.exists(_this.store);
    })();
  }

  /**
   * Get data on how much of the libolm to Rust Crypto migration has been done.
   *
   * Implementation of {@link CryptoStore.getMigrationState}.
   *
   * @internal
   */
  getMigrationState() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      var _getJsonItem;
      return (_getJsonItem = getJsonItem(_this2.store, KEY_END_TO_END_MIGRATION_STATE)) !== null && _getJsonItem !== void 0 ? _getJsonItem : MigrationState.NOT_STARTED;
    })();
  }

  /**
   * Set data on how much of the libolm to Rust Crypto migration has been done.
   *
   * Implementation of {@link CryptoStore.setMigrationState}.
   *
   * @internal
   */
  setMigrationState(migrationState) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      setJsonItem(_this3.store, KEY_END_TO_END_MIGRATION_STATE, migrationState);
    })();
  }

  // Olm Sessions

  countEndToEndSessions(txn, func) {
    var count = 0;
    for (var i = 0; i < this.store.length; ++i) {
      var key = this.store.key(i);
      if (key !== null && key !== void 0 && key.startsWith(keyEndToEndSessions(""))) {
        var sessions = getJsonItem(this.store, key);
        count += Object.keys(sessions !== null && sessions !== void 0 ? sessions : {}).length;
      }
    }
    func(count);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  _getEndToEndSessions(deviceKey) {
    var sessions = getJsonItem(this.store, keyEndToEndSessions(deviceKey));
    var fixedSessions = {};

    // fix up any old sessions to be objects rather than just the base64 pickle
    for (var [sid, val] of Object.entries(sessions || {})) {
      if (typeof val === "string") {
        fixedSessions[sid] = {
          session: val
        };
      } else {
        fixedSessions[sid] = val;
      }
    }
    return fixedSessions;
  }
  getEndToEndSession(deviceKey, sessionId, txn, func) {
    var _sessions$sessionId;
    var sessions = this._getEndToEndSessions(deviceKey);
    func((_sessions$sessionId = sessions[sessionId]) !== null && _sessions$sessionId !== void 0 ? _sessions$sessionId : {});
  }
  getEndToEndSessions(deviceKey, txn, func) {
    var _this$_getEndToEndSes;
    func((_this$_getEndToEndSes = this._getEndToEndSessions(deviceKey)) !== null && _this$_getEndToEndSes !== void 0 ? _this$_getEndToEndSes : {});
  }
  storeEndToEndSession(deviceKey, sessionId, sessionInfo, txn) {
    var sessions = this._getEndToEndSessions(deviceKey) || {};
    sessions[sessionId] = sessionInfo;
    setJsonItem(this.store, keyEndToEndSessions(deviceKey), sessions);
  }

  /**
   * Fetch a batch of Olm sessions from the database.
   *
   * Implementation of {@link CryptoStore.getEndToEndSessionsBatch}.
   *
   * @internal
   */
  getEndToEndSessionsBatch() {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      var result = [];
      for (var i = 0; i < _this4.store.length; ++i) {
        var _this4$store$key;
        if ((_this4$store$key = _this4.store.key(i)) !== null && _this4$store$key !== void 0 && _this4$store$key.startsWith(keyEndToEndSessions(""))) {
          var deviceKey = _this4.store.key(i).split("/")[1];
          for (var session of Object.values(_this4._getEndToEndSessions(deviceKey))) {
            result.push(session);
            if (result.length >= SESSION_BATCH_SIZE) {
              return result;
            }
          }
        }
      }
      if (result.length === 0) {
        // No sessions left.
        return null;
      }

      // There are fewer sessions than the batch size; return the final batch of sessions.
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
      for (var {
        deviceKey,
        sessionId
      } of sessions) {
        var deviceSessions = _this5._getEndToEndSessions(deviceKey) || {};
        delete deviceSessions[sessionId];
        if (Object.keys(deviceSessions).length === 0) {
          // No more sessions for this device.
          _this5.store.removeItem(keyEndToEndSessions(deviceKey));
        } else {
          setJsonItem(_this5.store, keyEndToEndSessions(deviceKey), deviceSessions);
        }
      }
    })();
  }

  // Inbound Group Sessions

  getEndToEndInboundGroupSession(senderCurve25519Key, sessionId, txn, func) {
    func(getJsonItem(this.store, keyEndToEndInboundGroupSession(senderCurve25519Key, sessionId)), getJsonItem(this.store, keyEndToEndInboundGroupSessionWithheld(senderCurve25519Key, sessionId)));
  }
  storeEndToEndInboundGroupSession(senderCurve25519Key, sessionId, sessionData, txn) {
    setJsonItem(this.store, keyEndToEndInboundGroupSession(senderCurve25519Key, sessionId), sessionData);
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
      var count = 0;
      for (var i = 0; i < _this6.store.length; ++i) {
        var key = _this6.store.key(i);
        if (key !== null && key !== void 0 && key.startsWith(KEY_INBOUND_SESSION_PREFIX)) {
          count += 1;
        }
      }
      return count;
    })();
  }

  /**
   * Fetch a batch of Megolm sessions from the database.
   *
   * Implementation of {@link CryptoStore.getEndToEndInboundGroupSessionsBatch}.
   *
   * @internal
   */
  getEndToEndInboundGroupSessionsBatch() {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      var sessionsNeedingBackup = getJsonItem(_this7.store, KEY_SESSIONS_NEEDING_BACKUP) || {};
      var result = [];
      for (var i = 0; i < _this7.store.length; ++i) {
        var key = _this7.store.key(i);
        if (key !== null && key !== void 0 && key.startsWith(KEY_INBOUND_SESSION_PREFIX)) {
          var key2 = key.slice(KEY_INBOUND_SESSION_PREFIX.length);

          // we can't use split, as the components we are trying to split out
          // might themselves contain '/' characters. We rely on the
          // senderKey being a (32-byte) curve25519 key, base64-encoded
          // (hence 43 characters long).

          result.push({
            senderKey: key2.slice(0, 43),
            sessionId: key2.slice(44),
            sessionData: getJsonItem(_this7.store, key),
            needsBackup: key2 in sessionsNeedingBackup
          });
          if (result.length >= SESSION_BATCH_SIZE) {
            return result;
          }
        }
      }
      if (result.length === 0) {
        // No sessions left.
        return null;
      }

      // There are fewer sessions than the batch size; return the final batch of sessions.
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
      for (var {
        senderKey,
        sessionId
      } of sessions) {
        var k = keyEndToEndInboundGroupSession(senderKey, sessionId);
        _this8.store.removeItem(k);
      }
    })();
  }
  getEndToEndRooms(txn, func) {
    var result = {};
    var prefix = keyEndToEndRoomsPrefix("");
    for (var i = 0; i < this.store.length; ++i) {
      var key = this.store.key(i);
      if (key !== null && key !== void 0 && key.startsWith(prefix)) {
        var roomId = key.slice(prefix.length);
        result[roomId] = getJsonItem(this.store, key);
      }
    }
    func(result);
  }
  markSessionsNeedingBackup(sessions) {
    var sessionsNeedingBackup = getJsonItem(this.store, KEY_SESSIONS_NEEDING_BACKUP) || {};
    for (var session of sessions) {
      sessionsNeedingBackup[session.senderKey + "/" + session.sessionId] = true;
    }
    setJsonItem(this.store, KEY_SESSIONS_NEEDING_BACKUP, sessionsNeedingBackup);
    return Promise.resolve();
  }

  /**
   * Delete all data from this store.
   *
   * @returns Promise which resolves when the store has been cleared.
   */
  deleteAllData() {
    this.store.removeItem(KEY_END_TO_END_ACCOUNT);
    return Promise.resolve();
  }

  // Olm account

  getAccount(txn, func) {
    var accountPickle = getJsonItem(this.store, KEY_END_TO_END_ACCOUNT);
    func(accountPickle);
  }
  storeAccount(txn, accountPickle) {
    setJsonItem(this.store, KEY_END_TO_END_ACCOUNT, accountPickle);
  }
  getCrossSigningKeys(txn, func) {
    var keys = getJsonItem(this.store, KEY_CROSS_SIGNING_KEYS);
    func(keys);
  }
  getSecretStorePrivateKey(txn, func, type) {
    var key = getJsonItem(this.store, E2E_PREFIX + "ssss_cache.".concat(type));
    func(key);
  }
  storeSecretStorePrivateKey(txn, type, key) {
    setJsonItem(this.store, E2E_PREFIX + "ssss_cache.".concat(type), key);
  }
  doTxn(mode, stores, func) {
    return Promise.resolve(func(null));
  }
}
function getJsonItem(store, key) {
  try {
    // if the key is absent, store.getItem() returns null, and
    // JSON.parse(null) === null, so this returns null.
    return JSON.parse(store.getItem(key));
  } catch (e) {
    logger.log("Error: Failed to get key %s: %s", key, e.message);
    logger.log(e.stack);
  }
  return null;
}
function setJsonItem(store, key, val) {
  store.setItem(key, JSON.stringify(val));
}
//# sourceMappingURL=localStorage-crypto-store.js.map