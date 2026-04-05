/* tslint:disable */
/* eslint-disable */

/** The types returned by {@link OlmMachine.outgoingRequests}. */
type OutgoingRequest =
| KeysUploadRequest
| KeysQueryRequest
| KeysClaimRequest
| ToDeviceRequest
| SignatureUploadRequest
| RoomMessageRequest
| KeysBackupRequest;



/** The types returned by {@link OlmMachine.receiveSyncChanges}. */
type ProcessedToDeviceEvent =
| DecryptedToDeviceEvent
| PlainTextToDeviceEvent
| InvalidToDeviceEvent
| UTDToDeviceEvent;



interface JsLogger {
    debug(data: any): void;
    info(data: any): void;
    warn(data: any): void;
    error(data: any): void;
}


type OutgoingVerificationRequest =
| ToDeviceRequest
| RoomMessageRequest;



/**
 * A type to encrypt and to decrypt anything that can fit in an
 * `Uint8Array`, usually big buffer.
 */
export class Attachment {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Decrypt an `EncryptedAttachment`.
     *
     * The encrypted attachment can be created manually, or from the
     * `encrypt` method.
     *
     * **Warning**: The encrypted attachment can be used only
     * **once**! The encrypted data will still be present, but the
     * media encryption info (which contain secrets) will be
     * destroyed. It is still possible to get a JSON-encoded backup
     * by calling `EncryptedAttachment.mediaEncryptionInfo`.
     */
    static decrypt(attachment: EncryptedAttachment): Uint8Array;
    /**
     * Encrypt the content of the `Uint8Array`.
     *
     * It produces an `EncryptedAttachment`, which can be used to
     * retrieve the media encryption information, or the encrypted
     * data.
     */
    static encrypt(array: Uint8Array): EncryptedAttachment;
}

/**
 * The private part of the backup key, the one used for recovery.
 */
export class BackupDecryptionKey {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new random [`BackupDecryptionKey`].
     */
    static createRandomKey(): BackupDecryptionKey;
    /**
     * Try to decrypt a message that was encrypted using the public part of the
     * backup key.
     */
    decryptV1(ephemeral_key: string, mac: string, ciphertext: string): string;
    /**
     * Try to create a [`BackupDecryptionKey`] from a base 64 encoded string.
     */
    static fromBase64(key: string): BackupDecryptionKey;
    /**
     * Convert the backup decryption key to a base 64 encoded string.
     */
    toBase64(): string;
    /**
     * Get the public part of the backup key.
     */
    readonly megolmV1PublicKey: MegolmV1BackupKey;
}

/**
 * Stored versions of the backup keys.
 */
export class BackupKeys {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The key used to decrypt backed up room keys, encoded as base64
     *
     * @deprecated Use `BackupKeys.decryptionKey.toBase64()`
     */
    readonly decryptionKeyBase64: string | undefined;
    /**
     * The version that we are using for backups.
     */
    get backupVersion(): string | undefined;
    /**
     * The version that we are using for backups.
     */
    set backupVersion(value: string | null | undefined);
    /**
     * The key used to decrypt backed up room keys
     */
    get decryptionKey(): BackupDecryptionKey | undefined;
    /**
     * The key used to decrypt backed up room keys
     */
    set decryptionKey(value: BackupDecryptionKey | null | undefined);
}

/**
 * The backup-specific parts of a secrets bundle.
 */
export class BackupSecretsBundle {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The backup version which this backup decryption key is used with.
     */
    backup_version: string;
    /**
     * The backup decryption key, encoded as unpadded base64.
     */
    key: string;
}

/**
 * The base64-encoded variant of a {@link PkMessage}.
 *
 * This can be useful if the encrypted message should be put into JSON.
 */
export class Base64EncodedPkMessage {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Creates a new base64-encoded encrypted message from its parts.
     */
    constructor(ciphertext: string, mac: string, ephemeral_key: string);
    /**
     * The base64-encoded ciphertext.
     */
    ciphertext: string;
    /**
     * The base64-encoded ephemeral public key.
     */
    ephemeralKey: string;
    /**
     * The base64-encoded message authentication code (MAC).
     */
    mac: string;
}

/**
 * The base dataset that is important to migrate to the Rust SDK.
 *
 * Can be imported into the rust store with {@link Migration::migrateBaseData}.
 */
export class BaseMigrationData {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new `BaseMigrationData` with default values.
     */
    constructor();
    /**
     * The backup recovery key, as a base64-encoded string.
     */
    get backupRecoveryKey(): string | undefined;
    /**
     * The backup recovery key, as a base64-encoded string.
     */
    set backupRecoveryKey(value: string | null | undefined);
    /**
     * The backup version that is currently active.
     */
    get backupVersion(): string | undefined;
    /**
     * The backup version that is currently active.
     */
    set backupVersion(value: string | null | undefined);
    /**
     * The device ID of the account owner.
     */
    get deviceId(): DeviceId | undefined;
    /**
     * The device ID of the account owner.
     */
    set deviceId(value: DeviceId | null | undefined);
    /**
     * The pickle string holding the Olm Account, as returned by
     * `olm_pickle_account` in libolm.
     */
    pickledAccount: string;
    /**
     * The private, base64-encoded, master cross-signing key.
     */
    get privateCrossSigningMasterKey(): string | undefined;
    /**
     * The private, base64-encoded, master cross-signing key.
     */
    set privateCrossSigningMasterKey(value: string | null | undefined);
    /**
     * The private, base64-encoded, self-signing key.
     */
    get privateCrossSigningSelfSigningKey(): string | undefined;
    /**
     * The private, base64-encoded, self-signing key.
     */
    set privateCrossSigningSelfSigningKey(value: string | null | undefined);
    /**
     * The private, base64-encoded, user-signing key.
     */
    get privateCrossSigningUserSigningKey(): string | undefined;
    /**
     * The private, base64-encoded, user-signing key.
     */
    set privateCrossSigningUserSigningKey(value: string | null | undefined);
    /**
     * The user id of the account owner.
     */
    get userId(): UserId | undefined;
    /**
     * The user id of the account owner.
     */
    set userId(value: UserId | null | undefined);
}

/**
 * Information about the cancellation of a verification request or
 * verification flow.
 */
export class CancelInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Get the `code` (e.g. `m.user`) that was used to cancel the
     * verification.
     */
    cancelCode(): string;
    /**
     * Was the verification cancelled by us?
     */
    cancelledbyUs(): boolean;
    /**
     * Get the human readable reason of the cancellation.
     */
    reason(): string;
}

/**
 * A check code that can be used to confirm that two [`EstablishedEcies`]
 * objects share the same secret. This is supposed to be shared out-of-band to
 * protect against active Man-in-the-middle (MITM) attacks.
 *
 * Since the initiator device can always tell whether a MITM attack is in
 * progress after channel establishment, this code technically carries only a
 * single bit of information, representing whether the initiator has determined
 * that the channel is "secure" or "not secure".
 *
 * However, given this will need to be interactively confirmed by the user,
 * there is risk that the user would confirm the dialogue without paying
 * attention to its content. By expanding this single bit into a deterministic
 * two-digit check code, the user is forced to pay more attention by having to
 * enter it instead of just clicking through a dialogue.
 */
export class CheckCode {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Convert the check code to an array of two bytes.
     *
     * The bytes can be converted to a more user-friendly representation. The
     * [`CheckCode::to_digit`] converts the bytes to a two-digit number.
     */
    as_bytes(): Uint8Array;
    /**
     * Convert the check code to two base-10 numbers.
     *
     * The number should be displayed with a leading 0 in case the first digit
     * is a 0.
     */
    to_digit(): number;
}

/**
 * Strategy to collect the devices that should receive room keys for the
 * current discussion.
 */
export class CollectStrategy {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Share with all (unblacklisted) devices.
     */
    static allDevices(): CollectStrategy;
    /**
     * Device based sharing strategy.
     *
     * @deprecated: use one of {@link allDevices}, {@link
     * errorOnUnverifiedUserProblem} or {@link onlyTrustedDevices}.
     */
    static deviceBasedStrategy(only_allow_trusted_devices: boolean, error_on_verified_user_problem: boolean): CollectStrategy;
    /**
     * Tests for equality between two [`CollectStrategy`]s.
     */
    eq(other: CollectStrategy): boolean;
    /**
     * Share with all devices, except that errors for *verified* users cause
     * sharing to fail with an error.
     *
     * In this strategy, if a verified user has an unsigned device, or
     * a verified user has replaced their identity, key
     * sharing will fail with an error.
     *
     * Otherwise, keys are shared with unsigned devices as normal.
     *
     * Once the problematic devices are blacklisted or whitelisted the
     * caller can try sharing a second time.
     */
    static errorOnUnverifiedUserProblem(): CollectStrategy;
    /**
     * Share based on identity. Only distribute to devices signed by their
     * owner. If a user has no published identity he will not receive
     * any room keys.
     */
    static identityBasedStrategy(): CollectStrategy;
    /**
     * Only share keys with devices that we "trust". A device is trusted if any
     * of the following is true:
     *     - It was manually marked as trusted.
     *     - It was marked as verified via interactive verification.
     *     - It is signed by its owner identity, and this identity has been
     *       trusted via interactive verification.
     *     - It is the current own device of the user.
     */
    static onlyTrustedDevices(): CollectStrategy;
}

/**
 * A set of requests to be executed when bootstrapping cross-signing using
 * {@link OlmMachine.bootstrapCrossSigning}.
 */
export class CrossSigningBootstrapRequests {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * An optional request to upload a device key.
     *
     * This will either be `undefined`, or an "outgoing request" as returned by
     * {@link OlmMachine.outgoingRequests}.
     *
     * If it is defined, the request should be sent first, and the result sent
     * back with {@link OlmMachine.markRequestAsSent}.
     */
    readonly uploadKeysRequest: any;
    /**
     * Request to upload key signatures, including those for the cross-signing
     * keys, and maybe some for the optional uploaded key too.
     *
     * Should be sent last.
     */
    readonly uploadSignaturesRequest: SignatureUploadRequest;
    /**
     * Request to upload the cross-signing keys.
     *
     * Should be sent second.
     */
    readonly uploadSigningKeysRequest: UploadSigningKeysRequest;
}

/**
 * A struct containing private cross signing keys that can be backed
 * up or uploaded to the secret store.
 */
export class CrossSigningKeyExport {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The seed of the master key encoded as unpadded base64.
     */
    readonly masterKey: string | undefined;
    /**
     * The seed of the self signing key encoded as unpadded base64.
     */
    readonly self_signing_key: string | undefined;
    /**
     * The seed of the user signing key encoded as unpadded base64.
     */
    readonly userSigningKey: string | undefined;
}

/**
 * Struct representing the state of our private cross signing keys,
 * it shows which private cross signing keys we have locally stored.
 */
export class CrossSigningStatus {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Do we have the master key?
     */
    readonly hasMaster: boolean;
    /**
     * Do we have the self signing key? This one is necessary to sign
     * our own devices.
     */
    readonly hasSelfSigning: boolean;
    /**
     * Do we have the user signing key? This one is necessary to sign
     * other users.
     */
    readonly hasUserSigning: boolean;
}

/**
 * A Curve25519 public key.
 */
export class Curve25519PublicKey {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new [`Curve25519PublicKey`] from a base64 encoded string.
     */
    constructor(key: string);
    /**
     * Serialize an Curve25519 public key to an unpadded base64
     * representation.
     */
    toBase64(): string;
    /**
     * The number of bytes a Curve25519 public key has.
     */
    readonly length: number;
}

/**
 * A Curve25519 secret key.
 */
export class Curve25519SecretKey {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Creates a `Curve25519SecretKey` from a base64-encoded representation of
     * the key.
     */
    static fromBase64(string: string): Curve25519SecretKey;
    /**
     * Creates a `Curve25519SecretKey` from a raw byte slice.
     */
    static fromUint8Array(slice: Uint8Array): Curve25519SecretKey;
    /**
     * Generates a new random Curve25519 secret key.
     */
    static new(): Curve25519SecretKey;
    /**
     * Encodes the secret key into a base64 string.
     */
    toBase64(): string;
    /**
     * Converts the secret key into a raw byte vector.
     */
    toUint8Array(): Uint8Array;
}

/**
 * A decrypted room event.
 */
export class DecryptedRoomEvent {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The verification state of the device that sent us the event.
     * Note this is the state of the device at the time of
     * decryption. It may change in the future if a device gets
     * verified or deleted.
     */
    shieldState(strict: boolean): ShieldState;
    /**
     * If the keys for this message were shared-on-invite as part of an
     * [MSC4268] key bundle, the ID of the user who sent us the bundle.
     *
     * [MSC4268]: https://github.com/matrix-org/matrix-spec-proposals/pull/4268
     */
    readonly forwarder: UserId | undefined;
    /**
     * If the keys for this message were shared-on-invite as part of an
     * [MSC4268] key bundle, the ID of the device from which this bundle
     * was sent.
     *
     * [MSC4268]: https://github.com/matrix-org/matrix-spec-proposals/pull/4268
     */
    readonly forwarderDevice: DeviceId | undefined;
    /**
     * Returns an empty array
     *
     * Previously, this returned the chain of Curve25519 keys through which
     * this session was forwarded, via `m.forwarded_room_key` events.
     * However, that is not cryptographically reliable, and clients should not
     * be using it.
     *
     * @see https://github.com/matrix-org/matrix-spec/issues/1089
     */
    readonly forwardingCurve25519KeyChain: string[];
    /**
     * The user ID of the event sender, note this is untrusted data
     * unless the `verification_state` is as well trusted.
     */
    readonly sender: UserId;
    /**
     * The signing Ed25519 key that have created the megolm key that
     * was used to decrypt this session.
     */
    readonly senderClaimedEd25519Key: string | undefined;
    /**
     * The Curve25519 key of the device that created the megolm
     * decryption key originally.
     */
    readonly senderCurve25519Key: string;
    /**
     * The device ID of the device that sent us the event, note this
     * is untrusted data unless `verification_state` is as well
     * trusted.
     */
    readonly senderDevice: DeviceId | undefined;
    /**
     * The JSON-encoded decrypted event.
     */
    readonly event: string;
}

/**
 * Represents an encrypted to-device event, after it has been decrypted.
 */
export class DecryptedToDeviceEvent {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The type of processed to-device event. Always {@link
     * ProcessedToDeviceEventType.Decrypted} for this type.
     */
    readonly type: ProcessedToDeviceEventType;
    /**
     * The encryption information for the event.
     */
    readonly encryptionInfo: ToDeviceEncryptionInfo;
    /**
     * The decrypted event, as if it had been sent in the clear, encoded as
     * JSON.
     *
     * Typically contains properties `type`, `sender` and `content`.
     *
     * (For room keys or secrets, some part of the content might have been
     * zeroized).
     */
    readonly rawEvent: string;
}

/**
 * Decryption error codes
 */
export enum DecryptionErrorCode {
    /**
     * The room key is not known
     */
    MissingRoomKey = 0,
    /**
     * The room key is known but ratcheted
     */
    UnknownMessageIndex = 1,
    /**
     * Decryption failed because of a mismatch between the identity keys of the
     * device we received the room key from and the identity keys recorded in
     * the plaintext of the room key to-device message.
     */
    MismatchedIdentityKeys = 2,
    /**
     * We weren't able to link the message back to any known device.
     */
    UnknownSenderDevice = 3,
    /**
     * The sender device is not cross-signed.
     */
    UnsignedSenderDevice = 4,
    /**
     * The sender's identity is unverified, but was previously verified.
     */
    SenderIdentityVerificationViolation = 5,
    /**
     * Other failure.
     */
    UnableToDecrypt = 6,
    /**
     * The `sender` field on the event does not match the owner of the device
     * that established the Megolm session.
     */
    MismatchedSender = 7,
}

/**
 * Settings for decrypting messages
 */
export class DecryptionSettings {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new `DecryptionSettings` with the given trust requirement.
     */
    constructor(sender_device_trust_requirement: TrustRequirement);
    /**
     * The trust level required to decrypt the event
     */
    sender_device_trust_requirement: TrustRequirement;
}

/**
 * A dehydrated device that can be uploaded to the server
 */
export class DehydratedDevice {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create the request to upload the dehydrated device
     */
    keysForUpload(initial_device_display_name: string, dehydrated_device_key: DehydratedDeviceKey): Promise<PutDehydratedDeviceRequest>;
}

/**
 * Dehydrated device key
 */
export class DehydratedDeviceKey {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Generates a dehydrated device key from a given array.
     */
    static createKeyFromArray(array: Uint8Array): DehydratedDeviceKey;
    /**
     * Generates a new random dehydrated device key.
     */
    static createRandomKey(): DehydratedDeviceKey;
    /**
     * Convert the dehydrated device key to a base64-encoded string.
     */
    toBase64(): string;
}

/**
 * Struct collecting methods to create and rehydrate dehydrated devices.
 */
