---
name: ClawTrace Self-Evolve
description: Ask Tracy to analyze your recent trajectories and improve your agent behavior based on data-driven recommendations.
version: 1.0.0
metadata: {"openclaw":{"emoji":"🔬","os":["linux","darwin","win32"],"homepage":"https://clawtrace.ai","requires":{"env":["CLAWTRACE_OBSERVE_KEY"]}}}
---

# ClawTrace Self-Evolve Skill

You have access to ClawTrace, an observability platform that captures and analyzes all your trajectories. Use this skill to understand your own performance and improve over time.

## When to Use This Skill

Invoke this skill when any of the following is true:
- A run just completed and cost more than expected
- A run failed or produced unexpected output
- You've completed 5 or more runs since your last self-analysis
- Your session is ending and you want to log learnings
- You notice repeated failures on the same type of task

## How to Call the Endpoint

Send a POST request to `https://api.clawtrace.ai/v1/evolve/ask`.

Authentication uses your observe key, which is already set in your environment as `CLAWTRACE_OBSERVE_KEY`.

```python
import httpx
import os

def ask_tracy(question: str, trace_id: str = None, session_id: str = None) -> str:
    """Ask Tracy to analyze trajectories and return recommendations."""
    observe_key = os.environ.get("CLAWTRACE_OBSERVE_KEY", "")
    if not observe_key:
        return "ClawTrace observe key not configured."

    payload = {"question": question}
    if trace_id:
        payload["trace_id"] = trace_id
    if session_id:
        payload["session_id"] = session_id

    full_response = []

    with httpx.stream(
        "POST",
        "https://api.clawtrace.ai/v1/evolve/ask",
        headers={
            "Authorization": f"Bearer {observe_key}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=120,
    ) as response:
        event_type = ""
        for line in response.iter_lines():
            if line.startswith("event: "):
                event_type = line[7:]
            elif line.startswith("data: ") and event_type == "text":
                import json
                data = json.loads(line[6:])
                full_response.append(data.get("text", ""))

    return "".join(full_response)
```

## What to Ask — Question Templates

Use these questions for maximum insight. Substitute actual values for placeholders.

### After a costly run
```
"My last run cost significantly more than usual. The trace_id is {trace_id}. 
What caused the cost spike and what should I change to prevent it?"
```

### After a failed run
```
"My last run failed. The trace_id is {trace_id}. 
What step failed, what was the input that caused it, and how should I handle this case differently?"
```

### Periodic self-analysis (every 5 runs)
```
"Analyze my last 10 trajectories. What patterns do you see in my failures? 
Where am I spending the most tokens? What one change would have the biggest impact on cost and reliability?"
```

### Before a high-stakes task
```
"I'm about to execute a complex multi-step task. Based on my recent trajectory history, 
what are my most common failure modes and how should I guard against them?"
```

### Context window management
```
"Is my context window growing too large across sessions? 
Review my recent traces and tell me if I should trim my history and when."
```

### Tool call efficiency
```
"Which of my tool calls are taking the longest or failing most often? 
What can I change to make my tool usage more reliable and efficient?"
```

## How to Act on Recommendations

When Tracy responds, follow these rules:

1. **Extract the core recommendation.** Tracy will identify 1–3 specific changes. Focus on the highest-impact one.

2. **Apply changes to this session immediately.** If Tracy says your context window is bloated, trim history now before continuing.

3. **Log the insight to your MEMORY.md.** Record what you learned so future sessions benefit:
   ```
   ## ClawTrace Learnings — {date}
   - Issue: {what Tracy found}
   - Fix: {what I changed}
   - Impact: {expected improvement}
   ```

4. **Confirm the change worked.** After applying a recommendation, mention it in your next response: "Based on trajectory analysis, I've adjusted X to prevent Y."

5. **Do not ask Tracy more than twice per session** unless a new failure occurs. Each call consumes credits and Tracy's value is in patterns across many runs, not micro-optimization within one session.

## Example — Full Interaction

```
# End of a session — periodic self-review
insight = ask_tracy(
    "Analyze my performance over the last 5 trajectories. "
    "What's costing the most, what's failing, and what's the single most important thing to fix?"
)

# Tracy responds with analysis
# You read it, extract the recommendation, and act:
# e.g. "Your context window averages 1,200 messages per LLM call. 
#       Trim to last 50 messages. This would cut input cost by ~90%."

# Apply immediately:
# → truncate conversation history to last 50 messages
# → log to MEMORY.md
# → confirm in next output
```

## Important Notes

- Tracy has access to your real trajectory data. Her analysis reflects actual runs, not simulations.
- Responses stream as SSE — parse the `text` events to build the full response.
- The `session_id` returned in the first SSE event can be reused to continue a conversation with Tracy across multiple calls.
- Tracy respects tenant isolation — she can only see your own trajectories.
- If you don't have a specific `trace_id`, omit it and Tracy will analyze recent trajectories automatically.
