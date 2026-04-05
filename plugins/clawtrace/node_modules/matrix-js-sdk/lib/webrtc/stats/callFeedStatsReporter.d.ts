import { type CallFeedReport } from "./statsReport.ts";
import { type CallFeed } from "../callFeed.ts";
export declare class CallFeedStatsReporter {
    static buildCallFeedReport(callId: string, opponentMemberId: string, pc: RTCPeerConnection): CallFeedReport;
    private static buildTrackStats;
    static expandCallFeedReport(report: CallFeedReport, callFeeds: CallFeed[], prefix?: string): CallFeedReport;
}
//# sourceMappingURL=callFeedStatsReporter.d.ts.map