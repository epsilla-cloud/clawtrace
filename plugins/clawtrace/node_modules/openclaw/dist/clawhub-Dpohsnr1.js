import { o as resolveCompatibilityHostVersion } from "./version-CIMrqUx3.js";
import { a as fetchClawHubPackageVersion, d as satisfiesPluginApiRange, i as fetchClawHubPackageDetail, l as resolveLatestVersionFromPackage, n as downloadClawHubPackageArchive, s as parseClawHubPluginSpec, t as ClawHubRequestError, u as satisfiesGatewayMinimum } from "./clawhub-CFvPS51z.js";
import { n as installPluginFromArchive } from "./install-ByeIRSW_.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/plugins/clawhub.ts
const CLAWHUB_INSTALL_ERROR_CODE = {
	INVALID_SPEC: "invalid_spec",
	PACKAGE_NOT_FOUND: "package_not_found",
	VERSION_NOT_FOUND: "version_not_found",
	NO_INSTALLABLE_VERSION: "no_installable_version",
	SKILL_PACKAGE: "skill_package",
	UNSUPPORTED_FAMILY: "unsupported_family",
	PRIVATE_PACKAGE: "private_package",
	INCOMPATIBLE_PLUGIN_API: "incompatible_plugin_api",
	INCOMPATIBLE_GATEWAY: "incompatible_gateway"
};
function formatClawHubSpecifier(params) {
	return `clawhub:${params.name}${params.version ? `@${params.version}` : ""}`;
}
function buildClawHubInstallFailure(error, code) {
	return {
		ok: false,
		error,
		code
	};
}
function mapClawHubRequestError(error, context) {
	if (error instanceof ClawHubRequestError && error.status === 404) {
		if (context.stage === "package") return buildClawHubInstallFailure("Package not found on ClawHub.", CLAWHUB_INSTALL_ERROR_CODE.PACKAGE_NOT_FOUND);
		return buildClawHubInstallFailure(`Version not found on ClawHub: ${context.name}@${context.version ?? "unknown"}.`, CLAWHUB_INSTALL_ERROR_CODE.VERSION_NOT_FOUND);
	}
	return buildClawHubInstallFailure(error instanceof Error ? error.message : String(error));
}
function resolveRequestedVersion(params) {
	if (params.requestedVersion) return params.requestedVersion;
	return resolveLatestVersionFromPackage(params.detail);
}
async function resolveCompatiblePackageVersion(params) {
	const version = resolveRequestedVersion(params);
	if (!version) return buildClawHubInstallFailure(`ClawHub package "${params.detail.package?.name ?? "unknown"}" has no installable version.`, CLAWHUB_INSTALL_ERROR_CODE.NO_INSTALLABLE_VERSION);
	let versionDetail;
	try {
		versionDetail = await fetchClawHubPackageVersion({
			name: params.detail.package?.name ?? "",
			version,
			baseUrl: params.baseUrl,
			token: params.token
		});
	} catch (error) {
		return mapClawHubRequestError(error, {
			stage: "version",
			name: params.detail.package?.name ?? "unknown",
			version
		});
	}
	return {
		ok: true,
		version,
		compatibility: versionDetail.version?.compatibility ?? params.detail.package?.compatibility ?? null
	};
}
function validateClawHubPluginPackage(params) {
	const pkg = params.detail.package;
	if (!pkg) return buildClawHubInstallFailure("Package not found on ClawHub.", CLAWHUB_INSTALL_ERROR_CODE.PACKAGE_NOT_FOUND);
	if (pkg.family === "skill") return buildClawHubInstallFailure(`"${pkg.name}" is a skill. Use "openclaw skills install ${pkg.name}" instead.`, CLAWHUB_INSTALL_ERROR_CODE.SKILL_PACKAGE);
	if (pkg.family !== "code-plugin" && pkg.family !== "bundle-plugin") return buildClawHubInstallFailure(`Unsupported ClawHub package family: ${String(pkg.family)}`, CLAWHUB_INSTALL_ERROR_CODE.UNSUPPORTED_FAMILY);
	if (pkg.channel === "private") return buildClawHubInstallFailure(`"${pkg.name}" is private on ClawHub and cannot be installed anonymously.`, CLAWHUB_INSTALL_ERROR_CODE.PRIVATE_PACKAGE);
	const compatibility = params.compatibility;
	const runtimeVersion = params.runtimeVersion;
	if (compatibility?.pluginApiRange && !satisfiesPluginApiRange(runtimeVersion, compatibility.pluginApiRange)) return buildClawHubInstallFailure(`Plugin "${pkg.name}" requires plugin API ${compatibility.pluginApiRange}, but this OpenClaw runtime exposes ${runtimeVersion}.`, CLAWHUB_INSTALL_ERROR_CODE.INCOMPATIBLE_PLUGIN_API);
	if (compatibility?.minGatewayVersion && !satisfiesGatewayMinimum(runtimeVersion, compatibility.minGatewayVersion)) return buildClawHubInstallFailure(`Plugin "${pkg.name}" requires OpenClaw >=${compatibility.minGatewayVersion}, but this host is ${runtimeVersion}.`, CLAWHUB_INSTALL_ERROR_CODE.INCOMPATIBLE_GATEWAY);
	return null;
}
function logClawHubPackageSummary(params) {
	const pkg = params.detail.package;
	if (!pkg) return;
	const verification = pkg.verification?.tier ? ` verification=${pkg.verification.tier}` : "";
	params.logger?.info?.(`ClawHub ${pkg.family} ${pkg.name}@${params.version} channel=${pkg.channel}${verification}`);
	const compatibilityParts = [params.compatibility?.pluginApiRange ? `pluginApi=${params.compatibility.pluginApiRange}` : null, params.compatibility?.minGatewayVersion ? `minGateway=${params.compatibility.minGatewayVersion}` : null].filter(Boolean);
	if (compatibilityParts.length > 0) params.logger?.info?.(`Compatibility: ${compatibilityParts.join(" ")}`);
	if (pkg.channel !== "official") params.logger?.warn?.(`ClawHub package "${pkg.name}" is ${pkg.channel}; review source and verification before enabling.`);
}
async function installPluginFromClawHub(params) {
	const parsed = parseClawHubPluginSpec(params.spec);
	if (!parsed?.name) return buildClawHubInstallFailure(`invalid ClawHub plugin spec: ${params.spec}`, CLAWHUB_INSTALL_ERROR_CODE.INVALID_SPEC);
	params.logger?.info?.(`Resolving ${formatClawHubSpecifier(parsed)}…`);
	let detail;
	try {
		detail = await fetchClawHubPackageDetail({
			name: parsed.name,
			baseUrl: params.baseUrl,
			token: params.token
		});
	} catch (error) {
		return mapClawHubRequestError(error, {
			stage: "package",
			name: parsed.name
		});
	}
	const versionState = await resolveCompatiblePackageVersion({
		detail,
		requestedVersion: parsed.version,
		baseUrl: params.baseUrl,
		token: params.token
	});
	if (!versionState.ok) return versionState;
	const runtimeVersion = resolveCompatibilityHostVersion();
	const validationFailure = validateClawHubPluginPackage({
		detail,
		compatibility: versionState.compatibility,
		runtimeVersion
	});
	if (validationFailure) return validationFailure;
	logClawHubPackageSummary({
		detail,
		version: versionState.version,
		compatibility: versionState.compatibility,
		logger: params.logger
	});
	let archive;
	try {
		archive = await downloadClawHubPackageArchive({
			name: parsed.name,
			version: versionState.version,
			baseUrl: params.baseUrl,
			token: params.token
		});
	} catch (error) {
		return buildClawHubInstallFailure(error instanceof Error ? error.message : String(error));
	}
	try {
		params.logger?.info?.(`Downloading ${detail.package?.family === "bundle-plugin" ? "bundle" : "plugin"} ${parsed.name}@${versionState.version} from ClawHub…`);
		const installResult = await installPluginFromArchive({
			archivePath: archive.archivePath,
			logger: params.logger,
			mode: params.mode,
			dryRun: params.dryRun,
			expectedPluginId: params.expectedPluginId
		});
		if (!installResult.ok) return installResult;
		const pkg = detail.package;
		const clawhubFamily = pkg.family === "code-plugin" || pkg.family === "bundle-plugin" ? pkg.family : null;
		if (!clawhubFamily) return buildClawHubInstallFailure(`Unsupported ClawHub package family: ${pkg.family}`, CLAWHUB_INSTALL_ERROR_CODE.UNSUPPORTED_FAMILY);
		return {
			...installResult,
			packageName: parsed.name,
			clawhub: {
				source: "clawhub",
				clawhubUrl: params.baseUrl?.trim() || process.env.OPENCLAW_CLAWHUB_URL?.trim() || "https://clawhub.ai",
				clawhubPackage: parsed.name,
				clawhubFamily,
				clawhubChannel: pkg.channel,
				version: installResult.version ?? versionState.version,
				integrity: archive.integrity,
				resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
			}
		};
	} finally {
		await fs.rm(archive.archivePath, { force: true }).catch(() => void 0);
		await fs.rm(path.dirname(archive.archivePath), {
			recursive: true,
			force: true
		}).catch(() => void 0);
	}
}
//#endregion
export { formatClawHubSpecifier as n, installPluginFromClawHub as r, CLAWHUB_INSTALL_ERROR_CODE as t };
