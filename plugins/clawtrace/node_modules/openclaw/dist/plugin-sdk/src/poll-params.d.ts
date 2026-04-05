export type PollCreationParamKind = "string" | "stringArray" | "number" | "boolean";
export type PollCreationParamDef = {
    kind: PollCreationParamKind;
};
declare const SHARED_POLL_CREATION_PARAM_DEFS: {
    pollQuestion: {
        kind: "string";
    };
    pollOption: {
        kind: "stringArray";
    };
    pollDurationHours: {
        kind: "number";
    };
    pollMulti: {
        kind: "boolean";
    };
};
declare const TELEGRAM_POLL_CREATION_PARAM_DEFS: {
    pollDurationSeconds: {
        kind: "number";
    };
    pollAnonymous: {
        kind: "boolean";
    };
    pollPublic: {
        kind: "boolean";
    };
};
export declare const POLL_CREATION_PARAM_DEFS: Record<string, PollCreationParamDef>;
export type SharedPollCreationParamName = keyof typeof SHARED_POLL_CREATION_PARAM_DEFS;
export type TelegramPollCreationParamName = keyof typeof TELEGRAM_POLL_CREATION_PARAM_DEFS;
export type PollCreationParamName = keyof typeof POLL_CREATION_PARAM_DEFS;
export declare const POLL_CREATION_PARAM_NAMES: string[];
export declare const SHARED_POLL_CREATION_PARAM_NAMES: SharedPollCreationParamName[];
export declare const TELEGRAM_POLL_CREATION_PARAM_NAMES: TelegramPollCreationParamName[];
export declare function resolveTelegramPollVisibility(params: {
    pollAnonymous?: boolean;
    pollPublic?: boolean;
}): boolean | undefined;
export declare function hasPollCreationParams(params: Record<string, unknown>): boolean;
export {};
