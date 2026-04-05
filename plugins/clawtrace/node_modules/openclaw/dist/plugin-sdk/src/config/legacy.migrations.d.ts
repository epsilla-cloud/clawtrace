export declare const LEGACY_CONFIG_MIGRATIONS: {
    id: string;
    describe: string;
    apply: (raw: Record<string, unknown>, changes: string[]) => void;
}[];
export declare const LEGACY_CONFIG_MIGRATION_RULES: import("./legacy.shared.ts").LegacyConfigRule[];
