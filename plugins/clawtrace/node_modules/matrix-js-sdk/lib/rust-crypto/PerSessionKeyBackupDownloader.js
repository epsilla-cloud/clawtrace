import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2023 - 2024 The Matrix.org Foundation C.I.C.

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

import { CryptoEvent } from "../crypto-api/index.js";
import { ClientPrefix, MatrixError, Method } from "../http-api/index.js";
import { encodeUri, sleep } from "../utils.js";
// The minimum time to wait between two retries in case of errors. To avoid hammering the server.
var KEY_BACKUP_BACKOFF = 5000; // ms

/**
 * Enumerates the different kind of errors that can occurs when downloading and importing a key from backup.
 */
var KeyDownloadErrorCode = /*#__PURE__*/function (KeyDownloadErrorCode) {
  /** The requested key is not in the backup. */
  KeyDownloadErrorCode["MISSING_DECRYPTION_KEY"] = "MISSING_DECRYPTION_KEY";
  /** A network error occurred while trying to download the key from backup. */
  KeyDownloadErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
  /** The loop has been stopped. */
  KeyDownloadErrorCode["STOPPED"] = "STOPPED";
  return KeyDownloadErrorCode;
}(KeyDownloadErrorCode || {});
class KeyDownloadError extends Error {
  constructor(code) {
    super("Failed to get key from backup: ".concat(code));
    this.code = code;
    this.name = "KeyDownloadError";
  }
}
class KeyDownloadRateLimitError extends Error {
  constructor(retryMillis) {
    super("Failed to get key from backup: rate limited");
    this.retryMillis = retryMillis;
    this.name = "KeyDownloadRateLimitError";
  }
}

/** Details of a megolm session whose key we are trying to fetch. */

/** Holds the current backup decryptor and version that should be used.
 *
 * This is intended to be used as an immutable object (a new instance should be created if the configuration changes),
 * and some of the logic relies on that, so the properties are marked as `readonly`.
 */

/**
 * Used when an 'unable to decrypt' error occurs. It attempts to download the key from the backup.
 *
 * The current backup API lacks pagination, which can lead to lengthy key retrieval times for large histories (several 10s of minutes).
 * To mitigate this, keys are downloaded on demand as decryption errors occurs.
 * While this approach may result in numerous requests, it improves user experience by reducing wait times for message decryption.
 *
 * The PerSessionKeyBackupDownloader is resistant to backup configuration changes: it will automatically resume querying when
 * the backup is configured correctly.
 */
export class PerSessionKeyBackupDownloader {
  /**
   * Creates a new instance of PerSessionKeyBackupDownloader.
   *
   * @param backupManager - The backup manager to use.
   * @param olmMachine - The olm machine to use.
   * @param http - The http instance to use.
   * @param logger - The logger to use.
   */
  constructor(logger, olmMachine, http, backupManager) {
    this.olmMachine = olmMachine;
    this.http = http;
    this.backupManager = backupManager;
    _defineProperty(this, "stopped", false);
    /**
     * The version and decryption key to use with current backup if all set up correctly.
     *
     * Will not be set unless `hasConfigurationProblem` is `false`.
     */
    _defineProperty(this, "configuration", null);
    /** We remember when a session was requested and not found in backup to avoid query again too soon.
     * Map of session_id to timestamp */
    _defineProperty(this, "sessionLastCheckAttemptedTime", new Map());
    /** The logger to use */
    _defineProperty(this, "logger", void 0);
    /** Whether the download loop is running. */
    _defineProperty(this, "downloadLoopRunning", false);
    /** The list of requests that are queued. */
    _defineProperty(this, "queuedRequests", []);
    /** Remembers if we have a configuration problem. */
    _defineProperty(this, "hasConfigurationProblem", false);
    /** The current server backup version check promise. To avoid doing a server call if one is in flight. */
    _defineProperty(this, "currentBackupVersionCheck", null);
    /**
     * Called when the backup status changes (CryptoEvents)
     * This will trigger a check of the backup configuration.
     */
    _defineProperty(this, "onBackupStatusChanged", () => {
      // we want to force check configuration, so we clear the current one.
      this.hasConfigurationProblem = false;
      this.configuration = null;
      this.getOrCreateBackupConfiguration().then(configuration => {
        if (configuration) {
          // restart the download loop if it was stopped
          this.downloadKeysLoop();
        }
      });
    });
    this.logger = logger.getChild("[PerSessionKeyBackupDownloader]");
    backupManager.on(CryptoEvent.KeyBackupStatus, this.onBackupStatusChanged);
    backupManager.on(CryptoEvent.KeyBackupFailed, this.onBackupStatusChanged);
    backupManager.on(CryptoEvent.KeyBackupDecryptionKeyCached, this.onBackupStatusChanged);
  }

