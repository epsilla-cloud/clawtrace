import type { MattermostInteractiveButtonInput } from "./interactions.js";
import { type ModelsProviderData, type OpenClawConfig } from "./runtime-api.js";
export type MattermostModelPickerEntry = {
    kind: "summary";
} | {
    kind: "providers";
} | {
    kind: "models";
    provider: string;
};
export type MattermostModelPickerState = {
    action: "providers";
    ownerUserId: string;
} | {
    action: "back";
    ownerUserId: string;
} | {
    action: "list";
    ownerUserId: string;
    provider: string;
    page: number;
} | {
    action: "select";
    ownerUserId: string;
    provider: string;
    page: number;
    model: string;
};
export type MattermostModelPickerRenderedView = {
    text: string;
    buttons: MattermostInteractiveButtonInput[][];
};
export declare function resolveMattermostModelPickerEntry(commandText: string): MattermostModelPickerEntry | null;
export declare function parseMattermostModelPickerContext(context: Record<string, unknown>): MattermostModelPickerState | null;
export declare function buildMattermostAllowedModelRefs(data: ModelsProviderData): Set<string>;
export declare function resolveMattermostModelPickerCurrentModel(params: {
    cfg: OpenClawConfig;
    route: {
        agentId: string;
        sessionKey: string;
    };
    data: ModelsProviderData;
    skipCache?: boolean;
}): string;
export declare function renderMattermostModelSummaryView(params: {
    ownerUserId: string;
    currentModel?: string;
}): MattermostModelPickerRenderedView;
export declare function renderMattermostProviderPickerView(params: {
    ownerUserId: string;
    data: ModelsProviderData;
    currentModel?: string;
}): MattermostModelPickerRenderedView;
export declare function renderMattermostModelsPickerView(params: {
    ownerUserId: string;
    data: ModelsProviderData;
    provider: string;
    page?: number;
    currentModel?: string;
}): MattermostModelPickerRenderedView;
