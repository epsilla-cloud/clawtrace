import { type ConnectionStatsBandwidth, type ConnectionStatsBitrate, type PacketLoss } from "./connectionStats.ts";
import { type TransportStats } from "./transportStats.ts";
import { type Resolution } from "./media/mediaTrackStats.ts";
export declare enum StatsReport {
    CONNECTION_STATS = "StatsReport.connection_stats",
    CALL_FEED_REPORT = "StatsReport.call_feed_report",
    BYTE_SENT_STATS = "StatsReport.byte_sent_stats",
    SUMMARY_STATS = "StatsReport.summary_stats"
}
export interface ByteSentStatsReport extends Map<TrackID, ByteSend> {
    callId?: string;
    opponentMemberId?: string;
}
export type TrackID = string;
export type ByteSend = number;
export interface ConnectionStatsReport {
    callId?: string;
    opponentMemberId?: string;
    bandwidth: ConnectionStatsBandwidth;
    bitrate: ConnectionStatsBitrate;
    packetLoss: PacketLoss;
    audioConcealment: Map<TrackID, AudioConcealment>;
    totalAudioConcealment: AudioConcealment;
    resolution: ResolutionMap;
    framerate: FramerateMap;
    codec: CodecMap;
    jitter: Map<TrackID, number>;
    transport: TransportStats[];
}
export interface AudioConcealment {
    concealedAudio: number;
    totalAudioDuration: number;
}
export interface ResolutionMap {
    local: Map<TrackID, Resolution>;
    remote: Map<TrackID, Resolution>;
}
export interface FramerateMap {
    local: Map<TrackID, number>;
    remote: Map<TrackID, number>;
}
export interface CodecMap {
    local: Map<TrackID, string>;
    remote: Map<TrackID, string>;
}
export interface SummaryStatsReport {
    /**
     * Aggregated the information for percentage of received media
     *
     * This measure whether the current user receive data from a call participants.
     * As soon as a participant sends at least a byte media to this user, this counts as one measurement unit.
     * The units of measure divided by the total number of participants is a value between 0 and 1.
     */
    percentageReceivedMedia: number;
    percentageReceivedAudioMedia: number;
    percentageReceivedVideoMedia: number;
    maxJitter: number;
    maxPacketLoss: number;
    percentageConcealedAudio: number;
    peerConnections: number;
    opponentUsersInCall?: number;
    opponentDevicesInCall?: number;
    diffDevicesToPeerConnections?: number;
    ratioPeerConnectionToDevices?: number;
}
export interface CallFeedReport {
    callId: string;
    opponentMemberId: string;
    transceiver: TransceiverStats[];
    callFeeds: CallFeedStats[];
}
export interface CallFeedStats {
    stream: string;
    type: "remote" | "local";
    audio: TrackStats | null;
    video: TrackStats | null;
    purpose: string;
    prefix: string;
    isVideoMuted: boolean;
    isAudioMuted: boolean;
}
export interface TransceiverStats {
    readonly mid: string;
    readonly sender: TrackStats | null;
    readonly receiver: TrackStats | null;
    readonly direction: string;
    readonly currentDirection: string;
}
export interface TrackStats {
    readonly id: string;
    readonly kind: "audio" | "video";
    readonly settingDeviceId: string;
    readonly constrainDeviceId: string;
    readonly muted: boolean;
    readonly enabled: boolean;
    readonly readyState: "ended" | "live";
    readonly label: string;
}
//# sourceMappingURL=statsReport.d.ts.map