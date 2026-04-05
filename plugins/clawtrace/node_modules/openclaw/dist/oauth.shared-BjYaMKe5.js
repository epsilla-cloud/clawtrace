//#region extensions/google/oauth.shared.ts
const CLIENT_ID_KEYS = ["OPENCLAW_GEMINI_OAUTH_CLIENT_ID", "GEMINI_CLI_OAUTH_CLIENT_ID"];
const CLIENT_SECRET_KEYS = ["OPENCLAW_GEMINI_OAUTH_CLIENT_SECRET", "GEMINI_CLI_OAUTH_CLIENT_SECRET"];
const REDIRECT_URI = "http://localhost:8085/oauth2callback";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";
const CODE_ASSIST_ENDPOINT_PROD = "https://cloudcode-pa.googleapis.com";
const CODE_ASSIST_ENDPOINT_DAILY = "https://daily-cloudcode-pa.sandbox.googleapis.com";
const CODE_ASSIST_ENDPOINT_AUTOPUSH = "https://autopush-cloudcode-pa.sandbox.googleapis.com";
const LOAD_CODE_ASSIST_ENDPOINTS = [
	CODE_ASSIST_ENDPOINT_PROD,
	CODE_ASSIST_ENDPOINT_DAILY,
	CODE_ASSIST_ENDPOINT_AUTOPUSH
];
const DEFAULT_FETCH_TIMEOUT_MS = 1e4;
const SCOPES = [
	"https://www.googleapis.com/auth/cloud-platform",
	"https://www.googleapis.com/auth/userinfo.email",
	"https://www.googleapis.com/auth/userinfo.profile"
];
const TIER_FREE = "free-tier";
const TIER_LEGACY = "legacy-tier";
const TIER_STANDARD = "standard-tier";
//#endregion
export { CODE_ASSIST_ENDPOINT_DAILY as a, LOAD_CODE_ASSIST_ENDPOINTS as c, TIER_FREE as d, TIER_LEGACY as f, USERINFO_URL as h, CODE_ASSIST_ENDPOINT_AUTOPUSH as i, REDIRECT_URI as l, TOKEN_URL as m, CLIENT_ID_KEYS as n, CODE_ASSIST_ENDPOINT_PROD as o, TIER_STANDARD as p, CLIENT_SECRET_KEYS as r, DEFAULT_FETCH_TIMEOUT_MS as s, AUTH_URL as t, SCOPES as u };
