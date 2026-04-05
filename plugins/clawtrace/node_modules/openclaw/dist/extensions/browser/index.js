import { $_ as createBrowserTool, Q_ as registerBrowserCli, X_ as handleBrowserGatewayRequest, Z_ as createBrowserPluginService } from "../../auth-profiles-B5ypC5S-.js";
import { t as definePluginEntry } from "../../plugin-entry-BFhzQSoP.js";
//#region extensions/browser/index.ts
var browser_default = definePluginEntry({
	id: "browser",
	name: "Browser",
	description: "Default browser tool plugin",
	register(api) {
		api.registerTool(((ctx) => createBrowserTool({
			sandboxBridgeUrl: ctx.browser?.sandboxBridgeUrl,
			allowHostControl: ctx.browser?.allowHostControl,
			agentSessionKey: ctx.sessionKey
		})));
		api.registerCli(({ program }) => registerBrowserCli(program), { commands: ["browser"] });
		api.registerGatewayMethod("browser.request", handleBrowserGatewayRequest, { scope: "operator.write" });
		api.registerService(createBrowserPluginService());
	}
});
//#endregion
export { browser_default as default };
