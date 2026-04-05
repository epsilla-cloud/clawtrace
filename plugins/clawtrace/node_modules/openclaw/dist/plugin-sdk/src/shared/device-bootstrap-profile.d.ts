export type DeviceBootstrapProfile = {
    roles: string[];
    scopes: string[];
};
export type DeviceBootstrapProfileInput = {
    roles?: readonly string[];
    scopes?: readonly string[];
};
export declare const PAIRING_SETUP_BOOTSTRAP_PROFILE: DeviceBootstrapProfile;
export declare function normalizeDeviceBootstrapProfile(input: DeviceBootstrapProfileInput | undefined): DeviceBootstrapProfile;
export declare function sameDeviceBootstrapProfile(left: DeviceBootstrapProfile, right: DeviceBootstrapProfile): boolean;