  /**
   * Check if key download is successfully configured and active.
   *
   * @return `true` if key download is correctly configured and active; otherwise `false`.
   */
  isKeyBackupDownloadConfigured() {
    return this.configuration !== null;
  }

  /**
   * Return the details of the latest backup on the server, when we last checked.
   *
   * This is just a convenience method to expose {@link RustBackupManager.getServerBackupInfo}.
   */
  getServerBackupInfo() {
    var _this = this;
    return _asyncToGenerator(function* () {
      return yield _this.backupManager.getServerBackupInfo();
    })();
  }

  /**
   * Called when a MissingRoomKey or UnknownMessageIndex decryption error is encountered.
   *
   * This will try to download the key from the backup if there is a trusted active backup.
   * In case of success the key will be imported and the onRoomKeysUpdated callback will be called
   * internally by the rust-sdk and decryption will be retried.
   *
   * @param roomId - The room ID of the room where the error occurred.
   * @param megolmSessionId - The megolm session ID that is missing.
   */
  onDecryptionKeyMissingError(roomId, megolmSessionId) {
    // Several messages encrypted with the same session may be decrypted at the same time,
    // so we need to be resistant and not query several time the same session.
    if (this.isAlreadyInQueue(roomId, megolmSessionId)) {
      // There is already a request queued for this session, no need to queue another one.
      this.logger.trace("Not checking key backup for session ".concat(megolmSessionId, " as it is already queued"));
      return;
    }
    if (this.wasRequestedRecently(megolmSessionId)) {
      // We already tried to download this session recently and it was not in backup, no need to try again.
      this.logger.trace("Not checking key backup for session ".concat(megolmSessionId, " as it was already requested recently"));
      return;
    }

    // We always add the request to the queue, even if we have a configuration problem (can't access backup).
    // This is to make sure that if the configuration problem is resolved, we will try to download the key.
    // This will happen after an initial sync, at this point the backup will not yet be trusted and the decryption
    // key will not be available, but it will be just after the verification.
    // We don't need to persist it because currently on refresh the sdk will retry to decrypt the messages in error.
    this.queuedRequests.push({
      roomId,
      megolmSessionId
    });

    // Start the download loop if it's not already running.
    this.downloadKeysLoop();
  }
  stop() {
    this.stopped = true;
    this.backupManager.off(CryptoEvent.KeyBackupStatus, this.onBackupStatusChanged);
    this.backupManager.off(CryptoEvent.KeyBackupFailed, this.onBackupStatusChanged);
    this.backupManager.off(CryptoEvent.KeyBackupDecryptionKeyCached, this.onBackupStatusChanged);
  }
  /** Returns true if the megolm session is already queued for download. */
  isAlreadyInQueue(roomId, megolmSessionId) {
    return this.queuedRequests.some(info => {
      return info.roomId == roomId && info.megolmSessionId == megolmSessionId;
    });
  }

  /**
   * Marks the session as not found in backup, to avoid retrying to soon for a key not in backup
   *
   * @param megolmSessionId - The megolm session ID that is missing.
   */
  markAsNotFoundInBackup(megolmSessionId) {
    var now = Date.now();
    this.sessionLastCheckAttemptedTime.set(megolmSessionId, now);
    // if too big make some cleaning to keep under control
    if (this.sessionLastCheckAttemptedTime.size > 100) {
      this.sessionLastCheckAttemptedTime = new Map(Array.from(this.sessionLastCheckAttemptedTime).filter((sid, ts) => {
        return Math.max(now - ts, 0) < KEY_BACKUP_BACKOFF;
      }));
    }
  }

