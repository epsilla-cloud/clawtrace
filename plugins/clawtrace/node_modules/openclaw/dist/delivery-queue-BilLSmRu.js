import { _ as resolveStateDir } from "./paths-Y4UT24Of.js";
import { n as generateSecureUuid } from "./secure-random-DJI032Bq.js";
import fsSync from "node:fs";
import path from "node:path";
//#region src/infra/outbound/delivery-queue-storage.ts
const QUEUE_DIRNAME = "delivery-queue";
const FAILED_DIRNAME = "failed";
function resolveQueueDir(stateDir) {
	const base = stateDir ?? resolveStateDir();
	return path.join(base, QUEUE_DIRNAME);
}
function resolveFailedDir(stateDir) {
	return path.join(resolveQueueDir(stateDir), FAILED_DIRNAME);
}
function resolveQueueEntryPaths(id, stateDir) {
	const queueDir = resolveQueueDir(stateDir);
	return {
		jsonPath: path.join(queueDir, `${id}.json`),
		deliveredPath: path.join(queueDir, `${id}.delivered`)
	};
}
function getErrnoCode(err) {
	return err && typeof err === "object" && "code" in err ? String(err.code) : null;
}
async function unlinkBestEffort(filePath) {
	try {
		await fsSync.promises.unlink(filePath);
	} catch {}
}
async function writeQueueEntry(filePath, entry) {
	const tmp = `${filePath}.${process.pid}.tmp`;
	await fsSync.promises.writeFile(tmp, JSON.stringify(entry, null, 2), {
		encoding: "utf-8",
		mode: 384
	});
	await fsSync.promises.rename(tmp, filePath);
}
async function readQueueEntry(filePath) {
	return JSON.parse(await fsSync.promises.readFile(filePath, "utf-8"));
}
function normalizeLegacyQueuedDeliveryEntry(entry) {
	if (typeof entry.lastAttemptAt === "number" && Number.isFinite(entry.lastAttemptAt) && entry.lastAttemptAt > 0 || entry.retryCount <= 0) return {
		entry,
		migrated: false
	};
	if (!(typeof entry.enqueuedAt === "number" && Number.isFinite(entry.enqueuedAt) && entry.enqueuedAt > 0)) return {
		entry,
		migrated: false
	};
	return {
		entry: {
			...entry,
			lastAttemptAt: entry.enqueuedAt
		},
		migrated: true
	};
}
/** Ensure the queue directory (and failed/ subdirectory) exist. */
async function ensureQueueDir(stateDir) {
	const queueDir = resolveQueueDir(stateDir);
	await fsSync.promises.mkdir(queueDir, {
		recursive: true,
		mode: 448
	});
	await fsSync.promises.mkdir(resolveFailedDir(stateDir), {
		recursive: true,
		mode: 448
	});
	return queueDir;
}
/** Persist a delivery entry to disk before attempting send. Returns the entry ID. */
async function enqueueDelivery(params, stateDir) {
	const queueDir = await ensureQueueDir(stateDir);
	const id = generateSecureUuid();
	await writeQueueEntry(path.join(queueDir, `${id}.json`), {
		id,
		enqueuedAt: Date.now(),
		channel: params.channel,
		to: params.to,
		accountId: params.accountId,
		payloads: params.payloads,
		threadId: params.threadId,
		replyToId: params.replyToId,
		bestEffort: params.bestEffort,
		gifPlayback: params.gifPlayback,
		forceDocument: params.forceDocument,
		silent: params.silent,
		mirror: params.mirror,
		gatewayClientScopes: params.gatewayClientScopes,
		retryCount: 0
	});
	return id;
}
/** Remove a successfully delivered entry from the queue.
*
* Uses a two-phase approach so that a crash between delivery and cleanup
* does not cause the message to be replayed on the next recovery scan:
*   Phase 1: atomic rename  {id}.json → {id}.delivered
*   Phase 2: unlink the .delivered marker
* If the process dies between phase 1 and phase 2 the marker is cleaned up
* by {@link loadPendingDeliveries} on the next startup without re-sending.
*/
async function ackDelivery(id, stateDir) {
	const { jsonPath, deliveredPath } = resolveQueueEntryPaths(id, stateDir);
	try {
		await fsSync.promises.rename(jsonPath, deliveredPath);
	} catch (err) {
		if (getErrnoCode(err) === "ENOENT") {
			await unlinkBestEffort(deliveredPath);
			return;
		}
		throw err;
	}
	await unlinkBestEffort(deliveredPath);
}
/** Update a queue entry after a failed delivery attempt. */
async function failDelivery(id, error, stateDir) {
	const filePath = path.join(resolveQueueDir(stateDir), `${id}.json`);
	const entry = await readQueueEntry(filePath);
	entry.retryCount += 1;
	entry.lastAttemptAt = Date.now();
	entry.lastError = error;
	await writeQueueEntry(filePath, entry);
}
/** Load all pending delivery entries from the queue directory. */
async function loadPendingDeliveries(stateDir) {
	const queueDir = resolveQueueDir(stateDir);
	let files;
	try {
		files = await fsSync.promises.readdir(queueDir);
	} catch (err) {
		if (getErrnoCode(err) === "ENOENT") return [];
		throw err;
	}
	for (const file of files) if (file.endsWith(".delivered")) await unlinkBestEffort(path.join(queueDir, file));
	const entries = [];
	for (const file of files) {
		if (!file.endsWith(".json")) continue;
		const filePath = path.join(queueDir, file);
		try {
			if (!(await fsSync.promises.stat(filePath)).isFile()) continue;
			const { entry, migrated } = normalizeLegacyQueuedDeliveryEntry(await readQueueEntry(filePath));
			if (migrated) await writeQueueEntry(filePath, entry);
			entries.push(entry);
		} catch {}
	}
	return entries;
}
/** Move a queue entry to the failed/ subdirectory. */
async function moveToFailed(id, stateDir) {
	const queueDir = resolveQueueDir(stateDir);
	const failedDir = resolveFailedDir(stateDir);
	await fsSync.promises.mkdir(failedDir, {
		recursive: true,
		mode: 448
	});
	await fsSync.promises.rename(path.join(queueDir, `${id}.json`), path.join(failedDir, `${id}.json`));
}
/** Backoff delays in milliseconds indexed by retry count (1-based). */
const BACKOFF_MS = [
	5e3,
	25e3,
	12e4,
	6e5
];
const PERMANENT_ERROR_PATTERNS = [
	/no conversation reference found/i,
	/chat not found/i,
	/user not found/i,
	/bot.*not.*member/i,
	/bot was blocked by the user/i,
	/forbidden: bot was kicked/i,
	/chat_id is empty/i,
	/recipient is not a valid/i,
	/outbound not configured for channel/i,
	/ambiguous discord recipient/i
];
function createEmptyRecoverySummary() {
	return {
		recovered: 0,
		failed: 0,
		skippedMaxRetries: 0,
		deferredBackoff: 0
	};
}
function buildRecoveryDeliverParams(entry, cfg) {
	return {
		cfg,
		channel: entry.channel,
		to: entry.to,
		accountId: entry.accountId,
		payloads: entry.payloads,
		threadId: entry.threadId,
		replyToId: entry.replyToId,
		bestEffort: entry.bestEffort,
		gifPlayback: entry.gifPlayback,
		forceDocument: entry.forceDocument,
		silent: entry.silent,
		mirror: entry.mirror,
		gatewayClientScopes: entry.gatewayClientScopes,
		skipQueue: true
	};
}
async function moveEntryToFailedWithLogging(entryId, log, stateDir) {
	try {
		await moveToFailed(entryId, stateDir);
	} catch (err) {
		log.error(`Failed to move entry ${entryId} to failed/: ${String(err)}`);
	}
}
async function deferRemainingEntriesForBudget(entries, stateDir) {
	await Promise.allSettled(entries.map((entry) => failDelivery(entry.id, "recovery time budget exceeded", stateDir)));
}
/** Compute the backoff delay in ms for a given retry count. */
function computeBackoffMs(retryCount) {
	if (retryCount <= 0) return 0;
	return BACKOFF_MS[Math.min(retryCount - 1, BACKOFF_MS.length - 1)] ?? BACKOFF_MS.at(-1) ?? 0;
}
function isEntryEligibleForRecoveryRetry(entry, now) {
	const backoff = computeBackoffMs(entry.retryCount + 1);
	if (backoff <= 0) return { eligible: true };
	if (entry.retryCount === 0 && entry.lastAttemptAt === void 0) return { eligible: true };
	const nextEligibleAt = (typeof entry.lastAttemptAt === "number" && Number.isFinite(entry.lastAttemptAt) && entry.lastAttemptAt > 0 ? entry.lastAttemptAt ?? entry.enqueuedAt : entry.enqueuedAt) + backoff;
	if (now >= nextEligibleAt) return { eligible: true };
	return {
		eligible: false,
		remainingBackoffMs: nextEligibleAt - now
	};
}
function isPermanentDeliveryError(error) {
	return PERMANENT_ERROR_PATTERNS.some((re) => re.test(error));
}
/**
* On gateway startup, scan the delivery queue and retry any pending entries.
* Uses exponential backoff and moves entries that exceed MAX_RETRIES to failed/.
*/
async function recoverPendingDeliveries(opts) {
	const pending = await loadPendingDeliveries(opts.stateDir);
	if (pending.length === 0) return createEmptyRecoverySummary();
	pending.sort((a, b) => a.enqueuedAt - b.enqueuedAt);
	opts.log.info(`Found ${pending.length} pending delivery entries — starting recovery`);
	const deadline = Date.now() + (opts.maxRecoveryMs ?? 6e4);
	const summary = createEmptyRecoverySummary();
	for (let i = 0; i < pending.length; i++) {
		const entry = pending[i];
		const now = Date.now();
		if (now >= deadline) {
			opts.log.warn(`Recovery time budget exceeded — remaining entries deferred to next startup`);
			await deferRemainingEntriesForBudget(pending.slice(i), opts.stateDir);
			break;
		}
		if (entry.retryCount >= 5) {
			opts.log.warn(`Delivery ${entry.id} exceeded max retries (${entry.retryCount}/5) — moving to failed/`);
			await moveEntryToFailedWithLogging(entry.id, opts.log, opts.stateDir);
			summary.skippedMaxRetries += 1;
			continue;
		}
		const retryEligibility = isEntryEligibleForRecoveryRetry(entry, now);
		if (!retryEligibility.eligible) {
			summary.deferredBackoff += 1;
			opts.log.info(`Delivery ${entry.id} not ready for retry yet — backoff ${retryEligibility.remainingBackoffMs}ms remaining`);
			continue;
		}
		try {
			await opts.deliver(buildRecoveryDeliverParams(entry, opts.cfg));
			await ackDelivery(entry.id, opts.stateDir);
			summary.recovered += 1;
			opts.log.info(`Recovered delivery ${entry.id} to ${entry.channel}:${entry.to}`);
		} catch (err) {
			const errMsg = err instanceof Error ? err.message : String(err);
			if (isPermanentDeliveryError(errMsg)) {
				opts.log.warn(`Delivery ${entry.id} hit permanent error — moving to failed/: ${errMsg}`);
				await moveEntryToFailedWithLogging(entry.id, opts.log, opts.stateDir);
				summary.failed += 1;
				continue;
			}
			try {
				await failDelivery(entry.id, errMsg, opts.stateDir);
			} catch {}
			summary.failed += 1;
			opts.log.warn(`Retry failed for delivery ${entry.id}: ${errMsg}`);
		}
	}
	opts.log.info(`Delivery recovery complete: ${summary.recovered} recovered, ${summary.failed} failed, ${summary.skippedMaxRetries} skipped (max retries), ${summary.deferredBackoff} deferred (backoff)`);
	return summary;
}
//#endregion
export { ackDelivery as a, failDelivery as c, recoverPendingDeliveries as i, loadPendingDeliveries as l, isEntryEligibleForRecoveryRetry as n, enqueueDelivery as o, isPermanentDeliveryError as r, ensureQueueDir as s, computeBackoffMs as t, moveToFailed as u };
