import { type ISavedSync } from "./index.ts";
import { type IEvent, type IStateEventWithRoomId, type IStoredClientOpts, type ISyncResponse } from "../matrix.ts";
import { type IndexedToDeviceBatch, type ToDeviceBatchWithTxnId } from "../models/ToDeviceMessage.ts";
export interface IIndexedDBBackend {
    connect(onClose?: () => void): Promise<void>;
    syncToDatabase(userTuples: UserTuple[]): Promise<void>;
    isNewlyCreated(): Promise<boolean>;
    setSyncData(syncData: ISyncResponse): Promise<void>;
    getSavedSync(): Promise<ISavedSync | null>;
    getNextBatchToken(): Promise<string>;
    clearDatabase(): Promise<void>;
    getOutOfBandMembers(roomId: string): Promise<IStateEventWithRoomId[] | null>;
    setOutOfBandMembers(roomId: string, membershipEvents: IStateEventWithRoomId[]): Promise<void>;
    clearOutOfBandMembers(roomId: string): Promise<void>;
    getUserPresenceEvents(): Promise<UserTuple[]>;
    getClientOptions(): Promise<IStoredClientOpts | undefined>;
    storeClientOptions(options: IStoredClientOpts): Promise<void>;
    saveToDeviceBatches(batches: ToDeviceBatchWithTxnId[]): Promise<void>;
    getOldestToDeviceBatch(): Promise<IndexedToDeviceBatch | null>;
    removeToDeviceBatch(id: number): Promise<void>;
    destroy(): Promise<void>;
}
export type UserTuple = [userId: string, presenceEvent: Partial<IEvent>];
//# sourceMappingURL=indexeddb-backend.d.ts.map