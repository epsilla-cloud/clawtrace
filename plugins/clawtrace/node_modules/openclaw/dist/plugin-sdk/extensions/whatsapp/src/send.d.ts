import { type OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { type PollInput } from "openclaw/plugin-sdk/media-runtime";
export declare function sendMessageWhatsApp(to: string, body: string, options: {
    verbose: boolean;
    cfg?: OpenClawConfig;
    mediaUrl?: string;
    mediaLocalRoots?: readonly string[];
    gifPlayback?: boolean;
    accountId?: string;
}): Promise<{
    messageId: string;
    toJid: string;
}>;
export declare function sendReactionWhatsApp(chatJid: string, messageId: string, emoji: string, options: {
    verbose: boolean;
    fromMe?: boolean;
    participant?: string;
    accountId?: string;
}): Promise<void>;
export declare function sendPollWhatsApp(to: string, poll: PollInput, options: {
    verbose: boolean;
    accountId?: string;
    cfg?: OpenClawConfig;
}): Promise<{
    messageId: string;
    toJid: string;
}>;
