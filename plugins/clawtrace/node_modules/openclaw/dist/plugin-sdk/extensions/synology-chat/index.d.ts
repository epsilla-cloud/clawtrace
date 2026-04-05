export { synologyChatPlugin } from "./src/channel.js";
export { setSynologyRuntime } from "./src/runtime.js";
declare const _default: {
    id: string;
    name: string;
    description: string;
    configSchema: import("openclaw/plugin-sdk/core").OpenClawPluginConfigSchema;
    register: (api: import("openclaw/plugin-sdk/core").OpenClawPluginApi) => void;
    channelPlugin: Omit<import("openclaw/plugin-sdk/core").ChannelPlugin<import("./src/types.ts").ResolvedSynologyChatAccount>, "pairing" | "gateway" | "security" | "messaging" | "directory" | "outbound" | "agentPrompt"> & {
        pairing: {
            idLabel: string;
            normalizeAllowEntry?: (entry: string) => string;
            notifyApproval: (params: {
                cfg: import("openclaw/plugin-sdk/core").OpenClawConfig;
                id: string;
            }) => Promise<void>;
        };
        security: {
            resolveDmPolicy: (params: {
                cfg: import("openclaw/plugin-sdk/core").OpenClawConfig;
                account: import("./src/types.ts").ResolvedSynologyChatAccount;
            }) => {
                policy: string | null | undefined;
                allowFrom?: Array<string | number>;
                normalizeEntry?: (raw: string) => string;
            } | null;
            collectWarnings: (params: {
                cfg: import("openclaw/plugin-sdk/core").OpenClawConfig;
                account: import("./src/types.ts").ResolvedSynologyChatAccount;
            }) => string[];
        };
        messaging: {
            normalizeTarget: (target: string) => string | undefined;
            targetResolver: {
                looksLikeId: (id: string) => boolean;
                hint: string;
            };
        };
        directory: {
            self?: NonNullable<import("openclaw/plugin-sdk/core").ChannelPlugin<import("./src/types.ts").ResolvedSynologyChatAccount>["directory"]>["self"];
            listPeers?: NonNullable<import("openclaw/plugin-sdk/core").ChannelPlugin<import("./src/types.ts").ResolvedSynologyChatAccount>["directory"]>["listPeers"];
            listGroups?: NonNullable<import("openclaw/plugin-sdk/core").ChannelPlugin<import("./src/types.ts").ResolvedSynologyChatAccount>["directory"]>["listGroups"];
        };
        outbound: {
            deliveryMode: "gateway";
            textChunkLimit: number;
            sendText: (ctx: {
                cfg: import("openclaw/plugin-sdk/core").OpenClawConfig;
                to: string;
                text?: string;
                mediaUrl?: string;
                accountId?: string | null;
            } & {
                text: string;
            }) => Promise<{
                channel: "synology-chat";
                messageId: string;
                chatId: string;
            }>;
            sendMedia: (ctx: {
                cfg: import("openclaw/plugin-sdk/core").OpenClawConfig;
                to: string;
                text?: string;
                mediaUrl?: string;
                accountId?: string | null;
            }) => Promise<{
                channel: "synology-chat";
                messageId: string;
                chatId: string;
            }>;
        };
        gateway: {
            startAccount: (ctx: {
                cfg: import("openclaw/plugin-sdk/core").OpenClawConfig;
                accountId: string;
                abortSignal: AbortSignal;
                log?: {
                    info: (message: string) => void;
                    warn: (message: string) => void;
                    error: (message: string) => void;
                };
            }) => Promise<unknown>;
            stopAccount: (ctx: {
                cfg: import("openclaw/plugin-sdk/core").OpenClawConfig;
                accountId: string;
                abortSignal: AbortSignal;
                log?: {
                    info: (message: string) => void;
                    warn: (message: string) => void;
                    error: (message: string) => void;
                };
            }) => Promise<void>;
        };
        agentPrompt: {
            messageToolHints: () => string[];
        };
    };
    setChannelRuntime?: (runtime: import("openclaw/plugin-sdk/core").PluginRuntime) => void;
};
export default _default;
