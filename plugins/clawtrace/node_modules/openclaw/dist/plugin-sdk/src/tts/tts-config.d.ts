import type { OpenClawConfig } from "../config/config.js";
import type { TtsMode } from "../config/types.tts.js";
export { normalizeTtsAutoMode } from "./tts-auto-mode.js";
export declare function resolveConfiguredTtsMode(cfg: OpenClawConfig): TtsMode;
