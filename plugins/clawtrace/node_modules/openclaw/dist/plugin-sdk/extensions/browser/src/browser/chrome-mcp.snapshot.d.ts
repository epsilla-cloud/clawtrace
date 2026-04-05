import type { SnapshotAriaNode } from "./client.js";
import { type RoleRefMap, type RoleSnapshotOptions } from "./pw-role-snapshot.js";
export type ChromeMcpSnapshotNode = {
    id?: string;
    role?: string;
    name?: string;
    value?: string | number | boolean;
    description?: string;
    children?: ChromeMcpSnapshotNode[];
};
export declare function flattenChromeMcpSnapshotToAriaNodes(root: ChromeMcpSnapshotNode, limit?: number): SnapshotAriaNode[];
export declare function buildAiSnapshotFromChromeMcpSnapshot(params: {
    root: ChromeMcpSnapshotNode;
    options?: RoleSnapshotOptions;
    maxChars?: number;
}): {
    snapshot: string;
    truncated?: boolean;
    refs: RoleRefMap;
    stats: {
        lines: number;
        chars: number;
        refs: number;
        interactive: number;
    };
};
