import type { ClawdbotConfig } from "../runtime-api.js";
import { type FeishuDirectoryGroup, type FeishuDirectoryPeer } from "./directory.static.js";
export { listFeishuDirectoryGroups, listFeishuDirectoryPeers } from "./directory.static.js";
export declare function listFeishuDirectoryPeersLive(params: {
    cfg: ClawdbotConfig;
    query?: string;
    limit?: number;
    accountId?: string;
    fallbackToStatic?: boolean;
}): Promise<FeishuDirectoryPeer[]>;
export declare function listFeishuDirectoryGroupsLive(params: {
    cfg: ClawdbotConfig;
    query?: string;
    limit?: number;
    accountId?: string;
    fallbackToStatic?: boolean;
}): Promise<FeishuDirectoryGroup[]>;
