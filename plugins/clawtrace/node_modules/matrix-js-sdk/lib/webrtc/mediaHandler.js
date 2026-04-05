import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2015, 2016 OpenMarket Ltd
Copyright 2017 New Vector Ltd
Copyright 2019, 2020 The Matrix.org Foundation C.I.C.
Copyright 2021 - 2022 Šimon Brandner <simon.bra.ag@gmail.com>

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

import { TypedEventEmitter } from "../models/typed-event-emitter.js";
import { GroupCallType, GroupCallState } from "../webrtc/groupCall.js";
import { logger } from "../logger.js";
export var MediaHandlerEvent = /*#__PURE__*/function (MediaHandlerEvent) {
  MediaHandlerEvent["LocalStreamsChanged"] = "local_streams_changed";
  return MediaHandlerEvent;
}({});
export class MediaHandler extends TypedEventEmitter {
  constructor(client) {
    super();
    this.client = client;
    _defineProperty(this, "audioInput", void 0);
    _defineProperty(this, "audioSettings", void 0);
    _defineProperty(this, "videoInput", void 0);
    _defineProperty(this, "localUserMediaStream", void 0);
    _defineProperty(this, "userMediaStreams", []);
    _defineProperty(this, "screensharingStreams", []);
    // Promise chain to serialise calls to getMediaStream
    _defineProperty(this, "getMediaStreamPromise", void 0);
  }
  restoreMediaSettings(audioInput, videoInput) {
    this.audioInput = audioInput;
    this.videoInput = videoInput;
  }

  /**
   * Set an audio input device to use for MatrixCalls
   * @param deviceId - the identifier for the device
   * undefined treated as unset
   */
  setAudioInput(deviceId) {
    var _this = this;
    return _asyncToGenerator(function* () {
      logger.info("MediaHandler setAudioInput() running (deviceId=".concat(deviceId, ")"));
      if (_this.audioInput === deviceId) return;
      _this.audioInput = deviceId;
      yield _this.updateLocalUsermediaStreams();
    })();
  }

