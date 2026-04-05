export declare const FEISHU_CARD_INTERACTION_VERSION = "ocf1";
export type FeishuCardInteractionKind = "button" | "quick" | "meta";
export type FeishuCardInteractionReason = "malformed" | "stale" | "wrong_user" | "wrong_conversation";
export type FeishuCardInteractionMetadata = Record<string, string | number | boolean | null | undefined>;
export type FeishuCardInteractionEnvelope = {
    oc: typeof FEISHU_CARD_INTERACTION_VERSION;
    k: FeishuCardInteractionKind;
    a: string;
    q?: string;
    m?: FeishuCardInteractionMetadata;
    c?: {
        u?: string;
        h?: string;
        s?: string;
        e?: number;
        t?: "p2p" | "group";
    };
};
export type FeishuCardActionEventLike = {
    operator: {
        open_id?: string;
    };
    action: {
        value: unknown;
    };
    context: {
        chat_id?: string;
    };
};
export type DecodedFeishuCardAction = {
    kind: "structured";
    envelope: FeishuCardInteractionEnvelope;
} | {
    kind: "legacy";
    text: string;
} | {
    kind: "invalid";
    reason: FeishuCardInteractionReason;
};
export declare function createFeishuCardInteractionEnvelope(envelope: Omit<FeishuCardInteractionEnvelope, "oc">): FeishuCardInteractionEnvelope;
export declare function buildFeishuCardActionTextFallback(event: FeishuCardActionEventLike): string;
export declare function decodeFeishuCardAction(params: {
    event: FeishuCardActionEventLike;
    now?: number;
}): DecodedFeishuCardAction;
