type LineCredentialAccount = {
    channelAccessToken?: string;
    channelSecret?: string;
};
export declare function hasLineCredentials(account: LineCredentialAccount): boolean;
export declare function parseLineAllowFromId(raw: string): string | null;
export {};
