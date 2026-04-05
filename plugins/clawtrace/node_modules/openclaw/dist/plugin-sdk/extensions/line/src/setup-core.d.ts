import type { ChannelSetupAdapter, OpenClawConfig } from "openclaw/plugin-sdk/setup";
import { parseLineAllowFromId } from "./account-helpers.js";
import { listLineAccountIds } from "./setup-runtime-api.js";
export declare function patchLineAccountConfig(params: {
    cfg: OpenClawConfig;
    accountId: string;
    patch: Record<string, unknown>;
    clearFields?: string[];
    enabled?: boolean;
}): OpenClawConfig;
export declare function isLineConfigured(cfg: OpenClawConfig, accountId: string): boolean;
export { parseLineAllowFromId };
export declare const lineSetupAdapter: ChannelSetupAdapter;
export { listLineAccountIds };
