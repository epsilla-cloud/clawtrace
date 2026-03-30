import { isUuid } from "./id.js";

const normalizeBase64 = (value: string): string => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/").replace(/\s+/g, "");
  const padding = normalized.length % 4;
  if (padding === 0) return normalized;
  return `${normalized}${"=".repeat(4 - padding)}`;
};

const decodeBase64 = (value: string): string => {
  const normalized = normalizeBase64(value);
  return Buffer.from(normalized, "base64").toString("utf-8");
};

const encodeBase64 = (value: string): string => Buffer.from(value, "utf-8").toString("base64");

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

export type DecodedObserveKey = {
  apiKey: string;
  tenantId: string;
  agentId: string;
};

export const decodeObserveKey = (value: string): DecodedObserveKey => {
  const raw = value.trim();
  if (!raw) {
    throw new Error("Observe key is empty.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(decodeBase64(raw));
  } catch {
    throw new Error("Observe key is invalid.");
  }

  if (!isObjectRecord(parsed)) {
    throw new Error("Observe key is invalid.");
  }

  const apiKey = asString(parsed.apiKey);
  const tenantId = asString(parsed.tenantId);
  const agentId = asString(parsed.agentId);

  if (!apiKey || !apiKey.startsWith("ct_live_")) {
    throw new Error("Observe key is invalid.");
  }
  if (!tenantId || !isUuid(tenantId)) {
    throw new Error("Observe key is invalid.");
  }
  if (!agentId || !isUuid(agentId)) {
    throw new Error("Observe key is invalid.");
  }

  return { apiKey, tenantId, agentId };
};

export const encodeObserveKeyForTests = (value: DecodedObserveKey): string => encodeBase64(JSON.stringify(value));
