import { type DeviceBootstrapProfile, type DeviceBootstrapProfileInput } from "../shared/device-bootstrap-profile.js";
export declare const DEVICE_BOOTSTRAP_TOKEN_TTL_MS: number;
export type DeviceBootstrapTokenRecord = {
    token: string;
    ts: number;
    deviceId?: string;
    publicKey?: string;
    profile?: DeviceBootstrapProfile;
    roles?: string[];
    scopes?: string[];
    issuedAtMs: number;
    lastUsedAtMs?: number;
};
export declare function issueDeviceBootstrapToken(params?: {
    baseDir?: string;
    profile?: DeviceBootstrapProfileInput;
    roles?: readonly string[];
    scopes?: readonly string[];
}): Promise<{
    token: string;
    expiresAtMs: number;
}>;
export declare function clearDeviceBootstrapTokens(params?: {
    baseDir?: string;
}): Promise<{
    removed: number;
}>;
export declare function revokeDeviceBootstrapToken(params: {
    token: string;
    baseDir?: string;
}): Promise<{
    removed: boolean;
}>;
export declare function verifyDeviceBootstrapToken(params: {
    token: string;
    deviceId: string;
    publicKey: string;
    role: string;
    scopes: readonly string[];
    baseDir?: string;
}): Promise<{
    ok: true;
} | {
    ok: false;
    reason: string;
}>;
