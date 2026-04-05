export type ToDevicePayload = Record<string, any>;
export interface ToDeviceMessage {
    userId: string;
    deviceId: string;
    payload: ToDevicePayload;
}
export interface ToDeviceBatch {
    eventType: string;
    batch: ToDeviceMessage[];
}
export interface ToDeviceBatchWithTxnId extends ToDeviceBatch {
    txnId: string;
}
export interface IndexedToDeviceBatch extends ToDeviceBatchWithTxnId {
    id: number;
}
//# sourceMappingURL=ToDeviceMessage.d.ts.map