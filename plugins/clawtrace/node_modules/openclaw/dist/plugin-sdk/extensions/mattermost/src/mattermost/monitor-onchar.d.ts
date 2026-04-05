export declare function resolveOncharPrefixes(prefixes: string[] | undefined): string[];
export declare function stripOncharPrefix(text: string, prefixes: string[]): {
    triggered: boolean;
    stripped: string;
};
