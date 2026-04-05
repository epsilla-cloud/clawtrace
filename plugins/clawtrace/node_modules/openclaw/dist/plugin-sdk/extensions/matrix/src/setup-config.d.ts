import { type ChannelSetupInput } from "openclaw/plugin-sdk/setup";
import type { CoreConfig } from "./types.js";
export declare function validateMatrixSetupInput(params: {
    accountId: string;
    input: ChannelSetupInput;
}): string | null;
export declare function applyMatrixSetupAccountConfig(params: {
    cfg: CoreConfig;
    accountId: string;
    input: ChannelSetupInput;
    avatarUrl?: string;
}): CoreConfig;
