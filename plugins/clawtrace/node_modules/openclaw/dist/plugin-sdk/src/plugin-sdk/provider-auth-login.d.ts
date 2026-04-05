export declare const githubCopilotLoginCommand: (opts: {
    profileId?: string;
    yes?: boolean;
}, runtime: import("./runtime.ts").RuntimeEnv) => Promise<void>;
export declare const loginChutes: (params: {
    app: import("../agents/chutes-oauth.ts").ChutesOAuthAppConfig;
    manual?: boolean;
    timeoutMs?: number;
    createPkce?: typeof import("../agents/chutes-oauth.ts").generateChutesPkce;
    createState?: () => string;
    onAuth: (event: {
        url: string;
    }) => Promise<void>;
    onPrompt: (prompt: {
        message: string;
        placeholder?: string;
    }) => Promise<string>;
    onProgress?: (message: string) => void;
    fetchFn?: typeof fetch;
}) => Promise<import("@mariozechner/pi-ai").OAuthCredentials>;
export declare const loginOpenAICodexOAuth: (params: {
    prompter: import("./setup.ts").WizardPrompter;
    runtime: import("./runtime.ts").RuntimeEnv;
    isRemote: boolean;
    openUrl: (url: string) => Promise<void>;
    localBrowserMessage?: string;
}) => Promise<import("@mariozechner/pi-ai").OAuthCredentials | null>;
