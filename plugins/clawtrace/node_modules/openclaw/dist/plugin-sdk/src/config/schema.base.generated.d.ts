export declare const GENERATED_BASE_CONFIG_SCHEMA: {
    readonly schema: {
        readonly $schema: "http://json-schema.org/draft-07/schema#";
        readonly type: "object";
        readonly properties: {
            readonly meta: {
                readonly type: "object";
                readonly properties: {
                    readonly lastTouchedVersion: {
                        readonly type: "string";
                    };
                    readonly lastTouchedAt: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                        }, {}];
                    };
                };
                readonly additionalProperties: false;
            };
            readonly env: {
                readonly type: "object";
                readonly properties: {
                    readonly shellEnv: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly timeoutMs: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly vars: {
                        readonly type: "object";
                        readonly propertyNames: {
                            readonly type: "string";
                        };
                        readonly additionalProperties: {
                            readonly type: "string";
                        };
                    };
                };
                readonly additionalProperties: {
                    readonly type: "string";
                };
            };
            readonly wizard: {
                readonly type: "object";
                readonly properties: {
                    readonly lastRunAt: {
                        readonly type: "string";
                    };
                    readonly lastRunVersion: {
                        readonly type: "string";
                    };
                    readonly lastRunCommit: {
                        readonly type: "string";
                    };
                    readonly lastRunCommand: {
                        readonly type: "string";
                    };
                    readonly lastRunMode: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                            readonly const: "local";
                        }, {
                            readonly type: "string";
                            readonly const: "remote";
                        }];
                    };
                };
                readonly additionalProperties: false;
            };
            readonly diagnostics: {
                readonly type: "object";
                readonly properties: {
                    readonly enabled: {
                        readonly type: "boolean";
                    };
                    readonly flags: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly stuckSessionWarnMs: {
                        readonly type: "integer";
                        readonly exclusiveMinimum: 0;
                        readonly maximum: 9007199254740991;
                    };
                    readonly otel: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly endpoint: {
                                readonly type: "string";
                            };
                            readonly protocol: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "http/protobuf";
                                }, {
                                    readonly type: "string";
                                    readonly const: "grpc";
                                }];
                            };
                            readonly headers: {
                                readonly type: "object";
                                readonly propertyNames: {
                                    readonly type: "string";
                                };
                                readonly additionalProperties: {
                                    readonly type: "string";
                                };
                            };
                            readonly serviceName: {
                                readonly type: "string";
                            };
                            readonly traces: {
                                readonly type: "boolean";
                            };
                            readonly metrics: {
                                readonly type: "boolean";
                            };
                            readonly logs: {
                                readonly type: "boolean";
                            };
                            readonly sampleRate: {
                                readonly type: "number";
                                readonly minimum: 0;
                                readonly maximum: 1;
                            };
                            readonly flushIntervalMs: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly cacheTrace: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly filePath: {
                                readonly type: "string";
                            };
                            readonly includeMessages: {
                                readonly type: "boolean";
                            };
                            readonly includePrompt: {
                                readonly type: "boolean";
                            };
                            readonly includeSystem: {
                                readonly type: "boolean";
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly logging: {
                readonly type: "object";
                readonly properties: {
                    readonly level: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                            readonly const: "silent";
                        }, {
                            readonly type: "string";
                            readonly const: "fatal";
                        }, {
                            readonly type: "string";
                            readonly const: "error";
                        }, {
                            readonly type: "string";
                            readonly const: "warn";
                        }, {
                            readonly type: "string";
                            readonly const: "info";
                        }, {
                            readonly type: "string";
                            readonly const: "debug";
                        }, {
                            readonly type: "string";
                            readonly const: "trace";
                        }];
                    };
                    readonly file: {
                        readonly type: "string";
                    };
                    readonly maxFileBytes: {
                        readonly type: "integer";
                        readonly exclusiveMinimum: 0;
                        readonly maximum: 9007199254740991;
                    };
                    readonly consoleLevel: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                            readonly const: "silent";
                        }, {
                            readonly type: "string";
                            readonly const: "fatal";
                        }, {
                            readonly type: "string";
                            readonly const: "error";
                        }, {
                            readonly type: "string";
                            readonly const: "warn";
                        }, {
                            readonly type: "string";
                            readonly const: "info";
                        }, {
                            readonly type: "string";
                            readonly const: "debug";
                        }, {
                            readonly type: "string";
                            readonly const: "trace";
                        }];
                    };
                    readonly consoleStyle: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                            readonly const: "pretty";
                        }, {
                            readonly type: "string";
                            readonly const: "compact";
                        }, {
                            readonly type: "string";
                            readonly const: "json";
                        }];
                    };
                    readonly redactSensitive: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                            readonly const: "off";
                        }, {
                            readonly type: "string";
                            readonly const: "tools";
                        }];
                    };
                    readonly redactPatterns: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                };
                readonly additionalProperties: false;
            };
            readonly cli: {
                readonly type: "object";
                readonly properties: {
                    readonly banner: {
                        readonly type: "object";
                        readonly properties: {
                            readonly taglineMode: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "random";
                                }, {
                                    readonly type: "string";
                                    readonly const: "default";
                                }, {
                                    readonly type: "string";
                                    readonly const: "off";
                                }];
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly update: {
                readonly type: "object";
                readonly properties: {
                    readonly channel: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                            readonly const: "stable";
                        }, {
                            readonly type: "string";
                            readonly const: "beta";
                        }, {
                            readonly type: "string";
                            readonly const: "dev";
                        }];
                    };
                    readonly checkOnStart: {
                        readonly type: "boolean";
                    };
                    readonly auto: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly stableDelayHours: {
                                readonly type: "number";
                                readonly minimum: 0;
                                readonly maximum: 168;
                            };
                            readonly stableJitterHours: {
                                readonly type: "number";
                                readonly minimum: 0;
                                readonly maximum: 168;
                            };
                            readonly betaCheckIntervalHours: {
                                readonly type: "number";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 24;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly browser: {
                readonly type: "object";
                readonly properties: {
                    readonly enabled: {
                        readonly type: "boolean";
                    };
                    readonly evaluateEnabled: {
                        readonly type: "boolean";
                    };
                    readonly cdpUrl: {
                        readonly type: "string";
                    };
                    readonly remoteCdpTimeoutMs: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly maximum: 9007199254740991;
                    };
                    readonly remoteCdpHandshakeTimeoutMs: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly maximum: 9007199254740991;
                    };
                    readonly color: {
                        readonly type: "string";
                    };
                    readonly executablePath: {
                        readonly type: "string";
                    };
                    readonly headless: {
                        readonly type: "boolean";
                    };
                    readonly noSandbox: {
                        readonly type: "boolean";
                    };
                    readonly attachOnly: {
                        readonly type: "boolean";
                    };
                    readonly cdpPortRangeStart: {
                        readonly type: "integer";
                        readonly minimum: 1;
                        readonly maximum: 65535;
                    };
                    readonly defaultProfile: {
                        readonly type: "string";
                    };
                    readonly snapshotDefaults: {
                        readonly type: "object";
                        readonly properties: {
                            readonly mode: {
                                readonly type: "string";
                                readonly const: "efficient";
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly ssrfPolicy: {
                        readonly type: "object";
                        readonly properties: {
                            readonly allowPrivateNetwork: {
                                readonly type: "boolean";
                            };
                            readonly dangerouslyAllowPrivateNetwork: {
                                readonly type: "boolean";
                            };
                            readonly allowedHostnames: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly hostnameAllowlist: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly profiles: {
                        readonly type: "object";
                        readonly propertyNames: {
                            readonly type: "string";
                            readonly pattern: "^[a-z0-9-]+$";
                        };
                        readonly additionalProperties: {
                            readonly type: "object";
                            readonly properties: {
                                readonly cdpPort: {
                                    readonly type: "integer";
                                    readonly minimum: 1;
                                    readonly maximum: 65535;
                                };
                                readonly cdpUrl: {
                                    readonly type: "string";
                                };
                                readonly userDataDir: {
                                    readonly type: "string";
                                };
                                readonly driver: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                        readonly const: "openclaw";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "clawd";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "existing-session";
                                    }];
                                };
                                readonly attachOnly: {
                                    readonly type: "boolean";
                                };
                                readonly color: {
                                    readonly type: "string";
                                    readonly pattern: "^#?[0-9a-fA-F]{6}$";
                                };
                            };
                            readonly required: readonly ["color"];
                            readonly additionalProperties: false;
                        };
                    };
                    readonly extraArgs: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                };
                readonly additionalProperties: false;
            };
            readonly ui: {
                readonly type: "object";
                readonly properties: {
                    readonly seamColor: {
                        readonly type: "string";
                        readonly pattern: "^#?[0-9a-fA-F]{6}$";
                    };
                    readonly assistant: {
                        readonly type: "object";
                        readonly properties: {
                            readonly name: {
                                readonly type: "string";
                                readonly maxLength: 50;
                            };
                            readonly avatar: {
                                readonly type: "string";
                                readonly maxLength: 200;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly secrets: {
                readonly type: "object";
                readonly properties: {
                    readonly providers: {
                        readonly type: "object";
                        readonly properties: {};
                        readonly additionalProperties: {
                            readonly oneOf: readonly [{
                                readonly type: "object";
                                readonly properties: {
                                    readonly source: {
                                        readonly type: "string";
                                        readonly const: "env";
                                    };
                                    readonly allowlist: {
                                        readonly maxItems: 256;
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                            readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                        };
                                    };
                                };
                                readonly required: readonly ["source"];
                                readonly additionalProperties: false;
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly source: {
                                        readonly type: "string";
                                        readonly const: "file";
                                    };
                                    readonly path: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                    };
                                    readonly mode: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "singleValue";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "json";
                                        }];
                                    };
                                    readonly timeoutMs: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 120000;
                                    };
                                    readonly maxBytes: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 20971520;
                                    };
                                };
                                readonly required: readonly ["source", "path"];
                                readonly additionalProperties: false;
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly source: {
                                        readonly type: "string";
                                        readonly const: "exec";
                                    };
                                    readonly command: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                    };
                                    readonly args: {
                                        readonly maxItems: 128;
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                            readonly maxLength: 1024;
                                        };
                                    };
                                    readonly timeoutMs: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 120000;
                                    };
                                    readonly noOutputTimeoutMs: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 120000;
                                    };
                                    readonly maxOutputBytes: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 20971520;
                                    };
                                    readonly jsonOnly: {
                                        readonly type: "boolean";
                                    };
                                    readonly env: {
                                        readonly type: "object";
                                        readonly propertyNames: {
                                            readonly type: "string";
                                        };
                                        readonly additionalProperties: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly passEnv: {
                                        readonly maxItems: 128;
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                            readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                        };
                                    };
                                    readonly trustedDirs: {
                                        readonly maxItems: 64;
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                            readonly minLength: 1;
                                        };
                                    };
                                    readonly allowInsecurePath: {
                                        readonly type: "boolean";
                                    };
                                    readonly allowSymlinkCommand: {
                                        readonly type: "boolean";
                                    };
                                };
                                readonly required: readonly ["source", "command"];
                                readonly additionalProperties: false;
                            }];
                        };
                    };
                    readonly defaults: {
                        readonly type: "object";
                        readonly properties: {
                            readonly env: {
                                readonly type: "string";
                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                            };
                            readonly file: {
                                readonly type: "string";
                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                            };
                            readonly exec: {
                                readonly type: "string";
                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly resolution: {
                        readonly type: "object";
                        readonly properties: {
                            readonly maxProviderConcurrency: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 16;
                            };
                            readonly maxRefsPerProvider: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 4096;
                            };
                            readonly maxBatchBytes: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 5242880;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly auth: {
                readonly type: "object";
                readonly properties: {
                    readonly profiles: {
                        readonly type: "object";
                        readonly propertyNames: {
                            readonly type: "string";
                        };
                        readonly additionalProperties: {
                            readonly type: "object";
                            readonly properties: {
                                readonly provider: {
                                    readonly type: "string";
                                };
                                readonly mode: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                        readonly const: "api_key";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "oauth";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "token";
                                    }];
                                };
                                readonly email: {
                                    readonly type: "string";
                                };
                                readonly displayName: {
                                    readonly type: "string";
                                };
                            };
                            readonly required: readonly ["provider", "mode"];
                            readonly additionalProperties: false;
                        };
                    };
                    readonly order: {
                        readonly type: "object";
                        readonly propertyNames: {
                            readonly type: "string";
                        };
                        readonly additionalProperties: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                    };
                    readonly cooldowns: {
                        readonly type: "object";
                        readonly properties: {
                            readonly billingBackoffHours: {
                                readonly type: "number";
                                readonly exclusiveMinimum: 0;
                            };
                            readonly billingBackoffHoursByProvider: {
                                readonly type: "object";
                                readonly propertyNames: {
                                    readonly type: "string";
                                };
                                readonly additionalProperties: {
                                    readonly type: "number";
                                    readonly exclusiveMinimum: 0;
                                };
                            };
                            readonly billingMaxHours: {
                                readonly type: "number";
                                readonly exclusiveMinimum: 0;
                            };
                            readonly failureWindowHours: {
                                readonly type: "number";
                                readonly exclusiveMinimum: 0;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly acp: {
                readonly type: "object";
                readonly properties: {
                    readonly enabled: {
                        readonly type: "boolean";
                    };
                    readonly dispatch: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly backend: {
                        readonly type: "string";
                    };
                    readonly defaultAgent: {
                        readonly type: "string";
                    };
                    readonly allowedAgents: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly maxConcurrentSessions: {
                        readonly type: "integer";
                        readonly exclusiveMinimum: 0;
                        readonly maximum: 9007199254740991;
                    };
                    readonly stream: {
                        readonly type: "object";
                        readonly properties: {
                            readonly coalesceIdleMs: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly maxChunkChars: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly repeatSuppression: {
                                readonly type: "boolean";
                            };
                            readonly deliveryMode: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "live";
                                }, {
                                    readonly type: "string";
                                    readonly const: "final_only";
                                }];
                            };
                            readonly hiddenBoundarySeparator: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "none";
                                }, {
                                    readonly type: "string";
                                    readonly const: "space";
                                }, {
                                    readonly type: "string";
                                    readonly const: "newline";
                                }, {
                                    readonly type: "string";
                                    readonly const: "paragraph";
                                }];
                            };
                            readonly maxOutputChars: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly maxSessionUpdateChars: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly tagVisibility: {
                                readonly type: "object";
                                readonly propertyNames: {
                                    readonly type: "string";
                                };
                                readonly additionalProperties: {
                                    readonly type: "boolean";
                                };
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly runtime: {
                        readonly type: "object";
                        readonly properties: {
                            readonly ttlMinutes: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly installCommand: {
                                readonly type: "string";
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly models: {
                readonly type: "object";
                readonly properties: {
                    readonly mode: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                            readonly const: "merge";
                        }, {
                            readonly type: "string";
                            readonly const: "replace";
                        }];
                    };
                    readonly providers: {
                        readonly type: "object";
                        readonly propertyNames: {
                            readonly type: "string";
                        };
                        readonly additionalProperties: {
                            readonly type: "object";
                            readonly properties: {
                                readonly baseUrl: {
                                    readonly type: "string";
                                    readonly minLength: 1;
                                };
                                readonly apiKey: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                    }, {
                                        readonly oneOf: readonly [{
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly source: {
                                                    readonly type: "string";
                                                    readonly const: "env";
                                                };
                                                readonly provider: {
                                                    readonly type: "string";
                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                };
                                                readonly id: {
                                                    readonly type: "string";
                                                    readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                };
                                            };
                                            readonly required: readonly ["source", "provider", "id"];
                                            readonly additionalProperties: false;
                                        }, {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly source: {
                                                    readonly type: "string";
                                                    readonly const: "file";
                                                };
                                                readonly provider: {
                                                    readonly type: "string";
                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                };
                                                readonly id: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly required: readonly ["source", "provider", "id"];
                                            readonly additionalProperties: false;
                                        }, {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly source: {
                                                    readonly type: "string";
                                                    readonly const: "exec";
                                                };
                                                readonly provider: {
                                                    readonly type: "string";
                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                };
                                                readonly id: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly required: readonly ["source", "provider", "id"];
                                            readonly additionalProperties: false;
                                        }];
                                    }];
                                };
                                readonly auth: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                        readonly const: "api-key";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "aws-sdk";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "oauth";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "token";
                                    }];
                                };
                                readonly api: {
                                    readonly type: "string";
                                    readonly enum: readonly ["openai-completions", "openai-responses", "openai-codex-responses", "anthropic-messages", "google-generative-ai", "github-copilot", "bedrock-converse-stream", "ollama"];
                                };
                                readonly injectNumCtxForOpenAICompat: {
                                    readonly type: "boolean";
                                };
                                readonly headers: {
                                    readonly type: "object";
                                    readonly propertyNames: {
                                        readonly type: "string";
                                    };
                                    readonly additionalProperties: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                        }, {
                                            readonly oneOf: readonly [{
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly source: {
                                                        readonly type: "string";
                                                        readonly const: "env";
                                                    };
                                                    readonly provider: {
                                                        readonly type: "string";
                                                        readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                    };
                                                    readonly id: {
                                                        readonly type: "string";
                                                        readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                    };
                                                };
                                                readonly required: readonly ["source", "provider", "id"];
                                                readonly additionalProperties: false;
                                            }, {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly source: {
                                                        readonly type: "string";
                                                        readonly const: "file";
                                                    };
                                                    readonly provider: {
                                                        readonly type: "string";
                                                        readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                    };
                                                    readonly id: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly required: readonly ["source", "provider", "id"];
                                                readonly additionalProperties: false;
                                            }, {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly source: {
                                                        readonly type: "string";
                                                        readonly const: "exec";
                                                    };
                                                    readonly provider: {
                                                        readonly type: "string";
                                                        readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                    };
                                                    readonly id: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly required: readonly ["source", "provider", "id"];
                                                readonly additionalProperties: false;
                                            }];
                                        }];
                                    };
                                };
                                readonly authHeader: {
                                    readonly type: "boolean";
                                };
                                readonly models: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly id: {
                                                readonly type: "string";
                                                readonly minLength: 1;
                                            };
                                            readonly name: {
                                                readonly type: "string";
                                                readonly minLength: 1;
                                            };
                                            readonly api: {
                                                readonly type: "string";
                                                readonly enum: readonly ["openai-completions", "openai-responses", "openai-codex-responses", "anthropic-messages", "google-generative-ai", "github-copilot", "bedrock-converse-stream", "ollama"];
                                            };
                                            readonly reasoning: {
                                                readonly type: "boolean";
                                            };
                                            readonly input: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                        readonly const: "text";
                                                    }, {
                                                        readonly type: "string";
                                                        readonly const: "image";
                                                    }];
                                                };
                                            };
                                            readonly cost: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly input: {
                                                        readonly type: "number";
                                                    };
                                                    readonly output: {
                                                        readonly type: "number";
                                                    };
                                                    readonly cacheRead: {
                                                        readonly type: "number";
                                                    };
                                                    readonly cacheWrite: {
                                                        readonly type: "number";
                                                    };
                                                };
                                                readonly additionalProperties: false;
                                            };
                                            readonly contextWindow: {
                                                readonly type: "number";
                                                readonly exclusiveMinimum: 0;
                                            };
                                            readonly maxTokens: {
                                                readonly type: "number";
                                                readonly exclusiveMinimum: 0;
                                            };
                                            readonly headers: {
                                                readonly type: "object";
                                                readonly propertyNames: {
                                                    readonly type: "string";
                                                };
                                                readonly additionalProperties: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly compat: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly supportsStore: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly supportsDeveloperRole: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly supportsReasoningEffort: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly supportsUsageInStreaming: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly supportsTools: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly supportsStrictMode: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly maxTokensField: {
                                                        readonly anyOf: readonly [{
                                                            readonly type: "string";
                                                            readonly const: "max_completion_tokens";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "max_tokens";
                                                        }];
                                                    };
                                                    readonly thinkingFormat: {
                                                        readonly anyOf: readonly [{
                                                            readonly type: "string";
                                                            readonly const: "openai";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "openrouter";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "zai";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "qwen";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "qwen-chat-template";
                                                        }];
                                                    };
                                                    readonly requiresToolResultName: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly requiresAssistantAfterToolResult: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly requiresThinkingAsText: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly toolSchemaProfile: {
                                                        readonly type: "string";
                                                    };
                                                    readonly unsupportedToolSchemaKeywords: {
                                                        readonly type: "array";
                                                        readonly items: {
                                                            readonly type: "string";
                                                            readonly minLength: 1;
                                                        };
                                                    };
                                                    readonly nativeWebSearchTool: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly toolCallArgumentsEncoding: {
                                                        readonly type: "string";
                                                    };
                                                    readonly requiresMistralToolIds: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly requiresOpenAiAnthropicToolPayload: {
                                                        readonly type: "boolean";
                                                    };
                                                };
                                                readonly additionalProperties: false;
                                            };
                                        };
                                        readonly required: readonly ["id", "name"];
                                        readonly additionalProperties: false;
                                    };
                                };
                            };
                            readonly required: readonly ["baseUrl", "models"];
                            readonly additionalProperties: false;
                        };
                    };
                    readonly bedrockDiscovery: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly region: {
                                readonly type: "string";
                            };
                            readonly providerFilter: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly refreshInterval: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly defaultContextWindow: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly defaultMaxTokens: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly nodeHost: {
                readonly type: "object";
                readonly properties: {
                    readonly browserProxy: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly allowProfiles: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly agents: {
                readonly type: "object";
                readonly properties: {
                    readonly defaults: {
                        readonly type: "object";
                        readonly properties: {
                            readonly model: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                }, {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly primary: {
                                            readonly type: "string";
                                        };
                                        readonly fallbacks: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly additionalProperties: false;
                                }];
                            };
                            readonly imageModel: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                }, {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly primary: {
                                            readonly type: "string";
                                        };
                                        readonly fallbacks: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly additionalProperties: false;
                                }];
                            };
                            readonly imageGenerationModel: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                }, {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly primary: {
                                            readonly type: "string";
                                        };
                                        readonly fallbacks: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly additionalProperties: false;
                                }];
                            };
                            readonly pdfModel: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                }, {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly primary: {
                                            readonly type: "string";
                                        };
                                        readonly fallbacks: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly additionalProperties: false;
                                }];
                            };
                            readonly pdfMaxBytesMb: {
                                readonly type: "number";
                                readonly exclusiveMinimum: 0;
                            };
                            readonly pdfMaxPages: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly models: {
                                readonly type: "object";
                                readonly propertyNames: {
                                    readonly type: "string";
                                };
                                readonly additionalProperties: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly alias: {
                                            readonly type: "string";
                                        };
                                        readonly params: {
                                            readonly type: "object";
                                            readonly propertyNames: {
                                                readonly type: "string";
                                            };
                                            readonly additionalProperties: {};
                                        };
                                        readonly streaming: {
                                            readonly type: "boolean";
                                        };
                                    };
                                    readonly additionalProperties: false;
                                };
                            };
                            readonly workspace: {
                                readonly type: "string";
                            };
                            readonly repoRoot: {
                                readonly type: "string";
                            };
                            readonly skipBootstrap: {
                                readonly type: "boolean";
                            };
                            readonly bootstrapMaxChars: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly bootstrapTotalMaxChars: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly bootstrapPromptTruncationWarning: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "off";
                                }, {
                                    readonly type: "string";
                                    readonly const: "once";
                                }, {
                                    readonly type: "string";
                                    readonly const: "always";
                                }];
                            };
                            readonly userTimezone: {
                                readonly type: "string";
                            };
                            readonly timeFormat: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "auto";
                                }, {
                                    readonly type: "string";
                                    readonly const: "12";
                                }, {
                                    readonly type: "string";
                                    readonly const: "24";
                                }];
                            };
                            readonly envelopeTimezone: {
                                readonly type: "string";
                            };
                            readonly envelopeTimestamp: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "on";
                                }, {
                                    readonly type: "string";
                                    readonly const: "off";
                                }];
                            };
                            readonly envelopeElapsed: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "on";
                                }, {
                                    readonly type: "string";
                                    readonly const: "off";
                                }];
                            };
                            readonly contextTokens: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly cliBackends: {
                                readonly type: "object";
                                readonly propertyNames: {
                                    readonly type: "string";
                                };
                                readonly additionalProperties: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly command: {
                                            readonly type: "string";
                                        };
                                        readonly args: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly output: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "json";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "text";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "jsonl";
                                            }];
                                        };
                                        readonly resumeOutput: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "json";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "text";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "jsonl";
                                            }];
                                        };
                                        readonly input: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "arg";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "stdin";
                                            }];
                                        };
                                        readonly maxPromptArgChars: {
                                            readonly type: "integer";
                                            readonly exclusiveMinimum: 0;
                                            readonly maximum: 9007199254740991;
                                        };
                                        readonly env: {
                                            readonly type: "object";
                                            readonly propertyNames: {
                                                readonly type: "string";
                                            };
                                            readonly additionalProperties: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly clearEnv: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly modelArg: {
                                            readonly type: "string";
                                        };
                                        readonly modelAliases: {
                                            readonly type: "object";
                                            readonly propertyNames: {
                                                readonly type: "string";
                                            };
                                            readonly additionalProperties: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly sessionArg: {
                                            readonly type: "string";
                                        };
                                        readonly sessionArgs: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly resumeArgs: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly sessionMode: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "always";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "existing";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "none";
                                            }];
                                        };
                                        readonly sessionIdFields: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly systemPromptArg: {
                                            readonly type: "string";
                                        };
                                        readonly systemPromptMode: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "append";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "replace";
                                            }];
                                        };
                                        readonly systemPromptWhen: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "first";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "always";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "never";
                                            }];
                                        };
                                        readonly imageArg: {
                                            readonly type: "string";
                                        };
                                        readonly imageMode: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "repeat";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "list";
                                            }];
                                        };
                                        readonly serialize: {
                                            readonly type: "boolean";
                                        };
                                        readonly reliability: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly watchdog: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly fresh: {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly noOutputTimeoutMs: {
                                                                    readonly type: "integer";
                                                                    readonly minimum: 1000;
                                                                    readonly maximum: 9007199254740991;
                                                                };
                                                                readonly noOutputTimeoutRatio: {
                                                                    readonly type: "number";
                                                                    readonly minimum: 0.05;
                                                                    readonly maximum: 0.95;
                                                                };
                                                                readonly minMs: {
                                                                    readonly type: "integer";
                                                                    readonly minimum: 1000;
                                                                    readonly maximum: 9007199254740991;
                                                                };
                                                                readonly maxMs: {
                                                                    readonly type: "integer";
                                                                    readonly minimum: 1000;
                                                                    readonly maximum: 9007199254740991;
                                                                };
                                                            };
                                                            readonly additionalProperties: false;
                                                        };
                                                        readonly resume: {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly noOutputTimeoutMs: {
                                                                    readonly type: "integer";
                                                                    readonly minimum: 1000;
                                                                    readonly maximum: 9007199254740991;
                                                                };
                                                                readonly noOutputTimeoutRatio: {
                                                                    readonly type: "number";
                                                                    readonly minimum: 0.05;
                                                                    readonly maximum: 0.95;
                                                                };
                                                                readonly minMs: {
                                                                    readonly type: "integer";
                                                                    readonly minimum: 1000;
                                                                    readonly maximum: 9007199254740991;
                                                                };
                                                                readonly maxMs: {
                                                                    readonly type: "integer";
                                                                    readonly minimum: 1000;
                                                                    readonly maximum: 9007199254740991;
                                                                };
                                                            };
                                                            readonly additionalProperties: false;
                                                        };
                                                    };
                                                    readonly additionalProperties: false;
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                    };
                                    readonly required: readonly ["command"];
                                    readonly additionalProperties: false;
                                };
                            };
                            readonly memorySearch: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly enabled: {
                                        readonly type: "boolean";
                                    };
                                    readonly sources: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "memory";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "sessions";
                                            }];
                                        };
                                    };
                                    readonly extraPaths: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly multimodal: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly enabled: {
                                                readonly type: "boolean";
                                            };
                                            readonly modalities: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                        readonly const: "image";
                                                    }, {
                                                        readonly type: "string";
                                                        readonly const: "audio";
                                                    }, {
                                                        readonly type: "string";
                                                        readonly const: "all";
                                                    }];
                                                };
                                            };
                                            readonly maxFileBytes: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly experimental: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly sessionMemory: {
                                                readonly type: "boolean";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly provider: {
                                        readonly type: "string";
                                    };
                                    readonly remote: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly baseUrl: {
                                                readonly type: "string";
                                            };
                                            readonly apiKey: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly oneOf: readonly [{
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "env";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "file";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "exec";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }];
                                                }];
                                            };
                                            readonly headers: {
                                                readonly type: "object";
                                                readonly propertyNames: {
                                                    readonly type: "string";
                                                };
                                                readonly additionalProperties: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly batch: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly enabled: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly wait: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly concurrency: {
                                                        readonly type: "integer";
                                                        readonly exclusiveMinimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                    readonly pollIntervalMs: {
                                                        readonly type: "integer";
                                                        readonly minimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                    readonly timeoutMinutes: {
                                                        readonly type: "integer";
                                                        readonly exclusiveMinimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                };
                                                readonly additionalProperties: false;
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly fallback: {
                                        readonly type: "string";
                                    };
                                    readonly model: {
                                        readonly type: "string";
                                    };
                                    readonly outputDimensionality: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly local: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly modelPath: {
                                                readonly type: "string";
                                            };
                                            readonly modelCacheDir: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly store: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly driver: {
                                                readonly type: "string";
                                                readonly const: "sqlite";
                                            };
                                            readonly path: {
                                                readonly type: "string";
                                            };
                                            readonly vector: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly enabled: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly extensionPath: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly additionalProperties: false;
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly chunking: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly tokens: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly overlap: {
                                                readonly type: "integer";
                                                readonly minimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly sync: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly onSessionStart: {
                                                readonly type: "boolean";
                                            };
                                            readonly onSearch: {
                                                readonly type: "boolean";
                                            };
                                            readonly watch: {
                                                readonly type: "boolean";
                                            };
                                            readonly watchDebounceMs: {
                                                readonly type: "integer";
                                                readonly minimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly intervalMinutes: {
                                                readonly type: "integer";
                                                readonly minimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly sessions: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly deltaBytes: {
                                                        readonly type: "integer";
                                                        readonly minimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                    readonly deltaMessages: {
                                                        readonly type: "integer";
                                                        readonly minimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                    readonly postCompactionForce: {
                                                        readonly type: "boolean";
                                                    };
                                                };
                                                readonly additionalProperties: false;
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly query: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly maxResults: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly minScore: {
                                                readonly type: "number";
                                                readonly minimum: 0;
                                                readonly maximum: 1;
                                            };
                                            readonly hybrid: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly enabled: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly vectorWeight: {
                                                        readonly type: "number";
                                                        readonly minimum: 0;
                                                        readonly maximum: 1;
                                                    };
                                                    readonly textWeight: {
                                                        readonly type: "number";
                                                        readonly minimum: 0;
                                                        readonly maximum: 1;
                                                    };
                                                    readonly candidateMultiplier: {
                                                        readonly type: "integer";
                                                        readonly exclusiveMinimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                    readonly mmr: {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly enabled: {
                                                                readonly type: "boolean";
                                                            };
                                                            readonly lambda: {
                                                                readonly type: "number";
                                                                readonly minimum: 0;
                                                                readonly maximum: 1;
                                                            };
                                                        };
                                                        readonly additionalProperties: false;
                                                    };
                                                    readonly temporalDecay: {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly enabled: {
                                                                readonly type: "boolean";
                                                            };
                                                            readonly halfLifeDays: {
                                                                readonly type: "integer";
                                                                readonly exclusiveMinimum: 0;
                                                                readonly maximum: 9007199254740991;
                                                            };
                                                        };
                                                        readonly additionalProperties: false;
                                                    };
                                                };
                                                readonly additionalProperties: false;
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly cache: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly enabled: {
                                                readonly type: "boolean";
                                            };
                                            readonly maxEntries: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly contextPruning: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly mode: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "off";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "cache-ttl";
                                        }];
                                    };
                                    readonly ttl: {
                                        readonly type: "string";
                                    };
                                    readonly keepLastAssistants: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly softTrimRatio: {
                                        readonly type: "number";
                                        readonly minimum: 0;
                                        readonly maximum: 1;
                                    };
                                    readonly hardClearRatio: {
                                        readonly type: "number";
                                        readonly minimum: 0;
                                        readonly maximum: 1;
                                    };
                                    readonly minPrunableToolChars: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly tools: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly allow: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly deny: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly softTrim: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly maxChars: {
                                                readonly type: "integer";
                                                readonly minimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly headChars: {
                                                readonly type: "integer";
                                                readonly minimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly tailChars: {
                                                readonly type: "integer";
                                                readonly minimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly hardClear: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly enabled: {
                                                readonly type: "boolean";
                                            };
                                            readonly placeholder: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly compaction: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly mode: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "default";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "safeguard";
                                        }];
                                    };
                                    readonly reserveTokens: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly keepRecentTokens: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly reserveTokensFloor: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly maxHistoryShare: {
                                        readonly type: "number";
                                        readonly minimum: 0.1;
                                        readonly maximum: 0.9;
                                    };
                                    readonly customInstructions: {
                                        readonly type: "string";
                                    };
                                    readonly identifierPolicy: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "strict";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "off";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "custom";
                                        }];
                                    };
                                    readonly identifierInstructions: {
                                        readonly type: "string";
                                    };
                                    readonly recentTurnsPreserve: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 12;
                                    };
                                    readonly qualityGuard: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly enabled: {
                                                readonly type: "boolean";
                                            };
                                            readonly maxRetries: {
                                                readonly type: "integer";
                                                readonly minimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly postIndexSync: {
                                        readonly type: "string";
                                        readonly enum: readonly ["off", "async", "await"];
                                    };
                                    readonly postCompactionSections: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly model: {
                                        readonly type: "string";
                                    };
                                    readonly timeoutSeconds: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly memoryFlush: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly enabled: {
                                                readonly type: "boolean";
                                            };
                                            readonly softThresholdTokens: {
                                                readonly type: "integer";
                                                readonly minimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly forceFlushTranscriptBytes: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "integer";
                                                    readonly minimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                }, {
                                                    readonly type: "string";
                                                }];
                                            };
                                            readonly prompt: {
                                                readonly type: "string";
                                            };
                                            readonly systemPrompt: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly embeddedPi: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly projectSettingsPolicy: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "trusted";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "sanitize";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "ignore";
                                        }];
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly thinkingDefault: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "off";
                                }, {
                                    readonly type: "string";
                                    readonly const: "minimal";
                                }, {
                                    readonly type: "string";
                                    readonly const: "low";
                                }, {
                                    readonly type: "string";
                                    readonly const: "medium";
                                }, {
                                    readonly type: "string";
                                    readonly const: "high";
                                }, {
                                    readonly type: "string";
                                    readonly const: "xhigh";
                                }, {
                                    readonly type: "string";
                                    readonly const: "adaptive";
                                }];
                            };
                            readonly verboseDefault: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "off";
                                }, {
                                    readonly type: "string";
                                    readonly const: "on";
                                }, {
                                    readonly type: "string";
                                    readonly const: "full";
                                }];
                            };
                            readonly elevatedDefault: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "off";
                                }, {
                                    readonly type: "string";
                                    readonly const: "on";
                                }, {
                                    readonly type: "string";
                                    readonly const: "ask";
                                }, {
                                    readonly type: "string";
                                    readonly const: "full";
                                }];
                            };
                            readonly blockStreamingDefault: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "off";
                                }, {
                                    readonly type: "string";
                                    readonly const: "on";
                                }];
                            };
                            readonly blockStreamingBreak: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "text_end";
                                }, {
                                    readonly type: "string";
                                    readonly const: "message_end";
                                }];
                            };
                            readonly blockStreamingChunk: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly minChars: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly maxChars: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly breakPreference: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "paragraph";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "newline";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "sentence";
                                        }];
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly blockStreamingCoalesce: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly minChars: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly maxChars: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly idleMs: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly humanDelay: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly mode: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "off";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "natural";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "custom";
                                        }];
                                    };
                                    readonly minMs: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly maxMs: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly timeoutSeconds: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly mediaMaxMb: {
                                readonly type: "number";
                                readonly exclusiveMinimum: 0;
                            };
                            readonly imageMaxDimensionPx: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly typingIntervalSeconds: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly typingMode: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "never";
                                }, {
                                    readonly type: "string";
                                    readonly const: "instant";
                                }, {
                                    readonly type: "string";
                                    readonly const: "thinking";
                                }, {
                                    readonly type: "string";
                                    readonly const: "message";
                                }];
                            };
                            readonly heartbeat: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly every: {
                                        readonly type: "string";
                                    };
                                    readonly activeHours: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly start: {
                                                readonly type: "string";
                                            };
                                            readonly end: {
                                                readonly type: "string";
                                            };
                                            readonly timezone: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly model: {
                                        readonly type: "string";
                                    };
                                    readonly session: {
                                        readonly type: "string";
                                    };
                                    readonly includeReasoning: {
                                        readonly type: "boolean";
                                    };
                                    readonly target: {
                                        readonly type: "string";
                                    };
                                    readonly directPolicy: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "allow";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "block";
                                        }];
                                    };
                                    readonly to: {
                                        readonly type: "string";
                                    };
                                    readonly accountId: {
                                        readonly type: "string";
                                    };
                                    readonly prompt: {
                                        readonly type: "string";
                                    };
                                    readonly ackMaxChars: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly suppressToolErrorWarnings: {
                                        readonly type: "boolean";
                                    };
                                    readonly lightContext: {
                                        readonly type: "boolean";
                                    };
                                    readonly isolatedSession: {
                                        readonly type: "boolean";
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly maxConcurrent: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly subagents: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly maxConcurrent: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly maxSpawnDepth: {
                                        readonly description: "Maximum nesting depth for sub-agent spawning. 1 = no nesting (default), 2 = sub-agents can spawn sub-sub-agents.";
                                        readonly type: "integer";
                                        readonly minimum: 1;
                                        readonly maximum: 5;
                                    };
                                    readonly maxChildrenPerAgent: {
                                        readonly description: "Maximum number of active children a single agent session can spawn (default: 5).";
                                        readonly type: "integer";
                                        readonly minimum: 1;
                                        readonly maximum: 20;
                                    };
                                    readonly archiveAfterMinutes: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly model: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                        }, {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly primary: {
                                                    readonly type: "string";
                                                };
                                                readonly fallbacks: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        }];
                                    };
                                    readonly thinking: {
                                        readonly type: "string";
                                    };
                                    readonly runTimeoutSeconds: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly announceTimeoutMs: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly sandbox: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly mode: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "off";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "non-main";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "all";
                                        }];
                                    };
                                    readonly backend: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                    };
                                    readonly workspaceAccess: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "none";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "ro";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "rw";
                                        }];
                                    };
                                    readonly sessionToolsVisibility: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "spawned";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "all";
                                        }];
                                    };
                                    readonly scope: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "session";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "agent";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "shared";
                                        }];
                                    };
                                    readonly perSession: {
                                        readonly type: "boolean";
                                    };
                                    readonly workspaceRoot: {
                                        readonly type: "string";
                                    };
                                    readonly docker: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly image: {
                                                readonly type: "string";
                                            };
                                            readonly containerPrefix: {
                                                readonly type: "string";
                                            };
                                            readonly workdir: {
                                                readonly type: "string";
                                            };
                                            readonly readOnlyRoot: {
                                                readonly type: "boolean";
                                            };
                                            readonly tmpfs: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly network: {
                                                readonly type: "string";
                                            };
                                            readonly user: {
                                                readonly type: "string";
                                            };
                                            readonly capDrop: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly env: {
                                                readonly type: "object";
                                                readonly propertyNames: {
                                                    readonly type: "string";
                                                };
                                                readonly additionalProperties: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly setupCommand: {};
                                            readonly pidsLimit: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly memory: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly type: "number";
                                                }];
                                            };
                                            readonly memorySwap: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly type: "number";
                                                }];
                                            };
                                            readonly cpus: {
                                                readonly type: "number";
                                                readonly exclusiveMinimum: 0;
                                            };
                                            readonly ulimits: {
                                                readonly type: "object";
                                                readonly propertyNames: {
                                                    readonly type: "string";
                                                };
                                                readonly additionalProperties: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                    }, {
                                                        readonly type: "number";
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly soft: {
                                                                readonly type: "integer";
                                                                readonly minimum: 0;
                                                                readonly maximum: 9007199254740991;
                                                            };
                                                            readonly hard: {
                                                                readonly type: "integer";
                                                                readonly minimum: 0;
                                                                readonly maximum: 9007199254740991;
                                                            };
                                                        };
                                                        readonly additionalProperties: false;
                                                    }];
                                                };
                                            };
                                            readonly seccompProfile: {
                                                readonly type: "string";
                                            };
                                            readonly apparmorProfile: {
                                                readonly type: "string";
                                            };
                                            readonly dns: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly extraHosts: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly binds: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly dangerouslyAllowReservedContainerTargets: {
                                                readonly type: "boolean";
                                            };
                                            readonly dangerouslyAllowExternalBindSources: {
                                                readonly type: "boolean";
                                            };
                                            readonly dangerouslyAllowContainerNamespaceJoin: {
                                                readonly type: "boolean";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly ssh: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly target: {
                                                readonly type: "string";
                                                readonly minLength: 1;
                                            };
                                            readonly command: {
                                                readonly type: "string";
                                                readonly minLength: 1;
                                            };
                                            readonly workspaceRoot: {
                                                readonly type: "string";
                                                readonly minLength: 1;
                                            };
                                            readonly strictHostKeyChecking: {
                                                readonly type: "boolean";
                                            };
                                            readonly updateHostKeys: {
                                                readonly type: "boolean";
                                            };
                                            readonly identityFile: {
                                                readonly type: "string";
                                                readonly minLength: 1;
                                            };
                                            readonly certificateFile: {
                                                readonly type: "string";
                                                readonly minLength: 1;
                                            };
                                            readonly knownHostsFile: {
                                                readonly type: "string";
                                                readonly minLength: 1;
                                            };
                                            readonly identityData: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly oneOf: readonly [{
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "env";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "file";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "exec";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }];
                                                }];
                                            };
                                            readonly certificateData: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly oneOf: readonly [{
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "env";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "file";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "exec";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }];
                                                }];
                                            };
                                            readonly knownHostsData: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly oneOf: readonly [{
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "env";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "file";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "exec";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }];
                                                }];
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly browser: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly enabled: {
                                                readonly type: "boolean";
                                            };
                                            readonly image: {
                                                readonly type: "string";
                                            };
                                            readonly containerPrefix: {
                                                readonly type: "string";
                                            };
                                            readonly network: {
                                                readonly type: "string";
                                            };
                                            readonly cdpPort: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly cdpSourceRange: {
                                                readonly type: "string";
                                            };
                                            readonly vncPort: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly noVncPort: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly headless: {
                                                readonly type: "boolean";
                                            };
                                            readonly enableNoVnc: {
                                                readonly type: "boolean";
                                            };
                                            readonly allowHostControl: {
                                                readonly type: "boolean";
                                            };
                                            readonly autoStart: {
                                                readonly type: "boolean";
                                            };
                                            readonly autoStartTimeoutMs: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly binds: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly prune: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly idleHours: {
                                                readonly type: "integer";
                                                readonly minimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly maxAgeDays: {
                                                readonly type: "integer";
                                                readonly minimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly list: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                };
                                readonly default: {
                                    readonly type: "boolean";
                                };
                                readonly name: {
                                    readonly type: "string";
                                };
                                readonly workspace: {
                                    readonly type: "string";
                                };
                                readonly agentDir: {
                                    readonly type: "string";
                                };
                                readonly model: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                    }, {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly primary: {
                                                readonly type: "string";
                                            };
                                            readonly fallbacks: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    }];
                                };
                                readonly thinkingDefault: {
                                    readonly type: "string";
                                    readonly enum: readonly ["off", "minimal", "low", "medium", "high", "xhigh", "adaptive"];
                                };
                                readonly reasoningDefault: {
                                    readonly type: "string";
                                    readonly enum: readonly ["on", "off", "stream"];
                                };
                                readonly fastModeDefault: {
                                    readonly type: "boolean";
                                };
                                readonly skills: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                                readonly memorySearch: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly enabled: {
                                            readonly type: "boolean";
                                        };
                                        readonly sources: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                    readonly const: "memory";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "sessions";
                                                }];
                                            };
                                        };
                                        readonly extraPaths: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly multimodal: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly enabled: {
                                                    readonly type: "boolean";
                                                };
                                                readonly modalities: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly anyOf: readonly [{
                                                            readonly type: "string";
                                                            readonly const: "image";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "audio";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "all";
                                                        }];
                                                    };
                                                };
                                                readonly maxFileBytes: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly experimental: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly sessionMemory: {
                                                    readonly type: "boolean";
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly provider: {
                                            readonly type: "string";
                                        };
                                        readonly remote: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly baseUrl: {
                                                    readonly type: "string";
                                                };
                                                readonly apiKey: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                    }, {
                                                        readonly oneOf: readonly [{
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly source: {
                                                                    readonly type: "string";
                                                                    readonly const: "env";
                                                                };
                                                                readonly provider: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                                };
                                                                readonly id: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                                };
                                                            };
                                                            readonly required: readonly ["source", "provider", "id"];
                                                            readonly additionalProperties: false;
                                                        }, {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly source: {
                                                                    readonly type: "string";
                                                                    readonly const: "file";
                                                                };
                                                                readonly provider: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                                };
                                                                readonly id: {
                                                                    readonly type: "string";
                                                                };
                                                            };
                                                            readonly required: readonly ["source", "provider", "id"];
                                                            readonly additionalProperties: false;
                                                        }, {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly source: {
                                                                    readonly type: "string";
                                                                    readonly const: "exec";
                                                                };
                                                                readonly provider: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                                };
                                                                readonly id: {
                                                                    readonly type: "string";
                                                                };
                                                            };
                                                            readonly required: readonly ["source", "provider", "id"];
                                                            readonly additionalProperties: false;
                                                        }];
                                                    }];
                                                };
                                                readonly headers: {
                                                    readonly type: "object";
                                                    readonly propertyNames: {
                                                        readonly type: "string";
                                                    };
                                                    readonly additionalProperties: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly batch: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly enabled: {
                                                            readonly type: "boolean";
                                                        };
                                                        readonly wait: {
                                                            readonly type: "boolean";
                                                        };
                                                        readonly concurrency: {
                                                            readonly type: "integer";
                                                            readonly exclusiveMinimum: 0;
                                                            readonly maximum: 9007199254740991;
                                                        };
                                                        readonly pollIntervalMs: {
                                                            readonly type: "integer";
                                                            readonly minimum: 0;
                                                            readonly maximum: 9007199254740991;
                                                        };
                                                        readonly timeoutMinutes: {
                                                            readonly type: "integer";
                                                            readonly exclusiveMinimum: 0;
                                                            readonly maximum: 9007199254740991;
                                                        };
                                                    };
                                                    readonly additionalProperties: false;
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly fallback: {
                                            readonly type: "string";
                                        };
                                        readonly model: {
                                            readonly type: "string";
                                        };
                                        readonly outputDimensionality: {
                                            readonly type: "integer";
                                            readonly exclusiveMinimum: 0;
                                            readonly maximum: 9007199254740991;
                                        };
                                        readonly local: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly modelPath: {
                                                    readonly type: "string";
                                                };
                                                readonly modelCacheDir: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly store: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly driver: {
                                                    readonly type: "string";
                                                    readonly const: "sqlite";
                                                };
                                                readonly path: {
                                                    readonly type: "string";
                                                };
                                                readonly vector: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly enabled: {
                                                            readonly type: "boolean";
                                                        };
                                                        readonly extensionPath: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly additionalProperties: false;
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly chunking: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly tokens: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly overlap: {
                                                    readonly type: "integer";
                                                    readonly minimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly sync: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly onSessionStart: {
                                                    readonly type: "boolean";
                                                };
                                                readonly onSearch: {
                                                    readonly type: "boolean";
                                                };
                                                readonly watch: {
                                                    readonly type: "boolean";
                                                };
                                                readonly watchDebounceMs: {
                                                    readonly type: "integer";
                                                    readonly minimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly intervalMinutes: {
                                                    readonly type: "integer";
                                                    readonly minimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly sessions: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly deltaBytes: {
                                                            readonly type: "integer";
                                                            readonly minimum: 0;
                                                            readonly maximum: 9007199254740991;
                                                        };
                                                        readonly deltaMessages: {
                                                            readonly type: "integer";
                                                            readonly minimum: 0;
                                                            readonly maximum: 9007199254740991;
                                                        };
                                                        readonly postCompactionForce: {
                                                            readonly type: "boolean";
                                                        };
                                                    };
                                                    readonly additionalProperties: false;
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly query: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly maxResults: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly minScore: {
                                                    readonly type: "number";
                                                    readonly minimum: 0;
                                                    readonly maximum: 1;
                                                };
                                                readonly hybrid: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly enabled: {
                                                            readonly type: "boolean";
                                                        };
                                                        readonly vectorWeight: {
                                                            readonly type: "number";
                                                            readonly minimum: 0;
                                                            readonly maximum: 1;
                                                        };
                                                        readonly textWeight: {
                                                            readonly type: "number";
                                                            readonly minimum: 0;
                                                            readonly maximum: 1;
                                                        };
                                                        readonly candidateMultiplier: {
                                                            readonly type: "integer";
                                                            readonly exclusiveMinimum: 0;
                                                            readonly maximum: 9007199254740991;
                                                        };
                                                        readonly mmr: {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly enabled: {
                                                                    readonly type: "boolean";
                                                                };
                                                                readonly lambda: {
                                                                    readonly type: "number";
                                                                    readonly minimum: 0;
                                                                    readonly maximum: 1;
                                                                };
                                                            };
                                                            readonly additionalProperties: false;
                                                        };
                                                        readonly temporalDecay: {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly enabled: {
                                                                    readonly type: "boolean";
                                                                };
                                                                readonly halfLifeDays: {
                                                                    readonly type: "integer";
                                                                    readonly exclusiveMinimum: 0;
                                                                    readonly maximum: 9007199254740991;
                                                                };
                                                            };
                                                            readonly additionalProperties: false;
                                                        };
                                                    };
                                                    readonly additionalProperties: false;
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly cache: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly enabled: {
                                                    readonly type: "boolean";
                                                };
                                                readonly maxEntries: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                    };
                                    readonly additionalProperties: false;
                                };
                                readonly humanDelay: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly mode: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "off";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "natural";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "custom";
                                            }];
                                        };
                                        readonly minMs: {
                                            readonly type: "integer";
                                            readonly minimum: 0;
                                            readonly maximum: 9007199254740991;
                                        };
                                        readonly maxMs: {
                                            readonly type: "integer";
                                            readonly minimum: 0;
                                            readonly maximum: 9007199254740991;
                                        };
                                    };
                                    readonly additionalProperties: false;
                                };
                                readonly heartbeat: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly every: {
                                            readonly type: "string";
                                        };
                                        readonly activeHours: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly start: {
                                                    readonly type: "string";
                                                };
                                                readonly end: {
                                                    readonly type: "string";
                                                };
                                                readonly timezone: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly model: {
                                            readonly type: "string";
                                        };
                                        readonly session: {
                                            readonly type: "string";
                                        };
                                        readonly includeReasoning: {
                                            readonly type: "boolean";
                                        };
                                        readonly target: {
                                            readonly type: "string";
                                        };
                                        readonly directPolicy: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "allow";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "block";
                                            }];
                                        };
                                        readonly to: {
                                            readonly type: "string";
                                        };
                                        readonly accountId: {
                                            readonly type: "string";
                                        };
                                        readonly prompt: {
                                            readonly type: "string";
                                        };
                                        readonly ackMaxChars: {
                                            readonly type: "integer";
                                            readonly minimum: 0;
                                            readonly maximum: 9007199254740991;
                                        };
                                        readonly suppressToolErrorWarnings: {
                                            readonly type: "boolean";
                                        };
                                        readonly lightContext: {
                                            readonly type: "boolean";
                                        };
                                        readonly isolatedSession: {
                                            readonly type: "boolean";
                                        };
                                    };
                                    readonly additionalProperties: false;
                                };
                                readonly identity: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly name: {
                                            readonly type: "string";
                                        };
                                        readonly theme: {
                                            readonly type: "string";
                                        };
                                        readonly emoji: {
                                            readonly type: "string";
                                        };
                                        readonly avatar: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly additionalProperties: false;
                                };
                                readonly groupChat: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly mentionPatterns: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly historyLimit: {
                                            readonly type: "integer";
                                            readonly exclusiveMinimum: 0;
                                            readonly maximum: 9007199254740991;
                                        };
                                    };
                                    readonly additionalProperties: false;
                                };
                                readonly subagents: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly allowAgents: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly model: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                            }, {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly primary: {
                                                        readonly type: "string";
                                                    };
                                                    readonly fallbacks: {
                                                        readonly type: "array";
                                                        readonly items: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                };
                                                readonly additionalProperties: false;
                                            }];
                                        };
                                        readonly thinking: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly additionalProperties: false;
                                };
                                readonly sandbox: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly mode: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "off";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "non-main";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "all";
                                            }];
                                        };
                                        readonly backend: {
                                            readonly type: "string";
                                            readonly minLength: 1;
                                        };
                                        readonly workspaceAccess: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "none";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "ro";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "rw";
                                            }];
                                        };
                                        readonly sessionToolsVisibility: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "spawned";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "all";
                                            }];
                                        };
                                        readonly scope: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "session";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "agent";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "shared";
                                            }];
                                        };
                                        readonly perSession: {
                                            readonly type: "boolean";
                                        };
                                        readonly workspaceRoot: {
                                            readonly type: "string";
                                        };
                                        readonly docker: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly image: {
                                                    readonly type: "string";
                                                };
                                                readonly containerPrefix: {
                                                    readonly type: "string";
                                                };
                                                readonly workdir: {
                                                    readonly type: "string";
                                                };
                                                readonly readOnlyRoot: {
                                                    readonly type: "boolean";
                                                };
                                                readonly tmpfs: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly network: {
                                                    readonly type: "string";
                                                };
                                                readonly user: {
                                                    readonly type: "string";
                                                };
                                                readonly capDrop: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly env: {
                                                    readonly type: "object";
                                                    readonly propertyNames: {
                                                        readonly type: "string";
                                                    };
                                                    readonly additionalProperties: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly setupCommand: {};
                                                readonly pidsLimit: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly memory: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                    }, {
                                                        readonly type: "number";
                                                    }];
                                                };
                                                readonly memorySwap: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                    }, {
                                                        readonly type: "number";
                                                    }];
                                                };
                                                readonly cpus: {
                                                    readonly type: "number";
                                                    readonly exclusiveMinimum: 0;
                                                };
                                                readonly ulimits: {
                                                    readonly type: "object";
                                                    readonly propertyNames: {
                                                        readonly type: "string";
                                                    };
                                                    readonly additionalProperties: {
                                                        readonly anyOf: readonly [{
                                                            readonly type: "string";
                                                        }, {
                                                            readonly type: "number";
                                                        }, {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly soft: {
                                                                    readonly type: "integer";
                                                                    readonly minimum: 0;
                                                                    readonly maximum: 9007199254740991;
                                                                };
                                                                readonly hard: {
                                                                    readonly type: "integer";
                                                                    readonly minimum: 0;
                                                                    readonly maximum: 9007199254740991;
                                                                };
                                                            };
                                                            readonly additionalProperties: false;
                                                        }];
                                                    };
                                                };
                                                readonly seccompProfile: {
                                                    readonly type: "string";
                                                };
                                                readonly apparmorProfile: {
                                                    readonly type: "string";
                                                };
                                                readonly dns: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly extraHosts: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly binds: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly dangerouslyAllowReservedContainerTargets: {
                                                    readonly type: "boolean";
                                                };
                                                readonly dangerouslyAllowExternalBindSources: {
                                                    readonly type: "boolean";
                                                };
                                                readonly dangerouslyAllowContainerNamespaceJoin: {
                                                    readonly type: "boolean";
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly ssh: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly target: {
                                                    readonly type: "string";
                                                    readonly minLength: 1;
                                                };
                                                readonly command: {
                                                    readonly type: "string";
                                                    readonly minLength: 1;
                                                };
                                                readonly workspaceRoot: {
                                                    readonly type: "string";
                                                    readonly minLength: 1;
                                                };
                                                readonly strictHostKeyChecking: {
                                                    readonly type: "boolean";
                                                };
                                                readonly updateHostKeys: {
                                                    readonly type: "boolean";
                                                };
                                                readonly identityFile: {
                                                    readonly type: "string";
                                                    readonly minLength: 1;
                                                };
                                                readonly certificateFile: {
                                                    readonly type: "string";
                                                    readonly minLength: 1;
                                                };
                                                readonly knownHostsFile: {
                                                    readonly type: "string";
                                                    readonly minLength: 1;
                                                };
                                                readonly identityData: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                    }, {
                                                        readonly oneOf: readonly [{
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly source: {
                                                                    readonly type: "string";
                                                                    readonly const: "env";
                                                                };
                                                                readonly provider: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                                };
                                                                readonly id: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                                };
                                                            };
                                                            readonly required: readonly ["source", "provider", "id"];
                                                            readonly additionalProperties: false;
                                                        }, {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly source: {
                                                                    readonly type: "string";
                                                                    readonly const: "file";
                                                                };
                                                                readonly provider: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                                };
                                                                readonly id: {
                                                                    readonly type: "string";
                                                                };
                                                            };
                                                            readonly required: readonly ["source", "provider", "id"];
                                                            readonly additionalProperties: false;
                                                        }, {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly source: {
                                                                    readonly type: "string";
                                                                    readonly const: "exec";
                                                                };
                                                                readonly provider: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                                };
                                                                readonly id: {
                                                                    readonly type: "string";
                                                                };
                                                            };
                                                            readonly required: readonly ["source", "provider", "id"];
                                                            readonly additionalProperties: false;
                                                        }];
                                                    }];
                                                };
                                                readonly certificateData: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                    }, {
                                                        readonly oneOf: readonly [{
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly source: {
                                                                    readonly type: "string";
                                                                    readonly const: "env";
                                                                };
                                                                readonly provider: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                                };
                                                                readonly id: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                                };
                                                            };
                                                            readonly required: readonly ["source", "provider", "id"];
                                                            readonly additionalProperties: false;
                                                        }, {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly source: {
                                                                    readonly type: "string";
                                                                    readonly const: "file";
                                                                };
                                                                readonly provider: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                                };
                                                                readonly id: {
                                                                    readonly type: "string";
                                                                };
                                                            };
                                                            readonly required: readonly ["source", "provider", "id"];
                                                            readonly additionalProperties: false;
                                                        }, {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly source: {
                                                                    readonly type: "string";
                                                                    readonly const: "exec";
                                                                };
                                                                readonly provider: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                                };
                                                                readonly id: {
                                                                    readonly type: "string";
                                                                };
                                                            };
                                                            readonly required: readonly ["source", "provider", "id"];
                                                            readonly additionalProperties: false;
                                                        }];
                                                    }];
                                                };
                                                readonly knownHostsData: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                    }, {
                                                        readonly oneOf: readonly [{
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly source: {
                                                                    readonly type: "string";
                                                                    readonly const: "env";
                                                                };
                                                                readonly provider: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                                };
                                                                readonly id: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                                };
                                                            };
                                                            readonly required: readonly ["source", "provider", "id"];
                                                            readonly additionalProperties: false;
                                                        }, {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly source: {
                                                                    readonly type: "string";
                                                                    readonly const: "file";
                                                                };
                                                                readonly provider: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                                };
                                                                readonly id: {
                                                                    readonly type: "string";
                                                                };
                                                            };
                                                            readonly required: readonly ["source", "provider", "id"];
                                                            readonly additionalProperties: false;
                                                        }, {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly source: {
                                                                    readonly type: "string";
                                                                    readonly const: "exec";
                                                                };
                                                                readonly provider: {
                                                                    readonly type: "string";
                                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                                };
                                                                readonly id: {
                                                                    readonly type: "string";
                                                                };
                                                            };
                                                            readonly required: readonly ["source", "provider", "id"];
                                                            readonly additionalProperties: false;
                                                        }];
                                                    }];
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly browser: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly enabled: {
                                                    readonly type: "boolean";
                                                };
                                                readonly image: {
                                                    readonly type: "string";
                                                };
                                                readonly containerPrefix: {
                                                    readonly type: "string";
                                                };
                                                readonly network: {
                                                    readonly type: "string";
                                                };
                                                readonly cdpPort: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly cdpSourceRange: {
                                                    readonly type: "string";
                                                };
                                                readonly vncPort: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly noVncPort: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly headless: {
                                                    readonly type: "boolean";
                                                };
                                                readonly enableNoVnc: {
                                                    readonly type: "boolean";
                                                };
                                                readonly allowHostControl: {
                                                    readonly type: "boolean";
                                                };
                                                readonly autoStart: {
                                                    readonly type: "boolean";
                                                };
                                                readonly autoStartTimeoutMs: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly binds: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly prune: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly idleHours: {
                                                    readonly type: "integer";
                                                    readonly minimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly maxAgeDays: {
                                                    readonly type: "integer";
                                                    readonly minimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                    };
                                    readonly additionalProperties: false;
                                };
                                readonly params: {
                                    readonly type: "object";
                                    readonly propertyNames: {
                                        readonly type: "string";
                                    };
                                    readonly additionalProperties: {};
                                };
                                readonly tools: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly profile: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "minimal";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "coding";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "messaging";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "full";
                                            }];
                                        };
                                        readonly allow: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly alsoAllow: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly deny: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly byProvider: {
                                            readonly type: "object";
                                            readonly propertyNames: {
                                                readonly type: "string";
                                            };
                                            readonly additionalProperties: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly allow: {
                                                        readonly type: "array";
                                                        readonly items: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly alsoAllow: {
                                                        readonly type: "array";
                                                        readonly items: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly deny: {
                                                        readonly type: "array";
                                                        readonly items: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly profile: {
                                                        readonly anyOf: readonly [{
                                                            readonly type: "string";
                                                            readonly const: "minimal";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "coding";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "messaging";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "full";
                                                        }];
                                                    };
                                                };
                                                readonly additionalProperties: false;
                                            };
                                        };
                                        readonly elevated: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly enabled: {
                                                    readonly type: "boolean";
                                                };
                                                readonly allowFrom: {
                                                    readonly type: "object";
                                                    readonly propertyNames: {
                                                        readonly type: "string";
                                                    };
                                                    readonly additionalProperties: {
                                                        readonly type: "array";
                                                        readonly items: {
                                                            readonly anyOf: readonly [{
                                                                readonly type: "string";
                                                            }, {
                                                                readonly type: "number";
                                                            }];
                                                        };
                                                    };
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly exec: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly host: {
                                                    readonly type: "string";
                                                    readonly enum: readonly ["sandbox", "gateway", "node"];
                                                };
                                                readonly security: {
                                                    readonly type: "string";
                                                    readonly enum: readonly ["deny", "allowlist", "full"];
                                                };
                                                readonly ask: {
                                                    readonly type: "string";
                                                    readonly enum: readonly ["off", "on-miss", "always"];
                                                };
                                                readonly node: {
                                                    readonly type: "string";
                                                };
                                                readonly pathPrepend: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly safeBins: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly strictInlineEval: {
                                                    readonly type: "boolean";
                                                };
                                                readonly safeBinTrustedDirs: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly safeBinProfiles: {
                                                    readonly type: "object";
                                                    readonly propertyNames: {
                                                        readonly type: "string";
                                                    };
                                                    readonly additionalProperties: {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly minPositional: {
                                                                readonly type: "integer";
                                                                readonly minimum: 0;
                                                                readonly maximum: 9007199254740991;
                                                            };
                                                            readonly maxPositional: {
                                                                readonly type: "integer";
                                                                readonly minimum: 0;
                                                                readonly maximum: 9007199254740991;
                                                            };
                                                            readonly allowedValueFlags: {
                                                                readonly type: "array";
                                                                readonly items: {
                                                                    readonly type: "string";
                                                                };
                                                            };
                                                            readonly deniedFlags: {
                                                                readonly type: "array";
                                                                readonly items: {
                                                                    readonly type: "string";
                                                                };
                                                            };
                                                        };
                                                        readonly additionalProperties: false;
                                                    };
                                                };
                                                readonly backgroundMs: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly timeoutSec: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly cleanupMs: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly notifyOnExit: {
                                                    readonly type: "boolean";
                                                };
                                                readonly notifyOnExitEmptySuccess: {
                                                    readonly type: "boolean";
                                                };
                                                readonly applyPatch: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly enabled: {
                                                            readonly type: "boolean";
                                                        };
                                                        readonly workspaceOnly: {
                                                            readonly type: "boolean";
                                                        };
                                                        readonly allowModels: {
                                                            readonly type: "array";
                                                            readonly items: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                    };
                                                    readonly additionalProperties: false;
                                                };
                                                readonly approvalRunningNoticeMs: {
                                                    readonly type: "integer";
                                                    readonly minimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly fs: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly workspaceOnly: {
                                                    readonly type: "boolean";
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly loopDetection: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly enabled: {
                                                    readonly type: "boolean";
                                                };
                                                readonly historySize: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly warningThreshold: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly criticalThreshold: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly globalCircuitBreakerThreshold: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly detectors: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly genericRepeat: {
                                                            readonly type: "boolean";
                                                        };
                                                        readonly knownPollNoProgress: {
                                                            readonly type: "boolean";
                                                        };
                                                        readonly pingPong: {
                                                            readonly type: "boolean";
                                                        };
                                                    };
                                                    readonly additionalProperties: false;
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly sandbox: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly tools: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly allow: {
                                                            readonly type: "array";
                                                            readonly items: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly alsoAllow: {
                                                            readonly type: "array";
                                                            readonly items: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly deny: {
                                                            readonly type: "array";
                                                            readonly items: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                    };
                                                    readonly additionalProperties: false;
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                    };
                                    readonly additionalProperties: false;
                                };
                                readonly runtime: {
                                    readonly anyOf: readonly [{
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly type: {
                                                readonly type: "string";
                                                readonly const: "embedded";
                                            };
                                        };
                                        readonly required: readonly ["type"];
                                        readonly additionalProperties: false;
                                    }, {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly type: {
                                                readonly type: "string";
                                                readonly const: "acp";
                                            };
                                            readonly acp: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly agent: {
                                                        readonly type: "string";
                                                    };
                                                    readonly backend: {
                                                        readonly type: "string";
                                                    };
                                                    readonly mode: {
                                                        readonly type: "string";
                                                        readonly enum: readonly ["persistent", "oneshot"];
                                                    };
                                                    readonly cwd: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly additionalProperties: false;
                                            };
                                        };
                                        readonly required: readonly ["type"];
                                        readonly additionalProperties: false;
                                    }];
                                };
                            };
                            readonly required: readonly ["id"];
                            readonly additionalProperties: false;
                        };
                    };
                };
                readonly additionalProperties: false;
            };
            readonly tools: {
                readonly type: "object";
                readonly properties: {
                    readonly profile: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                            readonly const: "minimal";
                        }, {
                            readonly type: "string";
                            readonly const: "coding";
                        }, {
                            readonly type: "string";
                            readonly const: "messaging";
                        }, {
                            readonly type: "string";
                            readonly const: "full";
                        }];
                    };
                    readonly allow: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly alsoAllow: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly deny: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly byProvider: {
                        readonly type: "object";
                        readonly propertyNames: {
                            readonly type: "string";
                        };
                        readonly additionalProperties: {
                            readonly type: "object";
                            readonly properties: {
                                readonly allow: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                                readonly alsoAllow: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                                readonly deny: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                                readonly profile: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                        readonly const: "minimal";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "coding";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "messaging";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "full";
                                    }];
                                };
                            };
                            readonly additionalProperties: false;
                        };
                    };
                    readonly web: {
                        readonly type: "object";
                        readonly properties: {
                            readonly search: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly enabled: {
                                        readonly type: "boolean";
                                    };
                                    readonly provider: {
                                        readonly type: "string";
                                    };
                                    readonly maxResults: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly timeoutSeconds: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly cacheTtlMinutes: {
                                        readonly type: "number";
                                        readonly minimum: 0;
                                    };
                                    readonly apiKey: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                        }, {
                                            readonly oneOf: readonly [{
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly source: {
                                                        readonly type: "string";
                                                        readonly const: "env";
                                                    };
                                                    readonly provider: {
                                                        readonly type: "string";
                                                        readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                    };
                                                    readonly id: {
                                                        readonly type: "string";
                                                        readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                    };
                                                };
                                                readonly required: readonly ["source", "provider", "id"];
                                                readonly additionalProperties: false;
                                            }, {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly source: {
                                                        readonly type: "string";
                                                        readonly const: "file";
                                                    };
                                                    readonly provider: {
                                                        readonly type: "string";
                                                        readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                    };
                                                    readonly id: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly required: readonly ["source", "provider", "id"];
                                                readonly additionalProperties: false;
                                            }, {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly source: {
                                                        readonly type: "string";
                                                        readonly const: "exec";
                                                    };
                                                    readonly provider: {
                                                        readonly type: "string";
                                                        readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                    };
                                                    readonly id: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly required: readonly ["source", "provider", "id"];
                                                readonly additionalProperties: false;
                                            }];
                                        }];
                                    };
                                    readonly brave: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly apiKey: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly oneOf: readonly [{
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "env";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "file";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "exec";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }];
                                                }];
                                            };
                                            readonly baseUrl: {
                                                readonly type: "string";
                                            };
                                            readonly model: {
                                                readonly type: "string";
                                            };
                                            readonly mode: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly firecrawl: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly apiKey: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly oneOf: readonly [{
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "env";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "file";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "exec";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }];
                                                }];
                                            };
                                            readonly baseUrl: {
                                                readonly type: "string";
                                            };
                                            readonly model: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly gemini: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly apiKey: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly oneOf: readonly [{
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "env";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "file";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "exec";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }];
                                                }];
                                            };
                                            readonly baseUrl: {
                                                readonly type: "string";
                                            };
                                            readonly model: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly grok: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly apiKey: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly oneOf: readonly [{
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "env";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "file";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "exec";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }];
                                                }];
                                            };
                                            readonly baseUrl: {
                                                readonly type: "string";
                                            };
                                            readonly model: {
                                                readonly type: "string";
                                            };
                                            readonly inlineCitations: {
                                                readonly type: "boolean";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly kimi: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly apiKey: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly oneOf: readonly [{
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "env";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "file";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "exec";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }];
                                                }];
                                            };
                                            readonly baseUrl: {
                                                readonly type: "string";
                                            };
                                            readonly model: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly perplexity: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly apiKey: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly oneOf: readonly [{
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "env";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "file";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "exec";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }];
                                                }];
                                            };
                                            readonly baseUrl: {
                                                readonly type: "string";
                                            };
                                            readonly model: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly fetch: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly enabled: {
                                        readonly type: "boolean";
                                    };
                                    readonly maxChars: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly maxCharsCap: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly maxResponseBytes: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly timeoutSeconds: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly cacheTtlMinutes: {
                                        readonly type: "number";
                                        readonly minimum: 0;
                                    };
                                    readonly maxRedirects: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly userAgent: {
                                        readonly type: "string";
                                    };
                                    readonly readability: {
                                        readonly type: "boolean";
                                    };
                                    readonly firecrawl: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly enabled: {
                                                readonly type: "boolean";
                                            };
                                            readonly apiKey: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly oneOf: readonly [{
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "env";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "file";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }, {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly source: {
                                                                readonly type: "string";
                                                                readonly const: "exec";
                                                            };
                                                            readonly provider: {
                                                                readonly type: "string";
                                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                            };
                                                            readonly id: {
                                                                readonly type: "string";
                                                            };
                                                        };
                                                        readonly required: readonly ["source", "provider", "id"];
                                                        readonly additionalProperties: false;
                                                    }];
                                                }];
                                            };
                                            readonly baseUrl: {
                                                readonly type: "string";
                                            };
                                            readonly onlyMainContent: {
                                                readonly type: "boolean";
                                            };
                                            readonly maxAgeMs: {
                                                readonly type: "integer";
                                                readonly minimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly timeoutSeconds: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly x_search: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly enabled: {
                                        readonly type: "boolean";
                                    };
                                    readonly apiKey: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                        }, {
                                            readonly oneOf: readonly [{
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly source: {
                                                        readonly type: "string";
                                                        readonly const: "env";
                                                    };
                                                    readonly provider: {
                                                        readonly type: "string";
                                                        readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                    };
                                                    readonly id: {
                                                        readonly type: "string";
                                                        readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                    };
                                                };
                                                readonly required: readonly ["source", "provider", "id"];
                                                readonly additionalProperties: false;
                                            }, {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly source: {
                                                        readonly type: "string";
                                                        readonly const: "file";
                                                    };
                                                    readonly provider: {
                                                        readonly type: "string";
                                                        readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                    };
                                                    readonly id: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly required: readonly ["source", "provider", "id"];
                                                readonly additionalProperties: false;
                                            }, {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly source: {
                                                        readonly type: "string";
                                                        readonly const: "exec";
                                                    };
                                                    readonly provider: {
                                                        readonly type: "string";
                                                        readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                    };
                                                    readonly id: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly required: readonly ["source", "provider", "id"];
                                                readonly additionalProperties: false;
                                            }];
                                        }];
                                    };
                                    readonly model: {
                                        readonly type: "string";
                                    };
                                    readonly inlineCitations: {
                                        readonly type: "boolean";
                                    };
                                    readonly maxTurns: {
                                        readonly type: "integer";
                                        readonly minimum: -9007199254740991;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly timeoutSeconds: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly cacheTtlMinutes: {
                                        readonly type: "number";
                                        readonly minimum: 0;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly media: {
                        readonly type: "object";
                        readonly properties: {
                            readonly models: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly provider: {
                                            readonly type: "string";
                                        };
                                        readonly model: {
                                            readonly type: "string";
                                        };
                                        readonly capabilities: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                    readonly const: "image";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "audio";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "video";
                                                }];
                                            };
                                        };
                                        readonly type: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "provider";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "cli";
                                            }];
                                        };
                                        readonly command: {
                                            readonly type: "string";
                                        };
                                        readonly args: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly maxChars: {
                                            readonly type: "integer";
                                            readonly exclusiveMinimum: 0;
                                            readonly maximum: 9007199254740991;
                                        };
                                        readonly maxBytes: {
                                            readonly type: "integer";
                                            readonly exclusiveMinimum: 0;
                                            readonly maximum: 9007199254740991;
                                        };
                                        readonly prompt: {
                                            readonly type: "string";
                                        };
                                        readonly timeoutSeconds: {
                                            readonly type: "integer";
                                            readonly exclusiveMinimum: 0;
                                            readonly maximum: 9007199254740991;
                                        };
                                        readonly language: {
                                            readonly type: "string";
                                        };
                                        readonly providerOptions: {
                                            readonly type: "object";
                                            readonly propertyNames: {
                                                readonly type: "string";
                                            };
                                            readonly additionalProperties: {
                                                readonly type: "object";
                                                readonly propertyNames: {
                                                    readonly type: "string";
                                                };
                                                readonly additionalProperties: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                    }, {
                                                        readonly type: "number";
                                                    }, {
                                                        readonly type: "boolean";
                                                    }];
                                                };
                                            };
                                        };
                                        readonly deepgram: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly detectLanguage: {
                                                    readonly type: "boolean";
                                                };
                                                readonly punctuate: {
                                                    readonly type: "boolean";
                                                };
                                                readonly smartFormat: {
                                                    readonly type: "boolean";
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                        readonly baseUrl: {
                                            readonly type: "string";
                                        };
                                        readonly headers: {
                                            readonly type: "object";
                                            readonly propertyNames: {
                                                readonly type: "string";
                                            };
                                            readonly additionalProperties: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly profile: {
                                            readonly type: "string";
                                        };
                                        readonly preferredProfile: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly additionalProperties: false;
                                };
                            };
                            readonly concurrency: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly image: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly enabled: {
                                        readonly type: "boolean";
                                    };
                                    readonly scope: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly default: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                    readonly const: "allow";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "deny";
                                                }];
                                            };
                                            readonly rules: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly action: {
                                                            readonly anyOf: readonly [{
                                                                readonly type: "string";
                                                                readonly const: "allow";
                                                            }, {
                                                                readonly type: "string";
                                                                readonly const: "deny";
                                                            }];
                                                        };
                                                        readonly match: {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly channel: {
                                                                    readonly type: "string";
                                                                };
                                                                readonly chatType: {
                                                                    readonly anyOf: readonly [{
                                                                        readonly type: "string";
                                                                        readonly const: "direct";
                                                                    }, {
                                                                        readonly type: "string";
                                                                        readonly const: "group";
                                                                    }, {
                                                                        readonly type: "string";
                                                                        readonly const: "channel";
                                                                    }, {
                                                                        readonly type: "string";
                                                                        readonly const: "dm";
                                                                    }];
                                                                };
                                                                readonly keyPrefix: {
                                                                    readonly type: "string";
                                                                };
                                                                readonly rawKeyPrefix: {
                                                                    readonly type: "string";
                                                                };
                                                            };
                                                            readonly additionalProperties: false;
                                                        };
                                                    };
                                                    readonly required: readonly ["action"];
                                                    readonly additionalProperties: false;
                                                };
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly maxBytes: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly maxChars: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly prompt: {
                                        readonly type: "string";
                                    };
                                    readonly timeoutSeconds: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly language: {
                                        readonly type: "string";
                                    };
                                    readonly providerOptions: {
                                        readonly type: "object";
                                        readonly propertyNames: {
                                            readonly type: "string";
                                        };
                                        readonly additionalProperties: {
                                            readonly type: "object";
                                            readonly propertyNames: {
                                                readonly type: "string";
                                            };
                                            readonly additionalProperties: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly type: "number";
                                                }, {
                                                    readonly type: "boolean";
                                                }];
                                            };
                                        };
                                    };
                                    readonly deepgram: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly detectLanguage: {
                                                readonly type: "boolean";
                                            };
                                            readonly punctuate: {
                                                readonly type: "boolean";
                                            };
                                            readonly smartFormat: {
                                                readonly type: "boolean";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly baseUrl: {
                                        readonly type: "string";
                                    };
                                    readonly headers: {
                                        readonly type: "object";
                                        readonly propertyNames: {
                                            readonly type: "string";
                                        };
                                        readonly additionalProperties: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly attachments: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly mode: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                    readonly const: "first";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "all";
                                                }];
                                            };
                                            readonly maxAttachments: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly prefer: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                    readonly const: "first";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "last";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "path";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "url";
                                                }];
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly models: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly provider: {
                                                    readonly type: "string";
                                                };
                                                readonly model: {
                                                    readonly type: "string";
                                                };
                                                readonly capabilities: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly anyOf: readonly [{
                                                            readonly type: "string";
                                                            readonly const: "image";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "audio";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "video";
                                                        }];
                                                    };
                                                };
                                                readonly type: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                        readonly const: "provider";
                                                    }, {
                                                        readonly type: "string";
                                                        readonly const: "cli";
                                                    }];
                                                };
                                                readonly command: {
                                                    readonly type: "string";
                                                };
                                                readonly args: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly maxChars: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly maxBytes: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly prompt: {
                                                    readonly type: "string";
                                                };
                                                readonly timeoutSeconds: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly language: {
                                                    readonly type: "string";
                                                };
                                                readonly providerOptions: {
                                                    readonly type: "object";
                                                    readonly propertyNames: {
                                                        readonly type: "string";
                                                    };
                                                    readonly additionalProperties: {
                                                        readonly type: "object";
                                                        readonly propertyNames: {
                                                            readonly type: "string";
                                                        };
                                                        readonly additionalProperties: {
                                                            readonly anyOf: readonly [{
                                                                readonly type: "string";
                                                            }, {
                                                                readonly type: "number";
                                                            }, {
                                                                readonly type: "boolean";
                                                            }];
                                                        };
                                                    };
                                                };
                                                readonly deepgram: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly detectLanguage: {
                                                            readonly type: "boolean";
                                                        };
                                                        readonly punctuate: {
                                                            readonly type: "boolean";
                                                        };
                                                        readonly smartFormat: {
                                                            readonly type: "boolean";
                                                        };
                                                    };
                                                    readonly additionalProperties: false;
                                                };
                                                readonly baseUrl: {
                                                    readonly type: "string";
                                                };
                                                readonly headers: {
                                                    readonly type: "object";
                                                    readonly propertyNames: {
                                                        readonly type: "string";
                                                    };
                                                    readonly additionalProperties: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly profile: {
                                                    readonly type: "string";
                                                };
                                                readonly preferredProfile: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                    };
                                    readonly echoTranscript: {
                                        readonly type: "boolean";
                                    };
                                    readonly echoFormat: {
                                        readonly type: "string";
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly audio: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly enabled: {
                                        readonly type: "boolean";
                                    };
                                    readonly scope: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly default: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                    readonly const: "allow";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "deny";
                                                }];
                                            };
                                            readonly rules: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly action: {
                                                            readonly anyOf: readonly [{
                                                                readonly type: "string";
                                                                readonly const: "allow";
                                                            }, {
                                                                readonly type: "string";
                                                                readonly const: "deny";
                                                            }];
                                                        };
                                                        readonly match: {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly channel: {
                                                                    readonly type: "string";
                                                                };
                                                                readonly chatType: {
                                                                    readonly anyOf: readonly [{
                                                                        readonly type: "string";
                                                                        readonly const: "direct";
                                                                    }, {
                                                                        readonly type: "string";
                                                                        readonly const: "group";
                                                                    }, {
                                                                        readonly type: "string";
                                                                        readonly const: "channel";
                                                                    }, {
                                                                        readonly type: "string";
                                                                        readonly const: "dm";
                                                                    }];
                                                                };
                                                                readonly keyPrefix: {
                                                                    readonly type: "string";
                                                                };
                                                                readonly rawKeyPrefix: {
                                                                    readonly type: "string";
                                                                };
                                                            };
                                                            readonly additionalProperties: false;
                                                        };
                                                    };
                                                    readonly required: readonly ["action"];
                                                    readonly additionalProperties: false;
                                                };
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly maxBytes: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly maxChars: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly prompt: {
                                        readonly type: "string";
                                    };
                                    readonly timeoutSeconds: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly language: {
                                        readonly type: "string";
                                    };
                                    readonly providerOptions: {
                                        readonly type: "object";
                                        readonly propertyNames: {
                                            readonly type: "string";
                                        };
                                        readonly additionalProperties: {
                                            readonly type: "object";
                                            readonly propertyNames: {
                                                readonly type: "string";
                                            };
                                            readonly additionalProperties: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly type: "number";
                                                }, {
                                                    readonly type: "boolean";
                                                }];
                                            };
                                        };
                                    };
                                    readonly deepgram: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly detectLanguage: {
                                                readonly type: "boolean";
                                            };
                                            readonly punctuate: {
                                                readonly type: "boolean";
                                            };
                                            readonly smartFormat: {
                                                readonly type: "boolean";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly baseUrl: {
                                        readonly type: "string";
                                    };
                                    readonly headers: {
                                        readonly type: "object";
                                        readonly propertyNames: {
                                            readonly type: "string";
                                        };
                                        readonly additionalProperties: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly attachments: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly mode: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                    readonly const: "first";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "all";
                                                }];
                                            };
                                            readonly maxAttachments: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly prefer: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                    readonly const: "first";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "last";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "path";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "url";
                                                }];
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly models: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly provider: {
                                                    readonly type: "string";
                                                };
                                                readonly model: {
                                                    readonly type: "string";
                                                };
                                                readonly capabilities: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly anyOf: readonly [{
                                                            readonly type: "string";
                                                            readonly const: "image";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "audio";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "video";
                                                        }];
                                                    };
                                                };
                                                readonly type: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                        readonly const: "provider";
                                                    }, {
                                                        readonly type: "string";
                                                        readonly const: "cli";
                                                    }];
                                                };
                                                readonly command: {
                                                    readonly type: "string";
                                                };
                                                readonly args: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly maxChars: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly maxBytes: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly prompt: {
                                                    readonly type: "string";
                                                };
                                                readonly timeoutSeconds: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly language: {
                                                    readonly type: "string";
                                                };
                                                readonly providerOptions: {
                                                    readonly type: "object";
                                                    readonly propertyNames: {
                                                        readonly type: "string";
                                                    };
                                                    readonly additionalProperties: {
                                                        readonly type: "object";
                                                        readonly propertyNames: {
                                                            readonly type: "string";
                                                        };
                                                        readonly additionalProperties: {
                                                            readonly anyOf: readonly [{
                                                                readonly type: "string";
                                                            }, {
                                                                readonly type: "number";
                                                            }, {
                                                                readonly type: "boolean";
                                                            }];
                                                        };
                                                    };
                                                };
                                                readonly deepgram: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly detectLanguage: {
                                                            readonly type: "boolean";
                                                        };
                                                        readonly punctuate: {
                                                            readonly type: "boolean";
                                                        };
                                                        readonly smartFormat: {
                                                            readonly type: "boolean";
                                                        };
                                                    };
                                                    readonly additionalProperties: false;
                                                };
                                                readonly baseUrl: {
                                                    readonly type: "string";
                                                };
                                                readonly headers: {
                                                    readonly type: "object";
                                                    readonly propertyNames: {
                                                        readonly type: "string";
                                                    };
                                                    readonly additionalProperties: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly profile: {
                                                    readonly type: "string";
                                                };
                                                readonly preferredProfile: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                    };
                                    readonly echoTranscript: {
                                        readonly type: "boolean";
                                    };
                                    readonly echoFormat: {
                                        readonly type: "string";
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly video: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly enabled: {
                                        readonly type: "boolean";
                                    };
                                    readonly scope: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly default: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                    readonly const: "allow";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "deny";
                                                }];
                                            };
                                            readonly rules: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly action: {
                                                            readonly anyOf: readonly [{
                                                                readonly type: "string";
                                                                readonly const: "allow";
                                                            }, {
                                                                readonly type: "string";
                                                                readonly const: "deny";
                                                            }];
                                                        };
                                                        readonly match: {
                                                            readonly type: "object";
                                                            readonly properties: {
                                                                readonly channel: {
                                                                    readonly type: "string";
                                                                };
                                                                readonly chatType: {
                                                                    readonly anyOf: readonly [{
                                                                        readonly type: "string";
                                                                        readonly const: "direct";
                                                                    }, {
                                                                        readonly type: "string";
                                                                        readonly const: "group";
                                                                    }, {
                                                                        readonly type: "string";
                                                                        readonly const: "channel";
                                                                    }, {
                                                                        readonly type: "string";
                                                                        readonly const: "dm";
                                                                    }];
                                                                };
                                                                readonly keyPrefix: {
                                                                    readonly type: "string";
                                                                };
                                                                readonly rawKeyPrefix: {
                                                                    readonly type: "string";
                                                                };
                                                            };
                                                            readonly additionalProperties: false;
                                                        };
                                                    };
                                                    readonly required: readonly ["action"];
                                                    readonly additionalProperties: false;
                                                };
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly maxBytes: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly maxChars: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly prompt: {
                                        readonly type: "string";
                                    };
                                    readonly timeoutSeconds: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly language: {
                                        readonly type: "string";
                                    };
                                    readonly providerOptions: {
                                        readonly type: "object";
                                        readonly propertyNames: {
                                            readonly type: "string";
                                        };
                                        readonly additionalProperties: {
                                            readonly type: "object";
                                            readonly propertyNames: {
                                                readonly type: "string";
                                            };
                                            readonly additionalProperties: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly type: "number";
                                                }, {
                                                    readonly type: "boolean";
                                                }];
                                            };
                                        };
                                    };
                                    readonly deepgram: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly detectLanguage: {
                                                readonly type: "boolean";
                                            };
                                            readonly punctuate: {
                                                readonly type: "boolean";
                                            };
                                            readonly smartFormat: {
                                                readonly type: "boolean";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly baseUrl: {
                                        readonly type: "string";
                                    };
                                    readonly headers: {
                                        readonly type: "object";
                                        readonly propertyNames: {
                                            readonly type: "string";
                                        };
                                        readonly additionalProperties: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly attachments: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly mode: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                    readonly const: "first";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "all";
                                                }];
                                            };
                                            readonly maxAttachments: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly prefer: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                    readonly const: "first";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "last";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "path";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "url";
                                                }];
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly models: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly provider: {
                                                    readonly type: "string";
                                                };
                                                readonly model: {
                                                    readonly type: "string";
                                                };
                                                readonly capabilities: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly anyOf: readonly [{
                                                            readonly type: "string";
                                                            readonly const: "image";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "audio";
                                                        }, {
                                                            readonly type: "string";
                                                            readonly const: "video";
                                                        }];
                                                    };
                                                };
                                                readonly type: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                        readonly const: "provider";
                                                    }, {
                                                        readonly type: "string";
                                                        readonly const: "cli";
                                                    }];
                                                };
                                                readonly command: {
                                                    readonly type: "string";
                                                };
                                                readonly args: {
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly maxChars: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly maxBytes: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly prompt: {
                                                    readonly type: "string";
                                                };
                                                readonly timeoutSeconds: {
                                                    readonly type: "integer";
                                                    readonly exclusiveMinimum: 0;
                                                    readonly maximum: 9007199254740991;
                                                };
                                                readonly language: {
                                                    readonly type: "string";
                                                };
                                                readonly providerOptions: {
                                                    readonly type: "object";
                                                    readonly propertyNames: {
                                                        readonly type: "string";
                                                    };
                                                    readonly additionalProperties: {
                                                        readonly type: "object";
                                                        readonly propertyNames: {
                                                            readonly type: "string";
                                                        };
                                                        readonly additionalProperties: {
                                                            readonly anyOf: readonly [{
                                                                readonly type: "string";
                                                            }, {
                                                                readonly type: "number";
                                                            }, {
                                                                readonly type: "boolean";
                                                            }];
                                                        };
                                                    };
                                                };
                                                readonly deepgram: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly detectLanguage: {
                                                            readonly type: "boolean";
                                                        };
                                                        readonly punctuate: {
                                                            readonly type: "boolean";
                                                        };
                                                        readonly smartFormat: {
                                                            readonly type: "boolean";
                                                        };
                                                    };
                                                    readonly additionalProperties: false;
                                                };
                                                readonly baseUrl: {
                                                    readonly type: "string";
                                                };
                                                readonly headers: {
                                                    readonly type: "object";
                                                    readonly propertyNames: {
                                                        readonly type: "string";
                                                    };
                                                    readonly additionalProperties: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly profile: {
                                                    readonly type: "string";
                                                };
                                                readonly preferredProfile: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                    };
                                    readonly echoTranscript: {
                                        readonly type: "boolean";
                                    };
                                    readonly echoFormat: {
                                        readonly type: "string";
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly links: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly scope: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly default: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "allow";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "deny";
                                        }];
                                    };
                                    readonly rules: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly action: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                        readonly const: "allow";
                                                    }, {
                                                        readonly type: "string";
                                                        readonly const: "deny";
                                                    }];
                                                };
                                                readonly match: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly channel: {
                                                            readonly type: "string";
                                                        };
                                                        readonly chatType: {
                                                            readonly anyOf: readonly [{
                                                                readonly type: "string";
                                                                readonly const: "direct";
                                                            }, {
                                                                readonly type: "string";
                                                                readonly const: "group";
                                                            }, {
                                                                readonly type: "string";
                                                                readonly const: "channel";
                                                            }, {
                                                                readonly type: "string";
                                                                readonly const: "dm";
                                                            }];
                                                        };
                                                        readonly keyPrefix: {
                                                            readonly type: "string";
                                                        };
                                                        readonly rawKeyPrefix: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly additionalProperties: false;
                                                };
                                            };
                                            readonly required: readonly ["action"];
                                            readonly additionalProperties: false;
                                        };
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly maxLinks: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly timeoutSeconds: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly models: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly type: {
                                            readonly type: "string";
                                            readonly const: "cli";
                                        };
                                        readonly command: {
                                            readonly type: "string";
                                            readonly minLength: 1;
                                        };
                                        readonly args: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly timeoutSeconds: {
                                            readonly type: "integer";
                                            readonly exclusiveMinimum: 0;
                                            readonly maximum: 9007199254740991;
                                        };
                                    };
                                    readonly required: readonly ["command"];
                                    readonly additionalProperties: false;
                                };
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly sessions: {
                        readonly type: "object";
                        readonly properties: {
                            readonly visibility: {
                                readonly type: "string";
                                readonly enum: readonly ["self", "tree", "agent", "all"];
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly loopDetection: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly historySize: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly warningThreshold: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly criticalThreshold: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly globalCircuitBreakerThreshold: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly detectors: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly genericRepeat: {
                                        readonly type: "boolean";
                                    };
                                    readonly knownPollNoProgress: {
                                        readonly type: "boolean";
                                    };
                                    readonly pingPong: {
                                        readonly type: "boolean";
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly message: {
                        readonly type: "object";
                        readonly properties: {
                            readonly allowCrossContextSend: {
                                readonly type: "boolean";
                            };
                            readonly crossContext: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly allowWithinProvider: {
                                        readonly type: "boolean";
                                    };
                                    readonly allowAcrossProviders: {
                                        readonly type: "boolean";
                                    };
                                    readonly marker: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly enabled: {
                                                readonly type: "boolean";
                                            };
                                            readonly prefix: {
                                                readonly type: "string";
                                            };
                                            readonly suffix: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly broadcast: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly enabled: {
                                        readonly type: "boolean";
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly agentToAgent: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly allow: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly elevated: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly allowFrom: {
                                readonly type: "object";
                                readonly propertyNames: {
                                    readonly type: "string";
                                };
                                readonly additionalProperties: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                        }, {
                                            readonly type: "number";
                                        }];
                                    };
                                };
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly exec: {
                        readonly type: "object";
                        readonly properties: {
                            readonly host: {
                                readonly type: "string";
                                readonly enum: readonly ["sandbox", "gateway", "node"];
                            };
                            readonly security: {
                                readonly type: "string";
                                readonly enum: readonly ["deny", "allowlist", "full"];
                            };
                            readonly ask: {
                                readonly type: "string";
                                readonly enum: readonly ["off", "on-miss", "always"];
                            };
                            readonly node: {
                                readonly type: "string";
                            };
                            readonly pathPrepend: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly safeBins: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly strictInlineEval: {
                                readonly type: "boolean";
                            };
                            readonly safeBinTrustedDirs: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly safeBinProfiles: {
                                readonly type: "object";
                                readonly propertyNames: {
                                    readonly type: "string";
                                };
                                readonly additionalProperties: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly minPositional: {
                                            readonly type: "integer";
                                            readonly minimum: 0;
                                            readonly maximum: 9007199254740991;
                                        };
                                        readonly maxPositional: {
                                            readonly type: "integer";
                                            readonly minimum: 0;
                                            readonly maximum: 9007199254740991;
                                        };
                                        readonly allowedValueFlags: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly deniedFlags: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly additionalProperties: false;
                                };
                            };
                            readonly backgroundMs: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly timeoutSec: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly cleanupMs: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly notifyOnExit: {
                                readonly type: "boolean";
                            };
                            readonly notifyOnExitEmptySuccess: {
                                readonly type: "boolean";
                            };
                            readonly applyPatch: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly enabled: {
                                        readonly type: "boolean";
                                    };
                                    readonly workspaceOnly: {
                                        readonly type: "boolean";
                                    };
                                    readonly allowModels: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly fs: {
                        readonly type: "object";
                        readonly properties: {
                            readonly workspaceOnly: {
                                readonly type: "boolean";
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly subagents: {
                        readonly type: "object";
                        readonly properties: {
                            readonly tools: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly allow: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly alsoAllow: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly deny: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly sandbox: {
                        readonly type: "object";
                        readonly properties: {
                            readonly tools: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly allow: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly alsoAllow: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly deny: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly sessions_spawn: {
                        readonly type: "object";
                        readonly properties: {
                            readonly attachments: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly enabled: {
                                        readonly type: "boolean";
                                    };
                                    readonly maxTotalBytes: {
                                        readonly type: "number";
                                    };
                                    readonly maxFiles: {
                                        readonly type: "number";
                                    };
                                    readonly maxFileBytes: {
                                        readonly type: "number";
                                    };
                                    readonly retainOnSessionKeep: {
                                        readonly type: "boolean";
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly bindings: {
                readonly type: "array";
                readonly items: {
                    readonly anyOf: readonly [{
                        readonly type: "object";
                        readonly properties: {
                            readonly type: {
                                readonly type: "string";
                                readonly const: "route";
                            };
                            readonly agentId: {
                                readonly type: "string";
                            };
                            readonly comment: {
                                readonly type: "string";
                            };
                            readonly match: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly channel: {
                                        readonly type: "string";
                                    };
                                    readonly accountId: {
                                        readonly type: "string";
                                    };
                                    readonly peer: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly kind: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                    readonly const: "direct";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "group";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "channel";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "dm";
                                                }];
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly required: readonly ["kind", "id"];
                                        readonly additionalProperties: false;
                                    };
                                    readonly guildId: {
                                        readonly type: "string";
                                    };
                                    readonly teamId: {
                                        readonly type: "string";
                                    };
                                    readonly roles: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly required: readonly ["channel"];
                                readonly additionalProperties: false;
                            };
                        };
                        readonly required: readonly ["agentId", "match"];
                        readonly additionalProperties: false;
                    }, {
                        readonly type: "object";
                        readonly properties: {
                            readonly type: {
                                readonly type: "string";
                                readonly const: "acp";
                            };
                            readonly agentId: {
                                readonly type: "string";
                            };
                            readonly comment: {
                                readonly type: "string";
                            };
                            readonly match: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly channel: {
                                        readonly type: "string";
                                    };
                                    readonly accountId: {
                                        readonly type: "string";
                                    };
                                    readonly peer: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly kind: {
                                                readonly anyOf: readonly [{
                                                    readonly type: "string";
                                                    readonly const: "direct";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "group";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "channel";
                                                }, {
                                                    readonly type: "string";
                                                    readonly const: "dm";
                                                }];
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly required: readonly ["kind", "id"];
                                        readonly additionalProperties: false;
                                    };
                                    readonly guildId: {
                                        readonly type: "string";
                                    };
                                    readonly teamId: {
                                        readonly type: "string";
                                    };
                                    readonly roles: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly required: readonly ["channel"];
                                readonly additionalProperties: false;
                            };
                            readonly acp: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly mode: {
                                        readonly type: "string";
                                        readonly enum: readonly ["persistent", "oneshot"];
                                    };
                                    readonly label: {
                                        readonly type: "string";
                                    };
                                    readonly cwd: {
                                        readonly type: "string";
                                    };
                                    readonly backend: {
                                        readonly type: "string";
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                        readonly required: readonly ["type", "agentId", "match"];
                        readonly additionalProperties: false;
                    }];
                };
            };
            readonly broadcast: {
                readonly type: "object";
                readonly properties: {
                    readonly strategy: {
                        readonly type: "string";
                        readonly enum: readonly ["parallel", "sequential"];
                    };
                };
                readonly additionalProperties: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                };
            };
            readonly audio: {
                readonly type: "object";
                readonly properties: {
                    readonly transcription: {
                        readonly type: "object";
                        readonly properties: {
                            readonly command: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly timeoutSeconds: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                        };
                        readonly required: readonly ["command"];
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly media: {
                readonly type: "object";
                readonly properties: {
                    readonly preserveFilenames: {
                        readonly type: "boolean";
                    };
                    readonly ttlHours: {
                        readonly type: "integer";
                        readonly minimum: 1;
                        readonly maximum: 168;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly messages: {
                readonly type: "object";
                readonly properties: {
                    readonly messagePrefix: {
                        readonly type: "string";
                    };
                    readonly responsePrefix: {
                        readonly type: "string";
                    };
                    readonly groupChat: {
                        readonly type: "object";
                        readonly properties: {
                            readonly mentionPatterns: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly historyLimit: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly queue: {
                        readonly type: "object";
                        readonly properties: {
                            readonly mode: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "steer";
                                }, {
                                    readonly type: "string";
                                    readonly const: "followup";
                                }, {
                                    readonly type: "string";
                                    readonly const: "collect";
                                }, {
                                    readonly type: "string";
                                    readonly const: "steer-backlog";
                                }, {
                                    readonly type: "string";
                                    readonly const: "steer+backlog";
                                }, {
                                    readonly type: "string";
                                    readonly const: "queue";
                                }, {
                                    readonly type: "string";
                                    readonly const: "interrupt";
                                }];
                            };
                            readonly byChannel: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly whatsapp: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "steer";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "followup";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "collect";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer-backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer+backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "queue";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "interrupt";
                                        }];
                                    };
                                    readonly telegram: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "steer";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "followup";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "collect";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer-backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer+backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "queue";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "interrupt";
                                        }];
                                    };
                                    readonly discord: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "steer";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "followup";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "collect";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer-backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer+backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "queue";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "interrupt";
                                        }];
                                    };
                                    readonly irc: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "steer";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "followup";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "collect";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer-backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer+backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "queue";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "interrupt";
                                        }];
                                    };
                                    readonly slack: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "steer";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "followup";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "collect";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer-backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer+backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "queue";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "interrupt";
                                        }];
                                    };
                                    readonly mattermost: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "steer";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "followup";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "collect";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer-backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer+backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "queue";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "interrupt";
                                        }];
                                    };
                                    readonly signal: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "steer";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "followup";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "collect";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer-backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer+backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "queue";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "interrupt";
                                        }];
                                    };
                                    readonly imessage: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "steer";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "followup";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "collect";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer-backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer+backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "queue";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "interrupt";
                                        }];
                                    };
                                    readonly msteams: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "steer";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "followup";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "collect";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer-backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer+backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "queue";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "interrupt";
                                        }];
                                    };
                                    readonly webchat: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "steer";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "followup";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "collect";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer-backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "steer+backlog";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "queue";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "interrupt";
                                        }];
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly debounceMs: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly debounceMsByChannel: {
                                readonly type: "object";
                                readonly propertyNames: {
                                    readonly type: "string";
                                };
                                readonly additionalProperties: {
                                    readonly type: "integer";
                                    readonly minimum: 0;
                                    readonly maximum: 9007199254740991;
                                };
                            };
                            readonly cap: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly drop: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "old";
                                }, {
                                    readonly type: "string";
                                    readonly const: "new";
                                }, {
                                    readonly type: "string";
                                    readonly const: "summarize";
                                }];
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly inbound: {
                        readonly type: "object";
                        readonly properties: {
                            readonly debounceMs: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly byChannel: {
                                readonly type: "object";
                                readonly propertyNames: {
                                    readonly type: "string";
                                };
                                readonly additionalProperties: {
                                    readonly type: "integer";
                                    readonly minimum: 0;
                                    readonly maximum: 9007199254740991;
                                };
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly ackReaction: {
                        readonly type: "string";
                    };
                    readonly ackReactionScope: {
                        readonly type: "string";
                        readonly enum: readonly ["group-mentions", "group-all", "direct", "all", "off", "none"];
                    };
                    readonly removeAckAfterReply: {
                        readonly type: "boolean";
                    };
                    readonly statusReactions: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly emojis: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly thinking: {
                                        readonly type: "string";
                                    };
                                    readonly tool: {
                                        readonly type: "string";
                                    };
                                    readonly coding: {
                                        readonly type: "string";
                                    };
                                    readonly web: {
                                        readonly type: "string";
                                    };
                                    readonly done: {
                                        readonly type: "string";
                                    };
                                    readonly error: {
                                        readonly type: "string";
                                    };
                                    readonly stallSoft: {
                                        readonly type: "string";
                                    };
                                    readonly stallHard: {
                                        readonly type: "string";
                                    };
                                    readonly compacting: {
                                        readonly type: "string";
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly timing: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly debounceMs: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly stallSoftMs: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly stallHardMs: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly doneHoldMs: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly errorHoldMs: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly suppressToolErrors: {
                        readonly type: "boolean";
                    };
                    readonly tts: {
                        readonly type: "object";
                        readonly properties: {
                            readonly auto: {
                                readonly type: "string";
                                readonly enum: readonly ["off", "always", "inbound", "tagged"];
                            };
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly mode: {
                                readonly type: "string";
                                readonly enum: readonly ["final", "all"];
                            };
                            readonly provider: {
                                readonly type: "string";
                                readonly minLength: 1;
                            };
                            readonly summaryModel: {
                                readonly type: "string";
                            };
                            readonly modelOverrides: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly enabled: {
                                        readonly type: "boolean";
                                    };
                                    readonly allowText: {
                                        readonly type: "boolean";
                                    };
                                    readonly allowProvider: {
                                        readonly type: "boolean";
                                    };
                                    readonly allowVoice: {
                                        readonly type: "boolean";
                                    };
                                    readonly allowModelId: {
                                        readonly type: "boolean";
                                    };
                                    readonly allowVoiceSettings: {
                                        readonly type: "boolean";
                                    };
                                    readonly allowNormalization: {
                                        readonly type: "boolean";
                                    };
                                    readonly allowSeed: {
                                        readonly type: "boolean";
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly providers: {
                                readonly type: "object";
                                readonly propertyNames: {
                                    readonly type: "string";
                                };
                                readonly additionalProperties: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly apiKey: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                            }, {
                                                readonly oneOf: readonly [{
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly source: {
                                                            readonly type: "string";
                                                            readonly const: "env";
                                                        };
                                                        readonly provider: {
                                                            readonly type: "string";
                                                            readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                        };
                                                        readonly id: {
                                                            readonly type: "string";
                                                            readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                        };
                                                    };
                                                    readonly required: readonly ["source", "provider", "id"];
                                                    readonly additionalProperties: false;
                                                }, {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly source: {
                                                            readonly type: "string";
                                                            readonly const: "file";
                                                        };
                                                        readonly provider: {
                                                            readonly type: "string";
                                                            readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                        };
                                                        readonly id: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly required: readonly ["source", "provider", "id"];
                                                    readonly additionalProperties: false;
                                                }, {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly source: {
                                                            readonly type: "string";
                                                            readonly const: "exec";
                                                        };
                                                        readonly provider: {
                                                            readonly type: "string";
                                                            readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                        };
                                                        readonly id: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly required: readonly ["source", "provider", "id"];
                                                    readonly additionalProperties: false;
                                                }];
                                            }];
                                        };
                                    };
                                    readonly additionalProperties: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                        }, {
                                            readonly type: "number";
                                        }, {
                                            readonly type: "boolean";
                                        }, {
                                            readonly type: "null";
                                        }, {
                                            readonly type: "array";
                                            readonly items: {};
                                        }, {
                                            readonly type: "object";
                                            readonly propertyNames: {
                                                readonly type: "string";
                                            };
                                            readonly additionalProperties: {};
                                        }];
                                    };
                                };
                            };
                            readonly prefsPath: {
                                readonly type: "string";
                            };
                            readonly maxTextLength: {
                                readonly type: "integer";
                                readonly minimum: 1;
                                readonly maximum: 9007199254740991;
                            };
                            readonly timeoutMs: {
                                readonly type: "integer";
                                readonly minimum: 1000;
                                readonly maximum: 120000;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly commands: {
                readonly default: {
                    readonly native: "auto";
                    readonly nativeSkills: "auto";
                    readonly restart: true;
                    readonly ownerDisplay: "raw";
                };
                readonly type: "object";
                readonly properties: {
                    readonly native: {
                        readonly default: "auto";
                        readonly anyOf: readonly [{
                            readonly type: "boolean";
                        }, {
                            readonly type: "string";
                            readonly const: "auto";
                        }];
                    };
                    readonly nativeSkills: {
                        readonly default: "auto";
                        readonly anyOf: readonly [{
                            readonly type: "boolean";
                        }, {
                            readonly type: "string";
                            readonly const: "auto";
                        }];
                    };
                    readonly text: {
                        readonly type: "boolean";
                    };
                    readonly bash: {
                        readonly type: "boolean";
                    };
                    readonly bashForegroundMs: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly maximum: 30000;
                    };
                    readonly config: {
                        readonly type: "boolean";
                    };
                    readonly mcp: {
                        readonly type: "boolean";
                    };
                    readonly plugins: {
                        readonly type: "boolean";
                    };
                    readonly debug: {
                        readonly type: "boolean";
                    };
                    readonly restart: {
                        readonly default: true;
                        readonly type: "boolean";
                    };
                    readonly useAccessGroups: {
                        readonly type: "boolean";
                    };
                    readonly ownerAllowFrom: {
                        readonly type: "array";
                        readonly items: {
                            readonly anyOf: readonly [{
                                readonly type: "string";
                            }, {
                                readonly type: "number";
                            }];
                        };
                    };
                    readonly ownerDisplay: {
                        readonly default: "raw";
                        readonly type: "string";
                        readonly enum: readonly ["raw", "hash"];
                    };
                    readonly ownerDisplaySecret: {
                        readonly type: "string";
                    };
                    readonly allowFrom: {
                        readonly type: "object";
                        readonly propertyNames: {
                            readonly type: "string";
                        };
                        readonly additionalProperties: {
                            readonly type: "array";
                            readonly items: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                }, {
                                    readonly type: "number";
                                }];
                            };
                        };
                    };
                };
                readonly required: readonly ["native", "nativeSkills", "restart", "ownerDisplay"];
                readonly additionalProperties: false;
            };
            readonly approvals: {
                readonly type: "object";
                readonly properties: {
                    readonly exec: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly mode: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "session";
                                }, {
                                    readonly type: "string";
                                    readonly const: "targets";
                                }, {
                                    readonly type: "string";
                                    readonly const: "both";
                                }];
                            };
                            readonly agentFilter: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly sessionFilter: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly targets: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly channel: {
                                            readonly type: "string";
                                            readonly minLength: 1;
                                        };
                                        readonly to: {
                                            readonly type: "string";
                                            readonly minLength: 1;
                                        };
                                        readonly accountId: {
                                            readonly type: "string";
                                        };
                                        readonly threadId: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                            }, {
                                                readonly type: "number";
                                            }];
                                        };
                                    };
                                    readonly required: readonly ["channel", "to"];
                                    readonly additionalProperties: false;
                                };
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly plugin: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly mode: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "session";
                                }, {
                                    readonly type: "string";
                                    readonly const: "targets";
                                }, {
                                    readonly type: "string";
                                    readonly const: "both";
                                }];
                            };
                            readonly agentFilter: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly sessionFilter: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly targets: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly channel: {
                                            readonly type: "string";
                                            readonly minLength: 1;
                                        };
                                        readonly to: {
                                            readonly type: "string";
                                            readonly minLength: 1;
                                        };
                                        readonly accountId: {
                                            readonly type: "string";
                                        };
                                        readonly threadId: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                            }, {
                                                readonly type: "number";
                                            }];
                                        };
                                    };
                                    readonly required: readonly ["channel", "to"];
                                    readonly additionalProperties: false;
                                };
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly session: {
                readonly type: "object";
                readonly properties: {
                    readonly scope: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                            readonly const: "per-sender";
                        }, {
                            readonly type: "string";
                            readonly const: "global";
                        }];
                    };
                    readonly dmScope: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                            readonly const: "main";
                        }, {
                            readonly type: "string";
                            readonly const: "per-peer";
                        }, {
                            readonly type: "string";
                            readonly const: "per-channel-peer";
                        }, {
                            readonly type: "string";
                            readonly const: "per-account-channel-peer";
                        }];
                    };
                    readonly identityLinks: {
                        readonly type: "object";
                        readonly propertyNames: {
                            readonly type: "string";
                        };
                        readonly additionalProperties: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                    };
                    readonly resetTriggers: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly idleMinutes: {
                        readonly type: "integer";
                        readonly exclusiveMinimum: 0;
                        readonly maximum: 9007199254740991;
                    };
                    readonly reset: {
                        readonly type: "object";
                        readonly properties: {
                            readonly mode: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "daily";
                                }, {
                                    readonly type: "string";
                                    readonly const: "idle";
                                }];
                            };
                            readonly atHour: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 23;
                            };
                            readonly idleMinutes: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly resetByType: {
                        readonly type: "object";
                        readonly properties: {
                            readonly direct: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly mode: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "daily";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "idle";
                                        }];
                                    };
                                    readonly atHour: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 23;
                                    };
                                    readonly idleMinutes: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly dm: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly mode: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "daily";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "idle";
                                        }];
                                    };
                                    readonly atHour: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 23;
                                    };
                                    readonly idleMinutes: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly group: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly mode: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "daily";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "idle";
                                        }];
                                    };
                                    readonly atHour: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 23;
                                    };
                                    readonly idleMinutes: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly thread: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly mode: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "daily";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "idle";
                                        }];
                                    };
                                    readonly atHour: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 23;
                                    };
                                    readonly idleMinutes: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly resetByChannel: {
                        readonly type: "object";
                        readonly propertyNames: {
                            readonly type: "string";
                        };
                        readonly additionalProperties: {
                            readonly type: "object";
                            readonly properties: {
                                readonly mode: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                        readonly const: "daily";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "idle";
                                    }];
                                };
                                readonly atHour: {
                                    readonly type: "integer";
                                    readonly minimum: 0;
                                    readonly maximum: 23;
                                };
                                readonly idleMinutes: {
                                    readonly type: "integer";
                                    readonly exclusiveMinimum: 0;
                                    readonly maximum: 9007199254740991;
                                };
                            };
                            readonly additionalProperties: false;
                        };
                    };
                    readonly store: {
                        readonly type: "string";
                    };
                    readonly typingIntervalSeconds: {
                        readonly type: "integer";
                        readonly exclusiveMinimum: 0;
                        readonly maximum: 9007199254740991;
                    };
                    readonly typingMode: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                            readonly const: "never";
                        }, {
                            readonly type: "string";
                            readonly const: "instant";
                        }, {
                            readonly type: "string";
                            readonly const: "thinking";
                        }, {
                            readonly type: "string";
                            readonly const: "message";
                        }];
                    };
                    readonly parentForkMaxTokens: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly maximum: 9007199254740991;
                    };
                    readonly mainKey: {
                        readonly type: "string";
                    };
                    readonly sendPolicy: {
                        readonly type: "object";
                        readonly properties: {
                            readonly default: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "allow";
                                }, {
                                    readonly type: "string";
                                    readonly const: "deny";
                                }];
                            };
                            readonly rules: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly action: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "allow";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "deny";
                                            }];
                                        };
                                        readonly match: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly channel: {
                                                    readonly type: "string";
                                                };
                                                readonly chatType: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                        readonly const: "direct";
                                                    }, {
                                                        readonly type: "string";
                                                        readonly const: "group";
                                                    }, {
                                                        readonly type: "string";
                                                        readonly const: "channel";
                                                    }, {
                                                        readonly type: "string";
                                                        readonly const: "dm";
                                                    }];
                                                };
                                                readonly keyPrefix: {
                                                    readonly type: "string";
                                                };
                                                readonly rawKeyPrefix: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly additionalProperties: false;
                                        };
                                    };
                                    readonly required: readonly ["action"];
                                    readonly additionalProperties: false;
                                };
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly agentToAgent: {
                        readonly type: "object";
                        readonly properties: {
                            readonly maxPingPongTurns: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 5;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly threadBindings: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly idleHours: {
                                readonly type: "number";
                                readonly minimum: 0;
                            };
                            readonly maxAgeHours: {
                                readonly type: "number";
                                readonly minimum: 0;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly maintenance: {
                        readonly type: "object";
                        readonly properties: {
                            readonly mode: {
                                readonly type: "string";
                                readonly enum: readonly ["enforce", "warn"];
                            };
                            readonly pruneAfter: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                }, {
                                    readonly type: "number";
                                }];
                            };
                            readonly pruneDays: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly maxEntries: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly rotateBytes: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                }, {
                                    readonly type: "number";
                                }];
                            };
                            readonly resetArchiveRetention: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                }, {
                                    readonly type: "number";
                                }, {
                                    readonly type: "boolean";
                                    readonly const: false;
                                }];
                            };
                            readonly maxDiskBytes: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                }, {
                                    readonly type: "number";
                                }];
                            };
                            readonly highWaterBytes: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                }, {
                                    readonly type: "number";
                                }];
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly cron: {
                readonly type: "object";
                readonly properties: {
                    readonly enabled: {
                        readonly type: "boolean";
                    };
                    readonly store: {
                        readonly type: "string";
                    };
                    readonly maxConcurrentRuns: {
                        readonly type: "integer";
                        readonly exclusiveMinimum: 0;
                        readonly maximum: 9007199254740991;
                    };
                    readonly retry: {
                        readonly type: "object";
                        readonly properties: {
                            readonly maxAttempts: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 10;
                            };
                            readonly backoffMs: {
                                readonly minItems: 1;
                                readonly maxItems: 10;
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "integer";
                                    readonly minimum: 0;
                                    readonly maximum: 9007199254740991;
                                };
                            };
                            readonly retryOn: {
                                readonly minItems: 1;
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                    readonly enum: readonly ["rate_limit", "overloaded", "network", "timeout", "server_error"];
                                };
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly webhook: {
                        readonly type: "string";
                        readonly format: "uri";
                    };
                    readonly webhookToken: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                        }, {
                            readonly oneOf: readonly [{
                                readonly type: "object";
                                readonly properties: {
                                    readonly source: {
                                        readonly type: "string";
                                        readonly const: "env";
                                    };
                                    readonly provider: {
                                        readonly type: "string";
                                        readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                    };
                                    readonly id: {
                                        readonly type: "string";
                                        readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                    };
                                };
                                readonly required: readonly ["source", "provider", "id"];
                                readonly additionalProperties: false;
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly source: {
                                        readonly type: "string";
                                        readonly const: "file";
                                    };
                                    readonly provider: {
                                        readonly type: "string";
                                        readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                    };
                                    readonly id: {
                                        readonly type: "string";
                                    };
                                };
                                readonly required: readonly ["source", "provider", "id"];
                                readonly additionalProperties: false;
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly source: {
                                        readonly type: "string";
                                        readonly const: "exec";
                                    };
                                    readonly provider: {
                                        readonly type: "string";
                                        readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                    };
                                    readonly id: {
                                        readonly type: "string";
                                    };
                                };
                                readonly required: readonly ["source", "provider", "id"];
                                readonly additionalProperties: false;
                            }];
                        }];
                    };
                    readonly sessionRetention: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                        }, {
                            readonly type: "boolean";
                            readonly const: false;
                        }];
                    };
                    readonly runLog: {
                        readonly type: "object";
                        readonly properties: {
                            readonly maxBytes: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                }, {
                                    readonly type: "number";
                                }];
                            };
                            readonly keepLines: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly failureAlert: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly after: {
                                readonly type: "integer";
                                readonly minimum: 1;
                                readonly maximum: 9007199254740991;
                            };
                            readonly cooldownMs: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly mode: {
                                readonly type: "string";
                                readonly enum: readonly ["announce", "webhook"];
                            };
                            readonly accountId: {
                                readonly type: "string";
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly failureDestination: {
                        readonly type: "object";
                        readonly properties: {
                            readonly channel: {
                                readonly type: "string";
                            };
                            readonly to: {
                                readonly type: "string";
                            };
                            readonly accountId: {
                                readonly type: "string";
                            };
                            readonly mode: {
                                readonly type: "string";
                                readonly enum: readonly ["announce", "webhook"];
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly hooks: {
                readonly type: "object";
                readonly properties: {
                    readonly enabled: {
                        readonly type: "boolean";
                    };
                    readonly path: {
                        readonly type: "string";
                    };
                    readonly token: {
                        readonly type: "string";
                    };
                    readonly defaultSessionKey: {
                        readonly type: "string";
                    };
                    readonly allowRequestSessionKey: {
                        readonly type: "boolean";
                    };
                    readonly allowedSessionKeyPrefixes: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly allowedAgentIds: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly maxBodyBytes: {
                        readonly type: "integer";
                        readonly exclusiveMinimum: 0;
                        readonly maximum: 9007199254740991;
                    };
                    readonly presets: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly transformsDir: {
                        readonly type: "string";
                    };
                    readonly mappings: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                };
                                readonly match: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly path: {
                                            readonly type: "string";
                                        };
                                        readonly source: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly additionalProperties: false;
                                };
                                readonly action: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                        readonly const: "wake";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "agent";
                                    }];
                                };
                                readonly wakeMode: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                        readonly const: "now";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "next-heartbeat";
                                    }];
                                };
                                readonly name: {
                                    readonly type: "string";
                                };
                                readonly agentId: {
                                    readonly type: "string";
                                };
                                readonly sessionKey: {
                                    readonly type: "string";
                                };
                                readonly messageTemplate: {
                                    readonly type: "string";
                                };
                                readonly textTemplate: {
                                    readonly type: "string";
                                };
                                readonly deliver: {
                                    readonly type: "boolean";
                                };
                                readonly allowUnsafeExternalContent: {
                                    readonly type: "boolean";
                                };
                                readonly channel: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                        readonly const: "last";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "whatsapp";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "telegram";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "discord";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "irc";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "slack";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "signal";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "imessage";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "msteams";
                                    }];
                                };
                                readonly to: {
                                    readonly type: "string";
                                };
                                readonly model: {
                                    readonly type: "string";
                                };
                                readonly thinking: {
                                    readonly type: "string";
                                };
                                readonly timeoutSeconds: {
                                    readonly type: "integer";
                                    readonly exclusiveMinimum: 0;
                                    readonly maximum: 9007199254740991;
                                };
                                readonly transform: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly module: {
                                            readonly type: "string";
                                        };
                                        readonly export: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly required: readonly ["module"];
                                    readonly additionalProperties: false;
                                };
                            };
                            readonly additionalProperties: false;
                        };
                    };
                    readonly gmail: {
                        readonly type: "object";
                        readonly properties: {
                            readonly account: {
                                readonly type: "string";
                            };
                            readonly label: {
                                readonly type: "string";
                            };
                            readonly topic: {
                                readonly type: "string";
                            };
                            readonly subscription: {
                                readonly type: "string";
                            };
                            readonly pushToken: {
                                readonly type: "string";
                            };
                            readonly hookUrl: {
                                readonly type: "string";
                            };
                            readonly includeBody: {
                                readonly type: "boolean";
                            };
                            readonly maxBytes: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly renewEveryMinutes: {
                                readonly type: "integer";
                                readonly exclusiveMinimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly allowUnsafeExternalContent: {
                                readonly type: "boolean";
                            };
                            readonly serve: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly bind: {
                                        readonly type: "string";
                                    };
                                    readonly port: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly path: {
                                        readonly type: "string";
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly tailscale: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly mode: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "off";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "serve";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "funnel";
                                        }];
                                    };
                                    readonly path: {
                                        readonly type: "string";
                                    };
                                    readonly target: {
                                        readonly type: "string";
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly model: {
                                readonly type: "string";
                            };
                            readonly thinking: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "off";
                                }, {
                                    readonly type: "string";
                                    readonly const: "minimal";
                                }, {
                                    readonly type: "string";
                                    readonly const: "low";
                                }, {
                                    readonly type: "string";
                                    readonly const: "medium";
                                }, {
                                    readonly type: "string";
                                    readonly const: "high";
                                }];
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly internal: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly handlers: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly event: {
                                            readonly type: "string";
                                        };
                                        readonly module: {
                                            readonly type: "string";
                                        };
                                        readonly export: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly required: readonly ["event", "module"];
                                    readonly additionalProperties: false;
                                };
                            };
                            readonly entries: {
                                readonly type: "object";
                                readonly propertyNames: {
                                    readonly type: "string";
                                };
                                readonly additionalProperties: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly enabled: {
                                            readonly type: "boolean";
                                        };
                                        readonly env: {
                                            readonly type: "object";
                                            readonly propertyNames: {
                                                readonly type: "string";
                                            };
                                            readonly additionalProperties: {
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly additionalProperties: {};
                                };
                            };
                            readonly load: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly extraDirs: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly installs: {
                                readonly type: "object";
                                readonly propertyNames: {
                                    readonly type: "string";
                                };
                                readonly additionalProperties: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly source: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "npm";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "archive";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "path";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "clawhub";
                                            }];
                                        };
                                        readonly spec: {
                                            readonly type: "string";
                                        };
                                        readonly sourcePath: {
                                            readonly type: "string";
                                        };
                                        readonly installPath: {
                                            readonly type: "string";
                                        };
                                        readonly version: {
                                            readonly type: "string";
                                        };
                                        readonly resolvedName: {
                                            readonly type: "string";
                                        };
                                        readonly resolvedVersion: {
                                            readonly type: "string";
                                        };
                                        readonly resolvedSpec: {
                                            readonly type: "string";
                                        };
                                        readonly integrity: {
                                            readonly type: "string";
                                        };
                                        readonly shasum: {
                                            readonly type: "string";
                                        };
                                        readonly resolvedAt: {
                                            readonly type: "string";
                                        };
                                        readonly installedAt: {
                                            readonly type: "string";
                                        };
                                        readonly clawhubUrl: {
                                            readonly type: "string";
                                        };
                                        readonly clawhubPackage: {
                                            readonly type: "string";
                                        };
                                        readonly clawhubFamily: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "code-plugin";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "bundle-plugin";
                                            }];
                                        };
                                        readonly clawhubChannel: {
                                            readonly anyOf: readonly [{
                                                readonly type: "string";
                                                readonly const: "official";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "community";
                                            }, {
                                                readonly type: "string";
                                                readonly const: "private";
                                            }];
                                        };
                                        readonly hooks: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly required: readonly ["source"];
                                    readonly additionalProperties: false;
                                };
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly web: {
                readonly type: "object";
                readonly properties: {
                    readonly enabled: {
                        readonly type: "boolean";
                    };
                    readonly heartbeatSeconds: {
                        readonly type: "integer";
                        readonly exclusiveMinimum: 0;
                        readonly maximum: 9007199254740991;
                    };
                    readonly reconnect: {
                        readonly type: "object";
                        readonly properties: {
                            readonly initialMs: {
                                readonly type: "number";
                                readonly exclusiveMinimum: 0;
                            };
                            readonly maxMs: {
                                readonly type: "number";
                                readonly exclusiveMinimum: 0;
                            };
                            readonly factor: {
                                readonly type: "number";
                                readonly exclusiveMinimum: 0;
                            };
                            readonly jitter: {
                                readonly type: "number";
                                readonly minimum: 0;
                                readonly maximum: 1;
                            };
                            readonly maxAttempts: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly channels: {
                readonly properties: {};
                readonly required: readonly [];
                readonly additionalProperties: true;
            };
            readonly discovery: {
                readonly type: "object";
                readonly properties: {
                    readonly wideArea: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly domain: {
                                readonly type: "string";
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly mdns: {
                        readonly type: "object";
                        readonly properties: {
                            readonly mode: {
                                readonly type: "string";
                                readonly enum: readonly ["off", "minimal", "full"];
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly canvasHost: {
                readonly type: "object";
                readonly properties: {
                    readonly enabled: {
                        readonly type: "boolean";
                    };
                    readonly root: {
                        readonly type: "string";
                    };
                    readonly port: {
                        readonly type: "integer";
                        readonly exclusiveMinimum: 0;
                        readonly maximum: 9007199254740991;
                    };
                    readonly liveReload: {
                        readonly type: "boolean";
                    };
                };
                readonly additionalProperties: false;
            };
            readonly talk: {
                readonly type: "object";
                readonly properties: {
                    readonly provider: {
                        readonly type: "string";
                    };
                    readonly providers: {
                        readonly type: "object";
                        readonly propertyNames: {
                            readonly type: "string";
                        };
                        readonly additionalProperties: {
                            readonly type: "object";
                            readonly properties: {
                                readonly voiceId: {
                                    readonly type: "string";
                                };
                                readonly voiceAliases: {
                                    readonly type: "object";
                                    readonly propertyNames: {
                                        readonly type: "string";
                                    };
                                    readonly additionalProperties: {
                                        readonly type: "string";
                                    };
                                };
                                readonly modelId: {
                                    readonly type: "string";
                                };
                                readonly outputFormat: {
                                    readonly type: "string";
                                };
                                readonly apiKey: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                    }, {
                                        readonly oneOf: readonly [{
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly source: {
                                                    readonly type: "string";
                                                    readonly const: "env";
                                                };
                                                readonly provider: {
                                                    readonly type: "string";
                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                };
                                                readonly id: {
                                                    readonly type: "string";
                                                    readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                };
                                            };
                                            readonly required: readonly ["source", "provider", "id"];
                                            readonly additionalProperties: false;
                                        }, {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly source: {
                                                    readonly type: "string";
                                                    readonly const: "file";
                                                };
                                                readonly provider: {
                                                    readonly type: "string";
                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                };
                                                readonly id: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly required: readonly ["source", "provider", "id"];
                                            readonly additionalProperties: false;
                                        }, {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly source: {
                                                    readonly type: "string";
                                                    readonly const: "exec";
                                                };
                                                readonly provider: {
                                                    readonly type: "string";
                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                };
                                                readonly id: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly required: readonly ["source", "provider", "id"];
                                            readonly additionalProperties: false;
                                        }];
                                    }];
                                };
                            };
                            readonly additionalProperties: {};
                        };
                    };
                    readonly voiceId: {
                        readonly type: "string";
                    };
                    readonly voiceAliases: {
                        readonly type: "object";
                        readonly propertyNames: {
                            readonly type: "string";
                        };
                        readonly additionalProperties: {
                            readonly type: "string";
                        };
                    };
                    readonly modelId: {
                        readonly type: "string";
                    };
                    readonly outputFormat: {
                        readonly type: "string";
                    };
                    readonly apiKey: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                        }, {
                            readonly oneOf: readonly [{
                                readonly type: "object";
                                readonly properties: {
                                    readonly source: {
                                        readonly type: "string";
                                        readonly const: "env";
                                    };
                                    readonly provider: {
                                        readonly type: "string";
                                        readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                    };
                                    readonly id: {
                                        readonly type: "string";
                                        readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                    };
                                };
                                readonly required: readonly ["source", "provider", "id"];
                                readonly additionalProperties: false;
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly source: {
                                        readonly type: "string";
                                        readonly const: "file";
                                    };
                                    readonly provider: {
                                        readonly type: "string";
                                        readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                    };
                                    readonly id: {
                                        readonly type: "string";
                                    };
                                };
                                readonly required: readonly ["source", "provider", "id"];
                                readonly additionalProperties: false;
                            }, {
                                readonly type: "object";
                                readonly properties: {
                                    readonly source: {
                                        readonly type: "string";
                                        readonly const: "exec";
                                    };
                                    readonly provider: {
                                        readonly type: "string";
                                        readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                    };
                                    readonly id: {
                                        readonly type: "string";
                                    };
                                };
                                readonly required: readonly ["source", "provider", "id"];
                                readonly additionalProperties: false;
                            }];
                        }];
                    };
                    readonly interruptOnSpeech: {
                        readonly type: "boolean";
                    };
                    readonly silenceTimeoutMs: {
                        readonly type: "integer";
                        readonly exclusiveMinimum: 0;
                        readonly maximum: 9007199254740991;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly gateway: {
                readonly type: "object";
                readonly properties: {
                    readonly port: {
                        readonly type: "integer";
                        readonly exclusiveMinimum: 0;
                        readonly maximum: 9007199254740991;
                    };
                    readonly mode: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                            readonly const: "local";
                        }, {
                            readonly type: "string";
                            readonly const: "remote";
                        }];
                    };
                    readonly bind: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                            readonly const: "auto";
                        }, {
                            readonly type: "string";
                            readonly const: "lan";
                        }, {
                            readonly type: "string";
                            readonly const: "loopback";
                        }, {
                            readonly type: "string";
                            readonly const: "custom";
                        }, {
                            readonly type: "string";
                            readonly const: "tailnet";
                        }];
                    };
                    readonly customBindHost: {
                        readonly type: "string";
                    };
                    readonly controlUi: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly basePath: {
                                readonly type: "string";
                            };
                            readonly root: {
                                readonly type: "string";
                            };
                            readonly allowedOrigins: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly dangerouslyAllowHostHeaderOriginFallback: {
                                readonly type: "boolean";
                            };
                            readonly allowInsecureAuth: {
                                readonly type: "boolean";
                            };
                            readonly dangerouslyDisableDeviceAuth: {
                                readonly type: "boolean";
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly auth: {
                        readonly type: "object";
                        readonly properties: {
                            readonly mode: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "none";
                                }, {
                                    readonly type: "string";
                                    readonly const: "token";
                                }, {
                                    readonly type: "string";
                                    readonly const: "password";
                                }, {
                                    readonly type: "string";
                                    readonly const: "trusted-proxy";
                                }];
                            };
                            readonly token: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                }, {
                                    readonly oneOf: readonly [{
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly source: {
                                                readonly type: "string";
                                                readonly const: "env";
                                            };
                                            readonly provider: {
                                                readonly type: "string";
                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                                readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                            };
                                        };
                                        readonly required: readonly ["source", "provider", "id"];
                                        readonly additionalProperties: false;
                                    }, {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly source: {
                                                readonly type: "string";
                                                readonly const: "file";
                                            };
                                            readonly provider: {
                                                readonly type: "string";
                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly required: readonly ["source", "provider", "id"];
                                        readonly additionalProperties: false;
                                    }, {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly source: {
                                                readonly type: "string";
                                                readonly const: "exec";
                                            };
                                            readonly provider: {
                                                readonly type: "string";
                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly required: readonly ["source", "provider", "id"];
                                        readonly additionalProperties: false;
                                    }];
                                }];
                            };
                            readonly password: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                }, {
                                    readonly oneOf: readonly [{
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly source: {
                                                readonly type: "string";
                                                readonly const: "env";
                                            };
                                            readonly provider: {
                                                readonly type: "string";
                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                                readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                            };
                                        };
                                        readonly required: readonly ["source", "provider", "id"];
                                        readonly additionalProperties: false;
                                    }, {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly source: {
                                                readonly type: "string";
                                                readonly const: "file";
                                            };
                                            readonly provider: {
                                                readonly type: "string";
                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly required: readonly ["source", "provider", "id"];
                                        readonly additionalProperties: false;
                                    }, {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly source: {
                                                readonly type: "string";
                                                readonly const: "exec";
                                            };
                                            readonly provider: {
                                                readonly type: "string";
                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly required: readonly ["source", "provider", "id"];
                                        readonly additionalProperties: false;
                                    }];
                                }];
                            };
                            readonly allowTailscale: {
                                readonly type: "boolean";
                            };
                            readonly rateLimit: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly maxAttempts: {
                                        readonly type: "number";
                                    };
                                    readonly windowMs: {
                                        readonly type: "number";
                                    };
                                    readonly lockoutMs: {
                                        readonly type: "number";
                                    };
                                    readonly exemptLoopback: {
                                        readonly type: "boolean";
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly trustedProxy: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly userHeader: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                    };
                                    readonly requiredHeaders: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly allowUsers: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly required: readonly ["userHeader"];
                                readonly additionalProperties: false;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly trustedProxies: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly allowRealIpFallback: {
                        readonly type: "boolean";
                    };
                    readonly tools: {
                        readonly type: "object";
                        readonly properties: {
                            readonly deny: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly allow: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly channelHealthCheckMinutes: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly maximum: 9007199254740991;
                    };
                    readonly channelStaleEventThresholdMinutes: {
                        readonly type: "integer";
                        readonly minimum: 1;
                        readonly maximum: 9007199254740991;
                    };
                    readonly channelMaxRestartsPerHour: {
                        readonly type: "integer";
                        readonly minimum: 1;
                        readonly maximum: 9007199254740991;
                    };
                    readonly tailscale: {
                        readonly type: "object";
                        readonly properties: {
                            readonly mode: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "off";
                                }, {
                                    readonly type: "string";
                                    readonly const: "serve";
                                }, {
                                    readonly type: "string";
                                    readonly const: "funnel";
                                }];
                            };
                            readonly resetOnExit: {
                                readonly type: "boolean";
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly remote: {
                        readonly type: "object";
                        readonly properties: {
                            readonly url: {
                                readonly type: "string";
                            };
                            readonly transport: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "ssh";
                                }, {
                                    readonly type: "string";
                                    readonly const: "direct";
                                }];
                            };
                            readonly token: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                }, {
                                    readonly oneOf: readonly [{
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly source: {
                                                readonly type: "string";
                                                readonly const: "env";
                                            };
                                            readonly provider: {
                                                readonly type: "string";
                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                                readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                            };
                                        };
                                        readonly required: readonly ["source", "provider", "id"];
                                        readonly additionalProperties: false;
                                    }, {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly source: {
                                                readonly type: "string";
                                                readonly const: "file";
                                            };
                                            readonly provider: {
                                                readonly type: "string";
                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly required: readonly ["source", "provider", "id"];
                                        readonly additionalProperties: false;
                                    }, {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly source: {
                                                readonly type: "string";
                                                readonly const: "exec";
                                            };
                                            readonly provider: {
                                                readonly type: "string";
                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly required: readonly ["source", "provider", "id"];
                                        readonly additionalProperties: false;
                                    }];
                                }];
                            };
                            readonly password: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                }, {
                                    readonly oneOf: readonly [{
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly source: {
                                                readonly type: "string";
                                                readonly const: "env";
                                            };
                                            readonly provider: {
                                                readonly type: "string";
                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                                readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                            };
                                        };
                                        readonly required: readonly ["source", "provider", "id"];
                                        readonly additionalProperties: false;
                                    }, {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly source: {
                                                readonly type: "string";
                                                readonly const: "file";
                                            };
                                            readonly provider: {
                                                readonly type: "string";
                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly required: readonly ["source", "provider", "id"];
                                        readonly additionalProperties: false;
                                    }, {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly source: {
                                                readonly type: "string";
                                                readonly const: "exec";
                                            };
                                            readonly provider: {
                                                readonly type: "string";
                                                readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                            };
                                            readonly id: {
                                                readonly type: "string";
                                            };
                                        };
                                        readonly required: readonly ["source", "provider", "id"];
                                        readonly additionalProperties: false;
                                    }];
                                }];
                            };
                            readonly tlsFingerprint: {
                                readonly type: "string";
                            };
                            readonly sshTarget: {
                                readonly type: "string";
                            };
                            readonly sshIdentity: {
                                readonly type: "string";
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly reload: {
                        readonly type: "object";
                        readonly properties: {
                            readonly mode: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "off";
                                }, {
                                    readonly type: "string";
                                    readonly const: "restart";
                                }, {
                                    readonly type: "string";
                                    readonly const: "hot";
                                }, {
                                    readonly type: "string";
                                    readonly const: "hybrid";
                                }];
                            };
                            readonly debounceMs: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly deferralTimeoutMs: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly tls: {
                        readonly type: "object";
                        readonly properties: {
                            readonly enabled: {
                                readonly type: "boolean";
                            };
                            readonly autoGenerate: {
                                readonly type: "boolean";
                            };
                            readonly certPath: {
                                readonly type: "string";
                            };
                            readonly keyPath: {
                                readonly type: "string";
                            };
                            readonly caPath: {
                                readonly type: "string";
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly http: {
                        readonly type: "object";
                        readonly properties: {
                            readonly endpoints: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly chatCompletions: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly enabled: {
                                                readonly type: "boolean";
                                            };
                                            readonly maxBodyBytes: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly maxImageParts: {
                                                readonly type: "integer";
                                                readonly minimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly maxTotalImageBytes: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly images: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly allowUrl: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly urlAllowlist: {
                                                        readonly type: "array";
                                                        readonly items: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly allowedMimes: {
                                                        readonly type: "array";
                                                        readonly items: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly maxBytes: {
                                                        readonly type: "integer";
                                                        readonly exclusiveMinimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                    readonly maxRedirects: {
                                                        readonly type: "integer";
                                                        readonly minimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                    readonly timeoutMs: {
                                                        readonly type: "integer";
                                                        readonly exclusiveMinimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                };
                                                readonly additionalProperties: false;
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                    readonly responses: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly enabled: {
                                                readonly type: "boolean";
                                            };
                                            readonly maxBodyBytes: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly maxUrlParts: {
                                                readonly type: "integer";
                                                readonly minimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                            readonly files: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly allowUrl: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly urlAllowlist: {
                                                        readonly type: "array";
                                                        readonly items: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly allowedMimes: {
                                                        readonly type: "array";
                                                        readonly items: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly maxBytes: {
                                                        readonly type: "integer";
                                                        readonly exclusiveMinimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                    readonly maxRedirects: {
                                                        readonly type: "integer";
                                                        readonly minimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                    readonly timeoutMs: {
                                                        readonly type: "integer";
                                                        readonly exclusiveMinimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                    readonly maxChars: {
                                                        readonly type: "integer";
                                                        readonly exclusiveMinimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                    readonly pdf: {
                                                        readonly type: "object";
                                                        readonly properties: {
                                                            readonly maxPages: {
                                                                readonly type: "integer";
                                                                readonly exclusiveMinimum: 0;
                                                                readonly maximum: 9007199254740991;
                                                            };
                                                            readonly maxPixels: {
                                                                readonly type: "integer";
                                                                readonly exclusiveMinimum: 0;
                                                                readonly maximum: 9007199254740991;
                                                            };
                                                            readonly minTextChars: {
                                                                readonly type: "integer";
                                                                readonly minimum: 0;
                                                                readonly maximum: 9007199254740991;
                                                            };
                                                        };
                                                        readonly additionalProperties: false;
                                                    };
                                                };
                                                readonly additionalProperties: false;
                                            };
                                            readonly images: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly allowUrl: {
                                                        readonly type: "boolean";
                                                    };
                                                    readonly urlAllowlist: {
                                                        readonly type: "array";
                                                        readonly items: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly allowedMimes: {
                                                        readonly type: "array";
                                                        readonly items: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly maxBytes: {
                                                        readonly type: "integer";
                                                        readonly exclusiveMinimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                    readonly maxRedirects: {
                                                        readonly type: "integer";
                                                        readonly minimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                    readonly timeoutMs: {
                                                        readonly type: "integer";
                                                        readonly exclusiveMinimum: 0;
                                                        readonly maximum: 9007199254740991;
                                                    };
                                                };
                                                readonly additionalProperties: false;
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly securityHeaders: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly strictTransportSecurity: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                        }, {
                                            readonly type: "boolean";
                                            readonly const: false;
                                        }];
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly push: {
                        readonly type: "object";
                        readonly properties: {
                            readonly apns: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly relay: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly baseUrl: {
                                                readonly type: "string";
                                            };
                                            readonly timeoutMs: {
                                                readonly type: "integer";
                                                readonly exclusiveMinimum: 0;
                                                readonly maximum: 9007199254740991;
                                            };
                                        };
                                        readonly additionalProperties: false;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly nodes: {
                        readonly type: "object";
                        readonly properties: {
                            readonly browser: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly mode: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "auto";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "manual";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "off";
                                        }];
                                    };
                                    readonly node: {
                                        readonly type: "string";
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly allowCommands: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly denyCommands: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly memory: {
                readonly type: "object";
                readonly properties: {
                    readonly backend: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                            readonly const: "builtin";
                        }, {
                            readonly type: "string";
                            readonly const: "qmd";
                        }];
                    };
                    readonly citations: {
                        readonly anyOf: readonly [{
                            readonly type: "string";
                            readonly const: "auto";
                        }, {
                            readonly type: "string";
                            readonly const: "on";
                        }, {
                            readonly type: "string";
                            readonly const: "off";
                        }];
                    };
                    readonly qmd: {
                        readonly type: "object";
                        readonly properties: {
                            readonly command: {
                                readonly type: "string";
                            };
                            readonly mcporter: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly enabled: {
                                        readonly type: "boolean";
                                    };
                                    readonly serverName: {
                                        readonly type: "string";
                                    };
                                    readonly startDaemon: {
                                        readonly type: "boolean";
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly searchMode: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "query";
                                }, {
                                    readonly type: "string";
                                    readonly const: "search";
                                }, {
                                    readonly type: "string";
                                    readonly const: "vsearch";
                                }];
                            };
                            readonly includeDefaultMemory: {
                                readonly type: "boolean";
                            };
                            readonly paths: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly path: {
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                        };
                                        readonly pattern: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly required: readonly ["path"];
                                    readonly additionalProperties: false;
                                };
                            };
                            readonly sessions: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly enabled: {
                                        readonly type: "boolean";
                                    };
                                    readonly exportDir: {
                                        readonly type: "string";
                                    };
                                    readonly retentionDays: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly update: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly interval: {
                                        readonly type: "string";
                                    };
                                    readonly debounceMs: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly onBoot: {
                                        readonly type: "boolean";
                                    };
                                    readonly waitForBootSync: {
                                        readonly type: "boolean";
                                    };
                                    readonly embedInterval: {
                                        readonly type: "string";
                                    };
                                    readonly commandTimeoutMs: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly updateTimeoutMs: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly embedTimeoutMs: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly limits: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly maxResults: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly maxSnippetChars: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly maxInjectedChars: {
                                        readonly type: "integer";
                                        readonly exclusiveMinimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                    readonly timeoutMs: {
                                        readonly type: "integer";
                                        readonly minimum: 0;
                                        readonly maximum: 9007199254740991;
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                            readonly scope: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly default: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "allow";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "deny";
                                        }];
                                    };
                                    readonly rules: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly action: {
                                                    readonly anyOf: readonly [{
                                                        readonly type: "string";
                                                        readonly const: "allow";
                                                    }, {
                                                        readonly type: "string";
                                                        readonly const: "deny";
                                                    }];
                                                };
                                                readonly match: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly channel: {
                                                            readonly type: "string";
                                                        };
                                                        readonly chatType: {
                                                            readonly anyOf: readonly [{
                                                                readonly type: "string";
                                                                readonly const: "direct";
                                                            }, {
                                                                readonly type: "string";
                                                                readonly const: "group";
                                                            }, {
                                                                readonly type: "string";
                                                                readonly const: "channel";
                                                            }, {
                                                                readonly type: "string";
                                                                readonly const: "dm";
                                                            }];
                                                        };
                                                        readonly keyPrefix: {
                                                            readonly type: "string";
                                                        };
                                                        readonly rawKeyPrefix: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly additionalProperties: false;
                                                };
                                            };
                                            readonly required: readonly ["action"];
                                            readonly additionalProperties: false;
                                        };
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
            readonly mcp: {
                readonly type: "object";
                readonly properties: {
                    readonly servers: {
                        readonly type: "object";
                        readonly propertyNames: {
                            readonly type: "string";
                        };
                        readonly additionalProperties: {
                            readonly type: "object";
                            readonly properties: {
                                readonly command: {
                                    readonly type: "string";
                                };
                                readonly args: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                                readonly env: {
                                    readonly type: "object";
                                    readonly propertyNames: {
                                        readonly type: "string";
                                    };
                                    readonly additionalProperties: {
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                        }, {
                                            readonly type: "number";
                                        }, {
                                            readonly type: "boolean";
                                        }];
                                    };
                                };
                                readonly cwd: {
                                    readonly type: "string";
                                };
                                readonly workingDirectory: {
                                    readonly type: "string";
                                };
                                readonly url: {
                                    readonly type: "string";
                                    readonly format: "uri";
                                };
                            };
                            readonly additionalProperties: {};
                        };
                    };
                };
                readonly additionalProperties: false;
            };
            readonly skills: {
                readonly type: "object";
                readonly properties: {
                    readonly allowBundled: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly load: {
                        readonly type: "object";
                        readonly properties: {
                            readonly extraDirs: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly watch: {
                                readonly type: "boolean";
                            };
                            readonly watchDebounceMs: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly install: {
                        readonly type: "object";
                        readonly properties: {
                            readonly preferBrew: {
                                readonly type: "boolean";
                            };
                            readonly nodeManager: {
                                readonly anyOf: readonly [{
                                    readonly type: "string";
                                    readonly const: "npm";
                                }, {
                                    readonly type: "string";
                                    readonly const: "pnpm";
                                }, {
                                    readonly type: "string";
                                    readonly const: "yarn";
                                }, {
                                    readonly type: "string";
                                    readonly const: "bun";
                                }];
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly limits: {
                        readonly type: "object";
                        readonly properties: {
                            readonly maxCandidatesPerRoot: {
                                readonly type: "integer";
                                readonly minimum: 1;
                                readonly maximum: 9007199254740991;
                            };
                            readonly maxSkillsLoadedPerSource: {
                                readonly type: "integer";
                                readonly minimum: 1;
                                readonly maximum: 9007199254740991;
                            };
                            readonly maxSkillsInPrompt: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly maxSkillsPromptChars: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                            readonly maxSkillFileBytes: {
                                readonly type: "integer";
                                readonly minimum: 0;
                                readonly maximum: 9007199254740991;
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly entries: {
                        readonly type: "object";
                        readonly propertyNames: {
                            readonly type: "string";
                        };
                        readonly additionalProperties: {
                            readonly type: "object";
                            readonly properties: {
                                readonly enabled: {
                                    readonly type: "boolean";
                                };
                                readonly apiKey: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                    }, {
                                        readonly oneOf: readonly [{
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly source: {
                                                    readonly type: "string";
                                                    readonly const: "env";
                                                };
                                                readonly provider: {
                                                    readonly type: "string";
                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                };
                                                readonly id: {
                                                    readonly type: "string";
                                                    readonly pattern: "^[A-Z][A-Z0-9_]{0,127}$";
                                                };
                                            };
                                            readonly required: readonly ["source", "provider", "id"];
                                            readonly additionalProperties: false;
                                        }, {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly source: {
                                                    readonly type: "string";
                                                    readonly const: "file";
                                                };
                                                readonly provider: {
                                                    readonly type: "string";
                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                };
                                                readonly id: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly required: readonly ["source", "provider", "id"];
                                            readonly additionalProperties: false;
                                        }, {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly source: {
                                                    readonly type: "string";
                                                    readonly const: "exec";
                                                };
                                                readonly provider: {
                                                    readonly type: "string";
                                                    readonly pattern: "^[a-z][a-z0-9_-]{0,63}$";
                                                };
                                                readonly id: {
                                                    readonly type: "string";
                                                };
                                            };
                                            readonly required: readonly ["source", "provider", "id"];
                                            readonly additionalProperties: false;
                                        }];
                                    }];
                                };
                                readonly env: {
                                    readonly type: "object";
                                    readonly propertyNames: {
                                        readonly type: "string";
                                    };
                                    readonly additionalProperties: {
                                        readonly type: "string";
                                    };
                                };
                                readonly config: {
                                    readonly type: "object";
                                    readonly propertyNames: {
                                        readonly type: "string";
                                    };
                                    readonly additionalProperties: {};
                                };
                            };
                            readonly additionalProperties: false;
                        };
                    };
                };
                readonly additionalProperties: false;
            };
            readonly plugins: {
                readonly type: "object";
                readonly properties: {
                    readonly enabled: {
                        readonly type: "boolean";
                    };
                    readonly allow: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly deny: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly load: {
                        readonly type: "object";
                        readonly properties: {
                            readonly paths: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly slots: {
                        readonly type: "object";
                        readonly properties: {
                            readonly memory: {
                                readonly type: "string";
                            };
                            readonly contextEngine: {
                                readonly type: "string";
                            };
                        };
                        readonly additionalProperties: false;
                    };
                    readonly entries: {
                        readonly type: "object";
                        readonly propertyNames: {
                            readonly type: "string";
                        };
                        readonly additionalProperties: {
                            readonly type: "object";
                            readonly properties: {
                                readonly enabled: {
                                    readonly type: "boolean";
                                };
                                readonly hooks: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly allowPromptInjection: {
                                            readonly type: "boolean";
                                        };
                                    };
                                    readonly additionalProperties: false;
                                };
                                readonly subagent: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly allowModelOverride: {
                                            readonly type: "boolean";
                                        };
                                        readonly allowedModels: {
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly additionalProperties: false;
                                };
                                readonly config: {
                                    readonly type: "object";
                                    readonly propertyNames: {
                                        readonly type: "string";
                                    };
                                    readonly additionalProperties: {};
                                };
                            };
                            readonly additionalProperties: false;
                        };
                    };
                    readonly installs: {
                        readonly type: "object";
                        readonly propertyNames: {
                            readonly type: "string";
                        };
                        readonly additionalProperties: {
                            readonly type: "object";
                            readonly properties: {
                                readonly source: {
                                    readonly anyOf: readonly [{
                                        readonly anyOf: readonly [{
                                            readonly type: "string";
                                            readonly const: "npm";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "archive";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "path";
                                        }, {
                                            readonly type: "string";
                                            readonly const: "clawhub";
                                        }];
                                    }, {
                                        readonly type: "string";
                                        readonly const: "marketplace";
                                    }];
                                };
                                readonly spec: {
                                    readonly type: "string";
                                };
                                readonly sourcePath: {
                                    readonly type: "string";
                                };
                                readonly installPath: {
                                    readonly type: "string";
                                };
                                readonly version: {
                                    readonly type: "string";
                                };
                                readonly resolvedName: {
                                    readonly type: "string";
                                };
                                readonly resolvedVersion: {
                                    readonly type: "string";
                                };
                                readonly resolvedSpec: {
                                    readonly type: "string";
                                };
                                readonly integrity: {
                                    readonly type: "string";
                                };
                                readonly shasum: {
                                    readonly type: "string";
                                };
                                readonly resolvedAt: {
                                    readonly type: "string";
                                };
                                readonly installedAt: {
                                    readonly type: "string";
                                };
                                readonly clawhubUrl: {
                                    readonly type: "string";
                                };
                                readonly clawhubPackage: {
                                    readonly type: "string";
                                };
                                readonly clawhubFamily: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                        readonly const: "code-plugin";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "bundle-plugin";
                                    }];
                                };
                                readonly clawhubChannel: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                        readonly const: "official";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "community";
                                    }, {
                                        readonly type: "string";
                                        readonly const: "private";
                                    }];
                                };
                                readonly marketplaceName: {
                                    readonly type: "string";
                                };
                                readonly marketplaceSource: {
                                    readonly type: "string";
                                };
                                readonly marketplacePlugin: {
                                    readonly type: "string";
                                };
                            };
                            readonly required: readonly ["source"];
                            readonly additionalProperties: false;
                        };
                    };
                };
                readonly additionalProperties: false;
            };
        };
        readonly required: readonly ["commands"];
        readonly additionalProperties: false;
        readonly title: "OpenClawConfig";
    };
    readonly uiHints: {
        readonly wizard: {
            readonly label: "Setup Wizard State";
            readonly group: "Wizard";
            readonly order: 20;
            readonly help: "Setup wizard state tracking fields that record the most recent guided setup run details. Keep these fields for observability and troubleshooting of setup flows across upgrades.";
            readonly tags: ["advanced"];
        };
        readonly update: {
            readonly label: "Updates";
            readonly group: "Update";
            readonly order: 25;
            readonly help: "Update-channel and startup-check behavior for keeping OpenClaw runtime versions current. Use conservative channels in production and more experimental channels only in controlled environments.";
            readonly tags: ["advanced"];
        };
        readonly cli: {
            readonly label: "CLI";
            readonly group: "CLI";
            readonly order: 26;
            readonly help: "CLI presentation controls for local command output behavior such as banner and tagline style. Use this section to keep startup output aligned with operator preference without changing runtime behavior.";
            readonly tags: ["advanced"];
        };
        readonly diagnostics: {
            readonly label: "Diagnostics";
            readonly group: "Diagnostics";
            readonly order: 27;
            readonly help: "Diagnostics controls for targeted tracing, telemetry export, and cache inspection during debugging. Keep baseline diagnostics minimal in production and enable deeper signals only when investigating issues.";
            readonly tags: ["observability"];
        };
        readonly logging: {
            readonly label: "Logging";
            readonly group: "Logging";
            readonly order: 900;
            readonly help: "Logging behavior controls for severity, output destinations, formatting, and sensitive-data redaction. Keep levels and redaction strict enough for production while preserving useful diagnostics.";
            readonly tags: ["advanced"];
        };
        readonly gateway: {
            readonly label: "Gateway";
            readonly group: "Gateway";
            readonly order: 30;
            readonly help: "Gateway runtime surface for bind mode, auth, control UI, remote transport, and operational safety controls. Keep conservative defaults unless you intentionally expose the gateway beyond trusted local interfaces.";
            readonly tags: ["advanced"];
        };
        readonly nodeHost: {
            readonly label: "Node Host";
            readonly group: "Node Host";
            readonly order: 35;
            readonly help: "Node host controls for features exposed from this gateway node to other nodes or clients. Keep defaults unless you intentionally proxy local capabilities across your node network.";
            readonly tags: ["advanced"];
        };
        readonly agents: {
            readonly label: "Agents";
            readonly group: "Agents";
            readonly order: 40;
            readonly help: "Agent runtime configuration root covering defaults and explicit agent entries used for routing and execution context. Keep this section explicit so model/tool behavior stays predictable across multi-agent workflows.";
            readonly tags: ["advanced"];
        };
        readonly tools: {
            readonly label: "Tools";
            readonly group: "Tools";
            readonly order: 50;
            readonly help: "Global tool access policy and capability configuration across web, exec, media, messaging, and elevated surfaces. Use this section to constrain risky capabilities before broad rollout.";
            readonly tags: ["advanced"];
        };
        readonly bindings: {
            readonly label: "Bindings";
            readonly group: "Bindings";
            readonly order: 55;
            readonly help: "Top-level binding rules for routing and persistent ACP conversation ownership. Use type=route for normal routing and type=acp for persistent ACP harness bindings.";
            readonly tags: ["advanced"];
        };
        readonly audio: {
            readonly label: "Audio";
            readonly group: "Audio";
            readonly order: 60;
            readonly help: "Global audio ingestion settings used before higher-level tools process speech or media content. Configure this when you need deterministic transcription behavior for voice notes and clips.";
            readonly tags: ["advanced"];
        };
        readonly models: {
            readonly label: "Models";
            readonly group: "Models";
            readonly order: 70;
            readonly help: "Model catalog root for provider definitions, merge/replace behavior, and optional Bedrock discovery integration. Keep provider definitions explicit and validated before relying on production failover paths.";
            readonly tags: ["models"];
        };
        readonly messages: {
            readonly label: "Messages";
            readonly group: "Messages";
            readonly order: 80;
            readonly help: "Message formatting, acknowledgment, queueing, debounce, and status reaction behavior for inbound/outbound chat flows. Use this section when channel responsiveness or message UX needs adjustment.";
            readonly tags: ["advanced"];
        };
        readonly commands: {
            readonly label: "Commands";
            readonly group: "Commands";
            readonly order: 85;
            readonly help: "Controls chat command surfaces, owner gating, and elevated command access behavior across providers. Keep defaults unless you need stricter operator controls or broader command availability.";
            readonly tags: ["advanced"];
        };
        readonly session: {
            readonly label: "Session";
            readonly group: "Session";
            readonly order: 90;
            readonly help: "Global session routing, reset, delivery policy, and maintenance controls for conversation history behavior. Keep defaults unless you need stricter isolation, retention, or delivery constraints.";
            readonly tags: ["storage"];
        };
        readonly cron: {
            readonly label: "Cron";
            readonly group: "Cron";
            readonly order: 100;
            readonly help: "Global scheduler settings for stored cron jobs, run concurrency, delivery fallback, and run-session retention. Keep defaults unless you are scaling job volume or integrating external webhook receivers.";
            readonly tags: ["automation"];
        };
        readonly hooks: {
            readonly label: "Hooks";
            readonly group: "Hooks";
            readonly order: 110;
            readonly help: "Inbound webhook automation surface for mapping external events into wake or agent actions in OpenClaw. Keep this locked down with explicit token/session/agent controls before exposing it beyond trusted networks.";
            readonly tags: ["advanced"];
        };
        readonly ui: {
            readonly label: "UI";
            readonly group: "UI";
            readonly order: 120;
            readonly help: "UI presentation settings for accenting and assistant identity shown in control surfaces. Use this for branding and readability customization without changing runtime behavior.";
            readonly tags: ["advanced"];
        };
        readonly browser: {
            readonly label: "Browser";
            readonly group: "Browser";
            readonly order: 130;
            readonly help: "Browser runtime controls for local or remote CDP attachment, profile routing, and screenshot/snapshot behavior. Keep defaults unless your automation workflow requires custom browser transport settings.";
            readonly tags: ["advanced"];
        };
        readonly talk: {
            readonly label: "Talk";
            readonly group: "Talk";
            readonly order: 140;
            readonly help: "Talk-mode voice synthesis settings for voice identity, model selection, output format, and interruption behavior. Use this section to tune human-facing voice UX while controlling latency and cost.";
            readonly tags: ["advanced"];
        };
        readonly channels: {
            readonly label: "Channels";
            readonly group: "Messaging Channels";
            readonly order: 150;
            readonly help: "Channel provider configurations plus shared defaults that control access policies, heartbeat visibility, and per-surface behavior. Keep defaults centralized and override per provider only where required.";
            readonly tags: ["advanced"];
        };
        readonly skills: {
            readonly label: "Skills";
            readonly group: "Skills";
            readonly order: 200;
            readonly tags: ["advanced"];
        };
        readonly plugins: {
            readonly label: "Plugins";
            readonly group: "Plugins";
            readonly order: 205;
            readonly help: "Plugin system controls for enabling extensions, constraining load scope, configuring entries, and tracking installs. Keep plugin policy explicit and least-privilege in production environments.";
            readonly tags: ["advanced"];
        };
        readonly discovery: {
            readonly label: "Discovery";
            readonly group: "Discovery";
            readonly order: 210;
            readonly help: "Service discovery settings for local mDNS advertisement and optional wide-area presence signaling. Keep discovery scoped to expected networks to avoid leaking service metadata.";
            readonly tags: ["advanced"];
        };
        readonly presence: {
            readonly label: "Presence";
            readonly group: "Presence";
            readonly order: 220;
            readonly tags: ["advanced"];
        };
        readonly voicewake: {
            readonly label: "Voice Wake";
            readonly group: "Voice Wake";
            readonly order: 230;
            readonly tags: ["advanced"];
        };
        readonly meta: {
            readonly label: "Metadata";
            readonly help: "Metadata fields automatically maintained by OpenClaw to record write/version history for this config file. Keep these values system-managed and avoid manual edits unless debugging migration history.";
            readonly tags: ["advanced"];
        };
        readonly "meta.lastTouchedVersion": {
            readonly label: "Config Last Touched Version";
            readonly help: "Auto-set when OpenClaw writes the config.";
            readonly tags: ["media"];
        };
        readonly "meta.lastTouchedAt": {
            readonly label: "Config Last Touched At";
            readonly help: "ISO timestamp of the last config write (auto-set).";
            readonly tags: ["media"];
        };
        readonly env: {
            readonly label: "Environment";
            readonly help: "Environment import and override settings used to supply runtime variables to the gateway process. Use this section to control shell-env loading and explicit variable injection behavior.";
            readonly tags: ["advanced"];
        };
        readonly "env.shellEnv": {
            readonly label: "Shell Environment Import";
            readonly help: "Shell environment import controls for loading variables from your login shell during startup. Keep this enabled when you depend on profile-defined secrets or PATH customizations.";
            readonly tags: ["advanced"];
        };
        readonly "env.shellEnv.enabled": {
            readonly label: "Shell Environment Import Enabled";
            readonly help: "Enables loading environment variables from the user shell profile during startup initialization. Keep enabled for developer machines, or disable in locked-down service environments with explicit env management.";
            readonly tags: ["advanced"];
        };
        readonly "env.shellEnv.timeoutMs": {
            readonly label: "Shell Environment Import Timeout (ms)";
            readonly help: "Maximum time in milliseconds allowed for shell environment resolution before fallback behavior applies. Use tighter timeouts for faster startup, or increase when shell initialization is heavy.";
            readonly tags: ["performance"];
        };
        readonly "env.vars": {
            readonly label: "Environment Variable Overrides";
            readonly help: "Explicit key/value environment variable overrides merged into runtime process environment for OpenClaw. Use this for deterministic env configuration instead of relying only on shell profile side effects.";
            readonly tags: ["advanced"];
        };
        readonly "wizard.lastRunAt": {
            readonly label: "Wizard Last Run Timestamp";
            readonly help: "ISO timestamp for when the setup wizard most recently completed on this host. Use this to confirm setup recency during support and operational audits.";
            readonly tags: ["advanced"];
        };
        readonly "wizard.lastRunVersion": {
            readonly label: "Wizard Last Run Version";
            readonly help: "OpenClaw version recorded at the time of the most recent wizard run on this config. Use this when diagnosing behavior differences across version-to-version setup changes.";
            readonly tags: ["advanced"];
        };
        readonly "wizard.lastRunCommit": {
            readonly label: "Wizard Last Run Commit";
            readonly help: "Source commit identifier recorded for the last wizard execution in development builds. Use this to correlate setup behavior with exact source state during debugging.";
            readonly tags: ["advanced"];
        };
        readonly "wizard.lastRunCommand": {
            readonly label: "Wizard Last Run Command";
            readonly help: "Command invocation recorded for the latest wizard run to preserve execution context. Use this to reproduce setup steps when verifying setup regressions.";
            readonly tags: ["advanced"];
        };
        readonly "wizard.lastRunMode": {
            readonly label: "Wizard Last Run Mode";
            readonly help: "Wizard execution mode recorded as \"local\" or \"remote\" for the most recent setup flow. Use this to understand whether setup targeted direct local runtime or remote gateway topology.";
            readonly tags: ["advanced"];
        };
        readonly "diagnostics.otel": {
            readonly label: "OpenTelemetry";
            readonly help: "OpenTelemetry export settings for traces, metrics, and logs emitted by gateway components. Use this when integrating with centralized observability backends and distributed tracing pipelines.";
            readonly tags: ["observability"];
        };
        readonly "diagnostics.cacheTrace": {
            readonly label: "Cache Trace";
            readonly help: "Cache-trace logging settings for observing cache decisions and payload context in embedded runs. Enable this temporarily for debugging and disable afterward to reduce sensitive log footprint.";
            readonly tags: ["observability", "storage"];
        };
        readonly "logging.level": {
            readonly label: "Log Level";
            readonly help: "Primary log level threshold for runtime logger output: \"silent\", \"fatal\", \"error\", \"warn\", \"info\", \"debug\", or \"trace\". Keep \"info\" or \"warn\" for production, and use debug/trace only during investigation.";
            readonly tags: ["observability"];
        };
        readonly "logging.file": {
            readonly label: "Log File Path";
            readonly help: "Optional file path for persisted log output in addition to or instead of console logging. Use a managed writable path and align retention/rotation with your operational policy.";
            readonly tags: ["observability", "storage"];
        };
        readonly "logging.consoleLevel": {
            readonly label: "Console Log Level";
            readonly help: "Console-specific log threshold: \"silent\", \"fatal\", \"error\", \"warn\", \"info\", \"debug\", or \"trace\" for terminal output control. Use this to keep local console quieter while retaining richer file logging if needed.";
            readonly tags: ["observability"];
        };
        readonly "logging.consoleStyle": {
            readonly label: "Console Log Style";
            readonly help: "Console output format style: \"pretty\", \"compact\", or \"json\" based on operator and ingestion needs. Use json for machine parsing pipelines and pretty/compact for human-first terminal workflows.";
            readonly tags: ["observability"];
        };
        readonly "logging.redactSensitive": {
            readonly label: "Sensitive Data Redaction Mode";
            readonly help: "Sensitive redaction mode: \"off\" disables built-in masking, while \"tools\" redacts sensitive tool/config payload fields. Keep \"tools\" in shared logs unless you have isolated secure log sinks.";
            readonly tags: ["privacy", "observability"];
        };
        readonly "logging.redactPatterns": {
            readonly label: "Custom Redaction Patterns";
            readonly help: "Additional custom redact regex patterns applied to log output before emission/storage. Use this to mask org-specific tokens and identifiers not covered by built-in redaction rules.";
            readonly tags: ["privacy", "observability"];
        };
        readonly "cli.banner": {
            readonly label: "CLI Banner";
            readonly help: "CLI startup banner controls for title/version line and tagline style behavior. Keep banner enabled for fast version/context checks, then tune tagline mode to your preferred noise level.";
            readonly tags: ["advanced"];
        };
        readonly "cli.banner.taglineMode": {
            readonly label: "CLI Banner Tagline Mode";
            readonly help: "Controls tagline style in the CLI startup banner: \"random\" (default) picks from the rotating tagline pool, \"default\" always shows the neutral default tagline, and \"off\" hides tagline text while keeping the banner version line.";
            readonly tags: ["advanced"];
        };
        readonly "update.channel": {
            readonly label: "Update Channel";
            readonly help: "Update channel for git + npm installs (\"stable\", \"beta\", or \"dev\").";
            readonly tags: ["advanced"];
        };
        readonly "update.checkOnStart": {
            readonly label: "Update Check on Start";
            readonly help: "Check for npm updates when the gateway starts (default: true).";
            readonly tags: ["automation"];
        };
        readonly "update.auto.enabled": {
            readonly label: "Auto Update Enabled";
            readonly help: "Enable background auto-update for package installs (default: false).";
            readonly tags: ["advanced"];
        };
        readonly "update.auto.stableDelayHours": {
            readonly label: "Auto Update Stable Delay (hours)";
            readonly help: "Minimum delay before stable-channel auto-apply starts (default: 6).";
            readonly tags: ["advanced"];
        };
        readonly "update.auto.stableJitterHours": {
            readonly label: "Auto Update Stable Jitter (hours)";
            readonly help: "Extra stable-channel rollout spread window in hours (default: 12).";
            readonly tags: ["advanced"];
        };
        readonly "update.auto.betaCheckIntervalHours": {
            readonly label: "Auto Update Beta Check Interval (hours)";
            readonly help: "How often beta-channel checks run in hours (default: 1).";
            readonly tags: ["performance"];
        };
        readonly "diagnostics.enabled": {
            readonly label: "Diagnostics Enabled";
            readonly help: "Master toggle for diagnostics instrumentation output in logs and telemetry wiring paths. Keep enabled for normal observability, and disable only in tightly constrained environments.";
            readonly tags: ["observability"];
        };
        readonly "diagnostics.flags": {
            readonly label: "Diagnostics Flags";
            readonly help: "Enable targeted diagnostics logs by flag (e.g. [\"telegram.http\"]). Supports wildcards like \"telegram.*\" or \"*\".";
            readonly tags: ["observability"];
        };
        readonly "diagnostics.stuckSessionWarnMs": {
            readonly label: "Stuck Session Warning Threshold (ms)";
            readonly help: "Age threshold in milliseconds for emitting stuck-session warnings while a session remains in processing state. Increase for long multi-tool turns to reduce false positives; decrease for faster hang detection.";
            readonly tags: ["observability", "storage"];
        };
        readonly "diagnostics.otel.enabled": {
            readonly label: "OpenTelemetry Enabled";
            readonly help: "Enables OpenTelemetry export pipeline for traces, metrics, and logs based on configured endpoint/protocol settings. Keep disabled unless your collector endpoint and auth are fully configured.";
            readonly tags: ["observability"];
        };
        readonly "diagnostics.otel.endpoint": {
            readonly label: "OpenTelemetry Endpoint";
            readonly help: "Collector endpoint URL used for OpenTelemetry export transport, including scheme and port. Use a reachable, trusted collector endpoint and monitor ingestion errors after rollout.";
            readonly tags: ["observability"];
        };
        readonly "diagnostics.otel.protocol": {
            readonly label: "OpenTelemetry Protocol";
            readonly help: "OTel transport protocol for telemetry export: \"http/protobuf\" or \"grpc\" depending on collector support. Use the protocol your observability backend expects to avoid dropped telemetry payloads.";
            readonly tags: ["observability"];
        };
        readonly "diagnostics.otel.headers": {
            readonly label: "OpenTelemetry Headers";
            readonly help: "Additional HTTP/gRPC metadata headers sent with OpenTelemetry export requests, often used for tenant auth or routing. Keep secrets in env-backed values and avoid unnecessary header sprawl.";
            readonly tags: ["observability"];
        };
        readonly "diagnostics.otel.serviceName": {
            readonly label: "OpenTelemetry Service Name";
            readonly help: "Service name reported in telemetry resource attributes to identify this gateway instance in observability backends. Use stable names so dashboards and alerts remain consistent over deployments.";
            readonly tags: ["observability"];
        };
        readonly "diagnostics.otel.traces": {
            readonly label: "OpenTelemetry Traces Enabled";
            readonly help: "Enable trace signal export to the configured OpenTelemetry collector endpoint. Keep enabled when latency/debug tracing is needed, and disable if you only want metrics/logs.";
            readonly tags: ["observability"];
        };
        readonly "diagnostics.otel.metrics": {
            readonly label: "OpenTelemetry Metrics Enabled";
            readonly help: "Enable metrics signal export to the configured OpenTelemetry collector endpoint. Keep enabled for runtime health dashboards, and disable only if metric volume must be minimized.";
            readonly tags: ["observability"];
        };
        readonly "diagnostics.otel.logs": {
            readonly label: "OpenTelemetry Logs Enabled";
            readonly help: "Enable log signal export through OpenTelemetry in addition to local logging sinks. Use this when centralized log correlation is required across services and agents.";
            readonly tags: ["observability"];
        };
        readonly "diagnostics.otel.sampleRate": {
            readonly label: "OpenTelemetry Trace Sample Rate";
            readonly help: "Trace sampling rate (0-1) controlling how much trace traffic is exported to observability backends. Lower rates reduce overhead/cost, while higher rates improve debugging fidelity.";
            readonly tags: ["observability"];
        };
        readonly "diagnostics.otel.flushIntervalMs": {
            readonly label: "OpenTelemetry Flush Interval (ms)";
            readonly help: "Interval in milliseconds for periodic telemetry flush from buffers to the collector. Increase to reduce export chatter, or lower for faster visibility during active incident response.";
            readonly tags: ["observability", "performance"];
        };
        readonly "diagnostics.cacheTrace.enabled": {
            readonly label: "Cache Trace Enabled";
            readonly help: "Log cache trace snapshots for embedded agent runs (default: false).";
            readonly tags: ["observability", "storage"];
        };
        readonly "diagnostics.cacheTrace.filePath": {
            readonly label: "Cache Trace File Path";
            readonly help: "JSONL output path for cache trace logs (default: $OPENCLAW_STATE_DIR/logs/cache-trace.jsonl).";
            readonly tags: ["observability", "storage"];
        };
        readonly "diagnostics.cacheTrace.includeMessages": {
            readonly label: "Cache Trace Include Messages";
            readonly help: "Include full message payloads in trace output (default: true).";
            readonly tags: ["observability", "storage"];
        };
        readonly "diagnostics.cacheTrace.includePrompt": {
            readonly label: "Cache Trace Include Prompt";
            readonly help: "Include prompt text in trace output (default: true).";
            readonly tags: ["observability", "storage"];
        };
        readonly "diagnostics.cacheTrace.includeSystem": {
            readonly label: "Cache Trace Include System";
            readonly help: "Include system prompt in trace output (default: true).";
            readonly tags: ["observability", "storage"];
        };
        readonly "agents.list.*.identity.avatar": {
            readonly label: "Identity Avatar";
            readonly help: "Agent avatar (workspace-relative path, http(s) URL, or data URI).";
            readonly tags: ["advanced"];
        };
        readonly "agents.list.*.skills": {
            readonly label: "Agent Skill Filter";
            readonly help: "Optional allowlist of skills for this agent (omit = all skills; empty = no skills).";
            readonly tags: ["advanced"];
        };
        readonly "agents.list[].runtime": {
            readonly label: "Agent Runtime";
            readonly help: "Optional runtime descriptor for this agent. Use embedded for default OpenClaw execution or acp for external ACP harness defaults.";
            readonly tags: ["advanced"];
        };
        readonly "agents.list[].runtime.type": {
            readonly label: "Agent Runtime Type";
            readonly help: "Runtime type for this agent: \"embedded\" (default OpenClaw runtime) or \"acp\" (ACP harness defaults).";
            readonly tags: ["advanced"];
        };
        readonly "agents.list[].runtime.acp": {
            readonly label: "Agent ACP Runtime";
            readonly help: "ACP runtime defaults for this agent when runtime.type=acp. Binding-level ACP overrides still take precedence per conversation.";
            readonly tags: ["advanced"];
        };
        readonly "agents.list[].runtime.acp.agent": {
            readonly label: "Agent ACP Harness Agent";
            readonly help: "Optional ACP harness agent id to use for this OpenClaw agent (for example codex, claude, cursor, gemini, openclaw).";
            readonly tags: ["advanced"];
        };
        readonly "agents.list[].runtime.acp.backend": {
            readonly label: "Agent ACP Backend";
            readonly help: "Optional ACP backend override for this agent's ACP sessions (falls back to global acp.backend).";
            readonly tags: ["advanced"];
        };
        readonly "agents.list[].runtime.acp.mode": {
            readonly label: "Agent ACP Mode";
            readonly help: "Optional ACP session mode default for this agent (persistent or oneshot).";
            readonly tags: ["advanced"];
        };
        readonly "agents.list[].runtime.acp.cwd": {
            readonly label: "Agent ACP Working Directory";
            readonly help: "Optional default working directory for this agent's ACP sessions.";
            readonly tags: ["advanced"];
        };
        readonly "agents.list[].thinkingDefault": {
            readonly label: "Agent Thinking Default";
            readonly help: "Optional per-agent default thinking level. Overrides agents.defaults.thinkingDefault for this agent when no per-message or session override is set.";
            readonly tags: ["advanced"];
        };
        readonly "agents.list[].reasoningDefault": {
            readonly label: "Agent Reasoning Default";
            readonly help: "Optional per-agent default reasoning visibility (on|off|stream). Applies when no per-message or session reasoning override is set.";
            readonly tags: ["advanced"];
        };
        readonly "agents.list[].fastModeDefault": {
            readonly label: "Agent Fast Mode Default";
            readonly help: "Optional per-agent default for fast mode. Applies when no per-message or session fast-mode override is set.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults": {
            readonly label: "Agent Defaults";
            readonly help: "Shared default settings inherited by agents unless overridden per entry in agents.list. Use defaults to enforce consistent baseline behavior and reduce duplicated per-agent configuration.";
            readonly tags: ["advanced"];
        };
        readonly "agents.list": {
            readonly label: "Agent List";
            readonly help: "Explicit list of configured agents with IDs and optional overrides for model, tools, identity, and workspace. Keep IDs stable over time so bindings, approvals, and session routing remain deterministic.";
            readonly tags: ["advanced"];
        };
        readonly "gateway.port": {
            readonly label: "Gateway Port";
            readonly help: "TCP port used by the gateway listener for API, control UI, and channel-facing ingress paths. Use a dedicated port and avoid collisions with reverse proxies or local developer services.";
            readonly tags: ["network"];
        };
        readonly "gateway.mode": {
            readonly label: "Gateway Mode";
            readonly help: "Gateway operation mode: \"local\" runs channels and agent runtime on this host, while \"remote\" connects through remote transport. Keep \"local\" unless you intentionally run a split remote gateway topology.";
            readonly tags: ["network"];
        };
        readonly "gateway.bind": {
            readonly label: "Gateway Bind Mode";
            readonly help: "Network bind profile: \"auto\", \"lan\", \"loopback\", \"custom\", or \"tailnet\" to control interface exposure. Keep \"loopback\" or \"auto\" for safest local operation unless external clients must connect.";
            readonly tags: ["network"];
        };
        readonly "gateway.customBindHost": {
            readonly label: "Gateway Custom Bind Host";
            readonly help: "Explicit bind host/IP used when gateway.bind is set to custom for manual interface targeting. Use a precise address and avoid wildcard binds unless external exposure is required.";
            readonly tags: ["network"];
        };
        readonly "gateway.controlUi": {
            readonly label: "Control UI";
            readonly help: "Control UI hosting settings including enablement, pathing, and browser-origin/auth hardening behavior. Keep UI exposure minimal and pair with strong auth controls before internet-facing deployments.";
            readonly tags: ["network"];
        };
        readonly "gateway.controlUi.enabled": {
            readonly label: "Control UI Enabled";
            readonly help: "Enables serving the gateway Control UI from the gateway HTTP process when true. Keep enabled for local administration, and disable when an external control surface replaces it.";
            readonly tags: ["network"];
        };
        readonly "gateway.auth": {
            readonly label: "Gateway Auth";
            readonly help: "Authentication policy for gateway HTTP/WebSocket access including mode, credentials, trusted-proxy behavior, and rate limiting. Keep auth enabled for every non-loopback deployment.";
            readonly tags: ["network"];
        };
        readonly "gateway.auth.mode": {
            readonly label: "Gateway Auth Mode";
            readonly help: "Gateway auth mode: \"none\", \"token\", \"password\", or \"trusted-proxy\" depending on your edge architecture. Use token/password for direct exposure, and trusted-proxy only behind hardened identity-aware proxies.";
            readonly tags: ["network"];
        };
        readonly "gateway.auth.allowTailscale": {
            readonly label: "Gateway Auth Allow Tailscale Identity";
            readonly help: "Allows trusted Tailscale identity paths to satisfy gateway auth checks when configured. Use this only when your tailnet identity posture is strong and operator workflows depend on it.";
            readonly tags: ["access", "network"];
        };
        readonly "gateway.auth.rateLimit": {
            readonly label: "Gateway Auth Rate Limit";
            readonly help: "Login/auth attempt throttling controls to reduce credential brute-force risk at the gateway boundary. Keep enabled in exposed environments and tune thresholds to your traffic baseline.";
            readonly tags: ["network", "performance"];
        };
        readonly "gateway.auth.trustedProxy": {
            readonly label: "Gateway Trusted Proxy Auth";
            readonly help: "Trusted-proxy auth header mapping for upstream identity providers that inject user claims. Use only with known proxy CIDRs and strict header allowlists to prevent spoofed identity headers.";
            readonly tags: ["network"];
        };
        readonly "gateway.trustedProxies": {
            readonly label: "Gateway Trusted Proxy CIDRs";
            readonly help: "CIDR/IP allowlist of upstream proxies permitted to provide forwarded client identity headers. Keep this list narrow so untrusted hops cannot impersonate users.";
            readonly tags: ["network"];
        };
        readonly "gateway.allowRealIpFallback": {
            readonly label: "Gateway Allow x-real-ip Fallback";
            readonly help: "Enables x-real-ip fallback when x-forwarded-for is missing in proxy scenarios. Keep disabled unless your ingress stack requires this compatibility behavior.";
            readonly tags: ["access", "network", "reliability"];
        };
        readonly "gateway.tools": {
            readonly label: "Gateway Tool Exposure Policy";
            readonly help: "Gateway-level tool exposure allow/deny policy that can restrict runtime tool availability independent of agent/tool profiles. Use this for coarse emergency controls and production hardening.";
            readonly tags: ["network"];
        };
        readonly "gateway.tools.allow": {
            readonly label: "Gateway Tool Allowlist";
            readonly help: "Explicit gateway-level tool allowlist when you want a narrow set of tools available at runtime. Use this for locked-down environments where tool scope must be tightly controlled.";
            readonly tags: ["access", "network"];
        };
        readonly "gateway.tools.deny": {
            readonly label: "Gateway Tool Denylist";
            readonly help: "Explicit gateway-level tool denylist to block risky tools even if lower-level policies allow them. Use deny rules for emergency response and defense-in-depth hardening.";
            readonly tags: ["access", "network"];
        };
        readonly "gateway.channelHealthCheckMinutes": {
            readonly label: "Gateway Channel Health Check Interval (min)";
            readonly help: "Interval in minutes for automatic channel health probing and status updates. Use lower intervals for faster detection, or higher intervals to reduce periodic probe noise.";
            readonly tags: ["network", "reliability"];
        };
        readonly "gateway.channelStaleEventThresholdMinutes": {
            readonly label: "Gateway Channel Stale Event Threshold (min)";
            readonly help: "How many minutes a connected channel can go without receiving any event before the health monitor treats it as a stale socket and triggers a restart. Default: 30.";
            readonly tags: ["network"];
        };
        readonly "gateway.channelMaxRestartsPerHour": {
            readonly label: "Gateway Channel Max Restarts Per Hour";
            readonly help: "Maximum number of health-monitor-initiated channel restarts allowed within a rolling one-hour window. Once hit, further restarts are skipped until the window expires. Default: 10.";
            readonly tags: ["network", "performance"];
        };
        readonly "gateway.tailscale": {
            readonly label: "Gateway Tailscale";
            readonly help: "Tailscale integration settings for Serve/Funnel exposure and lifecycle handling on gateway start/exit. Keep off unless your deployment intentionally relies on Tailscale ingress.";
            readonly tags: ["network"];
        };
        readonly "gateway.tailscale.mode": {
            readonly label: "Gateway Tailscale Mode";
            readonly help: "Tailscale publish mode: \"off\", \"serve\", or \"funnel\" for private or public exposure paths. Use \"serve\" for tailnet-only access and \"funnel\" only when public internet reachability is required.";
            readonly tags: ["network"];
        };
        readonly "gateway.tailscale.resetOnExit": {
            readonly label: "Gateway Tailscale Reset on Exit";
            readonly help: "Resets Tailscale Serve/Funnel state on gateway exit to avoid stale published routes after shutdown. Keep enabled unless another controller manages publish lifecycle outside the gateway.";
            readonly tags: ["network"];
        };
        readonly "gateway.remote": {
            readonly label: "Remote Gateway";
            readonly help: "Remote gateway connection settings for direct or SSH transport when this instance proxies to another runtime host. Use remote mode only when split-host operation is intentionally configured.";
            readonly tags: ["network"];
        };
        readonly "gateway.remote.transport": {
            readonly label: "Remote Gateway Transport";
            readonly help: "Remote connection transport: \"direct\" uses configured URL connectivity, while \"ssh\" tunnels through SSH. Use SSH when you need encrypted tunnel semantics without exposing remote ports.";
            readonly tags: ["network"];
        };
        readonly "gateway.reload": {
            readonly label: "Config Reload";
            readonly help: "Live config-reload policy for how edits are applied and when full restarts are triggered. Keep hybrid behavior for safest operational updates unless debugging reload internals.";
            readonly tags: ["network", "reliability"];
        };
        readonly "gateway.tls": {
            readonly label: "Gateway TLS";
            readonly help: "TLS certificate and key settings for terminating HTTPS directly in the gateway process. Use explicit certificates in production and avoid plaintext exposure on untrusted networks.";
            readonly tags: ["network"];
        };
        readonly "gateway.tls.enabled": {
            readonly label: "Gateway TLS Enabled";
            readonly help: "Enables TLS termination at the gateway listener so clients connect over HTTPS/WSS directly. Keep enabled for direct internet exposure or any untrusted network boundary.";
            readonly tags: ["network"];
        };
        readonly "gateway.tls.autoGenerate": {
            readonly label: "Gateway TLS Auto-Generate Cert";
            readonly help: "Auto-generates a local TLS certificate/key pair when explicit files are not configured. Use only for local/dev setups and replace with real certificates for production traffic.";
            readonly tags: ["network"];
        };
        readonly "gateway.tls.certPath": {
            readonly label: "Gateway TLS Certificate Path";
            readonly help: "Filesystem path to the TLS certificate file used by the gateway when TLS is enabled. Use managed certificate paths and keep renewal automation aligned with this location.";
            readonly tags: ["network", "storage"];
        };
        readonly "gateway.tls.keyPath": {
            readonly label: "Gateway TLS Key Path";
            readonly help: "Filesystem path to the TLS private key file used by the gateway when TLS is enabled. Keep this key file permission-restricted and rotate per your security policy.";
            readonly tags: ["network", "storage"];
        };
        readonly "gateway.tls.caPath": {
            readonly label: "Gateway TLS CA Path";
            readonly help: "Optional CA bundle path for client verification or custom trust-chain requirements at the gateway edge. Use this when private PKI or custom certificate chains are part of deployment.";
            readonly tags: ["network", "storage"];
        };
        readonly "gateway.http": {
            readonly label: "Gateway HTTP API";
            readonly help: "Gateway HTTP API configuration grouping endpoint toggles and transport-facing API exposure controls. Keep only required endpoints enabled to reduce attack surface.";
            readonly tags: ["network"];
        };
        readonly "gateway.http.endpoints": {
            readonly label: "Gateway HTTP Endpoints";
            readonly help: "HTTP endpoint feature toggles under the gateway API surface for compatibility routes and optional integrations. Enable endpoints intentionally and monitor access patterns after rollout.";
            readonly tags: ["network"];
        };
        readonly "gateway.http.securityHeaders": {
            readonly label: "Gateway HTTP Security Headers";
            readonly help: "Optional HTTP response security headers applied by the gateway process itself. Prefer setting these at your reverse proxy when TLS terminates there.";
            readonly tags: ["network"];
        };
        readonly "gateway.http.securityHeaders.strictTransportSecurity": {
            readonly label: "Strict Transport Security Header";
            readonly help: "Value for the Strict-Transport-Security response header. Set only on HTTPS origins that you fully control; use false to explicitly disable.";
            readonly tags: ["network"];
        };
        readonly "gateway.remote.url": {
            readonly label: "Remote Gateway URL";
            readonly help: "Remote Gateway WebSocket URL (ws:// or wss://).";
            readonly placeholder: "ws://host:18789";
            readonly tags: ["network"];
        };
        readonly "gateway.remote.sshTarget": {
            readonly label: "Remote Gateway SSH Target";
            readonly help: "Remote gateway over SSH (tunnels the gateway port to localhost). Format: user@host or user@host:port.";
            readonly placeholder: "user@host";
            readonly tags: ["network"];
        };
        readonly "gateway.remote.sshIdentity": {
            readonly label: "Remote Gateway SSH Identity";
            readonly help: "Optional SSH identity file path (passed to ssh -i).";
            readonly tags: ["network"];
        };
        readonly "gateway.remote.token": {
            readonly label: "Remote Gateway Token";
            readonly help: "Bearer token used to authenticate this client to a remote gateway in token-auth deployments. Store via secret/env substitution and rotate alongside remote gateway auth changes.";
            readonly tags: ["security", "auth", "network"];
            readonly sensitive: true;
        };
        readonly "gateway.remote.password": {
            readonly label: "Remote Gateway Password";
            readonly help: "Password credential used for remote gateway authentication when password mode is enabled. Keep this secret managed externally and avoid plaintext values in committed config.";
            readonly tags: ["security", "auth", "network"];
            readonly sensitive: true;
        };
        readonly "gateway.remote.tlsFingerprint": {
            readonly label: "Remote Gateway TLS Fingerprint";
            readonly help: "Expected sha256 TLS fingerprint for the remote gateway (pin to avoid MITM).";
            readonly placeholder: "sha256:ab12cd34…";
            readonly tags: ["security", "auth", "network"];
        };
        readonly "gateway.auth.token": {
            readonly label: "Gateway Token";
            readonly help: "Required by default for gateway access (unless using Tailscale Serve identity); required for non-loopback binds.";
            readonly tags: ["security", "auth", "access", "network"];
            readonly sensitive: true;
        };
        readonly "gateway.auth.password": {
            readonly label: "Gateway Password";
            readonly help: "Required for Tailscale funnel.";
            readonly tags: ["security", "auth", "access", "network"];
            readonly sensitive: true;
        };
        readonly "browser.enabled": {
            readonly label: "Browser Enabled";
            readonly help: "Enables browser capability wiring in the gateway so browser tools and CDP-driven workflows can run. Disable when browser automation is not needed to reduce surface area and startup work.";
            readonly tags: ["advanced"];
        };
        readonly "browser.cdpUrl": {
            readonly label: "Browser CDP URL";
            readonly help: "Remote CDP websocket URL used to attach to an externally managed browser instance. Use this for centralized browser hosts and keep URL access restricted to trusted network paths.";
            readonly tags: ["advanced"];
        };
        readonly "browser.color": {
            readonly label: "Browser Accent Color";
            readonly help: "Default accent color used for browser profile/UI cues where colored identity hints are displayed. Use consistent colors to help operators identify active browser profile context quickly.";
            readonly tags: ["advanced"];
        };
        readonly "browser.executablePath": {
            readonly label: "Browser Executable Path";
            readonly help: "Explicit browser executable path when auto-discovery is insufficient for your host environment. Use absolute stable paths so launch behavior stays deterministic across restarts.";
            readonly tags: ["storage"];
        };
        readonly "browser.headless": {
            readonly label: "Browser Headless Mode";
            readonly help: "Forces browser launch in headless mode when the local launcher starts browser instances. Keep headless enabled for server environments and disable only when visible UI debugging is required.";
            readonly tags: ["advanced"];
        };
        readonly "browser.noSandbox": {
            readonly label: "Browser No-Sandbox Mode";
            readonly help: "Disables Chromium sandbox isolation flags for environments where sandboxing fails at runtime. Keep this off whenever possible because process isolation protections are reduced.";
            readonly tags: ["storage"];
        };
        readonly "browser.attachOnly": {
            readonly label: "Browser Attach-only Mode";
            readonly help: "Restricts browser mode to attach-only behavior without starting local browser processes. Use this when all browser sessions are externally managed by a remote CDP provider.";
            readonly tags: ["advanced"];
        };
        readonly "browser.cdpPortRangeStart": {
            readonly label: "Browser CDP Port Range Start";
            readonly help: "Starting local CDP port used for auto-allocated browser profile ports. Increase this when host-level port defaults conflict with other local services.";
            readonly tags: ["advanced"];
        };
        readonly "browser.defaultProfile": {
            readonly label: "Browser Default Profile";
            readonly help: "Default browser profile name selected when callers do not explicitly choose a profile. Use a stable low-privilege profile as the default to reduce accidental cross-context state use.";
            readonly tags: ["storage"];
        };
        readonly "browser.profiles": {
            readonly label: "Browser Profiles";
            readonly help: "Named browser profile connection map used for explicit routing to CDP ports or URLs with optional metadata. Keep profile names consistent and avoid overlapping endpoint definitions.";
            readonly tags: ["storage"];
        };
        readonly "browser.profiles.*.cdpPort": {
            readonly label: "Browser Profile CDP Port";
            readonly help: "Per-profile local CDP port used when connecting to browser instances by port instead of URL. Use unique ports per profile to avoid connection collisions.";
            readonly tags: ["storage"];
        };
        readonly "browser.profiles.*.cdpUrl": {
            readonly label: "Browser Profile CDP URL";
            readonly help: "Per-profile CDP websocket URL used for explicit remote browser routing by profile name. Use this when profile connections terminate on remote hosts or tunnels.";
            readonly tags: ["storage"];
        };
        readonly "browser.profiles.*.userDataDir": {
            readonly label: "Browser Profile User Data Dir";
            readonly help: "Per-profile Chromium user data directory for existing-session attachment through Chrome DevTools MCP. Use this for host-local Brave, Edge, Chromium, or non-default Chrome profiles when the built-in auto-connect path would pick the wrong browser data directory.";
            readonly tags: ["storage"];
        };
        readonly "browser.profiles.*.driver": {
            readonly label: "Browser Profile Driver";
            readonly help: "Per-profile browser driver mode. Use \"openclaw\" (or legacy \"clawd\") for CDP-based profiles, or use \"existing-session\" for host-local Chrome DevTools MCP attachment.";
            readonly tags: ["storage"];
        };
        readonly "browser.profiles.*.attachOnly": {
            readonly label: "Browser Profile Attach-only Mode";
            readonly help: "Per-profile attach-only override that skips local browser launch and only attaches to an existing CDP endpoint. Useful when one profile is externally managed but others are locally launched.";
            readonly tags: ["storage"];
        };
        readonly "browser.profiles.*.color": {
            readonly label: "Browser Profile Accent Color";
            readonly help: "Per-profile accent color for visual differentiation in dashboards and browser-related UI hints. Use distinct colors for high-signal operator recognition of active profiles.";
            readonly tags: ["storage"];
        };
        readonly "tools.allow": {
            readonly label: "Tool Allowlist";
            readonly help: "Absolute tool allowlist that replaces profile-derived defaults for strict environments. Use this only when you intentionally run a tightly curated subset of tool capabilities.";
            readonly tags: ["access", "tools"];
        };
        readonly "tools.deny": {
            readonly label: "Tool Denylist";
            readonly help: "Global tool denylist that blocks listed tools even when profile or provider rules would allow them. Use deny rules for emergency lockouts and long-term defense-in-depth.";
            readonly tags: ["access", "tools"];
        };
        readonly "tools.web": {
            readonly label: "Web Tools";
            readonly help: "Web-tool policy grouping for search/fetch providers, limits, and fallback behavior tuning. Keep enabled settings aligned with API key availability and outbound networking policy.";
            readonly tags: ["tools"];
        };
        readonly "tools.exec": {
            readonly label: "Exec Tool";
            readonly help: "Exec-tool policy grouping for shell execution host, security mode, approval behavior, and runtime bindings. Keep conservative defaults in production and tighten elevated execution paths.";
            readonly tags: ["tools"];
        };
        readonly "tools.media.image.enabled": {
            readonly label: "Enable Image Understanding";
            readonly help: "Enable image understanding so attached or referenced images can be interpreted into textual context. Disable if you need text-only operation or want to avoid image-processing cost.";
            readonly tags: ["media", "tools"];
        };
        readonly "tools.media.image.maxBytes": {
            readonly label: "Image Understanding Max Bytes";
            readonly help: "Maximum accepted image payload size in bytes before the item is skipped or truncated by policy. Keep limits realistic for your provider caps and infrastructure bandwidth.";
            readonly tags: ["performance", "media", "tools"];
        };
        readonly "tools.media.image.maxChars": {
            readonly label: "Image Understanding Max Chars";
            readonly help: "Maximum characters returned from image understanding output after model response normalization. Use tighter limits to reduce prompt bloat and larger limits for detail-heavy OCR tasks.";
            readonly tags: ["performance", "media", "tools"];
        };
        readonly "tools.media.image.prompt": {
            readonly label: "Image Understanding Prompt";
            readonly help: "Instruction template used for image understanding requests to shape extraction style and detail level. Keep prompts deterministic so outputs stay consistent across turns and channels.";
            readonly tags: ["media", "tools"];
        };
        readonly "tools.media.image.timeoutSeconds": {
            readonly label: "Image Understanding Timeout (sec)";
            readonly help: "Timeout in seconds for each image understanding request before it is aborted. Increase for high-resolution analysis and lower it for latency-sensitive operator workflows.";
            readonly tags: ["performance", "media", "tools"];
        };
        readonly "tools.media.image.attachments": {
            readonly label: "Image Understanding Attachment Policy";
            readonly help: "Attachment handling policy for image inputs, including which message attachments qualify for image analysis. Use restrictive settings in untrusted channels to reduce unexpected processing.";
            readonly tags: ["media", "tools"];
        };
        readonly "tools.media.image.models": {
            readonly label: "Image Understanding Models";
            readonly help: "Ordered model preferences specifically for image understanding when you want to override shared media models. Put the most reliable multimodal model first to reduce fallback attempts.";
            readonly tags: ["models", "media", "tools"];
        };
        readonly "tools.media.image.scope": {
            readonly label: "Image Understanding Scope";
            readonly help: "Scope selector for when image understanding is attempted (for example only explicit requests versus broader auto-detection). Keep narrow scope in busy channels to control token and API spend.";
            readonly tags: ["media", "tools"];
        };
        readonly "tools.media.models": {
            readonly label: "Media Understanding Shared Models";
            readonly help: "Shared fallback model list used by media understanding tools when modality-specific model lists are not set. Keep this aligned with available multimodal providers to avoid runtime fallback churn.";
            readonly tags: ["models", "media", "tools"];
        };
        readonly "tools.media.concurrency": {
            readonly label: "Media Understanding Concurrency";
            readonly help: "Maximum number of concurrent media understanding operations per turn across image, audio, and video tasks. Lower this in resource-constrained deployments to prevent CPU/network saturation.";
            readonly tags: ["performance", "media", "tools"];
        };
        readonly "tools.media.audio.enabled": {
            readonly label: "Enable Audio Understanding";
            readonly help: "Enable audio understanding so voice notes or audio clips can be transcribed/summarized for agent context. Disable when audio ingestion is outside policy or unnecessary for your workflows.";
            readonly tags: ["media", "tools"];
        };
        readonly "tools.media.audio.maxBytes": {
            readonly label: "Audio Understanding Max Bytes";
            readonly help: "Maximum accepted audio payload size in bytes before processing is rejected or clipped by policy. Set this based on expected recording length and upstream provider limits.";
            readonly tags: ["performance", "media", "tools"];
        };
        readonly "tools.media.audio.maxChars": {
            readonly label: "Audio Understanding Max Chars";
            readonly help: "Maximum characters retained from audio understanding output to prevent oversized transcript injection. Increase for long-form dictation, or lower to keep conversational turns compact.";
            readonly tags: ["performance", "media", "tools"];
        };
        readonly "tools.media.audio.prompt": {
            readonly label: "Audio Understanding Prompt";
            readonly help: "Instruction template guiding audio understanding output style, such as concise summary versus near-verbatim transcript. Keep wording consistent so downstream automations can rely on output format.";
            readonly tags: ["media", "tools"];
        };
        readonly "tools.media.audio.timeoutSeconds": {
            readonly label: "Audio Understanding Timeout (sec)";
            readonly help: "Timeout in seconds for audio understanding execution before the operation is cancelled. Use longer timeouts for long recordings and tighter ones for interactive chat responsiveness.";
            readonly tags: ["performance", "media", "tools"];
        };
        readonly "tools.media.audio.language": {
            readonly label: "Audio Understanding Language";
            readonly help: "Preferred language hint for audio understanding/transcription when provider support is available. Set this to improve recognition accuracy for known primary languages.";
            readonly tags: ["media", "tools"];
        };
        readonly "tools.media.audio.attachments": {
            readonly label: "Audio Understanding Attachment Policy";
            readonly help: "Attachment policy for audio inputs indicating which uploaded files are eligible for audio processing. Keep restrictive defaults in mixed-content channels to avoid unintended audio workloads.";
            readonly tags: ["media", "tools"];
        };
        readonly "tools.media.audio.models": {
            readonly label: "Audio Understanding Models";
            readonly help: "Ordered model preferences specifically for audio understanding, used before shared media model fallback. Choose models optimized for transcription quality in your primary language/domain.";
            readonly tags: ["models", "media", "tools"];
        };
        readonly "tools.media.audio.scope": {
            readonly label: "Audio Understanding Scope";
            readonly help: "Scope selector for when audio understanding runs across inbound messages and attachments. Keep focused scopes in high-volume channels to reduce cost and avoid accidental transcription.";
            readonly tags: ["media", "tools"];
        };
        readonly "tools.media.audio.echoTranscript": {
            readonly label: "Echo Transcript to Chat";
            readonly help: "Echo the audio transcript back to the originating chat before agent processing. When enabled, users immediately see what was heard from their voice note, helping them verify transcription accuracy before the agent acts on it. Default: false.";
            readonly tags: ["media", "tools"];
        };
        readonly "tools.media.audio.echoFormat": {
            readonly label: "Transcript Echo Format";
            readonly help: "Format string for the echoed transcript message. Use `{transcript}` as a placeholder for the transcribed text. Default: '📝 \"{transcript}\"'.";
            readonly tags: ["media", "tools"];
        };
        readonly "tools.media.video.enabled": {
            readonly label: "Enable Video Understanding";
            readonly help: "Enable video understanding so clips can be summarized into text for downstream reasoning and responses. Disable when processing video is out of policy or too expensive for your deployment.";
            readonly tags: ["media", "tools"];
        };
        readonly "tools.media.video.maxBytes": {
            readonly label: "Video Understanding Max Bytes";
            readonly help: "Maximum accepted video payload size in bytes before policy rejection or trimming occurs. Tune this to provider and infrastructure limits to avoid repeated timeout/failure loops.";
            readonly tags: ["performance", "media", "tools"];
        };
        readonly "tools.media.video.maxChars": {
            readonly label: "Video Understanding Max Chars";
            readonly help: "Maximum characters retained from video understanding output to control prompt growth. Raise for dense scene descriptions and lower when concise summaries are preferred.";
            readonly tags: ["performance", "media", "tools"];
        };
        readonly "tools.media.video.prompt": {
            readonly label: "Video Understanding Prompt";
            readonly help: "Instruction template for video understanding describing desired summary granularity and focus areas. Keep this stable so output quality remains predictable across model/provider fallbacks.";
            readonly tags: ["media", "tools"];
        };
        readonly "tools.media.video.timeoutSeconds": {
            readonly label: "Video Understanding Timeout (sec)";
            readonly help: "Timeout in seconds for each video understanding request before cancellation. Use conservative values in interactive channels and longer values for offline or batch-heavy processing.";
            readonly tags: ["performance", "media", "tools"];
        };
        readonly "tools.media.video.attachments": {
            readonly label: "Video Understanding Attachment Policy";
            readonly help: "Attachment eligibility policy for video analysis, defining which message files can trigger video processing. Keep this explicit in shared channels to prevent accidental large media workloads.";
            readonly tags: ["media", "tools"];
        };
        readonly "tools.media.video.models": {
            readonly label: "Video Understanding Models";
            readonly help: "Ordered model preferences specifically for video understanding before shared media fallback applies. Prioritize models with strong multimodal video support to minimize degraded summaries.";
            readonly tags: ["models", "media", "tools"];
        };
        readonly "tools.media.video.scope": {
            readonly label: "Video Understanding Scope";
            readonly help: "Scope selector controlling when video understanding is attempted across incoming events. Narrow scope in noisy channels, and broaden only where video interpretation is core to workflow.";
            readonly tags: ["media", "tools"];
        };
        readonly "tools.links.enabled": {
            readonly label: "Enable Link Understanding";
            readonly help: "Enable automatic link understanding pre-processing so URLs can be summarized before agent reasoning. Keep enabled for richer context, and disable when strict minimal processing is required.";
            readonly tags: ["tools"];
        };
        readonly "tools.links.maxLinks": {
            readonly label: "Link Understanding Max Links";
            readonly help: "Maximum number of links expanded per turn during link understanding. Use lower values to control latency/cost in chatty threads and higher values when multi-link context is critical.";
            readonly tags: ["performance", "tools"];
        };
        readonly "tools.links.timeoutSeconds": {
            readonly label: "Link Understanding Timeout (sec)";
            readonly help: "Per-link understanding timeout budget in seconds before unresolved links are skipped. Keep this bounded to avoid long stalls when external sites are slow or unreachable.";
            readonly tags: ["performance", "tools"];
        };
        readonly "tools.links.models": {
            readonly label: "Link Understanding Models";
            readonly help: "Preferred model list for link understanding tasks, evaluated in order as fallbacks when supported. Use lightweight models first for routine summarization and heavier models only when needed.";
            readonly tags: ["models", "tools"];
        };
        readonly "tools.links.scope": {
            readonly label: "Link Understanding Scope";
            readonly help: "Controls when link understanding runs relative to conversation context and message type. Keep scope conservative to avoid unnecessary fetches on messages where links are not actionable.";
            readonly tags: ["tools"];
        };
        readonly "tools.profile": {
            readonly label: "Tool Profile";
            readonly help: "Global tool profile name used to select a predefined tool policy baseline before applying allow/deny overrides. Use this for consistent environment posture across agents and keep profile names stable.";
            readonly tags: ["storage", "tools"];
        };
        readonly "tools.alsoAllow": {
            readonly label: "Tool Allowlist Additions";
            readonly help: "Extra tool allowlist entries merged on top of the selected tool profile and default policy. Keep this list small and explicit so audits can quickly identify intentional policy exceptions.";
            readonly tags: ["access", "tools"];
        };
        readonly "agents.list[].tools.profile": {
            readonly label: "Agent Tool Profile";
            readonly help: "Per-agent override for tool profile selection when one agent needs a different capability baseline. Use this sparingly so policy differences across agents stay intentional and reviewable.";
            readonly tags: ["storage"];
        };
        readonly "agents.list[].tools.alsoAllow": {
            readonly label: "Agent Tool Allowlist Additions";
            readonly help: "Per-agent additive allowlist for tools on top of global and profile policy. Keep narrow to avoid accidental privilege expansion on specialized agents.";
            readonly tags: ["access"];
        };
        readonly "tools.byProvider": {
            readonly label: "Tool Policy by Provider";
            readonly help: "Per-provider tool allow/deny overrides keyed by channel/provider ID to tailor capabilities by surface. Use this when one provider needs stricter controls than global tool policy.";
            readonly tags: ["tools"];
        };
        readonly "agents.list[].tools.byProvider": {
            readonly label: "Agent Tool Policy by Provider";
            readonly help: "Per-agent provider-specific tool policy overrides for channel-scoped capability control. Use this when a single agent needs tighter restrictions on one provider than others.";
            readonly tags: ["advanced"];
        };
        readonly "tools.exec.applyPatch.enabled": {
            readonly label: "Enable apply_patch";
            readonly help: "Enable or disable apply_patch for OpenAI and OpenAI Codex models when allowed by tool policy (default: true).";
            readonly tags: ["tools"];
        };
        readonly "tools.exec.applyPatch.workspaceOnly": {
            readonly label: "apply_patch Workspace-Only";
            readonly help: "Restrict apply_patch paths to the workspace directory (default: true). Set false to allow writing outside the workspace (dangerous).";
            readonly tags: ["security", "access", "tools", "advanced"];
        };
        readonly "tools.exec.applyPatch.allowModels": {
            readonly label: "apply_patch Model Allowlist";
            readonly help: "Optional allowlist of model ids (e.g. \"gpt-5.2\" or \"openai/gpt-5.2\").";
            readonly tags: ["access", "tools"];
        };
        readonly "tools.loopDetection.enabled": {
            readonly label: "Tool-loop Detection";
            readonly help: "Enable repetitive tool-call loop detection and backoff safety checks (default: false).";
            readonly tags: ["tools"];
        };
        readonly "tools.loopDetection.historySize": {
            readonly label: "Tool-loop History Size";
            readonly help: "Tool history window size for loop detection (default: 30).";
            readonly tags: ["tools"];
        };
        readonly "tools.loopDetection.warningThreshold": {
            readonly label: "Tool-loop Warning Threshold";
            readonly help: "Warning threshold for repetitive patterns when detector is enabled (default: 10).";
            readonly tags: ["tools"];
        };
        readonly "tools.loopDetection.criticalThreshold": {
            readonly label: "Tool-loop Critical Threshold";
            readonly help: "Critical threshold for repetitive patterns when detector is enabled (default: 20).";
            readonly tags: ["tools"];
        };
        readonly "tools.loopDetection.globalCircuitBreakerThreshold": {
            readonly label: "Tool-loop Global Circuit Breaker Threshold";
            readonly help: "Global no-progress breaker threshold (default: 30).";
            readonly tags: ["reliability", "tools"];
        };
        readonly "tools.loopDetection.detectors.genericRepeat": {
            readonly label: "Tool-loop Generic Repeat Detection";
            readonly help: "Enable generic repeated same-tool/same-params loop detection (default: true).";
            readonly tags: ["tools"];
        };
        readonly "tools.loopDetection.detectors.knownPollNoProgress": {
            readonly label: "Tool-loop Poll No-Progress Detection";
            readonly help: "Enable known poll tool no-progress loop detection (default: true).";
            readonly tags: ["tools"];
        };
        readonly "tools.loopDetection.detectors.pingPong": {
            readonly label: "Tool-loop Ping-Pong Detection";
            readonly help: "Enable ping-pong loop detection (default: true).";
            readonly tags: ["tools"];
        };
        readonly "tools.fs.workspaceOnly": {
            readonly label: "Workspace-only FS tools";
            readonly help: "Restrict filesystem tools (read/write/edit/apply_patch) to the workspace directory (default: false).";
            readonly tags: ["tools"];
        };
        readonly "tools.sessions.visibility": {
            readonly label: "Session Tools Visibility";
            readonly help: "Controls which sessions can be targeted by sessions_list/sessions_history/sessions_send. (\"tree\" default = current session + spawned subagent sessions; \"self\" = only current; \"agent\" = any session in the current agent id; \"all\" = any session; cross-agent still requires tools.agentToAgent).";
            readonly tags: ["storage", "tools"];
        };
        readonly "tools.exec.notifyOnExit": {
            readonly label: "Exec Notify On Exit";
            readonly help: "When true (default), backgrounded exec sessions on exit and node exec lifecycle events enqueue a system event and request a heartbeat.";
            readonly tags: ["tools"];
        };
        readonly "tools.exec.notifyOnExitEmptySuccess": {
            readonly label: "Exec Notify On Empty Success";
            readonly help: "When true, successful backgrounded exec exits with empty output still enqueue a completion system event (default: false).";
            readonly tags: ["tools"];
        };
        readonly "tools.exec.approvalRunningNoticeMs": {
            readonly label: "Exec Approval Running Notice (ms)";
            readonly help: "Delay in milliseconds before showing an in-progress notice after an exec approval is granted. Increase to reduce flicker for fast commands, or lower for quicker operator feedback.";
            readonly tags: ["tools"];
        };
        readonly "tools.exec.host": {
            readonly label: "Exec Host";
            readonly help: "Selects execution host strategy for shell commands, typically controlling local vs delegated execution environment. Use the safest host mode that still satisfies your automation requirements.";
            readonly tags: ["tools"];
        };
        readonly "tools.exec.security": {
            readonly label: "Exec Security";
            readonly help: "Execution security posture selector controlling sandbox/approval expectations for command execution. Keep strict security mode for untrusted prompts and relax only for trusted operator workflows.";
            readonly tags: ["tools"];
        };
        readonly "tools.exec.ask": {
            readonly label: "Exec Ask";
            readonly help: "Approval strategy for when exec commands require human confirmation before running. Use stricter ask behavior in shared channels and lower-friction settings in private operator contexts.";
            readonly tags: ["tools"];
        };
        readonly "tools.exec.node": {
            readonly label: "Exec Node Binding";
            readonly help: "Node binding configuration for exec tooling when command execution is delegated through connected nodes. Use explicit node binding only when multi-node routing is required.";
            readonly tags: ["tools"];
        };
        readonly "tools.agentToAgent": {
            readonly label: "Agent-to-Agent Tool Access";
            readonly help: "Policy for allowing agent-to-agent tool calls and constraining which target agents can be reached. Keep disabled or tightly scoped unless cross-agent orchestration is intentionally enabled.";
            readonly tags: ["tools"];
        };
        readonly "tools.agentToAgent.enabled": {
            readonly label: "Enable Agent-to-Agent Tool";
            readonly help: "Enables the agent_to_agent tool surface so one agent can invoke another agent at runtime. Keep off in simple deployments and enable only when orchestration value outweighs complexity.";
            readonly tags: ["tools"];
        };
        readonly "tools.agentToAgent.allow": {
            readonly label: "Agent-to-Agent Target Allowlist";
            readonly help: "Allowlist of target agent IDs permitted for agent_to_agent calls when orchestration is enabled. Use explicit allowlists to avoid uncontrolled cross-agent call graphs.";
            readonly tags: ["access", "tools"];
        };
        readonly "tools.elevated": {
            readonly label: "Elevated Tool Access";
            readonly help: "Elevated tool access controls for privileged command surfaces that should only be reachable from trusted senders. Keep disabled unless operator workflows explicitly require elevated actions.";
            readonly tags: ["tools"];
        };
        readonly "tools.elevated.enabled": {
            readonly label: "Enable Elevated Tool Access";
            readonly help: "Enables elevated tool execution path when sender and policy checks pass. Keep disabled in public/shared channels and enable only for trusted owner-operated contexts.";
            readonly tags: ["tools"];
        };
        readonly "tools.elevated.allowFrom": {
            readonly label: "Elevated Tool Allow Rules";
            readonly help: "Sender allow rules for elevated tools, usually keyed by channel/provider identity formats. Use narrow, explicit identities so elevated commands cannot be triggered by unintended users.";
            readonly tags: ["access", "tools"];
        };
        readonly "tools.subagents": {
            readonly label: "Subagent Tool Policy";
            readonly help: "Tool policy wrapper for spawned subagents to restrict or expand tool availability compared to parent defaults. Use this to keep delegated agent capabilities scoped to task intent.";
            readonly tags: ["tools"];
        };
        readonly "tools.subagents.tools": {
            readonly label: "Subagent Tool Allow/Deny Policy";
            readonly help: "Allow/deny tool policy applied to spawned subagent runtimes for per-subagent hardening. Keep this narrower than parent scope when subagents run semi-autonomous workflows.";
            readonly tags: ["tools"];
        };
        readonly "tools.sandbox": {
            readonly label: "Sandbox Tool Policy";
            readonly help: "Tool policy wrapper for sandboxed agent executions so sandbox runs can have distinct capability boundaries. Use this to enforce stronger safety in sandbox contexts.";
            readonly tags: ["storage", "tools"];
        };
        readonly "tools.sandbox.tools": {
            readonly label: "Sandbox Tool Allow/Deny Policy";
            readonly help: "Allow/deny tool policy applied when agents run in sandboxed execution environments. Keep policies minimal so sandbox tasks cannot escalate into unnecessary external actions.";
            readonly tags: ["storage", "tools"];
        };
        readonly "tools.exec.pathPrepend": {
            readonly label: "Exec PATH Prepend";
            readonly help: "Directories to prepend to PATH for exec runs (gateway/sandbox).";
            readonly tags: ["storage", "tools"];
        };
        readonly "tools.exec.safeBins": {
            readonly label: "Exec Safe Bins";
            readonly help: "Allow stdin-only safe binaries to run without explicit allowlist entries.";
            readonly tags: ["tools"];
        };
        readonly "tools.exec.strictInlineEval": {
            readonly label: "Require Inline-Eval Approval";
            readonly help: "Require explicit approval for interpreter inline-eval forms such as `python -c`, `node -e`, `ruby -e`, or `osascript -e`. Prevents silent allowlist reuse and downgrades allow-always to ask-each-time for those forms.";
            readonly tags: ["tools"];
        };
        readonly "tools.exec.safeBinTrustedDirs": {
            readonly label: "Exec Safe Bin Trusted Dirs";
            readonly help: "Additional explicit directories trusted for safe-bin path checks (PATH entries are never auto-trusted).";
            readonly tags: ["storage", "tools"];
        };
        readonly "tools.exec.safeBinProfiles": {
            readonly label: "Exec Safe Bin Profiles";
            readonly help: "Optional per-binary safe-bin profiles (positional limits + allowed/denied flags).";
            readonly tags: ["storage", "tools"];
        };
        readonly approvals: {
            readonly label: "Approvals";
            readonly help: "Approval routing controls for forwarding exec and plugin approval requests to chat destinations outside the originating session. Keep these disabled unless operators need explicit out-of-band approval visibility.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.exec": {
            readonly label: "Exec Approval Forwarding";
            readonly help: "Groups exec-approval forwarding behavior including enablement, routing mode, filters, and explicit targets. Configure here when approval prompts must reach operational channels instead of only the origin thread.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.exec.enabled": {
            readonly label: "Forward Exec Approvals";
            readonly help: "Enables forwarding of exec approval requests to configured delivery destinations (default: false). Keep disabled in low-risk setups and enable only when human approval responders need channel-visible prompts.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.exec.mode": {
            readonly label: "Approval Forwarding Mode";
            readonly help: "Controls where approval prompts are sent: \"session\" uses origin chat, \"targets\" uses configured targets, and \"both\" sends to both paths. Use \"session\" as baseline and expand only when operational workflow requires redundancy.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.exec.agentFilter": {
            readonly label: "Approval Agent Filter";
            readonly help: "Optional allowlist of agent IDs eligible for forwarded approvals, for example `[\"primary\", \"ops-agent\"]`. Use this to limit forwarding blast radius and avoid notifying channels for unrelated agents.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.exec.sessionFilter": {
            readonly label: "Approval Session Filter";
            readonly help: "Optional session-key filters matched as substring or regex-style patterns, for example `[\"discord:\", \"^agent:ops:\"]`. Use narrow patterns so only intended approval contexts are forwarded to shared destinations.";
            readonly tags: ["storage"];
        };
        readonly "approvals.exec.targets": {
            readonly label: "Approval Forwarding Targets";
            readonly help: "Explicit delivery targets used when forwarding mode includes targets, each with channel and destination details. Keep target lists least-privilege and validate each destination before enabling broad forwarding.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.exec.targets[].channel": {
            readonly label: "Approval Target Channel";
            readonly help: "Channel/provider ID used for forwarded approval delivery, such as discord, slack, or a plugin channel id. Use valid channel IDs only so approvals do not silently fail due to unknown routes.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.exec.targets[].to": {
            readonly label: "Approval Target Destination";
            readonly help: "Destination identifier inside the target channel (channel ID, user ID, or thread root depending on provider). Verify semantics per provider because destination format differs across channel integrations.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.exec.targets[].accountId": {
            readonly label: "Approval Target Account ID";
            readonly help: "Optional account selector for multi-account channel setups when approvals must route through a specific account context. Use this only when the target channel has multiple configured identities.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.exec.targets[].threadId": {
            readonly label: "Approval Target Thread ID";
            readonly help: "Optional thread/topic target for channels that support threaded delivery of forwarded approvals. Use this to keep approval traffic contained in operational threads instead of main channels.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.plugin": {
            readonly label: "Plugin Approval Forwarding";
            readonly help: "Groups plugin-approval forwarding behavior including enablement, routing mode, filters, and explicit targets. Independent of exec approval forwarding. Configure here when plugin approval prompts must reach operational channels.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.plugin.enabled": {
            readonly label: "Forward Plugin Approvals";
            readonly help: "Enables forwarding of plugin approval requests to configured delivery destinations (default: false). Independent of approvals.exec.enabled.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.plugin.mode": {
            readonly label: "Plugin Approval Forwarding Mode";
            readonly help: "Controls where plugin approval prompts are sent: \"session\" uses origin chat, \"targets\" uses configured targets, and \"both\" sends to both paths.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.plugin.agentFilter": {
            readonly label: "Plugin Approval Agent Filter";
            readonly help: "Optional allowlist of agent IDs eligible for forwarded plugin approvals, for example `[\"primary\", \"ops-agent\"]`. Use this to limit forwarding blast radius.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.plugin.sessionFilter": {
            readonly label: "Plugin Approval Session Filter";
            readonly help: "Optional session-key filters matched as substring or regex-style patterns, for example `[\"discord:\", \"^agent:ops:\"]`. Use narrow patterns so only intended approval contexts are forwarded.";
            readonly tags: ["storage"];
        };
        readonly "approvals.plugin.targets": {
            readonly label: "Plugin Approval Forwarding Targets";
            readonly help: "Explicit delivery targets used when plugin approval forwarding mode includes targets, each with channel and destination details.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.plugin.targets[].channel": {
            readonly label: "Plugin Approval Target Channel";
            readonly help: "Channel/provider ID used for forwarded plugin approval delivery, such as discord, slack, or a plugin channel id.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.plugin.targets[].to": {
            readonly label: "Plugin Approval Target Destination";
            readonly help: "Destination identifier inside the target channel (channel ID, user ID, or thread root depending on provider).";
            readonly tags: ["advanced"];
        };
        readonly "approvals.plugin.targets[].accountId": {
            readonly label: "Plugin Approval Target Account ID";
            readonly help: "Optional account selector for multi-account channel setups when plugin approvals must route through a specific account context.";
            readonly tags: ["advanced"];
        };
        readonly "approvals.plugin.targets[].threadId": {
            readonly label: "Plugin Approval Target Thread ID";
            readonly help: "Optional thread/topic target for channels that support threaded delivery of forwarded plugin approvals.";
            readonly tags: ["advanced"];
        };
        readonly "tools.message.allowCrossContextSend": {
            readonly label: "Allow Cross-Context Messaging";
            readonly help: "Legacy override: allow cross-context sends across all providers.";
            readonly tags: ["access", "tools"];
        };
        readonly "tools.message.crossContext.allowWithinProvider": {
            readonly label: "Allow Cross-Context (Same Provider)";
            readonly help: "Allow sends to other channels within the same provider (default: true).";
            readonly tags: ["access", "tools"];
        };
        readonly "tools.message.crossContext.allowAcrossProviders": {
            readonly label: "Allow Cross-Context (Across Providers)";
            readonly help: "Allow sends across different providers (default: false).";
            readonly tags: ["access", "tools"];
        };
        readonly "tools.message.crossContext.marker.enabled": {
            readonly label: "Cross-Context Marker";
            readonly help: "Add a visible origin marker when sending cross-context (default: true).";
            readonly tags: ["tools"];
        };
        readonly "tools.message.crossContext.marker.prefix": {
            readonly label: "Cross-Context Marker Prefix";
            readonly help: "Text prefix for cross-context markers (supports \"{channel}\").";
            readonly tags: ["tools"];
        };
        readonly "tools.message.crossContext.marker.suffix": {
            readonly label: "Cross-Context Marker Suffix";
            readonly help: "Text suffix for cross-context markers (supports \"{channel}\").";
            readonly tags: ["tools"];
        };
        readonly "tools.message.broadcast.enabled": {
            readonly label: "Enable Message Broadcast";
            readonly help: "Enable broadcast action (default: true).";
            readonly tags: ["tools"];
        };
        readonly "tools.web.search.enabled": {
            readonly label: "Enable Web Search Tool";
            readonly help: "Enable the web_search tool (requires a provider API key).";
            readonly tags: ["tools"];
        };
        readonly "tools.web.search.provider": {
            readonly label: "Web Search Provider";
            readonly help: "Search provider id. Auto-detected from available API keys if omitted.";
            readonly tags: ["tools"];
        };
        readonly "tools.web.search.maxResults": {
            readonly label: "Web Search Max Results";
            readonly help: "Number of results to return (1-10).";
            readonly tags: ["performance", "tools"];
        };
        readonly "tools.web.search.timeoutSeconds": {
            readonly label: "Web Search Timeout (sec)";
            readonly help: "Timeout in seconds for web_search requests.";
            readonly tags: ["performance", "tools"];
        };
        readonly "tools.web.search.cacheTtlMinutes": {
            readonly label: "Web Search Cache TTL (min)";
            readonly help: "Cache TTL in minutes for web_search results.";
            readonly tags: ["performance", "storage", "tools"];
        };
        readonly "tools.web.fetch.enabled": {
            readonly label: "Enable Web Fetch Tool";
            readonly help: "Enable the web_fetch tool (lightweight HTTP fetch).";
            readonly tags: ["tools"];
        };
        readonly "tools.web.fetch.maxChars": {
            readonly label: "Web Fetch Max Chars";
            readonly help: "Max characters returned by web_fetch (truncated).";
            readonly tags: ["performance", "tools"];
        };
        readonly "tools.web.fetch.maxCharsCap": {
            readonly label: "Web Fetch Hard Max Chars";
            readonly help: "Hard cap for web_fetch maxChars (applies to config and tool calls).";
            readonly tags: ["performance", "tools"];
        };
        readonly "tools.web.fetch.maxResponseBytes": {
            readonly label: "Web Fetch Max Download Size (bytes)";
            readonly help: "Max download size before truncation.";
            readonly tags: ["performance", "tools"];
        };
        readonly "tools.web.fetch.timeoutSeconds": {
            readonly label: "Web Fetch Timeout (sec)";
            readonly help: "Timeout in seconds for web_fetch requests.";
            readonly tags: ["performance", "tools"];
        };
        readonly "tools.web.fetch.cacheTtlMinutes": {
            readonly label: "Web Fetch Cache TTL (min)";
            readonly help: "Cache TTL in minutes for web_fetch results.";
            readonly tags: ["performance", "storage", "tools"];
        };
        readonly "tools.web.fetch.maxRedirects": {
            readonly label: "Web Fetch Max Redirects";
            readonly help: "Maximum redirects allowed for web_fetch (default: 3).";
            readonly tags: ["performance", "storage", "tools"];
        };
        readonly "tools.web.fetch.userAgent": {
            readonly label: "Web Fetch User-Agent";
            readonly help: "Override User-Agent header for web_fetch requests.";
            readonly tags: ["tools"];
        };
        readonly "tools.web.fetch.readability": {
            readonly label: "Web Fetch Readability Extraction";
            readonly help: "Use Readability to extract main content from HTML (fallbacks to basic HTML cleanup).";
            readonly tags: ["tools"];
        };
        readonly "tools.web.fetch.firecrawl.enabled": {
            readonly label: "Enable Firecrawl Fallback";
            readonly help: "Enable Firecrawl fallback for web_fetch (if configured).";
            readonly tags: ["tools"];
        };
        readonly "tools.web.fetch.firecrawl.apiKey": {
            readonly label: "Firecrawl API Key";
            readonly help: "Firecrawl API key (fallback: FIRECRAWL_API_KEY env var).";
            readonly tags: ["security", "auth", "tools"];
            readonly sensitive: true;
        };
        readonly "tools.web.fetch.firecrawl.baseUrl": {
            readonly label: "Firecrawl Base URL";
            readonly help: "Firecrawl base URL (e.g. https://api.firecrawl.dev or custom endpoint).";
            readonly tags: ["tools"];
        };
        readonly "tools.web.fetch.firecrawl.onlyMainContent": {
            readonly label: "Firecrawl Main Content Only";
            readonly help: "When true, Firecrawl returns only the main content (default: true).";
            readonly tags: ["tools"];
        };
        readonly "tools.web.fetch.firecrawl.maxAgeMs": {
            readonly label: "Firecrawl Cache Max Age (ms)";
            readonly help: "Firecrawl maxAge (ms) for cached results when supported by the API.";
            readonly tags: ["performance", "tools"];
        };
        readonly "tools.web.fetch.firecrawl.timeoutSeconds": {
            readonly label: "Firecrawl Timeout (sec)";
            readonly help: "Timeout in seconds for Firecrawl requests.";
            readonly tags: ["performance", "tools"];
        };
        readonly "tools.web.x_search.enabled": {
            readonly label: "Enable X Search Tool";
            readonly help: "Enable the x_search tool (requires XAI_API_KEY or tools.web.x_search.apiKey).";
            readonly tags: ["tools"];
        };
        readonly "tools.web.x_search.apiKey": {
            readonly label: "xAI API Key";
            readonly help: "xAI API key for X search (fallback: XAI_API_KEY env var).";
            readonly tags: ["security", "auth", "tools"];
            readonly sensitive: true;
        };
        readonly "tools.web.x_search.model": {
            readonly label: "X Search Model";
            readonly help: "Model to use for X search (default: \"grok-4-1-fast-non-reasoning\").";
            readonly tags: ["models", "tools"];
        };
        readonly "tools.web.x_search.inlineCitations": {
            readonly label: "X Search Inline Citations";
            readonly help: "Keep inline citations from xAI in x_search responses when available (default: false).";
            readonly tags: ["tools"];
        };
        readonly "tools.web.x_search.maxTurns": {
            readonly label: "X Search Max Turns";
            readonly help: "Optional max internal search/tool turns xAI may use per x_search request. Omit to let xAI choose.";
            readonly tags: ["performance", "tools"];
        };
        readonly "tools.web.x_search.timeoutSeconds": {
            readonly label: "X Search Timeout (sec)";
            readonly help: "Timeout in seconds for x_search requests.";
            readonly tags: ["performance", "tools"];
        };
        readonly "tools.web.x_search.cacheTtlMinutes": {
            readonly label: "X Search Cache TTL (min)";
            readonly help: "Cache TTL in minutes for x_search results.";
            readonly tags: ["performance", "storage", "tools"];
        };
        readonly "gateway.controlUi.basePath": {
            readonly label: "Control UI Base Path";
            readonly help: "Optional URL prefix where the Control UI is served (e.g. /openclaw).";
            readonly placeholder: "/openclaw";
            readonly tags: ["network", "storage"];
        };
        readonly "gateway.controlUi.root": {
            readonly label: "Control UI Assets Root";
            readonly help: "Optional filesystem root for Control UI assets (defaults to dist/control-ui).";
            readonly placeholder: "dist/control-ui";
            readonly tags: ["network"];
        };
        readonly "gateway.controlUi.allowedOrigins": {
            readonly label: "Control UI Allowed Origins";
            readonly help: "Allowed browser origins for Control UI/WebChat websocket connections (full origins only, e.g. https://control.example.com). Required for non-loopback Control UI deployments unless dangerous Host-header fallback is explicitly enabled. Setting [\"*\"] means allow any browser origin and should be avoided outside tightly controlled local testing.";
            readonly placeholder: "https://control.example.com";
            readonly tags: ["access", "network"];
        };
        readonly "gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback": {
            readonly label: "Dangerously Allow Host-Header Origin Fallback";
            readonly help: "DANGEROUS toggle that enables Host-header based origin fallback for Control UI/WebChat websocket checks. This mode is supported when your deployment intentionally relies on Host-header origin policy; explicit gateway.controlUi.allowedOrigins remains the recommended hardened default.";
            readonly tags: ["security", "access", "network", "advanced"];
        };
        readonly "gateway.controlUi.allowInsecureAuth": {
            readonly label: "Insecure Control UI Auth Toggle";
            readonly help: "Loosens strict browser auth checks for Control UI when you must run a non-standard setup. Keep this off unless you trust your network and proxy path, because impersonation risk is higher.";
            readonly tags: ["security", "access", "network", "advanced"];
        };
        readonly "gateway.controlUi.dangerouslyDisableDeviceAuth": {
            readonly label: "Dangerously Disable Control UI Device Auth";
            readonly help: "Disables Control UI device identity checks and relies on token/password only. Use only for short-lived debugging on trusted networks, then turn it off immediately.";
            readonly tags: ["security", "access", "network", "advanced"];
        };
        readonly "gateway.push": {
            readonly label: "Gateway Push Delivery";
            readonly help: "Push-delivery settings used by the gateway when it needs to wake or notify paired devices. Configure relay-backed APNs here for official iOS builds; direct APNs auth remains env-based for local/manual builds.";
            readonly tags: ["network"];
        };
        readonly "gateway.push.apns": {
            readonly label: "Gateway APNs Delivery";
            readonly help: "APNs delivery settings for iOS devices paired to this gateway. Use relay settings for official/TestFlight builds that register through the external push relay.";
            readonly tags: ["network"];
        };
        readonly "gateway.push.apns.relay": {
            readonly label: "Gateway APNs Relay";
            readonly help: "External relay settings for relay-backed APNs sends. The gateway uses this relay for push.test, wake nudges, and reconnect wakes after a paired official iOS build publishes a relay-backed registration.";
            readonly tags: ["network"];
        };
        readonly "gateway.push.apns.relay.baseUrl": {
            readonly label: "Gateway APNs Relay Base URL";
            readonly help: "Base HTTPS URL for the external APNs relay service used by official/TestFlight iOS builds. Keep this aligned with the relay URL baked into the iOS build so registration and send traffic hit the same deployment.";
            readonly placeholder: "https://relay.example.com";
            readonly tags: ["network", "advanced"];
        };
        readonly "gateway.push.apns.relay.timeoutMs": {
            readonly label: "Gateway APNs Relay Timeout (ms)";
            readonly help: "Timeout in milliseconds for relay send requests from the gateway to the APNs relay (default: 10000). Increase for slower relays or networks, or lower to fail wake attempts faster.";
            readonly tags: ["network", "performance"];
        };
        readonly "gateway.http.endpoints.chatCompletions.enabled": {
            readonly label: "OpenAI Chat Completions Endpoint";
            readonly help: "Enable the OpenAI-compatible `POST /v1/chat/completions` endpoint (default: false).";
            readonly tags: ["network"];
        };
        readonly "gateway.http.endpoints.chatCompletions.maxBodyBytes": {
            readonly label: "OpenAI Chat Completions Max Body Bytes";
            readonly help: "Max request body size in bytes for `/v1/chat/completions` (default: 20MB).";
            readonly tags: ["network", "performance"];
        };
        readonly "gateway.http.endpoints.chatCompletions.maxImageParts": {
            readonly label: "OpenAI Chat Completions Max Image Parts";
            readonly help: "Max number of `image_url` parts accepted from the latest user message (default: 8).";
            readonly tags: ["network", "performance", "media"];
        };
        readonly "gateway.http.endpoints.chatCompletions.maxTotalImageBytes": {
            readonly label: "OpenAI Chat Completions Max Total Image Bytes";
            readonly help: "Max cumulative decoded bytes across all `image_url` parts in one request (default: 20MB).";
            readonly tags: ["network", "performance", "media"];
        };
        readonly "gateway.http.endpoints.chatCompletions.images": {
            readonly label: "OpenAI Chat Completions Image Limits";
            readonly help: "Image fetch/validation controls for OpenAI-compatible `image_url` parts.";
            readonly tags: ["network", "media"];
        };
        readonly "gateway.http.endpoints.chatCompletions.images.allowUrl": {
            readonly label: "OpenAI Chat Completions Allow Image URLs";
            readonly help: "Allow server-side URL fetches for `image_url` parts (default: false; data URIs remain supported). Set this to `false` to disable URL fetching entirely.";
            readonly tags: ["access", "network", "media"];
        };
        readonly "gateway.http.endpoints.chatCompletions.images.urlAllowlist": {
            readonly label: "OpenAI Chat Completions Image URL Allowlist";
            readonly help: "Optional hostname allowlist for `image_url` URL fetches; supports exact hosts and `*.example.com` wildcards. Empty or omitted lists mean no hostname allowlist restriction.";
            readonly tags: ["access", "network", "media"];
        };
        readonly "gateway.http.endpoints.chatCompletions.images.allowedMimes": {
            readonly label: "OpenAI Chat Completions Image MIME Allowlist";
            readonly help: "Allowed MIME types for `image_url` parts (case-insensitive list).";
            readonly tags: ["access", "network", "media"];
        };
        readonly "gateway.http.endpoints.chatCompletions.images.maxBytes": {
            readonly label: "OpenAI Chat Completions Image Max Bytes";
            readonly help: "Max bytes per fetched/decoded `image_url` image (default: 10MB).";
            readonly tags: ["network", "performance", "media"];
        };
        readonly "gateway.http.endpoints.chatCompletions.images.maxRedirects": {
            readonly label: "OpenAI Chat Completions Image Max Redirects";
            readonly help: "Max HTTP redirects allowed when fetching `image_url` URLs (default: 3).";
            readonly tags: ["network", "performance", "storage", "media"];
        };
        readonly "gateway.http.endpoints.chatCompletions.images.timeoutMs": {
            readonly label: "OpenAI Chat Completions Image Timeout (ms)";
            readonly help: "Timeout in milliseconds for `image_url` URL fetches (default: 10000).";
            readonly tags: ["network", "performance", "media"];
        };
        readonly "gateway.reload.mode": {
            readonly label: "Config Reload Mode";
            readonly help: "Controls how config edits are applied: \"off\" ignores live edits, \"restart\" always restarts, \"hot\" applies in-process, and \"hybrid\" tries hot then restarts if required. Keep \"hybrid\" for safest routine updates.";
            readonly tags: ["network", "reliability"];
        };
        readonly "gateway.reload.debounceMs": {
            readonly label: "Config Reload Debounce (ms)";
            readonly help: "Debounce window (ms) before applying config changes.";
            readonly tags: ["network", "reliability", "performance"];
        };
        readonly "gateway.reload.deferralTimeoutMs": {
            readonly label: "Restart Deferral Timeout (ms)";
            readonly help: "Maximum time (ms) to wait for in-flight operations to complete before forcing a SIGUSR1 restart. Default: 300000 (5 minutes). Lower values risk aborting active subagent LLM calls.";
            readonly tags: ["network", "reliability", "performance"];
        };
        readonly "gateway.nodes.browser.mode": {
            readonly label: "Gateway Node Browser Mode";
            readonly help: "Node browser routing (\"auto\" = pick single connected browser node, \"manual\" = require node param, \"off\" = disable).";
            readonly tags: ["network"];
        };
        readonly "gateway.nodes.browser.node": {
            readonly label: "Gateway Node Browser Pin";
            readonly help: "Pin browser routing to a specific node id or name (optional).";
            readonly tags: ["network"];
        };
        readonly "gateway.nodes.allowCommands": {
            readonly label: "Gateway Node Allowlist (Extra Commands)";
            readonly help: "Extra node.invoke commands to allow beyond the gateway defaults (array of command strings). Enabling dangerous commands here is a security-sensitive override and is flagged by `openclaw security audit`.";
            readonly tags: ["access", "network"];
        };
        readonly "gateway.nodes.denyCommands": {
            readonly label: "Gateway Node Denylist";
            readonly help: "Node command names to block even if present in node claims or default allowlist (exact command-name matching only, e.g. `system.run`; does not inspect shell text inside that command).";
            readonly tags: ["access", "network"];
        };
        readonly "nodeHost.browserProxy": {
            readonly label: "Node Browser Proxy";
            readonly help: "Groups browser-proxy settings for exposing local browser control through node routing. Enable only when remote node workflows need your local browser profiles.";
            readonly tags: ["network"];
        };
        readonly "nodeHost.browserProxy.enabled": {
            readonly label: "Node Browser Proxy Enabled";
            readonly help: "Expose the local browser control server through node proxy routing so remote clients can use this host's browser capabilities. Keep disabled unless remote automation explicitly depends on it.";
            readonly tags: ["network"];
        };
        readonly "nodeHost.browserProxy.allowProfiles": {
            readonly label: "Node Browser Proxy Allowed Profiles";
            readonly help: "Optional allowlist of browser profile names exposed through node proxy routing. Leave empty to preserve the default full profile surface, including profile create/delete routes. When set, OpenClaw enforces least-privilege profile access and blocks persistent profile create/delete through the proxy.";
            readonly tags: ["access", "network", "storage"];
        };
        readonly media: {
            readonly label: "Media";
            readonly help: "Top-level media behavior shared across providers and tools that handle inbound files. Keep defaults unless you need stable filenames for external processing pipelines or longer-lived inbound media retention.";
            readonly tags: ["advanced"];
        };
        readonly "media.preserveFilenames": {
            readonly label: "Preserve Media Filenames";
            readonly help: "When enabled, uploaded media keeps its original filename instead of a generated temp-safe name. Turn this on when downstream automations depend on stable names, and leave off to reduce accidental filename leakage.";
            readonly tags: ["storage"];
        };
        readonly "media.ttlHours": {
            readonly label: "Media Retention TTL (hours)";
            readonly help: "Optional retention window in hours for persisted inbound media cleanup across the full media tree. Leave unset to preserve legacy behavior, or set values like 24 (1 day) or 168 (7 days) when you want automatic cleanup.";
            readonly tags: ["advanced"];
        };
        readonly "audio.transcription": {
            readonly label: "Audio Transcription";
            readonly help: "Command-based transcription settings for converting audio files into text before agent handling. Keep a simple, deterministic command path here so failures are easy to diagnose in logs.";
            readonly tags: ["media"];
        };
        readonly "audio.transcription.command": {
            readonly label: "Audio Transcription Command";
            readonly help: "Executable + args used to transcribe audio (first token must be a safe binary/path), for example `[\"whisper-cli\", \"--model\", \"small\", \"{input}\"]`. Prefer a pinned command so runtime environments behave consistently.";
            readonly tags: ["media"];
        };
        readonly "audio.transcription.timeoutSeconds": {
            readonly label: "Audio Transcription Timeout (sec)";
            readonly help: "Maximum time allowed for the transcription command to finish before it is aborted. Increase this for longer recordings, and keep it tight in latency-sensitive deployments.";
            readonly tags: ["performance", "media"];
        };
        readonly "bindings[].type": {
            readonly label: "Binding Type";
            readonly help: "Binding kind. Use \"route\" (or omit for legacy route entries) for normal routing, and \"acp\" for persistent ACP conversation bindings.";
            readonly tags: ["advanced"];
        };
        readonly "bindings[].agentId": {
            readonly label: "Binding Agent ID";
            readonly help: "Target agent ID that receives traffic when the corresponding binding match rule is satisfied. Use valid configured agent IDs only so routing does not fail at runtime.";
            readonly tags: ["advanced"];
        };
        readonly "bindings[].match": {
            readonly label: "Binding Match Rule";
            readonly help: "Match rule object for deciding when a binding applies, including channel and optional account/peer constraints. Keep rules narrow to avoid accidental agent takeover across contexts.";
            readonly tags: ["advanced"];
        };
        readonly "bindings[].match.channel": {
            readonly label: "Binding Channel";
            readonly help: "Channel/provider identifier this binding applies to, such as `telegram`, `discord`, or a plugin channel ID. Use the configured channel key exactly so binding evaluation works reliably.";
            readonly tags: ["advanced"];
        };
        readonly "bindings[].match.accountId": {
            readonly label: "Binding Account ID";
            readonly help: "Optional account selector for multi-account channel setups so the binding applies only to one identity. Use this when account scoping is required for the route and leave unset otherwise.";
            readonly tags: ["advanced"];
        };
        readonly "bindings[].match.peer": {
            readonly label: "Binding Peer Match";
            readonly help: "Optional peer matcher for specific conversations including peer kind and peer id. Use this when only one direct/group/channel target should be pinned to an agent.";
            readonly tags: ["advanced"];
        };
        readonly "bindings[].match.peer.kind": {
            readonly label: "Binding Peer Kind";
            readonly help: "Peer conversation type: \"direct\", \"group\", \"channel\", or legacy \"dm\" (deprecated alias for direct). Prefer \"direct\" for new configs and keep kind aligned with channel semantics.";
            readonly tags: ["advanced"];
        };
        readonly "bindings[].match.peer.id": {
            readonly label: "Binding Peer ID";
            readonly help: "Conversation identifier used with peer matching, such as a chat ID, channel ID, or group ID from the provider. Keep this exact to avoid silent non-matches.";
            readonly tags: ["advanced"];
        };
        readonly "bindings[].match.guildId": {
            readonly label: "Binding Guild ID";
            readonly help: "Optional Discord-style guild/server ID constraint for binding evaluation in multi-server deployments. Use this when the same peer identifiers can appear across different guilds.";
            readonly tags: ["advanced"];
        };
        readonly "bindings[].match.teamId": {
            readonly label: "Binding Team ID";
            readonly help: "Optional team/workspace ID constraint used by providers that scope chats under teams. Add this when you need bindings isolated to one workspace context.";
            readonly tags: ["advanced"];
        };
        readonly "bindings[].match.roles": {
            readonly label: "Binding Roles";
            readonly help: "Optional role-based filter list used by providers that attach roles to chat context. Use this to route privileged or operational role traffic to specialized agents.";
            readonly tags: ["advanced"];
        };
        readonly "bindings[].acp": {
            readonly label: "ACP Binding Overrides";
            readonly help: "Optional per-binding ACP overrides for bindings[].type=acp. This layer overrides agents.list[].runtime.acp defaults for the matched conversation.";
            readonly tags: ["advanced"];
        };
        readonly "bindings[].acp.mode": {
            readonly label: "ACP Binding Mode";
            readonly help: "ACP session mode override for this binding (persistent or oneshot).";
            readonly tags: ["advanced"];
        };
        readonly "bindings[].acp.label": {
            readonly label: "ACP Binding Label";
            readonly help: "Human-friendly label for ACP status/diagnostics in this bound conversation.";
            readonly tags: ["advanced"];
        };
        readonly "bindings[].acp.cwd": {
            readonly label: "ACP Binding Working Directory";
            readonly help: "Working directory override for ACP sessions created from this binding.";
            readonly tags: ["advanced"];
        };
        readonly "bindings[].acp.backend": {
            readonly label: "ACP Binding Backend";
            readonly help: "ACP backend override for this binding (falls back to agent runtime ACP backend, then global acp.backend).";
            readonly tags: ["advanced"];
        };
        readonly broadcast: {
            readonly label: "Broadcast";
            readonly help: "Broadcast routing map for sending the same outbound message to multiple peer IDs per source conversation. Keep this minimal and audited because one source can fan out to many destinations.";
            readonly tags: ["advanced"];
        };
        readonly "broadcast.strategy": {
            readonly label: "Broadcast Strategy";
            readonly help: "Delivery order for broadcast fan-out: \"parallel\" sends to all targets concurrently, while \"sequential\" sends one-by-one. Use \"parallel\" for speed and \"sequential\" for stricter ordering/backpressure control.";
            readonly tags: ["advanced"];
        };
        readonly "broadcast.*": {
            readonly label: "Broadcast Destination List";
            readonly help: "Per-source broadcast destination list where each key is a source peer ID and the value is an array of destination peer IDs. Keep lists intentional to avoid accidental message amplification.";
            readonly tags: ["advanced"];
        };
        readonly "skills.load.watch": {
            readonly label: "Watch Skills";
            readonly help: "Enable filesystem watching for skill-definition changes so updates can be applied without full process restart. Keep enabled in development workflows and disable in immutable production images.";
            readonly tags: ["advanced"];
        };
        readonly "skills.load.watchDebounceMs": {
            readonly label: "Skills Watch Debounce (ms)";
            readonly help: "Debounce window in milliseconds for coalescing rapid skill file changes before reload logic runs. Increase to reduce reload churn on frequent writes, or lower for faster edit feedback.";
            readonly tags: ["performance", "automation"];
        };
        readonly "agents.defaults.workspace": {
            readonly label: "Workspace";
            readonly help: "Default workspace path exposed to agent runtime tools for filesystem context and repo-aware behavior. Set this explicitly when running from wrappers so path resolution stays deterministic.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.repoRoot": {
            readonly label: "Repo Root";
            readonly help: "Optional repository root shown in the system prompt runtime line (overrides auto-detect).";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.bootstrapMaxChars": {
            readonly label: "Bootstrap Max Chars";
            readonly help: "Max characters of each workspace bootstrap file injected into the system prompt before truncation (default: 20000).";
            readonly tags: ["performance"];
        };
        readonly "agents.defaults.bootstrapTotalMaxChars": {
            readonly label: "Bootstrap Total Max Chars";
            readonly help: "Max total characters across all injected workspace bootstrap files (default: 150000).";
            readonly tags: ["performance"];
        };
        readonly "agents.defaults.bootstrapPromptTruncationWarning": {
            readonly label: "Bootstrap Prompt Truncation Warning";
            readonly help: "Inject agent-visible warning text when bootstrap files are truncated: \"off\", \"once\" (default), or \"always\".";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.envelopeTimezone": {
            readonly label: "Envelope Timezone";
            readonly help: "Timezone for message envelopes (\"utc\", \"local\", \"user\", or an IANA timezone string).";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.envelopeTimestamp": {
            readonly label: "Envelope Timestamp";
            readonly help: "Include absolute timestamps in message envelopes (\"on\" or \"off\").";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.envelopeElapsed": {
            readonly label: "Envelope Elapsed";
            readonly help: "Include elapsed time in message envelopes (\"on\" or \"off\").";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch": {
            readonly label: "Memory Search";
            readonly help: "Vector search over MEMORY.md and memory/*.md (per-agent overrides supported).";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.enabled": {
            readonly label: "Enable Memory Search";
            readonly help: "Master toggle for memory search indexing and retrieval behavior on this agent profile. Keep enabled for semantic recall, and disable when you want fully stateless responses.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.sources": {
            readonly label: "Memory Search Sources";
            readonly help: "Chooses which sources are indexed: \"memory\" reads MEMORY.md + memory files, and \"sessions\" includes transcript history. Keep [\"memory\"] unless you need recall from prior chat transcripts.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.extraPaths": {
            readonly label: "Extra Memory Paths";
            readonly help: "Adds extra directories or .md files to the memory index beyond default memory files. Use this when key reference docs live elsewhere in your repo; when multimodal memory is enabled, matching image/audio files under these paths are also eligible for indexing.";
            readonly tags: ["storage"];
        };
        readonly "agents.defaults.memorySearch.multimodal": {
            readonly label: "Memory Search Multimodal";
            readonly help: "Optional multimodal memory settings for indexing image and audio files from configured extra paths. Keep this off unless your embedding model explicitly supports cross-modal embeddings, and set `memorySearch.fallback` to \"none\" while it is enabled. Matching files are uploaded to the configured remote embedding provider during indexing.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.multimodal.enabled": {
            readonly label: "Enable Memory Search Multimodal";
            readonly help: "Enables image/audio memory indexing from extraPaths. This currently requires Gemini embedding-2, keeps the default memory roots Markdown-only, disables memory-search fallback providers, and uploads matching binary content to the configured remote embedding provider.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.multimodal.modalities": {
            readonly label: "Memory Search Multimodal Modalities";
            readonly help: "Selects which multimodal file types are indexed from extraPaths: \"image\", \"audio\", or \"all\". Keep this narrow to avoid indexing large binary corpora unintentionally.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.multimodal.maxFileBytes": {
            readonly label: "Memory Search Multimodal Max File Bytes";
            readonly help: "Sets the maximum bytes allowed per multimodal file before it is skipped during memory indexing. Use this to cap upload cost and indexing latency, or raise it for short high-quality audio clips.";
            readonly tags: ["performance", "storage"];
        };
        readonly "agents.defaults.memorySearch.experimental.sessionMemory": {
            readonly label: "Memory Search Session Index (Experimental)";
            readonly help: "Indexes session transcripts into memory search so responses can reference prior chat turns. Keep this off unless transcript recall is needed, because indexing cost and storage usage both increase.";
            readonly tags: ["security", "storage", "advanced"];
        };
        readonly "agents.defaults.memorySearch.provider": {
            readonly label: "Memory Search Provider";
            readonly help: "Selects the embedding backend used to build/query memory vectors: \"openai\", \"gemini\", \"voyage\", \"mistral\", \"ollama\", or \"local\". Keep your most reliable provider here and configure fallback for resilience.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.remote.baseUrl": {
            readonly label: "Remote Embedding Base URL";
            readonly help: "Overrides the embedding API endpoint, such as an OpenAI-compatible proxy or custom Gemini base URL. Use this only when routing through your own gateway or vendor endpoint; keep provider defaults otherwise.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.remote.apiKey": {
            readonly label: "Remote Embedding API Key";
            readonly help: "Supplies a dedicated API key for remote embedding calls used by memory indexing and query-time embeddings. Use this when memory embeddings should use different credentials than global defaults or environment variables.";
            readonly tags: ["security", "auth"];
            readonly sensitive: true;
        };
        readonly "agents.defaults.memorySearch.remote.headers": {
            readonly label: "Remote Embedding Headers";
            readonly help: "Adds custom HTTP headers to remote embedding requests, merged with provider defaults. Use this for proxy auth and tenant routing headers, and keep values minimal to avoid leaking sensitive metadata.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.remote.batch.enabled": {
            readonly label: "Remote Batch Embedding Enabled";
            readonly help: "Enables provider batch APIs for embedding jobs when supported (OpenAI/Gemini), improving throughput on larger index runs. Keep this enabled unless debugging provider batch failures or running very small workloads.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.remote.batch.wait": {
            readonly label: "Remote Batch Wait for Completion";
            readonly help: "Waits for batch embedding jobs to fully finish before the indexing operation completes. Keep this enabled for deterministic indexing state; disable only if you accept delayed consistency.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.remote.batch.concurrency": {
            readonly label: "Remote Batch Concurrency";
            readonly help: "Limits how many embedding batch jobs run at the same time during indexing (default: 2). Increase carefully for faster bulk indexing, but watch provider rate limits and queue errors.";
            readonly tags: ["performance"];
        };
        readonly "agents.defaults.memorySearch.remote.batch.pollIntervalMs": {
            readonly label: "Remote Batch Poll Interval (ms)";
            readonly help: "Controls how often the system polls provider APIs for batch job status in milliseconds (default: 2000). Use longer intervals to reduce API chatter, or shorter intervals for faster completion detection.";
            readonly tags: ["performance"];
        };
        readonly "agents.defaults.memorySearch.remote.batch.timeoutMinutes": {
            readonly label: "Remote Batch Timeout (min)";
            readonly help: "Sets the maximum wait time for a full embedding batch operation in minutes (default: 60). Increase for very large corpora or slower providers, and lower it to fail fast in automation-heavy flows.";
            readonly tags: ["performance"];
        };
        readonly "agents.defaults.memorySearch.model": {
            readonly label: "Memory Search Model";
            readonly help: "Embedding model override used by the selected memory provider when a non-default model is required. Set this only when you need explicit recall quality/cost tuning beyond provider defaults.";
            readonly tags: ["models"];
        };
        readonly "agents.defaults.memorySearch.outputDimensionality": {
            readonly label: "Memory Search Output Dimensionality";
            readonly help: "Gemini embedding-2 only: chooses the output vector size for memory embeddings. Use 768, 1536, or 3072 (default), and expect a full reindex when you change it because stored vector dimensions must stay consistent.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.fallback": {
            readonly label: "Memory Search Fallback";
            readonly help: "Backup provider used when primary embeddings fail: \"openai\", \"gemini\", \"voyage\", \"mistral\", \"ollama\", \"local\", or \"none\". Set a real fallback for production reliability; use \"none\" only if you prefer explicit failures.";
            readonly tags: ["reliability"];
        };
        readonly "agents.defaults.memorySearch.local.modelPath": {
            readonly label: "Local Embedding Model Path";
            readonly help: "Specifies the local embedding model source for local memory search, such as a GGUF file path or `hf:` URI. Use this only when provider is `local`, and verify model compatibility before large index rebuilds.";
            readonly tags: ["storage"];
        };
        readonly "agents.defaults.memorySearch.store.path": {
            readonly label: "Memory Search Index Path";
            readonly help: "Sets where the SQLite memory index is stored on disk for each agent. Keep the default `~/.openclaw/memory/{agentId}.sqlite` unless you need custom storage placement or backup policy alignment.";
            readonly tags: ["storage"];
        };
        readonly "agents.defaults.memorySearch.store.vector.enabled": {
            readonly label: "Memory Search Vector Index";
            readonly help: "Enables the sqlite-vec extension used for vector similarity queries in memory search (default: true). Keep this enabled for normal semantic recall; disable only for debugging or fallback-only operation.";
            readonly tags: ["storage"];
        };
        readonly "agents.defaults.memorySearch.store.vector.extensionPath": {
            readonly label: "Memory Search Vector Extension Path";
            readonly help: "Overrides the auto-discovered sqlite-vec extension library path (`.dylib`, `.so`, or `.dll`). Use this when your runtime cannot find sqlite-vec automatically or you pin a known-good build.";
            readonly tags: ["storage"];
        };
        readonly "agents.defaults.memorySearch.chunking.tokens": {
            readonly label: "Memory Chunk Tokens";
            readonly help: "Chunk size in tokens used when splitting memory sources before embedding/indexing. Increase for broader context per chunk, or lower to improve precision on pinpoint lookups.";
            readonly tags: ["security", "auth"];
        };
        readonly "agents.defaults.memorySearch.chunking.overlap": {
            readonly label: "Memory Chunk Overlap Tokens";
            readonly help: "Token overlap between adjacent memory chunks to preserve context continuity near split boundaries. Use modest overlap to reduce boundary misses without inflating index size too aggressively.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.sync.onSessionStart": {
            readonly label: "Index on Session Start";
            readonly help: "Triggers a memory index sync when a session starts so early turns see fresh memory content. Keep enabled when startup freshness matters more than initial turn latency.";
            readonly tags: ["storage", "automation"];
        };
        readonly "agents.defaults.memorySearch.sync.onSearch": {
            readonly label: "Index on Search (Lazy)";
            readonly help: "Uses lazy sync by scheduling reindex on search after content changes are detected. Keep enabled for lower idle overhead, or disable if you require pre-synced indexes before any query.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.sync.watch": {
            readonly label: "Watch Memory Files";
            readonly help: "Watches memory files and schedules index updates from file-change events (chokidar). Enable for near-real-time freshness; disable on very large workspaces if watch churn is too noisy.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.sync.watchDebounceMs": {
            readonly label: "Memory Watch Debounce (ms)";
            readonly help: "Debounce window in milliseconds for coalescing rapid file-watch events before reindex runs. Increase to reduce churn on frequently-written files, or lower for faster freshness.";
            readonly tags: ["performance", "automation"];
        };
        readonly "agents.defaults.memorySearch.sync.sessions.deltaBytes": {
            readonly label: "Session Delta Bytes";
            readonly help: "Requires at least this many newly appended bytes before session transcript changes trigger reindex (default: 100000). Increase to reduce frequent small reindexes, or lower for faster transcript freshness.";
            readonly tags: ["storage"];
        };
        readonly "agents.defaults.memorySearch.sync.sessions.deltaMessages": {
            readonly label: "Session Delta Messages";
            readonly help: "Requires at least this many appended transcript messages before reindex is triggered (default: 50). Lower this for near-real-time transcript recall, or raise it to reduce indexing churn.";
            readonly tags: ["storage"];
        };
        readonly "agents.defaults.memorySearch.sync.sessions.postCompactionForce": {
            readonly label: "Force Reindex After Compaction";
            readonly help: "Forces a session memory-search reindex after compaction-triggered transcript updates (default: true). Keep enabled when compacted summaries must be immediately searchable, or disable to reduce write-time indexing pressure.";
            readonly tags: ["storage"];
        };
        readonly "agents.defaults.memorySearch.query.maxResults": {
            readonly label: "Memory Search Max Results";
            readonly help: "Maximum number of memory hits returned from search before downstream reranking and prompt injection. Raise for broader recall, or lower for tighter prompts and faster responses.";
            readonly tags: ["performance"];
        };
        readonly "agents.defaults.memorySearch.query.minScore": {
            readonly label: "Memory Search Min Score";
            readonly help: "Minimum relevance score threshold for including memory results in final recall output. Increase to reduce weak/noisy matches, or lower when you need more permissive retrieval.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.query.hybrid.enabled": {
            readonly label: "Memory Search Hybrid";
            readonly help: "Combines BM25 keyword matching with vector similarity for better recall on mixed exact + semantic queries. Keep enabled unless you are isolating ranking behavior for troubleshooting.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.query.hybrid.vectorWeight": {
            readonly label: "Memory Search Vector Weight";
            readonly help: "Controls how strongly semantic similarity influences hybrid ranking (0-1). Increase when paraphrase matching matters more than exact terms; decrease for stricter keyword emphasis.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.query.hybrid.textWeight": {
            readonly label: "Memory Search Text Weight";
            readonly help: "Controls how strongly BM25 keyword relevance influences hybrid ranking (0-1). Increase for exact-term matching; decrease when semantic matches should rank higher.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.query.hybrid.candidateMultiplier": {
            readonly label: "Memory Search Hybrid Candidate Multiplier";
            readonly help: "Expands the candidate pool before reranking (default: 4). Raise this for better recall on noisy corpora, but expect more compute and slightly slower searches.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.query.hybrid.mmr.enabled": {
            readonly label: "Memory Search MMR Re-ranking";
            readonly help: "Adds MMR reranking to diversify results and reduce near-duplicate snippets in a single answer window. Enable when recall looks repetitive; keep off for strict score ordering.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.query.hybrid.mmr.lambda": {
            readonly label: "Memory Search MMR Lambda";
            readonly help: "Sets MMR relevance-vs-diversity balance (0 = most diverse, 1 = most relevant, default: 0.7). Lower values reduce repetition; higher values keep tightly relevant but may duplicate.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.query.hybrid.temporalDecay.enabled": {
            readonly label: "Memory Search Temporal Decay";
            readonly help: "Applies recency decay so newer memory can outrank older memory when scores are close. Enable when timeliness matters; keep off for timeless reference knowledge.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.query.hybrid.temporalDecay.halfLifeDays": {
            readonly label: "Memory Search Temporal Decay Half-life (Days)";
            readonly help: "Controls how fast older memory loses rank when temporal decay is enabled (half-life in days, default: 30). Lower values prioritize recent context more aggressively.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.memorySearch.cache.enabled": {
            readonly label: "Memory Search Embedding Cache";
            readonly help: "Caches computed chunk embeddings in SQLite so reindexing and incremental updates run faster (default: true). Keep this enabled unless investigating cache correctness or minimizing disk usage.";
            readonly tags: ["storage"];
        };
        readonly "agents.defaults.memorySearch.cache.maxEntries": {
            readonly label: "Memory Search Embedding Cache Max Entries";
            readonly help: "Sets a best-effort upper bound on cached embeddings kept in SQLite for memory search. Use this when controlling disk growth matters more than peak reindex speed.";
            readonly tags: ["performance", "storage"];
        };
        readonly memory: {
            readonly label: "Memory";
            readonly help: "Memory backend configuration (global).";
            readonly tags: ["advanced"];
        };
        readonly "memory.backend": {
            readonly label: "Memory Backend";
            readonly help: "Selects the global memory engine: \"builtin\" uses OpenClaw memory internals, while \"qmd\" uses the QMD sidecar pipeline. Keep \"builtin\" unless you intentionally operate QMD.";
            readonly tags: ["storage"];
        };
        readonly "memory.citations": {
            readonly label: "Memory Citations Mode";
            readonly help: "Controls citation visibility in replies: \"auto\" shows citations when useful, \"on\" always shows them, and \"off\" hides them. Keep \"auto\" for a balanced signal-to-noise default.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.command": {
            readonly label: "QMD Binary";
            readonly help: "Sets the executable path for the `qmd` binary used by the QMD backend (default: resolved from PATH). Use an explicit absolute path when multiple qmd installs exist or PATH differs across environments.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.mcporter": {
            readonly label: "QMD MCPorter";
            readonly help: "Routes QMD work through mcporter (MCP runtime) instead of spawning `qmd` for each call. Use this when cold starts are expensive on large models; keep direct process mode for simpler local setups.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.mcporter.enabled": {
            readonly label: "QMD MCPorter Enabled";
            readonly help: "Routes QMD through an mcporter daemon instead of spawning qmd per request, reducing cold-start overhead for larger models. Keep disabled unless mcporter is installed and configured.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.mcporter.serverName": {
            readonly label: "QMD MCPorter Server Name";
            readonly help: "Names the mcporter server target used for QMD calls (default: qmd). Change only when your mcporter setup uses a custom server name for qmd mcp keep-alive.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.mcporter.startDaemon": {
            readonly label: "QMD MCPorter Start Daemon";
            readonly help: "Automatically starts the mcporter daemon when mcporter-backed QMD mode is enabled (default: true). Keep enabled unless process lifecycle is managed externally by your service supervisor.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.searchMode": {
            readonly label: "QMD Search Mode";
            readonly help: "Selects the QMD retrieval path: \"query\" uses standard query flow, \"search\" uses search-oriented retrieval, and \"vsearch\" emphasizes vector retrieval. Keep default unless tuning relevance quality.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.includeDefaultMemory": {
            readonly label: "QMD Include Default Memory";
            readonly help: "Automatically indexes default memory files (MEMORY.md and memory/**/*.md) into QMD collections. Keep enabled unless you want indexing controlled only through explicit custom paths.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.paths": {
            readonly label: "QMD Extra Paths";
            readonly help: "Adds custom directories or files to include in QMD indexing, each with an optional name and glob pattern. Use this for project-specific knowledge locations that are outside default memory paths.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.paths.path": {
            readonly label: "QMD Path";
            readonly help: "Defines the root location QMD should scan, using an absolute path or `~`-relative path. Use stable directories so collection identity does not drift across environments.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.paths.pattern": {
            readonly label: "QMD Path Pattern";
            readonly help: "Filters files under each indexed root using a glob pattern, with default `**/*.md`. Use narrower patterns to reduce noise and indexing cost when directories contain mixed file types.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.paths.name": {
            readonly label: "QMD Path Name";
            readonly help: "Sets a stable collection name for an indexed path instead of deriving it from filesystem location. Use this when paths vary across machines but you want consistent collection identity.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.sessions.enabled": {
            readonly label: "QMD Session Indexing";
            readonly help: "Indexes session transcripts into QMD so recall can include prior conversation content (experimental, default: false). Enable only when transcript memory is required and you accept larger index churn.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.sessions.exportDir": {
            readonly label: "QMD Session Export Directory";
            readonly help: "Overrides where sanitized session exports are written before QMD indexing. Use this when default state storage is constrained or when exports must land on a managed volume.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.sessions.retentionDays": {
            readonly label: "QMD Session Retention (days)";
            readonly help: "Defines how long exported session files are kept before automatic pruning, in days (default: unlimited). Set a finite value for storage hygiene or compliance retention policies.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.update.interval": {
            readonly label: "QMD Update Interval";
            readonly help: "Sets how often QMD refreshes indexes from source content (duration string, default: 5m). Shorter intervals improve freshness but increase background CPU and I/O.";
            readonly tags: ["performance", "storage"];
        };
        readonly "memory.qmd.update.debounceMs": {
            readonly label: "QMD Update Debounce (ms)";
            readonly help: "Sets the minimum delay between consecutive QMD refresh attempts in milliseconds (default: 15000). Increase this if frequent file changes cause update thrash or unnecessary background load.";
            readonly tags: ["performance", "storage"];
        };
        readonly "memory.qmd.update.onBoot": {
            readonly label: "QMD Update on Startup";
            readonly help: "Runs an initial QMD update once during gateway startup (default: true). Keep enabled so recall starts from a fresh baseline; disable only when startup speed is more important than immediate freshness.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.update.waitForBootSync": {
            readonly label: "QMD Wait for Boot Sync";
            readonly help: "Blocks startup completion until the initial boot-time QMD sync finishes (default: false). Enable when you need fully up-to-date recall before serving traffic, and keep off for faster boot.";
            readonly tags: ["storage"];
        };
        readonly "memory.qmd.update.embedInterval": {
            readonly label: "QMD Embed Interval";
            readonly help: "Sets how often QMD recomputes embeddings (duration string, default: 60m; set 0 to disable periodic embeds). Lower intervals improve freshness but increase embedding workload and cost.";
            readonly tags: ["performance", "storage"];
        };
        readonly "memory.qmd.update.commandTimeoutMs": {
            readonly label: "QMD Command Timeout (ms)";
            readonly help: "Sets timeout for QMD maintenance commands such as collection list/add in milliseconds (default: 30000). Increase when running on slower disks or remote filesystems that delay command completion.";
            readonly tags: ["performance", "storage"];
        };
        readonly "memory.qmd.update.updateTimeoutMs": {
            readonly label: "QMD Update Timeout (ms)";
            readonly help: "Sets maximum runtime for each `qmd update` cycle in milliseconds (default: 120000). Raise this for larger collections; lower it when you want quicker failure detection in automation.";
            readonly tags: ["performance", "storage"];
        };
        readonly "memory.qmd.update.embedTimeoutMs": {
            readonly label: "QMD Embed Timeout (ms)";
            readonly help: "Sets maximum runtime for each `qmd embed` cycle in milliseconds (default: 120000). Increase for heavier embedding workloads or slower hardware, and lower to fail fast under tight SLAs.";
            readonly tags: ["performance", "storage"];
        };
        readonly "memory.qmd.limits.maxResults": {
            readonly label: "QMD Max Results";
            readonly help: "Limits how many QMD hits are returned into the agent loop for each recall request (default: 6). Increase for broader recall context, or lower to keep prompts tighter and faster.";
            readonly tags: ["performance", "storage"];
        };
        readonly "memory.qmd.limits.maxSnippetChars": {
            readonly label: "QMD Max Snippet Chars";
            readonly help: "Caps per-result snippet length extracted from QMD hits in characters (default: 700). Lower this when prompts bloat quickly, and raise only if answers consistently miss key details.";
            readonly tags: ["performance", "storage"];
        };
        readonly "memory.qmd.limits.maxInjectedChars": {
            readonly label: "QMD Max Injected Chars";
            readonly help: "Caps how much QMD text can be injected into one turn across all hits. Use lower values to control prompt bloat and latency; raise only when context is consistently truncated.";
            readonly tags: ["performance", "storage"];
        };
        readonly "memory.qmd.limits.timeoutMs": {
            readonly label: "QMD Search Timeout (ms)";
            readonly help: "Sets per-query QMD search timeout in milliseconds (default: 4000). Increase for larger indexes or slower environments, and lower to keep request latency bounded.";
            readonly tags: ["performance", "storage"];
        };
        readonly "memory.qmd.scope": {
            readonly label: "QMD Surface Scope";
            readonly help: "Defines which sessions/channels are eligible for QMD recall using session.sendPolicy-style rules. Keep default direct-only scope unless you intentionally want cross-chat memory sharing.";
            readonly tags: ["storage"];
        };
        readonly auth: {
            readonly label: "Auth";
            readonly help: "Authentication profile root used for multi-profile provider credentials and cooldown-based failover ordering. Keep profiles minimal and explicit so automatic failover behavior stays auditable.";
            readonly tags: ["advanced"];
        };
        readonly "auth.profiles": {
            readonly label: "Auth Profiles";
            readonly help: "Named auth profiles (provider + mode + optional email).";
            readonly tags: ["auth", "access", "storage"];
        };
        readonly "auth.order": {
            readonly label: "Auth Profile Order";
            readonly help: "Ordered auth profile IDs per provider (used for automatic failover).";
            readonly tags: ["auth", "access"];
        };
        readonly "auth.cooldowns": {
            readonly label: "Auth Cooldowns";
            readonly help: "Cooldown/backoff controls for temporary profile suppression after billing-related failures and retry windows. Use these to prevent rapid re-selection of profiles that are still blocked.";
            readonly tags: ["auth", "access"];
        };
        readonly acp: {
            readonly label: "ACP";
            readonly help: "ACP runtime controls for enabling dispatch, selecting backends, constraining allowed agent targets, and tuning streamed turn projection behavior.";
            readonly tags: ["advanced"];
        };
        readonly "acp.enabled": {
            readonly label: "ACP Enabled";
            readonly help: "Global ACP feature gate. Keep disabled unless ACP runtime + policy are configured.";
            readonly tags: ["advanced"];
        };
        readonly "acp.dispatch.enabled": {
            readonly label: "ACP Dispatch Enabled";
            readonly help: "Independent dispatch gate for ACP session turns (default: true). Set false to keep ACP commands available while blocking ACP turn execution.";
            readonly tags: ["advanced"];
        };
        readonly "acp.backend": {
            readonly label: "ACP Backend";
            readonly help: "Default ACP runtime backend id (for example: acpx). Must match a registered ACP runtime plugin backend.";
            readonly tags: ["advanced"];
        };
        readonly "acp.defaultAgent": {
            readonly label: "ACP Default Agent";
            readonly help: "Fallback ACP target agent id used when ACP spawns do not specify an explicit target.";
            readonly tags: ["advanced"];
        };
        readonly "acp.allowedAgents": {
            readonly label: "ACP Allowed Agents";
            readonly help: "Allowlist of ACP target agent ids permitted for ACP runtime sessions. Empty means no additional allowlist restriction.";
            readonly tags: ["access"];
        };
        readonly "acp.maxConcurrentSessions": {
            readonly label: "ACP Max Concurrent Sessions";
            readonly help: "Maximum concurrently active ACP sessions across this gateway process.";
            readonly tags: ["performance", "storage"];
        };
        readonly "acp.stream": {
            readonly label: "ACP Stream";
            readonly help: "ACP streaming projection controls for chunk sizing, metadata visibility, and deduped delivery behavior.";
            readonly tags: ["advanced"];
        };
        readonly "acp.stream.coalesceIdleMs": {
            readonly label: "ACP Stream Coalesce Idle (ms)";
            readonly help: "Coalescer idle flush window in milliseconds for ACP streamed text before block replies are emitted.";
            readonly tags: ["advanced"];
        };
        readonly "acp.stream.maxChunkChars": {
            readonly label: "ACP Stream Max Chunk Chars";
            readonly help: "Maximum chunk size for ACP streamed block projection before splitting into multiple block replies.";
            readonly tags: ["performance"];
        };
        readonly "acp.stream.repeatSuppression": {
            readonly label: "ACP Stream Repeat Suppression";
            readonly help: "When true (default), suppress repeated ACP status/tool projection lines in a turn while keeping raw ACP events unchanged.";
            readonly tags: ["advanced"];
        };
        readonly "acp.stream.deliveryMode": {
            readonly label: "ACP Stream Delivery Mode";
            readonly help: "ACP delivery style: live streams projected output incrementally, final_only buffers all projected ACP output until terminal turn events.";
            readonly tags: ["advanced"];
        };
        readonly "acp.stream.hiddenBoundarySeparator": {
            readonly label: "ACP Stream Hidden Boundary Separator";
            readonly help: "Separator inserted before next visible assistant text when hidden ACP tool lifecycle events occurred (none|space|newline|paragraph). Default: paragraph.";
            readonly tags: ["advanced"];
        };
        readonly "acp.stream.maxOutputChars": {
            readonly label: "ACP Stream Max Output Chars";
            readonly help: "Maximum assistant output characters projected per ACP turn before truncation notice is emitted.";
            readonly tags: ["performance"];
        };
        readonly "acp.stream.maxSessionUpdateChars": {
            readonly label: "ACP Stream Max Session Update Chars";
            readonly help: "Maximum characters for projected ACP session/update lines (tool/status updates).";
            readonly tags: ["performance", "storage"];
        };
        readonly "acp.stream.tagVisibility": {
            readonly label: "ACP Stream Tag Visibility";
            readonly help: "Per-sessionUpdate visibility overrides for ACP projection (for example usage_update, available_commands_update).";
            readonly tags: ["advanced"];
        };
        readonly "acp.runtime.ttlMinutes": {
            readonly label: "ACP Runtime TTL (minutes)";
            readonly help: "Idle runtime TTL in minutes for ACP session workers before eligible cleanup.";
            readonly tags: ["advanced"];
        };
        readonly "acp.runtime.installCommand": {
            readonly label: "ACP Runtime Install Command";
            readonly help: "Optional operator install/setup command shown by `/acp install` and `/acp doctor` when ACP backend wiring is missing.";
            readonly tags: ["advanced"];
        };
        readonly "models.mode": {
            readonly label: "Model Catalog Mode";
            readonly help: "Controls provider catalog behavior: \"merge\" keeps built-ins and overlays your custom providers, while \"replace\" uses only your configured providers. In \"merge\", matching provider IDs preserve non-empty agent models.json baseUrl values, while apiKey values are preserved only when the provider is not SecretRef-managed in current config/auth-profile context; SecretRef-managed providers refresh apiKey from current source markers, and matching model contextWindow/maxTokens use the higher value between explicit and implicit entries.";
            readonly tags: ["models"];
        };
        readonly "models.providers": {
            readonly label: "Model Providers";
            readonly help: "Provider map keyed by provider ID containing connection/auth settings and concrete model definitions. Use stable provider keys so references from agents and tooling remain portable across environments.";
            readonly tags: ["models"];
        };
        readonly "models.providers.*.baseUrl": {
            readonly label: "Model Provider Base URL";
            readonly help: "Base URL for the provider endpoint used to serve model requests for that provider entry. Use HTTPS endpoints and keep URLs environment-specific through config templating where needed.";
            readonly tags: ["models"];
        };
        readonly "models.providers.*.apiKey": {
            readonly label: "Model Provider API Key";
            readonly help: "Provider credential used for API-key based authentication when the provider requires direct key auth. Use secret/env substitution and avoid storing real keys in committed config files.";
            readonly tags: ["security", "auth", "models"];
            readonly sensitive: true;
        };
        readonly "models.providers.*.auth": {
            readonly label: "Model Provider Auth Mode";
            readonly help: "Selects provider auth style: \"api-key\" for API key auth, \"token\" for bearer token auth, \"oauth\" for OAuth credentials, and \"aws-sdk\" for AWS credential resolution. Match this to your provider requirements.";
            readonly tags: ["models"];
        };
        readonly "models.providers.*.api": {
            readonly label: "Model Provider API Adapter";
            readonly help: "Provider API adapter selection controlling request/response compatibility handling for model calls. Use the adapter that matches your upstream provider protocol to avoid feature mismatch.";
            readonly tags: ["models"];
        };
        readonly "models.providers.*.injectNumCtxForOpenAICompat": {
            readonly label: "Model Provider Inject num_ctx (OpenAI Compat)";
            readonly help: "Controls whether OpenClaw injects `options.num_ctx` for Ollama providers configured with the OpenAI-compatible adapter (`openai-completions`). Default is true. Set false only if your proxy/upstream rejects unknown `options` payload fields.";
            readonly tags: ["models"];
        };
        readonly "models.providers.*.headers": {
            readonly label: "Model Provider Headers";
            readonly help: "Static HTTP headers merged into provider requests for tenant routing, proxy auth, or custom gateway requirements. Use this sparingly and keep sensitive header values in secrets.";
            readonly tags: ["models"];
        };
        readonly "models.providers.*.authHeader": {
            readonly label: "Model Provider Authorization Header";
            readonly help: "When true, credentials are sent via the HTTP Authorization header even if alternate auth is possible. Use this only when your provider or proxy explicitly requires Authorization forwarding.";
            readonly tags: ["models"];
        };
        readonly "models.providers.*.models": {
            readonly label: "Model Provider Model List";
            readonly help: "Declared model list for a provider including identifiers, metadata, and optional compatibility/cost hints. Keep IDs exact to provider catalog values so selection and fallback resolve correctly.";
            readonly tags: ["models"];
        };
        readonly "models.bedrockDiscovery": {
            readonly label: "Bedrock Model Discovery";
            readonly help: "Automatic AWS Bedrock model discovery settings used to synthesize provider model entries from account visibility. Keep discovery scoped and refresh intervals conservative to reduce API churn.";
            readonly tags: ["models"];
        };
        readonly "models.bedrockDiscovery.enabled": {
            readonly label: "Bedrock Discovery Enabled";
            readonly help: "Enables periodic Bedrock model discovery and catalog refresh for Bedrock-backed providers. Keep disabled unless Bedrock is actively used and IAM permissions are correctly configured.";
            readonly tags: ["models"];
        };
        readonly "models.bedrockDiscovery.region": {
            readonly label: "Bedrock Discovery Region";
            readonly help: "AWS region used for Bedrock discovery calls when discovery is enabled for your deployment. Use the region where your Bedrock models are provisioned to avoid empty discovery results.";
            readonly tags: ["models"];
        };
        readonly "models.bedrockDiscovery.providerFilter": {
            readonly label: "Bedrock Discovery Provider Filter";
            readonly help: "Optional provider allowlist filter for Bedrock discovery so only selected providers are refreshed. Use this to limit discovery scope in multi-provider environments.";
            readonly tags: ["models"];
        };
        readonly "models.bedrockDiscovery.refreshInterval": {
            readonly label: "Bedrock Discovery Refresh Interval (s)";
            readonly help: "Refresh cadence for Bedrock discovery polling in seconds to detect newly available models over time. Use longer intervals in production to reduce API cost and control-plane noise.";
            readonly tags: ["performance", "models"];
        };
        readonly "models.bedrockDiscovery.defaultContextWindow": {
            readonly label: "Bedrock Default Context Window";
            readonly help: "Fallback context-window value applied to discovered models when provider metadata lacks explicit limits. Use realistic defaults to avoid oversized prompts that exceed true provider constraints.";
            readonly tags: ["models"];
        };
        readonly "models.bedrockDiscovery.defaultMaxTokens": {
            readonly label: "Bedrock Default Max Tokens";
            readonly help: "Fallback max-token value applied to discovered models without explicit output token limits. Use conservative defaults to reduce truncation surprises and unexpected token spend.";
            readonly tags: ["security", "auth", "performance", "models"];
        };
        readonly "auth.cooldowns.billingBackoffHours": {
            readonly label: "Billing Backoff (hours)";
            readonly help: "Base backoff (hours) when a profile fails due to billing/insufficient credits (default: 5).";
            readonly tags: ["auth", "access", "reliability"];
        };
        readonly "auth.cooldowns.billingBackoffHoursByProvider": {
            readonly label: "Billing Backoff Overrides";
            readonly help: "Optional per-provider overrides for billing backoff (hours).";
            readonly tags: ["auth", "access", "reliability"];
        };
        readonly "auth.cooldowns.billingMaxHours": {
            readonly label: "Billing Backoff Cap (hours)";
            readonly help: "Cap (hours) for billing backoff (default: 24).";
            readonly tags: ["auth", "access", "performance"];
        };
        readonly "auth.cooldowns.failureWindowHours": {
            readonly label: "Failover Window (hours)";
            readonly help: "Failure window (hours) for backoff counters (default: 24).";
            readonly tags: ["auth", "access"];
        };
        readonly "agents.defaults.models": {
            readonly label: "Models";
            readonly help: "Configured model catalog (keys are full provider/model IDs).";
            readonly tags: ["models"];
        };
        readonly "agents.defaults.model.primary": {
            readonly label: "Primary Model";
            readonly help: "Primary model (provider/model).";
            readonly tags: ["models"];
        };
        readonly "agents.defaults.model.fallbacks": {
            readonly label: "Model Fallbacks";
            readonly help: "Ordered fallback models (provider/model). Used when the primary model fails.";
            readonly tags: ["reliability", "models"];
        };
        readonly "agents.defaults.imageModel.primary": {
            readonly label: "Image Model";
            readonly help: "Optional image model (provider/model) used when the primary model lacks image input.";
            readonly tags: ["models", "media"];
        };
        readonly "agents.defaults.imageModel.fallbacks": {
            readonly label: "Image Model Fallbacks";
            readonly help: "Ordered fallback image models (provider/model).";
            readonly tags: ["reliability", "models", "media"];
        };
        readonly "agents.defaults.imageGenerationModel.primary": {
            readonly label: "Image Generation Model";
            readonly help: "Optional image-generation model (provider/model) used by the shared image generation capability.";
            readonly tags: ["media"];
        };
        readonly "agents.defaults.imageGenerationModel.fallbacks": {
            readonly label: "Image Generation Model Fallbacks";
            readonly help: "Ordered fallback image-generation models (provider/model).";
            readonly tags: ["reliability", "media"];
        };
        readonly "agents.defaults.pdfModel.primary": {
            readonly label: "PDF Model";
            readonly help: "Optional PDF model (provider/model) for the PDF analysis tool. Defaults to imageModel, then session model.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.pdfModel.fallbacks": {
            readonly label: "PDF Model Fallbacks";
            readonly help: "Ordered fallback PDF models (provider/model).";
            readonly tags: ["reliability"];
        };
        readonly "agents.defaults.pdfMaxBytesMb": {
            readonly label: "PDF Max Size (MB)";
            readonly help: "Maximum PDF file size in megabytes for the PDF tool (default: 10).";
            readonly tags: ["performance"];
        };
        readonly "agents.defaults.pdfMaxPages": {
            readonly label: "PDF Max Pages";
            readonly help: "Maximum number of PDF pages to process for the PDF tool (default: 20).";
            readonly tags: ["performance"];
        };
        readonly "agents.defaults.imageMaxDimensionPx": {
            readonly label: "Image Max Dimension (px)";
            readonly help: "Max image side length in pixels when sanitizing transcript/tool-result image payloads (default: 1200).";
            readonly tags: ["performance", "media"];
        };
        readonly "agents.defaults.humanDelay.mode": {
            readonly label: "Human Delay Mode";
            readonly help: "Delay style for block replies (\"off\", \"natural\", \"custom\").";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.humanDelay.minMs": {
            readonly label: "Human Delay Min (ms)";
            readonly help: "Minimum delay in ms for custom humanDelay (default: 800).";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.humanDelay.maxMs": {
            readonly label: "Human Delay Max (ms)";
            readonly help: "Maximum delay in ms for custom humanDelay (default: 2500).";
            readonly tags: ["performance"];
        };
        readonly "agents.defaults.cliBackends": {
            readonly label: "CLI Backends";
            readonly help: "Optional CLI backends for text-only fallback (claude-cli, etc.).";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.compaction": {
            readonly label: "Compaction";
            readonly help: "Compaction tuning for when context nears token limits, including history share, reserve headroom, and pre-compaction memory flush behavior. Use this when long-running sessions need stable continuity under tight context windows.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.compaction.mode": {
            readonly label: "Compaction Mode";
            readonly help: "Compaction strategy mode: \"default\" uses baseline behavior, while \"safeguard\" applies stricter guardrails to preserve recent context. Keep \"default\" unless you observe aggressive history loss near limit boundaries.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.compaction.reserveTokens": {
            readonly label: "Compaction Reserve Tokens";
            readonly help: "Token headroom reserved for reply generation and tool output after compaction runs. Use higher reserves for verbose/tool-heavy sessions, and lower reserves when maximizing retained history matters more.";
            readonly tags: ["security", "auth"];
        };
        readonly "agents.defaults.compaction.keepRecentTokens": {
            readonly label: "Compaction Keep Recent Tokens";
            readonly help: "Minimum token budget preserved from the most recent conversation window during compaction. Use higher values to protect immediate context continuity and lower values to keep more long-tail history.";
            readonly tags: ["security", "auth"];
        };
        readonly "agents.defaults.compaction.reserveTokensFloor": {
            readonly label: "Compaction Reserve Token Floor";
            readonly help: "Minimum floor enforced for reserveTokens in Pi compaction paths (0 disables the floor guard). Use a non-zero floor to avoid over-aggressive compression under fluctuating token estimates.";
            readonly tags: ["security", "auth"];
        };
        readonly "agents.defaults.compaction.maxHistoryShare": {
            readonly label: "Compaction Max History Share";
            readonly help: "Maximum fraction of total context budget allowed for retained history after compaction (range 0.1-0.9). Use lower shares for more generation headroom or higher shares for deeper historical continuity.";
            readonly tags: ["performance"];
        };
        readonly "agents.defaults.compaction.identifierPolicy": {
            readonly label: "Compaction Identifier Policy";
            readonly help: "Identifier-preservation policy for compaction summaries: \"strict\" prepends built-in opaque-identifier retention guidance (default), \"off\" disables this prefix, and \"custom\" uses identifierInstructions. Keep \"strict\" unless you have a specific compatibility need.";
            readonly tags: ["access"];
        };
        readonly "agents.defaults.compaction.identifierInstructions": {
            readonly label: "Compaction Identifier Instructions";
            readonly help: "Custom identifier-preservation instruction text used when identifierPolicy=\"custom\". Keep this explicit and safety-focused so compaction summaries do not rewrite opaque IDs, URLs, hosts, or ports.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.compaction.recentTurnsPreserve": {
            readonly label: "Compaction Preserve Recent Turns";
            readonly help: "Number of most recent user/assistant turns kept verbatim outside safeguard summarization (default: 3). Raise this to preserve exact recent dialogue context, or lower it to maximize compaction savings.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.compaction.qualityGuard": {
            readonly label: "Compaction Quality Guard";
            readonly help: "Optional quality-audit retry settings for safeguard compaction summaries. Leave this disabled unless you explicitly want summary audits and one-shot regeneration on failed checks.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.compaction.qualityGuard.enabled": {
            readonly label: "Compaction Quality Guard Enabled";
            readonly help: "Enables summary quality audits and regeneration retries for safeguard compaction. Default: false, so safeguard mode alone does not turn on retry behavior.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.compaction.qualityGuard.maxRetries": {
            readonly label: "Compaction Quality Guard Max Retries";
            readonly help: "Maximum number of regeneration retries after a failed safeguard summary quality audit. Use small values to bound extra latency and token cost.";
            readonly tags: ["performance"];
        };
        readonly "agents.defaults.compaction.postIndexSync": {
            readonly label: "Compaction Post-Index Sync";
            readonly help: "Controls post-compaction session memory reindex mode: \"off\", \"async\", or \"await\" (default: \"async\"). Use \"await\" for strongest freshness, \"async\" for lower compaction latency, and \"off\" only when session-memory sync is handled elsewhere.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.compaction.postCompactionSections": {
            readonly label: "Post-Compaction Context Sections";
            readonly help: "AGENTS.md H2/H3 section names re-injected after compaction so the agent reruns critical startup guidance. Leave unset to use \"Session Startup\"/\"Red Lines\" with legacy fallback to \"Every Session\"/\"Safety\"; set to [] to disable reinjection entirely.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.compaction.timeoutSeconds": {
            readonly label: "Compaction Timeout (Seconds)";
            readonly help: "Maximum time in seconds allowed for a single compaction operation before it is aborted (default: 900). Increase this for very large sessions that need more time to summarize, or decrease it to fail faster on unresponsive models.";
            readonly tags: ["performance"];
        };
        readonly "agents.defaults.compaction.model": {
            readonly label: "Compaction Model Override";
            readonly help: "Optional provider/model override used only for compaction summarization. Set this when you want compaction to run on a different model than the session default, and leave it unset to keep using the primary agent model.";
            readonly tags: ["models"];
        };
        readonly "agents.defaults.compaction.truncateAfterCompaction": {
            readonly label: "Truncate After Compaction";
            readonly help: "When enabled, rewrites the session JSONL file after compaction to remove entries that were summarized. Prevents unbounded file growth in long-running sessions with many compaction cycles. Default: false.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.compaction.memoryFlush": {
            readonly label: "Compaction Memory Flush";
            readonly help: "Pre-compaction memory flush settings that run an agentic memory write before heavy compaction. Keep enabled for long sessions so salient context is persisted before aggressive trimming.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.compaction.memoryFlush.enabled": {
            readonly label: "Compaction Memory Flush Enabled";
            readonly help: "Enables pre-compaction memory flush before the runtime performs stronger history reduction near token limits. Keep enabled unless you intentionally disable memory side effects in constrained environments.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.compaction.memoryFlush.softThresholdTokens": {
            readonly label: "Compaction Memory Flush Soft Threshold";
            readonly help: "Threshold distance to compaction (in tokens) that triggers pre-compaction memory flush execution. Use earlier thresholds for safer persistence, or tighter thresholds for lower flush frequency.";
            readonly tags: ["security", "auth"];
        };
        readonly "agents.defaults.compaction.memoryFlush.forceFlushTranscriptBytes": {
            readonly label: "Compaction Memory Flush Transcript Size Threshold";
            readonly help: "Forces pre-compaction memory flush when transcript file size reaches this threshold (bytes or strings like \"2mb\"). Use this to prevent long-session hangs even when token counters are stale; set to 0 to disable.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.compaction.memoryFlush.prompt": {
            readonly label: "Compaction Memory Flush Prompt";
            readonly help: "User-prompt template used for the pre-compaction memory flush turn when generating memory candidates. Use this only when you need custom extraction instructions beyond the default memory flush behavior.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.compaction.memoryFlush.systemPrompt": {
            readonly label: "Compaction Memory Flush System Prompt";
            readonly help: "System-prompt override for the pre-compaction memory flush turn to control extraction style and safety constraints. Use carefully so custom instructions do not reduce memory quality or leak sensitive context.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.embeddedPi": {
            readonly label: "Embedded Pi";
            readonly help: "Embedded Pi runner hardening controls for how workspace-local Pi settings are trusted and applied in OpenClaw sessions.";
            readonly tags: ["advanced"];
        };
        readonly "agents.defaults.embeddedPi.projectSettingsPolicy": {
            readonly label: "Embedded Pi Project Settings Policy";
            readonly help: "How embedded Pi handles workspace-local `.pi/config/settings.json`: \"sanitize\" (default) strips shellPath/shellCommandPrefix, \"ignore\" disables project settings entirely, and \"trusted\" applies project settings as-is.";
            readonly tags: ["access"];
        };
        readonly "agents.defaults.heartbeat.directPolicy": {
            readonly label: "Heartbeat Direct Policy";
            readonly help: "Controls whether heartbeat delivery may target direct/DM chats: \"allow\" (default) permits DM delivery and \"block\" suppresses direct-target sends.";
            readonly tags: ["access", "storage", "automation"];
        };
        readonly "agents.list.*.heartbeat.directPolicy": {
            readonly label: "Heartbeat Direct Policy";
            readonly help: "Per-agent override for heartbeat direct/DM delivery policy; use \"block\" for agents that should only send heartbeat alerts to non-DM destinations.";
            readonly tags: ["access", "storage", "automation"];
        };
        readonly "agents.defaults.heartbeat.suppressToolErrorWarnings": {
            readonly label: "Heartbeat Suppress Tool Error Warnings";
            readonly help: "Suppress tool error warning payloads during heartbeat runs.";
            readonly tags: ["automation"];
        };
        readonly "agents.defaults.sandbox.browser.network": {
            readonly label: "Sandbox Browser Network";
            readonly help: "Docker network for sandbox browser containers (default: openclaw-sandbox-browser). Avoid bridge if you need stricter isolation.";
            readonly tags: ["storage"];
        };
        readonly "agents.defaults.sandbox.browser.cdpSourceRange": {
            readonly label: "Sandbox Browser CDP Source Port Range";
            readonly help: "Optional CIDR allowlist for container-edge CDP ingress (for example 172.21.0.1/32).";
            readonly tags: ["storage"];
        };
        readonly "agents.defaults.sandbox.docker.dangerouslyAllowContainerNamespaceJoin": {
            readonly label: "Sandbox Docker Allow Container Namespace Join";
            readonly help: "DANGEROUS break-glass override that allows sandbox Docker network mode container:<id>. This joins another container namespace and weakens sandbox isolation.";
            readonly tags: ["security", "access", "storage", "advanced"];
        };
        readonly "commands.native": {
            readonly label: "Native Commands";
            readonly help: "Registers native slash/menu commands with channels that support command registration (Discord, Slack, Telegram). Keep enabled for discoverability unless you intentionally run text-only command workflows.";
            readonly tags: ["advanced"];
        };
        readonly "commands.nativeSkills": {
            readonly label: "Native Skill Commands";
            readonly help: "Registers native skill commands so users can invoke skills directly from provider command menus where supported. Keep aligned with your skill policy so exposed commands match what operators expect.";
            readonly tags: ["advanced"];
        };
        readonly "commands.text": {
            readonly label: "Text Commands";
            readonly help: "Enables text-command parsing in chat input in addition to native command surfaces where available. Keep this enabled for compatibility across channels that do not support native command registration.";
            readonly tags: ["advanced"];
        };
        readonly "commands.bash": {
            readonly label: "Allow Bash Chat Command";
            readonly help: "Allow bash chat command (`!`; `/bash` alias) to run host shell commands (default: false; requires tools.elevated).";
            readonly tags: ["advanced"];
        };
        readonly "commands.bashForegroundMs": {
            readonly label: "Bash Foreground Window (ms)";
            readonly help: "How long bash waits before backgrounding (default: 2000; 0 backgrounds immediately).";
            readonly tags: ["advanced"];
        };
        readonly "commands.config": {
            readonly label: "Allow /config";
            readonly help: "Allow /config chat command to read/write config on disk (default: false).";
            readonly tags: ["advanced"];
        };
        readonly "commands.mcp": {
            readonly label: "Allow /mcp";
            readonly help: "Allow /mcp chat command to manage OpenClaw MCP server config under mcp.servers (default: false).";
            readonly tags: ["advanced"];
        };
        readonly "commands.plugins": {
            readonly label: "Allow /plugins";
            readonly help: "Allow /plugins chat command to list discovered plugins and toggle plugin enablement in config (default: false).";
            readonly tags: ["advanced"];
        };
        readonly "commands.debug": {
            readonly label: "Allow /debug";
            readonly help: "Allow /debug chat command for runtime-only overrides (default: false).";
            readonly tags: ["advanced"];
        };
        readonly "commands.restart": {
            readonly label: "Allow Restart";
            readonly help: "Allow /restart and gateway restart tool actions (default: true).";
            readonly tags: ["advanced"];
        };
        readonly "commands.useAccessGroups": {
            readonly label: "Use Access Groups";
            readonly help: "Enforce access-group allowlists/policies for commands.";
            readonly tags: ["access"];
        };
        readonly "commands.ownerAllowFrom": {
            readonly label: "Command Owners";
            readonly help: "Explicit owner allowlist for owner-only tools/commands. Use channel-native IDs (optionally prefixed like \"whatsapp:+15551234567\"). '*' is ignored.";
            readonly tags: ["access"];
        };
        readonly "commands.ownerDisplay": {
            readonly label: "Owner ID Display";
            readonly help: "Controls how owner IDs are rendered in the system prompt. Allowed values: raw, hash. Default: raw.";
            readonly tags: ["access"];
        };
        readonly "commands.ownerDisplaySecret": {
            readonly label: "Owner ID Hash Secret";
            readonly help: "Optional secret used to HMAC hash owner IDs when ownerDisplay=hash. Prefer env substitution.";
            readonly tags: ["security", "auth", "access"];
            readonly sensitive: true;
        };
        readonly "commands.allowFrom": {
            readonly label: "Command Elevated Access Rules";
            readonly help: "Defines elevated command allow rules by channel and sender for owner-level command surfaces. Use narrow provider-specific identities so privileged commands are not exposed to broad chat audiences.";
            readonly tags: ["access"];
        };
        readonly mcp: {
            readonly label: "MCP";
            readonly help: "Global MCP server definitions managed by OpenClaw. Embedded Pi and other runtime adapters can consume these servers without storing them inside Pi-owned project settings.";
            readonly tags: ["advanced"];
        };
        readonly "mcp.servers": {
            readonly label: "MCP Servers";
            readonly help: "Named MCP server definitions. OpenClaw stores them in its own config and runtime adapters decide which transports are supported at execution time.";
            readonly tags: ["advanced"];
        };
        readonly "ui.seamColor": {
            readonly label: "Accent Color";
            readonly help: "Primary accent color used by UI surfaces for emphasis, badges, and visual identity cues. Use high-contrast values that remain readable across light/dark themes.";
            readonly tags: ["advanced"];
        };
        readonly "ui.assistant": {
            readonly label: "Assistant Appearance";
            readonly help: "Assistant display identity settings for name and avatar shown in UI surfaces. Keep these values aligned with your operator-facing persona and support expectations.";
            readonly tags: ["advanced"];
        };
        readonly "ui.assistant.name": {
            readonly label: "Assistant Name";
            readonly help: "Display name shown for the assistant in UI views, chat chrome, and status contexts. Keep this stable so operators can reliably identify which assistant persona is active.";
            readonly tags: ["advanced"];
        };
        readonly "ui.assistant.avatar": {
            readonly label: "Assistant Avatar";
            readonly help: "Assistant avatar image source used in UI surfaces (URL, path, or data URI depending on runtime support). Use trusted assets and consistent branding dimensions for clean rendering.";
            readonly tags: ["advanced"];
        };
        readonly "browser.evaluateEnabled": {
            readonly label: "Browser Evaluate Enabled";
            readonly help: "Enables browser-side evaluate helpers for runtime script evaluation capabilities where supported. Keep disabled unless your workflows require evaluate semantics beyond snapshots/navigation.";
            readonly tags: ["advanced"];
        };
        readonly "browser.snapshotDefaults": {
            readonly label: "Browser Snapshot Defaults";
            readonly help: "Default snapshot capture configuration used when callers do not provide explicit snapshot options. Tune this for consistent capture behavior across channels and automation paths.";
            readonly tags: ["advanced"];
        };
        readonly "browser.snapshotDefaults.mode": {
            readonly label: "Browser Snapshot Mode";
            readonly help: "Default snapshot extraction mode controlling how page content is transformed for agent consumption. Choose the mode that balances readability, fidelity, and token footprint for your workflows.";
            readonly tags: ["advanced"];
        };
        readonly "browser.ssrfPolicy": {
            readonly label: "Browser SSRF Policy";
            readonly help: "Server-side request forgery guardrail settings for browser/network fetch paths that could reach internal hosts. Keep restrictive defaults in production and open only explicitly approved targets.";
            readonly tags: ["access"];
        };
        readonly "browser.ssrfPolicy.allowPrivateNetwork": {
            readonly label: "Browser Allow Private Network";
            readonly help: "Legacy alias for browser.ssrfPolicy.dangerouslyAllowPrivateNetwork. Prefer the dangerously-named key so risk intent is explicit.";
            readonly tags: ["access"];
        };
        readonly "browser.ssrfPolicy.dangerouslyAllowPrivateNetwork": {
            readonly label: "Browser Dangerously Allow Private Network";
            readonly help: "Allows access to private-network address ranges from browser tooling. Default is enabled for trusted-network operator setups; disable to enforce strict public-only resolution checks.";
            readonly tags: ["security", "access", "advanced"];
        };
        readonly "browser.ssrfPolicy.allowedHostnames": {
            readonly label: "Browser Allowed Hostnames";
            readonly help: "Explicit hostname allowlist exceptions for SSRF policy checks on browser/network requests. Keep this list minimal and review entries regularly to avoid stale broad access.";
            readonly tags: ["access"];
        };
        readonly "browser.ssrfPolicy.hostnameAllowlist": {
            readonly label: "Browser Hostname Allowlist";
            readonly help: "Legacy/alternate hostname allowlist field used by SSRF policy consumers for explicit host exceptions. Use stable exact hostnames and avoid wildcard-like broad patterns.";
            readonly tags: ["access"];
        };
        readonly "browser.remoteCdpTimeoutMs": {
            readonly label: "Remote CDP Timeout (ms)";
            readonly help: "Timeout in milliseconds for connecting to a remote CDP endpoint before failing the browser attach attempt. Increase for high-latency tunnels, or lower for faster failure detection.";
            readonly tags: ["performance"];
        };
        readonly "browser.remoteCdpHandshakeTimeoutMs": {
            readonly label: "Remote CDP Handshake Timeout (ms)";
            readonly help: "Timeout in milliseconds for post-connect CDP handshake readiness checks against remote browser targets. Raise this for slow-start remote browsers and lower to fail fast in automation loops.";
            readonly tags: ["performance"];
        };
        readonly "session.scope": {
            readonly label: "Session Scope";
            readonly help: "Sets base session grouping strategy: \"per-sender\" isolates by sender and \"global\" shares one session per channel context. Keep \"per-sender\" for safer multi-user behavior unless deliberate shared context is required.";
            readonly tags: ["storage"];
        };
        readonly "session.dmScope": {
            readonly label: "DM Session Scope";
            readonly help: "DM session scoping: \"main\" keeps continuity, while \"per-peer\", \"per-channel-peer\", and \"per-account-channel-peer\" increase isolation. Use isolated modes for shared inboxes or multi-account deployments.";
            readonly tags: ["storage"];
        };
        readonly "session.identityLinks": {
            readonly label: "Session Identity Links";
            readonly help: "Maps canonical identities to provider-prefixed peer IDs so equivalent users resolve to one DM thread (example: telegram:123456). Use this when the same human appears across multiple channels or accounts.";
            readonly tags: ["storage"];
        };
        readonly "session.resetTriggers": {
            readonly label: "Session Reset Triggers";
            readonly help: "Lists message triggers that force a session reset when matched in inbound content. Use sparingly for explicit reset phrases so context is not dropped unexpectedly during normal conversation.";
            readonly tags: ["storage"];
        };
        readonly "session.idleMinutes": {
            readonly label: "Session Idle Minutes";
            readonly help: "Applies a legacy idle reset window in minutes for session reuse behavior across inactivity gaps. Use this only for compatibility and prefer structured reset policies under session.reset/session.resetByType.";
            readonly tags: ["storage"];
        };
        readonly "session.reset": {
            readonly label: "Session Reset Policy";
            readonly help: "Defines the default reset policy object used when no type-specific or channel-specific override applies. Set this first, then layer resetByType or resetByChannel only where behavior must differ.";
            readonly tags: ["storage"];
        };
        readonly "session.reset.mode": {
            readonly label: "Session Reset Mode";
            readonly help: "Selects reset strategy: \"daily\" resets at a configured hour and \"idle\" resets after inactivity windows. Keep one clear mode per policy to avoid surprising context turnover patterns.";
            readonly tags: ["storage"];
        };
        readonly "session.reset.atHour": {
            readonly label: "Session Daily Reset Hour";
            readonly help: "Sets local-hour boundary (0-23) for daily reset mode so sessions roll over at predictable times. Use with mode=daily and align to operator timezone expectations for human-readable behavior.";
            readonly tags: ["storage"];
        };
        readonly "session.reset.idleMinutes": {
            readonly label: "Session Reset Idle Minutes";
            readonly help: "Sets inactivity window before reset for idle mode and can also act as secondary guard with daily mode. Use larger values to preserve continuity or smaller values for fresher short-lived threads.";
            readonly tags: ["storage"];
        };
        readonly "session.resetByType": {
            readonly label: "Session Reset by Chat Type";
            readonly help: "Overrides reset behavior by chat type (direct, group, thread) when defaults are not sufficient. Use this when group/thread traffic needs different reset cadence than direct messages.";
            readonly tags: ["storage"];
        };
        readonly "session.resetByType.direct": {
            readonly label: "Session Reset (Direct)";
            readonly help: "Defines reset policy for direct chats and supersedes the base session.reset configuration for that type. Use this as the canonical direct-message override instead of the legacy dm alias.";
            readonly tags: ["storage"];
        };
        readonly "session.resetByType.dm": {
            readonly label: "Session Reset (DM Deprecated Alias)";
            readonly help: "Deprecated alias for direct reset behavior kept for backward compatibility with older configs. Use session.resetByType.direct instead so future tooling and validation remain consistent.";
            readonly tags: ["storage"];
        };
        readonly "session.resetByType.group": {
            readonly label: "Session Reset (Group)";
            readonly help: "Defines reset policy for group chat sessions where continuity and noise patterns differ from DMs. Use shorter idle windows for busy groups if context drift becomes a problem.";
            readonly tags: ["storage"];
        };
        readonly "session.resetByType.thread": {
            readonly label: "Session Reset (Thread)";
            readonly help: "Defines reset policy for thread-scoped sessions, including focused channel thread workflows. Use this when thread sessions should expire faster or slower than other chat types.";
            readonly tags: ["storage"];
        };
        readonly "session.resetByChannel": {
            readonly label: "Session Reset by Channel";
            readonly help: "Provides channel-specific reset overrides keyed by provider/channel id for fine-grained behavior control. Use this only when one channel needs exceptional reset behavior beyond type-level policies.";
            readonly tags: ["storage"];
        };
        readonly "session.store": {
            readonly label: "Session Store Path";
            readonly help: "Sets the session storage file path used to persist session records across restarts. Use an explicit path only when you need custom disk layout, backup routing, or mounted-volume storage.";
            readonly tags: ["storage"];
        };
        readonly "session.typingIntervalSeconds": {
            readonly label: "Session Typing Interval (seconds)";
            readonly help: "Controls interval for repeated typing indicators while replies are being prepared in typing-capable channels. Increase to reduce chatty updates or decrease for more active typing feedback.";
            readonly tags: ["performance", "storage"];
        };
        readonly "session.typingMode": {
            readonly label: "Session Typing Mode";
            readonly help: "Controls typing behavior timing: \"never\", \"instant\", \"thinking\", or \"message\" based emission points. Keep conservative modes in high-volume channels to avoid unnecessary typing noise.";
            readonly tags: ["storage"];
        };
        readonly "session.parentForkMaxTokens": {
            readonly label: "Session Parent Fork Max Tokens";
            readonly help: "Maximum parent-session token count allowed for thread/session inheritance forking. If the parent exceeds this, OpenClaw starts a fresh thread session instead of forking; set 0 to disable this protection.";
            readonly tags: ["security", "auth", "performance", "storage"];
        };
        readonly "session.mainKey": {
            readonly label: "Session Main Key";
            readonly help: "Overrides the canonical main session key used for continuity when dmScope or routing logic points to \"main\". Use a stable value only if you intentionally need custom session anchoring.";
            readonly tags: ["storage"];
        };
        readonly "session.sendPolicy": {
            readonly label: "Session Send Policy";
            readonly help: "Controls cross-session send permissions using allow/deny rules evaluated against channel, chatType, and key prefixes. Use this to fence where session tools can deliver messages in complex environments.";
            readonly tags: ["access", "storage"];
        };
        readonly "session.sendPolicy.default": {
            readonly label: "Session Send Policy Default Action";
            readonly help: "Sets fallback action when no sendPolicy rule matches: \"allow\" or \"deny\". Keep \"allow\" for simpler setups, or choose \"deny\" when you require explicit allow rules for every destination.";
            readonly tags: ["access", "storage"];
        };
        readonly "session.sendPolicy.rules": {
            readonly label: "Session Send Policy Rules";
            readonly help: "Ordered allow/deny rules evaluated before the default action, for example `{ action: \"deny\", match: { channel: \"discord\" } }`. Put most specific rules first so broad rules do not shadow exceptions.";
            readonly tags: ["access", "storage"];
        };
        readonly "session.sendPolicy.rules[].action": {
            readonly label: "Session Send Rule Action";
            readonly help: "Defines rule decision as \"allow\" or \"deny\" when the corresponding match criteria are satisfied. Use deny-first ordering when enforcing strict boundaries with explicit allow exceptions.";
            readonly tags: ["access", "storage"];
        };
        readonly "session.sendPolicy.rules[].match": {
            readonly label: "Session Send Rule Match";
            readonly help: "Defines optional rule match conditions that can combine channel, chatType, and key-prefix constraints. Keep matches narrow so policy intent stays readable and debugging remains straightforward.";
            readonly tags: ["access", "storage"];
        };
        readonly "session.sendPolicy.rules[].match.channel": {
            readonly label: "Session Send Rule Channel";
            readonly help: "Matches rule application to a specific channel/provider id (for example discord, telegram, slack). Use this when one channel should permit or deny delivery independently of others.";
            readonly tags: ["access", "storage"];
        };
        readonly "session.sendPolicy.rules[].match.chatType": {
            readonly label: "Session Send Rule Chat Type";
            readonly help: "Matches rule application to chat type (direct, group, thread) so behavior varies by conversation form. Use this when DM and group destinations require different safety boundaries.";
            readonly tags: ["access", "storage"];
        };
        readonly "session.sendPolicy.rules[].match.keyPrefix": {
            readonly label: "Session Send Rule Key Prefix";
            readonly help: "Matches a normalized session-key prefix after internal key normalization steps in policy consumers. Use this for general prefix controls, and prefer rawKeyPrefix when exact full-key matching is required.";
            readonly tags: ["access", "storage"];
        };
        readonly "session.sendPolicy.rules[].match.rawKeyPrefix": {
            readonly label: "Session Send Rule Raw Key Prefix";
            readonly help: "Matches the raw, unnormalized session-key prefix for exact full-key policy targeting. Use this when normalized keyPrefix is too broad and you need agent-prefixed or transport-specific precision.";
            readonly tags: ["access", "storage"];
        };
        readonly "session.agentToAgent": {
            readonly label: "Session Agent-to-Agent";
            readonly help: "Groups controls for inter-agent session exchanges, including loop prevention limits on reply chaining. Keep defaults unless you run advanced agent-to-agent automation with strict turn caps.";
            readonly tags: ["storage"];
        };
        readonly "session.agentToAgent.maxPingPongTurns": {
            readonly label: "Agent-to-Agent Ping-Pong Turns";
            readonly help: "Max reply-back turns between requester and target agents during agent-to-agent exchanges (0-5). Use lower values to hard-limit chatter loops and preserve predictable run completion.";
            readonly tags: ["performance", "storage"];
        };
        readonly "session.threadBindings": {
            readonly label: "Session Thread Bindings";
            readonly help: "Shared defaults for thread-bound session routing behavior across providers that support thread focus workflows. Configure global defaults here and override per channel only when behavior differs.";
            readonly tags: ["storage"];
        };
        readonly "session.threadBindings.enabled": {
            readonly label: "Thread Binding Enabled";
            readonly help: "Global master switch for thread-bound session routing features and focused thread delivery behavior. Keep enabled for modern thread workflows unless you need to disable thread binding globally.";
            readonly tags: ["storage"];
        };
        readonly "session.threadBindings.idleHours": {
            readonly label: "Thread Binding Idle Timeout (hours)";
            readonly help: "Default inactivity window in hours for thread-bound sessions across providers/channels (0 disables idle auto-unfocus). Default: 24.";
            readonly tags: ["storage"];
        };
        readonly "session.threadBindings.maxAgeHours": {
            readonly label: "Thread Binding Max Age (hours)";
            readonly help: "Optional hard max age in hours for thread-bound sessions across providers/channels (0 disables hard cap). Default: 0.";
            readonly tags: ["performance", "storage"];
        };
        readonly "session.maintenance": {
            readonly label: "Session Maintenance";
            readonly help: "Automatic session-store maintenance controls for pruning age, entry caps, and file rotation behavior. Start in warn mode to observe impact, then enforce once thresholds are tuned.";
            readonly tags: ["storage"];
        };
        readonly "session.maintenance.mode": {
            readonly label: "Session Maintenance Mode";
            readonly help: "Determines whether maintenance policies are only reported (\"warn\") or actively applied (\"enforce\"). Keep \"warn\" during rollout and switch to \"enforce\" after validating safe thresholds.";
            readonly tags: ["storage"];
        };
        readonly "session.maintenance.pruneAfter": {
            readonly label: "Session Prune After";
            readonly help: "Removes entries older than this duration (for example `30d` or `12h`) during maintenance passes. Use this as the primary age-retention control and align it with data retention policy.";
            readonly tags: ["storage"];
        };
        readonly "session.maintenance.pruneDays": {
            readonly label: "Session Prune Days (Deprecated)";
            readonly help: "Deprecated age-retention field kept for compatibility with legacy configs using day counts. Use session.maintenance.pruneAfter instead so duration syntax and behavior are consistent.";
            readonly tags: ["storage"];
        };
        readonly "session.maintenance.maxEntries": {
            readonly label: "Session Max Entries";
            readonly help: "Caps total session entry count retained in the store to prevent unbounded growth over time. Use lower limits for constrained environments, or higher limits when longer history is required.";
            readonly tags: ["performance", "storage"];
        };
        readonly "session.maintenance.rotateBytes": {
            readonly label: "Session Rotate Size";
            readonly help: "Rotates the session store when file size exceeds a threshold such as `10mb` or `1gb`. Use this to bound single-file growth and keep backup/restore operations manageable.";
            readonly tags: ["storage"];
        };
        readonly "session.maintenance.resetArchiveRetention": {
            readonly label: "Session Reset Archive Retention";
            readonly help: "Retention for reset transcript archives (`*.reset.<timestamp>`). Accepts a duration (for example `30d`), or `false` to disable cleanup. Defaults to pruneAfter so reset artifacts do not grow forever.";
            readonly tags: ["storage"];
        };
        readonly "session.maintenance.maxDiskBytes": {
            readonly label: "Session Max Disk Budget";
            readonly help: "Optional per-agent sessions-directory disk budget (for example `500mb`). Use this to cap session storage per agent; when exceeded, warn mode reports pressure and enforce mode performs oldest-first cleanup.";
            readonly tags: ["performance", "storage"];
        };
        readonly "session.maintenance.highWaterBytes": {
            readonly label: "Session Disk High-water Target";
            readonly help: "Target size after disk-budget cleanup (high-water mark). Defaults to 80% of maxDiskBytes; set explicitly for tighter reclaim behavior on constrained disks.";
            readonly tags: ["storage"];
        };
        readonly "cron.enabled": {
            readonly label: "Cron Enabled";
            readonly help: "Enables cron job execution for stored schedules managed by the gateway. Keep enabled for normal reminder/automation flows, and disable only to pause all cron execution without deleting jobs.";
            readonly tags: ["automation"];
        };
        readonly "cron.store": {
            readonly label: "Cron Store Path";
            readonly help: "Path to the cron job store file used to persist scheduled jobs across restarts. Set an explicit path only when you need custom storage layout, backups, or mounted volumes.";
            readonly tags: ["storage", "automation"];
        };
        readonly "cron.maxConcurrentRuns": {
            readonly label: "Cron Max Concurrent Runs";
            readonly help: "Limits how many cron jobs can execute at the same time when multiple schedules fire together. Use lower values to protect CPU/memory under heavy automation load, or raise carefully for higher throughput.";
            readonly tags: ["performance", "automation"];
        };
        readonly "cron.retry": {
            readonly label: "Cron Retry Policy";
            readonly help: "Overrides the default retry policy for one-shot jobs when they fail with transient errors (rate limit, overloaded, network, server_error). Omit to use defaults: maxAttempts 3, backoffMs [30000, 60000, 300000], retry all transient types.";
            readonly tags: ["reliability", "automation"];
        };
        readonly "cron.retry.maxAttempts": {
            readonly label: "Cron Retry Max Attempts";
            readonly help: "Max retries for one-shot jobs on transient errors before permanent disable (default: 3).";
            readonly tags: ["reliability", "performance", "automation"];
        };
        readonly "cron.retry.backoffMs": {
            readonly label: "Cron Retry Backoff (ms)";
            readonly help: "Backoff delays in ms for each retry attempt (default: [30000, 60000, 300000]). Use shorter values for faster retries.";
            readonly tags: ["reliability", "automation"];
        };
        readonly "cron.retry.retryOn": {
            readonly label: "Cron Retry Error Types";
            readonly help: "Error types to retry: rate_limit, overloaded, network, timeout, server_error. Use to restrict which errors trigger retries; omit to retry all transient types.";
            readonly tags: ["reliability", "automation"];
        };
        readonly "cron.webhook": {
            readonly label: "Cron Legacy Webhook (Deprecated)";
            readonly help: "Deprecated legacy fallback webhook URL used only for old jobs with `notify=true`. Migrate to per-job delivery using `delivery.mode=\"webhook\"` plus `delivery.to`, and avoid relying on this global field.";
            readonly tags: ["automation"];
        };
        readonly "cron.webhookToken": {
            readonly label: "Cron Webhook Bearer Token";
            readonly help: "Bearer token attached to cron webhook POST deliveries when webhook mode is used. Prefer secret/env substitution and rotate this token regularly if shared webhook endpoints are internet-reachable.";
            readonly tags: ["security", "auth", "automation"];
            readonly sensitive: true;
        };
        readonly "cron.sessionRetention": {
            readonly label: "Cron Session Retention";
            readonly help: "Controls how long completed cron run sessions are kept before pruning (`24h`, `7d`, `1h30m`, or `false` to disable pruning; default: `24h`). Use shorter retention to reduce storage growth on high-frequency schedules.";
            readonly tags: ["storage", "automation"];
        };
        readonly "cron.runLog": {
            readonly label: "Cron Run Log Pruning";
            readonly help: "Pruning controls for per-job cron run history files under `cron/runs/<jobId>.jsonl`, including size and line retention.";
            readonly tags: ["automation"];
        };
        readonly "cron.runLog.maxBytes": {
            readonly label: "Cron Run Log Max Bytes";
            readonly help: "Maximum bytes per cron run-log file before pruning rewrites to the last keepLines entries (for example `2mb`, default `2000000`).";
            readonly tags: ["performance", "automation"];
        };
        readonly "cron.runLog.keepLines": {
            readonly label: "Cron Run Log Keep Lines";
            readonly help: "How many trailing run-log lines to retain when a file exceeds maxBytes (default `2000`). Increase for longer forensic history or lower for smaller disks.";
            readonly tags: ["automation"];
        };
        readonly "hooks.enabled": {
            readonly label: "Hooks Enabled";
            readonly help: "Enables the hooks endpoint and mapping execution pipeline for inbound webhook requests. Keep disabled unless you are actively routing external events into the gateway.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.path": {
            readonly label: "Hooks Endpoint Path";
            readonly help: "HTTP path used by the hooks endpoint (for example `/hooks`) on the gateway control server. Use a non-guessable path and combine it with token validation for defense in depth.";
            readonly tags: ["storage"];
        };
        readonly "hooks.token": {
            readonly label: "Hooks Auth Token";
            readonly help: "Shared bearer token checked by hooks ingress for request authentication before mappings run. Treat holders as full-trust callers for the hook ingress surface, not as a separate non-owner role. Use environment substitution and rotate regularly when webhook endpoints are internet-accessible.";
            readonly tags: ["security", "auth"];
            readonly sensitive: true;
        };
        readonly "hooks.defaultSessionKey": {
            readonly label: "Hooks Default Session Key";
            readonly help: "Fallback session key used for hook deliveries when a request does not provide one through allowed channels. Use a stable but scoped key to avoid mixing unrelated automation conversations.";
            readonly tags: ["storage"];
        };
        readonly "hooks.allowRequestSessionKey": {
            readonly label: "Hooks Allow Request Session Key";
            readonly help: "Allows callers to supply a session key in hook requests when true, enabling caller-controlled routing. Keep false unless trusted integrators explicitly need custom session threading.";
            readonly tags: ["access", "storage"];
        };
        readonly "hooks.allowedSessionKeyPrefixes": {
            readonly label: "Hooks Allowed Session Key Prefixes";
            readonly help: "Allowlist of accepted session-key prefixes for inbound hook requests when caller-provided keys are enabled. Use narrow prefixes to prevent arbitrary session-key injection.";
            readonly tags: ["access", "storage"];
        };
        readonly "hooks.allowedAgentIds": {
            readonly label: "Hooks Allowed Agent IDs";
            readonly help: "Allowlist of agent IDs that hook mappings are allowed to target when selecting execution agents. Use this to constrain automation events to dedicated service agents and reduce blast radius if a hook token is exposed.";
            readonly tags: ["access"];
        };
        readonly "hooks.maxBodyBytes": {
            readonly label: "Hooks Max Body Bytes";
            readonly help: "Maximum accepted webhook payload size in bytes before the request is rejected. Keep this bounded to reduce abuse risk and protect memory usage under bursty integrations.";
            readonly tags: ["performance"];
        };
        readonly "hooks.presets": {
            readonly label: "Hooks Presets";
            readonly help: "Named hook preset bundles applied at load time to seed standard mappings and behavior defaults. Keep preset usage explicit so operators can audit which automations are active.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.transformsDir": {
            readonly label: "Hooks Transforms Directory";
            readonly help: "Base directory for hook transform modules referenced by mapping transform.module paths. Use a controlled repo directory so dynamic imports remain reviewable and predictable.";
            readonly tags: ["storage"];
        };
        readonly "hooks.mappings": {
            readonly label: "Hook Mappings";
            readonly help: "Ordered mapping rules that match inbound hook requests and choose wake or agent actions with optional delivery routing. Use specific mappings first to avoid broad pattern rules capturing everything.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].id": {
            readonly label: "Hook Mapping ID";
            readonly help: "Optional stable identifier for a hook mapping entry used for auditing, troubleshooting, and targeted updates. Use unique IDs so logs and config diffs can reference mappings unambiguously.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].match": {
            readonly label: "Hook Mapping Match";
            readonly help: "Grouping object for mapping match predicates such as path and source before action routing is applied. Keep match criteria specific so unrelated webhook traffic does not trigger automations.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].match.path": {
            readonly label: "Hook Mapping Match Path";
            readonly help: "Path match condition for a hook mapping, usually compared against the inbound request path. Use this to split automation behavior by webhook endpoint path families.";
            readonly tags: ["storage"];
        };
        readonly "hooks.mappings[].match.source": {
            readonly label: "Hook Mapping Match Source";
            readonly help: "Source match condition for a hook mapping, typically set by trusted upstream metadata or adapter logic. Use stable source identifiers so routing remains deterministic across retries.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].action": {
            readonly label: "Hook Mapping Action";
            readonly help: "Mapping action type: \"wake\" triggers agent wake flow, while \"agent\" sends directly to agent handling. Use \"agent\" for immediate execution and \"wake\" when heartbeat-driven processing is preferred.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].wakeMode": {
            readonly label: "Hook Mapping Wake Mode";
            readonly help: "Wake scheduling mode: \"now\" wakes immediately, while \"next-heartbeat\" defers until the next heartbeat cycle. Use deferred mode for lower-priority automations that can tolerate slight delay.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].name": {
            readonly label: "Hook Mapping Name";
            readonly help: "Human-readable mapping display name used in diagnostics and operator-facing config UIs. Keep names concise and descriptive so routing intent is obvious during incident review.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].agentId": {
            readonly label: "Hook Mapping Agent ID";
            readonly help: "Target agent ID for mapping execution when action routing should not use defaults. Use dedicated automation agents to isolate webhook behavior from interactive operator sessions.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].sessionKey": {
            readonly label: "Hook Mapping Session Key";
            readonly help: "Explicit session key override for mapping-delivered messages to control thread continuity. Use stable scoped keys so repeated events correlate without leaking into unrelated conversations.";
            readonly tags: ["security", "storage"];
            readonly sensitive: true;
        };
        readonly "hooks.mappings[].messageTemplate": {
            readonly label: "Hook Mapping Message Template";
            readonly help: "Template for synthesizing structured mapping input into the final message content sent to the target action path. Keep templates deterministic so downstream parsing and behavior remain stable.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].textTemplate": {
            readonly label: "Hook Mapping Text Template";
            readonly help: "Text-only fallback template used when rich payload rendering is not desired or not supported. Use this to provide a concise, consistent summary string for chat delivery surfaces.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].deliver": {
            readonly label: "Hook Mapping Deliver Reply";
            readonly help: "Controls whether mapping execution results are delivered back to a channel destination versus being processed silently. Disable delivery for background automations that should not post user-facing output.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].allowUnsafeExternalContent": {
            readonly label: "Hook Mapping Allow Unsafe External Content";
            readonly help: "When true, mapping content may include less-sanitized external payload data in generated messages. Keep false by default and enable only for trusted sources with reviewed transform logic.";
            readonly tags: ["access"];
        };
        readonly "hooks.mappings[].channel": {
            readonly label: "Hook Mapping Delivery Channel";
            readonly help: "Delivery channel override for mapping outputs (for example \"last\", \"telegram\", \"discord\", \"slack\", \"signal\", \"imessage\", or \"msteams\"). Keep channel overrides explicit to avoid accidental cross-channel sends.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].to": {
            readonly label: "Hook Mapping Delivery Destination";
            readonly help: "Destination identifier inside the selected channel when mapping replies should route to a fixed target. Verify provider-specific destination formats before enabling production mappings.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].model": {
            readonly label: "Hook Mapping Model Override";
            readonly help: "Optional model override for mapping-triggered runs when automation should use a different model than agent defaults. Use this sparingly so behavior remains predictable across mapping executions.";
            readonly tags: ["models"];
        };
        readonly "hooks.mappings[].thinking": {
            readonly label: "Hook Mapping Thinking Override";
            readonly help: "Optional thinking-effort override for mapping-triggered runs to tune latency versus reasoning depth. Keep low or minimal for high-volume hooks unless deeper reasoning is clearly required.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].timeoutSeconds": {
            readonly label: "Hook Mapping Timeout (sec)";
            readonly help: "Maximum runtime allowed for mapping action execution before timeout handling applies. Use tighter limits for high-volume webhook sources to prevent queue pileups.";
            readonly tags: ["performance"];
        };
        readonly "hooks.mappings[].transform": {
            readonly label: "Hook Mapping Transform";
            readonly help: "Transform configuration block defining module/export preprocessing before mapping action handling. Use transforms only from reviewed code paths and keep behavior deterministic for repeatable automation.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].transform.module": {
            readonly label: "Hook Transform Module";
            readonly help: "Relative transform module path loaded from hooks.transformsDir to rewrite incoming payloads before delivery. Keep modules local, reviewed, and free of path traversal patterns.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.mappings[].transform.export": {
            readonly label: "Hook Transform Export";
            readonly help: "Named export to invoke from the transform module; defaults to module default export when omitted. Set this when one file hosts multiple transform handlers.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.gmail": {
            readonly label: "Gmail Hook";
            readonly help: "Gmail push integration settings used for Pub/Sub notifications and optional local callback serving. Keep this scoped to dedicated Gmail automation accounts where possible.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.gmail.account": {
            readonly label: "Gmail Hook Account";
            readonly help: "Google account identifier used for Gmail watch/subscription operations in this hook integration. Use a dedicated automation mailbox account to isolate operational permissions.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.gmail.label": {
            readonly label: "Gmail Hook Label";
            readonly help: "Optional Gmail label filter limiting which labeled messages trigger hook events. Keep filters narrow to avoid flooding automations with unrelated inbox traffic.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.gmail.topic": {
            readonly label: "Gmail Hook Pub/Sub Topic";
            readonly help: "Google Pub/Sub topic name used by Gmail watch to publish change notifications for this account. Ensure the topic IAM grants Gmail publish access before enabling watches.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.gmail.subscription": {
            readonly label: "Gmail Hook Subscription";
            readonly help: "Pub/Sub subscription consumed by the gateway to receive Gmail change notifications from the configured topic. Keep subscription ownership clear so multiple consumers do not race unexpectedly.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.gmail.pushToken": {
            readonly label: "Gmail Hook Push Token";
            readonly help: "Shared secret token required on Gmail push hook callbacks before processing notifications. Use env substitution and rotate if callback endpoints are exposed externally.";
            readonly tags: ["security", "auth"];
            readonly sensitive: true;
        };
        readonly "hooks.gmail.hookUrl": {
            readonly label: "Gmail Hook Callback URL";
            readonly help: "Public callback URL Gmail or intermediaries invoke to deliver notifications into this hook pipeline. Keep this URL protected with token validation and restricted network exposure.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.gmail.includeBody": {
            readonly label: "Gmail Hook Include Body";
            readonly help: "When true, fetch and include email body content for downstream mapping/agent processing. Keep false unless body text is required, because this increases payload size and sensitivity.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.gmail.maxBytes": {
            readonly label: "Gmail Hook Max Body Bytes";
            readonly help: "Maximum Gmail payload bytes processed per event when includeBody is enabled. Keep conservative limits to reduce oversized message processing cost and risk.";
            readonly tags: ["performance"];
        };
        readonly "hooks.gmail.renewEveryMinutes": {
            readonly label: "Gmail Hook Renew Interval (min)";
            readonly help: "Renewal cadence in minutes for Gmail watch subscriptions to prevent expiration. Set below provider expiration windows and monitor renew failures in logs.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.gmail.allowUnsafeExternalContent": {
            readonly label: "Gmail Hook Allow Unsafe External Content";
            readonly help: "Allows less-sanitized external Gmail content to pass into processing when enabled. Keep disabled for safer defaults, and enable only for trusted mail streams with controlled transforms.";
            readonly tags: ["access"];
        };
        readonly "hooks.gmail.serve": {
            readonly label: "Gmail Hook Local Server";
            readonly help: "Local callback server settings block for directly receiving Gmail notifications without a separate ingress layer. Enable only when this process should terminate webhook traffic itself.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.gmail.serve.bind": {
            readonly label: "Gmail Hook Server Bind Address";
            readonly help: "Bind address for the local Gmail callback HTTP server used when serving hooks directly. Keep loopback-only unless external ingress is intentionally required.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.gmail.serve.port": {
            readonly label: "Gmail Hook Server Port";
            readonly help: "Port for the local Gmail callback HTTP server when serve mode is enabled. Use a dedicated port to avoid collisions with gateway/control interfaces.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.gmail.serve.path": {
            readonly label: "Gmail Hook Server Path";
            readonly help: "HTTP path on the local Gmail callback server where push notifications are accepted. Keep this consistent with subscription configuration to avoid dropped events.";
            readonly tags: ["storage"];
        };
        readonly "hooks.gmail.tailscale": {
            readonly label: "Gmail Hook Tailscale";
            readonly help: "Tailscale exposure configuration block for publishing Gmail callbacks through Serve/Funnel routes. Use private tailnet modes before enabling any public ingress path.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.gmail.tailscale.mode": {
            readonly label: "Gmail Hook Tailscale Mode";
            readonly help: "Tailscale exposure mode for Gmail callbacks: \"off\", \"serve\", or \"funnel\". Use \"serve\" for private tailnet delivery and \"funnel\" only when public internet ingress is required.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.gmail.tailscale.path": {
            readonly label: "Gmail Hook Tailscale Path";
            readonly help: "Path published by Tailscale Serve/Funnel for Gmail callback forwarding when enabled. Keep it aligned with Gmail webhook config so requests reach the expected handler.";
            readonly tags: ["storage"];
        };
        readonly "hooks.gmail.tailscale.target": {
            readonly label: "Gmail Hook Tailscale Target";
            readonly help: "Local service target forwarded by Tailscale Serve/Funnel (for example http://127.0.0.1:8787). Use explicit loopback targets to avoid ambiguous routing.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.gmail.model": {
            readonly label: "Gmail Hook Model Override";
            readonly help: "Optional model override for Gmail-triggered runs when mailbox automations should use dedicated model behavior. Keep unset to inherit agent defaults unless mailbox tasks need specialization.";
            readonly tags: ["models"];
        };
        readonly "hooks.gmail.thinking": {
            readonly label: "Gmail Hook Thinking Override";
            readonly help: "Thinking effort override for Gmail-driven agent runs: \"off\", \"minimal\", \"low\", \"medium\", or \"high\". Keep modest defaults for routine inbox automations to control cost and latency.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.internal": {
            readonly label: "Internal Hooks";
            readonly help: "Internal hook runtime settings for bundled/custom event handlers loaded from module paths. Use this for trusted in-process automations and keep handler loading tightly scoped.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.internal.enabled": {
            readonly label: "Internal Hooks Enabled";
            readonly help: "Enables processing for internal hook handlers and configured entries in the internal hook runtime. Keep disabled unless internal hook handlers are intentionally configured.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.internal.handlers": {
            readonly label: "Internal Hook Handlers";
            readonly help: "List of internal event handlers mapping event names to modules and optional exports. Keep handler definitions explicit so event-to-code routing is auditable.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.internal.handlers[].event": {
            readonly label: "Internal Hook Event";
            readonly help: "Internal event name that triggers this handler module when emitted by the runtime. Use stable event naming conventions to avoid accidental overlap across handlers.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.internal.handlers[].module": {
            readonly label: "Internal Hook Module";
            readonly help: "Safe relative module path for the internal hook handler implementation loaded at runtime. Keep module files in reviewed directories and avoid dynamic path composition.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.internal.handlers[].export": {
            readonly label: "Internal Hook Export";
            readonly help: "Optional named export for the internal hook handler function when module default export is not used. Set this when one module ships multiple handler entrypoints.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.internal.entries": {
            readonly label: "Internal Hook Entries";
            readonly help: "Configured internal hook entry records used to register concrete runtime handlers and metadata. Keep entries explicit and versioned so production behavior is auditable.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.internal.load": {
            readonly label: "Internal Hook Loader";
            readonly help: "Internal hook loader settings controlling where handler modules are discovered at startup. Use constrained load roots to reduce accidental module conflicts or shadowing.";
            readonly tags: ["advanced"];
        };
        readonly "hooks.internal.load.extraDirs": {
            readonly label: "Internal Hook Extra Directories";
            readonly help: "Additional directories searched for internal hook modules beyond default load paths. Keep this minimal and controlled to reduce accidental module shadowing.";
            readonly tags: ["storage"];
        };
        readonly "hooks.internal.installs": {
            readonly label: "Internal Hook Install Records";
            readonly help: "Install metadata for internal hook modules, including source and resolved artifacts for repeatable deployments. Use this as operational provenance and avoid manual drift edits.";
            readonly tags: ["advanced"];
        };
        readonly web: {
            readonly label: "Web Channel";
            readonly help: "Web channel runtime settings for heartbeat and reconnect behavior when operating web-based chat surfaces. Use reconnect values tuned to your network reliability profile and expected uptime needs.";
            readonly tags: ["advanced"];
        };
        readonly "web.enabled": {
            readonly label: "Web Channel Enabled";
            readonly help: "Enables the web channel runtime and related websocket lifecycle behavior. Keep disabled when web chat is unused to reduce active connection management overhead.";
            readonly tags: ["advanced"];
        };
        readonly "web.heartbeatSeconds": {
            readonly label: "Web Channel Heartbeat Interval (sec)";
            readonly help: "Heartbeat interval in seconds for web channel connectivity and liveness maintenance. Use shorter intervals for faster detection, or longer intervals to reduce keepalive chatter.";
            readonly tags: ["automation"];
        };
        readonly "web.reconnect": {
            readonly label: "Web Channel Reconnect Policy";
            readonly help: "Reconnect backoff policy for web channel reconnect attempts after transport failure. Keep bounded retries and jitter tuned to avoid thundering-herd reconnect behavior.";
            readonly tags: ["advanced"];
        };
        readonly "web.reconnect.initialMs": {
            readonly label: "Web Reconnect Initial Delay (ms)";
            readonly help: "Initial reconnect delay in milliseconds before the first retry after disconnection. Use modest delays to recover quickly without immediate retry storms.";
            readonly tags: ["advanced"];
        };
        readonly "web.reconnect.maxMs": {
            readonly label: "Web Reconnect Max Delay (ms)";
            readonly help: "Maximum reconnect backoff cap in milliseconds to bound retry delay growth over repeated failures. Use a reasonable cap so recovery remains timely after prolonged outages.";
            readonly tags: ["performance"];
        };
        readonly "web.reconnect.factor": {
            readonly label: "Web Reconnect Backoff Factor";
            readonly help: "Exponential backoff multiplier used between reconnect attempts in web channel retry loops. Keep factor above 1 and tune with jitter for stable large-fleet reconnect behavior.";
            readonly tags: ["advanced"];
        };
        readonly "web.reconnect.jitter": {
            readonly label: "Web Reconnect Jitter";
            readonly help: "Randomization factor (0-1) applied to reconnect delays to desynchronize clients after outage events. Keep non-zero jitter in multi-client deployments to reduce synchronized spikes.";
            readonly tags: ["advanced"];
        };
        readonly "web.reconnect.maxAttempts": {
            readonly label: "Web Reconnect Max Attempts";
            readonly help: "Maximum reconnect attempts before giving up for the current failure sequence (0 means no retries). Use finite caps for controlled failure handling in automation-sensitive environments.";
            readonly tags: ["performance"];
        };
        readonly "discovery.wideArea": {
            readonly label: "Wide-area Discovery";
            readonly help: "Wide-area discovery configuration group for exposing discovery signals beyond local-link scopes. Enable only in deployments that intentionally aggregate gateway presence across sites.";
            readonly tags: ["network"];
        };
        readonly "discovery.wideArea.enabled": {
            readonly label: "Wide-area Discovery Enabled";
            readonly help: "Enables wide-area discovery signaling when your environment needs non-local gateway discovery. Keep disabled unless cross-network discovery is operationally required.";
            readonly tags: ["network"];
        };
        readonly "discovery.wideArea.domain": {
            readonly label: "Wide-area Discovery Domain";
            readonly help: "Optional unicast DNS-SD domain for wide-area discovery, such as openclaw.internal. Use this when you intentionally publish gateway discovery beyond local mDNS scopes.";
            readonly tags: ["network"];
        };
        readonly "discovery.mdns": {
            readonly label: "mDNS Discovery";
            readonly help: "mDNS discovery configuration group for local network advertisement and discovery behavior tuning. Keep minimal mode for routine LAN discovery unless extra metadata is required.";
            readonly tags: ["network"];
        };
        readonly canvasHost: {
            readonly label: "Canvas Host";
            readonly help: "Canvas host settings for serving canvas assets and local live-reload behavior used by canvas-enabled workflows. Keep disabled unless canvas-hosted assets are actively used.";
            readonly tags: ["advanced"];
        };
        readonly "canvasHost.enabled": {
            readonly label: "Canvas Host Enabled";
            readonly help: "Enables the canvas host server process and routes for serving canvas files. Keep disabled when canvas workflows are inactive to reduce exposed local services.";
            readonly tags: ["advanced"];
        };
        readonly "canvasHost.root": {
            readonly label: "Canvas Host Root Directory";
            readonly help: "Filesystem root directory served by canvas host for canvas content and static assets. Use a dedicated directory and avoid broad repo roots for least-privilege file exposure.";
            readonly tags: ["advanced"];
        };
        readonly "canvasHost.port": {
            readonly label: "Canvas Host Port";
            readonly help: "TCP port used by the canvas host HTTP server when canvas hosting is enabled. Choose a non-conflicting port and align firewall/proxy policy accordingly.";
            readonly tags: ["advanced"];
        };
        readonly "canvasHost.liveReload": {
            readonly label: "Canvas Host Live Reload";
            readonly help: "Enables automatic live-reload behavior for canvas assets during development workflows. Keep disabled in production-like environments where deterministic output is preferred.";
            readonly tags: ["reliability"];
        };
        readonly "talk.voiceId": {
            readonly label: "Talk Voice ID";
            readonly help: "Legacy ElevenLabs default voice ID for Talk mode. Prefer talk.providers.elevenlabs.voiceId.";
            readonly tags: ["media"];
        };
        readonly "talk.voiceAliases": {
            readonly label: "Talk Voice Aliases";
            readonly help: "Use this legacy ElevenLabs voice alias map (for example {\"Clawd\":\"EXAVITQu4vr4xnSDxMaL\"}) only during migration. Prefer talk.providers.elevenlabs.voiceAliases.";
            readonly tags: ["media"];
        };
        readonly "talk.modelId": {
            readonly label: "Talk Model ID";
            readonly help: "Legacy ElevenLabs model ID for Talk mode (default: eleven_v3). Prefer talk.providers.elevenlabs.modelId.";
            readonly tags: ["models", "media"];
        };
        readonly "talk.outputFormat": {
            readonly label: "Talk Output Format";
            readonly help: "Use this legacy ElevenLabs output format for Talk mode (for example pcm_44100 or mp3_44100_128) only during migration. Prefer talk.providers.elevenlabs.outputFormat.";
            readonly tags: ["media"];
        };
        readonly "talk.interruptOnSpeech": {
            readonly label: "Talk Interrupt on Speech";
            readonly help: "If true (default), stop assistant speech when the user starts speaking in Talk mode. Keep enabled for conversational turn-taking.";
            readonly tags: ["media"];
        };
        readonly "talk.silenceTimeoutMs": {
            readonly label: "Talk Silence Timeout (ms)";
            readonly help: "Milliseconds of user silence before Talk mode finalizes and sends the current transcript. Leave unset to keep the platform default pause window (700 ms on macOS and Android, 900 ms on iOS).";
            readonly tags: ["performance", "media"];
        };
        readonly "messages.messagePrefix": {
            readonly label: "Inbound Message Prefix";
            readonly help: "Prefix text prepended to inbound user messages before they are handed to the agent runtime. Use this sparingly for channel context markers and keep it stable across sessions.";
            readonly tags: ["advanced"];
        };
        readonly "messages.responsePrefix": {
            readonly label: "Outbound Response Prefix";
            readonly help: "Prefix text prepended to outbound assistant replies before sending to channels. Use for lightweight branding/context tags and avoid long prefixes that reduce content density.";
            readonly tags: ["advanced"];
        };
        readonly "messages.groupChat": {
            readonly label: "Group Chat Rules";
            readonly help: "Group-message handling controls including mention triggers and history window sizing. Keep mention patterns narrow so group channels do not trigger on every message.";
            readonly tags: ["advanced"];
        };
        readonly "messages.groupChat.mentionPatterns": {
            readonly label: "Group Mention Patterns";
            readonly help: "Safe case-insensitive regex patterns used to detect explicit mentions/trigger phrases in group chats. Use precise patterns to reduce false positives in high-volume channels; invalid or unsafe nested-repetition patterns are ignored.";
            readonly tags: ["advanced"];
        };
        readonly "messages.groupChat.historyLimit": {
            readonly label: "Group History Limit";
            readonly help: "Maximum number of prior group messages loaded as context per turn for group sessions. Use higher values for richer continuity, or lower values for faster and cheaper responses.";
            readonly tags: ["performance"];
        };
        readonly "messages.queue": {
            readonly label: "Inbound Queue";
            readonly help: "Inbound message queue strategy used to buffer bursts before processing turns. Tune this for busy channels where sequential processing or batching behavior matters.";
            readonly tags: ["advanced"];
        };
        readonly "messages.queue.mode": {
            readonly label: "Queue Mode";
            readonly help: "Queue behavior mode: \"steer\", \"followup\", \"collect\", \"steer-backlog\", \"steer+backlog\", \"queue\", or \"interrupt\". Keep conservative modes unless you intentionally need aggressive interruption/backlog semantics.";
            readonly tags: ["advanced"];
        };
        readonly "messages.queue.byChannel": {
            readonly label: "Queue Mode by Channel";
            readonly help: "Per-channel queue mode overrides keyed by provider id (for example telegram, discord, slack). Use this when one channel’s traffic pattern needs different queue behavior than global defaults.";
            readonly tags: ["advanced"];
        };
        readonly "messages.queue.debounceMs": {
            readonly label: "Queue Debounce (ms)";
            readonly help: "Global queue debounce window in milliseconds before processing buffered inbound messages. Use higher values to coalesce rapid bursts, or lower values for reduced response latency.";
            readonly tags: ["performance"];
        };
        readonly "messages.queue.debounceMsByChannel": {
            readonly label: "Queue Debounce by Channel (ms)";
            readonly help: "Per-channel debounce overrides for queue behavior keyed by provider id. Use this to tune burst handling independently for chat surfaces with different pacing.";
            readonly tags: ["performance"];
        };
        readonly "messages.queue.cap": {
            readonly label: "Queue Capacity";
            readonly help: "Maximum number of queued inbound items retained before drop policy applies. Keep caps bounded in noisy channels so memory usage remains predictable.";
            readonly tags: ["advanced"];
        };
        readonly "messages.queue.drop": {
            readonly label: "Queue Drop Strategy";
            readonly help: "Drop strategy when queue cap is exceeded: \"old\", \"new\", or \"summarize\". Use summarize when preserving intent matters, or old/new when deterministic dropping is preferred.";
            readonly tags: ["advanced"];
        };
        readonly "messages.inbound": {
            readonly label: "Inbound Debounce";
            readonly help: "Direct inbound debounce settings used before queue/turn processing starts. Configure this for provider-specific rapid message bursts from the same sender.";
            readonly tags: ["advanced"];
        };
        readonly "messages.suppressToolErrors": {
            readonly label: "Suppress Tool Error Warnings";
            readonly help: "When true, suppress ⚠️ tool-error warnings from being shown to the user. The agent already sees errors in context and can retry. Default: false.";
            readonly tags: ["advanced"];
        };
        readonly "messages.ackReaction": {
            readonly label: "Ack Reaction Emoji";
            readonly help: "Emoji reaction used to acknowledge inbound messages (empty disables).";
            readonly tags: ["advanced"];
        };
        readonly "messages.ackReactionScope": {
            readonly label: "Ack Reaction Scope";
            readonly help: "When to send ack reactions (\"group-mentions\", \"group-all\", \"direct\", \"all\", \"off\", \"none\"). \"off\"/\"none\" disables ack reactions entirely.";
            readonly tags: ["advanced"];
        };
        readonly "messages.removeAckAfterReply": {
            readonly label: "Remove Ack Reaction After Reply";
            readonly help: "Removes the acknowledgment reaction after final reply delivery when enabled. Keep enabled for cleaner UX in channels where persistent ack reactions create clutter.";
            readonly tags: ["advanced"];
        };
        readonly "messages.statusReactions": {
            readonly label: "Status Reactions";
            readonly help: "Lifecycle status reactions that update the emoji on the trigger message as the agent progresses (queued → thinking → tool → done/error).";
            readonly tags: ["advanced"];
        };
        readonly "messages.statusReactions.enabled": {
            readonly label: "Enable Status Reactions";
            readonly help: "Enable lifecycle status reactions for Telegram. When enabled, the ack reaction becomes the initial 'queued' state and progresses through thinking, tool, done/error automatically. Default: false.";
            readonly tags: ["advanced"];
        };
        readonly "messages.statusReactions.emojis": {
            readonly label: "Status Reaction Emojis";
            readonly help: "Override default status reaction emojis. Keys: thinking, compacting, tool, coding, web, done, error, stallSoft, stallHard. Must be valid Telegram reaction emojis.";
            readonly tags: ["advanced"];
        };
        readonly "messages.statusReactions.timing": {
            readonly label: "Status Reaction Timing";
            readonly help: "Override default timing. Keys: debounceMs (700), stallSoftMs (25000), stallHardMs (60000), doneHoldMs (1500), errorHoldMs (2500).";
            readonly tags: ["advanced"];
        };
        readonly "messages.inbound.debounceMs": {
            readonly label: "Inbound Message Debounce (ms)";
            readonly help: "Debounce window (ms) for batching rapid inbound messages from the same sender (0 to disable).";
            readonly tags: ["performance"];
        };
        readonly "messages.inbound.byChannel": {
            readonly label: "Inbound Debounce by Channel (ms)";
            readonly help: "Per-channel inbound debounce overrides keyed by provider id in milliseconds. Use this where some providers send message fragments more aggressively than others.";
            readonly tags: ["advanced"];
        };
        readonly "messages.tts": {
            readonly label: "Message Text-to-Speech";
            readonly help: "Text-to-speech policy for reading agent replies aloud on supported voice or audio surfaces. Keep disabled unless voice playback is part of your operator/user workflow.";
            readonly tags: ["media"];
        };
        readonly "messages.tts.providers": {
            readonly label: "TTS Provider Settings";
            readonly help: "Provider-specific TTS settings keyed by speech provider id. Use this instead of bundled provider-specific top-level keys so speech plugins stay decoupled from core config schema.";
            readonly tags: ["media"];
        };
        readonly "messages.tts.providers.*": {
            readonly label: "TTS Provider Config";
            readonly help: "Provider-specific TTS configuration for one speech provider id. Keep fields scoped to the plugin that owns that provider.";
            readonly tags: ["media"];
        };
        readonly "messages.tts.providers.*.apiKey": {
            readonly label: "TTS Provider API Key";
            readonly help: "Provider API key used by that speech provider when its plugin requires authenticated TTS access.";
            readonly tags: ["security", "auth", "media"];
            readonly sensitive: true;
        };
        readonly "talk.provider": {
            readonly label: "Talk Active Provider";
            readonly help: "Active Talk provider id (for example \"elevenlabs\").";
            readonly tags: ["media"];
        };
        readonly "talk.providers": {
            readonly label: "Talk Provider Settings";
            readonly help: "Provider-specific Talk settings keyed by provider id. During migration, prefer this over legacy talk.* keys.";
            readonly tags: ["media"];
        };
        readonly "talk.providers.*.voiceId": {
            readonly label: "Talk Provider Voice ID";
            readonly help: "Provider default voice ID for Talk mode.";
            readonly tags: ["media"];
        };
        readonly "talk.providers.*.voiceAliases": {
            readonly label: "Talk Provider Voice Aliases";
            readonly help: "Optional provider voice alias map for Talk directives.";
            readonly tags: ["media"];
        };
        readonly "talk.providers.*.modelId": {
            readonly label: "Talk Provider Model ID";
            readonly help: "Provider default model ID for Talk mode.";
            readonly tags: ["models", "media"];
        };
        readonly "talk.providers.*.outputFormat": {
            readonly label: "Talk Provider Output Format";
            readonly help: "Provider default output format for Talk mode.";
            readonly tags: ["media"];
        };
        readonly "talk.providers.*.apiKey": {
            readonly label: "Talk Provider API Key";
            readonly help: "Provider API key for Talk mode.";
            readonly tags: ["security", "auth", "media"];
            readonly sensitive: true;
        };
        readonly "talk.apiKey": {
            readonly label: "Talk API Key";
            readonly help: "Use this legacy ElevenLabs API key for Talk mode only during migration, and keep secrets in env-backed storage. Prefer talk.providers.elevenlabs.apiKey (fallback: ELEVENLABS_API_KEY).";
            readonly tags: ["security", "auth", "media"];
            readonly sensitive: true;
        };
        readonly "channels.defaults": {
            readonly label: "Channel Defaults";
            readonly help: "Default channel behavior applied across providers when provider-specific settings are not set. Use this to enforce consistent baseline policy before per-provider tuning.";
            readonly tags: ["network", "channels"];
        };
        readonly "channels.defaults.groupPolicy": {
            readonly label: "Default Group Policy";
            readonly help: "Default group policy across channels: \"open\", \"disabled\", or \"allowlist\". Keep \"allowlist\" for safer production setups unless broad group participation is intentional.";
            readonly tags: ["access", "network", "channels"];
        };
        readonly "channels.defaults.heartbeat": {
            readonly label: "Default Heartbeat Visibility";
            readonly help: "Default heartbeat visibility settings for status messages emitted by providers/channels. Tune this globally to reduce noisy healthy-state updates while keeping alerts visible.";
            readonly tags: ["network", "automation", "channels"];
        };
        readonly "channels.defaults.heartbeat.showOk": {
            readonly label: "Heartbeat Show OK";
            readonly help: "Shows healthy/OK heartbeat status entries when true in channel status outputs. Keep false in noisy environments and enable only when operators need explicit healthy confirmations.";
            readonly tags: ["network", "automation", "channels"];
        };
        readonly "channels.defaults.heartbeat.showAlerts": {
            readonly label: "Heartbeat Show Alerts";
            readonly help: "Shows degraded/error heartbeat alerts when true so operator channels surface problems promptly. Keep enabled in production so broken channel states are visible.";
            readonly tags: ["network", "automation", "channels"];
        };
        readonly "channels.defaults.heartbeat.useIndicator": {
            readonly label: "Heartbeat Use Indicator";
            readonly help: "Enables concise indicator-style heartbeat rendering instead of verbose status text where supported. Use indicator mode for dense dashboards with many active channels.";
            readonly tags: ["network", "automation", "channels"];
        };
        readonly "channels.modelByChannel": {
            readonly label: "Channel Model Overrides";
            readonly help: "Map provider -> channel id -> model override (values are provider/model or aliases).";
            readonly tags: ["network", "channels"];
        };
        readonly "agents.list[].skills": {
            readonly label: "Agent Skill Filter";
            readonly help: "Optional allowlist of skills for this agent (omit = all skills; empty = no skills).";
            readonly tags: ["advanced"];
        };
        readonly "agents.list[].identity.avatar": {
            readonly label: "Agent Avatar";
            readonly help: "Avatar image path (relative to the agent workspace only) or a remote URL/data URL.";
            readonly placeholder: "avatars/openclaw.png";
            readonly tags: ["advanced"];
        };
        readonly "agents.list[].heartbeat.suppressToolErrorWarnings": {
            readonly label: "Agent Heartbeat Suppress Tool Error Warnings";
            readonly help: "Suppress tool error warning payloads during heartbeat runs.";
            readonly tags: ["automation"];
        };
        readonly "agents.list[].sandbox.browser.network": {
            readonly label: "Agent Sandbox Browser Network";
            readonly help: "Per-agent override for sandbox browser Docker network.";
            readonly tags: ["storage"];
        };
        readonly "agents.list[].sandbox.browser.cdpSourceRange": {
            readonly label: "Agent Sandbox Browser CDP Source Port Range";
            readonly help: "Per-agent override for CDP source CIDR allowlist.";
            readonly tags: ["storage"];
        };
        readonly "agents.list[].sandbox.docker.dangerouslyAllowContainerNamespaceJoin": {
            readonly label: "Agent Sandbox Docker Allow Container Namespace Join";
            readonly help: "Per-agent DANGEROUS override for container namespace joins in sandbox Docker network mode.";
            readonly tags: ["security", "access", "storage", "advanced"];
        };
        readonly "discovery.mdns.mode": {
            readonly label: "mDNS Discovery Mode";
            readonly help: "mDNS broadcast mode (\"minimal\" default, \"full\" includes cliPath/sshPort, \"off\" disables mDNS).";
            readonly tags: ["network"];
        };
        readonly "plugins.enabled": {
            readonly label: "Enable Plugins";
            readonly help: "Enable or disable plugin/extension loading globally during startup and config reload (default: true). Keep enabled only when extension capabilities are required by your deployment.";
            readonly tags: ["advanced"];
        };
        readonly "plugins.allow": {
            readonly label: "Plugin Allowlist";
            readonly help: "Optional allowlist of plugin IDs; when set, only listed plugins are eligible to load. Use this to enforce approved extension inventories in controlled environments.";
            readonly tags: ["access"];
        };
        readonly "plugins.deny": {
            readonly label: "Plugin Denylist";
            readonly help: "Optional denylist of plugin IDs that are blocked even if allowlists or paths include them. Use deny rules for emergency rollback and hard blocks on risky plugins.";
            readonly tags: ["access"];
        };
        readonly "plugins.load": {
            readonly label: "Plugin Loader";
            readonly help: "Plugin loader configuration group for specifying filesystem paths where plugins are discovered. Keep load paths explicit and reviewed to avoid accidental untrusted extension loading.";
            readonly tags: ["advanced"];
        };
        readonly "plugins.load.paths": {
            readonly label: "Plugin Load Paths";
            readonly help: "Additional plugin files or directories scanned by the loader beyond built-in defaults. Use dedicated extension directories and avoid broad paths with unrelated executable content.";
            readonly tags: ["storage"];
        };
        readonly "plugins.slots": {
            readonly label: "Plugin Slots";
            readonly help: "Selects which plugins own exclusive runtime slots such as memory so only one plugin provides that capability. Use explicit slot ownership to avoid overlapping providers with conflicting behavior.";
            readonly tags: ["advanced"];
        };
        readonly "plugins.slots.memory": {
            readonly label: "Memory Plugin";
            readonly help: "Select the active memory plugin by id, or \"none\" to disable memory plugins.";
            readonly tags: ["advanced"];
        };
        readonly "plugins.slots.contextEngine": {
            readonly label: "Context Engine Plugin";
            readonly help: "Selects the active context engine plugin by id so one plugin provides context orchestration behavior.";
            readonly tags: ["advanced"];
        };
        readonly "plugins.entries": {
            readonly label: "Plugin Entries";
            readonly help: "Per-plugin settings keyed by plugin ID including enablement and plugin-specific runtime configuration payloads. Use this for scoped plugin tuning without changing global loader policy.";
            readonly tags: ["advanced"];
        };
        readonly "plugins.entries.*.enabled": {
            readonly label: "Plugin Enabled";
            readonly help: "Per-plugin enablement override for a specific entry, applied on top of global plugin policy (restart required). Use this to stage plugin rollout gradually across environments.";
            readonly tags: ["advanced"];
        };
        readonly "plugins.entries.*.hooks": {
            readonly label: "Plugin Hook Policy";
            readonly help: "Per-plugin typed hook policy controls for core-enforced safety gates. Use this to constrain high-impact hook categories without disabling the entire plugin.";
            readonly tags: ["advanced"];
        };
        readonly "plugins.entries.*.hooks.allowPromptInjection": {
            readonly label: "Allow Prompt Injection Hooks";
            readonly help: "Controls whether this plugin may mutate prompts through typed hooks. Set false to block `before_prompt_build` and ignore prompt-mutating fields from legacy `before_agent_start`, while preserving legacy `modelOverride` and `providerOverride` behavior.";
            readonly tags: ["access"];
        };
        readonly "plugins.entries.*.subagent": {
            readonly label: "Plugin Subagent Policy";
            readonly help: "Per-plugin subagent runtime controls for model override trust and allowlists. Keep this unset unless a plugin must explicitly steer subagent model selection.";
            readonly tags: ["advanced"];
        };
        readonly "plugins.entries.*.subagent.allowModelOverride": {
            readonly label: "Allow Plugin Subagent Model Override";
            readonly help: "Explicitly allows this plugin to request provider/model overrides in background subagent runs. Keep false unless the plugin is trusted to steer model selection.";
            readonly tags: ["access"];
        };
        readonly "plugins.entries.*.subagent.allowedModels": {
            readonly label: "Plugin Subagent Allowed Models";
            readonly help: "Allowed override targets for trusted plugin subagent runs as canonical \"provider/model\" refs. Use \"*\" only when you intentionally allow any model.";
            readonly tags: ["access"];
        };
        readonly "plugins.entries.*.apiKey": {
            readonly label: "Plugin API Key";
            readonly help: "Optional API key field consumed by plugins that accept direct key configuration in entry settings. Use secret/env substitution and avoid committing real credentials into config files.";
            readonly tags: ["security", "auth"];
        };
        readonly "plugins.entries.*.env": {
            readonly label: "Plugin Environment Variables";
            readonly help: "Per-plugin environment variable map injected for that plugin runtime context only. Use this to scope provider credentials to one plugin instead of sharing global process environment.";
            readonly tags: ["advanced"];
        };
        readonly "plugins.entries.*.config": {
            readonly label: "Plugin Config";
            readonly help: "Plugin-defined configuration payload interpreted by that plugin's own schema and validation rules. Use only documented fields from the plugin to prevent ignored or invalid settings.";
            readonly tags: ["advanced"];
        };
        readonly "plugins.installs": {
            readonly label: "Plugin Install Records";
            readonly help: "CLI-managed install metadata (used by `openclaw plugins update` to locate install sources).";
            readonly tags: ["advanced"];
        };
        readonly "plugins.installs.*.source": {
            readonly label: "Plugin Install Source";
            readonly help: "Install source (\"npm\", \"archive\", or \"path\").";
            readonly tags: ["advanced"];
        };
        readonly "plugins.installs.*.spec": {
            readonly label: "Plugin Install Spec";
            readonly help: "Original npm spec used for install (if source is npm).";
            readonly tags: ["advanced"];
        };
        readonly "plugins.installs.*.sourcePath": {
            readonly label: "Plugin Install Source Path";
            readonly help: "Original archive/path used for install (if any).";
            readonly tags: ["storage"];
        };
        readonly "plugins.installs.*.installPath": {
            readonly label: "Plugin Install Path";
            readonly help: "Resolved install directory (usually ~/.openclaw/extensions/<id>).";
            readonly tags: ["storage"];
        };
        readonly "plugins.installs.*.version": {
            readonly label: "Plugin Install Version";
            readonly help: "Version recorded at install time (if available).";
            readonly tags: ["advanced"];
        };
        readonly "plugins.installs.*.resolvedName": {
            readonly label: "Plugin Resolved Package Name";
            readonly help: "Resolved npm package name from the fetched artifact.";
            readonly tags: ["advanced"];
        };
        readonly "plugins.installs.*.resolvedVersion": {
            readonly label: "Plugin Resolved Package Version";
            readonly help: "Resolved npm package version from the fetched artifact (useful for non-pinned specs).";
            readonly tags: ["advanced"];
        };
        readonly "plugins.installs.*.resolvedSpec": {
            readonly label: "Plugin Resolved Package Spec";
            readonly help: "Resolved exact npm spec (<name>@<version>) from the fetched artifact.";
            readonly tags: ["advanced"];
        };
        readonly "plugins.installs.*.integrity": {
            readonly label: "Plugin Resolved Integrity";
            readonly help: "Resolved npm dist integrity hash for the fetched artifact (if reported by npm).";
            readonly tags: ["advanced"];
        };
        readonly "plugins.installs.*.shasum": {
            readonly label: "Plugin Resolved Shasum";
            readonly help: "Resolved npm dist shasum for the fetched artifact (if reported by npm).";
            readonly tags: ["advanced"];
        };
        readonly "plugins.installs.*.resolvedAt": {
            readonly label: "Plugin Resolution Time";
            readonly help: "ISO timestamp when npm package metadata was last resolved for this install record.";
            readonly tags: ["advanced"];
        };
        readonly "plugins.installs.*.installedAt": {
            readonly label: "Plugin Install Time";
            readonly help: "ISO timestamp of last install/update.";
            readonly tags: ["advanced"];
        };
        readonly "plugins.installs.*.marketplaceName": {
            readonly label: "Plugin Marketplace Name";
            readonly help: "Marketplace display name recorded for marketplace-backed plugin installs (if available).";
            readonly tags: ["advanced"];
        };
        readonly "plugins.installs.*.marketplaceSource": {
            readonly label: "Plugin Marketplace Source";
            readonly help: "Original marketplace source used to resolve the install (for example a repo path or Git URL).";
            readonly tags: ["advanced"];
        };
        readonly "plugins.installs.*.marketplacePlugin": {
            readonly label: "Plugin Marketplace Plugin";
            readonly help: "Plugin entry name inside the source marketplace, used for later updates.";
            readonly tags: ["advanced"];
        };
        readonly "models.providers.*.headers.*": {
            readonly sensitive: true;
            readonly tags: ["security", "models"];
        };
        readonly "agents.defaults.sandbox.ssh.identityData": {
            readonly sensitive: true;
            readonly tags: ["security", "storage"];
        };
        readonly "agents.defaults.sandbox.ssh.certificateData": {
            readonly sensitive: true;
            readonly tags: ["security", "storage"];
        };
        readonly "agents.defaults.sandbox.ssh.knownHostsData": {
            readonly sensitive: true;
            readonly tags: ["security", "storage"];
        };
        readonly "agents.list[].memorySearch.remote.apiKey": {
            readonly sensitive: true;
            readonly tags: ["security", "auth"];
        };
        readonly "agents.list[].sandbox.ssh.identityData": {
            readonly sensitive: true;
            readonly tags: ["security", "storage"];
        };
        readonly "agents.list[].sandbox.ssh.certificateData": {
            readonly sensitive: true;
            readonly tags: ["security", "storage"];
        };
        readonly "agents.list[].sandbox.ssh.knownHostsData": {
            readonly sensitive: true;
            readonly tags: ["security", "storage"];
        };
        readonly "tools.web.search.apiKey": {
            readonly sensitive: true;
            readonly tags: ["security", "auth", "tools"];
        };
        readonly "tools.web.search.brave.apiKey": {
            readonly sensitive: true;
            readonly tags: ["security", "auth", "tools"];
        };
        readonly "tools.web.search.firecrawl.apiKey": {
            readonly sensitive: true;
            readonly tags: ["security", "auth", "tools"];
        };
        readonly "tools.web.search.gemini.apiKey": {
            readonly sensitive: true;
            readonly tags: ["security", "auth", "tools"];
        };
        readonly "tools.web.search.grok.apiKey": {
            readonly sensitive: true;
            readonly tags: ["security", "auth", "tools"];
        };
        readonly "tools.web.search.kimi.apiKey": {
            readonly sensitive: true;
            readonly tags: ["security", "auth", "tools"];
        };
        readonly "tools.web.search.perplexity.apiKey": {
            readonly sensitive: true;
            readonly tags: ["security", "auth", "tools"];
        };
        readonly "skills.entries.*.apiKey": {
            readonly sensitive: true;
            readonly tags: ["security", "auth"];
        };
    };
    readonly version: "2026.3.28";
    readonly generatedAt: "2026-03-22T21:17:33.302Z";
};
