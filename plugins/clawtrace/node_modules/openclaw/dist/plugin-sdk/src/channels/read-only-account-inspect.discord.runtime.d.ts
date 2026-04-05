export type { InspectedDiscordAccount } from "../plugin-sdk/discord.js";
type InspectDiscordAccount = typeof import("../plugin-sdk/discord.js").inspectDiscordAccount;
export declare function inspectDiscordAccount(...args: Parameters<InspectDiscordAccount>): ReturnType<InspectDiscordAccount>;
