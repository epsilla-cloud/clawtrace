import { describe, expect, it } from "vitest";
import { decodeObserveKey, encodeObserveKeyForTests } from "../observe-key.js";

describe("observe key", () => {
  it("decodes a valid observe key payload", () => {
    const key = encodeObserveKeyForTests({
      apiKey: "ct_live_fake_000000000000",
      tenantId: "6e6d1cc9-2118-4d59-86b0-21f2a5f8cc99",
      agentId: "11111111-2222-4333-8444-555555555555",
    });

    const decoded = decodeObserveKey(key);
    expect(decoded.apiKey).toBe("ct_live_fake_000000000000");
    expect(decoded.tenantId).toBe("6e6d1cc9-2118-4d59-86b0-21f2a5f8cc99");
    expect(decoded.agentId).toBe("11111111-2222-4333-8444-555555555555");
  });

  it("rejects malformed keys", () => {
    expect(() => decodeObserveKey("not-base64")).toThrow("Observe key is invalid.");
  });
});
