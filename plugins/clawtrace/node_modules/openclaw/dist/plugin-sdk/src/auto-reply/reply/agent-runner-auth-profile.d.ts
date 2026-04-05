import type { FollowupRun } from "./queue.js";
export declare function resolveProviderScopedAuthProfile(params: {
    provider: string;
    primaryProvider: string;
    authProfileId?: string;
    authProfileIdSource?: "auto" | "user";
}): {
    authProfileId?: string;
    authProfileIdSource?: "auto" | "user";
};
export declare function resolveRunAuthProfile(run: FollowupRun["run"], provider: string): {
    authProfileId?: string;
    authProfileIdSource?: "auto" | "user";
};
