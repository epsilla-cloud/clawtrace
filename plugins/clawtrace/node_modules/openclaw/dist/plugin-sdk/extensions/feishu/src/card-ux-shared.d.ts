import type { FeishuCardInteractionEnvelope } from "./card-interaction.js";
export declare function buildFeishuCardButton(params: {
    label: string;
    value: FeishuCardInteractionEnvelope;
    type?: "default" | "primary" | "danger";
}): {
    tag: string;
    text: {
        tag: string;
        content: string;
    };
    type: "primary" | "danger" | "default";
    value: FeishuCardInteractionEnvelope;
};
export declare function buildFeishuCardInteractionContext(params: {
    operatorOpenId: string;
    chatId?: string;
    expiresAt: number;
    chatType?: "p2p" | "group";
    sessionKey?: string;
}): {
    t?: "group" | "p2p" | undefined;
    e: number;
    s?: string | undefined;
    h?: string | undefined;
    u: string;
};
