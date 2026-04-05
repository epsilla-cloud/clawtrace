import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import { deleteSlackMessage, downloadSlackFile, editSlackMessage, getSlackMemberInfo, listSlackEmojis, listSlackPins, listSlackReactions, pinSlackMessage, reactSlackMessage, readSlackMessages, removeOwnSlackReactions, removeSlackReaction, sendSlackMessage, unpinSlackMessage } from "./actions.js";
import { parseSlackBlocksInput } from "./blocks-input.js";
import { type OpenClawConfig } from "./runtime-api.js";
import { recordSlackThreadParticipation } from "./sent-thread-cache.js";
export declare const slackActionRuntime: {
    deleteSlackMessage: typeof deleteSlackMessage;
    downloadSlackFile: typeof downloadSlackFile;
    editSlackMessage: typeof editSlackMessage;
    getSlackMemberInfo: typeof getSlackMemberInfo;
    listSlackEmojis: typeof listSlackEmojis;
    listSlackPins: typeof listSlackPins;
    listSlackReactions: typeof listSlackReactions;
    parseSlackBlocksInput: typeof parseSlackBlocksInput;
    pinSlackMessage: typeof pinSlackMessage;
    reactSlackMessage: typeof reactSlackMessage;
    readSlackMessages: typeof readSlackMessages;
    recordSlackThreadParticipation: typeof recordSlackThreadParticipation;
    removeOwnSlackReactions: typeof removeOwnSlackReactions;
    removeSlackReaction: typeof removeSlackReaction;
    sendSlackMessage: typeof sendSlackMessage;
    unpinSlackMessage: typeof unpinSlackMessage;
};
export type SlackActionContext = {
    /** Current channel ID for auto-threading. */
    currentChannelId?: string;
    /** Current thread timestamp for auto-threading. */
    currentThreadTs?: string;
    /** Reply-to mode for auto-threading. */
    replyToMode?: "off" | "first" | "all";
    /** Mutable ref to track if a reply was sent (for "first" mode). */
    hasRepliedRef?: {
        value: boolean;
    };
    /** Allowed local media directories for file uploads. */
    mediaLocalRoots?: readonly string[];
};
export declare function handleSlackAction(params: Record<string, unknown>, cfg: OpenClawConfig, context?: SlackActionContext): Promise<AgentToolResult<unknown>>;
