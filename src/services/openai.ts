import OpenAI from 'openai';

interface OpenAIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class OpenAIService {
  private client: OpenAI;
  private config: OpenAIConfig;

  constructor(config: OpenAIConfig) {
    this.config = {
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      maxTokens: 2000,
      ...config
    };

    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      dangerouslyAllowBrowser: true // Note: In production, calls should go through a backend
    });
  }

  async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
    temperature?: number,
    modelOverride?: string
  ): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: modelOverride || this.config.model!,
        temperature: temperature ?? this.config.temperature!,
        max_tokens: this.config.maxTokens,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate completion');
    }
  }

  async generateStructuredOutput<T>(
    systemPrompt: string,
    userPrompt: string,
    temperature?: number,
    modelOverride?: string
  ): Promise<T> {
    try {
      const completion = await this.generateCompletion(
        systemPrompt + "\nOutput must be valid JSON.",
        userPrompt + "\nProvide your response as a JSON object.",
        temperature,
        modelOverride
      );

      return JSON.parse(completion) as T;
    } catch (error) {
      console.error('Failed to generate structured output:', error);
      throw new Error('Failed to generate structured output');
    }
  }

  async chatCompletion(options: {
    model: string;
    messages: Array<{role: 'system' | 'user' | 'assistant'; content: string}>;
    temperature?: number;
    max_tokens?: number;
  }) {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model,
        messages: options.messages,
        temperature: options.temperature ?? this.config.temperature!,
        max_tokens: options.max_tokens ?? this.config.maxTokens
      });

      return response;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate chat completion');
    }
  }
}