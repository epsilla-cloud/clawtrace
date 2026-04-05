import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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

import { safeSet } from "../../utils.js";
import { MigrationState, SESSION_BATCH_SIZE } from "./base.js";
function encodeSessionKey(senderCurve25519Key, sessionId) {
  return encodeURIComponent(senderCurve25519Key) + "/" + encodeURIComponent(sessionId);
}
function decodeSessionKey(key) {
  var keyParts = key.split("/");
  var senderKey = decodeURIComponent(keyParts[0]);
  var sessionId = decodeURIComponent(keyParts[1]);
  return {
    senderKey,
    sessionId
  };
}

/**
 * Internal module. in-memory storage for e2e.
 */

export class MemoryCryptoStore {
  constructor() {
    _defineProperty(this, "migrationState", MigrationState.NOT_STARTED);
    _defineProperty(this, "account", null);
    _defineProperty(this, "crossSigningKeys", null);
    _defineProperty(this, "privateKeys", {});
    _defineProperty(this, "sessions", {});
    _defineProperty(this, "inboundGroupSessions", {});
    _defineProperty(this, "inboundGroupSessionsWithheld", {});
    // Opaque device data object
    _defineProperty(this, "rooms", {});
    _defineProperty(this, "sessionsNeedingBackup", {});
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
      // If it contains anything, it should contain an account.
      return _this.account !== null;
    })();
  }

  /**
   * Ensure the database exists and is up-to-date.
   *
   * This must be called before the store can be used.
   *
   * @returns resolves to the store.
   */
  startup() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      // No startup work to do for the memory store.
      return _this2;
    })();
  }

  /**
   * Delete all data from this store.
   *
   * @returns Promise which resolves when the store has been cleared.
   */
  deleteAllData() {
    return Promise.resolve();
  }

  /**
   * Get data on how much of the libolm to Rust Crypto migration has been done.
   *
   * Implementation of {@link CryptoStore.getMigrationState}.
   *
   * @internal
   */
  getMigrationState() {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      return _this3.migrationState;
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
    var _this4 = this;
    return _asyncToGenerator(function* () {
      _this4.migrationState = migrationState;
    })();
  }

  // Olm Account

  getAccount(txn, func) {
    func(this.account);
  }
  storeAccount(txn, accountPickle) {
    this.account = accountPickle;
  }
  getCrossSigningKeys(txn, func) {
    func(this.crossSigningKeys);
  }
  getSecretStorePrivateKey(txn, func, type) {
    var result = this.privateKeys[type];
    func(result || null);
  }
  storeSecretStorePrivateKey(txn, type, key) {
    this.privateKeys[type] = key;
  }

  // Olm Sessions

  countEndToEndSessions(txn, func) {
    var count = 0;
    for (var deviceSessions of Object.values(this.sessions)) {
      count += Object.keys(deviceSessions).length;
    }
    func(count);
  }
  getEndToEndSession(deviceKey, sessionId, txn, func) {
    var deviceSessions = this.sessions[deviceKey] || {};
    func(deviceSessions[sessionId] || null);
  }
  getEndToEndSessions(deviceKey, txn, func) {
    func(this.sessions[deviceKey] || {});
  }
  storeEndToEndSession(deviceKey, sessionId, sessionInfo, txn) {
    var deviceSessions = this.sessions[deviceKey];
    if (deviceSessions === undefined) {
      deviceSessions = {};
      this.sessions[deviceKey] = deviceSessions;
    }
    safeSet(deviceSessions, sessionId, sessionInfo);
  }

  /**
   * Fetch a batch of Olm sessions from the database.
   *
   * Implementation of {@link CryptoStore.getEndToEndSessionsBatch}.
   *
   * @internal
   */
  getEndToEndSessionsBatch() {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      var result = [];
      for (var deviceSessions of Object.values(_this5.sessions)) {
        for (var session of Object.values(deviceSessions)) {
          result.push(session);
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
   * Delete a batch of Olm sessions from the database.
   *
   * Implementation of {@link CryptoStore.deleteEndToEndSessionsBatch}.
   *
   * @internal
   */
  deleteEndToEndSessionsBatch(sessions) {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      for (var {
        deviceKey,
        sessionId
      } of sessions) {
        var deviceSessions = _this6.sessions[deviceKey] || {};
        delete deviceSessions[sessionId];
        if (Object.keys(deviceSessions).length === 0) {
          // No more sessions for this device.
          delete _this6.sessions[deviceKey];
        }
      }
    })();
  }

  // Inbound Group Sessions

  getEndToEndInboundGroupSession(senderCurve25519Key, sessionId, txn, func) {
    var k = encodeSessionKey(senderCurve25519Key, sessionId);
    func(this.inboundGroupSessions[k] || null, this.inboundGroupSessionsWithheld[k] || null);
  }
  storeEndToEndInboundGroupSession(senderCurve25519Key, sessionId, sessionData, txn) {
    var k = encodeSessionKey(senderCurve25519Key, sessionId);
    this.inboundGroupSessions[k] = sessionData;
  }

  /**
   * Count the number of Megolm sessions in the database.
   *
   * Implementation of {@link CryptoStore.countEndToEndInboundGroupSessions}.
   *
   * @internal
   */
  countEndToEndInboundGroupSessions() {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      return Object.keys(_this7.inboundGroupSessions).length;
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
    var _this8 = this;
    return _asyncToGenerator(function* () {
      var result = [];
      for (var [key, session] of Object.entries(_this8.inboundGroupSessions)) {
        result.push(_objectSpread(_objectSpread({}, decodeSessionKey(key)), {}, {
          sessionData: session,
          needsBackup: key in _this8.sessionsNeedingBackup
        }));
        if (result.length >= SESSION_BATCH_SIZE) {
          return result;
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
    var _this9 = this;
    return _asyncToGenerator(function* () {
      for (var {
        senderKey,
        sessionId
      } of sessions) {
        var k = encodeSessionKey(senderKey, sessionId);
        delete _this9.inboundGroupSessions[k];
      }
    })();
  }

  // E2E rooms

  getEndToEndRooms(txn, func) {
    func(this.rooms);
  }
  markSessionsNeedingBackup(sessions) {
    for (var session of sessions) {
      var sessionKey = encodeSessionKey(session.senderKey, session.sessionId);
      this.sessionsNeedingBackup[sessionKey] = true;
    }
    return Promise.resolve();
  }

  // Session key backups

  doTxn(mode, stores, func) {
    return Promise.resolve(func(null));
  }
}
//# sourceMappingURL=memory-crypto-store.js.map