import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { TelegramGroupConfig } from "openclaw/plugin-sdk/config-runtime";
type TelegramGroups = Record<string, TelegramGroupConfig>;
type MigrationScope = "account" | "global";
export type TelegramGroupMigrationResult = {
    migrated: boolean;
    skippedExisting: boolean;
    scopes: MigrationScope[];
};
export declare function migrateTelegramGroupsInPlace(groups: TelegramGroups | undefined, oldChatId: string, newChatId: string): {
    migrated: boolean;
    skippedExisting: boolean;
};
export declare function migrateTelegramGroupConfig(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    oldChatId: string;
    newChatId: string;
}): TelegramGroupMigrationResult;
export {};
