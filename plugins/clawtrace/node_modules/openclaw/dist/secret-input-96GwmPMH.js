import { a as hasConfiguredSecretInput, c as normalizeResolvedSecretInputString } from "./types.secrets-Rqz2qv-w.js";
//#region packages/memory-host-sdk/src/host/secret-input.ts
function hasConfiguredMemorySecretInput(value) {
	return hasConfiguredSecretInput(value);
}
function resolveMemorySecretInputString(params) {
	return normalizeResolvedSecretInputString({
		value: params.value,
		path: params.path
	});
}
//#endregion
export { resolveMemorySecretInputString as n, hasConfiguredMemorySecretInput as t };
