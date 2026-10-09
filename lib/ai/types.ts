/** Shared chat types for Gòke AI provider router */

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  /** Preferred max output tokens */
  maxTokens?: number;
  temperature?: number;
}

export interface ChatResult {
  content: string;
  provider: string;
  model: string;
}

export interface AIProvider {
  name: string;
  /** True if env key is present */
  isConfigured(): boolean;
  complete(req: ChatRequest): Promise<ChatResult>;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    public provider: string,
    public status?: number,
    public retryable: boolean = true
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

/** HTTP statuses that should trigger fallback to next provider */
export function isRetryableStatus(status: number): boolean {
  return (
    status === 429 ||
    status === 408 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

export function isRetryableMessage(text: string): boolean {
  const t = text.toLowerCase();
  return (
    t.includes("rate limit") ||
    t.includes("quota") ||
    t.includes("exhausted") ||
    t.includes("capacity") ||
    t.includes("overloaded") ||
    t.includes("too many requests") ||
    t.includes("resource_exhausted") ||
    t.includes("tokens per day") ||
    t.includes("tpm") ||
    t.includes("timeout")
  );
}
