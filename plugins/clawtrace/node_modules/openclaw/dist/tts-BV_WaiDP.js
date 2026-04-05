import { statSync } from "node:fs";
import { EdgeTTS } from "node-edge-tts";
//#region extensions/microsoft/tts.ts
function inferEdgeExtension(outputFormat) {
	const normalized = outputFormat.toLowerCase();
	if (normalized.includes("webm")) return ".webm";
	if (normalized.includes("ogg")) return ".ogg";
	if (normalized.includes("opus")) return ".opus";
	if (normalized.includes("wav") || normalized.includes("riff") || normalized.includes("pcm")) return ".wav";
	return ".mp3";
}
async function edgeTTS(params) {
	const { text, outputPath, config, timeoutMs } = params;
	await new EdgeTTS({
		voice: config.voice,
		lang: config.lang,
		outputFormat: config.outputFormat,
		saveSubtitles: config.saveSubtitles,
		proxy: config.proxy,
		rate: config.rate,
		pitch: config.pitch,
		volume: config.volume,
		timeout: config.timeoutMs ?? timeoutMs
	}).ttsPromise(text, outputPath);
	const { size } = statSync(outputPath);
	if (size === 0) throw new Error("Edge TTS produced empty audio file");
}
//#endregion
export { inferEdgeExtension as n, edgeTTS as t };
