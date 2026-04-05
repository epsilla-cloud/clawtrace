//#region src/plugin-sdk/provider-tools.ts
const XAI_UNSUPPORTED_SCHEMA_KEYWORDS = new Set([
	"minLength",
	"maxLength",
	"minItems",
	"maxItems",
	"minContains",
	"maxContains"
]);
function stripUnsupportedSchemaKeywords(schema, unsupportedKeywords) {
	if (!schema || typeof schema !== "object") return schema;
	if (Array.isArray(schema)) return schema.map((entry) => stripUnsupportedSchemaKeywords(entry, unsupportedKeywords));
	const obj = schema;
	const cleaned = {};
	for (const [key, value] of Object.entries(obj)) {
		if (unsupportedKeywords.has(key)) continue;
		if (key === "properties" && value && typeof value === "object" && !Array.isArray(value)) {
			cleaned[key] = Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [childKey, stripUnsupportedSchemaKeywords(childValue, unsupportedKeywords)]));
			continue;
		}
		if (key === "items" && value && typeof value === "object") {
			cleaned[key] = Array.isArray(value) ? value.map((entry) => stripUnsupportedSchemaKeywords(entry, unsupportedKeywords)) : stripUnsupportedSchemaKeywords(value, unsupportedKeywords);
			continue;
		}
		if ((key === "anyOf" || key === "oneOf" || key === "allOf") && Array.isArray(value)) {
			cleaned[key] = value.map((entry) => stripUnsupportedSchemaKeywords(entry, unsupportedKeywords));
			continue;
		}
		cleaned[key] = value;
	}
	return cleaned;
}
function stripXaiUnsupportedKeywords(schema) {
	return stripUnsupportedSchemaKeywords(schema, XAI_UNSUPPORTED_SCHEMA_KEYWORDS);
}
//#endregion
export { stripUnsupportedSchemaKeywords as n, stripXaiUnsupportedKeywords as r, XAI_UNSUPPORTED_SCHEMA_KEYWORDS as t };
