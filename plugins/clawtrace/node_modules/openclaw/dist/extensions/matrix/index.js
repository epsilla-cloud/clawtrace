import { i as defineChannelPluginEntry } from "../../core-CFWy4f9Z.js";
import { r as setMatrixRuntime } from "../../runtime-api-BefOImIc.js";
import { t as matrixPlugin } from "../../channel-Pjf9qx2c.js";
//#region extensions/matrix/index.ts
var matrix_default = defineChannelPluginEntry({
	id: "matrix",
	name: "Matrix",
	description: "Matrix channel plugin (matrix-js-sdk)",
	plugin: matrixPlugin,
	setRuntime: setMatrixRuntime,
	registerFull(api) {
		import("../../plugin-entry.runtime-CcGosrmg.js").then(({ ensureMatrixCryptoRuntime }) => ensureMatrixCryptoRuntime({ log: api.logger.info }).catch((err) => {
			const message = err instanceof Error ? err.message : String(err);
			api.logger.warn?.(`matrix: crypto runtime bootstrap failed: ${message}`);
		})).catch((err) => {
			const message = err instanceof Error ? err.message : String(err);
			api.logger.warn?.(`matrix: failed loading crypto bootstrap runtime: ${message}`);
		});
		api.registerGatewayMethod("matrix.verify.recoveryKey", async (ctx) => {
			const { handleVerifyRecoveryKey } = await import("../../plugin-entry.runtime-CcGosrmg.js");
			await handleVerifyRecoveryKey(ctx);
		});
		api.registerGatewayMethod("matrix.verify.bootstrap", async (ctx) => {
			const { handleVerificationBootstrap } = await import("../../plugin-entry.runtime-CcGosrmg.js");
			await handleVerificationBootstrap(ctx);
		});
		api.registerGatewayMethod("matrix.verify.status", async (ctx) => {
			const { handleVerificationStatus } = await import("../../plugin-entry.runtime-CcGosrmg.js");
			await handleVerificationStatus(ctx);
		});
		api.registerCli(async ({ program }) => {
			const { registerMatrixCli } = await import("../../cli-W6LSDVwt.js");
			registerMatrixCli({ program });
		}, { commands: ["matrix"] });
	}
});
//#endregion
export { matrix_default as default, matrixPlugin, setMatrixRuntime };
