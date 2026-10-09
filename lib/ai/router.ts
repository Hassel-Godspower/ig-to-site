/**
 * Gòke AI Provider Router
 *
 * Tries providers in order until one succeeds.
 * Default order: Groq → Gemini → Cerebras → OpenRouter
 * Override with AI_PROVIDER_ORDER=groq,gemini,openrouter
 *
 * Only configured providers (env key present) are attempted.
 */

import type { AIProvider, ChatRequest, ChatResult } from "./types";
import { ProviderError } from "./types";
import {
  createGroqProvider,
  createGeminiProvider,
  createCerebrasProvider,
  createOpenRouterProvider,
} from "./providers";

const registry: Record<string, () => AIProvider> = {
  groq: createGroqProvider,
  gemini: createGeminiProvider,
  cerebras: createCerebrasProvider,
  openrouter: createOpenRouterProvider,
};

function parseOrder(): string[] {
  const raw = process.env.AI_PROVIDER_ORDER?.trim();
  if (raw) {
    return raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }
  return ["groq", "gemini", "cerebras", "openrouter"];
}

export function listConfiguredProviders(): string[] {
  return parseOrder().filter((id) => {
    const factory = registry[id];
    if (!factory) return false;
    try {
      return factory().isConfigured();
    } catch {
      return false;
    }
  });
}

/**
 * Run chat completion with automatic failover.
 * Throws only when every configured provider fails.
 */
export async function chatWithFallback(
  req: ChatRequest
): Promise<ChatResult> {
  const order = parseOrder();
  const errors: string[] = [];
  let attempted = 0;

  for (const id of order) {
    const factory = registry[id];
    if (!factory) continue;

    let provider: AIProvider;
    try {
      provider = factory();
    } catch {
      continue;
    }

    if (!provider.isConfigured()) continue;

    attempted++;
    try {
      const result = await provider.complete(req);
      if (process.env.AI_ROUTER_LOG === "1") {
        console.info(
          `[goke-ai] success provider=${result.provider} model=${result.model}`
        );
      }
      return result;
    } catch (err) {
      const pe =
        err instanceof ProviderError
          ? err
          : new ProviderError(
              err instanceof Error ? err.message : String(err),
              id,
              undefined,
              true
            );

      errors.push(`${pe.provider}: ${pe.message}`);
      console.warn(`[goke-ai] ${pe.provider} failed — ${pe.message.slice(0, 200)}`);

      // Non-retryable (e.g. bad request from our prompt) — still try next;
      // only hard-stop if nothing left.
      continue;
    }
  }

  if (attempted === 0) {
    throw new Error(
      "No AI providers configured. Set GROQ_API_KEY and/or GEMINI_API_KEY and/or OPENROUTER_API_KEY and/or CEREBRAS_API_KEY."
    );
  }

  throw new Error(
    `All AI providers failed (${attempted} tried). ${errors.join(" | ").slice(0, 800)}`
  );
}
