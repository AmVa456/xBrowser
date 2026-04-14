import type { IAIProvider } from '../IAIProvider';

export class OpenAIProvider implements IAIProvider {
  public name = 'OPENAI';

  async complete(prompt: string): Promise<string> {
    // TODO: wire to real OpenAI-compatible API
    return \[OpenAI placeholder completion for: \...]\;
  }

  async chat(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
  ): Promise<string> {
    const last = messages[messages.length - 1];
    return \[OpenAI placeholder chat response to: \...]\;
  }
}
