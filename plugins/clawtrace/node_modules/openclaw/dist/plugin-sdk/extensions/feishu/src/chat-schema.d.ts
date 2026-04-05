import { type Static } from "@sinclair/typebox";
export declare const FeishuChatSchema: import("@sinclair/typebox").TObject<{
    action: import("@sinclair/typebox").TUnsafe<"info" | "members" | "member_info">;
    chat_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    member_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    page_size: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    page_token: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    member_id_type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnsafe<"user_id" | "open_id" | "union_id">>;
}>;
export type FeishuChatParams = Static<typeof FeishuChatSchema>;
