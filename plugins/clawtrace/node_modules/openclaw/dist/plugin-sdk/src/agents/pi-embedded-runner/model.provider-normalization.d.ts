import type { Api, Model } from "@mariozechner/pi-ai";
export declare function applyBuiltInResolvedProviderTransportNormalization(params: {
    provider: string;
    model: Model<Api>;
}): Model<Api>;
export declare function normalizeResolvedProviderModel(params: {
    provider: string;
    model: Model<Api>;
}): Model<Api>;
