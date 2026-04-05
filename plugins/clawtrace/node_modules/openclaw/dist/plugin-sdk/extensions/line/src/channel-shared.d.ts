import { type OpenClawConfig, type ResolvedLineAccount } from "../runtime-api.js";
import { parseLineAllowFromId } from "./account-helpers.js";
export declare const lineChannelMeta: {
    readonly id: "line";
    readonly label: "LINE";
    readonly selectionLabel: "LINE (Messaging API)";
    readonly detailLabel: "LINE Bot";
    readonly docsPath: "/channels/line";
    readonly docsLabel: "line";
    readonly blurb: "LINE Messaging API bot for Japan/Taiwan/Thailand markets.";
    readonly systemImage: "message.fill";
};
export declare const lineChannelPluginCommon: {
    meta: {
        quickstartAllowFrom: true;
        id: "line";
        label: "LINE";
        selectionLabel: "LINE (Messaging API)";
        detailLabel: "LINE Bot";
        docsPath: "/channels/line";
        docsLabel: "line";
        blurb: "LINE Messaging API bot for Japan/Taiwan/Thailand markets.";
        systemImage: "message.fill";
    };
    capabilities: {
        chatTypes: ("direct" | "group")[];
        reactions: false;
        threads: false;
        media: true;
        nativeCommands: false;
        blockStreaming: true;
    };
    reload: {
        configPrefixes: string[];
    };
    configSchema: import("openclaw/plugin-sdk").ChannelConfigSchema;
    config: {
        isConfigured: (account: ResolvedLineAccount) => boolean;
        describeAccount: (account: ResolvedLineAccount) => import("../api.js").ChannelAccountSnapshot;
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
};
export declare function isLineConfigured(cfg: OpenClawConfig, accountId: string): boolean;
export { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "../runtime-api.js";
export { parseLineAllowFromId };
