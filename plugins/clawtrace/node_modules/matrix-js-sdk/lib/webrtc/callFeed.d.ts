import { SDPStreamMetadataPurpose } from "./callEventTypes.ts";
import { type MatrixClient } from "../client.ts";
import { type RoomMember } from "../models/room-member.ts";
import { TypedEventEmitter } from "../models/typed-event-emitter.ts";
import { type MatrixCall } from "./call.ts";
export declare const SPEAKING_THRESHOLD = -60;
export interface ICallFeedOpts {
    client: MatrixClient;
    roomId?: string;
    userId: string;
    deviceId: string | undefined;
    stream: MediaStream;
    purpose: SDPStreamMetadataPurpose;
    /**
     * Whether or not the remote SDPStreamMetadata says audio is muted
     */
    audioMuted: boolean;
    /**
     * Whether or not the remote SDPStreamMetadata says video is muted
     */
    videoMuted: boolean;
    /**
     * The MatrixCall which is the source of this CallFeed
     */
    call?: MatrixCall;
}
export declare enum CallFeedEvent {
    NewStream = "new_stream",
    MuteStateChanged = "mute_state_changed",
    LocalVolumeChanged = "local_volume_changed",
    VolumeChanged = "volume_changed",
    ConnectedChanged = "connected_changed",
    Speaking = "speaking",
    Disposed = "disposed"
}
type EventHandlerMap = {
    [CallFeedEvent.NewStream]: (stream: MediaStream) => void;
    [CallFeedEvent.MuteStateChanged]: (audioMuted: boolean, videoMuted: boolean) => void;
    [CallFeedEvent.LocalVolumeChanged]: (localVolume: number) => void;
    [CallFeedEvent.VolumeChanged]: (volume: number) => void;
    [CallFeedEvent.ConnectedChanged]: (connected: boolean) => void;
    [CallFeedEvent.Speaking]: (speaking: boolean) => void;
    [CallFeedEvent.Disposed]: () => void;
};
export declare class CallFeed extends TypedEventEmitter<CallFeedEvent, EventHandlerMap> {
    stream: MediaStream;
    sdpMetadataStreamId: string;
    userId: string;
    readonly deviceId: string | undefined;
    purpose: SDPStreamMetadataPurpose;
    speakingVolumeSamples: number[];
    private client;
    private call?;
    private roomId?;
    private audioMuted;
    private videoMuted;
    private localVolume;
    private measuringVolumeActivity;
    private audioContext?;
    private analyser?;
    private frequencyBinCount?;
    private speakingThreshold;
    private speaking;
    private volumeLooperTimeout?;
    private _disposed;
    private _connected;
    constructor(opts: ICallFeedOpts);
    get connected(): boolean;
    private set connected(value);
    get hasAudioTrack(): boolean;
    private updateStream;
    private initVolumeMeasuring;
    private onAddTrack;
    private onCallState;
    /**
     * Returns callRoom member
     * @returns member of the callRoom
     */
    getMember(): RoomMember | null;
    /**
     * Returns true if CallFeed is local, otherwise returns false
     * @returns is local?
     */
    isLocal(): boolean;
    /**
     * Returns true if audio is muted or if there are no audio
     * tracks, otherwise returns false
     * @returns is audio muted?
     */
    isAudioMuted(): boolean;
    /**
     * Returns true video is muted or if there are no video
     * tracks, otherwise returns false
     * @returns is video muted?
     */
    isVideoMuted(): boolean;
    isSpeaking(): boolean;
    /**
     * Replaces the current MediaStream with a new one.
     * The stream will be different and new stream as remote parties are
     * concerned, but this can be used for convenience locally to set up
     * volume listeners automatically on the new stream etc.
     * @param newStream - new stream with which to replace the current one
     */
    setNewStream(newStream: MediaStream): void;
    /**
     * Set one or both of feed's internal audio and video video mute state
     * Either value may be null to leave it as-is
     * @param audioMuted - is the feed's audio muted?
     * @param videoMuted - is the feed's video muted?
     */
    setAudioVideoMuted(audioMuted: boolean | null, videoMuted: boolean | null): void;
    /**
     * Starts emitting volume_changed events where the emitter value is in decibels
     * @param enabled - emit volume changes
     */
    measureVolumeActivity(enabled: boolean): void;
    setSpeakingThreshold(threshold: number): void;
    private volumeLooper;
    clone(): CallFeed;
    dispose(): void;
    get disposed(): boolean;
    private set disposed(value);
    getLocalVolume(): number;
    setLocalVolume(localVolume: number): void;
}
export {};
//# sourceMappingURL=callFeed.d.ts.map