export class DehydratedDevices {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new {@link DehydratedDevice} which can be uploaded to the
     * server.
     */
    create(): Promise<DehydratedDevice>;
    /**
     * Clear the dehydrated device key saved in the crypto store.
     */
    deleteDehydratedDeviceKey(): Promise<void>;
    /**
     * Get the cached dehydrated device key if any.
     *
     * `None` if the key was not previously cached (via
     * {@link DehydratedDevices.saveDehydratedDeviceKey}).
     */
    getDehydratedDeviceKey(): Promise<DehydratedDeviceKey | undefined>;
    /**
     * Rehydrate a dehydrated device.
     */
    rehydrate(dehydrated_device_key: DehydratedDeviceKey, device_id: DeviceId, device_data: string): Promise<RehydratedDevice>;
    /**
     * Store the dehydrated device key in the crypto store.
     */
    saveDehydratedDeviceKey(dehydrated_device_key: DehydratedDeviceKey): Promise<void>;
}

/**
 * A device represents a E2EE capable client of an user.
 */
export class Device {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Encrypt a to-device message to be sent to this device, using Olm
     * encryption.
     *
     * Prior to calling this method you must ensure that an Olm session is
     * available for the target device. This can be done by calling
     * {@link OlmMachine.getMissingSessions}.
     *
     * The caller is responsible for sending the encrypted
     * event to the target device. If multiple messages are
     * encrypted for the same device using this method they should be sent in
     * the same order as they are encrypted.
     *
     * # Returns
     *
     * Returns a promise for a JSON string containing the `content` of an
     * encrypted event, which be used to create the payload for a
     * `/sendToDevice` API.
     */
    encryptToDeviceEvent(event_type: string, content: any, share_strategy?: CollectStrategy | null): Promise<string>;
    /**
     * Timestamp representing the first time this device has been seen (in
     * milliseconds).
     */
    firstTimeSeen(): bigint;
    /**
     * Get the key of the given key algorithm belonging to this device.
     */
    getKey(algorithm: DeviceKeyAlgorithmName): DeviceKey | undefined;
    /**
     * Is the device locally marked as blacklisted?
     *
     * Blacklisted devices won’t receive any group sessions.
     */
    isBlacklisted(): boolean;
    /**
     * Is this device cross-signed by its owner?
     */
    isCrossSignedByOwner(): boolean;
    /**
     * Is this device considered to be verified using cross signing.
     */
    isCrossSigningTrusted(): boolean;
    /**
     * Is the device deleted?
     */
    isDeleted(): boolean;
    /**
     * Is the device locally marked as trusted?
     */
    isLocallyTrusted(): boolean;
    /**
     * Is this device considered to be verified.
     *
     * This method returns true if either the `is_locally_trusted`
     * method returns `true` or if the `is_cross_signing_trusted`
     * method returns `true`.
     */
    isVerified(): boolean;
    /**
     * Request an interactive verification with this device.
     *
     * Returns a 2-element array `[VerificationRequest, ToDeviceRequest]`.
     */
    requestVerification(methods?: VerificationMethod[]): [VerificationRequest, ToDeviceRequest];
    /**
     * Set the local trust state of the device to the given state.
     *
     * This won’t affect any cross signing trust state, this only
     * sets a flag marking to have the given trust state.
     *
     * `trust_state` represents the new trust state that should be
     * set for the device.
     */
    setLocalTrust(local_state: LocalTrust): Promise<null>;
    /**
     * Mark this device as verified.
     * Works only if the device is owned by the current user.
     *
     * Returns a signature upload request that needs to be sent out.
     */
    verify(): Promise<SignatureUploadRequest>;
    /**
     * Get the list of algorithms this device supports.
     *
     * Returns `Array<EncryptionAlgorithm>`.
     */
    readonly algorithms: EncryptionAlgorithm[];
    /**
     * Get the Curve25519 key of the given device.
     */
    readonly curve25519Key: Curve25519PublicKey | undefined;
    /**
     * The unique ID of the device.
     */
    readonly deviceId: DeviceId;
    /**
     * Get the human readable name of the device.
     */
    readonly displayName: string | undefined;
    /**
     * Get the Ed25519 key of the given device.
     */
    readonly ed25519Key: Ed25519PublicKey | undefined;
    /**
     * Whether or not the device is a dehydrated device.
     */
    readonly isDehydrated: boolean;
    /**
     * Get a map containing all the device keys.
     */
    readonly keys: Map<DeviceKeyId, DeviceKey>;
    /**
     * Get the trust state of the device.
     */
    readonly localTrustState: LocalTrust;
    /**
     * Get a map containing all the device signatures.
     */
    readonly signatures: Signatures;
    /**
     * The user ID of the device owner.
     */
    readonly userId: UserId;
}

/**
 * A Matrix key ID.
 *
 * Device identifiers in Matrix are completely opaque character
 * sequences. This type is provided simply for its semantic value.
 */
export class DeviceId {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new `DeviceId`.
     */
    constructor(id: string);
    /**
     * Return the device ID as a string.
     */
    toString(): string;
}

/**
 * An enum over the different key types a device can have.
 *
 * Currently devices have a curve25519 and ed25519 keypair. The keys
 * transport format is a base64 encoded string, any unknown key type
 * will be left as such a string.
 */
export class DeviceKey {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Convert the `DeviceKey` into a base64 encoded string.
     */
    toBase64(): string;
    /**
     * Get the value associated to the `Curve25519` device key name.
     */
    readonly curve25519: Curve25519PublicKey | undefined;
    /**
     * Get the value associated to the `Ed25519` device key name.
     */
    readonly ed25519: Ed25519PublicKey | undefined;
    /**
     * Get the name of the device key.
     */
    readonly name: DeviceKeyName;
    /**
     * Get the value associated to the `Unknown` device key name.
     */
    readonly unknown: string | undefined;
}

/**
 * The basic key algorithms in the specification.
 */
export class DeviceKeyAlgorithm {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Return the device key algorithm as a string.
     */
    toString(): string;
    /**
     * Read the device key algorithm's name. If the name is
     * `Unknown`, one may be interested by the `to_string` method to
     * read the original name.
     */
    readonly name: DeviceKeyAlgorithmName;
}

/**
 * The basic key algorithm names in the specification.
 */
export enum DeviceKeyAlgorithmName {
    /**
     * The Ed25519 signature algorithm.
     */
    Ed25519 = 0,
    /**
     * The Curve25519 ECDH algorithm.
     */
    Curve25519 = 1,
    /**
     * An unknown device key algorithm.
     */
    Unknown = 3,
}

/**
 * A Matrix device key ID.
 *
 * A key algorithm and a device ID, combined with a ‘:’.
 */
export class DeviceKeyId {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Parse/validate and create a new `DeviceKeyId`.
     */
    constructor(id: string);
    /**
     * Return the device key ID as a string.
     */
    toString(): string;
    /**
     * Returns key algorithm of the device key ID.
     */
    readonly algorithm: DeviceKeyAlgorithm;
    /**
     * Returns device ID of the device key ID.
     */
    readonly deviceId: DeviceId;
}

/**
 * An enum over the different key types a device can have.
 *
 * Currently devices have a curve25519 and ed25519 keypair. The keys
 * transport format is a base64 encoded string, any unknown key type
 * will be left as such a string.
 */
export enum DeviceKeyName {
    /**
     * The curve25519 device key.
     */
    Curve25519 = 0,
    /**
     * The ed25519 device key.
     */
    Ed25519 = 1,
    /**
     * An unknown device key.
     */
    Unknown = 2,
}

/**
 * Information on E2E device updates.
 */
export class DeviceLists {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Returns true if there are no device list updates.
     */
    isEmpty(): boolean;
    /**
     * Create an empty `DeviceLists`.
     *
     * `changed` and `left` must be an array of `UserId`.
     *
     * Items inside `changed` and `left` will be invalidated by this method. Be
     * careful not to use the `UserId`s after this method has been called.
     */
    constructor(changed?: UserId[] | null, left?: UserId[] | null);
    /**
     * List of users who have updated their device identity keys or
     * who now share an encrypted room with the client since the
     * previous sync
     */
    readonly changed: UserId[];
    /**
     * List of users who no longer share encrypted rooms since the
     * previous sync response.
     */
    readonly left: UserId[];
}

/**
 * An unestablished ECIES session.
 */
export class Ecies {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a [`EstablishedEcies`] from an initial message encrypted by the
     * other side.
     */
    establish_inbound_channel(initial_message: string): InboundCreationResult;
    /**
     * Create an [`EstablishedEcies`] session using the other side's Curve25519
     * public key and an initial plaintext.
     *
     * After the channel has been established, we can encrypt messages to send
     * to the other side. The other side uses the initial message to
     * establishes the same channel on its side.
     */
    establish_outbound_channel(public_key: Curve25519PublicKey, initial_message: string): OutboundCreationResult;
    /**
     * Create a new, random, unestablished ECIES session.
     *
     * This method will use the
     * [`MATRIX_QR_CODE_LOGIN`](https://github.com/matrix-org/matrix-spec-proposals/pull/4108)
     * info for domain separation when creating the session.
     */
    constructor();
    /**
     * Get our [`Curve25519PublicKey`].
     *
     * This public key needs to be sent to the other side to be able to
     * establish an ECIES channel.
     */
    public_key(): Curve25519PublicKey;
}

/**
 * An Ed25519 public key, used to verify digital signatures.
 */
export class Ed25519PublicKey {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Serialize an Ed25519 public key to an unpadded base64
     * representation.
     */
    toBase64(): string;
    /**
     * The number of bytes an Ed25519 public key has.
     */
    readonly length: number;
}

/**
 * An Ed25519 digital signature, can be used to verify the
 * authenticity of a message.
 */
export class Ed25519Signature {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Try to create an Ed25519 signature from an unpadded base64
     * representation.
     */
    constructor(signature: string);
    /**
     * Serialize a Ed25519 signature to an unpadded base64
     * representation.
     */
    toBase64(): string;
}

/**
 * An emoji that is used for interactive verification using a short
 * auth string.
 *
 * This will contain a single emoji and description from the list of
 * emojis from [the specification].
 *
 * [the specification]: https://spec.matrix.org/unstable/client-server-api/#sas-method-emoji
 */
export class Emoji {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The description of the emoji, for example ‘Dog’.
     */
    readonly description: string;
    /**
     * The emoji symbol that represents a part of the short auth
     * string, for example: 🐶
     */
    readonly symbol: string;
}

/**
 * An encrypted attachment, usually created from `Attachment.encrypt`.
 */
export class EncryptedAttachment {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new encrypted attachment manually.
     *
     * It needs encrypted data, stored in an `Uint8Array`, and a
     * [media encryption
     * information](https://docs.rs/matrix-sdk-crypto/latest/matrix_sdk_crypto/struct.MediaEncryptionInfo.html),
     * as a JSON-encoded object.
     *
     * The media encryption information aren't stored as a string:
     * they are parsed, validated and fully deserialized.
     *
     * See [the specification to learn
     * more](https://spec.matrix.org/unstable/client-server-api/#extensions-to-mroommessage-msgtypes).
     */
    constructor(encrypted_data: Uint8Array, media_encryption_info: string);
    /**
     * The actual encrypted data.
     *
     * **Warning**: It returns a **copy** of the entire encrypted
     * data; be nice with your memory.
     */
    readonly encryptedData: Uint8Array;
    /**
     * Check whether the media encryption info has been consumed by
     * `Attachment.decrypt` already.
     */
    readonly hasMediaEncryptionInfoBeenConsumed: boolean;
    /**
     * Return the media encryption info as a JSON-encoded object. The
     * structure is fully valid.
     *
     * If the media encryption info have been consumed already, it
     * will return `null`.
     */
    readonly mediaEncryptionInfo: string | undefined;
}

/**
 * An encryption algorithm to be used to encrypt messages sent to a
 * room.
 */
export enum EncryptionAlgorithm {
    /**
     * Olm version 1 using Curve25519, AES-256, and SHA-256.
     */
    OlmV1Curve25519AesSha2 = 0,
    /**
     * Megolm version 1 using AES-256 and SHA-256.
     */
    MegolmV1AesSha2 = 1,
    /**
     * Unsupported algorithm.
     *
     * Applications should ignore this value if it is received, and should
     * never set it.
     */
    Unknown = 2,
}

/**
 * Struct containing information on how a room event was decrypted.
 */
export class EncryptionInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The verification state of the device that sent us the event.
     * Note this is the state of the device at the time of
     * decryption. It may change in the future if a device gets
     * verified or deleted.
     *
     * # Arguments
     *
     * * `strict` - whether to enable "strict mode" verification. In non-strict
     *   mode, unverified users are given no shield, and keys that have been
     *   forwarded or restored from an insecure backup are given a grey shield
     *   (both get a red shield in strict mode).
     */
    shieldState(strict: boolean): ShieldState;
    /**
     * The device ID of the user who sent us the keys with which we decrypted
     * this event as part of an MSC4268 key bundle, if present. Only applicable
     * for room events.
     */
    get forwarderDevice(): DeviceId | undefined;
    /**
     * The device ID of the user who sent us the keys with which we decrypted
     * this event as part of an MSC4268 key bundle, if present. Only applicable
     * for room events.
     */
    set forwarderDevice(value: DeviceId | null | undefined);
    /**
     * The ID of the user who sent us the keys with which we decrypted this
     * event as part of an MSC4268 key bundle, if present. Only applicable for
     * room events.
     */
    get forwarder(): UserId | undefined;
    /**
     * The ID of the user who sent us the keys with which we decrypted this
     * event as part of an MSC4268 key bundle, if present. Only applicable for
     * room events.
     */
    set forwarder(value: UserId | null | undefined);
    /**
     * The signing Ed25519 key that created the megolm key that
     * was used to decrypt this session.
     */
    get senderClaimedEd25519Key(): string | undefined;
    /**
     * The signing Ed25519 key that created the megolm key that
     * was used to decrypt this session.
     */
    set senderClaimedEd25519Key(value: string | null | undefined);
    /**
     * The base64-encoded public Curve25519 key of the device that created the
     * megolm decryption key originally.
     */
    senderCurve25519Key: string;
    /**
     * The device ID of the device that sent us the event.
     *
     * Note this is untrusted data unless {@link shieldState} shows that the
     * sender is verified.
     */
    get senderDevice(): DeviceId | undefined;
    /**
     * The device ID of the device that sent us the event.
     *
     * Note this is untrusted data unless {@link shieldState} shows that the
     * sender is verified.
     */
    set senderDevice(value: DeviceId | null | undefined);
    /**
     * The user ID of the sender of the event.
     *
     * Note this is untrusted data unless {@link shieldState} shows that the
     * sender is verified.
     */
    sender: UserId;
}

/**
 * Settings for an encrypted room.
 *
 * This determines the algorithm and rotation periods of a group
 * session.
 */
export class EncryptionSettings {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new `EncryptionSettings` with default values.
     */
    constructor();
    /**
     * The encryption algorithm that should be used in the room.
     */
    algorithm: EncryptionAlgorithm;
    /**
     * Whether state event encryption is enabled.
     */
    encryptStateEvents: boolean;
    /**
     * The history visibility of the room when the session was
     * created.
     */
    historyVisibility: HistoryVisibility;
    /**
     * How many messages should be sent before changing the session.
     */
    rotationPeriodMessages: bigint;
    /**
     * How long the session should be used before changing it,
     * expressed in microseconds.
     */
    rotationPeriod: bigint;
    /**
     * Should untrusted devices receive the room key, or should they be
     * excluded from the conversation.
     */
    sharingStrategy: CollectStrategy;
}

/**
 * An established ECIES session.
 *
 * This session can be used to encrypt and decrypt messages between the two
 * sides of the channel.
 */
export class EstablishedEcies {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Get the [`CheckCode`] which uniquely identifies this
     * [`EstablishedEcies`] session.
     *
     * This check code can be used to verify and confirm that both sides of the
     * session are indeed using the same shared secret.
     */
    check_code(): CheckCode;
    /**
     * Decrypt the given message using this [`EstablishedEcies`] session.
     */
    decrypt(message: string): string;
    /**
     * Encrypt the given plaintext using this [`EstablishedEcies`] session.
     */
    encrypt(message: string): string;
    /**
     * Get our [`Curve25519PublicKey`].
     *
     * This public key needs to be sent to the other side so that it can
     * complete the ECIES channel establishment.
     */
    public_key(): Curve25519PublicKey;
}

/**
 * A Matrix [event ID].
 *
 * An `EventId` is generated randomly or converted from a string
 * slice, and can be converted back into a string as needed.
 *
 * [event ID]: https://spec.matrix.org/v1.2/appendices/#room-ids-and-event-ids
 */
export class EventId {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Parse/validate and create a new `EventId`.
     */
    constructor(id: string);
    /**
     * Return the event ID as a string.
     */
    toString(): string;
    /**
     * Returns the event's localpart.
     */
    readonly localpart: string;
    /**
     * Returns the server name of the event ID.
     */
    readonly serverName: ServerName | undefined;
}

/**
 * Who can see a room's history.
 */
export enum HistoryVisibility {
    /**
     * Previous events are accessible to newly joined members from
     * the point they were invited onwards.
     *
     * Events stop being accessible when the member's state changes
     * to something other than *invite* or *join*.
     */
    Invited = 0,
    /**
     * Previous events are accessible to newly joined members from
     * the point they joined the room onwards.
     *
     * Events stop being accessible when the member's state changes
     * to something other than *join*.
     */
    Joined = 1,
    /**
     * Previous events are always accessible to newly joined members.
     *
     * All events in the room are accessible, even those sent when
     * the member was not a part of the room.
     */
    Shared = 2,
    /**
     * All events while this is the `HistoryVisibility` value may be
     * shared by any participating homeserver with anyone, regardless
     * of whether they have ever joined the room.
     */
    WorldReadable = 3,
}

/**
 * Struct holding the two public identity keys of an account.
 */
export class IdentityKeys {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The Curve25519 public key, used for establish shared secrets.
     */
    curve25519: Curve25519PublicKey;
    /**
     * The Ed25519 public key, used for signing.
     */
    ed25519: Ed25519PublicKey;
}

/**
 * The result of an inbound ECIES channel establishment.
 */
export class InboundCreationResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The established ECIES channel.
     */
    channel: EstablishedEcies;
    /**
     * The plaintext of the initial message.
     */
    message: string;
}

