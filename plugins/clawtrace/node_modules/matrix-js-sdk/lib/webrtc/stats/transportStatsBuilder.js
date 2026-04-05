export class TransportStatsBuilder {
  static buildReport(report, now, conferenceStatsTransport, isFocus) {
    var localUsedCandidate = report === null || report === void 0 ? void 0 : report.get(now.localCandidateId);
    var remoteUsedCandidate = report === null || report === void 0 ? void 0 : report.get(now.remoteCandidateId);

    // RTCIceCandidateStats
    // https://w3c.github.io/webrtc-stats/#icecandidate-dict*
    if (remoteUsedCandidate && localUsedCandidate) {
      var remoteIpAddress = remoteUsedCandidate.ip !== undefined ? remoteUsedCandidate.ip : remoteUsedCandidate.address;
      var remotePort = remoteUsedCandidate.port;
      var ip = "".concat(remoteIpAddress, ":").concat(remotePort);
      var localIpAddress = localUsedCandidate.ip !== undefined ? localUsedCandidate.ip : localUsedCandidate.address;
      var localPort = localUsedCandidate.port;
      var localIp = "".concat(localIpAddress, ":").concat(localPort);
      var type = remoteUsedCandidate.protocol;

      // Save the address unless it has been saved already.
      if (!conferenceStatsTransport.some(t => t.ip === ip && t.type === type && t.localIp === localIp)) {
        conferenceStatsTransport.push({
          ip,
          type,
          localIp,
          isFocus,
          localCandidateType: localUsedCandidate.candidateType,
          remoteCandidateType: remoteUsedCandidate.candidateType,
          networkType: localUsedCandidate.networkType,
          rtt: now.currentRoundTripTime ? now.currentRoundTripTime * 1000 : NaN
        });
      }
    }
    return conferenceStatsTransport;
  }
}
//# sourceMappingURL=transportStatsBuilder.js.map