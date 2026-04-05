import { TypedEventEmitter } from "../models/typed-event-emitter.ts";
import { type IKeyTransport, KeyTransportEvents, type KeyTransportEventsHandlerMap } from "./IKeyTransport.ts";
import { type Logger } from "../logger.ts";
import { type ParticipantDeviceInfo, type Statistics } from "./types.ts";
import { type MatrixClient } from "../client.ts";
import { type CallMembershipIdentityParts } from "./EncryptionManager.ts";
export declare class NotSupportedError extends Error {
    constructor(message?: string);
    get name(): string;
}
/**
 * ToDeviceKeyTransport is used to send MatrixRTC keys to other devices using the
 * to-device CS-API.
 */
export declare class ToDeviceKeyTransport extends TypedEventEmitter<KeyTransportEvents, KeyTransportEventsHandlerMap> implements IKeyTransport {
    private membership;
    private roomId;
    private client;
    private statistics;
    private logger;
    setParentLogger(parentLogger: Logger): void;
    constructor(membership: CallMembershipIdentityParts, roomId: string, client: Pick<MatrixClient, "encryptAndSendToDevice" | "on" | "off">, statistics: Statistics, parentLogger?: Logger);
    start(): void;
    stop(): void;
    sendKey(keyBase64Encoded: string, index: number, members: ParticipantDeviceInfo[]): Promise<void>;
    private receiveCallKeyEvent;
    private onToDeviceEvent;
    private getValidEventContent;
}
//# sourceMappingURL=ToDeviceKeyTransport.d.ts.map