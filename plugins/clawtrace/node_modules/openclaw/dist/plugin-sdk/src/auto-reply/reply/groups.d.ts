import type { OpenClawConfig } from "../../config/config.js";
import type { GroupKeyResolution, SessionEntry } from "../../config/sessions.js";
import type { TemplateContext } from "../templating.js";
export declare function resolveGroupRequireMention(params: {
    cfg: OpenClawConfig;
    ctx: TemplateContext;
    groupResolution?: GroupKeyResolution;
}): Promise<boolean>;
export declare function defaultGroupActivation(requireMention: boolean): "always" | "mention";
export declare function buildGroupChatContext(params: {
    sessionCtx: TemplateContext;
}): string;
export declare function buildGroupIntro(params: {
    cfg: OpenClawConfig;
    sessionCtx: TemplateContext;
    sessionEntry?: SessionEntry;
    defaultActivation: "always" | "mention";
    silentToken: string;
}): string;