/**
 * Inbound group session.
 *
 * Inbound group sessions are used to exchange room messages between a group of
 * participants. Inbound group sessions are used to decrypt the room messages.
 */
export class InboundGroupSession {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Has the session been imported from a file or server-side backup? As
     * opposed to being directly received as an `m.room_key` event.
     */
    hasBeenImported(): boolean;
    /**
     * The room where this session is used in.
     */
    readonly roomId: RoomId;
    /**
     * The Curve25519 key of the sender of this session, as a
     * [Curve25519PublicKey].
     */
    readonly senderKey: Curve25519PublicKey;
    /**
     * Returns the unique identifier for this session.
     */
    readonly sessionId: string;
}

/**
 * Represents an invalid to-device event that was ignored (because it is
 * missing some mandatory fields, for example).
 */
export class InvalidToDeviceEvent {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The original message as received from sync, encoded as JSON.
     */
    readonly rawEvent: string;
    /**
     * The type of processed to-device event. Always {@link
     * ProcessedToDeviceEventType.Invalid} for this type.
     */
    readonly type: ProcessedToDeviceEventType;
}

/**
 * A request that will back up a batch of room keys to the server
 * ([specification]).
 *
 * [specification]: https://spec.matrix.org/unstable/client-server-api/#put_matrixclientv3room_keyskeys
 */
export class KeysBackupRequest {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new `KeysBackupRequest`.
     */
    constructor(id: string, body: string, version: string);
    /**
     * A JSON-encoded object containing the rest of the payload: `rooms`.
     *
     * It represents the body of the HTTP request.
     */
    readonly body: string;
    /**
     * The request ID.
     */
    readonly id: string;
    /**
     * The backup version that these room keys should be part of.
     */
    readonly version: string;
    /**
     * Get its request type.
     */
    readonly type: RequestType;
}

/**
 * Data for a request to the `/keys/claim` API endpoint
 * ([specification]).
 *
 * Claims one-time keys that can be used to establish 1-to-1 E2EE
 * sessions.
 *
 * [specification]: https://spec.matrix.org/unstable/client-server-api/#post_matrixclientv3keysclaim
 */
export class KeysClaimRequest {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new `KeysClaimRequest`.
     */
    constructor(id: string, body: string);
    /**
     * A JSON-encoded object containing the rest of the payload: `timeout`,
     * `one_time_keys`.
     *
     * It represents the body of the HTTP request.
     */
    readonly body: string;
    /**
     * The request ID.
     */
    readonly id: string;
    /**
     * Get its request type.
     */
    readonly type: RequestType;
}

/**
 * Data for a request to the `/keys/query` API endpoint
 * ([specification]).
 *
 * Returns the current devices and identity keys for the given users.
 *
 * [specification]: https://spec.matrix.org/unstable/client-server-api/#post_matrixclientv3keysquery
 */
export class KeysQueryRequest {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new `KeysQueryRequest`.
     */
    constructor(id: string, body: string);
    /**
     * A JSON-encoded object containing the rest of the payload: `timeout`,
     * `device_keys`, `token`.
     *
     * It represents the body of the HTTP request.
     */
    readonly body: string;
    /**
     * The request ID.
     */
    readonly id: string;
    /**
     * Get its request type.
     */
    readonly type: RequestType;
}

/**
 * Data for a request to the `/keys/upload` API endpoint
 * ([specification]).
 *
 * Publishes end-to-end encryption keys for the device.
 *
 * [specification]: https://spec.matrix.org/unstable/client-server-api/#post_matrixclientv3keysupload
 */
export class KeysUploadRequest {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new `KeysUploadRequest`.
     */
    constructor(id: string, body: string);
    /**
     * A JSON-encoded object containing the rest of the payload: `device_keys`,
     * `one_time_keys`, `fallback_keys`.
     *
     * It represents the body of the HTTP request.
     */
    readonly body: string;
    /**
     * The request ID.
     */
    readonly id: string;
    /**
     * Get its request type.
     */
    readonly type: RequestType;
}

/**
 * The local trust state of a device.
 */
export enum LocalTrust {
    /**
     * The device has been verified and is trusted.
     */
    Verified = 0,
    /**
     * The device been blacklisted from communicating.
     */
    BlackListed = 1,
    /**
     * The trust state of the device is being ignored.
     */
    Ignored = 2,
    /**
     * The trust state is unset.
     */
    Unset = 3,
}

/**
 * Logger level.
 */
export enum LoggerLevel {
    /**
     * `TRACE` level.
     *
     * Designate very low priority, often extremely verbose,
     * information.
     */
    Trace = 0,
    /**
     * `DEBUG` level.
     *
     * Designate lower priority information.
     */
    Debug = 1,
    /**
     * `INFO` level.
     *
     * Designate useful information.
     */
    Info = 2,
    /**
     * `WARN` level.
     *
     * Designate hazardous situations.
     */
    Warn = 3,
    /**
     * `ERROR` level.
     *
     * Designate very serious errors.
     */
    Error = 4,
}

/**
 * Represents a signature that is either valid _or_ that could not be
 * decoded.
 */
export class MaybeSignature {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Check whether the signature could not be successfully decoded.
     */
    isInvalid(): boolean;
    /**
     * Check whether the signature has been successfully decoded.
     */
    isValid(): boolean;
    /**
     * The base64 encoded string that is claimed to contain a
     * signature but could not be decoded, if any.
     */
    readonly invalidSignatureSource: string | undefined;
    /**
     * The signature, if successfully decoded.
     */
    readonly signature: Signature | undefined;
}

/**
 * Js Decryption error with code.
 */
export class MegolmDecryptionError {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Creates generic error with description
     */
    static unable_to_decrypt(desc: string): MegolmDecryptionError;
    /**
     * Description code for the error. See `DecryptionErrorCode`
     */
    readonly code: DecryptionErrorCode;
    /**
     * detailed description
     */
    readonly description: string;
    /**
     * Textual description of the withheld code, if any.
     *
     * Example: "The sender has disabled encrypting to unverified devices."
     *
     * `undefined` if we have not received a withheld code for the megolm
     * session.
     */
    readonly maybe_withheld: string | undefined;
    /**
     * The withheld code, if any.
     *
     * Example: "m.unverified"
     *
     * `undefined` if we have not received a withheld code for the megolm
     * session.
     */
    readonly withheldCode: string | undefined;
}

/**
 * The public part of the backup key.
 */
export class MegolmV1BackupKey {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Get the full name of the backup algorithm this backup key supports.
     */
    readonly algorithm: string;
    /**
     * The actual base64 encoded public key.
     */
    readonly publicKeyBase64: string;
}

/**
 * Migration routines
 *
 * The public methods are exposed as static methods on this class, for
 * namespacing and to enable easier mocking in unit tests.
 */
export class Migration {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Import the base dataset from a libolm-based setup to a vodozemac-based
     * setup stored in IndexedDB.
     *
     * Populates the user credentials, Olm account, backup data, etc. This is
     * the first step in the migration process. Once this base data is
     * imported, further data can be imported with {@link
     * migrateOlmSessions}, {@link migrateMegolmSessions}, and TODO room
     * settings.
     *
     * # Arguments
     *
     * * `data` - The data to be migrated
     * * `pickle_key` - The libolm pickle key that was used to pickle the olm
     *   account objects.
     * * `store_handle` - A connection to the CryptoStore which will be used to
     *   store the vodozemac data.
     * * `logger` - An optional logger instance to use for writing log messages
     *   during the migration operation. An instance of `JsLogger`.
     */
    static migrateBaseData(data: BaseMigrationData, pickle_key: Uint8Array, store_handle: StoreHandle, logger?: JsLogger): Promise<void>;
    /**
     * Migrate Megolm sessions of a libolm-based setup to a vodozemac-based
     * setup stored in an indexedDB crypto store.
     *
     * Before this method can be used, {@link migrateBaseData} must be used to
     * import the base data into the crypto store.
     *
     * This method should be called a number of times, with separate batches of
     * `sessions`. If a progress display is given, it can be updated after
     * each batch is successfully imported.
     *
     * # Arguments
     *
     * * `sessions` - An `Array` of {@link PickledInboundGroupSession}s to
     *   import. Items inside `sessions` will be invalidated by this method.
     * * `pickle_key` - The libolm pickle key that was used to pickle the
     *   megolm session objects.
     * * `store_handle` - A connection to the CryptoStore which will be used to
     *   store the vodozemac data.
     * * `logger` - An optional logger instance to use for writing log messages
     *   during the migration operation. An instance of `JsLogger`.
     */
    static migrateMegolmSessions(sessions: PickledInboundGroupSession[], pickle_key: Uint8Array, store_handle: StoreHandle, logger?: JsLogger): Promise<void>;
    /**
     * Migrate Olm sessions of a libolm-based setup to a vodozemac-based setup
     * stored in an indexedDB crypto store.
     *
     * Before this method can be used, {@link migrateBaseData} must be used to
     * import the base data into the crypto store.
     *
     * This method should be called a number of times, with separate batches of
     * `sessions`. If a progress display is given, it can be updated after
     * each batch is successfully imported.
     *
     * # Arguments
     *
     * * `sessions` - An `Array` of {@link PickledSession}s to import. Items
     *   inside `sessions` will be invalidated by this method.
     * * `pickle_key` - The libolm pickle key that was used to pickle the olm
     *   session objects.
     * * `store_handle` - A connection to the CryptoStore which will be used to
     *   store the vodozemac data.
     * * `logger` - An optional logger instance to use for writing log messages
     *   during the migration operation. An instance of `JsLogger`.
     */
    static migrateOlmSessions(sessions: PickledSession[], pickle_key: Uint8Array, store_handle: StoreHandle, logger?: JsLogger): Promise<void>;
}

/**
 * Intent-specific data in the case the QR code adheres to
 * {@link https://github.com/matrix-org/matrix-spec-proposals/pull/4108 MSC4108} of the QR code
 * data format.
 */
export class Msc4108IntentData {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Get the URL of the rendezvous server which will be used to exchange
     * messages between the two devices.
     */
    rendezvousUrl: string;
    /**
     * Get the server name of the homeserver which the new device will be
     * logged in to.
     *
     * This will be only available if the existing device has generated the QR
     * code and the new device is the one scanning the QR code.
     */
    get serverName(): string | undefined;
    /**
     * Get the server name of the homeserver which the new device will be
     * logged in to.
     *
     * This will be only available if the existing device has generated the QR
     * code and the new device is the one scanning the QR code.
     */
    set serverName(value: string | null | undefined);
}

/**
 * Intent-specific data in the case the QR code adheres to
 * {@link https://github.com/matrix-org/matrix-spec-proposals/pull/4388 MSC4388} of the QR code
 * data format.
 */
export class Msc4388IntentData {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The base URL of the homeserver that the device generating the QR is
     * using.
     */
    baseUrl: string;
    /**
     * The ID of the rendezvous session, can be used to exchange messages with
     * the other device.
     */
    rendezvousId: string;
}

/**
 * State machine implementation of the Olm/Megolm encryption protocol
 * used for Matrix end to end encryption.
 */
