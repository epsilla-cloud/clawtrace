import { type CallMembershipIdentityParts } from "./EncryptionManager.ts";
import { type ParticipantDeviceInfo } from "./types.ts";
export declare enum KeyTransportEvents {
    ReceivedKeys = "received_keys",
    NotSupportedError = "not_supported_error"
}
export type KeyTransportEventsHandlerMap = {
    [KeyTransportEvents.ReceivedKeys]: KeyTransportEventListener;
    [KeyTransportEvents.NotSupportedError]: () => void;
};
export type KeyTransportEventListener = (membership: CallMembershipIdentityParts, keyBase64Encoded: string, index: number, timestamp: number) => void;
/**
 * Generic interface for the transport used to share room keys.
 * Keys can be shared using different transports, e.g. to-device messages or room messages.
 */
export interface IKeyTransport {
    /**
     * Sends the current user media key to the given members.
     * @param keyBase64Encoded
     * @param index
     * @param members - The participants that should get they key
     */
    sendKey(keyBase64Encoded: string, index: number, members: ParticipantDeviceInfo[]): Promise<void>;
    /** Subscribe to keys from this transport. */
    on(event: KeyTransportEvents.ReceivedKeys, listener: KeyTransportEventListener): this;
    /** Unsubscribe from keys from this transport. */
    off(event: KeyTransportEvents.ReceivedKeys, listener: KeyTransportEventListener): this;
    /** Once start is called the underlying transport will subscribe to its transport system.
     * Before start is called this transport will not emit any events.
     */
    start(): void;
    /** Once stop is called the underlying transport will unsubscribe from its transport system.
     * After stop is called this transport will not emit any events.
     */
    stop(): void;
}
//# sourceMappingURL=IKeyTransport.d.ts.map