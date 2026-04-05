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

import { SyncAccumulator } from "../sync-accumulator.js";
import { deepCopy, promiseTry } from "../utils.js";
import { exists as idbExists } from "../indexeddb-helpers.js";
import { logger } from "../logger.js";
var DB_MIGRATIONS = [db => {
  // Make user store, clobber based on user ID. (userId property of User objects)
  db.createObjectStore("users", {
    keyPath: ["userId"]
  });

  // Make account data store, clobber based on event type.
  // (event.type property of MatrixEvent objects)
  db.createObjectStore("accountData", {
    keyPath: ["type"]
  });

  // Make /sync store (sync tokens, room data, etc), always clobber (const key).
  db.createObjectStore("sync", {
    keyPath: ["clobber"]
  });
}, db => {
  var oobMembersStore = db.createObjectStore("oob_membership_events", {
    keyPath: ["room_id", "state_key"]
  });
  oobMembersStore.createIndex("room", "room_id");
}, db => {
  db.createObjectStore("client_options", {
    keyPath: ["clobber"]
  });
}, db => {
  db.createObjectStore("to_device_queue", {
    autoIncrement: true
  });
}
// Expand as needed.
];
var VERSION = DB_MIGRATIONS.length;

/**
 * Helper method to collect results from a Cursor and promiseify it.
 * @param store - The store to perform openCursor on.
 * @param keyRange - Optional key range to apply on the cursor.
 * @param resultMapper - A function which is repeatedly called with a
 * Cursor.
 * Return the data you want to keep.
 * @returns Promise which resolves to an array of whatever you returned from
 * resultMapper.
 */
function selectQuery(store, keyRange, resultMapper) {
  var query = store.openCursor(keyRange);
  return new Promise((resolve, reject) => {
    var results = [];
    query.onerror = () => {
      var _query$error;
      reject(new Error("Query failed: " + ((_query$error = query.error) === null || _query$error === void 0 ? void 0 : _query$error.name)));
    };
    // collect results
    query.onsuccess = () => {
      var cursor = query.result;
      if (!cursor) {
        resolve(results);
        return; // end of results
      }
      results.push(resultMapper(cursor));
      cursor.continue();
    };
  });
}
function txnAsPromise(txn) {
  return new Promise((resolve, reject) => {
    txn.oncomplete = function (event) {
      resolve(event);
    };
    txn.onerror = function () {
      reject(txn.error);
    };
  });
}
function reqAsEventPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = function (event) {
      resolve(event);
    };
    req.onerror = function () {
      reject(req.error);
    };
  });
}
function reqAsPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req);
    req.onerror = err => reject(err);
  });
}
function reqAsCursorPromise(req) {
  return reqAsEventPromise(req).then(event => req.result);
}
export class LocalIndexedDBStoreBackend {
  static exists(indexedDB, dbName) {
    dbName = "matrix-js-sdk:" + (dbName || "default");
    return idbExists(indexedDB, dbName);
  }
  /**
   * Does the actual reading from and writing to the indexeddb
   *
   * Construct a new Indexed Database store backend. This requires a call to
   * `connect()` before this store can be used.
   * @param indexedDB - The Indexed DB interface e.g
   * `window.indexedDB`
   * @param dbName - Optional database name. The same name must be used
   * to open the same database.
   */
  constructor(indexedDB) {
    var dbName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "default";
    this.indexedDB = indexedDB;
    _defineProperty(this, "dbName", void 0);
    _defineProperty(this, "syncAccumulator", void 0);
    _defineProperty(this, "db", void 0);
    _defineProperty(this, "disconnected", true);
    _defineProperty(this, "_isNewlyCreated", false);
    _defineProperty(this, "syncToDatabasePromise", void 0);
    _defineProperty(this, "pendingUserPresenceData", []);
    this.dbName = "matrix-js-sdk:" + dbName;
    this.syncAccumulator = new SyncAccumulator();
  }

