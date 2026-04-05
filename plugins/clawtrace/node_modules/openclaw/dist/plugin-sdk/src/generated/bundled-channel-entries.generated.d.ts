export declare const GENERATED_BUNDLED_CHANNEL_ENTRIES: readonly [{
    readonly id: "bluebubbles";
    readonly entry: {
        id: string;
        name: string;
        description: string;
        configSchema: import("../plugins/types.ts").OpenClawPluginConfigSchema;
        register: (api: import("../plugins/types.ts").OpenClawPluginApi) => void;
        channelPlugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/bluebubbles/src/accounts.ts").ResolvedBlueBubblesAccount, import("../../extensions/bluebubbles/src/probe.ts").BlueBubblesProbe>;
        setChannelRuntime?: (runtime: import("../plugin-sdk/imessage.ts").PluginRuntime) => void;
    };
    readonly setupEntry: {
        plugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/bluebubbles/src/accounts.ts").ResolvedBlueBubblesAccount>;
    };
}, {
    readonly id: "discord";
    readonly entry: {
        id: string;
        name: string;
        description: string;
        configSchema: import("../plugins/types.ts").OpenClawPluginConfigSchema;
        register: (api: import("../plugins/types.ts").OpenClawPluginApi) => void;
        channelPlugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../plugin-sdk/discord-surface.ts").ResolvedDiscordAccount, import("../plugin-sdk/discord-surface.ts").DiscordProbe>;
        setChannelRuntime?: (runtime: import("../plugin-sdk/imessage.ts").PluginRuntime) => void;
    };
    readonly setupEntry: {
        plugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../plugin-sdk/discord-surface.ts").ResolvedDiscordAccount>;
    };
}, {
    readonly id: "feishu";
    readonly entry: {
        id: string;
        name: string;
        description: string;
        configSchema: import("../plugins/types.ts").OpenClawPluginConfigSchema;
        register: (api: import("../plugins/types.ts").OpenClawPluginApi) => void;
        channelPlugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/feishu/src/types.ts").ResolvedFeishuAccount, import("../../extensions/feishu/src/types.ts").FeishuProbeResult>;
        setChannelRuntime?: (runtime: import("../plugin-sdk/imessage.ts").PluginRuntime) => void;
    };
    readonly setupEntry: {
        plugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/feishu/src/types.ts").ResolvedFeishuAccount, import("../../extensions/feishu/src/types.ts").FeishuProbeResult>;
    };
}, {
    readonly id: "imessage";
    readonly entry: {
        id: string;
        name: string;
        description: string;
        configSchema: import("../plugins/types.ts").OpenClawPluginConfigSchema;
        register: (api: import("../plugins/types.ts").OpenClawPluginApi) => void;
        channelPlugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/imessage/api.ts").ResolvedIMessageAccount, import("../plugin-sdk/imessage-runtime.ts").IMessageProbe>;
        setChannelRuntime?: (runtime: import("../plugin-sdk/imessage.ts").PluginRuntime) => void;
    };
    readonly setupEntry: {
        plugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/imessage/api.ts").ResolvedIMessageAccount>;
    };
}, {
    readonly id: "irc";
    readonly entry: {
        id: string;
        name: string;
        description: string;
        configSchema: import("../plugins/types.ts").OpenClawPluginConfigSchema;
        register: (api: import("../plugins/types.ts").OpenClawPluginApi) => void;
        channelPlugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin;
        setChannelRuntime?: (runtime: import("../plugin-sdk/imessage.ts").PluginRuntime) => void;
    };
    readonly setupEntry: {
        plugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/irc/api.ts").ResolvedIrcAccount, import("../../extensions/irc/src/types.ts").IrcProbe>;
    };
}, {
    readonly id: "line";
    readonly entry: {
        id: string;
        name: string;
        description: string;
        configSchema: import("../plugins/types.ts").OpenClawPluginConfigSchema;
        register: (api: import("../plugins/types.ts").OpenClawPluginApi) => void;
        channelPlugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../plugin-sdk/line-runtime.ts").ResolvedLineAccount>;
        setChannelRuntime?: (runtime: import("../plugin-sdk/imessage.ts").PluginRuntime) => void;
    };
    readonly setupEntry: {
        plugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../plugin-sdk/line-runtime.ts").ResolvedLineAccount>;
    };
}, {
    readonly id: "mattermost";
    readonly entry: {
        id: string;
        name: string;
        description: string;
        configSchema: import("../plugins/types.ts").OpenClawPluginConfigSchema;
        register: (api: import("../plugins/types.ts").OpenClawPluginApi) => void;
        channelPlugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/mattermost/src/mattermost/accounts.ts").ResolvedMattermostAccount>;
        setChannelRuntime?: (runtime: import("../plugin-sdk/imessage.ts").PluginRuntime) => void;
    };
    readonly setupEntry: {
        plugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/mattermost/src/mattermost/accounts.ts").ResolvedMattermostAccount>;
    };
}, {
    readonly id: "nextcloud-talk";
    readonly entry: {
        id: string;
        name: string;
        description: string;
        configSchema: import("../plugins/types.ts").OpenClawPluginConfigSchema;
        register: (api: import("../plugins/types.ts").OpenClawPluginApi) => void;
        channelPlugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/nextcloud-talk/src/accounts.ts").ResolvedNextcloudTalkAccount>;
        setChannelRuntime?: (runtime: import("../plugin-sdk/imessage.ts").PluginRuntime) => void;
    };
    readonly setupEntry: {
        plugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/nextcloud-talk/src/accounts.ts").ResolvedNextcloudTalkAccount>;
    };
}, {
    readonly id: "signal";
    readonly entry: {
        id: string;
        name: string;
        description: string;
        configSchema: import("../plugins/types.ts").OpenClawPluginConfigSchema;
        register: (api: import("../plugins/types.ts").OpenClawPluginApi) => void;
        channelPlugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../plugin-sdk/signal-surface.ts").ResolvedSignalAccount, import("../plugin-sdk/signal-surface.ts").SignalProbe>;
        setChannelRuntime?: (runtime: import("../plugin-sdk/imessage.ts").PluginRuntime) => void;
    };
    readonly setupEntry: {
        plugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../plugin-sdk/signal-surface.ts").ResolvedSignalAccount>;
    };
}, {
    readonly id: "slack";
    readonly entry: {
        id: string;
        name: string;
        description: string;
        configSchema: import("../plugins/types.ts").OpenClawPluginConfigSchema;
        register: (api: import("../plugins/types.ts").OpenClawPluginApi) => void;
        channelPlugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../plugin-sdk/slack-surface.ts").ResolvedSlackAccount, import("../plugin-sdk/slack-surface.ts").SlackProbe>;
        setChannelRuntime?: (runtime: import("../plugin-sdk/imessage.ts").PluginRuntime) => void;
    };
    readonly setupEntry: {
        plugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../plugin-sdk/slack-surface.ts").ResolvedSlackAccount>;
    };
}, {
    readonly id: "synology-chat";
    readonly entry: {
        id: string;
        name: string;
        description: string;
        configSchema: import("../plugins/types.ts").OpenClawPluginConfigSchema;
        register: (api: import("../plugins/types.ts").OpenClawPluginApi) => void;
        channelPlugin: Omit<import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/synology-chat/src/types.ts").ResolvedSynologyChatAccount>, "pairing" | "gateway" | "security" | "messaging" | "directory" | "outbound" | "agentPrompt"> & {
            pairing: {
                idLabel: string;
                normalizeAllowEntry?: (entry: string) => string;
                notifyApproval: (params: {
                    cfg: import("../config/types.openclaw.ts").OpenClawConfig;
                    id: string;
                }) => Promise<void>;
            };
            security: {
                resolveDmPolicy: (params: {
                    cfg: import("../config/types.openclaw.ts").OpenClawConfig;
                    account: import("../../extensions/synology-chat/src/types.ts").ResolvedSynologyChatAccount;
                }) => {
                    policy: string | null | undefined;
                    allowFrom?: Array<string | number>;
                    normalizeEntry?: (raw: string) => string;
                } | null;
                collectWarnings: (params: {
                    cfg: import("../config/types.openclaw.ts").OpenClawConfig;
                    account: import("../../extensions/synology-chat/src/types.ts").ResolvedSynologyChatAccount;
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
                self?: NonNullable<import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/synology-chat/src/types.ts").ResolvedSynologyChatAccount>["directory"]>["self"];
                listPeers?: NonNullable<import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/synology-chat/src/types.ts").ResolvedSynologyChatAccount>["directory"]>["listPeers"];
                listGroups?: NonNullable<import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/synology-chat/src/types.ts").ResolvedSynologyChatAccount>["directory"]>["listGroups"];
            };
            outbound: {
                deliveryMode: "gateway";
                textChunkLimit: number;
                sendText: (ctx: {
                    cfg: import("../config/types.openclaw.ts").OpenClawConfig;
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
                    cfg: import("../config/types.openclaw.ts").OpenClawConfig;
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
                    cfg: import("../config/types.openclaw.ts").OpenClawConfig;
                    accountId: string;
                    abortSignal: AbortSignal;
                    log?: {
                        info: (message: string) => void;
                        warn: (message: string) => void;
                        error: (message: string) => void;
                    };
                }) => Promise<unknown>;
                stopAccount: (ctx: {
                    cfg: import("../config/types.openclaw.ts").OpenClawConfig;
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
        setChannelRuntime?: (runtime: import("../plugin-sdk/imessage.ts").PluginRuntime) => void;
    };
    readonly setupEntry: {
        plugin: Omit<import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/synology-chat/src/types.ts").ResolvedSynologyChatAccount>, "pairing" | "gateway" | "security" | "messaging" | "directory" | "outbound" | "agentPrompt"> & {
            pairing: {
                idLabel: string;
                normalizeAllowEntry?: (entry: string) => string;
                notifyApproval: (params: {
                    cfg: import("../config/types.openclaw.ts").OpenClawConfig;
                    id: string;
                }) => Promise<void>;
            };
            security: {
                resolveDmPolicy: (params: {
                    cfg: import("../config/types.openclaw.ts").OpenClawConfig;
                    account: import("../../extensions/synology-chat/src/types.ts").ResolvedSynologyChatAccount;
                }) => {
                    policy: string | null | undefined;
                    allowFrom?: Array<string | number>;
                    normalizeEntry?: (raw: string) => string;
                } | null;
                collectWarnings: (params: {
                    cfg: import("../config/types.openclaw.ts").OpenClawConfig;
                    account: import("../../extensions/synology-chat/src/types.ts").ResolvedSynologyChatAccount;
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
                self?: NonNullable<import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/synology-chat/src/types.ts").ResolvedSynologyChatAccount>["directory"]>["self"];
                listPeers?: NonNullable<import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/synology-chat/src/types.ts").ResolvedSynologyChatAccount>["directory"]>["listPeers"];
                listGroups?: NonNullable<import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/synology-chat/src/types.ts").ResolvedSynologyChatAccount>["directory"]>["listGroups"];
            };
            outbound: {
                deliveryMode: "gateway";
                textChunkLimit: number;
                sendText: (ctx: {
                    cfg: import("../config/types.openclaw.ts").OpenClawConfig;
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
                    cfg: import("../config/types.openclaw.ts").OpenClawConfig;
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
                    cfg: import("../config/types.openclaw.ts").OpenClawConfig;
                    accountId: string;
                    abortSignal: AbortSignal;
                    log?: {
                        info: (message: string) => void;
                        warn: (message: string) => void;
                        error: (message: string) => void;
                    };
                }) => Promise<unknown>;
                stopAccount: (ctx: {
                    cfg: import("../config/types.openclaw.ts").OpenClawConfig;
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
    };
}, {
    readonly id: "telegram";
    readonly entry: {
        id: string;
        name: string;
        description: string;
        configSchema: import("../plugins/types.ts").OpenClawPluginConfigSchema;
        register: (api: import("../plugins/types.ts").OpenClawPluginApi) => void;
        channelPlugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin;
        setChannelRuntime?: (runtime: import("../plugin-sdk/imessage.ts").PluginRuntime) => void;
    };
    readonly setupEntry: {
        plugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../plugin-sdk/telegram.ts").ResolvedTelegramAccount, import("../plugin-sdk/telegram.ts").TelegramProbe>;
    };
}, {
    readonly id: "zalo";
    readonly entry: {
        id: string;
        name: string;
        description: string;
        configSchema: import("../plugins/types.ts").OpenClawPluginConfigSchema;
        register: (api: import("../plugins/types.ts").OpenClawPluginApi) => void;
        channelPlugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/zalo/src/types.ts").ResolvedZaloAccount, import("../../extensions/zalo/src/probe.ts").ZaloProbeResult>;
        setChannelRuntime?: (runtime: import("../plugin-sdk/imessage.ts").PluginRuntime) => void;
    };
    readonly setupEntry: {
        plugin: import("../plugin-sdk/discord-core.ts").ChannelPlugin<import("../../extensions/zalo/src/types.ts").ResolvedZaloAccount, import("../../extensions/zalo/src/probe.ts").ZaloProbeResult>;
    };
}];
