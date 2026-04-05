import type { ClawdbotConfig } from "../runtime-api.js";
export type FeishuPin = {
    messageId: string;
    chatId?: string;
    operatorId?: string;
    operatorIdType?: string;
    createTime?: string;
};
export declare function createPinFeishu(params: {
    cfg: ClawdbotConfig;
    messageId: string;
    accountId?: string;
}): Promise<FeishuPin | null>;
export declare function removePinFeishu(params: {
    cfg: ClawdbotConfig;
    messageId: string;
    accountId?: string;
}): Promise<void>;
export declare function listPinsFeishu(params: {
    cfg: ClawdbotConfig;
    chatId: string;
    startTime?: string;
    endTime?: string;
    pageSize?: number;
    pageToken?: string;
    accountId?: string;
}): Promise<{
    chatId: string;
    pins: FeishuPin[];
    hasMore: boolean;
    pageToken?: string;
}>;