export class OlmMachine {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Encrypt a batch of room keys and return a request that needs to be sent
     * out to backup the room keys.
     *
     * Returns an optional {@link KeysBackupRequest}.
     */
    backupRoomKeys(): Promise<KeysBackupRequest | undefined>;
    /**
     * Create a new cross signing identity and get the upload request
     * to push the new public keys to the server.
     *
     * Warning: This will delete any existing cross signing keys that
     * might exist on the server and thus will reset the trust
     * between all the devices.
     *
     * Uploading these keys will require user interactive auth.
     *
     * # Arguments
     *
     * * `reset`, whether the method should create a new identity or use the
     *   existing one during the request. If set to true, the request will
     *   attempt to upload a new identity. If set to false, the request will
     *   attempt to upload the existing identity. Since the uploading process
     *   requires user interactive authentication, which involves sending out
     *   the same request multiple times, setting this argument to false
     *   enables you to reuse the same request.
     *
     * Returns a {@link CrossSigningBootstrapRequests}.
     */
    bootstrapCrossSigning(reset: boolean): Promise<CrossSigningBootstrapRequests>;
    /**
     * Assemble, and encrypt, a room key bundle for sharing encrypted history,
     * as per {@link https://github.com/matrix-org/matrix-spec-proposals/pull/4268|MSC4268}.
     *
     * Returns `undefined` if there are no keys to share in the given room,
     * otherwise an {@link EncryptedAttachment}.
     *
     * The data should be uploaded to the media server, and the details then
     * passed to {@link shareRoomKeyBundleData}.
     *
     * @experimental
     */
    buildRoomKeyBundle(room_id: RoomId): Promise<EncryptedAttachment | undefined>;
    /**
     * Store the fact that we are no longer waiting for a key bundle in the
     * given room.
     *
     * The counterpart to {@link storeRoomPendingKeyBundle}. Should be called
     * when, for example, we leave a room, or have successfully imported a
     * bundle.
     *
     * @experimental
     */
    clearRoomPendingKeyBundle(room_id: RoomId): Promise<void>;
    /**
     * Shut down the `OlmMachine`.
     *
     * The `OlmMachine` cannot be used after this method has been called.
     *
     * All associated resources will be closed too, like IndexedDB
     * connections.
     */
    close(): void;
    /**
     * Get the status of the private cross signing keys.
     *
     * This can be used to check which private cross signing keys we
     * have stored locally.
     */
    crossSigningStatus(): Promise<CrossSigningStatus>;
    /**
     * Try to decrypt a reader into a list of exported room keys.
     *
     * `encrypted_exported_room_keys` is the result from
     * `encrypt_exported_room_keys`. `passphrase` is the passphrase that was
     * used when calling `encrypt_exported_room_keys`.
     */
    static decryptExportedRoomKeys(encrypted_exported_room_keys: string, passphrase: string): string;
    /**
     * Decrypt an event from a room timeline.
     *
     * # Arguments
     *
     * * `event`, the event that should be decrypted.
     * * `room_id`, the ID of the room where the event was sent to.
     *
     * # Returns
     *
     * A `Promise` which resolves to a {@link DecryptedRoomEvent} instance, or
     * rejects with a {@link MegolmDecryptionError} instance.
     */
    decryptRoomEvent(event: string, room_id: RoomId, decryption_settings: DecryptionSettings): Promise<DecryptedRoomEvent>;
    /**
     * Manage dehydrated devices
     */
    dehydratedDevices(): DehydratedDevices;
    /**
     * Delete all secrets with the given secret name from the inbox.
     *
     * Should be called after handling the secrets with
     * `get_secrets_from_inbox`.
     *
     * # Arguments
     *
     * * `secret_name` - The name of the secret to delete.
     */
    deleteSecretsFromInbox(secret_name: string): Promise<void>;
    /**
     * Disable and reset our backup state.
     *
     * This will remove any pending backup request, remove the backup key and
     * reset the backup state of each room key we have.
     *
     * Returns `Promise<void>`.
     */
    disableBackup(): Promise<void>;
    /**
     * Activate the given backup key to be used with the given backup version.
     *
     * **Warning**: The caller needs to make sure that the given `BackupKey` is
     * trusted, otherwise we might be encrypting room keys that a malicious
     * party could decrypt.
     *
     * The {@link verifyBackup} method can be used to do so.
     *
     * Returns `Promise<void>`.
     */
    enableBackupV1(public_key_base_64: string, version: string): Promise<void>;
    /**
     * Encrypt the list of exported room keys using the given passphrase.
     *
     * `exported_room_keys` is a list of sessions that should be encrypted
     * (it's generally returned by `export_room_keys`). `passphrase` is the
     * passphrase that will be used to encrypt the exported room keys. And
     * `rounds` is the number of rounds that should be used for the key
     * derivation when the passphrase gets turned into an AES key. More rounds
     * are increasingly computationnally intensive and as such help against
     * brute-force attacks. Should be at least `10_000`, while values in the
     * `100_000` ranges should be preferred.
     */
    static encryptExportedRoomKeys(exported_room_keys: string, passphrase: string, rounds: number): string;
    /**
     * Encrypt a room message for the given room.
     *
     * **Note**: A room key needs to be shared with the group of users that are
     * members in the given room. If this is not done this method will panic.
     *
     * The usual flow to encrypt an event using this state machine is as
     * follows:
     *
     * 1. Get the one-time key claim request to establish 1:1 Olm sessions for
     *    the room members of the room we wish to participate in. This is done
     *    using the [`get_missing_sessions()`](Self::get_missing_sessions)
     *    method. This method call should be locked per call.
     *
     * 2. Share a room key with all the room members using the
     *    [`share_room_key()`](Self::share_room_key). This method call should
     *    be locked per room.
     *
     * 3. Encrypt the event using this method.
     *
     * 4. Send the encrypted event to the server.
     *
     * After the room key is shared steps 1 and 2 will become noops, unless
     * there's some changes in the room membership or in the list of devices a
     * member has.
     *
     *
     * `room_id` is the ID of the room for which the message should
     * be encrypted. `event_type` is the type of the event. `content`
     * is the plaintext content of the message that should be
     * encrypted.
     *
     * # Panics
     *
     * Panics if a group session for the given room wasn't shared
     * beforehand.
     */
    encryptRoomEvent(room_id: RoomId, event_type: string, content: string): Promise<string>;
    /**
     * Encrypt a state event for the given room.
     *
     * This method encrypts a state event for the specified room, using the
     * current group session. The event will be encrypted so that only
     * authorized room members can decrypt it.
     *
     * **Note**: A room key must have been shared with the group of users in
     * the room before calling this method. If not, this method will panic.
     *
     * The usual flow to encrypt a state event using this machine is identical
     * to that outlined for [`OlmMachine::encrypt_room_event`].
     *
     * # Arguments
     *
     * * `room_id` - The ID of the room for which the state event should be
     *   encrypted.
     * * `event_type` - The type of the state event.
     * * `state_key` - The state key for the event.
     * * `content` - The plaintext JSON content of the event to encrypt.
     *
     * # Returns
     *
     * A `Promise` resolving to a JSON string containing the encrypted event.
     *
     * # Panics
     *
     * Panics if a group session for the given room was not previously shared.
     */
    encryptStateEvent(room_id: RoomId, event_type: string, state_key: string, content: string): Promise<string>;
    /**
     * Export all the private cross signing keys we have.
     *
     * The export will contain the seeds for the ed25519 keys as
     * unpadded base64 encoded strings.
     *
     * Returns `undefined` if we don’t have any private cross signing keys;
     * otherwise returns a `CrossSigningKeyExport`.
     */
    exportCrossSigningKeys(): Promise<CrossSigningKeyExport | undefined>;
    /**
     * Export the keys that match the given predicate.
     *
     * `predicate` is a closure that will be called for every known
     * `InboundGroupSession`, which represents a room key. If the closure
     * returns `true`, the `InboundGroupSession` will be included in the
     * export; otherwise it won't.
     *
     * Returns a Promise containing a Result containing a String which is a
     * JSON-encoded array of ExportedRoomKey objects.
     */
    exportRoomKeys(predicate: (session: InboundGroupSession) => boolean): Promise<string>;
    /**
     * Export all the secrets we have in the store into a {@link
     * SecretsBundle}.
     *
     * This method will export all the private cross-signing keys and, if
     * available, the private part of a backup key and its accompanying
     * version.
     *
     * The method will fail if we don't have all three private cross-signing
     * keys available.
     *
     * **Warning**: Only export this and share it with a trusted recipient,
     * i.e. if an existing device is sharing this with a new device.
     */
    exportSecretsBundle(): Promise<Promise<SecretsBundle>>;
    /**
     * Get a list of all rooms where we are waiting for a key bundle.
     *
     * @see getPendingKeyBundleDetailsForRoom
     *
     * @experimental
     */
    getAllRoomsPendingKeyBundles(): Promise<Array<RoomPendingKeyBundleDetails>>;
    /**
     * Get the backup keys we have saved in our store.
     * Returns a `Promise` for {@link BackupKeys}.
     */
    getBackupKeys(): Promise<BackupKeys>;
    /**
     * Get a specific device of a user.
     *
     * ### Parameters
     *
     * * `user_id` - The unique ID of the user that the device belongs to.
     *
     * * `device_id` - The unique ID of the device.
     *
     * * `timeout_secs` - The amount of time we should wait for a `/keys/query`
     *   response before returning if the user's device list has been marked as
     *   stale. **Note**, this assumes that the requests from {@link
     *   OlmMachine.outgoingRequests} are being processed and sent out.
     *
     *   If unset, we will return immediately even if the device list is stale.
     *
     * ### Returns
     *
     * If the device is known, a {@link Device}. Otherwise, `undefined`.
     */
    getDevice(user_id: UserId, device_id: DeviceId, timeout_secs?: number | null): Promise<Device | undefined>;
    /**
     * Get the cross signing user identity of a user.
     *
     * Returns a promise for an {@link OwnUserIdentity}, a
     * {@link OtherUserIdentity}, or `undefined`.
     */
    getIdentity(user_id: UserId): Promise<OwnUserIdentity | OtherUserIdentity | undefined>;
    /**
     * Get the a key claiming request for the user/device pairs that
     * we are missing Olm sessions for.
     *
     * Returns `null` if no key claiming request needs to be sent
     * out, otherwise it returns a `KeysClaimRequest` object.
     *
     * Sessions need to be established between devices so group
     * sessions for a room can be shared with them.
     *
     * This should be called every time a group session needs to be
     * shared as well as between sync calls. After a sync some
     * devices may request room keys without us having a valid Olm
     * session with them, making it impossible to server the room key
     * request, thus it’s necessary to check for missing sessions
     * between sync as well.
     *
     * Note: Care should be taken that only one such request at a
     * time is in flight, e.g. using a lock.
     *
     * The response of a successful key claiming requests needs to be
     * passed to the `OlmMachine` with the `mark_request_as_sent`.
     *
     * `users` represents the list of users that we should check if
     * we lack a session with one of their devices. This can be an
     * empty iterator when calling this method between sync requests.
     *
     * Items inside `users` will be invalidated by this method. Be careful not
     * to use the `UserId`s after this method has been called.
     */
    getMissingSessions(users: UserId[]): Promise<KeysClaimRequest | null>;
    /**
     * See if we have recently accepted an invitation to the given room.
     *
     * If we have accepted an invite to a room without finding an
     * {@link https://github.com/matrix-org/matrix-spec-proposals/pull/4268|MSC4268}
     * key bundle, we should accept a key bundle once one arrives.
     *
     * The data returned here is populated by the application, via {@link
     * storeRoomPendingKeyBundle}.
     *
     * @experimental
     */
    getPendingKeyBundleDetailsForRoom(room_id: RoomId): Promise<RoomPendingKeyBundleDetails | undefined>;
    /**
     * See if we have received an {@link https://github.com/matrix-org/matrix-spec-proposals/pull/4268|MSC4268}
     * room key bundle for the given room from the given user.
     *
     * Before calling this, the application must make sure that we have an
     * up-to-date copy of the inviter's cross-signing keys, so that we can
     * verify the device that sent us the key bundle data message. (For
     * now, the easiest way to do that is by calling {@link queryKeysForUsers}
     * for the inviter, and making the resultant request.)
     *
     * Returns either `undefined` if no suitable bundle has been received,
     * or an {@link StoredRoomKeyBundleData}, in which case, the bundle
     * should be downloaded, and then passed to {@link
     * receiveRoomKeyBundle}.
     *
     * @experimental
     */
    getReceivedRoomKeyBundleData(room_id: RoomId, inviter: UserId): Promise<StoredRoomKeyBundleData | undefined>;
    /**
     * Get encryption info for a decrypted timeline event.
     *
     * This recalculates the `EncryptionInfo` data that is returned by
     * `decryptRoomEvent`, based on the current
     * verification status of the sender, etc.
     *
     * Returns an error for an unencrypted event.
     *
     * # Arguments
     *
     * * `event` - The event to get information for.
     * * `room_id` - The ID of the room where the event was sent to.
     *
     * # Returns
     *
     * {@link EncryptionInfo}
     */
    getRoomEventEncryptionInfo(event: string, room_id: RoomId): Promise<EncryptionInfo>;
    /**
     * Get the stored room settings, such as the encryption algorithm or
     * whether to encrypt only for trusted devices.
     *
     * These settings can be modified via {@link setRoomSettings}.
     *
     * # Returns
     *
     * `Promise<RoomSettings|undefined>`
     */
    getRoomSettings(room_id: RoomId): Promise<Promise<RoomSettings|undefined>>;
    /**
     * Get all the secrets with the given secret_name we have currently
     * stored.
     * The only secret this will currently return is the
     * `m.megolm_backup.v1` secret.
     *
     * Usually you would just register a callback with
     * [`register_receive_secret_callback`], but if the client is shut down
     * before handling them, this method can be used to retrieve them.
     * This method should therefore be called at client startup to retrieve any
     * secrets received during the previous session.
     *
     * The secrets are guaranteed to have been received over a 1-to-1 encrypted
     * to_device message from one of the user's own verified devices.
     *
     * Returns a `Promise` for a `Set` of `String` corresponding to the secret
     * values.
     *
     * If the secret is valid and handled, the secret inbox should be cleared
     * by calling `delete_secrets_from_inbox`.
     */
    getSecretsFromInbox(secret_name: string): Promise<Set<string>>;
    /**
     * Get a map holding all the devices of a user.
     *
     * ### Parameters
     *
     * * `user_id` - The unique ID of the user that the device belongs to.
     *
     * * `timeout_secs` - The amount of time we should wait for a `/keys/query`
     *   response before returning if the user's device list has been marked as
     *   stale. **Note**, this assumes that the requests from {@link
     *   OlmMachine.outgoingRequests} are being processed and sent out.
     *
     *   If unset, we will return immediately even if the device list is stale.
     *
     * ### Returns
     *
     * A {@link UserDevices} object.
     */
    getUserDevices(user_id: UserId, timeout_secs?: number | null): Promise<UserDevices>;
    /**
     * Get a verification object for the given user ID with the given
     * flow ID (a to-device request ID if the verification has been
     * requested by a to-device request, or a room event ID if the
     * verification has been requested by a room event).
     *
     * It returns a “`Verification` object”, which is either a `Sas`
     * or `Qr` object.
     */
    getVerification(user_id: UserId, flow_id: string): Sas | Qr | undefined;
    /**
     * Get a verification request object with the given flow ID.
     */
    getVerificationRequest(user_id: UserId, flow_id: string): VerificationRequest | undefined;
    /**
     * Get all the verification requests of a given user.
     */
    getVerificationRequests(user_id: UserId): VerificationRequest[];
    /**
     * Get whether we have previously downloaded all message keys for a
     * particular room from the key backup. Typically called in advance of
     * building a room key bundle.
     */
    hasDownloadedAllRoomKeys(room_id: RoomId): Promise<boolean>;
    /**
     * Import the given room keys into our store.
     *
     * # Arguments
     *
     * * `backed_up_room_keys`: keys that were retrieved from backup and that
     *   should be added to our store (provided they are better than our
     *   current versions of those keys). Specifically, it should be a Map from
     *   {@link RoomId}, to a Map from session ID to a (decrypted) session data
     *   structure.
     *
     * * `progress_listener`: an optional callback that takes 3 arguments:
     *   `progress` (the number of keys that have successfully been imported),
     *   `total` (the total number of keys), and `failures` (the number of keys
     *   that failed to import), and returns nothing.
     *
     * # Returns
     *
     * A {@link RoomKeyImportResult}.
     */
    importBackedUpRoomKeys(backed_up_room_keys: Map<RoomId, Map<string, any>>, progress_listener: (progress: bigint, total: bigint, failures: bigint) => void | undefined, backup_version: string): Promise<RoomKeyImportResult>;
    /**
     * Import our private cross signing keys.
     *
     * The keys should be provided as unpadded-base64-encoded strings.
     *
     * Returns a `CrossSigningStatus`.
     */
    importCrossSigningKeys(master_key?: string | null, self_signing_key?: string | null, user_signing_key?: string | null): Promise<CrossSigningStatus>;
    /**
     * Import the given room keys into our store.
     *
     * `exported_keys` is a JSON-encoded list of previously exported keys that
     * should be imported into our store. If we already have a better
     * version of a key, the key will _not_ be imported.
     *
     * `progress_listener` is a closure that takes 2 `BigInt` arguments:
     * `progress` and `total`, and returns nothing.
     *
     * Returns a {@link RoomKeyImportResult}.
     */
    importExportedRoomKeys(exported_room_keys: string, progress_listener: (progress: bigint, total: bigint) => void): Promise<RoomKeyImportResult>;
    /**
     * Import the given room keys into our store.
     *
     * Mostly, a deprecated alias for `importExportedRoomKeys`, though the
     * return type is different.
     *
     * Returns a String containing a JSON-encoded object, holding three
     * properties:
     *  * `total_count` (the total number of keys found in the export data).
     *  * `imported_count` (the number of keys that were imported).
     *  * `keys` (the keys that were imported; a map from room id to a map of
     *    the sender key to a list of session ids).
     *
     * @deprecated Use `importExportedRoomKeys` or `importBackedUpRoomKeys`.
     */
    importRoomKeys(exported_room_keys: string, progress_listener: (imported: bigint, total: bigint) => void): Promise<string>;
    /**
     * Import and persists secrets from a {@link SecretsBundle}.
     *
     * This method will import all the private cross-signing keys and, if
     * available, the private part of a backup key and its accompanying
     * version into the store.
     *
     * **Warning**: Only import this from a trusted source, i.e. if an existing
     * device is sharing this with a new device. The imported cross-signing
     * keys will create a {@link OwnUserIdentity} and mark it as verified.
     *
     * The backup key will be persisted in the store and can be enabled using
     * the BackupMachine.
     *
     * The provided `SecretsBundle` is freed by this method; be careful not to
     * use it once this method has been called.
     */
    importSecretsBundle(bundle: SecretsBundle): Promise<void>;
    /**
     * Create a new `OlmMachine` backed by an existing store.
     *
     * # Arguments
     *
     * * `user_id` - represents the unique ID of the user that owns this
     * machine.
     *
     * * `device_id` - represents the unique ID of the device
     * that owns this machine.
     *
     * * `store_handle` - the connection to the crypto store to be used for
     *   this machine.
     *
     * * `logger` - Optional logger to use for all operations on this machine.
     *   An instance of `JsLogger`.
     */
    static initFromStore(user_id: UserId, device_id: DeviceId, store_handle: StoreHandle, logger?: JsLogger): Promise<OlmMachine>;
    /**
     * Create a new `OlmMachine`.
     *
     * The created machine will keep the encryption keys either in a IndexedDB
     * based store, or in a memory store and once the objects is dropped,
     * the keys will be lost.
     *
     * # Arguments
     *
     * * `user_id` - represents the unique ID of the user that owns this
     * machine.
     *
     * * `device_id` - represents the unique ID of the device
     * that owns this machine.
     *
     * * `store_name` - The name that should be used to open the IndexedDB
     *   based database. If this isn't provided, a memory-only store will be
     *   used. *Note* the memory-only store will lose your E2EE keys when the
     *   `OlmMachine` gets dropped.
     *
     * * `store_passphrase` - The passphrase that should be used to encrypt the
     *   IndexedDB-based store.
     *
     * * `logger` - Optional logger to use for all operations on this machine.
     *   An instance of `JsLogger`.
     */
    static initialize(user_id: UserId, device_id: DeviceId, store_name?: string, store_passphrase?: string, logger?: JsLogger): Promise<OlmMachine>;
    /**
     * Invalidate the currently active outbound group session for the
     * given room.
     *
     * Returns true if a session was invalidated, false if there was
     * no session to invalidate.
     */
    invalidateGroupSession(room_id: RoomId): Promise<boolean>;
    /**
     * Are we able to encrypt room keys.
     *
     * This returns true if we have an active `BackupKey` and backup version
     * registered with the state machine.
     *
     * Returns `Promise<boolean>`.
     */
    isBackupEnabled(): Promise<boolean>;
    /**
     * Mark all tracked users as dirty.
     *
     * All users *whose device lists we are tracking* are flagged as needing a
     * key query. Users whose devices we are not tracking are ignored.
     */
    markAllTrackedUsersAsDirty(): Promise<void>;
    /**
     * Mark the request with the given request ID as sent (see
     * `outgoing_requests`).
     *
     * Arguments are:
     *
     * * `request_id` represents the unique ID of the request that was sent
     *   out. This is needed to couple the response with the now sent out
     *   request.
     * * `response_type` represents the type of the request that was sent out.
     * * `response` represents the response that was received from the server
     *   after the outgoing request was sent out.
     */
    markRequestAsSent(request_id: string, request_type: RequestType, response: string): Promise<true>;
    /**
     * Constructor will always fail. To create a new `OlmMachine`, please use
     * the `initialize` method.
     *
     * Why this pattern? `initialize` returns a `Promise`. Returning a
     * `Promise` from a constructor is not idiomatic in JavaScript.
     */
    constructor();
    /**
     * Get the outgoing requests that need to be sent out.
     *
     * This returns a list of values, each of which can be any of:
     *   * {@link KeysUploadRequest},
     *   * {@link KeysQueryRequest},
     *   * {@link KeysClaimRequest},
     *   * {@link ToDeviceRequest},
     *   * {@link SignatureUploadRequest},
     *   * {@link RoomMessageRequest}, or
     *   * {@link KeysBackupRequest}.
     *
     * Those requests need to be sent out to the server and the
     * responses need to be passed back to the state machine
     * using {@link OlmMachine.markRequestAsSent}.
     */
    outgoingRequests(): Promise<OutgoingRequest[]>;
    /**
     * Generate an "out-of-band" key query request for the given set of users.
     *
     * This can be useful if we need the results from `getIdentity` or
     * `getUserDevices` to be as up-to-date as possible.
     *
     * Returns a `KeysQueryRequest` object. The response of the request should
     * be passed to the `OlmMachine` with the `mark_request_as_sent`.
     *
     * Items inside `users` will be invalidated by this method. Be careful not
     * to use the `UserId`s after this method has been called.
     */
    queryKeysForUsers(users: UserId[]): KeysQueryRequest;
    /**
     * Import the message keys from a downloaded room key bundle.
     *
     * After {@link getReceivedRoomKeyBundleData} returns a truthy result, the
     * media file should be downloaded and then passed into this method to
     * actually do the import.
     *
     * @experimental
     */
    receiveRoomKeyBundle(bundle_data: StoredRoomKeyBundleData, encrypted_bundle: Uint8Array): Promise<undefined>;
    /**
     * Handle to-device events and one-time key counts from a sync
     * response.
     *
     * This will decrypt and handle to-device events returning the
     * decrypted versions of them.
     *
     * To decrypt an event from the room timeline call
     * `decrypt_room_event`.
     *
     * # Arguments
     *
     * * `to_device_events`: the JSON-encoded to-device evens from the `/sync`
     *   response
     * * `changed_devices`: the mapping of changed and left devices, from the
     *   `/sync` response
     * * `one_time_keys_counts`: The number of one-time keys on the server,
     *   from the `/sync` response. A `Map` from string (encryption algorithm)
     *   to number (number of keys).
     * * `unused_fallback_keys`: Optionally, a `Set` of unused fallback keys on
     *   the server, from the `/sync` response. If this is set, it is used to
     *   determine if new fallback keys should be uploaded.
     * * `decryption_settings`: Optionally, the settings to use when decrypting
     *   to-device events. If not set, to-device events will be decrypted with
     *   a {@link TrustRequirement} of `Untrusted`.
     *
     * # Returns
     *
     * A list of values, each of which can be any of:
     *   * {@link DecryptedToDeviceEvent}
     *   * {@link PlainTextToDeviceEvent}
     *   * {@link UTDToDeviceEvent}
     *   * {@link InvalidToDeviceEvent}
     */
    receiveSyncChanges(to_device_events: string, changed_devices: DeviceLists, one_time_keys_counts: Map<string, number>, unused_fallback_keys?: Set<string>, decryption_settings?: DecryptionSettings): Promise<ProcessedToDeviceEvent[]>;
    /**
     * Receive a verification event.
     *
     * This method can be used to pass verification events that are happening
     * in rooms to the `OlmMachine`. The event should be in the decrypted form.
     */
    receiveVerificationEvent(event: string, room_id: RoomId): Promise<void>;
    /**
     * Register a callback which will be called whenever there is an update to
     * a device.
     *
     * `callback` should be a function that takes a single argument (an array
     * of user IDs as strings) and returns a Promise.
     */
    registerDevicesUpdatedCallback(callback: (userIds: string[]) => Promise<void>): void;
    /**
     * Register a callback which will be called whenever a secret
     * (`m.secret.send`) is received.
     *
     * The only secret this will currently broadcast is the
     * `m.megolm_backup.v1` (the cross signing secrets are handled internally).
     *
     * To request a secret from other devices, a client sends an
     * `m.secret.request` device event with `action` set to `request` and
     * `name` set to the identifier of the secret. A device that wishes to
     * share the secret will reply with an `m.secret.send` event, encrypted
     * using olm.
     *
     * The secrets are guaranteed to have been received over a 1-to-1 encrypted
     * to_device message from a one of the user's own verified devices.
     *
     * See https://matrix-org.github.io/matrix-rust-sdk/matrix_sdk_crypto/store/struct.Store.html#method.secrets_stream for more information.
     *
     * `callback` should be a function that takes 2 arguments: the secret name
     * (string) and value (string).
     *
     * **Note**: if the secret is valid and handled on the javascript side, the
     * secret inbox should be cleared by calling
     * `delete_secrets_from_inbox`.
     */
    registerReceiveSecretCallback(callback: (name: string, value: string) => Promise<void>): void;
    /**
     * Register a callback which will be called whenever there is an update to
     * a room key.
     *
     * `callback` should be a function that takes a single argument (an array
     * of {@link RoomKeyInfo}) and returns a Promise.
     */
    registerRoomKeyUpdatedCallback(callback: (info: RoomKeyInfo[]) => Promise<void>): void;
    /**
     * Register a callback which will be called whenever we receive a
     * notification that some room keys have been withheld.
     *
     * `callback` should be a function that takes a single argument (an array
     * of {@link RoomKeyWithheldInfo}) and returns a Promise.
     */
    registerRoomKeysWithheldCallback(callback: (info: RoomKeyWithheldInfo[]) => Promise<void>): void;
    /**
     * Register a callback which will be called whenever there is an update to
     * a user identity.
     *
     * `callback` should be a function that takes a single argument (a {@link
     * UserId}) and returns a Promise.
     */
    registerUserIdentityUpdatedCallback(callback: (id: UserId) => Promise<void>): void;
    /**
     * Request missing local secrets from our other trusted devices.
     *
     * "Local secrets" refers to secrets which can be shared between trusted
     * devices, such as private cross-signing keys, and the megolm backup
     * decryption key.
     *
     * This method will cause the sdk to generated outgoing secret requests
     * (`m.secret.request`) to get the missing secrets. These requests will
     * then be returned by a future call to {@link
     * OlmMachine#outgoingRequests}.
     *
     * # Returns
     *
     * A `Promise` for a `bool` result, which will be true if  secrets were
     * missing, and a request was generated.
     */
    requestMissingSecretsIfNeeded(): Promise<boolean>;
    /**
     * Get the number of backed up room keys and the total number of room keys.
     * Returns a {@link RoomKeyCounts}.
     */
    roomKeyCounts(): Promise<RoomKeyCounts>;
    /**
     * Store the backup decryption key in the crypto store.
     *
     * This is useful if the client wants to support gossiping of the backup
     * key.
     *
     * Returns `Promise<void>`.
     */
    saveBackupDecryptionKey(decryption_key: BackupDecryptionKey, version: string): Promise<void>;
    /**
     * Record that we have downloaded all message keys for the given room.
     */
    setHasDownloadedAllRoomKeys(room_id: RoomId): Promise<void>;
    /**
     * Store encryption settings for the given room.
     *
     * This method checks if the new settings are "safe" -- ie, that they do
     * not represent a downgrade in encryption security from any previous
     * settings. Attempts to downgrade security will result in an error.
     *
     * If the settings are valid, they will be persisted to the crypto store.
     * These settings are not used directly by this library, but the saved
     * settings can be retrieved via {@link getRoomSettings}.
     */
    setRoomSettings(room_id: RoomId, room_settings: RoomSettings): Promise<void>;
    /**
     * Get to-device requests to share a room key with users in a room.
     *
     * `room_id` is the room ID. `users` is an array of `UserId`
     * objects. `encryption_settings` are an `EncryptionSettings`
     * object.
     *
     * Note: Care should be taken that only one such request at a
     * time is in flight for the same room, e.g. using a lock.
     *
     * Returns an array of `ToDeviceRequest`s.
     *
     * Items inside `users` will be invalidated by this method. Be careful not
     * to use the `UserId`s after this method has been called.
     */
    shareRoomKey(room_id: RoomId, users: UserId[], encryption_settings: EncryptionSettings): Promise<ToDeviceRequest[]>;
    /**
     * Collect the devices belonging to the given user, and send the details
     * of a room key bundle to those devices.
     *
     * Returns a list of to-device requests which must be sent.
     *
     * @experimental
     */
    shareRoomKeyBundleData(user: UserId, room: RoomId, url: string, media_encryption_info: string | null | undefined, sharing_strategy: CollectStrategy): Promise<ToDeviceRequest[]>;
    /**
     * Sign the given message using our device key and if available
     * cross-signing master key.
     */
    sign(message: string): Promise<Signatures>;
    /**
     * Store the fact that we have accepted an invitation to the given room, so
     * should accept a key bundle if one arrives soon.
     *
     * This should be called whenever we join a room following an invite, but
     * it has no effect other than that the room will be returned by a future
     * call to {@link getPendingKeyBundleDetailsForRoom}.
     *
     * @experimental
     */
    storeRoomPendingKeyBundle(room_id: RoomId, inviter: UserId): Promise<void>;
    /**
     * Get the list of users whose devices we are currently tracking.
     *
     * A user can be marked for tracking using the
     * [`update_tracked_users`](#method.update_tracked_users) method.
     *
     * Returns a `Set<UserId>`.
     */
    trackedUsers(): Promise<Set<UserId>>;
    /**
     * Update the list of tracked users.
     *
     * The OlmMachine maintains a list of users whose devices we are keeping
     * track of: these are known as "tracked users". These must be users
     * that we share a room with, so that the server sends us updates for
     * their device lists.
     *
     * # Arguments
     *
     * * `users` - An array of user ids that should be added to the list of
     *   tracked users
     *
     * Any users that hadn't been seen before will be flagged for a key query
     * immediately, and whenever `receive_sync_changes` receives a
     * "changed" notification for that user in the future.
     *
     * Users that were already in the list are unaffected.
     *
     * Items inside `users` will be invalidated by this method. Be careful not
     * to use the `UserId`s after this method has been called.
     */
    updateTrackedUsers(users: UserId[]): Promise<void>;
    /**
     * Check if the given backup has been verified by us or by another of our
     * devices that we trust.
     *
     * The `backup_info` should be a Javascript object with the following
     * format:
     *
     * ```json
     * {
     *     "algorithm": "m.megolm_backup.v1.curve25519-aes-sha2",
     *     "auth_data": {
     *         "public_key":"XjhWTCjW7l59pbfx9tlCBQolfnIQWARoKOzjTOPSlWM",
     *         "signatures": {}
     *     }
     * }
     * ```
     *
     * Returns a {@link SignatureVerification} object.
     */
    verifyBackup(backup_info: any): Promise<SignatureVerification>;
    /**
     * The time, in milliseconds since the unix epoch, at which the `Account`
     * backing this `OlmMachine` was created.
     *
     * An `Account` is created when an `OlmMachine` is first instantiated
     * against a given `Store`, at which point it creates identity keys etc.
     * This method returns the timestamp, according to the local clock, at
     * which that happened.
     */
    readonly deviceCreationTimeMs: number;
    /**
     * The unique device ID that identifies this `OlmMachine`.
     */
    readonly deviceId: DeviceId;
    /**
     * Get the display name of our own device.
     */
    readonly displayName: Promise<string | undefined>;
    /**
     * Get the public parts of our Olm identity keys.
     */
    readonly identityKeys: IdentityKeys;
    /**
     * Whether room key forwarding is enabled.
     *
     * If room key forwarding is enabled, we will automatically reply to
     * incoming `m.room_key_request` messages from verified devices by
     * forwarding the requested key (if we have it).
     */
    roomKeyForwardingEnabled: boolean;
    /**
     * Whether automatic transmission of room key requests is enabled.
     *
     * Room key requests allow the device to request room keys that it might
     * have missed in the original share using `m.room_key_request`
     * events.
     */
    roomKeyRequestsEnabled: boolean;
    /**
     * The unique user ID that owns this `OlmMachine` instance.
     */
    readonly userId: UserId;
}

