/**
 * AI providers for Gòke site generation.
 * All run server-side only — never expose keys to the browser.
 */

import type { AIProvider, ChatRequest, ChatResult } from "./types";
import { ProviderError, isRetryableStatus, isRetryableMessage } from "./types";

async function readError(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return res.statusText || String(res.status);
  }
}

/** OpenAI-compatible chat completions (Groq, OpenRouter, Cerebras, etc.) */
async function openAiCompatible(
  name: string,
  endpoint: string,
  apiKey: string,
  model: string,
  req: ChatRequest,
  extraHeaders?: Record<string, string>
): Promise<ChatResult> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      max_tokens: req.maxTokens ?? 16000,
      temperature: req.temperature ?? 0.4,
      messages: req.messages,
    }),
  });

  if (!res.ok) {
    const errText = await readError(res);
    throw new ProviderError(
      `${name} failed (${res.status}): ${errText.slice(0, 500)}`,
      name,
      res.status,
      isRetryableStatus(res.status) || isRetryableMessage(errText)
    );
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content ?? "";
  if (!content.trim()) {
    throw new ProviderError(`${name} returned empty content`, name, 200, true);
  }
  return { content, provider: name, model };
}

export function createGroqProvider(): AIProvider {
  const name = "groq";
  return {
    name,
    isConfigured: () => Boolean(process.env.GROQ_API_KEY?.trim()),
    async complete(req) {
      const key = process.env.GROQ_API_KEY?.trim();
      if (!key) throw new ProviderError("GROQ_API_KEY missing", name, undefined, true);
      const model =
        process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";
      return openAiCompatible(
        name,
        "https://api.groq.com/openai/v1/chat/completions",
        key,
        model,
        req
      );
    },
  };
}

export function createOpenRouterProvider(): AIProvider {
  const name = "openrouter";
  return {
    name,
    isConfigured: () => Boolean(process.env.OPENROUTER_API_KEY?.trim()),
    async complete(req) {
      const key = process.env.OPENROUTER_API_KEY?.trim();
      if (!key) throw new ProviderError("OPENROUTER_API_KEY missing", name, undefined, true);
      // Free-tier friendly default; override with OPENROUTER_MODEL
      const model =
        process.env.OPENROUTER_MODEL?.trim() ||
        "google/gemini-2.0-flash-exp:free";
      return openAiCompatible(
        name,
        "https://openrouter.ai/api/v1/chat/completions",
        key,
        model,
        req,
        {
          "HTTP-Referer": process.env.BASE_URL || "https://highvaluesolutions.net",
          "X-Title": "goke-site-generator",
        }
      );
    },
  };
}

export function createCerebrasProvider(): AIProvider {
  const name = "cerebras";
  return {
    name,
    isConfigured: () => Boolean(process.env.CEREBRAS_API_KEY?.trim()),
    async complete(req) {
      const key = process.env.CEREBRAS_API_KEY?.trim();
      if (!key) throw new ProviderError("CEREBRAS_API_KEY missing", name, undefined, true);
      const model = process.env.CEREBRAS_MODEL?.trim() || "llama-3.3-70b";
      return openAiCompatible(
        name,
        "https://api.cerebras.ai/v1/chat/completions",
        key,
        model,
        req
      );
    },
  };
}

/**
 * Google Gemini (Generative Language API) — free tier friendly.
 * Uses GEMINI_API_KEY from Google AI Studio.
 */
export function createGeminiProvider(): AIProvider {
  const name = "gemini";
  return {
    name,
    isConfigured: () => Boolean(process.env.GEMINI_API_KEY?.trim()),
    async complete(req) {
      const key = process.env.GEMINI_API_KEY?.trim();
      if (!key) throw new ProviderError("GEMINI_API_KEY missing", name, undefined, true);

      const model =
        process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

      // Fold system + user into Gemini contents
      const systemParts = req.messages
        .filter((m) => m.role === "system")
        .map((m) => m.content)
        .join("\n\n");
      const userParts = req.messages
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join("\n\n");

      const body: Record<string, unknown> = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: systemParts
                  ? `${systemParts}\n\n---\n\n${userParts}`
                  : userParts,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: req.temperature ?? 0.4,
          maxOutputTokens: req.maxTokens ?? 16000,
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await readError(res);
        throw new ProviderError(
          `${name} failed (${res.status}): ${errText.slice(0, 500)}`,
          name,
          res.status,
          isRetryableStatus(res.status) || isRetryableMessage(errText)
        );
      }

      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
        error?: { message?: string };
      };

      if (data.error?.message) {
        throw new ProviderError(
          `${name}: ${data.error.message}`,
          name,
          undefined,
          isRetryableMessage(data.error.message)
        );
      }

      const content =
        data.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || "")
          .join("") || "";

      if (!content.trim()) {
        throw new ProviderError(`${name} returned empty content`, name, 200, true);
      }
      return { content, provider: name, model };
    },
  };
}
