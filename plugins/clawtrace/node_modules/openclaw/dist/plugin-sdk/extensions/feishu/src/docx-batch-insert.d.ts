/**
 * Batch insertion for large Feishu documents (>1000 blocks).
 *
 * The Feishu Descendant API has a limit of 1000 blocks per request.
 * This module handles splitting large documents into batches while
 * preserving parent-child relationships between blocks.
 */
import type * as Lark from "@larksuiteoapi/node-sdk";
import type { FeishuDocxBlock, FeishuDocxBlockChild } from "./docx-types.js";
export declare const BATCH_SIZE = 1000;
type Logger = {
    info?: (msg: string) => void;
};
/**
 * Insert blocks in batches for large documents (>1000 blocks).
 *
 * Batches are split to ensure BOTH children_id AND descendants
 * arrays stay under the 1000 block API limit.
 *
 * @param client - Feishu API client
 * @param docToken - Document ID
 * @param blocks - All blocks from Convert API
 * @param firstLevelBlockIds - IDs of top-level blocks to insert
 * @param logger - Optional logger for progress updates
 * @param parentBlockId - Parent block to insert into (defaults to docToken = document root)
 * @param startIndex - Starting position within parent (-1 = end). For multi-batch inserts,
 *   each batch advances this by the number of first-level IDs inserted so far.
 * @returns Inserted children blocks and any skipped block IDs
 */
export declare function insertBlocksInBatches(client: Lark.Client, docToken: string, blocks: FeishuDocxBlock[], firstLevelBlockIds: string[], logger?: Logger, parentBlockId?: string, startIndex?: number): Promise<{
    children: FeishuDocxBlockChild[];
    skipped: string[];
}>;
export {};
