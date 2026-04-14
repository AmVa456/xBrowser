import type { IAIProvider } from '../IAIProvider';

export class CopilotProvider implements IAIProvider {
  public name = 'COPILOT';

  async complete(prompt: string): Promise<string> {
    // TODO: wire to real Copilot-style API
    return \[Copilot placeholder completion for: \...]\;
  }

  async chat(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
  ): Promise<string> {
    const last = messages[messages.length - 1];
    return \[Copilot placeholder chat response to: \...]\;
  }
}
