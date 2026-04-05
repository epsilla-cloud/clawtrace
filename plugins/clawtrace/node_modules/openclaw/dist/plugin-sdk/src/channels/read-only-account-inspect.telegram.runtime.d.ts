export type { InspectedTelegramAccount } from "../plugin-sdk/telegram-runtime.js";
type InspectTelegramAccount = typeof import("../plugin-sdk/telegram-runtime.js").inspectTelegramAccount;
export declare function inspectTelegramAccount(...args: Parameters<InspectTelegramAccount>): ReturnType<InspectTelegramAccount>;
