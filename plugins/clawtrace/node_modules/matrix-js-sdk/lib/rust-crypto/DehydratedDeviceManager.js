import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2024 The Matrix.org Foundation C.I.C.

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

import * as RustSdkCryptoJs from "@matrix-org/matrix-sdk-crypto-wasm";
import { encodeUri } from "../utils.js";
import { Method } from "../http-api/index.js";
import { decodeBase64 } from "../base64.js";
import { CryptoEvent } from "../crypto-api/index.js";
import { TypedEventEmitter } from "../models/typed-event-emitter.js";

/**
 * The response body of `GET /_matrix/client/unstable/org.matrix.msc3814.v1/dehydrated_device`.
 */

/**
 * The response body of `POST /_matrix/client/unstable/org.matrix.msc3814.v1/dehydrated_device/events`.
 */

/**
 * The unstable URL prefix for dehydrated device endpoints
 */
export var UnstablePrefix = "/_matrix/client/unstable/org.matrix.msc3814.v1";
/**
 * The name used for the dehydration key in Secret Storage
 */
var SECRET_STORAGE_NAME = "org.matrix.msc3814";

/**
 * The interval between creating dehydrated devices. (one week)
 */
var DEHYDRATION_INTERVAL = 7 * 24 * 60 * 60 * 1000;

/**
 * Manages dehydrated devices
 *
 * We have one of these per `RustCrypto`.  It's responsible for
 *
 * * determining server support for dehydrated devices
 * * creating new dehydrated devices when requested, including periodically
 *   replacing the dehydrated device with a new one
 * * rehydrating a device when requested, and when present
 *
 * @internal
 */
export class DehydratedDeviceManager extends TypedEventEmitter {
  constructor(logger, olmMachine, http, outgoingRequestProcessor, secretStorage) {
    super();
    this.logger = logger;
    this.olmMachine = olmMachine;
    this.http = http;
    this.outgoingRequestProcessor = outgoingRequestProcessor;
    this.secretStorage = secretStorage;
    /** the ID of the interval for periodically replacing the dehydrated device */
    _defineProperty(this, "intervalId", void 0);
  }
  cacheKey(key) {
    var _this = this;
    return _asyncToGenerator(function* () {
      yield _this.olmMachine.dehydratedDevices().saveDehydratedDeviceKey(key);
      _this.emit(CryptoEvent.DehydrationKeyCached);
    })();
  }

