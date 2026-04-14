export type ProviderName = "default" | "anthropic";

export interface ProviderResponse {
  text: string;
}

const ANTHROPIC_ENDPOINT =
  import.meta.env.VITE_ANTHROPIC_ENDPOINT || "http://localhost:8787/api/anthropic";

async function callAnthropic(prompt: string): Promise<ProviderResponse> {
  const res = await fetch(ANTHROPIC_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Anthropic error: ${res.status}`);
  }

  const data = (await res.json()) as { text: string };
  return { text: data.text };
}

async function callDefault(prompt: string): Promise<ProviderResponse> {
  return {
    text: `Mock response (default provider):\n\n${prompt}`,
  };
}

export const providers: Record<ProviderName, (prompt: string) => Promise<ProviderResponse>> =
  {
    anthropic: callAnthropic,
    default: callDefault,
  };
