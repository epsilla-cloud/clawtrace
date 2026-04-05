import type { IrcClient } from "./client.js";
import type { CoreConfig } from "./types.js";
type SendIrcOptions = {
    cfg?: CoreConfig;
    accountId?: string;
    replyTo?: string;
    target?: string;
    client?: IrcClient;
};
export type SendIrcResult = {
    messageId: string;
    target: string;
};
export declare function sendMessageIrc(to: string, text: string, opts?: SendIrcOptions): Promise<SendIrcResult>;
export {};
