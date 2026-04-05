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
import { LocalStorageCryptoStore } from "./localStorage-crypto-store.js";
import { MemoryCryptoStore } from "./memory-crypto-store.js";
import * as IndexedDBCryptoStoreBackend from "./indexeddb-crypto-store-backend.js";
import { InvalidCryptoStoreError, InvalidCryptoStoreState } from "../../errors.js";
import * as IndexedDBHelpers from "../../indexeddb-helpers.js";
import { MigrationState, ACCOUNT_OBJECT_KEY_MIGRATION_STATE } from "./base.js";
/*
 * Internal module. indexeddb storage for e2e.
 */

/**
 * An implementation of CryptoStore, which is normally backed by an indexeddb,
 * but with fallback to MemoryCryptoStore.
 */
export class IndexedDBCryptoStore {
  static exists(indexedDB, dbName) {
    return IndexedDBHelpers.exists(indexedDB, dbName);
  }

  /**
   * Utility to check if a legacy crypto store exists and has not been migrated.
   * Returns true if the store exists and has not been migrated, false otherwise.
   */
  static existsAndIsNotMigrated(indexedDb, dbName) {
    return new Promise((resolve, reject) => {
      var exists = true;
      var openDBRequest = indexedDb.open(dbName);
      openDBRequest.onupgradeneeded = () => {
        // Since we did not provide an explicit version when opening, this event
        // should only fire if the DB did not exist before at any version.
        exists = false;
      };
      openDBRequest.onblocked = () => reject(openDBRequest.error);
      openDBRequest.onsuccess = () => {
        var db = openDBRequest.result;
        if (!exists) {
          db.close();
          // The DB did not exist before, but has been created as part of this
          // existence check. Delete it now to restore previous state. Delete can
          // actually take a while to complete in some browsers, so don't wait for
          // it. This won't block future open calls that a store might issue next to
          // properly set up the DB.
          indexedDb.deleteDatabase(dbName);
          resolve(false);
        } else {
          var tx = db.transaction([IndexedDBCryptoStore.STORE_ACCOUNT], "readonly");
          var objectStore = tx.objectStore(IndexedDBCryptoStore.STORE_ACCOUNT);
          var getReq = objectStore.get(ACCOUNT_OBJECT_KEY_MIGRATION_STATE);
          getReq.onsuccess = () => {
            var _getReq$result;
            var migrationState = (_getReq$result = getReq.result) !== null && _getReq$result !== void 0 ? _getReq$result : MigrationState.NOT_STARTED;
            resolve(migrationState === MigrationState.NOT_STARTED);
          };
          getReq.onerror = () => {
            reject(getReq.error);
          };
          db.close();
        }
      };
      openDBRequest.onerror = () => reject(openDBRequest.error);
    });
  }
  /**
   * Create a new IndexedDBCryptoStore
   *
   * @param indexedDB -  global indexedDB instance
   * @param dbName -   name of db to connect to
   */
  constructor(indexedDB, dbName) {
    this.indexedDB = indexedDB;
    this.dbName = dbName;
    _defineProperty(this, "backendPromise", void 0);
    _defineProperty(this, "backend", void 0);
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
      return IndexedDBCryptoStore.exists(_this.indexedDB, _this.dbName);
    })();
  }

  /**
   * Ensure the database exists and is up-to-date, or fall back to
   * a local storage or in-memory store.
   *
   * This must be called before the store can be used.
   *
   * @returns resolves to either an IndexedDBCryptoStoreBackend.Backend,
   * or a MemoryCryptoStore
   */
  startup() {
    if (this.backendPromise) {
      return this.backendPromise;
    }
    this.backendPromise = new Promise((resolve, reject) => {
      if (!this.indexedDB) {
        reject(new Error("no indexeddb support available"));
        return;
      }
      logger.log("connecting to indexeddb ".concat(this.dbName));
      var req = this.indexedDB.open(this.dbName, IndexedDBCryptoStoreBackend.VERSION);
      req.onupgradeneeded = ev => {
        var db = req.result;
        var oldVersion = ev.oldVersion;
        IndexedDBCryptoStoreBackend.upgradeDatabase(db, oldVersion);
      };
      req.onblocked = () => {
        logger.log("can't yet open IndexedDBCryptoStore because it is open elsewhere");
      };
      req.onerror = ev => {
        logger.log("Error connecting to indexeddb", ev);
        reject(req.error);
      };
      req.onsuccess = () => {
        var db = req.result;
        logger.log("connected to indexeddb ".concat(this.dbName));
        resolve(new IndexedDBCryptoStoreBackend.Backend(db));
      };
    }).then(backend => {
      // Edge has IndexedDB but doesn't support compund keys which we use fairly extensively.
      // Try a dummy query which will fail if the browser doesn't support compund keys, so
      // we can fall back to a different backend.
      return backend.doTxn("readonly", [IndexedDBCryptoStore.STORE_INBOUND_GROUP_SESSIONS, IndexedDBCryptoStore.STORE_INBOUND_GROUP_SESSIONS_WITHHELD], txn => {
        backend.getEndToEndInboundGroupSession("", "", txn, () => {});
      }).then(() => backend);
    }).catch(e => {
      if (e.name === "VersionError") {
        logger.warn("Crypto DB is too new for us to use!", e);
        // don't fall back to a different store: the user has crypto data
        // in this db so we should use it or nothing at all.
        throw new InvalidCryptoStoreError(InvalidCryptoStoreState.TooNew);
      }
      logger.warn("unable to connect to indexeddb ".concat(this.dbName) + ": falling back to localStorage store: ".concat(e));
      try {
        if (!(globalThis.localStorage instanceof Storage)) {
          throw new Error("localStorage is not available");
        }
        return new LocalStorageCryptoStore(globalThis.localStorage);
      } catch (e) {
        logger.warn("Unable to open localStorage: falling back to in-memory store: ".concat(e));
        return new MemoryCryptoStore();
      }
    }).then(backend => {
      this.backend = backend;
      return backend;
    });
    return this.backendPromise;
  }

  /**
   * Delete all data from this store.
   *
   * @returns resolves when the store has been cleared.
   */
  deleteAllData() {
    return new Promise((resolve, reject) => {
      if (!this.indexedDB) {
        reject(new Error("no indexeddb support available"));
        return;
      }
      logger.log("Removing indexeddb instance: ".concat(this.dbName));
      var req = this.indexedDB.deleteDatabase(this.dbName);
      req.onblocked = () => {
        logger.log("can't yet delete IndexedDBCryptoStore because it is open elsewhere");
      };
      req.onerror = ev => {
        logger.log("Error deleting data from indexeddb", ev);
        reject(req.error);
      };
      req.onsuccess = () => {
        logger.log("Removed indexeddb instance: ".concat(this.dbName));
        resolve();
      };
    }).catch(e => {
      // in firefox, with indexedDB disabled, this fails with a
      // DOMError. We treat this as non-fatal, so that people can
      // still use the app.
      logger.warn("unable to delete IndexedDBCryptoStore: ".concat(e));
    });
  }

  /**
   * Get data on how much of the libolm to Rust Crypto migration has been done.
   *
   * Implementation of {@link CryptoStore.getMigrationState}.
   *
   * @internal
   */
  getMigrationState() {
    return this.backend.getMigrationState();
  }

  /**
   * Set data on how much of the libolm to Rust Crypto migration has been done.
   *
   * Implementation of {@link CryptoStore.setMigrationState}.
   *
   * @internal
   */
  setMigrationState(migrationState) {
    return this.backend.setMigrationState(migrationState);
  }

  // Olm Account

  /*
   * Get the account pickle from the store.
   * This requires an active transaction. See doTxn().
   *
   * @param txn - An active transaction. See doTxn().
   * @param func - Called with the account pickle
   */
  getAccount(txn, func) {
    this.backend.getAccount(txn, func);
  }

  /**
   * Write the account pickle to the store.
   * This requires an active transaction. See doTxn().
   *
   * @param txn - An active transaction. See doTxn().
   * @param accountPickle - The new account pickle to store.
   */
  storeAccount(txn, accountPickle) {
    this.backend.storeAccount(txn, accountPickle);
  }

  /**
   * Get the public part of the cross-signing keys (eg. self-signing key,
   * user signing key).
   *
   * @param txn - An active transaction. See doTxn().
   * @param func - Called with the account keys object:
   *        `{ key_type: base64 encoded seed }` where key type = user_signing_key_seed or self_signing_key_seed
   */
  getCrossSigningKeys(txn, func) {
    this.backend.getCrossSigningKeys(txn, func);
  }

  /**
   * @param txn - An active transaction. See doTxn().
   * @param func - Called with the private key
   * @param type - A key type
   */
  getSecretStorePrivateKey(txn, func, type) {
    this.backend.getSecretStorePrivateKey(txn, func, type);
  }

  /**
   * Write the cross-signing private keys back to the store
   *
   * @param txn - An active transaction. See doTxn().
   * @param type - The type of cross-signing private key to store
   * @param key - keys object as getCrossSigningKeys()
   */
  storeSecretStorePrivateKey(txn, type, key) {
    this.backend.storeSecretStorePrivateKey(txn, type, key);
  }

  // Olm sessions

  /**
   * Returns the number of end-to-end sessions in the store
   * @param txn - An active transaction. See doTxn().
   * @param func - Called with the count of sessions
   */
  countEndToEndSessions(txn, func) {
    this.backend.countEndToEndSessions(txn, func);
  }

  /**
   * Retrieve a specific end-to-end session between the logged-in user
   * and another device.
   * @param deviceKey - The public key of the other device.
   * @param sessionId - The ID of the session to retrieve
   * @param txn - An active transaction. See doTxn().
   * @param func - Called with A map from sessionId
   *     to session information object with 'session' key being the
   *     Base64 end-to-end session and lastReceivedMessageTs being the
   *     timestamp in milliseconds at which the session last received
   *     a message.
   */
  getEndToEndSession(deviceKey, sessionId, txn, func) {
    this.backend.getEndToEndSession(deviceKey, sessionId, txn, func);
  }

  /**
   * Retrieve the end-to-end sessions between the logged-in user and another
   * device.
   * @param deviceKey - The public key of the other device.
   * @param txn - An active transaction. See doTxn().
   * @param func - Called with A map from sessionId
   *     to session information object with 'session' key being the
   *     Base64 end-to-end session and lastReceivedMessageTs being the
   *     timestamp in milliseconds at which the session last received
   *     a message.
   */
  getEndToEndSessions(deviceKey, txn, func) {
    this.backend.getEndToEndSessions(deviceKey, txn, func);
  }

  /**
   * Store a session between the logged-in user and another device
   * @param deviceKey - The public key of the other device.
   * @param sessionId - The ID for this end-to-end session.
   * @param sessionInfo - Session information object
   * @param txn - An active transaction. See doTxn().
   */
  storeEndToEndSession(deviceKey, sessionId, sessionInfo, txn) {
    this.backend.storeEndToEndSession(deviceKey, sessionId, sessionInfo, txn);
  }

  /**
   * Count the number of Megolm sessions in the database.
   *
   * Implementation of {@link CryptoStore.countEndToEndInboundGroupSessions}.
   *
   * @internal
   */
  countEndToEndInboundGroupSessions() {
    return this.backend.countEndToEndInboundGroupSessions();
  }

  /**
   * Fetch a batch of Olm sessions from the database.
   *
   * Implementation of {@link CryptoStore.getEndToEndSessionsBatch}.
   *
   * @internal
   */
  getEndToEndSessionsBatch() {
    return this.backend.getEndToEndSessionsBatch();
  }

  /**
   * Delete a batch of Olm sessions from the database.
   *
   * Implementation of {@link CryptoStore.deleteEndToEndSessionsBatch}.
   *
   * @internal
   */
  deleteEndToEndSessionsBatch(sessions) {
    return this.backend.deleteEndToEndSessionsBatch(sessions);
  }

  // Inbound group sessions

  /**
   * Retrieve the end-to-end inbound group session for a given
   * server key and session ID
   * @param senderCurve25519Key - The sender's curve 25519 key
   * @param sessionId - The ID of the session
   * @param txn - An active transaction. See doTxn().
   * @param func - Called with A map from sessionId
   *     to Base64 end-to-end session.
   */
  getEndToEndInboundGroupSession(senderCurve25519Key, sessionId, txn, func) {
    this.backend.getEndToEndInboundGroupSession(senderCurve25519Key, sessionId, txn, func);
  }

  /**
   * Writes an end-to-end inbound group session to the store.
   * If there already exists an inbound group session with the same
   * senderCurve25519Key and sessionID, it will be overwritten.
   * @param senderCurve25519Key - The sender's curve 25519 key
   * @param sessionId - The ID of the session
   * @param sessionData - The session data structure
   * @param txn - An active transaction. See doTxn().
   */
  storeEndToEndInboundGroupSession(senderCurve25519Key, sessionId, sessionData, txn) {
    this.backend.storeEndToEndInboundGroupSession(senderCurve25519Key, sessionId, sessionData, txn);
  }

  /**
   * Fetch a batch of Megolm sessions from the database.
   *
   * Implementation of {@link CryptoStore.getEndToEndInboundGroupSessionsBatch}.
   *
   * @internal
   */
  getEndToEndInboundGroupSessionsBatch() {
    return this.backend.getEndToEndInboundGroupSessionsBatch();
  }

  /**
   * Delete a batch of Megolm sessions from the database.
   *
   * Implementation of {@link CryptoStore.deleteEndToEndInboundGroupSessionsBatch}.
   *
   * @internal
   */
  deleteEndToEndInboundGroupSessionsBatch(sessions) {
    return this.backend.deleteEndToEndInboundGroupSessionsBatch(sessions);
  }

  /**
   * Get an object of `roomId->roomInfo` for all e2e rooms in the store
   * @param txn - An active transaction. See doTxn().
   * @param func - Function called with the end-to-end encrypted rooms
   */
  getEndToEndRooms(txn, func) {
    this.backend.getEndToEndRooms(txn, func);
  }

  /**
   * Mark sessions as needing to be backed up.
   * @param sessions - The sessions that need to be backed up.
   * @param txn - An active transaction. See doTxn(). (optional)
   * @returns resolves when the sessions are marked
   */
  markSessionsNeedingBackup(sessions, txn) {
    return this.backend.markSessionsNeedingBackup(sessions, txn);
  }

  /**
   * Perform a transaction on the crypto store. Any store methods
   * that require a transaction (txn) object to be passed in may
   * only be called within a callback of either this function or
   * one of the store functions operating on the same transaction.
   *
   * @param mode - 'readwrite' if you need to call setter
   *     functions with this transaction. Otherwise, 'readonly'.
   * @param stores - List IndexedDBCryptoStore.STORE_*
   *     options representing all types of object that will be
   *     accessed or written to with this transaction.
   * @param func - Function called with the
   *     transaction object: an opaque object that should be passed
   *     to store functions.
   * @param log - A possibly customised log
   * @returns Promise that resolves with the result of the `func`
   *     when the transaction is complete. If the backend is
   *     async (ie. the indexeddb backend) any of the callback
   *     functions throwing an exception will cause this promise to
   *     reject with that exception. On synchronous backends, the
   *     exception will propagate to the caller of the getFoo method.
   */
  doTxn(mode, stores, func, log) {
    return this.backend.doTxn(mode, stores, func, log);
  }
}
_defineProperty(IndexedDBCryptoStore, "STORE_ACCOUNT", "account");
_defineProperty(IndexedDBCryptoStore, "STORE_SESSIONS", "sessions");
_defineProperty(IndexedDBCryptoStore, "STORE_INBOUND_GROUP_SESSIONS", "inbound_group_sessions");
_defineProperty(IndexedDBCryptoStore, "STORE_INBOUND_GROUP_SESSIONS_WITHHELD", "inbound_group_sessions_withheld");
_defineProperty(IndexedDBCryptoStore, "STORE_SHARED_HISTORY_INBOUND_GROUP_SESSIONS", "shared_history_inbound_group_sessions");
_defineProperty(IndexedDBCryptoStore, "STORE_PARKED_SHARED_HISTORY", "parked_shared_history");
_defineProperty(IndexedDBCryptoStore, "STORE_DEVICE_DATA", "device_data");
_defineProperty(IndexedDBCryptoStore, "STORE_ROOMS", "rooms");
_defineProperty(IndexedDBCryptoStore, "STORE_BACKUP", "sessions_needing_backup");
//# sourceMappingURL=indexeddb-crypto-store.js.map