/**
 * Struct representing a cross signing identity of a user.
 *
 * This is the user identity of a user that isn't our own. Other users will
 * only contain a master key and a self signing key, meaning that only device
 * signatures can be checked with this identity.
 *
 * This struct wraps a read-only version of the struct and allows verifications
 * to be requested to verify our own device with the user identity.
 */
export class OtherUserIdentity {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Was this identity verified since initial observation and is not anymore?
     *
     * Such a violation should be reported to the local user by the
     * application, and resolved by
     *
     * - Verifying the new identity with {@link requestVerification}, or:
     * - Withdrawing the verification requirement with {@link
     *   withdrawVerification}.
     */
    hasVerificationViolation(): boolean;
    /**
     * Has the identity changed in a way that requires approval from the user?
     *
     * A user identity needs approval if it changed after the crypto machine
     * has already observed ("pinned") a different identity for that user,
     * unless it is an explicitly verified identity (using for example
     * interactive verification).
     *
     * This situation can be resolved by:
     *
     * - Verifying the new identity with {@link requestVerification}, or:
     * - Updating the pin to the new identity with {@link pinCurrentMasterKey}.
     */
    identityNeedsUserApproval(): boolean;
    /**
     * Is this user identity verified?
     */
    isVerified(): boolean;
    /**
     * Pin the current identity (public part of the master signing key).
     */
    pinCurrentMasterKey(): Promise<void>;
    /**
     * Create a `VerificationRequest` object after the verification
     * request content has been sent out.
     */
    requestVerification(room_id: RoomId, request_event_id: EventId, methods?: VerificationMethod[]): VerificationRequest;
    /**
     * Send a verification request to the given user.
     *
     * The returned content needs to be sent out into a DM room with the given
     * user.
     *
     * After the content has been sent out a VerificationRequest can be started
     * with the `request_verification` method.
     */
    verificationRequestContent(methods?: VerificationMethod[]): string;
    /**
     * Manually verify this user.
     *
     * This method will attempt to sign the user identity using our private
     * cross signing key.
     *
     * This method fails if we don't have the private part of our user-signing
     * key.
     *
     * Returns a request that needs to be sent out for the user to be marked as
     * verified.
     */
    verify(): Promise<SignatureUploadRequest>;
    /**
     * True if we verified this identity (with any own identity, at any
     * point).
     *
     * To set this latch back to false, call {@link withdrawVerification}.
     */
    wasPreviouslyVerified(): boolean;
    /**
     * Remove the requirement for this identity to be verified.
     *
     * If an identity was previously verified and is not anymore it will be
     * reported to the user. In order to remove this notice users have to
     * verify again or to withdraw the verification requirement.
     */
    withdrawVerification(): Promise<void>;
    /**
     * Get the master key of the identity.
     */
    readonly masterKey: string;
    /**
     * Get the self-signing key of the identity.
     */
    readonly selfSigningKey: string;
}

/**
 * The result of an outbound ECIES channel establishment.
 */
export class OutboundCreationResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The established ECIES channel.
     */
    channel: EstablishedEcies;
    /**
     * The initial encrypted message.
     */
    initial_message: string;
}

/**
 * Struct representing a cross signing identity of a user.
 *
 * This is the user identity of a user that is our own.
 */
export class OwnUserIdentity {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Was this identity verified since initial observation and is not anymore?
     *
     * Such a violation should be reported to the local user by the
     * application, and resolved by
     *
     * - Verifying the new identity with {@link requestVerification}, or:
     * - Withdrawing the verification requirement with {@link
     *   withdrawVerification}.
     */
    hasVerificationViolation(): boolean;
    /**
     * Is this user identity verified?
     */
    isVerified(): boolean;
    /**
     * Send a verification request to our other devices.
     */
    requestVerification(methods?: VerificationMethod[]): Promise<[VerificationRequest, OutgoingVerificationRequest]>;
    /**
     * Does our user identity trust our own device, i.e. have we signed our own
     * device keys with our self-signing key?
     */
    trustsOurOwnDevice(): Promise<boolean>;
    /**
     * Mark our user identity as verified.
     *
     * This will mark the identity locally as verified and sign it with our own
     * device.
     *
     * Returns a signature upload request that needs to be sent out.
     */
    verify(): Promise<SignatureUploadRequest>;
    /**
     * True if we verified our own identity at some point in the past.
     *
     * To reset this latch back to `false`, call {@link withdrawVerification}.
     */
    wasPreviouslyVerified(): boolean;
    /**
     * Remove the requirement for this identity to be verified.
     *
     * If an identity was previously verified and is not any longer, it will be
     * reported to the user. In order to remove this notice users have to
     * verify again or to withdraw the verification requirement.
     */
    withdrawVerification(): Promise<void>;
    /**
     * Get the master key of the identity.
     */
    readonly masterKey: string;
    /**
     * Get the self-signing key of the identity.
     */
    readonly selfSigningKey: string;
    /**
     * Get the user-signing key of the identity. This is only present for our
     * own user identity.
     */
    readonly userSigningKey: string;
}

/**
 * A pickled version of an `InboundGroupSession`.
 *
 * Holds all the information that needs to be stored in a database to restore
 * an InboundGroupSession.
 */
