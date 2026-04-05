import type { BaseTokenResolution } from "openclaw/plugin-sdk/channel-contract";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
export type TelegramTokenSource = "env" | "tokenFile" | "config" | "none";
export type TelegramTokenResolution = BaseTokenResolution & {
    source: TelegramTokenSource;
};
type ResolveTelegramTokenOpts = {
    envToken?: string | null;
    accountId?: string | null;
    logMissingFile?: (message: string) => void;
};
export declare function resolveTelegramToken(cfg?: OpenClawConfig, opts?: ResolveTelegramTokenOpts): TelegramTokenResolution;
export {};
