import type { MatrixClient } from "./sdk.js";
export declare function normalizeJoinedMatrixMembers(joinedMembers: unknown): string[];
export declare function isStrictDirectMembership(params: {
    selfUserId?: string | null;
    remoteUserId?: string | null;
    joinedMembers?: readonly string[] | null;
}): boolean;
export declare function readJoinedMatrixMembers(client: MatrixClient, roomId: string): Promise<string[] | null>;
export declare function hasDirectMatrixMemberFlag(client: MatrixClient, roomId: string, userId?: string | null): Promise<boolean>;
export type MatrixDirectRoomEvidence = {
    joinedMembers: string[] | null;
    strict: boolean;
    viaMemberState: boolean;
};
export declare function inspectMatrixDirectRoomEvidence(params: {
    client: MatrixClient;
    roomId: string;
    remoteUserId: string;
    selfUserId?: string | null;
}): Promise<MatrixDirectRoomEvidence>;
export declare function isStrictDirectRoom(params: {
    client: MatrixClient;
    roomId: string;
    remoteUserId: string;
    selfUserId?: string | null;
}): Promise<boolean>;