  /** Returns true if the session was requested recently. */
  wasRequestedRecently(megolmSessionId) {
    var lastCheck = this.sessionLastCheckAttemptedTime.get(megolmSessionId);
    if (!lastCheck) return false;
    return Math.max(Date.now() - lastCheck, 0) < KEY_BACKUP_BACKOFF;
  }
  getBackupDecryptionKey() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      try {
        return yield _this2.olmMachine.getBackupKeys();
      } catch (_unused) {
        return null;
      }
    })();
  }

  /**
   * Requests a key from the server side backup.
   *
   * @param version - The backup version to use.
   * @param roomId - The room ID of the room where the error occurred.
   * @param sessionId - The megolm session ID that is missing.
   */
  requestRoomKeyFromBackup(version, roomId, sessionId) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      var path = encodeUri("/room_keys/keys/$roomId/$sessionId", {
        $roomId: roomId,
        $sessionId: sessionId
      });
      return yield _this3.http.authedRequest(Method.Get, path, {
        version
      }, undefined, {
        prefix: ClientPrefix.V3
      });
    })();
  }
  downloadKeysLoop() {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      if (_this4.downloadLoopRunning) return;

      // If we have a configuration problem, we don't want to try to download.
      // If any configuration change is detected, we will retry and restart the loop.
      if (_this4.hasConfigurationProblem) return;
      _this4.downloadLoopRunning = true;
      try {
        while (_this4.queuedRequests.length > 0) {
          // we just peek the first one without removing it, so if a new request for same key comes in while we're
          // processing this one, it won't queue another request.
          var request = _this4.queuedRequests[0];
          try {
            // The backup could have changed between the time we queued the request and now, so we need to check
            var configuration = yield _this4.getOrCreateBackupConfiguration();
            if (!configuration) {
              // Backup is not configured correctly, so stop the loop.
              _this4.downloadLoopRunning = false;
              return;
            }
            var result = yield _this4.queryKeyBackup(request.roomId, request.megolmSessionId, configuration);
            if (_this4.stopped) {
              return;
            }
            // We got the encrypted key from backup, let's try to decrypt and import it.
            try {
              yield _this4.decryptAndImport(request, result, configuration);
            } catch (e) {
              _this4.logger.error("Error while decrypting and importing key backup for session ".concat(request.megolmSessionId), e);
            }
            // now remove the request from the queue as we've processed it.
            _this4.queuedRequests.shift();
          } catch (err) {
            if (err instanceof KeyDownloadError) {
              switch (err.code) {
                case KeyDownloadErrorCode.MISSING_DECRYPTION_KEY:
                  _this4.markAsNotFoundInBackup(request.megolmSessionId);
                  // continue for next one
                  _this4.queuedRequests.shift();
                  break;
                case KeyDownloadErrorCode.NETWORK_ERROR:
                  // We don't want to hammer if there is a problem, so wait a bit.
                  yield sleep(KEY_BACKUP_BACKOFF);
                  break;
                case KeyDownloadErrorCode.STOPPED:
                  // If the downloader was stopped, we don't want to retry.
                  _this4.downloadLoopRunning = false;
                  return;
              }
            } else if (err instanceof KeyDownloadRateLimitError) {
              // we want to retry after the backoff time
              yield sleep(err.retryMillis);
            }
          }
        }
      } finally {
        // all pending request have been processed, we can stop the loop.
        _this4.downloadLoopRunning = false;
      }
    })();
  }

  /**
   * Query the backup for a key.
   *
   * @param targetRoomId - ID of the room that the session is used in.
   * @param targetSessionId - ID of the session for which to check backup.
   * @param configuration - The backup configuration to use.
   */
  queryKeyBackup(targetRoomId, targetSessionId, configuration) {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      _this5.logger.debug("Checking key backup for session ".concat(targetSessionId));
      if (_this5.stopped) throw new KeyDownloadError(KeyDownloadErrorCode.STOPPED);
      try {
        var res = yield _this5.requestRoomKeyFromBackup(configuration.backupVersion, targetRoomId, targetSessionId);
        _this5.logger.debug("Got key from backup for sessionId:".concat(targetSessionId));
        return res;
      } catch (e) {
        if (_this5.stopped) throw new KeyDownloadError(KeyDownloadErrorCode.STOPPED);
        _this5.logger.info("No luck requesting key backup for session ".concat(targetSessionId, ": ").concat(e));
        if (e instanceof MatrixError) {
          var errCode = e.data.errcode;
          if (errCode == "M_NOT_FOUND") {
            // Unfortunately the spec doesn't give us a way to differentiate between a missing key and a wrong version.
            // Synapse will return:
            //     - "error": "Unknown backup version" if the version is wrong.
            //     - "error": "No room_keys found" if the key is missing.
            // It's useful to know if the key is missing or if the version is wrong.
            // As it's not spec'ed, we fall back on considering the key is not in backup.
            // Notice that this request will be lost if instead the backup got out of sync (updated from other session).
            throw new KeyDownloadError(KeyDownloadErrorCode.MISSING_DECRYPTION_KEY);
          }
          if (e.isRateLimitError()) {
            var waitTime;
            try {
              var _e$getRetryAfterMs;
              waitTime = (_e$getRetryAfterMs = e.getRetryAfterMs()) !== null && _e$getRetryAfterMs !== void 0 ? _e$getRetryAfterMs : undefined;
            } catch (error) {
              _this5.logger.warn("Error while retrieving a rate-limit retry delay", error);
            }
            if (waitTime && waitTime > 0) {
              _this5.logger.info("Rate limited by server, waiting ".concat(waitTime, "ms"));
            }
            throw new KeyDownloadRateLimitError(waitTime !== null && waitTime !== void 0 ? waitTime : KEY_BACKUP_BACKOFF);
          }
        }
        throw new KeyDownloadError(KeyDownloadErrorCode.NETWORK_ERROR);
      }
    })();
  }
  decryptAndImport(sessionInfo, data, configuration) {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      var sessionsToImport = {
        [sessionInfo.megolmSessionId]: data
      };
      var keys = yield configuration.decryptor.decryptSessions(sessionsToImport);
      for (var k of keys) {
        k.room_id = sessionInfo.roomId;
      }
      yield _this6.backupManager.importBackedUpRoomKeys(keys, configuration.backupVersion);
    })();
  }

  /**
   * Gets the current backup configuration or create one if it doesn't exist.
   *
   * When a valid configuration is found it is cached and returned for subsequent calls.
   * Otherwise, if a check is forced or a check has not yet been done, a new check is done.
   *
   * @returns The backup configuration to use or null if there is a configuration problem.
   */
  getOrCreateBackupConfiguration() {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      if (_this7.configuration) {
        return _this7.configuration;
      }

      // We already tried to check the configuration and it failed.
      // We don't want to try again immediately, we will retry if a configuration change is detected.
      if (_this7.hasConfigurationProblem) {
        return null;
      }

      // This method can be called rapidly by several emitted CryptoEvent, so we need to make sure that we don't
      // query the server several times.
      if (_this7.currentBackupVersionCheck != null) {
        _this7.logger.debug("Already checking server version, use current promise");
        return yield _this7.currentBackupVersionCheck;
      }
      _this7.currentBackupVersionCheck = _this7.internalCheckFromServer();
      try {
        return yield _this7.currentBackupVersionCheck;
      } finally {
        _this7.currentBackupVersionCheck = null;
      }
    })();
  }
  internalCheckFromServer() {
    var _this8 = this;
    return _asyncToGenerator(function* () {
      var _currentServerVersion, _currentServerVersion2, _currentServerVersion4;
      var currentServerVersion = null;
      try {
        currentServerVersion = yield _this8.backupManager.getServerBackupInfo();
      } catch (e) {
        _this8.logger.debug("Backup: error while checking server version: ".concat(e));
        _this8.hasConfigurationProblem = true;
        return null;
      }
      _this8.logger.debug("Got current backup version from server: ".concat((_currentServerVersion = currentServerVersion) === null || _currentServerVersion === void 0 ? void 0 : _currentServerVersion.version));
      if (((_currentServerVersion2 = currentServerVersion) === null || _currentServerVersion2 === void 0 ? void 0 : _currentServerVersion2.algorithm) != "m.megolm_backup.v1.curve25519-aes-sha2") {
        var _currentServerVersion3;
        _this8.logger.info("Unsupported algorithm ".concat((_currentServerVersion3 = currentServerVersion) === null || _currentServerVersion3 === void 0 ? void 0 : _currentServerVersion3.algorithm));
        _this8.hasConfigurationProblem = true;
        return null;
      }
      if (!((_currentServerVersion4 = currentServerVersion) !== null && _currentServerVersion4 !== void 0 && _currentServerVersion4.version)) {
        _this8.logger.info("No current key backup");
        _this8.hasConfigurationProblem = true;
        return null;
      }
      var activeVersion = yield _this8.backupManager.getActiveBackupVersion();
      if (activeVersion == null || currentServerVersion.version != activeVersion) {
        // Either the current backup version on server side is not trusted, or it is out of sync with the active version on the client side.
        _this8.logger.info("The current backup version on the server (".concat(currentServerVersion.version, ") is not trusted. Version we are currently backing up to: ").concat(activeVersion));
        _this8.hasConfigurationProblem = true;
        return null;
      }
      var backupKeys = yield _this8.getBackupDecryptionKey();
      if (!(backupKeys !== null && backupKeys !== void 0 && backupKeys.decryptionKey)) {
        _this8.logger.debug("Not checking key backup for session (no decryption key)");
        _this8.hasConfigurationProblem = true;
        return null;
      }
      if (activeVersion != backupKeys.backupVersion) {
        _this8.logger.debug("Version for which we have a decryption key (".concat(backupKeys.backupVersion, ") doesn't match the version we are backing up to (").concat(activeVersion, ")"));
        _this8.hasConfigurationProblem = true;
        return null;
      }
      var authData = currentServerVersion.auth_data;
      if (authData.public_key != backupKeys.decryptionKey.megolmV1PublicKey.publicKeyBase64) {
        _this8.logger.debug("Key backup on server does not match our decryption key");
        _this8.hasConfigurationProblem = true;
        return null;
      }
      var backupDecryptor = _this8.backupManager.createBackupDecryptor(backupKeys.decryptionKey);
      _this8.hasConfigurationProblem = false;
      _this8.configuration = {
        decryptor: backupDecryptor,
        backupVersion: activeVersion
      };
      return _this8.configuration;
    })();
  }
}
//# sourceMappingURL=PerSessionKeyBackupDownloader.js.map