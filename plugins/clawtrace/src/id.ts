import crypto from "node:crypto";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const randomId = (): string => crypto.randomUUID();

export const isUuid = (value: string): boolean => UUID_RE.test(value);
