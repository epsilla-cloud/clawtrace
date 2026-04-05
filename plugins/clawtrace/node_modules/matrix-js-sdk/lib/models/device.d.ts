/** State of the verification of the device. */
export declare enum DeviceVerification {
    Blocked = -1,
    Unverified = 0,
    Verified = 1
}
/** A map from user ID to device ID to Device */
export type DeviceMap = Map<string, Map<string, Device>>;
type DeviceParameters = Pick<Device, "deviceId" | "userId" | "algorithms" | "keys"> & Partial<Device>;
/**
 *  Information on a user's device, as returned by {@link crypto-api!CryptoApi.getUserDeviceInfo}.
 */
export declare class Device {
    /** id of the device */
    readonly deviceId: string;
    /** id of the user that owns the device */
    readonly userId: string;
    /** list of algorithms supported by this device */
    readonly algorithms: string[];
    /** a map from `<key type>:<id> -> <base64-encoded key>` */
    readonly keys: Map<string, string>;
    /** whether the device has been verified/blocked by the user */
    readonly verified: DeviceVerification;
    /** a map `<userId, map<algorithm:device_id, signature>>` */
    readonly signatures: Map<string, Map<string, string>>;
    /** display name of the device */
    readonly displayName?: string;
    /** whether the device is a dehydrated device */
    readonly dehydrated: boolean;
    constructor(opts: DeviceParameters);
    /**
     * Get the fingerprint for this device (ie, the Ed25519 key)
     *
     * @returns base64-encoded fingerprint of this device
     */
    getFingerprint(): string | undefined;
    /**
     * Get the identity key for this device (ie, the Curve25519 key)
     *
     * @returns base64-encoded identity key of this device
     */
    getIdentityKey(): string | undefined;
}
export {};
//# sourceMappingURL=device.d.ts.map