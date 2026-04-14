import type { IAIProvider } from './IAIProvider';
import { CopilotProvider } from './providers/CopilotProvider';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { GeminiProvider } from './providers/GeminiProvider';

export type ProviderKey = 'COPILOT' | 'OPENAI' | 'GEMINI';

function getEnv(key: string): string | undefined {
  return (import.meta as any).env?.[key] ?? (globalThis as any)?.process?.env?.[key];
}

export function getActiveProvider(): IAIProvider {
  const flag = (getEnv('XBROWSER_AI_PROVIDER') ?? 'OPENAI').toUpperCase() as ProviderKey;

  switch (flag) {
    case 'COPILOT':
      return new CopilotProvider();
    case 'GEMINI':
      return new GeminiProvider();
    case 'OPENAI':
    default:
      return new OpenAIProvider();
  }
}