export class PickledInboundGroupSession {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Construct a new `PickledInboundGroupSession`, with default values.
     */
    constructor();
    /**
     * Flag remembering if the session has been backed up.
     */
    backedUp: boolean;
    /**
     * Flag remembering if the session was directly sent to us by the sender
     * or if it was imported.
     */
    imported: boolean;
    /**
     * The pickle string holding the Megolm Session, as returned by
     * `olm_pickle_inbound_group_session` in libolm.
     */
    pickle: string;
    /**
     * The id of the room that the session is used in.
     *
     * Nullable so that a `PickledInboundGroupSession` can be constructed
     * incrementally. Must be populated!
     */
    get roomId(): RoomId | undefined;
    /**
     * The id of the room that the session is used in.
     *
     * Nullable so that a `PickledInboundGroupSession` can be constructed
     * incrementally. Must be populated!
     */
    set roomId(value: RoomId | null | undefined);
    /**
     * The public curve25519 key of the account that sent us the session.
     */
    senderKey: string;
    /**
     * The public ed25519 key of the account that is believed to have initiated
     * the session, if known.
     *
     * If the session was received directly from the creator via an
     * Olm-encrypted `m.room_key` event, this value is taken from the `keys`
     * property of the plaintext payload of that event (see
     * [`m.olm.v1.curve25519-aes-sha2`]).
     *
     * If the session was forwarded to us using an [`m.forwarded_room_key`],
     * this value is a copy of the `sender_claimed_ed25519_key` from the
     * content of the event.
     *
     * [`m.olm.v1.curve25519-aes-sha2`]: https://spec.matrix.org/v1.9/client-server-api/#molmv1curve25519-aes-sha2
     * [`m.forwarded_room_key`]: https://spec.matrix.org/v1.9/client-server-api/#mforwarded_room_key
     */
    get senderSigningKey(): string | undefined;
    /**
     * The public ed25519 key of the account that is believed to have initiated
     * the session, if known.
     *
     * If the session was received directly from the creator via an
     * Olm-encrypted `m.room_key` event, this value is taken from the `keys`
     * property of the plaintext payload of that event (see
     * [`m.olm.v1.curve25519-aes-sha2`]).
     *
     * If the session was forwarded to us using an [`m.forwarded_room_key`],
     * this value is a copy of the `sender_claimed_ed25519_key` from the
     * content of the event.
     *
     * [`m.olm.v1.curve25519-aes-sha2`]: https://spec.matrix.org/v1.9/client-server-api/#molmv1curve25519-aes-sha2
     * [`m.forwarded_room_key`]: https://spec.matrix.org/v1.9/client-server-api/#mforwarded_room_key
     */
    set senderSigningKey(value: string | null | undefined);
}

/**
 * A pickled version of a `Session`.
 *
 * Holds all the information that needs to be stored in a database to restore
 * an Olm Session. Can be imported into the rust store with {@link
 * Migration::migrateOlmSessions}.
 */
export class PickledSession {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Construct a new `PickledSession`, with default values.
     */
    constructor();
    /**
     * Was the session created using a fallback key?
     */
    createdUsingFallbackKey: boolean;
    /**
     * When the session was created.
     */
    creationTime: Date;
    /**
     * When the session was last used.
     */
    lastUseTime: Date;
    /**
     * The pickle string holding the Olm Session, as returned by
     * `olm_pickle_session` in libolm.
     */
    pickle: string;
    /**
     * The base64-encoded public curve25519 key of the other user that we share
     * this session with.
     */
    senderKey: string;
}

/**
 * A class representing a public-key decryption instance.
 *
 * This implements the decryption part of the
 * `m.megolm_backup.v1.curve25519-aes-sha2` algorithm described in the Matrix
 * {@link https://spec.matrix.org/v1.11/client-server-api/#backup-algorithm-mmegolm_backupv1curve25519-aes-sha2 | spec}.
 *
 * @see {@link PkEncryption}
 *
 * More details can be found in the official {@link https://docs.rs/vodozemac/latest/vodozemac/pk_encryption/ | vodozemac documentation}.
 */
export class PkDecryption {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Decrypts an encrypted message and returns the raw `Uint8Array`.
     */
    decrypt(message: PkMessage): Uint8Array;
    /**
     * Decrypts an encrypted message and returns the plaintext as a UTF-8
     * string.
     */
    decryptString(message: PkMessage): string;
    /**
     * Creates a `PkDecryption` instance from a secret key.
     */
    static fromKey(key: Curve25519SecretKey): PkDecryption;
    /**
     * Creates a new `PkDecryption` instance with a newly generated key pair.
     */
    constructor();
    /**
     * Returns the public key associated with this decryption instance.
     *
     * This can be used to construct a {@link PkEncryption} object to encrypt a
     * message for this `PkDecryption` object.
     */
    publicKey(): Curve25519PublicKey;
    /**
     * Returns the secret key associated with this `PkDecryption` instance.
     */
    secretKey(): Curve25519SecretKey;
}

/**
 * A class representing a public-key encryption instance.
 *
 * This implements the encryption part of the
 * `m.megolm_backup.v1.curve25519-aes-sha2` algorithm described in the Matrix
 * {@link https://spec.matrix.org/v1.11/client-server-api/#backup-algorithm-mmegolm_backupv1curve25519-aes-sha2 | spec}.
 *
 * @see {@link PkDecryption}
 *
 * More details can be found in the official {@link https://docs.rs/vodozemac/latest/vodozemac/pk_encryption/ | vodozemac documentation}.
 */
export class PkEncryption {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Encrypts a byte message and returns an encrypted {@link PkMessage}.
     */
    encrypt(message: Uint8Array): PkMessage;
    /**
     * Encrypts a string message and returns an encrypted {@link PkMessage}.
     */
    encryptString(message: string): PkMessage;
    /**
     * Creates a new `PkEncryption` instance from a public key.
     */
    static fromKey(public_key: Curve25519PublicKey): PkEncryption;
}

/**
 * A class representing an encrypted message using {@link PkEncryption}.
 */
export class PkMessage {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Returns the raw ciphertext as a `Uint8Array`.
     */
    ciphertext(): Uint8Array;
    /**
     * Returns the ephemeral public key used during encryption.
     */
    ephemeralKey(): Curve25519PublicKey;
    /**
     * Constructs a `PkMessage` from a base64-encoded representation.
     */
    static fromBase64(message: Base64EncodedPkMessage): PkMessage;
    /**
     * Constructs a `PkMessage` from its parts: ciphertext, MAC, and ephemeral
     * key.
     */
    static fromParts(ciphertext: Uint8Array, mac: Uint8Array, ephemeral_key: Curve25519PublicKey): PkMessage;
    /**
     * Returns the raw message authentication code (MAC) as a `Uint8Array`.
     */
    mac(): Uint8Array;
    /**
     * Converts the `PkMessage` into a base64-encoded representation.
     */
    toBase64(): Base64EncodedPkMessage;
}

/**
 * Represents a to-device event sent in the clear.
 */
export class PlainTextToDeviceEvent {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The to-device message, containing `type`, `sender` and `content` fields,
     * encoded as JSON.
     */
    readonly rawEvent: string;
    /**
     * The type of processed to-device event. Always {@link
     * ProcessedToDeviceEventType.PlainText} for this type.
     */
    readonly type: ProcessedToDeviceEventType;
}

/**
 * The type of a {@link ProcessedToDeviceEvent}.
 */
export enum ProcessedToDeviceEventType {
    /**
     * A successfully-decrypted encrypted to-device message.
     */
    Decrypted = 0,
    /**
     * An encrypted to-device message which could not be decrypted.
     */
    UnableToDecrypt = 1,
    /**
     * An unencrypted to-device message (sent in clear).
     */
    PlainText = 2,
    /**
     * An invalid to-device message that was ignored because it is missing some
     * required information to be processed (like no event `type` for
     * example)
     */
    Invalid = 3,
}

/**
 * A request that will upload a dehydrated device to the server.
 */
export class PutDehydratedDeviceRequest {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new `PutDehydratedDeviceRequest`
     */
    constructor(body: string);
    /**
     * A JSON-encoded object containing the rest of the payload: `rooms`.
     *
     * It represents the body of the HTTP request.
     */
    readonly body: string;
}

/**
 * QR code based verification.
 */
export class Qr {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Cancel the verification flow.
     *
     * Returns either an `OutgoingVerificationRequest` which should be sent
     * out, or `undefined` if the verification is already cancelled.
     */
    cancel(): OutgoingVerificationRequest | undefined;
    /**
     * Get info about the cancellation if the verification flow has
     * been cancelled.
     */
    cancelInfo(): CancelInfo | undefined;
    /**
     * Cancel the verification.
     *
     * This cancels the verification with given code (e.g. `m.user`).
     *
     * Returns either an `OutgoingVerificationRequest` which should be sent
     * out, or `undefined` if the verification is already cancelled.
     */
    cancelWithCode(code: string): OutgoingVerificationRequest | undefined;
    /**
     * Confirm that the other side has scanned our QR code.
     *
     * Returns either an `OutgoingVerificationRequest` which should be sent
     * out, or `undefined` if the verification is already confirmed.
     */
    confirmScanning(): OutgoingVerificationRequest | undefined;
    /**
     * Has the scanning of the QR code been confirmed by us?
     */
    hasBeenConfirmed(): boolean;
    /**
     * Has the QR verification been scanned by the other side.
     *
     * When the verification object is in this state it’s required
     * that the user confirms that the other side has scanned the QR
     * code.
     */
    hasBeenScanned(): boolean;
    /**
     * Has the verification flow been cancelled?
     */
    isCancelled(): boolean;
    /**
     * Has the verification flow completed?
     */
    isDone(): boolean;
    /**
     * Is this a verification that is verifying one of our own devices?
     */
    isSelfVerification(): boolean;
    /**
     * Notify the other side that we have successfully scanned the QR
     * code and that the QR verification flow can start.
     *
     * This will return some OutgoingContent if the object is in the
     * correct state to start the verification flow, otherwise None.
     */
    reciprocate(): OutgoingVerificationRequest | undefined;
    /**
     * Have we successfully scanned the QR code and are able to send
     * a reciprocation event?
     */
    reciprocated(): boolean;
    /**
     * Register a callback which will be called whenever there is an update to
     * the request
     *
     * The `callback` is called with no parameters.
     */
    registerChangesCallback(callback: () => Promise<void>): void;
    /**
     * Get the current state of this request.
     *
     * Returns a `QrState`.
     */
    state(): QrState;
    /**
     * Generate a the raw bytes that should be encoded as a QR code
     * is representing this verification flow.
     *
     * The `to_qr_code` method can be used to instead output a QrCode
     * object that can be rendered.
     */
    toBytes(): Uint8ClampedArray;
    /**
     * Generate a QR code object that is representing this
     * verification flow.
     *
     * The QrCode can then be rendered as an image or as an unicode
     * string.
     *
     * The `to_bytes` method can be used to instead output the raw
     * bytes that should be encoded as a QR code.
     *
     * Returns a `QrCode`.
     */
    toQrCode(): QrCode;
    /**
     * Did we initiate the verification request?
     */
    weStarted(): boolean;
    /**
     * Get the unique ID that identifies this QR verification flow,
     * be either a to-device request ID or a room event ID.
     */
    readonly flowId: string;
    /**
     * Get the device ID of the other side.
     */
    readonly otherDeviceId: DeviceId;
    /**
     * Get the user id of the other user that is participating in
     * this verification flow.
     */
    readonly otherUserId: UserId;
    /**
     * Get the room id if the verification is happening inside a
     * room.
     */
    readonly roomId: RoomId | undefined;
    /**
     * Get our own user ID.
     */
    readonly userId: UserId;
}

/**
 * A QR code.
 */
export class QrCode {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Render the QR code into a `Uint8ClampedArray` where 1 represents a
     * dark pixel and 0 a white pixel.
     */
    renderIntoBuffer(): Uint8ClampedArray;
}

/**
 * Data for the QR code login mechanism.
 *
 * The {@link QrCodeData} can be serialized and encoded as a QR code or it can
 * be decoded from a QR code.
 *
 * This type supports both the format originally speicied in
 * {link https://github.com/matrix-org/matrix-spec-proposals/pull/4108 MSC4108} as well as the
 * updated format found in
 * {link https://github.com/matrix-org/matrix-spec-proposals/pull/4388 MSC4388}.
 */
export class QrCodeData {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Attempt to decode a base64 encoded string into a {@link QrCodeData}
     * object.
     */
    static fromBase64(data: string): QrCodeData;
    /**
     * Attempt to decode a slice of bytes into a {@link QrCodeData} object.
     *
     * The slice of bytes would generally be returned by a QR code decoder.
     */
    static fromBytes(bytes: Uint8Array): QrCodeData;
    /**
     * Create new {@link QrCodeData} from a given public key, a rendezvous URL
     * and, optionally, a server name for the homeserver.
     *
     * If a server name is given, then the {@link QrCodeData} mode will be
     * {@link QrCodeIntent.Reciprocate}, i.e. the QR code will contain data for
     * the existing device to display the QR code.
     *
     * If no server name is given, the {@link QrCodeData} mode will be
     * {@link QrCodeIntent.Login}, i.e. the QR code will contain data for the
     * new device to display the QR code.
     */
    constructor(public_key: Curve25519PublicKey, rendezvous_url: string, server_name?: string | null);
    /**
     * Create new {@link QrCodeData} from a given public key, a rendezvous ID
     * and, a base homeserver URL.
     *
     * This creates a QR code which conforms to
     * {@link https://github.com/matrix-org/matrix-spec-proposals/pull/4388 MSC4388} of the data
     * format for QR login.
     */
    static newMsc4388(public_key: Curve25519PublicKey, rendezvous_id: string, base_url: string, intent: QrCodeIntent): QrCodeData;
    /**
     * Encode the {@link QrCodeData} into a string using base64.
     *
     * This format can be used for debugging purposes and the
     * [`QrcodeData::from_base64()`] method can be used to parse the string
     * again.
     */
    toBase64(): string;
    /**
     * Encode the {@link QrCodeData} into a list of bytes.
     *
     * The list of bytes can be used by a QR code generator to create an image
     * containing a QR code.
     */
    toBytes(): Uint8Array;
    /**
     * Get the intent-specific data embedded in the {@link QrCodeData}.
     */
    readonly intentData: QrCodeIntentData;
    /**
     * Get the mode of this {@link QrCodeData} instance.
     */
    readonly mode: QrCodeIntent;
    /**
     * Get the Curve25519 public key embedded in the {@link QrCodeData}.
     *
     * This Curve25519 public key should be used to establish an
     * [HPKE](https://www.rfc-editor.org/rfc/rfc9180.html)
     * (Hybrid Public Key Encryption) channel with the other device.
     */
    readonly publicKey: Curve25519PublicKey;
    /**
     * Get the URL of the rendezvous server which will be used to exchange
     * messages between the two devices.
     */
    readonly rendezvousUrl: string | undefined;
    /**
     * Get the server name of the homeserver which the new device will be
     * logged in to.
     *
     * This will be only available if the existing device has generated the QR
     * code and the new device is the one scanning the QR code.
     */
    readonly serverName: string | undefined;
}

/**
 * The mode of the QR code login.
 *
 * The QR code login mechanism supports both, the new device, as well as the
 * existing device to display the QR code.
 *
 * The different modes have an explicit one-byte identifier which gets added to
 * the QR code data.
 */
export enum QrCodeIntent {
    /**
     * The new device is displaying the QR code.
     */
    Login = 0,
    /**
     * The existing device is displaying the QR code.
     */
    Reciprocate = 1,
}

/**
 * Intent and MSC-specific data class for the QR code login support.
 */
export class QrCodeIntentData {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The MSC4108-specific intent data.
     *
     * This will not be `null` only if the {@link QrCodeData} contains data as
     * specified in the QR code format of MSC4108. Otherwise it will contain
     * MSC4388-specific intent data.
     */
    get msc4108(): Msc4108IntentData | undefined;
    /**
     * The MSC4108-specific intent data.
     *
     * This will not be `null` only if the {@link QrCodeData} contains data as
     * specified in the QR code format of MSC4108. Otherwise it will contain
     * MSC4388-specific intent data.
     */
    set msc4108(value: Msc4108IntentData | null | undefined);
    /**
     * The MSC4833-specific intent data.
     *
     * This will not be `null` only if the {@link QrCodeData} contains data as
     * specified in the QR code format of MSC4388. Otherwise it will contain
     * MSC4108-specific intent data.
     */
    get msc4388(): Msc4388IntentData | undefined;
    /**
     * The MSC4833-specific intent data.
     *
     * This will not be `null` only if the {@link QrCodeData} contains data as
     * specified in the QR code format of MSC4388. Otherwise it will contain
     * MSC4108-specific intent data.
     */
    set msc4388(value: Msc4388IntentData | null | undefined);
}

/**
 * A scanned QR code.
 */
export class QrCodeScan {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Parse the decoded payload of a QR code in byte slice form.
     *
     * This method is useful if you would like to do your own custom QR code
     * decoding.
     */
    static fromBytes(buffer: Uint8ClampedArray): QrCodeScan;
}

/**
 * List of `Qr` states
 */
