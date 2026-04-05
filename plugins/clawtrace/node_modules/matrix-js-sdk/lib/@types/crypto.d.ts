import type { ISignatures } from "./signed.ts";
import type { EventDecryptionResult } from "../common-crypto/CryptoBackend.ts";
/** @deprecated This is an internal type and should not be used. */
type IEventDecryptionResult = EventDecryptionResult;
export type { IEventDecryptionResult };
interface Extensible {
    [key: string]: any;
}
/** The result of a call to {@link crypto-api!CryptoApi.exportRoomKeys} */
export interface IMegolmSessionData extends Extensible {
    /** Sender's Curve25519 device key */
    sender_key: string;
    /** Devices which forwarded this session to us (normally empty). */
    forwarding_curve25519_key_chain: string[];
    /** Other keys the sender claims. */
    sender_claimed_keys: Record<string, string>;
    /** Room this session is used in */
    room_id: string;
    /** Unique id for the session */
    session_id: string;
    /** Base64'ed key data */
    session_key: string;
    algorithm?: string;
    untrusted?: boolean;
}
/** the type of the `device_keys` parameter on `/_matrix/client/v3/keys/upload`
 *
 * @see https://spec.matrix.org/v1.5/client-server-api/#post_matrixclientv3keysupload
 */
export interface IDeviceKeys {
    algorithms: Array<string>;
    device_id: string;
    user_id: string;
    keys: Record<string, string>;
    signatures?: ISignatures;
}
/** the type of the `one_time_keys` and `fallback_keys` parameters on `/_matrix/client/v3/keys/upload`
 *
 * @see https://spec.matrix.org/v1.5/client-server-api/#post_matrixclientv3keysupload
 */
export interface IOneTimeKey {
    key: string;
    fallback?: boolean;
    signatures?: ISignatures;
}
//# sourceMappingURL=crypto.d.ts.map