import type { Block, KnownBlock } from "@slack/web-api";
import type { InteractiveReply } from "openclaw/plugin-sdk/interactive-runtime";
export declare const SLACK_REPLY_BUTTON_ACTION_ID = "openclaw:reply_button";
export declare const SLACK_REPLY_SELECT_ACTION_ID = "openclaw:reply_select";
export type SlackBlock = Block | KnownBlock;
export declare function buildSlackInteractiveBlocks(interactive?: InteractiveReply): SlackBlock[];
