/**
 * Shared ARIA role classification sets used by both the Playwright and Chrome MCP
 * snapshot paths. Keep these in sync — divergence causes the two drivers to produce
 * different snapshot output for the same page.
 */
/** Roles that represent user-interactive elements and always get a ref. */
export declare const INTERACTIVE_ROLES: Set<string>;
/** Roles that carry meaningful content and get a ref when named. */
export declare const CONTENT_ROLES: Set<string>;
/** Structural/container roles — typically skipped in compact mode. */
export declare const STRUCTURAL_ROLES: Set<string>;
