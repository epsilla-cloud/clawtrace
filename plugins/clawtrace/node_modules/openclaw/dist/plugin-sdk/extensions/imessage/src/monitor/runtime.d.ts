import { type RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import type { MonitorIMessageOpts } from "./types.js";
export declare function resolveRuntime(opts: MonitorIMessageOpts): RuntimeEnv;
export declare function normalizeAllowList(list?: Array<string | number>): string[];
