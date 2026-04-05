type DescribeImageWithModel = typeof import("openclaw/plugin-sdk/media-runtime").describeImageWithModel;
type TranscribeFirstAudio = typeof import("openclaw/plugin-sdk/media-runtime").transcribeFirstAudio;
export declare function describeImageWithModel(...args: Parameters<DescribeImageWithModel>): ReturnType<DescribeImageWithModel>;
export declare function transcribeFirstAudio(...args: Parameters<TranscribeFirstAudio>): ReturnType<TranscribeFirstAudio>;
export {};
