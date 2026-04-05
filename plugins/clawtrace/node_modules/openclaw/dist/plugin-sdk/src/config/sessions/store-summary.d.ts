export type SessionStoreSummaryEntry = {
    lastChannel?: string;
    lastTo?: string;
    updatedAt?: number;
};
export declare function loadSessionStoreSummary(storePath: string): Record<string, SessionStoreSummaryEntry>;
