export type Mid = string;
export type Ssrc = string;
export type MapType = "local" | "remote";
export declare class MediaSsrcHandler {
    private readonly ssrcToMid;
    findMidBySsrc(ssrc: Ssrc, type: "local" | "remote"): Mid | undefined;
    parse(description: string, type: MapType): void;
    getSsrcToMidMap(type: MapType): Map<Mid, Ssrc[]>;
}
//# sourceMappingURL=mediaSsrcHandler.d.ts.map