import { TypedEventEmitter } from "../models/typed-event-emitter.ts";
import { CallFeed } from "./callFeed.ts";
import { type MatrixClient } from "../client.ts";
import { CallEvent, type CallEventHandlerMap, type MatrixCall } from "./call.ts";
import { type RoomMember } from "../models/room-member.ts";
import { type Room } from "../models/room.ts";
import { SDPStreamMetadataPurpose } from "./callEventTypes.ts";
import { type IScreensharingOpts } from "./mediaHandler.ts";
import { GroupCallStats } from "./stats/groupCallStats.ts";
import { type ByteSentStatsReport, type CallFeedReport, type ConnectionStatsReport, type SummaryStatsReport } from "./stats/statsReport.ts";
export declare enum GroupCallIntent {
    Ring = "m.ring",
    Prompt = "m.prompt",
    Room = "m.room"
}
export declare enum GroupCallType {
    Video = "m.video",
    Voice = "m.voice"
}
export declare enum GroupCallTerminationReason {
    CallEnded = "call_ended"
}
export type CallsByUserAndDevice = Map<string, Map<string, MatrixCall>>;
/**
 * Because event names are just strings, they do need
 * to be unique over all event types of event emitter.
 * Some objects could emit more then one set of events.
 */
export declare enum GroupCallEvent {
    GroupCallStateChanged = "group_call_state_changed",
    ActiveSpeakerChanged = "active_speaker_changed",
    CallsChanged = "calls_changed",
    UserMediaFeedsChanged = "user_media_feeds_changed",
    ScreenshareFeedsChanged = "screenshare_feeds_changed",
    LocalScreenshareStateChanged = "local_screenshare_state_changed",
    LocalMuteStateChanged = "local_mute_state_changed",
    ParticipantsChanged = "participants_changed",
    Error = "group_call_error"
}
export type GroupCallEventHandlerMap = {
    [GroupCallEvent.GroupCallStateChanged]: (newState: GroupCallState, oldState: GroupCallState) => void;
    [GroupCallEvent.ActiveSpeakerChanged]: (activeSpeaker: CallFeed | undefined) => void;
    [GroupCallEvent.CallsChanged]: (calls: CallsByUserAndDevice) => void;
    [GroupCallEvent.UserMediaFeedsChanged]: (feeds: CallFeed[]) => void;
    [GroupCallEvent.ScreenshareFeedsChanged]: (feeds: CallFeed[]) => void;
    [GroupCallEvent.LocalScreenshareStateChanged]: (isScreensharing: boolean, feed?: CallFeed, sourceId?: string) => void;
    [GroupCallEvent.LocalMuteStateChanged]: (audioMuted: boolean, videoMuted: boolean) => void;
    [GroupCallEvent.ParticipantsChanged]: (participants: Map<RoomMember, Map<string, ParticipantState>>) => void;
    /**
     * Fires whenever an error occurs when call.js encounters an issue with setting up the call.
     * <p>
     * The error given will have a code equal to either `MatrixCall.ERR_LOCAL_OFFER_FAILED` or
     * `MatrixCall.ERR_NO_USER_MEDIA`. `ERR_LOCAL_OFFER_FAILED` is emitted when the local client
     * fails to create an offer. `ERR_NO_USER_MEDIA` is emitted when the user has denied access
     * to their audio/video hardware.
     * @param error - The error raised by MatrixCall.
     * @example
     * ```
     * matrixCall.on("error", function(err){
     *   console.error(err.code, err);
     * });
     * ```
     */
    [GroupCallEvent.Error]: (error: GroupCallError) => void;
};
export declare enum GroupCallStatsReportEvent {
    ConnectionStats = "GroupCall.connection_stats",
    ByteSentStats = "GroupCall.byte_sent_stats",
    SummaryStats = "GroupCall.summary_stats",
    CallFeedStats = "GroupCall.call_feed_stats"
}
/**
 * The final report-events that get consumed by client.
 */
