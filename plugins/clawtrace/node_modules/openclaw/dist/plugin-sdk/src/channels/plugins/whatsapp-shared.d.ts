import type { PluginRuntimeChannel } from "../../plugins/runtime/types-channel.js";
import type { ChannelOutboundAdapter } from "./types.js";
export declare const WHATSAPP_GROUP_INTRO_HINT = "WhatsApp IDs: SenderId is the participant JID (group participant id).";
export declare function resolveWhatsAppGroupIntroHint(): string;
export declare function resolveWhatsAppMentionStripRegexes(ctx: {
    To?: string | null;
}): RegExp[];
type WhatsAppChunker = NonNullable<ChannelOutboundAdapter["chunker"]>;
type WhatsAppSendMessage = PluginRuntimeChannel["whatsapp"]["sendMessageWhatsApp"];
type WhatsAppSendPoll = PluginRuntimeChannel["whatsapp"]["sendPollWhatsApp"];
type CreateWhatsAppOutboundBaseParams = {
    chunker: WhatsAppChunker;
    sendMessageWhatsApp: WhatsAppSendMessage;
    sendPollWhatsApp: WhatsAppSendPoll;
    shouldLogVerbose: () => boolean;
    resolveTarget: ChannelOutboundAdapter["resolveTarget"];
    normalizeText?: (text: string | undefined) => string;
    skipEmptyText?: boolean;
};
export declare function createWhatsAppOutboundBase({ chunker, sendMessageWhatsApp, sendPollWhatsApp, shouldLogVerbose, resolveTarget, normalizeText, skipEmptyText, }: CreateWhatsAppOutboundBaseParams): Pick<ChannelOutboundAdapter, "deliveryMode" | "chunker" | "chunkerMode" | "textChunkLimit" | "pollMaxOptions" | "resolveTarget" | "sendText" | "sendMedia" | "sendPoll">;
export {};
