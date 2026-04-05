import { n as runCommandWithTimeout } from "./exec-CLVZ7JOg.js";
import { t as detectBinary } from "./setup-binary-KLZwkyo2.js";
import { a as isWSL } from "./runtime-env-5bDkE44b.js";
//#region src/infra/browser-open.ts
function shouldSkipBrowserOpenInTests() {
	if (process.env.VITEST) return true;
	return false;
}
async function resolveBrowserOpenCommand() {
	const platform = process.platform;
	const hasDisplay = Boolean(process.env.DISPLAY || process.env.WAYLAND_DISPLAY);
	if ((Boolean(process.env.SSH_CLIENT) || Boolean(process.env.SSH_TTY) || Boolean(process.env.SSH_CONNECTION)) && !hasDisplay && platform !== "win32") return {
		argv: null,
		reason: "ssh-no-display"
	};
	if (platform === "win32") return {
		argv: [
			"cmd",
			"/c",
			"start",
			""
		],
		command: "cmd",
		quoteUrl: true
	};
	if (platform === "darwin") return await detectBinary("open") ? {
		argv: ["open"],
		command: "open"
	} : {
		argv: null,
		reason: "missing-open"
	};
	if (platform === "linux") {
		const wsl = await isWSL();
		if (!hasDisplay && !wsl) return {
			argv: null,
			reason: "no-display"
		};
		if (wsl) {
			if (await detectBinary("wslview")) return {
				argv: ["wslview"],
				command: "wslview"
			};
			if (!hasDisplay) return {
				argv: null,
				reason: "wsl-no-wslview"
			};
		}
		return await detectBinary("xdg-open") ? {
			argv: ["xdg-open"],
			command: "xdg-open"
		} : {
			argv: null,
			reason: "missing-xdg-open"
		};
	}
	return {
		argv: null,
		reason: "unsupported-platform"
	};
}
async function detectBrowserOpenSupport() {
	const resolved = await resolveBrowserOpenCommand();
	if (!resolved.argv) return {
		ok: false,
		reason: resolved.reason
	};
	return {
		ok: true,
		command: resolved.command
	};
}
async function openUrl(url) {
	if (shouldSkipBrowserOpenInTests()) return false;
	const resolved = await resolveBrowserOpenCommand();
	if (!resolved.argv) return false;
	const quoteUrl = resolved.quoteUrl === true;
	const command = [...resolved.argv];
	if (quoteUrl) {
		if (command.at(-1) === "") command[command.length - 1] = "\"\"";
		command.push(`"${url}"`);
	} else command.push(url);
	try {
		await runCommandWithTimeout(command, {
			timeoutMs: 5e3,
			windowsVerbatimArguments: quoteUrl
		});
		return true;
	} catch {
		return false;
	}
}
//#endregion
export { openUrl as n, resolveBrowserOpenCommand as r, detectBrowserOpenSupport as t };
