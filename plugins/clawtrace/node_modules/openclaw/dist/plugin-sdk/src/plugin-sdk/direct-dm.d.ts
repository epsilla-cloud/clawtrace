import type { FinalizedMsgContext } from "../auto-reply/templating.js";
import type { ChannelId } from "../channels/plugins/types.js";
import type { OpenClawConfig } from "../config/config.js";
import { type DmGroupAccessReasonCode } from "../security/dm-policy-shared.js";
import type { OutboundReplyPayload } from "./reply-payload.js";
export type DirectDmCommandAuthorizationRuntime = {
    shouldComputeCommandAuthorized: (rawBody: string, cfg: OpenClawConfig) => boolean;
    resolveCommandAuthorizedFromAuthorizers: (params: {
        useAccessGroups: boolean;
        authorizers: Array<{
            configured: boolean;
            allowed: boolean;
        }>;
        modeWhenAccessGroupsOff?: "allow" | "deny" | "configured";
    }) => boolean;
};
export type ResolvedInboundDirectDmAccess = {
    access: {
        decision: "allow" | "block" | "pairing";
        reasonCode: DmGroupAccessReasonCode;
        reason: string;
        effectiveAllowFrom: string[];
    };
    shouldComputeAuth: boolean;
    senderAllowedForCommands: boolean;
    commandAuthorized: boolean | undefined;
};
/** Resolve direct-DM policy, effective allowlists, and optional command auth in one place. */
export declare function resolveInboundDirectDmAccessWithRuntime(params: {
    cfg: OpenClawConfig;
    channel: ChannelId;
    accountId: string;
    dmPolicy?: string | null;
    allowFrom?: Array<string | number> | null;
    senderId: string;
    rawBody: string;
    isSenderAllowed: (senderId: string, allowFrom: string[]) => boolean;
    runtime: DirectDmCommandAuthorizationRuntime;
    modeWhenAccessGroupsOff?: "allow" | "deny" | "configured";
    readStoreAllowFrom?: (provider: ChannelId, accountId: string) => Promise<string[]>;
}): Promise<ResolvedInboundDirectDmAccess>;
/** Convert resolved DM policy into a pre-crypto allow/block/pairing callback. */
export declare function createPreCryptoDirectDmAuthorizer(params: {
    resolveAccess: (senderId: string) => Promise<Pick<ResolvedInboundDirectDmAccess, "access"> | ResolvedInboundDirectDmAccess>;
    issuePairingChallenge?: (params: {
        senderId: string;
        reply: (text: string) => Promise<void>;
    }) => Promise<void>;
    onBlocked?: (params: {
        senderId: string;
        reason: string;
        reasonCode: DmGroupAccessReasonCode;
    }) => void;
}): (input: {
    senderId: string;
    reply: (text: string) => Promise<void>;
}) => Promise<"allow" | "block" | "pairing">;
export type DirectDmPreCryptoGuardPolicy = {
    allowedKinds: readonly number[];
    maxFutureSkewSec: number;
    maxCiphertextBytes: number;
    maxPlaintextBytes: number;
    rateLimit: {
        windowMs: number;
        maxPerSenderPerWindow: number;
        maxGlobalPerWindow: number;
        maxTrackedSenderKeys: number;
    };
};
export type DirectDmPreCryptoGuardPolicyOverrides = Partial<Omit<DirectDmPreCryptoGuardPolicy, "rateLimit">> & {
    rateLimit?: Partial<DirectDmPreCryptoGuardPolicy["rateLimit"]>;
};
/** Shared policy object for DM-style pre-crypto guardrails. */
export declare function createDirectDmPreCryptoGuardPolicy(overrides?: DirectDmPreCryptoGuardPolicyOverrides): DirectDmPreCryptoGuardPolicy;
type DirectDmRoutePeer = {
    kind: "direct";
    id: string;
};
type DirectDmRoute = {
    agentId: string;
    sessionKey: string;
    accountId?: string;
};
type DirectDmRuntime = {
    channel: {
        routing: {
            resolveAgentRoute: (params: {
                cfg: OpenClawConfig;
                channel: string;
                accountId: string;
                peer: DirectDmRoutePeer;
            }) => DirectDmRoute;
        };
        session: {
            resolveStorePath: typeof import("../config/sessions.js").resolveStorePath;
            readSessionUpdatedAt: (params: {
                storePath: string;
                sessionKey: string;
            }) => number | undefined;
            recordInboundSession: typeof import("../channels/session.js").recordInboundSession;
        };
        reply: {
            resolveEnvelopeFormatOptions: (cfg: OpenClawConfig) => ReturnType<typeof import("../auto-reply/envelope.js").resolveEnvelopeFormatOptions>;
            formatAgentEnvelope: typeof import("../auto-reply/envelope.js").formatAgentEnvelope;
            finalizeInboundContext: typeof import("../auto-reply/reply/inbound-context.js").finalizeInboundContext;
            dispatchReplyWithBufferedBlockDispatcher: typeof import("../auto-reply/reply/provider-dispatcher.js").dispatchReplyWithBufferedBlockDispatcher;
        };
    };
};
/** Route, envelope, record, and dispatch one direct-DM turn through the standard pipeline. */
export declare function dispatchInboundDirectDmWithRuntime(params: {
    cfg: OpenClawConfig;
    runtime: DirectDmRuntime;
    channel: string;
    channelLabel: string;
    accountId: string;
    peer: DirectDmRoutePeer;
    senderId: string;
    senderAddress: string;
    recipientAddress: string;
    conversationLabel: string;
    rawBody: string;
    messageId: string;
    timestamp?: number;
    commandAuthorized?: boolean;
    bodyForAgent?: string;
    commandBody?: string;
    provider?: string;
    surface?: string;
    originatingChannel?: string;
    originatingTo?: string;
    extraContext?: Record<string, unknown>;
    deliver: (payload: OutboundReplyPayload) => Promise<void>;
    onRecordError: (err: unknown) => void;
    onDispatchError: (err: unknown, info: {
        kind: string;
    }) => void;
}): Promise<{
    route: DirectDmRoute;
    storePath: string;
    ctxPayload: FinalizedMsgContext;
}>;
export {};
