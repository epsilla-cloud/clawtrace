import type { OpenClawConfig } from "../../config/config.js";
import type { SandboxFsBridge } from "./fs-bridge.js";
import type { SandboxRegistryEntry } from "./registry.js";
import type { SandboxConfig, SandboxContext } from "./types.js";
export type SandboxBackendId = string;
export type SandboxBackendExecSpec = {
    argv: string[];
    env: NodeJS.ProcessEnv;
    stdinMode: "pipe-open" | "pipe-closed";
    finalizeToken?: unknown;
};
export type SandboxBackendCommandParams = {
    script: string;
    args?: string[];
    stdin?: Buffer | string;
    allowFailure?: boolean;
    signal?: AbortSignal;
};
export type SandboxBackendCommandResult = {
    stdout: Buffer;
    stderr: Buffer;
    code: number;
};
export type SandboxBackendHandle = {
    id: SandboxBackendId;
    runtimeId: string;
    runtimeLabel: string;
    workdir: string;
    env?: Record<string, string>;
    configLabel?: string;
    configLabelKind?: string;
    capabilities?: {
        browser?: boolean;
    };
    buildExecSpec(params: {
        command: string;
        workdir?: string;
        env: Record<string, string>;
        usePty: boolean;
    }): Promise<SandboxBackendExecSpec>;
    finalizeExec?: (params: {
        status: "completed" | "failed";
        exitCode: number | null;
        timedOut: boolean;
        token?: unknown;
    }) => Promise<void>;
    runShellCommand(params: SandboxBackendCommandParams): Promise<SandboxBackendCommandResult>;
    createFsBridge?: (params: {
        sandbox: SandboxContext;
    }) => SandboxFsBridge;
};
export type SandboxBackendRuntimeInfo = {
    running: boolean;
    actualConfigLabel?: string;
    configLabelMatch: boolean;
};
export type SandboxBackendManager = {
    describeRuntime(params: {
        entry: SandboxRegistryEntry;
        config: OpenClawConfig;
        agentId?: string;
    }): Promise<SandboxBackendRuntimeInfo>;
    removeRuntime(params: {
        entry: SandboxRegistryEntry;
        config: OpenClawConfig;
        agentId?: string;
    }): Promise<void>;
};
export type CreateSandboxBackendParams = {
    sessionKey: string;
    scopeKey: string;
    workspaceDir: string;
    agentWorkspaceDir: string;
    cfg: SandboxConfig;
};
export type SandboxBackendFactory = (params: CreateSandboxBackendParams) => Promise<SandboxBackendHandle>;
export type SandboxBackendRegistration = SandboxBackendFactory | {
    factory: SandboxBackendFactory;
    manager?: SandboxBackendManager;
};
export declare function registerSandboxBackend(id: string, registration: SandboxBackendRegistration): () => void;
export declare function getSandboxBackendFactory(id: string): SandboxBackendFactory | null;
export declare function getSandboxBackendManager(id: string): SandboxBackendManager | null;
export declare function requireSandboxBackendFactory(id: string): SandboxBackendFactory;
