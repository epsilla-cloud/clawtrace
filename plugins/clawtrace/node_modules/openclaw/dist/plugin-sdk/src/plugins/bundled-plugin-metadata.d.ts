import type { PluginManifest, OpenClawPackageManifest } from "./manifest.js";
type GeneratedBundledPluginPathPair = {
    source: string;
    built: string;
};
export type GeneratedBundledPluginMetadata = {
    dirName: string;
    idHint: string;
    source: GeneratedBundledPluginPathPair;
    setupSource?: GeneratedBundledPluginPathPair;
    publicSurfaceArtifacts?: readonly string[];
    runtimeSidecarArtifacts?: readonly string[];
    packageName?: string;
    packageVersion?: string;
    packageDescription?: string;
    packageManifest?: OpenClawPackageManifest;
    manifest: PluginManifest;
};
export declare const BUNDLED_PLUGIN_METADATA: readonly GeneratedBundledPluginMetadata[];
export declare function resolveBundledPluginGeneratedPath(rootDir: string, entry: GeneratedBundledPluginPathPair | undefined): string | null;
export declare function resolveBundledPluginPublicSurfacePath(params: {
    rootDir: string;
    dirName: string;
    artifactBasename: string;
}): string | null;
export {};
