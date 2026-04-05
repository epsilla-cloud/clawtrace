import { i as defineChannelPluginEntry } from "../../core-CFWy4f9Z.js";
import { b as setMSTeamsRuntime } from "../../graph-users-DrDnmDGP.js";
import { t as msteamsPlugin } from "../../channel-04y1k7xQ.js";
//#region extensions/msteams/index.ts
var msteams_default = defineChannelPluginEntry({
	id: "msteams",
	name: "Microsoft Teams",
	description: "Microsoft Teams channel plugin (Bot Framework)",
	plugin: msteamsPlugin,
	setRuntime: setMSTeamsRuntime
});
//#endregion
export { msteams_default as default, msteamsPlugin, setMSTeamsRuntime };
