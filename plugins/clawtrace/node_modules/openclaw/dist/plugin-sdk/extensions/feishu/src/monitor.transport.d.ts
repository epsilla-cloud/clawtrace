import * as Lark from "@larksuiteoapi/node-sdk";
import { type RuntimeEnv } from "../runtime-api.js";
import type { ResolvedFeishuAccount } from "./types.js";
export type MonitorTransportParams = {
    account: ResolvedFeishuAccount;
    accountId: string;
    runtime?: RuntimeEnv;
    abortSignal?: AbortSignal;
    eventDispatcher: Lark.EventDispatcher;
};
export declare function monitorWebSocket({ account, accountId, runtime, abortSignal, eventDispatcher, }: MonitorTransportParams): Promise<void>;
export declare function monitorWebhook({ account, accountId, runtime, abortSignal, eventDispatcher, }: MonitorTransportParams): Promise<void>;
