import { n as assertWebChannel, p as normalizeE164, w as toWhatsappJid } from "./utils-BfvDpbwh.js";
import { Po as createDefaultDeps, f as loadConfig, fN as loadSessionStore, gN as saveSessionStore, gc as resolveSessionKey, hc as deriveSessionKey } from "./auth-profiles-B5ypC5S-.js";
import { l as resolveStorePath } from "./paths-CFxPq48L.js";
import { r as applyTemplate } from "./inbound-context-CaoGLQ0Y.js";
import { i as handlePortError, n as describePortOwner, r as ensurePortAvailable, t as PortInUseError } from "./ports-DaedVTZA.js";
import { t as waitForever } from "./wait-CRsXDYXY.js";
//#region src/library.ts
let replyRuntimePromise = null;
let promptRuntimePromise = null;
let binariesRuntimePromise = null;
let execRuntimePromise = null;
let whatsappRuntimePromise = null;
function loadReplyRuntime() {
	replyRuntimePromise ??= import("./reply.runtime-GjkkVK8f.js");
	return replyRuntimePromise;
}
function loadPromptRuntime() {
	promptRuntimePromise ??= import("./prompt-BhjhODzQ.js");
	return promptRuntimePromise;
}
function loadBinariesRuntime() {
	binariesRuntimePromise ??= import("./binaries-AuXDGFyt.js");
	return binariesRuntimePromise;
}
function loadExecRuntime() {
	execRuntimePromise ??= import("./exec-58xV_SWS.js");
	return execRuntimePromise;
}
function loadWhatsAppRuntime() {
	whatsappRuntimePromise ??= import("./runtime-whatsapp-boundary-CQAc3Omw.js");
	return whatsappRuntimePromise;
}
const getReplyFromConfig = async (...args) => (await loadReplyRuntime()).getReplyFromConfig(...args);
const promptYesNo = async (...args) => (await loadPromptRuntime()).promptYesNo(...args);
const ensureBinary = async (...args) => (await loadBinariesRuntime()).ensureBinary(...args);
const runExec = async (...args) => (await loadExecRuntime()).runExec(...args);
const runCommandWithTimeout = async (...args) => (await loadExecRuntime()).runCommandWithTimeout(...args);
const monitorWebChannel = async (...args) => (await loadWhatsAppRuntime()).monitorWebChannel(...args);
//#endregion
export { PortInUseError, applyTemplate, assertWebChannel, createDefaultDeps, deriveSessionKey, describePortOwner, ensureBinary, ensurePortAvailable, getReplyFromConfig, handlePortError, loadConfig, loadSessionStore, monitorWebChannel, normalizeE164, promptYesNo, resolveSessionKey, resolveStorePath, runCommandWithTimeout, runExec, saveSessionStore, toWhatsappJid, waitForever };
