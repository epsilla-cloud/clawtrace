import type { MarkdownTableMode } from "openclaw/plugin-sdk/config-runtime";
type SignalTextStyle = "BOLD" | "ITALIC" | "STRIKETHROUGH" | "MONOSPACE" | "SPOILER";
export type SignalTextStyleRange = {
    start: number;
    length: number;
    style: SignalTextStyle;
};
export type SignalFormattedText = {
    text: string;
    styles: SignalTextStyleRange[];
};
type SignalMarkdownOptions = {
    tableMode?: MarkdownTableMode;
};
export declare function markdownToSignalText(markdown: string, options?: SignalMarkdownOptions): SignalFormattedText;
export declare function markdownToSignalTextChunks(markdown: string, limit: number, options?: SignalMarkdownOptions): SignalFormattedText[];
export {};
