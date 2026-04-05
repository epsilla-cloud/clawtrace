export declare function resolveSlackAutoThreadId(params: {
    to: string;
    toolContext?: {
        currentChannelId?: string;
        currentThreadTs?: string;
        replyToMode?: "off" | "first" | "all";
        hasRepliedRef?: {
            value: boolean;
        };
    };
}): string | undefined;
