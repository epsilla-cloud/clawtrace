import type { MatrixClient } from "../sdk.js";
export declare function normalizeThreadId(raw?: string | number | null): string | null;
export declare function resolveMatrixRoomId(client: MatrixClient, raw: string): Promise<string>;
