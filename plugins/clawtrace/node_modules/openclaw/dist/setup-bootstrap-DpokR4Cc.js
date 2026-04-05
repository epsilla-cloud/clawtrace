import { YE as resolveMatrixAccountConfig, wD as hasExplicitMatrixAccountConfig } from "./auth-profiles-B5ypC5S-.js";
import { n as bootstrapMatrixVerification } from "./verification-DpJyjWsN.js";
//#region extensions/matrix/src/setup-bootstrap.ts
async function maybeBootstrapNewEncryptedMatrixAccount(params) {
	const accountConfig = resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (hasExplicitMatrixAccountConfig(params.previousCfg, params.accountId) || accountConfig.encryption !== true) return {
		attempted: false,
		success: false,
		recoveryKeyCreatedAt: null,
		backupVersion: null
	};
	try {
		const bootstrap = await bootstrapMatrixVerification({ accountId: params.accountId });
		return {
			attempted: true,
			success: bootstrap.success === true,
			recoveryKeyCreatedAt: bootstrap.verification.recoveryKeyCreatedAt,
			backupVersion: bootstrap.verification.backupVersion,
			...bootstrap.success ? {} : { error: bootstrap.error ?? "Matrix verification bootstrap failed" }
		};
	} catch (err) {
		return {
			attempted: true,
			success: false,
			recoveryKeyCreatedAt: null,
			backupVersion: null,
			error: err instanceof Error ? err.message : String(err)
		};
	}
}
async function runMatrixSetupBootstrapAfterConfigWrite(params) {
	if (resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId
	}).encryption !== true) return;
	const bootstrap = await maybeBootstrapNewEncryptedMatrixAccount({
		previousCfg: params.previousCfg,
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!bootstrap.attempted) return;
	if (bootstrap.success) {
		params.runtime.log(`Matrix verification bootstrap: complete for "${params.accountId}".`);
		if (bootstrap.backupVersion) params.runtime.log(`Matrix backup version for "${params.accountId}": ${bootstrap.backupVersion}`);
		return;
	}
	params.runtime.error(`Matrix verification bootstrap warning for "${params.accountId}": ${bootstrap.error ?? "unknown bootstrap failure"}`);
}
//#endregion
export { maybeBootstrapNewEncryptedMatrixAccount, runMatrixSetupBootstrapAfterConfigWrite };
