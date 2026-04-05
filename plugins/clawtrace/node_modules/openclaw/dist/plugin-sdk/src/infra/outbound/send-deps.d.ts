type LegacyOutboundSendDeps = {
    sendWhatsApp?: unknown;
    sendTelegram?: unknown;
    sendDiscord?: unknown;
    sendSlack?: unknown;
    sendSignal?: unknown;
    sendIMessage?: unknown;
    sendMatrix?: unknown;
    sendMSTeams?: unknown;
};
/**
 * Dynamic bag of per-channel send functions, keyed by channel ID.
 * Each outbound adapter resolves its own function from this record and
 * falls back to a direct import when the key is absent.
 */
export type OutboundSendDeps = LegacyOutboundSendDeps & {
    [channelId: string]: unknown;
};
declare const LEGACY_SEND_DEP_KEYS: {
    readonly whatsapp: "sendWhatsApp";
    readonly telegram: "sendTelegram";
    readonly discord: "sendDiscord";
    readonly slack: "sendSlack";
    readonly signal: "sendSignal";
    readonly imessage: "sendIMessage";
    readonly matrix: "sendMatrix";
    readonly msteams: "sendMSTeams";
};
export declare function resolveOutboundSendDep<T>(deps: OutboundSendDeps | null | undefined, channelId: keyof typeof LEGACY_SEND_DEP_KEYS): T | undefined;
export {};
