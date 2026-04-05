import type { OpenClawConfig } from "../config/config.js";
import { type ResolverContext } from "./runtime-shared.js";
import type { RuntimeWebDiagnostic, RuntimeWebDiagnosticCode, RuntimeWebFetchFirecrawlMetadata, RuntimeWebSearchMetadata, RuntimeWebToolsMetadata, RuntimeWebXSearchMetadata } from "./runtime-web-tools.types.js";
export type { RuntimeWebDiagnostic, RuntimeWebDiagnosticCode, RuntimeWebFetchFirecrawlMetadata, RuntimeWebSearchMetadata, RuntimeWebToolsMetadata, RuntimeWebXSearchMetadata, };
export declare function resolveRuntimeWebTools(params: {
    sourceConfig: OpenClawConfig;
    resolvedConfig: OpenClawConfig;
    context: ResolverContext;
}): Promise<RuntimeWebToolsMetadata>;