  /**
   * Set audio settings for MatrixCalls
   * @param opts - audio options to set
   */
  setAudioSettings(opts) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      logger.info("MediaHandler setAudioSettings() running (opts=".concat(JSON.stringify(opts), ")"));
      _this2.audioSettings = Object.assign({}, opts);
      yield _this2.updateLocalUsermediaStreams();
    })();
  }

  /**
   * Set a video input device to use for MatrixCalls
   * @param deviceId - the identifier for the device
   * undefined treated as unset
   */
  setVideoInput(deviceId) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      logger.info("MediaHandler setVideoInput() running (deviceId=".concat(deviceId, ")"));
      if (_this3.videoInput === deviceId) return;
      _this3.videoInput = deviceId;
      yield _this3.updateLocalUsermediaStreams();
    })();
  }

  /**
   * Set media input devices to use for MatrixCalls
   * @param audioInput - the identifier for the audio device
   * @param videoInput - the identifier for the video device
   * undefined treated as unset
   */
  setMediaInputs(audioInput, videoInput) {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      logger.log("MediaHandler setMediaInputs() running (audioInput: ".concat(audioInput, " videoInput: ").concat(videoInput, ")"));
      _this4.audioInput = audioInput;
      _this4.videoInput = videoInput;
      yield _this4.updateLocalUsermediaStreams();
    })();
  }

  /*
   * Requests new usermedia streams and replace the old ones
   */
  updateLocalUsermediaStreams() {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      if (_this5.userMediaStreams.length === 0) return;
      var callMediaStreamParams = new Map();
      for (var call of _this5.client.callEventHandler.calls.values()) {
        callMediaStreamParams.set(call.callId, {
          audio: call.hasLocalUserMediaAudioTrack,
          video: call.hasLocalUserMediaVideoTrack
        });
      }
      for (var stream of _this5.userMediaStreams) {
        logger.log("MediaHandler updateLocalUsermediaStreams() stopping all tracks (streamId=".concat(stream.id, ")"));
        for (var track of stream.getTracks()) {
          track.stop();
        }
      }
      _this5.userMediaStreams = [];
      _this5.localUserMediaStream = undefined;
      for (var _call of _this5.client.callEventHandler.calls.values()) {
        if (_call.callHasEnded() || !callMediaStreamParams.has(_call.callId)) {
          continue;
        }
        var {
          audio,
          video
        } = callMediaStreamParams.get(_call.callId);
        logger.log("MediaHandler updateLocalUsermediaStreams() calling getUserMediaStream() (callId=".concat(_call.callId, ")"));
        var _stream = yield _this5.getUserMediaStream(audio, video);
        if (_call.callHasEnded()) {
          continue;
        }
        yield _call.updateLocalUsermediaStream(_stream);
      }
      for (var groupCall of _this5.client.groupCallEventHandler.groupCalls.values()) {
        if (!groupCall.localCallFeed) {
          continue;
        }
        logger.log("MediaHandler updateLocalUsermediaStreams() calling getUserMediaStream() (groupCallId=".concat(groupCall.groupCallId, ")"));
        var _stream2 = yield _this5.getUserMediaStream(true, groupCall.type === GroupCallType.Video);
        if (groupCall.state === GroupCallState.Ended) {
          continue;
        }
        yield groupCall.updateLocalUsermediaStream(_stream2);
      }
      _this5.emit(MediaHandlerEvent.LocalStreamsChanged);
    })();
  }
  hasAudioDevice() {
    return _asyncToGenerator(function* () {
      try {
        var devices = yield navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => device.kind === "audioinput").length > 0;
      } catch (err) {
        logger.log("MediaHandler hasAudioDevice() calling navigator.mediaDevices.enumerateDevices with error", err);
        return false;
      }
    })();
  }
  hasVideoDevice() {
    return _asyncToGenerator(function* () {
      try {
        var devices = yield navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => device.kind === "videoinput").length > 0;
      } catch (err) {
        logger.log("MediaHandler hasVideoDevice() calling navigator.mediaDevices.enumerateDevices with error", err);
        return false;
      }
    })();
  }

  /**
   * @param audio - should have an audio track
   * @param video - should have a video track
   * @param reusable - is allowed to be reused by the MediaHandler
   * @returns based on passed parameters
   */
  getUserMediaStream(audio, video) {
    var _arguments = arguments,
      _this6 = this;
    return _asyncToGenerator(function* () {
      var reusable = _arguments.length > 2 && _arguments[2] !== undefined ? _arguments[2] : true;
      // Serialise calls, othertwise we can't sensibly re-use the stream
      if (_this6.getMediaStreamPromise) {
        _this6.getMediaStreamPromise = _this6.getMediaStreamPromise.then(() => {
          return _this6.getUserMediaStreamInternal(audio, video, reusable);
        });
      } else {
        _this6.getMediaStreamPromise = _this6.getUserMediaStreamInternal(audio, video, reusable);
      }
      return _this6.getMediaStreamPromise;
    })();
  }
  getUserMediaStreamInternal(audio, video, reusable) {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      var shouldRequestAudio = audio && (yield _this7.hasAudioDevice());
      var shouldRequestVideo = video && (yield _this7.hasVideoDevice());
      var stream;
      var canReuseStream = true;
      if (_this7.localUserMediaStream) {
        var _this7$localUserMedia, _this7$localUserMedia2;
        // This figures out if we can reuse the current localUsermediaStream
        // based on whether or not the "mute state" (presence of tracks of a
        // given kind) matches what is being requested
        if (shouldRequestAudio !== _this7.localUserMediaStream.getAudioTracks().length > 0) {
          canReuseStream = false;
        }
        if (shouldRequestVideo !== _this7.localUserMediaStream.getVideoTracks().length > 0) {
          canReuseStream = false;
        }

        // This code checks that the device ID is the same as the localUserMediaStream stream, but we update
        // the localUserMediaStream whenever the device ID changes (apart from when restoring) so it's not
        // clear why this would ever be different, unless there's a race.
        if (shouldRequestAudio && ((_this7$localUserMedia = _this7.localUserMediaStream.getAudioTracks()[0]) === null || _this7$localUserMedia === void 0 || (_this7$localUserMedia = _this7$localUserMedia.getSettings()) === null || _this7$localUserMedia === void 0 ? void 0 : _this7$localUserMedia.deviceId) !== _this7.audioInput) {
          canReuseStream = false;
        }
        if (shouldRequestVideo && ((_this7$localUserMedia2 = _this7.localUserMediaStream.getVideoTracks()[0]) === null || _this7$localUserMedia2 === void 0 || (_this7$localUserMedia2 = _this7$localUserMedia2.getSettings()) === null || _this7$localUserMedia2 === void 0 ? void 0 : _this7$localUserMedia2.deviceId) !== _this7.videoInput) {
          canReuseStream = false;
        }
      } else {
        canReuseStream = false;
      }
      if (!canReuseStream) {
        var constraints;
        try {
          // Not specifying exact for deviceId means switching devices does not always work,
          // try with exact and fallback to ideal if it fails
          constraints = _this7.getUserMediaContraints(shouldRequestAudio, shouldRequestVideo, true);
          stream = yield navigator.mediaDevices.getUserMedia(constraints);
        } catch (e) {
          logger.warn("MediaHandler getUserMediaStreamInternal() error (e=".concat(e, "), retrying without exact deviceId"));
          constraints = _this7.getUserMediaContraints(shouldRequestAudio, shouldRequestVideo, false);
          stream = yield navigator.mediaDevices.getUserMedia(constraints);
        }
        logger.log("MediaHandler getUserMediaStreamInternal() calling getUserMediaStream (streamId=".concat(stream.id, ", shouldRequestAudio=").concat(shouldRequestAudio, ", shouldRequestVideo=").concat(shouldRequestVideo, ", constraints=").concat(JSON.stringify(constraints), ")"));
        for (var track of stream.getTracks()) {
          var settings = track.getSettings();
          if (track.kind === "audio") {
            _this7.audioInput = settings.deviceId;
          } else if (track.kind === "video") {
            _this7.videoInput = settings.deviceId;
          }
        }
        if (reusable) {
          _this7.localUserMediaStream = stream;
        }
      } else {
        var _this7$localUserMedia3;
        stream = _this7.localUserMediaStream.clone();
        logger.log("MediaHandler getUserMediaStreamInternal() cloning (oldStreamId=".concat((_this7$localUserMedia3 = _this7.localUserMediaStream) === null || _this7$localUserMedia3 === void 0 ? void 0 : _this7$localUserMedia3.id, " newStreamId=").concat(stream.id, " shouldRequestAudio=").concat(shouldRequestAudio, " shouldRequestVideo=").concat(shouldRequestVideo, ")"));
        if (!shouldRequestAudio) {
          for (var _track of stream.getAudioTracks()) {
            stream.removeTrack(_track);
          }
        }
        if (!shouldRequestVideo) {
          for (var _track2 of stream.getVideoTracks()) {
            stream.removeTrack(_track2);
          }
        }
      }
      if (reusable) {
        _this7.userMediaStreams.push(stream);
      }
      _this7.emit(MediaHandlerEvent.LocalStreamsChanged);
      return stream;
    })();
  }

  /**
   * Stops all tracks on the provided usermedia stream
   */
  stopUserMediaStream(mediaStream) {
    logger.log("MediaHandler stopUserMediaStream() stopping (streamId=".concat(mediaStream.id, ")"));
    for (var track of mediaStream.getTracks()) {
      track.stop();
    }
    var index = this.userMediaStreams.indexOf(mediaStream);
    if (index !== -1) {
      logger.debug("MediaHandler stopUserMediaStream() splicing usermedia stream out stream array (streamId=".concat(mediaStream.id, ")"), mediaStream.id);
      this.userMediaStreams.splice(index, 1);
    }
    this.emit(MediaHandlerEvent.LocalStreamsChanged);
    if (this.localUserMediaStream === mediaStream) {
      // if we have this stream cahced, remove it, because we've stopped it
      this.localUserMediaStream = undefined;
    } else {
      // If it's not the same stream. remove any tracks from the cached stream that
      // we have just stopped, and if we do stop any, call the same method on the
      // cached stream too in order to stop all its tracks (in case they are different)
      // and un-cache it.
      for (var _track3 of mediaStream.getTracks()) {
        var _this$localUserMediaS;
        if ((_this$localUserMediaS = this.localUserMediaStream) !== null && _this$localUserMediaS !== void 0 && _this$localUserMediaS.getTrackById(_track3.id)) {
          this.stopUserMediaStream(this.localUserMediaStream);
          break;
        }
      }
    }
  }

  /**
   * @param opts - screensharing stream options
   * @param reusable - is allowed to be reused by the MediaHandler
   * @returns based on passed parameters
   */
  getScreensharingStream() {
    var _arguments2 = arguments,
      _this8 = this;
    return _asyncToGenerator(function* () {
      var opts = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : {};
      var reusable = _arguments2.length > 1 && _arguments2[1] !== undefined ? _arguments2[1] : true;
      var stream;
      if (_this8.screensharingStreams.length === 0) {
        var screenshareConstraints = _this8.getScreenshareContraints(opts);
        if (opts.desktopCapturerSourceId) {
          // We are using Electron
          logger.debug("MediaHandler getScreensharingStream() calling getUserMedia() (opts=".concat(JSON.stringify(opts), ")"));
          stream = yield navigator.mediaDevices.getUserMedia(screenshareConstraints);
        } else {
          // We are not using Electron
          logger.debug("MediaHandler getScreensharingStream() calling getDisplayMedia() (opts=".concat(JSON.stringify(opts), ")"));
          stream = yield navigator.mediaDevices.getDisplayMedia(screenshareConstraints);
        }
      } else {
        var matchingStream = _this8.screensharingStreams[_this8.screensharingStreams.length - 1];
        logger.log("MediaHandler getScreensharingStream() cloning (streamId=".concat(matchingStream.id, ")"));
        stream = matchingStream.clone();
      }
      if (reusable) {
        _this8.screensharingStreams.push(stream);
      }
      _this8.emit(MediaHandlerEvent.LocalStreamsChanged);
      return stream;
    })();
  }

  /**
   * Stops all tracks on the provided screensharing stream
   */
  stopScreensharingStream(mediaStream) {
    logger.debug("MediaHandler stopScreensharingStream() stopping stream (streamId=".concat(mediaStream.id, ")"));
    for (var track of mediaStream.getTracks()) {
      track.stop();
    }
    var index = this.screensharingStreams.indexOf(mediaStream);
    if (index !== -1) {
      logger.debug("MediaHandler stopScreensharingStream() splicing stream out (streamId=".concat(mediaStream.id, ")"));
      this.screensharingStreams.splice(index, 1);
    }
    this.emit(MediaHandlerEvent.LocalStreamsChanged);
  }

  /**
   * Stops all local media tracks
   */
  stopAllStreams() {
    for (var stream of this.userMediaStreams) {
      logger.log("MediaHandler stopAllStreams() stopping (streamId=".concat(stream.id, ")"));
      for (var track of stream.getTracks()) {
        track.stop();
      }
    }
    for (var _stream3 of this.screensharingStreams) {
      for (var _track4 of _stream3.getTracks()) {
        _track4.stop();
      }
    }
    this.userMediaStreams = [];
    this.screensharingStreams = [];
    this.localUserMediaStream = undefined;
    this.emit(MediaHandlerEvent.LocalStreamsChanged);
  }
  getUserMediaContraints(audio, video, exactDeviceId) {
    var isWebkit = !!navigator.webkitGetUserMedia;
    var deviceIdKey = exactDeviceId ? "exact" : "ideal";
    var audioConstraints = {};
    if (this.audioInput) {
      audioConstraints.deviceId = {
        [deviceIdKey]: this.audioInput
      };
    }
    if (this.audioSettings) {
      audioConstraints.autoGainControl = {
        ideal: this.audioSettings.autoGainControl
      };
      audioConstraints.echoCancellation = {
        ideal: this.audioSettings.echoCancellation
      };
      audioConstraints.noiseSuppression = {
        ideal: this.audioSettings.noiseSuppression
      };
    }
    var videoConstraints = {
      /* We want 640x360.  Chrome will give it only if we ask exactly,
         FF refuses entirely if we ask exactly, so have to ask for ideal
         instead
         XXX: Is this still true?
       */
      width: isWebkit ? {
        exact: 640
      } : {
        ideal: 640
      },
      height: isWebkit ? {
        exact: 360
      } : {
        ideal: 360
      }
    };
    if (this.videoInput) {
      videoConstraints.deviceId = {
        [deviceIdKey]: this.videoInput
      };
    }
    return {
      audio: audio ? audioConstraints : false,
      video: video ? videoConstraints : false
    };
  }
  getScreenshareContraints(opts) {
    var {
      desktopCapturerSourceId,
      audio
    } = opts;
    if (desktopCapturerSourceId) {
      return {
        audio: audio !== null && audio !== void 0 ? audio : false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: desktopCapturerSourceId
          }
        }
      };
    } else {
      return {
        audio: audio !== null && audio !== void 0 ? audio : false,
        video: true
      };
    }
  }
}
//# sourceMappingURL=mediaHandler.js.map