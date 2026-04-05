import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
/*
Copyright 2023 The Matrix.org Foundation C.I.C.

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

/** Manages the cross-signing keys for our own user.
 *
 * @internal
 */
export class CrossSigningIdentity {
  constructor(logger, olmMachine, outgoingRequestProcessor, secretStorage) {
    this.logger = logger;
    this.olmMachine = olmMachine;
    this.outgoingRequestProcessor = outgoingRequestProcessor;
    this.secretStorage = secretStorage;
  }

  /**
   * Initialise our cross-signing keys by creating new keys if they do not exist, and uploading to the server
   */
  bootstrapCrossSigning(opts) {
    var _this = this;
    return _asyncToGenerator(function* () {
      if (opts.setupNewCrossSigning) {
        yield _this.resetCrossSigning(opts.authUploadDeviceSigningKeys);
        return;
      }
      var olmDeviceStatus = yield _this.olmMachine.crossSigningStatus();

      // Try to fetch cross signing keys from the secret storage
      var masterKeyFromSecretStorage = yield _this.secretStorage.get("m.cross_signing.master");
      var selfSigningKeyFromSecretStorage = yield _this.secretStorage.get("m.cross_signing.self_signing");
      var userSigningKeyFromSecretStorage = yield _this.secretStorage.get("m.cross_signing.user_signing");
      var privateKeysInSecretStorage = Boolean(masterKeyFromSecretStorage && selfSigningKeyFromSecretStorage && userSigningKeyFromSecretStorage);
      var olmDeviceHasKeys = olmDeviceStatus.hasMaster && olmDeviceStatus.hasUserSigning && olmDeviceStatus.hasSelfSigning;

      // Log all relevant state for easier parsing of debug logs.
      _this.logger.debug("bootstrapCrossSigning: starting", {
        setupNewCrossSigning: opts.setupNewCrossSigning,
        olmDeviceHasMaster: olmDeviceStatus.hasMaster,
        olmDeviceHasUserSigning: olmDeviceStatus.hasUserSigning,
        olmDeviceHasSelfSigning: olmDeviceStatus.hasSelfSigning,
        privateKeysInSecretStorage
      });
      if (olmDeviceHasKeys) {
        if (!(yield _this.secretStorage.hasKey())) {
          _this.logger.warn("bootstrapCrossSigning: Olm device has private keys, but secret storage is not yet set up; doing nothing for now.");
          // the keys should get uploaded to 4S once that is set up.
        } else if (!privateKeysInSecretStorage) {
          // the device has the keys but they are not in 4S, so update it
          _this.logger.debug("bootstrapCrossSigning: Olm device has private keys: exporting to secret storage");
          yield _this.exportCrossSigningKeysToStorage();
        } else {
          _this.logger.debug("bootstrapCrossSigning: Olm device has private keys and they are saved in secret storage; doing nothing");
        }
      } /* (!olmDeviceHasKeys) */else {
        if (privateKeysInSecretStorage) {
          // they are in 4S, so import from there
          _this.logger.debug("bootstrapCrossSigning: Cross-signing private keys not found locally, but they are available " + "in secret storage, reading storage and caching locally");
          var status = yield _this.olmMachine.importCrossSigningKeys(masterKeyFromSecretStorage, selfSigningKeyFromSecretStorage, userSigningKeyFromSecretStorage);

          // Check that `importCrossSigningKeys` worked correctly (for example, it will fail silently if the
          // public keys are not available).
          if (!status.hasMaster || !status.hasSelfSigning || !status.hasUserSigning) {
            throw new Error("importCrossSigningKeys failed to import the keys");
          }

          // Get the current device
          var device = yield _this.olmMachine.getDevice(_this.olmMachine.userId, _this.olmMachine.deviceId);
          try {
            // Sign the device with our cross-signing key and upload the signature
            var request = yield device.verify();
            yield _this.outgoingRequestProcessor.makeOutgoingRequest(request);
          } finally {
            device.free();
          }
        } else {
          _this.logger.debug("bootstrapCrossSigning: Cross-signing private keys not found locally or in secret storage, creating new keys");
          yield _this.resetCrossSigning(opts.authUploadDeviceSigningKeys);
        }
      }

      // TODO: we might previously have bootstrapped cross-signing but not completed uploading the keys to the
      //   server -- in which case we should call OlmDevice.bootstrap_cross_signing. How do we know?
      _this.logger.debug("bootstrapCrossSigning: complete");
    })();
  }

  /** Reset our cross-signing keys
   *
   * This method will:
   *   * Tell the OlmMachine to create new keys
   *   * Upload the new public keys and the device signature to the server
   *   * Upload the private keys to SSSS, if it is set up
   */
  resetCrossSigning(authUploadDeviceSigningKeys) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      // XXX: We must find a way to make this atomic, currently if the user does not remember his account password
      // or 4S passphrase/key the process will fail in a bad state, with keys rotated but not uploaded or saved in 4S.
      var outgoingRequests = yield _this2.olmMachine.bootstrapCrossSigning(true);

      // If 4S is configured we need to update it.
      if (!(yield _this2.secretStorage.hasKey())) {
        _this2.logger.warn("resetCrossSigning: Secret storage is not yet set up; not exporting keys to secret storage yet.");
        // the keys should get uploaded to 4S once that is set up.
      } else {
        // Update 4S before uploading cross-signing keys, to stay consistent with legacy that asks
        // 4S passphrase before asking for account password.
        // Ultimately should be made atomic and resistant to forgotten password/passphrase.
        _this2.logger.debug("resetCrossSigning: exporting private keys to secret storage");
        yield _this2.exportCrossSigningKeysToStorage();
      }
      _this2.logger.debug("resetCrossSigning: publishing public keys to server");
      for (var req of [outgoingRequests.uploadKeysRequest, outgoingRequests.uploadSigningKeysRequest, outgoingRequests.uploadSignaturesRequest]) {
        if (req) {
          yield _this2.outgoingRequestProcessor.makeOutgoingRequest(req, authUploadDeviceSigningKeys);
        }
      }
    })();
  }

  /**
   * Extract the cross-signing keys from the olm machine and save them to secret storage, if it is configured
   *
   * (If secret storage is *not* configured, we assume that the export will happen when it is set up)
   */
  exportCrossSigningKeysToStorage() {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      var exported = yield _this3.olmMachine.exportCrossSigningKeys();
      /* istanbul ignore else (this function is only called when we know the olm machine has keys) */
      if (exported !== null && exported !== void 0 && exported.masterKey) {
        yield _this3.secretStorage.store("m.cross_signing.master", exported.masterKey);
      } else {
        _this3.logger.error("Cannot export MSK to secret storage, private key unknown");
      }
      if (exported !== null && exported !== void 0 && exported.self_signing_key) {
        yield _this3.secretStorage.store("m.cross_signing.self_signing", exported.self_signing_key);
      } else {
        _this3.logger.error("Cannot export SSK to secret storage, private key unknown");
      }
      if (exported !== null && exported !== void 0 && exported.userSigningKey) {
        yield _this3.secretStorage.store("m.cross_signing.user_signing", exported.userSigningKey);
      } else {
        _this3.logger.error("Cannot export USK to secret storage, private key unknown");
      }
    })();
  }
}
//# sourceMappingURL=CrossSigningIdentity.js.map