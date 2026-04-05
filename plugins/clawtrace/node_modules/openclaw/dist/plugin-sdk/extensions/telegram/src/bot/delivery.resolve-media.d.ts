import { type TelegramTransport } from "../fetch.js";
import type { StickerMetadata, TelegramContext } from "./types.js";
export declare function resolveMedia(ctx: TelegramContext, maxBytes: number, token: string, transport?: TelegramTransport, apiRoot?: string): Promise<{
    path: string;
    contentType?: string;
    placeholder: string;
    stickerMetadata?: StickerMetadata;
} | null>;
