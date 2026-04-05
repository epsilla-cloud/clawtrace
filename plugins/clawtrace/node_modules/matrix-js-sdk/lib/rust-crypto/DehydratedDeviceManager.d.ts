import * as RustSdkCryptoJs from "@matrix-org/matrix-sdk-crypto-wasm";
import { type OutgoingRequestProcessor } from "./OutgoingRequestProcessor.ts";
import { type IHttpOpts, type MatrixHttpApi } from "../http-api/index.ts";
import { type ServerSideSecretStorage } from "../secret-storage.ts";
import { type Logger } from "../logger.ts";
import { CryptoEvent, type CryptoEventHandlerMap, type StartDehydrationOpts } from "../crypto-api/index.ts";
import { TypedEventEmitter } from "../models/typed-event-emitter.ts";
/**
 * The unstable URL prefix for dehydrated device endpoints
 */
export declare const UnstablePrefix = "/_matrix/client/unstable/org.matrix.msc3814.v1";
/**
 * Manages dehydrated devices
 *
 * We have one of these per `RustCrypto`.  It's responsible for
 *
 * * determining server support for dehydrated devices
 * * creating new dehydrated devices when requested, including periodically
 *   replacing the dehydrated device with a new one
 * * rehydrating a device when requested, and when present
 *
 * @internal
 */
export declare class DehydratedDeviceManager extends TypedEventEmitter<DehydratedDevicesEvents, DehydratedDevicesEventMap> {
    private readonly logger;
    private readonly olmMachine;
    private readonly http;
    private readonly outgoingRequestProcessor;
    private readonly secretStorage;
    /** the ID of the interval for periodically replacing the dehydrated device */
    private intervalId?;
    constructor(logger: Logger, olmMachine: RustSdkCryptoJs.OlmMachine, http: MatrixHttpApi<IHttpOpts & {
        onlyData: true;
    }>, outgoingRequestProcessor: OutgoingRequestProcessor, secretStorage: ServerSideSecretStorage);
    private cacheKey;
    /**
     * Return whether the server supports dehydrated devices.
     */
    isSupported(): Promise<boolean>;
    /**
     * Start using device dehydration.
     *
     * - Rehydrates a dehydrated device, if one is available and `opts.rehydrate`
     *   is `true`.
     * - Creates a new dehydration key, if necessary, and stores it in Secret
     *   Storage.
     *   - If `opts.createNewKey` is set to true, always creates a new key.
     *   - If a dehydration key is not available, creates a new one.
     * - Creates a new dehydrated device, and schedules periodically creating
     *   new dehydrated devices.
     *
     * @param opts - options for device dehydration. For backwards compatibility
     *     with old code, a boolean can be given here, which will be treated as
     *     the `createNewKey` option. However, this is deprecated.
     */
    start(opts?: StartDehydrationOpts | boolean): Promise<void>;
    /**
     * Return whether the dehydration key is stored in Secret Storage.
     */
    isKeyStored(): Promise<boolean>;
    /**
     * Reset the dehydration key.
     *
     * Creates a new key and stores it in secret storage.
     *
     * @returns The newly-generated key.
     */
    resetKey(): Promise<RustSdkCryptoJs.DehydratedDeviceKey>;
    /**
     * Get and cache the encryption key from secret storage.
     *
     * If `create` is `true`, creates a new key if no existing key is present.
     *
     * @returns the key, if available, or `null` if no key is available
     */
    private getKey;
    /**
     * Rehydrate the dehydrated device stored on the server.
     *
     * Checks if there is a dehydrated device on the server.  If so, rehydrates
     * the device and processes the to-device events.
     *
     * Returns whether or not a dehydrated device was found.
     */
    rehydrateDeviceIfAvailable(): Promise<boolean>;
    /**
     * Creates and uploads a new dehydrated device.
     *
     * Creates and stores a new key in secret storage if none is available.
     */
    createAndUploadDehydratedDevice(): Promise<void>;
    /**
     * Schedule periodic creation of dehydrated devices.
     */
    scheduleDeviceDehydration(): Promise<void>;
    /**
     * Stop the dehydrated device manager.
     *
     * Cancels any scheduled dehydration tasks.
     */
    stop(): void;
    /**
     * Delete the current dehydrated device and stop the dehydrated device manager.
     */
    delete(): Promise<void>;
}
/**
 * The events fired by the DehydratedDeviceManager
 * @internal
 */
type DehydratedDevicesEvents = CryptoEvent.DehydratedDeviceCreated | CryptoEvent.DehydratedDeviceUploaded | CryptoEvent.RehydrationStarted | CryptoEvent.RehydrationProgress | CryptoEvent.RehydrationCompleted | CryptoEvent.RehydrationError | CryptoEvent.DehydrationKeyCached | CryptoEvent.DehydratedDeviceRotationError;
/**
 * A map of the {@link DehydratedDeviceEvents} fired by the {@link DehydratedDeviceManager} and their payloads.
 * @internal
 */
type DehydratedDevicesEventMap = Pick<CryptoEventHandlerMap, DehydratedDevicesEvents>;
export {};
//# sourceMappingURL=DehydratedDeviceManager.d.ts.map