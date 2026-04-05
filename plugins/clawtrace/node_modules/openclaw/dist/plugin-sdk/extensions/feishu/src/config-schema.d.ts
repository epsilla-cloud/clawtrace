import { z } from "openclaw/plugin-sdk/zod";
export { z };
export declare const FeishuGroupSchema: z.ZodObject<{
    requireMention: z.ZodOptional<z.ZodBoolean>;
    tools: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    systemPrompt: z.ZodOptional<z.ZodString>;
    groupSessionScope: z.ZodOptional<z.ZodEnum<{
        group: "group";
        group_sender: "group_sender";
        group_topic: "group_topic";
        group_topic_sender: "group_topic_sender";
    }>>;
    topicSessionMode: z.ZodOptional<z.ZodEnum<{
        disabled: "disabled";
        enabled: "enabled";
    }>>;
    replyInThread: z.ZodOptional<z.ZodEnum<{
        disabled: "disabled";
        enabled: "enabled";
    }>>;
}, z.core.$strict>;
/**
 * Per-account configuration.
 * All fields are optional - missing fields inherit from top-level config.
 */
export declare const FeishuAccountConfigSchema: z.ZodObject<{
    groupSessionScope: z.ZodOptional<z.ZodEnum<{
        group: "group";
        group_sender: "group_sender";
        group_topic: "group_topic";
        group_topic_sender: "group_topic_sender";
    }>>;
    topicSessionMode: z.ZodOptional<z.ZodEnum<{
        disabled: "disabled";
        enabled: "enabled";
    }>>;
    webhookHost: z.ZodOptional<z.ZodString>;
    webhookPort: z.ZodOptional<z.ZodNumber>;
    capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    markdown: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<{
            native: "native";
            escape: "escape";
            strip: "strip";
        }>>;
        tableMode: z.ZodOptional<z.ZodEnum<{
            ascii: "ascii";
            native: "native";
            simple: "simple";
        }>>;
    }, z.core.$strict>>;
    configWrites: z.ZodOptional<z.ZodBoolean>;
    dmPolicy: z.ZodOptional<z.ZodEnum<{
        open: "open";
        allowlist: "allowlist";
        pairing: "pairing";
    }>>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    groupPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        open: "open";
        disabled: "disabled";
        allowlist: "allowlist";
    }>, z.ZodPipe<z.ZodLiteral<"allowall">, z.ZodTransform<"open", "allowall">>]>>;
    groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    groupSenderAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    requireMention: z.ZodOptional<z.ZodBoolean>;
    groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
        requireMention: z.ZodOptional<z.ZodBoolean>;
        tools: z.ZodOptional<z.ZodObject<{
            allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
            deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        systemPrompt: z.ZodOptional<z.ZodString>;
        groupSessionScope: z.ZodOptional<z.ZodEnum<{
            group: "group";
            group_sender: "group_sender";
            group_topic: "group_topic";
            group_topic_sender: "group_topic_sender";
        }>>;
        topicSessionMode: z.ZodOptional<z.ZodEnum<{
            disabled: "disabled";
            enabled: "enabled";
        }>>;
        replyInThread: z.ZodOptional<z.ZodEnum<{
            disabled: "disabled";
            enabled: "enabled";
        }>>;
    }, z.core.$strict>>>>;
    historyLimit: z.ZodOptional<z.ZodNumber>;
    dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
    dms: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        systemPrompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>>;
    textChunkLimit: z.ZodOptional<z.ZodNumber>;
    chunkMode: z.ZodOptional<z.ZodEnum<{
        length: "length";
        newline: "newline";
    }>>;
    blockStreamingCoalesce: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        minDelayMs: z.ZodOptional<z.ZodNumber>;
        maxDelayMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    mediaMaxMb: z.ZodOptional<z.ZodNumber>;
    httpTimeoutMs: z.ZodOptional<z.ZodNumber>;
    heartbeat: z.ZodOptional<z.ZodObject<{
        visibility: z.ZodOptional<z.ZodEnum<{
            hidden: "hidden";
            visible: "visible";
        }>>;
        intervalMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    renderMode: z.ZodOptional<z.ZodEnum<{
        raw: "raw";
        auto: "auto";
        card: "card";
    }>>;
    streaming: z.ZodOptional<z.ZodBoolean>;
    tools: z.ZodOptional<z.ZodObject<{
        doc: z.ZodOptional<z.ZodBoolean>;
        chat: z.ZodOptional<z.ZodBoolean>;
        wiki: z.ZodOptional<z.ZodBoolean>;
        drive: z.ZodOptional<z.ZodBoolean>;
        perm: z.ZodOptional<z.ZodBoolean>;
        scopes: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    actions: z.ZodOptional<z.ZodObject<{
        reactions: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    replyInThread: z.ZodOptional<z.ZodEnum<{
        disabled: "disabled";
        enabled: "enabled";
    }>>;
    reactionNotifications: z.ZodOptional<z.ZodEnum<{
        off: "off";
        all: "all";
        own: "own";
    }>>;
    typingIndicator: z.ZodOptional<z.ZodBoolean>;
    resolveSenderNames: z.ZodOptional<z.ZodBoolean>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    name: z.ZodOptional<z.ZodString>;
    appId: z.ZodOptional<z.ZodString>;
    appSecret: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>], "source">]>>;
    encryptKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>], "source">]>>;
    verificationToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>], "source">]>>;
    domain: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        feishu: "feishu";
        lark: "lark";
    }>, z.ZodString]>>;
    connectionMode: z.ZodOptional<z.ZodEnum<{
        websocket: "websocket";
        webhook: "webhook";
    }>>;
    webhookPath: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const FeishuConfigSchema: z.ZodObject<{
    dmPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        open: "open";
        allowlist: "allowlist";
        pairing: "pairing";
    }>>>;
    reactionNotifications: z.ZodDefault<z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        off: "off";
        all: "all";
        own: "own";
    }>>>>;
    groupPolicy: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        open: "open";
        disabled: "disabled";
        allowlist: "allowlist";
    }>, z.ZodPipe<z.ZodLiteral<"allowall">, z.ZodTransform<"open", "allowall">>]>>>;
    requireMention: z.ZodOptional<z.ZodBoolean>;
    groupSessionScope: z.ZodOptional<z.ZodEnum<{
        group: "group";
        group_sender: "group_sender";
        group_topic: "group_topic";
        group_topic_sender: "group_topic_sender";
    }>>;
    topicSessionMode: z.ZodOptional<z.ZodEnum<{
        disabled: "disabled";
        enabled: "enabled";
    }>>;
    dynamicAgentCreation: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        workspaceTemplate: z.ZodOptional<z.ZodString>;
        agentDirTemplate: z.ZodOptional<z.ZodString>;
        maxAgents: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    typingIndicator: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    resolveSenderNames: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
        groupSessionScope: z.ZodOptional<z.ZodEnum<{
            group: "group";
            group_sender: "group_sender";
            group_topic: "group_topic";
            group_topic_sender: "group_topic_sender";
        }>>;
        topicSessionMode: z.ZodOptional<z.ZodEnum<{
            disabled: "disabled";
            enabled: "enabled";
        }>>;
        webhookHost: z.ZodOptional<z.ZodString>;
        webhookPort: z.ZodOptional<z.ZodNumber>;
        capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
        markdown: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<{
                native: "native";
                escape: "escape";
                strip: "strip";
            }>>;
            tableMode: z.ZodOptional<z.ZodEnum<{
                ascii: "ascii";
                native: "native";
                simple: "simple";
            }>>;
        }, z.core.$strict>>;
        configWrites: z.ZodOptional<z.ZodBoolean>;
        dmPolicy: z.ZodOptional<z.ZodEnum<{
            open: "open";
            allowlist: "allowlist";
            pairing: "pairing";
        }>>;
        allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        groupPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
            open: "open";
            disabled: "disabled";
            allowlist: "allowlist";
        }>, z.ZodPipe<z.ZodLiteral<"allowall">, z.ZodTransform<"open", "allowall">>]>>;
        groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        groupSenderAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        requireMention: z.ZodOptional<z.ZodBoolean>;
        groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
            requireMention: z.ZodOptional<z.ZodBoolean>;
            tools: z.ZodOptional<z.ZodObject<{
                allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
                deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
            }, z.core.$strict>>;
            skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
            enabled: z.ZodOptional<z.ZodBoolean>;
            allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
            systemPrompt: z.ZodOptional<z.ZodString>;
            groupSessionScope: z.ZodOptional<z.ZodEnum<{
                group: "group";
                group_sender: "group_sender";
                group_topic: "group_topic";
                group_topic_sender: "group_topic_sender";
            }>>;
            topicSessionMode: z.ZodOptional<z.ZodEnum<{
                disabled: "disabled";
                enabled: "enabled";
            }>>;
            replyInThread: z.ZodOptional<z.ZodEnum<{
                disabled: "disabled";
                enabled: "enabled";
            }>>;
        }, z.core.$strict>>>>;
        historyLimit: z.ZodOptional<z.ZodNumber>;
        dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
        dms: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            systemPrompt: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>>;
        textChunkLimit: z.ZodOptional<z.ZodNumber>;
        chunkMode: z.ZodOptional<z.ZodEnum<{
            length: "length";
            newline: "newline";
        }>>;
        blockStreamingCoalesce: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            minDelayMs: z.ZodOptional<z.ZodNumber>;
            maxDelayMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        mediaMaxMb: z.ZodOptional<z.ZodNumber>;
        httpTimeoutMs: z.ZodOptional<z.ZodNumber>;
        heartbeat: z.ZodOptional<z.ZodObject<{
            visibility: z.ZodOptional<z.ZodEnum<{
                hidden: "hidden";
                visible: "visible";
            }>>;
            intervalMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        renderMode: z.ZodOptional<z.ZodEnum<{
            raw: "raw";
            auto: "auto";
            card: "card";
        }>>;
        streaming: z.ZodOptional<z.ZodBoolean>;
        tools: z.ZodOptional<z.ZodObject<{
            doc: z.ZodOptional<z.ZodBoolean>;
            chat: z.ZodOptional<z.ZodBoolean>;
            wiki: z.ZodOptional<z.ZodBoolean>;
            drive: z.ZodOptional<z.ZodBoolean>;
            perm: z.ZodOptional<z.ZodBoolean>;
            scopes: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        actions: z.ZodOptional<z.ZodObject<{
            reactions: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        replyInThread: z.ZodOptional<z.ZodEnum<{
            disabled: "disabled";
            enabled: "enabled";
        }>>;
        reactionNotifications: z.ZodOptional<z.ZodEnum<{
            off: "off";
            all: "all";
            own: "own";
        }>>;
        typingIndicator: z.ZodOptional<z.ZodBoolean>;
        resolveSenderNames: z.ZodOptional<z.ZodBoolean>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        name: z.ZodOptional<z.ZodString>;
        appId: z.ZodOptional<z.ZodString>;
        appSecret: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
        }, z.core.$strip>], "source">]>>;
        encryptKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
        }, z.core.$strip>], "source">]>>;
        verificationToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
        }, z.core.$strip>], "source">]>>;
        domain: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
            feishu: "feishu";
            lark: "lark";
        }>, z.ZodString]>>;
        connectionMode: z.ZodOptional<z.ZodEnum<{
            websocket: "websocket";
            webhook: "webhook";
        }>>;
        webhookPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>>;
    webhookHost: z.ZodOptional<z.ZodString>;
    webhookPort: z.ZodOptional<z.ZodNumber>;
    capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    markdown: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<{
            native: "native";
            escape: "escape";
            strip: "strip";
        }>>;
        tableMode: z.ZodOptional<z.ZodEnum<{
            ascii: "ascii";
            native: "native";
            simple: "simple";
        }>>;
    }, z.core.$strict>>;
    configWrites: z.ZodOptional<z.ZodBoolean>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    groupSenderAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
        requireMention: z.ZodOptional<z.ZodBoolean>;
        tools: z.ZodOptional<z.ZodObject<{
            allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
            deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        systemPrompt: z.ZodOptional<z.ZodString>;
        groupSessionScope: z.ZodOptional<z.ZodEnum<{
            group: "group";
            group_sender: "group_sender";
            group_topic: "group_topic";
            group_topic_sender: "group_topic_sender";
        }>>;
        topicSessionMode: z.ZodOptional<z.ZodEnum<{
            disabled: "disabled";
            enabled: "enabled";
        }>>;
        replyInThread: z.ZodOptional<z.ZodEnum<{
            disabled: "disabled";
            enabled: "enabled";
        }>>;
    }, z.core.$strict>>>>;
    historyLimit: z.ZodOptional<z.ZodNumber>;
    dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
    dms: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        systemPrompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>>;
    textChunkLimit: z.ZodOptional<z.ZodNumber>;
    chunkMode: z.ZodOptional<z.ZodEnum<{
        length: "length";
        newline: "newline";
    }>>;
    blockStreamingCoalesce: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        minDelayMs: z.ZodOptional<z.ZodNumber>;
        maxDelayMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    mediaMaxMb: z.ZodOptional<z.ZodNumber>;
    httpTimeoutMs: z.ZodOptional<z.ZodNumber>;
    heartbeat: z.ZodOptional<z.ZodObject<{
        visibility: z.ZodOptional<z.ZodEnum<{
            hidden: "hidden";
            visible: "visible";
        }>>;
        intervalMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    renderMode: z.ZodOptional<z.ZodEnum<{
        raw: "raw";
        auto: "auto";
        card: "card";
    }>>;
    streaming: z.ZodOptional<z.ZodBoolean>;
    tools: z.ZodOptional<z.ZodObject<{
        doc: z.ZodOptional<z.ZodBoolean>;
        chat: z.ZodOptional<z.ZodBoolean>;
        wiki: z.ZodOptional<z.ZodBoolean>;
        drive: z.ZodOptional<z.ZodBoolean>;
        perm: z.ZodOptional<z.ZodBoolean>;
        scopes: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    actions: z.ZodOptional<z.ZodObject<{
        reactions: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    replyInThread: z.ZodOptional<z.ZodEnum<{
        disabled: "disabled";
        enabled: "enabled";
    }>>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    defaultAccount: z.ZodOptional<z.ZodString>;
    appId: z.ZodOptional<z.ZodString>;
    appSecret: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>], "source">]>>;
    encryptKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>], "source">]>>;
    verificationToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>], "source">]>>;
    domain: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        feishu: "feishu";
        lark: "lark";
    }>, z.ZodString]>>>;
    connectionMode: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        websocket: "websocket";
        webhook: "webhook";
    }>>>;
    webhookPath: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strict>;
