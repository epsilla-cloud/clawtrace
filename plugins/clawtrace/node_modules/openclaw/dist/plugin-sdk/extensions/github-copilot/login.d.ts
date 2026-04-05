import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime";
export declare function githubCopilotLoginCommand(opts: {
    profileId?: string;
    yes?: boolean;
}, runtime: RuntimeEnv): Promise<void>;
