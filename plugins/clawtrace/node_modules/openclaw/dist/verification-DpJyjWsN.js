import { EE as withResolvedRuntimeMatrixClient, yE as resolveMatrixRoomId } from "./auth-profiles-B5ypC5S-.js";
import { n as getMatrixRuntime } from "./runtime-api-BefOImIc.js";
import { n as formatMatrixEncryptionUnavailableError } from "./encryption-guidance-CskwrNMl.js";
//#region extensions/matrix/src/matrix/actions/client.ts
async function withResolvedActionClient(opts, run, mode = "stop") {
	return await withResolvedRuntimeMatrixClient(opts, run, mode);
}
async function withStartedActionClient(opts, run) {
	return await withResolvedActionClient({
		...opts,
		readiness: "started"
	}, run, "persist");
}
async function withResolvedRoomAction(roomId, opts, run) {
	return await withResolvedActionClient(opts, async (client) => {
		return await run(client, await resolveMatrixRoomId(client, roomId));
	});
}
//#endregion
//#region extensions/matrix/src/matrix/actions/verification.ts
function requireCrypto(client, opts) {
	if (!client.crypto) {
		const cfg = opts.cfg ?? getMatrixRuntime().config.loadConfig();
		throw new Error(formatMatrixEncryptionUnavailableError(cfg, opts.accountId));
	}
	return client.crypto;
}
function resolveVerificationId(input) {
	const normalized = input.trim();
	if (!normalized) throw new Error("Matrix verification request id is required");
	return normalized;
}
async function listMatrixVerifications(opts = {}) {
	return await withStartedActionClient(opts, async (client) => {
		return await requireCrypto(client, opts).listVerifications();
	});
}
async function requestMatrixVerification(params = {}) {
	return await withStartedActionClient(params, async (client) => {
		const crypto = requireCrypto(client, params);
		const ownUser = params.ownUser ?? (!params.userId && !params.deviceId && !params.roomId);
		return await crypto.requestVerification({
			ownUser,
			userId: params.userId?.trim() || void 0,
			deviceId: params.deviceId?.trim() || void 0,
			roomId: params.roomId?.trim() || void 0
		});
	});
}
async function acceptMatrixVerification(requestId, opts = {}) {
	return await withStartedActionClient(opts, async (client) => {
		return await requireCrypto(client, opts).acceptVerification(resolveVerificationId(requestId));
	});
}
async function cancelMatrixVerification(requestId, opts = {}) {
	return await withStartedActionClient(opts, async (client) => {
		return await requireCrypto(client, opts).cancelVerification(resolveVerificationId(requestId), {
			reason: opts.reason?.trim() || void 0,
			code: opts.code?.trim() || void 0
		});
	});
}
async function startMatrixVerification(requestId, opts = {}) {
	return await withStartedActionClient(opts, async (client) => {
		return await requireCrypto(client, opts).startVerification(resolveVerificationId(requestId), opts.method ?? "sas");
	});
}
async function generateMatrixVerificationQr(requestId, opts = {}) {
	return await withStartedActionClient(opts, async (client) => {
		return await requireCrypto(client, opts).generateVerificationQr(resolveVerificationId(requestId));
	});
}
async function scanMatrixVerificationQr(requestId, qrDataBase64, opts = {}) {
	return await withStartedActionClient(opts, async (client) => {
		const crypto = requireCrypto(client, opts);
		const payload = qrDataBase64.trim();
		if (!payload) throw new Error("Matrix QR data is required");
		return await crypto.scanVerificationQr(resolveVerificationId(requestId), payload);
	});
}
async function getMatrixVerificationSas(requestId, opts = {}) {
	return await withStartedActionClient(opts, async (client) => {
		return await requireCrypto(client, opts).getVerificationSas(resolveVerificationId(requestId));
	});
}
async function confirmMatrixVerificationSas(requestId, opts = {}) {
	return await withStartedActionClient(opts, async (client) => {
		return await requireCrypto(client, opts).confirmVerificationSas(resolveVerificationId(requestId));
	});
}
async function mismatchMatrixVerificationSas(requestId, opts = {}) {
	return await withStartedActionClient(opts, async (client) => {
		return await requireCrypto(client, opts).mismatchVerificationSas(resolveVerificationId(requestId));
	});
}
async function confirmMatrixVerificationReciprocateQr(requestId, opts = {}) {
	return await withStartedActionClient(opts, async (client) => {
		return await requireCrypto(client, opts).confirmVerificationReciprocateQr(resolveVerificationId(requestId));
	});
}
async function getMatrixEncryptionStatus(opts = {}) {
	return await withStartedActionClient(opts, async (client) => {
		const crypto = requireCrypto(client, opts);
		const recoveryKey = await crypto.getRecoveryKey();
		return {
			encryptionEnabled: true,
			recoveryKeyStored: Boolean(recoveryKey),
			recoveryKeyCreatedAt: recoveryKey?.createdAt ?? null,
			...opts.includeRecoveryKey ? { recoveryKey: recoveryKey?.encodedPrivateKey ?? null } : {},
			pendingVerifications: (await crypto.listVerifications()).length
		};
	});
}
async function getMatrixVerificationStatus(opts = {}) {
	return await withStartedActionClient(opts, async (client) => {
		const payload = {
			...await client.getOwnDeviceVerificationStatus(),
			pendingVerifications: client.crypto ? (await client.crypto.listVerifications()).length : 0
		};
		if (!opts.includeRecoveryKey) return payload;
		const recoveryKey = client.crypto ? await client.crypto.getRecoveryKey() : null;
		return {
			...payload,
			recoveryKey: recoveryKey?.encodedPrivateKey ?? null
		};
	});
}
async function getMatrixRoomKeyBackupStatus(opts = {}) {
	return await withStartedActionClient(opts, async (client) => await client.getRoomKeyBackupStatus());
}
async function verifyMatrixRecoveryKey(recoveryKey, opts = {}) {
	return await withStartedActionClient(opts, async (client) => await client.verifyWithRecoveryKey(recoveryKey));
}
async function restoreMatrixRoomKeyBackup(opts = {}) {
	return await withStartedActionClient(opts, async (client) => await client.restoreRoomKeyBackup({ recoveryKey: opts.recoveryKey?.trim() || void 0 }));
}
async function resetMatrixRoomKeyBackup(opts = {}) {
	return await withStartedActionClient(opts, async (client) => await client.resetRoomKeyBackup());
}
async function bootstrapMatrixVerification(opts = {}) {
	return await withStartedActionClient(opts, async (client) => await client.bootstrapOwnDeviceVerification({
		recoveryKey: opts.recoveryKey?.trim() || void 0,
		forceResetCrossSigning: opts.forceResetCrossSigning === true
	}));
}
//#endregion
export { startMatrixVerification as _, confirmMatrixVerificationSas as a, withResolvedRoomAction as b, getMatrixRoomKeyBackupStatus as c, listMatrixVerifications as d, mismatchMatrixVerificationSas as f, scanMatrixVerificationQr as g, restoreMatrixRoomKeyBackup as h, confirmMatrixVerificationReciprocateQr as i, getMatrixVerificationSas as l, resetMatrixRoomKeyBackup as m, bootstrapMatrixVerification as n, generateMatrixVerificationQr as o, requestMatrixVerification as p, cancelMatrixVerification as r, getMatrixEncryptionStatus as s, acceptMatrixVerification as t, getMatrixVerificationStatus as u, verifyMatrixRecoveryKey as v, withStartedActionClient as x, withResolvedActionClient as y };
