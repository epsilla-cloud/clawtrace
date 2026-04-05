import { r as fileExists } from "./archive-teEi_9FS.js";
import { n as isPrereleaseResolutionAllowed, r as parseRegistryNpmSpec, t as formatPrereleaseResolutionError } from "./npm-registry-spec-YYJ6mdlY.js";
import { i as withTempDir, n as packNpmSpecToArchive } from "./install-source-utils-DICepj-h.js";
import { n as resolveSafeInstallDir, t as assertCanonicalPathWithinBase } from "./install-safe-path-DI-NzPxP.js";
import fs from "node:fs/promises";
//#region src/infra/npm-integrity.ts
async function resolveNpmIntegrityDrift(params) {
	if (!params.expectedIntegrity || !params.resolution.integrity) return { proceed: true };
	if (params.expectedIntegrity === params.resolution.integrity) return { proceed: true };
	const integrityDrift = {
		expectedIntegrity: params.expectedIntegrity,
		actualIntegrity: params.resolution.integrity
	};
	const payload = params.createPayload({
		spec: params.spec,
		expectedIntegrity: integrityDrift.expectedIntegrity,
		actualIntegrity: integrityDrift.actualIntegrity,
		resolution: params.resolution
	});
	let proceed = true;
	if (params.onIntegrityDrift) proceed = await params.onIntegrityDrift(payload);
	else params.warn?.(payload);
	return {
		integrityDrift,
		proceed,
		payload
	};
}
async function resolveNpmIntegrityDriftWithDefaultMessage(params) {
	const driftResult = await resolveNpmIntegrityDrift({
		spec: params.spec,
		expectedIntegrity: params.expectedIntegrity,
		resolution: params.resolution,
		createPayload: (drift) => ({ ...drift }),
		onIntegrityDrift: params.onIntegrityDrift,
		warn: (driftPayload) => {
			params.warn?.(`Integrity drift detected for ${driftPayload.resolution.resolvedSpec ?? driftPayload.spec}: expected ${driftPayload.expectedIntegrity}, got ${driftPayload.actualIntegrity}`);
		}
	});
	if (!driftResult.proceed && driftResult.payload) return {
		integrityDrift: driftResult.integrityDrift,
		error: `aborted: npm package integrity drift detected for ${driftResult.payload.resolution.resolvedSpec ?? driftResult.payload.spec}`
	};
	return { integrityDrift: driftResult.integrityDrift };
}
//#endregion
//#region src/infra/npm-pack-install.ts
async function installFromNpmSpecArchiveWithInstaller(params) {
	return await installFromNpmSpecArchive({
		tempDirPrefix: params.tempDirPrefix,
		spec: params.spec,
		timeoutMs: params.timeoutMs,
		expectedIntegrity: params.expectedIntegrity,
		onIntegrityDrift: params.onIntegrityDrift,
		warn: params.warn,
		installFromArchive: async ({ archivePath }) => await params.installFromArchive({
			archivePath,
			...params.archiveInstallParams
		})
	});
}
function isSuccessfulInstallResult(result) {
	return result.ok;
}
function finalizeNpmSpecArchiveInstall(flowResult) {
	if (!flowResult.ok) return flowResult;
	const installResult = flowResult.installResult;
	if (!isSuccessfulInstallResult(installResult)) return installResult;
	return {
		...installResult,
		npmResolution: flowResult.npmResolution,
		...flowResult.integrityDrift ? { integrityDrift: flowResult.integrityDrift } : {}
	};
}
async function installFromNpmSpecArchive(params) {
	return await withTempDir(params.tempDirPrefix, async (tmpDir) => {
		const parsedSpec = parseRegistryNpmSpec(params.spec);
		if (!parsedSpec) return {
			ok: false,
			error: "unsupported npm spec"
		};
		const packedResult = await packNpmSpecToArchive({
			spec: params.spec,
			timeoutMs: params.timeoutMs,
			cwd: tmpDir
		});
		if (!packedResult.ok) return packedResult;
		const npmResolution = {
			...packedResult.metadata,
			resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (npmResolution.version && !isPrereleaseResolutionAllowed({
			spec: parsedSpec,
			resolvedVersion: npmResolution.version
		})) return {
			ok: false,
			error: formatPrereleaseResolutionError({
				spec: parsedSpec,
				resolvedVersion: npmResolution.version
			})
		};
		const driftResult = await resolveNpmIntegrityDriftWithDefaultMessage({
			spec: params.spec,
			expectedIntegrity: params.expectedIntegrity,
			resolution: npmResolution,
			onIntegrityDrift: params.onIntegrityDrift,
			warn: params.warn
		});
		if (driftResult.error) return {
			ok: false,
			error: driftResult.error
		};
		return {
			ok: true,
			installResult: await params.installFromArchive({ archivePath: packedResult.archivePath }),
			npmResolution,
			integrityDrift: driftResult.integrityDrift
		};
	});
}
//#endregion
//#region src/infra/install-mode-options.ts
function resolveInstallModeOptions(params, defaultLogger) {
	return {
		logger: params.logger ?? defaultLogger,
		mode: params.mode ?? "install",
		dryRun: params.dryRun ?? false
	};
}
function resolveTimedInstallModeOptions(params, defaultLogger, defaultTimeoutMs = 12e4) {
	return {
		...resolveInstallModeOptions(params, defaultLogger),
		timeoutMs: params.timeoutMs ?? defaultTimeoutMs
	};
}
//#endregion
//#region src/infra/install-target.ts
async function resolveCanonicalInstallTarget(params) {
	await fs.mkdir(params.baseDir, { recursive: true });
	const targetDirResult = resolveSafeInstallDir({
		baseDir: params.baseDir,
		id: params.id,
		invalidNameMessage: params.invalidNameMessage,
		nameEncoder: params.nameEncoder
	});
	if (!targetDirResult.ok) return {
		ok: false,
		error: targetDirResult.error
	};
	try {
		await assertCanonicalPathWithinBase({
			baseDir: params.baseDir,
			candidatePath: targetDirResult.path,
			boundaryLabel: params.boundaryLabel
		});
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : String(err)
		};
	}
	return {
		ok: true,
		targetDir: targetDirResult.path
	};
}
async function ensureInstallTargetAvailable(params) {
	if (params.mode === "install" && await fileExists(params.targetDir)) return {
		ok: false,
		error: params.alreadyExistsError
	};
	return { ok: true };
}
//#endregion
export { finalizeNpmSpecArchiveInstall as a, resolveTimedInstallModeOptions as i, resolveCanonicalInstallTarget as n, installFromNpmSpecArchiveWithInstaller as o, resolveInstallModeOptions as r, ensureInstallTargetAvailable as t };
