import { HistoryVisibility as RustHistoryVisibility, type OlmMachine } from "@matrix-org/matrix-sdk-crypto-wasm";
import { type MatrixEvent, type IContent } from "../models/event.ts";
import { type Room } from "../models/room.ts";
import { type Logger } from "../logger.ts";
import { type KeyClaimManager } from "./KeyClaimManager.ts";
import { type RoomMember } from "../models/room-member.ts";
import { HistoryVisibility } from "../@types/partials.ts";
import { type OutgoingRequestsManager } from "./OutgoingRequestsManager.ts";
import { type DeviceIsolationMode } from "../crypto-api/index.ts";
/**
 * RoomEncryptor: responsible for encrypting messages to a given room
 *
 * @internal
 */
export declare class RoomEncryptor {
    private readonly prefixedLogger;
    private readonly olmMachine;
    private readonly keyClaimManager;
    private readonly outgoingRequestManager;
    private readonly room;
    private encryptionSettings;
    /** whether the room members have been loaded and tracked for the first time */
    private lazyLoadedMembersResolved;
    /**
     * Ensures that there is only one encryption operation at a time for that room.
     *
     * An encryption operation is either a {@link prepareForEncryption} or an {@link encryptEvent} call.
     */
    private currentEncryptionPromise;
    /**
     * @param prefixedLogger - A logger to use for log messages.
     * @param olmMachine - The rust-sdk's OlmMachine
     * @param keyClaimManager - Our KeyClaimManager, which manages the queue of one-time-key claim requests
     * @param outgoingRequestManager - The OutgoingRequestManager, which manages the queue of outgoing requests.
     * @param room - The room we want to encrypt for
     * @param encryptionSettings - body of the m.room.encryption event currently in force in this room
     */
    constructor(prefixedLogger: Logger, olmMachine: OlmMachine, keyClaimManager: KeyClaimManager, outgoingRequestManager: OutgoingRequestsManager, room: Room, encryptionSettings: IContent);
    /**
     * Handle a new `m.room.encryption` event in this room
     *
     * @param config - The content of the encryption event
     */
    onCryptoEvent(config: IContent): void;
    /**
     * Handle a new `m.room.member` event in this room
     *
     * @param member - new membership state
     */
    onRoomMembership(member: RoomMember): void;
    /**
     * Prepare to encrypt events in this room.
     *
     * This ensures that we have a megolm session ready to use and that we have shared its key with all the devices
     * in the room.
     * @param globalBlacklistUnverifiedDevices - When `true`, and `deviceIsolationMode` is `AllDevicesIsolationMode`,
     * will not send encrypted messages to unverified devices.
     * Ignored when `deviceIsolationMode` is `OnlySignedDevicesIsolationMode`.
     * @param deviceIsolationMode - The device isolation mode. See {@link DeviceIsolationMode}.
     */
    prepareForEncryption(globalBlacklistUnverifiedDevices: boolean, deviceIsolationMode: DeviceIsolationMode): Promise<void>;
    /**
     * Encrypt an event for this room, or prepare for encryption.
     *
     * This will ensure that we have a megolm session for this room, share it with the devices in the room, and
     * then, if an event is provided, encrypt it using the session.
     *
     * @param event - Event to be encrypted, or null if only preparing for encryption (in which case we will pre-share the room key).
     * @param globalBlacklistUnverifiedDevices - When `true`, and `deviceIsolationMode` is `AllDevicesIsolationMode`,
     * will not send encrypted messages to unverified devices.
     * Ignored when `deviceIsolationMode` is `OnlySignedDevicesIsolationMode`.
     * @param deviceIsolationMode - The device isolation mode. See {@link DeviceIsolationMode}.
     */
    encryptEvent(event: MatrixEvent | null, globalBlacklistUnverifiedDevices: boolean, deviceIsolationMode: DeviceIsolationMode): Promise<void>;
    /**
     * Prepare to encrypt events in this room.
     *
     * This ensures that we have a megolm session ready to use and that we have shared its key with all the devices
     * in the room.
     *
     * @param logger - a place to write diagnostics to
     * @param globalBlacklistUnverifiedDevices - When `true`, and `deviceIsolationMode` is `AllDevicesIsolationMode`,
     * will not send encrypted messages to unverified devices.
     * Ignored when `deviceIsolationMode` is `OnlySignedDevicesIsolationMode`.
     * @param deviceIsolationMode - The device isolation mode. See {@link DeviceIsolationMode}.
     */
    private ensureEncryptionSession;
    /**
     * Discard any existing group session for this room
     */
    forceDiscardSession(): Promise<void>;
    private encryptEventInner;
}
/**
 * Convert a HistoryVisibility to a RustHistoryVisibility
 * @param visibility - HistoryVisibility enum
 * @returns a RustHistoryVisibility enum
 */
export declare function toRustHistoryVisibility(visibility: HistoryVisibility): RustHistoryVisibility;
//# sourceMappingURL=RoomEncryptor.d.ts.map