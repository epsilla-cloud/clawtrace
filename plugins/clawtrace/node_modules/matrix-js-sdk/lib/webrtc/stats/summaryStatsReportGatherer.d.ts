import { type StatsReportEmitter } from "./statsReportEmitter.ts";
import { type CallStatsReportSummary } from "./callStatsReportSummary.ts";
import { type SummaryStatsReport } from "./statsReport.ts";
import { type ParticipantState } from "../groupCall.ts";
import { type RoomMember } from "../../matrix.ts";
export declare class SummaryStatsReportGatherer {
    private emitter;
    constructor(emitter: StatsReportEmitter);
    build(allSummary: CallStatsReportSummary[]): void;
    static extendSummaryReport(report: SummaryStatsReport, callParticipants: Map<RoomMember, Map<string, ParticipantState>>): void;
    private countTrackListReceivedMedia;
    private buildMaxJitter;
    private buildMaxPacketLoss;
    private countConcealedAudio;
}
//# sourceMappingURL=summaryStatsReportGatherer.d.ts.map