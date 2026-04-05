import type { Message } from "@grammyjs/types";
export declare const APPROVE_CALLBACK_DATA_RE: RegExp;
export declare function isMediaSizeLimitError(err: unknown): boolean;
export declare function isRecoverableMediaGroupError(err: unknown): boolean;
export declare function hasInboundMedia(msg: Message): boolean;
export declare function hasReplyTargetMedia(msg: Message): boolean;
export declare function resolveInboundMediaFileId(msg: Message): string | undefined;
