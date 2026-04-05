import { messagingApi } from "@line/bot-sdk";
import { datetimePickerAction, messageAction, postbackAction, uriAction } from "./actions.js";
type RichMenuRequest = messagingApi.RichMenuRequest;
type RichMenuResponse = messagingApi.RichMenuResponse;
type RichMenuArea = messagingApi.RichMenuArea;
type Action = messagingApi.Action;
export interface RichMenuSize {
    width: 2500;
    height: 1686 | 843;
}
export interface RichMenuAreaRequest {
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    action: Action;
}
export interface CreateRichMenuParams {
    size: RichMenuSize;
    selected?: boolean;
    name: string;
    chatBarText: string;
    areas: RichMenuAreaRequest[];
}
interface RichMenuOpts {
    channelAccessToken?: string;
    accountId?: string;
    verbose?: boolean;
}
export declare function createRichMenu(menu: CreateRichMenuParams, opts?: RichMenuOpts): Promise<string>;
export declare function uploadRichMenuImage(richMenuId: string, imagePath: string, opts?: RichMenuOpts): Promise<void>;
export declare function setDefaultRichMenu(richMenuId: string, opts?: RichMenuOpts): Promise<void>;
export declare function cancelDefaultRichMenu(opts?: RichMenuOpts): Promise<void>;
export declare function getDefaultRichMenuId(opts?: RichMenuOpts): Promise<string | null>;
export declare function linkRichMenuToUser(userId: string, richMenuId: string, opts?: RichMenuOpts): Promise<void>;
export declare function linkRichMenuToUsers(userIds: string[], richMenuId: string, opts?: RichMenuOpts): Promise<void>;
export declare function unlinkRichMenuFromUser(userId: string, opts?: RichMenuOpts): Promise<void>;
export declare function unlinkRichMenuFromUsers(userIds: string[], opts?: RichMenuOpts): Promise<void>;
export declare function getRichMenuIdOfUser(userId: string, opts?: RichMenuOpts): Promise<string | null>;
export declare function getRichMenuList(opts?: RichMenuOpts): Promise<RichMenuResponse[]>;
export declare function getRichMenu(richMenuId: string, opts?: RichMenuOpts): Promise<RichMenuResponse | null>;
export declare function deleteRichMenu(richMenuId: string, opts?: RichMenuOpts): Promise<void>;
export declare function createRichMenuAlias(richMenuId: string, aliasId: string, opts?: RichMenuOpts): Promise<void>;
export declare function deleteRichMenuAlias(aliasId: string, opts?: RichMenuOpts): Promise<void>;
export declare function createGridLayout(height: 1686 | 843, actions: [Action, Action, Action, Action, Action, Action]): RichMenuAreaRequest[];
export { datetimePickerAction, messageAction, postbackAction, uriAction };
export declare function createDefaultMenuConfig(): CreateRichMenuParams;
export type { RichMenuRequest, RichMenuResponse, RichMenuArea, Action };
