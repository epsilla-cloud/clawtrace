type InstallScanLogger = {
    warn?: (message: string) => void;
};
export declare function scanBundleInstallSourceRuntime(params: {
    logger: InstallScanLogger;
    pluginId: string;
    sourceDir: string;
}): Promise<void>;
export declare function scanPackageInstallSourceRuntime(params: {
    extensions: string[];
    logger: InstallScanLogger;
    packageDir: string;
    pluginId: string;
}): Promise<void>;
export {};
