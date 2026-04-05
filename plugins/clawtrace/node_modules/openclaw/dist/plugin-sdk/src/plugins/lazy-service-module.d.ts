type LazyServiceModule = Record<string, unknown>;
export type LazyPluginServiceHandle = {
    stop: () => Promise<void>;
};
export declare function startLazyPluginServiceModule(params: {
    skipEnvVar?: string;
    overrideEnvVar?: string;
    loadDefaultModule: () => Promise<LazyServiceModule>;
    loadOverrideModule?: (specifier: string) => Promise<LazyServiceModule>;
    startExportNames: string[];
    stopExportNames?: string[];
}): Promise<LazyPluginServiceHandle | null>;
export {};
