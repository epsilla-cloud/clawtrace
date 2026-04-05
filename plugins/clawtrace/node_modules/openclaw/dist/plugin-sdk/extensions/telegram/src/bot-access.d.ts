import { firstDefined, type AllowlistMatch } from "openclaw/plugin-sdk/allow-from";
export type NormalizedAllowFrom = {
    entries: string[];
    hasWildcard: boolean;
    hasEntries: boolean;
    invalidEntries: string[];
};
export type AllowFromMatch = AllowlistMatch<"wildcard" | "id">;
export declare const normalizeAllowFrom: (list?: Array<string | number>) => NormalizedAllowFrom;
export declare const normalizeDmAllowFromWithStore: (params: {
    allowFrom?: Array<string | number>;
    storeAllowFrom?: string[];
    dmPolicy?: string;
}) => NormalizedAllowFrom;
export declare const isSenderAllowed: (params: {
    allow: NormalizedAllowFrom;
    senderId?: string;
    senderUsername?: string;
}) => boolean;
export { firstDefined };
export declare const resolveSenderAllowMatch: (params: {
    allow: NormalizedAllowFrom;
    senderId?: string;
    senderUsername?: string;
}) => AllowFromMatch;
