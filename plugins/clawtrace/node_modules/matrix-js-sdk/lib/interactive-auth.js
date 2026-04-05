import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2016 OpenMarket Ltd
Copyright 2017 Vector Creations Ltd
Copyright 2019 The Matrix.org Foundation C.I.C.

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

import { logger } from "./logger.js";
import { MatrixError } from "./http-api/index.js";
var EMAIL_STAGE_TYPE = "m.login.email.identity";
var MSISDN_STAGE_TYPE = "m.login.msisdn";

/**
 * Data returned in the body of a 401 response from a UIA endpoint.
 *
 * @see https://spec.matrix.org/v1.6/client-server-api/#user-interactive-api-in-the-rest-api
 */

export var AuthType = /*#__PURE__*/function (AuthType) {
  AuthType["Password"] = "m.login.password";
  AuthType["Recaptcha"] = "m.login.recaptcha";
  AuthType["Terms"] = "m.login.terms";
  AuthType["Email"] = "m.login.email.identity";
  AuthType["Msisdn"] = "m.login.msisdn";
  AuthType["Sso"] = "m.login.sso";
  AuthType["SsoUnstable"] = "org.matrix.login.sso";
  AuthType["Dummy"] = "m.login.dummy";
  AuthType["RegistrationToken"] = "m.login.registration_token";
  // For backwards compatability with servers that have not yet updated to
  // use the stable "m.login.registration_token" type.
  // The authentication flow is the same in both cases.
  AuthType["UnstableRegistrationToken"] = "org.matrix.msc3231.login.registration_token";
  /**
   * m.oauth stage introduced by MSC4312:
   * https://spec.matrix.org/v1.17/client-server-api/#oauth-authentication
   */
  AuthType["OAuth"] = "m.oauth";
  return AuthType;
}({});

/**
 * https://spec.matrix.org/v1.7/client-server-api/#password-based
 */

/**
 * https://spec.matrix.org/v1.7/client-server-api/#google-recaptcha
 */

/**
 * https://spec.matrix.org/v1.7/client-server-api/#email-based-identity--homeserver
 */

/**
 * The parameters which are submitted as the `auth` dict in a UIA request
 *
 * @see https://spec.matrix.org/v1.6/client-server-api/#authentication-types
 */

export class NoAuthFlowFoundError extends Error {
  constructor(m,
  // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
  required_stages, flows) {
    super(m);
    this.required_stages = required_stages;
    this.flows = flows;
    _defineProperty(this, "name", "NoAuthFlowFoundError");
  }
}

/**
 * The type of an application callback to perform the user-interactive bit of UIA.
 *
 * It is called with a single parameter, `makeRequest`, which is a function which takes the UIA parameters and
 * makes the HTTP request. The `authData` parameter in `makeRequest` can be set to null to omit the `auth` field
 * from the UIA request.
 *
 * The generic parameter `T` is the type of the response of the endpoint, once it is eventually successful.
 */

/**
 * Abstracts the logic used to drive the interactive auth process.
 *
 * <p>Components implementing an interactive auth flow should instantiate one of
 * these, passing in the necessary callbacks to the constructor. They should
 * then call attemptAuth, which will return a promise which will resolve or
 * reject when the interactive-auth process completes.
 *
 * <p>Meanwhile, calls will be made to the startAuthStage and doRequest
 * callbacks, and information gathered from the user can be submitted with
 * submitAuthDict.
 *
 * @param opts - options object
 * @typeParam T - the return type of the request when it is successful
 */
