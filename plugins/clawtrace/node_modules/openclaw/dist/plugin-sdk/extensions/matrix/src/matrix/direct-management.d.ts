import type { MatrixClient } from "./sdk.js";
import { type MatrixDirectAccountData } from "./send/types.js";
export type MatrixDirectRoomCandidate = {
    roomId: string;
    joinedMembers: string[] | null;
    strict: boolean;
    explicit: boolean;
    source: "account-data" | "joined";
};
export type MatrixDirectRoomInspection = {
    selfUserId: string | null;
    remoteUserId: string;
    mappedRoomIds: string[];
    mappedRooms: MatrixDirectRoomCandidate[];
    discoveredStrictRoomIds: string[];
    activeRoomId: string | null;
};
export type MatrixDirectRoomRepairResult = MatrixDirectRoomInspection & {
    createdRoomId: string | null;
    changed: boolean;
    directContentBefore: MatrixDirectAccountData;
    directContentAfter: MatrixDirectAccountData;
};
export declare function persistMatrixDirectRoomMapping(params: {
    client: MatrixClient;
    remoteUserId: string;
    roomId: string;
}): Promise<boolean>;
export declare function inspectMatrixDirectRooms(params: {
    client: MatrixClient;
    remoteUserId: string;
}): Promise<MatrixDirectRoomInspection>;
export declare function repairMatrixDirectRooms(params: {
    client: MatrixClient;
    remoteUserId: string;
    encrypted?: boolean;
}): Promise<MatrixDirectRoomRepairResult>;
