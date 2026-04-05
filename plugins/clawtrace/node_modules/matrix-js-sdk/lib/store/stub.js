import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2015 - 2021 The Matrix.org Foundation C.I.C.

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

/**
 * This is an internal module.
 */

/**
 * Construct a stub store. This does no-ops on most store methods.
 */
export class StubStore {
  constructor() {
    _defineProperty(this, "accountData", new Map());
    // stub
    _defineProperty(this, "fromToken", null);
  }
  /** @returns whether or not the database was newly created in this session. */
  isNewlyCreated() {
    return Promise.resolve(true);
  }

  /**
   * Get the sync token.
   */
  getSyncToken() {
    return this.fromToken;
  }

  /**
   * Set the sync token.
   */
  setSyncToken(token) {
    this.fromToken = token;
  }

  /**
   * No-op.
   */
  storeRoom(room) {}

  /**
   * No-op.
   */
  getRoom(roomId) {
    return null;
  }

  /**
   * No-op.
   * @returns An empty array.
   */
  getRooms() {
    return [];
  }

  /**
   * Permanently delete a room.
   */
  removeRoom(roomId) {
    return;
  }

  /**
   * No-op.
   * @returns An empty array.
   */
  getRoomSummaries() {
    return [];
  }

  /**
   * No-op.
   */
  storeUser(user) {}

  /**
   * No-op.
   */
  getUser(userId) {
    return null;
  }

  /**
   * No-op.
   */
  getUsers() {
    return [];
  }

  /**
   * No-op.
   */
  scrollback(room, limit) {
    return [];
  }

  /**
   * No-op.
   */
  setUserCreator(creator) {
    return;
  }

  /**
   * Store events for a room.
   * @param room - The room to store events for.
   * @param events - The events to store.
   * @param token - The token associated with these events.
   * @param toStart - True if these are paginated results.
   */
  storeEvents(room, events, token, toStart) {}

  /**
   * Store a filter.
   */
  storeFilter(filter) {}

  /**
   * Retrieve a filter.
   * @returns A filter or null.
   */
  getFilter(userId, filterId) {
    return null;
  }

  /**
   * Retrieve a filter ID with the given name.
   * @param filterName - The filter name.
   * @returns The filter ID or null.
   */
  getFilterIdByName(filterName) {
    return null;
  }

  /**
   * Set a filter name to ID mapping.
   */
  setFilterIdByName(filterName, filterId) {}

  /**
   * Store user-scoped account data events
   * @param events - The events to store.
   */
  storeAccountDataEvents(events) {}

  /**
   * Get account data event by event type
   * @param eventType - The event type being queried
   */
  getAccountData(eventType) {
    return undefined;
  }

  /**
   * setSyncData does nothing as there is no backing data store.
   *
   * @param syncData - The sync data
   * @returns An immediately resolved promise.
   */
  setSyncData(syncData) {
    return Promise.resolve();
  }

  /**
   * We never want to save because we have nothing to save to.
   *
   * @returns If the store wants to save
   */
  wantsSave() {
    return false;
  }

  /**
   * Save does nothing as there is no backing data store.
   */
  save() {
    return Promise.resolve();
  }

  /**
   * Startup does nothing.
   * @returns An immediately resolved promise.
   */
  startup() {
    return Promise.resolve();
  }

  /**
   * @returns Promise which resolves with a sync response to restore the
   * client state to where it was at the last save, or null if there
   * is no saved sync data.
   */
  getSavedSync() {
    return Promise.resolve(null);
  }

  /**
   * @returns If there is a saved sync, the nextBatch token
   * for this sync, otherwise null.
   */
  getSavedSyncToken() {
    return Promise.resolve(null);
  }

  /**
   * Delete all data from this store. Does nothing since this store
   * doesn't store anything.
   * @returns An immediately resolved promise.
   */
  deleteAllData() {
    return Promise.resolve();
  }
  getOutOfBandMembers() {
    return Promise.resolve(null);
  }
  setOutOfBandMembers(roomId, membershipEvents) {
    return Promise.resolve();
  }
  clearOutOfBandMembers() {
    return Promise.resolve();
  }
  getClientOptions() {
    return Promise.resolve(undefined);
  }
  storeClientOptions(options) {
    return Promise.resolve();
  }
  getPendingEvents(roomId) {
    return _asyncToGenerator(function* () {
      return [];
    })();
  }
  setPendingEvents(roomId, events) {
    return Promise.resolve();
  }
  saveToDeviceBatches(batch) {
    return _asyncToGenerator(function* () {
      return Promise.resolve();
    })();
  }
  getOldestToDeviceBatch() {
    return Promise.resolve(null);
  }
  removeToDeviceBatch(id) {
    return _asyncToGenerator(function* () {
      return Promise.resolve();
    })();
  }
  destroy() {
    return _asyncToGenerator(function* () {})();
  } // Nothing to do
}
//# sourceMappingURL=stub.js.map