  /**
   * Attempt to connect to the database. This can fail if the user does not
   * grant permission.
   * @returns Promise which resolves if successfully connected.
   */
  connect(onClose) {
    var _this = this;
    if (!this.disconnected) {
      logger.log("LocalIndexedDBStoreBackend.connect: already connected or connecting");
      return Promise.resolve();
    }
    this.disconnected = false;
    logger.log("LocalIndexedDBStoreBackend.connect: connecting...");
    var req = this.indexedDB.open(this.dbName, VERSION);
    req.onupgradeneeded = ev => {
      var db = req.result;
      var oldVersion = ev.oldVersion;
      logger.log("LocalIndexedDBStoreBackend.connect: upgrading from ".concat(oldVersion));
      if (oldVersion < 1) {
        // The database did not previously exist
        this._isNewlyCreated = true;
      }
      DB_MIGRATIONS.forEach((migration, index) => {
        if (oldVersion <= index) migration(db);
      });
    };
    req.onblocked = () => {
      logger.log("can't yet open LocalIndexedDBStoreBackend because it is open elsewhere");
    };
    logger.log("LocalIndexedDBStoreBackend.connect: awaiting connection...");
    return reqAsEventPromise(req).then(/*#__PURE__*/_asyncToGenerator(function* () {
      logger.log("LocalIndexedDBStoreBackend.connect: connected");
      _this.db = req.result;

      // add a poorly-named listener for when deleteDatabase is called
      // so we can close our db connections.
      _this.db.onversionchange = () => {
        var _this$db;
        (_this$db = _this.db) === null || _this$db === void 0 || _this$db.close(); // this does not call onclose
        _this.disconnected = true;
        _this.db = undefined;
      };
      _this.db.onclose = () => {
        _this.disconnected = true;
        _this.db = undefined;
        onClose === null || onClose === void 0 || onClose();
      };
      yield _this.init();
    }));
  }

  /** @returns whether or not the database was newly created in this session. */
  isNewlyCreated() {
    return Promise.resolve(this._isNewlyCreated);
  }

  /**
   * Having connected, load initial data from the database and prepare for use
   * @returns Promise which resolves on success
   */
  init() {
    return Promise.all([this.loadAccountData(), this.loadSyncData()]).then(_ref2 => {
      var [accountData, syncData] = _ref2;
      logger.log("LocalIndexedDBStoreBackend: loaded initial data");
      this.syncAccumulator.accumulate({
        next_batch: syncData.nextBatch,
        rooms: syncData.roomsData,
        account_data: {
          events: accountData
        }
      }, true);
    });
  }

  /**
   * Returns the out-of-band membership events for this room that
   * were previously loaded.
   * @returns the events, potentially an empty array if OOB loading didn't yield any new members
   * @returns in case the members for this room haven't been stored yet
   */
  getOutOfBandMembers(roomId) {
    return new Promise((resolve, reject) => {
      var tx = this.db.transaction(["oob_membership_events"], "readonly");
      var store = tx.objectStore("oob_membership_events");
      var roomIndex = store.index("room");
      var range = IDBKeyRange.only(roomId);
      var request = roomIndex.openCursor(range);
      var membershipEvents = [];
      // did we encounter the oob_written marker object
      // amongst the results? That means OOB member
      // loading already happened for this room
      // but there were no members to persist as they
      // were all known already
      var oobWritten = false;
      request.onsuccess = () => {
        var cursor = request.result;
        if (!cursor) {
          // Unknown room
          if (!membershipEvents.length && !oobWritten) {
            return resolve(null);
          }
          return resolve(membershipEvents);
        }
        var record = cursor.value;
        if (record.oob_written) {
          oobWritten = true;
        } else {
          membershipEvents.push(record);
        }
        cursor.continue();
      };
      request.onerror = err => {
        reject(err);
      };
    }).then(events => {
      logger.log("LL: got ".concat(events === null || events === void 0 ? void 0 : events.length, " membershipEvents from storage for room ").concat(roomId, " ..."));
      return events;
    });
  }

