import type { CoreConfig } from "../../types.js";
import type { MatrixClient } from "../sdk.js";
import type { MatrixAuth } from "./types.js";
export declare function resolveSharedMatrixClient(params?: {
    cfg?: CoreConfig;
    env?: NodeJS.ProcessEnv;
    timeoutMs?: number;
    auth?: MatrixAuth;
    startClient?: boolean;
    accountId?: string | null;
}): Promise<MatrixClient>;
export declare function acquireSharedMatrixClient(params?: {
    cfg?: CoreConfig;
    env?: NodeJS.ProcessEnv;
    timeoutMs?: number;
    auth?: MatrixAuth;
    startClient?: boolean;
    accountId?: string | null;
}): Promise<MatrixClient>;
export declare function stopSharedClient(): void;
export declare function stopSharedClientForAccount(auth: MatrixAuth): void;
export declare function removeSharedClientInstance(client: MatrixClient): boolean;
export declare function stopSharedClientInstance(client: MatrixClient): void;
export declare function releaseSharedClientInstance(client: MatrixClient, mode?: "stop" | "persist"): Promise<boolean>;
