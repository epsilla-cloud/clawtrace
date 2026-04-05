import type { OpenClawConfig } from "../../config/config.js";
import type { ConversationRef } from "../../infra/outbound/session-binding-service.js";
import type { ResolvedAgentRoute } from "../../routing/resolve-route.js";
import type { ConfiguredBindingResolution } from "./binding-types.js";
export type ConfiguredBindingRouteResult = {
    bindingResolution: ConfiguredBindingResolution | null;
    route: ResolvedAgentRoute;
    boundSessionKey?: string;
    boundAgentId?: string;
};
type ConfiguredBindingRouteConversationInput = {
    conversation: ConversationRef;
} | {
    channel: string;
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
};
export declare function resolveConfiguredBindingRoute(params: {
    cfg: OpenClawConfig;
    route: ResolvedAgentRoute;
} & ConfiguredBindingRouteConversationInput): ConfiguredBindingRouteResult;
export declare function ensureConfiguredBindingRouteReady(params: {
    cfg: OpenClawConfig;
    bindingResolution: ConfiguredBindingResolution | null;
}): Promise<{
    ok: true;
} | {
    ok: false;
    error: string;
}>;
export {};
