/*
Copyright 2022 The Matrix.org Foundation C.I.C.

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

export var MSC4108FailureReason = /*#__PURE__*/function (MSC4108FailureReason) {
  MSC4108FailureReason["AuthorizationExpired"] = "authorization_expired";
  MSC4108FailureReason["DeviceAlreadyExists"] = "device_already_exists";
  MSC4108FailureReason["DeviceNotFound"] = "device_not_found";
  MSC4108FailureReason["UnexpectedMessageReceived"] = "unexpected_message_received";
  MSC4108FailureReason["UnsupportedProtocol"] = "unsupported_protocol";
  MSC4108FailureReason["UserCancelled"] = "user_cancelled";
  return MSC4108FailureReason;
}({});
export var ClientRendezvousFailureReason = /*#__PURE__*/function (ClientRendezvousFailureReason) {
  /** The sign in request has expired */
  ClientRendezvousFailureReason["Expired"] = "expired";
  /** The homeserver is lacking support for the required features */
  ClientRendezvousFailureReason["HomeserverLacksSupport"] = "homeserver_lacks_support";
  /** The secure channel verification failed meaning that it might be compromised */
  ClientRendezvousFailureReason["InsecureChannelDetected"] = "insecure_channel_detected";
  /** An invalid/incompatible QR code was scanned */
  ClientRendezvousFailureReason["InvalidCode"] = "invalid_code";
  /** The other device is not signed in */
  ClientRendezvousFailureReason["OtherDeviceNotSignedIn"] = "other_device_not_signed_in";
  /** The other device is already signed in */
  ClientRendezvousFailureReason["OtherDeviceAlreadySignedIn"] = "other_device_already_signed_in";
  /** Other */
  ClientRendezvousFailureReason["Unknown"] = "unknown";
  /** The user declined the sign in request */
  ClientRendezvousFailureReason["UserDeclined"] = "user_declined";
  /** The rendezvous request is missing an ETag header */
  ClientRendezvousFailureReason["ETagMissing"] = "etag_missing";
  return ClientRendezvousFailureReason;
}({});
//# sourceMappingURL=RendezvousFailureReason.js.map