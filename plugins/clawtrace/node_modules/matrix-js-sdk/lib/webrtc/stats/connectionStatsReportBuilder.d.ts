import { type ConnectionStatsReport, type TrackID } from "./statsReport.ts";
import { type MediaTrackStats } from "./media/mediaTrackStats.ts";
export declare class ConnectionStatsReportBuilder {
    static build(stats: Map<TrackID, MediaTrackStats>): ConnectionStatsReport;
    private static calculatePacketLoss;
}
//# sourceMappingURL=connectionStatsReportBuilder.d.ts.map