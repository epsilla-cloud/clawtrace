import { type MatrixClient } from "../client.ts";
import { type IContent, type MatrixEvent } from "./event.ts";
import { type MSC3089TreeSpace } from "./MSC3089TreeSpace.ts";
import { type FileType } from "../http-api/index.ts";
import type { ISendEventResponse } from "../@types/requests.ts";
import { type EncryptedFile } from "../@types/media.ts";
export interface MSC3089EventContent {
    active?: boolean;
    name?: string;
    locked?: boolean;
    version?: number;
}
export interface MSC3089EventContent {
    active?: boolean;
    name?: string;
    locked?: boolean;
    version?: number;
}
/**
 * Represents a [MSC3089](https://github.com/matrix-org/matrix-doc/pull/3089) branch - a reference
 * to a file (leaf) in the tree. Note that this is UNSTABLE and subject to breaking changes
 * without notice.
 */
export declare class MSC3089Branch {
    private client;
    readonly indexEvent: MatrixEvent;
    readonly directory: MSC3089TreeSpace;
    constructor(client: MatrixClient, indexEvent: MatrixEvent, directory: MSC3089TreeSpace);
    /**
     * The file ID.
     */
    get id(): string;
    /**
     * Whether this branch is active/valid.
     */
    get isActive(): boolean;
    /**
     * Version for the file, one-indexed.
     */
    get version(): number;
    private get roomId();
    /**
     * Deletes the file from the tree, including all prior edits/versions.
     * @returns Promise which resolves when complete.
     */
    delete(): Promise<void>;
    /**
     * Gets the name for this file.
     * @returns The name, or "Unnamed File" if unknown.
     */
    getName(): string;
    /**
     * Sets the name for this file.
     * @param name - The new name for this file.
     * @returns Promise which resolves when complete.
     */
    setName(name: string): Promise<void>;
    /**
     * Gets whether or not a file is locked.
     * @returns True if locked, false otherwise.
     */
    isLocked(): boolean;
    /**
     * Sets a file as locked or unlocked.
     * @param locked - True to lock the file, false otherwise.
     * @returns Promise which resolves when complete.
     */
    setLocked(locked: boolean): Promise<void>;
    /**
     * Gets information about the file needed to download it.
     * @returns Information about the file.
     */
    getFileInfo(): Promise<{
        info: EncryptedFile;
        httpUrl: string;
    }>;
    /**
     * Gets the event the file points to.
     * @returns Promise which resolves to the file's event.
     */
    getFileEvent(): Promise<MatrixEvent>;
    /**
     * Creates a new version of this file with contents in a type that is compatible with MatrixClient.uploadContent().
     * @param name - The name of the file.
     * @param encryptedContents - The encrypted contents.
     * @param info - The encrypted file information.
     * @param additionalContent - Optional event content fields to include in the message.
     * @returns Promise which resolves to the file event's sent response.
     */
    createNewVersion(name: string, encryptedContents: FileType, info: EncryptedFile, additionalContent?: IContent): Promise<ISendEventResponse>;
    /**
     * Gets the file's version history, starting at this file.
     * @returns Promise which resolves to the file's version history, with the
     * first element being the current version and the last element being the first version.
     */
    getVersionHistory(): Promise<MSC3089Branch[]>;
}
//# sourceMappingURL=MSC3089Branch.d.ts.map