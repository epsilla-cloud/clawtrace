import type { OpenClawConfig } from "../../config/config.js";
import type { ConfiguredBindingResolution } from "./binding-types.js";
export declare function ensureConfiguredBindingTargetReady(params: {
    cfg: OpenClawConfig;
    bindingResolution: ConfiguredBindingResolution | null;
}): Promise<{
    ok: true;
} | {
    ok: false;
    error: string;
}>;
export declare function resetConfiguredBindingTargetInPlace(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    reason: "new" | "reset";
}): Promise<{
    ok: true;
} | {
    ok: false;
    skipped?: boolean;
    error?: string;
}>;
export declare function ensureConfiguredBindingTargetSession(params: {
    cfg: OpenClawConfig;
    bindingResolution: ConfiguredBindingResolution;
}): Promise<{
    ok: true;
    sessionKey: string;
} | {
    ok: false;
    sessionKey: string;
    error: string;
}>;
