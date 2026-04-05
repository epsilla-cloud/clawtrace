/**
 * Table utilities and row/column manipulation operations for Feishu documents.
 *
 * Combines:
 * - Adaptive column width calculation (content-proportional, CJK-aware)
 * - Block cleaning for Descendant API (removes read-only fields)
 * - Table row/column insert, delete, and merge operations
 */
import type * as Lark from "@larksuiteoapi/node-sdk";
import type { FeishuDocxBlock } from "./docx-types.js";
export declare function calculateAdaptiveColumnWidths(blocks: FeishuDocxBlock[], tableBlockId: string): number[];
/**
 * Clean blocks for Descendant API with adaptive column widths.
 *
 * - Removes parent_id from all blocks
 * - Fixes children type (string → array) for TableCell blocks
 * - Removes merge_info (read-only, causes API error)
 * - Calculates and applies adaptive column_width for tables
 *
 * @param blocks - Array of blocks from Convert API
 * @returns Cleaned blocks ready for Descendant API
 */
export declare function cleanBlocksForDescendant(blocks: FeishuDocxBlock[]): FeishuDocxBlock[];
export declare function insertTableRow(client: Lark.Client, docToken: string, blockId: string, rowIndex?: number): Promise<{
    success: boolean;
    block: {
        block_id?: string | undefined;
        parent_id?: string | undefined;
        children?: string[] | undefined;
        block_type: number;
        page?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        text?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading1?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading2?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading3?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading4?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading5?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading6?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading7?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading8?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading9?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        bullet?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        ordered?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        code?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        quote?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        equation?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        todo?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        bitable?: {
            token?: string | undefined;
            view_type?: number | undefined;
        } | undefined;
        callout?: {
            background_color?: number | undefined;
            border_color?: number | undefined;
            text_color?: number | undefined;
            emoji_id?: string | undefined;
        } | undefined;
        chat_card?: {
            chat_id: string;
            align?: number | undefined;
        } | undefined;
        diagram?: {
            diagram_type?: number | undefined;
        } | undefined;
        divider?: {} | undefined;
        file?: {
            token?: string | undefined;
            name?: string | undefined;
            view_type?: number | undefined;
        } | undefined;
        grid?: {
            column_size: number;
        } | undefined;
        grid_column?: {
            width_ratio?: number | undefined;
        } | undefined;
        iframe?: {
            component: {
                iframe_type?: number;
                url: string;
            };
        } | undefined;
        image?: {
            width?: number | undefined;
            height?: number | undefined;
            token?: string | undefined;
            align?: number | undefined;
            caption?: {
                content?: string | undefined;
            } | undefined;
            scale?: number | undefined;
        } | undefined;
        isv?: {
            component_id?: string | undefined;
            component_type_id?: string | undefined;
        } | undefined;
        add_ons?: {
            component_id?: string | undefined;
            component_type_id: string;
            record?: string | undefined;
        } | undefined;
        mindnote?: {
            token?: string | undefined;
        } | undefined;
        sheet?: {
            token?: string | undefined;
            row_size?: number | undefined;
            column_size?: number | undefined;
        } | undefined;
        table?: {
            cells?: string[] | undefined;
            property: {
                row_size: number;
                column_size: number;
                column_width?: Array<number>;
                merge_info?: Array<{
                    row_span?: number;
                    col_span?: number;
                }>;
                header_row?: boolean;
                header_column?: boolean;
            };
        } | undefined;
        table_cell?: {} | undefined;
        view?: {
            view_type?: number | undefined;
        } | undefined;
        undefined?: {} | undefined;
        quote_container?: {} | undefined;
        task?: {
            task_id?: string | undefined;
            folded?: boolean | undefined;
        } | undefined;
        okr?: {
            okr_id?: string | undefined;
            objectives?: {
                objective_id?: string | undefined;
                kr_ids?: string[] | undefined;
            }[] | undefined;
            period_display_status?: "default" | "hidden" | "normal" | "invalid" | undefined;
            period_name_zh?: string | undefined;
            period_name_en?: string | undefined;
            user_id?: string | undefined;
            visible_setting?: {
                progress_fill_area_visible?: boolean | undefined;
                progress_status_visible?: boolean | undefined;
                score_visible?: boolean | undefined;
            } | undefined;
        } | undefined;
        okr_objective?: {
            objective_id?: string | undefined;
            confidential?: boolean | undefined;
            position?: number | undefined;
            score?: number | undefined;
            visible?: boolean | undefined;
            weight?: number | undefined;
            progress_rate?: {
                mode?: "simple" | "advanced" | undefined;
                current?: number | undefined;
                percent?: number | undefined;
                progress_status?: "normal" | "unset" | "risk" | "extended" | undefined;
                start?: number | undefined;
                status_type?: "default" | "custom" | undefined;
                target?: number | undefined;
            } | undefined;
            content?: {
                style?: {
                    align?: number | undefined;
                    done?: boolean | undefined;
                    folded?: boolean | undefined;
                    language?: number | undefined;
                    wrap?: boolean | undefined;
                    background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                    indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                    sequence?: string | undefined;
                } | undefined;
                elements: Array<{
                    text_run?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_user?: {
                        user_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_doc?: {
                        token: string;
                        obj_type: number;
                        url?: string;
                        title?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                        fallback_type?: "FallbackToLink" | "FallbackToText";
                    };
                    reminder?: {
                        create_user_id: string;
                        is_notify?: boolean;
                        is_whole_day?: boolean;
                        expire_time: string;
                        notify_time: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    file?: {
                        file_token?: string;
                        source_block_id?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    undefined?: {};
                    inline_block?: {
                        block_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    equation?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    link_preview?: {
                        title?: string;
                        url: string;
                        url_type: "Project" | "Undefined";
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                }>;
            } | undefined;
        } | undefined;
        okr_key_result?: {
            kr_id?: string | undefined;
            confidential?: boolean | undefined;
            position?: number | undefined;
            score?: number | undefined;
            visible?: boolean | undefined;
            weight?: number | undefined;
            progress_rate?: {
                mode?: "simple" | "advanced" | undefined;
                current?: number | undefined;
                percent?: number | undefined;
                progress_status?: "normal" | "unset" | "risk" | "extended" | undefined;
                start?: number | undefined;
                status_type?: "default" | "custom" | undefined;
                target?: number | undefined;
            } | undefined;
            content?: {
                style?: {
                    align?: number | undefined;
                    done?: boolean | undefined;
                    folded?: boolean | undefined;
                    language?: number | undefined;
                    wrap?: boolean | undefined;
                    background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                    indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                    sequence?: string | undefined;
                } | undefined;
                elements: Array<{
                    text_run?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_user?: {
                        user_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_doc?: {
                        token: string;
                        obj_type: number;
                        url?: string;
                        title?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                        fallback_type?: "FallbackToLink" | "FallbackToText";
                    };
                    reminder?: {
                        create_user_id: string;
                        is_notify?: boolean;
                        is_whole_day?: boolean;
                        expire_time: string;
                        notify_time: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    file?: {
                        file_token?: string;
                        source_block_id?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    undefined?: {};
                    inline_block?: {
                        block_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    equation?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    link_preview?: {
                        title?: string;
                        url: string;
                        url_type: "Project" | "Undefined";
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                }>;
            } | undefined;
        } | undefined;
        okr_progress?: {} | undefined;
        comment_ids?: string[] | undefined;
        jira_issue?: {
            id?: string | undefined;
            key?: string | undefined;
        } | undefined;
        wiki_catalog?: {
            wiki_token?: string | undefined;
        } | undefined;
        board?: {
            token?: string | undefined;
            align?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
        agenda?: {} | undefined;
        agenda_item?: {} | undefined;
        agenda_item_title?: {
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
            align?: number | undefined;
        } | undefined;
        agenda_item_content?: {} | undefined;
        link_preview?: {
            url: string;
            url_type: "MessageLink" | "Undefined";
        } | undefined;
        source_synced?: {
            elements?: {
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string | undefined;
                    title?: string | undefined;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                    fallback_type?: "FallbackToLink" | "FallbackToText" | undefined;
                } | undefined;
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean | undefined;
                    is_whole_day?: boolean | undefined;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                file?: {
                    file_token?: string | undefined;
                    source_block_id?: string | undefined;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                undefined?: {} | undefined;
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                link_preview?: {
                    title?: string | undefined;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
            }[] | undefined;
            align?: number | undefined;
        } | undefined;
        reference_synced?: {
            source_document_id?: string | undefined;
            source_block_id?: string | undefined;
        } | undefined;
        sub_page_list?: {
            wiki_token: string;
        } | undefined;
        ai_template?: {} | undefined;
        reference_base?: {
            token: string;
            view_id: string;
            layout_mode?: "Normal" | "Undefined" | "PartiallyFolded" | undefined;
        } | undefined;
        project?: {
            title?: string | undefined;
            url: string;
            sub_type: "Table" | "Card" | "Undefined";
            view_type?: "Normal" | "Undefined" | "PartiallyFolded" | undefined;
        } | undefined;
        meeting_notes_qa?: {} | undefined;
    } | undefined;
}>;
export declare function insertTableColumn(client: Lark.Client, docToken: string, blockId: string, columnIndex?: number): Promise<{
    success: boolean;
    block: {
        block_id?: string | undefined;
        parent_id?: string | undefined;
        children?: string[] | undefined;
        block_type: number;
        page?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        text?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading1?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading2?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading3?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading4?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading5?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading6?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading7?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading8?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading9?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        bullet?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        ordered?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        code?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        quote?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        equation?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        todo?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        bitable?: {
            token?: string | undefined;
            view_type?: number | undefined;
        } | undefined;
        callout?: {
            background_color?: number | undefined;
            border_color?: number | undefined;
            text_color?: number | undefined;
            emoji_id?: string | undefined;
        } | undefined;
        chat_card?: {
            chat_id: string;
            align?: number | undefined;
        } | undefined;
        diagram?: {
            diagram_type?: number | undefined;
        } | undefined;
        divider?: {} | undefined;
        file?: {
            token?: string | undefined;
            name?: string | undefined;
            view_type?: number | undefined;
        } | undefined;
        grid?: {
            column_size: number;
        } | undefined;
        grid_column?: {
            width_ratio?: number | undefined;
        } | undefined;
        iframe?: {
            component: {
                iframe_type?: number;
                url: string;
            };
        } | undefined;
        image?: {
            width?: number | undefined;
            height?: number | undefined;
            token?: string | undefined;
            align?: number | undefined;
            caption?: {
                content?: string | undefined;
            } | undefined;
            scale?: number | undefined;
        } | undefined;
        isv?: {
            component_id?: string | undefined;
            component_type_id?: string | undefined;
        } | undefined;
        add_ons?: {
            component_id?: string | undefined;
            component_type_id: string;
            record?: string | undefined;
        } | undefined;
        mindnote?: {
            token?: string | undefined;
        } | undefined;
        sheet?: {
            token?: string | undefined;
            row_size?: number | undefined;
            column_size?: number | undefined;
        } | undefined;
        table?: {
            cells?: string[] | undefined;
            property: {
                row_size: number;
                column_size: number;
                column_width?: Array<number>;
                merge_info?: Array<{
                    row_span?: number;
                    col_span?: number;
                }>;
                header_row?: boolean;
                header_column?: boolean;
            };
        } | undefined;
        table_cell?: {} | undefined;
        view?: {
            view_type?: number | undefined;
        } | undefined;
        undefined?: {} | undefined;
        quote_container?: {} | undefined;
        task?: {
            task_id?: string | undefined;
            folded?: boolean | undefined;
        } | undefined;
        okr?: {
            okr_id?: string | undefined;
            objectives?: {
                objective_id?: string | undefined;
                kr_ids?: string[] | undefined;
            }[] | undefined;
            period_display_status?: "default" | "hidden" | "normal" | "invalid" | undefined;
            period_name_zh?: string | undefined;
            period_name_en?: string | undefined;
            user_id?: string | undefined;
            visible_setting?: {
                progress_fill_area_visible?: boolean | undefined;
                progress_status_visible?: boolean | undefined;
                score_visible?: boolean | undefined;
            } | undefined;
        } | undefined;
        okr_objective?: {
            objective_id?: string | undefined;
            confidential?: boolean | undefined;
            position?: number | undefined;
            score?: number | undefined;
            visible?: boolean | undefined;
            weight?: number | undefined;
            progress_rate?: {
                mode?: "simple" | "advanced" | undefined;
                current?: number | undefined;
                percent?: number | undefined;
                progress_status?: "normal" | "unset" | "risk" | "extended" | undefined;
                start?: number | undefined;
                status_type?: "default" | "custom" | undefined;
                target?: number | undefined;
            } | undefined;
            content?: {
                style?: {
                    align?: number | undefined;
                    done?: boolean | undefined;
                    folded?: boolean | undefined;
                    language?: number | undefined;
                    wrap?: boolean | undefined;
                    background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                    indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                    sequence?: string | undefined;
                } | undefined;
                elements: Array<{
                    text_run?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_user?: {
                        user_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_doc?: {
                        token: string;
                        obj_type: number;
                        url?: string;
                        title?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                        fallback_type?: "FallbackToLink" | "FallbackToText";
                    };
                    reminder?: {
                        create_user_id: string;
                        is_notify?: boolean;
                        is_whole_day?: boolean;
                        expire_time: string;
                        notify_time: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    file?: {
                        file_token?: string;
                        source_block_id?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    undefined?: {};
                    inline_block?: {
                        block_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    equation?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    link_preview?: {
                        title?: string;
                        url: string;
                        url_type: "Project" | "Undefined";
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                }>;
            } | undefined;
        } | undefined;
        okr_key_result?: {
            kr_id?: string | undefined;
            confidential?: boolean | undefined;
            position?: number | undefined;
            score?: number | undefined;
            visible?: boolean | undefined;
            weight?: number | undefined;
            progress_rate?: {
                mode?: "simple" | "advanced" | undefined;
                current?: number | undefined;
                percent?: number | undefined;
                progress_status?: "normal" | "unset" | "risk" | "extended" | undefined;
                start?: number | undefined;
                status_type?: "default" | "custom" | undefined;
                target?: number | undefined;
            } | undefined;
            content?: {
                style?: {
                    align?: number | undefined;
                    done?: boolean | undefined;
                    folded?: boolean | undefined;
                    language?: number | undefined;
                    wrap?: boolean | undefined;
                    background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                    indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                    sequence?: string | undefined;
                } | undefined;
                elements: Array<{
                    text_run?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_user?: {
                        user_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_doc?: {
                        token: string;
                        obj_type: number;
                        url?: string;
                        title?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                        fallback_type?: "FallbackToLink" | "FallbackToText";
                    };
                    reminder?: {
                        create_user_id: string;
                        is_notify?: boolean;
                        is_whole_day?: boolean;
                        expire_time: string;
                        notify_time: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    file?: {
                        file_token?: string;
                        source_block_id?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    undefined?: {};
                    inline_block?: {
                        block_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    equation?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    link_preview?: {
                        title?: string;
                        url: string;
                        url_type: "Project" | "Undefined";
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                }>;
            } | undefined;
        } | undefined;
        okr_progress?: {} | undefined;
        comment_ids?: string[] | undefined;
        jira_issue?: {
            id?: string | undefined;
            key?: string | undefined;
        } | undefined;
        wiki_catalog?: {
            wiki_token?: string | undefined;
        } | undefined;
        board?: {
            token?: string | undefined;
            align?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
        agenda?: {} | undefined;
        agenda_item?: {} | undefined;
        agenda_item_title?: {
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
            align?: number | undefined;
        } | undefined;
        agenda_item_content?: {} | undefined;
        link_preview?: {
            url: string;
            url_type: "MessageLink" | "Undefined";
        } | undefined;
        source_synced?: {
            elements?: {
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string | undefined;
                    title?: string | undefined;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                    fallback_type?: "FallbackToLink" | "FallbackToText" | undefined;
                } | undefined;
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean | undefined;
                    is_whole_day?: boolean | undefined;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                file?: {
                    file_token?: string | undefined;
                    source_block_id?: string | undefined;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                undefined?: {} | undefined;
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                link_preview?: {
                    title?: string | undefined;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
            }[] | undefined;
            align?: number | undefined;
        } | undefined;
        reference_synced?: {
            source_document_id?: string | undefined;
            source_block_id?: string | undefined;
        } | undefined;
        sub_page_list?: {
            wiki_token: string;
        } | undefined;
        ai_template?: {} | undefined;
        reference_base?: {
            token: string;
            view_id: string;
            layout_mode?: "Normal" | "Undefined" | "PartiallyFolded" | undefined;
        } | undefined;
        project?: {
            title?: string | undefined;
            url: string;
            sub_type: "Table" | "Card" | "Undefined";
            view_type?: "Normal" | "Undefined" | "PartiallyFolded" | undefined;
        } | undefined;
        meeting_notes_qa?: {} | undefined;
    } | undefined;
}>;
export declare function deleteTableRows(client: Lark.Client, docToken: string, blockId: string, rowStart: number, rowCount?: number): Promise<{
    success: boolean;
    rows_deleted: number;
    block: {
        block_id?: string | undefined;
        parent_id?: string | undefined;
        children?: string[] | undefined;
        block_type: number;
        page?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        text?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading1?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading2?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading3?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading4?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading5?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading6?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading7?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading8?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading9?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        bullet?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        ordered?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        code?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        quote?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        equation?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        todo?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        bitable?: {
            token?: string | undefined;
            view_type?: number | undefined;
        } | undefined;
        callout?: {
            background_color?: number | undefined;
            border_color?: number | undefined;
            text_color?: number | undefined;
            emoji_id?: string | undefined;
        } | undefined;
        chat_card?: {
            chat_id: string;
            align?: number | undefined;
        } | undefined;
        diagram?: {
            diagram_type?: number | undefined;
        } | undefined;
        divider?: {} | undefined;
        file?: {
            token?: string | undefined;
            name?: string | undefined;
            view_type?: number | undefined;
        } | undefined;
        grid?: {
            column_size: number;
        } | undefined;
        grid_column?: {
            width_ratio?: number | undefined;
        } | undefined;
        iframe?: {
            component: {
                iframe_type?: number;
                url: string;
            };
        } | undefined;
        image?: {
            width?: number | undefined;
            height?: number | undefined;
            token?: string | undefined;
            align?: number | undefined;
            caption?: {
                content?: string | undefined;
            } | undefined;
            scale?: number | undefined;
        } | undefined;
        isv?: {
            component_id?: string | undefined;
            component_type_id?: string | undefined;
        } | undefined;
        add_ons?: {
            component_id?: string | undefined;
            component_type_id: string;
            record?: string | undefined;
        } | undefined;
        mindnote?: {
            token?: string | undefined;
        } | undefined;
        sheet?: {
            token?: string | undefined;
            row_size?: number | undefined;
            column_size?: number | undefined;
        } | undefined;
        table?: {
            cells?: string[] | undefined;
            property: {
                row_size: number;
                column_size: number;
                column_width?: Array<number>;
                merge_info?: Array<{
                    row_span?: number;
                    col_span?: number;
                }>;
                header_row?: boolean;
                header_column?: boolean;
            };
        } | undefined;
        table_cell?: {} | undefined;
        view?: {
            view_type?: number | undefined;
        } | undefined;
        undefined?: {} | undefined;
        quote_container?: {} | undefined;
        task?: {
            task_id?: string | undefined;
            folded?: boolean | undefined;
        } | undefined;
        okr?: {
            okr_id?: string | undefined;
            objectives?: {
                objective_id?: string | undefined;
                kr_ids?: string[] | undefined;
            }[] | undefined;
            period_display_status?: "default" | "hidden" | "normal" | "invalid" | undefined;
            period_name_zh?: string | undefined;
            period_name_en?: string | undefined;
            user_id?: string | undefined;
            visible_setting?: {
                progress_fill_area_visible?: boolean | undefined;
                progress_status_visible?: boolean | undefined;
                score_visible?: boolean | undefined;
            } | undefined;
        } | undefined;
        okr_objective?: {
            objective_id?: string | undefined;
            confidential?: boolean | undefined;
            position?: number | undefined;
            score?: number | undefined;
            visible?: boolean | undefined;
            weight?: number | undefined;
            progress_rate?: {
                mode?: "simple" | "advanced" | undefined;
                current?: number | undefined;
                percent?: number | undefined;
                progress_status?: "normal" | "unset" | "risk" | "extended" | undefined;
                start?: number | undefined;
                status_type?: "default" | "custom" | undefined;
                target?: number | undefined;
            } | undefined;
            content?: {
                style?: {
                    align?: number | undefined;
                    done?: boolean | undefined;
                    folded?: boolean | undefined;
                    language?: number | undefined;
                    wrap?: boolean | undefined;
                    background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                    indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                    sequence?: string | undefined;
                } | undefined;
                elements: Array<{
                    text_run?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_user?: {
                        user_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_doc?: {
                        token: string;
                        obj_type: number;
                        url?: string;
                        title?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                        fallback_type?: "FallbackToLink" | "FallbackToText";
                    };
                    reminder?: {
                        create_user_id: string;
                        is_notify?: boolean;
                        is_whole_day?: boolean;
                        expire_time: string;
                        notify_time: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    file?: {
                        file_token?: string;
                        source_block_id?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    undefined?: {};
                    inline_block?: {
                        block_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    equation?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    link_preview?: {
                        title?: string;
                        url: string;
                        url_type: "Project" | "Undefined";
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                }>;
            } | undefined;
        } | undefined;
        okr_key_result?: {
            kr_id?: string | undefined;
            confidential?: boolean | undefined;
            position?: number | undefined;
            score?: number | undefined;
            visible?: boolean | undefined;
            weight?: number | undefined;
            progress_rate?: {
                mode?: "simple" | "advanced" | undefined;
                current?: number | undefined;
                percent?: number | undefined;
                progress_status?: "normal" | "unset" | "risk" | "extended" | undefined;
                start?: number | undefined;
                status_type?: "default" | "custom" | undefined;
                target?: number | undefined;
            } | undefined;
            content?: {
                style?: {
                    align?: number | undefined;
                    done?: boolean | undefined;
                    folded?: boolean | undefined;
                    language?: number | undefined;
                    wrap?: boolean | undefined;
                    background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                    indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                    sequence?: string | undefined;
                } | undefined;
                elements: Array<{
                    text_run?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_user?: {
                        user_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_doc?: {
                        token: string;
                        obj_type: number;
                        url?: string;
                        title?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                        fallback_type?: "FallbackToLink" | "FallbackToText";
                    };
                    reminder?: {
                        create_user_id: string;
                        is_notify?: boolean;
                        is_whole_day?: boolean;
                        expire_time: string;
                        notify_time: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    file?: {
                        file_token?: string;
                        source_block_id?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    undefined?: {};
                    inline_block?: {
                        block_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    equation?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    link_preview?: {
                        title?: string;
                        url: string;
                        url_type: "Project" | "Undefined";
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                }>;
            } | undefined;
        } | undefined;
        okr_progress?: {} | undefined;
        comment_ids?: string[] | undefined;
        jira_issue?: {
            id?: string | undefined;
            key?: string | undefined;
        } | undefined;
        wiki_catalog?: {
            wiki_token?: string | undefined;
        } | undefined;
        board?: {
            token?: string | undefined;
            align?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
        agenda?: {} | undefined;
        agenda_item?: {} | undefined;
        agenda_item_title?: {
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
            align?: number | undefined;
        } | undefined;
        agenda_item_content?: {} | undefined;
        link_preview?: {
            url: string;
            url_type: "MessageLink" | "Undefined";
        } | undefined;
        source_synced?: {
            elements?: {
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string | undefined;
                    title?: string | undefined;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                    fallback_type?: "FallbackToLink" | "FallbackToText" | undefined;
                } | undefined;
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean | undefined;
                    is_whole_day?: boolean | undefined;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                file?: {
                    file_token?: string | undefined;
                    source_block_id?: string | undefined;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                undefined?: {} | undefined;
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                link_preview?: {
                    title?: string | undefined;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
            }[] | undefined;
            align?: number | undefined;
        } | undefined;
        reference_synced?: {
            source_document_id?: string | undefined;
            source_block_id?: string | undefined;
        } | undefined;
        sub_page_list?: {
            wiki_token: string;
        } | undefined;
        ai_template?: {} | undefined;
        reference_base?: {
            token: string;
            view_id: string;
            layout_mode?: "Normal" | "Undefined" | "PartiallyFolded" | undefined;
        } | undefined;
        project?: {
            title?: string | undefined;
            url: string;
            sub_type: "Table" | "Card" | "Undefined";
            view_type?: "Normal" | "Undefined" | "PartiallyFolded" | undefined;
        } | undefined;
        meeting_notes_qa?: {} | undefined;
    } | undefined;
}>;
export declare function deleteTableColumns(client: Lark.Client, docToken: string, blockId: string, columnStart: number, columnCount?: number): Promise<{
    success: boolean;
    columns_deleted: number;
    block: {
        block_id?: string | undefined;
        parent_id?: string | undefined;
        children?: string[] | undefined;
        block_type: number;
        page?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        text?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading1?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading2?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading3?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading4?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading5?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading6?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading7?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading8?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading9?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        bullet?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        ordered?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        code?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        quote?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        equation?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        todo?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        bitable?: {
            token?: string | undefined;
            view_type?: number | undefined;
        } | undefined;
        callout?: {
            background_color?: number | undefined;
            border_color?: number | undefined;
            text_color?: number | undefined;
            emoji_id?: string | undefined;
        } | undefined;
        chat_card?: {
            chat_id: string;
            align?: number | undefined;
        } | undefined;
        diagram?: {
            diagram_type?: number | undefined;
        } | undefined;
        divider?: {} | undefined;
        file?: {
            token?: string | undefined;
            name?: string | undefined;
            view_type?: number | undefined;
        } | undefined;
        grid?: {
            column_size: number;
        } | undefined;
        grid_column?: {
            width_ratio?: number | undefined;
        } | undefined;
        iframe?: {
            component: {
                iframe_type?: number;
                url: string;
            };
        } | undefined;
        image?: {
            width?: number | undefined;
            height?: number | undefined;
            token?: string | undefined;
            align?: number | undefined;
            caption?: {
                content?: string | undefined;
            } | undefined;
            scale?: number | undefined;
        } | undefined;
        isv?: {
            component_id?: string | undefined;
            component_type_id?: string | undefined;
        } | undefined;
        add_ons?: {
            component_id?: string | undefined;
            component_type_id: string;
            record?: string | undefined;
        } | undefined;
        mindnote?: {
            token?: string | undefined;
        } | undefined;
        sheet?: {
            token?: string | undefined;
            row_size?: number | undefined;
            column_size?: number | undefined;
        } | undefined;
        table?: {
            cells?: string[] | undefined;
            property: {
                row_size: number;
                column_size: number;
                column_width?: Array<number>;
                merge_info?: Array<{
                    row_span?: number;
                    col_span?: number;
                }>;
                header_row?: boolean;
                header_column?: boolean;
            };
        } | undefined;
        table_cell?: {} | undefined;
        view?: {
            view_type?: number | undefined;
        } | undefined;
        undefined?: {} | undefined;
        quote_container?: {} | undefined;
        task?: {
            task_id?: string | undefined;
            folded?: boolean | undefined;
        } | undefined;
        okr?: {
            okr_id?: string | undefined;
            objectives?: {
                objective_id?: string | undefined;
                kr_ids?: string[] | undefined;
            }[] | undefined;
            period_display_status?: "default" | "hidden" | "normal" | "invalid" | undefined;
            period_name_zh?: string | undefined;
            period_name_en?: string | undefined;
            user_id?: string | undefined;
            visible_setting?: {
                progress_fill_area_visible?: boolean | undefined;
                progress_status_visible?: boolean | undefined;
                score_visible?: boolean | undefined;
            } | undefined;
        } | undefined;
        okr_objective?: {
            objective_id?: string | undefined;
            confidential?: boolean | undefined;
            position?: number | undefined;
            score?: number | undefined;
            visible?: boolean | undefined;
            weight?: number | undefined;
            progress_rate?: {
                mode?: "simple" | "advanced" | undefined;
                current?: number | undefined;
                percent?: number | undefined;
                progress_status?: "normal" | "unset" | "risk" | "extended" | undefined;
                start?: number | undefined;
                status_type?: "default" | "custom" | undefined;
                target?: number | undefined;
            } | undefined;
            content?: {
                style?: {
                    align?: number | undefined;
                    done?: boolean | undefined;
                    folded?: boolean | undefined;
                    language?: number | undefined;
                    wrap?: boolean | undefined;
                    background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                    indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                    sequence?: string | undefined;
                } | undefined;
                elements: Array<{
                    text_run?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_user?: {
                        user_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_doc?: {
                        token: string;
                        obj_type: number;
                        url?: string;
                        title?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                        fallback_type?: "FallbackToLink" | "FallbackToText";
                    };
                    reminder?: {
                        create_user_id: string;
                        is_notify?: boolean;
                        is_whole_day?: boolean;
                        expire_time: string;
                        notify_time: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    file?: {
                        file_token?: string;
                        source_block_id?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    undefined?: {};
                    inline_block?: {
                        block_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    equation?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    link_preview?: {
                        title?: string;
                        url: string;
                        url_type: "Project" | "Undefined";
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                }>;
            } | undefined;
        } | undefined;
        okr_key_result?: {
            kr_id?: string | undefined;
            confidential?: boolean | undefined;
            position?: number | undefined;
            score?: number | undefined;
            visible?: boolean | undefined;
            weight?: number | undefined;
            progress_rate?: {
                mode?: "simple" | "advanced" | undefined;
                current?: number | undefined;
                percent?: number | undefined;
                progress_status?: "normal" | "unset" | "risk" | "extended" | undefined;
                start?: number | undefined;
                status_type?: "default" | "custom" | undefined;
                target?: number | undefined;
            } | undefined;
            content?: {
                style?: {
                    align?: number | undefined;
                    done?: boolean | undefined;
                    folded?: boolean | undefined;
                    language?: number | undefined;
                    wrap?: boolean | undefined;
                    background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                    indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                    sequence?: string | undefined;
                } | undefined;
                elements: Array<{
                    text_run?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_user?: {
                        user_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_doc?: {
                        token: string;
                        obj_type: number;
                        url?: string;
                        title?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                        fallback_type?: "FallbackToLink" | "FallbackToText";
                    };
                    reminder?: {
                        create_user_id: string;
                        is_notify?: boolean;
                        is_whole_day?: boolean;
                        expire_time: string;
                        notify_time: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    file?: {
                        file_token?: string;
                        source_block_id?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    undefined?: {};
                    inline_block?: {
                        block_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    equation?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    link_preview?: {
                        title?: string;
                        url: string;
                        url_type: "Project" | "Undefined";
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                }>;
            } | undefined;
        } | undefined;
        okr_progress?: {} | undefined;
        comment_ids?: string[] | undefined;
        jira_issue?: {
            id?: string | undefined;
            key?: string | undefined;
        } | undefined;
        wiki_catalog?: {
            wiki_token?: string | undefined;
        } | undefined;
        board?: {
            token?: string | undefined;
            align?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
        agenda?: {} | undefined;
        agenda_item?: {} | undefined;
        agenda_item_title?: {
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
            align?: number | undefined;
        } | undefined;
        agenda_item_content?: {} | undefined;
        link_preview?: {
            url: string;
            url_type: "MessageLink" | "Undefined";
        } | undefined;
        source_synced?: {
            elements?: {
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string | undefined;
                    title?: string | undefined;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                    fallback_type?: "FallbackToLink" | "FallbackToText" | undefined;
                } | undefined;
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean | undefined;
                    is_whole_day?: boolean | undefined;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                file?: {
                    file_token?: string | undefined;
                    source_block_id?: string | undefined;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                undefined?: {} | undefined;
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                link_preview?: {
                    title?: string | undefined;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
            }[] | undefined;
            align?: number | undefined;
        } | undefined;
        reference_synced?: {
            source_document_id?: string | undefined;
            source_block_id?: string | undefined;
        } | undefined;
        sub_page_list?: {
            wiki_token: string;
        } | undefined;
        ai_template?: {} | undefined;
        reference_base?: {
            token: string;
            view_id: string;
            layout_mode?: "Normal" | "Undefined" | "PartiallyFolded" | undefined;
        } | undefined;
        project?: {
            title?: string | undefined;
            url: string;
            sub_type: "Table" | "Card" | "Undefined";
            view_type?: "Normal" | "Undefined" | "PartiallyFolded" | undefined;
        } | undefined;
        meeting_notes_qa?: {} | undefined;
    } | undefined;
}>;
export declare function mergeTableCells(client: Lark.Client, docToken: string, blockId: string, rowStart: number, rowEnd: number, columnStart: number, columnEnd: number): Promise<{
    success: boolean;
    block: {
        block_id?: string | undefined;
        parent_id?: string | undefined;
        children?: string[] | undefined;
        block_type: number;
        page?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        text?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading1?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading2?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading3?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading4?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading5?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading6?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading7?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading8?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        heading9?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        bullet?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        ordered?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        code?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        quote?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        equation?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        todo?: {
            style?: {
                align?: number | undefined;
                done?: boolean | undefined;
                folded?: boolean | undefined;
                language?: number | undefined;
                wrap?: boolean | undefined;
                background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                sequence?: string | undefined;
            } | undefined;
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                link_preview?: {
                    title?: string;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
        } | undefined;
        bitable?: {
            token?: string | undefined;
            view_type?: number | undefined;
        } | undefined;
        callout?: {
            background_color?: number | undefined;
            border_color?: number | undefined;
            text_color?: number | undefined;
            emoji_id?: string | undefined;
        } | undefined;
        chat_card?: {
            chat_id: string;
            align?: number | undefined;
        } | undefined;
        diagram?: {
            diagram_type?: number | undefined;
        } | undefined;
        divider?: {} | undefined;
        file?: {
            token?: string | undefined;
            name?: string | undefined;
            view_type?: number | undefined;
        } | undefined;
        grid?: {
            column_size: number;
        } | undefined;
        grid_column?: {
            width_ratio?: number | undefined;
        } | undefined;
        iframe?: {
            component: {
                iframe_type?: number;
                url: string;
            };
        } | undefined;
        image?: {
            width?: number | undefined;
            height?: number | undefined;
            token?: string | undefined;
            align?: number | undefined;
            caption?: {
                content?: string | undefined;
            } | undefined;
            scale?: number | undefined;
        } | undefined;
        isv?: {
            component_id?: string | undefined;
            component_type_id?: string | undefined;
        } | undefined;
        add_ons?: {
            component_id?: string | undefined;
            component_type_id: string;
            record?: string | undefined;
        } | undefined;
        mindnote?: {
            token?: string | undefined;
        } | undefined;
        sheet?: {
            token?: string | undefined;
            row_size?: number | undefined;
            column_size?: number | undefined;
        } | undefined;
        table?: {
            cells?: string[] | undefined;
            property: {
                row_size: number;
                column_size: number;
                column_width?: Array<number>;
                merge_info?: Array<{
                    row_span?: number;
                    col_span?: number;
                }>;
                header_row?: boolean;
                header_column?: boolean;
            };
        } | undefined;
        table_cell?: {} | undefined;
        view?: {
            view_type?: number | undefined;
        } | undefined;
        undefined?: {} | undefined;
        quote_container?: {} | undefined;
        task?: {
            task_id?: string | undefined;
            folded?: boolean | undefined;
        } | undefined;
        okr?: {
            okr_id?: string | undefined;
            objectives?: {
                objective_id?: string | undefined;
                kr_ids?: string[] | undefined;
            }[] | undefined;
            period_display_status?: "default" | "hidden" | "normal" | "invalid" | undefined;
            period_name_zh?: string | undefined;
            period_name_en?: string | undefined;
            user_id?: string | undefined;
            visible_setting?: {
                progress_fill_area_visible?: boolean | undefined;
                progress_status_visible?: boolean | undefined;
                score_visible?: boolean | undefined;
            } | undefined;
        } | undefined;
        okr_objective?: {
            objective_id?: string | undefined;
            confidential?: boolean | undefined;
            position?: number | undefined;
            score?: number | undefined;
            visible?: boolean | undefined;
            weight?: number | undefined;
            progress_rate?: {
                mode?: "simple" | "advanced" | undefined;
                current?: number | undefined;
                percent?: number | undefined;
                progress_status?: "normal" | "unset" | "risk" | "extended" | undefined;
                start?: number | undefined;
                status_type?: "default" | "custom" | undefined;
                target?: number | undefined;
            } | undefined;
            content?: {
                style?: {
                    align?: number | undefined;
                    done?: boolean | undefined;
                    folded?: boolean | undefined;
                    language?: number | undefined;
                    wrap?: boolean | undefined;
                    background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                    indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                    sequence?: string | undefined;
                } | undefined;
                elements: Array<{
                    text_run?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_user?: {
                        user_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_doc?: {
                        token: string;
                        obj_type: number;
                        url?: string;
                        title?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                        fallback_type?: "FallbackToLink" | "FallbackToText";
                    };
                    reminder?: {
                        create_user_id: string;
                        is_notify?: boolean;
                        is_whole_day?: boolean;
                        expire_time: string;
                        notify_time: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    file?: {
                        file_token?: string;
                        source_block_id?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    undefined?: {};
                    inline_block?: {
                        block_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    equation?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    link_preview?: {
                        title?: string;
                        url: string;
                        url_type: "Project" | "Undefined";
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                }>;
            } | undefined;
        } | undefined;
        okr_key_result?: {
            kr_id?: string | undefined;
            confidential?: boolean | undefined;
            position?: number | undefined;
            score?: number | undefined;
            visible?: boolean | undefined;
            weight?: number | undefined;
            progress_rate?: {
                mode?: "simple" | "advanced" | undefined;
                current?: number | undefined;
                percent?: number | undefined;
                progress_status?: "normal" | "unset" | "risk" | "extended" | undefined;
                start?: number | undefined;
                status_type?: "default" | "custom" | undefined;
                target?: number | undefined;
            } | undefined;
            content?: {
                style?: {
                    align?: number | undefined;
                    done?: boolean | undefined;
                    folded?: boolean | undefined;
                    language?: number | undefined;
                    wrap?: boolean | undefined;
                    background_color?: "LightGrayBackground" | "LightRedBackground" | "LightOrangeBackground" | "LightYellowBackground" | "LightGreenBackground" | "LightBlueBackground" | "LightPurpleBackground" | "PaleGrayBackground" | "DarkGrayBackground" | "DarkRedBackground" | "DarkOrangeBackground" | "DarkYellowBackground" | "DarkGreenBackground" | "DarkBlueBackground" | "DarkPurpleBackground" | undefined;
                    indentation_level?: "NoIndent" | "OneLevelIndent" | undefined;
                    sequence?: string | undefined;
                } | undefined;
                elements: Array<{
                    text_run?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_user?: {
                        user_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    mention_doc?: {
                        token: string;
                        obj_type: number;
                        url?: string;
                        title?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                        fallback_type?: "FallbackToLink" | "FallbackToText";
                    };
                    reminder?: {
                        create_user_id: string;
                        is_notify?: boolean;
                        is_whole_day?: boolean;
                        expire_time: string;
                        notify_time: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    file?: {
                        file_token?: string;
                        source_block_id?: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    undefined?: {};
                    inline_block?: {
                        block_id: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    equation?: {
                        content: string;
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                    link_preview?: {
                        title?: string;
                        url: string;
                        url_type: "Project" | "Undefined";
                        text_element_style?: {
                            bold?: boolean;
                            italic?: boolean;
                            strikethrough?: boolean;
                            underline?: boolean;
                            inline_code?: boolean;
                            background_color?: number;
                            text_color?: number;
                            link?: {
                                url: string;
                            };
                            comment_ids?: Array<string>;
                        };
                    };
                }>;
            } | undefined;
        } | undefined;
        okr_progress?: {} | undefined;
        comment_ids?: string[] | undefined;
        jira_issue?: {
            id?: string | undefined;
            key?: string | undefined;
        } | undefined;
        wiki_catalog?: {
            wiki_token?: string | undefined;
        } | undefined;
        board?: {
            token?: string | undefined;
            align?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
        agenda?: {} | undefined;
        agenda_item?: {} | undefined;
        agenda_item_title?: {
            elements: Array<{
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string;
                    title?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                    fallback_type?: "FallbackToLink" | "FallbackToText";
                };
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean;
                    is_whole_day?: boolean;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                file?: {
                    file_token?: string;
                    source_block_id?: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                undefined?: {};
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean;
                        italic?: boolean;
                        strikethrough?: boolean;
                        underline?: boolean;
                        inline_code?: boolean;
                        background_color?: number;
                        text_color?: number;
                        link?: {
                            url: string;
                        };
                        comment_ids?: Array<string>;
                    };
                };
            }>;
            align?: number | undefined;
        } | undefined;
        agenda_item_content?: {} | undefined;
        link_preview?: {
            url: string;
            url_type: "MessageLink" | "Undefined";
        } | undefined;
        source_synced?: {
            elements?: {
                text_run?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                mention_user?: {
                    user_id: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                mention_doc?: {
                    token: string;
                    obj_type: number;
                    url?: string | undefined;
                    title?: string | undefined;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                    fallback_type?: "FallbackToLink" | "FallbackToText" | undefined;
                } | undefined;
                reminder?: {
                    create_user_id: string;
                    is_notify?: boolean | undefined;
                    is_whole_day?: boolean | undefined;
                    expire_time: string;
                    notify_time: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                file?: {
                    file_token?: string | undefined;
                    source_block_id?: string | undefined;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                undefined?: {} | undefined;
                inline_block?: {
                    block_id: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                equation?: {
                    content: string;
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
                link_preview?: {
                    title?: string | undefined;
                    url: string;
                    url_type: "Project" | "Undefined";
                    text_element_style?: {
                        bold?: boolean | undefined;
                        italic?: boolean | undefined;
                        strikethrough?: boolean | undefined;
                        underline?: boolean | undefined;
                        inline_code?: boolean | undefined;
                        background_color?: number | undefined;
                        text_color?: number | undefined;
                        link?: {
                            url: string;
                        } | undefined;
                        comment_ids?: string[] | undefined;
                    } | undefined;
                } | undefined;
            }[] | undefined;
            align?: number | undefined;
        } | undefined;
        reference_synced?: {
            source_document_id?: string | undefined;
            source_block_id?: string | undefined;
        } | undefined;
        sub_page_list?: {
            wiki_token: string;
        } | undefined;
        ai_template?: {} | undefined;
        reference_base?: {
            token: string;
            view_id: string;
            layout_mode?: "Normal" | "Undefined" | "PartiallyFolded" | undefined;
        } | undefined;
        project?: {
            title?: string | undefined;
            url: string;
            sub_type: "Table" | "Card" | "Undefined";
            view_type?: "Normal" | "Undefined" | "PartiallyFolded" | undefined;
        } | undefined;
        meeting_notes_qa?: {} | undefined;
    } | undefined;
}>;
