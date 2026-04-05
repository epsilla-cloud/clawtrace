import { MANIFEST_KEY } from "../compat/legacy-names.js";
import type { PluginConfigUiHint, PluginKind } from "./types.js";
export declare const PLUGIN_MANIFEST_FILENAME = "openclaw.plugin.json";
export declare const PLUGIN_MANIFEST_FILENAMES: readonly ["openclaw.plugin.json"];
export type PluginManifestChannelConfig = {
    schema: Record<string, unknown>;
    uiHints?: Record<string, PluginConfigUiHint>;
    label?: string;
    description?: string;
    preferOver?: string[];
};
export type PluginManifest = {
    id: string;
    configSchema: Record<string, unknown>;
    enabledByDefault?: boolean;
    /** Legacy plugin ids that should normalize to this plugin id. */
    legacyPluginIds?: string[];
    /** Provider ids that should auto-enable this plugin when referenced in auth/config/models. */
    autoEnableWhenConfiguredProviders?: string[];
    kind?: PluginKind;
    channels?: string[];
    providers?: string[];
    /** Cheap startup activation lookup for plugin-owned CLI inference backends. */
    cliBackends?: string[];
    /** Cheap provider-auth env lookup without booting plugin runtime. */
    providerAuthEnvVars?: Record<string, string[]>;
    /**
     * Cheap onboarding/auth-choice metadata used by config validation, CLI help,
     * and non-runtime auth-choice routing before provider runtime loads.
     */
    providerAuthChoices?: PluginManifestProviderAuthChoice[];
    skills?: string[];
    name?: string;
    description?: string;
    version?: string;
    uiHints?: Record<string, PluginConfigUiHint>;
    /**
     * Static capability ownership snapshot used for manifest-driven discovery,
     * compat wiring, and contract coverage without importing plugin runtime.
     */
    contracts?: PluginManifestContracts;
    channelConfigs?: Record<string, PluginManifestChannelConfig>;
};
export type PluginManifestContracts = {
    speechProviders?: string[];
    mediaUnderstandingProviders?: string[];
    imageGenerationProviders?: string[];
    webSearchProviders?: string[];
    tools?: string[];
};
export type PluginManifestProviderAuthChoice = {
    /** Provider id owned by this manifest entry. */
    provider: string;
    /** Provider auth method id that this choice should dispatch to. */
    method: string;
    /** Stable auth-choice id used by onboarding and other CLI auth flows. */
    choiceId: string;
    /** Optional user-facing choice label/hint for grouped onboarding UI. */
    choiceLabel?: string;
    choiceHint?: string;
    /** Legacy choice ids that should point users at this replacement choice. */
    deprecatedChoiceIds?: string[];
    /** Optional grouping metadata for auth-choice pickers. */
    groupId?: string;
    groupLabel?: string;
    groupHint?: string;
    /** Optional CLI flag metadata for one-flag auth flows such as API keys. */
    optionKey?: string;
    cliFlag?: string;
    cliOption?: string;
    cliDescription?: string;
    /**
     * Interactive onboarding surfaces where this auth choice should appear.
     * Defaults to `["text-inference"]` when omitted.
     */
    onboardingScopes?: PluginManifestOnboardingScope[];
};
export type PluginManifestOnboardingScope = "text-inference" | "image-generation";
export type PluginManifestLoadResult = {
    ok: true;
    manifest: PluginManifest;
    manifestPath: string;
} | {
    ok: false;
    error: string;
    manifestPath: string;
};
export declare function resolvePluginManifestPath(rootDir: string): string;
export declare function loadPluginManifest(rootDir: string, rejectHardlinks?: boolean): PluginManifestLoadResult;
export type PluginPackageChannel = {
    id?: string;
    label?: string;
    selectionLabel?: string;
    detailLabel?: string;
    docsPath?: string;
    docsLabel?: string;
    blurb?: string;
    order?: number;
    aliases?: readonly string[];
    preferOver?: readonly string[];
    systemImage?: string;
    selectionDocsPrefix?: string;
    selectionDocsOmitLabel?: boolean;
    selectionExtras?: readonly string[];
    markdownCapable?: boolean;
    showConfigured?: boolean;
    quickstartAllowFrom?: boolean;
    forceAccountBinding?: boolean;
    preferSessionLookupForAnnounceTarget?: boolean;
};
export type PluginPackageInstall = {
    npmSpec?: string;
    localPath?: string;
    defaultChoice?: "npm" | "local";
    minHostVersion?: string;
};
export type OpenClawPackageStartup = {
    /**
     * Opt-in for channel plugins whose `setupEntry` fully covers the gateway
     * startup surface needed before the server starts listening.
     */
    deferConfiguredChannelFullLoadUntilAfterListen?: boolean;
};
export type OpenClawPackageManifest = {
    extensions?: string[];
    setupEntry?: string;
    channel?: PluginPackageChannel;
    install?: PluginPackageInstall;
    startup?: OpenClawPackageStartup;
};
export declare const DEFAULT_PLUGIN_ENTRY_CANDIDATES: readonly ["index.ts", "index.js", "index.mjs", "index.cjs"];
export type PackageExtensionResolution = {
    status: "ok";
    entries: string[];
} | {
    status: "missing";
    entries: [];
} | {
    status: "empty";
    entries: [];
};
export type ManifestKey = typeof MANIFEST_KEY;
export type PackageManifest = {
    name?: string;
    version?: string;
    description?: string;
} & Partial<Record<ManifestKey, OpenClawPackageManifest>>;
export declare function getPackageManifestMetadata(manifest: PackageManifest | undefined): OpenClawPackageManifest | undefined;
export declare function resolvePackageExtensionEntries(manifest: PackageManifest | undefined): PackageExtensionResolution;
