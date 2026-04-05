import { type GatewayRequestHandlers } from "../core-api.js";
export declare function handleBrowserGatewayRequest({ params, respond, context, }: Parameters<GatewayRequestHandlers["browser.request"]>[0]): Promise<void>;
export declare const browserHandlers: GatewayRequestHandlers;
