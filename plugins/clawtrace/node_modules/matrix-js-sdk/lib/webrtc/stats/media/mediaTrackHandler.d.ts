export type TrackId = string;
export declare class MediaTrackHandler {
    private readonly pc;
    constructor(pc: RTCPeerConnection);
    getLocalTracks(kind: "audio" | "video"): MediaStreamTrack[];
    getTackById(trackId: string): MediaStreamTrack | undefined;
    getLocalTrackIdByMid(mid: string): string | undefined;
    getRemoteTrackIdByMid(mid: string): string | undefined;
    getActiveSimulcastStreams(): number;
    getTransceiverByTrackId(trackId: TrackId): RTCRtpTransceiver | undefined;
}
//# sourceMappingURL=mediaTrackHandler.d.ts.map