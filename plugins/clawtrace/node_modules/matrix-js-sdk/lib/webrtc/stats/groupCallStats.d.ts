import { CallStatsReportGatherer } from "./callStatsReportGatherer.ts";
import { StatsReportEmitter } from "./statsReportEmitter.ts";
export declare class GroupCallStats {
    private groupCallId;
    private userId;
    private interval;
    private timer;
    private readonly gatherers;
    readonly reports: StatsReportEmitter;
    private readonly summaryStatsReportGatherer;
    constructor(groupCallId: string, userId: string, interval?: number);
    start(): void;
    stop(): void;
    hasStatsReportGatherer(callId: string): boolean;
    addStatsReportGatherer(callId: string, opponentMemberId: string, peerConnection: RTCPeerConnection): boolean;
    removeStatsReportGatherer(callId: string): boolean;
    getStatsReportGatherer(callId: string): CallStatsReportGatherer | undefined;
    updateOpponentMember(callId: string, opponentMember: string): void;
    private processStats;
    setInterval(interval: number): void;
}
//# sourceMappingURL=groupCallStats.d.ts.map