import type { ClawdbotConfig } from "../runtime-api.js";
export type FeishuDirectoryPeer = {
    kind: "user";
    id: string;
    name?: string;
};
export type FeishuDirectoryGroup = {
    kind: "group";
    id: string;
    name?: string;
};
export declare function listFeishuDirectoryPeers(params: {
    cfg: ClawdbotConfig;
    query?: string;
    limit?: number;
    accountId?: string;
}): Promise<FeishuDirectoryPeer[]>;
export declare function listFeishuDirectoryGroups(params: {
    cfg: ClawdbotConfig;
    query?: string;
    limit?: number;
    accountId?: string;
}): Promise<FeishuDirectoryGroup[]>;