  /**
   * Return whether the server supports dehydrated devices.
   */
  isSupported() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      // call the endpoint to get a dehydrated device.  If it returns an
      // M_UNRECOGNIZED error, then dehydration is unsupported.  If it returns
      // a successful response, or an M_NOT_FOUND, then dehydration is supported.
      // Any other exceptions are passed through.
      try {
        yield _this2.http.authedRequest(Method.Get, "/dehydrated_device", undefined, undefined, {
          prefix: UnstablePrefix
        });
      } catch (error) {
        var err = error;
        if (err.errcode === "M_UNRECOGNIZED") {
          return false;
        } else if (err.errcode === "M_NOT_FOUND") {
          return true;
        }
        throw error;
      }
      return true;
    })();
  }

  /**
   * Start using device dehydration.
   *
   * - Rehydrates a dehydrated device, if one is available and `opts.rehydrate`
   *   is `true`.
   * - Creates a new dehydration key, if necessary, and stores it in Secret
   *   Storage.
   *   - If `opts.createNewKey` is set to true, always creates a new key.
   *   - If a dehydration key is not available, creates a new one.
   * - Creates a new dehydrated device, and schedules periodically creating
   *   new dehydrated devices.
   *
   * @param opts - options for device dehydration. For backwards compatibility
   *     with old code, a boolean can be given here, which will be treated as
   *     the `createNewKey` option. However, this is deprecated.
   */
  start() {
    var _arguments = arguments,
      _this3 = this;
    return _asyncToGenerator(function* () {
      var opts = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : {};
      if (typeof opts === "boolean") {
        opts = {
          createNewKey: opts
        };
      }
      if (opts.onlyIfKeyCached && !(yield _this3.olmMachine.dehydratedDevices().getDehydratedDeviceKey())) {
        return;
      }
      _this3.stop();
      if (opts.rehydrate !== false) {
        try {
          yield _this3.rehydrateDeviceIfAvailable();
        } catch (e) {
          // If rehydration fails, there isn't much we can do about it.  Log
          // the error, and create a new device.
          _this3.logger.info("dehydration: Error rehydrating device:", e);
          _this3.emit(CryptoEvent.RehydrationError, e.message);
        }
      }
      if (opts.createNewKey) {
        yield _this3.resetKey();
      }
      yield _this3.scheduleDeviceDehydration();
    })();
  }

  /**
   * Return whether the dehydration key is stored in Secret Storage.
   */
  isKeyStored() {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      return Boolean(yield _this4.secretStorage.isStored(SECRET_STORAGE_NAME));
    })();
  }

  /**
   * Reset the dehydration key.
   *
   * Creates a new key and stores it in secret storage.
   *
   * @returns The newly-generated key.
   */
  resetKey() {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      var key = RustSdkCryptoJs.DehydratedDeviceKey.createRandomKey();
      yield _this5.secretStorage.store(SECRET_STORAGE_NAME, key.toBase64());
      // Also cache it in the rust SDK's crypto store.
      yield _this5.cacheKey(key);
      return key;
    })();
  }

  /**
   * Get and cache the encryption key from secret storage.
   *
   * If `create` is `true`, creates a new key if no existing key is present.
   *
   * @returns the key, if available, or `null` if no key is available
   */
  getKey(create) {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      var cachedKey = yield _this6.olmMachine.dehydratedDevices().getDehydratedDeviceKey();
      if (cachedKey) return cachedKey;
      var keyB64 = yield _this6.secretStorage.get(SECRET_STORAGE_NAME);
      if (keyB64 === undefined) {
        if (!create) {
          return null;
        }
        return yield _this6.resetKey();
      }

      // We successfully found the key in secret storage: decode it, and cache it in
      // the rust SDK's crypto store.
      var bytes = decodeBase64(keyB64);
      try {
        var key = RustSdkCryptoJs.DehydratedDeviceKey.createKeyFromArray(bytes);
        yield _this6.cacheKey(key);
        return key;
      } finally {
        bytes.fill(0);
      }
    })();
  }

  /**
   * Rehydrate the dehydrated device stored on the server.
   *
   * Checks if there is a dehydrated device on the server.  If so, rehydrates
   * the device and processes the to-device events.
   *
   * Returns whether or not a dehydrated device was found.
   */
  rehydrateDeviceIfAvailable() {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      var key = yield _this7.getKey(false);
      if (!key) {
        return false;
      }
      var dehydratedDeviceResp;
      try {
        dehydratedDeviceResp = yield _this7.http.authedRequest(Method.Get, "/dehydrated_device", undefined, undefined, {
          prefix: UnstablePrefix
        });
      } catch (error) {
        var err = error;
        // We ignore M_NOT_FOUND (there is no dehydrated device, so nothing
        // us to do) and M_UNRECOGNIZED (the server does not understand the
        // endpoint).  We pass through any other errors.
        if (err.errcode === "M_NOT_FOUND" || err.errcode === "M_UNRECOGNIZED") {
          _this7.logger.info("dehydration: No dehydrated device");
          return false;
        }
        throw err;
      }
      _this7.logger.info("dehydration: dehydrated device found");
      _this7.emit(CryptoEvent.RehydrationStarted);
      var rehydratedDevice = yield _this7.olmMachine.dehydratedDevices().rehydrate(key, new RustSdkCryptoJs.DeviceId(dehydratedDeviceResp.device_id), JSON.stringify(dehydratedDeviceResp.device_data));
      _this7.logger.info("dehydration: device rehydrated");
      var nextBatch = undefined;
      var toDeviceCount = 0;
      var roomKeyCount = 0;
      var path = encodeUri("/dehydrated_device/$device_id/events", {
        $device_id: dehydratedDeviceResp.device_id
      });
      // eslint-disable-next-line no-constant-condition
      while (true) {
        var eventResp = yield _this7.http.authedRequest(Method.Post, path, undefined, nextBatch ? {
          next_batch: nextBatch
        } : {}, {
          prefix: UnstablePrefix
        });
        if (eventResp.events.length === 0) {
          break;
        }
        toDeviceCount += eventResp.events.length;
        nextBatch = eventResp.next_batch;
        var roomKeyInfos = yield rehydratedDevice.receiveEvents(JSON.stringify(eventResp.events));
        roomKeyCount += roomKeyInfos.length;
        _this7.emit(CryptoEvent.RehydrationProgress, roomKeyCount, toDeviceCount);
      }
      _this7.logger.info("dehydration: received ".concat(roomKeyCount, " room keys from ").concat(toDeviceCount, " to-device events"));
      _this7.emit(CryptoEvent.RehydrationCompleted);
      return true;
    })();
  }

  /**
   * Creates and uploads a new dehydrated device.
   *
   * Creates and stores a new key in secret storage if none is available.
   */
  createAndUploadDehydratedDevice() {
    var _this8 = this;
    return _asyncToGenerator(function* () {
      var key = yield _this8.getKey(true);
      var dehydratedDevice = yield _this8.olmMachine.dehydratedDevices().create();
      _this8.emit(CryptoEvent.DehydratedDeviceCreated);
      var request = yield dehydratedDevice.keysForUpload("Dehydrated device", key);
      yield _this8.outgoingRequestProcessor.makeOutgoingRequest(request);
      _this8.emit(CryptoEvent.DehydratedDeviceUploaded);
      _this8.logger.info("dehydration: uploaded device");
    })();
  }

  /**
   * Schedule periodic creation of dehydrated devices.
   */
  scheduleDeviceDehydration() {
    var _this9 = this;
    return _asyncToGenerator(function* () {
      // cancel any previously-scheduled tasks
      _this9.stop();
      yield _this9.createAndUploadDehydratedDevice();
      _this9.intervalId = setInterval(() => {
        _this9.createAndUploadDehydratedDevice().catch(error => {
          _this9.emit(CryptoEvent.DehydratedDeviceRotationError, error.message);
          _this9.logger.error("Error creating dehydrated device:", error);
        });
      }, DEHYDRATION_INTERVAL);
    })();
  }

  /**
   * Stop the dehydrated device manager.
   *
   * Cancels any scheduled dehydration tasks.
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  /**
   * Delete the current dehydrated device and stop the dehydrated device manager.
   */
  delete() {
    var _this0 = this;
    return _asyncToGenerator(function* () {
      _this0.stop();
      try {
        yield _this0.http.authedRequest(Method.Delete, "/dehydrated_device", undefined, {}, {
          prefix: UnstablePrefix
        });
      } catch (error) {
        var err = error;
        // If dehydrated devices aren't supported, or no dehydrated device
        // is found, we don't consider it an error, because we we'll end up
        // with no dehydrated device.
        if (err.errcode === "M_UNRECOGNIZED") {
          return;
        } else if (err.errcode === "M_NOT_FOUND") {
          return;
        }
        throw error;
      }
    })();
  }
}

/**
 * The events fired by the DehydratedDeviceManager
 * @internal
 */

/**
 * A map of the {@link DehydratedDeviceEvents} fired by the {@link DehydratedDeviceManager} and their payloads.
 * @internal
 */
//# sourceMappingURL=DehydratedDeviceManager.js.map