export class InteractiveAuth {
  constructor(opts) {
    var _this = this;
    _defineProperty(this, "matrixClient", void 0);
    _defineProperty(this, "inputs", void 0);
    _defineProperty(this, "clientSecret", void 0);
    _defineProperty(this, "requestCallback", void 0);
    _defineProperty(this, "busyChangedCallback", void 0);
    _defineProperty(this, "stateUpdatedCallback", void 0);
    _defineProperty(this, "requestEmailTokenCallback", void 0);
    _defineProperty(this, "supportedStages", void 0);
    // The current latest data or error received from the server during the user interactive auth flow.
    _defineProperty(this, "data", void 0);
    _defineProperty(this, "emailSid", void 0);
    _defineProperty(this, "requestingEmailToken", false);
    _defineProperty(this, "attemptAuthDeferred", null);
    _defineProperty(this, "chosenFlow", null);
    _defineProperty(this, "currentStage", null);
    _defineProperty(this, "emailAttempt", 1);
    // if we are currently trying to submit an auth dict (which includes polling)
    // the promise the will resolve/reject when it completes
    _defineProperty(this, "submitPromise", null);
    /**
     * Requests a new email token and sets the email sid for the validation session
     */
    _defineProperty(this, "requestEmailToken", /*#__PURE__*/_asyncToGenerator(function* () {
      if (!_this.requestingEmailToken) {
        logger.trace("Requesting email token. Attempt: " + _this.emailAttempt);
        // If we've picked a flow with email auth, we send the email
        // now because we want the request to fail as soon as possible
        // if the email address is not valid (ie. already taken or not
        // registered, depending on what the operation is).
        _this.requestingEmailToken = true;
        try {
          var requestTokenResult = yield _this.requestEmailTokenCallback(_this.inputs.emailAddress, _this.clientSecret, _this.emailAttempt++, _this.data.session);
          _this.emailSid = requestTokenResult.sid;
          logger.trace("Email token request succeeded");
        } finally {
          _this.requestingEmailToken = false;
        }
      } else {
        logger.warn("Could not request email token: Already requesting");
      }
    }));
    this.matrixClient = opts.matrixClient;
    this.data = opts.authData || {
      flows: []
    };
    this.requestCallback = opts.doRequest;
    this.busyChangedCallback = opts.busyChanged;
    // startAuthStage included for backwards compat
    this.stateUpdatedCallback = opts.stateUpdated || opts.startAuthStage;
    this.requestEmailTokenCallback = opts.requestEmailToken;
    this.inputs = opts.inputs || {};
    if (opts.sessionId) this.data.session = opts.sessionId;
    this.clientSecret = opts.clientSecret || this.matrixClient.generateClientSecret();
    this.emailSid = opts.emailSid;
    if (opts.supportedStages !== undefined) this.supportedStages = new Set(opts.supportedStages);
  }

  /**
   * begin the authentication process.
   *
   * @returns which resolves to the response on success,
   * or rejects with the error on failure. Rejects with NoAuthFlowFoundError if
   *     no suitable authentication flow can be found
   */
  attemptAuth() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      var _this2$data;
      // This promise will be quite long-lived and will resolve when the
      // request is authenticated and completes successfully.
      _this2.attemptAuthDeferred = Promise.withResolvers();
      // pluck the promise out now, as doRequest may clear before we return
      var promise = _this2.attemptAuthDeferred.promise;

