import type { MatrixStoredCredentials } from "./credentials-read.js";
export { clearMatrixCredentials, credentialsMatchConfig, loadMatrixCredentials, resolveMatrixCredentialsDir, resolveMatrixCredentialsPath, } from "./credentials-read.js";
export type { MatrixStoredCredentials } from "./credentials-read.js";
export declare function saveMatrixCredentials(credentials: Omit<MatrixStoredCredentials, "createdAt" | "lastUsedAt">, env?: NodeJS.ProcessEnv, accountId?: string | null): Promise<void>;
export declare function touchMatrixCredentials(env?: NodeJS.ProcessEnv, accountId?: string | null): Promise<void>;
