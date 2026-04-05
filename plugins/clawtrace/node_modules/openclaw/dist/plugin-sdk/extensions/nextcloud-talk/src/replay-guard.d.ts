export type NextcloudTalkReplayGuardOptions = {
    stateDir: string;
    ttlMs?: number;
    memoryMaxSize?: number;
    fileMaxEntries?: number;
    onDiskError?: (error: unknown) => void;
};
export type NextcloudTalkReplayGuard = {
    shouldProcessMessage: (params: {
        accountId: string;
        roomToken: string;
        messageId: string;
    }) => Promise<boolean>;
};
export declare function createNextcloudTalkReplayGuard(options: NextcloudTalkReplayGuardOptions): NextcloudTalkReplayGuard;
