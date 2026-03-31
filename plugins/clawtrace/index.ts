import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { resolvePluginConfig } from "./src/config.js";
import { IngestEventSink } from "./src/event-sink.js";
import { runSetup } from "./src/setup.js";
import { HookEventTracker } from "./src/tracker.js";

const plugin = {
  id: "clawtrace",
  name: "ClawTrace",
  description: "Stream OpenClaw runtime telemetry into ClawTrace ingest.",
  register(api: OpenClawPluginApi) {
    api.registerCli(
      ({ program }) => {
        const clawtrace = program.command("clawtrace").description("ClawTrace plugin commands.");

        clawtrace
          .command("setup")
          .description("Interactive setup for ClawTrace ingest endpoint and Observe Key.")
          .option("--endpoint <url>", "Ingest endpoint URL.")
          .option("--observe-key <key>", "ClawTrace Observe Key from the ClawTrace portal.")
          .option("--yes", "Skip prompts and require values from flags or existing config/env.")
          .action(async (options) => {
            await runSetup(api, {
              endpoint: options.endpoint as string | undefined,
              observeKey: options.observeKey as string | undefined,
              yes: options.yes as boolean | undefined,
            });
          });
      },
      {
        commands: ["clawtrace"],
        descriptors: [
          {
            name: "clawtrace setup",
            description: "Configure ClawTrace ingest settings interactively.",
            hasSubcommands: false,
          },
        ],
      },
    );

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
    api.on("subagent_spawned", (event, ctx) => {
      tracker.onSubagentSpawned(event, ctx);
    });
    api.on("subagent_ended", (event, ctx) => {
      tracker.onSubagentEnded(event, ctx);
    });
  },
};

export default plugin;
