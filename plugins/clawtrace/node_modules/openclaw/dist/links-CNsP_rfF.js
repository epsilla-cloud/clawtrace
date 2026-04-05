import { D as formatTerminalLink } from "./utils-BfvDpbwh.js";
//#region src/terminal/links.ts
function resolveDocsRoot() {
	return "https://docs.openclaw.ai";
}
resolveDocsRoot();
function formatDocsLink(path, label, opts) {
	const trimmed = path.trim();
	const docsRoot = resolveDocsRoot();
	const url = trimmed.startsWith("http") ? trimmed : `${docsRoot}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
	return formatTerminalLink(label ?? url, url, {
		fallback: opts?.fallback ?? url,
		force: opts?.force
	});
}
//#endregion
export { formatDocsLink as t };
