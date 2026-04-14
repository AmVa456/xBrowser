export interface IAIProvider {
  name: string;
  complete(prompt: string, options?: Record<string, unknown>): Promise<string>;
  chat(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
    options?: Record<string, unknown>
  ): Promise<string>;
}
