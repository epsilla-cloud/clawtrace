import type * as Lark from "@larksuiteoapi/node-sdk";
import type { OpenClawPluginApi } from "../runtime-api.js";
import type { FeishuToolsConfig, ResolvedFeishuAccount } from "./types.js";
type AccountAwareParams = {
    accountId?: string;
};
export declare function resolveFeishuToolAccount(params: {
    api: Pick<OpenClawPluginApi, "config">;
    executeParams?: AccountAwareParams;
    defaultAccountId?: string;
}): ResolvedFeishuAccount;
export declare function createFeishuToolClient(params: {
    api: Pick<OpenClawPluginApi, "config">;
    executeParams?: AccountAwareParams;
    defaultAccountId?: string;
}): Lark.Client;
export declare function resolveAnyEnabledFeishuToolsConfig(accounts: ResolvedFeishuAccount[]): Required<FeishuToolsConfig>;
export {};
