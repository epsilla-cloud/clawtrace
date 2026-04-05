export declare function tryBeginFeishuMessageProcessing(messageId: string | undefined | null, namespace?: string): boolean;
export declare function releaseFeishuMessageProcessing(messageId: string | undefined | null, namespace?: string): void;
export declare function finalizeFeishuMessageProcessing(params: {
    messageId: string | undefined | null;
    namespace?: string;
    log?: (...args: unknown[]) => void;
    claimHeld?: boolean;
}): Promise<boolean>;
export declare function recordProcessedFeishuMessage(messageId: string | undefined | null, namespace?: string, log?: (...args: unknown[]) => void): Promise<boolean>;
export declare function hasProcessedFeishuMessage(messageId: string | undefined | null, namespace?: string, log?: (...args: unknown[]) => void): Promise<boolean>;
/**
 * Synchronous dedup — memory only.
 * Kept for backward compatibility; prefer {@link tryRecordMessagePersistent}.
 */
export declare function tryRecordMessage(messageId: string): boolean;
export declare function hasRecordedMessage(messageId: string): boolean;
export declare function tryRecordMessagePersistent(messageId: string, namespace?: string, log?: (...args: unknown[]) => void): Promise<boolean>;
export declare function hasRecordedMessagePersistent(messageId: string, namespace?: string, log?: (...args: unknown[]) => void): Promise<boolean>;
export declare function warmupDedupFromDisk(namespace: string, log?: (...args: unknown[]) => void): Promise<number>;
