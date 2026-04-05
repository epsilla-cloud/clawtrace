import { type ChannelSetupAdapter } from "openclaw/plugin-sdk/setup";
import type { CoreConfig } from "./types.js";
export declare function buildMatrixConfigUpdate(cfg: CoreConfig, input: {
    homeserver?: string;
    allowPrivateNetwork?: boolean;
    userId?: string;
    accessToken?: string;
    password?: string;
    deviceName?: string;
    initialSyncLimit?: number;
}): CoreConfig;
export declare const matrixSetupAdapter: ChannelSetupAdapter;
