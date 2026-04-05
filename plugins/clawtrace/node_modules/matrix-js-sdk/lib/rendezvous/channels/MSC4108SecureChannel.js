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

import { Ecies, QrCodeData, QrCodeIntent } from "@matrix-org/matrix-sdk-crypto-wasm";
import { ClientRendezvousFailureReason, MSC4108FailureReason, RendezvousError } from "../index.js";
import { logger } from "../../logger.js";

/**
 * Prototype of the unstable [MSC4108](https://github.com/matrix-org/matrix-spec-proposals/pull/4108)
 * secure rendezvous session protocol.
 * @experimental Note that this is UNSTABLE and may have breaking changes without notice.
 * Imports @matrix-org/matrix-sdk-crypto-wasm so should be async-imported to avoid bundling the WASM into the main bundle.
 */
export class MSC4108SecureChannel {
  constructor(rendezvousSession, theirPublicKey, onFailure) {
    this.rendezvousSession = rendezvousSession;
    this.theirPublicKey = theirPublicKey;
    this.onFailure = onFailure;
    _defineProperty(this, "secureChannel", void 0);
    _defineProperty(this, "establishedChannel", void 0);
    _defineProperty(this, "connected", false);
    this.secureChannel = new Ecies();
  }

  /**
   * Generate a QR code for the current session.
   * @param mode the mode to generate the QR code in, either `Login` or `Reciprocate`.
   * @param serverName the name of the homeserver to connect to, as defined by server discovery in the spec, required for `Reciprocate` mode.
   */

  generateCode(mode, serverName) {
    var _this = this;
    return _asyncToGenerator(function* () {
      var {
        url
      } = _this.rendezvousSession;
      if (!url) {
        throw new Error("No rendezvous session URL");
      }
      return new QrCodeData(_this.secureChannel.public_key(), url, mode === QrCodeIntent.Reciprocate ? serverName : undefined).toBytes();
    })();
  }

  /**
   * Returns the check code for the secure channel or undefined if not generated yet.
   */
  getCheckCode() {
    var _this$establishedChan;
    var x = (_this$establishedChan = this.establishedChannel) === null || _this$establishedChan === void 0 ? void 0 : _this$establishedChan.check_code();
    if (!x) {
      return undefined;
    }
    return Array.from(x.as_bytes()).map(b => "".concat(b % 10)).join("");
  }

