import * as RustSdkCryptoJs from "@matrix-org/matrix-sdk-crypto-wasm";
import { Device } from "../models/device.ts";
import { type DeviceKeys } from "../client.ts";
/**
 * Convert a {@link RustSdkCryptoJs.Device} to a {@link Device}
 * @param device - Rust Sdk device
 * @param userId - owner of the device
 *
 * @internal
 */
export declare function rustDeviceToJsDevice(device: RustSdkCryptoJs.Device, userId: RustSdkCryptoJs.UserId): Device;
/**
 * Convert {@link DeviceKeys}  from `/keys/query` request to a `Map<string, Device>`
 * @param deviceKeys - Device keys object to convert
 *
 * @internal
 */
export declare function deviceKeysToDeviceMap(deviceKeys: DeviceKeys): Map<string, Device>;
type QueryDevice = DeviceKeys[keyof DeviceKeys];
/**
 * Convert `/keys/query` {@link QueryDevice} device to {@link Device}
 * @param device - Device from `/keys/query` request
 *
 * @internal
 */
export declare function downloadDeviceToJsDevice(device: QueryDevice): Device;
export {};
//# sourceMappingURL=device-converter.d.ts.map