export enum QrState {
    /**
     * We have received the other device's details (from the
     * `m.key.verification.request` or `m.key.verification.ready`) and
     * established the shared secret, so can
     * display the QR code.
     */
    Created = 0,
    /**
     * The other side has scanned our QR code and sent an
     * `m.key.verification.start` message with `method: m.reciprocate.v1` with
     * matching shared secret.
     */
    Scanned = 1,
    /**
     * Our user has confirmed that the other device scanned successfully. We
     * have sent an `m.key.verification.done`.
     */
    Confirmed = 2,
    /**
     * We have scanned the other side's QR code and are able to send a
     * `m.key.verification.start` message with `method: m.reciprocate.v1`.
     *
     * Call `Qr::reciprocate` to build the start message.
     *
     * Note that, despite the name of this state, we have not necessarily
     * yet sent the `m.reciprocate.v1` message.
     */
    Reciprocated = 3,
    /**
     * Verification complete: we have received an `m.key.verification.done`
     * from the other side.
     */
    Done = 4,
    /**
     * Verification cancelled or failed.
     */
    Cancelled = 5,
}

/**
 * A rehydrated device
 *
 * This device can receive to-device events to get room keys that were send to
 * it.
 */
export class RehydratedDevice {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Receive the to-device events that sent to the dehydrated device
     *
     * The rehydrated device will decrypt the events and pass the room keys
     * into the `OlmMachine`.
     *
     * # Arguments
     *
     * * `to_device_events` is a JSON-encoded result of the `events` array from
     *   `/dehydrated_device/{device_id}/events`.
     * * `decryption_settings`: Optionally, the settings to use when decrypting
     *   to-device events. If not set, to-device events will be decrypted with
     *   a {@link TrustRequirement} of `Untrusted`.
     *
     * Returns an array of `RoomKeyInfo`, indicating the room keys that were
     * received.
     */
    receiveEvents(to_device_events: string, decryption_settings?: DecryptionSettings | null): Promise<Promise<RoomKeyInfo[]>>;
}

/**
 * Represent the type of a request.
 */
export enum RequestType {
    /**
     * Represents a `KeysUploadRequest`.
     */
    KeysUpload = 0,
    /**
     * Represents a `KeysQueryRequest`.
     */
    KeysQuery = 1,
    /**
     * Represents a `KeysClaimRequest`.
     */
    KeysClaim = 2,
    /**
     * Represents a `ToDeviceRequest`.
     */
    ToDevice = 3,
    /**
     * Represents a `SignatureUploadRequest`.
     */
    SignatureUpload = 4,
    /**
     * Represents a `RoomMessageRequest`.
     */
    RoomMessage = 5,
    /**
     * Represents a `KeysBackupRequest`.
     */
    KeysBackup = 6,
}

/**
 * A Matrix [room ID].
 *
 * [room ID]: https://spec.matrix.org/v1.2/appendices/#room-ids-and-event-ids
 */
export class RoomId {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Parse/validate and create a new `RoomId`.
     */
    constructor(id: string);
    /**
     * Return the room ID as a string.
     */
    toString(): string;
}

/**
 * Struct holding the number of room keys we have.
 */
export class RoomKeyCounts {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The number of backed up room keys.
     */
    backedUp: number;
    /**
     * The total number of room keys.
     */
    total: number;
}

/**
 * The result of a call to {@link OlmMachine.importExportedRoomKeys} or
 * {@link OlmMachine.importBackedUpRoomKeys}.
 */
export class RoomKeyImportResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The keys that were imported.
     *
     * A Map from room id to a Map of the sender key to a Set of session ids.
     *
     * Typescript type: `Map<string, Map<string, Set<string>>`.
     */
    keys(): Map<string, Map<string, Set<string>>>;
    /**
     * The number of room keys that were imported.
     */
    readonly importedCount: number;
    /**
     * The total number of room keys that were found in the export.
     */
    readonly totalCount: number;
}

/**
 * Information on a room key that has been received or imported.
 */
export class RoomKeyInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The {@link EncryptionAlgorithm} that this key is used for. Will be one
     * of the `m.megolm.*` algorithms.
     */
    readonly algorithm: EncryptionAlgorithm;
    /**
     * The room where the key is used.
     */
    readonly roomId: RoomId;
    /**
     * The Curve25519 key of the device which initiated the session originally.
     */
    readonly senderKey: Curve25519PublicKey;
    /**
     * The ID of the session that the key is for.
     */
    readonly sessionId: string;
}

/**
 * Information on a received `m.room_key.withheld` event.
 */
export class RoomKeyWithheldInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The encryption algorithm of the session that is being withheld.
     *
     * This may be from an `m.room_key.withheld` event, or from a shared room
     * key bundle under MSC4268.
     */
    readonly algorithm: EncryptionAlgorithm;
    /**
     * The room ID of the session that is being withheld.
     */
    readonly roomId: RoomId;
    /**
     * The User ID of the sender of the withheld information.
     *
     * This may be the sender of an `m.room_key.withheld` event, or the sender
     * of a shared room key bundle under MSC4268.
     */
    readonly sender: UserId;
    /**
     * The session ID of the session that is being withheld.
     */
    readonly sessionId: string;
    /**
     * The `code` indicating why the key was withheld, such as `m.unverified`.
     *
     * This may be from an `m.room_key.withheld` event (such as
     * `m.unverified`), or from a shared room key bundle under MSC4268.
     */
    readonly withheldCode: string;
}

/**
 * A customized owned request type for sending out room messages
 * ([specification]).
 *
 * [specification]: https://spec.matrix.org/unstable/client-server-api/#put_matrixclientv3roomsroomidsendeventtypetxnid
 */
export class RoomMessageRequest {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new `RoomMessageRequest`.
     */
    constructor(id: string, room_id: string, txn_id: string, event_type: string, content: string);
    /**
     * A JSON-encoded object containing the message's content.
     */
    readonly body: string;
    /**
     * A string representing the type of event to be sent.
     */
    readonly event_type: string;
    /**
     * The request ID.
     */
    readonly id: string;
    /**
     * A string representing the room to send the event to.
     */
    readonly room_id: string;
    /**
     * A string representing the transaction ID for this event.
     *
     * Clients should generate an ID unique across requests with the same
     * access token; it will be used by the server to ensure idempotency of
     * requests.
     */
    readonly txn_id: string;
    /**
     * Get its request type.
     */
    readonly type: RequestType;
}

/**
 * Information on a room which is waiting for a key bundle to arrive.
 */
export class RoomPendingKeyBundleDetails {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The time that the invite was accepted.
     */
    readonly inviteAcceptedAtMillis: number;
    /**
     * The ID of the user that invited us
     */
    readonly inviterId: UserId;
    /**
     * The room that is waiting for a key bundle.
     */
    readonly roomId: RoomId;
}

/**
 * Room encryption settings which are modified by state events or user options
 */
export class RoomSettings {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new `RoomSettings` with default values.
     */
    constructor();
    /**
     * The encryption algorithm that should be used in the room.
     *
     * Should be one of the members of {@link EncryptionAlgorithm}.
     */
    algorithm: EncryptionAlgorithm;
    /**
     * Whether state event encryption is enabled.
     */
    encryptStateEvents: boolean;
    /**
     * Whether untrusted devices should receive room keys. If this is `false`,
     * they will be excluded from the conversation.
     */
    onlyAllowTrustedDevices: boolean;
    /**
     * The maximum number of messages an encryption session should be used for,
     * before it is rotated.
     */
    get sessionRotationPeriodMessages(): number | undefined;
    /**
     * The maximum number of messages an encryption session should be used for,
     * before it is rotated.
     */
    set sessionRotationPeriodMessages(value: number | null | undefined);
    /**
     * The maximum time, in milliseconds, that an encryption session should be
     * used for, before it is rotated.
     */
    get sessionRotationPeriodMs(): number | undefined;
    /**
     * The maximum time, in milliseconds, that an encryption session should be
     * used for, before it is rotated.
     */
    set sessionRotationPeriodMs(value: number | null | undefined);
}

/**
 * Short Authentication String (SAS) verification.
 */
export class Sas {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Accept the SAS verification.
     *
     * This does nothing (and returns `undefined`) if the verification was
     * already accepted, otherwise it returns an `OutgoingVerificationRequest`
     * that needs to be sent out.
     */
    accept(): OutgoingVerificationRequest | undefined;
    /**
     * Are we in a state where we can show the short auth string?
     */
    canBePresented(): boolean;
    /**
     * Cancel the verification.
     *
     * Returns either an `OutgoingVerificationRequest` which should be sent
     * out, or `undefined` if the verification is already cancelled.
     */
    cancel(): OutgoingVerificationRequest | undefined;
    /**
     * Get info about the cancellation if the verification flow has
     * been cancelled.
     */
    cancelInfo(): CancelInfo | undefined;
    /**
     * Cancel the verification.
     *
     * This cancels the verification with given code (e.g. `m.user`).
     *
     * Returns either an `OutgoingVerificationRequest` which should be sent
     * out, or `undefined` if the verification is already cancelled.
     */
    cancelWithCode(code: string): OutgoingVerificationRequest | undefined;
    /**
     * Confirm the SAS verification.
     *
     * This confirms that the short auth strings match on both sides.
     *
     * Does nothing if we’re not in a state where we can confirm the
     * short auth string.
     *
     * Returns a `Promise` for an array of `OutgoingVerificationRequest`s.
     */
    confirm(): Promise<OutgoingVerificationRequest[]>;
    /**
     * Get the decimal version of the short auth string.
     *
     * Returns None if we can’t yet present the short auth string,
     * otherwise a tuple containing three 4-digit integers that
     * represent the short auth string.
     */
    decimals(): Uint16Array | undefined;
    /**
     * Get the emoji version of the short auth string.
     *
     * Returns `undefined` if we can't yet present the short auth string,
     * otherwise an array of seven `Emoji` objects.
     */
    emoji(): Emoji[] | undefined;
    /**
     * Get the index of the emoji representing the short auth string
     *
     * Returns `undefined` if we can’t yet present the short auth
     * string, otherwise seven `u8` numbers in the range from 0 to 63
     * inclusive which can be converted to an emoji using [the
     * relevant specification
     * entry](https://spec.matrix.org/unstable/client-server-api/#sas-method-emoji).
     */
    emojiIndex(): Uint8Array | undefined;
    /**
     * Has the verification been accepted by both parties?
     */
    hasBeenAccepted(): boolean;
    /**
     * Have we confirmed that the short auth string matches?
     */
    haveWeConfirmed(): boolean;
    /**
     * Is the SAS flow cancelled?
     */
    isCancelled(): boolean;
    /**
     * Is the SAS flow done?
     */
    isDone(): boolean;
    /**
     * Is this a verification that is verifying one of our own
     * devices?
     */
    isSelfVerification(): boolean;
    /**
     * Register a callback which will be called whenever there is an update to
     * the request.
     *
     * The `callback` is called with no parameters.
     */
    registerChangesCallback(callback: () => Promise<void>): void;
    /**
     * Did this verification flow start from a verification request?
     */
    startedFromRequest(): boolean;
    /**
     * Does this verification flow support displaying emoji for the
     * short authentication string?
     */
    supportsEmoji(): boolean;
    /**
     * Has the SAS verification flow timed out?
     */
    timedOut(): boolean;
    /**
     * True if we initiated the verification flow (ie, we sent the
     * `m.key.verification.request`).
     */
    weStarted(): boolean;
    /**
     * Get our own device ID.
     */
    readonly deviceId: DeviceId;
    /**
     * Get the unique ID that identifies this SAS verification flow,
     * be either a to-device request ID or a room event ID.
     */
    readonly flowId: string;
    /**
     * Get the device ID of the other side.
     */
    readonly otherDeviceId: DeviceId;
    /**
     * Get the user id of the other side.
     */
    readonly otherUserId: UserId;
    /**
     * Get the room ID if the verification is happening inside a
     * room.
     */
    readonly roomId: RoomId | undefined;
    /**
     * Get our own user ID.
     */
    readonly userId: UserId;
}

/**
 * Struct containing the bundle of secrets to fully activate a new device for
 * end-to-end encryption.
 */
export class SecretsBundle {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Deserialize the [`SecretsBundle`] from a JSON object.
     */
    static from_json(json: unknown): SecretsBundle;
    /**
     * Serialize the [`SecretsBundle`] to a JSON object.
     */
    to_json(): unknown;
    /**
     * The bundle of the backup decryption key and backup version if any.
     */
    readonly backupBundle: BackupSecretsBundle | undefined;
    /**
     * The seed of the master key encoded as unpadded base64.
     */
    readonly masterKey: string;
    /**
     * The seed of the self signing key encoded as unpadded base64.
     */
    readonly selfSigningKey: string;
    /**
     * The seed of the user signing key encoded as unpadded base64.
     */
    readonly userSigningKey: string;
}

/**
 * A Matrix-spec compliant [server name].
 *
 * It consists of a host and an optional port (separated by a colon if
 * present).
 *
 * [server name]: https://spec.matrix.org/v1.2/appendices/#server-name
 */
export class ServerName {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Returns true if and only if the server name is an IPv4 or IPv6
     * address.
     */
    isIpLiteral(): boolean;
    /**
     * Parse/validate and create a new `ServerName`.
     */
    constructor(name: string);
    /**
     * Returns the host of the server name.
     *
     * That is: Return the part of the server before `:<port>` or the
     * full server name if there is no port.
     */
    readonly host: string;
    /**
     * Returns the port of the server name if any.
     */
    readonly port: number | undefined;
}

/**
 * Take a look at [`matrix_sdk_common::deserialized_responses::ShieldState`]
 * for more info.
 */
export enum ShieldColor {
    /**
     * Important warning
     */
    Red = 0,
    /**
     * Low warning
     */
    Grey = 1,
    /**
     * No warning
     */
    None = 2,
}

/**
 * Take a look at [`matrix_sdk_common::deserialized_responses::ShieldState`]
 * for more info.
 */
export class ShieldState {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * A machine-readable representation of the authenticity for a
     * `ShieldState`.
     */
    get code(): ShieldStateCode | undefined;
    /**
     * A machine-readable representation of the authenticity for a
     * `ShieldState`.
     */
    set code(value: ShieldStateCode | null | undefined);
    /**
     * The shield color
     */
    color: ShieldColor;
    /**
     * Error message that can be displayed as a tooltip
     */
    readonly message: string | undefined;
}

/**
 * A machine-readable representation of the authenticity for a `ShieldState`.
 */
export enum ShieldStateCode {
    /**
     * Not enough information available to check the authenticity.
     */
    AuthenticityNotGuaranteed = 0,
    /**
     * The sending device isn't yet known by the Client.
     */
    UnknownDevice = 1,
    /**
     * The sending device hasn't been verified by the sender.
     */
    UnsignedDevice = 2,
    /**
     * The sender hasn't been verified by the Client's user.
     */
    UnverifiedIdentity = 3,
    /**
     * The sender was previously verified but changed their identity.
     */
    VerificationViolation = 4,
    /**
     * The `sender` field on the event does not match the owner of the device
     * that established the Megolm session.
     */
    MismatchedSender = 5,
}

/**
 * Represents a potentially decoded signature (but not a validated
 * one).
 */
export class Signature {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Convert the signature to a base64 encoded string.
     */
    toBase64(): string;
    /**
     * Get the Ed25519 signature, if this is one.
     */
    readonly ed25519: Ed25519Signature | undefined;
}

/**
 * The result of a signature check.
 */
export enum SignatureState {
    /**
     * The signature is missing.
     */
    Missing = 0,
    /**
     * The signature is invalid.
     */
    Invalid = 1,
    /**
     * The signature is valid but the device or user identity that created the
     * signature is not trusted.
     */
    ValidButNotTrusted = 2,
    /**
     * The signature is valid and the device or user identity that created the
     * signature is trusted.
     */
    ValidAndTrusted = 3,
}

/**
 * Data for a request to the `/keys/signatures/upload` API endpoint
 * ([specification]).
 *
 * Publishes cross-signing signatures for the user.
 *
 * [specification]: https://spec.matrix.org/unstable/client-server-api/#post_matrixclientv3keyssignaturesupload
 */
export class SignatureUploadRequest {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new `SignatureUploadRequest`.
     */
    constructor(id: string, signed_keys: string);
    /**
     * A JSON-encoded object containing the payload of the request
     *
     * It represents the body of the HTTP request.
     */
    readonly body: string;
    /**
     * The request ID.
     * Some signature upload will have to an `id` field, some won't.
     * They have one when they are created automatically during an interactive
     * verification, otherwise they don't.
     */
    readonly id: string | undefined;
    /**
     * Get its request type.
     */
    readonly type: RequestType;
}

/**
 * The result of a signature verification of a signed JSON object.
 */
export class SignatureVerification {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Is the result considered to be trusted?
     *
     * This tells us if the result has a valid signature from any of the
     * following:
     *
     * * Our own device
     * * Our own user identity, provided the identity is trusted as well
     * * Any of our own devices, provided the device is trusted as well
     */
    trusted(): boolean;
    /**
     * Give the backup signature state from the current device.
     * See SignatureState for values
     */
    readonly deviceState: SignatureState;
    /**
     * Give the backup signature state from the current user identity.
     * See SignatureState for values
     */
    readonly userState: SignatureState;
}

