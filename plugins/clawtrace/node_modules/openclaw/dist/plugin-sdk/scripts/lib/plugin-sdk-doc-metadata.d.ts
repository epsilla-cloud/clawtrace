export type PluginSdkDocCategory = "channel" | "core" | "legacy" | "provider" | "runtime" | "utilities";
export type PluginSdkDocMetadata = {
    category: PluginSdkDocCategory;
};
export declare const pluginSdkDocMetadata: {
    readonly index: {
        readonly category: "legacy";
    };
    readonly "channel-runtime": {
        readonly category: "legacy";
    };
    readonly core: {
        readonly category: "core";
    };
    readonly "plugin-entry": {
        readonly category: "core";
    };
    readonly "channel-actions": {
        readonly category: "channel";
    };
    readonly "channel-config-schema": {
        readonly category: "channel";
    };
    readonly "channel-contract": {
        readonly category: "channel";
    };
    readonly "channel-pairing": {
        readonly category: "channel";
    };
    readonly "channel-reply-pipeline": {
        readonly category: "channel";
    };
    readonly "channel-setup": {
        readonly category: "channel";
    };
    readonly "command-auth": {
        readonly category: "channel";
    };
    readonly "secret-input": {
        readonly category: "channel";
    };
    readonly "webhook-ingress": {
        readonly category: "channel";
    };
    readonly "provider-onboard": {
        readonly category: "provider";
    };
    readonly "runtime-store": {
        readonly category: "runtime";
    };
    readonly "allow-from": {
        readonly category: "utilities";
    };
    readonly "reply-payload": {
        readonly category: "utilities";
    };
    readonly testing: {
        readonly category: "utilities";
    };
};
export type PluginSdkDocEntrypoint = keyof typeof pluginSdkDocMetadata;
export declare const pluginSdkDocCategories: readonly ["core", "channel", "provider", "runtime", "utilities", "legacy"];
export declare const pluginSdkDocEntrypoints: PluginSdkDocEntrypoint[];
export declare function resolvePluginSdkDocImportSpecifier(entrypoint: PluginSdkDocEntrypoint): string;
