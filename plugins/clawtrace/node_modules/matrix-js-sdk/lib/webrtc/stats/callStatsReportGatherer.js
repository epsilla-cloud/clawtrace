import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
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

import { ConnectionStats } from "./connectionStats.js";
import { ConnectionStatsBuilder } from "./connectionStatsBuilder.js";
import { TransportStatsBuilder } from "./transportStatsBuilder.js";
import { MediaSsrcHandler } from "./media/mediaSsrcHandler.js";
import { MediaTrackHandler } from "./media/mediaTrackHandler.js";
import { MediaTrackStatsHandler } from "./media/mediaTrackStatsHandler.js";
import { TrackStatsBuilder } from "./trackStatsBuilder.js";
import { ConnectionStatsReportBuilder } from "./connectionStatsReportBuilder.js";
import { ValueFormatter } from "./valueFormatter.js";
import { logger } from "../../logger.js";
import { CallFeedStatsReporter } from "./callFeedStatsReporter.js";
export class CallStatsReportGatherer {
  constructor(callId, opponentMemberId, pc, emitter) {
    var isFocus = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    this.callId = callId;
    this.opponentMemberId = opponentMemberId;
    this.pc = pc;
    this.emitter = emitter;
    this.isFocus = isFocus;
    _defineProperty(this, "isActive", true);
    _defineProperty(this, "previousStatsReport", void 0);
    _defineProperty(this, "currentStatsReport", void 0);
    _defineProperty(this, "connectionStats", new ConnectionStats());
    _defineProperty(this, "trackStats", void 0);
    pc.addEventListener("signalingstatechange", this.onSignalStateChange.bind(this));
    this.trackStats = new MediaTrackStatsHandler(new MediaSsrcHandler(), new MediaTrackHandler(pc));
  }
  processStats(groupCallId, localUserId) {
    var _this = this;
    return _asyncToGenerator(function* () {
      var summary = {
        isFirstCollection: _this.previousStatsReport === undefined,
        receivedMedia: 0,
        receivedAudioMedia: 0,
        receivedVideoMedia: 0,
        audioTrackSummary: {
          count: 0,
          muted: 0,
          maxPacketLoss: 0,
          maxJitter: 0,
          concealedAudio: 0,
          totalAudio: 0
        },
        videoTrackSummary: {
          count: 0,
          muted: 0,
          maxPacketLoss: 0,
          maxJitter: 0,
          concealedAudio: 0,
          totalAudio: 0
        }
      };
      if (_this.isActive) {
        var statsPromise = _this.pc.getStats();
        if (typeof (statsPromise === null || statsPromise === void 0 ? void 0 : statsPromise.then) === "function") {
          return statsPromise.then(report => {
            var _this$connectionStats, _this$connectionStats2;
            // @ts-ignore
            _this.currentStatsReport = typeof (report === null || report === void 0 ? void 0 : report.result) === "function" ? report.result() : report;
            try {
              _this.processStatsReport(groupCallId, localUserId);
            } catch (error) {
              _this.handleError(error);
              return summary;
            }
            _this.previousStatsReport = _this.currentStatsReport;
            summary.receivedMedia = _this.connectionStats.bitrate.download;
            summary.receivedAudioMedia = ((_this$connectionStats = _this.connectionStats.bitrate.audio) === null || _this$connectionStats === void 0 ? void 0 : _this$connectionStats.download) || 0;
            summary.receivedVideoMedia = ((_this$connectionStats2 = _this.connectionStats.bitrate.video) === null || _this$connectionStats2 === void 0 ? void 0 : _this$connectionStats2.download) || 0;
            var trackSummary = TrackStatsBuilder.buildTrackSummary(Array.from(_this.trackStats.getTrack2stats().values()));
            return _objectSpread(_objectSpread({}, summary), {}, {
              audioTrackSummary: trackSummary.audioTrackSummary,
              videoTrackSummary: trackSummary.videoTrackSummary
            });
          }).catch(error => {
            _this.handleError(error);
            return summary;
          });
        }
        _this.isActive = false;
      }
      return Promise.resolve(summary);
    })();
  }
  processStatsReport(groupCallId, localUserId) {
    var _this$currentStatsRep;
    var byteSentStatsReport = new Map();
    byteSentStatsReport.callId = this.callId;
    byteSentStatsReport.opponentMemberId = this.opponentMemberId;
    (_this$currentStatsRep = this.currentStatsReport) === null || _this$currentStatsRep === void 0 || _this$currentStatsRep.forEach(now => {
      var before = this.previousStatsReport ? this.previousStatsReport.get(now.id) : null;
      // RTCIceCandidatePairStats - https://w3c.github.io/webrtc-stats/#candidatepair-dict*
      if (now.type === "candidate-pair" && now.nominated && now.state === "succeeded") {
        this.connectionStats.bandwidth = ConnectionStatsBuilder.buildBandwidthReport(now);
        this.connectionStats.transport = TransportStatsBuilder.buildReport(this.currentStatsReport, now, this.connectionStats.transport, this.isFocus);

        // RTCReceivedRtpStreamStats
        // https://w3c.github.io/webrtc-stats/#receivedrtpstats-dict*
        // RTCSentRtpStreamStats
        // https://w3c.github.io/webrtc-stats/#sentrtpstats-dict*
      } else if (now.type === "inbound-rtp" || now.type === "outbound-rtp") {
        var trackStats = this.trackStats.findTrack2Stats(now, now.type === "inbound-rtp" ? "remote" : "local");
        if (!trackStats) {
          return;
        }
        if (before) {
          TrackStatsBuilder.buildPacketsLost(trackStats, now, before);
        }

        // Get the resolution and framerate for only remote video sources here. For the local video sources,
        // 'track' stats will be used since they have the updated resolution based on the simulcast streams
        // currently being sent. Promise based getStats reports three 'outbound-rtp' streams and there will be
        // more calculations needed to determine what is the highest resolution stream sent by the client if the
        // 'outbound-rtp' stats are used.
        if (now.type === "inbound-rtp") {
          TrackStatsBuilder.buildFramerateResolution(trackStats, now);
          if (before) {
            TrackStatsBuilder.buildBitrateReceived(trackStats, now, before);
          }
          var ts = this.trackStats.findTransceiverByTrackId(trackStats.trackId);
          TrackStatsBuilder.setTrackStatsState(trackStats, ts);
          TrackStatsBuilder.buildJitter(trackStats, now);
          TrackStatsBuilder.buildAudioConcealment(trackStats, now);
        } else if (before) {
          byteSentStatsReport.set(trackStats.trackId, ValueFormatter.getNonNegativeValue(now.bytesSent));
          TrackStatsBuilder.buildBitrateSend(trackStats, now, before);
        }
        TrackStatsBuilder.buildCodec(this.currentStatsReport, trackStats, now);
      } else if (now.type === "track" && now.kind === "video" && !now.remoteSource) {
        var _trackStats = this.trackStats.findLocalVideoTrackStats(now);
        if (!_trackStats) {
          return;
        }
        TrackStatsBuilder.buildFramerateResolution(_trackStats, now);
        TrackStatsBuilder.calculateSimulcastFramerate(_trackStats, now, before, this.trackStats.mediaTrackHandler.getActiveSimulcastStreams());
      }
    });
    this.emitter.emitByteSendReport(byteSentStatsReport);
    this.emitter.emitCallFeedReport(CallFeedStatsReporter.buildCallFeedReport(this.callId, this.opponentMemberId, this.pc));
    this.processAndEmitConnectionStatsReport();
  }
  setActive(isActive) {
    this.isActive = isActive;
  }
  getActive() {
    return this.isActive;
  }
  handleError(error) {
    this.isActive = false;
    logger.warn("CallStatsReportGatherer ".concat(this.callId, " processStatsReport fails and set to inactive ").concat(error));
  }
  processAndEmitConnectionStatsReport() {
    var report = ConnectionStatsReportBuilder.build(this.trackStats.getTrack2stats());
    report.callId = this.callId;
    report.opponentMemberId = this.opponentMemberId;
    this.connectionStats.bandwidth = report.bandwidth;
    this.connectionStats.bitrate = report.bitrate;
    this.connectionStats.packetLoss = report.packetLoss;
    this.emitter.emitConnectionStatsReport(_objectSpread(_objectSpread({}, report), {}, {
      transport: this.connectionStats.transport
    }));
    this.connectionStats.transport = [];
  }
  stopProcessingStats() {}
  onSignalStateChange() {
    if (this.pc.signalingState === "stable") {
      if (this.pc.currentRemoteDescription) {
        this.trackStats.mediaSsrcHandler.parse(this.pc.currentRemoteDescription.sdp, "remote");
      }
      if (this.pc.currentLocalDescription) {
        this.trackStats.mediaSsrcHandler.parse(this.pc.currentLocalDescription.sdp, "local");
      }
    }
  }
  setOpponentMemberId(id) {
    this.opponentMemberId = id;
  }
}
//# sourceMappingURL=callStatsReportGatherer.js.map