import type { AudioTranscriptionRequest, AudioTranscriptionResult } from "./types.js";
type OpenAiCompatibleAudioParams = AudioTranscriptionRequest & {
    defaultBaseUrl: string;
    defaultModel: string;
};
export declare function transcribeOpenAiCompatibleAudio(params: OpenAiCompatibleAudioParams): Promise<AudioTranscriptionResult>;
export {};
