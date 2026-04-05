import type { StreamFn } from "@mariozechner/pi-agent-core";
import type { OpenClawConfig } from "../../config/config.js";
type CacheRetention = "none" | "short" | "long";
export declare function resolveCacheRetention(extraParams: Record<string, unknown> | undefined, provider: string): CacheRetention | undefined;
export declare function resolveAnthropicBetas(extraParams: Record<string, unknown> | undefined, provider: string, modelId: string): string[] | undefined;
export declare function createAnthropicBetaHeadersWrapper(baseStreamFn: StreamFn | undefined, betas: string[]): StreamFn;
export declare function createAnthropicToolPayloadCompatibilityWrapper(baseStreamFn: StreamFn | undefined, resolverOptions?: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): StreamFn;
export declare function createAnthropicFastModeWrapper(baseStreamFn: StreamFn | undefined, enabled: boolean): StreamFn;
export declare function resolveAnthropicFastMode(extraParams: Record<string, unknown> | undefined): boolean | undefined;
export {};
