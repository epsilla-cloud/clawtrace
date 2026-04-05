import { type MattermostFetch } from "./client.js";
import type { OpenClawConfig } from "./runtime-api.js";
type Result = {
    ok: true;
} | {
    ok: false;
    error: string;
};
export declare function addMattermostReaction(params: {
    cfg: OpenClawConfig;
    postId: string;
    emojiName: string;
    accountId?: string | null;
    fetchImpl?: MattermostFetch;
}): Promise<Result>;
export declare function removeMattermostReaction(params: {
    cfg: OpenClawConfig;
    postId: string;
    emojiName: string;
    accountId?: string | null;
    fetchImpl?: MattermostFetch;
}): Promise<Result>;
export declare function resetMattermostReactionBotUserCacheForTests(): void;
export {};
