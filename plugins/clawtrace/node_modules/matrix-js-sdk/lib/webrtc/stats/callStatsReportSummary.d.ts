export interface CallStatsReportSummary {
    receivedMedia: number;
    receivedAudioMedia: number;
    receivedVideoMedia: number;
    audioTrackSummary: TrackSummary;
    videoTrackSummary: TrackSummary;
    isFirstCollection: boolean;
}
export interface TrackSummary {
    count: number;
    muted: number;
    maxJitter: number;
    maxPacketLoss: number;
    concealedAudio: number;
    totalAudio: number;
}
//# sourceMappingURL=callStatsReportSummary.d.ts.map