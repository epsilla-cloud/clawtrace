import { describe, expect, it } from "vitest";
import { encodeObserveKeyForTests } from "../observe-key.js";
import { buildUpdatedConfig, DEFAULT_INGEST_ENDPOINT, validateSetupInput } from "../setup.js";

const OBSERVE_KEY = encodeObserveKeyForTests({
  apiKey: "ct_live_fake_000000000000",
  tenantId: "6e6d1cc9-2118-4d59-86b0-21f2a5f8cc99",
  agentId: "11111111-2222-4333-8444-555555555555",
});

describe("validateSetupInput", () => {
  it("accepts valid setup values", () => {
    const errors = validateSetupInput({
      endpoint: DEFAULT_INGEST_ENDPOINT,
      observeKey: OBSERVE_KEY,
    });
    expect(errors).toEqual([]);
  });

  it("returns all validation errors for invalid values", () => {
    const errors = validateSetupInput({
      endpoint: "not-a-url",
      observeKey: "bad-key",
    });
    expect(errors).toEqual([
      "endpoint must be a valid http(s) URL",
      "observeKey is invalid",
    ]);
  });
});

describe("buildUpdatedConfig", () => {
  it("creates plugin config when missing", () => {
    const updated = buildUpdatedConfig(
      {},
      {
        endpoint: DEFAULT_INGEST_ENDPOINT,
        observeKey: OBSERVE_KEY,
      },
    );

    expect(updated.plugins).toBeDefined();
    const plugins = updated.plugins as Record<string, unknown>;
    const entries = plugins.entries as Record<string, unknown>;
    const clawtrace = entries.clawtrace as Record<string, unknown>;
    const config = clawtrace.config as Record<string, unknown>;

    expect(clawtrace.enabled).toBe(true);
    expect(config.endpoint).toBe(DEFAULT_INGEST_ENDPOINT);
    expect(config.observeKey).toBe(OBSERVE_KEY);
    expect(config.enabled).toBe(true);
  });

  it("preserves unrelated config and merges existing plugin config", () => {
    const updated = buildUpdatedConfig(
      {
        model: "gpt-5.4",
        plugins: {
          entries: {
            clawtrace: {
              config: {
                maxRetries: 9,
                apiKey: "ct_live_old",
                tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
                agentId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
              },
            },
          },
        },
      },
      {
        endpoint: DEFAULT_INGEST_ENDPOINT,
        observeKey: OBSERVE_KEY,
      },
    );

    expect(updated.model).toBe("gpt-5.4");
    const plugins = updated.plugins as Record<string, unknown>;
    const entries = plugins.entries as Record<string, unknown>;
    const clawtrace = entries.clawtrace as Record<string, unknown>;
    const config = clawtrace.config as Record<string, unknown>;
    expect(config.maxRetries).toBe(9);
    expect(config.observeKey).toBe(OBSERVE_KEY);
    expect(config.apiKey).toBeUndefined();
    expect(config.tenantId).toBeUndefined();
    expect(config.agentId).toBeUndefined();
  });
});
