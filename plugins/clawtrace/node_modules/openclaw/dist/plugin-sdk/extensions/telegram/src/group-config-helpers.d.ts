import type { TelegramDirectConfig, TelegramGroupConfig, TelegramTopicConfig } from "openclaw/plugin-sdk/config-runtime";
export declare function resolveTelegramGroupPromptSettings(params: {
    groupConfig?: TelegramGroupConfig | TelegramDirectConfig;
    topicConfig?: TelegramTopicConfig;
}): {
    skillFilter: string[] | undefined;
    groupSystemPrompt: string | undefined;
};
