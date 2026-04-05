import type { SandboxBackendCommandParams, SandboxBackendCommandResult } from "./backend.js";
import type { SandboxFsBridge } from "./fs-bridge.js";
import type { SandboxContext } from "./types.js";
export type RemoteShellSandboxHandle = {
    remoteWorkspaceDir: string;
    remoteAgentWorkspaceDir: string;
    runRemoteShellScript(params: SandboxBackendCommandParams): Promise<SandboxBackendCommandResult>;
};
export declare function createRemoteShellSandboxFsBridge(params: {
    sandbox: SandboxContext;
    runtime: RemoteShellSandboxHandle;
}): SandboxFsBridge;