  /**
   * Stores the out-of-band membership events for this room. Note that
   * it still makes sense to store an empty array as the OOB status for the room is
   * marked as fetched, and getOutOfBandMembers will return an empty array instead of null
   * @param membershipEvents - the membership events to store
   */
  setOutOfBandMembers(roomId, membershipEvents) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      logger.log("LL: backend about to store ".concat(membershipEvents.length) + " members for ".concat(roomId));
      var tx = _this2.db.transaction(["oob_membership_events"], "readwrite");
      var store = tx.objectStore("oob_membership_events");
      membershipEvents.forEach(e => {
        store.put(e);
      });
      // aside from all the events, we also write a marker object to the store
      // to mark the fact that OOB members have been written for this room.
      // It's possible that 0 members need to be written as all where previously know
      // but we still need to know whether to return null or [] from getOutOfBandMembers
      // where null means out of band members haven't been stored yet for this room
      var markerObject = {
        room_id: roomId,
        oob_written: true,
        state_key: 0
      };
      store.put(markerObject);
      yield txnAsPromise(tx);
      logger.log("LL: backend done storing for ".concat(roomId, "!"));
    })();
  }
  clearOutOfBandMembers(roomId) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      // the approach to delete all members for a room
      // is to get the min and max state key from the index
      // for that room, and then delete between those
      // keys in the store.
      // this should be way faster than deleting every member
      // individually for a large room.
      var readTx = _this3.db.transaction(["oob_membership_events"], "readonly");
      var store = readTx.objectStore("oob_membership_events");
      var roomIndex = store.index("room");
      var roomRange = IDBKeyRange.only(roomId);
      var minStateKeyProm = reqAsCursorPromise(roomIndex.openKeyCursor(roomRange, "next")).then(cursor => (cursor === null || cursor === void 0 ? void 0 : cursor.primaryKey)[1]);
      var maxStateKeyProm = reqAsCursorPromise(roomIndex.openKeyCursor(roomRange, "prev")).then(cursor => (cursor === null || cursor === void 0 ? void 0 : cursor.primaryKey)[1]);
      var [minStateKey, maxStateKey] = yield Promise.all([minStateKeyProm, maxStateKeyProm]);
      var writeTx = _this3.db.transaction(["oob_membership_events"], "readwrite");
      var writeStore = writeTx.objectStore("oob_membership_events");
      var membersKeyRange = IDBKeyRange.bound([roomId, minStateKey], [roomId, maxStateKey]);
      logger.log("LL: Deleting all users + marker in storage for room ".concat(roomId, ", with key range:"), [roomId, minStateKey], [roomId, maxStateKey]);
      yield reqAsPromise(writeStore.delete(membersKeyRange));
    })();
  }

  /**
   * Clear the entire database. This should be used when logging out of a client
   * to prevent mixing data between accounts. Closes the database.
   * @returns Resolved when the database is cleared.
   */
  clearDatabase() {
    return new Promise(resolve => {
      var _this$db2;
      logger.log("Removing indexeddb instance: ".concat(this.dbName));

      // Close the database first to avoid firing unexpected close events
      (_this$db2 = this.db) === null || _this$db2 === void 0 || _this$db2.close();
      var req = this.indexedDB.deleteDatabase(this.dbName);
      req.onblocked = () => {
        logger.log("can't yet delete indexeddb ".concat(this.dbName, " because it is open elsewhere"));
      };
      req.onerror = () => {
        var _req$error;
        // in firefox, with indexedDB disabled, this fails with a
        // DOMError. We treat this as non-fatal, so that we can still
        // use the app.
        logger.warn("unable to delete js-sdk store indexeddb: ".concat((_req$error = req.error) === null || _req$error === void 0 ? void 0 : _req$error.name));
        resolve();
      };
      req.onsuccess = () => {
        logger.log("Removed indexeddb instance: ".concat(this.dbName));
        resolve();
      };
    });
  }

  /**
   * @param copy - If false, the data returned is from internal
   * buffers and must not be mutated. Otherwise, a copy is made before
   * returning such that the data can be safely mutated. Default: true.
   *
   * @returns Promise which resolves with a sync response to restore the
   * client state to where it was at the last save, or null if there
   * is no saved sync data.
   */
  getSavedSync() {
    var copy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var data = this.syncAccumulator.getJSON();
    if (!data.nextBatch) return Promise.resolve(null);
    if (copy) {
      // We must deep copy the stored data so that the /sync processing code doesn't
      // corrupt the internal state of the sync accumulator (it adds non-clonable keys)
      return Promise.resolve(deepCopy(data));
    } else {
      return Promise.resolve(data);
    }
  }
  getNextBatchToken() {
    return Promise.resolve(this.syncAccumulator.getNextBatchToken());
  }
  setSyncData(syncData) {
    return Promise.resolve().then(() => {
      this.syncAccumulator.accumulate(syncData);
    });
  }

  /**
   * Sync users and all accumulated sync data to the database.
   * If a previous sync is in flight, the new data will be added to the
   * next sync and the current sync's promise will be returned.
   * @param userTuples - The user tuples
   * @returns Promise which resolves if the data was persisted.
   */
  syncToDatabase(userTuples) {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      if (_this4.syncToDatabasePromise) {
        logger.warn("Skipping syncToDatabase() as persist already in flight");
        _this4.pendingUserPresenceData.push(...userTuples);
        return _this4.syncToDatabasePromise;
      }
      userTuples.unshift(..._this4.pendingUserPresenceData);
      _this4.syncToDatabasePromise = _this4.doSyncToDatabase(userTuples);
      return _this4.syncToDatabasePromise;
    })();
  }
  doSyncToDatabase(userTuples) {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      try {
        var syncData = _this5.syncAccumulator.getJSON(true);
        yield Promise.all([_this5.persistUserPresenceEvents(userTuples), _this5.persistAccountData(syncData.accountData), _this5.persistSyncData(syncData.nextBatch, syncData.roomsData)]);
      } finally {
        _this5.syncToDatabasePromise = undefined;
      }
    })();
  }

  /**
   * Persist rooms /sync data along with the next batch token.
   * @param nextBatch - The next_batch /sync value.
   * @param roomsData - The 'rooms' /sync data from a SyncAccumulator
   * @returns Promise which resolves if the data was persisted.
   */
  persistSyncData(nextBatch, roomsData) {
    logger.log("Persisting sync data up to", nextBatch);
    return promiseTry(() => {
      var txn = this.db.transaction(["sync"], "readwrite");
      var store = txn.objectStore("sync");
      store.put({
        clobber: "-",
        // constant key so will always clobber
        nextBatch,
        roomsData
      }); // put == UPSERT
      return txnAsPromise(txn).then(() => {
        logger.log("Persisted sync data up to", nextBatch);
      });
    });
  }

  /**
   * Persist a list of account data events. Events with the same 'type' will
   * be replaced.
   * @param accountData - An array of raw user-scoped account data events
   * @returns Promise which resolves if the events were persisted.
   */
  persistAccountData(accountData) {
    return promiseTry(() => {
      var txn = this.db.transaction(["accountData"], "readwrite");
      var store = txn.objectStore("accountData");
      for (var event of accountData) {
        store.put(event); // put == UPSERT
      }
      return txnAsPromise(txn).then();
    });
  }

  /**
   * Persist a list of [user id, presence event] they are for.
   * Users with the same 'userId' will be replaced.
   * Presence events should be the event in its raw form (not the Event
   * object)
   * @param tuples - An array of [userid, event] tuples
   * @returns Promise which resolves if the users were persisted.
   */
  persistUserPresenceEvents(tuples) {
    return promiseTry(() => {
      var txn = this.db.transaction(["users"], "readwrite");
      var store = txn.objectStore("users");
      for (var tuple of tuples) {
        store.put({
          userId: tuple[0],
          event: tuple[1]
        }); // put == UPSERT
      }
      return txnAsPromise(txn).then();
    });
  }

  /**
   * Load all user presence events from the database. This is not cached.
   * FIXME: It would probably be more sensible to store the events in the
   * sync.
   * @returns A list of presence events in their raw form.
   */
  getUserPresenceEvents() {
    return promiseTry(() => {
      var txn = this.db.transaction(["users"], "readonly");
      var store = txn.objectStore("users");
      return selectQuery(store, undefined, cursor => {
        return [cursor.value.userId, cursor.value.event];
      });
    });
  }

  /**
   * Load all the account data events from the database. This is not cached.
   * @returns A list of raw global account events.
   */
  loadAccountData() {
    logger.log("LocalIndexedDBStoreBackend: loading account data...");
    return promiseTry(() => {
      var txn = this.db.transaction(["accountData"], "readonly");
      var store = txn.objectStore("accountData");
      return selectQuery(store, undefined, cursor => {
        return cursor.value;
      }).then(result => {
        logger.log("LocalIndexedDBStoreBackend: loaded account data");
        return result;
      });
    });
  }

  /**
   * Load the sync data from the database.
   * @returns An object with "roomsData" and "nextBatch" keys.
   */
  loadSyncData() {
    logger.log("LocalIndexedDBStoreBackend: loading sync data...");
    return promiseTry(() => {
      var txn = this.db.transaction(["sync"], "readonly");
      var store = txn.objectStore("sync");
      return selectQuery(store, undefined, cursor => {
        return cursor.value;
      }).then(results => {
        logger.log("LocalIndexedDBStoreBackend: loaded sync data");
        if (results.length > 1) {
          logger.warn("loadSyncData: More than 1 sync row found.");
        }
        return results.length > 0 ? results[0] : {};
      });
    });
  }
  getClientOptions() {
    return Promise.resolve().then(() => {
      var txn = this.db.transaction(["client_options"], "readonly");
      var store = txn.objectStore("client_options");
      return selectQuery(store, undefined, cursor => {
        var _cursor$value;
        return (_cursor$value = cursor.value) === null || _cursor$value === void 0 ? void 0 : _cursor$value.options;
      }).then(results => results[0]);
    });
  }
  storeClientOptions(options) {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      var txn = _this6.db.transaction(["client_options"], "readwrite");
      var store = txn.objectStore("client_options");
      store.put({
        clobber: "-",
        // constant key so will always clobber
        options: options
      }); // put == UPSERT
      yield txnAsPromise(txn);
    })();
  }
  saveToDeviceBatches(batches) {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      var txn = _this7.db.transaction(["to_device_queue"], "readwrite");
      var store = txn.objectStore("to_device_queue");
      for (var batch of batches) {
        store.add(batch);
      }
      yield txnAsPromise(txn);
    })();
  }
  getOldestToDeviceBatch() {
    var _this8 = this;
    return _asyncToGenerator(function* () {
      var txn = _this8.db.transaction(["to_device_queue"], "readonly");
      var store = txn.objectStore("to_device_queue");
      var cursor = yield reqAsCursorPromise(store.openCursor());
      if (!cursor) return null;
      var resultBatch = cursor.value;
      return {
        id: cursor.key,
        txnId: resultBatch.txnId,
        eventType: resultBatch.eventType,
        batch: resultBatch.batch
      };
    })();
  }
  removeToDeviceBatch(id) {
    var _this9 = this;
    return _asyncToGenerator(function* () {
      var txn = _this9.db.transaction(["to_device_queue"], "readwrite");
      var store = txn.objectStore("to_device_queue");
      store.delete(id);
      yield txnAsPromise(txn);
    })();
  }

  /*
   * Close the database
   */
  destroy() {
    var _this0 = this;
    return _asyncToGenerator(function* () {
      var _this0$db;
      (_this0$db = _this0.db) === null || _this0$db === void 0 || _this0$db.close();
    })();
  }
}
//# sourceMappingURL=indexeddb-local-backend.js.map