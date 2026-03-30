import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { decodeObserveKey } from "./observe-key.js";

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const isValidEndpoint = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

export const DEFAULT_INGEST_ENDPOINT = "https://ingest.clawtrace.ai/v1/traces/events";

export type ClawTraceSetupInput = {
  endpoint: string;
  observeKey: string;
};

export const validateSetupInput = (inputValue: ClawTraceSetupInput): string[] => {
  const errors: string[] = [];
  if (!isValidEndpoint(inputValue.endpoint)) {
    errors.push("endpoint must be a valid http(s) URL");
  }
  try {
    decodeObserveKey(inputValue.observeKey);
  } catch {
    errors.push("observeKey is invalid");
  }
  return errors;
};

export const buildUpdatedConfig = (
  runtimeConfig: unknown,
  setupInput: ClawTraceSetupInput,
): Record<string, unknown> => {
  const nextConfig = isObjectRecord(runtimeConfig) ? structuredClone(runtimeConfig) : {};

  if (!isObjectRecord(nextConfig.plugins)) {
    nextConfig.plugins = {};
  }
  const plugins = nextConfig.plugins as Record<string, unknown>;

  if (!isObjectRecord(plugins.entries)) {
    plugins.entries = {};
  }
  const entries = plugins.entries as Record<string, unknown>;

  const priorEntry = isObjectRecord(entries.clawtrace) ? entries.clawtrace : {};
  const priorPluginConfig = isObjectRecord(priorEntry.config) ? structuredClone(priorEntry.config) : {};
  delete priorPluginConfig.apiKey;
  delete priorPluginConfig.tenantId;
  delete priorPluginConfig.agentId;

  entries.clawtrace = {
    ...priorEntry,
    enabled: true,
    config: {
      ...priorPluginConfig,
      enabled: true,
      endpoint: setupInput.endpoint,
      observeKey: setupInput.observeKey,
    },
  };

  return nextConfig;
};

const promptValue = async (
  label: string,
  options: { defaultValue?: string; required?: boolean; maskDefault?: boolean } = {},
): Promise<string> => {
  const required = options.required ?? true;
  const rl = createInterface({ input, output });
  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const suffix = options.defaultValue
        ? options.maskDefault
          ? " [configured]"
          : ` [${options.defaultValue}]`
        : "";
      const answer = (await rl.question(`${label}${suffix}: `)).trim();
      if (answer) return answer;
      if (options.defaultValue) return options.defaultValue;
      if (!required) return "";
      output.write(`${label} is required.\n`);
    }
  } finally {
    rl.close();
  }
};

const resolveCurrentConfigValues = (
  pluginConfig: Record<string, unknown> | undefined,
  env: NodeJS.ProcessEnv,
): ClawTraceSetupInput => ({
  endpoint:
    asString(pluginConfig?.endpoint) ??
    asString(env.CLAWTRACE_ENDPOINT) ??
    DEFAULT_INGEST_ENDPOINT,
  observeKey:
    asString(pluginConfig?.observeKey) ??
    asString(env.CLAWTRACE_OBSERVE_KEY) ??
    "",
});

export type ClawTraceSetupOptions = {
  endpoint?: string;
  observeKey?: string;
  yes?: boolean;
};

export const runSetup = async (
  api: OpenClawPluginApi,
  options: ClawTraceSetupOptions,
): Promise<void> => {
  const base = resolveCurrentConfigValues(api.pluginConfig, process.env);
  const interactive = input.isTTY && output.isTTY;

  const endpoint = asString(options.endpoint) ?? base.endpoint;
  let observeKey = asString(options.observeKey) ?? base.observeKey;

  if (!options.yes && interactive) {
    api.logger.info?.("[clawtrace] Starting interactive setup.");
    const promptedEndpoint = await promptValue("ClawTrace ingest endpoint", {
      defaultValue: endpoint,
      required: true,
    });
    const promptedObserveKey = await promptValue("ClawTrace Observe Key", {
      defaultValue: observeKey || undefined,
      required: true,
      maskDefault: Boolean(observeKey),
    });
    observeKey = promptedObserveKey;

    const nextInput: ClawTraceSetupInput = {
      endpoint: promptedEndpoint,
      observeKey,
    };
    const errors = validateSetupInput(nextInput);
    if (errors.length > 0) {
      throw new Error(`Invalid setup values: ${errors.join("; ")}`);
    }

    const loadedConfig = api.runtime.config.loadConfig();
    const nextConfig = buildUpdatedConfig(loadedConfig, nextInput);
    await api.runtime.config.writeConfigFile(nextConfig);
    api.logger.info?.(`[clawtrace] Setup saved. endpoint=${nextInput.endpoint}`);
    return;
  }

  const nextInput: ClawTraceSetupInput = {
    endpoint,
    observeKey,
  };
  const errors = validateSetupInput(nextInput);
  if (errors.length > 0) {
    throw new Error(
      `[clawtrace] Invalid setup values (${errors.join(
        "; ",
      )}). Pass --endpoint/--observe-key or run interactively.`,
    );
  }

  const loadedConfig = api.runtime.config.loadConfig();
  const nextConfig = buildUpdatedConfig(loadedConfig, nextInput);
  await api.runtime.config.writeConfigFile(nextConfig);
  api.logger.info?.(`[clawtrace] Setup saved. endpoint=${nextInput.endpoint}`);
};
