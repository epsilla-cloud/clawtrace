type InstallScanLogger = {
    warn?: (message: string) => void;
};
export declare function scanBundleInstallSource(params: {
    logger: InstallScanLogger;
    pluginId: string;
    sourceDir: string;
}): Promise<void>;
export declare function scanPackageInstallSource(params: {
    extensions: string[];
    logger: InstallScanLogger;
    packageDir: string;
    pluginId: string;
}): Promise<void>;
export {};
