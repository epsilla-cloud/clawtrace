import { m as defaultRuntime } from "./subsystem-CJEvHE2o.js";
import { XP as renderQrPngBase64, f as loadConfig } from "./auth-profiles-B5ypC5S-.js";
import { n as info, o as success, t as danger } from "./globals-0H99T-Tx.js";
import { r as logInfo } from "./logger-Bps9nlrB.js";
import { s as resolveWhatsAppAccount } from "./accounts-BmTz4gps.js";
import "./runtime-env-5bDkE44b.js";
import { c as readWebSelfId, d as webAuthExists, i as logoutWeb } from "./auth-store-98jWycU0.js";
import { n as getStatusCode, t as formatError } from "./session-errors-C0GNlAbI.js";
import { a as waitForWaConnection, d as DisconnectReason, i as waitForCredsSaveQueueWithTimeout, t as createWaSocket } from "./session-Db9ql_Z9.js";
import { randomUUID } from "node:crypto";
//#region extensions/whatsapp/src/login-qr.ts
const LOGGED_OUT_STATUS = DisconnectReason?.loggedOut ?? 401;
const ACTIVE_LOGIN_TTL_MS = 3 * 6e4;
const activeLogins = /* @__PURE__ */ new Map();
function closeSocket(sock) {
	try {
		sock.ws?.close();
	} catch {}
}
async function resetActiveLogin(accountId, reason) {
	const login = activeLogins.get(accountId);
	if (login) {
		closeSocket(login.sock);
		activeLogins.delete(accountId);
	}
	if (reason) logInfo(reason);
}
function isLoginFresh(login) {
	return Date.now() - login.startedAt < ACTIVE_LOGIN_TTL_MS;
}
function attachLoginWaiter(accountId, login) {
	login.waitPromise = waitForWaConnection(login.sock).then(() => {
		const current = activeLogins.get(accountId);
		if (current?.id === login.id) current.connected = true;
	}).catch((err) => {
		const current = activeLogins.get(accountId);
		if (current?.id !== login.id) return;
		current.error = formatError(err);
		current.errorStatus = getStatusCode(err);
	});
}
async function restartLoginSocket(login, runtime) {
	if (login.restartAttempted) return false;
	login.restartAttempted = true;
	runtime.log(info("WhatsApp asked for a restart after pairing (code 515); waiting for creds to save…"));
	closeSocket(login.sock);
	await waitForCredsSaveQueueWithTimeout(login.authDir);
	try {
		login.sock = await createWaSocket(false, login.verbose, { authDir: login.authDir });
		login.connected = false;
		login.error = void 0;
		login.errorStatus = void 0;
		attachLoginWaiter(login.accountId, login);
		return true;
	} catch (err) {
		login.error = formatError(err);
		login.errorStatus = getStatusCode(err);
		return false;
	}
}
async function startWebLoginWithQr(opts = {}) {
	const runtime = opts.runtime ?? defaultRuntime;
	const account = resolveWhatsAppAccount({
		cfg: loadConfig(),
		accountId: opts.accountId
	});
	const hasWeb = await webAuthExists(account.authDir);
	const selfId = readWebSelfId(account.authDir);
	if (hasWeb && !opts.force) return { message: `WhatsApp is already linked (${selfId.e164 ?? selfId.jid ?? "unknown"}). Say “relink” if you want a fresh QR.` };
	const existing = activeLogins.get(account.accountId);
	if (existing && isLoginFresh(existing) && existing.qrDataUrl) return {
		qrDataUrl: existing.qrDataUrl,
		message: "QR already active. Scan it in WhatsApp → Linked Devices."
	};
	await resetActiveLogin(account.accountId);
	let resolveQr = null;
	let rejectQr = null;
	const qrPromise = new Promise((resolve, reject) => {
		resolveQr = resolve;
		rejectQr = reject;
	});
	const qrTimer = setTimeout(() => {
		rejectQr?.(/* @__PURE__ */ new Error("Timed out waiting for WhatsApp QR"));
	}, Math.max(opts.timeoutMs ?? 3e4, 5e3));
	let sock;
	let pendingQr = null;
	try {
		sock = await createWaSocket(false, Boolean(opts.verbose), {
			authDir: account.authDir,
			onQr: (qr) => {
				if (pendingQr) return;
				pendingQr = qr;
				const current = activeLogins.get(account.accountId);
				if (current && !current.qr) current.qr = qr;
				clearTimeout(qrTimer);
				runtime.log(info("WhatsApp QR received."));
				resolveQr?.(qr);
			}
		});
	} catch (err) {
		clearTimeout(qrTimer);
		await resetActiveLogin(account.accountId);
		return { message: `Failed to start WhatsApp login: ${String(err)}` };
	}
	const login = {
		accountId: account.accountId,
		authDir: account.authDir,
		isLegacyAuthDir: account.isLegacyAuthDir,
		id: randomUUID(),
		sock,
		startedAt: Date.now(),
		connected: false,
		waitPromise: Promise.resolve(),
		restartAttempted: false,
		verbose: Boolean(opts.verbose)
	};
	activeLogins.set(account.accountId, login);
	if (pendingQr && !login.qr) login.qr = pendingQr;
	attachLoginWaiter(account.accountId, login);
	let qr;
	try {
		qr = await qrPromise;
	} catch (err) {
		clearTimeout(qrTimer);
		await resetActiveLogin(account.accountId);
		return { message: `Failed to get QR: ${String(err)}` };
	}
	login.qrDataUrl = `data:image/png;base64,${await renderQrPngBase64(qr)}`;
	return {
		qrDataUrl: login.qrDataUrl,
		message: "Scan this QR in WhatsApp → Linked Devices."
	};
}
async function waitForWebLogin(opts = {}) {
	const runtime = opts.runtime ?? defaultRuntime;
	const account = resolveWhatsAppAccount({
		cfg: loadConfig(),
		accountId: opts.accountId
	});
	const activeLogin = activeLogins.get(account.accountId);
	if (!activeLogin) return {
		connected: false,
		message: "No active WhatsApp login in progress."
	};
	const login = activeLogin;
	if (!isLoginFresh(login)) {
		await resetActiveLogin(account.accountId);
		return {
			connected: false,
			message: "The login QR expired. Ask me to generate a new one."
		};
	}
	const timeoutMs = Math.max(opts.timeoutMs ?? 12e4, 1e3);
	const deadline = Date.now() + timeoutMs;
	while (true) {
		const remaining = deadline - Date.now();
		if (remaining <= 0) return {
			connected: false,
			message: "Still waiting for the QR scan. Let me know when you’ve scanned it."
		};
		const timeout = new Promise((resolve) => setTimeout(() => resolve("timeout"), remaining));
		if (await Promise.race([login.waitPromise.then(() => "done"), timeout]) === "timeout") return {
			connected: false,
			message: "Still waiting for the QR scan. Let me know when you’ve scanned it."
		};
		if (login.error) {
			if (login.errorStatus === LOGGED_OUT_STATUS) {
				await logoutWeb({
					authDir: login.authDir,
					isLegacyAuthDir: login.isLegacyAuthDir,
					runtime
				});
				const message = "WhatsApp reported the session is logged out. Cleared cached web session; please scan a new QR.";
				await resetActiveLogin(account.accountId, message);
				runtime.log(danger(message));
				return {
					connected: false,
					message
				};
			}
			if (login.errorStatus === 515) {
				if (await restartLoginSocket(login, runtime) && isLoginFresh(login)) continue;
			}
			const message = `WhatsApp login failed: ${login.error}`;
			await resetActiveLogin(account.accountId, message);
			runtime.log(danger(message));
			return {
				connected: false,
				message
			};
		}
		if (login.connected) {
			const message = "✅ Linked! WhatsApp is ready.";
			runtime.log(success(message));
			await resetActiveLogin(account.accountId);
			return {
				connected: true,
				message
			};
		}
		return {
			connected: false,
			message: "Login ended without a connection."
		};
	}
}
//#endregion
export { startWebLoginWithQr, waitForWebLogin };
