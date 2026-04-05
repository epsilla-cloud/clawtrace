import { TypedEventEmitter } from "../../models/typed-event-emitter.ts";
import { type ByteSentStatsReport, type CallFeedReport, type ConnectionStatsReport, StatsReport, type SummaryStatsReport } from "./statsReport.ts";
export type StatsReportHandlerMap = {
    [StatsReport.BYTE_SENT_STATS]: (report: ByteSentStatsReport) => void;
    [StatsReport.CONNECTION_STATS]: (report: ConnectionStatsReport) => void;
    [StatsReport.CALL_FEED_REPORT]: (report: CallFeedReport) => void;
    [StatsReport.SUMMARY_STATS]: (report: SummaryStatsReport) => void;
};
export declare class StatsReportEmitter extends TypedEventEmitter<StatsReport, StatsReportHandlerMap> {
    emitByteSendReport(byteSentStats: ByteSentStatsReport): void;
    emitConnectionStatsReport(report: ConnectionStatsReport): void;
    emitCallFeedReport(report: CallFeedReport): void;
    emitSummaryStatsReport(report: SummaryStatsReport): void;
}
//# sourceMappingURL=statsReportEmitter.d.ts.map