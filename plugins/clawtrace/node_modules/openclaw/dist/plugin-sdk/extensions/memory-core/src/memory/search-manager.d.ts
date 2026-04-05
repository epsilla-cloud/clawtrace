import { type OpenClawConfig } from "openclaw/plugin-sdk/memory-core-host-engine-foundation";
import { type MemorySearchManager } from "openclaw/plugin-sdk/memory-core-host-engine-storage";
export type MemorySearchManagerResult = {
    manager: MemorySearchManager | null;
    error?: string;
};
export declare function getMemorySearchManager(params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: "default" | "status";
}): Promise<MemorySearchManagerResult>;
export declare function closeAllMemorySearchManagers(): Promise<void>;
