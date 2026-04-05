import type { ReplyPayload } from "../../auto-reply/types.js";
import { type InteractiveReply } from "../../interactive/payload.js";
export type NormalizedOutboundPayload = {
    text: string;
    mediaUrls: string[];
    audioAsVoice?: boolean;
    interactive?: InteractiveReply;
    channelData?: Record<string, unknown>;
};
export type OutboundPayloadJson = {
    text: string;
    mediaUrl: string | null;
    mediaUrls?: string[];
    audioAsVoice?: boolean;
    interactive?: InteractiveReply;
    channelData?: Record<string, unknown>;
};
export declare function normalizeReplyPayloadsForDelivery(payloads: readonly ReplyPayload[]): ReplyPayload[];
export declare function normalizeOutboundPayloads(payloads: readonly ReplyPayload[]): NormalizedOutboundPayload[];
export declare function normalizeOutboundPayloadsForJson(payloads: readonly ReplyPayload[]): OutboundPayloadJson[];
export declare function formatOutboundPayloadLog(payload: Pick<NormalizedOutboundPayload, "text" | "channelData"> & {
    mediaUrls: readonly string[];
}): string;
