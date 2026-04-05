import fsSync from "node:fs";
import path from "node:path";
//#region src/infra/json-file.ts
function loadJsonFile(pathname) {
	try {
		if (!fsSync.existsSync(pathname)) return;
		const raw = fsSync.readFileSync(pathname, "utf8");
		return JSON.parse(raw);
	} catch {
		return;
	}
}
function saveJsonFile(pathname, data) {
	const dir = path.dirname(pathname);
	if (!fsSync.existsSync(dir)) fsSync.mkdirSync(dir, {
		recursive: true,
		mode: 448
	});
	fsSync.writeFileSync(pathname, `${JSON.stringify(data, null, 2)}\n`, "utf8");
	fsSync.chmodSync(pathname, 384);
}
//#endregion
export { saveJsonFile as n, loadJsonFile as t };
