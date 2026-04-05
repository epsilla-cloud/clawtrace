import type { OutboundSendDeps } from "../infra/outbound/deliver.js";
import { type CliOutboundSendSource } from "./outbound-send-mapping.js";
export type CliDeps = CliOutboundSendSource;
export declare function createOutboundSendDeps(deps: CliDeps): OutboundSendDeps;
