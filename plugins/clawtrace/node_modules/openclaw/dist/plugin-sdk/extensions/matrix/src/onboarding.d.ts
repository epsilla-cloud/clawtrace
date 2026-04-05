import { type ChannelSetupDmPolicy } from "openclaw/plugin-sdk/setup";
import { type RuntimeEnv, type WizardPrompter } from "./runtime-api.js";
import type { CoreConfig } from "./types.js";
declare const channel: "matrix";
type MatrixOnboardingStatus = {
    channel: typeof channel;
    configured: boolean;
    statusLines: string[];
    selectionHint?: string;
    quickstartScore?: number;
};
type MatrixAccountOverrides = Partial<Record<typeof channel, string>>;
type MatrixOnboardingConfigureContext = {
    cfg: CoreConfig;
    runtime: RuntimeEnv;
    prompter: WizardPrompter;
    options?: unknown;
    forceAllowFrom: boolean;
    accountOverrides: MatrixAccountOverrides;
    shouldPromptAccountIds: boolean;
};
type MatrixOnboardingInteractiveContext = MatrixOnboardingConfigureContext & {
    configured: boolean;
    label?: string;
};
type MatrixOnboardingAdapter = {
    channel: typeof channel;
    getStatus: (ctx: {
        cfg: CoreConfig;
        options?: unknown;
        accountOverrides: MatrixAccountOverrides;
    }) => Promise<MatrixOnboardingStatus>;
    configure: (ctx: MatrixOnboardingConfigureContext) => Promise<{
        cfg: CoreConfig;
        accountId?: string;
    }>;
    configureInteractive?: (ctx: MatrixOnboardingInteractiveContext) => Promise<{
        cfg: CoreConfig;
        accountId?: string;
    } | "skip">;
    afterConfigWritten?: (ctx: {
        previousCfg: CoreConfig;
        cfg: CoreConfig;
        accountId: string;
        runtime: RuntimeEnv;
    }) => Promise<void> | void;
    dmPolicy?: ChannelSetupDmPolicy;
    disable?: (cfg: CoreConfig) => CoreConfig;
};
export declare const matrixOnboardingAdapter: MatrixOnboardingAdapter;
export {};
