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

export class ConnectionStatsReportBuilder {
  static build(stats) {
    var report = {};

    // process stats
    var totalPackets = {
      download: 0,
      upload: 0
    };
    var lostPackets = {
      download: 0,
      upload: 0
    };
    var bitrateDownload = 0;
    var bitrateUpload = 0;
    var resolutions = {
      local: new Map(),
      remote: new Map()
    };
    var framerates = {
      local: new Map(),
      remote: new Map()
    };
    var codecs = {
      local: new Map(),
      remote: new Map()
    };
    var jitter = new Map();
    var audioConcealment = new Map();
    var audioBitrateDownload = 0;
    var audioBitrateUpload = 0;
    var videoBitrateDownload = 0;
    var videoBitrateUpload = 0;
    var totalConcealedAudio = 0;
    var totalAudioDuration = 0;
    for (var [trackId, trackStats] of stats) {
      // process packet loss stats
      var loss = trackStats.getLoss();
      var type = loss.isDownloadStream ? "download" : "upload";
      totalPackets[type] += loss.packetsTotal;
      lostPackets[type] += loss.packetsLost;

      // process bitrate stats
      bitrateDownload += trackStats.getBitrate().download;
      bitrateUpload += trackStats.getBitrate().upload;

      // collect resolutions and framerates
      if (trackStats.kind === "audio") {
        // process audio quality stats
        var audioConcealmentForTrack = trackStats.getAudioConcealment();
        totalConcealedAudio += audioConcealmentForTrack.concealedAudio;
        totalAudioDuration += audioConcealmentForTrack.totalAudioDuration;
        audioBitrateDownload += trackStats.getBitrate().download;
        audioBitrateUpload += trackStats.getBitrate().upload;
      } else {
        videoBitrateDownload += trackStats.getBitrate().download;
        videoBitrateUpload += trackStats.getBitrate().upload;
      }
      resolutions[trackStats.getType()].set(trackId, trackStats.getResolution());
      framerates[trackStats.getType()].set(trackId, trackStats.getFramerate());
      codecs[trackStats.getType()].set(trackId, trackStats.getCodec());
      if (trackStats.getType() === "remote") {
        jitter.set(trackId, trackStats.getJitter());
        if (trackStats.kind === "audio") {
          audioConcealment.set(trackId, trackStats.getAudioConcealment());
        }
      }
      trackStats.resetBitrate();
    }
    report.bitrate = {
      upload: bitrateUpload,
      download: bitrateDownload
    };
    report.bitrate.audio = {
      upload: audioBitrateUpload,
      download: audioBitrateDownload
    };
    report.bitrate.video = {
      upload: videoBitrateUpload,
      download: videoBitrateDownload
    };
    report.packetLoss = {
      total: ConnectionStatsReportBuilder.calculatePacketLoss(lostPackets.download + lostPackets.upload, totalPackets.download + totalPackets.upload),
      download: ConnectionStatsReportBuilder.calculatePacketLoss(lostPackets.download, totalPackets.download),
      upload: ConnectionStatsReportBuilder.calculatePacketLoss(lostPackets.upload, totalPackets.upload)
    };
    report.audioConcealment = audioConcealment;
    report.totalAudioConcealment = {
      concealedAudio: totalConcealedAudio,
      totalAudioDuration
    };
    report.framerate = framerates;
    report.resolution = resolutions;
    report.codec = codecs;
    report.jitter = jitter;
    return report;
  }
  static calculatePacketLoss(lostPackets, totalPackets) {
    if (!totalPackets || totalPackets <= 0 || !lostPackets || lostPackets <= 0) {
      return 0;
    }
    return Math.round(lostPackets / totalPackets * 100);
  }
}
//# sourceMappingURL=connectionStatsReportBuilder.js.map