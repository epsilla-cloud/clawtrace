import type { MarkdownTableMode } from "openclaw/plugin-sdk/config-runtime";
import { type ChunkMode } from "openclaw/plugin-sdk/reply-runtime";
import type { ReplyPayload } from "openclaw/plugin-sdk/reply-runtime";
import type { WebInboundMsg } from "./types.js";
export declare function deliverWebReply(params: {
    replyResult: ReplyPayload;
    msg: WebInboundMsg;
    mediaLocalRoots?: readonly string[];
    maxMediaBytes: number;
    textLimit: number;
    chunkMode?: ChunkMode;
    replyLogger: {
        info: (obj: unknown, msg: string) => void;
        warn: (obj: unknown, msg: string) => void;
    };
    connectionId?: string;
    skipLog?: boolean;
    tableMode?: MarkdownTableMode;
}): Promise<void>;
