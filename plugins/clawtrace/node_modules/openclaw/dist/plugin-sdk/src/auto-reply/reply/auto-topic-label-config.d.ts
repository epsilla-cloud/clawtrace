/**
 * Config resolution for auto-topic-label feature.
 * Kept separate from LLM logic to avoid heavy transitive dependencies in tests.
 */
import type { AutoTopicLabelConfig } from "../../config/types.telegram.js";
export declare const AUTO_TOPIC_LABEL_DEFAULT_PROMPT = "Generate a very short topic label (2-4 words, max 25 chars) for a chat conversation based on the user's first message below. No emoji. Use the same language as the message. Be concise and descriptive. Return ONLY the topic name, nothing else.";
/**
 * Resolve whether auto topic labeling is enabled and get the prompt.
 * Returns null if disabled.
 */
export declare function resolveAutoTopicLabelConfig(directConfig?: AutoTopicLabelConfig, accountConfig?: AutoTopicLabelConfig): {
    enabled: true;
    prompt: string;
} | null;
