//#region src/plugin-sdk/boolean-param.ts
/** Read loose boolean params from tool input that may arrive as booleans or "true"/"false" strings. */
function readBooleanParam(params, key) {
	const raw = params[key];
	if (typeof raw === "boolean") return raw;
	if (typeof raw === "string") {
		const trimmed = raw.trim().toLowerCase();
		if (trimmed === "true") return true;
		if (trimmed === "false") return false;
	}
}
//#endregion
export { readBooleanParam as t };
