import { describe, expect, it } from "vitest";
import { HookEventTracker } from "../tracker.js";
import type { IngestEnvelope } from "../types.js";

const createTracker = () => {
  const emitted: IngestEnvelope[] = [];
  const ids = Array.from({ length: 200 }, (_, i) => `id-${i + 1}`);
  let now = 1_700_000_000_000;
  const tracker = new HookEventTracker({
    sink: {
      enqueue(envelope: IngestEnvelope) {
        emitted.push(envelope);
      },
    } as never,
    config: {
      enabled: true,
      endpoint: "https://ingest.example.com/v1/traces/events",
      observeKey: "test-observe-key",
      apiKey: "ct_live_prod_xxx",
      tenantId: "6e6d1cc9-2118-4d59-86b0-21f2a5f8cc99",
      agentId: "11111111-2222-4333-8444-555555555555",
      schemaVersion: 1,
      requestTimeoutMs: 5000,
      maxRetries: 2,
      retryBackoffMs: 100,
      maxQueueSize: 1000,
      emitErrorEvents: true,
      includePrompts: true,
      includeToolResults: true,
    },
    logger: { warn: () => undefined },
    idFactory: () => ids.shift() ?? `id-fallback-${Math.random()}`,
    nowMs: () => ++now,
  });
  return { tracker, emitted };
};

