import { z } from "openclaw/plugin-sdk/zod";
export declare const MattermostConfigSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    dangerouslyAllowNameMatching: z.ZodOptional<z.ZodBoolean>;
    markdown: z.ZodOptional<z.ZodObject<{
        tables: z.ZodOptional<z.ZodEnum<{
            off: "off";
            bullets: "bullets";
            code: "code";
        }>>;
    }, z.core.$strict>>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    configWrites: z.ZodOptional<z.ZodBoolean>;
    botToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    baseUrl: z.ZodOptional<z.ZodString>;
    chatmode: z.ZodOptional<z.ZodEnum<{
        oncall: "oncall";
        onmessage: "onmessage";
        onchar: "onchar";
    }>>;
    oncharPrefixes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    requireMention: z.ZodOptional<z.ZodBoolean>;
    dmPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        open: "open";
        disabled: "disabled";
        allowlist: "allowlist";
        pairing: "pairing";
    }>>>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    groupPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        open: "open";
        disabled: "disabled";
        allowlist: "allowlist";
    }>>>;
    textChunkLimit: z.ZodOptional<z.ZodNumber>;
    chunkMode: z.ZodOptional<z.ZodEnum<{
        length: "length";
        newline: "newline";
    }>>;
    blockStreaming: z.ZodOptional<z.ZodBoolean>;
    blockStreamingCoalesce: z.ZodOptional<z.ZodObject<{
        minChars: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        idleMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    replyToMode: z.ZodOptional<z.ZodEnum<{
        off: "off";
        all: "all";
        first: "first";
    }>>;
    responsePrefix: z.ZodOptional<z.ZodString>;
    actions: z.ZodOptional<z.ZodObject<{
        reactions: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    commands: z.ZodOptional<z.ZodObject<{
        native: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
        nativeSkills: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
        callbackPath: z.ZodOptional<z.ZodString>;
        callbackUrl: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    interactions: z.ZodOptional<z.ZodObject<{
        callbackBaseUrl: z.ZodOptional<z.ZodString>;
        allowedSourceIps: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    allowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
    dmChannelRetry: z.ZodOptional<z.ZodObject<{
        maxRetries: z.ZodOptional<z.ZodNumber>;
        initialDelayMs: z.ZodOptional<z.ZodNumber>;
        maxDelayMs: z.ZodOptional<z.ZodNumber>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
        dangerouslyAllowNameMatching: z.ZodOptional<z.ZodBoolean>;
        markdown: z.ZodOptional<z.ZodObject<{
            tables: z.ZodOptional<z.ZodEnum<{
                off: "off";
                bullets: "bullets";
                code: "code";
            }>>;
        }, z.core.$strict>>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        configWrites: z.ZodOptional<z.ZodBoolean>;
        botToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
        baseUrl: z.ZodOptional<z.ZodString>;
        chatmode: z.ZodOptional<z.ZodEnum<{
            oncall: "oncall";
            onmessage: "onmessage";
            onchar: "onchar";
        }>>;
        oncharPrefixes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        requireMention: z.ZodOptional<z.ZodBoolean>;
        dmPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            open: "open";
            disabled: "disabled";
            allowlist: "allowlist";
            pairing: "pairing";
        }>>>;
        allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        groupPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            open: "open";
            disabled: "disabled";
            allowlist: "allowlist";
        }>>>;
        textChunkLimit: z.ZodOptional<z.ZodNumber>;
        chunkMode: z.ZodOptional<z.ZodEnum<{
            length: "length";
            newline: "newline";
        }>>;
        blockStreaming: z.ZodOptional<z.ZodBoolean>;
        blockStreamingCoalesce: z.ZodOptional<z.ZodObject<{
            minChars: z.ZodOptional<z.ZodNumber>;
            maxChars: z.ZodOptional<z.ZodNumber>;
            idleMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        replyToMode: z.ZodOptional<z.ZodEnum<{
            off: "off";
            all: "all";
            first: "first";
        }>>;
        responsePrefix: z.ZodOptional<z.ZodString>;
        actions: z.ZodOptional<z.ZodObject<{
            reactions: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        commands: z.ZodOptional<z.ZodObject<{
            native: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
            nativeSkills: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
            callbackPath: z.ZodOptional<z.ZodString>;
            callbackUrl: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        interactions: z.ZodOptional<z.ZodObject<{
            callbackBaseUrl: z.ZodOptional<z.ZodString>;
            allowedSourceIps: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
        allowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
        dmChannelRetry: z.ZodOptional<z.ZodObject<{
            maxRetries: z.ZodOptional<z.ZodNumber>;
            initialDelayMs: z.ZodOptional<z.ZodNumber>;
            maxDelayMs: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
    }, z.core.$strict>>>>;
    defaultAccount: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
