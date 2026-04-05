import { type NpmIntegrityDrift, type NpmSpecResolution } from "../infra/install-source-utils.js";
type PluginInstallLogger = {
    info?: (message: string) => void;
    warn?: (message: string) => void;
};
export declare const PLUGIN_INSTALL_ERROR_CODE: {
    readonly INVALID_NPM_SPEC: "invalid_npm_spec";
    readonly INVALID_MIN_HOST_VERSION: "invalid_min_host_version";
    readonly UNKNOWN_HOST_VERSION: "unknown_host_version";
    readonly INCOMPATIBLE_HOST_VERSION: "incompatible_host_version";
    readonly MISSING_OPENCLAW_EXTENSIONS: "missing_openclaw_extensions";
    readonly EMPTY_OPENCLAW_EXTENSIONS: "empty_openclaw_extensions";
    readonly NPM_PACKAGE_NOT_FOUND: "npm_package_not_found";
    readonly PLUGIN_ID_MISMATCH: "plugin_id_mismatch";
};
export type PluginInstallErrorCode = (typeof PLUGIN_INSTALL_ERROR_CODE)[keyof typeof PLUGIN_INSTALL_ERROR_CODE];
export type InstallPluginResult = {
    ok: true;
    pluginId: string;
    targetDir: string;
    manifestName?: string;
    version?: string;
    extensions: string[];
    npmResolution?: NpmSpecResolution;
    integrityDrift?: NpmIntegrityDrift;
} | {
    ok: false;
    error: string;
    code?: PluginInstallErrorCode;
};
export type PluginNpmIntegrityDriftParams = {
    spec: string;
    expectedIntegrity: string;
    actualIntegrity: string;
    resolution: NpmSpecResolution;
};
type PackageInstallCommonParams = {
    extensionsDir?: string;
    timeoutMs?: number;
    logger?: PluginInstallLogger;
    mode?: "install" | "update";
    dryRun?: boolean;
    expectedPluginId?: string;
};
export declare function resolvePluginInstallDir(pluginId: string, extensionsDir?: string): string;
export declare function installPluginFromArchive(params: {
    archivePath: string;
} & PackageInstallCommonParams): Promise<InstallPluginResult>;
export declare function installPluginFromDir(params: {
    dirPath: string;
} & PackageInstallCommonParams): Promise<InstallPluginResult>;
export declare function installPluginFromFile(params: {
    filePath: string;
    extensionsDir?: string;
    logger?: PluginInstallLogger;
    mode?: "install" | "update";
    dryRun?: boolean;
}): Promise<InstallPluginResult>;
export declare function installPluginFromNpmSpec(params: {
    spec: string;
    extensionsDir?: string;
    timeoutMs?: number;
    logger?: PluginInstallLogger;
    mode?: "install" | "update";
    dryRun?: boolean;
    expectedPluginId?: string;
    expectedIntegrity?: string;
    onIntegrityDrift?: (params: PluginNpmIntegrityDriftParams) => boolean | Promise<boolean>;
}): Promise<InstallPluginResult>;
export declare function installPluginFromPath(params: {
    path: string;
} & PackageInstallCommonParams): Promise<InstallPluginResult>;
export {};
