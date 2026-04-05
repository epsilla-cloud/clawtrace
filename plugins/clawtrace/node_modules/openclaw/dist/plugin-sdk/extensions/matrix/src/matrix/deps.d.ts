import type { RuntimeEnv } from "../runtime-api.js";
type MatrixCryptoRuntimeDeps = {
    requireFn?: (id: string) => unknown;
    runCommand?: (params: {
        argv: string[];
        cwd: string;
        timeoutMs: number;
        env?: NodeJS.ProcessEnv;
    }) => Promise<CommandResult>;
    resolveFn?: (id: string) => string;
    nodeExecutable?: string;
    log?: (message: string) => void;
};
export declare function isMatrixSdkAvailable(): boolean;
type CommandResult = {
    code: number;
    stdout: string;
    stderr: string;
};
export declare function ensureMatrixCryptoRuntime(params?: MatrixCryptoRuntimeDeps): Promise<void>;
export declare function ensureMatrixSdkInstalled(params: {
    runtime: RuntimeEnv;
    confirm?: (message: string) => Promise<boolean>;
}): Promise<void>;
export {};
