import { type AudioConcealment } from "../statsReport.ts";
import { type TrackId } from "./mediaTrackHandler.ts";
export interface PacketLoss {
    packetsTotal: number;
    packetsLost: number;
    isDownloadStream: boolean;
}
export interface Bitrate {
    /**
     * bytes per second
     */
    download: number;
    /**
     * bytes per second
     */
    upload: number;
}
export interface ConcealedAudio {
    /**
     * duration in ms
     */
    duration: number;
    ratio: number;
}
export interface Resolution {
    width: number;
    height: number;
}
export type TrackStatsType = "local" | "remote";
export declare class MediaTrackStats {
    readonly trackId: TrackId;
    readonly type: TrackStatsType;
    readonly kind: "audio" | "video";
    private loss;
    private bitrate;
    private resolution;
    private audioConcealment;
    private framerate;
    private jitter;
    private codec;
    private isAlive;
    private isMuted;
    private isEnabled;
    constructor(trackId: TrackId, type: TrackStatsType, kind: "audio" | "video");
    getType(): TrackStatsType;
    setLoss(loss: PacketLoss): void;
    getLoss(): PacketLoss;
    setResolution(resolution: Resolution): void;
    getResolution(): Resolution;
    setFramerate(framerate: number): void;
    getFramerate(): number;
    setBitrate(bitrate: Bitrate): void;
    getBitrate(): Bitrate;
    setCodec(codecShortType: string): boolean;
    getCodec(): string;
    resetBitrate(): void;
    set alive(isAlive: boolean);
    /**
     * A MediaTrackState is alive if the corresponding MediaStreamTrack track bound to a transceiver and the
     * MediaStreamTrack is in state MediaStreamTrack.readyState === live
     */
    get alive(): boolean;
    set muted(isMuted: boolean);
    /**
     * A MediaTrackState.isMuted corresponding to MediaStreamTrack.muted.
     * But these values only match if MediaTrackState.isAlive.
     */
    get muted(): boolean;
    set enabled(isEnabled: boolean);
    /**
     * A MediaTrackState.isEnabled corresponding to MediaStreamTrack.enabled.
     * But these values only match if MediaTrackState.isAlive.
     */
    get enabled(): boolean;
    setJitter(jitter: number): void;
    /**
     * Jitter in milliseconds
     */
    getJitter(): number;
    /**
     * Audio concealment ration (conceled duration / total duration)
     */
    setAudioConcealment(concealedAudioDuration: number, totalAudioDuration: number): void;
    getAudioConcealment(): AudioConcealment;
}
//# sourceMappingURL=mediaTrackStats.d.ts.map