import OpenAI from 'openai';

interface OpenAIConfig {
  apiKey?: string; // Made optional since we'll use the Netlify function
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class OpenAIService {
  private client: OpenAI | null;
  private config: OpenAIConfig;
  private useServerProxy: boolean;

  constructor(config: OpenAIConfig) {
    this.config = {
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      maxTokens: 2000,
      ...config
    };

    // Determine if we should use the server proxy (Netlify function)
    // We'll use the proxy if no API key is provided or if we're in production
    this.useServerProxy = !config.apiKey || process.env.NODE_ENV === 'production';

    // Only create the client if we're not using the server proxy
    if (!this.useServerProxy && config.apiKey) {
      this.client = new OpenAI({
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true // Note: In production, calls should go through a backend
      });
    } else {
      this.client = null;
    }
  }

  async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
    temperature?: number,
    modelOverride?: string
  ): Promise<string> {
    try {
      const model = modelOverride || this.config.model!;
      const temp = temperature ?? this.config.temperature!;
      const maxTokens = this.config.maxTokens;

      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ];

      if (this.useServerProxy) {
        // Use the Netlify function
        const response = await fetch('/.netlify/functions/openaiProxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: 'chat/completions',
            payload: {
              model,
              temperature: temp,
              max_tokens: maxTokens,
              messages
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('OpenAI API Error via proxy:', errorData);
          throw new Error(`Failed to generate completion: ${errorData.error}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
      } else if (this.client) {
        // Use the OpenAI client directly
        const response = await this.client.chat.completions.create({
          model,
          temperature: temp,
          max_tokens: maxTokens,
          messages
        });

        return response.choices[0]?.message?.content || '';
      } else {
        throw new Error('OpenAI client not initialized and proxy not enabled');
      }
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
      const model = options.model;
      const messages = options.messages;
      const temperature = options.temperature ?? this.config.temperature!;
      const maxTokens = options.max_tokens ?? this.config.maxTokens;

      if (this.useServerProxy) {
        // Use the Netlify function
        const response = await fetch('/.netlify/functions/openaiProxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: 'chat/completions',
            payload: {
              model,
              temperature,
              max_tokens: maxTokens,
              messages
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('OpenAI API Error via proxy:', errorData);
          throw new Error(`Failed to generate chat completion: ${errorData.error}`);
        }

        return await response.json();
      } else if (this.client) {
        // Use the OpenAI client directly
        return await this.client.chat.completions.create({
          model,
          messages,
          temperature,
          max_tokens: maxTokens
        });
      } else {
        throw new Error('OpenAI client not initialized and proxy not enabled');
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate chat completion');
    }
  }
}