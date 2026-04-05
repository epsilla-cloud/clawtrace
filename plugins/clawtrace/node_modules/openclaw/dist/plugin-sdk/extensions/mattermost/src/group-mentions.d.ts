import type { ChannelGroupContext } from "./runtime-api.js";
export declare function resolveMattermostGroupRequireMention(params: ChannelGroupContext & {
    requireMentionOverride?: boolean;
}): boolean | undefined;
