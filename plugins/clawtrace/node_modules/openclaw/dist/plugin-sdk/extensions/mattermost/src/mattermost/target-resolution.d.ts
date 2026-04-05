import type { OpenClawConfig } from "./runtime-api.js";
export type MattermostOpaqueTargetResolution = {
    kind: "user" | "channel";
    id: string;
    to: string;
};
/** Mattermost IDs are 26-character lowercase alphanumeric strings. */
export declare function isMattermostId(value: string): boolean;
export declare function isExplicitMattermostTarget(raw: string): boolean;
export declare function parseMattermostApiStatus(err: unknown): number | undefined;
export declare function resolveMattermostOpaqueTarget(params: {
    input: string;
    cfg?: OpenClawConfig;
    accountId?: string | null;
    token?: string;
    baseUrl?: string;
}): Promise<MattermostOpaqueTargetResolution | null>;
export declare function resetMattermostOpaqueTargetCacheForTests(): void;
