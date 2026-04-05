import type { CoreConfig, MatrixAccountConfig, MatrixConfig } from "../types.js";
export declare function resolveMatrixBaseConfig(cfg: CoreConfig): MatrixConfig;
export declare function listNormalizedMatrixAccountIds(cfg: CoreConfig): string[];
export declare function findMatrixAccountConfig(cfg: CoreConfig, accountId: string): MatrixAccountConfig | undefined;
export declare function hasExplicitMatrixAccountConfig(cfg: CoreConfig, accountId: string): boolean;
