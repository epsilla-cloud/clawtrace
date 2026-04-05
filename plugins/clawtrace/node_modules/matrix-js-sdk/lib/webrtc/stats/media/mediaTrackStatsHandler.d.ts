import { type TrackID } from "../statsReport.ts";
import { MediaTrackStats } from "./mediaTrackStats.ts";
import { type MediaTrackHandler, type TrackId } from "./mediaTrackHandler.ts";
import { type MediaSsrcHandler } from "./mediaSsrcHandler.ts";
export declare class MediaTrackStatsHandler {
    readonly mediaSsrcHandler: MediaSsrcHandler;
    readonly mediaTrackHandler: MediaTrackHandler;
    private readonly track2stats;
    constructor(mediaSsrcHandler: MediaSsrcHandler, mediaTrackHandler: MediaTrackHandler);
    /**
     * Find tracks by rtc stats
     * Argument report is any because the stats api is not consistent:
     * For example `trackIdentifier`, `mid` not existing in every implementations
     * https://www.w3.org/TR/webrtc-stats/#dom-rtcinboundrtpstreamstats
     * https://developer.mozilla.org/en-US/docs/Web/API/RTCInboundRtpStreamStats
     */
    findTrack2Stats(report: any, type: "remote" | "local"): MediaTrackStats | undefined;
    findLocalVideoTrackStats(report: any): MediaTrackStats | undefined;
    getTrack2stats(): Map<TrackID, MediaTrackStats>;
    findTransceiverByTrackId(trackID: TrackId): undefined | RTCRtpTransceiver;
}
//# sourceMappingURL=mediaTrackStatsHandler.d.ts.map