import type { CoreConfig } from "../types.js";
import type { MatrixClient } from "./sdk.js";
type ResolvedRuntimeMatrixClient = {
    client: MatrixClient;
    stopOnDone: boolean;
    cleanup?: (mode: ResolvedRuntimeMatrixClientStopMode) => Promise<void>;
};
type MatrixRuntimeClientReadiness = "none" | "prepared" | "started";
type ResolvedRuntimeMatrixClientStopMode = "stop" | "persist";
export declare function resolveRuntimeMatrixClientWithReadiness(opts: {
    client?: MatrixClient;
    cfg?: CoreConfig;
    timeoutMs?: number;
    accountId?: string | null;
    readiness?: MatrixRuntimeClientReadiness;
}): Promise<ResolvedRuntimeMatrixClient>;
export declare function stopResolvedRuntimeMatrixClient(resolved: ResolvedRuntimeMatrixClient, mode?: ResolvedRuntimeMatrixClientStopMode): Promise<void>;
export declare function withResolvedRuntimeMatrixClient<T>(opts: {
    client?: MatrixClient;
    cfg?: CoreConfig;
    timeoutMs?: number;
    accountId?: string | null;
    readiness?: MatrixRuntimeClientReadiness;
}, run: (client: MatrixClient) => Promise<T>, stopMode?: ResolvedRuntimeMatrixClientStopMode): Promise<T>;
export {};
