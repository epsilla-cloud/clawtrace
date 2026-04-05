import type { Command } from "commander";
import { type BrowserParentOpts } from "./browser-cli-shared.js";
export declare function registerBrowserManageCommands(browser: Command, parentOpts: (cmd: Command) => BrowserParentOpts): void;
