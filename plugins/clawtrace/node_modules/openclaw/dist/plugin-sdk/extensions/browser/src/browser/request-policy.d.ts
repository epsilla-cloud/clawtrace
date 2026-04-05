type BrowserRequestProfileParams = {
    query?: Record<string, unknown>;
    body?: unknown;
    profile?: string | null;
};
export declare function normalizeBrowserRequestPath(value: string): string;
export declare function isPersistentBrowserProfileMutation(method: string, path: string): boolean;
export declare function resolveRequestedBrowserProfile(params: BrowserRequestProfileParams): string | undefined;
export {};
