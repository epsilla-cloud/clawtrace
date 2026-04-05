import { CD as updateMatrixAccountConfig, JE as resolveMatrixAccount, SD as resolveMatrixConfigPath, YE as resolveMatrixAccountConfig, bD as matrixSetupAdapter, bE as inspectMatrixDirectRooms, cD as resolveMatrixAuthContext, lD as setMatrixSdkConsoleLogging, pD as resolveMatrixRoomKeyBackupIssue, uD as setMatrixSdkLogMode, xE as repairMatrixDirectRooms } from "./auth-profiles-B5ypC5S-.js";
import { _ as normalizeAccountId } from "./session-key-BhxcMJEE.js";
import { n as formatZonedTimestamp } from "./matrix-runtime-shared-C_2g090J.js";
import { n as getMatrixRuntime } from "./runtime-api-BefOImIc.js";
import { c as getMatrixRoomKeyBackupStatus, h as restoreMatrixRoomKeyBackup, m as resetMatrixRoomKeyBackup, n as bootstrapMatrixVerification, u as getMatrixVerificationStatus, v as verifyMatrixRecoveryKey, x as withStartedActionClient, y as withResolvedActionClient } from "./verification-DpJyjWsN.js";
import { n as summarizeMatrixDeviceHealth, t as isOpenClawManagedMatrixDevice } from "./device-health-DtpOWJhJ.js";
import { n as updateMatrixOwnProfile, t as applyMatrixProfileUpdate } from "./profile-update-DN0UISOA.js";
//#region extensions/matrix/src/matrix/actions/devices.ts
async function listMatrixOwnDevices(opts = {}) {
	return await withStartedActionClient(opts, async (client) => await client.listOwnDevices());
}
async function pruneMatrixStaleGatewayDevices(opts = {}) {
	return await withStartedActionClient(opts, async (client) => {
		const devices = await client.listOwnDevices();
		const staleGatewayDeviceIds = summarizeMatrixDeviceHealth(devices).staleOpenClawDevices.map((device) => device.deviceId);
		return {
			before: devices,
			staleGatewayDeviceIds,
			...staleGatewayDeviceIds.length > 0 ? await client.deleteOwnDevices(staleGatewayDeviceIds) : {
				currentDeviceId: devices.find((device) => device.current)?.deviceId ?? null,
				deletedDeviceIds: [],
				remainingDevices: devices
			}
		};
	});
}
//#endregion
//#region extensions/matrix/src/cli.ts
let matrixCliExitScheduled = false;
function scheduleMatrixCliExit() {
	if (matrixCliExitScheduled || process.env.VITEST) return;
	matrixCliExitScheduled = true;
	setTimeout(() => {
		process.exit(process.exitCode ?? 0);
	}, 0);
}
function markCliFailure() {
	process.exitCode = 1;
}
function toErrorMessage(err) {
	return err instanceof Error ? err.message : String(err);
}
function printJson(payload) {
	console.log(JSON.stringify(payload, null, 2));
}
function formatLocalTimestamp(value) {
	if (!value) return null;
	const parsed = new Date(value);
	if (!Number.isFinite(parsed.getTime())) return value;
	return formatZonedTimestamp(parsed, { displaySeconds: true }) ?? value;
}
function printTimestamp(label, value) {
	const formatted = formatLocalTimestamp(value);
	if (formatted) console.log(`${label}: ${formatted}`);
}
function printAccountLabel(accountId) {
	console.log(`Account: ${normalizeAccountId(accountId)}`);
}
function resolveMatrixCliAccountId(accountId) {
	return resolveMatrixAuthContext({
		cfg: getMatrixRuntime().config.loadConfig(),
		accountId
	}).accountId;
}
function formatMatrixCliCommand(command, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	return `openclaw matrix ${command}${normalizedAccountId === "default" ? "" : ` --account ${normalizedAccountId}`}`;
}
function printMatrixOwnDevices(devices) {
	if (devices.length === 0) {
		console.log("Devices: none");
		return;
	}
	for (const device of devices) {
		const labels = [device.current ? "current" : null, device.displayName].filter(Boolean);
		console.log(`- ${device.deviceId}${labels.length ? ` (${labels.join(", ")})` : ""}`);
		if (device.lastSeenTs) printTimestamp("  Last seen", new Date(device.lastSeenTs).toISOString());
		if (device.lastSeenIp) console.log(`  Last IP: ${device.lastSeenIp}`);
	}
}
function configureCliLogMode(verbose) {
	setMatrixSdkLogMode(verbose ? "default" : "quiet");
	setMatrixSdkConsoleLogging(verbose);
}
function parseOptionalInt(value, fieldName) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	const parsed = Number.parseInt(trimmed, 10);
	if (!Number.isFinite(parsed)) throw new Error(`${fieldName} must be an integer`);
	return parsed;
}
async function addMatrixAccount(params) {
	const runtime = getMatrixRuntime();
	const cfg = runtime.config.loadConfig();
	if (!matrixSetupAdapter.applyAccountConfig) throw new Error("Matrix account setup is unavailable.");
	const input = {
		name: params.name,
		avatarUrl: params.avatarUrl,
		homeserver: params.homeserver,
		allowPrivateNetwork: params.allowPrivateNetwork,
		userId: params.userId,
		accessToken: params.accessToken,
		password: params.password,
		deviceName: params.deviceName,
		initialSyncLimit: parseOptionalInt(params.initialSyncLimit, "--initial-sync-limit"),
		useEnv: params.useEnv === true
	};
	const accountId = matrixSetupAdapter.resolveAccountId?.({
		cfg,
		accountId: params.account,
		input
	}) ?? normalizeAccountId(params.account?.trim() || params.name?.trim());
	const validationError = matrixSetupAdapter.validateInput?.({
		cfg,
		accountId,
		input
	});
	if (validationError) throw new Error(validationError);
	const updated = matrixSetupAdapter.applyAccountConfig({
		cfg,
		accountId,
		input
	});
	await runtime.config.writeConfigFile(updated);
	const accountConfig = resolveMatrixAccountConfig({
		cfg: updated,
		accountId
	});
	let verificationBootstrap = {
		attempted: false,
		success: false,
		recoveryKeyCreatedAt: null,
		backupVersion: null
	};
	if (accountConfig.encryption === true) {
		const { maybeBootstrapNewEncryptedMatrixAccount } = await import("./setup-bootstrap-DpokR4Cc.js");
		verificationBootstrap = await maybeBootstrapNewEncryptedMatrixAccount({
			previousCfg: cfg,
			cfg: updated,
			accountId
		});
	}
	const desiredDisplayName = input.name?.trim();
	const desiredAvatarUrl = input.avatarUrl?.trim();
	let profile = {
		attempted: false,
		displayNameUpdated: false,
		avatarUpdated: false,
		resolvedAvatarUrl: null,
		convertedAvatarFromHttp: false
	};
	if (desiredDisplayName || desiredAvatarUrl) try {
		const synced = await updateMatrixOwnProfile({
			accountId,
			displayName: desiredDisplayName,
			avatarUrl: desiredAvatarUrl
		});
		let resolvedAvatarUrl = synced.resolvedAvatarUrl;
		if (synced.convertedAvatarFromHttp && synced.resolvedAvatarUrl) {
			const withAvatar = updateMatrixAccountConfig(runtime.config.loadConfig(), accountId, { avatarUrl: synced.resolvedAvatarUrl });
			await runtime.config.writeConfigFile(withAvatar);
			resolvedAvatarUrl = synced.resolvedAvatarUrl;
		}
		profile = {
			attempted: true,
			displayNameUpdated: synced.displayNameUpdated,
			avatarUpdated: synced.avatarUpdated,
			resolvedAvatarUrl,
			convertedAvatarFromHttp: synced.convertedAvatarFromHttp
		};
	} catch (err) {
		profile = {
			attempted: true,
			displayNameUpdated: false,
			avatarUpdated: false,
			resolvedAvatarUrl: null,
			convertedAvatarFromHttp: false,
			error: toErrorMessage(err)
		};
	}
	let deviceHealth = {
		currentDeviceId: null,
		staleOpenClawDeviceIds: []
	};
	try {
		const addedDevices = await listMatrixOwnDevices({ accountId });
		deviceHealth = {
			currentDeviceId: addedDevices.find((device) => device.current)?.deviceId ?? null,
			staleOpenClawDeviceIds: addedDevices.filter((device) => !device.current && isOpenClawManagedMatrixDevice(device.displayName)).map((device) => device.deviceId)
		};
	} catch (err) {
		deviceHealth = {
			currentDeviceId: null,
			staleOpenClawDeviceIds: [],
			error: toErrorMessage(err)
		};
	}
	return {
		accountId,
		configPath: resolveMatrixConfigPath(updated, accountId),
		useEnv: input.useEnv === true,
		deviceHealth,
		verificationBootstrap,
		profile
	};
}
function printDirectRoomCandidate(room) {
	const members = room.joinedMembers === null ? "unavailable" : room.joinedMembers.join(", ") || "none";
	console.log(`- ${room.roomId} [${room.source}] strict=${room.strict ? "yes" : "no"} joined=${members}`);
}
function printDirectRoomInspection(result) {
	printAccountLabel(result.accountId);
	console.log(`Peer: ${result.remoteUserId}`);
	console.log(`Self: ${result.selfUserId ?? "unknown"}`);
	console.log(`Active direct room: ${result.activeRoomId ?? "none"}`);
	console.log(`Mapped rooms: ${result.mappedRoomIds.length ? result.mappedRoomIds.join(", ") : "none"}`);
	console.log(`Discovered strict rooms: ${result.discoveredStrictRoomIds.length ? result.discoveredStrictRoomIds.join(", ") : "none"}`);
	if (result.mappedRooms.length > 0) {
		console.log("Mapped room details:");
		for (const room of result.mappedRooms) printDirectRoomCandidate(room);
	}
}
async function inspectMatrixDirectRoom(params) {
	return await withResolvedActionClient({ accountId: params.accountId }, async (client) => {
		const inspection = await inspectMatrixDirectRooms({
			client,
			remoteUserId: params.userId
		});
		return {
			accountId: params.accountId,
			remoteUserId: inspection.remoteUserId,
			selfUserId: inspection.selfUserId,
			mappedRoomIds: inspection.mappedRoomIds,
			mappedRooms: inspection.mappedRooms.map(toCliDirectRoomCandidate),
			discoveredStrictRoomIds: inspection.discoveredStrictRoomIds,
			activeRoomId: inspection.activeRoomId
		};
	}, "persist");
}
async function repairMatrixDirectRoom(params) {
	const account = resolveMatrixAccount({
		cfg: getMatrixRuntime().config.loadConfig(),
		accountId: params.accountId
	});
	return await withStartedActionClient({ accountId: params.accountId }, async (client) => {
		const repaired = await repairMatrixDirectRooms({
			client,
			remoteUserId: params.userId,
			encrypted: account.config.encryption === true
		});
		return {
			accountId: params.accountId,
			remoteUserId: repaired.remoteUserId,
			selfUserId: repaired.selfUserId,
			mappedRoomIds: repaired.mappedRoomIds,
			mappedRooms: repaired.mappedRooms.map(toCliDirectRoomCandidate),
			discoveredStrictRoomIds: repaired.discoveredStrictRoomIds,
			activeRoomId: repaired.activeRoomId,
			encrypted: account.config.encryption === true,
			createdRoomId: repaired.createdRoomId,
			changed: repaired.changed,
			directContentBefore: repaired.directContentBefore,
			directContentAfter: repaired.directContentAfter
		};
	});
}
async function setMatrixProfile(params) {
	return await applyMatrixProfileUpdate({
		account: params.account,
		displayName: params.name,
		avatarUrl: params.avatarUrl
	});
}
async function runMatrixCliCommand(config) {
	configureCliLogMode(config.verbose);
	try {
		const result = await config.run();
		if (config.json) printJson(config.onJson ? config.onJson(result) : result);
		else config.onText(result, config.verbose);
		if (config.shouldFail?.(result)) markCliFailure();
	} catch (err) {
		const message = toErrorMessage(err);
		if (config.json) printJson(config.onJsonError ? config.onJsonError(message) : { error: message });
		else console.error(`${config.errorPrefix}: ${message}`);
		markCliFailure();
	} finally {
		scheduleMatrixCliExit();
	}
}
function toCliDirectRoomCandidate(room) {
	return {
		roomId: room.roomId,
		source: room.source,
		strict: room.strict,
		joinedMembers: room.joinedMembers
	};
}
function resolveBackupStatus(status) {
	return {
		serverVersion: status.backup?.serverVersion ?? status.backupVersion ?? null,
		activeVersion: status.backup?.activeVersion ?? null,
		trusted: status.backup?.trusted ?? null,
		matchesDecryptionKey: status.backup?.matchesDecryptionKey ?? null,
		decryptionKeyCached: status.backup?.decryptionKeyCached ?? null,
		keyLoadAttempted: status.backup?.keyLoadAttempted ?? false,
		keyLoadError: status.backup?.keyLoadError ?? null
	};
}
function yesNoUnknown(value) {
	if (value === true) return "yes";
	if (value === false) return "no";
	return "unknown";
}
function printBackupStatus(backup) {
	console.log(`Backup server version: ${backup.serverVersion ?? "none"}`);
	console.log(`Backup active on this device: ${backup.activeVersion ?? "no"}`);
	console.log(`Backup trusted by this device: ${yesNoUnknown(backup.trusted)}`);
	console.log(`Backup matches local decryption key: ${yesNoUnknown(backup.matchesDecryptionKey)}`);
	console.log(`Backup key cached locally: ${yesNoUnknown(backup.decryptionKeyCached)}`);
	console.log(`Backup key load attempted: ${yesNoUnknown(backup.keyLoadAttempted)}`);
	if (backup.keyLoadError) console.log(`Backup key load error: ${backup.keyLoadError}`);
}
function printVerificationIdentity(status) {
	console.log(`User: ${status.userId ?? "unknown"}`);
	console.log(`Device: ${status.deviceId ?? "unknown"}`);
}
function printVerificationBackupSummary(status) {
	printBackupSummary(resolveBackupStatus(status));
}
function printVerificationBackupStatus(status) {
	printBackupStatus(resolveBackupStatus(status));
}
function printVerificationTrustDiagnostics(status) {
	console.log(`Locally trusted: ${status.localVerified ? "yes" : "no"}`);
	console.log(`Cross-signing verified: ${status.crossSigningVerified ? "yes" : "no"}`);
	console.log(`Signed by owner: ${status.signedByOwner ? "yes" : "no"}`);
}
function printVerificationGuidance(status, accountId) {
	printGuidance(buildVerificationGuidance(status, accountId));
}
function printBackupSummary(backup) {
	const issue = resolveMatrixRoomKeyBackupIssue(backup);
	console.log(`Backup: ${issue.summary}`);
	if (backup.serverVersion) console.log(`Backup version: ${backup.serverVersion}`);
}
function buildVerificationGuidance(status, accountId) {
	const backupIssue = resolveMatrixRoomKeyBackupIssue(resolveBackupStatus(status));
	const nextSteps = /* @__PURE__ */ new Set();
	if (!status.verified) nextSteps.add(`Run '${formatMatrixCliCommand("verify device <key>", accountId)}' to verify this device.`);
	if (backupIssue.code === "missing-server-backup") nextSteps.add(`Run '${formatMatrixCliCommand("verify bootstrap", accountId)}' to create a room key backup.`);
	else if (backupIssue.code === "key-load-failed" || backupIssue.code === "key-not-loaded" || backupIssue.code === "inactive") if (status.recoveryKeyStored) nextSteps.add(`Backup key is not loaded on this device. Run '${formatMatrixCliCommand("verify backup restore", accountId)}' to load it and restore old room keys.`);
	else nextSteps.add(`Store a recovery key with '${formatMatrixCliCommand("verify device <key>", accountId)}', then run '${formatMatrixCliCommand("verify backup restore", accountId)}'.`);
	else if (backupIssue.code === "key-mismatch") {
		nextSteps.add(`Backup key mismatch on this device. Re-run '${formatMatrixCliCommand("verify device <key>", accountId)}' with the matching recovery key.`);
		nextSteps.add(`If you want a fresh backup baseline and accept losing unrecoverable history, run '${formatMatrixCliCommand("verify backup reset --yes", accountId)}'.`);
	} else if (backupIssue.code === "untrusted-signature") {
		nextSteps.add(`Backup trust chain is not verified on this device. Re-run '${formatMatrixCliCommand("verify device <key>", accountId)}' if you have the correct recovery key.`);
		nextSteps.add(`If you want a fresh backup baseline and accept losing unrecoverable history, run '${formatMatrixCliCommand("verify backup reset --yes", accountId)}'.`);
	} else if (backupIssue.code === "indeterminate") nextSteps.add(`Run '${formatMatrixCliCommand("verify status --verbose", accountId)}' to inspect backup trust diagnostics.`);
	if (status.pendingVerifications > 0) nextSteps.add(`Complete ${status.pendingVerifications} pending verification request(s).`);
	return Array.from(nextSteps);
}
function printGuidance(lines) {
	if (lines.length === 0) return;
	console.log("Next steps:");
	for (const line of lines) console.log(`- ${line}`);
}
function printVerificationStatus(status, verbose = false, accountId) {
	console.log(`Verified by owner: ${status.verified ? "yes" : "no"}`);
	const backupIssue = resolveMatrixRoomKeyBackupIssue(resolveBackupStatus(status));
	printVerificationBackupSummary(status);
	if (backupIssue.message) console.log(`Backup issue: ${backupIssue.message}`);
	if (verbose) {
		console.log("Diagnostics:");
		printVerificationIdentity(status);
		printVerificationTrustDiagnostics(status);
		printVerificationBackupStatus(status);
		console.log(`Recovery key stored: ${status.recoveryKeyStored ? "yes" : "no"}`);
		printTimestamp("Recovery key created at", status.recoveryKeyCreatedAt);
		console.log(`Pending verifications: ${status.pendingVerifications}`);
	} else console.log(`Recovery key stored: ${status.recoveryKeyStored ? "yes" : "no"}`);
	printVerificationGuidance(status, accountId);
}
function registerMatrixCli(params) {
	const root = params.program.command("matrix").description("Matrix channel utilities").addHelpText("after", () => "\nDocs: https://docs.openclaw.ai/channels/matrix\n");
	root.command("account").description("Manage matrix channel accounts").command("add").description("Add or update a matrix account (wrapper around channel setup)").option("--account <id>", "Account ID (default: normalized --name, else default)").option("--name <name>", "Optional display name for this account").option("--avatar-url <url>", "Optional Matrix avatar URL (mxc:// or http(s) URL)").option("--homeserver <url>", "Matrix homeserver URL").option("--allow-private-network", "Allow Matrix homeserver traffic to private/internal hosts for this account").option("--user-id <id>", "Matrix user ID").option("--access-token <token>", "Matrix access token").option("--password <password>", "Matrix password").option("--device-name <name>", "Matrix device display name").option("--initial-sync-limit <n>", "Matrix initial sync limit").option("--use-env", "Use MATRIX_* env vars (or MATRIX_<ACCOUNT_ID>_* for non-default accounts)").option("--verbose", "Show setup details").option("--json", "Output as JSON").action(async (options) => {
		await runMatrixCliCommand({
			verbose: options.verbose === true,
			json: options.json === true,
			run: async () => await addMatrixAccount({
				account: options.account,
				name: options.name,
				avatarUrl: options.avatarUrl,
				homeserver: options.homeserver,
				allowPrivateNetwork: options.allowPrivateNetwork === true,
				userId: options.userId,
				accessToken: options.accessToken,
				password: options.password,
				deviceName: options.deviceName,
				initialSyncLimit: options.initialSyncLimit,
				useEnv: options.useEnv === true
			}),
			onText: (result) => {
				console.log(`Saved matrix account: ${result.accountId}`);
				console.log(`Config path: ${result.configPath}`);
				console.log(`Credentials source: ${result.useEnv ? "MATRIX_* / MATRIX_<ACCOUNT_ID>_* env vars" : "inline config"}`);
				if (result.verificationBootstrap.attempted) if (result.verificationBootstrap.success) {
					console.log("Matrix verification bootstrap: complete");
					printTimestamp("Recovery key created at", result.verificationBootstrap.recoveryKeyCreatedAt);
					if (result.verificationBootstrap.backupVersion) console.log(`Backup version: ${result.verificationBootstrap.backupVersion}`);
				} else console.error(`Matrix verification bootstrap warning: ${result.verificationBootstrap.error}`);
				if (result.deviceHealth.error) console.error(`Matrix device health warning: ${result.deviceHealth.error}`);
				else if (result.deviceHealth.staleOpenClawDeviceIds.length > 0) console.log(`Matrix device hygiene warning: stale OpenClaw devices detected (${result.deviceHealth.staleOpenClawDeviceIds.join(", ")}). Run 'openclaw matrix devices prune-stale --account ${result.accountId}'.`);
				if (result.profile.attempted) if (result.profile.error) console.error(`Profile sync warning: ${result.profile.error}`);
				else {
					console.log(`Profile sync: name ${result.profile.displayNameUpdated ? "updated" : "unchanged"}, avatar ${result.profile.avatarUpdated ? "updated" : "unchanged"}`);
					if (result.profile.convertedAvatarFromHttp && result.profile.resolvedAvatarUrl) console.log(`Avatar converted and saved as: ${result.profile.resolvedAvatarUrl}`);
				}
				const bindHint = `openclaw agents bind --agent <id> --bind matrix:${result.accountId}`;
				console.log(`Bind this account to an agent: ${bindHint}`);
			},
			errorPrefix: "Account setup failed"
		});
	});
	root.command("profile").description("Manage Matrix bot profile").command("set").description("Update Matrix profile display name and/or avatar").option("--account <id>", "Account ID (for multi-account setups)").option("--name <name>", "Profile display name").option("--avatar-url <url>", "Profile avatar URL (mxc:// or http(s) URL)").option("--verbose", "Show detailed diagnostics").option("--json", "Output as JSON").action(async (options) => {
		await runMatrixCliCommand({
			verbose: options.verbose === true,
			json: options.json === true,
			run: async () => await setMatrixProfile({
				account: options.account,
				name: options.name,
				avatarUrl: options.avatarUrl
			}),
			onText: (result) => {
				printAccountLabel(result.accountId);
				console.log(`Config path: ${result.configPath}`);
				console.log(`Profile update: name ${result.profile.displayNameUpdated ? "updated" : "unchanged"}, avatar ${result.profile.avatarUpdated ? "updated" : "unchanged"}`);
				if (result.profile.convertedAvatarFromHttp && result.avatarUrl) console.log(`Avatar converted and saved as: ${result.avatarUrl}`);
			},
			errorPrefix: "Profile update failed"
		});
	});
	const direct = root.command("direct").description("Inspect and repair Matrix direct-room state");
	direct.command("inspect").description("Inspect direct-room mappings for a Matrix user").requiredOption("--user-id <id>", "Peer Matrix user ID").option("--account <id>", "Account ID (for multi-account setups)").option("--verbose", "Show detailed diagnostics").option("--json", "Output as JSON").action(async (options) => {
		const accountId = resolveMatrixCliAccountId(options.account);
		await runMatrixCliCommand({
			verbose: options.verbose === true,
			json: options.json === true,
			run: async () => await inspectMatrixDirectRoom({
				accountId,
				userId: options.userId
			}),
			onText: (result) => {
				printDirectRoomInspection(result);
			},
			errorPrefix: "Direct room inspection failed"
		});
	});
	direct.command("repair").description("Repair Matrix direct-room mappings for a Matrix user").requiredOption("--user-id <id>", "Peer Matrix user ID").option("--account <id>", "Account ID (for multi-account setups)").option("--verbose", "Show detailed diagnostics").option("--json", "Output as JSON").action(async (options) => {
		const accountId = resolveMatrixCliAccountId(options.account);
		await runMatrixCliCommand({
			verbose: options.verbose === true,
			json: options.json === true,
			run: async () => await repairMatrixDirectRoom({
				accountId,
				userId: options.userId
			}),
			onText: (result, verbose) => {
				printDirectRoomInspection(result);
				console.log(`Encrypted room creation: ${result.encrypted ? "enabled" : "disabled"}`);
				console.log(`Created room: ${result.createdRoomId ?? "none"}`);
				console.log(`m.direct updated: ${result.changed ? "yes" : "no"}`);
				if (verbose) {
					console.log(`m.direct before: ${JSON.stringify(result.directContentBefore[result.remoteUserId] ?? [])}`);
					console.log(`m.direct after: ${JSON.stringify(result.directContentAfter[result.remoteUserId] ?? [])}`);
				}
			},
			errorPrefix: "Direct room repair failed"
		});
	});
	const verify = root.command("verify").description("Device verification for Matrix E2EE");
	verify.command("status").description("Check Matrix device verification status").option("--account <id>", "Account ID (for multi-account setups)").option("--verbose", "Show detailed diagnostics").option("--include-recovery-key", "Include stored recovery key in output").option("--json", "Output as JSON").action(async (options) => {
		const accountId = resolveMatrixCliAccountId(options.account);
		await runMatrixCliCommand({
			verbose: options.verbose === true,
			json: options.json === true,
			run: async () => await getMatrixVerificationStatus({
				accountId,
				includeRecoveryKey: options.includeRecoveryKey === true
			}),
			onText: (status, verbose) => {
				printAccountLabel(accountId);
				printVerificationStatus(status, verbose, accountId);
			},
			errorPrefix: "Error"
		});
	});
	const backup = verify.command("backup").description("Matrix room-key backup health and restore");
	backup.command("status").description("Show Matrix room-key backup status for this device").option("--account <id>", "Account ID (for multi-account setups)").option("--verbose", "Show detailed diagnostics").option("--json", "Output as JSON").action(async (options) => {
		const accountId = resolveMatrixCliAccountId(options.account);
		await runMatrixCliCommand({
			verbose: options.verbose === true,
			json: options.json === true,
			run: async () => await getMatrixRoomKeyBackupStatus({ accountId }),
			onText: (status, verbose) => {
				printAccountLabel(accountId);
				printBackupSummary(status);
				if (verbose) printBackupStatus(status);
			},
			errorPrefix: "Backup status failed"
		});
	});
	backup.command("reset").description("Delete the current server backup and create a fresh room-key backup baseline").option("--account <id>", "Account ID (for multi-account setups)").option("--yes", "Confirm destructive backup reset", false).option("--verbose", "Show detailed diagnostics").option("--json", "Output as JSON").action(async (options) => {
		const accountId = resolveMatrixCliAccountId(options.account);
		await runMatrixCliCommand({
			verbose: options.verbose === true,
			json: options.json === true,
			run: async () => {
				if (options.yes !== true) throw new Error("Refusing to reset Matrix room-key backup without --yes");
				return await resetMatrixRoomKeyBackup({ accountId });
			},
			onText: (result, verbose) => {
				printAccountLabel(accountId);
				console.log(`Reset success: ${result.success ? "yes" : "no"}`);
				if (result.error) console.log(`Error: ${result.error}`);
				console.log(`Previous backup version: ${result.previousVersion ?? "none"}`);
				console.log(`Deleted backup version: ${result.deletedVersion ?? "none"}`);
				console.log(`Current backup version: ${result.createdVersion ?? "none"}`);
				printBackupSummary(result.backup);
				if (verbose) {
					printTimestamp("Reset at", result.resetAt);
					printBackupStatus(result.backup);
				}
			},
			shouldFail: (result) => !result.success,
			errorPrefix: "Backup reset failed",
			onJsonError: (message) => ({
				success: false,
				error: message
			})
		});
	});
	backup.command("restore").description("Restore encrypted room keys from server backup").option("--account <id>", "Account ID (for multi-account setups)").option("--recovery-key <key>", "Optional recovery key to load before restoring").option("--verbose", "Show detailed diagnostics").option("--json", "Output as JSON").action(async (options) => {
		const accountId = resolveMatrixCliAccountId(options.account);
		await runMatrixCliCommand({
			verbose: options.verbose === true,
			json: options.json === true,
			run: async () => await restoreMatrixRoomKeyBackup({
				accountId,
				recoveryKey: options.recoveryKey
			}),
			onText: (result, verbose) => {
				printAccountLabel(accountId);
				console.log(`Restore success: ${result.success ? "yes" : "no"}`);
				if (result.error) console.log(`Error: ${result.error}`);
				console.log(`Backup version: ${result.backupVersion ?? "none"}`);
				console.log(`Imported keys: ${result.imported}/${result.total}`);
				printBackupSummary(result.backup);
				if (verbose) {
					console.log(`Loaded key from secret storage: ${result.loadedFromSecretStorage ? "yes" : "no"}`);
					printTimestamp("Restored at", result.restoredAt);
					printBackupStatus(result.backup);
				}
			},
			shouldFail: (result) => !result.success,
			errorPrefix: "Backup restore failed",
			onJsonError: (message) => ({
				success: false,
				error: message
			})
		});
	});
	verify.command("bootstrap").description("Bootstrap Matrix cross-signing and device verification state").option("--account <id>", "Account ID (for multi-account setups)").option("--recovery-key <key>", "Recovery key to apply before bootstrap").option("--force-reset-cross-signing", "Force reset cross-signing identity before bootstrap").option("--verbose", "Show detailed diagnostics").option("--json", "Output as JSON").action(async (options) => {
		const accountId = resolveMatrixCliAccountId(options.account);
		await runMatrixCliCommand({
			verbose: options.verbose === true,
			json: options.json === true,
			run: async () => await bootstrapMatrixVerification({
				accountId,
				recoveryKey: options.recoveryKey,
				forceResetCrossSigning: options.forceResetCrossSigning === true
			}),
			onText: (result, verbose) => {
				printAccountLabel(accountId);
				console.log(`Bootstrap success: ${result.success ? "yes" : "no"}`);
				if (result.error) console.log(`Error: ${result.error}`);
				console.log(`Verified by owner: ${result.verification.verified ? "yes" : "no"}`);
				printVerificationIdentity(result.verification);
				if (verbose) {
					printVerificationTrustDiagnostics(result.verification);
					console.log(`Cross-signing published: ${result.crossSigning.published ? "yes" : "no"} (master=${result.crossSigning.masterKeyPublished ? "yes" : "no"}, self=${result.crossSigning.selfSigningKeyPublished ? "yes" : "no"}, user=${result.crossSigning.userSigningKeyPublished ? "yes" : "no"})`);
					printVerificationBackupStatus(result.verification);
					printTimestamp("Recovery key created at", result.verification.recoveryKeyCreatedAt);
					console.log(`Pending verifications: ${result.pendingVerifications}`);
				} else {
					console.log(`Cross-signing published: ${result.crossSigning.published ? "yes" : "no"}`);
					printVerificationBackupSummary(result.verification);
				}
				printVerificationGuidance({
					...result.verification,
					pendingVerifications: result.pendingVerifications
				}, accountId);
			},
			shouldFail: (result) => !result.success,
			errorPrefix: "Verification bootstrap failed",
			onJsonError: (message) => ({
				success: false,
				error: message
			})
		});
	});
	verify.command("device <key>").description("Verify device using a Matrix recovery key").option("--account <id>", "Account ID (for multi-account setups)").option("--verbose", "Show detailed diagnostics").option("--json", "Output as JSON").action(async (key, options) => {
		const accountId = resolveMatrixCliAccountId(options.account);
		await runMatrixCliCommand({
			verbose: options.verbose === true,
			json: options.json === true,
			run: async () => await verifyMatrixRecoveryKey(key, { accountId }),
			onText: (result, verbose) => {
				printAccountLabel(accountId);
				if (!result.success) {
					console.error(`Verification failed: ${result.error ?? "unknown error"}`);
					return;
				}
				console.log("Device verification completed successfully.");
				printVerificationIdentity(result);
				printVerificationBackupSummary(result);
				if (verbose) {
					printVerificationTrustDiagnostics(result);
					printVerificationBackupStatus(result);
					printTimestamp("Recovery key created at", result.recoveryKeyCreatedAt);
					printTimestamp("Verified at", result.verifiedAt);
				}
				printVerificationGuidance({
					...result,
					pendingVerifications: 0
				}, accountId);
			},
			shouldFail: (result) => !result.success,
			errorPrefix: "Verification failed",
			onJsonError: (message) => ({
				success: false,
				error: message
			})
		});
	});
	const devices = root.command("devices").description("Inspect and clean up Matrix devices");
	devices.command("list").description("List server-side Matrix devices for this account").option("--account <id>", "Account ID (for multi-account setups)").option("--verbose", "Show detailed diagnostics").option("--json", "Output as JSON").action(async (options) => {
		const accountId = resolveMatrixCliAccountId(options.account);
		await runMatrixCliCommand({
			verbose: options.verbose === true,
			json: options.json === true,
			run: async () => await listMatrixOwnDevices({ accountId }),
			onText: (result) => {
				printAccountLabel(accountId);
				printMatrixOwnDevices(result);
			},
			errorPrefix: "Device listing failed"
		});
	});
	devices.command("prune-stale").description("Delete stale OpenClaw-managed devices for this account").option("--account <id>", "Account ID (for multi-account setups)").option("--verbose", "Show detailed diagnostics").option("--json", "Output as JSON").action(async (options) => {
		const accountId = resolveMatrixCliAccountId(options.account);
		await runMatrixCliCommand({
			verbose: options.verbose === true,
			json: options.json === true,
			run: async () => await pruneMatrixStaleGatewayDevices({ accountId }),
			onText: (result, verbose) => {
				printAccountLabel(accountId);
				console.log(`Deleted stale OpenClaw devices: ${result.deletedDeviceIds.length ? result.deletedDeviceIds.join(", ") : "none"}`);
				console.log(`Current device: ${result.currentDeviceId ?? "unknown"}`);
				console.log(`Remaining devices: ${result.remainingDevices.length}`);
				if (verbose) {
					console.log("Devices before cleanup:");
					printMatrixOwnDevices(result.before);
					console.log("Devices after cleanup:");
					printMatrixOwnDevices(result.remainingDevices);
				}
			},
			errorPrefix: "Device cleanup failed"
		});
	});
}
//#endregion
export { registerMatrixCli };
