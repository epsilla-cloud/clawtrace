import type { ChannelDirectoryEntry, OpenClawConfig, RuntimeEnv } from "./runtime-api.js";
export type MattermostDirectoryParams = {
    cfg: OpenClawConfig;
    accountId?: string | null;
    query?: string | null;
    limit?: number | null;
    runtime: RuntimeEnv;
};
/**
 * List channels (public + private) visible to any configured bot account.
 *
 * NOTE: Uses per_page=200 which covers most instances. Mattermost does not
 * return a "has more" indicator, so very large instances (200+ channels per bot)
 * may see incomplete results. Pagination can be added if needed.
 */
export declare function listMattermostDirectoryGroups(params: MattermostDirectoryParams): Promise<ChannelDirectoryEntry[]>;
/**
 * List team members as peer directory entries.
 *
 * Uses only the first available client since all bots in a team see the same
 * user list (unlike channels where membership varies). Uses the first team
 * returned — multi-team setups will only see members from that team.
 *
 * NOTE: per_page=200 for member listing; same pagination caveat as groups.
 */
export declare function listMattermostDirectoryPeers(params: MattermostDirectoryParams): Promise<ChannelDirectoryEntry[]>;
