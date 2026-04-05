import type { OpenClawConfig } from "../config/config.js";
export declare function getDefaultMediaLocalRoots(): readonly string[];
export declare function getAgentScopedMediaLocalRoots(cfg: OpenClawConfig, agentId?: string): readonly string[];
export declare function appendLocalMediaParentRoots(roots: readonly string[], mediaSources?: readonly string[]): string[];
export declare function getAgentScopedMediaLocalRootsForSources(params: {
    cfg: OpenClawConfig;
    agentId?: string;
    mediaSources?: readonly string[];
}): readonly string[];
