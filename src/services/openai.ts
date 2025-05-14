import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';
import { generateMockResponse } from './mockOpenAI';

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
      model: 'gpt-4.1-2025-04-14',
      temperature: 0.7,
      maxTokens: 2000,
      ...config
    };

    // Log configuration for debugging (without API key)
    console.log('OpenAI Service Configuration:', {
      model: this.config.model,
      hasApiKey: !!this.config.apiKey,
      environment: process.env.NODE_ENV
    });

    // Determine if we should use the server proxy (Netlify function)
    // We'll use the proxy if no API key is provided or if we're in production
    this.useServerProxy = !config.apiKey || process.env.NODE_ENV === 'production';

    // Only create the client if we're not using the server proxy
    if (!this.useServerProxy && config.apiKey) {
      try {
        this.client = new OpenAI({
          apiKey: config.apiKey,
          dangerouslyAllowBrowser: true // Note: In production, calls should go through a backend
        });
        console.log('OpenAI client initialized successfully');
      } catch (error) {
        console.error('Failed to initialize OpenAI client:', error);
        this.client = null;
        // If client initialization fails, fall back to proxy
        this.useServerProxy = true;
      }
    } else {
      this.client = null;
      console.log('Using server proxy for OpenAI API calls');
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

      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ];

      // First try with the configured approach (proxy or direct)
      if (this.useServerProxy) {
        try {
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

          // If the response is OK, process it
          if (response.ok) {
            const data = await response.json();
            return data.choices[0]?.message?.content || '';
          }

          // If we're in development and got a 404, the function might not be available
          // Let's try direct API access as fallback
          if (response.status === 404 && process.env.NODE_ENV === 'development') {
            console.warn('Netlify function not available in development, trying direct API access');

            // Check if we have an API key for direct access
            if (this.config.apiKey) {
              // Create a temporary client if we don't have one
              const tempClient = this.client || new OpenAI({
                apiKey: this.config.apiKey,
                dangerouslyAllowBrowser: true
              });

              const directResponse = await tempClient.chat.completions.create({
                model,
                temperature: temp,
                max_tokens: maxTokens,
                messages
              });

              return directResponse.choices[0]?.message?.content || '';
            }
          }

          // If we got here, the proxy failed and we couldn't use direct access
          // In development, use mock responses as a last resort
          if (process.env.NODE_ENV === 'development') {
            console.warn('Using mock OpenAI response as fallback');
            const mockResponse = generateMockResponse(
              [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              {
                model: model,
                temperature: temp,
                max_tokens: maxTokens
              }
            );
            return mockResponse.choices[0]?.message?.content || '';
          }

          const errorText = await response.text();
          console.error('OpenAI API Error via proxy:', response.status, errorText);
          throw new Error(`Failed to generate completion: ${response.status} ${errorText}`);
        } catch (proxyError) {
          // If proxy fails and we have an API key, try direct access as fallback
          if (this.config.apiKey) {
            console.warn('Proxy failed, falling back to direct API access', proxyError);

            // Create a temporary client if we don't have one
            const tempClient = this.client || new OpenAI({
              apiKey: this.config.apiKey,
              dangerouslyAllowBrowser: true
            });

            const directResponse = await tempClient.chat.completions.create({
              model,
              temperature: temp,
              max_tokens: maxTokens,
              messages
            });

            return directResponse.choices[0]?.message?.content || '';
          }

          // If we don't have an API key but we're in development, use mock
          if (process.env.NODE_ENV === 'development') {
            console.warn('Using mock OpenAI response as fallback after proxy error');
            const mockResponse = generateMockResponse(
              [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              {
                model,
                temperature: temp,
                max_tokens: maxTokens
              }
            );
            return mockResponse.choices[0]?.message?.content || '';
          }

          // Otherwise rethrow the error
          throw proxyError;
        }
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
        // If we're in development, use mock as a last resort
        if (process.env.NODE_ENV === 'development') {
          console.warn('Using mock OpenAI response as fallback (no client or proxy)');
          const mockResponse = generateMockResponse(
            [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            {
              model: model,
              temperature: temp,
              max_tokens: maxTokens
            }
          );
          return mockResponse.choices[0]?.message?.content || '';
        }

        throw new Error('OpenAI client not initialized and proxy not enabled');
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);

      // In development, use mock as a last resort even if we hit an unexpected error
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock OpenAI response after catching an error');
        try {
          // Get the model, temperature and maxTokens from the outer scope
          const mockModel = modelOverride || this.config.model!;
          const mockTemp = temperature ?? this.config.temperature!;
          const mockMaxTokens = this.config.maxTokens;

          const mockResponse = generateMockResponse(
            [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            {
              model: mockModel,
              temperature: mockTemp,
              max_tokens: mockMaxTokens
            }
          );
          return mockResponse.choices[0]?.message?.content || '';
        } catch (mockError) {
          console.error('Failed to generate mock response:', mockError);
        }
      }

      throw new Error(`Failed to generate completion: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async generateStructuredOutput<T>(
    systemPrompt: string,
    userPrompt: string,
    temperature?: number,
    modelOverride?: string
  ): Promise<T> {
    try {
      // Add stronger JSON formatting instructions
      const enhancedSystemPrompt = systemPrompt +
        "\nOutput must be valid JSON. Do not include any explanatory text, markdown formatting, or code blocks. " +
        "The entire response should be a single, parseable JSON object.";

      const enhancedUserPrompt = userPrompt +
        "\nProvide your response as a valid JSON object. Do not include any explanatory text before or after the JSON.";

      const completion = await this.generateCompletion(
        enhancedSystemPrompt,
        enhancedUserPrompt,
        temperature,
        modelOverride
      );

      // Try to extract JSON if there's any surrounding text
      let jsonString = completion;

      // Look for JSON object pattern (anything between { and })
      const jsonMatch = completion.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }

      try {
        return JSON.parse(jsonString) as T;
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Raw completion:', completion);
        console.error('Attempted to parse:', jsonString);

        // Try one more time with a more aggressive approach
        // Look for the first { and last }
        const firstBrace = completion.indexOf('{');
        const lastBrace = completion.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          const extractedJson = completion.substring(firstBrace, lastBrace + 1);
          console.log('Attempting to parse extracted JSON:', extractedJson);
          return JSON.parse(extractedJson) as T;
        }

        throw parseError;
      }
    } catch (error) {
      console.error('Failed to generate structured output:', error);

      // In development, try to return a mock structured response
      if (process.env.NODE_ENV === 'development') {
        console.warn('Attempting to provide mock structured output after error');

        // For pain parsing, return a structured mock response
        if (systemPrompt.includes('painstorming analysis')) {
          try {
            return {
              buyerSegmentPains: {
                "Solopreneurs": [
                  {
                    "description": "Struggling to manage all aspects of business alone",
                    "type": "functional",
                    "isFire": true
                  },
                  {
                    "description": "Feeling overwhelmed by too many responsibilities",
                    "type": "emotional",
                    "isFire": true
                  }
                ],
                "Small Business Owners": [
                  {
                    "description": "Difficulty finding reliable team members",
                    "type": "functional",
                    "isFire": true
                  }
                ]
              },
              overlappingPains: [
                {
                  "description": "Not enough time for strategic planning",
                  "type": "functional",
                  "isFire": true
                }
              ]
            } as unknown as T;
          } catch (mockError) {
            console.error('Failed to generate mock structured output:', mockError);
          }
        }
      }

      throw new Error(`Failed to generate structured output: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async chatCompletion(options: {
    model: string;
    messages: ChatCompletionMessageParam[];
    temperature?: number;
    max_tokens?: number;
  }) {
    try {
      const model = options.model;
      const messages = options.messages;
      const temperature = options.temperature ?? this.config.temperature!;
      const maxTokens = options.max_tokens ?? this.config.maxTokens;

      if (this.useServerProxy) {
        try {
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

          // If the response is OK, process it
          if (response.ok) {
            return await response.json();
          }

          // If we're in development and got a 404, the function might not be available
          // Let's try direct API access as fallback
          if (response.status === 404 && process.env.NODE_ENV === 'development') {
            console.warn('Netlify function not available in development, trying direct API access');

            // Check if we have an API key for direct access
            if (this.config.apiKey) {
              // Create a temporary client if we don't have one
              const tempClient = this.client || new OpenAI({
                apiKey: this.config.apiKey,
                dangerouslyAllowBrowser: true
              });

              return await tempClient.chat.completions.create({
                model,
                messages,
                temperature,
                max_tokens: maxTokens
              });
            }
          }

          // If we got here, the proxy failed and we couldn't use direct access
          // In development, use mock responses as a last resort
          if (process.env.NODE_ENV === 'development') {
            console.warn('Using mock OpenAI response as fallback');
            return generateMockResponse(messages, {
              model: model,
              temperature: temperature,
              max_tokens: maxTokens
            });
          }

          const errorText = await response.text();
          console.error('OpenAI API Error via proxy:', response.status, errorText);
          throw new Error(`Failed to generate chat completion: ${response.status} ${errorText}`);
        } catch (proxyError) {
          // If proxy fails and we have an API key, try direct access as fallback
          if (this.config.apiKey) {
            console.warn('Proxy failed, falling back to direct API access', proxyError);

            // Create a temporary client if we don't have one
            const tempClient = this.client || new OpenAI({
              apiKey: this.config.apiKey,
              dangerouslyAllowBrowser: true
            });

            return await tempClient.chat.completions.create({
              model,
              messages,
              temperature,
              max_tokens: maxTokens
            });
          }

          // If we don't have an API key but we're in development, use mock
          if (process.env.NODE_ENV === 'development') {
            console.warn('Using mock OpenAI response as fallback after proxy error');
            return generateMockResponse(messages, {
              model,
              temperature,
              max_tokens: maxTokens
            });
          }

          // Otherwise rethrow the error
          throw proxyError;
        }
      } else if (this.client) {
        // Use the OpenAI client directly
        return await this.client.chat.completions.create({
          model,
          messages,
          temperature,
          max_tokens: maxTokens
        });
      } else {
        // If we're in development, use mock as a last resort
        if (process.env.NODE_ENV === 'development') {
          console.warn('Using mock OpenAI response as fallback (no client or proxy)');
          return generateMockResponse(messages, {
            model: model,
            temperature: temperature,
            max_tokens: maxTokens
          });
        }

        throw new Error('OpenAI client not initialized and proxy not enabled');
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);

      // In development, use mock as a last resort even if we hit an unexpected error
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock OpenAI response after catching an error');
        try {
          // Get the messages, model, temperature and maxTokens from the outer scope
          const mockMessages = options.messages;
          const mockModel = options.model;
          const mockTemp = options.temperature ?? this.config.temperature!;
          const mockMaxTokens = options.max_tokens ?? this.config.maxTokens;

          return generateMockResponse(mockMessages, {
            model: mockModel,
            temperature: mockTemp,
            max_tokens: mockMaxTokens
          });
        } catch (mockError) {
          console.error('Failed to generate mock response:', mockError);
        }
      }

      throw new Error(`Failed to generate chat completion: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}