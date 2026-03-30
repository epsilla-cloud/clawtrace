import { describe, expect, it } from "vitest";
import { encodeObserveKeyForTests } from "../observe-key.js";
import { resolvePluginConfig } from "../config.js";

const logger = {
  warn: () => undefined,
};

describe("resolvePluginConfig", () => {
  it("disables plugin when required values are missing", () => {
    const resolved = resolvePluginConfig({}, {}, logger);
    expect(resolved.enabled).toBe(false);
  });

  it("reads pluginConfig observeKey and resolves runtime auth values", () => {
    const observeKey = encodeObserveKeyForTests({
      apiKey: "ct_live_prod_xxx",
      tenantId: "6e6d1cc9-2118-4d59-86b0-21f2a5f8cc99",
      agentId: "11111111-2222-4333-8444-555555555555",
    });

    const resolved = resolvePluginConfig(
      {
        endpoint: "https://ingest.example.com/v1/traces/events",
        observeKey,
      },
      {},
      logger,
    );
    expect(resolved.enabled).toBe(true);
    expect(resolved.tenantId).toBe("6e6d1cc9-2118-4d59-86b0-21f2a5f8cc99");
    expect(resolved.agentId).toBe("11111111-2222-4333-8444-555555555555");
    expect(resolved.maxRetries).toBe(2);
  });

  it("supports env-based config", () => {
    const observeKey = encodeObserveKeyForTests({
      apiKey: "ct_live_prod_xxx",
      tenantId: "6e6d1cc9-2118-4d59-86b0-21f2a5f8cc99",
      agentId: "11111111-2222-4333-8444-555555555555",
    });

    const resolved = resolvePluginConfig(
      {},
      {
        CLAWTRACE_ENDPOINT: "https://ingest.example.com/v1/traces/events",
        CLAWTRACE_OBSERVE_KEY: observeKey,
        CLAWTRACE_MAX_RETRIES: "4",
      },
      logger,
    );
    expect(resolved.enabled).toBe(true);
    expect(resolved.maxRetries).toBe(4);
  });
});