/**
 * A collection of `Signature`.
 */
export class Signatures {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Add the given signature from the given signer and the given key ID to
     * the collection.
     */
    addSignature(signer: UserId, key_id: DeviceKeyId, signature: Ed25519Signature): MaybeSignature | undefined;
    /**
     * Get the json with all signatures
     */
    asJSON(): string;
    /**
     * Remove all the signatures we currently hold.
     */
    clear(): void;
    /**
     * Get the map of signatures that belong to the given user.
     */
    get(signer: UserId): Map<string, MaybeSignature> | undefined;
    /**
     * Try to find an Ed25519 signature from the given signer with
     * the given key ID.
     */
    getSignature(signer: UserId, key_id: DeviceKeyId): Ed25519Signature | undefined;
    /**
     * Do we hold any signatures or is our collection completely
     * empty.
     */
    isEmpty(): boolean;
    /**
     * Creates a new, empty, signatures collection.
     */
    constructor();
    /**
     * How many signatures do we currently hold.
     */
    readonly count: number;
}

/**
 * A struct containing an open connection to a CryptoStore.
 *
 * Opening the CryptoStore can take some time, due to the PBKDF calculation
 * involved, so if multiple operations are being done on the same store, it is
 * more efficient to open it once.
 */
export class StoreHandle {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Open a crypto store.
     *
     * The created store will be based on IndexedDB if a `store_name` is
     * provided; otherwise it will be based on a memory store and once the
     * objects is dropped, the keys will be lost.
     *
     * # Arguments
     *
     * * `store_name` - The name that should be used to open the IndexedDB
     *   based database. If this isn't provided, a memory-only store will be
     *   used. *Note* the memory-only store will lose your E2EE keys when the
     *   `StoreHandle` gets dropped.
     *
     * * `store_passphrase` - The passphrase that should be used to encrypt the
     *   store, for IndexedDB-based stores
     *
     * * `logger` - An optional logger instance to use for writing log messages
     *   during the open operation. An instance of `JsLogger`.
     */
    static open(store_name: string | null | undefined, store_passphrase: string | null | undefined, logger?: JsLogger): Promise<StoreHandle>;
    /**
     * Open a crypto store based on IndexedDB, using the given key for
     * encryption.
     *
     * # Arguments
     *
     * * `store_name` - The name that should be used to open the IndexedDB
     *   based database.
     *
     * * `store_key` - The key that should be used to encrypt the store, for
     *   IndexedDB-based stores. Must be a 32-byte array.
     *
     * * `logger` - An optional logger instance to use for writing log messages
     *   during the open operation. An instance of `JsLogger`.
     */
    static openWithKey(store_name: string, store_key: Uint8Array, logger?: JsLogger): Promise<StoreHandle>;
}

/**
 * Information on a stored room key bundle data event.
 */
export class StoredRoomKeyBundleData {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The JSON-encoded encryption info for the key bundle.
     *
     * @deprecated Should not be used within applications.
     */
    readonly encryptionInfo: string;
    /**
     * The room that these keys are for.
     */
    readonly roomId: RoomId;
    /**
     * The user that sent us this data.
     */
    readonly senderUser: UserId;
    /**
     * The location of the bundle.
     */
    readonly url: string;
}

/**
 * Struct containing information on how a to-device message was decrypted.
 */
export class ToDeviceEncryptionInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Returns whether the sender device is in a verified state.
     * This reflects the state at the time of decryption.
     */
    isSenderVerified(): boolean;
    /**
     * The base64-encoded public Curve25519 key of the device that encrypted
     * the message.
     */
    senderCurve25519Key: string;
    /**
     * The device ID of the device that sent us the to-device message.
     *
     * Could be `undefined` in the case where the to-device message sender
     * checks are delayed. There is no delay for to-device messages other
     * than `m.room_key`, so this will always be truthy for other
     * message types (the decryption would fail if the sender device keys
     * cannot be found).
     *
     * Note this is untrusted data unless {@link isSenderVerified} is true.
     */
    get senderDevice(): DeviceId | undefined;
    /**
     * The device ID of the device that sent us the to-device message.
     *
     * Could be `undefined` in the case where the to-device message sender
     * checks are delayed. There is no delay for to-device messages other
     * than `m.room_key`, so this will always be truthy for other
     * message types (the decryption would fail if the sender device keys
     * cannot be found).
     *
     * Note this is untrusted data unless {@link isSenderVerified} is true.
     */
    set senderDevice(value: DeviceId | null | undefined);
    /**
     * The user ID of the sender of the event.
     *
     * Note this is untrusted data unless {@link isSenderVerified} is true.
     */
    sender: UserId;
}

/**
 * Data for a request to the `/sendToDevice` API endpoint
 * ([specification]).
 *
 * Send an event to a single device or to a group of devices.
 *
 * [specification]: https://spec.matrix.org/unstable/client-server-api/#put_matrixclientv3sendtodeviceeventtypetxnid
 */
export class ToDeviceRequest {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new `ToDeviceRequest`.
     */
    constructor(id: string, event_type: string, txn_id: string, body: string);
    /**
     * A JSON-encoded object containing the rest of the payload: `messages`.
     *
     * It represents the body of the HTTP request.
     */
    readonly body: string;
    /**
     * A string representing the type of event being sent to each devices.
     */
    readonly event_type: string;
    /**
     * The request ID.
     * For to-device request this would be the same value as `txn_id`. It is
     * exposed also as `id` so that the js bindings are consistent with the
     * other request types by using this field to mark as sent.
     */
    readonly id: string;
    /**
     * A string representing a request identifier unique to the access token
     * used to send the request.
     */
    readonly txn_id: string;
    /**
     * Get its request type.
     */
    readonly type: RequestType;
}

/**
 * Metadata about a to-device event that could not be decrypted.
 */
export class ToDeviceUnableToDecryptInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Reason code for the decryption failure
     */
    reason: ToDeviceUnableToDecryptReason;
}

/**
 * Reason code for a to-device decryption failure
 */
export enum ToDeviceUnableToDecryptReason {
    /**
     * An error occurred while encrypting the event. This covers all
     * `OlmError` types.
     */
    DecryptionFailure = 0,
    /**
     * We refused to decrypt the message because the sender's device is not
     * verified, or more generally, the sender's identity did not match the
     * trust requirement we were asked to provide.
     */
    UnverifiedSenderDevice = 1,
    /**
     * We have no `OlmMachine`. This should not happen unless we forget to set
     * things up by calling `OlmMachine::activate()`.
     */
    NoOlmMachine = 2,
    /**
     * The Matrix SDK was compiled without encryption support.
     */
    EncryptionIsDisabled = 3,
}

/**
 * Type to install and to manipulate the tracing layer.
 */
export class Tracing {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Check whether the `tracing` feature has been enabled.
     *
     * @deprecated: `tracing` is now always enabled.
     */
    static isAvailable(): boolean;
    /**
     * Install the tracing layer.
     */
    constructor(min_level: LoggerLevel);
    /**
     * Turn the logger off, i.e. it no longer emits logs.
     */
    turnOff(): void;
    /**
     * Turn the logger on, i.e. it emits logs again if it was turned
     * off.
     */
    turnOn(): void;
    /**
     * Re-define the minimum logger level.
     */
    set minLevel(value: LoggerLevel);
}

/**
 * The trust level required to decrypt an event
 */
export enum TrustRequirement {
    /**
     * Decrypt events from everyone regardless of trust
     */
    Untrusted = 0,
    /**
     * Only decrypt events from cross-signed or legacy devices
     */
    CrossSignedOrLegacy = 1,
    /**
     * Only decrypt events from cross-signed devices
     */
    CrossSigned = 2,
}

/**
 * Represents an encrypted to-device event that could not be decrypted.
 */
export class UTDToDeviceEvent {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The original message (of type `m.room.encrypted`) that failed to be
     * decrypted, encoded as JSON.
     */
    readonly rawEvent: string;
    /**
     * Information on the reason we failed to decrypt
     */
    readonly utdInfo: ToDeviceUnableToDecryptInfo;
    /**
     * The type of processed to-device event. Always {@link
     * ProcessedToDeviceEventType.UnableToDecrypt} for this type.
     */
    readonly type: ProcessedToDeviceEventType;
}

/**
 * Other Requests *
 * Request that will publish a cross signing identity.
 *
 * This uploads the public cross signing key triplet.
 */
export class UploadSigningKeysRequest {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a new `UploadSigningKeysRequest`.
     */
    constructor(body: string);
    /**
     * A JSON-encoded object containing the rest of the payload: `master_key`,
     * `self_signing_key`, `user_signing_key`.
     *
     * It represents the body of the HTTP request.
     */
    readonly body: string;
}

/**
 * A read only view over all devices belonging to a user.
 */
export class UserDevices {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Iterator over all the devices of the user devices.
     */
    devices(): Device[];
    /**
     * Get the specific device with the given device ID.
     */
    get(device_id: DeviceId): Device | undefined;
    /**
     * Returns true if there is at least one devices of this user
     * that is considered to be verified, false otherwise.
     *
     * This won't consider your own device as verified, as your own
     * device is always implicitly verified.
     */
    isAnyVerified(): boolean;
    /**
     * Array over all the device IDs of the user devices.
     */
    keys(): DeviceId[];
}

/**
 * A Matrix [user ID].
 *
 * [user ID]: https://spec.matrix.org/v1.2/appendices/#user-identifiers
 */
export class UserId {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a clone of this `UserId`.
     *
     * This can be useful when passing a `UserId` instance to methods such as
     * {@link OlmMachine.updateTrackedUsers} which destroy the instance.
     */
    clone(): UserId;
    /**
     * Whether this user ID is a historical one.
     *
     * A historical user ID is one that doesn't conform to the latest
     * specification of the user ID grammar but is still accepted
     * because it was previously allowed.
     */
    isHistorical(): boolean;
    /**
     * Parse/validate and create a new `UserId`.
     */
    constructor(id: string);
    /**
     * Return the user ID as a string.
     */
    toString(): string;
    /**
     * Returns the user's localpart.
     */
    readonly localpart: string;
    /**
     * Returns the server name of the user ID.
     */
    readonly serverName: ServerName;
}

/**
 * List of available verification methods.
 */
export enum VerificationMethod {
    /**
     * The `m.sas.v1` verification method.
     *
     * SAS means Short Authentication String.
     */
    SasV1 = 0,
    /**
     * The `m.qr_code.scan.v1` verification method.
     */
    QrCodeScanV1 = 1,
    /**
     * The `m.qr_code.show.v1` verification method.
     */
    QrCodeShowV1 = 2,
    /**
     * The `m.reciprocate.v1` verification method.
     */
    ReciprocateV1 = 3,
}

/**
 * An object controlling key verification requests.
 *
 * Interactive verification flows usually start with a verification
 * request, this object lets you send and reply to such a
 * verification request.
 *
 * After the initial handshake the verification flow transitions into
 * one of the verification methods.
 */
export class VerificationRequest {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Accept the verification request.
     *
     * This method will accept the request and signal that it
     * supports the `m.sas.v1`, the `m.qr_code.show.v1`, and
     * `m.reciprocate.v1` method.
     *
     * `m.qr_code.show.v1` will only be signaled if the `qrcode`
     * feature is enabled. This feature is disabled by default. If
     * it's enabled and QR code scanning should be supported or QR
     * code showing shouldn't be supported the `accept_with_methods`
     * method should be used instead.
     *
     * It returns either a `ToDeviceRequest`, a `RoomMessageRequest`
     * or `undefined`.
     */
    accept(): OutgoingVerificationRequest | undefined;
    /**
     * Accept the verification request signaling that our client
     * supports the given verification methods.
     *
     * `methods` represents the methods that we should advertise as
     * supported by us.
     *
     * It returns either a `ToDeviceRequest`, a `RoomMessageRequest`
     * or `undefined`.
     */
    acceptWithMethods(methods: VerificationMethod[]): OutgoingVerificationRequest | undefined;
    /**
     * Cancel the verification request.
     *
     * It returns either a `ToDeviceRequest`, a `RoomMessageRequest`
     * or `undefined`.
     */
    cancel(): OutgoingVerificationRequest | undefined;
    /**
     * Generate a QR code that can be used by another client to start
     * a QR code based verification.
     *
     * Returns a `Qr` or `undefined`.
     */
    generateQrCode(): Promise<Qr | undefined>;
    /**
     * If this request has transitioned into a concrete verification
     * flow (and not yet been completed or cancelled), returns a `Verification`
     * object.
     *
     * Returns: a `Sas`, a `Qr`, or `undefined`.
     */
    getVerification(): Sas | Qr | undefined;
    /**
     * Has the verification flow that was started with this request
     * been cancelled?
     */
    isCancelled(): boolean;
    /**
     * Has the verification flow that was started with this request
     * finished?
     */
    isDone(): boolean;
    /**
     * Has the verification request been answered by another device?
     */
    isPassive(): boolean;
    /**
     * Is the verification request ready to start a verification flow?
     */
    isReady(): boolean;
    /**
     * Is this a verification that is verifying one of our own
     * devices?
     */
    isSelfVerification(): boolean;
    /**
     * Get the current phase of this request.
     *
     * Returns a `VerificationRequestPhase`.
     */
    phase(): VerificationRequestPhase;
    /**
     * Register a callback which will be called whenever there is an update to
     * the request.
     *
     * The `callback` is called with no parameters.
     */
    registerChangesCallback(callback: () => Promise<void>): void;
    /**
     * Create an event content that can be sent as a room event to
     * request verification from the other side. This should be used
     * only for verifications of other users and it should be sent to
     * a room we consider to be a DM with the other user.
     */
    static request(own_user_id: UserId, own_device_id: DeviceId, other_user_id: UserId, methods?: VerificationMethod[]): string;
    /**
     * Start a QR code verification by providing a scanned QR code
     * for this verification flow.
     */
    scanQrCode(data: QrCodeScan): Promise<Qr>;
    /**
     * Transition from this verification request into a SAS verification flow.
     *
     * Returns `Promise<[Sas, OutgoingVerificationRequest] | undefined>`
     */
    startSas(): Promise<[Sas, OutgoingVerificationRequest] | undefined>;
    /**
     * The number of milliseconds remaining before this verification flow times
     * out.
     *
     * Returns zero if the time has already passed.
     */
    timeRemainingMillis(): number;
    /**
     * Has the verification flow timed out?
     */
    timedOut(): boolean;
    /**
     * Did we initiate the verification request?
     */
    weStarted(): boolean;
    /**
     * Get info about the cancellation if the verification request
     * has been cancelled.
     */
    readonly cancelInfo: CancelInfo | undefined;
    /**
     * Get the unique ID of this verification request.
     */
    readonly flowId: string;
    /**
     * The ID of the other device that is participating in this
     * verification.
     */
    readonly otherDeviceId: DeviceId | undefined;
    /**
     * The ID of the other user that is participating in this
     * verification request.
     */
    readonly otherUserId: UserId;
    /**
     * Get our own supported verification methods that we advertised.
     *
     * Will be present only we requested the verification or if we’re
     * in the ready state.
     */
    readonly ourSupportedMethods: VerificationMethod[] | undefined;
    /**
     * Our own user id.
     */
    readonly ownUserId: UserId;
    /**
     * Get the room ID if the verification is happening inside a
     * room.
     */
    readonly roomId: RoomId | undefined;
    /**
     * Get the supported verification methods of the other side.
     *
     * Will be present only if the other side requested the
     * verification or if we’re in the ready state.
     *
     * # Returns
     *
     * `undefined` if we do not yet know the supported methods; otherwise, an
     * array of `VerificationMethod`s.
     */
    readonly theirSupportedMethods: VerificationMethod[] | undefined;
}

/**
 * List of VerificationRequestState phases
 */
export enum VerificationRequestPhase {
    /**
     * The verification request has been newly created by us.
     */
    Created = 0,
    /**
     * The verification request was received from the other party.
     */
    Requested = 1,
    /**
     * The verification request is ready to start a verification flow.
     */
    Ready = 2,
    /**
     * The verification request has transitioned into a concrete verification
     * flow. For example it transitioned into the emoji based SAS
     * verification.
     */
    Transitioned = 3,
    /**
     * The verification flow that was started with this request has finished.
     */
    Done = 4,
    /**
     * The verification process has been cancelled.
     */
    Cancelled = 5,
}

/**
 * Object containing the versions of the Rust libraries we are using.
 */
export class Versions {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * The build-time output of the `git describe` command of the source tree
     * of crate.
     */
    readonly git_description: string;
    /**
     * The Git commit hash of the crate's source tree at build time.
     */
    readonly git_sha: string;
    /**
     * The version of the matrix-sdk-crypto crate.
     */
    readonly matrix_sdk_crypto: string;
    /**
     * The version of the vodozemac crate.
     */
    readonly vodozemac: string;
}

/**
 * Get the versions of the Rust libraries we are using.
 */
export function getVersions(): Versions;

/**
 * Run some stuff when the Wasm module is instantiated.
 *
 * Right now, it does the following:
 *
 * * Redirect Rust panics to JavaScript console.
 */
export function start(): void;
