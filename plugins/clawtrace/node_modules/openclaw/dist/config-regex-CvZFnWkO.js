import { n as compileSafeRegexDetailed } from "./safe-regex-tLlDZYfM.js";
//#region src/security/config-regex.ts
function normalizeRejectReason(result) {
	if (result.reason === null || result.reason === "empty") return null;
	return result.reason;
}
function compileConfigRegex(pattern, flags = "") {
	const result = compileSafeRegexDetailed(pattern, flags);
	if (result.reason === "empty") return null;
	return {
		regex: result.regex,
		pattern: result.source,
		flags: result.flags,
		reason: normalizeRejectReason(result)
	};
}
function compileConfigRegexes(patterns, flags = "") {
	const regexes = [];
	const rejected = [];
	for (const pattern of patterns) {
		const compiled = compileConfigRegex(pattern, flags);
		if (!compiled) continue;
		if (compiled.regex) {
			regexes.push(compiled.regex);
			continue;
		}
		rejected.push({
			pattern: compiled.pattern,
			flags: compiled.flags,
			reason: compiled.reason
		});
	}
	return {
		regexes,
		rejected
	};
}
//#endregion
export { compileConfigRegexes as n, compileConfigRegex as t };
