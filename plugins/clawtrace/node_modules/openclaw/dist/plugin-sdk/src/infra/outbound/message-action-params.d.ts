import type { ChannelId, ChannelMessageActionName } from "../../channels/plugins/types.js";
import type { OpenClawConfig } from "../../config/config.js";
import { readBooleanParam as readBooleanParamShared } from "../../plugin-sdk/boolean-param.js";
export declare const readBooleanParam: typeof readBooleanParamShared;
export type AttachmentMediaPolicy = {
    mode: "sandbox";
    sandboxRoot: string;
} | {
    mode: "host";
    localRoots?: readonly string[];
};
export declare function resolveAttachmentMediaPolicy(params: {
    sandboxRoot?: string;
    mediaLocalRoots?: readonly string[];
}): AttachmentMediaPolicy;
export declare function normalizeSandboxMediaParams(params: {
    args: Record<string, unknown>;
    mediaPolicy: AttachmentMediaPolicy;
}): Promise<void>;
export declare function normalizeSandboxMediaList(params: {
    values: string[];
    sandboxRoot?: string;
}): Promise<string[]>;
export declare function hydrateAttachmentParamsForAction(params: {
    cfg: OpenClawConfig;
    channel: ChannelId;
    accountId?: string | null;
    args: Record<string, unknown>;
    action: ChannelMessageActionName;
    dryRun?: boolean;
    mediaPolicy: AttachmentMediaPolicy;
}): Promise<void>;
export declare function parseButtonsParam(params: Record<string, unknown>): void;
export declare function parseCardParam(params: Record<string, unknown>): void;
export declare function parseComponentsParam(params: Record<string, unknown>): void;
export declare function parseInteractiveParam(params: Record<string, unknown>): void;
