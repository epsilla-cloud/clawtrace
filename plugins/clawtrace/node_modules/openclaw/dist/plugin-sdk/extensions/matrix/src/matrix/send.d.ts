import type { PollInput } from "../runtime-api.js";
import type { CoreConfig } from "../types.js";
import type { MatrixClient } from "./sdk.js";
import { type MatrixSendOpts, type MatrixSendResult } from "./send/types.js";
export type { MatrixSendOpts, MatrixSendResult } from "./send/types.js";
export { resolveMatrixRoomId } from "./send/targets.js";
type MatrixClientResolveOpts = {
    client?: MatrixClient;
    cfg?: CoreConfig;
    timeoutMs?: number;
    accountId?: string | null;
};
export declare function sendMessageMatrix(to: string, message: string | undefined, opts?: MatrixSendOpts): Promise<MatrixSendResult>;
export declare function sendPollMatrix(to: string, poll: PollInput, opts?: MatrixSendOpts): Promise<{
    eventId: string;
    roomId: string;
}>;
export declare function sendTypingMatrix(roomId: string, typing: boolean, timeoutMs?: number, client?: MatrixClient): Promise<void>;
export declare function sendReadReceiptMatrix(roomId: string, eventId: string, client?: MatrixClient): Promise<void>;
export declare function reactMatrixMessage(roomId: string, messageId: string, emoji: string, opts?: MatrixClient | MatrixClientResolveOpts): Promise<void>;
