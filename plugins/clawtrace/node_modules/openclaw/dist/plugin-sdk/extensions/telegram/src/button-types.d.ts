import { type InteractiveReply } from "openclaw/plugin-sdk/interactive-runtime";
export type TelegramButtonStyle = "danger" | "success" | "primary";
export type TelegramInlineButton = {
    text: string;
    callback_data: string;
    style?: TelegramButtonStyle;
};
export type TelegramInlineButtons = ReadonlyArray<ReadonlyArray<TelegramInlineButton>>;
export declare function buildTelegramInteractiveButtons(interactive?: InteractiveReply): TelegramInlineButtons | undefined;
export declare function resolveTelegramInlineButtons(params: {
    buttons?: TelegramInlineButtons;
    interactive?: unknown;
}): TelegramInlineButtons | undefined;
