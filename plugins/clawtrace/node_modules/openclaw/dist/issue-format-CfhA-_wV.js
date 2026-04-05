import { r as stripAnsi } from "./ansi-B_0KjIJj.js";
//#region src/terminal/safe-text.ts
/**
* Normalize untrusted text for single-line terminal/log rendering.
*/
function sanitizeTerminalText(input) {
	const normalized = stripAnsi(input).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
	let sanitized = "";
	for (const char of normalized) {
		const code = char.charCodeAt(0);
		if (!(code >= 0 && code <= 31 || code >= 127 && code <= 159)) sanitized += char;
	}
	return sanitized;
}
//#endregion
//#region src/config/issue-format.ts
function normalizeConfigIssuePath(path) {
	if (typeof path !== "string") return "<root>";
	const trimmed = path.trim();
	return trimmed ? trimmed : "<root>";
}
function normalizeConfigIssue(issue) {
	const hasAllowedValues = Array.isArray(issue.allowedValues) && issue.allowedValues.length > 0;
	return {
		path: normalizeConfigIssuePath(issue.path),
		message: issue.message,
		...hasAllowedValues ? { allowedValues: issue.allowedValues } : {},
		...hasAllowedValues && typeof issue.allowedValuesHiddenCount === "number" && issue.allowedValuesHiddenCount > 0 ? { allowedValuesHiddenCount: issue.allowedValuesHiddenCount } : {}
	};
}
function normalizeConfigIssues(issues) {
	return issues.map((issue) => normalizeConfigIssue(issue));
}
function resolveIssuePathForLine(path, opts) {
	if (opts?.normalizeRoot) return normalizeConfigIssuePath(path);
	return typeof path === "string" ? path : "";
}
function formatConfigIssueLine(issue, marker = "-", opts) {
	return `${marker ? `${marker} ` : ""}${sanitizeTerminalText(resolveIssuePathForLine(issue.path, opts))}: ${sanitizeTerminalText(issue.message)}`;
}
function formatConfigIssueLines(issues, marker = "-", opts) {
	return issues.map((issue) => formatConfigIssueLine(issue, marker, opts));
}
//#endregion
export { normalizeConfigIssues as a, normalizeConfigIssuePath as i, formatConfigIssueLines as n, sanitizeTerminalText as o, normalizeConfigIssue as r, formatConfigIssueLine as t };
