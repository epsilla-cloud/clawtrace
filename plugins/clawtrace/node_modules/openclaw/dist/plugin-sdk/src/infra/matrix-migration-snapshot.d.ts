import type { OpenClawConfig } from "../config/config.js";
export type MatrixMigrationSnapshotResult = {
    created: boolean;
    archivePath: string;
    markerPath: string;
};
export declare function resolveMatrixMigrationSnapshotMarkerPath(env?: NodeJS.ProcessEnv): string;
export declare function resolveMatrixMigrationSnapshotOutputDir(env?: NodeJS.ProcessEnv): string;
export declare function hasPendingMatrixMigration(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): boolean;
export declare function hasActionableMatrixMigration(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): boolean;
export declare function maybeCreateMatrixMigrationSnapshot(params: {
    trigger: string;
    env?: NodeJS.ProcessEnv;
    outputDir?: string;
    log?: {
        info?: (message: string) => void;
        warn?: (message: string) => void;
    };
}): Promise<MatrixMigrationSnapshotResult>;
