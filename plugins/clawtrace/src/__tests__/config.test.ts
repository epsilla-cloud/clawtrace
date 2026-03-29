import { describe, expect, it } from "vitest";
import { resolvePluginConfig } from "../config.js";

const logger = {
  warn: () => undefined,
};

describe("resolvePluginConfig", () => {
  it("disables plugin when required values are missing", () => {
    const resolved = resolvePluginConfig({}, {}, logger);
    expect(resolved.enabled).toBe(false);
  });

  it("reads pluginConfig directly and validates UUID", () => {
    const resolved = resolvePluginConfig(
      {
        endpoint: "https://ingest.example.com/v1/traces/events",
        apiKey: "ct_live_prod_xxx",
        agentId: "8f8c8e1d-6a2f-4a7f-b1bd-0e4e6f8a2f19",
      },
      {},
      logger,
    );
    expect(resolved.enabled).toBe(true);
    expect(resolved.maxRetries).toBe(2);
  });

  it("supports env-based config", () => {
    const resolved = resolvePluginConfig(
      {},
      {
        CLAWTRACE_ENDPOINT: "https://ingest.example.com/v1/traces/events",
        CLAWTRACE_API_KEY: "ct_live_prod_xxx",
        CLAWTRACE_AGENT_ID: "8f8c8e1d-6a2f-4a7f-b1bd-0e4e6f8a2f19",
        CLAWTRACE_MAX_RETRIES: "4",
      },
      logger,
    );
    expect(resolved.enabled).toBe(true);
    expect(resolved.maxRetries).toBe(4);
  });
});
