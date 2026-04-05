import type { MatrixActionClient, MatrixActionClientOpts } from "./types.js";
type MatrixActionClientStopMode = "stop" | "persist";
export declare function withResolvedActionClient<T>(opts: MatrixActionClientOpts, run: (client: MatrixActionClient["client"]) => Promise<T>, mode?: MatrixActionClientStopMode): Promise<T>;
export declare function withStartedActionClient<T>(opts: MatrixActionClientOpts, run: (client: MatrixActionClient["client"]) => Promise<T>): Promise<T>;
export declare function withResolvedRoomAction<T>(roomId: string, opts: MatrixActionClientOpts, run: (client: MatrixActionClient["client"], resolvedRoom: string) => Promise<T>): Promise<T>;
export {};
