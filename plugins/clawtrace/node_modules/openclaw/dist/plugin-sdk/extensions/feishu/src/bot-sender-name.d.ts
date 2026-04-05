import type { ResolvedFeishuAccount } from "./types.js";
export type FeishuPermissionError = {
    code: number;
    message: string;
    grantUrl?: string;
};
type SenderNameResult = {
    name?: string;
    permissionError?: FeishuPermissionError;
};
type FeishuLogger = {
    (...args: unknown[]): void;
};
export declare function resolveFeishuSenderName(params: {
    account: ResolvedFeishuAccount;
    senderId: string;
    log: FeishuLogger;
}): Promise<SenderNameResult>;
export {};
