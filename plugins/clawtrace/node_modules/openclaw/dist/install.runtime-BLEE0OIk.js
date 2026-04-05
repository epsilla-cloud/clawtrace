import { o as resolveCompatibilityHostVersion, s as resolveRuntimeServiceVersion } from "./version-CIMrqUx3.js";
import { g as resolvePackageExtensionEntries, h as loadPluginManifest, l as detectBundleManifestFormat, m as getPackageManifestMetadata, r as isPathInside, t as checkMinHostVersion, u as loadBundleManifest } from "./min-host-version-VYpMQhVm.js";
import { d as writeFileFromPathWithinRoot } from "./fs-safe-D9sbDNFI.js";
import { a as resolveArchiveKind, i as readJsonFile, r as fileExists } from "./archive-teEi_9FS.js";
import { i as validateRegistryNpmSpec } from "./npm-registry-spec-YYJ6mdlY.js";
import { r as resolveArchiveSourcePath } from "./install-source-utils-DICepj-h.js";
import { i as withExtractedArchiveRoot, r as resolveExistingInstallPath, t as installPackageDir } from "./install-package-dir-BC8uB5od.js";
import { a as finalizeNpmSpecArchiveInstall, i as resolveTimedInstallModeOptions, n as resolveCanonicalInstallTarget, o as installFromNpmSpecArchiveWithInstaller, r as resolveInstallModeOptions, t as ensureInstallTargetAvailable } from "./install-target-Ch6pdpZJ.js";
//#region src/plugins/install-security-scan.ts
async function loadInstallSecurityScanRuntime() {
	return await import("./install-security-scan.runtime-ChMU4w3w.js");
}
async function scanBundleInstallSource(params) {
	const { scanBundleInstallSourceRuntime } = await loadInstallSecurityScanRuntime();
	await scanBundleInstallSourceRuntime(params);
}
async function scanPackageInstallSource(params) {
	const { scanPackageInstallSourceRuntime } = await loadInstallSecurityScanRuntime();
	await scanPackageInstallSourceRuntime(params);
}
//#endregion
export { checkMinHostVersion, detectBundleManifestFormat, ensureInstallTargetAvailable, fileExists, finalizeNpmSpecArchiveInstall, getPackageManifestMetadata, installFromNpmSpecArchiveWithInstaller, installPackageDir, isPathInside, loadBundleManifest, loadPluginManifest, readJsonFile, resolveArchiveKind, resolveArchiveSourcePath, resolveCanonicalInstallTarget, resolveCompatibilityHostVersion, resolveExistingInstallPath, resolveInstallModeOptions, resolvePackageExtensionEntries, resolveRuntimeServiceVersion, resolveTimedInstallModeOptions, scanBundleInstallSource, scanPackageInstallSource, validateRegistryNpmSpec, withExtractedArchiveRoot, writeFileFromPathWithinRoot };
