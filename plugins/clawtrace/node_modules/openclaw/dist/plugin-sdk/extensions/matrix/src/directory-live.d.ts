import type { ChannelDirectoryEntry } from "./runtime-api.js";
type MatrixDirectoryLiveParams = {
    cfg: unknown;
    accountId?: string | null;
    query?: string | null;
    limit?: number | null;
};
export declare function listMatrixDirectoryPeersLive(params: MatrixDirectoryLiveParams): Promise<ChannelDirectoryEntry[]>;
export declare function listMatrixDirectoryGroupsLive(params: MatrixDirectoryLiveParams): Promise<ChannelDirectoryEntry[]>;
export {};
