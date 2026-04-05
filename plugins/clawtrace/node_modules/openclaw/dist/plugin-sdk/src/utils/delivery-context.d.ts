export type DeliveryContext = {
    channel?: string;
    to?: string;
    accountId?: string;
    threadId?: string | number;
};
export type DeliveryContextSessionSource = {
    channel?: string;
    lastChannel?: string;
    lastTo?: string;
    lastAccountId?: string;
    lastThreadId?: string | number;
    origin?: {
        provider?: string;
        accountId?: string;
        threadId?: string | number;
    };
    deliveryContext?: DeliveryContext;
};
export declare function normalizeDeliveryContext(context?: DeliveryContext): DeliveryContext | undefined;
export declare function formatConversationTarget(params: {
    channel?: string;
    conversationId?: string | number;
    parentConversationId?: string | number;
}): string | undefined;
export declare function resolveConversationDeliveryTarget(params: {
    channel?: string;
    conversationId?: string | number;
    parentConversationId?: string | number;
}): {
    to?: string;
    threadId?: string;
};
export declare function normalizeSessionDeliveryFields(source?: DeliveryContextSessionSource): {
    deliveryContext?: DeliveryContext;
    lastChannel?: string;
    lastTo?: string;
    lastAccountId?: string;
    lastThreadId?: string | number;
};
export declare function deliveryContextFromSession(entry?: DeliveryContextSessionSource): DeliveryContext | undefined;
export declare function mergeDeliveryContext(primary?: DeliveryContext, fallback?: DeliveryContext): DeliveryContext | undefined;
export declare function deliveryContextKey(context?: DeliveryContext): string | undefined;
