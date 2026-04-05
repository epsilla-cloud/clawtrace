export type { InspectedSlackAccount } from "../plugin-sdk/slack.js";
type InspectSlackAccount = typeof import("../plugin-sdk/slack.js").inspectSlackAccount;
export declare function inspectSlackAccount(...args: Parameters<InspectSlackAccount>): ReturnType<InspectSlackAccount>;
