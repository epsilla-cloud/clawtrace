import "fake-indexeddb/auto";
import type { SsrFPolicy } from "../runtime-api.js";
import type { MatrixCryptoBootstrapResult } from "./sdk/crypto-bootstrap.js";
import { type MatrixCryptoFacade } from "./sdk/crypto-facade.js";
import { ConsoleLogger, LogService } from "./sdk/logger.js";
import { type HttpMethod, type QueryParams } from "./sdk/transport.js";
import type { MatrixClientEventMap, MatrixRelationsPage, MatrixRawEvent, MessageEventContent } from "./sdk/types.js";
export { ConsoleLogger, LogService };
export type { DimensionalFileInfo, FileWithThumbnailInfo, TimedFileInfo, VideoFileInfo, } from "./sdk/types.js";
export type { EncryptedFile, LocationMessageEventContent, MatrixRawEvent, MessageEventContent, TextualMessageEventContent, } from "./sdk/types.js";
export type MatrixOwnDeviceVerificationStatus = {
    encryptionEnabled: boolean;
    userId: string | null;
    deviceId: string | null;
    verified: boolean;
    localVerified: boolean;
    crossSigningVerified: boolean;
    signedByOwner: boolean;
    recoveryKeyStored: boolean;
    recoveryKeyCreatedAt: string | null;
    recoveryKeyId: string | null;
    backupVersion: string | null;
    backup: MatrixRoomKeyBackupStatus;
};
export type MatrixRoomKeyBackupStatus = {
    serverVersion: string | null;
    activeVersion: string | null;
    trusted: boolean | null;
    matchesDecryptionKey: boolean | null;
    decryptionKeyCached: boolean | null;
    keyLoadAttempted: boolean;
    keyLoadError: string | null;
};
export type MatrixRoomKeyBackupRestoreResult = {
    success: boolean;
    error?: string;
    backupVersion: string | null;
    imported: number;
    total: number;
    loadedFromSecretStorage: boolean;
    restoredAt?: string;
    backup: MatrixRoomKeyBackupStatus;
};
export type MatrixRoomKeyBackupResetResult = {
    success: boolean;
    error?: string;
    previousVersion: string | null;
    deletedVersion: string | null;
    createdVersion: string | null;
    resetAt?: string;
    backup: MatrixRoomKeyBackupStatus;
};
export type MatrixRecoveryKeyVerificationResult = MatrixOwnDeviceVerificationStatus & {
    success: boolean;
    verifiedAt?: string;
    error?: string;
};
export type MatrixOwnCrossSigningPublicationStatus = {
    userId: string | null;
    masterKeyPublished: boolean;
    selfSigningKeyPublished: boolean;
    userSigningKeyPublished: boolean;
    published: boolean;
};
export type MatrixVerificationBootstrapResult = {
    success: boolean;
    error?: string;
    verification: MatrixOwnDeviceVerificationStatus;
    crossSigning: MatrixOwnCrossSigningPublicationStatus;
    pendingVerifications: number;
    cryptoBootstrap: MatrixCryptoBootstrapResult | null;
};
export type MatrixOwnDeviceInfo = {
    deviceId: string;
    displayName: string | null;
    lastSeenIp: string | null;
    lastSeenTs: number | null;
    current: boolean;
};
export type MatrixOwnDeviceDeleteResult = {
    currentDeviceId: string | null;
    deletedDeviceIds: string[];
    remainingDevices: MatrixOwnDeviceInfo[];
};
export declare class MatrixClient {
    private readonly client;
    private readonly emitter;
    private readonly httpClient;
    private readonly localTimeoutMs;
    private readonly initialSyncLimit?;
    private readonly encryptionEnabled;
    private readonly password?;
    private readonly syncStore?;
    private readonly idbSnapshotPath?;
    private readonly cryptoDatabasePrefix?;
    private bridgeRegistered;
    private started;
    private cryptoBootstrapped;
    private selfUserId;
    private readonly dmRoomIds;
    private cryptoInitialized;
    private readonly decryptBridge;
    private readonly verificationManager;
    private readonly sendQueue;
    private readonly recoveryKeyStore;
    private readonly cryptoBootstrapper;
    private readonly autoBootstrapCrypto;
    private stopPersistPromise;
    readonly dms: {
        update: () => Promise<boolean>;
        isDm: (roomId: string) => boolean;
    };
    crypto?: MatrixCryptoFacade;
    constructor(homeserver: string, accessToken: string, _storage?: unknown, _cryptoStorage?: unknown, opts?: {
        userId?: string;
        password?: string;
        deviceId?: string;
        localTimeoutMs?: number;
        encryption?: boolean;
        initialSyncLimit?: number;
        storagePath?: string;
        recoveryKeyPath?: string;
        idbSnapshotPath?: string;
        cryptoDatabasePrefix?: string;
        autoBootstrapCrypto?: boolean;
        ssrfPolicy?: SsrFPolicy;
    });
    on<TEvent extends keyof MatrixClientEventMap>(eventName: TEvent, listener: (...args: MatrixClientEventMap[TEvent]) => void): this;
    on(eventName: string, listener: (...args: unknown[]) => void): this;
    off<TEvent extends keyof MatrixClientEventMap>(eventName: TEvent, listener: (...args: MatrixClientEventMap[TEvent]) => void): this;
    off(eventName: string, listener: (...args: unknown[]) => void): this;
    private idbPersistTimer;
    start(): Promise<void>;
    private startSyncSession;
    prepareForOneOff(): Promise<void>;
    hasPersistedSyncState(): boolean;
    private ensureStartedForCryptoControlPlane;
    stopSyncWithoutPersist(): void;
    drainPendingDecryptions(reason?: string): Promise<void>;
    stop(): void;
    stopAndPersist(): Promise<void>;
    private bootstrapCryptoIfNeeded;
    private initializeCryptoIfNeeded;
    getUserId(): Promise<string>;
    getJoinedRooms(): Promise<string[]>;
    getJoinedRoomMembers(roomId: string): Promise<string[]>;
    getRoomStateEvent(roomId: string, eventType: string, stateKey?: string): Promise<Record<string, unknown>>;
    getAccountData(eventType: string): Promise<Record<string, unknown> | undefined>;
    setAccountData(eventType: string, content: Record<string, unknown>): Promise<void>;
    resolveRoom(aliasOrRoomId: string): Promise<string | null>;
    createDirectRoom(remoteUserId: string, opts?: {
        encrypted?: boolean;
    }): Promise<string>;
    sendMessage(roomId: string, content: MessageEventContent): Promise<string>;
    sendEvent(roomId: string, eventType: string, content: Record<string, unknown>): Promise<string>;
    private runSerializedRoomSend;
    sendStateEvent(roomId: string, eventType: string, stateKey: string, content: Record<string, unknown>): Promise<string>;
    redactEvent(roomId: string, eventId: string, reason?: string): Promise<string>;
    doRequest(method: HttpMethod, endpoint: string, qs?: QueryParams, body?: unknown, opts?: {
        allowAbsoluteEndpoint?: boolean;
    }): Promise<unknown>;
    getUserProfile(userId: string): Promise<{
        displayname?: string;
        avatar_url?: string;
    }>;
    setDisplayName(displayName: string): Promise<void>;
    setAvatarUrl(avatarUrl: string): Promise<void>;
    joinRoom(roomId: string): Promise<void>;
    mxcToHttp(mxcUrl: string): string | null;
    downloadContent(mxcUrl: string, opts?: {
        allowRemote?: boolean;
        maxBytes?: number;
        readIdleTimeoutMs?: number;
    }): Promise<Buffer>;
    uploadContent(file: Buffer, contentType?: string, filename?: string): Promise<string>;
    getEvent(roomId: string, eventId: string): Promise<Record<string, unknown>>;
    getRelations(roomId: string, eventId: string, relationType: string | null, eventType?: string | null, opts?: {
        from?: string;
    }): Promise<MatrixRelationsPage>;
    hydrateEvents(roomId: string, events: Array<Record<string, unknown>>): Promise<MatrixRawEvent[]>;
    setTyping(roomId: string, typing: boolean, timeoutMs: number): Promise<void>;
    sendReadReceipt(roomId: string, eventId: string): Promise<void>;
    getRoomKeyBackupStatus(): Promise<MatrixRoomKeyBackupStatus>;
    getOwnDeviceVerificationStatus(): Promise<MatrixOwnDeviceVerificationStatus>;
    verifyWithRecoveryKey(rawRecoveryKey: string): Promise<MatrixRecoveryKeyVerificationResult>;
    restoreRoomKeyBackup(params?: {
        recoveryKey?: string;
    }): Promise<MatrixRoomKeyBackupRestoreResult>;
    resetRoomKeyBackup(): Promise<MatrixRoomKeyBackupResetResult>;
    getOwnCrossSigningPublicationStatus(): Promise<MatrixOwnCrossSigningPublicationStatus>;
    bootstrapOwnDeviceVerification(params?: {
        recoveryKey?: string;
        forceResetCrossSigning?: boolean;
    }): Promise<MatrixVerificationBootstrapResult>;
    listOwnDevices(): Promise<MatrixOwnDeviceInfo[]>;
    deleteOwnDevices(deviceIds: string[]): Promise<MatrixOwnDeviceDeleteResult>;
    private resolveActiveRoomKeyBackupVersion;
    private resolveCachedRoomKeyBackupDecryptionKey;
    private resolveRoomKeyBackupLocalState;
    private resolveRoomKeyBackupTrustState;
    private resolveDefaultSecretStorageKeyId;
    private resolveRoomKeyBackupVersion;
    private enableTrustedRoomKeyBackupIfPossible;
    private ensureRoomKeyBackupEnabled;
    private registerBridge;
    private emitMembershipForRoom;
    private emitOutstandingInviteEvents;
    private refreshDmCache;
}
