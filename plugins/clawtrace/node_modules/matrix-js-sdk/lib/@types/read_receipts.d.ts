export declare enum ReceiptType {
    Read = "m.read",
    FullyRead = "m.fully_read",
    ReadPrivate = "m.read.private"
}
export declare const MAIN_ROOM_TIMELINE = "main";
export interface Receipt {
    ts: number;
    thread_id?: string;
}
export interface WrappedReceipt {
    eventId: string;
    data: Receipt;
}
export interface CachedReceipt {
    type: ReceiptType;
    userId: string;
    data: Receipt;
}
export type ReceiptCache = Map<string, CachedReceipt[]>;
export interface ReceiptContent {
    [eventId: string]: {
        [key in ReceiptType | string]: {
            [userId: string]: Receipt;
        };
    };
}
export type Receipts = Map<string, Map<string, [real: WrappedReceipt | null, synthetic: WrappedReceipt | null]>>;
export type CachedReceiptStructure = {
    eventId: string;
    receiptType: string | ReceiptType;
    userId: string;
    receipt: Receipt;
    synthetic: boolean;
};
//# sourceMappingURL=read_receipts.d.ts.map