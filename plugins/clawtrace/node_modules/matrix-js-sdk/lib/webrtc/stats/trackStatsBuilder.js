import { ValueFormatter } from "./valueFormatter.js";
export class TrackStatsBuilder {
  static buildFramerateResolution(trackStats, now) {
    var resolution = {
      height: now.frameHeight,
      width: now.frameWidth
    };
    var frameRate = now.framesPerSecond;
    if (resolution.height && resolution.width) {
      trackStats.setResolution(resolution);
    }
    trackStats.setFramerate(Math.round(frameRate || 0));
  }
  static calculateSimulcastFramerate(trackStats, now, before, layer) {
    var frameRate = trackStats.getFramerate();
    if (!frameRate) {
      if (before) {
        var timeMs = now.timestamp - before.timestamp;
        if (timeMs > 0 && now.framesSent) {
          var numberOfFramesSinceBefore = now.framesSent - before.framesSent;
          frameRate = numberOfFramesSinceBefore / timeMs * 1000;
        }
      }
      if (!frameRate) {
        return;
      }
    }

    // Reset frame rate to 0 when video is suspended as a result of endpoint falling out of last-n.
    frameRate = layer ? Math.round(frameRate / layer) : 0;
    trackStats.setFramerate(frameRate);
  }
  static buildCodec(report, trackStats, now) {
    var codec = report === null || report === void 0 ? void 0 : report.get(now.codecId);
    if (codec) {
      /**
       * The mime type has the following form: video/VP8 or audio/ISAC,
       * so we what to keep just the type after the '/', audio and video
       * keys will be added on the processing side.
       */
      var codecShortType = codec.mimeType.split("/")[1];
      if (codecShortType) trackStats.setCodec(codecShortType);
    }
  }
  static buildBitrateReceived(trackStats, now, before) {
    trackStats.setBitrate({
      download: TrackStatsBuilder.calculateBitrate(now.bytesReceived, before.bytesReceived, now.timestamp, before.timestamp),
      upload: 0
    });
  }
  static buildBitrateSend(trackStats, now, before) {
    trackStats.setBitrate({
      download: 0,
      upload: this.calculateBitrate(now.bytesSent, before.bytesSent, now.timestamp, before.timestamp)
    });
  }
  static buildPacketsLost(trackStats, now, before) {
    var key = now.type === "outbound-rtp" ? "packetsSent" : "packetsReceived";
    var packetsNow = now[key];
    if (!packetsNow || packetsNow < 0) {
      packetsNow = 0;
    }
    var packetsBefore = ValueFormatter.getNonNegativeValue(before[key]);
    var packetsDiff = Math.max(0, packetsNow - packetsBefore);
    var packetsLostNow = ValueFormatter.getNonNegativeValue(now.packetsLost);
    var packetsLostBefore = ValueFormatter.getNonNegativeValue(before.packetsLost);
    var packetsLostDiff = Math.max(0, packetsLostNow - packetsLostBefore);
    trackStats.setLoss({
      packetsTotal: packetsDiff + packetsLostDiff,
      packetsLost: packetsLostDiff,
      isDownloadStream: now.type !== "outbound-rtp"
    });
  }
  static calculateBitrate(bytesNowAny, bytesBeforeAny, nowTimestamp, beforeTimestamp) {
    var bytesNow = ValueFormatter.getNonNegativeValue(bytesNowAny);
    var bytesBefore = ValueFormatter.getNonNegativeValue(bytesBeforeAny);
    var bytesProcessed = Math.max(0, bytesNow - bytesBefore);
    var timeMs = nowTimestamp - beforeTimestamp;
    var bitrateKbps = 0;
    if (timeMs > 0) {
      bitrateKbps = Math.round(bytesProcessed * 8 / timeMs);
    }
    return bitrateKbps;
  }
  static setTrackStatsState(trackStats, transceiver) {
    var _transceiver$sender;
    if (transceiver === undefined) {
      trackStats.alive = false;
      return;
    }
    var track = trackStats.getType() === "remote" ? transceiver.receiver.track : transceiver === null || transceiver === void 0 || (_transceiver$sender = transceiver.sender) === null || _transceiver$sender === void 0 ? void 0 : _transceiver$sender.track;
    if (track === undefined || track === null) {
      trackStats.alive = false;
      return;
    }
    if (track.readyState === "ended") {
      trackStats.alive = false;
      return;
    }
    trackStats.muted = track.muted;
    trackStats.enabled = track.enabled;
    trackStats.alive = true;
  }
  static buildTrackSummary(trackStatsList) {
    var videoTrackSummary = {
      count: 0,
      muted: 0,
      maxJitter: 0,
      maxPacketLoss: 0,
      concealedAudio: 0,
      totalAudio: 0
    };
    var audioTrackSummary = {
      count: 0,
      muted: 0,
      maxJitter: 0,
      maxPacketLoss: 0,
      concealedAudio: 0,
      totalAudio: 0
    };
    var remoteTrackList = trackStatsList.filter(t => t.getType() === "remote");
    var audioTrackList = remoteTrackList.filter(t => t.kind === "audio");
    remoteTrackList.forEach(stats => {
      var trackSummary = stats.kind === "video" ? videoTrackSummary : audioTrackSummary;
      trackSummary.count++;
      if (stats.alive && stats.muted) {
        trackSummary.muted++;
      }
      if (trackSummary.maxJitter < stats.getJitter()) {
        trackSummary.maxJitter = stats.getJitter();
      }
      if (trackSummary.maxPacketLoss < stats.getLoss().packetsLost) {
        trackSummary.maxPacketLoss = stats.getLoss().packetsLost;
      }
      if (audioTrackList.length > 0) {
        var _stats$getAudioConcea, _stats$getAudioConcea2;
        trackSummary.concealedAudio += (_stats$getAudioConcea = stats.getAudioConcealment()) === null || _stats$getAudioConcea === void 0 ? void 0 : _stats$getAudioConcea.concealedAudio;
        trackSummary.totalAudio += (_stats$getAudioConcea2 = stats.getAudioConcealment()) === null || _stats$getAudioConcea2 === void 0 ? void 0 : _stats$getAudioConcea2.totalAudioDuration;
      }
    });
    return {
      audioTrackSummary,
      videoTrackSummary
    };
  }
  static buildJitter(trackStats, statsReport) {
    if (statsReport.type !== "inbound-rtp") {
      return;
    }
    var jitterStr = statsReport === null || statsReport === void 0 ? void 0 : statsReport.jitter;
    if (jitterStr !== undefined) {
      var jitter = ValueFormatter.getNonNegativeValue(jitterStr);
      trackStats.setJitter(Math.round(jitter * 1000));
    } else {
      trackStats.setJitter(-1);
    }
  }
  static buildAudioConcealment(trackStats, statsReport) {
    if (statsReport.type !== "inbound-rtp") {
      return;
    }
    var msPerSample = 1000 * (statsReport === null || statsReport === void 0 ? void 0 : statsReport.totalSamplesDuration) / (statsReport === null || statsReport === void 0 ? void 0 : statsReport.totalSamplesReceived);
    var concealedAudioDuration = msPerSample * (statsReport === null || statsReport === void 0 ? void 0 : statsReport.concealedSamples);
    var totalAudioDuration = 1000 * (statsReport === null || statsReport === void 0 ? void 0 : statsReport.totalSamplesDuration);
    trackStats.setAudioConcealment(concealedAudioDuration, totalAudioDuration);
  }
}
//# sourceMappingURL=trackStatsBuilder.js.map