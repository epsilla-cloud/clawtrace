import type { SsrFPolicy } from "../../runtime-api.js";
import { MatrixClient } from "../sdk.js";
export declare function createMatrixClient(params: {
    homeserver: string;
    userId?: string;
    accessToken: string;
    password?: string;
    deviceId?: string;
    encryption?: boolean;
    localTimeoutMs?: number;
    initialSyncLimit?: number;
    accountId?: string | null;
    autoBootstrapCrypto?: boolean;
    allowPrivateNetwork?: boolean;
    ssrfPolicy?: SsrFPolicy;
}): Promise<MatrixClient>;
