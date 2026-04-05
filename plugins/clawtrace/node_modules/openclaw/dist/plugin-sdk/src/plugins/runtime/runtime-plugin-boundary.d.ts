import { createJiti } from "jiti";
type PluginRuntimeRecord = {
    origin?: string;
    rootDir?: string;
    source: string;
};
export declare function readPluginBoundaryConfigSafely(): import("../../config/types.openclaw.ts").OpenClawConfig;
export declare function resolvePluginRuntimeRecord(pluginId: string, onMissing?: () => never): PluginRuntimeRecord | null;
export declare function resolvePluginRuntimeModulePath(record: Pick<PluginRuntimeRecord, "rootDir" | "source">, entryBaseName: string, onMissing?: () => never): string | null;
export declare function getPluginBoundaryJiti(modulePath: string, loaders: Map<boolean, ReturnType<typeof createJiti>>): import("jiti").Jiti;
export declare function loadPluginBoundaryModuleWithJiti<TModule>(modulePath: string, loaders: Map<boolean, ReturnType<typeof createJiti>>): TModule;
export {};
