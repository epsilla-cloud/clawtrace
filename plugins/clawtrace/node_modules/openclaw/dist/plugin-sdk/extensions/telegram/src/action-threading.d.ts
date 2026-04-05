export declare function resolveTelegramAutoThreadId(params: {
    to: string;
    toolContext?: {
        currentThreadTs?: string;
        currentChannelId?: string;
    };
}): string | undefined;
