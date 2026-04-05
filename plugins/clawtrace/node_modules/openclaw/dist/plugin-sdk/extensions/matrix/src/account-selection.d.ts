import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
export declare function resolveMatrixChannelConfig(cfg: OpenClawConfig): Record<string, unknown> | null;
export declare function findMatrixAccountEntry(cfg: OpenClawConfig, accountId: string): Record<string, unknown> | null;
export declare function resolveConfiguredMatrixAccountIds(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): string[];
export declare function resolveMatrixDefaultOrOnlyAccountId(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): string;
export declare function requiresExplicitMatrixDefaultAccount(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): boolean;
