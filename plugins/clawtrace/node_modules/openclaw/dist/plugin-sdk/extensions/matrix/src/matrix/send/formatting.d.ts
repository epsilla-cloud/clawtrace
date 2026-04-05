import { type MatrixFormattedContent, type MatrixMediaMsgType, type MatrixRelation, type MatrixReplyRelation, type MatrixTextContent, type MatrixThreadRelation } from "./types.js";
export declare function buildTextContent(body: string, relation?: MatrixRelation): MatrixTextContent;
export declare function applyMatrixFormatting(content: MatrixFormattedContent, body: string): void;
export declare function buildReplyRelation(replyToId?: string): MatrixReplyRelation | undefined;
export declare function buildThreadRelation(threadId: string, replyToId?: string): MatrixThreadRelation;
export declare function resolveMatrixMsgType(contentType?: string, _fileName?: string): MatrixMediaMsgType;
export declare function resolveMatrixVoiceDecision(opts: {
    wantsVoice: boolean;
    contentType?: string;
    fileName?: string;
}): {
    useVoice: boolean;
};
