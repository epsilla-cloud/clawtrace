import { describe, expect, it } from "vitest";
import { buildUpdatedConfig, DEFAULT_INGEST_ENDPOINT, validateSetupInput } from "../setup.js";

describe("validateSetupInput", () => {
  it("accepts valid setup values", () => {
    const errors = validateSetupInput({
      endpoint: DEFAULT_INGEST_ENDPOINT,
      apiKey: "ct_live_prod_xxx",
      agentId: "8f8c8e1d-6a2f-4a7f-b1bd-0e4e6f8a2f19",
    });
    expect(errors).toEqual([]);
  });

  it("returns all validation errors for invalid values", () => {
    const errors = validateSetupInput({
      endpoint: "not-a-url",
      apiKey: " ",
      agentId: "not-a-uuid",
    });
    expect(errors).toEqual([
      "endpoint must be a valid http(s) URL",
      "apiKey cannot be empty",
      "agentId must be a UUID",
    ]);
  });
});

describe("buildUpdatedConfig", () => {
  it("creates plugin config when missing", () => {
    const updated = buildUpdatedConfig(
      {},
      {
        endpoint: DEFAULT_INGEST_ENDPOINT,
        apiKey: "ct_live_prod_xxx",
        agentId: "8f8c8e1d-6a2f-4a7f-b1bd-0e4e6f8a2f19",
      },
    );

    expect(updated.plugins).toBeDefined();
    const plugins = updated.plugins as Record<string, unknown>;
    const entries = plugins.entries as Record<string, unknown>;
    const clawtrace = entries.clawtrace as Record<string, unknown>;
    const config = clawtrace.config as Record<string, unknown>;

    expect(clawtrace.enabled).toBe(true);
    expect(config.endpoint).toBe(DEFAULT_INGEST_ENDPOINT);
    expect(config.apiKey).toBe("ct_live_prod_xxx");
    expect(config.agentId).toBe("8f8c8e1d-6a2f-4a7f-b1bd-0e4e6f8a2f19");
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
              },
            },
          },
        },
      },
      {
        endpoint: DEFAULT_INGEST_ENDPOINT,
        apiKey: "ct_live_prod_yyy",
        agentId: "8f8c8e1d-6a2f-4a7f-b1bd-0e4e6f8a2f19",
      },
    );

    expect(updated.model).toBe("gpt-5.4");
    const plugins = updated.plugins as Record<string, unknown>;
    const entries = plugins.entries as Record<string, unknown>;
    const clawtrace = entries.clawtrace as Record<string, unknown>;
    const config = clawtrace.config as Record<string, unknown>;
    expect(config.maxRetries).toBe(9);
    expect(config.apiKey).toBe("ct_live_prod_yyy");
  });
});
