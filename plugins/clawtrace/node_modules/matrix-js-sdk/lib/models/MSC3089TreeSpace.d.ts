import { type MatrixClient } from "../client.ts";
import { UNSTABLE_MSC3089_LEAF } from "../@types/event.ts";
import { type Room } from "./room.ts";
import { type IContent } from "./event.ts";
import { MSC3089Branch } from "./MSC3089Branch.ts";
import { type ISendEventResponse } from "../@types/requests.ts";
import { type FileType } from "../http-api/index.ts";
import type { EncryptedFile } from "../@types/media.ts";
import { type EmptyObject } from "../@types/common.ts";
/**
 * The recommended defaults for a tree space's power levels. Note that this
 * is UNSTABLE and subject to breaking changes without notice.
 */
export declare const DEFAULT_TREE_POWER_LEVELS_TEMPLATE: {
    invite: number;
    kick: number;
    ban: number;
    redact: number;
    state_default: number;
    events_default: number;
    users_default: number;
    events: {
        "m.room.power_levels": number;
        "m.room.history_visibility": number;
        "m.room.tombstone": number;
        "m.room.encryption": number;
        "m.room.name": number;
        "m.room.message": number;
        "m.room.encrypted": number;
        "m.sticker": number;
    };
    users: {};
};
/**
 * Ease-of-use representation for power levels represented as simple roles.
 * Note that this is UNSTABLE and subject to breaking changes without notice.
 */
export declare enum TreePermissions {
    Viewer = "viewer",// Default
    Editor = "editor",// "Moderator" or ~PL50
    Owner = "owner"
}
declare module "../@types/media" {
    interface FileContent {
        [UNSTABLE_MSC3089_LEAF.name]?: EmptyObject;
    }
}
/**
 * Represents a [MSC3089](https://github.com/matrix-org/matrix-doc/pull/3089)
 * file tree Space. Note that this is UNSTABLE and subject to breaking changes
 * without notice.
 */
export declare class MSC3089TreeSpace {
    private client;
    readonly roomId: string;
    readonly room: Room;
    constructor(client: MatrixClient, roomId: string);
    /**
     * Syntactic sugar for room ID of the Space.
     */
    get id(): string;
    /**
     * Whether or not this is a top level space.
     */
    get isTopLevel(): boolean;
    /**
     * Sets the name of the tree space.
     * @param name - The new name for the space.
     * @returns Promise which resolves when complete.
     */
    setName(name: string): Promise<void>;
    /**
     * Invites a user to the tree space. They will be given the default Viewer
     * permission level unless specified elsewhere.
     * @param userId - The user ID to invite.
     * @param andSubspaces - True (default) to invite the user to all
     * directories/subspaces too, recursively.
     * @returns Promise which resolves when complete.
     */
    invite(userId: string, andSubspaces?: boolean): Promise<void>;
    private retryInvite;
    /**
     * Sets the permissions of a user to the given role. Note that if setting a user
     * to Owner then they will NOT be able to be demoted. If the user does not have
     * permission to change the power level of the target, an error will be thrown.
     * @param userId - The user ID to change the role of.
     * @param role - The role to assign.
     * @returns Promise which resolves when complete.
     */
    setPermissions(userId: string, role: TreePermissions): Promise<void>;
    /**
     * Gets the current permissions of a user. Note that any users missing explicit permissions (or not
     * in the space) will be considered Viewers. Appropriate membership checks need to be performed
     * elsewhere.
     * @param userId - The user ID to check permissions of.
     * @returns The permissions for the user, defaulting to Viewer.
     */
    getPermissions(userId: string): TreePermissions;
    /**
     * Creates a directory under this tree space, represented as another tree space.
     * @param name - The name for the directory.
     * @returns Promise which resolves to the created directory.
     */
    createDirectory(name: string): Promise<MSC3089TreeSpace>;
    /**
     * Gets a list of all known immediate subdirectories to this tree space.
     * @returns The tree spaces (directories). May be empty, but not null.
     */
    getDirectories(): MSC3089TreeSpace[];
    /**
     * Gets a subdirectory of a given ID under this tree space. Note that this will not recurse
     * into children and instead only look one level deep.
     * @param roomId - The room ID (directory ID) to find.
     * @returns The directory, or undefined if not found.
     */
    getDirectory(roomId: string): MSC3089TreeSpace | undefined;
    /**
     * Deletes the tree, kicking all members and deleting **all subdirectories**.
     * @returns Promise which resolves when complete.
     */
    delete(): Promise<void>;
    private getOrderedChildren;
    private getParentRoom;
    /**
     * Gets the current order index for this directory. Note that if this is the top level space
     * then -1 will be returned.
     * @returns The order index of this space.
     */
    getOrder(): number;
    /**
     * Sets the order index for this directory within its parent. Note that if this is a top level
     * space then an error will be thrown. -1 can be used to move the child to the start, and numbers
     * larger than the number of children can be used to move the child to the end.
     * @param index - The new order index for this space.
     * @returns Promise which resolves when complete.
     * @throws Throws if this is a top level space.
     */
    setOrder(index: number): Promise<void>;
    /**
     * Creates (uploads) a new file to this tree. The file must have already been encrypted for the room.
     * The file contents are in a type that is compatible with MatrixClient.uploadContent().
     * @param name - The name of the file.
     * @param encryptedContents - The encrypted contents.
     * @param info - The encrypted file information.
     * @param additionalContent - Optional event content fields to include in the message.
     * @returns Promise which resolves to the file event's sent response.
     */
    createFile(name: string, encryptedContents: FileType, info: EncryptedFile, additionalContent?: IContent): Promise<ISendEventResponse>;
    /**
     * Retrieves a file from the tree.
     * @param fileEventId - The event ID of the file.
     * @returns The file, or null if not found.
     */
    getFile(fileEventId: string): MSC3089Branch | null;
    /**
     * Gets an array of all known files for the tree.
     * @returns The known files. May be empty, but not null.
     */
    listFiles(): MSC3089Branch[];
    /**
     * Gets an array of all known files for the tree, including inactive/invalid ones.
     * @returns The known files. May be empty, but not null.
     */
    listAllFiles(): MSC3089Branch[];
}
//# sourceMappingURL=MSC3089TreeSpace.d.ts.map