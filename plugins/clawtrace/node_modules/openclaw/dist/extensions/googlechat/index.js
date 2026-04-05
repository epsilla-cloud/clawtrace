import { i as defineChannelPluginEntry } from "../../core-CFWy4f9Z.js";
import { n as setGoogleChatRuntime } from "../../runtime-DYswZrWG.js";
import { t as googlechatPlugin } from "../../channel-BMLG7_Gl.js";
//#region extensions/googlechat/index.ts
var googlechat_default = defineChannelPluginEntry({
	id: "googlechat",
	name: "Google Chat",
	description: "OpenClaw Google Chat channel plugin",
	plugin: googlechatPlugin,
	setRuntime: setGoogleChatRuntime
});
//#endregion
export { googlechat_default as default, googlechatPlugin, setGoogleChatRuntime };
