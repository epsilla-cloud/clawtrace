import { r as getActivePluginRegistry } from "./runtime-DgxFwo8V.js";
import { r as normalizeChatChannelId } from "./chat-meta-xAV2SRO1.js";
//#region src/channels/registry.ts
function listRegisteredChannelPluginEntries() {
	return getActivePluginRegistry()?.channels ?? [];
}
function findRegisteredChannelPluginEntry(normalizedKey) {
	return listRegisteredChannelPluginEntries().find((entry) => {
		const id = String(entry.plugin.id ?? "").trim().toLowerCase();
		if (id && id === normalizedKey) return true;
		return (entry.plugin.meta?.aliases ?? []).some((alias) => alias.trim().toLowerCase() === normalizedKey);
	});
}
function findRegisteredChannelPluginEntryById(id) {
	const normalizedId = normalizeChannelKey(id);
	if (!normalizedId) return;
	return listRegisteredChannelPluginEntries().find((entry) => normalizeChannelKey(entry.plugin.id) === normalizedId);
}
const normalizeChannelKey = (raw) => {
	return raw?.trim().toLowerCase() || void 0;
};
function normalizeChannelId(raw) {
	return normalizeChatChannelId(raw);
}
function normalizeAnyChannelId(raw) {
	const key = normalizeChannelKey(raw);
	if (!key) return null;
	return findRegisteredChannelPluginEntry(key)?.plugin.id ?? null;
}
function listRegisteredChannelPluginIds() {
	return listRegisteredChannelPluginEntries().flatMap((entry) => {
		const id = entry.plugin.id?.trim();
		return id ? [id] : [];
	});
}
function getRegisteredChannelPluginMeta(id) {
	return findRegisteredChannelPluginEntryById(id)?.plugin.meta ?? null;
}
function formatChannelPrimerLine(meta) {
	return `${meta.label}: ${meta.blurb}`;
}
function formatChannelSelectionLine(meta, docsLink) {
	const docsPrefix = meta.selectionDocsPrefix ?? "Docs:";
	const docsLabel = meta.docsLabel ?? meta.id;
	const docs = meta.selectionDocsOmitLabel ? docsLink(meta.docsPath) : docsLink(meta.docsPath, docsLabel);
	const extras = (meta.selectionExtras ?? []).filter(Boolean).join(" ");
	return `${meta.label} — ${meta.blurb} ${docsPrefix ? `${docsPrefix} ` : ""}${docs}${extras ? ` ${extras}` : ""}`;
}
//#endregion
export { normalizeAnyChannelId as a, listRegisteredChannelPluginIds as i, formatChannelSelectionLine as n, normalizeChannelId as o, getRegisteredChannelPluginMeta as r, formatChannelPrimerLine as t };
