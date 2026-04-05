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

export class CallFeedStatsReporter {
  static buildCallFeedReport(callId, opponentMemberId, pc) {
    var rtpTransceivers = pc.getTransceivers();
    var transceiver = [];
    var callFeeds = [];
    rtpTransceivers.forEach(t => {
      var _t$sender;
      var sender = (_t$sender = t.sender) !== null && _t$sender !== void 0 && _t$sender.track ? CallFeedStatsReporter.buildTrackStats(t.sender.track, "sender") : null;
      var receiver = CallFeedStatsReporter.buildTrackStats(t.receiver.track, "receiver");
      transceiver.push({
        mid: t.mid == null ? "null" : t.mid,
        direction: t.direction,
        currentDirection: t.currentDirection == null ? "null" : t.currentDirection,
        sender,
        receiver
      });
    });
    return {
      callId,
      opponentMemberId,
      transceiver,
      callFeeds
    };
  }
  static buildTrackStats(track) {
    var _track$getSettings, _track$getConstraints;
    var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "--";
    var settingDeviceId = (_track$getSettings = track.getSettings()) === null || _track$getSettings === void 0 ? void 0 : _track$getSettings.deviceId;
    var constrainDeviceId = (_track$getConstraints = track.getConstraints()) === null || _track$getConstraints === void 0 ? void 0 : _track$getConstraints.deviceId;
    return {
      id: track.id,
      kind: track.kind,
      settingDeviceId: settingDeviceId !== null && settingDeviceId !== void 0 ? settingDeviceId : "unknown",
      constrainDeviceId: constrainDeviceId !== null && constrainDeviceId !== void 0 ? constrainDeviceId : "unknown",
      muted: track.muted,
      enabled: track.enabled,
      readyState: track.readyState,
      label
    };
  }
  static expandCallFeedReport(report, callFeeds) {
    var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "unknown";
    callFeeds.forEach(feed => {
      var audioTracks = feed.stream.getAudioTracks();
      var videoTracks = feed.stream.getVideoTracks();
      var audio = audioTracks.length > 0 ? CallFeedStatsReporter.buildTrackStats(feed.stream.getAudioTracks()[0], feed.purpose) : null;
      var video = videoTracks.length > 0 ? CallFeedStatsReporter.buildTrackStats(feed.stream.getVideoTracks()[0], feed.purpose) : null;
      var feedStats = {
        stream: feed.stream.id,
        type: feed.isLocal() ? "local" : "remote",
        audio,
        video,
        purpose: feed.purpose,
        prefix,
        isVideoMuted: feed.isVideoMuted(),
        isAudioMuted: feed.isAudioMuted()
      };
      report.callFeeds.push(feedStats);
    });
    return report;
  }
}
//# sourceMappingURL=callFeedStatsReporter.js.map