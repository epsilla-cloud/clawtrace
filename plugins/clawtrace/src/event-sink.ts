import type { ClawTracePluginConfig, IngestEnvelope, PluginLogger } from "./types.js";

type QueueItem = {
  envelope: IngestEnvelope;
  enqueuedAtMs: number;
};

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const safeErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export class IngestEventSink {
  private readonly queue: QueueItem[] = [];
  private draining = false;
  private stopped = false;

  constructor(
    private readonly config: ClawTracePluginConfig,
    private readonly logger: PluginLogger,
  ) {}

  enqueue(envelope: IngestEnvelope): void {
    if (this.stopped) return;

    if (this.queue.length >= this.config.maxQueueSize) {
      const dropped = this.queue.shift();
      this.logger.warn?.(
        `[clawtrace] Queue full (${this.config.maxQueueSize}); dropping oldest event ${dropped?.envelope.event.eventId ?? "unknown"}.`,
      );
    }

    this.queue.push({ envelope, enqueuedAtMs: Date.now() });
    if (!this.draining) {
      void this.drain();
    }
  }

  stop(): void {
    this.stopped = true;
  }

  async flush(timeoutMs = 10000): Promise<void> {
    const startedAt = Date.now();
    while ((this.draining || this.queue.length > 0) && Date.now() - startedAt < timeoutMs) {
      await sleep(25);
    }
    if (this.queue.length > 0) {
      this.logger.warn?.(`[clawtrace] Flush timed out with ${this.queue.length} queued events still pending.`);
    }
  }

  private async drain(): Promise<void> {
    this.draining = true;
    try {
      while (!this.stopped && this.queue.length > 0) {
        const item = this.queue.shift();
        if (!item) continue;
        await this.sendWithRetry(item.envelope, item.enqueuedAtMs);
      }
    } finally {
      this.draining = false;
    }
  }

  private async sendWithRetry(envelope: IngestEnvelope, enqueuedAtMs: number): Promise<void> {
    const maxAttempts = this.config.maxRetries + 1;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.requestTimeoutMs);
      try {
        const response = await fetch(this.config.endpoint, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${this.config.apiKey}`,
            "x-clawtrace-event-id": envelope.event.eventId,
            "x-clawtrace-tenant-id": this.config.tenantId,
            "x-clawtrace-agent-id": this.config.agentId,
          },
          body: JSON.stringify(envelope),
          signal: controller.signal,
        });

        if (response.ok) {
          if (attempt > 1) {
            this.logger.info?.(
              `[clawtrace] Recovered send after retry: eventId=${envelope.event.eventId} attempts=${attempt}`,
            );
          }
          return;
        }

        const body = await response.text().catch(() => "");
        const retryable = response.status === 429 || response.status >= 500;
        if (!retryable || attempt >= maxAttempts) {
          this.logger.error?.(
            `[clawtrace] Failed to send event eventId=${envelope.event.eventId} status=${response.status} body=${body.slice(0, 500)}`,
          );
          return;
        }
      } catch (error) {
        const message = safeErrorMessage(error);
        if (attempt >= maxAttempts) {
          this.logger.error?.(
            `[clawtrace] Failed to send event eventId=${envelope.event.eventId} error=${message}`,
          );
          return;
        }
        this.logger.warn?.(
          `[clawtrace] Send attempt failed eventId=${envelope.event.eventId} attempt=${attempt}/${maxAttempts} error=${message}`,
        );
      } finally {
        clearTimeout(timeout);
      }

      const retryDelay = this.config.retryBackoffMs * 2 ** (attempt - 1);
      const jitter = Math.floor(Math.random() * 75);
      await sleep(retryDelay + jitter);
    }

    const queuedMs = Date.now() - enqueuedAtMs;
    this.logger.warn?.(
      `[clawtrace] Event dropped after retries: eventId=${envelope.event.eventId} queuedMs=${queuedMs}`,
    );
  }
}
