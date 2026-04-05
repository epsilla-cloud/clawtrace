export type ParsedIrcLine = {
    raw: string;
    prefix?: string;
    command: string;
    params: string[];
    trailing?: string;
};
export type ParsedIrcPrefix = {
    nick?: string;
    user?: string;
    host?: string;
    server?: string;
};
export declare function parseIrcLine(line: string): ParsedIrcLine | null;
export declare function parseIrcPrefix(prefix?: string): ParsedIrcPrefix;
export declare function sanitizeIrcOutboundText(text: string): string;
export declare function sanitizeIrcTarget(raw: string): string;
export declare function splitIrcText(text: string, maxChars?: number): string[];
export declare function makeIrcMessageId(): `${string}-${string}-${string}-${string}-${string}`;
