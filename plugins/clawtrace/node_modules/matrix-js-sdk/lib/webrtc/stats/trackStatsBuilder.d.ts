import { type MediaTrackStats } from "./media/mediaTrackStats.ts";
import { type TrackSummary } from "./callStatsReportSummary.ts";
export declare class TrackStatsBuilder {
    static buildFramerateResolution(trackStats: MediaTrackStats, now: any): void;
    static calculateSimulcastFramerate(trackStats: MediaTrackStats, now: any, before: any, layer: number): void;
    static buildCodec(report: RTCStatsReport | undefined, trackStats: MediaTrackStats, now: any): void;
    static buildBitrateReceived(trackStats: MediaTrackStats, now: any, before: any): void;
    static buildBitrateSend(trackStats: MediaTrackStats, now: any, before: any): void;
    static buildPacketsLost(trackStats: MediaTrackStats, now: any, before: any): void;
    private static calculateBitrate;
    static setTrackStatsState(trackStats: MediaTrackStats, transceiver: RTCRtpTransceiver | undefined): void;
    static buildTrackSummary(trackStatsList: MediaTrackStats[]): {
        audioTrackSummary: TrackSummary;
        videoTrackSummary: TrackSummary;
    };
    static buildJitter(trackStats: MediaTrackStats, statsReport: any): void;
    static buildAudioConcealment(trackStats: MediaTrackStats, statsReport: any): void;
}
//# sourceMappingURL=trackStatsBuilder.d.ts.map