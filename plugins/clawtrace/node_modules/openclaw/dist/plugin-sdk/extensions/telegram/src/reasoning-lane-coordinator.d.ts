import type { ReplyPayload } from "openclaw/plugin-sdk/reply-runtime";
export type TelegramReasoningSplit = {
    reasoningText?: string;
    answerText?: string;
};
export declare function splitTelegramReasoningText(text?: string): TelegramReasoningSplit;
export type BufferedFinalAnswer = {
    payload: ReplyPayload;
    text: string;
};
export declare function createTelegramReasoningStepState(): {
    noteReasoningHint: () => void;
    noteReasoningDelivered: () => void;
    shouldBufferFinalAnswer: () => boolean;
    bufferFinalAnswer: (value: BufferedFinalAnswer) => void;
    takeBufferedFinalAnswer: () => BufferedFinalAnswer | undefined;
    resetForNextStep: () => void;
};
