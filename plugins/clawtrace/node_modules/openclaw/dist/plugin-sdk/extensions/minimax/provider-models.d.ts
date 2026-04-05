export declare const MINIMAX_DEFAULT_MODEL_ID = "MiniMax-M2.7";
export declare const MINIMAX_DEFAULT_MODEL_REF = "minimax/MiniMax-M2.7";
export declare const MINIMAX_TEXT_MODEL_ORDER: readonly ["MiniMax-M2.7", "MiniMax-M2.7-highspeed"];
export declare const MINIMAX_TEXT_MODEL_CATALOG: {
    readonly "MiniMax-M2.7": {
        readonly name: "MiniMax M2.7";
        readonly reasoning: true;
    };
    readonly "MiniMax-M2.7-highspeed": {
        readonly name: "MiniMax M2.7 Highspeed";
        readonly reasoning: true;
    };
};
export declare const MINIMAX_TEXT_MODEL_REFS: string[];
export declare function isMiniMaxModernModelId(modelId: string): boolean;
