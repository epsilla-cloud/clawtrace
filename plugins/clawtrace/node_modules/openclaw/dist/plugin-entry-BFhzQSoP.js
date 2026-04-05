import { n as emptyPluginConfigSchema } from "./config-schema-ChDT-7tK.js";
//#region src/plugin-sdk/plugin-entry.ts
/** Resolve either a concrete config schema or a lazy schema factory. */
function resolvePluginConfigSchema(configSchema = emptyPluginConfigSchema) {
	return typeof configSchema === "function" ? configSchema() : configSchema;
}
/**
* Canonical entry helper for non-channel plugins.
*
* Use this for provider, tool, command, service, memory, and context-engine
* plugins. Channel plugins should use `defineChannelPluginEntry(...)` from
* `openclaw/plugin-sdk/core` so they inherit the channel capability wiring.
*/
function definePluginEntry({ id, name, description, kind, configSchema = emptyPluginConfigSchema, register }) {
	return {
		id,
		name,
		description,
		...kind ? { kind } : {},
		configSchema: resolvePluginConfigSchema(configSchema),
		register
	};
}
//#endregion
export { definePluginEntry as t };