describe("HookEventTracker", () => {
  it("emits lifecycle events with stable parent relationships", () => {
    const { tracker, emitted } = createTracker();

    tracker.onSessionStart(
      { sessionId: "sess-1", sessionKey: "agent:main:main" },
      { sessionId: "sess-1", sessionKey: "agent:main:main", agentId: "main" },
    );
    tracker.onLlmInput(
      {
        runId: "run-1",
        sessionId: "sess-1",
        provider: "gemini",
        model: "gemini-3.1-pro",
        prompt: "hello",
        historyMessages: [],
        imagesCount: 0,
      },
      { sessionId: "sess-1", sessionKey: "agent:main:main", agentId: "main" },
    );
    tracker.onBeforeToolCall(
      {
        runId: "run-1",
        toolName: "exec",
        params: { command: "echo hi" },
        toolCallId: "tool-1",
      },
      { runId: "run-1", sessionKey: "agent:main:main", toolName: "exec", toolCallId: "tool-1", agentId: "main" },
    );
    tracker.onAfterToolCall(
      {
        runId: "run-1",
        toolName: "exec",
        params: { command: "echo hi" },
        toolCallId: "tool-1",
        result: { stdout: "hi" },
      },
      { runId: "run-1", sessionKey: "agent:main:main", toolName: "exec", toolCallId: "tool-1", agentId: "main" },
    );
    tracker.onLlmOutput(
      {
        runId: "run-1",
        sessionId: "sess-1",
        provider: "gemini",
        model: "gemini-3.1-pro",
        assistantTexts: ["done"],
        usage: { input: 10, output: 20, total: 30 },
      },
      { sessionId: "sess-1", sessionKey: "agent:main:main", agentId: "main" },
    );
    tracker.onSessionEnd(
      {
        sessionId: "sess-1",
        sessionKey: "agent:main:main",
        messageCount: 4,
      },
      { sessionId: "sess-1", sessionKey: "agent:main:main", agentId: "main" },
    );

    const eventTypes = emitted.map((x) => x.event.eventType);
    expect(eventTypes).toEqual([
      "session_start",
      "llm_before_call",
      "tool_before_call",
      "tool_after_call",
      "llm_after_call",
      "session_end",
    ]);

    const llmBefore = emitted[1];
    const toolBefore = emitted[2];
    expect(toolBefore.event.parentSpanId).toBe(llmBefore.event.spanId);
    expect(emitted[3].event.spanId).toBe(toolBefore.event.spanId);
    expect(emitted[4].event.spanId).toBe(llmBefore.event.spanId);
  });

  it("emits anonymous tool calls in correct before/after order", () => {
    const { tracker, emitted } = createTracker();

    tracker.onSessionStart({ sessionId: "sess-a" }, { sessionId: "sess-a", sessionKey: "agent:a:main" });

    tracker.onBeforeToolCall(
      { runId: "run-a", toolName: "exec", params: { command: "one" } },
      { runId: "run-a", sessionKey: "agent:a:main", toolName: "exec" },
    );
    tracker.onBeforeToolCall(
      { runId: "run-a", toolName: "exec", params: { command: "two" } },
      { runId: "run-a", sessionKey: "agent:a:main", toolName: "exec" },
    );
    tracker.onAfterToolCall(
      { runId: "run-a", toolName: "exec", params: { command: "one" } },
      { runId: "run-a", sessionKey: "agent:a:main", toolName: "exec" },
    );
    tracker.onAfterToolCall(
      { runId: "run-a", toolName: "exec", params: { command: "two" } },
      { runId: "run-a", sessionKey: "agent:a:main", toolName: "exec" },
    );

    const beforeCalls = emitted.filter((x) => x.event.eventType === "tool_before_call");
    const afterCalls = emitted.filter((x) => x.event.eventType === "tool_after_call");
    expect(beforeCalls).toHaveLength(2);
    expect(afterCalls).toHaveLength(2);
    expect(afterCalls[0].event.spanId).toBe(beforeCalls[0].event.spanId);
    expect(afterCalls[1].event.spanId).toBe(beforeCalls[1].event.spanId);
  });

  it("matches anonymous tool calls when after_tool_call ctx has no session (OpenClaw gap)", () => {
    // Reproduces the production gap: OpenClaw omits sessionKey/sessionId from
    // the after_tool_call ctx, causing a queue-key mismatch.
    const { tracker, emitted } = createTracker();

    tracker.onSessionStart({ sessionId: "sess-b" }, { sessionId: "sess-b", sessionKey: "agent:main:telegram:direct:123" });

    // before: ctx has full session
    tracker.onBeforeToolCall(
      { toolName: "exec", params: { command: "ls" } },
      { sessionKey: "agent:main:telegram:direct:123", toolName: "exec" },
    );
    tracker.onBeforeToolCall(
      { toolName: "exec", params: { command: "pwd" } },
      { sessionKey: "agent:main:telegram:direct:123", toolName: "exec" },
    );

    // after: ctx has NO session (as seen in production data)
    tracker.onAfterToolCall(
      { toolName: "exec", params: { command: "ls" }, result: { stdout: "/" } },
      { toolName: "exec" },
    );
    tracker.onAfterToolCall(
      { toolName: "exec", params: { command: "pwd" }, result: { stdout: "/home" } },
      { toolName: "exec" },
    );

    const beforeCalls = emitted.filter((x) => x.event.eventType === "tool_before_call");
    const afterCalls = emitted.filter((x) => x.event.eventType === "tool_after_call");
    expect(beforeCalls).toHaveLength(2);
    expect(afterCalls).toHaveLength(2);
    // Spans must match (FIFO order preserved)
    expect(afterCalls[0].event.spanId).toBe(beforeCalls[0].event.spanId);
    expect(afterCalls[1].event.spanId).toBe(beforeCalls[1].event.spanId);
    // sessionKey recovered from before — not "unknown"
    expect(afterCalls[0].event.payload.sessionKey).toBe("agent:main:telegram:direct:123");
    expect(afterCalls[1].event.payload.sessionKey).toBe("agent:main:telegram:direct:123");
  });

  it("does not bleed session recovery across different sessions", () => {
    // Two sessions make the same anonymous tool call concurrently.
    // After-calls with no ctx session must each match their own before-call.
    const { tracker, emitted } = createTracker();

    tracker.onSessionStart({ sessionId: "s1" }, { sessionId: "s1", sessionKey: "agent:main:s1" });
    tracker.onSessionStart({ sessionId: "s2" }, { sessionId: "s2", sessionKey: "agent:main:s2" });

    tracker.onBeforeToolCall(
      { toolName: "write", params: { file: "a.txt" } },
      { sessionKey: "agent:main:s1", toolName: "write" },
    );
    tracker.onBeforeToolCall(
      { toolName: "write", params: { file: "b.txt" } },
      { sessionKey: "agent:main:s2", toolName: "write" },
    );

    tracker.onAfterToolCall({ toolName: "write", params: { file: "a.txt" } }, { toolName: "write" });
    tracker.onAfterToolCall({ toolName: "write", params: { file: "b.txt" } }, { toolName: "write" });

    const afterCalls = emitted.filter((x) => x.event.eventType === "tool_after_call");
    expect(afterCalls).toHaveLength(2);
    // Both after-calls should have been matched and have non-unknown session keys
    expect(afterCalls[0].event.payload.sessionKey).toMatch(/^agent:main:s[12]$/);
    expect(afterCalls[1].event.payload.sessionKey).toMatch(/^agent:main:s[12]$/);
  });
});
