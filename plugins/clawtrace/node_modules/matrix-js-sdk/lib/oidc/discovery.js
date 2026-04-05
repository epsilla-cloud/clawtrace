import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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

import { MetadataService, OidcClientSettingsStore } from "oidc-client-ts";
import { validateAuthMetadata } from "./validate.js";
import { Method, timeoutSignal } from "../http-api/index.js";
/**
 * @experimental
 * Discover and validate delegated auth configuration
 * - delegated auth issuer openid-configuration is reachable
 * - delegated auth issuer openid-configuration is configured correctly for us
 * Fetches https://oidc-issuer.example.com/.well-known/openid-configuration and other files linked therein.
 * When successful, validated metadata is returned
 * @param issuer - the OIDC issuer as returned by the /auth_issuer API
 * @returns validated authentication metadata and optionally signing keys
 * @throws when delegated auth config is invalid or unreachable
 * @deprecated in favour of {@link MatrixClient#getAuthMetadata}
 */
export var discoverAndValidateOIDCIssuerWellKnown = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (issuer) {
    var issuerOpenIdConfigUrl = new URL(".well-known/openid-configuration", issuer);
    var issuerWellKnownResponse = yield fetch(issuerOpenIdConfigUrl, {
      method: Method.Get,
      signal: timeoutSignal(5000)
    });
    var issuerWellKnown = yield issuerWellKnownResponse.json();
    return validateAuthMetadataAndKeys(issuerWellKnown);
  });
  return function discoverAndValidateOIDCIssuerWellKnown(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * @experimental
 * Validate the authentication metadata and fetch the signing keys from the jwks_uri in the metadata
 * @param authMetadata - the authentication metadata to validate
 * @returns validated authentication metadata and signing keys
 */
export var validateAuthMetadataAndKeys = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (authMetadata) {
    var validatedIssuerConfig = validateAuthMetadata(authMetadata);

    // create a temporary settings store, so we can use metadata service for discovery
    var settings = new OidcClientSettingsStore({
      authority: validatedIssuerConfig.issuer,
      metadata: validatedIssuerConfig,
      redirect_uri: "",
      // Not known yet, this is here to make the type checker happy
      client_id: "" // Not known yet, this is here to make the type checker happy
    });
    var metadataService = new MetadataService(settings);
    return _objectSpread(_objectSpread({}, validatedIssuerConfig), {}, {
      signingKeys: yield metadataService.getSigningKeys()
    });
  });
  return function validateAuthMetadataAndKeys(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=discovery.js.map