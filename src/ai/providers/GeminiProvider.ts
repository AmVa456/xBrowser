import type { IAIProvider } from '../IAIProvider';

export class GeminiProvider implements IAIProvider {
  public name = 'GEMINI';

  async complete(prompt: string): Promise<string> {
    // TODO: wire to real Gemini-compatible API
    return \[Gemini placeholder completion for: \...]\;
  }

  async chat(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
  ): Promise<string> {
    const last = messages[messages.length - 1];
    return \[Gemini placeholder chat response to: \...]\;
  }
}
