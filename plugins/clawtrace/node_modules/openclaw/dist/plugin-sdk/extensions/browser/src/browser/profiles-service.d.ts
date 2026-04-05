import type { BrowserRouteContext, ProfileStatus } from "./server-context.js";
export type CreateProfileParams = {
    name: string;
    color?: string;
    cdpUrl?: string;
    userDataDir?: string;
    driver?: "openclaw" | "existing-session";
};
export type CreateProfileResult = {
    ok: true;
    profile: string;
    transport: "cdp" | "chrome-mcp";
    cdpPort: number | null;
    cdpUrl: string | null;
    userDataDir: string | null;
    color: string;
    isRemote: boolean;
};
export type DeleteProfileResult = {
    ok: true;
    profile: string;
    deleted: boolean;
};
export declare function createBrowserProfilesService(ctx: BrowserRouteContext): {
    listProfiles: () => Promise<ProfileStatus[]>;
    createProfile: (params: CreateProfileParams) => Promise<CreateProfileResult>;
    deleteProfile: (nameRaw: string) => Promise<DeleteProfileResult>;
};