export type GroupCallStatsReportEventHandlerMap = {
    [GroupCallStatsReportEvent.ConnectionStats]: (report: GroupCallStatsReport<ConnectionStatsReport>) => void;
    [GroupCallStatsReportEvent.ByteSentStats]: (report: GroupCallStatsReport<ByteSentStatsReport>) => void;
    [GroupCallStatsReportEvent.SummaryStats]: (report: GroupCallStatsReport<SummaryStatsReport>) => void;
    [GroupCallStatsReportEvent.CallFeedStats]: (report: GroupCallStatsReport<CallFeedReport>) => void;
};
export declare enum GroupCallErrorCode {
    NoUserMedia = "no_user_media",
    UnknownDevice = "unknown_device",
    PlaceCallFailed = "place_call_failed"
}
export interface GroupCallStatsReport<T extends ConnectionStatsReport | ByteSentStatsReport | SummaryStatsReport | CallFeedReport> {
    report: T;
}
export declare class GroupCallError extends Error {
    code: string;
    constructor(code: GroupCallErrorCode, msg: string, err?: Error);
}
export declare class GroupCallUnknownDeviceError extends GroupCallError {
    userId: string;
    constructor(userId: string);
}
export declare class OtherUserSpeakingError extends Error {
    constructor();
}
export interface IGroupCallDataChannelOptions {
    ordered: boolean;
    maxPacketLifeTime: number;
    maxRetransmits: number;
    protocol: string;
}
export interface IGroupCallRoomState {
    "m.intent": GroupCallIntent;
    "m.type": GroupCallType;
    "m.terminated"?: GroupCallTerminationReason;
    "io.element.ptt"?: boolean;
    "dataChannelsEnabled"?: boolean;
    "dataChannelOptions"?: IGroupCallDataChannelOptions;
    "io.element.livekit_service_url"?: string;
}
export interface IGroupCallRoomMemberFeed {
    purpose: SDPStreamMetadataPurpose;
}
export interface IGroupCallRoomMemberDevice {
    device_id: string;
    session_id: string;
    expires_ts: number;
    feeds: IGroupCallRoomMemberFeed[];
}
export interface IGroupCallRoomMemberCallState {
    "m.call_id": string;
    "m.foci"?: string[];
    "m.devices": IGroupCallRoomMemberDevice[];
}
export interface IGroupCallRoomMemberState {
    "m.calls": IGroupCallRoomMemberCallState[];
}
export declare enum GroupCallState {
    LocalCallFeedUninitialized = "local_call_feed_uninitialized",
    InitializingLocalCallFeed = "initializing_local_call_feed",
    LocalCallFeedInitialized = "local_call_feed_initialized",
    Entered = "entered",
    Ended = "ended"
}
export interface ParticipantState {
    sessionId: string;
    screensharing: boolean;
}
export declare class GroupCall extends TypedEventEmitter<GroupCallEvent | CallEvent | GroupCallStatsReportEvent, GroupCallEventHandlerMap & CallEventHandlerMap & GroupCallStatsReportEventHandlerMap> {
    private client;
    room: Room;
    type: GroupCallType;
    isPtt: boolean;
    intent: GroupCallIntent;
    private dataChannelsEnabled?;
    private dataChannelOptions?;
    private useLivekit;
    activeSpeakerInterval: number;
    retryCallInterval: number;
    participantTimeout: number;
    pttMaxTransmitTime: number;
    activeSpeaker?: CallFeed;
    localCallFeed?: CallFeed;
    localScreenshareFeed?: CallFeed;
    localDesktopCapturerSourceId?: string;
    readonly userMediaFeeds: CallFeed[];
    readonly screenshareFeeds: CallFeed[];
    groupCallId: string;
    readonly allowCallWithoutVideoAndAudio: boolean;
    private readonly calls;
    private callHandlers;
    private activeSpeakerLoopInterval?;
    private retryCallLoopInterval?;
    private retryCallCounts;
    private reEmitter;
    private transmitTimer;
    private participantsExpirationTimer;
    private resendMemberStateTimer;
    private initWithAudioMuted;
    private initWithVideoMuted;
    private initCallFeedPromise?;
    private _livekitServiceURL?;
    private stats;
    /**
     * Configure default webrtc stats collection interval in ms
     * Disable collecting webrtc stats by setting interval to 0
     */
    private statsCollectIntervalTime;
    constructor(client: MatrixClient, room: Room, type: GroupCallType, isPtt: boolean, intent: GroupCallIntent, groupCallId?: string, dataChannelsEnabled?: boolean | undefined, dataChannelOptions?: IGroupCallDataChannelOptions | undefined, isCallWithoutVideoAndAudio?: boolean, useLivekit?: boolean, livekitServiceURL?: string);
    private onConnectionStats;
    private onByteSentStats;
    private onSummaryStats;
    private onCallFeedReport;
    create(): Promise<GroupCall>;
    private sendCallStateEvent;
    get livekitServiceURL(): string | undefined;
    updateLivekitServiceURL(newURL: string): Promise<void>;
    private _state;
    /**
     * The group call's state.
     */
    get state(): GroupCallState;
    private set state(value);
    private _participants;
    /**
     * The current participants in the call, as a map from members to device IDs
     * to participant info.
     */
    get participants(): Map<RoomMember, Map<string, ParticipantState>>;
    private set participants(value);
    private _creationTs;
    /**
     * The timestamp at which the call was created, or null if it has not yet
     * been created.
     */
    get creationTs(): number | null;
    private set creationTs(value);
    private _enteredViaAnotherSession;
    /**
     * Whether the local device has entered this call via another session, such
     * as a widget.
     */
    get enteredViaAnotherSession(): boolean;
    set enteredViaAnotherSession(value: boolean);
    /**
     * Executes the given callback on all calls in this group call.
     * @param f - The callback.
     */
    forEachCall(f: (call: MatrixCall) => void): void;
    getLocalFeeds(): CallFeed[];
    hasLocalParticipant(): boolean;
    /**
     * Determines whether the given call is one that we were expecting to exist
     * given our knowledge of who is participating in the group call.
     */
    private callExpected;
    initLocalCallFeed(): Promise<void>;
    private initLocalCallFeedInternal;
    updateLocalUsermediaStream(stream: MediaStream): Promise<void>;
    enter(): Promise<void>;
    private dispose;
    leave(): void;
    terminate(emitStateEvent?: boolean): Promise<void>;
    isLocalVideoMuted(): boolean;
    isMicrophoneMuted(): boolean;
    /**
     * Sets the mute state of the local participants's microphone.
     * @param muted - Whether to mute the microphone
     * @returns Whether muting/unmuting was successful
     */
    setMicrophoneMuted(muted: boolean): Promise<boolean>;
    /**
     * If we allow entering a call without a camera and without video, it can happen that the access rights to the
     * devices have not yet been queried. If a stream does not yet have an audio track, we assume that the rights have
     * not yet been checked.
     *
     * `this.client.getMediaHandler().getUserMediaStream` clones the current stream, so it only wanted to be called when
     * not Audio Track exists.
     * As such, this is a compromise, because, the access rights should always be queried before the call.
     */
    private checkAudioPermissionIfNecessary;
    /**
     * Sets the mute state of the local participants's video.
     * @param muted - Whether to mute the video
     * @returns Whether muting/unmuting was successful
     */
    setLocalVideoMuted(muted: boolean): Promise<boolean>;
    setScreensharingEnabled(enabled: boolean, opts?: IScreensharingOpts): Promise<boolean>;
    isScreensharing(): boolean;
    private onIncomingCall;
    /**
     * Determines whether a given participant expects us to call them (versus
     * them calling us).
     * @param userId - The participant's user ID.
     * @param deviceId - The participant's device ID.
     * @returns Whether we need to place an outgoing call to the participant.
     */
    private wantsOutgoingCall;
    /**
     * Places calls to all participants that we're responsible for calling.
     */
    private placeOutgoingCalls;
    private getMemberStateEvents;
    private onRetryCallLoop;
    private initCall;
    private disposeCall;
    private onCallFeedsChanged;
    private onCallStateChanged;
    private onCallHangup;
    private onCallReplaced;
    getUserMediaFeed(userId: string, deviceId: string): CallFeed | undefined;
    private addUserMediaFeed;
    private replaceUserMediaFeed;
    private removeUserMediaFeed;
    private onActiveSpeakerLoop;
    getScreenshareFeed(userId: string, deviceId: string): CallFeed | undefined;
    private addScreenshareFeed;
    private replaceScreenshareFeed;
    private removeScreenshareFeed;
    /**
     * Recalculates and updates the participant map to match the room state.
     */
    private updateParticipants;
    /**
     * Updates the local user's member state with the devices returned by the given function.
     * @param fn - A function from the current devices to the new devices. If it
     *   returns null, the update will be skipped.
     * @param keepAlive - Whether the request should outlive the window.
     */
    private updateDevices;
    private addDeviceToMemberState;
    private updateMemberState;
    /**
     * Cleans up our member state by filtering out logged out devices, inactive
     * devices, and our own device (if we know we haven't entered).
     */
    cleanMemberState(): Promise<void>;
    private onRoomState;
    private onParticipantsChanged;
    private onStateChanged;
    private onLocalFeedsChanged;
    getGroupCallStats(): GroupCallStats;
    setGroupCallStatsInterval(interval: number): void;
}
//# sourceMappingURL=groupCall.d.ts.map