import { type CliOutput } from "../cli-output.js";
import type { PreparedCliRunContext } from "./types.js";
export declare function executePreparedCliRun(context: PreparedCliRunContext, cliSessionIdToUse?: string): Promise<CliOutput>;
