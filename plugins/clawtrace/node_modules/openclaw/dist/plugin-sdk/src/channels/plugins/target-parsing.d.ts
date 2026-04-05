import type { ChatType } from "../chat-type.js";
export type ParsedChannelExplicitTarget = {
    to: string;
    threadId?: string | number;
    chatType?: ChatType;
};
export declare function parseExplicitTargetForChannel(channel: string, rawTarget: string): ParsedChannelExplicitTarget | null;