      // if we have no flows, try a request to acquire the flows
      if (!((_this2$data = _this2.data) !== null && _this2$data !== void 0 && (_this2$data = _this2$data.flows) !== null && _this2$data !== void 0 && _this2$data.length)) {
        var _this2$busyChangedCal;
        (_this2$busyChangedCal = _this2.busyChangedCallback) === null || _this2$busyChangedCal === void 0 || _this2$busyChangedCal.call(_this2, true);
        // use the existing sessionId, if one is present.
        var _auth = _this2.data.session ? {
          session: _this2.data.session
        } : null;
        _this2.doRequest(_auth).finally(() => {
          var _this2$busyChangedCal2;
          (_this2$busyChangedCal2 = _this2.busyChangedCallback) === null || _this2$busyChangedCal2 === void 0 || _this2$busyChangedCal2.call(_this2, false);
        });
      } else {
        _this2.startNextAuthStage();
      }
      return promise;
    })();
  }

  /**
   * Poll to check if the auth session or current stage has been
   * completed out-of-band. If so, the attemptAuth promise will
   * be resolved.
   */
  poll() {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      if (!_this3.data.session) return;
      // likewise don't poll if there is no auth session in progress
      if (!_this3.attemptAuthDeferred) return;
      // if we currently have a request in flight, there's no point making
      // another just to check what the status is
      if (_this3.submitPromise) return;
      var authDict = {};
      if (_this3.currentStage == EMAIL_STAGE_TYPE) {
        // The email can be validated out-of-band, but we need to provide the
        // creds so the HS can go & check it.
        if (_this3.emailSid) {
          var creds = {
            sid: _this3.emailSid,
            client_secret: _this3.clientSecret
          };
          var isUrl = _this3.matrixClient.getIdentityServerUrl();
          if (isUrl) {
            creds.id_server = new URL(isUrl).host;
          }
          authDict = {
            type: EMAIL_STAGE_TYPE,
            threepid_creds: creds
          };
        }
      }
      _this3.submitAuthDict(authDict, true);
    })();
  }

  /**
   * get the auth session ID
   *
   * @returns session id
   */
  getSessionId() {
    var _this$data;
    return (_this$data = this.data) === null || _this$data === void 0 ? void 0 : _this$data.session;
  }

  /**
   * get the client secret used for validation sessions
   * with the identity server.
   *
   * @returns client secret
   */
  getClientSecret() {
    return this.clientSecret;
  }

  /**
   * get the server params for a given stage
   *
   * @param loginType - login type for the stage
   * @returns any parameters from the server for this stage
   */
  getStageParams(loginType) {
    var _this$data2;
    return (_this$data2 = this.data) === null || _this$data2 === void 0 || (_this$data2 = _this$data2.params) === null || _this$data2 === void 0 ? void 0 : _this$data2[loginType];
  }
  getChosenFlow() {
    return this.chosenFlow;
  }

  /**
   * submit a new auth dict and fire off the request. This will either
   * make attemptAuth resolve/reject, or cause the startAuthStage callback
   * to be called for a new stage.
   *
   * @param authData - new auth dict to send to the server. Should
   *    include a `type` property denoting the login type, as well as any
   *    other params for that stage.
   * @param background - If true, this request failing will not result
   *    in the attemptAuth promise being rejected. This can be set to true
   *    for requests that just poll to see if auth has been completed elsewhere.
   */
  submitAuthDict(authData) {
    var _arguments = arguments,
      _this4 = this;
    return _asyncToGenerator(function* () {
      var _this4$data;
      var background = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : false;
      if (!_this4.attemptAuthDeferred) {
        throw new Error("submitAuthDict() called before attemptAuth()");
      }
      if (!background) {
        var _this4$busyChangedCal;
        (_this4$busyChangedCal = _this4.busyChangedCallback) === null || _this4$busyChangedCal === void 0 || _this4$busyChangedCal.call(_this4, true);
      }

      // if we're currently trying a request, wait for it to finish
      // as otherwise we can get multiple 200 responses which can mean
      // things like multiple logins for register requests.
      // (but discard any exceptions as we only care when its done,
      // not whether it worked or not)
      while (_this4.submitPromise) {
        try {
          yield _this4.submitPromise;
        } catch (_unused) {}
      }

      // use the sessionid from the last request, if one is present.
      var auth;
      if ((_this4$data = _this4.data) !== null && _this4$data !== void 0 && _this4$data.session) {
        auth = Object.assign({
          session: _this4.data.session
        }, authData);
      } else {
        auth = authData;
      }
      try {
        // NB. the 'background' flag is deprecated by the busyChanged
        // callback and is here for backwards compat
        _this4.submitPromise = _this4.doRequest(auth, background);
        yield _this4.submitPromise;
      } finally {
        _this4.submitPromise = null;
        if (!background) {
          var _this4$busyChangedCal2;
          (_this4$busyChangedCal2 = _this4.busyChangedCallback) === null || _this4$busyChangedCal2 === void 0 || _this4$busyChangedCal2.call(_this4, false);
        }
      }
    })();
  }

  /**
   * Gets the sid for the email validation session
   * Specific to m.login.email.identity
   *
   * @returns The sid of the email auth session
   */
  getEmailSid() {
    return this.emailSid;
  }

  /**
   * Sets the sid for the email validation session
   * This must be set in order to successfully poll for completion
   * of the email validation.
   * Specific to m.login.email.identity
   *
   * @param sid - The sid for the email validation session
   */
  setEmailSid(sid) {
    this.emailSid = sid;
  }
  /**
   * Fire off a request, and either resolve the promise, or call
   * startAuthStage.
   *
   * @internal
   * @param auth - new auth dict, including session id
   * @param background - If true, this request is a background poll, so it
   *    failing will not result in the attemptAuth promise being rejected.
   *    This can be set to true for requests that just poll to see if auth has
   *    been completed elsewhere.
   */
  doRequest(auth) {
    var _arguments2 = arguments,
      _this5 = this;
    return _asyncToGenerator(function* () {
      var background = _arguments2.length > 1 && _arguments2[1] !== undefined ? _arguments2[1] : false;
      try {
        var result = yield _this5.requestCallback(auth, background);
        _this5.attemptAuthDeferred.resolve(result);
        _this5.attemptAuthDeferred = null;
      } catch (error) {
        var _matrixError$data$flo, _matrixError$data, _this5$data, _this5$chosenFlow;
        var matrixError = error instanceof MatrixError ? error : null;

        // sometimes UI auth errors don't come with flows
        var errorFlows = (_matrixError$data$flo = matrixError === null || matrixError === void 0 || (_matrixError$data = matrixError.data) === null || _matrixError$data === void 0 ? void 0 : _matrixError$data.flows) !== null && _matrixError$data$flo !== void 0 ? _matrixError$data$flo : null;
        var haveFlows = ((_this5$data = _this5.data) === null || _this5$data === void 0 ? void 0 : _this5$data.flows) || Boolean(errorFlows);
        if (!matrixError || matrixError.httpStatus !== 401 || !matrixError.data || !haveFlows) {
          // doesn't look like an interactive-auth failure.
          if (!background) {
            var _this5$attemptAuthDef;
            (_this5$attemptAuthDef = _this5.attemptAuthDeferred) === null || _this5$attemptAuthDef === void 0 || _this5$attemptAuthDef.reject(error);
          } else {
            // We ignore all failures here (even non-UI auth related ones)
            // since we don't want to suddenly fail if the internet connection
            // had a blip whilst we were polling
            logger.log("Background poll request failed doing UI auth: ignoring", error);
          }
        }
        if (matrixError && !matrixError.data) {
          matrixError.data = {};
        }
        // if the error didn't come with flows, completed flows or session ID,
        // copy over the ones we have. Synapse sometimes sends responses without
        // any UI auth data (eg. when polling for email validation, if the email
        // has not yet been validated). This appears to be a Synapse bug, which
        // we workaround here.
        if (matrixError && !matrixError.data.flows && !matrixError.data.completed && !matrixError.data.session) {
          matrixError.data.flows = _this5.data.flows;
          matrixError.data.completed = _this5.data.completed;
          matrixError.data.session = _this5.data.session;
        }
        if (matrixError) {
          _this5.data = matrixError.data;
        }
        try {
          _this5.startNextAuthStage();
        } catch (e) {
          _this5.attemptAuthDeferred.reject(e);
          _this5.attemptAuthDeferred = null;
          return;
        }
        if (!_this5.emailSid && (_this5$chosenFlow = _this5.chosenFlow) !== null && _this5$chosenFlow !== void 0 && _this5$chosenFlow.stages.includes(AuthType.Email)) {
          try {
            yield _this5.requestEmailToken();
            // NB. promise is not resolved here - at some point, doRequest
            // will be called again and if the user has jumped through all
            // the hoops correctly, auth will be complete and the request
            // will succeed.
            // Also, we should expose the fact that this request has compledted
            // so clients can know that the email has actually been sent.
          } catch (e) {
            // we failed to request an email token, so fail the request.
            // This could be due to the email already beeing registered
            // (or not being registered, depending on what we're trying
            // to do) or it could be a network failure. Either way, pass
            // the failure up as the user can't complete auth if we can't
            // send the email, for whatever reason.
            _this5.attemptAuthDeferred.reject(e);
            _this5.attemptAuthDeferred = null;
          }
        }
      }
    })();
  }

  /**
   * Pick the next stage and call the callback
   *
   * @internal
   * @throws {@link NoAuthFlowFoundError} If no suitable authentication flow can be found
   */
  startNextAuthStage() {
    var _this$data3, _this$data4;
    var nextStage = this.chooseStage();
    if (!nextStage) {
      throw new Error("No incomplete flows from the server");
    }
    this.currentStage = nextStage;
    if (nextStage === AuthType.Dummy) {
      this.submitAuthDict({
        type: "m.login.dummy"
      });
      return;
    }
    if ((_this$data3 = this.data) !== null && _this$data3 !== void 0 && _this$data3.errcode || (_this$data4 = this.data) !== null && _this$data4 !== void 0 && _this$data4.error) {
      var _this$data5, _this$data6;
      this.stateUpdatedCallback(nextStage, {
        errcode: ((_this$data5 = this.data) === null || _this$data5 === void 0 ? void 0 : _this$data5.errcode) || "",
        error: ((_this$data6 = this.data) === null || _this$data6 === void 0 ? void 0 : _this$data6.error) || ""
      });
      return;
    }
    this.stateUpdatedCallback(nextStage, nextStage === EMAIL_STAGE_TYPE ? {
      emailSid: this.emailSid
    } : {});
  }

  /**
   * Pick the next auth stage
   *
   * @internal
   * @returns login type
   * @throws {@link NoAuthFlowFoundError} If no suitable authentication flow can be found
   */
  chooseStage() {
    if (this.chosenFlow === null) {
      this.chosenFlow = this.chooseFlow();
    }
    logger.log("Active flow => %s", JSON.stringify(this.chosenFlow));
    var nextStage = this.firstUncompletedStage(this.chosenFlow);
    logger.log("Next stage: %s", nextStage);
    return nextStage;
  }

  // Returns a low number for flows we consider best. Counts increase for longer flows and even more so
  // for flows which contain stages not listed in `supportedStages`.
  scoreFlow(flow) {
    var score = flow.stages.length;
    if (this.supportedStages !== undefined) {
      // Add 10 points to the score for each unsupported stage in the flow.
      score += flow.stages.filter(stage => !this.supportedStages.has(stage)).length * 10;
    }
    return score;
  }

  /**
   * Pick one of the flows from the returned list
   * If a flow using all of the inputs is found, it will
   * be returned, otherwise, null will be returned.
   *
   * Only flows using all given inputs are chosen because it
   * is likely to be surprising if the user provides a
   * credential and it is not used. For example, for registration,
   * this could result in the email not being used which would leave
   * the account with no means to reset a password.
   *
   * @internal
   * @returns flow
   * @throws {@link NoAuthFlowFoundError} If no suitable authentication flow can be found
   */
  chooseFlow() {
    var _this$data7;
    var flows = ((_this$data7 = this.data) === null || _this$data7 === void 0 ? void 0 : _this$data7.flows) || [];

    // we've been given an email or we've already done an email part
    var haveEmail = Boolean(this.inputs.emailAddress) || Boolean(this.emailSid);
    var haveMsisdn = Boolean(this.inputs.phoneCountry) && Boolean(this.inputs.phoneNumber);

    // Flows are not represented in a significant order, so we can choose any we support best
    // Sort flows based on how many unsupported stages they contain ascending
    flows.sort((a, b) => this.scoreFlow(a) - this.scoreFlow(b));
    for (var flow of flows) {
      var flowHasEmail = false;
      var flowHasMsisdn = false;
      for (var stage of flow.stages) {
        if (stage === EMAIL_STAGE_TYPE) {
          flowHasEmail = true;
        } else if (stage == MSISDN_STAGE_TYPE) {
          flowHasMsisdn = true;
        }
      }
      if (flowHasEmail == haveEmail && flowHasMsisdn == haveMsisdn) {
        return flow;
      }
    }
    var requiredStages = [];
    if (haveEmail) requiredStages.push(EMAIL_STAGE_TYPE);
    if (haveMsisdn) requiredStages.push(MSISDN_STAGE_TYPE);
    // Throw an error with a fairly generic description, but with more
    // information such that the app can give a better one if so desired.
    throw new NoAuthFlowFoundError("No appropriate authentication flow found", requiredStages, flows);
  }

  /**
   * Get the first uncompleted stage in the given flow
   *
   * @internal
   * @returns login type
   */
  firstUncompletedStage(flow) {
    var _this$data8;
    var completed = ((_this$data8 = this.data) === null || _this$data8 === void 0 ? void 0 : _this$data8.completed) || [];
    return flow.stages.find(stageType => !completed.includes(stageType));
  }
}
//# sourceMappingURL=interactive-auth.js.map