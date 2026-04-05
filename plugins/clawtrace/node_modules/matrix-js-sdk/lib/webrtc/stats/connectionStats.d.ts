import { type TransportStats } from "./transportStats.ts";
import { type Bitrate } from "./media/mediaTrackStats.ts";
export interface ConnectionStatsBandwidth {
    /**
     * bytes per second
     */
    download: number;
    /**
     * bytes per second
     */
    upload: number;
}
export interface ConnectionStatsBitrate extends Bitrate {
    audio?: Bitrate;
    video?: Bitrate;
}
export interface PacketLoss {
    total: number;
    download: number;
    upload: number;
}
export declare class ConnectionStats {
    bandwidth: ConnectionStatsBitrate;
    bitrate: ConnectionStatsBitrate;
    packetLoss: PacketLoss;
    transport: TransportStats[];
}
//# sourceMappingURL=connectionStats.d.ts.map