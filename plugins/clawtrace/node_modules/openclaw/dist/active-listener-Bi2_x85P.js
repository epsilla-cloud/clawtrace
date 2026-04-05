import { g as DEFAULT_ACCOUNT_ID } from "./session-key-BhxcMJEE.js";
import { t as formatCliCommand } from "./command-format-CR4nOXgc.js";
import "./routing-LZlQ54P8.js";
import "./cli-runtime-BnYvpUgb.js";
//#region extensions/whatsapp/src/active-listener.ts
const WHATSAPP_ACTIVE_LISTENER_STATE_KEY = Symbol.for("openclaw.whatsapp.activeListenerState");
const g = globalThis;
if (!g[WHATSAPP_ACTIVE_LISTENER_STATE_KEY]) g[WHATSAPP_ACTIVE_LISTENER_STATE_KEY] = {
	listeners: /* @__PURE__ */ new Map(),
	current: null
};
const state = g[WHATSAPP_ACTIVE_LISTENER_STATE_KEY];
function setCurrentListener(listener) {
	state.current = listener;
}
function resolveWebAccountId(accountId) {
	return (accountId ?? "").trim() || "default";
}
function requireActiveWebListener(accountId) {
	const id = resolveWebAccountId(accountId);
	const listener = state.listeners.get(id) ?? null;
	if (!listener) throw new Error(`No active WhatsApp Web listener (account: ${id}). Start the gateway, then link WhatsApp with: ${formatCliCommand(`openclaw channels login --channel whatsapp --account ${id}`)}.`);
	return {
		accountId: id,
		listener
	};
}
function setActiveWebListener(accountIdOrListener, maybeListener) {
	const { accountId, listener } = typeof accountIdOrListener === "string" ? {
		accountId: accountIdOrListener,
		listener: maybeListener ?? null
	} : {
		accountId: DEFAULT_ACCOUNT_ID,
		listener: accountIdOrListener ?? null
	};
	const id = resolveWebAccountId(accountId);
	if (!listener) state.listeners.delete(id);
	else state.listeners.set(id, listener);
	if (id === "default") setCurrentListener(listener);
}
function getActiveWebListener(accountId) {
	const id = resolveWebAccountId(accountId);
	return state.listeners.get(id) ?? null;
}
//#endregion
export { setActiveWebListener as i, requireActiveWebListener as n, resolveWebAccountId as r, getActiveWebListener as t };
