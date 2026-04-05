import type { ClawdbotConfig } from "../runtime-api.js";
export declare function resolveFeishuSendTarget(params: {
    cfg: ClawdbotConfig;
    to: string;
    accountId?: string;
}): {
    client: import("@larksuiteoapi/node-sdk").Client;
    receiveId: string;
    receiveIdType: "chat_id" | "user_id" | "open_id";
};
