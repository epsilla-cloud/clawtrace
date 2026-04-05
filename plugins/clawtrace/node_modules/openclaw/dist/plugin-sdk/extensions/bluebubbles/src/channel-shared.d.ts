import { type ResolvedBlueBubblesAccount } from "./accounts.js";
import type { ChannelPlugin } from "./runtime-api.js";
export declare const bluebubblesMeta: {
    id: string;
    label: string;
    selectionLabel: string;
    detailLabel: string;
    docsPath: string;
    docsLabel: string;
    blurb: string;
    systemImage: string;
    aliases: string[];
    order: number;
    preferOver: string[];
};
export declare const bluebubblesCapabilities: ChannelPlugin<ResolvedBlueBubblesAccount>["capabilities"];
export declare const bluebubblesReload: {
    configPrefixes: string[];
};
export declare const bluebubblesConfigSchema: import("openclaw/plugin-sdk").ChannelConfigSchema;
export declare const bluebubblesConfigAdapter: {
    listAccountIds: (cfg: import("./runtime-api.js").OpenClawConfig) => string[];
    resolveAccount: (cfg: import("./runtime-api.js").OpenClawConfig, accountId?: string | null) => ResolvedBlueBubblesAccount;
    inspectAccount?: ((cfg: import("./runtime-api.js").OpenClawConfig, accountId?: string | null) => unknown) | undefined;
    defaultAccountId?: ((cfg: import("./runtime-api.js").OpenClawConfig) => string) | undefined;
    setAccountEnabled?: ((params: {
        cfg: import("./runtime-api.js").OpenClawConfig;
        accountId: string;
        enabled: boolean;
    }) => import("./runtime-api.js").OpenClawConfig) | undefined;
    deleteAccount?: ((params: {
        cfg: import("./runtime-api.js").OpenClawConfig;
        accountId: string;
    }) => import("./runtime-api.js").OpenClawConfig) | undefined;
    resolveAllowFrom?: ((params: {
        cfg: import("./runtime-api.js").OpenClawConfig;
        accountId?: string | null;
    }) => Array<string | number> | undefined) | undefined;
    formatAllowFrom?: ((params: {
        cfg: import("./runtime-api.js").OpenClawConfig;
        accountId?: string | null;
        allowFrom: Array<string | number>;
    }) => string[]) | undefined;
    resolveDefaultTo?: ((params: {
        cfg: import("./runtime-api.js").OpenClawConfig;
        accountId?: string | null;
    }) => string | undefined) | undefined;
};
export declare function describeBlueBubblesAccount(account: ResolvedBlueBubblesAccount): import("./runtime-api.js").ChannelAccountSnapshot;
