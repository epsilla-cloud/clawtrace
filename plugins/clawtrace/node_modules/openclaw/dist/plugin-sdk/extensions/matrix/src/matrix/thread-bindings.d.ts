import type { MatrixAuth } from "./client/types.js";
import type { MatrixClient } from "./sdk.js";
import { getMatrixThreadBindingManager, resetMatrixThreadBindingsForTests, setMatrixThreadBindingIdleTimeoutBySessionKey, setMatrixThreadBindingMaxAgeBySessionKey, type MatrixThreadBindingManager } from "./thread-bindings-shared.js";
export declare function createMatrixThreadBindingManager(params: {
    accountId: string;
    auth: MatrixAuth;
    client: MatrixClient;
    env?: NodeJS.ProcessEnv;
    stateDir?: string;
    idleTimeoutMs: number;
    maxAgeMs: number;
    enableSweeper?: boolean;
    logVerboseMessage?: (message: string) => void;
}): Promise<MatrixThreadBindingManager>;
export { getMatrixThreadBindingManager, resetMatrixThreadBindingsForTests, setMatrixThreadBindingIdleTimeoutBySessionKey, setMatrixThreadBindingMaxAgeBySessionKey, };
