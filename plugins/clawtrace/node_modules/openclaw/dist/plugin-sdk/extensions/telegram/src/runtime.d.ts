import type { PluginRuntime } from "openclaw/plugin-sdk/core";
declare const setTelegramRuntime: (next: PluginRuntime) => void, clearTelegramRuntime: () => void, getTelegramRuntime: () => PluginRuntime;
export { clearTelegramRuntime, getTelegramRuntime, setTelegramRuntime };
