import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { resolvePluginConfig } from "./src/config.js";
import { IngestEventSink } from "./src/event-sink.js";
import { HookEventTracker } from "./src/tracker.js";

const plugin = definePluginEntry({
  id: "clawtrace",
  name: "ClawTrace",
  description: "Stream OpenClaw runtime telemetry into ClawTrace ingest.",
  register(api) {
    const config = resolvePluginConfig(api.pluginConfig, process.env, api.logger);
    if (!config.enabled) {
      api.logger.warn?.("[clawtrace] Plugin loaded but disabled (missing or invalid runtime config).");
      return;
    }

    const sink = new IngestEventSink(config, api.logger);
    const tracker = new HookEventTracker({ sink, config, logger: api.logger });

    api.registerService({
      id: "clawtrace-sink-flush",
      start() {
        api.logger.info?.(
          `[clawtrace] enabled agentId=${config.agentId} endpoint=${config.endpoint} queue=${config.maxQueueSize}`,
        );
      },
      async stop() {
        await sink.flush();
        sink.stop();
        api.logger.info?.("[clawtrace] sink stopped.");
      },
    });

    api.on("session_start", (event, ctx) => {
      tracker.onSessionStart(event, ctx);
    });
    api.on("session_end", (event, ctx) => {
      tracker.onSessionEnd(event, ctx);
    });
    api.on("llm_input", (event, ctx) => {
      tracker.onLlmInput(event, ctx);
    });
    api.on("llm_output", (event, ctx) => {
      tracker.onLlmOutput(event, ctx);
    });
    api.on("before_tool_call", (event, ctx) => {
      tracker.onBeforeToolCall(event, ctx);
    });
    api.on("after_tool_call", (event, ctx) => {
      tracker.onAfterToolCall(event, ctx);
    });
    api.on("subagent_spawning", (event, ctx) => {
      tracker.onSubagentSpawning(event, ctx);
    });
    api.on("subagent_ended", (event, ctx) => {
      tracker.onSubagentEnded(event, ctx);
    });
  },
});

export default plugin;
