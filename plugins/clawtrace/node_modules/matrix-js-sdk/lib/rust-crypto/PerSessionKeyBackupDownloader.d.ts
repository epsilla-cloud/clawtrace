import { type OlmMachine } from "@matrix-org/matrix-sdk-crypto-wasm";
import { type KeyBackupInfo } from "../crypto-api/keybackup.ts";
import { type Logger } from "../logger.ts";
import { type IHttpOpts, type MatrixHttpApi } from "../http-api/index.ts";
import { type RustBackupManager } from "./backup.ts";
/**
 * Used when an 'unable to decrypt' error occurs. It attempts to download the key from the backup.
 *
 * The current backup API lacks pagination, which can lead to lengthy key retrieval times for large histories (several 10s of minutes).
 * To mitigate this, keys are downloaded on demand as decryption errors occurs.
 * While this approach may result in numerous requests, it improves user experience by reducing wait times for message decryption.
 *
 * The PerSessionKeyBackupDownloader is resistant to backup configuration changes: it will automatically resume querying when
 * the backup is configured correctly.
 */
export declare class PerSessionKeyBackupDownloader {
    private readonly olmMachine;
    private readonly http;
    private readonly backupManager;
    private stopped;
    /**
     * The version and decryption key to use with current backup if all set up correctly.
     *
     * Will not be set unless `hasConfigurationProblem` is `false`.
     */
    private configuration;
    /** We remember when a session was requested and not found in backup to avoid query again too soon.
     * Map of session_id to timestamp */
    private sessionLastCheckAttemptedTime;
    /** The logger to use */
    private readonly logger;
    /** Whether the download loop is running. */
    private downloadLoopRunning;
    /** The list of requests that are queued. */
    private queuedRequests;
    /** Remembers if we have a configuration problem. */
    private hasConfigurationProblem;
    /** The current server backup version check promise. To avoid doing a server call if one is in flight. */
    private currentBackupVersionCheck;
    /**
     * Creates a new instance of PerSessionKeyBackupDownloader.
     *
     * @param backupManager - The backup manager to use.
     * @param olmMachine - The olm machine to use.
     * @param http - The http instance to use.
     * @param logger - The logger to use.
     */
    constructor(logger: Logger, olmMachine: OlmMachine, http: MatrixHttpApi<IHttpOpts & {
        onlyData: true;
    }>, backupManager: RustBackupManager);
    /**
     * Check if key download is successfully configured and active.
     *
     * @return `true` if key download is correctly configured and active; otherwise `false`.
     */
    isKeyBackupDownloadConfigured(): boolean;
    /**
     * Return the details of the latest backup on the server, when we last checked.
     *
     * This is just a convenience method to expose {@link RustBackupManager.getServerBackupInfo}.
     */
    getServerBackupInfo(): Promise<KeyBackupInfo | null | undefined>;
    /**
     * Called when a MissingRoomKey or UnknownMessageIndex decryption error is encountered.
     *
     * This will try to download the key from the backup if there is a trusted active backup.
     * In case of success the key will be imported and the onRoomKeysUpdated callback will be called
     * internally by the rust-sdk and decryption will be retried.
     *
     * @param roomId - The room ID of the room where the error occurred.
     * @param megolmSessionId - The megolm session ID that is missing.
     */
    onDecryptionKeyMissingError(roomId: string, megolmSessionId: string): void;
    stop(): void;
    /**
     * Called when the backup status changes (CryptoEvents)
     * This will trigger a check of the backup configuration.
     */
    private onBackupStatusChanged;
    /** Returns true if the megolm session is already queued for download. */
    private isAlreadyInQueue;
    /**
     * Marks the session as not found in backup, to avoid retrying to soon for a key not in backup
     *
     * @param megolmSessionId - The megolm session ID that is missing.
     */
    private markAsNotFoundInBackup;
    /** Returns true if the session was requested recently. */
    private wasRequestedRecently;
    private getBackupDecryptionKey;
    /**
     * Requests a key from the server side backup.
     *
     * @param version - The backup version to use.
     * @param roomId - The room ID of the room where the error occurred.
     * @param sessionId - The megolm session ID that is missing.
     */
    private requestRoomKeyFromBackup;
    private downloadKeysLoop;
    /**
     * Query the backup for a key.
     *
     * @param targetRoomId - ID of the room that the session is used in.
     * @param targetSessionId - ID of the session for which to check backup.
     * @param configuration - The backup configuration to use.
     */
    private queryKeyBackup;
    private decryptAndImport;
    /**
     * Gets the current backup configuration or create one if it doesn't exist.
     *
     * When a valid configuration is found it is cached and returned for subsequent calls.
     * Otherwise, if a check is forced or a check has not yet been done, a new check is done.
     *
     * @returns The backup configuration to use or null if there is a configuration problem.
     */
    private getOrCreateBackupConfiguration;
    private internalCheckFromServer;
}
//# sourceMappingURL=PerSessionKeyBackupDownloader.d.ts.map