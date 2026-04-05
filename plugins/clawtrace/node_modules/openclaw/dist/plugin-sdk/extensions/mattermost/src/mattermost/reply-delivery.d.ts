import { type OpenClawConfig, type PluginRuntime, type ReplyPayload } from "./runtime-api.js";
type MarkdownTableMode = Parameters<PluginRuntime["channel"]["text"]["convertMarkdownTables"]>[1];
type SendMattermostMessage = (to: string, text: string, opts: {
    cfg?: OpenClawConfig;
    accountId?: string;
    mediaUrl?: string;
    mediaLocalRoots?: readonly string[];
    replyToId?: string;
}) => Promise<unknown>;
export declare function deliverMattermostReplyPayload(params: {
    core: PluginRuntime;
    cfg: OpenClawConfig;
    payload: ReplyPayload;
    to: string;
    accountId: string;
    agentId?: string;
    replyToId?: string;
    textLimit: number;
    tableMode: MarkdownTableMode;
    sendMessage: SendMattermostMessage;
}): Promise<void>;
export {};