  /**
   * Connects and establishes a secure channel with the other device.
   */
  connect() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      if (_this2.connected) {
        throw new Error("Channel already connected");
      }
      if (_this2.theirPublicKey) {
        // We are the scanning device
        var result = _this2.secureChannel.establish_outbound_channel(_this2.theirPublicKey, "MATRIX_QR_CODE_LOGIN_INITIATE");
        _this2.establishedChannel = result.channel;

        /*
         Secure Channel step 4. Device S sends the initial message
          Nonce := 0
         SH := ECDH(Ss, Gp)
         EncKey := HKDF_SHA256(SH, "MATRIX_QR_CODE_LOGIN|" || Gp || "|" || Sp, 0, 32)
         TaggedCiphertext := ChaCha20Poly1305_Encrypt(EncKey, Nonce, "MATRIX_QR_CODE_LOGIN_INITIATE")
         Nonce := Nonce + 2
         LoginInitiateMessage := UnpaddedBase64(TaggedCiphertext) || "|" || UnpaddedBase64(Sp)
         */
        {
          logger.info("Sending LoginInitiateMessage");
          yield _this2.rendezvousSession.send(result.initial_message);
        }

        /*
        Secure Channel step 6. Verification by Device S
         Nonce_G := 1
        (TaggedCiphertext, Sp) := Unpack(Message)
        Plaintext := ChaCha20Poly1305_Decrypt(EncKey, Nonce_G, TaggedCiphertext)
        Nonce_G := Nonce_G + 2
         unless Plaintext == "MATRIX_QR_CODE_LOGIN_OK":
            FAIL
         */
        {
          logger.info("Waiting for LoginOkMessage");
          var ciphertext = yield _this2.rendezvousSession.receive();
          if (!ciphertext) {
            throw new RendezvousError("No response from other device", MSC4108FailureReason.UnexpectedMessageReceived);
          }
          var candidateLoginOkMessage = yield _this2.decrypt(ciphertext);
          if (candidateLoginOkMessage !== "MATRIX_QR_CODE_LOGIN_OK") {
            throw new RendezvousError("Invalid response from other device", ClientRendezvousFailureReason.InsecureChannelDetected);
          }

          // Step 6 is now complete. We trust the channel
        }
      } else {
        /*
        Secure Channel step 5. Device G confirms
         Nonce_S := 0
        (TaggedCiphertext, Sp) := Unpack(LoginInitiateMessage)
        SH := ECDH(Gs, Sp)
        EncKey := HKDF_SHA256(SH, "MATRIX_QR_CODE_LOGIN|" || Gp || "|" || Sp, 0, 32)
        Plaintext := ChaCha20Poly1305_Decrypt(EncKey, Nonce_S, TaggedCiphertext)
        Nonce_S := Nonce_S + 2
         */
        // wait for the other side to send us their public key
        logger.info("Waiting for LoginInitiateMessage");
        var loginInitiateMessage = yield _this2.rendezvousSession.receive();
        if (!loginInitiateMessage) {
          throw new Error("No response from other device");
        }
        var {
          channel,
          message: candidateLoginInitiateMessage
        } = _this2.secureChannel.establish_inbound_channel(loginInitiateMessage);
        _this2.establishedChannel = channel;
        if (candidateLoginInitiateMessage !== "MATRIX_QR_CODE_LOGIN_INITIATE") {
          throw new RendezvousError("Invalid response from other device", ClientRendezvousFailureReason.InsecureChannelDetected);
        }
        logger.info("LoginInitiateMessage received");
        logger.info("Sending LoginOkMessage");
        var loginOkMessage = yield _this2.encrypt("MATRIX_QR_CODE_LOGIN_OK");
        yield _this2.rendezvousSession.send(loginOkMessage);

        // Step 5 is complete. We don't yet trust the channel

        // next step will be for the user to confirm the check code on the other device
      }
      _this2.connected = true;
    })();
  }
  decrypt(ciphertext) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      if (!_this3.establishedChannel) {
        throw new Error("Channel closed");
      }
      return _this3.establishedChannel.decrypt(ciphertext);
    })();
  }
  encrypt(plaintext) {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      if (!_this4.establishedChannel) {
        throw new Error("Channel closed");
      }
      return _this4.establishedChannel.encrypt(plaintext);
    })();
  }

  /**
   * Sends a payload securely to the other device.
   * @param payload the payload to encrypt and send
   */
  secureSend(payload) {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      if (!_this5.connected) {
        throw new Error("Channel closed");
      }
      var stringifiedPayload = JSON.stringify(payload);
      logger.debug("=> {\"type\": ".concat(JSON.stringify(payload.type), ", ...}"));
      yield _this5.rendezvousSession.send(yield _this5.encrypt(stringifiedPayload));
    })();
  }

  /**
   * Receives an encrypted payload from the other device and decrypts it.
   */
  secureReceive() {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      if (!_this6.establishedChannel) {
        throw new Error("Channel closed");
      }
      var ciphertext = yield _this6.rendezvousSession.receive();
      if (!ciphertext) {
        return undefined;
      }
      var plaintext = yield _this6.decrypt(ciphertext);
      var json = JSON.parse(plaintext);
      logger.debug("<= {\"type\": ".concat(JSON.stringify(json.type), ", ...}"));
      return json;
    })();
  }

  /**
   * Closes the secure channel.
   */
  close() {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      yield _this7.rendezvousSession.close();
    })();
  }

  /**
   * Cancels the secure channel.
   * @param reason the reason for the cancellation
   */
  cancel(reason) {
    var _this8 = this;
    return _asyncToGenerator(function* () {
      try {
        var _this8$onFailure;
        yield _this8.rendezvousSession.cancel(reason);
        (_this8$onFailure = _this8.onFailure) === null || _this8$onFailure === void 0 || _this8$onFailure.call(_this8, reason);
      } finally {
        yield _this8.close();
      }
    })();
  }

  /**
   * Returns whether the rendezvous session has been cancelled.
   */
  get cancelled() {
    return this.rendezvousSession.cancelled;
  }
}
//# sourceMappingURL=MSC4108SecureChannel.js.map