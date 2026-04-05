import type * as Lark from "@larksuiteoapi/node-sdk";
import type { OpenClawPluginApi } from "../runtime-api.js";
export declare function getChatInfo(client: Lark.Client, chatId: string): Promise<{
    chat_id: string;
    name: string | undefined;
    description: string | undefined;
    owner_id: string | undefined;
    tenant_key: string | undefined;
    user_count: string | undefined;
    chat_mode: string | undefined;
    chat_type: string | undefined;
    join_message_visibility: string | undefined;
    leave_message_visibility: string | undefined;
    membership_approval: string | undefined;
    moderation_permission: string | undefined;
    avatar: string | undefined;
}>;
export declare function getChatMembers(client: Lark.Client, chatId: string, pageSize?: number, pageToken?: string, memberIdType?: "open_id" | "user_id" | "union_id"): Promise<{
    chat_id: string;
    has_more: boolean | undefined;
    page_token: string | undefined;
    members: {
        member_id: string | undefined;
        name: string | undefined;
        tenant_key: string | undefined;
        member_id_type: string | undefined;
    }[];
}>;
export declare function getFeishuMemberInfo(client: Lark.Client, memberId: string, memberIdType?: "open_id" | "user_id" | "union_id"): Promise<{
    member_id: string;
    member_id_type: "user_id" | "open_id" | "union_id";
    open_id: string | undefined;
    user_id: string | undefined;
    union_id: string | undefined;
    name: string | undefined;
    en_name: string | undefined;
    nickname: string | undefined;
    email: string | undefined;
    enterprise_email: string | undefined;
    mobile: string | undefined;
    mobile_visible: boolean | undefined;
    status: {
        is_frozen?: boolean | undefined;
        is_resigned?: boolean | undefined;
        is_activated?: boolean | undefined;
        is_exited?: boolean | undefined;
        is_unjoin?: boolean | undefined;
    } | undefined;
    avatar: {
        avatar_72?: string | undefined;
        avatar_240?: string | undefined;
        avatar_640?: string | undefined;
        avatar_origin?: string | undefined;
    } | undefined;
    department_ids: string[] | undefined;
    department_path: {
        department_id?: string | undefined;
        department_name?: {
            name?: string | undefined;
            i18n_name?: {
                zh_cn?: string | undefined;
                ja_jp?: string | undefined;
                en_us?: string | undefined;
            } | undefined;
        } | undefined;
        department_path?: {
            department_ids?: string[] | undefined;
            department_path_name?: {
                name?: string | undefined;
                i18n_name?: {
                    zh_cn?: string | undefined;
                    ja_jp?: string | undefined;
                    en_us?: string | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    }[] | undefined;
    leader_user_id: string | undefined;
    city: string | undefined;
    country: string | undefined;
    work_station: string | undefined;
    join_time: number | undefined;
    is_tenant_manager: boolean | undefined;
    employee_no: string | undefined;
    employee_type: number | undefined;
    description: string | undefined;
    job_title: string | undefined;
    geo: string | undefined;
}>;
export declare function registerFeishuChatTools(api: OpenClawPluginApi): void;
