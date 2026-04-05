export declare function resetWebInboundDedupe(): void;
export declare function isRecentInboundMessage(key: string): boolean;
export declare function rememberRecentOutboundMessage(params: {
    accountId: string;
    remoteJid: string;
    messageId: string;
}): void;
export declare function isRecentOutboundMessage(params: {
    accountId: string;
    remoteJid: string;
    messageId: string;
}): boolean;
