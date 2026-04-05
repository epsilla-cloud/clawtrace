import type { MatrixClient } from "./sdk.js";
export declare function setActiveMatrixClient(client: MatrixClient | null, accountId?: string | null): void;
export declare function getActiveMatrixClient(accountId?: string | null): MatrixClient | null;
