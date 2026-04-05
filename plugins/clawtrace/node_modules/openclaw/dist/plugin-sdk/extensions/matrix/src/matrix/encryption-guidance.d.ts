import type { CoreConfig } from "../types.js";
export declare function resolveMatrixEncryptionConfigPath(cfg: CoreConfig, accountId?: string | null): string;
export declare function formatMatrixEncryptionUnavailableError(cfg: CoreConfig, accountId?: string | null): string;
export declare function formatMatrixEncryptedEventDisabledWarning(cfg: CoreConfig, accountId?: string | null): string;
