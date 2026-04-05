type MatrixConversationParams = {
    ctx: {
        MessageThreadId?: string | number | null;
        OriginatingTo?: string;
        To?: string;
    };
    command: {
        to?: string;
    };
};
export declare function resolveMatrixParentConversationId(params: MatrixConversationParams): string | undefined;
export declare function resolveMatrixConversationId(params: MatrixConversationParams): string | undefined;
export {};
