import type { AnyAgentTool } from "./pi-tools.types.js";
export type RequiredParamGroup = {
    keys: readonly string[];
    allowEmpty?: boolean;
    label?: string;
};
export declare const CLAUDE_PARAM_GROUPS: {
    readonly read: readonly [{
        readonly keys: readonly ["path", "file_path", "filePath", "file"];
        readonly label: "path alias";
    }];
    readonly write: readonly [{
        readonly keys: readonly ["path", "file_path", "filePath", "file"];
        readonly label: "path alias";
    }, {
        readonly keys: readonly ["content"];
        readonly label: "content";
    }];
    readonly edit: readonly [{
        readonly keys: readonly ["path", "file_path", "filePath", "file"];
        readonly label: "path alias";
    }, {
        readonly keys: readonly ["oldText", "old_string", "old_text", "oldString"];
        readonly label: "oldText alias";
    }, {
        readonly keys: readonly ["newText", "new_string", "new_text", "newString"];
        readonly label: "newText alias";
        readonly allowEmpty: true;
    }];
};
export declare function normalizeToolParams(params: unknown): Record<string, unknown> | undefined;
export declare function patchToolSchemaForClaudeCompatibility(tool: AnyAgentTool): AnyAgentTool;
export declare function assertRequiredParams(record: Record<string, unknown> | undefined, groups: readonly RequiredParamGroup[], toolName: string): void;
export declare function wrapToolParamNormalization(tool: AnyAgentTool, requiredParamGroups?: readonly RequiredParamGroup[]): AnyAgentTool;
