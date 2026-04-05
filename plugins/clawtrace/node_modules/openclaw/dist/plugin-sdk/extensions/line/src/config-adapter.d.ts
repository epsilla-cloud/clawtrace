import { type OpenClawConfig, type ResolvedLineAccount } from "../runtime-api.js";
export declare function normalizeLineAllowFrom(entry: string): string;
export declare const lineConfigAdapter: {
    listAccountIds: (cfg: OpenClawConfig) => string[];
    resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedLineAccount;
    inspectAccount?: ((cfg: OpenClawConfig, accountId?: string | null) => unknown) | undefined;
    defaultAccountId?: ((cfg: OpenClawConfig) => string) | undefined;
    setAccountEnabled?: ((params: {
        cfg: OpenClawConfig;
        accountId: string;
        enabled: boolean;
    }) => OpenClawConfig) | undefined;
    deleteAccount?: ((params: {
        cfg: OpenClawConfig;
        accountId: string;
    }) => OpenClawConfig) | undefined;
    resolveAllowFrom?: ((params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
    }) => Array<string | number> | undefined) | undefined;
    formatAllowFrom?: ((params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        allowFrom: Array<string | number>;
    }) => string[]) | undefined;
    resolveDefaultTo?: ((params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
    }) => string | undefined) | undefined;
};
