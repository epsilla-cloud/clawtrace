//#region src/secrets/json-pointer.ts
function failOrUndefined(params) {
	if (params.onMissing === "throw") throw new Error(params.message);
}
function decodeJsonPointerToken(token) {
	return token.replace(/~1/g, "/").replace(/~0/g, "~");
}
function encodeJsonPointerToken(token) {
	return token.replace(/~/g, "~0").replace(/\//g, "~1");
}
function readJsonPointer(root, pointer, options = {}) {
	const onMissing = options.onMissing ?? "throw";
	if (!pointer.startsWith("/")) return failOrUndefined({
		onMissing,
		message: "File-backed secret ids must be absolute JSON pointers (for example: \"/providers/openai/apiKey\")."
	});
	const tokens = pointer.slice(1).split("/").map((token) => decodeJsonPointerToken(token));
	let current = root;
	for (const token of tokens) {
		if (Array.isArray(current)) {
			const index = Number.parseInt(token, 10);
			if (!Number.isFinite(index) || index < 0 || index >= current.length) return failOrUndefined({
				onMissing,
				message: `JSON pointer segment "${token}" is out of bounds.`
			});
			current = current[index];
			continue;
		}
		if (typeof current !== "object" || current === null || Array.isArray(current)) return failOrUndefined({
			onMissing,
			message: `JSON pointer segment "${token}" does not exist.`
		});
		const record = current;
		if (!Object.hasOwn(record, token)) return failOrUndefined({
			onMissing,
			message: `JSON pointer segment "${token}" does not exist.`
		});
		current = record[token];
	}
	return current;
}
//#endregion
export { readJsonPointer as n, encodeJsonPointerToken as t };
