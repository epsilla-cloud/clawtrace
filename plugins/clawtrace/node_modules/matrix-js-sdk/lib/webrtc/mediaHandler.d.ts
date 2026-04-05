import { TypedEventEmitter } from "../models/typed-event-emitter.ts";
import { type MatrixClient } from "../client.ts";
export declare enum MediaHandlerEvent {
    LocalStreamsChanged = "local_streams_changed"
}
export type MediaHandlerEventHandlerMap = {
    [MediaHandlerEvent.LocalStreamsChanged]: () => void;
};
export interface IScreensharingOpts {
    /**
     * sourceId for Electron DesktopCapturer
     */
    desktopCapturerSourceId?: string;
    audio?: boolean;
    throwOnFail?: boolean;
}
export interface AudioSettings {
    autoGainControl: boolean;
    echoCancellation: boolean;
    noiseSuppression: boolean;
}
export declare class MediaHandler extends TypedEventEmitter<MediaHandlerEvent.LocalStreamsChanged, MediaHandlerEventHandlerMap> {
    private client;
    private audioInput?;
    private audioSettings?;
    private videoInput?;
    private localUserMediaStream?;
    userMediaStreams: MediaStream[];
    screensharingStreams: MediaStream[];
    private getMediaStreamPromise?;
    constructor(client: MatrixClient);
    restoreMediaSettings(audioInput: string, videoInput: string): void;
    /**
     * Set an audio input device to use for MatrixCalls
     * @param deviceId - the identifier for the device
     * undefined treated as unset
     */
    setAudioInput(deviceId: string): Promise<void>;
    /**
     * Set audio settings for MatrixCalls
     * @param opts - audio options to set
     */
    setAudioSettings(opts: AudioSettings): Promise<void>;
    /**
     * Set a video input device to use for MatrixCalls
     * @param deviceId - the identifier for the device
     * undefined treated as unset
     */
    setVideoInput(deviceId: string): Promise<void>;
    /**
     * Set media input devices to use for MatrixCalls
     * @param audioInput - the identifier for the audio device
     * @param videoInput - the identifier for the video device
     * undefined treated as unset
     */
    setMediaInputs(audioInput: string, videoInput: string): Promise<void>;
    updateLocalUsermediaStreams(): Promise<void>;
    hasAudioDevice(): Promise<boolean>;
    hasVideoDevice(): Promise<boolean>;
    /**
     * @param audio - should have an audio track
     * @param video - should have a video track
     * @param reusable - is allowed to be reused by the MediaHandler
     * @returns based on passed parameters
     */
    getUserMediaStream(audio: boolean, video: boolean, reusable?: boolean): Promise<MediaStream>;
    private getUserMediaStreamInternal;
    /**
     * Stops all tracks on the provided usermedia stream
     */
    stopUserMediaStream(mediaStream: MediaStream): void;
    /**
     * @param opts - screensharing stream options
     * @param reusable - is allowed to be reused by the MediaHandler
     * @returns based on passed parameters
     */
    getScreensharingStream(opts?: IScreensharingOpts, reusable?: boolean): Promise<MediaStream>;
    /**
     * Stops all tracks on the provided screensharing stream
     */
    stopScreensharingStream(mediaStream: MediaStream): void;
    /**
     * Stops all local media tracks
     */
    stopAllStreams(): void;
    private getUserMediaContraints;
    private getScreenshareContraints;
}
//# sourceMappingURL=mediaHandler.d.ts.map