export declare const pluginSdkEntrypoints: string[];
export declare const pluginSdkSubpaths: string[];
/** Map every SDK entrypoint name to its source file path inside the repo. */
export declare function buildPluginSdkEntrySources(entries?: readonly string[]): {
    [k: string]: string;
};
/** List the public package specifiers that should resolve to plugin SDK entrypoints. */
export declare function buildPluginSdkSpecifiers(): string[];
/** Build the package.json exports map for all plugin SDK subpaths. */
export declare function buildPluginSdkPackageExports(): {
    [k: string]: {
        types: string;
        default: string;
    };
};
/** List the dist artifacts expected for every generated plugin SDK entrypoint. */
export declare function listPluginSdkDistArtifacts(): string[];
