import { describe, expect, it, vi } from "vitest";
import { HookEventTracker } from "../tracker.js";

function createTracker() {
  const emitted: Array<{ event: any }> = [];
  let idCounter = 0;
  const tracker = new HookEventTracker({
    sink: { enqueue: (env: any) => emitted.push(env) } as any,
    config: {
      enabled: true, endpoint: "http://test", observeKey: "", apiKey: "k",
      tenantId: "t", agentId: "a", schemaVersion: 1, requestTimeoutMs: 5000,
      maxRetries: 2, retryBackoffMs: 250, maxQueueSize: 100,
      emitErrorEvents: false, includePrompts: false, includeToolResults: false,
    },
    logger: { warn: vi.fn(), info: vi.fn() },
    idFactory: () => `id-${++idCounter}`,
    nowMs: () => 1000000,
  });
  return { tracker, emitted };
}

describe("subagent trace merge", () => {
  it("child subagent events share parent's traceId via sessionKey detection", () => {
    const { tracker, emitted } = createTracker();

    // 1. Parent agent starts (main session)
    tracker.onSessionStart(
      { sessionId: "sess1", sessionKey: "agent:main:main" },
      { agentId: "main", sessionId: "sess1", sessionKey: "agent:main:main" }
    );

    // 2. Parent's llm_input fires — creates trace with runId as traceId
    tracker.onLlmInput(
      { runId: "parent-run-1", sessionId: "sess1", provider: "gemini", model: "gemini-2.5", prompt: "spawn", historyMessages: [], imagesCount: 0 },
      { agentId: "main", sessionKey: "agent:main:main", sessionId: "sess1", runId: "parent-run-1" }
    );

    // 3. Parent calls sessions_spawn tool
    tracker.onBeforeToolCall(
      { toolName: "sessions_spawn", params: { task: "research" }, runId: undefined },
      { agentId: "main", sessionKey: "agent:main:main", runId: undefined, toolName: "sessions_spawn" }
    );

    // 4. subagent_spawned fires (may or may not be before child's llm_input)
    tracker.onSubagentSpawned(
      { childSessionKey: "agent:main:subagent:abc123", agentId: "main", mode: "run", threadRequested: false, runId: "child-run-1" },
      { runId: undefined, childSessionKey: "agent:main:subagent:abc123", requesterSessionKey: "agent:main:main" }
    );

    // 5. Child's llm_input fires — should use PARENT's traceId
    tracker.onLlmInput(
      { runId: "child-run-1", sessionId: "child-sess", provider: "gemini", model: "gemini-2.5", prompt: "do research", historyMessages: [], imagesCount: 0 },
      { agentId: "main", sessionKey: "agent:main:subagent:abc123", sessionId: "child-sess", runId: "child-run-1" }
    );

    // Check: parent's session_start has traceId = "parent-run-1"
    const parentSession = emitted.find(e => e.event.eventType === "session_start" && e.event.traceId === "parent-run-1");
    expect(parentSession).toBeTruthy();

    // Check: child's session_start should ALSO have traceId = "parent-run-1" (NOT "child-run-1")
    const childSession = emitted.find(e =>
      e.event.eventType === "session_start" &&
      e.event.payload?.sessionKey === "agent:main:subagent:abc123"
    );
    expect(childSession).toBeTruthy();
    expect(childSession!.event.traceId).toBe("parent-run-1"); // THIS IS THE KEY ASSERTION

    // Check: child's llm_before_call also has parent's traceId
    const childLlm = emitted.find(e =>
      e.event.eventType === "llm_before_call" &&
      e.event.payload?.sessionKey === "agent:main:subagent:abc123"
    );
    expect(childLlm).toBeTruthy();
    expect(childLlm!.event.traceId).toBe("parent-run-1");
  });

  it("child subagent merges even when subagent_spawned fires AFTER child's llm_input (race)", () => {
    const { tracker, emitted } = createTracker();

    // Parent setup
    tracker.onSessionStart(
      { sessionId: "s1", sessionKey: "agent:main:main" },
      { agentId: "main", sessionId: "s1", sessionKey: "agent:main:main" }
    );
    tracker.onLlmInput(
      { runId: "parent-run", sessionId: "s1", provider: "g", model: "m", prompt: "", historyMessages: [], imagesCount: 0 },
      { agentId: "main", sessionKey: "agent:main:main", sessionId: "s1" }
    );

    // Child's llm_input fires BEFORE subagent_spawned (race condition!)
    tracker.onLlmInput(
      { runId: "child-run", sessionId: "cs", provider: "g", model: "m", prompt: "", historyMessages: [], imagesCount: 0 },
      { agentId: "main", sessionKey: "agent:main:subagent:xyz789", sessionId: "cs" }
    );

    // Child's session_start should still have parent's traceId via sessionKey detection
    const childSession = emitted.find(e =>
      e.event.eventType === "session_start" &&
      e.event.payload?.sessionKey === "agent:main:subagent:xyz789"
    );
    expect(childSession).toBeTruthy();
    expect(childSession!.event.traceId).toBe("parent-run"); // Resolved via sessionKey format
  });
});
