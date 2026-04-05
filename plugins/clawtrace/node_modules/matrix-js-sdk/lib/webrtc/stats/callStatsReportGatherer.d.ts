import { type StatsReportEmitter } from "./statsReportEmitter.ts";
import { type CallStatsReportSummary } from "./callStatsReportSummary.ts";
export declare class CallStatsReportGatherer {
    readonly callId: string;
    private opponentMemberId;
    private readonly pc;
    private readonly emitter;
    private readonly isFocus;
    private isActive;
    private previousStatsReport;
    private currentStatsReport;
    private readonly connectionStats;
    private readonly trackStats;
    constructor(callId: string, opponentMemberId: string, pc: RTCPeerConnection, emitter: StatsReportEmitter, isFocus?: boolean);
    processStats(groupCallId: string, localUserId: string): Promise<CallStatsReportSummary>;
    private processStatsReport;
    setActive(isActive: boolean): void;
    getActive(): boolean;
    private handleError;
    private processAndEmitConnectionStatsReport;
    stopProcessingStats(): void;
    private onSignalStateChange;
    setOpponentMemberId(id: string): void;
}
//# sourceMappingURL=callStatsReportGatherer.d.ts.map