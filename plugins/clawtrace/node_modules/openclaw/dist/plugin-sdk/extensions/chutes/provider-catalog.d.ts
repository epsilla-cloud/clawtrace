import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
/**
 * Build the Chutes provider with dynamic model discovery.
 * Falls back to the static catalog on failure.
 * Accepts an optional access token (API key or OAuth access token) for authenticated discovery.
 */
export declare function buildChutesProvider(accessToken?: string): Promise<ModelProviderConfig>;
