import { type BackoffPolicy, type RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import { type SignalSseEvent } from "./client.js";
type RunSignalSseLoopParams = {
    baseUrl: string;
    account?: string;
    abortSignal?: AbortSignal;
    runtime: RuntimeEnv;
    onEvent: (event: SignalSseEvent) => void;
    policy?: Partial<BackoffPolicy>;
};
export declare function runSignalSseLoop({ baseUrl, account, abortSignal, runtime, onEvent, policy, }: RunSignalSseLoopParams): Promise<void>;
export {};
